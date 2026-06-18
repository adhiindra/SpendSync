"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { CreateTransactionInput, UpdateTransactionInput } from "./types"

export async function getTransactions(isFamily: boolean = false) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  if (isFamily) {
    const member = await prisma.familyMember.findFirst({ where: { userId: session.user.id } })
    if (!member) return []
    return await prisma.transaction.findMany({
      where: { familyId: member.familyId },
      orderBy: { date: "desc" },
      include: { user: { select: { id: true, name: true, image: true, email: true } } }
    })
  }

  return await prisma.transaction.findMany({
    where: { userId: session.user.id, familyId: null },
    orderBy: { date: "desc" },
  })
}

export async function createTransaction(data: CreateTransactionInput, isFamily: boolean = false) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  let familyId = null
  if (isFamily) {
    const member = await prisma.familyMember.findFirst({ where: { userId: session.user.id } })
    if (!member || member.access === "VIEW_ONLY") throw new Error("Cannot add family transactions")
    familyId = member.familyId
  }

  const transaction = await prisma.transaction.create({
    data: {
      ...data,
      userId: session.user.id,
      familyId,
    },
  })

  revalidatePath(isFamily ? "/family/transactions" : "/transactions")
  return transaction
}

export async function updateTransaction(data: UpdateTransactionInput, isFamily: boolean = false) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const { id, ...updateData } = data

  if (isFamily) {
    const member = await prisma.familyMember.findFirst({ where: { userId: session.user.id } })
    if (!member || member.access === "VIEW_ONLY") throw new Error("Cannot edit family transactions")
    const transaction = await prisma.transaction.update({
      where: { id, familyId: member.familyId },
      data: updateData,
    })
    revalidatePath("/family/transactions")
    return transaction
  }

  const transaction = await prisma.transaction.update({
    where: { id, userId: session.user.id, familyId: null },
    data: updateData,
  })

  revalidatePath("/transactions")
  return transaction
}

export async function deleteTransaction(id: string, isFamily: boolean = false) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  if (isFamily) {
    const member = await prisma.familyMember.findFirst({ where: { userId: session.user.id } })
    if (!member || member.access === "VIEW_ONLY") throw new Error("Cannot delete family transactions")
    await prisma.transaction.delete({
      where: { id, familyId: member.familyId },
    })
    revalidatePath("/family/transactions")
    return
  }

  await prisma.transaction.delete({
    where: { id, userId: session.user.id, familyId: null },
  })

  revalidatePath("/transactions")
}
