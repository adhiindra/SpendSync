export type TransactionType = "INCOME" | "EXPENSE"

export type Category = {
  id: string
  name: string
  type: TransactionType
  color: string
}

export const CATEGORIES: Category[] = [
  // Expenses
  { id: "Transport", name: "Transport", type: "EXPENSE", color: "#3b82f6" },
  { id: "Food", name: "Food", type: "EXPENSE", color: "#f97316" },
  { id: "Shopping", name: "Shopping", type: "EXPENSE", color: "#ec4899" },
  { id: "Health", name: "Health", type: "EXPENSE", color: "#ef4444" },
  { id: "Household", name: "Household", type: "EXPENSE", color: "#8b5cf6" },
  { id: "Entertainment", name: "Entertainment", type: "EXPENSE", color: "#14b8a6" },
  { id: "Travel", name: "Travel", type: "EXPENSE", color: "#06b6d4" },
  { id: "Other", name: "Other", type: "EXPENSE", color: "#64748b" },
  // Income
  { id: "Salary", name: "Salary", type: "INCOME", color: "#10b981" },
  { id: "Investment", name: "Investment", type: "INCOME", color: "#84cc16" },
  { id: "Gift", name: "Gift", type: "INCOME", color: "#f59e0b" },
  { id: "Other_Income", name: "Other Income", type: "INCOME", color: "#94a3b8" },
]
