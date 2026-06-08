import { cn } from "../lib/cn"

const styles: Record<string, string> = {
  active: "border-green-600/25 bg-green-600/10 text-green-700",
  suspended: "border-amber-500/30 bg-amber-500/10 text-amber-700",
  retired: "border-line bg-ink/5 text-ink-faint",
}

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "rounded-sm border px-2 py-0.5 text-xs font-bold capitalize",
        styles[status] ?? styles.retired,
      )}
    >
      {status}
    </span>
  )
}
