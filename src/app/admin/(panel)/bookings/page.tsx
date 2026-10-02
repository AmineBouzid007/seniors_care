import Link from "next/link";
import { Download } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { listBookings } from "@/lib/queries";
import { BOOKING_STATUSES } from "@/lib/schema";
import { formatTnd } from "@/lib/utils";
import { updateBookingStatus } from "../../actions";
import { PageTitle, StatusBadge } from "@/components/admin-ui";

export const metadata = { title: "Bookings" };

export default async function Bookings({ searchParams }: { searchParams: Promise<{ status?: string; q?: string; page?: string }> }) {
  await requireAdmin();
  const sp = await searchParams;
  const { rows, total, page, pages } = await listBookings({ status: sp.status, q: sp.q?.trim(), page: Number(sp.page) || 1 });
  const qs = (o: Record<string, string | undefined>) => { const p = new URLSearchParams(); for (const [k, v] of Object.entries({ status: sp.status, q: sp.q, ...o })) if (v) p.set(k, v); const s = p.toString(); return s ? `?${s}` : ""; };

  return (
    <>
      <PageTitle action={<a href="/api/admin/export" className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-2.5 font-semibold hover:bg-white"><Download className="h-4 w-4" aria-hidden="true" />Export CSV</a>}>Bookings</PageTitle>
      <form className="mb-4 flex flex-wrap gap-3">
        <input name="q" defaultValue={sp.q} placeholder="Search reference, name, phone, CIN" aria-label="Search" className="field max-w-sm" />
        <select name="status" defaultValue={sp.status ?? ""} aria-label="Status" className="field max-w-[12rem]"><option value="">All statuses</option>{BOOKING_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
        <button className="rounded-full bg-ink px-6 py-2.5 font-semibold text-white">Filter</button>
      </form>
      <p className="mb-3 text-sm text-ink-text/70">{total} booking{total === 1 ? "" : "s"}</p>
      <div className="space-y-3">
        {rows.length === 0 && <p className="rounded-2xl bg-white p-6 text-ink-text/70">No bookings match this filter.</p>}
        {rows.map((b) => (
          <article key={b.id} className="rounded-2xl border border-ink/10 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><p className="font-display text-lg font-semibold">{b.reference} <span className="font-sans text-base font-normal text-ink-text/70">{b.service}, {formatTnd(b.price)}</span></p>
                <p className="text-ink-text/80">{b.date} at {b.time.slice(0, 5)}</p></div>
              <StatusBadge status={b.status} />
            </div>
            <dl className="mt-3 grid gap-x-8 gap-y-1 text-[0.97rem] sm:grid-cols-2">
              <div><dt className="inline text-ink-text/60">Client: </dt><dd className="inline">{b.client} (CIN {b.cin})</dd></div>
              <div><dt className="inline text-ink-text/60">Phone: </dt><dd className="inline"><a className="text-teal hover:underline" href={`tel:${b.phone}`}>{b.phone}</a></dd></div>
              <div><dt className="inline text-ink-text/60">Email: </dt><dd className="inline"><a className="text-teal hover:underline" href={`mailto:${b.email}`}>{b.email}</a></dd></div>
              <div><dt className="inline text-ink-text/60">Address: </dt><dd className="inline">{b.address}, {b.governorate}</dd></div>
              {b.notes && <div className="sm:col-span-2"><dt className="inline text-ink-text/60">Notes: </dt><dd className="inline">{b.notes}</dd></div>}
            </dl>
            <form action={updateBookingStatus} className="mt-4 flex flex-wrap items-center gap-2">
              <input type="hidden" name="id" value={b.id} />
              <label htmlFor={`s-${b.id}`} className="sr-only">Change status</label>
              <select id={`s-${b.id}`} name="status" defaultValue={b.status} className="field max-w-[11rem] !py-2">{BOOKING_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
              <button className="rounded-full bg-ink px-5 py-2 font-semibold text-white">Update status</button>
            </form>
          </article>
        ))}
      </div>
      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex items-center gap-4">
          {page > 1 && <Link className="font-semibold text-teal hover:underline" href={qs({ page: String(page - 1) })}>Previous</Link>}
          <span>Page {page} of {pages}</span>
          {page < pages && <Link className="font-semibold text-teal hover:underline" href={qs({ page: String(page + 1) })}>Next</Link>}
        </nav>
      )}
    </>
  );
}
