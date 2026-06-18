"use client"

import { useState, useTransition } from "react"
import { TransactionWithCategory } from "../types"
import { Category } from "@prisma/client"
import { deleteTransaction } from "../actions"
import { TransactionDialog } from "./transaction-dialog"
import { toast } from "gooey-toast"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"

export function TransactionList({ 
  transactions, 
  categories 
}: { 
  transactions: TransactionWithCategory[]
  categories: Category[]
}) {
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      setDeletingId(id)
      startTransition(async () => {
        try {
          await deleteTransaction(id)
          toast.success({ title: "Transaction deleted" })
        } catch (e) {
          console.error(e)
          toast.error({ title: "Failed to delete transaction" })
        } finally {
          setDeletingId(null)
        }
      })
    }
  }
  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground border rounded-md">
        No transactions found. Add one to get started!
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="whitespace-nowrap">{format(new Date(tx.date), "MMM d, yyyy")}</TableCell>
              <TableCell>{tx.description || "-"}</TableCell>
              <TableCell>
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{ 
                    backgroundColor: tx.category.color ? `${tx.category.color}20` : '#f3f4f6', 
                    color: tx.category.color || 'inherit' 
                  }}
                >
                  {tx.category.name}
                </span>
              </TableCell>
              <TableCell className={`text-right font-medium ${tx.type === 'INCOME' ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100'}`}>
                {tx.type === 'INCOME' ? '+' : '-'}${tx.amount.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <TransactionDialog 
                    categories={categories} 
                    transaction={tx}
                    trigger={
                      <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    }
                  />
                  <Button 
                    variant="ghost" 
                    size="icon-sm" 
                    className="h-8 w-8 text-muted-foreground hover:text-red-500"
                    onClick={() => handleDelete(tx.id)}
                    disabled={isPending && deletingId === tx.id}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
