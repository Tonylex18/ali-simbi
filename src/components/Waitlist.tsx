"use client";

import { useState } from "react";
import { container } from "@/lib/ui";

type Role = "seeker" | "corper" | "employer";

const roles: { id: Role; label: string }[] = [
  { id: "seeker", label: "Job seeker" },
  { id: "corper", label: "NYSC Corps Member" },
  { id: "employer", label: "Employer or PPA host" },
];

export default function Waitlist() {
  const [role, setRole] = useState<Role>("corper");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    // TODO: send { email, role } to your waitlist backend here. Nothing is saved yet.
    setDone(true);
  }

  return (
    <section id="start" className="bg-forest-900 text-white">
      <div className={`${container} grid items-center gap-10 py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:py-24`}>
        <div>
          <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Your next move starts with a conversation.
          </h2>
          <p className="mt-5 max-w-lg text-lg text-mist">
            Join the waitlist and we will message you the moment Ali and Simbi open for your side.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 text-ink sm:p-7">
          {done ? (
            <div role="status" className="py-6 text-center">
              <p className="text-2xl font-bold">You are on the list.</p>
              <p className="mt-2 text-muted">We will email {email} when it is your turn.</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-4">
              <fieldset>
                <legend className="text-sm font-semibold">I am a</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {roles.map((r) => (
                    <label
                      key={r.id}
                      className={`inline-flex h-11 cursor-pointer items-center rounded-full border px-4 text-sm font-semibold transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-leaf-700 ${
                        role === r.id ? "border-forest-900 bg-forest-900 text-white" : "border-line bg-white text-muted hover:border-leaf-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={r.id}
                        checked={role === r.id}
                        onChange={() => setRole(r.id)}
                        className="sr-only"
                      />
                      {r.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="wl-email" className="text-sm font-semibold">Email</label>
                <input
                  id="wl-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "wl-error" : undefined}
                  placeholder="you@example.com"
                  className="mt-1.5 h-12 w-full rounded-xl border border-line bg-cream px-4 text-base"
                />
                {error && (
                  <p id="wl-error" role="alert" className="mt-1.5 text-sm text-red-700">
                    {error}
                  </p>
                )}
              </div>
              <button type="submit" className="h-12 rounded-xl bg-leaf-700 font-semibold text-white transition-colors hover:bg-leaf-800">
                Join the waitlist
              </button>
              <p className="text-xs text-muted">We only use your email to tell you when Ali and Simbi are ready.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
