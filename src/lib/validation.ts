// Form validation shared by every auth screen. Each validator returns an error
// message, or null when the value is fine.

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type Identifier =
  | { kind: "email"; value: string }
  | { kind: "phone"; value: string };

/** Turn "0803 000 0000" or "+234 803 000 0000" into "+2348030000000". Assumes Nigeria when no country code is given. */
function normalizePhone(digits: string): string {
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("234")) return `+${digits}`;
  if (digits.startsWith("0")) return `+234${digits.slice(1)}`;
  return `+234${digits}`;
}

/** Accepts an email address or a phone number in one field. */
export function parseIdentifier(raw: string): Identifier | null {
  const v = raw.trim();
  if (emailRe.test(v)) return { kind: "email", value: v.toLowerCase() };
  const digits = v.replace(/[\s()-]/g, "");
  if (/^\+?\d{8,15}$/.test(digits)) return { kind: "phone", value: normalizePhone(digits) };
  return null;
}

/** True once the person starts typing digits, so we can switch to a number keyboard. */
export function looksLikePhone(raw: string): boolean {
  return /^[+\d]/.test(raw.trim());
}

/** "+2348030000000" -> "+234 803 000 0000" (other countries are left as typed). */
export function formatPhone(e164: string): string {
  const m = /^\+234(\d{3})(\d{3})(\d{4})$/.exec(e164);
  return m ? `+234 ${m[1]} ${m[2]} ${m[3]}` : e164;
}

export function describeIdentifier(id: Identifier): string {
  return id.kind === "phone" ? formatPhone(id.value) : id.value;
}

export const passwordRules = [
  { id: "len", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { id: "letter", label: "A letter", test: (p: string) => /[A-Za-z]/.test(p) },
  { id: "number", label: "A number", test: (p: string) => /\d/.test(p) },
] as const;

export const passwordScore = (p: string) => passwordRules.filter((r) => r.test(p)).length;

export function validateName(v: string): string | null {
  const t = v.trim();
  if (!t) return "Enter your full name.";
  if (t.length < 2) return "That looks too short. Enter your full name.";
  return null;
}

export function validateCompany(v: string): string | null {
  return v.trim() ? null : "Enter your company or organisation name.";
}

export function validateIdentifier(v: string): string | null {
  if (!v.trim()) return "Enter your email or phone number.";
  return parseIdentifier(v) ? null : "Enter a valid email address or phone number.";
}

export function validateEmailOrPhoneForReset(v: string): string | null {
  return validateIdentifier(v);
}

export function validateNewPassword(v: string): string | null {
  if (!v) return "Create a password.";
  const missing = passwordRules.filter((r) => !r.test(v));
  return missing.length ? `Your password needs: ${missing.map((r) => r.label.toLowerCase()).join(", ")}.` : null;
}

export function validateCurrentPassword(v: string): string | null {
  return v ? null : "Enter your password.";
}

export function validateConfirm(password: string, confirm: string): string | null {
  if (!confirm) return "Type your new password again.";
  return password === confirm ? null : "The passwords don't match.";
}

/** Only allow redirects to pages on this site. */
export function safeNext(next: string | null | undefined, fallback = "/"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return fallback;
  return next;
}
