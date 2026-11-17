"use client";

import { useState, type ReactNode } from "react";
import { passwordRules, passwordScore } from "@/lib/validation";
import { describedBy, FieldMessage, inputClass } from "./Field";

type Props = {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | null;
  autoComplete: "new-password" | "current-password";
  /** Show the strength bar and checklist (sign up and reset). */
  showRules?: boolean;
  autoFocus?: boolean;
  labelRight?: ReactNode;
};

const strengthLabel = ["", "Weak", "Almost there", "Strong"] as const;
const strengthColor = ["bg-line", "bg-red-500", "bg-amber-500", "bg-leaf-700"] as const;

export default function PasswordField({
  id,
  label = "Password",
  value,
  onChange,
  onBlur,
  error,
  autoComplete,
  showRules,
  autoFocus,
  labelRight,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [caps, setCaps] = useState(false);
  const score = passwordScore(value);
  const hint = caps ? "Caps Lock is on." : undefined;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold">
          {label}
        </label>
        {labelRight}
      </div>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          autoCapitalize="none"
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-describedby={[describedBy(id, error, hint), showRules ? `${id}-rules` : undefined].filter(Boolean).join(" ") || undefined}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            setCaps(false);
            onBlur?.();
          }}
          onKeyUp={(e) => setCaps(e.getModifierState("CapsLock"))}
          className={`${inputClass(error)} pr-[4.5rem]`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-1.5 top-[0.4rem] h-10 rounded-lg px-3 text-sm font-semibold text-leaf-700 hover:bg-leaf-100"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      <FieldMessage id={id} error={error} hint={hint} />

      {showRules && (
        <div id={`${id}-rules`} className="mt-3">
          <div className="flex items-center gap-3">
            <div className="grid flex-1 grid-cols-3 gap-1.5" aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <span key={n} className={`h-1.5 rounded-full transition-colors duration-300 ${score >= n ? strengthColor[score] : "bg-line"}`} />
              ))}
            </div>
            <span className="w-24 text-right text-xs font-semibold text-muted" aria-live="polite">
              {value ? strengthLabel[score] : ""}
            </span>
          </div>
          <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
            {passwordRules.map((r) => {
              const met = r.test(value);
              return (
                <li key={r.id} className={`flex items-center gap-1.5 text-[13px] transition-colors ${met ? "text-leaf-800" : "text-muted"}`}>
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {met ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <circle cx="12" cy="12" r="6" />}
                  </svg>
                  {r.label}
                  <span className="sr-only">{met ? " (done)" : " (not yet)"}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
