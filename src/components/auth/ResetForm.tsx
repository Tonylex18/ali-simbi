"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { resetPassword } from "@/lib/auth";
import { validateConfirm, validateNewPassword } from "@/lib/validation";
import Notice from "./Notice";
import PasswordField from "./PasswordField";
import SubmitButton from "./SubmitButton";

export default function ResetForm() {
  const router = useRouter();
  const token = useSearchParams().get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [touched, setTouched] = useState({ password: false, confirm: false });
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // A reset link without a token is broken or expired: offer a new one instead of a dead form.
  if (!token) {
    return (
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl font-bold tracking-tight">This link has expired</h1>
        <p className="text-[17px] text-muted">Reset links only work for a short time. Ask for a new one and we&apos;ll send it right away.</p>
        <Link href="/forgot-password" className="inline-flex h-12 items-center justify-center rounded-xl bg-leaf-700 font-semibold text-white hover:bg-leaf-800">
          Get a new link
        </Link>
      </div>
    );
  }

  const errors = {
    password: validateNewPassword(password),
    confirm: validateConfirm(password, confirm),
  };
  const show = (id: "password" | "confirm") => (touched[id] || submitted ? errors[id] : null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setFormError(null);
    if (errors.password) return document.getElementById("rp-password")?.focus();
    if (errors.confirm) return document.getElementById("rp-confirm")?.focus();

    setLoading(true);
    const r = await resetPassword({ token: token as string, password });
    setLoading(false);
    if (!r.ok) {
      setFormError(r.message);
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/sign-in?reset=1"), 700);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Choose a new password</h1>
        <p className="mt-1.5 text-[17px] text-muted">Pick something you haven&apos;t used here before.</p>
      </div>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5 rounded-3xl border border-line bg-white p-5 sm:p-7">
        {formError && <Notice tone="error">{formError}</Notice>}
        <PasswordField
          id="rp-password"
          label="New password"
          value={password}
          onChange={setPassword}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          error={show("password")}
          autoComplete="new-password"
          showRules
          autoFocus
        />
        <PasswordField
          id="rp-confirm"
          label="Type it again"
          value={confirm}
          onChange={setConfirm}
          onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
          error={show("confirm")}
          autoComplete="new-password"
        />
        <SubmitButton loading={loading} loadingLabel="Saving…" done={done} doneLabel="Password updated">
          Update password
        </SubmitButton>
      </form>
    </div>
  );
}
