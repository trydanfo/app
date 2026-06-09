import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { X } from "lucide-react"
import { BrowserQRCodeReader, type IScannerControls } from "@zxing/browser"

// the sticker QR encodes app.danfo.ng/v/<code> — pull the code out, or accept a bare code
function codeFromScan(text: string): string | null {
  const match = text.match(/\/v\/([A-Za-z0-9_-]+)/)
  if (match) return match[1]
  const trimmed = text.trim()
  if (/^[A-Za-z0-9]{4,16}$/.test(trimmed)) return trimmed
  return null
}

export function Scan() {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const reader = new BrowserQRCodeReader()
    let controls: IScannerControls | null = null
    let done = false

    reader
      .decodeFromVideoDevice(undefined, videoRef.current!, (result, _error, scanControls) => {
        controls = scanControls
        if (!result || done) return
        const code = codeFromScan(result.getText())
        if (code) {
          done = true
          scanControls.stop()
          navigate(`/v/${code}`)
        }
      })
      .then((scanControls) => {
        controls = scanControls
      })
      .catch(() => {
        setError("Couldn't open the camera. Allow camera access, then try again.")
      })

    return () => {
      done = true
      controls?.stop()
    }
  }, [navigate])

  return (
    <div className="fixed inset-0 z-50 bg-ink">
      <video ref={videoRef} className="h-full w-full object-cover" playsInline muted autoPlay />

      <div className="absolute inset-0 flex flex-col">
        <div className="flex items-center justify-between px-5 pt-5">
          <span className="font-display text-lg font-extrabold tracking-tight text-paper">
            scan<span className="text-danfo">.</span>
          </span>
          <button
            onClick={() => navigate(-1)}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-paper/15 text-paper backdrop-blur-sm transition hover:bg-paper/25"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="h-60 w-60 rounded-[2rem] border-2 border-danfo shadow-[0_0_0_100vmax_rgba(21,18,11,0.6)]" />
        </div>

        <p className="px-8 pb-12 text-center text-sm text-paper/85">
          Point at the code sticker inside the danfo.
        </p>
      </div>

      {error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-ink px-8 text-center">
          <p className="text-sm text-paper/80">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="rounded-[var(--radius)] bg-danfo px-5 py-2.5 text-sm font-semibold text-ink"
          >
            Go back
          </button>
        </div>
      )}
    </div>
  )
}
