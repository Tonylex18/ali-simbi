"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/Logo";
import { agentFor, makeCtx, visibleSteps } from "@/lib/onboarding/flows";
import type { Answer, Ctx, MockSession, Msg, Progress, Step, Track, WidgetKey } from "@/lib/onboarding/types";
import { previews, progressStore, resetOnboarding, sessionStore, startSession, trackFor } from "@/lib/session";
import { useReducedMotion } from "@/lib/useReducedMotion";
import AgentMessages from "./AgentMessages";
import { AgentBubble, UserBubble } from "./Bubbles";
import CvScoreCard from "./CvScoreCard";
import FactsPanel from "./FactsPanel";
import InputDock from "./InputDock";
import ResultsStage from "./ResultsStage";

const EMPTY: Progress = { answers: {}, requested: [] };

/** Messages for a step: a short reply to the previous answer (and any widget), then the question. */
function messagesFor(step: Step, prev: { step: Step; answer: Answer } | undefined, ctx: Ctx): Msg[] {
  const out: Msg[] = [];
  if (prev) {
    const reply = prev.step.ack?.(prev.answer, ctx);
    if (reply) out.push(reply);
    if (prev.step.widget && !prev.answer.skipped) out.push({ widget: prev.step.widget });
  }
  return [...out, ...step.ask(ctx)];
}

function factValue(step: Step, answer: Answer | undefined): string | null {
  if (!answer) return null;
  if (answer.skipped) return "Later";
  if (step.id === "letter") return "Verified ✓";
  if (step.id === "verify") return "Under review";
  if (step.id === "cv") return "Uploaded";
  return answer.label;
}

function Skeleton() {
  return (
    <div className="grid min-h-screen place-items-center bg-cream" aria-busy="true">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-leaf-700" role="status" aria-label="Loading" />
    </div>
  );
}

/** Shown when there is no sign-up in this browser: start one, or preview a flow. */
function Welcome() {
  return (
    <div className="grid min-h-screen place-items-center bg-cream px-5 py-10">
      <div className="w-full max-w-lg animate-rise rounded-3xl border border-line bg-white p-6 sm:p-8">
        <Wordmark />
        <h1 className="mt-6 text-3xl font-bold tracking-tight">Let&apos;s get you set up</h1>
        <p className="mt-2 text-[17px] text-muted">Create an account and Ali or Simbi will take it from there. It takes about 3 minutes.</p>
        <Link href="/sign-up" className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl bg-leaf-700 font-semibold text-white hover:bg-leaf-800">
          Create an account
        </Link>
        <div className="mt-6 border-t border-line pt-5">
          <p className="text-sm font-semibold">Just looking? Preview a flow</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {previews.map((p) => (
              <button
                key={p.track}
                type="button"
                onClick={() => startSession(p.session)}
                className="h-11 rounded-xl border-[1.5px] border-leaf-700 px-4 text-[15px] font-semibold text-leaf-800 hover:bg-leaf-100"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingApp() {
  const session = sessionStore.useValue();
  const progress = progressStore.useValue();
  if (session === "loading" || progress === "loading") return <Skeleton />;
  if (!session) return <Welcome />;
  return <Flow session={session} progress={progress ?? EMPTY} />;
}

function Flow({ session, progress }: { session: MockSession; progress: Progress }) {
  const reduced = useReducedMotion();
  const track: Track = trackFor(session);
  const agent = agentFor(track);
  const first = session.name.trim().split(/\s+/)[0] || "there";
  const answers = progress.answers;

  const steps = visibleSteps(track, answers);
  const ctx = makeCtx(first, session.company ?? "your company", answers);
  const answered = steps.filter((s) => answers[s.id]);
  const current = steps.find((s) => !answers[s.id]);
  const percent = Math.round((answered.length / steps.length) * 100);

  const [readyStep, setReadyStep] = useState<string | null>(null);
  const [instantStep, setInstantStep] = useState<string | null>(null);
  const markReady = useCallback((id: string) => setReadyStep(id), []);

  // Keep the newest message in view as the conversation grows.
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    const inner = el?.firstElementChild;
    if (!el || !inner) return;
    const ro = new ResizeObserver(() => el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" }));
    ro.observe(inner);
    return () => ro.disconnect();
  }, [reduced]);

  const save = (next: Partial<Progress>) => progressStore.set({ ...progress, ...next });
  const submit = (step: Step, answer: Answer) => save({ answers: { ...answers, [step.id]: answer } });
  const skip = (step: Step) => submit(step, { value: null, label: step.skip ?? "Skipped", skipped: true });
  const back = () => {
    const last = answered[answered.length - 1];
    if (!last) return;
    const { [last.id]: _removed, ...rest } = answers;
    void _removed;
    setInstantStep(last.id);
    save({ answers: rest });
  };
  const request = (id: string) => save({ requested: progress.requested.includes(id) ? progress.requested : [...progress.requested, id] });

  const renderWidget = (key: WidgetKey) => (key === "cv-score" ? <CvScoreCard answers={answers} /> : null);

  const facts = steps.filter((s) => s.fact).map((s) => ({ label: s.fact as string, value: factValue(s, answers[s.id]) }));
  const verifiedCorper = track === "corper" ? { label: "Verified Corper", on: Boolean(answers.letter && !answers.letter.skipped) } : null;
  const subject = track === "company" ? "your role" : "you";

  const finalPrev = answered.length ? { step: answered[answered.length - 1], answer: answers[answered[answered.length - 1].id] as Answer } : undefined;
  const finalMessages: Msg[] = finalPrev ? messagesFor({ id: "final", ask: () => [], input: { kind: "single", options: [] } }, finalPrev, ctx) : [];
  const ready = current ? readyStep === current.id : readyStep === "final";
  const spec = current ? (typeof current.input === "function" ? current.input(ctx) : current.input) : null;

  return (
    <div className="flex h-dvh flex-col bg-cream">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-14 w-full max-w-[1240px] items-center gap-4 px-4 sm:px-6">
          <Link href="/" aria-label="Ali & Simbi home">
            <Wordmark />
          </Link>
          <div className="ml-auto flex items-center gap-4 text-[15px]">
            <span className="hidden text-muted sm:inline" aria-live="polite">
              {current ? `Step ${answered.length + 1} of ${steps.length}` : "All done"}
            </span>
            <Link href="/" className="font-semibold text-leaf-700 underline-offset-4 hover:underline">
              Save and exit
            </Link>
          </div>
        </div>
        <div className="h-1 bg-leaf-100" aria-hidden="true">
          <div className="h-full bg-leaf-700 transition-[width] duration-500 ease-out" style={{ width: `${percent}%` }} />
        </div>
      </header>

      <div className="mx-auto grid min-h-0 w-full max-w-[1240px] flex-1 gap-6 p-3 sm:p-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-line bg-white" aria-label={`Chat with ${agent}`}>
          <div className="flex items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
            <span className={`grid h-11 w-11 place-items-center rounded-full text-lg font-bold ${agent === "Ali" ? "bg-leaf-200 text-forest-900" : "bg-forest-900 text-leaf-300"}`}>
              {agent[0]}
            </span>
            <div>
              <p className="font-semibold leading-tight">{agent}</p>
              <p className="text-[13px] font-medium text-leaf-700">● {agent === "Ali" ? "Your career agent" : "Your hiring agent"} · online</p>
            </div>
          </div>

          <details className="border-b border-line bg-cream lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-2.5 text-sm font-semibold [&::-webkit-details-marker]:hidden">
              What {agent} knows
              <span className="font-mono text-leaf-700">{percent}%</span>
            </summary>
            <div className="max-h-72 overflow-y-auto px-3 pb-3">
              <FactsPanel agent={agent} subject={subject} facts={facts} percent={percent} badge={verifiedCorper} compact />
            </div>
          </details>

          <div ref={scrollRef} role="log" aria-live="polite" aria-label="Conversation" className="min-h-0 flex-1 overflow-y-auto bg-[#fafbf8]">
            <div className="flex flex-col gap-3 p-4 sm:p-5">
              {answered.map((step, i) => {
                const prev = i > 0 ? { step: answered[i - 1], answer: answers[answered[i - 1].id] as Answer } : undefined;
                const answer = answers[step.id] as Answer;
                return (
                  <Fragment key={step.id}>
                    {messagesFor(step, prev, ctx).map((m, j) =>
                      typeof m === "string" ? <AgentBubble key={j}>{m}</AgentBubble> : <Fragment key={j}>{renderWidget(m.widget)}</Fragment>,
                    )}
                    <UserBubble>{answer.skipped ? answer.label : answer.label}</UserBubble>
                  </Fragment>
                );
              })}

              {current ? (
                <AgentMessages
                  key={current.id}
                  stepId={current.id}
                  messages={messagesFor(current, finalPrev, ctx)}
                  instant={instantStep === current.id}
                  onDone={markReady}
                  renderWidget={renderWidget}
                />
              ) : (
                <>
                  <AgentMessages key="final" stepId="final" messages={finalMessages} onDone={markReady} renderWidget={renderWidget} />
                  {ready && (
                    <ResultsStage track={track} answers={answers} session={session} requested={progress.requested} onRequest={request} onRestart={resetOnboarding} />
                  )}
                </>
              )}
            </div>
          </div>

          {current && spec && (
            <div className="border-t border-line bg-white px-4 py-3 sm:px-5 sm:py-4">
              {ready ? (
                <InputDock
                  key={current.id}
                  spec={spec}
                  onSubmit={(a) => submit(current, a)}
                  skip={current.skip}
                  onSkip={() => skip(current)}
                  canGoBack={answered.length > 0}
                  onBack={back}
                />
              ) : (
                <p className="py-3 text-center text-sm text-muted" aria-hidden="true">
                  {agent} is typing…
                </p>
              )}
            </div>
          )}
        </section>

        <aside className="hidden min-h-0 overflow-y-auto lg:block" aria-label={`What ${agent} knows`}>
          <FactsPanel agent={agent} subject={subject} facts={facts} percent={percent} badge={verifiedCorper} />
        </aside>
      </div>
    </div>
  );
}
