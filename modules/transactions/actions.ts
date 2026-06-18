"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { CreateTransactionInput, UpdateTransactionInput } from "./types"

export async function getTransactions() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  return await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
  })
}

export async function createTransaction(data: CreateTransactionInput) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const transaction = await prisma.transaction.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  })

  revalidatePath("/transactions")
  return transaction
}

export async function updateTransaction(data: UpdateTransactionInput) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const { id, ...updateData } = data

  const transaction = await prisma.transaction.update({
    where: { id, userId: session.user.id },
    data: updateData,
  })

  revalidatePath("/transactions")
  return transaction
}

export async function deleteTransaction(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.transaction.delete({
    where: { id, userId: session.user.id },
  })

  revalidatePath("/transactions")
}
