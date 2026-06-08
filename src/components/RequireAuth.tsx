import type { ReactNode } from "react"
import { useCurrentUser } from "../lib/auth"
import { SignIn } from "../pages/SignIn"
import { Wordmark } from "./Wordmark"

export function RequireAuth({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useCurrentUser()

  if (isLoading) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-5">
        <Wordmark className="text-3xl" />
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-danfo" />
      </div>
    )
  }

  if (!user) {
    return <SignIn />
  }

  return <>{children}</>
}
