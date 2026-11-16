// All landing-page copy and sample data lives here so it is easy to edit.
// Sample listings are illustrative, not real hosts or people.

export const navLinks = [
  { label: "How it works", href: "#how" },
  { label: "NYSC PPA", href: "#ppa" },
  { label: "CV check", href: "#cv" },
  { label: "For employers", href: "#employers" },
  { label: "Pricing", href: "#pricing" },
] as const;

export type Stipend = "Any" | "₦20k–₦50k" | "₦50k–₦100k" | "₦100k+";

export const stipendFilters: Stipend[] = [
  "Any",
  "₦20k–₦50k",
  "₦50k–₦100k",
  "₦100k+",
];

export const states = [
  "Any state",
  "Lagos",
  "FCT Abuja",
  "Kano",
  "Rivers",
  "Enugu",
] as const;

export type SamplePpa = {
  role: string;
  host: string;
  state: (typeof states)[number];
  lga: string;
  stipend: Exclude<Stipend, "Any">;
  mode: "Onsite" | "Hybrid" | "Remote";
  perks: string[];
};

export const samplePpas: SamplePpa[] = [
  { role: "Software support", host: "Fintech startup", state: "Lagos", lga: "Eti-Osa", stipend: "₦50k–₦100k", mode: "Hybrid", perks: ["Transport"] },
  { role: "Content and social media", host: "Media agency", state: "Lagos", lga: "Ikeja", stipend: "₦20k–₦50k", mode: "Onsite", perks: ["Lunch"] },
  { role: "Data entry and reporting", host: "Health NGO", state: "FCT Abuja", lga: "Abuja Municipal", stipend: "₦50k–₦100k", mode: "Onsite", perks: ["Accommodation"] },
  { role: "Junior developer", host: "Logistics company", state: "FCT Abuja", lga: "Gwagwalada", stipend: "₦100k+", mode: "Hybrid", perks: ["Transport", "Retention possible"] },
  { role: "Teaching assistant", host: "Private school", state: "Kano", lga: "Kano Municipal", stipend: "₦20k–₦50k", mode: "Onsite", perks: ["Accommodation"] },
  { role: "Customer support", host: "Telecoms reseller", state: "Kano", lga: "Nassarawa", stipend: "₦50k–₦100k", mode: "Onsite", perks: ["Retention possible"] },
  { role: "Accounts assistant", host: "Oil services firm", state: "Rivers", lga: "Port Harcourt", stipend: "₦100k+", mode: "Onsite", perks: ["Transport", "Lunch"] },
  { role: "Research assistant", host: "University lab", state: "Enugu", lga: "Enugu North", stipend: "₦20k–₦50k", mode: "Onsite", perks: ["Accommodation"] },
];

export const steps = [
  {
    n: "01",
    title: "Tell Ali what you want",
    body: "A few minutes in chat, on the web or WhatsApp: your skills, location, pay floor and what to avoid. Ali builds your profile from it.",
  },
  {
    n: "02",
    title: "Get matches with reasons",
    body: "Ali shows roles and PPAs that fit, with one line on why. You mark Not for me or Track, and Ali learns.",
  },
  {
    n: "03",
    title: "Say yes to an introduction",
    body: "When an employer wants to meet you, Ali asks first. Your contact details and pay floor stay private until you say yes.",
  },
  {
    n: "04",
    title: "Meet and prepare",
    body: "Both sides get one introduction message. Ali helps you prepare with mock interviews and pay ranges.",
  },
] as const;

export const cvPillars = [
  { label: "ATS formatting", value: 44 },
  { label: "Impact and numbers", value: 52 },
  { label: "Keyword match", value: 71 },
  { label: "Clarity", value: 66 },
] as const;

export const cvReasons = [
  "Two columns and a text box can run words together for a screening parser.",
  "Most bullets describe duties and carry no number or result.",
  "The posting asks for an English level that your CV does not mention.",
] as const;

export const premiumPerks = [
  { title: "Full CV fix list", body: "Every fix with the exact line, the reason, and a rewrite you accept or keep original." },
  { title: "Authorized auto-apply", body: "You authorize once. Ali applies to strong fits, up to 10 a day, and sends you a daily summary." },
  { title: "Top matches first", body: "The strongest-fit roles ranked at the top, with priority alerts." },
  { title: "Coaching and mock interviews", body: "Practise for a specific role and get feedback on every answer." },
] as const;

export const autoApplyRules = [
  "You answer every common application question once, and confirm each answer.",
  "Ali applies only to strong fits that meet your limits on pay, place and work mode.",
  "A hard cap of 10 applications a day, and no minimum.",
  "If a form asks something you have not answered, Ali skips it and asks you.",
  "You can pause, edit or revoke the authorization at any time.",
] as const;

export const simbiSteps = [
  { title: "Describe the role", body: "Say it like you would to a friend. Simbi turns it into 3 to 6 criteria and a short pitch." },
  { title: "Review a shortlist", body: "Candidates who want a role like yours, labelled Strong, Good or Stretch, with the reason." },
  { title: "Request an introduction", body: "Simbi asks through Ali. You see contact details only after the candidate says yes." },
] as const;

export const trust = [
  { title: "Verified employers", body: "Work email and registration checked before a role goes live." },
  { title: "Private by default", body: "Candidates are shared only after they accept an introduction." },
  { title: "No invented experience", body: "Ali asks before writing anything on your CV, and never makes things up." },
  { title: "Report any listing", body: "Roles that ask candidates for money are removed." },
] as const;

export const faqs = [
  { q: "Is Ali free?", a: "Yes to start. You can chat with Ali, get matches, answer introductions and see your CV score for free. One small monthly Premium fee unlocks the full CV fixes, auto-apply, top matches and coaching." },
  { q: "Is this only for NYSC Corps Members?", a: "No. NYSC PPA placement is where we start, because every Corps Member needs a placement. Ali and Simbi also help other job seekers and employers, in Nigeria and abroad." },
  { q: "How does auto-apply work, and can it spam employers?", a: "It only runs after you authorize it, applies to strong fits only, and never goes above 10 applications a day. Ali answers from the answers you confirmed and skips anything it cannot answer." },
  { q: "Who can see my profile and CV?", a: "Nobody until you accept an introduction. You can also hide your profile at any time." },
  { q: "Does the CV score guarantee I pass an employer's system?", a: "No. It estimates how well your CV reads to typical screening software. Every employer's system is different." },
  { q: "How do employers pay?", a: "During the pilot, posting a role is free. Employer pricing will be tested later and announced here." },
] as const;
