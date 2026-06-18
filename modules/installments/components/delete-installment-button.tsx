"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteInstallment } from "../actions"

export function DeleteInstallmentButton({ installmentId }: { installmentId: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this installment? This action cannot be undone.")) {
      setIsDeleting(true)
      try {
        await deleteInstallment(installmentId)
        router.push("/installments")
      } catch (error) {
        console.error("Failed to delete installment:", error)
        setIsDeleting(false)
      }
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="h-4 w-4 mr-2" />
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  )
}
