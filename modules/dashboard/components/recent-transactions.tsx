"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionWithCategory } from "@/modules/transactions/types"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import { formatCurrency } from "@/lib/format"
import { Receipt } from "lucide-react"

export function RecentTransactions({ transactions }: { transactions: TransactionWithCategory[] }) {
  const { data: session } = useSession()
  const userCurrency = session?.user?.currency || "USD"

  return (
    <Card className="lg:col-span-3 border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest financial activities.</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-muted-foreground text-sm border rounded-md border-dashed">
            No transactions found.
          </div>
        ) : (
          <div className="space-y-6">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="h-10 w-10 rounded-full flex items-center justify-center border"
                    style={{ 
                      backgroundColor: tx.category.color ? `${tx.category.color}20` : '#f3f4f6', 
                      borderColor: tx.category.color ? `${tx.category.color}40` : 'var(--border)'
                    }}
                  >
                    <Receipt 
                      className="h-4 w-4" 
                      style={{ color: tx.category.color || 'var(--muted-foreground)' }} 
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tx.description || tx.category.name}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(tx.date), "MMM d, yyyy")}</p>
                  </div>
                </div>
                <div className={`font-semibold text-sm ${tx.type === 'INCOME' ? 'text-emerald-500' : ''}`}>
                  {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount, userCurrency)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
