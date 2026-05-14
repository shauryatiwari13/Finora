"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { SubscriptionForm } from "@/components/subscriptions/subscription-form"
import { SubscriptionList } from "@/components/subscriptions/subscription-list"
import { AnalyticsCards } from "@/components/subscriptions/analytics-cards"
import { RemindersPanel } from "@/components/subscriptions/reminders-panel"
import { GroupSection } from "@/components/groups/group-section"
import { loadAll, seedDemoIfEmpty, type SubscriptionRecord } from "@/store/subscriptions"

const fetcher = async () => loadAll()

export default function DashboardPage() {
  const params = useSearchParams()
  const upgrade = params.get("upgrade") === "true"

  const { data, mutate } = useSWR<{
    subscriptions: SubscriptionRecord[]
    groups: ReturnType<typeof loadAll>["groups"]
  }>("subscriptions", fetcher, { revalidateOnFocus: false })

  useEffect(() => {
    const seeded = seedDemoIfEmpty()
    if (seeded) mutate()
  }, [mutate])

  const subscriptions = data?.subscriptions ?? []
  const groups = data?.groups ?? []

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-6 bg-black">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          
          <h1 className="text-xl font-bold font-serif text-yellow-500">Finora Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-teal-300 text-teal-700">
            Premium
          </Badge>
          <Button className="bg-teal-600 hover:bg-teal-700">Upgrade</Button>
        </div>
      </header>

      <AnalyticsCards subscriptions={subscriptions} />

      <Tabs defaultValue={upgrade ? "groups" : "subscriptions"} className="space-y-4">
        <TabsList>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="groups">Groups (Premium)</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add a subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <SubscriptionForm onSaved={() => mutate()} />
            </CardContent>
          </Card>

          <SubscriptionList subscriptions={subscriptions} onChanged={() => mutate()} />
        </TabsContent>

        <TabsContent value="reminders">
          <RemindersPanel subscriptions={subscriptions} onChanged={() => mutate()} />
        </TabsContent>

        <TabsContent value="groups">
          <GroupSection groups={groups} subscriptions={subscriptions} onChanged={() => mutate()} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
