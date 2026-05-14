"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { SubscriptionRecord } from "@/store/subscriptions"

export function AnalyticsCards({ subscriptions }: { subscriptions: SubscriptionRecord[] }) {
  const monthly = sumCadence(subscriptions, "monthly")
  const annual = sumCadence(subscriptions, "annual")
  const weekly = sumCadence(subscriptions, "weekly")
  const totalMonthlyEquivalent = monthly + annual / 12 + (weekly * 52) / 12

  const upcoming30 = subscriptions.filter((s) => {
    const d = new Date(s.nextDueAt)
    const now = new Date()
    return d >= now && d.getTime() - now.getTime() <= 1000 * 60 * 60 * 24 * 30
  }).length

  return (
    <div className="grid gap-4 md:grid-cols-4 font-serif font-bold size-auto">
      <Stat label="Monthly spend" value={`$${monthly.toFixed(2)}`} />
      <Stat label="Annual spend" value={`$${annual.toFixed(2)}`} />
      <Stat label="Weekly spend" value={`$${weekly.toFixed(2)}`} />
      <Stat label="Monthly equivalent" value={`$${totalMonthlyEquivalent.toFixed(2)}`} />
      <Stat label="Upcoming (30d)" value={String(upcoming30)} />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs font-serif text-white">{label}</div>
        <div className="text-xs text-black size-px my-0">{value}</div>
      </CardContent>
    </Card>
  )
}

function sumCadence(list: SubscriptionRecord[], cadence: SubscriptionRecord["cadence"]) {
  return list.filter((s) => s.cadence === cadence).reduce((acc, s) => acc + s.amount, 0)
}
