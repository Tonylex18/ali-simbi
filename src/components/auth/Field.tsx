"use client";

import type { InputHTMLAttributes, ReactNode } from "react";

/** Shared input styling so every field (and the password field) looks and focuses the same. */
export const inputClass = (error?: string | null) =>
  `mt-1.5 h-12 w-full rounded-xl border-[1.5px] bg-white px-3.5 text-base transition-[border-color,box-shadow] placeholder:text-muted/70 focus:outline-none ${
    error
      ? "border-red-600 focus:ring-4 focus:ring-red-100"
      : "border-[#d5dbd1] hover:border-leaf-500 focus:border-leaf-700 focus:ring-4 focus:ring-leaf-100"
  }`;

export function FieldMessage({ id, error, hint }: { id: string; error?: string | null; hint?: ReactNode }) {
  if (error) {
    return (
      <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-sm text-red-700">
        <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7.5v5.5M12 16.5h.01" />
        </svg>
        <span>{error}</span>
      </p>
    );
  }
  return hint ? (
    <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">
      {hint}
    </p>
  ) : null;
}

export const describedBy = (id: string, error?: string | null, hint?: ReactNode) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className"> & {
  id: string;
  label: string;
  error?: string | null;
  hint?: ReactNode;
  optional?: boolean;
  labelRight?: ReactNode;
};

export default function Field({ id, label, error, hint, optional, labelRight, ...input }: Props) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold">
          {label}
          {optional && <span className="ml-1.5 font-normal text-muted">(optional)</span>}
        </label>
        {labelRight}
      </div>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={inputClass(error)}
        {...input}
      />
      <FieldMessage id={id} error={error} hint={hint} />
    </div>
  );
}
