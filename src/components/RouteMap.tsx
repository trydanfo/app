import { TileLayer, Polyline } from "react-leaflet"
import { MapFrame } from "./MapFrame"

export function parsePolyline(routePolyline: string | null | undefined): [number, number][] {
  if (!routePolyline) return []
  try {
    return (JSON.parse(routePolyline) as { lat: number; lng: number }[]).map((point) => [point.lat, point.lng])
  } catch {
    return []
  }
}

export function RouteMap({ points, height = "260px" }: { points: [number, number][]; height?: string }) {
  if (points.length < 2) {
    return (
      <div
        className="flex items-center justify-center rounded-[var(--radius)] border border-dashed border-line text-sm text-ink-faint"
        style={{ minHeight: height }}
      >
        No route recorded for this ride.
      </div>
    )
  }
  return (
    <MapFrame bounds={points} height={height}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={points} pathOptions={{ color: "#1a1710", weight: 4 }} />
    </MapFrame>
  )
}
