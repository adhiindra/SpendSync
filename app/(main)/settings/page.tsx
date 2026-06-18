"use client"

import { useState, useTransition, useEffect } from "react"
import { useSession } from "next-auth/react"
import { updateCurrency, updateLanguage, updateOcrMode, updateGeminiKey } from "@/modules/settings/actions"
import { toast } from "gooey-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/components/providers/i18n-provider"
import { Bot, Cpu, AlertTriangle } from "lucide-react"

const CURRENCIES = [
  { code: "USD", label: "US Dollar ($)" },
  { code: "EUR", label: "Euro (€)" },
  { code: "GBP", label: "British Pound (£)" },
  { code: "JPY", label: "Japanese Yen (¥)" },
  { code: "AUD", label: "Australian Dollar (A$)" },
  { code: "CAD", label: "Canadian Dollar (C$)" },
  { code: "IDR", label: "Indonesian Rupiah (Rp)" },
  { code: "SGD", label: "Singapore Dollar (S$)" },
]

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "id", label: "Bahasa Indonesia" },
]

const OCR_MODES = [
  {
    id: "local",
    label: "Local OCR",
    description: "Runs on-device using Tesseract. Works offline, no API key needed.",
    icon: Cpu,
  },
  {
    id: "ai",
    label: "AI (Gemini Vision)",
    description: "Uses Google Gemini for higher accuracy on complex receipts.",
    icon: Bot,
  },
]

export default function SettingsPage() {
  const { t } = useTranslation("settings")
  const { data: session, update } = useSession()
  const [currency, setCurrency] = useState(session?.user?.currency || "USD")
  const [language, setLanguage] = useState(session?.user?.language || "en")
  const [ocrMode, setOcrMode] = useState<"local" | "ai">(
    (session?.user?.ocrMode as "local" | "ai") || "local"
  )
  const [isPending, startTransition] = useTransition()
  const [isOcrPending, startOcrTransition] = useTransition()
  const [geminiKey, setGeminiKey] = useState("")
  const [isGeminiKeyPending, startGeminiKeyTransition] = useTransition()

  useEffect(() => {
    if (session?.user) {
      if (session.user.currency) setCurrency(session.user.currency)
      if (session.user.language) setLanguage(session.user.language)
      if (session.user.ocrMode) setOcrMode(session.user.ocrMode as "local" | "ai")
    }
  }, [session?.user])

  const handleSave = () => {
    startTransition(async () => {
      try {
        if (currency !== session?.user?.currency) {
          await updateCurrency(currency)
        }
        if (language !== session?.user?.language) {
          await updateLanguage(language)
        }
        await update({ currency, language })
        toast.success({ title: t("success") })
        await new Promise((resolve) => setTimeout(resolve, 1000))
        window.location.reload()
      } catch (error) {
        toast.error({ title: t("error") })
      }
    })
  }

  const handleOcrModeChange = (mode: "local" | "ai") => {
    if (mode === ocrMode) return
    setOcrMode(mode)
    startOcrTransition(async () => {
      try {
        await updateOcrMode(mode)
        await update({ ocrMode: mode })
        toast.success({
          title: mode === "ai" ? "AI OCR enabled" : "Local OCR enabled",
          description: mode === "ai"
            ? "Receipts will be scanned using Gemini Vision."
            : "Receipts will be scanned on-device.",
        })
      } catch {
        toast.error({ title: "Failed to update OCR mode" })
        setOcrMode(ocrMode) // revert
      }
    })
  }

  const handleSaveGeminiKey = () => {
    if (!geminiKey) return
    startGeminiKeyTransition(async () => {
      try {
        await updateGeminiKey(geminiKey)
        await update({ hasGeminiKey: true })
        setGeminiKey("")
        toast.success({ title: "API Key saved" })
      } catch {
        toast.error({ title: "Failed to save API key" })
      }
    })
  }

  const hasChanges = currency !== session?.user?.currency || language !== session?.user?.language
  const hasGeminiKey = (session?.user as any)?.hasGeminiKey || false

  return (
    <div className="container mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>

      {/* Preferences card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("preferences")}</CardTitle>
          <CardDescription>{t("preferences_description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currency">{t("base_currency")}</Label>
            <Select value={currency} onValueChange={(val) => setCurrency(val as string)}>
              <SelectTrigger id="currency">
                <SelectValue placeholder={t("currency_placeholder")}>
                  {CURRENCIES.find(c => c.code === currency)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map(c => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">{t("currency_description")}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">{t("language")}</Label>
            <Select value={language} onValueChange={(val) => setLanguage(val as string)}>
              <SelectTrigger id="language">
                <SelectValue placeholder={t("language_placeholder")}>
                  {LANGUAGES.find(l => l.code === language)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(l => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">{t("language_description")}</p>
          </div>

          <Button onClick={handleSave} disabled={isPending || !hasChanges}>
            {isPending ? t("saving") : t("save")}
          </Button>
        </CardContent>
      </Card>

      {/* Receipt Scanning card */}
      <Card>
        <CardHeader>
          <CardTitle>Receipt Scanning</CardTitle>
          <CardDescription>
            Choose how the app reads your receipts when you tap &ldquo;Scan Receipt&rdquo;.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {OCR_MODES.map((mode) => {
            const Icon = mode.icon
            const isActive = ocrMode === mode.id
            return (
              <button
                key={mode.id}
                type="button"
                disabled={isOcrPending}
                onClick={() => handleOcrModeChange(mode.id as "local" | "ai")}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                  isActive
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {/* Radio dot */}
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  isActive ? "border-primary" : "border-muted-foreground"
                }`}>
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                {/* Icon */}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {mode.label}
                    {isActive && (
                      <span className="ml-2 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{mode.description}</p>
                </div>
              </button>
            )
          })}

          {/* Warning if AI selected but key might not be set */}
          {ocrMode === "ai" && !hasGeminiKey && (
            <div className="flex items-start gap-2.5 mt-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold">Gemini API key required</p>
                <p className="mt-0.5 text-amber-600 dark:text-amber-500">
                  You need to provide your Gemini API key below to use AI OCR.
                </p>
              </div>
            </div>
          )}

          {/* API Key Input */}
          {ocrMode === "ai" && (
            <div className="mt-4 space-y-3 pt-4 border-t border-border">
              <Label htmlFor="geminiKey">Gemini API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="geminiKey"
                  type="password"
                  placeholder={hasGeminiKey ? "••••••••••••••••••••••••••••••" : "Enter your API key..."}
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                />
                <Button 
                  onClick={handleSaveGeminiKey} 
                  disabled={isGeminiKeyPending || !geminiKey}
                >
                  {isGeminiKeyPending ? "Saving..." : "Save"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your key is stored securely in the database. Get a free key at{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  aistudio.google.com
                </a>.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
