import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { BookingForm } from "@/components/booking-form";
import { getServices } from "@/lib/queries";

export const revalidate = 60;
export const metadata: Metadata = { title: "Book a service", description: "Schedule a care service for your loved one anywhere in Tunisia." };

export default async function Booking({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const [services, { service }] = await Promise.all([getServices(), searchParams]);
  return (
    <>
      <PageHero title="Book a service" lead="Schedule a care service tailored to your loved one's needs." />
      <section className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <BookingForm services={services} defaultService={service} />
      </section>
    </>
  );
}
