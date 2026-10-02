import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { contactMessages } from "@/lib/schema";
import { contactSchema, fieldErrors } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: fieldErrors(parsed.error), message: "Please fix the highlighted fields." }, { status: 422 });
  }
  const d = parsed.data;
  if (d.website) return NextResponse.json({ ok: true });

  try {
    await getDb().insert(contactMessages).values({ name: d.name, email: d.email, phone: d.phone || null, message: d.message });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[POST /api/contact]", e);
    return NextResponse.json({ ok: false, message: "We couldn't send your message. Please try again." }, { status: 500 });
  }
}
