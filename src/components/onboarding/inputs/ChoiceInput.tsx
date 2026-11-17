"use client";

import { useState } from "react";
import type { Answer, Option } from "@/lib/onboarding/types";

const chip =
  "inline-flex min-h-11 items-center gap-1.5 rounded-full border-[1.5px] px-4 text-[15px] font-semibold transition-colors";

/** One tap answers, like a quick reply in a chat. */
export function SingleChoice({ options, onSubmit }: { options: Option[]; onSubmit: (a: Answer) => void }) {
  return (
    <div role="group" aria-label="Choose one" className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onSubmit({ value: o.value, label: o.label })}
          className={`${chip} border-leaf-700 bg-white text-leaf-800 hover:bg-leaf-100`}
        >
          {o.label}
          {o.hint && <span className="font-normal text-muted">{o.hint}</span>}
        </button>
      ))}
    </div>
  );
}

type MultiProps = {
  options: Option[];
  min?: number;
  max?: number;
  customLabel?: string;
  cta?: string;
  onSubmit: (a: Answer) => void;
};

export function MultiChoice({ options, min = 1, max, customLabel, cta = "Continue", onSubmit }: MultiProps) {
  const [extra, setExtra] = useState<Option[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const all = [...options, ...extra];
  const atMax = max !== undefined && selected.length >= max;

  const toggle = (v: string) =>
    setSelected((s) => (s.includes(v) ? s.filter((x) => x !== v) : atMax ? s : [...s, v]));

  function addCustom() {
    const v = draft.trim();
    if (!v) return;
    const exists = all.find((o) => o.label.toLowerCase() === v.toLowerCase());
    if (!exists) setExtra((e) => [...e, { label: v, value: v }]);
    const value = exists?.value ?? v;
    setSelected((s) => (s.includes(value) || atMax ? s : [...s, value]));
    setDraft("");
  }

  function submit() {
    const labels = selected.map((v) => all.find((o) => o.value === v)?.label ?? v);
    onSubmit({ value: selected, label: labels.length ? labels.join(", ") : "None of these" });
  }

  return (
    <div className="flex flex-col gap-3">
      <div role="group" aria-label={max ? `Choose up to ${max}` : "Choose any"} className="flex flex-wrap gap-2">
        {all.map((o) => {
          const on = selected.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              disabled={!on && atMax}
              onClick={() => toggle(o.value)}
              className={`${chip} ${
                on ? "border-forest-900 bg-forest-900 text-white" : "border-[#d5dbd1] bg-white hover:border-leaf-500 disabled:opacity-40"
              }`}
            >
              {on && (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="var(--color-leaf-300)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              )}
              {o.label}
            </button>
          );
        })}
      </div>

      {customLabel && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addCustom();
          }}
          className="flex gap-2"
        >
          <label className="sr-only" htmlFor="custom-choice">
            {customLabel}
          </label>
          <input
            id="custom-choice"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={customLabel}
            className="h-11 min-w-0 flex-1 rounded-xl border-[1.5px] border-[#d5dbd1] bg-white px-3.5 text-[15px] focus:border-leaf-700 focus:outline-none focus:ring-4 focus:ring-leaf-100"
          />
          <button type="submit" className="h-11 rounded-xl border-[1.5px] border-leaf-700 px-4 text-[15px] font-semibold text-leaf-800 hover:bg-leaf-100">
            Add
          </button>
        </form>
      )}

      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted" aria-live="polite">
          {max ? `${selected.length} of ${max} chosen` : selected.length ? `${selected.length} chosen` : ""}
        </span>
        <button
          type="button"
          disabled={selected.length < min}
          onClick={submit}
          className="h-11 rounded-xl bg-leaf-700 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-leaf-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {cta}
        </button>
      </div>
    </div>
  );
}
