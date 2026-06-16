import { useEffect, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { MapContainer, useMap } from "react-leaflet"
import { Maximize2, X } from "lucide-react"
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet"
import "leaflet/dist/leaflet.css"

// Leaflet paints gray tiles if its container is resized without being told. Nudge it whenever we
// toggle fullscreen (after the layout has settled).
function ResizeSync({ trigger }: { trigger: boolean }) {
  const map = useMap()
  useEffect(() => {
    const id = setTimeout(() => map.invalidateSize(), 220)
    return () => clearTimeout(id)
  }, [trigger, map])
  return null
}

// MapFrame wraps a Leaflet map with an expand/close button that blows it up to a fullscreen overlay
// (mobile + desktop) and back, without remounting the map — so anything live, like ride tracking,
// keeps running across the toggle.
export function MapFrame({
  center,
  zoom,
  bounds,
  height = "190px",
  scrollWheelZoom = false,
  children,
}: {
  center?: LatLngExpression
  zoom?: number
  bounds?: LatLngBoundsExpression
  height?: string
  scrollWheelZoom?: boolean
  children: ReactNode
}) {
  const [full, setFull] = useState(false)

  // Esc closes fullscreen, and lock body scroll while it's open
  useEffect(() => {
    if (!full) return
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setFull(false)
    document.addEventListener("keydown", onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [full])

  const frame = (
    <div className={full ? "fixed inset-0 z-[1200] bg-paper" : "relative"} style={full ? undefined : { height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        bounds={bounds}
        scrollWheelZoom={scrollWheelZoom}
        style={{ height: "100%", width: "100%" }}
        className={full ? "" : "overflow-hidden rounded-[var(--radius)] border border-line"}
      >
        {children}
        <ResizeSync trigger={full} />
      </MapContainer>
      <button
        type="button"
        onClick={() => setFull((value) => !value)}
        aria-label={full ? "Exit full screen" : "Full screen"}
        className="absolute right-3 top-3 z-[1000] flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper/90 text-ink shadow-sm backdrop-blur transition-colors hover:bg-paper"
      >
        {full ? <X size={18} /> : <Maximize2 size={16} />}
      </button>
    </div>
  )

  // Fullscreen portals to <body> so it escapes the page's stacking context (a `relative z-10`
  // wrapper) — otherwise the sticky header would paint over the map and its controls.
  return full ? createPortal(frame, document.body) : frame
}
