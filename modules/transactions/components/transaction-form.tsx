"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CATEGORIES } from "@/lib/categories"
import { Transaction } from "@prisma/client"
import { createTransaction, updateTransaction } from "../actions"
import { OcrExtractedData } from "./ocr-upload"
import { toast } from "gooey-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, "Amount must be a positive number"),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1, "Please select a category"),
  date: z.string().min(1, "Please select a date"),
  description: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

export function TransactionForm({
  initialData,
  defaultType = "EXPENSE",
  prefillData,
  onSuccess
}: {
  initialData?: Transaction
  defaultType?: "INCOME" | "EXPENSE"
  prefillData?: OcrExtractedData
  onSuccess?: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      amount: initialData.amount.toString(),
      type: initialData.type as "INCOME" | "EXPENSE",
      category: initialData.category,
      date: new Date(initialData.date).toISOString().split('T')[0],
      description: initialData.description || "",
    } : {
      type: defaultType,
      category: "",
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD for simple date input
    }
  })

  const selectedType = watch("type")

  // Pre-fill form when OCR data arrives
  useEffect(() => {
    if (!prefillData) return
    if (prefillData.amount) setValue("amount", prefillData.amount)
    if (prefillData.date) setValue("date", prefillData.date)
    if (prefillData.description) setValue("description", prefillData.description)
    if (prefillData.type) setValue("type", prefillData.type)
    if (prefillData.category) setValue("category", prefillData.category)
  }, [prefillData, setValue])

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      if (initialData) {
        await updateTransaction({
          id: initialData.id,
          amount: Number(data.amount),
          type: data.type,
          category: data.category,
          date: new Date(data.date),
          description: data.description,
        })
        toast.success({ title: "Transaction updated!" })
      } else {
        await createTransaction({
          amount: Number(data.amount),
          type: data.type,
          category: data.category,
          date: new Date(data.date),
          description: data.description,
        })
        toast.success({ title: "Transaction added successfully!" })
      }
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error(error)
      toast.error({ title: "Failed to save transaction", description: "Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={selectedType}
            onValueChange={(value: string | null) => { if (value) setValue("type", value as "INCOME" | "EXPENSE") }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EXPENSE">Expense</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" step="0.01" placeholder="0.00" {...register("amount")} />
          {errors.amount && <p className="text-sm text-red-500">{errors.amount.message as string}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={watch("category")}
          onValueChange={(value: string | null) => { if (value) setValue("category", value) }}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category">
              {watch("category") ? CATEGORIES.find(c => c.id === watch("category"))?.name : "Select category"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.filter(c => c.type === selectedType).map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-sm text-red-500">{errors.category.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" {...register("date")} />
        {errors.date && <p className="text-sm text-red-500">{errors.date.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input id="description" placeholder="Lunch at..." {...register("description")} />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Transaction"}
      </Button>
    </form>
  )
}
