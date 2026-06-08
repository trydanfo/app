import { signIn } from "../lib/auth";
import { Button } from "../components/ui/Button";
import { GoogleMark } from "../components/GoogleMark";
import { GridDecor } from "../components/GridDecor";

export function SignIn() {
  return (
    <div className="relative mx-auto flex min-h-[100dvh] max-w-2xl flex-col items-center justify-center overflow-hidden px-7">
      <GridDecor className="-right-12 top-4" />
      <GridDecor className="-left-24 top-1/3" />
      <GridDecor className="-right-28 top-1/2" />
      <GridDecor className="-left-16 bottom-6" />
      <GridDecor className="right-1/4 bottom-2" />

      <main className="relative z-10 w-full max-w-sm">
        <div
          className="rise mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3.5 py-1.5"
          style={{ animationDelay: "60ms" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-danfo-deep" />
          <span className="text-[11px] text-ink-soft">a summer research project · Lagos · 2026</span>
        </div>
        <h1
          className="rise font-display text-[2.9rem] font-extrabold leading-[0.96] tracking-tight"
          style={{ animationDelay: "140ms" }}
        >
          Your seat is
          <br />
          a sensor<span className="text-danfo">.</span>
        </h1>
        <p
          className="rise mt-5 text-[15px] leading-relaxed text-ink-soft"
          style={{ animationDelay: "220ms" }}
        >
          Board a danfo, share your trip live, and rate it after. Every ride you take helps map
          Lagos&rsquo; minibus network.
        </p>

        <div className="rise mt-9" style={{ animationDelay: "300ms" }}>
          <Button size="lg" onClick={signIn} className="w-full">
            <GoogleMark />
            Continue with Google
          </Button>
          <p className="mt-4 text-[12px] leading-relaxed text-ink-faint">
            By continuing you agree to our{" "}
            <a
              href="https://danfo.ng/terms"
              className="text-ink-soft underline underline-offset-2"
            >
              Terms
            </a>{" "}
            &amp;{" "}
            <a
              href="https://danfo.ng/privacy"
              className="text-ink-soft underline underline-offset-2"
            >
              Privacy
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
