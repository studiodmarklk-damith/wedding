import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, expectedToken, verifyPin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { pin?: string };
  if (!body.pin || !verifyPin(body.pin)) {
    return NextResponse.json({ ok: false, error: "Invalid PIN" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await expectedToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
