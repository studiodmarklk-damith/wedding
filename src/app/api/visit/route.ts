import { NextResponse } from "next/server";
import { addVisit, getVisits } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST() {
  const count = await addVisit();
  return NextResponse.json({ count });
}

export async function GET() {
  const count = await getVisits();
  return NextResponse.json({ count });
}
