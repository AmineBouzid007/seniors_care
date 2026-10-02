import type { ReactNode } from "react";
import type { BookingStatus } from "@/lib/schema";

const COLORS: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-900",
  confirmed: "bg-sky-100 text-sky-900",
  completed: "bg-emerald-100 text-emerald-900",
  cancelled: "bg-zinc-200 text-zinc-700",
};
export function StatusBadge({ status }: { status: BookingStatus }) {
  return <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold capitalize ${COLORS[status]}`}>{status}</span>;
}

export function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <p className="text-sm text-ink-text/70">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold">{value}</p>
      {sub && <p className="mt-1 text-sm text-ink-text/60">{sub}</p>}
    </div>
  );
}

export function PageTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h1 className="text-3xl font-semibold">{children}</h1>{action}</div>;
}

export function BarList({ rows, format }: { rows: { label: string; revenue: number; n: number }[]; format: (n: number) => string }) {
  const max = Math.max(1, ...rows.map((r) => r.revenue));
  if (!rows.length) return <p className="text-ink-text/60">No completed bookings yet.</p>;
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex justify-between gap-3 text-sm"><span className="font-semibold">{r.label}</span><span>{format(r.revenue)} <span className="text-ink-text/60">({r.n})</span></span></div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-ink/10"><div className="h-full rounded-full bg-gradient-to-r from-teal to-pulse" style={{ width: `${(r.revenue / max) * 100}%` }} /></div>
        </li>
      ))}
    </ul>
  );
}
