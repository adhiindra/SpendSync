import { getDashboardMetrics, getSixMonthCashFlow, getRecentTransactions } from "@/modules/dashboard/actions"
import { getCategories } from "@/modules/transactions/actions"
import { DashboardClient } from "@/modules/dashboard/components/dashboard-client"

export default async function DashboardPage() {
  const [metrics, cashFlow, transactions, categories] = await Promise.all([
    getDashboardMetrics(),
    getSixMonthCashFlow(),
    getRecentTransactions(5),
    getCategories()
  ])

  return (
    <DashboardClient 
      metrics={metrics}
      cashFlow={cashFlow}
      transactions={transactions}
      categories={categories}
    />
  )
}
