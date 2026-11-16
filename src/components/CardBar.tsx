// A thin accent bar that sweeps across the bottom of a card on hover.
// The parent card needs the `group` and `relative overflow-hidden` classes (see cardHover).
export default function CardBar({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 ${
        tone === "dark" ? "bg-leaf-300" : "bg-leaf-500"
      }`}
    />
  );
}
