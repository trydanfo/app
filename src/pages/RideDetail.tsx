import { Link, useNavigate, useParams } from "react-router-dom"
import { useTrip } from "../lib/trips"
import { Shell } from "../components/Shell"
import { GridDecor } from "../components/GridDecor"
import { RouteMap, parsePolyline } from "../components/RouteMap"
import { RideFeedbackBanner } from "../components/RideFeedbackBanner"
import { cn } from "../lib/cn"

function formatDateTime(iso: string) {
  const date = new Date(iso)
  const day = date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })
  const time = date
    .toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true })
    .toLowerCase()
  return `${day} · ${time}`
}

function formatDistance(meters?: number) {
  if (meters == null) return "—"
  return meters < 1000 ? `${meters} m` : `${(meters / 1000).toFixed(1)} km`
}

function formatDuration(startIso: string, endIso?: string) {
  if (!endIso) return "—"
  const minutes = Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000)
  if (minutes < 1) return "< 1 min"
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours}h ${rest}m` : `${hours}h`
}

const activeRideStatuses = ["boarded", "tracking", "paused"]
function statusChip(status: string) {
  if (activeRideStatuses.includes(status)) return { label: "live", className: "border-danfo/40 bg-danfo/10 text-danfo-deep" }
  if (status === "completed") return { label: "completed", className: "border-green-600/25 bg-green-600/10 text-green-700" }
  return { label: status, className: "border-line bg-ink/5 text-ink-faint" }
}

export function RideDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const trip = useTrip(id ?? "")

  if (trip.isLoading) {
    return (
      <Shell>
        <div className="flex min-h-[60dvh] items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-danfo" />
        </div>
      </Shell>
    )
  }
  if (!trip.data) {
    return (
      <Shell>
        <div className="flex min-h-[60dvh] items-center justify-center px-6 text-sm text-ink-soft">
          We couldn&rsquo;t find this ride.
        </div>
      </Shell>
    )
  }

  const data = trip.data
  const points = parsePolyline(data.routePolyline)
  const chip = statusChip(data.status)

  return (
    <Shell>
      <div className="relative mx-auto max-w-2xl overflow-hidden px-5 pb-20">
        <GridDecor className="-right-24 top-6" />
        <GridDecor className="-left-24 bottom-10" />

        <div className="relative z-10 pt-7">
          <button
            onClick={() => navigate(-1)}
            className="text-xs font-medium text-ink-faint transition-colors hover:text-ink"
          >
            ← back
          </button>

          <div className="mt-4 flex items-start justify-between gap-4">
            <Link
              to={`/v/${data.code}`}
              className="font-display text-3xl font-extrabold leading-none tracking-tight text-ink transition-colors hover:text-danfo-deep"
            >
              {data.plate}
            </Link>
            <span
              className={cn(
                "shrink-0 rounded-sm border px-2 py-0.5 text-[11px] font-bold capitalize",
                chip.className,
              )}
            >
              {chip.label}
            </span>
          </div>
          <p className="mt-2 text-sm text-ink-soft">{formatDateTime(data.startedAt)}</p>
          <Link
            to={`/v/${data.code}`}
            className="mt-1 inline-block text-xs font-medium text-danfo-deep hover:underline"
          >
            view this danfo →
          </Link>

          {data.reviewable && (
            <div className="mt-5">
              <RideFeedbackBanner
                tripId={data.id}
                plate={data.plate}
                reviewed={data.reviewed}
                reviewable={data.reviewable}
              />
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Stat label="Distance" value={formatDistance(data.distanceMeters)} />
            <Stat label="Duration" value={formatDuration(data.startedAt, data.endedAt)} />
          </div>

          <div className="mt-5">
            <RouteMap points={points} />
          </div>
        </div>
      </div>
    </Shell>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius)] border border-line bg-surface px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">{label}</div>
      <div className="mt-1 font-display text-xl font-bold text-ink">{value}</div>
    </div>
  )
}
