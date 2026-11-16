// Shared class strings so buttons look the same everywhere.
const base =
  "inline-flex h-12 items-center justify-center rounded-xl px-6 text-base font-semibold transition-colors";

export const btnPrimary = `${base} bg-leaf-700 text-white hover:bg-leaf-800`;
export const btnGhost = `${base} border-[1.5px] border-leaf-700 bg-white text-leaf-700 hover:bg-leaf-100`;
export const btnOnDark = `${base} bg-leaf-300 text-forest-900 hover:bg-leaf-200`;
export const btnGhostOnDark = `${base} border-[1.5px] border-leaf-300 text-leaf-300 hover:bg-white/10`;

export const container = "mx-auto w-full max-w-6xl px-5 sm:px-8";
export const eyebrow =
  "font-mono text-xs font-semibold uppercase tracking-[0.14em] text-leaf-700";
export const h2 =
  "text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]";

// Card hover: lifts, gains a green-tinted shadow, and (with <CardBar />) a bar sweeps in.
// The lift only runs when the visitor has not asked for reduced motion.
const lift =
  "group relative overflow-hidden transition duration-300 ease-out motion-safe:hover:-translate-y-2";
export const cardHover = `${lift} hover:border-leaf-500/70 hover:shadow-[0_22px_44px_-20px_rgba(11,74,60,0.38)]`;
export const cardHoverDark = `${lift} hover:shadow-[0_22px_44px_-16px_rgba(7,40,32,0.65)]`;
