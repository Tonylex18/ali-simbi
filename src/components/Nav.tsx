"use client";

import Link from "next/link";
import { useState } from "react";
import { navLinks } from "@/lib/content";
import { btnPrimary, container } from "@/lib/ui";
import { Wordmark } from "./Logo";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur">
      <div className={`${container} flex h-16 items-center gap-8`}>
        <a href="#top" aria-label="Ali & Simbi home">
          <Wordmark />
        </a>

        <nav aria-label="Main" className="ml-4 hidden gap-1 lg:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-[15px] font-medium text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden text-[15px] font-medium text-ink hover:text-leaf-700 sm:inline"
          >
            Sign in
          </Link>
          <Link href="/sign-up" className={`${btnPrimary} h-10 px-4 text-[15px]`}>
            Get started
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-line bg-cream lg:hidden">
          <div className={`${container} flex flex-col py-2`}>
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-base font-medium"
              >
                {l.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
