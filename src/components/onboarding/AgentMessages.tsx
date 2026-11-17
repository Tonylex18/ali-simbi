"use client";

import { useEffect, useState } from "react";
import type { Msg, WidgetKey } from "@/lib/onboarding/types";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { AgentBubble, TypingBubble } from "./Bubbles";

type Item = { kind: "text"; text: string } | { kind: "widget"; key: WidgetKey };

type Props = {
  /** Changes when the step changes, so the playback starts fresh. */
  stepId: string;
  messages: Msg[];
  /** Show everything at once (used when someone goes back to an earlier question). */
  instant?: boolean;
  onDone: (stepId: string) => void;
  renderWidget: (key: WidgetKey) => React.ReactNode;
};

/** Plays the agent's messages one after another: typing dots, then the words stream in. */
export default function AgentMessages({ stepId, messages, instant, onDone, renderWidget }: Props) {
  const reducedMotion = useReducedMotion();
  const reduced = reducedMotion || Boolean(instant);
  const [fixed] = useState(messages);
  const [items, setItems] = useState<Item[]>([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
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

    async function run() {
      setItems([]);
      setTyping(false);
      for (const m of fixed) {
        if (cancelled) return;
        if (typeof m === "string") {
          if (reduced) {
            setItems((prev) => [...prev, { kind: "text", text: m }]);
            continue;
          }
          setTyping(true);
          await wait(450 + Math.min(m.length * 7, 700));
          if (cancelled) return;
          setTyping(false);
          setItems((prev) => [...prev, { kind: "text", text: "" }]);
          const words = m.split(" ");
          for (let i = 1; i <= words.length; i++) {
            const text = words.slice(0, i).join(" ");
            setItems((prev) => prev.map((it, idx) => (idx === prev.length - 1 && it.kind === "text" ? { ...it, text } : it)));
            await wait(26);
            if (cancelled) return;
          }
          await wait(220);
        } else {
          if (!reduced) {
            setTyping(true);
            await wait(650);
            if (cancelled) return;
            setTyping(false);
          }
          setItems((prev) => [...prev, { kind: "widget", key: m.widget }]);
          await wait(reduced ? 0 : 300);
        }
      }
      if (!cancelled) onDone(stepId);
    }
    void run();

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [fixed, onDone, stepId, reduced]);

  return (
    <>
      {items.map((it, i) =>
        it.kind === "text" ? (
          <AgentBubble key={i}>{it.text}</AgentBubble>
        ) : (
          <div key={i} className="animate-rise">
            {renderWidget(it.key)}
          </div>
        ),
      )}
      {typing && <TypingBubble />}
    </>
  );
}
