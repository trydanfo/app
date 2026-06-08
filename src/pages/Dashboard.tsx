import { QrCode, Bus } from "lucide-react"
import { useCurrentUser } from "../lib/auth"
import { Shell } from "../components/Shell"
import { Button } from "../components/ui/Button"
import { GridDecor } from "../components/GridDecor"

function greeting(hour: number) {
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export function Dashboard() {
  const { data: user } = useCurrentUser()
  const now = new Date()
  const firstName = user?.firstName || "rider"
  const dayLabel = now
    .toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })
    .toLowerCase()

  return (
    <Shell>
      <div className="relative mx-auto min-h-[100dvh] max-w-2xl overflow-hidden px-5 pb-20">
        <GridDecor className="-right-16 top-2" />
        <GridDecor className="-left-24 top-1/3" />
        <GridDecor className="-right-24 top-2/3" />
        <GridDecor className="-left-16 bottom-10" />

        <div className="relative z-10 flex items-start justify-between gap-4 pt-7">
          <div className="rise" style={{ animationDelay: "40ms" }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-faint">{dayLabel}</p>
            <h1 className="mt-2 font-display text-[2rem] font-extrabold leading-[1.05] tracking-tight">
              {greeting(now.getHours())},
              <br />
              {firstName}
              <span className="text-danfo">.</span>
            </h1>
          </div>
          <Button className="rise mt-1 shrink-0" style={{ animationDelay: "120ms" }}>
            <QrCode size={18} strokeWidth={2.2} />
            Scan for tag
          </Button>
        </div>

        <section className="rise relative z-10 mt-10" style={{ animationDelay: "200ms" }}>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">Your rides</h2>
          <div className="mt-3 flex flex-col items-center gap-3 rounded-[1.1rem] border border-dashed border-line bg-surface/60 px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper text-ink-faint">
              <Bus size={22} strokeWidth={2} />
            </span>
            <p className="text-sm leading-relaxed text-ink-soft">
              No rides yet. Scan a danfo to take
              <br />
              your first tracked trip.
            </p>
          </div>
        </section>
      </div>
    </Shell>
  )
}
