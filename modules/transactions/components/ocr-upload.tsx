"use client"

import { useRef, useState } from "react"
import { createWorker } from "tesseract.js"
import { Camera, Upload, Loader2, ScanText, X, CheckCircle2, Bot, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"

export type OcrExtractedData = {
  amount?: string
  date?: string
  description?: string
  type?: "INCOME" | "EXPENSE"
  category?: string
}

interface OcrUploadProps {
  onExtracted: (data: OcrExtractedData) => void
  ocrMode?: "local" | "ai"
}

function parseReceiptText(text: string): OcrExtractedData {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean)

  // --- Amount ---
  const amountPatterns = [
    /(?:total|amount|grand total|subtotal|jumlah|bayar)[^\d]*([0-9]{1,3}(?:[.,][0-9]{3})*(?:[.,][0-9]{1,2})?)/i,
    /(?:IDR|Rp\.?|USD|\$|€|£)\s*([0-9]{1,3}(?:[.,][0-9]{3})*(?:[.,][0-9]{1,2})?)/i,
    /([0-9]{1,3}(?:[.,][0-9]{3})+(?:[.,][0-9]{1,2})?)/,
  ]
  let amount: string | undefined
  for (const pattern of amountPatterns) {
    const match = text.match(pattern)
    if (match) {
      let raw = match[1]
      if (/[.,]\d{1,2}$/.test(raw)) {
        raw = raw.replace(/[.,](?=\d{1,2}$)/, "__DEC__").replace(/[.,]/g, "").replace("__DEC__", ".")
      } else {
        raw = raw.replace(/[.,]/g, "")
      }
      const num = parseFloat(raw)
      if (!isNaN(num) && num > 0) {
        amount = num.toFixed(2)
        break
      }
    }
  }

  // --- Date ---
  const datePatterns = [
    /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/,
    /(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/,
    /(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[,\s]+(\d{1,2})[,\s]+(\d{4})/i,
  ]
  let date: string | undefined
  for (const pattern of datePatterns) {
    const match = text.match(pattern)
    if (match) {
      try {
        const d = new Date(match[0])
        if (!isNaN(d.getTime())) {
          date = d.toISOString().split("T")[0]
          break
        }
      } catch { /* skip */ }
    }
  }

  // --- Description ---
  const skipWords = /^(receipt|invoice|tax|vat|date|time|cash|change|total|amount|subtotal|rp|idr|\d)/i
  const descLine = lines.find(l => l.length > 3 && l.length < 60 && !skipWords.test(l))
  const description = descLine ? descLine.replace(/[^a-zA-Z0-9\s\-&']/g, "").trim() : undefined

  // --- Type ---
  const incomeKeywords = /salary|income|payment received|transfer in|deposit|gaji|pendapatan/i
  const type: "INCOME" | "EXPENSE" = incomeKeywords.test(text) ? "INCOME" : "EXPENSE"

  return { amount, date, description, type }
}

async function runAiOcr(file: File): Promise<OcrExtractedData> {
  const formData = new FormData()
  formData.append("image", file)
  const res = await fetch("/api/ocr", { method: "POST", body: formData })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error || "AI OCR request failed")
  }
  const data = await res.json()
  return {
    amount: data.amount ? String(data.amount) : undefined,
    date: data.date,
    description: data.description,
    type: data.type === "INCOME" ? "INCOME" : "EXPENSE",
    category: data.category,
  }
}

export function OcrUpload({ onExtracted, ocrMode = "local" }: OcrUploadProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle")
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState("")
  const [ocrLang, setOcrLang] = useState("eng")

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select an image file.")
      setStatus("error")
      return
    }

    const url = URL.createObjectURL(file)
    setPreview(url)
    setStatus("processing")
    setProgress(0)
    setErrorMsg("")

    try {
      let extracted: OcrExtractedData

      if (ocrMode === "ai") {
        // Simulate progress for AI (it's a network call, no progress events)
        const progressInterval = setInterval(() => {
          setProgress(p => Math.min(p + 8, 85))
        }, 300)
        extracted = await runAiOcr(file)
        clearInterval(progressInterval)
        setProgress(100)
      } else {
        // Local Tesseract
        const worker = await createWorker(ocrLang, 1, {
          workerPath: "/tessworker.js",
          logger: (m) => {
            if (m.status === "recognizing text") {
              setProgress(Math.round((m.progress || 0) * 100))
            }
          },
        })
        const { data: { text } } = await worker.recognize(file)
        await worker.terminate()
        extracted = parseReceiptText(text)
      }

      setStatus("done")
      onExtracted(extracted)
    } catch (err) {
      console.error(err)
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Failed to process image. Please try again or enter manually."
      )
      setStatus("error")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const reset = () => {
    setPreview(null)
    setStatus("idle")
    setProgress(0)
    setErrorMsg("")
    if (cameraInputRef.current) cameraInputRef.current.value = ""
    if (uploadInputRef.current) uploadInputRef.current.value = ""
  }

  const ModeIcon = ocrMode === "ai" ? Bot : Cpu
  const modeLabel = ocrMode === "ai" ? "AI (Gemini)" : "Local OCR"

  return (
    <div className="space-y-4">
      {/* Camera input — opens native camera on mobile */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
      {/* Upload input — opens file picker, no camera capture */}
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {/* Mode badge & Lang */}
      <div className="flex items-center justify-end gap-2">
        {ocrMode === "local" && (
          <select 
            value={ocrLang}
            onChange={(e) => setOcrLang(e.target.value)}
            className="text-xs border border-input rounded-md px-2 py-1 bg-background text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="eng">ENG</option>
            <option value="ind">IND</option>
          </select>
        )}
        <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
          <ModeIcon className="w-3 h-3" />
          {modeLabel}
        </span>
      </div>

      {/* Upload area */}
      {!preview && status === "idle" && (
        <div className="relative border-2 border-dashed border-primary/30 rounded-xl p-8 flex flex-col items-center gap-3 transition-all hover:border-primary/60 hover:bg-primary/5 group">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <ScanText className="w-7 h-7 text-primary" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">Scan a Receipt</p>
            <p className="text-sm text-muted-foreground mt-0.5">Take a photo or upload an image</p>
          </div>
          <div className="flex gap-2 mt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera className="w-4 h-4" />
              Camera
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => uploadInputRef.current?.click()}
            >
              <Upload className="w-4 h-4" />
              Upload
            </Button>
          </div>
        </div>
      )}

      {/* Preview + processing state */}
      {preview && (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Receipt preview"
              className="w-full max-h-48 object-cover"
            />
            {status !== "processing" && (
              <button
                type="button"
                onClick={reset}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 backdrop-blur flex items-center justify-center border border-border hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {status === "processing" && (
              <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm font-medium text-foreground">
                  {ocrMode === "ai" ? "Analyzing with AI…" : "Scanning receipt…"}
                </p>
                <div className="w-40 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{progress}%</p>
              </div>
            )}
          </div>

          {status === "done" && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-500/10 rounded-lg px-3 py-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Receipt scanned! Review and edit the fields below.</span>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              <X className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
