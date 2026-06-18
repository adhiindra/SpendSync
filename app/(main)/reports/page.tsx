import { ReportDashboard } from "@/modules/reports/components/report-dashboard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reports | SpendSync",
  description: "View your financial reports and trends.",
}

export default function ReportsPage() {
  return (
    <div className="container mx-auto max-w-6xl">
      <ReportDashboard />
    </div>
  )
}
