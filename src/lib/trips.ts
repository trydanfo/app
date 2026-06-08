import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "./api"

export type Trip = {
  id: number
  vehicleId: number
  status: string
  shareToken?: string
  startedAt: string
  endedAt?: string
  lastPingAt: string
  distanceMeters?: number
}

export type ActiveTrip =
  | { active: false }
  | {
      active: true
      id: number
      status: string
      startedAt: string
      vehicleId: number
      plate: string
      code: string
      shareToken: string | null
    }

export const activeStatuses = ["boarded", "tracking", "paused"]
export function isActive(status: string) {
  return activeStatuses.includes(status)
}

export function useActiveTrip() {
  return useQuery({
    queryKey: ["active-trip"],
    queryFn: () => api<ActiveTrip>("/api/v1/app/active-trip"),
  })
}

export function useBoardTrip() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (publicCode: string) =>
      api<Trip>("/api/v1/app/trips", { method: "POST", body: JSON.stringify({ publicCode }) }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["active-trip"] }),
  })
}

export function useEndTrip() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api<Trip>(`/api/v1/app/trips/${id}/end`, { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["active-trip"] }),
  })
}

export function useShareTrip() {
  return useMutation({
    mutationFn: (id: number) =>
      api<{ shareToken: string }>(`/api/v1/app/trips/${id}/share`, { method: "POST" }),
  })
}

export type TripListItem = {
  id: number
  status: string
  startedAt: string
  endedAt?: string
  distanceMeters?: number
  plate: string
  code: string
}

export const RIDES_PAGE_SIZE = 6

export function useTrips(page: number) {
  return useQuery({
    queryKey: ["trips", page],
    queryFn: () =>
      api<TripListItem[]>(`/api/v1/app/trips?limit=${RIDES_PAGE_SIZE}&offset=${page * RIDES_PAGE_SIZE}`),
    placeholderData: (previous) => previous,
  })
}

// the signed-in rider's own rides on one specific danfo (for the vehicle page)
export function useVehicleRides(code: string, page: number, enabled: boolean) {
  return useQuery({
    queryKey: ["vehicle-rides", code, page],
    queryFn: () =>
      api<TripListItem[]>(
        `/api/v1/app/trips?code=${encodeURIComponent(code)}&limit=${RIDES_PAGE_SIZE}&offset=${page * RIDES_PAGE_SIZE}`,
      ),
    enabled: enabled && !!code,
    placeholderData: (previous) => previous,
  })
}

export type TripDetail = {
  id: number
  status: string
  startedAt: string
  endedAt?: string
  distanceMeters?: number
  routePolyline: string
  vehicleId: number
  plate: string
  code: string
}

export function useTrip(id: string) {
  return useQuery({
    queryKey: ["trip", id],
    queryFn: () => api<TripDetail>(`/api/v1/app/trips/${id}`),
    enabled: !!id,
  })
}

// the public live-viewer surface (its own app/domain). Defaults to :5175 in dev — app is :5173, ops :5174.
const liveBaseUrl = import.meta.env.VITE_LIVE_BASE_URL ?? "http://localhost:5175"
export function liveShareUrl(token: string) {
  return `${liveBaseUrl}/${token}`
}

export type Fix = { lat: number; lng: number; speed?: number }

export function sendPing(tripId: number, fix: Fix) {
  return api(`/api/v1/app/trips/${tripId}/pings`, {
    method: "POST",
    body: JSON.stringify({ ...fix, recordedAt: new Date().toISOString() }),
  })
}
