import { cn } from "../lib/cn"

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display font-extrabold tracking-tight text-ink", className)}>
      danfo<span className="text-danfo">.</span>
    </span>
  )
}
