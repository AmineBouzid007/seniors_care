import { requireAdmin } from "@/lib/auth";
import { listMessages } from "@/lib/queries";
import { toggleMessageHandled } from "../../actions";
import { PageTitle } from "@/components/admin-ui";

export const metadata = { title: "Messages" };

export default async function Messages() {
  await requireAdmin();
  const rows = await listMessages();
  return (
    <>
      <PageTitle>Messages</PageTitle>
      <div className="space-y-3">
        {rows.length === 0 && <p className="rounded-2xl bg-white p-6 text-ink-text/70">No messages yet.</p>}
        {rows.map((m) => (
          <article key={m.id} className={`rounded-2xl border p-5 ${m.handled ? "border-ink/10 bg-white/60" : "border-teal/40 bg-white"}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{m.name} <span className="font-normal text-ink-text/70">{m.createdAt.toLocaleString("en-GB", { timeZone: "Africa/Tunis" })}</span></p>
              <form action={toggleMessageHandled}><input type="hidden" name="id" value={m.id} /><input type="hidden" name="handled" value={String(!m.handled)} />
                <button className="rounded-full border border-ink/20 px-4 py-1.5 font-semibold hover:bg-mist">{m.handled ? "Mark as unhandled" : "Mark as handled"}</button></form>
            </div>
            <p className="mt-1 text-sm"><a className="text-teal hover:underline" href={`mailto:${m.email}`}>{m.email}</a>{m.phone && <> &nbsp;<a className="text-teal hover:underline" href={`tel:${m.phone}`}>{m.phone}</a></>}</p>
            <p className="mt-3 whitespace-pre-wrap">{m.message}</p>
          </article>
        ))}
      </div>
    </>
  );
}
