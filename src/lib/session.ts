"use client";

import { createLocalStore } from "./store";
import type { MockSession, Progress, Track } from "./onboarding/types";

// Mock session and onboarding progress. When the backend arrives these become API calls.
export const sessionStore = createLocalStore<MockSession>("ali-simbi:session");
export const progressStore = createLocalStore<Progress>("ali-simbi:onboarding");

export function trackFor(session: MockSession): Track {
  if (session.side === "company") return "company";
  return session.corper ? "corper" : "seeker";
}

export function startSession(session: MockSession) {
  progressStore.set(null);
  sessionStore.set(session);
}

export function resetOnboarding() {
  progressStore.set(null);
}

export function signOutMock() {
  progressStore.set(null);
  sessionStore.set(null);
}

/** Example sessions for previewing each flow without going through sign-up. */
export const previews: { track: Track; label: string; session: MockSession }[] = [
  { track: "corper", label: "NYSC Corps Member", session: { name: "Aminu Bello", identifier: "+2348030000000", side: "seeker", corper: true } },
  { track: "seeker", label: "Job seeker", session: { name: "Chidinma Okafor", identifier: "chidinma@example.com", side: "seeker", corper: false } },
  { track: "company", label: "Employer", session: { name: "Ngozi Eze", identifier: "ngozi@example.com", side: "company", corper: false, company: "Oja Savings" } },
];
