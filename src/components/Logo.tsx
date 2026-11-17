type MarkProps = { className?: string; main?: string; accent?: string };

// Yin-and-yang mark from the logo workshop (direction 7b).
export function LogoMark({
  className,
  main = "var(--color-forest-900)",
  accent = "var(--color-leaf-500)",
}: MarkProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="42" fill={accent} />
      <path
        d="M50 8 A42 42 0 0 0 50 92 A21 21 0 0 0 50 50 A21 21 0 0 1 50 8 Z"
        fill={main}
      />
    </svg>
  );
}

export function Wordmark({ onDark = false }: { onDark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap text-xl font-bold tracking-tight">
      <LogoMark
        className="h-8 w-8"
        main={onDark ? "#ffffff" : "var(--color-forest-900)"}
        accent={onDark ? "var(--color-leaf-300)" : "var(--color-leaf-500)"}
      />
      <span className={onDark ? "text-white" : "text-ink"}>
        Ali <span className={onDark ? "text-leaf-300" : "text-leaf-700"}>&amp;</span>{" "}
        Simbi
      </span>
    </span>
  );
}
