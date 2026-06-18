"use client"

import { useState } from "react"
import { Category } from "@prisma/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TransactionForm } from "./transaction-form"
import { TransactionWithCategory } from "../types"
import * as React from "react"

export function TransactionDialog({ 
  categories, 
  transaction,
  defaultType,
  trigger,
  onSuccess
}: { 
  categories: Category[]
  transaction?: TransactionWithCategory
  defaultType?: "INCOME" | "EXPENSE"
  trigger?: React.ReactElement
  onSuccess?: () => void
}) {
  const [open, setOpen] = useState(false)
  const isEditing = !!transaction

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger || <Button>Add Transaction</Button>} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
        </DialogHeader>
        <TransactionForm 
          categories={categories} 
          initialData={transaction}
          defaultType={defaultType}
          onSuccess={() => {
            setOpen(false)
            onSuccess?.()
          }} 
        />
      </DialogContent>
    </Dialog>
  )
}
