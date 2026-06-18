import { getDashboardMetrics, getSixMonthCashFlow, getRecentTransactions } from "@/modules/dashboard/actions"
import { DashboardClient } from "@/modules/dashboard/components/dashboard-client"

export default async function DashboardPage() {
  const [metrics, cashFlow, transactions] = await Promise.all([
    getDashboardMetrics(),
    getSixMonthCashFlow(),
    getRecentTransactions(5)
  ])

  return (
    <DashboardClient 
      metrics={metrics}
      cashFlow={cashFlow}
      transactions={transactions}
    />
  )
}
