import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = { title: "Contact", description: "Questions about care for your family? Send us a message." };

export default function Contact() {
  return (
    <>
      <PageHero title="Contact us" lead="We're here to answer your questions and support your family." />
      <section className="mx-auto max-w-3xl px-6 py-16 sm:py-24"><ContactForm /></section>
    </>
  );
}
