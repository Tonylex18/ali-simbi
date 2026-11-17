"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { requestPasswordReset } from "@/lib/auth";
import { describeIdentifier, looksLikePhone, parseIdentifier, validateIdentifier } from "@/lib/validation";
import Field from "./Field";
import Notice from "./Notice";
import SubmitButton from "./SubmitButton";

const COOLDOWN = 30;

export default function ForgotForm() {
  const [identifier, setIdentifier] = useState("");
  const [touched, setTouched] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const fieldError = validateIdentifier(identifier);

  async function send() {
    const id = parseIdentifier(identifier);
    if (!id) return;
    setLoading(true);
    setError(null);
    const r = await requestPasswordReset({ identifier: id });
    setLoading(false);
    if (!r.ok) {
      setError(r.message);
      return;
    }
    setSentTo(describeIdentifier(id));
    setCooldown(COOLDOWN);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (fieldError) return document.getElementById("fp-identifier")?.focus();
    await send();
  }

  if (sentTo) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-leaf-200">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-forest-900)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="3" />
            <path d="M4 7.5l8 6 8-6" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Check your messages</h1>
          <p className="mt-2 text-[17px] leading-relaxed text-muted">
            If an account exists for <strong className="font-semibold text-ink">{sentTo}</strong>, we&apos;ve sent a link to reset your password.
          </p>
        </div>
        {error && <Notice tone="error">{error}</Notice>}
        <div className="flex flex-col gap-3 rounded-3xl border border-line bg-white p-5 sm:p-7">
          {process.env.NODE_ENV !== "production" && (
            <Link href="/reset-password?token=demo" className="inline-flex h-12 items-center justify-center rounded-xl border-[1.5px] border-dashed border-leaf-700 text-[15px] font-semibold text-leaf-700 hover:bg-leaf-100">
              Demo only: open the reset link
            </Link>
          )}
          <button
            type="button"
            onClick={send}
            disabled={cooldown > 0 || loading}
            className="inline-flex h-12 items-center justify-center rounded-xl border-[1.5px] border-[#d5dbd1] font-semibold transition-colors hover:border-leaf-500 hover:bg-leaf-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending…" : cooldown > 0 ? `Send again in ${cooldown}s` : "Send it again"}
          </button>
          <Link href="/sign-in" className="pt-1 text-center text-[15px] font-semibold text-leaf-700 underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Forgot your password?</h1>
        <p className="mt-1.5 text-[17px] text-muted">Enter your email or phone number and we&apos;ll send you a reset link.</p>
      </div>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5 rounded-3xl border border-line bg-white p-5 sm:p-7">
        {error && <Notice tone="error">{error}</Notice>}
        <Field
          id="fp-identifier"
          label="Email or phone number"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          onBlur={() => setTouched(true)}
          error={touched ? fieldError : null}
          autoComplete="username"
          inputMode={looksLikePhone(identifier) ? "tel" : "email"}
          autoCapitalize="none"
          spellCheck={false}
          autoFocus
        />
        <SubmitButton loading={loading} loadingLabel="Sending…">
          Send reset link
        </SubmitButton>
        <Link href="/sign-in" className="text-center text-[15px] font-semibold text-leaf-700 underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </form>
    </div>
  );
}
