/** Shown for a moment while a form that reads the URL is being prepared. */
export default function AuthFallback() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-6">
      <div className="h-9 w-2/3 animate-pulse rounded-lg bg-line" />
      <div className="h-5 w-1/2 animate-pulse rounded-lg bg-line" />
      <div className="h-72 animate-pulse rounded-3xl border border-line bg-white" />
    </div>
  );
}
