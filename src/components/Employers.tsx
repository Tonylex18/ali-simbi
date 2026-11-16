import { simbiSteps } from "@/lib/content";
import { btnPrimary, cardHover, container, eyebrow, h2 } from "@/lib/ui";
import CardBar from "./CardBar";

export default function Employers() {
  return (
    <section id="employers" className="border-y border-line bg-white">
      <div className={`${container} py-20 lg:py-28`}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className={eyebrow}>For employers and PPA hosts</p>
            <h2 className={`${h2} mt-4`}>Meet people who already want the job.</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Simbi is your hiring agent. Describe the role and get a shortlist of candidates who told Ali they want work like yours, instead of a pile of unvetted applications.
            </p>
          </div>
          <a href="#start" className={btnPrimary}>Hire with Simbi</a>
        </div>

        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {simbiSteps.map((s, i) => (
            <li key={s.title} className={`${cardHover} rounded-2xl border border-line bg-cream p-6`}>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-forest-900 font-mono text-sm font-semibold text-leaf-300 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                {i + 1}
              </span>
              <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
              <CardBar />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
