import { useEffect, useState } from "react"
import { Angry, Check, Frown, Meh, Smile, Laugh, Star, TriangleAlert, X } from "lucide-react"
import { reportKinds, useSubmitReport, useSubmitReview } from "../lib/trips"
import { ApiError } from "../lib/api"
import { Button } from "./ui/Button"
import { cn } from "../lib/cn"

type Mode = "review" | "report"

// RideFeedbackBanner shows a "rate your ride" prompt for a finished trip that's still inside the
// review window, and hosts the review/report modals. It renders nothing once the window has closed.
export function RideFeedbackBanner({
  tripId,
  plate,
  reviewed,
  reviewable,
}: {
  tripId: number
  plate: string
  reviewed: boolean
  reviewable: boolean
}) {
  const [mode, setMode] = useState<Mode | null>(null)

  if (!reviewable) return null

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius)] border border-danfo/35 bg-danfo/[0.07] px-4 py-3.5">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">
            {reviewed ? "Thanks for rating this ride" : "How was this ride?"}
          </p>
          <p className="text-xs text-ink-soft">
            {reviewed ? "Spotted something off? You can still report it." : "Leave a quick review or flag an issue."}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!reviewed && (
            <Button size="sm" onClick={() => setMode("review")}>
              <Star size={15} strokeWidth={2.2} />
              Review
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setMode("report")}>
            <TriangleAlert size={15} strokeWidth={2.2} />
            Report
          </Button>
        </div>
      </div>

      {mode && (
        <FeedbackModal tripId={tripId} plate={plate} mode={mode} onClose={() => setMode(null)} />
      )}
    </>
  )
}

const faces = [
  { value: 1, Icon: Angry, label: "Bad" },
  { value: 2, Icon: Frown, label: "Meh" },
  { value: 3, Icon: Meh, label: "Okay" },
  { value: 4, Icon: Smile, label: "Good" },
  { value: 5, Icon: Laugh, label: "Great" },
]

function FeedbackModal({
  tripId,
  plate,
  mode,
  onClose,
}: {
  tripId: number
  plate: string
  mode: Mode
  onClose: () => void
}) {
  const [rating, setRating] = useState(0)
  const [kind, setKind] = useState("")
  const [note, setNote] = useState("")
  const [anonymous, setAnonymous] = useState(false)
  const [done, setDone] = useState(false)

  const review = useSubmitReview(tripId)
  const report = useSubmitReport(tripId)
  const pending = review.isPending || report.isPending
  const error = (review.error ?? report.error) as ApiError | null

  // close on Escape, and lock body scroll while open
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  function finish() {
    setDone(true)
    setTimeout(onClose, 1100)
  }

  function submit() {
    if (mode === "review") {
      if (rating < 1) return
      review.mutate({ rating, body: note.trim() || undefined, anonymous }, { onSuccess: finish })
    } else {
      if (!kind) return
      report.mutate({ kind, body: note.trim() || undefined }, { onSuccess: finish })
    }
  }

  const canSubmit = mode === "review" ? rating >= 1 : !!kind

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-[var(--radius)] border border-line bg-surface p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {done ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-danfo/15 text-danfo-deep">
              <Check size={22} strokeWidth={2.5} />
            </span>
            <p className="font-display text-lg font-bold text-ink">
              {mode === "review" ? "Thanks for the review" : "Report sent"}
            </p>
            <p className="text-sm text-ink-soft">
              {mode === "review" ? "It helps other riders pick a good danfo." : "Our team will take a look."}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-extrabold tracking-tight text-ink">
                  {mode === "review" ? "Rate your ride" : "Report an issue"}
                </h2>
                <p className="text-xs text-ink-faint">{plate}</p>
              </div>
              <button
                onClick={onClose}
                className="-mr-1 -mt-1 rounded-full p-1.5 text-ink-faint transition-colors hover:bg-paper hover:text-ink"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {mode === "review" ? (
              <>
                <div className="mt-5 flex items-center justify-between">
                  {faces.map(({ value, Icon, label }) => {
                    const selected = rating === value
                    return (
                      <button
                        key={value}
                        onClick={() => setRating(value)}
                        className="flex flex-col items-center gap-1.5"
                        aria-label={label}
                      >
                        <Icon
                          size={32}
                          strokeWidth={2}
                          className={cn(
                            "transition-all",
                            selected ? "scale-110 text-danfo-deep" : "text-ink/25 hover:text-ink/50",
                          )}
                        />
                        <span
                          className={cn(
                            "text-[10px] font-semibold uppercase tracking-wide",
                            selected ? "text-ink" : "text-transparent",
                          )}
                        >
                          {label}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  maxLength={280}
                  rows={3}
                  placeholder="Add a note (optional)"
                  className="mt-4 w-full resize-none rounded-[var(--radius)] border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-danfo/50 focus:outline-none"
                />

                <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(event) => setAnonymous(event.target.checked)}
                    className="h-4 w-4 accent-danfo"
                  />
                  Post anonymously
                </label>
              </>
            ) : (
              <>
                <div className="mt-4 space-y-1.5">
                  {reportKinds.map(({ value, label }) => (
                    <label
                      key={value}
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-[var(--radius)] border px-3 py-2.5 text-sm transition-colors",
                        kind === value
                          ? "border-danfo/50 bg-danfo/[0.07] text-ink"
                          : "border-line text-ink-soft hover:bg-paper",
                      )}
                    >
                      <input
                        type="radio"
                        name="report-kind"
                        value={value}
                        checked={kind === value}
                        onChange={() => setKind(value)}
                        className="h-4 w-4 accent-danfo"
                      />
                      {label}
                    </label>
                  ))}
                </div>

                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="What happened? (optional)"
                  className="mt-3 w-full resize-none rounded-[var(--radius)] border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-danfo/50 focus:outline-none"
                />
              </>
            )}

            {error && <p className="mt-3 text-sm text-red-600">{error.message}</p>}

            <div className="mt-5 flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={onClose} disabled={pending}>
                Cancel
              </Button>
              <Button size="sm" onClick={submit} disabled={!canSubmit || pending}>
                {pending ? "Sending…" : mode === "review" ? "Submit review" : "Send report"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
