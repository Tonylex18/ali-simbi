"use client";

import { useMemo, useState } from "react";
import { samplePpas, states, stipendFilters, type Stipend } from "@/lib/content";
import { btnOnDark, container, eyebrow } from "@/lib/ui";

const points = [
  "Every host is verified before a listing goes live.",
  "Ali drafts your NYSC request letter for the host.",
  "Your details stay hidden until you accept an introduction.",
] as const;

export default function PpaSection() {
  const [state, setState] = useState<(typeof states)[number]>("Any state");
  const [stipend, setStipend] = useState<Stipend>("Any");

  const results = useMemo(
    () =>
      samplePpas.filter(
        (p) =>
          (state === "Any state" || p.state === state) &&
          (stipend === "Any" || p.stipend === stipend),
      ),
    [state, stipend],
  );

  return (
    <section id="ppa" className="bg-forest-900 text-white">
      <div className={`${container} grid gap-12 py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:py-28`}>
        <div>
          <p className={`${eyebrow} text-leaf-300!`}>NYSC PPA · where we start</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]">
            Find a PPA you would actually want.
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-mist">
            Skip the CV drop-offs. Filter by state, LGA, stipend, accommodation and work mode across all 36 states and the FCT, and see what a host really offers before you apply.
          </p>
          <ul className="mt-7 flex flex-col gap-3">
            {points.map((p) => (
              <li key={p} className="flex gap-3 text-[17px]">
                <svg className="mt-1 h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="var(--color-leaf-300)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
                {p}
              </li>
            ))}
          </ul>
          <a href="#start" className={`${btnOnDark} mt-8`}>Find my PPA</a>
        </div>

        <div className="rounded-3xl bg-white p-5 text-ink shadow-2xl sm:p-6">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div>
              <label htmlFor="ppa-state" className="text-sm font-semibold">State</label>
              <select
                id="ppa-state"
                value={state}
                onChange={(e) => setState(e.target.value as (typeof states)[number])}
                className="mt-1.5 h-11 w-full rounded-xl border border-line bg-cream px-3 text-[15px]"
              >
                {states.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <fieldset>
              <legend className="text-sm font-semibold">Monthly stipend</legend>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {stipendFilters.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={stipend === s}
                    onClick={() => setStipend(s)}
                    className={`h-11 rounded-full border px-3.5 font-mono text-[13px] font-semibold transition-colors ${
                      stipend === s
                        ? "border-forest-900 bg-forest-900 text-white"
                        : "border-line bg-white text-muted hover:border-leaf-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <ul className="mt-5 flex max-h-104 flex-col gap-2.5 overflow-y-auto pr-1" aria-live="polite">
            {results.length === 0 && (
              <li className="rounded-xl border border-dashed border-line p-6 text-center text-muted">
                No sample listings match. Try another state or stipend.
              </li>
            )}
            {results.map((p) => (
              <li
                key={`${p.role}-${p.host}`}
                className="rounded-xl border border-line p-4 transition duration-200 hover:border-leaf-500 hover:bg-leaf-100/50 motion-safe:hover:translate-x-1"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{p.role}</p>
                    <p className="text-sm text-muted">{p.host}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-leaf-100 px-2.5 py-1 font-mono text-xs font-semibold text-leaf-800">
                    {p.stipend}
                  </span>
                </div>
                <p className="mt-2 font-mono text-[13px] text-muted">
                  {p.state} · {p.lga} · {p.mode}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.perks.map((perk) => (
                    <span key={perk} className="rounded-full bg-forest-100 px-2.5 py-0.5 text-xs font-medium text-forest-800">
                      {perk}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
