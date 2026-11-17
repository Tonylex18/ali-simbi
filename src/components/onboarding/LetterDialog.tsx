"use client";

import { useEffect, useRef, useState } from "react";

type Props = { open: boolean; onClose: () => void; text: string };

/** Shows the drafted NYSC request letter in a modal, with a copy button. */
export default function LetterDialog({ open, onClose, text }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the text is still selectable */
    }
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="letter-title"
      className="m-auto w-[min(40rem,calc(100vw-2rem))] rounded-3xl border border-line bg-white p-0 text-ink shadow-2xl backdrop:bg-forest-900/50"
    >
      <div className="flex flex-col gap-4 p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="letter-title" className="text-xl font-bold">
              Your request letter
            </h2>
            <p className="mt-1 text-sm text-muted">Drafted by Ali from your answers. Read it, change anything, then send it with your CV.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg hover:bg-leaf-100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <pre className="max-h-[50vh] overflow-y-auto whitespace-pre-wrap rounded-2xl bg-cream p-4 font-sans text-[15px] leading-relaxed">{text}</pre>
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" onClick={onClose} className="h-11 rounded-xl border-[1.5px] border-[#d5dbd1] px-5 font-semibold hover:bg-leaf-100">
            Close
          </button>
          <button type="button" onClick={copy} className="h-11 rounded-xl bg-leaf-700 px-5 font-semibold text-white hover:bg-leaf-800">
            {copied ? "Copied ✓" : "Copy letter"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
