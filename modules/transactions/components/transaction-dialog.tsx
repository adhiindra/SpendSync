"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Transaction } from "@prisma/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TransactionForm } from "./transaction-form"
import { OcrUpload, OcrExtractedData } from "./ocr-upload"

import * as React from "react"
import { PenLine, ScanText } from "lucide-react"

type Tab = "manual" | "ocr"

export function TransactionDialog({ 
  transaction,
  defaultType,
  trigger,
  onSuccess
}: { 
  transaction?: Transaction
  defaultType?: "INCOME" | "EXPENSE"
  trigger?: React.ReactElement
  onSuccess?: () => void
}) {
  const { data: session } = useSession()
  const ocrMode = (session?.user?.ocrMode as "local" | "ai") || "local"
  
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>("manual")
  const [prefillData, setPrefillData] = useState<OcrExtractedData | undefined>()
  const isEditing = !!transaction

  const handleOpenChange = (value: boolean) => {
    setOpen(value)
    if (!value) {
      // Reset state on close
      setTab("manual")
      setPrefillData(undefined)
    }
  }

  const handleExtracted = (data: OcrExtractedData) => {
    setPrefillData(data)
    setTab("manual")
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger || <Button>Add Transaction</Button>} />
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
        </DialogHeader>

        {/* Tab switcher — only shown when adding */}
        {!isEditing && (
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <button
              type="button"
              onClick={() => setTab("manual")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${
                tab === "manual"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <PenLine className="w-3.5 h-3.5" />
              Manual
            </button>
            <button
              type="button"
              onClick={() => setTab("ocr")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${
                tab === "ocr"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ScanText className="w-3.5 h-3.5" />
              Scan Receipt
            </button>
          </div>
        )}

        {/* OCR tab */}
        {tab === "ocr" && !isEditing && (
          <div className="space-y-3">
            <OcrUpload onExtracted={handleExtracted} ocrMode={ocrMode} />
            <p className="text-xs text-muted-foreground text-center">
              After scanning, you can review and edit the extracted details.
            </p>
          </div>
        )}

        {/* Manual form tab */}
        {(tab === "manual" || isEditing) && (
          <TransactionForm 
            initialData={transaction}
            defaultType={defaultType}
            prefillData={prefillData}
            onSuccess={() => {
              handleOpenChange(false)
              onSuccess?.()
            }} 
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
