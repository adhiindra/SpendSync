import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getInstallment } from "@/modules/installments/actions"
import { InstallmentDetails } from "@/modules/installments/components/installment-details"
import { DeleteInstallmentButton } from "@/modules/installments/components/delete-installment-button"
import { OrbBackground } from "@/components/ui/orb-background"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Installment Details",
}

export default async function InstallmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions)
  const userCurrency = session?.user?.currency || "USD"
  const installment = await getInstallment(id)

  if (!installment) {
    notFound()
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col lg:pt-0">
      <OrbBackground className="opacity-40" />

      <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8 relative z-10 flex flex-col gap-6 lg:gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <Link href="/installments" className={buttonVariants({ variant: "ghost", size: "sm", className: "-ml-3 text-muted-foreground hover:text-foreground" })}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Installments
            </Link>
            <DeleteInstallmentButton installmentId={installment.id} />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">{installment.name}</h2>
            <span className={`text-sm font-medium px-3 py-1 rounded-full w-fit ${installment.status === 'COMPLETED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
              {installment.status}
            </span>
          </div>
        </div>

        <InstallmentDetails installment={installment} userCurrency={userCurrency} />
      </div>
    </div>
  )
}
