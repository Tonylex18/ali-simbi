"use client";

import { useMemo, useSyncExternalStore } from "react";

// A tiny localStorage-backed store, used only while the backend is mocked.
// The server snapshot is a sentinel so pages can show a skeleton until the browser value is read,
// instead of flashing the "signed out" state.

const LOADING = "__loading__";

export type StoreValue<T> = T | null | "loading";

export function createLocalStore<T>(key: string) {
  const listeners = new Set<() => void>();

  const read = (): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const subscribe = (cb: () => void) => {
    listeners.add(cb);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) cb();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(cb);
      window.removeEventListener("storage", onStorage);
    };
  };

  function set(value: T | null) {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable: the app keeps working without saving */
    }
    listeners.forEach((l) => l());
  }

  function useValue(): StoreValue<T> {
    const raw = useSyncExternalStore(subscribe, read, () => LOADING);
    return useMemo(() => {
      if (raw === LOADING) return "loading";
      if (!raw) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    }, [raw]);
  }

  return { set, useValue };
}
