"use client"

import { useState, useEffect } from "react"
import { getMonthlySummary, getCategoryBreakdown, getMonthlyTrends, getMonthlyTransactions } from "../actions"
import { MonthlySummary, CategoryBreakdown, MonthlyTrend } from "../types"
import { CategoryPieChart } from "./category-pie-chart"
import { TrendBarChart } from "./trend-bar-chart"
import { ExportButton } from "./export-button"
import { TransactionList } from "@/modules/transactions/components/transaction-list"
import { Transaction } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wallet, TrendingDown, TrendingUp } from "lucide-react"
import { useSession } from "next-auth/react"
import { formatCurrency } from "@/lib/format"

export function ReportDashboard() {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)

  const [summary, setSummary] = useState<MonthlySummary | null>(null)
  const [expenseBreakdown, setExpenseBreakdown] = useState<CategoryBreakdown[]>([])
  const [incomeBreakdown, setIncomeBreakdown] = useState<CategoryBreakdown[]>([])
  const [trends, setTrends] = useState<MonthlyTrend[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { data: session } = useSession()
  const userCurrency = session?.user?.currency || "USD"

  async function loadData() {
    setIsLoading(true)
    try {
      const [sum, expenses, incomes, trnds, txs] = await Promise.all([
        getMonthlySummary(year, month),
        getCategoryBreakdown(year, month, "EXPENSE"),
        getCategoryBreakdown(year, month, "INCOME"),
        getMonthlyTrends(year),
        getMonthlyTransactions(year, month)
      ])
      setSummary(sum)
      setExpenseBreakdown(expenses)
      setIncomeBreakdown(incomes)
      setTrends(trnds)
      setTransactions(txs)
    } catch (error) {
      console.error("Failed to load reports data", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [year, month])

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ]

  const years = [year - 2, year - 1, year, year + 1]

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Financial Report</h1>
        <div className="flex items-center gap-2 print:hidden flex-wrap">
          <Select value={month.toString()} onValueChange={(v) => setMonth(Number(v))}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Month">
                {months.find(m => m.value === month)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {months.map(m => (
                <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={year.toString()} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year">
                {year}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {years.map(y => (
                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ExportButton
            year={year}
            month={month}
            summary={summary}
            transactions={transactions}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              {formatCurrency(summary?.totalIncome ?? 0, userCurrency)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expense</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {formatCurrency(summary?.totalExpense ?? 0, userCurrency)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(summary?.netBalance ?? 0) >= 0 ? "text-emerald-500" : "text-red-500"}`}>
              {formatCurrency(summary?.netBalance ?? 0, userCurrency)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <CategoryPieChart data={expenseBreakdown} type="EXPENSE" />
        <CategoryPieChart data={incomeBreakdown} type="INCOME" />
      </div>

      <div className="mt-6">
        <TrendBarChart data={trends} year={year} />
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Transaction History</h2>
        <TransactionList transactions={transactions} hideActions />
      </div>
    </div>
  )
}
