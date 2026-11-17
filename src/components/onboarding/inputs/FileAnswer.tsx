"use client";

import { useEffect, useRef, useState } from "react";
import type { Answer, InputSpec } from "@/lib/onboarding/types";

type Spec = Extract<InputSpec, { kind: "file" }>;
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Pick a file, then watch it being "checked". The file is validated here (type and size) but is not
 * uploaded anywhere: the checking stages are a mock until the backend exists.
 */
export default function FileAnswer({ spec, onSubmit }: { spec: Spec; onSubmit: (a: Answer) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [stage, setStage] = useState(0);
  // Keep the newest callback without restarting the checking timers when the parent re-renders.
  const latest = useRef(onSubmit);
  useEffect(() => {
    latest.current = onSubmit;
  });

  const allowed = spec.accept.split(",").map((s) => s.trim().toLowerCase());

  function choose(f: File | undefined) {
    if (!f) return;
    const ext = `.${f.name.split(".").pop()?.toLowerCase() ?? ""}`;
    if (!allowed.includes(ext)) return setError(`That file type isn't supported. Use ${allowed.join(", ").replace(/\./g, "").toUpperCase()}.`);
    if (f.size > MAX_BYTES) return setError("That file is over 5 MB. Choose a smaller one.");
    setError(null);
    setStage(0);
    setFile(f);
  }

  // Step through the mock checking stages, then hand the answer back.
  useEffect(() => {
    if (!file) return;
    if (stage >= spec.stages.length) {
      const t = setTimeout(() => latest.current({ value: { name: file.name, size: file.size }, label: file.name }), 450);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStage((s) => s + 1), 900);
    return () => clearTimeout(t);
  }, [file, stage, spec.stages.length]);

  if (file) {
    return (
      <div className="rounded-2xl border border-line bg-white p-4" role="status" aria-live="polite">
        <p className="truncate font-semibold">{file.name}</p>
        <ul className="mt-3 flex flex-col gap-2.5">
          {spec.stages.map((s, i) => {
            const done = stage > i;
            const active = stage === i;
            return (
              <li key={s} className={`flex items-center gap-2.5 text-[15px] ${done || active ? "text-ink" : "text-muted"}`}>
                {done ? (
                  <svg className="h-5 w-5 text-leaf-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                ) : active ? (
                  <svg className="h-5 w-5 animate-spin text-leaf-700" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                ) : (
                  <span className="h-5 w-5 rounded-full border-2 border-line" aria-hidden="true" />
                )}
                {s}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept={spec.accept}
        className="sr-only"
        aria-label={spec.title}
        onChange={(e) => choose(e.target.files?.[0])}
      />
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          choose(e.dataTransfer.files?.[0]);
        }}
        className={`flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
          drag ? "border-leaf-700 bg-leaf-100" : "border-[#c9d1c5] bg-white"
        }`}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-leaf-700)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 16V4M7 9l5-5 5 5M5 20h14" />
        </svg>
        <p className="font-semibold">{spec.title}</p>
        <p className="text-sm text-muted">{spec.hint}</p>
        <button type="button" onClick={() => inputRef.current?.click()} className="h-11 rounded-xl bg-leaf-700 px-5 text-[15px] font-semibold text-white hover:bg-leaf-800">
          Choose a file
        </button>
        <p className="text-xs text-muted">or drag it here. It stays in your browser in this prototype.</p>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
