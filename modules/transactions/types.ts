import { Transaction } from "@prisma/client"

export type CreateTransactionInput = {
  amount: number
  type: "INCOME" | "EXPENSE"
  category: string
  date: Date
  description?: string
}

export type UpdateTransactionInput = Partial<CreateTransactionInput> & {
  id: string
}
