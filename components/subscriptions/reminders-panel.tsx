"use client"

import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateReminders, type SubscriptionRecord } from "@/store/subscriptions"

export function RemindersPanel({
  subscriptions,
  onChanged,
}: {
  subscriptions: SubscriptionRecord[]
  onChanged?: () => void
}) {
  if (!subscriptions.length) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">Add a subscription to manage reminders.</CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {subscriptions.map((s) => (
        <Card key={s.id}>
          <CardHeader>
            <CardTitle className="text-base">{s.name}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <ToggleRow
              label="7 days before"
              checked={!!s.reminders?.before7d}
              onCheckedChange={(v) => {
                updateReminders(s.id, { before7d: v })
                onChanged?.()
              }}
            />
            <ToggleRow
              label="24 hours before"
              checked={!!s.reminders?.before24h}
              onCheckedChange={(v) => {
                updateReminders(s.id, { before24h: v })
                onChanged?.()
              }}
            />
            <ToggleRow
              label="Price change alerts"
              checked={!!s.reminders?.priceChange}
              onCheckedChange={(v) => {
                updateReminders(s.id, { priceChange: v })
                onChanged?.()
              }}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ToggleRow({
  label,
  checked,
  onCheckedChange,
}: {
  label: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}
