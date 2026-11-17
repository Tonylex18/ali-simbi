"use client";

import { useState } from "react";
import type { Answer, InputSpec } from "@/lib/onboarding/types";

type Spec = Extract<InputSpec, { kind: "text" }>;

export default function TextAnswer({ spec, onSubmit }: { spec: Spec; onSubmit: (a: Answer) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(raw: string) {
    const v = (spec.transform ? spec.transform(raw) : raw).trim();
    if (!v) return setError("Type your answer first.");
    const problem = spec.validate?.(v) ?? null;
    if (problem) return setError(problem);
    onSubmit({ value: v, label: v });
  }

  return (
    <div className="flex flex-col gap-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
        className="flex items-start gap-2"
        noValidate
      >
        <div className="min-w-0 flex-1">
          <label htmlFor="answer-text" className="sr-only">
            Your answer
          </label>
          <input
            id="answer-text"
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(spec.transform ? spec.transform(e.target.value) : e.target.value);
              setError(null);
            }}
            placeholder={spec.placeholder}
            autoCapitalize={spec.autoCapitalize}
            autoComplete="off"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "answer-text-error" : undefined}
            className={`h-12 w-full rounded-xl border-[1.5px] bg-white px-4 text-base focus:outline-none ${
              error ? "border-red-600 focus:ring-4 focus:ring-red-100" : "border-[#d5dbd1] focus:border-leaf-700 focus:ring-4 focus:ring-leaf-100"
            }`}
          />
          {error && (
            <p id="answer-text-error" className="mt-1.5 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
        </div>
        <button type="submit" aria-label="Send" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-forest-900 hover:bg-forest-800">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-leaf-300)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </form>

      {spec.suggestions && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Suggestions">
          {spec.suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => submit(s)}
              className="inline-flex min-h-10 items-center rounded-full border border-[#d5dbd1] bg-white px-3.5 text-sm font-medium text-muted transition-colors hover:border-leaf-500 hover:text-ink"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
