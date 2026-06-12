import { useQuery } from "@tanstack/react-query"
import { api } from "./api"

export type PublicVehicle = {
  publicCode: string
  plateNumber: string
  plateState: string
  status: string
  imageUrl: string
}

export function useVehicleByCode(code: string) {
  return useQuery({
    queryKey: ["vehicle-by-code", code],
    queryFn: () => api<PublicVehicle>(`/api/v1/vehicles/by-code/${code}`),
    enabled: !!code,
  })
}

export type ReviewItem = {
  rating: number
  body: string
  reviewer: string
  anonymous: boolean
  createdAt: string
}

export type VehicleReviews = {
  average: number
  count: number
  reviews: ReviewItem[]
}

export const REVIEWS_PAGE_SIZE = 5

export function useVehicleReviews(code: string, page: number) {
  return useQuery({
    queryKey: ["vehicle-reviews", code, page],
    queryFn: () =>
      api<VehicleReviews>(
        `/api/v1/vehicles/by-code/${code}/reviews?limit=${REVIEWS_PAGE_SIZE}&offset=${page * REVIEWS_PAGE_SIZE}`,
      ),
    enabled: !!code,
    placeholderData: (previous) => previous,
  })
}

// flags = reports ops has chosen to publish to this vehicle's profile (curated note only)
export type VehicleFlag = {
  kind: string
  note: string
  createdAt: string
}

export function useVehicleFlags(code: string) {
  return useQuery({
    queryKey: ["vehicle-flags", code],
    queryFn: () => api<VehicleFlag[]>(`/api/v1/vehicles/by-code/${code}/flags`),
    enabled: !!code,
  })
}

export type VehicleLocation = {
  source: "last_ride" | "none"
  lat?: number
  lng?: number
  at?: string
}

export function useVehicleLocation(code: string) {
  return useQuery({
    queryKey: ["vehicle-location", code],
    queryFn: () => api<VehicleLocation>(`/api/v1/vehicles/by-code/${code}/location`),
    enabled: !!code,
  })
}
