"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { CategoryBreakdown, MonthlySummary, MonthlyTrend } from "./types"
import { TransactionWithCategory } from "@/modules/transactions/types"

export async function getMonthlyTransactions(year: number, month: number): Promise<TransactionWithCategory[]> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 1)

  return await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    include: {
      category: true,
    },
    orderBy: { date: "desc" },
  })
}

export async function getMonthlySummary(year: number, month: number): Promise<MonthlySummary> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 1)

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
  })

  let totalIncome = 0
  let totalExpense = 0

  transactions.forEach((tx) => {
    if (tx.type === "INCOME") {
      totalIncome += tx.amount
    } else {
      totalExpense += tx.amount
    }
  })

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
  }
}

export async function getCategoryBreakdown(year: number, month: number, type: "INCOME" | "EXPENSE"): Promise<CategoryBreakdown[]> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 1)

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      type,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    include: {
      category: true,
    },
  })

  const breakdownMap = new Map<string, CategoryBreakdown>()

  transactions.forEach((tx) => {
    const current = breakdownMap.get(tx.categoryId)
    if (current) {
      current.totalAmount += tx.amount
    } else {
      breakdownMap.set(tx.categoryId, {
        category: tx.category,
        totalAmount: tx.amount,
      })
    }
  })

  return Array.from(breakdownMap.values()).sort((a, b) => b.totalAmount - a.totalAmount)
}

export async function getMonthlyTrends(year: number): Promise<MonthlyTrend[]> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const startDate = new Date(year, 0, 1) // Jan 1st
  const endDate = new Date(year + 1, 0, 1) // Jan 1st next year

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
  })

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  
  const trends: Record<number, MonthlyTrend> = {}
  
  for (let i = 0; i < 12; i++) {
    trends[i] = { month: months[i], income: 0, expense: 0 }
  }

  transactions.forEach((tx) => {
    const monthIndex = tx.date.getMonth()
    if (tx.type === "INCOME") {
      trends[monthIndex].income += tx.amount
    } else {
      trends[monthIndex].expense += tx.amount
    }
  })

  return Object.values(trends)
}
