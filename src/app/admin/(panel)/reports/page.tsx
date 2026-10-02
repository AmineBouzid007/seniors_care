import { requireAdmin } from "@/lib/auth";
import { getReports } from "@/lib/queries";
import { formatTnd } from "@/lib/utils";
import { BarList, PageTitle, Stat } from "@/components/admin-ui";

export const metadata = { title: "Financial reports" };

export default async function Reports() {
  await requireAdmin();
  const r = await getReports();
  return (
    <>
      <PageTitle>Financial reports</PageTitle>
      <p className="-mt-3 mb-6 text-ink-text/70">Only bookings marked <strong>completed</strong> count as revenue.</p>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total revenue" value={formatTnd(r.totalRevenue)} />
        <Stat label="Completed bookings" value={r.completedCount} />
        <Stat label="Average per booking" value={formatTnd(Math.round(r.average * 100) / 100)} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-ink/10 bg-white p-5"><h2 className="mb-4 text-xl font-semibold">By month (last 12)</h2><BarList rows={r.byMonth} format={formatTnd} /></section>
        <section className="rounded-2xl border border-ink/10 bg-white p-5"><h2 className="mb-4 text-xl font-semibold">By service</h2><BarList rows={r.byService} format={formatTnd} /></section>
        <section className="rounded-2xl border border-ink/10 bg-white p-5 lg:col-span-2"><h2 className="mb-4 text-xl font-semibold">Top governorates</h2><BarList rows={r.byGovernorate} format={formatTnd} /></section>
      </div>
    </>
  );
}
