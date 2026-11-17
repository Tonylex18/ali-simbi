import type { Currency, Option } from "./types";

export const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta",
  "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
] as const;

// A sample of local government areas. States without a list fall back to typing the LGA.
export const lgasByState: Record<string, string[]> = {
  Lagos: ["Alimosho", "Apapa", "Eti-Osa", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Mushin", "Surulere"],
  "FCT Abuja": ["Abaji", "Abuja Municipal", "Bwari", "Gwagwalada", "Kuje", "Kwali"],
  Kano: ["Dala", "Fagge", "Gwale", "Kano Municipal", "Nassarawa", "Tarauni", "Ungogo"],
  Rivers: ["Eleme", "Ikwerre", "Obio-Akpor", "Okrika", "Port Harcourt"],
  Enugu: ["Enugu East", "Enugu North", "Enugu South", "Nsukka", "Udi"],
  Ogun: ["Abeokuta North", "Abeokuta South", "Ifo", "Ijebu Ode", "Sagamu"],
  Oyo: ["Ibadan North", "Ibadan South-West", "Ogbomosho North", "Oyo East"],
  Kaduna: ["Chikun", "Kaduna North", "Kaduna South", "Zaria"],
};

export const courses = [
  "Computer Science", "Accounting", "Mass Communication", "Economics", "Electrical Engineering",
  "Business Administration", "Medical Laboratory Science", "Education", "Architecture", "Microbiology",
];

export const degreeClasses: Option[] = [
  { label: "First Class", value: "first" },
  { label: "Second Class Upper", value: "upper" },
  { label: "Second Class Lower", value: "lower" },
  { label: "Third Class", value: "third" },
  { label: "HND or other", value: "other" },
];

export const careerTracks: Option[] = [
  { label: "Tech", value: "tech" },
  { label: "Finance and accounting", value: "finance" },
  { label: "Education", value: "education" },
  { label: "Health", value: "health" },
  { label: "Media and marketing", value: "media" },
  { label: "Administration", value: "admin" },
  { label: "Engineering", value: "engineering" },
];

export const stipendBrackets: Option[] = [
  { label: "Up to ₦20k", value: "₦0–₦20k" },
  { label: "₦20k – ₦50k", value: "₦20k–₦50k" },
  { label: "₦50k – ₦100k", value: "₦50k–₦100k" },
  { label: "₦100k and above", value: "₦100k+" },
  { label: "Any, if the role is right", value: "Any" },
];

export const perks: Option[] = [
  { label: "Accommodation", value: "Accommodation" },
  { label: "Transport", value: "Transport" },
  { label: "Meals", value: "Meals" },
];

export const workModes: Option[] = [
  { label: "On-site", value: "On-site" },
  { label: "Hybrid", value: "Hybrid" },
  { label: "Remote", value: "Remote" },
];

export const seekerRoles = [
  "Product designer", "Frontend developer", "Backend developer", "Data analyst", "Customer success manager",
  "Marketing associate", "Accountant", "Project coordinator",
];

export const levels: Option[] = [
  { label: "Internship or SIWES", value: "intern" },
  { label: "Entry level", value: "entry", hint: "0–2 years" },
  { label: "Mid level", value: "mid", hint: "3–5 years" },
  { label: "Senior", value: "senior", hint: "5+ years" },
];

export const skillOptions: Option[] = [
  "Figma", "React", "TypeScript", "Python", "SQL", "Excel", "Customer support", "Copywriting",
  "Project management", "Data analysis", "Sales", "Accounting",
].map((s) => ({ label: s, value: s }));

export const priorities: Option[] = [
  "Mentorship", "Remote work", "Fast growth", "Job security", "Good pay", "Learning new skills", "Flexible hours", "Health insurance",
].map((s) => ({ label: s, value: s }));

export const industries: Option[] = [
  "Fintech", "Health", "Education", "Logistics", "Retail and e-commerce", "Media and creative", "NGO", "Government", "Other",
].map((s) => ({ label: s, value: s }));

export const companySizes: Option[] = [
  { label: "1–10 people", value: "1–10" },
  { label: "11–50", value: "11–50" },
  { label: "51–200", value: "51–200" },
  { label: "200+", value: "200+" },
];

export const roleKinds: Option[] = [
  { label: "Full-time hire", value: "full-time" },
  { label: "Contract", value: "contract" },
  { label: "NYSC PPA (Corps Members)", value: "ppa", hint: "Placement for a service year" },
  { label: "Internship or SIWES", value: "intern" },
];

export const employerRoleTitles = [
  "Product designer", "Junior developer", "Accountant", "Customer support agent", "Marketing associate", "Operations assistant",
];

export const currencySymbol: Record<Currency, string> = { NGN: "₦", USD: "$", GBP: "£", EUR: "€" };

export const moneySuggestions: Record<Currency, number[]> = {
  NGN: [150_000, 300_000, 500_000, 1_000_000],
  USD: [500, 1_000, 2_000, 3_500],
  GBP: [800, 1_500, 2_500, 4_000],
  EUR: [900, 1_600, 2_800, 4_200],
};

export function formatMoney(currency: Currency, amount: number): string {
  return `${currencySymbol[currency]}${new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(amount)}`;
}
