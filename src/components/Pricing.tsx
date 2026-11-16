import { btnGhost, btnPrimary, cardHover, cardHoverDark, container, eyebrow, h2 } from "@/lib/ui";
import CardBar from "./CardBar";

type Plan = {
  name: string;
  price: string;
  unit: string;
  note: string;
  items: string[];
  cta: string;
  href: string;
  featured?: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "₦0",
    unit: "to start",
    note: "Everything you need to find roles and get introduced.",
    items: ["Chat with Ali on web or WhatsApp", "Job board and PPA listings", "Answer introductions", "Free CV score and top reasons"],
    cta: "Get started",
    href: "#start",
  },
  {
    name: "Premium",
    price: "[₦ PRICE]",
    unit: "per month",
    note: "One fee covers all of this. Price is set after the pilot.",
    items: ["Full CV fix list and rewrites", "Authorized auto-apply, up to 10 a day", "Top matches first, with priority alerts", "Coaching and mock interviews"],
    cta: "Join the waitlist",
    href: "#start",
    featured: true,
  },
  {
    name: "Employers",
    price: "Free",
    unit: "to post during the pilot",
    note: "Employer pricing will be announced here once tested.",
    items: ["Brief Simbi in plain words", "Shortlists with fit labels and reasons", "Introductions after a candidate says yes", "PPA requests included"],
    cta: "Hire with Simbi",
    href: "#start",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="border-t border-line bg-white">
      <div className={`${container} py-20 lg:py-28`}>
        <p className={eyebrow}>Pricing</p>
        <h2 className={`${h2} mt-4 max-w-2xl`}>Start free. Upgrade when your CV needs it.</h2>
        <ul className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((p) => (
            <li
              key={p.name}
              className={`flex flex-col rounded-3xl p-7 ${
                p.featured ? `${cardHoverDark} bg-forest-900 text-white` : `${cardHover} border border-line bg-cream`
              }`}
            >
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="font-mono text-4xl font-semibold">{p.price}</span>
                <span className={p.featured ? "text-mist" : "text-muted"}>{p.unit}</span>
              </p>
              <p className={`mt-3 text-[15px] ${p.featured ? "text-mist" : "text-muted"}`}>{p.note}</p>
              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {p.items.map((i) => (
                  <li key={i} className="flex gap-3 text-[15px]">
                    <svg className="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke={p.featured ? "var(--color-leaf-300)" : "var(--color-leaf-700)"} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                    {i}
                  </li>
                ))}
              </ul>
              <a
                href={p.href}
                className={`mt-8 ${p.featured ? "inline-flex h-12 items-center justify-center rounded-xl bg-leaf-300 px-6 font-semibold text-forest-900 hover:bg-leaf-200" : p.name === "Free" ? btnPrimary : btnGhost}`}
              >
                {p.cta}
              </a>
              <CardBar tone={p.featured ? "dark" : "light"} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
