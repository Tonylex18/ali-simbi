"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { resendCode, verifyCode } from "@/lib/auth";
import { formatPhone } from "@/lib/validation";
import Notice from "./Notice";
import SubmitButton from "./SubmitButton";

const COOLDOWN = 30;

export default function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const to = params.get("to");
  const via = params.get("via") === "phone" ? "phone" : "email";

  const inputRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(false);
  const [cooldown, setCooldown] = useState(COOLDOWN);
  const [resending, setResending] = useState(false);

  // Count down until the person may ask for a new code.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  if (!to) {
    return (
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl font-bold tracking-tight">We lost track of your sign-up</h1>
        <p className="text-[17px] text-muted">Open the link from your latest message, or start again.</p>
        <Link href="/sign-up" className="inline-flex h-12 items-center justify-center rounded-xl bg-leaf-700 font-semibold text-white hover:bg-leaf-800">
          Back to sign up
        </Link>
      </div>
    );
  }

  const shownTo = via === "phone" ? formatPhone(to) : to;

  async function submit(value: string) {
    if (loading || done) return;
    setLoading(true);
    setError(null);
    setNotice(null);
    const r = await verifyCode({ to: to as string, code: value });
    setLoading(false);
    if (!r.ok) {
      setError(r.message);
      setShake(true);
      setCode("");
      inputRef.current?.focus();
      return;
    }
    setDone(true);
    // Verified: continue to onboarding, which picks the flow from the sign-up choices.
    setTimeout(() => router.push("/onboarding"), 700);
  }

  function onChange(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 6);
    setCode(digits);
    setError(null);
    // Submit automatically as soon as the sixth digit is in (typed, pasted or autofilled).
    if (digits.length === 6) void submit(digits);
  }

  async function onResend() {
    setResending(true);
    setError(null);
    const r = await resendCode({ to: to as string });
    setResending(false);
    if (r.ok) {
      setNotice(`New code sent to ${shownTo}.`);
      setCooldown(COOLDOWN);
      setCode("");
      inputRef.current?.focus();
    } else {
      setError(r.message);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Enter your code</h1>
        <p className="mt-1.5 text-[17px] text-muted">
          We sent a 6-digit code to <strong className="font-semibold text-ink">{shownTo}</strong>
          {via === "phone" ? " by WhatsApp or SMS." : "."}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (code.length === 6) void submit(code);
          else setError("Enter all 6 digits.");
        }}
        noValidate
        className="flex flex-col gap-5 rounded-3xl border border-line bg-white p-5 sm:p-7"
      >
        {notice && <Notice tone="success">{notice}</Notice>}
        {error && <Notice tone="error">{error}</Notice>}

        <div>
          <label htmlFor="v-code" className="text-sm font-semibold">
            Verification code
          </label>
          <input
            id="v-code"
            ref={inputRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            autoFocus
            placeholder="000000"
            aria-invalid={error ? true : undefined}
            onAnimationEnd={() => setShake(false)}
            className={`mt-1.5 h-16 w-full rounded-xl border-[1.5px] bg-white text-center font-mono text-3xl font-semibold tracking-[0.5em] transition-[border-color,box-shadow] placeholder:text-line focus:outline-none ${
              shake ? "shake" : ""
            } ${error ? "border-red-600 focus:ring-4 focus:ring-red-100" : "border-[#d5dbd1] focus:border-leaf-700 focus:ring-4 focus:ring-leaf-100"}`}
          />
        </div>

        <SubmitButton loading={loading} loadingLabel="Checking…" done={done} doneLabel="Verified">
          Verify
        </SubmitButton>

        <div className="flex flex-wrap items-center justify-between gap-3 text-[15px]">
          {cooldown > 0 ? (
            <span className="text-muted" aria-live="polite">
              Resend code in {cooldown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={onResend}
              disabled={resending}
              className="font-semibold text-leaf-700 underline-offset-4 hover:underline disabled:opacity-60"
            >
              {resending ? "Sending…" : "Send a new code"}
            </button>
          )}
          <Link href="/sign-up" className="font-semibold text-leaf-700 underline-offset-4 hover:underline">
            Wrong {via === "phone" ? "number" : "email"}?
          </Link>
        </div>
      </form>
    </div>
  );
}
