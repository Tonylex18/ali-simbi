"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const m = window.matchMedia(query);
  m.addEventListener("change", onChange);
  return () => m.removeEventListener("change", onChange);
}

/** True when the visitor asked their device for less motion. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}
