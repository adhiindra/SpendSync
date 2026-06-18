"use client"

import { useState, useTransition } from "react"
import { Transaction } from "@prisma/client"
import { CATEGORIES } from "@/lib/categories"
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
import { useSession } from "next-auth/react"
import { formatCurrency } from "@/lib/format"
import { PaginationControls } from "@/components/ui/pagination-controls"

export function TransactionList({ 
  transactions, 
  onChange,
  hideActions = false,
  isFamily = false,
  memberAccess = "VIEW_EDIT",
  totalPages,
  currentPage,
}: { 
  transactions: any[]
  onChange?: () => void
  hideActions?: boolean
  isFamily?: boolean
  memberAccess?: "VIEW_ONLY" | "VIEW_EDIT"
  totalPages?: number
  currentPage?: number
}) {
  const { data: session } = useSession()
  const userCurrency = session?.user?.currency || "USD"
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      setDeletingId(id)
      startTransition(async () => {
        try {
          await deleteTransaction(id, isFamily)
          toast.success({ title: "Transaction deleted" })
          onChange?.()
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
      <div className="text-center py-10 text-muted-foreground rounded-xl bg-card/40 backdrop-blur-md shadow-lg border border-white/30 dark:border-white/10 ring-1 ring-foreground/5">
        No transactions found. Add one to get started!
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-card/40 backdrop-blur-md shadow-lg border border-white/30 dark:border-white/10 ring-1 ring-foreground/5 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              {!hideActions && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => {
              const category = CATEGORIES.find(c => c.id === tx.category)
              return (
              <TableRow key={tx.id}>
                <TableCell className="whitespace-nowrap">
                  <div className="flex flex-col">
                    <span>{format(new Date(tx.date), "MMM d, yyyy")}</span>
                    {isFamily && tx.user && (
                      <span className="text-[10px] text-muted-foreground mt-0.5">Added by {tx.user.name || tx.user.email}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{tx.description || "-"}</TableCell>
                <TableCell>
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{ 
                      backgroundColor: category?.color ? `${category.color}20` : '#f3f4f6', 
                      color: category?.color || 'inherit' 
                    }}
                  >
                    {category?.name || tx.category}
                  </span>
                </TableCell>
                <TableCell className={`text-right font-medium ${tx.type === 'INCOME' ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100'}`}>
                  {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount, userCurrency)}
                </TableCell>
                {!hideActions && memberAccess !== "VIEW_ONLY" && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <TransactionDialog 
                        transaction={tx}
                        isFamily={isFamily}
                        trigger={
                          <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        }
                        onSuccess={onChange}
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
                )}
              </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile List View */}
      <div className="md:hidden flex flex-col divide-y divide-border/50">
        {transactions.map((tx) => {
          const category = CATEGORIES.find(c => c.id === tx.category)
          return (
          <div key={tx.id} className="flex flex-col p-4 gap-3">
            <div className="flex justify-between items-start gap-4">
              <div className="flex flex-col min-w-0">
                <span className="font-medium text-sm truncate">{tx.description || category?.name || tx.category}</span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  {format(new Date(tx.date), "MMM d, yyyy")}
                  {isFamily && tx.user && ` • ${tx.user.name || tx.user.email}`}
                </span>
              </div>
              <div className={`text-right font-medium text-sm whitespace-nowrap ${tx.type === 'INCOME' ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100'}`}>
                {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount, userCurrency)}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{ 
                  backgroundColor: category?.color ? `${category.color}20` : '#f3f4f6', 
                  color: category?.color || 'inherit' 
                }}
              >
                {category?.name || tx.category}
              </span>
              {!hideActions && memberAccess !== "VIEW_ONLY" && (
                <div className="flex justify-end gap-1">
                  <TransactionDialog 
                    transaction={tx}
                    isFamily={isFamily}
                    trigger={
                      <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                        <Edit className="h-3.5 w-3.5" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    }
                    onSuccess={onChange}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon-sm" 
                    className="h-7 w-7 text-muted-foreground hover:text-red-500"
                    onClick={() => handleDelete(tx.id)}
                    disabled={isPending && deletingId === tx.id}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
          )
        })}
      </div>

      {totalPages !== undefined && (
        <div className="border-t border-border/50 bg-muted/20">
          <PaginationControls totalPages={totalPages} />
        </div>
      )}
    </div>
  )
}
