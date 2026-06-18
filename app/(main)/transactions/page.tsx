import { getTransactions } from "@/modules/transactions/actions"
import { TransactionList } from "@/modules/transactions/components/transaction-list"
import { TransactionDialog } from "@/modules/transactions/components/transaction-dialog"

export default async function TransactionsPage() {
  const transactions = await getTransactions()

  return (
    <div className="container mx-auto space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <TransactionDialog />
      </div>
      <TransactionList transactions={transactions} />
    </div>
  )
}
