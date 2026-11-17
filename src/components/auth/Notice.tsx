type Tone = "error" | "info" | "success";

const styles: Record<Tone, string> = {
  error: "border-red-200 bg-red-50 text-red-900",
  info: "border-line bg-cream text-ink",
  success: "border-leaf-300 bg-leaf-100 text-forest-900",
};

const icons: Record<Tone, React.ReactNode> = {
  error: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.5h.01" />
    </>
  ),
  success: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l3 3 5-6" />
    </>
  ),
};

/** Inline message. Errors are announced immediately; the others politely. */
export default function Notice({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex animate-rise items-start gap-2.5 rounded-xl border px-4 py-3 text-[15px] leading-snug ${styles[tone]}`}
    >
      <svg className="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {icons[tone]}
      </svg>
      <div>{children}</div>
    </div>
  );
}
