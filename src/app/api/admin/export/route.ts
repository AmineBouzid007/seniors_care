import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { exportBookings } from "@/lib/queries";

export const dynamic = "force-dynamic";

// Stops spreadsheet formula injection (cells starting with = + - @ are executed by Excel)
const cell = (v: unknown) => {
  let s = v instanceof Date ? v.toISOString() : String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET() {
  if (!(await getSession())) return new NextResponse("Unauthorized", { status: 401 });
  const rows = await exportBookings();
  const head = ["reference","status","date","time","service","price_tnd","client","cin","phone","email","governorate","address","notes","created_at"];
  const lines = [head.join(",")].concat(
    rows.map((r) => [r.reference, r.status, r.date, r.time, r.service, r.price, r.client, r.cin, r.phone, r.email, r.governorate, r.address, r.notes, r.created].map(cell).join(",")),
  );
  return new NextResponse("\uFEFF" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bookings-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
