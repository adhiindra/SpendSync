import { Installment, InstallmentPayment } from "@prisma/client"

export type InstallmentWithPayments = Installment & {
  payments: InstallmentPayment[]
}

export interface CreateInstallmentInput {
  name: string
  category?: string
  totalAmount: number
  durationMonths: number
  startDate: Date
  notes?: string
}
