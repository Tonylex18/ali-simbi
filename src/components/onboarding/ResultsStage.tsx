"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { val } from "@/lib/onboarding/flows";
import type { Money, StateLga } from "@/lib/onboarding/flows";
import { formatMoney } from "@/lib/onboarding/data";
import { jobMatches, ppaMatches, requestLetter, shortlist } from "@/lib/onboarding/mock";
import type { Answers, MockSession, Track } from "@/lib/onboarding/types";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { AgentBubble } from "./Bubbles";
import LetterDialog from "./LetterDialog";
import { CandidateCard, JobCard, PpaCard } from "./ResultCards";

type Props = {
  track: Track;
  answers: Answers;
  session: MockSession;
  requested: string[];
  onRequest: (id: string) => void;
  onRestart: () => void;
};

function stageLabels(track: Track, a: Answers): string[] {
  if (track === "corper") {
    const w = val<StateLga>(a, "where");
    return ["Reading your profile", `Checking verified PPAs in ${w?.state ?? "your state"}`, "Ranking them by fit"];
  }
  if (track === "seeker") return ["Reading your profile", "Searching roles that fit", "Ranking them by fit"];
  return ["Writing your brief", "Finding people who want this role", "Ranking them by fit"];
}

function BriefCard({ a, session }: { a: Answers; session: MockSession }) {
  const ppa = val<string>(a, "kind") === "ppa";
  const money = val<Money>(a, "budget");
  const where = val<StateLga>(a, "where");
  const rows: [string, string][] = [
    ["Role", `${a.title?.label ?? "New role"}${ppa ? " (NYSC PPA)" : ""}`],
    ["Where", `${where?.lga ?? ""}, ${where?.state ?? ""} · ${a.mode?.label ?? ""}`],
    ["Needs", (val<string[]>(a, "skills") ?? []).join(", ")],
    ["How many", a.headcount?.label ?? "1"],
    [ppa ? "Stipend" : "Budget", ppa ? `${a.stipend?.label ?? ""} a month` : money?.amount ? `${formatMoney(money.currency, money.amount)} a month` : "Simbi will advise"],
  ];
  return (
    <div className="animate-rise overflow-hidden rounded-2xl border border-line bg-white">
      <div className="flex items-center justify-between gap-3 bg-forest-900 px-4 py-3 text-white">
        <div>
          <p className="text-sm text-mist">Role brief</p>
          <p className="text-lg font-bold">{String(a.title?.label ?? "New role")}</p>
          <p className="text-sm text-mist">{session.company ?? "Your company"}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf-300 px-2.5 py-1 text-xs font-semibold text-forest-900">
          <span className="h-1.5 w-1.5 rounded-full bg-forest-900" />
          Live
        </span>
      </div>
      <dl className="divide-y divide-line px-4 text-[15px]">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-2.5">
            <dt className="text-muted">{k}</dt>
            <dd className="text-right font-medium">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function ResultsStage({ track, answers, session, requested, onRequest, onRestart }: Props) {
  const reduced = useReducedMotion();
  const stages = stageLabels(track, answers);
  const [stage, setStage] = useState(0);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [letterOpen, setLetterOpen] = useState(false);
  const searching = !reduced && stage < stages.length;

  useEffect(() => {
    if (reduced || stage >= stages.length) return;
    const t = setTimeout(() => setStage((s) => s + 1), 850);
    return () => clearTimeout(t);
  }, [stage, stages.length, reduced]);

  const ppas = useMemo(() => ppaMatches(answers), [answers]);
  const jobs = useMemo(() => jobMatches(answers), [answers]);
  const people = useMemo(() => shortlist(answers), [answers]);
  const letter = useMemo(() => requestLetter(answers, session), [answers, session]);

  const visible = <T extends { id: string }>(xs: T[]) => xs.filter((x) => !dismissed.includes(x.id));
  const dismiss = (id: string) => setDismissed((d) => [...d, id]);
  const shared = { requested, onRequest, onDismiss: dismiss };
  const verified = track === "corper" && answers.letter && !answers.letter.skipped;
  const where = val<StateLga>(answers, "where");

  if (searching) {
    return (
      <AgentBubble>
        <ul className="flex flex-col gap-2.5" aria-live="polite">
          {stages.map((s, i) => (
            <li key={s} className={`flex items-center gap-2.5 ${stage >= i ? "text-ink" : "text-muted"}`}>
              {stage > i ? (
                <svg className="h-5 w-5 text-leaf-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              ) : stage === i ? (
                <svg className="h-5 w-5 animate-spin text-leaf-700" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                  <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              ) : (
                <span className="h-5 w-5 rounded-full border-2 border-line" aria-hidden="true" />
              )}
              {s}
            </li>
          ))}
        </ul>
      </AgentBubble>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {track === "company" && <BriefCard a={answers} session={session} />}

      <AgentBubble>
        {track === "corper" && (
          <>
            I found <strong>{ppas.length} verified PPAs</strong> near {where?.lga ?? "you"}. Two hosts have already asked to meet Corps Members like you.
            {verified ? " Hosts see your Verified Corper badge first." : " Verify your call-up letter later to be seen first."}
          </>
        )}
        {track === "seeker" && (
          <>
            I found <strong>{jobs.length} roles</strong> that fit, with the reason for each. Say yes and I&apos;ll ask the hiring manager to meet you. Nobody sees your details until you do.
          </>
        )}
        {track === "company" && (
          <>
            Your brief is live. I found <strong>{people.length} people</strong> who told Ali they want a role like this. Names stay hidden until they say yes.
          </>
        )}
      </AgentBubble>

      <ul className="flex flex-col gap-3">
        {track === "corper" && visible(ppas).map((m) => <PpaCard key={m.id} m={m} {...shared} />)}
        {track === "seeker" && visible(jobs).map((m) => <JobCard key={m.id} m={m} {...shared} />)}
        {track === "company" && visible(people).map((c) => <CandidateCard key={c.id} c={c} {...shared} />)}
      </ul>

      {track === "corper" && (
        <AgentBubble>
          Hosts often ask for a request letter. I drafted one for you.{" "}
          <button type="button" onClick={() => setLetterOpen(true)} className="font-semibold text-leaf-700 underline underline-offset-2">
            Read my request letter
          </button>
        </AgentBubble>
      )}
      {track === "seeker" && (
        <AgentBubble>
          Want me to apply for you while you sleep? Auto-apply is part of{" "}
          <Link href="/#pricing" className="font-semibold text-leaf-700 underline underline-offset-2">
            Premium
          </Link>
          . You approve it once, and I never apply to more than 10 jobs a day.
        </AgentBubble>
      )}

      <div className="animate-rise rounded-2xl border border-leaf-300 bg-leaf-100 p-4">
        <p className="font-semibold">That&apos;s your setup done.</p>
        <p className="mt-1 text-[15px] text-muted">Your dashboard is the next screen we&apos;re building. These results are sample data for now.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/" className="inline-flex h-11 items-center rounded-xl bg-leaf-700 px-5 font-semibold text-white hover:bg-leaf-800">
            Back to home
          </Link>
          <button type="button" onClick={onRestart} className="h-11 rounded-xl border-[1.5px] border-leaf-700 bg-white px-5 font-semibold text-leaf-800 hover:bg-leaf-100">
            Start over
          </button>
        </div>
      </div>

      <LetterDialog open={letterOpen} onClose={() => setLetterOpen(false)} text={letter} />
    </div>
  );
}
