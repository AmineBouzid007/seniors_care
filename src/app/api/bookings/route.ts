import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { bookings, clients, services } from "@/lib/schema";
import { bookingSchema, fieldErrors } from "@/lib/validation";

export const runtime = "nodejs";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid misreading by phone
function makeReference() {
  const bytes = randomBytes(6);
  return "SC-" + Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: fieldErrors(parsed.error), message: "Please fix the highlighted fields." }, { status: 422 });
  }
  const d = parsed.data;

  // Bots fill the hidden field. Pretend success so they learn nothing.
  if (d.website) return NextResponse.json({ ok: true, reference: "SC-000000" });

  try {
    const db = getDb();

    const [service] = await db.select().from(services).where(eq(services.slug, d.serviceSlug)).limit(1);
    if (!service || !service.active) {
      return NextResponse.json({ ok: false, errors: { serviceSlug: "This service is not available." }, message: "Please choose another service." }, { status: 422 });
    }

    // Create the client profile once per CIN. We never overwrite an existing profile from
    // a public form (anyone could type someone else's CIN) - the booking keeps its own contact snapshot.
    await db.insert(clients).values({
      cin: d.cin.toUpperCase(), fullName: d.fullName, email: d.email, phone: d.phone,
      governorate: d.governorate, address: d.address,
    }).onConflictDoNothing({ target: clients.cin });
    const [client] = await db.select({ id: clients.id }).from(clients).where(eq(clients.cin, d.cin.toUpperCase())).limit(1);

    let reference = makeReference();
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await db.insert(bookings).values({
          reference, clientId: client.id, serviceId: service.id, priceTnd: service.priceTnd,
          bookingDate: d.date, bookingTime: d.time, notes: d.notes || null,
          governorate: d.governorate, address: d.address, contactPhone: d.phone, contactEmail: d.email,
        });
        return NextResponse.json({ ok: true, reference });
      } catch (e) {
        if (attempt === 2 || !/reference/.test(String(e))) throw e;
        reference = makeReference(); // extremely rare collision → retry
      }
    }
    throw new Error("unreachable");
  } catch (e) {
    console.error("[POST /api/bookings]", e);
    return NextResponse.json({ ok: false, message: "We couldn't save your booking. Please try again or call us." }, { status: 500 });
  }
}
