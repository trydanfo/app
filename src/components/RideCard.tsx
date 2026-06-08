import { Link } from "react-router-dom"
import { cn } from "../lib/cn"
import type { TripListItem } from "../lib/trips"

const activeRideStatuses = ["boarded", "tracking", "paused"]

function statusChip(status: string) {
  if (activeRideStatuses.includes(status)) return { label: "live", className: "border-danfo/40 bg-danfo/10 text-danfo-deep" }
  if (status === "completed") return { label: "completed", className: "border-green-600/25 bg-green-600/10 text-green-700" }
  return { label: status, className: "border-line bg-ink/5 text-ink-faint" }
}

function timeOf(iso: string) {
  return new Date(iso)
    .toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true })
    .toLowerCase()
}

function dateOf(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

function distanceOf(meters?: number) {
  if (meters == null) return null
  return meters < 1000 ? `${meters} m` : `${(meters / 1000).toFixed(1)} km`
}

function durationOf(startIso: string, endIso?: string) {
  if (!endIso) return null
  const minutes = Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000)
  if (minutes < 1) return "< 1 min"
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours}h ${rest}m` : `${hours}h`
}

export function RideCard({ ride, showPlate = false }: { ride: TripListItem; showPlate?: boolean }) {
  const chip = statusChip(ride.status)
  // an in-progress ride resumes on the vehicle page; a finished one opens its detail
  const to = activeRideStatuses.includes(ride.status) ? `/v/${ride.code}` : `/rides/${ride.id}`

  const start = timeOf(ride.startedAt)
  const end = ride.endedAt ? timeOf(ride.endedAt) : null
  const parts = [
    showPlate ? dateOf(ride.startedAt) : null,
    end ? `${start} → ${end}` : `from ${start}`,
    durationOf(ride.startedAt, ride.endedAt),
    distanceOf(ride.distanceMeters),
  ].filter(Boolean)

  return (
    <li>
      <Link
        to={to}
        className="block rounded-[var(--radius)] border border-line bg-surface px-4 py-3.5 transition-colors hover:bg-paper"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="font-display text-base font-bold leading-tight text-ink">
            {showPlate ? ride.plate : dateOf(ride.startedAt)}
          </span>
          <span
            className={cn(
              "shrink-0 rounded-sm border px-2 py-0.5 text-[11px] font-bold capitalize",
              chip.className,
            )}
          >
            {chip.label}
          </span>
        </div>
        <div className="mt-1.5 text-xs text-ink-faint">{parts.join("  ·  ")}</div>
      </Link>
    </li>
  )
}
