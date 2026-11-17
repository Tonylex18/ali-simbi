"use client";

import { useState } from "react";
import { lgasByState, nigerianStates } from "@/lib/onboarding/data";
import type { Answer } from "@/lib/onboarding/types";

const selectClass =
  "h-12 w-full rounded-xl border-[1.5px] border-[#d5dbd1] bg-white px-3.5 text-base focus:border-leaf-700 focus:outline-none focus:ring-4 focus:ring-leaf-100";

export default function StateLgaAnswer({ stateLabel, onSubmit }: { stateLabel: string; onSubmit: (a: Answer) => void }) {
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const known = state ? lgasByState[state] : undefined;
  const ready = Boolean(state && lga.trim());

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) onSubmit({ value: { state, lga: lga.trim() }, label: `${state} · ${lga.trim()}` });
      }}
      className="flex flex-col gap-3"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="sl-state" className="text-sm font-semibold">
            {stateLabel}
          </label>
          <select
            id="sl-state"
            autoFocus
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              setLga("");
            }}
            className={`mt-1.5 ${selectClass}`}
          >
            <option value="">Choose a state</option>
            {nigerianStates.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sl-lga" className="text-sm font-semibold">
            Local government area
          </label>
          {known ? (
            <select id="sl-lga" value={lga} onChange={(e) => setLga(e.target.value)} className={`mt-1.5 ${selectClass}`}>
              <option value="">Choose an LGA</option>
              {known.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          ) : (
            <input
              id="sl-lga"
              value={lga}
              onChange={(e) => setLga(e.target.value)}
              disabled={!state}
              placeholder={state ? "Type your LGA" : "Choose a state first"}
              autoComplete="off"
              className={`mt-1.5 ${selectClass} disabled:bg-cream disabled:text-muted`}
            />
          )}
        </div>
      </div>
      <button
        type="submit"
        disabled={!ready}
        className="h-11 self-end rounded-xl bg-leaf-700 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-leaf-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue
      </button>
    </form>
  );
}
