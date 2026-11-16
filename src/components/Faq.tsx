import { faqs } from "@/lib/content";
import { container, eyebrow, h2 } from "@/lib/ui";

export default function Faq() {
  return (
    <section id="faq" className={`${container} py-20 lg:py-28`}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div>
          <p className={eyebrow}>Questions</p>
          <h2 className={`${h2} mt-4`}>Straight answers.</h2>
        </div>
        <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {faqs.map((f) => (
            <details key={f.q} className="group px-6 py-5 transition-colors duration-200 hover:bg-leaf-100/50">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <svg className="h-5 w-5 shrink-0 transition-transform group-open:rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
