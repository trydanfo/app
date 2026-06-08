import { Star } from "lucide-react"
import { cn } from "../lib/cn"

export function StarRating({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={size}
          strokeWidth={2}
          className={cn(index < value ? "fill-danfo text-danfo" : "fill-none text-ink/20")}
        />
      ))}
    </span>
  )
}
