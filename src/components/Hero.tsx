import { btnGhost, btnPrimary, container } from "@/lib/ui";
import HeroDemo from "./HeroDemo";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-136 w-136 rounded-full bg-leaf-200/60 blur-3xl" />
      <div className={`${container} relative grid items-center gap-12 py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:py-20`}>
        <div className="animate-rise">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-leaf-700">
            AI career and hiring agents · starting with NYSC PPA
          </p>
          <h1 className="mt-5 text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Get introduced,
            <br />
            <span className="text-leaf-700">not ignored.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Ali finds roles that fit you and asks before anyone sees your details. Simbi finds people who already want the job. Two agents, one introduction, only when both sides say yes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#start" className={btnPrimary}>Talk to Ali</a>
            <a href="#employers" className={btnGhost}>Hire with Simbi</a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            <li>Free to start</li>
            <li>Works on WhatsApp</li>
            <li>Private until you say yes</li>
          </ul>
        </div>

        <div className="animate-rise [animation-delay:120ms]">
          <HeroDemo />
        </div>
      </div>
    </section>
  );
}
