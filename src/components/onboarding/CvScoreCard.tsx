import Link from "next/link";
import { cvScan } from "@/lib/onboarding/mock";
import type { Answers } from "@/lib/onboarding/types";

const R = 40;
const C = 2 * Math.PI * R;

/** The free ATS-readiness result shown right after a CV is uploaded. Sample numbers for now. */
export default function CvScoreCard({ answers }: { answers: Answers }) {
  const scan = cvScan(answers);
  return (
    <div className="max-w-[34rem] rounded-2xl border border-line bg-white p-4 sm:p-5">
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" role="img" aria-label={`CV score ${scan.score} out of 100`}>
            <circle cx="50" cy="50" r={R} fill="none" stroke="var(--color-line)" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke="var(--color-leaf-700)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - scan.score / 100)}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="font-mono text-2xl font-semibold leading-none">{scan.score}</p>
              <p className="mt-0.5 text-[11px] text-muted">of 100</p>
            </div>
          </div>
        </div>
        <div className="min-w-0">
          <span className="inline-block rounded-full bg-[#f3ead2] px-2.5 py-1 text-xs font-semibold text-[#6b4e0a]">Below the readiness bar</span>
          <p className="mt-2 text-sm text-muted">How typical screening software reads your CV. Not a promise about any one employer.</p>
        </div>
      </div>

      <h3 className="mt-4 text-sm font-semibold">Top reasons</h3>
      <ul className="mt-1.5 flex flex-col gap-1.5 text-[15px] leading-snug">
        {scan.reasons.map((r) => (
          <li key={r} className="flex gap-2.5">
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-700" />
            {r}
          </li>
        ))}
      </ul>

      <h3 className="mt-4 text-sm font-semibold">Skills I found</h3>
      <ul className="mt-1.5 flex flex-wrap gap-1.5">
        {scan.skills.map((s) => (
          <li key={s} className="rounded-full bg-leaf-100 px-2.5 py-1 text-xs font-semibold text-leaf-800">
            {s}
          </li>
        ))}
      </ul>

      <p className="mt-4 rounded-xl bg-cream px-3.5 py-3 text-sm">
        The full fix list, with rewrites, is part of{" "}
        <Link href="/#pricing" className="font-semibold text-leaf-700 underline underline-offset-2">
          Premium
        </Link>
        .
      </p>
    </div>
  );
}
