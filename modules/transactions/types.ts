import { Transaction, Category } from "@prisma/client"

export type TransactionWithCategory = Transaction & {
  category: Category
}

export type CreateTransactionInput = {
  amount: number
  type: "INCOME" | "EXPENSE"
  categoryId: string
  date: Date
  description?: string
}

export type UpdateTransactionInput = Partial<CreateTransactionInput> & {
  id: string
}
