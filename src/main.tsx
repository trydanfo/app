import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import App from "./App"
import { TrackingProvider } from "./components/TrackingProvider"
import "./index.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
  },
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TrackingProvider>
          <App />
        </TrackingProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
