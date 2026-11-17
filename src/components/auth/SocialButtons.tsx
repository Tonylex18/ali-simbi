"use client";

import { useState } from "react";
import { startOAuth } from "@/lib/auth";
import Notice from "./Notice";

type Provider = "whatsapp" | "google";

const btn =
  "inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border-[1.5px] border-[#d5dbd1] bg-white text-[15px] font-semibold transition-colors hover:border-leaf-500 hover:bg-leaf-100 disabled:opacity-60";

export default function SocialButtons({ verb = "Continue" }: { verb?: string }) {
  const [pending, setPending] = useState<Provider | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function go(p: Provider) {
    setPending(p);
    setMessage(null);
    const r = await startOAuth(p);
    setPending(null);
    if (!r.ok) setMessage(r.message);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <button type="button" className={btn} disabled={pending !== null} aria-label={`${verb} with WhatsApp`} onClick={() => go("whatsapp")}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#25d366" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" />
            <path fill="#fff" d="M8.6 7.5c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4-.1.6l-.5.6c-.1.2-.2.3 0 .6.6 1 1.4 1.8 2.4 2.4.3.2.4.1.6 0l.7-.8c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.2.4.4 0 .6-.3 1.4-1.1 1.8-.8.4-1.8.4-3.6-.4-2-.9-3.4-2.8-3.8-3.6-.6-1-.8-2.4-.1-3.4z" />
          </svg>
          {pending === "whatsapp" ? "Connecting…" : "WhatsApp"}
        </button>
        <button type="button" className={btn} disabled={pending !== null} aria-label={`${verb} with Google`} onClick={() => go("google")}>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285f4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.6a4.8 4.8 0 0 1-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.5z" />
            <path fill="#34a853" d="M12 22c2.8 0 5.2-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7A10 10 0 0 0 12 22z" />
            <path fill="#fbbc05" d="M6.2 13.6a6 6 0 0 1 0-3.8V7.1H2.7a10 10 0 0 0 0 9z" />
            <path fill="#ea4335" d="M12 5.9c1.5 0 2.9.5 4 1.5l3-3A10 10 0 0 0 2.7 7.1l3.5 2.7C7 7.7 9.3 5.9 12 5.9z" />
          </svg>
          {pending === "google" ? "Connecting…" : "Google"}
        </button>
      </div>
      {message && <Notice tone="info">{message}</Notice>}
      <div className="flex items-center gap-3 text-sm text-muted" aria-hidden="true">
        <span className="h-px flex-1 bg-line" />
        {`or ${verb.toLowerCase()} with your email or phone`}
        <span className="h-px flex-1 bg-line" />
      </div>
    </div>
  );
}
