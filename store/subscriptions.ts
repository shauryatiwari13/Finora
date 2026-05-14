"use client"

import { nextCycleDate } from "./date-utils"

export type SubscriptionRecord = {
  id: string
  name: string
  amount: number
  cadence: "weekly" | "monthly" | "annual"
  nextDueAt: string
  status: "active" | "canceled"
  reminders?: {
    before7d?: boolean
    before24h?: boolean
    priceChange?: boolean
  }
}

export type GroupRecord = {
  id: string
  name: string
  members?: string[]
  subscriptionIds?: string[]
}

type DB = {
  subscriptions: SubscriptionRecord[]
  groups: GroupRecord[]
}

const KEY = "flowguard-db-v1"

function read(): DB {
  if (typeof window === "undefined") return { subscriptions: [], groups: [] }
  const raw = localStorage.getItem(KEY)
  if (!raw) return { subscriptions: [], groups: [] }
  try {
    return JSON.parse(raw) as DB
  } catch {
    return { subscriptions: [], groups: [] }
  }
}

function write(db: DB) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(db))
}

export function loadAll(): DB {
  return read()
}

export function seedDemoIfEmpty() {
  const db = read()
  if (db.subscriptions.length) return false
  const today = new Date()
  const iso = (d: Date) => d.toISOString()
  const s1: SubscriptionRecord = {
    id: cryptoRandom(),
    name: "Spotify Family",
    amount: 15.99,
    cadence: "monthly",
    nextDueAt: iso(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12)),
    status: "active",
    reminders: { before7d: true, before24h: true, priceChange: true },
  }
  const s2: SubscriptionRecord = {
    id: cryptoRandom(),
    name: "Notion",
    amount: 8,
    cadence: "monthly",
    nextDueAt: iso(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 18)),
    status: "active",
    reminders: { before7d: true, before24h: false },
  }
  const s3: SubscriptionRecord = {
    id: cryptoRandom(),
    name: "Netflix",
    amount: 19.99,
    cadence: "monthly",
    nextDueAt: iso(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 23)),
    status: "active",
    reminders: { before7d: true, before24h: true },
  }
  const seeded: DB = { subscriptions: [s1, s2, s3], groups: [] }
  write(seeded)
  return true
}

export function createSubscription(input: Omit<SubscriptionRecord, "id">) {
  const db = read()
  db.subscriptions.unshift({ ...input, id: cryptoRandom() })
  write(db)
}

export function deleteSubscription(id: string) {
  const db = read()
  db.subscriptions = db.subscriptions.filter((s) => s.id !== id)
  // remove from groups
  db.groups = db.groups.map((g) => ({
    ...g,
    subscriptionIds: (g.subscriptionIds ?? []).filter((sid) => sid !== id),
  }))
  write(db)
}

export function cancelSubscription(id: string) {
  const db = read()
  db.subscriptions = db.subscriptions.map((s) => (s.id === id ? { ...s, status: "canceled" } : s))
  write(db)
}

export function markPaid(id: string) {
  const db = read()
  db.subscriptions = db.subscriptions.map((s) => {
    if (s.id !== id) return s
    return { ...s, nextDueAt: nextCycleDate(s.nextDueAt, s.cadence) }
  })
  write(db)
}

export function updateReminders(id: string, patch: Partial<NonNullable<SubscriptionRecord["reminders"]>>) {
  const db = read()
  db.subscriptions = db.subscriptions.map((s) =>
    s.id === id ? { ...s, reminders: { ...(s.reminders ?? {}), ...patch } } : s,
  )
  write(db)
}

// Groups (Premium)

export function addGroup(input: { name: string }) {
  const db = read()
  db.groups.push({ id: cryptoRandom(), name: input.name, members: [], subscriptionIds: [] })
  write(db)
}

export function removeGroup(id: string) {
  const db = read()
  db.groups = db.groups.filter((g) => g.id !== id)
  write(db)
}

export function addMemberToGroup(groupId: string, email: string) {
  const db = read()
  db.groups = db.groups.map((g) => {
    if (g.id !== groupId) return g
    const set = new Set([...(g.members ?? []), email])
    return { ...g, members: Array.from(set) }
  })
  write(db)
}

export function linkSubscriptionToGroup(groupId: string, subscriptionId: string) {
  const db = read()
  db.groups = db.groups.map((g) => {
    if (g.id !== groupId) return g
    const set = new Set([...(g.subscriptionIds ?? []), subscriptionId])
    return { ...g, subscriptionIds: Array.from(set) }
  })
  write(db)
}

function cryptoRandom() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID()
  return Math.random().toString(36).slice(2)
}
