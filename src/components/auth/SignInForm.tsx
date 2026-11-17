"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn } from "@/lib/auth";
import { looksLikePhone, parseIdentifier, safeNext, validateCurrentPassword, validateIdentifier } from "@/lib/validation";
import Field from "./Field";
import Notice from "./Notice";
import PasswordField from "./PasswordField";
import SocialButtons from "./SocialButtons";
import SubmitButton from "./SubmitButton";

export default function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const justReset = params.get("reset") === "1";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ identifier: false, password: false });
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const errors = {
    identifier: validateIdentifier(identifier),
    password: validateCurrentPassword(password),
  };
  const show = (id: "identifier" | "password") => (touched[id] || submitted ? errors[id] : null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setFormError(null);
    if (errors.identifier) return document.getElementById("si-identifier")?.focus();
    if (errors.password) return document.getElementById("si-password")?.focus();
    const id = parseIdentifier(identifier);
    if (!id) return;

    setLoading(true);
    const r = await signIn({ identifier: id, password });
    setLoading(false);

    if (!r.ok) {
      setFormError(r.message);
      const pw = document.getElementById("si-password") as HTMLInputElement | null;
      pw?.focus();
      pw?.select();
      return;
    }
    setDone(true);
    // No dashboard yet: send people back to the page they came from, or the home page.
    setTimeout(() => router.push(next), 600);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1.5 text-[17px] text-muted">Sign in to pick up where you left off.</p>
      </div>

      {justReset && <Notice tone="success">Password updated. Sign in with your new password.</Notice>}

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5 rounded-3xl border border-line bg-white p-5 sm:p-7">
        <SocialButtons verb="Sign in" />

        {formError && <Notice tone="error">{formError}</Notice>}

        <Field
          id="si-identifier"
          label="Email or phone number"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value);
            setFormError(null);
          }}
          onBlur={() => setTouched((t) => ({ ...t, identifier: true }))}
          error={show("identifier")}
          autoComplete="username"
          inputMode={looksLikePhone(identifier) ? "tel" : "email"}
          autoCapitalize="none"
          spellCheck={false}
        />
        <PasswordField
          id="si-password"
          value={password}
          onChange={(v) => {
            setPassword(v);
            setFormError(null);
          }}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          error={show("password")}
          autoComplete="current-password"
          labelRight={
            <Link href="/forgot-password" className="text-sm font-semibold text-leaf-700 underline-offset-4 hover:underline">
              Forgot password?
            </Link>
          }
        />

        <SubmitButton loading={loading} loadingLabel="Signing you in…" done={done} doneLabel="Signed in">
          Sign in
        </SubmitButton>
      </form>
    </div>
  );
}
