import { getFamilyDetails } from "@/modules/family/actions"
import { ReportDashboard } from "@/modules/reports/components/report-dashboard"
import { redirect } from "next/navigation"

export default async function FamilyReportsPage() {
  const family = await getFamilyDetails()

  if (!family) {
    redirect("/family/settings")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Family Reports</h2>
        <p className="text-sm text-muted-foreground">Aggregated spending analytics for {family.name}.</p>
      </div>

      <ReportDashboard isFamily={true} />
    </div>
  )
}
