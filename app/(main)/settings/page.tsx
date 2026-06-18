"use client"

import { useState, useTransition } from "react"
import { useSession } from "next-auth/react"
import { updateCurrency } from "@/modules/settings/actions"
import { toast } from "gooey-toast"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [currency, setCurrency] = useState(session?.user?.currency || "USD")
  const [isPending, startTransition] = useTransition()

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateCurrency(currency)
        await update({ currency }) // Update NextAuth session
        toast.success({ title: "Settings saved" })
      } catch (error) {
        toast.error({ title: "Failed to save settings" })
      }
    })
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Update your application preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currency">Base Currency</Label>
            <Select value={currency} onValueChange={(val) => setCurrency(val as string)}>
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency">
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
              This currency will be used across all your dashboards and reports.
            </p>
          </div>

          <Button onClick={handleSave} disabled={isPending || currency === session?.user?.currency}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
