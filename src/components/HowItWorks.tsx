import { steps } from "@/lib/content";
import { cardHover, container, eyebrow, h2 } from "@/lib/ui";
import CardBar from "./CardBar";

export default function HowItWorks() {
  return (
    <section id="how" className={`${container} py-20 lg:py-28`}>
      <p className={eyebrow}>How it works</p>
      <h2 className={`${h2} mt-4 max-w-2xl`}>One conversation, then introductions that come to you.</h2>
      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <li key={s.n} className={`${cardHover} flex flex-col gap-3 rounded-2xl border border-line bg-white p-6`}>
            <span className="inline-block origin-left font-mono text-sm font-semibold text-leaf-700 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-125">
              {s.n}
            </span>
            <h3 className="text-xl font-semibold leading-snug">{s.title}</h3>
            <p className="leading-relaxed text-muted">{s.body}</p>
            <CardBar />
          </li>
        ))}
      </ol>
      <p className="mt-6 max-w-2xl text-muted">
        Nobody sees your details, and nothing is sent to an employer for you, until you say yes.
      </p>
    </section>
  );
}
