import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { SpotlightCard } from "@/components/spotlight-card";
import { ServiceIcon } from "@/components/service-icon";
import { getServices } from "@/lib/queries";

export const revalidate = 60;
export const metadata: Metadata = { title: "Services", description: "Home visits, medication management, personal care, emotional support, rehabilitation and respite care." };

export default async function Services() {
  const services = await getServices();
  return (
    <>
      <PageHero title="Our services" lead="Comprehensive care services tailored to meet your loved ones' needs." />
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <SpotlightCard key={s.slug} className="flex flex-col rounded-3xl border border-ink/10 bg-white p-7">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-pulse"><ServiceIcon slug={s.slug} /></span>
              <h2 className="mt-5 text-xl font-semibold">{s.name}</h2>
              <p className="mt-2 flex-1 text-ink-text/80">{s.description}</p>
              <Link href={`/booking?service=${s.slug}`} className="mt-6 font-semibold text-teal underline-offset-4 hover:underline">Book {s.name}</Link>
            </SpotlightCard>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/booking" className="inline-block rounded-full bg-ink px-8 py-3.5 text-lg font-semibold text-white transition hover:bg-ink-2">Book a service</Link>
        </div>
      </section>
    </>
  );
}
