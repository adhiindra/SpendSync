"use client"

import { useState } from "react"
import { InstallmentWithPayments } from "../types"
import { togglePaymentStatus, updatePaymentAmount } from "../actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/format"
import { Edit2, Check, X } from "lucide-react"

export function InstallmentDetails({ installment, userCurrency }: { installment: InstallmentWithPayments, userCurrency: string }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState<string>("")

  const handleToggle = async (paymentId: string, currentStatus: boolean) => {
    setLoadingId(paymentId)
    try {
      await togglePaymentStatus(paymentId, !currentStatus)
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingId(null)
    }
  }

  const paidPayments = installment.payments.filter(p => p.isPaid).length
  const totalPayments = installment.durationMonths
  const paidAmount = installment.payments.filter(p => p.isPaid).reduce((sum, p) => sum + p.amount, 0)
  const progress = Math.min((paidAmount / installment.totalAmount) * 100, 100)

  const handleSaveAmount = async (paymentId: string) => {
    if (!editAmount || isNaN(Number(editAmount))) return
    
    setLoadingId(paymentId)
    try {
      await updatePaymentAmount(paymentId, Number(editAmount))
      setEditingId(null)
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Installment tracking progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Total Amount</span>
              <p className="text-xl font-bold">
                {formatCurrency(installment.totalAmount, userCurrency)}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Paid Amount</span>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(paidAmount, userCurrency)}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Monthly Payment</span>
              <p className="text-xl font-bold">
                {formatCurrency(installment.monthlyPayment, userCurrency)}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Duration</span>
              <p className="text-xl font-bold">{installment.durationMonths} Months</p>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex justify-between text-sm">
              <span>{paidPayments} of {totalPayments} payments completed</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
          
          {installment.notes && (
            <div className="pt-4 mt-4 border-t">
              <span className="text-sm font-medium">Notes</span>
              <p className="text-sm text-muted-foreground mt-1">{installment.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Schedule</CardTitle>
          <CardDescription>Mark each month as paid to track your progress.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {installment.payments.map((payment, index) => {
              const isPastDue = !payment.isPaid && new Date(payment.dueDate) < new Date()
              
              return (
                <div 
                  key={payment.id} 
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg transition-colors gap-3 sm:gap-0 ${
                    payment.isPaid ? 'bg-muted/30 border-muted' : isPastDue ? 'border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Checkbox 
                      id={`payment-${payment.id}`}
                      checked={payment.isPaid}
                      disabled={loadingId === payment.id}
                      onCheckedChange={() => handleToggle(payment.id, payment.isPaid)}
                      className="h-5 w-5 shrink-0"
                    />
                    <div className="space-y-1">
                      <label 
                        htmlFor={`payment-${payment.id}`}
                        className={`font-medium cursor-pointer ${payment.isPaid ? 'line-through text-muted-foreground' : ''}`}
                      >
                        Month {index + 1}
                      </label>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>Due: {new Date(payment.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        {isPastDue && <span className="text-red-500 font-medium text-xs">Past Due</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col justify-between sm:text-right items-center sm:items-end pl-9 sm:pl-0 gap-2">
                    {editingId === payment.id ? (
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          className="w-24 h-8 text-right px-2"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          autoFocus
                          disabled={loadingId === payment.id}
                        />
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleSaveAmount(payment.id)}
                          disabled={loadingId === payment.id || !editAmount}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setEditingId(null)}
                          disabled={loadingId === payment.id}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${payment.isPaid ? 'text-muted-foreground' : ''}`}>
                          {formatCurrency(payment.amount, userCurrency)}
                        </span>
                        {!payment.isPaid && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => {
                              setEditingId(payment.id)
                              setEditAmount(payment.amount.toString())
                            }}
                            className="opacity-50 hover:opacity-100 h-6 w-6"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                    {payment.paidDate && editingId !== payment.id && (
                      <p className="text-xs text-muted-foreground mt-0 sm:mt-1">
                        Paid on {new Date(payment.paidDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
