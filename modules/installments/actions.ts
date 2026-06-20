"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { CreateInstallmentInput } from "./types"
import { addMonths } from "date-fns"

export async function getInstallments() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  return prisma.installment.findMany({
    where: { userId: session.user.id },
    include: {
      payments: {
        orderBy: { dueDate: "asc" }
      }
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getInstallment(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  return prisma.installment.findFirst({
    where: { id, userId: session.user.id },
    include: {
      payments: {
        orderBy: { dueDate: "asc" }
      }
    }
  })
}

export async function createInstallment(data: CreateInstallmentInput) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const monthlyPayment = data.totalAmount / data.durationMonths

  const installment = await prisma.installment.create({
    data: {
      id: data.id,
      userId: session.user.id,
      name: data.name,
      category: data.category || "Other",
      totalAmount: data.totalAmount,
      durationMonths: data.durationMonths,
      monthlyPayment,
      startDate: data.startDate,
      notes: data.notes,
      payments: {
        create: Array.from({ length: data.durationMonths }).map((_, index) => ({
          amount: monthlyPayment,
          dueDate: addMonths(new Date(data.startDate), index),
        }))
      }
    }
  })

  revalidatePath("/installments")
  return installment
}

export async function togglePaymentStatus(paymentId: string, isPaid: boolean) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  // First verify the payment belongs to the user
  const payment = await prisma.installmentPayment.findUnique({
    where: { id: paymentId },
    include: { installment: true }
  })

  if (!payment || payment.installment.userId !== session.user.id) {
    throw new Error("Not found or unauthorized")
  }

  await prisma.installmentPayment.update({
    where: { id: paymentId },
    data: {
      isPaid,
      paidDate: isPaid ? new Date() : null
    }
  })

  // Check if all payments are complete
  const allPayments = await prisma.installmentPayment.findMany({
    where: { installmentId: payment.installmentId }
  })

  const allPaid = allPayments.every(p => p.isPaid)
  const currentStatus = payment.installment.status

  if (allPaid && currentStatus !== "COMPLETED") {
    await prisma.installment.update({
      where: { id: payment.installmentId },
      data: { status: "COMPLETED" }
    })
  } else if (!allPaid && currentStatus === "COMPLETED") {
    await prisma.installment.update({
      where: { id: payment.installmentId },
      data: { status: "ACTIVE" }
    })
  }

  revalidatePath("/installments")
  revalidatePath(`/installments/${payment.installmentId}`)
}

export async function updatePaymentAmount(paymentId: string, amount: number) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const payment = await prisma.installmentPayment.findUnique({
    where: { id: paymentId },
    include: { installment: true }
  })

  if (!payment || payment.installment.userId !== session.user.id) {
    throw new Error("Not found or unauthorized")
  }

  // Update target payment
  await prisma.installmentPayment.update({
    where: { id: paymentId },
    data: { amount }
  })

  // Recalculate remaining payments
  const allPayments = await prisma.installmentPayment.findMany({
    where: { installmentId: payment.installmentId },
    orderBy: { dueDate: "desc" }
  })

  const currentSum = allPayments.reduce((sum, p) => sum + p.amount, 0)
  let difference = payment.installment.totalAmount - currentSum

  if (difference !== 0) {
    const updates: Promise<any>[] = []
    
    for (const p of allPayments) {
      if (difference === 0) break
      if (p.id === paymentId || p.isPaid) continue

      if (difference > 0) {
        // Underpaid: Add missing amount to the latest available unpaid month
        p.amount += difference
        difference = 0
        updates.push(
          prisma.installmentPayment.update({ where: { id: p.id }, data: { amount: p.amount } })
        )
      } else if (difference < 0) {
        // Overpaid: Waterfall subtract from latest months
        if (p.amount > 0) {
          const reduceBy = Math.min(p.amount, Math.abs(difference))
          p.amount -= reduceBy
          difference += reduceBy
          updates.push(
            prisma.installmentPayment.update({ where: { id: p.id }, data: { amount: p.amount } })
          )
        }
      }
    }
    
    if (updates.length > 0) {
      await Promise.all(updates)
    }
  }

  revalidatePath("/installments")
  revalidatePath(`/installments/${payment.installmentId}`)
}

export async function deleteInstallment(installmentId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const installment = await prisma.installment.findUnique({
    where: { id: installmentId }
  })

  if (!installment || installment.userId !== session.user.id) {
    throw new Error("Not found or unauthorized")
  }

  await prisma.installment.delete({
    where: { id: installmentId }
  })

  revalidatePath("/installments")
}
