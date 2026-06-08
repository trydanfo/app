import { useEffect, useRef, useState, type ReactNode } from "react"
import { useCurrentUser, signOut } from "../lib/auth"
import { Wordmark } from "./Wordmark"
import { Avatar } from "./Avatar"
import { Button } from "./ui/Button"

export function Shell({ children }: { children: ReactNode }) {
  const { data: user } = useCurrentUser()
  const name = user ? `${user.firstName} ${user.lastName}`.trim() || user.email : ""

  return (
    <div className="min-h-[100dvh]">
      <header className="sticky top-0 z-20 border-b border-line/70 bg-paper/55 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-5">
          <Wordmark className="text-lg" />
          {user && <ProfileMenu name={name} email={user.email} picture={user.profilePicture} />}
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}

function ProfileMenu({ name, email, picture }: { name: string; email: string; picture: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [open])

  async function handleSignOut() {
    await signOut()
    window.location.href = "/"
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex items-center rounded-full transition hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-danfo/60"
        aria-label="Account"
      >
        <Avatar src={picture} name={name} size={32} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-[var(--radius)] border border-line bg-surface shadow-xl">
          <div className="border-b border-line p-4">
            <div className="truncate text-sm font-semibold text-ink">{name}</div>
            <div className="truncate text-xs text-ink-faint">{email}</div>
          </div>
          <div className="p-2">
            <Button variant="ghost" size="md" onClick={handleSignOut} className="w-full justify-start">
              Sign out
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
