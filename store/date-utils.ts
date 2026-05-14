export function formatIso(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

export function nextCycleDate(iso: string, cadence: "weekly" | "monthly" | "annual") {
  const d = new Date(iso)
  const n = new Date(d)
  if (cadence === "weekly") n.setDate(n.getDate() + 7)
  if (cadence === "monthly") n.setMonth(n.getMonth() + 1)
  if (cadence === "annual") n.setFullYear(n.getFullYear() + 1)
  return n.toISOString()
}
