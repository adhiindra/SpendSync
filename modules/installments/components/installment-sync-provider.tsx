"use client"

import { useEffect } from "react"
import { db, SyncStatus, LocalInstallment, LocalInstallmentPayment } from "@/lib/offline-db"

export function InstallmentSyncProvider({
  installments
}: {
  installments: any[]
}) {
  useEffect(() => {
    async function hydrateDB() {
      try {
        const serverInstallmentIds = new Set(installments.map(i => i.id))
        const serverPaymentIds = new Set(installments.flatMap(i => i.payments.map((p: any) => p.id)))

        // 1. Process server data to local DB
        for (const inst of installments) {
          const localInst = await db.installments.get(inst.id)
          if (!localInst || localInst.syncStatus === 'SYNCED') {
            await db.installments.put({
              id: inst.id,
              userId: inst.userId,
              name: inst.name,
              category: inst.category,
              totalAmount: inst.totalAmount,
              durationMonths: inst.durationMonths,
              monthlyPayment: inst.monthlyPayment,
              startDate: inst.startDate,
              status: inst.status,
              notes: inst.notes,
              createdAt: inst.createdAt,
              updatedAt: inst.updatedAt,
              syncStatus: 'SYNCED'
            })
          }

          for (const payment of inst.payments) {
            const localPayment = await db.installmentPayments.get(payment.id)
            if (!localPayment || localPayment.syncStatus === 'SYNCED') {
              await db.installmentPayments.put({
                id: payment.id,
                installmentId: payment.installmentId,
                amount: payment.amount,
                dueDate: payment.dueDate,
                isPaid: payment.isPaid,
                paidDate: payment.paidDate,
                syncStatus: 'SYNCED'
              })
            }
          }
        }

        // 2. Remove items that were deleted on the server (but not those created locally and pending)
        const allLocalInsts = await db.installments.toArray()
        for (const localInst of allLocalInsts) {
          if (!serverInstallmentIds.has(localInst.id) && localInst.syncStatus === 'SYNCED') {
            await db.installments.delete(localInst.id)
          }
        }

        const allLocalPayments = await db.installmentPayments.toArray()
        for (const localPayment of allLocalPayments) {
          if (!serverPaymentIds.has(localPayment.id) && localPayment.syncStatus === 'SYNCED') {
            await db.installmentPayments.delete(localPayment.id)
          }
        }
      } catch (err) {
        console.error("Failed to hydrate offline DB:", err)
      }
    }

    hydrateDB()
  }, [installments])

  return null
}
