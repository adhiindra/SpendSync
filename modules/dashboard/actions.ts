"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { startOfMonth, subMonths, endOfMonth } from "date-fns"

export async function getDashboardMetrics() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const now = new Date()
  const currentMonthStart = startOfMonth(now)
  const currentMonthEnd = endOfMonth(now)

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
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

  // Optionally calculate total balance (all time net balance)
  const allTimeTx = await prisma.transaction.aggregate({
    where: { userId: session.user.id },
    _sum: {
      amount: true
    }
  })
  // Actually we need to separate INCOME and EXPENSE for all time
  const allTimeIncome = await prisma.transaction.aggregate({
    where: { userId: session.user.id, type: "INCOME" },
    _sum: { amount: true }
  })
  const allTimeExpense = await prisma.transaction.aggregate({
    where: { userId: session.user.id, type: "EXPENSE" },
    _sum: { amount: true }
  })
  const totalBalance = (allTimeIncome._sum.amount || 0) - (allTimeExpense._sum.amount || 0)

  return {
    totalBalance,
    monthlyIncome: totalIncome,
    monthlyExpense: totalExpense,
  }
}

export async function getSixMonthCashFlow() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const now = new Date()
  const sixMonthsAgo = startOfMonth(subMonths(now, 5))

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: sixMonthsAgo,
      },
    },
  })

  const monthlyData = new Map<string, { month: string; income: number; expense: number }>()

  // Initialize the last 6 months
  for (let i = 5; i >= 0; i--) {
    const targetDate = subMonths(now, i)
    const monthKey = `${targetDate.getFullYear()}-${targetDate.getMonth()}`
    const monthName = targetDate.toLocaleString('default', { month: 'short' })
    monthlyData.set(monthKey, { month: monthName, income: 0, expense: 0 })
  }

  transactions.forEach((tx) => {
    const date = new Date(tx.date)
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`
    const data = monthlyData.get(monthKey)
    if (data) {
      if (tx.type === "INCOME") {
        data.income += tx.amount
      } else {
        data.expense += tx.amount
      }
    }
  })

  return Array.from(monthlyData.values())
}

export async function getRecentTransactions(limit = 5) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  return prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    take: limit,
  })
}
