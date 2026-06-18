import { getTransactions } from "@/modules/transactions/actions"
import { TransactionList } from "@/modules/transactions/components/transaction-list"
import { TransactionDialog } from "@/modules/transactions/components/transaction-dialog"

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const pageStr = params.page
  const page = typeof pageStr === "string" ? parseInt(pageStr, 10) : 1
  const { transactions, totalPages } = await getTransactions(false, page)

  return (
    <div className="container mx-auto space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <TransactionDialog />
      </div>
      <TransactionList transactions={transactions} currentPage={page} totalPages={totalPages} />
    </div>
  )
}
