import { Metadata } from "next"
import { getInstallments } from "@/modules/installments/actions"
import { InstallmentList } from "@/modules/installments/components/installment-list"
import { CreateInstallmentDialog } from "@/modules/installments/components/create-installment-dialog"
import { OrbBackground } from "@/components/ui/orb-background"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { formatCurrency } from "@/lib/format"
import { Card, CardContent } from "@/components/ui/card"
import { Calculator } from "lucide-react"

export const metadata: Metadata = {
  title: "Installments",
}

export default async function InstallmentsPage() {
  const session = await getServerSession(authOptions)
  const userCurrency = session?.user?.currency || "USD"
  const installments = await getInstallments()

  const activeInstallments = installments.filter(i => i.status === "ACTIVE")
  const totalMonthlyDue = activeInstallments.reduce((sum, i) => sum + i.monthlyPayment, 0)

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col  lg:pt-0">
      <OrbBackground className="opacity-40" />

      <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 relative z-10 flex flex-col gap-6 lg:gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Installments</h2>
          <CreateInstallmentDialog userCurrency={userCurrency} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <Calculator className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Monthly Obligations</p>
                <h3 className="text-2xl font-bold">{formatCurrency(totalMonthlyDue, userCurrency)}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <InstallmentList installments={installments} userCurrency={userCurrency} />
      </div>
    </div>
  )
}
