"use client";

import { useState } from "react";
import { currencySymbol, formatMoney } from "@/lib/onboarding/data";
import type { Answer, Currency, InputSpec } from "@/lib/onboarding/types";

type Spec = Extract<InputSpec, { kind: "money" }>;

export default function MoneyAnswer({ spec, onSubmit }: { spec: Spec; onSubmit: (a: Answer) => void }) {
  const [currency, setCurrency] = useState<Currency>(spec.currencies[0]);
  const [raw, setRaw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const amount = Number(raw.replace(/\D/g, ""));

  const send = (n: number) => onSubmit({ value: { currency, amount: n }, label: `${formatMoney(currency, n)} ${spec.unit}` });

  function submit() {
    if (!amount) return setError("Enter an amount, or choose one below.");
    send(amount);
  }

  return (
    <div className="flex flex-col gap-3">
      <div role="radiogroup" aria-label="Currency" className="flex gap-1.5">
        {spec.currencies.map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={currency === c}
            onClick={() => {
              setCurrency(c);
              setError(null);
            }}
            className={`h-10 rounded-lg px-3.5 font-mono text-sm font-semibold transition-colors ${
              currency === c ? "bg-forest-900 text-white" : "border border-[#d5dbd1] bg-white text-muted hover:border-leaf-500"
            }`}
          >
            {currencySymbol[c]} {c}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex items-start gap-2"
        noValidate
      >
        <div className="min-w-0 flex-1">
          <label htmlFor="money-amount" className="sr-only">
            Amount {spec.unit}
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-muted">{currencySymbol[currency]}</span>
            <input
              id="money-amount"
              autoFocus
              inputMode="numeric"
              value={raw ? new Intl.NumberFormat("en-NG").format(amount) : ""}
              onChange={(e) => {
                setRaw(e.target.value);
                setError(null);
              }}
              placeholder={`Amount ${spec.unit}`}
              autoComplete="off"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "money-error" : undefined}
              className={`h-12 w-full rounded-xl border-[1.5px] bg-white pl-9 pr-4 font-mono text-base focus:outline-none ${
                error ? "border-red-600 focus:ring-4 focus:ring-red-100" : "border-[#d5dbd1] focus:border-leaf-700 focus:ring-4 focus:ring-leaf-100"
              }`}
            />
          </div>
          {error && (
            <p id="money-error" role="alert" className="mt-1.5 text-sm text-red-700">
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

      <div className="flex flex-wrap gap-2" role="group" aria-label="Common amounts">
        {spec.suggestions[currency].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => send(n)}
            className="inline-flex min-h-10 items-center rounded-full border border-[#d5dbd1] bg-white px-3.5 font-mono text-sm font-medium text-muted transition-colors hover:border-leaf-500 hover:text-ink"
          >
            {formatMoney(currency, n)}
          </button>
        ))}
        {spec.notSure && (
          <button
            type="button"
            onClick={() => onSubmit({ value: { currency, amount: null }, label: spec.notSure ?? "Not sure yet" })}
            className="inline-flex min-h-10 items-center rounded-full px-3.5 text-sm font-semibold text-leaf-800 underline-offset-4 hover:underline"
          >
            {spec.notSure}
          </button>
        )}
      </div>
    </div>
  );
}
