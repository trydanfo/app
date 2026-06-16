import { createContext, useContext, type ReactNode } from "react"
import { useActiveTrip } from "../lib/trips"
import { useRideTracking, type LiveFix } from "../lib/tracking"

type TrackingState = { tripId: number | null; fix: LiveFix | null; geoError: string | null }

const TrackingContext = createContext<TrackingState>({ tripId: null, fix: null, geoError: null })

export function useTracking() {
  return useContext(TrackingContext)
}

// TrackingProvider runs the GPS watch once, app-wide, for whatever trip is currently active — so a
// ride keeps pinging as the rider moves around the app, not only while the danfo's page is open.
// (Still foreground-only; backgrounding the tab is a native-app concern.)
export function TrackingProvider({ children }: { children: ReactNode }) {
  const activeTrip = useActiveTrip()
  const tripId = activeTrip.data?.active ? activeTrip.data.id : null
  const { fix, geoError } = useRideTracking(tripId ?? undefined, tripId != null)

  return <TrackingContext.Provider value={{ tripId, fix, geoError }}>{children}</TrackingContext.Provider>
}
