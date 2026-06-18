"use client"

import { useState, useTransition, useEffect } from "react"
import { useSession } from "next-auth/react"
import { updateCurrency, updateLanguage } from "@/modules/settings/actions"
import { toast } from "gooey-toast"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/components/providers/i18n-provider"

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

export default function SettingsPage() {
  const { t } = useTranslation("settings")
  const { data: session, update } = useSession()
  const [currency, setCurrency] = useState(session?.user?.currency || "USD")
  const [language, setLanguage] = useState(session?.user?.language || "en")
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (session?.user) {
      if (session.user.currency) setCurrency(session.user.currency)
      if (session.user.language) setLanguage(session.user.language)
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
        await update({ currency, language }) // Update NextAuth session
        toast.success({ title: t("success") })
        //wait 1 sec
        await new Promise((resolve) => setTimeout(resolve, 1000))
        window.location.reload()
      } catch (error) {
        toast.error({ title: t("error") })
      }
    })
  }

  const hasChanges = currency !== session?.user?.currency || language !== session?.user?.language

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-6">{t("title")}</h1>

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
            <p className="text-sm text-muted-foreground">
              {t("currency_description")}
            </p>
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
            <p className="text-sm text-muted-foreground">
              {t("language_description")}
            </p>
          </div>

          <Button onClick={handleSave} disabled={isPending || !hasChanges}>
            {isPending ? t("saving") : t("save")}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
