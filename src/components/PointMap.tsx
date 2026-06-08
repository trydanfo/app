import { MapContainer, TileLayer, CircleMarker } from "react-leaflet"
import "leaflet/dist/leaflet.css"

// A single dropped pin. CircleMarker avoids Leaflet's default-icon asset issues under bundlers.
export function PointMap({ lat, lng, height = "190px" }: { lat: number; lng: number; height?: string }) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height, width: "100%" }}
      className="overflow-hidden rounded-[var(--radius)] border border-line"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker
        center={[lat, lng]}
        radius={8}
        pathOptions={{ color: "#1a1710", weight: 2, fillColor: "#f7b500", fillOpacity: 1 }}
      />
    </MapContainer>
  )
}
