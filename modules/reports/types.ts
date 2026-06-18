import { Category } from "@/lib/categories"

export type MonthlySummary = {
  totalIncome: number
  totalExpense: number
  netBalance: number
}

export type CategoryBreakdown = {
  category: Category
  totalAmount: number
}

export type MonthlyTrend = {
  month: string
  income: number
  expense: number
}
