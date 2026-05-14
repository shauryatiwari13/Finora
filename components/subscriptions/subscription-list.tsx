"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatIso, nextCycleDate } from "@/store/date-utils"
import { cancelSubscription, deleteSubscription, markPaid, type SubscriptionRecord } from "@/store/subscriptions"

export function SubscriptionList({
  subscriptions,
  onChanged,
}: {
  subscriptions: SubscriptionRecord[]
  onChanged?: () => void
}) {
  if (!subscriptions.length) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          No subscriptions yet. Add your first one above.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {subscriptions.map((s) => (
        <Card key={s.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">{s.name}</CardTitle>
            <Badge variant={s.status === "active" ? "default" : "secondary"}>{s.status}</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-black">Amount</span>
              <span className="font-medium">${s.amount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-black">Cadence</span>
              <span className="font-medium capitalize">{s.cadence}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-black">Next due</span>
              <span className={cn("font-medium", isDueSoon(s.nextDueAt) && "text-amber-700")}>
                {formatIso(s.nextDueAt)}
              </span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  markPaid(s.id)
                  onChanged?.()
                }}
              >
                Mark paid
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  cancelSubscription(s.id)
                  onChanged?.()
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  deleteSubscription(s.id)
                  onChanged?.()
                }}
              >
                Delete
              </Button>
            </div>
            <div className="text-xs text-amber-100">
              Next cycle preview: {formatIso(nextCycleDate(s.nextDueAt, s.cadence))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function isDueSoon(iso: string) {
  const now = new Date()
  const dt = new Date(iso)
  const diff = dt.getTime() - now.getTime()
  return diff < 1000 * 60 * 60 * 24 * 7 // < 7 days
}
