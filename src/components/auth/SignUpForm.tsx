"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp, type Side } from "@/lib/auth";
import { startSession } from "@/lib/session";
import {
  describeIdentifier,
  looksLikePhone,
  parseIdentifier,
  validateCompany,
  validateIdentifier,
  validateName,
  validateNewPassword,
} from "@/lib/validation";
import Field from "./Field";
import Notice from "./Notice";
import PasswordField from "./PasswordField";
import SocialButtons from "./SocialButtons";
import SubmitButton from "./SubmitButton";

type Values = { name: string; identifier: string; company: string; password: string };
type FieldId = keyof Values;

const sides: { id: Side; title: string; body: string; avatar: string; avatarClass: string }[] = [
  { id: "seeker", title: "I'm looking for work", body: "Ali finds roles and introduces you.", avatar: "A", avatarClass: "bg-leaf-200 text-forest-900" },
  { id: "company", title: "I'm hiring", body: "Simbi sends you screened candidates.", avatar: "S", avatarClass: "bg-forest-900 text-leaf-300" },
];

function errorsFor(side: Side, v: Values): Record<FieldId, string | null> {
  return {
    name: validateName(v.name),
    identifier: validateIdentifier(v.identifier),
    company: side === "company" ? validateCompany(v.company) : null,
    password: validateNewPassword(v.password),
  };
}

export default function SignUpForm() {
  const router = useRouter();
  const [side, setSide] = useState<Side>("seeker");
  const [corper, setCorper] = useState(false);
  const [values, setValues] = useState<Values>({ name: "", identifier: "", company: "", password: "" });
  const [touched, setTouched] = useState<Partial<Record<FieldId, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<{ field?: FieldId; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const errors = errorsFor(side, values);
  const shown = (id: FieldId) => {
    if (serverError?.field === id) return serverError.message;
    return touched[id] || submitted ? errors[id] : null;
  };

  const set = (id: FieldId) => (value: string) => {
    setValues((v) => ({ ...v, [id]: value }));
    if (serverError) setServerError(null);
  };
  const blur = (id: FieldId) => () => setTouched((t) => ({ ...t, [id]: true }));

  const parsed = parseIdentifier(values.identifier);
  const identifierHint = parsed
    ? `We'll send a 6-digit code to ${describeIdentifier(parsed)}.`
    : "We'll send you a 6-digit code to confirm it's you.";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setServerError(null);

    const order: FieldId[] = side === "company" ? ["name", "identifier", "company", "password"] : ["name", "identifier", "password"];
    const firstBad = order.find((id) => errors[id]);
    if (firstBad) {
      document.getElementById(`su-${firstBad}`)?.focus();
      return;
    }
    const identifier = parseIdentifier(values.identifier);
    if (!identifier) return;

    setLoading(true);
    const r = await signUp({
      side,
      name: values.name.trim(),
      identifier,
      company: side === "company" ? values.company.trim() : undefined,
      corper: side === "seeker" && corper,
      password: values.password,
    });
    setLoading(false);

    if (!r.ok) {
      setServerError({ field: r.field as FieldId | undefined, message: r.message });
      if (r.field) document.getElementById(`su-${r.field}`)?.focus();
      return;
    }
    // Remember the sign-up choices so onboarding can pick the right flow (mock; the backend will own this).
    startSession({
      name: values.name.trim(),
      identifier: r.data.to,
      side,
      corper: side === "seeker" && corper,
      company: side === "company" ? values.company.trim() : undefined,
    });
    setDone(true);
    router.push(`/verify?to=${encodeURIComponent(r.data.to)}&via=${r.data.via}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
        <p className="mt-1.5 text-[17px] text-muted">First, which side of the table are you on?</p>
      </div>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
        <fieldset>
          <legend className="sr-only">Which side are you on?</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {sides.map((s) => (
              <label
                key={s.id}
                className="relative flex cursor-pointer flex-col gap-2 rounded-2xl border-2 border-line bg-white p-4 transition hover:border-leaf-500 has-[:checked]:border-leaf-700 has-[:checked]:shadow-[0_0_0_4px_var(--color-leaf-100)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-leaf-700"
              >
                <input type="radio" name="side" value={s.id} checked={side === s.id} onChange={() => setSide(s.id)} className="sr-only" />
                <span className={`grid h-10 w-10 place-items-center rounded-full text-lg font-bold ${s.avatarClass}`}>{s.avatar}</span>
                <strong className="text-base font-semibold">{s.title}</strong>
                <span className="text-sm leading-snug text-muted">{s.body}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-5 rounded-3xl border border-line bg-white p-5 sm:p-7">
          <SocialButtons />

          {serverError && !serverError.field && <Notice tone="error">{serverError.message}</Notice>}

          <Field
            id="su-name"
            label="Full name"
            value={values.name}
            onChange={(e) => set("name")(e.target.value)}
            onBlur={blur("name")}
            error={shown("name")}
            autoComplete="name"
          />
          <Field
            id="su-identifier"
            label="Email or phone number"
            value={values.identifier}
            onChange={(e) => set("identifier")(e.target.value)}
            onBlur={blur("identifier")}
            error={shown("identifier")}
            hint={identifierHint}
            autoComplete="username"
            inputMode={looksLikePhone(values.identifier) ? "tel" : "email"}
            autoCapitalize="none"
            spellCheck={false}
          />
          {side === "company" && (
            <Field
              id="su-company"
              label="Company or organisation"
              value={values.company}
              onChange={(e) => set("company")(e.target.value)}
              onBlur={blur("company")}
              error={shown("company")}
              autoComplete="organization"
            />
          )}
          <PasswordField
            id="su-password"
            label="Create a password"
            value={values.password}
            onChange={set("password")}
            onBlur={blur("password")}
            error={shown("password")}
            autoComplete="new-password"
            showRules
          />

          {side === "seeker" && (
            <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-leaf-100 p-3.5 text-[15px] leading-snug">
              <input
                type="checkbox"
                checked={corper}
                onChange={(e) => setCorper(e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-leaf-700"
              />
              <span>
                <strong className="font-semibold">I&apos;m an NYSC Corps Member.</strong>{" "}
                <span className="text-muted">We&apos;ll show you verified PPAs first.</span>
              </span>
            </label>
          )}

          <SubmitButton loading={loading} loadingLabel="Creating your account…" done={done} doneLabel="Account created">
            {side === "seeker" ? "Continue to Ali" : "Continue to Simbi"}
          </SubmitButton>

          <p className="text-center text-[13px] leading-relaxed text-muted">
            By continuing you agree to our{" "}
            <Link href="/#faq" className="font-semibold text-leaf-700 underline underline-offset-2">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/#faq" className="font-semibold text-leaf-700 underline underline-offset-2">
              Privacy policy
            </Link>
            .
          </p>
        </div>
      </form>
    </div>
  );
}
