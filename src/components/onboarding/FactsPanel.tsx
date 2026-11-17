type Fact = { label: string; value: string | null };

type Props = {
  agent: "Ali" | "Simbi";
  subject: string;
  facts: Fact[];
  percent: number;
  badge?: { label: string; on: boolean } | null;
  compact?: boolean;
};

/** "What Ali knows about you": fills in live as the person answers. */
export default function FactsPanel({ agent, subject, facts, percent, badge, compact }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-line bg-white p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-base font-semibold">
            What {agent} knows about {subject}
          </h2>
          <span className="font-mono text-[13px] font-semibold text-leaf-700">{percent}%</span>
        </div>
        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-leaf-100"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Profile completed"
        >
          <div className="h-full rounded-full bg-leaf-700 transition-[width] duration-500 ease-out" style={{ width: `${percent}%` }} />
        </div>

        {badge && (
          <div
            className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
              badge.on ? "bg-leaf-200 text-forest-900" : "bg-cream text-muted"
            }`}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {badge.on ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <circle cx="12" cy="12" r="8" />}
            </svg>
            {badge.label}
            {badge.on ? "" : " (not yet)"}
          </div>
        )}

        <dl className="mt-3">
          {facts.map((f) => (
            <div key={f.label} className="flex justify-between gap-3 border-t border-[#eef1ea] py-2 text-sm first:border-t-0">
              <dt className="shrink-0 text-muted">{f.label}</dt>
              <dd className={`min-w-0 truncate text-right ${f.value ? "font-semibold" : "text-muted/70"}`} title={f.value ?? undefined}>
                {f.value ?? "Not yet"}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {!compact && (
        <div className="rounded-2xl bg-forest-900 p-5 text-white">
          <span className="mb-2 grid h-9 w-9 place-items-center rounded-full border-[1.5px] border-leaf-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-leaf-300)" strokeWidth="2" aria-hidden="true">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
          </span>
          <p className="font-semibold">{agent === "Ali" ? "Your profile stays private" : "Candidates stay private"}</p>
          <p className="mt-1 text-sm leading-relaxed text-mist">
            {agent === "Ali"
              ? "Ali only shares it with an employer after you say yes to an introduction."
              : "You only see a candidate's name and contact after they say yes to an introduction."}
          </p>
        </div>
      )}
    </div>
  );
}
