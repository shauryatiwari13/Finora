"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  addGroup,
  addMemberToGroup,
  linkSubscriptionToGroup,
  removeGroup,
  type GroupRecord,
  type SubscriptionRecord,
} from "@/store/subscriptions"

export function GroupSection({
  groups,
  subscriptions,
  onChanged,
}: {
  groups: GroupRecord[]
  subscriptions: SubscriptionRecord[]
  onChanged?: () => void
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <CreateGroup onChanged={onChanged} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Groups</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {!groups.length && (
            <div className="text-sm text-muted-foreground">
              Create a group to split subscriptions with friends or family.
            </div>
          )}
          {groups.map((g) => (
            <GroupRow key={g.id} group={g} subscriptions={subscriptions} onChanged={onChanged} />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function CreateGroup({ onChanged }: { onChanged?: () => void }) {
  const [name, setName] = useState("")
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">New group</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="grid gap-2">
          <Label htmlFor="gname">Group name</Label>
          <Input id="gname" placeholder="Roommates" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <Button
          className="bg-teal-600 hover:bg-teal-700"
          onClick={() => {
            if (!name) return
            addGroup({ name })
            setName("")
            onChanged?.()
          }}
        >
          Create group
        </Button>
      </CardContent>
    </Card>
  )
}

function GroupRow({
  group,
  subscriptions,
  onChanged,
}: {
  group: GroupRecord
  subscriptions: SubscriptionRecord[]
  onChanged?: () => void
}) {
  const [memberEmail, setMemberEmail] = useState("")
  const [subId, setSubId] = useState("")

  // Calculate per-member split for linked subs (equal split)
  const linkedSubs = subscriptions.filter((s) => group.subscriptionIds?.includes(s.id))
  const total = linkedSubs.reduce((a, s) => a + s.amount, 0)
  const members = group.members ?? []
  const perMember = members.length ? total / members.length : 0

  return (
    <div className="rounded border p-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">{group.name}</div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            removeGroup(group.id)
            onChanged?.()
          }}
        >
          Delete
        </Button>
      </div>

      <div className="mt-2 grid gap-2">
        <div className="text-sm text-muted-foreground">Members</div>
        <div className="flex flex-wrap gap-2">
          {members.map((m) => (
            <Badge key={m} variant="outline">
              {m}
            </Badge>
          ))}
          {!members.length && <div className="text-xs text-muted-foreground">No members yet.</div>}
        </div>
        <div className="grid gap-2 md:grid-cols-[1fr_auto]">
          <Input placeholder="member@email.com" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} />
          <Button
            variant="outline"
            onClick={() => {
              if (!memberEmail) return
              addMemberToGroup(group.id, memberEmail)
              setMemberEmail("")
              onChanged?.()
            }}
          >
            Add member
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <div className="text-sm text-muted-foreground">Link subscription</div>
        <div className="grid gap-2 md:grid-cols-[1fr_auto]">
          <select
            className="h-9 rounded border bg-background px-3 text-sm"
            value={subId}
            onChange={(e) => setSubId(e.target.value)}
          >
            <option value="">Choose subscription</option>
            {subscriptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (${s.amount.toFixed(2)})
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            onClick={() => {
              if (!subId) return
              linkSubscriptionToGroup(group.id, subId)
              setSubId("")
              onChanged?.()
            }}
          >
            Link
          </Button>
        </div>
      </div>

      <div className="mt-4 rounded text-amber-900 p-3 text-sm bg-amber-100">
        Equal split preview: {members.length ? `$${perMember.toFixed(2)} per member` : "Add members to see split"}
      </div>
    </div>
  )
}
