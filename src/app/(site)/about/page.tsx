import type { Metadata } from "next";
import Image from "next/image";
import { HeartHandshake, ShieldCheck, Scale } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SpotlightCard } from "@/components/spotlight-card";

export const metadata: Metadata = { title: "About us", description: "Our mission: person-centered care for seniors across Tunisia." };

const VALUES = [
  { icon: HeartHandshake, title: "Compassion", text: "We treat every senior with kindness, understanding, and heartfelt care." },
  { icon: ShieldCheck, title: "Trust", text: "Families trust us because we're dependable, transparent, and professional." },
  { icon: Scale, title: "Respect", text: "We honor each individual's wishes, privacy, and cultural values at all times." },
];

export default function About() {
  return (
    <>
      <PageHero title="About us" lead="Committed to compassionate elderly care in Tunisia, with dignity, respect, and love." />
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
        <div className="relative aspect-[3/2] overflow-hidden rounded-[2rem] shadow-xl ring-1 ring-ink/10">
          <Image src="/images/about-care.jpg" alt="A smiling caregiver helping an elderly man up from a sofa" fill sizes="(min-width:768px) 560px, 100vw" className="object-cover" />
        </div>
        <div>
          <h2 className="text-3xl font-semibold sm:text-4xl">Our mission</h2>
          <p className="mt-5">At Senior Care, our mission is to deliver high-quality, person-centered care to seniors across Tunisia. We believe that every elderly individual deserves to age with dignity in the comfort of their own home or community.</p>
          <p className="mt-4">We work closely with families to ensure their loved ones receive the right support, from basic daily tasks to emotional companionship and medical oversight. Our trained professionals are dedicated to making life easier, safer, and more fulfilling for every client.</p>
        </div>
      </section>
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-semibold sm:text-4xl">Our core values</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <SpotlightCard key={title} className="rounded-3xl border border-ink/10 bg-mist p-7">
                <Icon className="h-8 w-8 text-teal" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-ink-text/80">{text}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
