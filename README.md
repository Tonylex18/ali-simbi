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

## Auth screens

| Route | What it is |
| --- | --- |
| `/sign-up` | Choose a side (looking for work / hiring), then name, email or phone, password. Hiring adds a company field; job seekers can tick "NYSC Corps Member". |
| `/verify` | Enter the 6-digit code sent by email, or by WhatsApp/SMS for a phone number. Submits automatically on the sixth digit. |
| `/sign-in` | Email or phone plus password. Honors a safe `?next=` path and shows a notice after a password reset. |
| `/forgot-password` | Ask for a reset link. The confirmation never reveals whether an account exists. |
| `/reset-password?token=…` | Choose a new password. A link without a token shows an "expired" page. |

There is no dashboard yet. After sign-in or verification people go to `/` (or the safe `?next=` page).

**The auth backend is a stub.** `src/lib/auth.ts` fakes each call so the screens can be designed and tested; nothing is saved. Replace each function body with your API or auth provider. Demo behaviours, so the error states can be seen:

- sign up with an email starting `taken@` → "account already exists"
- sign in with the password `Wrongpass1` → "details don't match"
- verify with the code `000000` → "code isn't right"
- `/reset-password` with no `?token=` → "link has expired"
- in development only, the "check your messages" screen shows a link to open the reset page

WhatsApp and Google buttons are placeholders: they show a "not connected yet" message.

Validation lives in `src/lib/validation.ts`. Form pieces are in `src/components/auth/`.
