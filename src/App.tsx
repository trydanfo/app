import { Routes, Route, Navigate } from "react-router-dom"
import { RequireAuth } from "./components/RequireAuth"
import { Dashboard } from "./pages/Dashboard"

export default function App() {
  return (
    <RequireAuth>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </RequireAuth>
  )
}
