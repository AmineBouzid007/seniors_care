import { requireAdmin } from "@/lib/auth";
import { listAllServices } from "@/lib/queries";
import { updateService } from "../../actions";
import { PageTitle } from "@/components/admin-ui";

export const metadata = { title: "Services & prices" };

export default async function ServicesAdmin() {
  await requireAdmin();
  const rows = await listAllServices();
  return (
    <>
      <PageTitle>Services &amp; prices</PageTitle>
      <p className="-mt-3 mb-6 max-w-2xl text-ink-text/70">Prices are in TND and are copied onto each new booking, so changing a price never rewrites past revenue. Untick “Visible” to hide a service from the website.</p>
      <div className="space-y-3">
        {rows.length === 0 && <p className="rounded-2xl bg-white p-6">No services yet. Run <code>npm run db:seed</code>.</p>}
        {rows.map((s) => (
          <form key={s.id} action={updateService} className="grid items-end gap-4 rounded-2xl border border-ink/10 bg-white p-5 md:grid-cols-[1fr_8rem_8rem_auto_auto]">
            <input type="hidden" name="id" value={s.id} />
            <div><p className="font-display text-lg font-semibold">{s.name}</p><p className="text-sm text-ink-text/70">{s.slug}</p></div>
            <div><label htmlFor={`p${s.id}`} className="text-sm font-semibold">Price (TND)</label><input id={`p${s.id}`} name="priceTnd" type="number" step="0.01" min="0" defaultValue={s.priceTnd} className="field !py-2" /></div>
            <div><label htmlFor={`d${s.id}`} className="text-sm font-semibold">Minutes</label><input id={`d${s.id}`} name="durationMinutes" type="number" min="15" step="5" defaultValue={s.durationMinutes} className="field !py-2" /></div>
            <label className="flex items-center gap-2 pb-2.5 font-semibold"><input type="checkbox" name="active" defaultChecked={s.active} className="h-5 w-5 accent-teal" />Visible</label>
            <button className="rounded-full bg-ink px-5 py-2.5 font-semibold text-white">Save</button>
          </form>
        ))}
      </div>
    </>
  );
}
