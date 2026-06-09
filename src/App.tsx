import { lazy, Suspense } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { RequireAuth } from "./components/RequireAuth"
import { Dashboard } from "./pages/Dashboard"
import { Vehicle } from "./pages/Vehicle"
import { RideDetail } from "./pages/RideDetail"

// the camera scanner pulls in a heavy QR library — load it only when opened
const Scan = lazy(() => import("./pages/Scan").then((module) => ({ default: module.Scan })))

export default function App() {
  return (
    <Routes>
      {/* public — a scan or a shared link lands here without signing in */}
      <Route path="/v/:code" element={<Vehicle />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route
                path="/scan"
                element={
                  <Suspense fallback={<div className="min-h-[100dvh] bg-ink" />}>
                    <Scan />
                  </Suspense>
                }
              />
              <Route path="/rides/:id" element={<RideDetail />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </RequireAuth>
        }
      />
    </Routes>
  )
}
