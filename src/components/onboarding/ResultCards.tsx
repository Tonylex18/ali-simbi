"use client";

import type { Candidate, Fit, JobMatch, PpaMatch } from "@/lib/onboarding/mock";

const fitStyle: Record<Fit, string> = {
  Strong: "bg-leaf-200 text-forest-900",
  Good: "bg-forest-100 text-forest-800",
  Stretch: "bg-[#f3ead2] text-[#6b4e0a]",
};

export function FitBadge({ fit }: { fit: Fit }) {
  return <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${fitStyle[fit]}`}>{fit} fit</span>;
}

type ActionProps = {
  id: string;
  requested: boolean;
  onRequest: (id: string) => void;
  onDismiss?: (id: string) => void;
  cta: string;
  doneLabel: string;
};

function Actions({ id, requested, onRequest, onDismiss, cta, doneLabel }: ActionProps) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={requested}
        aria-live="polite"
        onClick={() => onRequest(id)}
        className={`h-10 rounded-lg px-4 text-sm font-semibold transition-all duration-150 ${
          requested ? "bg-forest-100 text-forest-800" : "bg-leaf-700 text-white hover:bg-leaf-800"
        }`}
      >
        {requested ? doneLabel : cta}
      </button>
      {!requested && onDismiss && (
        <button type="button" onClick={() => onDismiss(id)} className="h-10 rounded-lg border border-[#d5dbd1] bg-white px-4 text-sm font-medium hover:bg-leaf-100">
          Not for me
        </button>
      )}
    </div>
  );
}

const card = "animate-rise rounded-2xl border border-line bg-white p-4 shadow-sm transition-shadow hover:shadow-md";

type Shared = { requested: string[]; onRequest: (id: string) => void; onDismiss?: (id: string) => void };

export function PpaCard({ m, requested, onRequest, onDismiss }: { m: PpaMatch } & Shared) {
  const done = requested.includes(m.id);
  return (
    <li className={card}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{m.role}</p>
          <p className="text-sm text-muted">
            {m.host} · <span className="text-leaf-800">Verified host</span>
          </p>
        </div>
        <FitBadge fit={m.fit} />
      </div>
      <p className="mt-2 font-mono text-[13px] text-muted">
        {m.where} · {m.stipend} · {m.mode}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {m.perks.map((p) => (
          <span key={p} className="rounded-full bg-forest-100 px-2.5 py-0.5 text-xs font-medium text-forest-800">
            {p}
          </span>
        ))}
      </div>
      <p className="mt-2 text-sm text-muted">{m.reason}</p>
      <Actions id={m.id} requested={done} onRequest={onRequest} onDismiss={onDismiss} cta="Yes, introduce me" doneLabel="Intro requested ✓" />
    </li>
  );
}

export function JobCard({ m, requested, onRequest, onDismiss }: { m: JobMatch } & Shared) {
  const done = requested.includes(m.id);
  return (
    <li className={card}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{m.title}</p>
          <p className="text-sm text-muted">{m.company}</p>
        </div>
        <FitBadge fit={m.fit} />
      </div>
      <p className="mt-2 font-mono text-[13px] text-muted">
        {m.location} · {m.mode} · {m.pay}
      </p>
      <p className="mt-2 text-sm text-muted">{m.reason}</p>
      <Actions id={m.id} requested={done} onRequest={onRequest} onDismiss={onDismiss} cta="Yes, introduce me" doneLabel="Intro requested ✓" />
    </li>
  );
}

export function CandidateCard({ c, requested, onRequest, onDismiss }: { c: Candidate } & Shared) {
  const done = requested.includes(c.id);
  return (
    <li className={card}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{c.headline}</p>
          <p className="text-sm text-muted">
            {c.tag} · name hidden until they say yes
          </p>
        </div>
        <FitBadge fit={c.fit} />
      </div>
      <p className="mt-2 font-mono text-[13px] text-muted">
        {c.where} · {c.available}
      </p>
      <p className="mt-2 text-sm text-muted">{c.reason}</p>
      <Actions id={c.id} requested={done} onRequest={onRequest} onDismiss={onDismiss} cta="Request intro" doneLabel="Requested ✓" />
    </li>
  );
}
