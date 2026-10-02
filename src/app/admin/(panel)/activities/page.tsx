import { requireAdmin } from "@/lib/auth";
import { listAllActivities } from "@/lib/queries";
import { ACTIVITY_ICONS } from "@/lib/constants";
import { createActivity, deleteActivity, saveActivity } from "../../actions";
import { PageTitle } from "@/components/admin-ui";

export const metadata = { title: "Activities" };

const ICON_LABEL: Record<string, string> = { exercise: "Exercise", brain: "Memory / brain", music: "Music", art: "Art", garden: "Garden", book: "Reading", walk: "Walking", heart: "Heart (general)" };

export default async function ActivitiesAdmin() {
  await requireAdmin();
  const rows = await listAllActivities();
  const Icons = ({ id, def }: { id: string; def: string }) => (
    <select id={id} name="icon" defaultValue={def} className="field !py-2">{ACTIVITY_ICONS.map((i) => <option key={i} value={i}>{ICON_LABEL[i]}</option>)}</select>
  );
  return (
    <>
      <PageTitle>Activities</PageTitle>
      <p className="-mt-3 mb-6 max-w-2xl text-ink-text/70">These appear on the Activities page and the home page. Lower “Order” numbers come first. Untick “Visible” to hide one without deleting it.</p>

      <div className="space-y-3">
        {rows.length === 0 && <p className="rounded-2xl bg-white p-6">No activities yet. Add one below, or run <code>npm run db:seed</code> for starter examples.</p>}
        {rows.map((a) => (
          <div key={a.id} className="rounded-2xl border border-ink/10 bg-white p-5">
            <form action={saveActivity} className="grid gap-3 md:grid-cols-[1fr_12rem_6rem]">
              <input type="hidden" name="id" value={a.id} />
              <div><label htmlFor={`t${a.id}`} className="text-sm font-semibold">Title</label><input id={`t${a.id}`} name="title" defaultValue={a.title} required maxLength={80} className="field !py-2" /></div>
              <div><label htmlFor={`i${a.id}`} className="text-sm font-semibold">Icon</label><Icons id={`i${a.id}`} def={a.icon} /></div>
              <div><label htmlFor={`o${a.id}`} className="text-sm font-semibold">Order</label><input id={`o${a.id}`} name="sortOrder" type="number" min="0" defaultValue={a.sortOrder} className="field !py-2" /></div>
              <div className="md:col-span-3"><label htmlFor={`d${a.id}`} className="text-sm font-semibold">Description</label><textarea id={`d${a.id}`} name="description" defaultValue={a.description} required maxLength={400} rows={2} className="field !py-2" /></div>
              <div className="flex flex-wrap items-center gap-4 md:col-span-3">
                <label className="flex items-center gap-2 font-semibold"><input type="checkbox" name="active" defaultChecked={a.active} className="h-5 w-5 accent-teal" />Visible</label>
                <button className="rounded-full bg-ink px-5 py-2 font-semibold text-white">Save</button>
              </div>
            </form>
            <form action={deleteActivity} className="mt-2"><input type="hidden" name="id" value={a.id} /><button className="text-sm font-semibold text-orange-800 underline-offset-4 hover:underline">Delete this activity</button></form>
          </div>
        ))}
      </div>

      <form action={createActivity} className="mt-8 grid gap-3 rounded-2xl border-2 border-dashed border-teal/40 bg-white/60 p-5 md:grid-cols-[1fr_12rem]">
        <h2 className="text-xl font-semibold md:col-span-2">Add an activity</h2>
        <div><label htmlFor="nt" className="text-sm font-semibold">Title</label><input id="nt" name="title" required maxLength={80} className="field !py-2" /></div>
        <div><label htmlFor="ni" className="text-sm font-semibold">Icon</label><Icons id="ni" def="heart" /></div>
        <div className="md:col-span-2"><label htmlFor="nd" className="text-sm font-semibold">Description</label><textarea id="nd" name="description" required maxLength={400} rows={2} className="field !py-2" /></div>
        <div className="md:col-span-2"><button className="rounded-full bg-ink px-6 py-2.5 font-semibold text-white">Add activity</button></div>
      </form>
    </>
  );
}
