import { getTransactions } from "@/modules/transactions/actions"
import { getFamilyDetails } from "@/modules/family/actions"
import { TransactionList } from "@/modules/transactions/components/transaction-list"
import { TransactionDialog } from "@/modules/transactions/components/transaction-dialog"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function FamilyTransactionsPage() {
  const session = await getServerSession(authOptions)
  const family = await getFamilyDetails()

  if (!family) {
    redirect("/family/settings")
  }

  const transactions = await getTransactions(true)
  const currentUserMember = family.members.find((m: any) => m.userId === session?.user?.id)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Family Transactions</h2>
          <p className="text-sm text-muted-foreground">Shared transactions across all members.</p>
        </div>
        {currentUserMember?.access !== "VIEW_ONLY" && (
          <TransactionDialog isFamily={true} />
        )}
      </div>

      <TransactionList 
        transactions={transactions} 
        isFamily={true} 
        memberAccess={currentUserMember?.access as any} 
      />
    </div>
  )
}
