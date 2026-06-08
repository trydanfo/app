import { useState } from "react"
import { useParams } from "react-router-dom"
import { Bus } from "lucide-react"
import { useVehicleByCode, useVehicleReviews, REVIEWS_PAGE_SIZE } from "../lib/vehicles"
import { useCurrentUser, signIn } from "../lib/auth"
import { ApiError } from "../lib/api"
import { Shell } from "../components/Shell"
import { StarRating } from "../components/StarRating"
import { StatusPill } from "../components/StatusPill"
import { Button } from "../components/ui/Button"
import { Pagination } from "../components/Pagination"
import { GridDecor } from "../components/GridDecor"
import { cn } from "../lib/cn"

function formatDateTime(iso: string) {
  const date = new Date(iso)
  const day = date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  const time = date
    .toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true })
    .toLowerCase()
  return `${day} · ${time}`
}

export function Vehicle() {
  const { code } = useParams<{ code: string }>()
  const vehicle = useVehicleByCode(code ?? "")
  const [page, setPage] = useState(0)
  const reviews = useVehicleReviews(code ?? "", page)
  const { data: user } = useCurrentUser()

  if (vehicle.isLoading) {
    return (
      <Shell>
        <div className="flex min-h-[60dvh] items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-danfo" />
        </div>
      </Shell>
    )
  }

  if (vehicle.error instanceof ApiError && vehicle.error.status === 404) {
    return (
      <Shell>
        <div className="mx-auto flex min-h-[60dvh] max-w-md flex-col items-center justify-center px-6 text-center">
          <p className="font-display text-2xl font-bold tracking-tight">Not a danfo we know.</p>
          <p className="mt-2 text-sm text-ink-soft">
            The code <span className="font-semibold text-ink">{code}</span> isn&rsquo;t registered yet.
            Double-check the sticker, or scan again.
          </p>
        </div>
      </Shell>
    )
  }

  const data = vehicle.data
  if (!data) {
    return (
      <Shell>
        <div className="flex min-h-[60dvh] items-center justify-center px-6 text-sm text-ink-soft">
          Couldn&rsquo;t load this danfo. Try again.
        </div>
      </Shell>
    )
  }

  const average = reviews.data?.average ?? 0
  const count = reviews.data?.count ?? 0
  const totalPages = Math.ceil(count / REVIEWS_PAGE_SIZE)

  function board() {
    if (!user) {
      signIn()
      return
    }
    // NOTE: POST /app/trips boarding (and the swap to "Share ride") is wired next
  }

  return (
    <Shell>
      <div className="relative mx-auto max-w-2xl overflow-hidden px-5 pb-20">
        <GridDecor className="-right-24 top-6" />
        <GridDecor className="-left-24 bottom-10" />

        <div className="relative z-10">
          {/* identity left, action right */}
          <div className="grid gap-6 pt-9 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="rise" style={{ animationDelay: "40ms" }}>
              {data.plateState && (
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
                  {data.plateState}
                </p>
              )}
              <h1 className="font-display text-3xl font-extrabold leading-none tracking-tight text-ink">
                {data.plateNumber}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2.5">
                <span className="text-sm font-medium tracking-wide text-ink-faint">{data.publicCode}</span>
                <StatusPill status={data.status} />
              </div>
              {count > 0 && (
                <div className="mt-2.5 flex items-center gap-2">
                  <StarRating value={Math.round(average)} size={15} />
                  <span className="text-sm text-ink-soft">
                    {average.toFixed(1)} · {count} review{count === 1 ? "" : "s"}
                  </span>
                </div>
              )}
            </div>

            <div className="rise sm:justify-self-end sm:text-right" style={{ animationDelay: "120ms" }}>
              <Button size="md" onClick={board}>
                <Bus size={17} strokeWidth={2.2} />
                Board this danfo
              </Button>
              <p className="mt-2 text-xs text-ink-faint">
                {user ? "Starts a tracked trip." : "Sign in to board."}
              </p>
            </div>
          </div>

          {/* recent reviews */}
          <section className="rise mt-12" style={{ animationDelay: "200ms" }}>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">Recent reviews</h2>

            {reviews.data && reviews.data.reviews.length > 0 ? (
              <ul className="mt-3 space-y-2.5">
                {reviews.data.reviews.map((review, index) => (
                  <li key={index} className="rounded-[var(--radius)] border border-line bg-surface p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-baseline gap-1.5">
                        <span
                          className={cn(
                            "text-[13px] font-medium text-ink",
                            review.anonymous && "select-none blur-[3px]",
                          )}
                        >
                          {review.reviewer}
                        </span>
                        <span className="text-ink-faint/50">·</span>
                        <span className="truncate text-xs font-normal text-ink-faint">
                          {formatDateTime(review.createdAt)}
                        </span>
                      </div>
                      <StarRating value={review.rating} size={14} />
                    </div>
                    {review.body && (
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{review.body}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 rounded-[var(--radius)] border border-dashed border-line px-4 py-9 text-center text-sm text-ink-faint">
                No reviews yet. Be the first to rate a ride on this danfo.
              </p>
            )}

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </section>
        </div>
      </div>
    </Shell>
  )
}
