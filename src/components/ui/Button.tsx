import type { ButtonHTMLAttributes } from "react"
import { cn } from "../../lib/cn"

type Variant = "primary" | "outline" | "ghost"
type Size = "sm" | "md" | "lg"

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius)] font-semibold transition-all duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-danfo/60 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"

const variants: Record<Variant, string> = {
  primary: "bg-danfo text-ink shadow-[0_10px_26px_-14px_rgba(247,181,0,0.9)] hover:bg-danfo-deep",
  outline: "border border-line bg-surface text-ink hover:bg-paper",
  ghost: "text-ink-soft hover:bg-paper hover:text-ink",
}

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
}
