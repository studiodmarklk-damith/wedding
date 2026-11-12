import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getVisits } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ visits: await getVisits() });
}
