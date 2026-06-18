"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Wallet, Activity } from "lucide-react"
import { TransactionWithCategory } from "@/modules/transactions/types"
import { Category } from "@prisma/client"
import { CashFlowChart } from "./cash-flow-chart"
import { RecentTransactions } from "./recent-transactions"
import { formatCurrency } from "@/lib/format"
import { TransactionDialog } from "@/modules/transactions/components/transaction-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export function DashboardClient({
  metrics,
  cashFlow,
  transactions,
  categories
}: {
  metrics: { totalBalance: number; monthlyIncome: number; monthlyExpense: number }
  cashFlow: { month: string; income: number; expense: number }[]
  transactions: TransactionWithCategory[]
  categories: Category[]
}) {
  const { data: session, status } = useSession()
  const userCurrency = session?.user?.currency || "USD"
  const router = useRouter()

  if (status === "loading") {
    return <div className="flex h-64 items-center justify-center text-muted-foreground">Loading dashboard...</div>
  }

  const metricCards = [
    { title: "Total Balance", value: metrics.totalBalance, icon: Wallet, positive: metrics.totalBalance >= 0 },
    { title: "Monthly Income", value: metrics.monthlyIncome, icon: ArrowUpRight, positive: true },
    { title: "Monthly Expenses", value: metrics.monthlyExpense, icon: ArrowDownRight, positive: false },
    { title: "Active Goals", value: "3", icon: Activity, positive: true, isNumber: true }, // Placeholder for goals feature
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {session?.user?.name || session?.user?.email?.split('@')[0]}. Here's your financial status.
          </p>
        </div>
        
        <div className="flex gap-2">
          <TransactionDialog 
            categories={categories}
            defaultType="EXPENSE"
            trigger={
              <Button variant="outline" className="gap-2">
                <ArrowDownRight className="h-4 w-4 text-red-500" />
                Add Expense
              </Button>
            }
            onSuccess={() => router.refresh()}
          />
          <TransactionDialog 
            categories={categories}
            defaultType="INCOME"
            trigger={
              <Button className="gap-2">
                <ArrowUpRight className="h-4 w-4" />
                Add Income
              </Button>
            }
            onSuccess={() => router.refresh()}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((metric, i) => (
          <Card key={i} className="border-border/50 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.isNumber ? metric.value : formatCurrency(metric.value as number, userCurrency)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <CashFlowChart data={cashFlow} />
        <RecentTransactions transactions={transactions} />
      </div>
    </div>
  )
}
