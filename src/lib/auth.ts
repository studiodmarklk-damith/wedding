import { cookies } from "next/headers";

export const ADMIN_COOKIE = "wed_admin";
const ADMIN_PIN = process.env.ADMIN_PIN ?? "JGS234-56JH";
const SECRET = process.env.ADMIN_SECRET ?? "jgs-wedding-secret-v1";

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return toHex(sig);
}

export function verifyPin(pin: string): boolean {
  return pin.trim().toUpperCase() === ADMIN_PIN.toUpperCase();
}

export async function expectedToken(): Promise<string> {
  return hmac("admin-session", SECRET);
}

export async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return token === (await expectedToken());
}
