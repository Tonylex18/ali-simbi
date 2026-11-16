# Ali & Simbi landing page

Next.js (App Router) + TypeScript + Tailwind CSS v4.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Design

- **Brand** comes from the Ali & Simbi design canvas: Outfit for text, JetBrains Mono for numbers and labels, deep green `#0b4a3c`, lime `#c8f08f` / `#8fce4a`, leaf `#4a7a1f`, cream `#f6f7f4`, and the yin-yang mark (logo direction 7b). Tokens are in `src/app/globals.css` under `@theme`.
- **From Jack & Jill:** the two-agent hero shown through product mini-UIs (a tabbed chat card for each side), "fit" labels, and the consent-first introduction story.
- **From Artemis:** a calm, chat-first, rounded-card look, and CV tools as the hook into a paid plan.

## Page structure

Hero (Ali / Simbi tabs) → NYSC PPA finder (launch feature) → How it works → Free CV check (ATS-readiness score) → Premium and safe auto-apply → Employers (Simbi) → Trust → Pricing → FAQ → Waitlist.
