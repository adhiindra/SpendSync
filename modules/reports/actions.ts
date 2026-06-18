"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { CategoryBreakdown, MonthlySummary, MonthlyTrend } from "./types"
import { Transaction } from "@prisma/client"
import { CATEGORIES } from "@/lib/categories"

async function getBaseWhereClause(isFamily: boolean = false) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")
  
  if (isFamily) {
    const member = await prisma.familyMember.findFirst({ where: { userId: session.user.id } })
    if (!member) return { familyId: "NON_EXISTENT_FAMILY" }
    return { familyId: member.familyId }
  }
  return { userId: session.user.id, familyId: null }
}

export async function getMonthlyTransactions(year: number, month: number, isFamily: boolean = false): Promise<Transaction[]> {
  const baseWhere = await getBaseWhereClause(isFamily)
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 1)

  return await prisma.transaction.findMany({
    where: {
      ...baseWhere,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    orderBy: { date: "desc" },
  })
}

export async function getMonthlySummary(year: number, month: number, isFamily: boolean = false): Promise<MonthlySummary> {
  const baseWhere = await getBaseWhereClause(isFamily)
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 1)

  const transactions = await prisma.transaction.findMany({
    where: {
      ...baseWhere,
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

export async function getCategoryBreakdown(year: number, month: number, type: "INCOME" | "EXPENSE", isFamily: boolean = false): Promise<CategoryBreakdown[]> {
  const baseWhere = await getBaseWhereClause(isFamily)
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 1)

  const transactions = await prisma.transaction.findMany({
    where: {
      ...baseWhere,
      type,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
  })

  const breakdownMap = new Map<string, CategoryBreakdown>()

  transactions.forEach((tx) => {
    const current = breakdownMap.get(tx.category)
    if (current) {
      current.totalAmount += tx.amount
    } else {
      const catObj = CATEGORIES.find(c => c.id === tx.category) || CATEGORIES.find(c => c.id === "Other")!
      breakdownMap.set(tx.category, {
        category: catObj,
        totalAmount: tx.amount,
      })
    }
  })

  return Array.from(breakdownMap.values()).sort((a, b) => b.totalAmount - a.totalAmount)
}

export async function getMonthlyTrends(year: number, isFamily: boolean = false): Promise<MonthlyTrend[]> {
  const baseWhere = await getBaseWhereClause(isFamily)
  const startDate = new Date(year, 0, 1) // Jan 1st
  const endDate = new Date(year + 1, 0, 1) // Jan 1st next year

  const transactions = await prisma.transaction.findMany({
    where: {
      ...baseWhere,
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
