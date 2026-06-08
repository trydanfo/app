import { useState } from "react"
import { Link } from "react-router-dom"
import { QrCode, Bus } from "lucide-react"
import { useCurrentUser } from "../lib/auth"
import { useActiveTrip, useTrips, RIDES_PAGE_SIZE } from "../lib/trips"
import { Shell } from "../components/Shell"
import { Button } from "../components/ui/Button"
import { GridDecor } from "../components/GridDecor"
import { RideCard } from "../components/RideCard"

function greeting(hour: number) {
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export function Dashboard() {
  const { data: user } = useCurrentUser()
  const activeTripQuery = useActiveTrip()
  const active = activeTripQuery.data?.active ? activeTripQuery.data : null

  const [page, setPage] = useState(0)
  const trips = useTrips(page)
  const rides = trips.data ?? []
  const hasNext = rides.length === RIDES_PAGE_SIZE

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

        {active && (
          <Link
            to={`/v/${active.code}`}
            className="rise relative z-10 mt-7 flex items-center justify-between gap-4 rounded-[1.1rem] border border-danfo/40 bg-danfo/10 px-5 py-4 transition-colors hover:bg-danfo/15"
            style={{ animationDelay: "160ms" }}
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danfo opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-danfo-deep" />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-danfo-deep">On a ride</p>
                <p className="font-display text-lg font-bold leading-tight text-ink">{active.plate}</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-danfo-deep">Resume →</span>
          </Link>
        )}

        <section className="rise relative z-10 mt-10" style={{ animationDelay: "200ms" }}>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">Your rides</h2>

          {trips.isLoading && (
            <div className="mt-3 flex justify-center py-10">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-danfo" />
            </div>
          )}

          {!trips.isLoading && rides.length === 0 && page === 0 && (
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
          )}

          {rides.length > 0 && (
            <ul className="mt-3 space-y-2.5">
              {rides.map((ride) => (
                <RideCard key={ride.id} ride={ride} showPlate />
              ))}
            </ul>
          )}

          {(page > 0 || hasNext) && (
            <div className="mt-4 flex items-center justify-between">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <span className="text-xs text-ink-faint">Page {page + 1}</span>
              <Button variant="outline" size="sm" disabled={!hasNext} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          )}
        </section>
      </div>
    </Shell>
  )
}

