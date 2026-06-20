"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createInstallment } from "../actions"

import { formatCurrency } from "@/lib/format"

export function CreateInstallmentDialog({ userCurrency }: { userCurrency: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    totalAmount: "",
    durationMonths: "",
    startDate: new Date().toISOString().split('T')[0],
    notes: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createInstallment({
        name: formData.name,
        category: formData.category,
        totalAmount: Number(formData.totalAmount),
        durationMonths: Number(formData.durationMonths),
        startDate: new Date(formData.startDate),
        notes: formData.notes
      })
      setOpen(false)
      setFormData({
        name: "",
        category: "",
        totalAmount: "",
        durationMonths: "",
        startDate: new Date().toISOString().split('T')[0],
        notes: ""
      })
      router.refresh()
    } catch (error) {
      console.error(error)
      // Normally we'd show a toast here
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Add Installment</Button>} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Installment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Installment Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Car Loan, iPhone"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category (Optional)</Label>
            <Input
              id="category"
              name="category"
              placeholder="e.g., Bank A, Electronics"
              value={formData.category}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount</Label>
              <Input
                id="totalAmount"
                name="totalAmount"
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="0.00"
                value={formData.totalAmount}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="durationMonths">Duration (Months)</Label>
              <Input
                id="durationMonths"
                name="durationMonths"
                type="number"
                min="1"
                step="1"
                required
                placeholder="e.g., 6"
                value={formData.durationMonths}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              required
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              name="notes"
              placeholder="Any additional details..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          {formData.totalAmount && formData.durationMonths && (
            <div className="p-3 bg-muted rounded-md flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Estimated Monthly:</span>
              <span className="font-semibold">
                {formatCurrency(Number(formData.totalAmount) / Number(formData.durationMonths), userCurrency)}
              </span>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Installment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
