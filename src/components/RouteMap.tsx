import { MapContainer, TileLayer, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"

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
    <MapContainer
      bounds={points}
      scrollWheelZoom={false}
      style={{ height, width: "100%" }}
      className="overflow-hidden rounded-[var(--radius)] border border-line"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={points} pathOptions={{ color: "#1a1710", weight: 4 }} />
    </MapContainer>
  )
}
