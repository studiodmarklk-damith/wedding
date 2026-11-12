import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { saveSettings } from "@/lib/db";
import { normalizeSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  try {
    const saved = await saveSettings(body);
    return NextResponse.json({ ok: true, settings: normalizeSettings(saved as unknown as Record<string, unknown>) });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("saveSettings failed:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
