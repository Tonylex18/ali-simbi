"use client";

import { useState } from "react";
import type { Answer, InputSpec } from "@/lib/onboarding/types";

type Spec = Extract<InputSpec, { kind: "stepper" }>;

export default function StepperAnswer({ spec, onSubmit }: { spec: Spec; onSubmit: (a: Answer) => void }) {
  const [n, setN] = useState(spec.initial);
  const btn =
    "grid h-12 w-12 place-items-center rounded-xl border-[1.5px] border-[#d5dbd1] bg-white text-xl font-semibold transition-colors hover:border-leaf-500 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3" role="group" aria-label="How many">
        <button type="button" className={btn} aria-label="One fewer" disabled={n <= spec.min} onClick={() => setN((v) => Math.max(spec.min, v - 1))}>
          −
        </button>
        <output aria-live="polite" className="min-w-12 text-center font-mono text-2xl font-semibold">
          {n}
        </output>
        <button type="button" className={btn} aria-label="One more" disabled={n >= spec.max} onClick={() => setN((v) => Math.min(spec.max, v + 1))}>
          +
        </button>
      </div>
      <button
        type="button"
        onClick={() => onSubmit({ value: n, label: `${n}${spec.unit ? ` ${spec.unit}` : ""}` })}
        className="h-11 rounded-xl bg-leaf-700 px-6 text-[15px] font-semibold text-white hover:bg-leaf-800"
      >
        Continue
      </button>
    </div>
  );
}
