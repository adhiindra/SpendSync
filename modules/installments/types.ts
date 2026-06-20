import { Installment, InstallmentPayment } from "@prisma/client"

export type InstallmentWithPayments = Installment & {
  payments: InstallmentPayment[]
}

export interface CreateInstallmentInput {
  id?: string
  name: string
  category?: string
  totalAmount: number
  durationMonths: number
  startDate: Date
  notes?: string
}
