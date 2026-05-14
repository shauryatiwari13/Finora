"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createSubscription } from "@/store/subscriptions"

export function SubscriptionForm({ onSaved }: { onSaved?: () => void }) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [cadence, setCadence] = useState<"monthly" | "annual" | "weekly">("monthly")
  const [nextDue, setNextDue] = useState("")

  const canSave = name && amount && nextDue

  return (
    <form
      className="grid gap-4 md:grid-cols-4"
      onSubmit={(e) => {
        e.preventDefault()
        if (!canSave) return
        createSubscription({
          name,
          amount: Number.parseFloat(amount),
          cadence,
          nextDueAt: new Date(nextDue).toISOString(),
          status: "active",
          reminders: { before7d: true, before24h: true },
        })
        setName("")
        setAmount("")
        setNextDue("")
        onSaved?.()
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Netflix" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="amount">Amount (USD)</Label>
        <Input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="9.99"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label>Cadence</Label>
        <Select value={cadence} onValueChange={(v: any) => setCadence(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select cadence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="annual">Annual</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="nextDue">Next due</Label>
        <Input id="nextDue" type="date" value={nextDue} onChange={(e) => setNextDue(e.target.value)} />
      </div>
      <div className="md:col-span-4">
        <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={!canSave}>
          Add subscription
        </Button>
      </div>
    </form>
  )
}
