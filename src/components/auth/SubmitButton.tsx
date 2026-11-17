type Props = {
  children: React.ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  done?: boolean;
  doneLabel?: string;
};

/** Full-width primary button with a spinner while working and a tick when finished. */
export default function SubmitButton({ children, loading, loadingLabel = "Please wait…", done, doneLabel = "Done" }: Props) {
  const busy = loading || done;
  return (
    <button
      type="submit"
      disabled={busy}
      aria-busy={loading || undefined}
      className={`inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl text-base font-semibold text-white transition-colors disabled:cursor-not-allowed ${
        done ? "bg-forest-900 disabled:opacity-100" : "bg-leaf-700 hover:bg-leaf-800 disabled:opacity-80"
      }`}
    >
      {loading && (
        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {done && (
        <svg className="h-5 w-5 text-leaf-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      )}
      {done ? doneLabel : loading ? loadingLabel : children}
    </button>
  );
}
