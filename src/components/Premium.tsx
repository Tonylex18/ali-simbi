import { autoApplyRules, premiumPerks } from "@/lib/content";
import { cardHover, cardHoverDark, container, eyebrow, h2 } from "@/lib/ui";
import CardBar from "./CardBar";

export default function Premium() {
  return (
    <section id="premium" className={`${container} py-20 lg:py-28`}>
      <p className={eyebrow}>Premium</p>
      <h2 className={`${h2} mt-4 max-w-3xl`}>One small monthly fee. Everything that gets you hired faster.</h2>

      <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <ul className="grid gap-4 sm:grid-cols-2">
          {premiumPerks.map((p) => (
            <li key={p.title} className={`${cardHover} rounded-2xl border border-line bg-white p-6`}>
              <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:text-leaf-700">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{p.body}</p>
              <CardBar />
            </li>
          ))}
        </ul>

        <div className={`${cardHoverDark} rounded-3xl bg-forest-900 p-7 text-white sm:p-8`}>
          <h3 className="text-xl font-semibold">How auto-apply stays safe</h3>
          <p className="mt-2 text-mist">You are in control at every step.</p>
          <ol className="mt-5 flex flex-col gap-3.5">
            {autoApplyRules.map((r, i) => (
              <li key={r} className="flex gap-3.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-leaf-300 font-mono text-xs font-semibold text-forest-900 transition-transform duration-300 group-hover:scale-110">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{r}</span>
              </li>
            ))}
          </ol>
          <CardBar tone="dark" />
        </div>
      </div>
    </section>
  );
}
