import { Button } from "./ui/Button"

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (page: number) => void
}) {
  if (totalPages <= 1) return null
  return (
    <div className="mt-5 flex items-center justify-between">
      <Button variant="outline" size="sm" disabled={page === 0} onClick={() => onChange(page - 1)}>
        Previous
      </Button>
      <span className="text-xs text-ink-faint">
        Page {page + 1} of {totalPages}
      </span>
      <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)}>
        Next
      </Button>
    </div>
  )
}
