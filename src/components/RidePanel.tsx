import { useEffect, useState } from "react"
import { Share2, Check, Square } from "lucide-react"
import { useEndTrip, useShareTrip, liveShareUrl } from "../lib/trips"
import { useRideTracking } from "../lib/tracking"
import { Button } from "./ui/Button"
import { PointMap } from "./PointMap"
import { cn } from "../lib/cn"

function formatElapsed(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => n.toString().padStart(2, "0")
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

export function RidePanel({
  trip,
  className,
}: {
  trip: { id: number; startedAt: string }
  className?: string
}) {
  const endTrip = useEndTrip()
  const share = useShareTrip()
  const { geoError, fix } = useRideTracking(trip.id, true)
  const [now, setNow] = useState(Date.now())
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  function shareLink() {
    share.mutate(trip.id, {
      onSuccess: async ({ shareToken }) => {
        const url = liveShareUrl(shareToken)
        if (navigator.share) {
          try {
            await navigator.share({ title: "Track my danfo ride", url })
          } catch {
            // user dismissed the share sheet
          }
          return
        }
        try {
          await navigator.clipboard.writeText(url)
          setCopied(true)
          setTimeout(() => setCopied(false), 2200)
        } catch {
          // clipboard blocked
        }
      },
    })
  }

  const elapsed = formatElapsed(now - new Date(trip.startedAt).getTime())

  return (
    <div className={cn("rounded-[var(--radius)] border border-line bg-surface p-5", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {fix && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danfo opacity-70" />
            )}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-danfo-deep" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-soft">
            {fix ? "Tracking" : "Getting location"}
          </span>
        </span>
        <span className="font-display text-2xl font-extrabold tabular-nums tracking-tight">{elapsed}</span>
      </div>

      <div className="mt-4">
        {fix ? (
          <PointMap lat={fix.lat} lng={fix.lng} height="200px" />
        ) : (
          <div className="flex h-[200px] items-center justify-center rounded-[var(--radius)] border border-dashed border-line text-sm text-ink-faint">
            Waiting for your location…
          </div>
        )}
      </div>

      {geoError && (
        <p className="mt-3 rounded-[var(--radius)] border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-700">
          {geoError}
        </p>
      )}

      <div className="mt-4 flex gap-2.5">
        <Button variant="outline" className="flex-1" disabled={share.isPending} onClick={shareLink}>
          {copied ? <Check size={16} /> : <Share2 size={16} />}
          {copied ? "Link copied" : "Share live"}
        </Button>
        <Button
          className="flex-1 bg-red-500 text-white shadow-none hover:bg-red-600"
          disabled={endTrip.isPending}
          onClick={() => endTrip.mutate(trip.id)}
        >
          <Square size={13} className="fill-current" />
          {endTrip.isPending ? "Ending…" : "End ride"}
        </Button>
      </div>
    </div>
  )
}
