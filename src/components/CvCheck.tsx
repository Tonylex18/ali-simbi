import { cvPillars, cvReasons } from "@/lib/content";
import { btnPrimary, container, eyebrow, h2 } from "@/lib/ui";

const score = Math.round(cvPillars.reduce((n, p) => n + p.value, 0) / cvPillars.length);
const R = 52;
const C = 2 * Math.PI * R;

export default function CvCheck() {
  return (
    <section id="cv" className="border-y border-line bg-white">
      <div className={`${container} grid items-center gap-12 py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:py-28`}>
        <div>
          <p className={eyebrow}>Free CV check</p>
          <h2 className={`${h2} mt-4`}>See how a screening system reads your CV.</h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
            Upload your CV and Ali scores it out of 100 on formatting, impact, keywords and clarity. You see the score and the top reasons for free. If it falls below the bar, Premium gives you every fix.
          </p>
          <p className="mt-4 max-w-lg text-sm text-muted">
            The score estimates how typical screening software reads a CV. It is not a promise about any one employer&apos;s system, and it is the same score for everyone.
          </p>
          <a href="#start" className={`${btnPrimary} mt-8`}>Check my CV free</a>
        </div>

        <div className="rounded-3xl border border-line bg-cream p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-6">
            <div className="relative h-32 w-32 shrink-0">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label={`CV score ${score} out of 100`}>
                <circle cx="60" cy="60" r={R} fill="none" stroke="var(--color-line)" strokeWidth="12" />
                <circle
                  cx="60"
                  cy="60"
                  r={R}
                  fill="none"
                  stroke="var(--color-leaf-700)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={C * (1 - score / 100)}
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <p className="font-mono text-3xl font-semibold leading-none">{score}</p>
                  <p className="mt-1 text-xs text-muted">out of 100</p>
                </div>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <span className="inline-block rounded-full bg-[#f3ead2] px-3 py-1 text-xs font-semibold text-[#6b4e0a]">
                Below the readiness bar
              </span>
              <ul className="mt-3 flex flex-col gap-2">
                {cvPillars.map((p) => (
                  <li key={p.label} className="grid grid-cols-[8.5rem_1fr_2rem] items-center gap-3 text-sm">
                    <span className="text-muted">{p.label}</span>
                    <span className="h-2 overflow-hidden rounded-full bg-line">
                      <span className="block h-full rounded-full bg-leaf-700" style={{ width: `${p.value}%` }} />
                    </span>
                    <span className="font-mono text-xs">{p.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold">Top reasons (free)</h3>
            <ul className="mt-2 flex flex-col gap-2 text-[15px] leading-relaxed">
              {cvReasons.map((r) => (
                <li key={r} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-700" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mt-6 overflow-hidden rounded-2xl border border-line bg-white">
            <div aria-hidden="true" className="flex select-none flex-col gap-2 p-4 blur-[3px]">
              {["Rewrite bullet 3 with a result and a number", "Move skills out of the text box into the main body", "State your English level in the skills line"].map((t, i) => (
                <p key={t} className="rounded-lg bg-cream px-3 py-2 text-sm">
                  <span className="font-mono text-xs text-leaf-700">Fix {i + 1}</span> {t}
                </p>
              ))}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/70 p-4 text-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-forest-900)" strokeWidth="2" aria-hidden="true">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              <p className="font-semibold">Full fix list, with rewrites, is Premium</p>
              <a href="#pricing" className="text-sm font-semibold text-leaf-700 underline underline-offset-4">See Premium</a>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted">Sample result for illustration.</p>
        </div>
      </div>
    </section>
  );
}
