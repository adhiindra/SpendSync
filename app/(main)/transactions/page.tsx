import { getTransactions, getCategories, seedCategories } from "@/modules/transactions/actions"
import { TransactionList } from "@/modules/transactions/components/transaction-list"
import { TransactionDialog } from "@/modules/transactions/components/transaction-dialog"

export default async function TransactionsPage() {
  // Temporary: seed categories if none exist so the form works out of the box
  await seedCategories()
  
  const transactions = await getTransactions()
  const categories = await getCategories()

  return (
    <div className="container mx-auto py-10 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <TransactionDialog categories={categories} />
      </div>
      <TransactionList transactions={transactions} categories={categories} />
    </div>
  )
}
