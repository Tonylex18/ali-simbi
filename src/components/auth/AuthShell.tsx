import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/Logo";

type Props = {
  /** Headline on the dark side panel (large screens). */
  panelHeading: React.ReactNode;
  panelBody: string;
  panelBadge?: string;
  /** Small prompt in the top corner, e.g. "Already have an account? Sign in". */
  topLink?: { prompt: string; label: string; href: string };
  children: React.ReactNode;
};

const reasons = [
  "Free to start, no card needed",
  "Your profile stays private until you say yes",
  "Chat on the web or WhatsApp",
] as const;

export default function AuthShell({ panelHeading, panelBody, panelBadge, topLink, children }: Props) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <a
        href="#auth-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to the form
      </a>

      <aside className="relative hidden self-start overflow-hidden bg-forest-900 p-10 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col xl:p-14">
        <LogoMark
          className="pointer-events-none absolute -right-28 top-1/4 h-[30rem] w-[30rem] opacity-[0.07]"
          main="#ffffff"
          accent="var(--color-leaf-300)"
        />
        <Link href="/" aria-label="Ali & Simbi home" className="relative w-fit">
          <Wordmark onDark />
        </Link>

        <div className="relative mt-auto flex flex-col gap-4">
          {panelBadge && (
            <span className="inline-flex w-fit items-center gap-2 rounded-md bg-forest-800 px-3 py-1.5 text-[13px] text-leaf-200">
              <span className="h-[7px] w-[7px] rounded-full bg-leaf-300" />
              {panelBadge}
            </span>
          )}
          <h2 className="max-w-[16ch] text-4xl font-bold leading-[1.1] tracking-tight xl:text-[2.6rem]">{panelHeading}</h2>
          <p className="max-w-[42ch] text-base leading-relaxed text-mist">{panelBody}</p>
        </div>

        <ul className="relative mt-10 flex flex-col gap-3.5 text-[15px] text-forest-100">
          {reasons.map((r) => (
            <li key={r} className="flex items-center gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-[1.5px] border-leaf-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-leaf-300)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
              {r}
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex min-w-0 flex-col px-5 pb-12 pt-5 sm:px-8 lg:px-12 lg:pt-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" aria-label="Ali & Simbi home" className="shrink-0 lg:invisible">
            <Wordmark />
          </Link>
          {topLink && (
            <p className="text-[15px] text-muted">
              <span className="hidden sm:inline">{topLink.prompt} </span>
              <Link href={topLink.href} className="font-semibold text-leaf-700 underline-offset-4 hover:underline">
                {topLink.label}
              </Link>
            </p>
          )}
        </div>

        <main id="auth-main" className="mx-auto flex w-full max-w-[30rem] flex-1 flex-col justify-center py-10">
          <div className="animate-rise">{children}</div>
        </main>
      </div>
    </div>
  );
}
