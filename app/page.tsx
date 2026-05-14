import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <main className="min-h-dvh">
      <header className="border-b">
        <div className="mx-auto max-w-5xl py-4 flex items-center justify-between bg-black px-4 w-auto">
          <div className="flex items-center gap-2">
            
            <span className="text-yellow-500 font-serif font-extrabold w-2.5 h-5">{"Finora"}</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="#features" className="text-sm hover:text-foreground text-yellow-500 font-serif">
              Features
            </Link>
            <Link href="#pricing" className="text-sm hover:text-foreground text-yellow-500 font-serif">
              Pricing
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Open App</Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-12 md:py-16 bg-black">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-semibold text-balance text-yellow-500 font-serif">
              Beyond Tracking. Toward Perfection !
            </h1>
            <p className="leading-relaxed font-serif text-white">
                  An unified platform that tracks, analyzes, and reminds users about their recurring payments to prevent financial leakage and improve money management.
            </p>
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button className="bg-teal-600 hover:bg-teal-700">Start Free</Button>
              </Link>
              <Link href="#how-it-works" className="text-sm hover:underline text-white">
                {"How It Works"}
              </Link>
            </div>
            <ul className="text-sm text-muted-foreground grid gap-2">
              <li className="text-amber-100">{"•Users can view, add, and track all recurring payments."} </li>
              <li className="text-amber-100">•Automated alerts before due dates to prevent late fees &amp; service disruption.</li>
              <li className="text-amber-100">•Intelligent analysis of usage patterns to suggest potential cancellations.</li>
              <li className="text-amber-100">• Premium: sharing/splitting for group subscriptions</li>
            </ul>
          </div>

          <Card className="border-teal-100">
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black">Next 30 days</span>
                  <span className="text-sm font-medium">3 upcoming charges</span>
                </div>
                <div className="grid gap-3">
                  {[
                    { name: "Spotify Family", date: "Sep 12", amt: 15.99 },
                    { name: "Notion", date: "Sep 18", amt: 8.0 },
                    { name: "Netflix", date: "Sep 23", amt: 19.99 },
                  ].map((i) => (
                    <div key={i.name} className="flex items-center justify-between rounded border p-3 bg-teal-100">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{i.name}</span>
                        <span className="text-xs text-muted-foreground">Due {i.date}</span>
                      </div>
                      <span className="text-sm font-semibold">${i.amt.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded text-amber-900 text-sm p-3 bg-amber-100">
                  Saved $168 this year by cancelling 4 subscriptions.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-5xl px-4 pb-16 bg-black">
        <div className="grid gap-6 md:grid-cols-3">
          <Feature icon="🔎" title="Autodetect (soon)">
            Detect recurring charges by merchant, cadence, and price changes.
          </Feature>
          <Feature icon="⏰" title="Smart reminders">
            Email & push reminders 7d/24h before renewal with snooze & skip.
          </Feature>
          <Feature icon="📊" title="Insights">
            Monthly/annual totals, categories, and vendor trends.
          </Feature>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-5xl px-4 pb-20 bg-black">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-6 space-y-2">
              <h3 className="font-serif font-bold">Free</h3>
              <p className="text-sm font-serif text-black">Track, reminders, and insights for individuals.</p>
              <ul className="text-sm text-muted-foreground grid gap-1 mt-2">
                <li className="text-white">• Manual subscriptions</li>
                <li className="text-white">• Email reminders</li>
                <li className="text-white">• Basic analytics</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-teal-300">
            <CardContent className="p-6 space-y-2">
              <h3 className="font-serif font-bold">Premium</h3>
              <p className="text-sm font-serif text-black">Group sharing/splitting, and advanced tracking.</p>
              <ul className="text-sm text-muted-foreground grid gap-1 mt-2">
                <li className="text-white">• Group subscriptions</li>
                <li className="text-white">• Split reminders & tracking</li>
                <li className="text-white">• Price change alerts</li>
              </ul>
              <div className="pt-2">
                <Link href="/dashboard?upgrade=true">
                  <Button className="bg-teal-600 hover:bg-teal-700">Upgrade</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-muted-foreground bg-black font-serif">
          © {new Date().getFullYear()} Finora. All rights reserved.
        </div>
      </footer>
    </main>
  )
}

function Feature(props: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded border p-4">
      <div className="flex items-center gap-2">
        <span aria-hidden className="text-xl" role="img">
          {props.icon}
        </span>
        <h3 className="font-medium text-yellow-500">{props.title}</h3>
      </div>
      <p className="text-sm mt-2 text-white">{props.children}</p>
    </div>
  )
}
