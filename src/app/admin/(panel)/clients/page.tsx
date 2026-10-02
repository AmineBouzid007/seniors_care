import { requireAdmin } from "@/lib/auth";
import { listClients } from "@/lib/queries";
import { formatTnd } from "@/lib/utils";
import { PageTitle } from "@/components/admin-ui";

export const metadata = { title: "Clients" };

export default async function Clients({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAdmin();
  const { q } = await searchParams;
  const rows = await listClients(q?.trim());
  return (
    <>
      <PageTitle>Clients</PageTitle>
      <form className="mb-4 flex gap-3"><input name="q" defaultValue={q} placeholder="Search name, CIN, phone, email" aria-label="Search clients" className="field max-w-sm" /><button className="rounded-full bg-ink px-6 py-2.5 font-semibold text-white">Search</button></form>
      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
        <table className="w-full min-w-[44rem] text-left">
          <thead className="bg-ink/5 text-sm text-ink-text/70"><tr><th className="p-3">Name</th><th>CIN</th><th>Contact</th><th>Governorate</th><th>Bookings</th><th>Paid (completed)</th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={6} className="p-6 text-ink-text/60">No clients found.</td></tr>}
            {rows.map((c) => (
              <tr key={c.id} className="border-t border-ink/10"><td className="p-3 font-semibold">{c.name}</td><td>{c.cin}</td><td>{c.phone}<br /><span className="text-sm text-ink-text/70">{c.email}</span></td><td>{c.governorate}</td><td>{c.bookings}</td><td>{formatTnd(c.spent)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
