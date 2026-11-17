import {
  careerTracks, companySizes, courses, degreeClasses, employerRoleTitles, formatMoney, industries, levels,
  moneySuggestions, perks, priorities, roleKinds, seekerRoles, skillOptions, stipendBrackets, workModes,
} from "./data";
import type { Answers, Currency, Ctx, Step, Track } from "./types";

type StateLga = { state: string; lga: string };
type Money = { currency: Currency; amount: number | null };

const val = <T,>(a: Answers, id: string) => a[id]?.value as T | undefined;
const list = (a: Answers, id: string) => (val<string[]>(a, id) ?? []).join(", ");
const upper = (v: string) => v.toUpperCase();

// ---------------------------------------------------------------------------
// NYSC Corps Member: finding a PPA (placement for the service year)
// ---------------------------------------------------------------------------
const corper: Step[] = [
  {
    id: "code",
    fact: "NYSC state code",
    ask: (c) => [
      `Hi ${c.first}, I'm Ali. I'll help you find a PPA that actually fits you. It takes about 3 minutes.`,
      "First, what's your NYSC state code? You'll find it on your call-up letter.",
    ],
    input: {
      kind: "text",
      placeholder: "For example KN/25B/1234",
      autoCapitalize: "characters",
      transform: upper,
      validate: (v) =>
        /^[A-Za-z]{2}\/\d{2}[A-Ca-c]\/\d{3,5}$/.test(v.trim()) ? null : "That doesn't look like a state code. It looks like AB/25B/1234.",
    },
  },
  {
    id: "where",
    fact: "Posted to",
    ack: (a) => {
      const v = a.value as StateLga;
      return `${v.state}, ${v.lga}. I'll look there first, then across the rest of ${v.state}.`;
    },
    ask: () => ["Which state were you posted to, and which local government area would you like to work in?"],
    input: { kind: "stateLga", stateLabel: "State of deployment" },
  },
  {
    id: "course",
    fact: "Course of study",
    ack: (a) => `${a.label}. Good to know.`,
    ask: () => ["What did you study?"],
    input: { kind: "text", placeholder: "Your course of study", suggestions: courses.slice(0, 6), autoCapitalize: "words" },
  },
  {
    id: "class",
    fact: "Degree class",
    ask: () => ["And your degree class?"],
    input: { kind: "single", options: degreeClasses },
  },
  {
    id: "track",
    fact: "Career interests",
    ask: () => ["Which areas would you like your service year to build? Pick up to three."],
    input: { kind: "multi", options: careerTracks, min: 1, max: 3, cta: "Continue" },
  },
  {
    id: "stipend",
    fact: "Monthly stipend",
    ask: () => ["What monthly stipend from the host would you be happy with? Remember your NYSC allowance comes on top."],
    input: { kind: "single", options: stipendBrackets },
  },
  {
    id: "perks",
    fact: "Support wanted",
    ask: () => ["Would any of these make a PPA much easier for you?"],
    input: { kind: "multi", options: perks, min: 0, cta: "Continue" },
    skip: "None of these",
  },
  {
    id: "mode",
    fact: "Work mode",
    ask: () => ["How would you like to work?"],
    input: { kind: "single", options: [...workModes, { label: "No preference", value: "Any" }] },
  },
  {
    id: "retention",
    fact: "After service",
    ack: (a) => (a.value === "no" ? null : "I'll favour hosts who keep Corps Members on after service."),
    ask: () => ["Would you like to stay on with the host after your service year if it goes well?"],
    input: {
      kind: "single",
      options: [
        { label: "Yes, I'd like that", value: "yes" },
        { label: "Maybe, depends on the role", value: "maybe" },
        { label: "No, just the service year", value: "no" },
      ],
    },
  },
  {
    id: "letter",
    fact: "Verified Corper",
    ack: (a) => (a.skipped ? "No problem, you can verify it any time from your profile." : "Your letter checks out. You're now a Verified Corper."),
    ask: () => [
      "Verified Corps Members get seen first by hosts. Upload your call-up letter and I'll check it.",
    ],
    input: {
      kind: "file",
      accept: ".pdf,.png,.jpg,.jpeg",
      title: "Upload your call-up letter",
      hint: "PDF, PNG or JPG, up to 5 MB",
      stages: ["Reading your letter", "Matching it to your state code", "Checking the posting details"],
    },
    skip: "I'll do this later",
  },
  {
    id: "cv",
    fact: "CV",
    ack: (a) => (a.skipped ? "No problem. Add your CV any time and I'll sharpen your matches." : "Thanks, I've read it."),
    widget: "cv-score",
    ask: () => ["Last one. Add your CV so I can match you more closely, and I'll tell you how it reads to screening software."],
    input: {
      kind: "file",
      accept: ".pdf,.doc,.docx",
      title: "Upload your CV",
      hint: "PDF or Word, up to 5 MB",
      stages: ["Reading your CV", "Finding your skills", "Checking how screening software reads it"],
    },
    skip: "I'll add it later",
  },
];

// ---------------------------------------------------------------------------
// Job seeker: finding a role
// ---------------------------------------------------------------------------
const seeker: Step[] = [
  {
    id: "role",
    fact: "Looking for",
    ask: (c) => [
      `Hi ${c.first}, I'm Ali. I'll find roles that fit you and ask before anyone sees your details. About 3 minutes.`,
      "What kind of work are you looking for?",
    ],
    input: { kind: "text", placeholder: "For example Product designer", suggestions: seekerRoles.slice(0, 5), autoCapitalize: "words" },
  },
  {
    id: "level",
    fact: "Experience",
    ack: (a) => `${a.label}, got it.`,
    ask: () => ["How much experience do you have?"],
    input: { kind: "single", options: levels },
  },
  {
    id: "skills",
    fact: "Skills",
    ack: () => "Nice mix.",
    ask: () => ["Which of these are you strongest at? Pick up to six, or add your own."],
    input: { kind: "multi", options: skillOptions, min: 1, max: 6, customLabel: "Add another skill", cta: "Continue" },
  },
  {
    id: "location",
    fact: "Location",
    ask: () => ["Where would you like to work?"],
    input: {
      kind: "text",
      placeholder: "A city or country",
      suggestions: ["Lagos", "Abuja", "Port Harcourt", "Nairobi", "Accra", "Anywhere (remote)"],
      autoCapitalize: "words",
    },
  },
  {
    id: "mode",
    fact: "Work mode",
    ask: () => ["And how do you want to work? Pick any that suit you."],
    input: { kind: "multi", options: workModes, min: 1, cta: "Continue" },
  },
  {
    id: "pay",
    fact: "Pay floor",
    ask: () => ["What monthly pay would make a move worth it? This stays private. I only use it to filter."],
    input: {
      kind: "money",
      currencies: ["NGN", "USD", "GBP", "EUR"],
      suggestions: moneySuggestions,
      unit: "a month",
      notSure: "I'm not sure yet",
    },
  },
  {
    id: "priorities",
    fact: "What matters",
    ask: () => ["What matters most in your next team? Pick up to three."],
    input: { kind: "multi", options: priorities, min: 1, max: 3, cta: "Continue" },
  },
  {
    id: "cv",
    fact: "CV",
    ack: (a) => (a.skipped ? "No problem. Add your CV any time and I'll sharpen your matches." : "Thanks, I've read it."),
    widget: "cv-score",
    ask: () => ["Last one. Add your CV so I can match you more closely, and I'll tell you how it reads to screening software."],
    input: {
      kind: "file",
      accept: ".pdf,.doc,.docx",
      title: "Upload your CV",
      hint: "PDF or Word, up to 5 MB",
      stages: ["Reading your CV", "Finding your skills", "Checking how screening software reads it"],
    },
    skip: "I'll add it later",
  },
];

// ---------------------------------------------------------------------------
// Employer: briefing Simbi (with a branch for NYSC PPA placements)
// ---------------------------------------------------------------------------
const isPpa = (a: Answers) => val<string>(a, "kind") === "ppa";

const company: Step[] = [
  {
    id: "industry",
    fact: "Industry",
    ask: (c) => [
      `Hi ${c.first}, I'm Simbi. I'll turn your hiring needs into a brief and find people who already want the job.`,
      `First, what does ${c.company} do?`,
    ],
    input: { kind: "single", options: industries },
  },
  {
    id: "size",
    fact: "Team size",
    ask: () => ["How big is your team?"],
    input: { kind: "single", options: companySizes },
  },
  {
    id: "kind",
    fact: "Hiring for",
    ack: (a) => (a.value === "ppa" ? "Corps Members can start quickly and often stay on. I'll ask a few things only PPAs need." : null),
    ask: () => ["What kind of hire is this?"],
    input: { kind: "single", options: roleKinds },
  },
  {
    id: "title",
    fact: "Role",
    ask: (c) => [
      isPpa(c.answers) ? "What will the Corps Member be doing?" : "What's the role called?",
    ],
    input: (c) => ({
      kind: "text",
      placeholder: isPpa(c.answers) ? "For example Software support" : "For example Product designer",
      suggestions: employerRoleTitles.slice(0, 5),
      autoCapitalize: "words",
    }),
  },
  {
    id: "where",
    fact: "Office",
    ask: () => ["Where is the office?"],
    input: { kind: "stateLga", stateLabel: "State" },
  },
  {
    id: "mode",
    fact: "Work mode",
    ask: () => ["Is it on-site, hybrid or remote?"],
    input: { kind: "single", options: workModes },
  },
  {
    id: "skills",
    fact: "Must have",
    ask: (c) => [isPpa(c.answers) ? "What should the Corps Member know or have studied? Pick up to five." : "What must they be good at? Pick up to five."],
    input: { kind: "multi", options: skillOptions, min: 1, max: 5, customLabel: "Add another", cta: "Continue" },
  },
  {
    id: "headcount",
    fact: "How many",
    ask: (c) => [isPpa(c.answers) ? "How many Corps Members do you need?" : "How many people are you hiring for this role?"],
    input: { kind: "stepper", min: 1, max: 20, initial: 1, unit: "" },
  },
  {
    id: "stipend",
    fact: "Stipend",
    when: isPpa,
    ask: () => ["What monthly stipend will you pay?"],
    input: { kind: "single", options: stipendBrackets.filter((o) => o.value !== "Any") },
  },
  {
    id: "perks",
    fact: "Support offered",
    when: isPpa,
    ask: () => ["Do you offer any of these? Corps Members look for them."],
    input: { kind: "multi", options: perks, min: 0, cta: "Continue" },
    skip: "None of these",
  },
  {
    id: "budget",
    fact: "Budget",
    when: (a) => !isPpa(a),
    ask: () => ["What's your monthly budget for this role? I'll compare it with the market and tell you if it's competitive."],
    input: {
      kind: "money",
      currencies: ["NGN", "USD", "GBP", "EUR"],
      suggestions: moneySuggestions,
      unit: "a month",
      notSure: "I'd like advice on this",
    },
  },
  {
    id: "verify",
    fact: "Verified employer",
    ack: () => "Thanks. I have what I need to write the brief.",
    ask: () => ["Last one. Candidates trust verified employers. What's your work email or company registration (CAC) number?"],
    input: {
      kind: "text",
      placeholder: "name@company.com or RC1234567",
      validate: (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || /^(RC|BN|IT)?\s?\d{5,8}$/i.test(v.trim())
          ? null
          : "Enter a work email address or a CAC number like RC1234567.",
    },
    skip: "Verify later",
  },
];

export const flows: Record<Track, Step[]> = { corper, seeker, company };

export const agentFor = (t: Track) => (t === "company" ? "Simbi" : "Ali");

/** Steps that apply to the answers given so far (some steps only exist for certain answers). */
export const visibleSteps = (track: Track, answers: Answers) => flows[track].filter((s) => !s.when || s.when(answers));

export function makeCtx(first: string, companyName: string, answers: Answers): Ctx {
  return { first, company: companyName, answers };
}

export { formatMoney, list, val };
export type { Money, StateLga };
