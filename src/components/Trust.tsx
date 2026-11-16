import { trust } from "@/lib/content";
import { cardHover, container, eyebrow, h2 } from "@/lib/ui";
import CardBar from "./CardBar";

export default function Trust() {
  return (
    <section className={`${container} py-20 lg:py-28`}>
      <p className={eyebrow}>Trust</p>
      <h2 className={`${h2} mt-4 max-w-2xl`}>Built so you can say yes with confidence.</h2>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trust.map((t) => (
          <li key={t.title} className={`${cardHover} rounded-2xl bg-forest-100 p-6 hover:bg-leaf-200/70`}>
            <h3 className="text-lg font-semibold">{t.title}</h3>
            <p className="mt-2 leading-relaxed text-forest-800">{t.body}</p>
            <CardBar />
          </li>
        ))}
      </ul>
    </section>
  );
}
