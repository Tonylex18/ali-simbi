"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

type Side = "ali" | "simbi";
type CardKind = "ppa" | "candidates";
type Tap = "idle" | "press" | "done";

// A script is a list of steps that play one after another, like a screen recording.
type Step =
  | { kind: "user"; text: string }
  | { kind: "agent"; text: string }
  | { kind: "card"; card: CardKind }
  | { kind: "tap" };

type NewItem =
  | { kind: "msg"; role: "user" | "agent"; text: string }
  | { kind: "card"; card: CardKind };
type Item = NewItem & { id: number };

const scripts: Record<Side, Step[]> = {
  ali: [
    { kind: "user", text: "I'm a Computer Science corper in Kano. I want a tech PPA close to home." },
    { kind: "agent", text: "Found 4 verified PPAs in Kano. 2 hosts have already asked to meet Corps Members like you." },
    { kind: "card", card: "ppa" },
    { kind: "tap" },
    { kind: "agent", text: "Done. I've told them you're interested. You'll hear on WhatsApp when they confirm a time, and your details stay private until then." },
  ],
  simbi: [
    { kind: "user", text: "I need a junior developer for our Lagos office. Three days on site." },
    { kind: "agent", text: "Got it. Here are people who told Ali they want a role like this. Names stay hidden until they say yes." },
    { kind: "card", card: "candidates" },
    { kind: "tap" },
    { kind: "agent", text: "Requested. You'll see their name and contact once they say yes." },
  ],
};

const names: Record<Side, string> = { ali: "Ali", simbi: "Simbi" };

const fitStyle = {
  Strong: "bg-leaf-200 text-forest-900",
  Good: "bg-forest-100 text-forest-800",
  Stretch: "bg-[#f3ead2] text-[#6b4e0a]",
} as const;

const candidates = [
  { who: "BSc Computer Science", where: "Corps Member · Lagos Mainland", fit: "Strong" },
  { who: "HND Computer Engineering", where: "Corps Member · Lagos Island", fit: "Good" },
  { who: "BSc Mathematics", where: "Corps Member · Ogun", fit: "Stretch" },
] as const;

function finalItems(side: Side): Item[] {
  return scripts[side].flatMap<Item>((s, i) => {
    if (s.kind === "tap") return [];
    if (s.kind === "card") return [{ id: i, kind: "card", card: s.card }];
    return [{ id: i, kind: "msg", role: s.kind, text: s.text }];
  });
}

/** A visual-only button: the demo is a picture, so it is not focusable. */
function FauxButton({
  children,
  primary,
  state = "idle",
}: {
  children: React.ReactNode;
  primary?: boolean;
  state?: Tap;
}) {
  const pressed = state === "press";
  return (
    <span
      className={`inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold transition-all duration-150 ${
        primary
          ? state === "done"
            ? "bg-forest-100 text-forest-800"
            : "bg-leaf-700 text-white"
          : "border border-line bg-white font-medium"
      } ${pressed ? "scale-95 ring-4 ring-leaf-300" : ""}`}
    >
      {children}
    </span>
  );
}

function Bubble({ role, text, streaming }: { role: "user" | "agent"; text: string; streaming?: boolean }) {
  const me = role === "user";
  return (
    <div className={`flex animate-rise ${me ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] px-4 py-2.5 text-[15px] leading-relaxed ${
          me ? "rounded-2xl rounded-br-sm bg-forest-900 text-white" : "rounded-2xl rounded-bl-sm border border-line bg-white"
        }`}
      >
        {text}
        {streaming && <span className="caret ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-current" />}
      </div>
    </div>
  );
}

function Thinking() {
  return (
    <div className="flex animate-rise justify-start">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-line bg-white px-4 py-3.5">
        <span className="typing-dot h-2 w-2 rounded-full bg-muted" />
        <span className="typing-dot h-2 w-2 rounded-full bg-muted" />
        <span className="typing-dot h-2 w-2 rounded-full bg-muted" />
      </div>
    </div>
  );
}

function PpaCard({ tap }: { tap: Tap }) {
  return (
    <div className="animate-rise rounded-2xl border border-line bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">Customer support · Telecoms reseller</p>
          <p className="mt-0.5 font-mono text-[13px] text-muted">Kano Municipal · ₦50k–₦100k · Onsite</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${fitStyle.Strong}`}>Strong fit</span>
      </div>
      <p className="mt-2 text-sm text-muted">Matches your degree, your location and your pay floor.</p>
      <div className="mt-3 flex gap-2">
        <FauxButton primary state={tap}>
          {tap === "done" ? "Intro requested ✓" : "Yes, introduce me"}
        </FauxButton>
        <FauxButton>Not for me</FauxButton>
      </div>
    </div>
  );
}

function CandidateList({ tap }: { tap: Tap }) {
  return (
    <ul className="flex flex-col gap-2">
      {candidates.map((c, i) => (
        <li
          key={c.who}
          style={{ animationDelay: `${i * 350}ms` }}
          className="flex animate-rise items-center gap-3 rounded-xl border border-line bg-white p-3"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-medium">{c.who}</p>
            <p className="font-mono text-[13px] text-muted">{c.where}</p>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${fitStyle[c.fit]}`}>{c.fit}</span>
          {i === 0 ? (
            <span
              className={`inline-flex h-9 items-center rounded-lg border px-3 text-sm font-semibold transition-all duration-150 ${
                tap === "done" ? "border-transparent bg-forest-100 text-forest-800" : "border-leaf-700 text-leaf-700"
              } ${tap === "press" ? "scale-95 ring-4 ring-leaf-300" : ""}`}
            >
              {tap === "done" ? "Requested ✓" : "Request intro"}
            </span>
          ) : (
            <span className="inline-flex h-9 items-center rounded-lg border border-leaf-700 px-3 text-sm font-semibold text-leaf-700">
              Request intro
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

const reducedQuery = "(prefers-reduced-motion: reduce)";
function subscribeReduced(onChange: () => void) {
  const m = window.matchMedia(reducedQuery);
  m.addEventListener("change", onChange);
  return () => m.removeEventListener("change", onChange);
}
const getReduced = () => window.matchMedia(reducedQuery).matches;

export default function HeroDemo() {
  const [side, setSide] = useState<Side>("ali");
  // People who ask for less motion start with the finished conversation, not the animation.
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);
  const [override] = useState<boolean | null>(null);
  const playing = override ?? !reduced;

  const [liveItems, setItems] = useState<Item[]>([]);
  const [liveComposer, setComposer] = useState("");
  const [liveThinking, setThinking] = useState(false);
  const [liveTap, setTap] = useState<Tap>("idle");
  const [sendPulse, setSendPulse] = useState(false);

  // When paused, show the finished conversation instead of the running one.
  const items = playing ? liveItems : finalItems(side);
  const composer = playing ? liveComposer : "";
  const thinking = playing && liveThinking;
  const tap: Tap = playing ? liveTap : "done";

  useEffect(() => {
    if (!playing) return;

    let cancelled = false;
    const timers = new Set<number>();
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = window.setTimeout(() => {
          timers.delete(t);
          resolve();
        }, ms);
        timers.add(t);
      });

    let nextId = 0;
    const push = (item: NewItem) => setItems((prev) => [...prev, { ...item, id: nextId++ }]);
    const setLastText = (text: string) =>
      setItems((prev) => prev.map((it, i) => (i === prev.length - 1 && it.kind === "msg" ? { ...it, text } : it)));

    async function play() {
      while (!cancelled) {
        setItems([]);
        setComposer("");
        setThinking(false);
        setTap("idle");
        await wait(700);

        for (const step of scripts[side]) {
          if (cancelled) return;

          if (step.kind === "user") {
            // Type into the message box, then send it into the thread.
            for (let i = 1; i <= step.text.length; i++) {
              setComposer(step.text.slice(0, i));
              await wait(34);
              if (cancelled) return;
            }
            await wait(450);
            setSendPulse(true);
            await wait(180);
            setSendPulse(false);
            setComposer("");
            push({ kind: "msg", role: "user", text: step.text });
            await wait(500);
          } else if (step.kind === "agent") {
            setThinking(true);
            await wait(1100);
            if (cancelled) return;
            setThinking(false);
            push({ kind: "msg", role: "agent", text: "" });
            const words = step.text.split(" ");
            for (let i = 1; i <= words.length; i++) {
              setLastText(words.slice(0, i).join(" "));
              await wait(55);
              if (cancelled) return;
            }
            await wait(700);
          } else if (step.kind === "card") {
            push({ kind: "card", card: step.card });
            await wait(1800);
          } else {
            await wait(600);
            setTap("press");
            await wait(260);
            setTap("done");
            await wait(600);
          }
        }
        await wait(6000);
      }
    }
    void play();

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [side, playing]);

  const name = names[side];
  const streamingLast = playing && !thinking;

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-[#fafbf8] shadow-[0_24px_60px_-24px_rgba(11,74,60,0.35)]">
      <div role="tablist" aria-label="See it from each side" className="flex border-b border-line bg-white p-1.5">
        {(
          [
            ["ali", "Ali · job seekers"],
            ["simbi", "Simbi · employers"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={side === id}
            aria-controls="demo-panel"
            onClick={() => setSide(id)}
            className={`h-10 flex-1 rounded-xl text-sm font-semibold transition-colors ${
              side === id ? "bg-forest-900 text-white" : "text-muted hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Fixed total height: the message box can grow to extra lines without resizing the card. */}
      <div role="tabpanel" id="demo-panel" aria-labelledby={`tab-${side}`} className="flex h-134 flex-col">
        {/* The moving picture is hidden from screen readers; a plain transcript follows. */}
        <div aria-hidden="true" className="flex min-h-0 flex-1 flex-col justify-end gap-3 overflow-hidden p-4 `mask-[linear-gradient(to_bottom,transparent,black_2.5rem)]` sm:p-5">
          {items.map((it, idx) =>
            it.kind === "msg" ? (
              <Bubble
                key={it.id}
                role={it.role}
                text={it.text}
                streaming={streamingLast && idx === items.length - 1 && it.role === "agent" && !isFullLine(side, it.text)}
              />
            ) : it.card === "ppa" ? (
              <PpaCard key={it.id} tap={tap} />
            ) : (
              <CandidateList key={it.id} tap={tap} />
            ),
          )}
          {thinking && <Thinking />}
        </div>

        <div aria-hidden="true" className="shrink-0 px-4 pb-4 sm:px-5">
          {/* Like a real chat box: long text wraps onto the next line and the box grows upward. */}
          <div className="flex items-end gap-2 rounded-3xl border-[1.5px] border-line bg-white py-1.5 pl-5 pr-1.5">
            <span className={`min-w-0 flex-1 wrap-break-word py-2.25 text-[15px] leading-5.5 ${composer ? "text-ink" : "text-muted"}`}>
              {composer || `Message ${name}…`}
              {composer && <span className="caret ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-ink" />}
            </span>
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest-900 transition-transform duration-150 ${sendPulse ? "scale-90" : ""}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-leaf-300)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        </div>

        <ul className="sr-only">
          {scripts[side].map((s, i) =>
            s.kind === "user" ? (
              <li key={i}>You: {s.text}</li>
            ) : s.kind === "agent" ? (
              <li key={i}>
                {name}: {s.text}
              </li>
            ) : s.kind === "card" ? (
              <li key={i}>
                {s.card === "ppa"
                  ? "Match: Customer support at a telecoms reseller, Kano Municipal, 50 to 100 thousand naira a month, onsite, strong fit."
                  : "Shortlist: three Corps Members, labelled strong, good and stretch fit, with names hidden."}
              </li>
            ) : null,
          )}
        </ul>
      </div>
    </div>
  );
}

// True once a streamed line has reached its full text, so the caret stops.
function isFullLine(side: Side, text: string): boolean {
  return scripts[side].some((s) => s.kind === "agent" && s.text === text);
}
