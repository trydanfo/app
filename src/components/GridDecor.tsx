import { cn } from "../lib/cn"

// A quiet grid patch — dimmed, lightly blurred, and faded out at the edges. Drop a couple sparingly
// into a relative, overflow-hidden parent so they peek through behind content.
export function GridDecor({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute h-72 w-72 opacity-70 blur-[1px]", className)}
      style={{
        backgroundImage:
          "linear-gradient(to right, color-mix(in oklab, var(--color-ink) 10%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-ink) 10%, transparent) 1px, transparent 1px)",
        backgroundSize: "30px 30px",
        WebkitMaskImage: "radial-gradient(circle, #000, transparent 75%)",
        maskImage: "radial-gradient(circle, #000, transparent 75%)",
      }}
    />
  )
}
