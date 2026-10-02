import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { SpotlightCard } from "@/components/spotlight-card";
import { ActivityIcon } from "@/components/activity-icon";
import { getActivities } from "@/lib/queries";

export const revalidate = 60;
export const metadata: Metadata = { title: "Activities", description: "Gentle exercise, memory games, music, crafts and more: activities that keep seniors active, social and happy at home." };

export default async function Activities() {
  const items = await getActivities();
  return (
    <>
      <PageHero title="Activities" lead="Care is more than tasks. These activities keep body and mind active, and make every visit something to look forward to." />
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <SpotlightCard key={a.slug} className="rounded-3xl border border-ink/10 bg-white p-7">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-pulse"><ActivityIcon name={a.icon} /></span>
              <h2 className="mt-5 text-xl font-semibold">{a.title}</h2>
              <p className="mt-2 text-ink-text/80">{a.description}</p>
            </SpotlightCard>
          ))}
        </div>
        <div className="mt-14 rounded-[2rem] border border-teal/25 bg-white p-8 text-center sm:p-12">
          <h2 className="text-2xl font-semibold sm:text-3xl">Want these activities included in your loved one's visits?</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-text/80">Tell us what they enjoy when you book and we'll plan around it.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/booking" className="rounded-full bg-ink px-7 py-3 font-semibold text-white transition hover:bg-ink-2">Book a service</Link>
            <Link href="/contact" className="rounded-full border border-ink/25 px-7 py-3 font-semibold transition hover:bg-mist">Ask a question</Link>
          </div>
        </div>
      </section>
    </>
  );
}
