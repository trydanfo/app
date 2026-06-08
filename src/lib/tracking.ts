import { useEffect, useRef, useState } from "react"
import { sendPing } from "./trips"

const MIN_INTERVAL_MS = 5000 // never ping more often than this
const HEARTBEAT_MS = 45000 // …but ping at least this often, even parked (keeps the trip alive)
const MIN_DISTANCE_M = 25 // while moving, ping once you've covered this much ground

export type LiveFix = { lat: number; lng: number; at: number }

function distanceMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

// useRideTracking watches the device position while a ride is active and posts pings *adaptively*:
// frequently when you're moving, throttled to a heartbeat when you're not. It also holds a screen
// Wake Lock so the phone doesn't sleep mid-trip (web is foreground-only).
export function useRideTracking(tripId: number | undefined, active: boolean) {
  const [geoError, setGeoError] = useState<string | null>(null)
  const [fix, setFix] = useState<LiveFix | null>(null)
  const lastSent = useRef<{ lat: number; lng: number; time: number } | null>(null)
  const latest = useRef<{ lat: number; lng: number; speed?: number } | null>(null)

  useEffect(() => {
    if (!tripId || !active) {
      setFix(null)
      lastSent.current = null
      latest.current = null
      return
    }
    if (!("geolocation" in navigator)) {
      setGeoError("Location isn't available on this device.")
      return
    }

    function maybeSend(lat: number, lng: number, speed?: number) {
      const now = Date.now()
      const prev = lastSent.current
      let shouldSend = false
      if (!prev) {
        shouldSend = true
      } else {
        const since = now - prev.time
        if (since >= MIN_INTERVAL_MS) {
          shouldSend = since >= HEARTBEAT_MS || distanceMeters(prev, { lat, lng }) >= MIN_DISTANCE_M
        }
      }
      if (!shouldSend) return
      lastSent.current = { lat, lng, time: now }
      void sendPing(tripId!, { lat, lng, speed }).catch(() => {})
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setGeoError(null)
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        const speed = position.coords.speed ?? undefined
        latest.current = { lat, lng, speed }
        setFix({ lat, lng, at: Date.now() })
        maybeSend(lat, lng, speed)
      },
      (error) => {
        setGeoError(
          error.code === error.PERMISSION_DENIED
            ? "Location is off. Allow it so we can track your ride."
            : "Couldn't get your location right now.",
        )
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
    )

    // heartbeat: watchPosition goes quiet when stationary, so nudge the last fix through periodically
    const heartbeat = setInterval(() => {
      const current = latest.current
      if (!current) return
      const prev = lastSent.current
      if (!prev || Date.now() - prev.time >= HEARTBEAT_MS) {
        maybeSend(current.lat, current.lng, current.speed)
      }
    }, 15000)

    // keep the screen awake while riding
    let wakeLock: { release: () => Promise<void> } | null = null
    const requestWakeLock = async () => {
      try {
        const anyNavigator = navigator as unknown as {
          wakeLock?: { request: (type: string) => Promise<{ release: () => Promise<void> }> }
        }
        wakeLock = (await anyNavigator.wakeLock?.request("screen")) ?? null
      } catch {
        // wake lock unsupported or denied — tracking still works while visible
      }
    }
    void requestWakeLock()
    const onVisible = () => {
      if (document.visibilityState === "visible") void requestWakeLock()
    }
    document.addEventListener("visibilitychange", onVisible)

    return () => {
      navigator.geolocation.clearWatch(watchId)
      clearInterval(heartbeat)
      document.removeEventListener("visibilitychange", onVisible)
      void wakeLock?.release().catch(() => {})
    }
  }, [tripId, active])

  return { geoError, hasFix: fix !== null, fix }
}
