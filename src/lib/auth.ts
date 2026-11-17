import type { Identifier } from "./validation";

export type AuthResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; field?: string; message: string };

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const ok = <T>(data: T): AuthResult<T> => ({ ok: true, data });

export type Side = "seeker" | "company";

export async function signUp(input: {
  side: Side;
  name: string;
  identifier: Identifier;
  company?: string;
  corper: boolean;
  password: string;
}): Promise<AuthResult<{ to: string; via: Identifier["kind"] }>> {
  await delay(900);
  if (input.identifier.kind === "email" && input.identifier.value.startsWith("taken@")) {
    return { ok: false, field: "identifier", message: "An account with this email already exists. Try signing in." };
  }
  return ok({ to: input.identifier.value, via: input.identifier.kind });
}

export async function signIn(input: { identifier: Identifier; password: string }): Promise<AuthResult> {
  await delay(800);
  if (input.password === "Wrongpass1") {
    return { ok: false, message: "That email or phone and password don't match. Check them and try again." };
  }
  return ok(undefined);
}

export async function verifyCode(input: { to: string; code: string }): Promise<AuthResult> {
  await delay(700);
  if (input.code === "000000") return { ok: false, message: "That code isn't right. Check it and try again." };
  return ok(undefined);
}

export async function resendCode(input: { to: string }): Promise<AuthResult> {
  void input;
  await delay(600);
  return ok(undefined);
}

export async function requestPasswordReset(input: { identifier: Identifier }): Promise<AuthResult> {
  void input;
  await delay(800);
  return ok(undefined);
}

export async function resetPassword(input: { token: string; password: string }): Promise<AuthResult> {
  void input;
  await delay(800);
  return ok(undefined);
}

export async function startOAuth(provider: "google" | "whatsapp"): Promise<AuthResult> {
  await delay(400);
  const name = provider === "google" ? "Google" : "WhatsApp";
  return { ok: false, message: `Continue with ${name} isn't connected yet in this prototype. Use email or phone for now.` };
}
