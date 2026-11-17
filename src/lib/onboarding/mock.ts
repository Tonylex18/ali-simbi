import { cvPillars, cvReasons } from "@/lib/content";
import { formatMoney, lgasByState } from "./data";
import { list, val } from "./flows";
import type { Money, StateLga } from "./flows";
import type { Answers, MockSession } from "./types";

// Everything here is sample data generated from the person's answers, so the results
// feel personal while there is no backend. Replace with real API results later.

export type Fit = "Strong" | "Good" | "Stretch";
const FITS: Fit[] = ["Strong", "Strong", "Good", "Stretch"];

const first = (xs: string[] | undefined, fallback: string) => xs?.[0] ?? fallback;

// ----- CV scan (shown after a CV upload) -----
export function cvScan(a: Answers) {
  const skills = val<string[]>(a, "skills") ?? [];
  const found = [...new Set([...skills, "Communication", "Teamwork", "Microsoft Office"])].slice(0, 6);
  const score = Math.round(cvPillars.reduce((n, p) => n + p.value, 0) / cvPillars.length);
  return { skills: found, score, pillars: cvPillars, reasons: cvReasons };
}

// ----- NYSC PPA matches -----
const ppaRoles: Record<string, string[]> = {
  tech: ["Software support", "Junior developer", "IT support officer", "Data entry and reporting"],
  finance: ["Accounts assistant", "Finance analyst assistant", "Audit assistant", "Bookkeeping assistant"],
  education: ["Teaching assistant", "Curriculum assistant", "Records assistant", "After-school programme assistant"],
  health: ["Health records assistant", "Community outreach assistant", "Lab assistant", "Patient care coordinator"],
  media: ["Content and social media", "Video editing assistant", "Communications assistant", "Event coordinator"],
  admin: ["Administrative assistant", "Customer support", "Front desk and records", "Operations assistant"],
  engineering: ["Site engineering assistant", "Technical drawing assistant", "Maintenance planning assistant", "Quality control assistant"],
};
const hosts = ["Fintech startup", "Private school", "Health NGO", "Logistics company", "Media agency", "Telecoms reseller"];
const brackets = ["₦20k–₦50k", "₦50k–₦100k", "₦100k+"];

export type PpaMatch = {
  id: string;
  role: string;
  host: string;
  where: string;
  stipend: string;
  mode: string;
  perks: string[];
  fit: Fit;
  reason: string;
};

export function ppaMatches(a: Answers): PpaMatch[] {
  const where = val<StateLga>(a, "where");
  const state = where?.state ?? "your state";
  const areas = lgasByState[state] ?? [];
  const lgas = [where?.lga, ...areas.filter((l) => l !== where?.lga)].filter(Boolean) as string[];
  const track = first(val<string[]>(a, "track"), "admin");
  const roles = ppaRoles[track] ?? ppaRoles.admin;
  const wanted = val<string>(a, "stipend") ?? "Any";
  const idx = Math.max(0, brackets.indexOf(wanted));
  const wantedPerks = val<string[]>(a, "perks") ?? [];
  const mode = val<string>(a, "mode");
  const course = a.course?.label ?? "your course";

  const reasons = [
    `Matches your ${course} degree and your stipend range.`,
    `This host asked to meet Corps Members like you.`,
    `Close to ${lgas[1] ?? lgas[0] ?? state} and ${wantedPerks[0] ? `offers ${wantedPerks[0].toLowerCase()}` : "easy to reach"}.`,
    `A little below your stipend range, but a strong place to build experience.`,
  ];

  return roles.map((role, i) => ({
    id: `ppa-${i}`,
    role,
    host: hosts[(i + (track.length % 3)) % hosts.length],
    where: `${lgas[i % Math.max(lgas.length, 1)] ?? state}, ${state}`,
    stipend: wanted === "Any" ? brackets[Math.min(i, 2)] : brackets[Math.min(Math.max(idx + (i === 3 ? -1 : 0), 0), 2)],
    mode: mode && mode !== "Any" ? mode : "On-site",
    perks: [wantedPerks[i % Math.max(wantedPerks.length, 1)] ?? "Transport", ...(i === 0 ? ["Retention possible"] : [])],
    fit: FITS[i],
    reason: reasons[i],
  }));
}

// ----- Job matches for job seekers -----
const companies = ["Northwind Labs", "Kora Pay", "Tidewater Health", "Brightpath Studio"];
const defaultPay: Record<string, [number, number]> = { NGN: [350_000, 600_000], USD: [1_500, 2_500], GBP: [2_200, 3_200], EUR: [2_400, 3_400] };

export type JobMatch = {
  id: string;
  title: string;
  company: string;
  location: string;
  mode: string;
  pay: string;
  fit: Fit;
  reason: string;
};

export function jobMatches(a: Answers): JobMatch[] {
  const role = (val<string>(a, "role") ?? "Product designer").trim();
  const level = val<string>(a, "level") ?? "entry";
  const skills = val<string[]>(a, "skills") ?? [];
  const priorities = val<string[]>(a, "priorities") ?? [];
  const modes = val<string[]>(a, "mode") ?? ["Remote"];
  const location = val<string>(a, "location") ?? "Lagos";
  const money = val<Money>(a, "pay");
  const currency = money?.currency ?? "NGN";
  const [lo, hi] = money?.amount
    ? [Math.round(money.amount * 1.05), Math.round(money.amount * 1.45)]
    : defaultPay[currency];

  const prefix = level === "entry" || level === "intern" ? "Junior " : level === "senior" ? "Senior " : "";
  const lower = role.charAt(0).toLowerCase() + role.slice(1);
  const titles = [`${prefix}${role}`, `${prefix}${role}`, `${role} (contract)`, `${prefix}${lower} associate`];

  const reasons = [
    `Uses ${skills.slice(0, 2).join(" and ") || "your core skills"}, and pays above your floor.`,
    `${priorities[0] ?? "Growth"} is built into the role, and it fits your work mode.`,
    `A strong skills match, with slightly less room to grow.`,
    `Worth a look: a stretch on experience, but the team is known for training people up.`,
  ];

  return titles.map((title, i) => ({
    id: `job-${i}`,
    title,
    company: companies[i],
    location: i === 0 ? location : i === 1 ? `${location} or remote` : "Remote",
    mode: modes[i % modes.length],
    pay: `est. ${formatMoney(currency, Math.round(lo * (1 - i * 0.05)))}–${formatMoney(currency, Math.round(hi * (1 - i * 0.05)))} a month`,
    fit: FITS[i],
    reason: reasons[i],
  }));
}

// ----- Employer shortlist -----
export type Candidate = {
  id: string;
  headline: string;
  where: string;
  available: string;
  fit: Fit;
  reason: string;
  tag?: string;
};

export function shortlist(a: Answers): Candidate[] {
  const ppa = val<string>(a, "kind") === "ppa";
  const skills = val<string[]>(a, "skills") ?? ["Communication"];
  const where = val<StateLga>(a, "where");
  const state = where?.state ?? "Lagos";
  const title = (val<string>(a, "title") ?? "the role").toLowerCase();
  const s = (i: number) => skills[i % skills.length];

  const base = ppa
    ? [
        ["BSc Computer Science", "Corps Member"],
        ["HND Computer Engineering", "Corps Member"],
        ["BSc Mathematics", "Corps Member"],
      ]
    : [
        ["Product designer, 4 years", "Fintech background"],
        ["Designer, 3 years", "Agency background"],
        ["Designer, 2 years", "Moving from freelance"],
      ];

  const reasons = [
    `Strong in ${s(0)}${skills[1] ? ` and ${s(1)}` : ""}, and told Ali they want ${title}.`,
    `Has ${s(1)} and is open to your work mode. Slightly less experience than ideal.`,
    `Wants a role like this and has ${s(0)}, but is missing ${s(2)}.`,
  ];

  return base.map(([headline, tag], i) => ({
    id: `cand-${i}`,
    headline,
    where: i === 2 ? `Near ${state}` : state,
    available: ["Available now", "Available in 2 weeks", "Available in a month"][i],
    fit: (["Strong", "Good", "Stretch"] as Fit[])[i],
    reason: reasons[i],
    tag,
  }));
}

// ----- NYSC request letter -----
export function requestLetter(a: Answers, session: MockSession): string {
  const where = val<StateLga>(a, "where");
  const match = ppaMatches(a)[0];
  const course = a.course?.label ?? "my course";
  const klass = a.class?.label ?? "a good degree";
  return [
    "The Human Resources Manager,",
    match.host,
    match.where,
    "",
    "Dear Sir or Madam,",
    "",
    "REQUEST FOR NYSC PRIMARY ASSIGNMENT PLACEMENT",
    "",
    `My name is ${session.name}. I am a Corps Member serving in ${where?.state ?? "Nigeria"} (state code ${a.code?.label ?? "on my call-up letter"}). I graduated with ${klass} in ${course}, and I am writing to ask for a placement with your organisation as ${match.role.toLowerCase()} for my service year.`,
    "",
    `I chose your organisation because the work matches my training and I want to contribute from my first week. I am ${list(a, "track") ? `especially interested in ${list(a, "track")}` : "keen to learn"}, I am reliable and quick to learn, and I would be glad to stay in touch about opportunities after service.`,
    "",
    "I have attached my CV and call-up letter. Thank you for your time and consideration.",
    "",
    "Yours faithfully,",
    session.name,
  ].join("\n");
}
