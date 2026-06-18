import { getDashboardMetrics, getSixMonthCashFlow, getRecentTransactions } from "@/modules/dashboard/actions"
import { DashboardClient } from "@/modules/dashboard/components/dashboard-client"
import { getFamilyDetails } from "@/modules/family/actions"

export default async function DashboardPage() {
  const family = await getFamilyDetails()
  const isFamily = !!family

  const [
    indMetrics, indCashFlow, indTransactions,
    famMetrics, famCashFlow, famTransactions
  ] = await Promise.all([
    getDashboardMetrics(false),
    getSixMonthCashFlow(false),
    getRecentTransactions(5, false),
    isFamily ? getDashboardMetrics(true) : Promise.resolve(null),
    isFamily ? getSixMonthCashFlow(true) : Promise.resolve(null),
    isFamily ? getRecentTransactions(5, true) : Promise.resolve(null),
  ])

  return (
    <DashboardClient 
      individualData={{ metrics: indMetrics, cashFlow: indCashFlow, transactions: indTransactions }}
      familyData={isFamily ? { metrics: famMetrics!, cashFlow: famCashFlow!, transactions: famTransactions! } : null}
      family={family}
    />
  )
}
