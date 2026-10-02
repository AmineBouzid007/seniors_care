import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getDashboard } from "@/lib/queries";
import { formatTnd } from "@/lib/utils";
import { PageTitle, Stat, StatusBadge } from "@/components/admin-ui";

export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  await requireAdmin();
  const d = await getDashboard();
  return (
    <>
      <PageTitle>Dashboard</PageTitle>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Pending requests" value={d.pending} sub="Need a confirmation call" />
        <Stat label="Upcoming confirmed" value={d.upcomingConfirmed} />
        <Stat label="Revenue (completed)" value={formatTnd(d.revenueCompleted)} />
        <Stat label="Pipeline (pending + confirmed)" value={formatTnd(d.pipeline)} />
        <Stat label="Total bookings" value={d.totalBookings} sub={`${d.completed} completed, ${d.cancelled} cancelled`} />
        <Stat label="Clients" value={d.clients} />
        <Stat label="Unhandled messages" value={d.unreadMessages} />
      </div>
      <section className="mt-8 rounded-2xl border border-ink/10 bg-white p-5">
        <div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-semibold">Latest bookings</h2><Link href="/admin/bookings" className="font-semibold text-teal hover:underline">See all</Link></div>
        {d.recent.length === 0 ? <p className="text-ink-text/60">No bookings yet. They will appear here as soon as someone books.</p> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[34rem] text-left">
            <thead className="text-sm text-ink-text/60"><tr><th className="py-2">Reference</th><th>Client</th><th>Service</th><th>When</th><th>Status</th></tr></thead>
            <tbody>{d.recent.map((r) => (
              <tr key={r.id} className="border-t border-ink/10"><td className="py-3 font-semibold">{r.reference}</td><td>{r.client}</td><td>{r.service}</td><td>{r.date} {r.time.slice(0, 5)}</td><td><StatusBadge status={r.status} /></td></tr>
            ))}</tbody>
          </table></div>
        )}
      </section>
    </>
  );
}
