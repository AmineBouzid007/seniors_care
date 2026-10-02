import Image from "next/image";
import Link from "next/link";
import { Clock, HeartHandshake, MapPinned, UserRoundCheck, Quote } from "lucide-react";
import { PulseLine } from "@/components/pulse-line";
import { SpotlightCard } from "@/components/spotlight-card";
import { ServiceIcon } from "@/components/service-icon";
import { getServices } from "@/lib/queries";

export const revalidate = 60;

const DAY = [
  { t: "08:00", what: "Medication reminder and breakfast check", done: true },
  { t: "10:30", what: "Home visit: mobility and personal care", done: true },
  { t: "15:00", what: "Companionship and a walk outside", done: false },
];

const WHY = [
  { icon: UserRoundCheck, title: "Experienced team", text: "Our trained staff provide trusted, professional care for all seniors." },
  { icon: HeartHandshake, title: "Personalized support", text: "Care plans are tailored to each person's health and emotional needs." },
  { icon: Clock, title: "24/7 availability", text: "We're here when you need us, day or night, every day of the week." },
];

export default async function Home() {
  const services = (await getServices()).slice(0, 3);

  return (
    <>
      <section className="night pb-28 pt-32 sm:pt-40">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="hero-in">
            <p className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-sm text-white/90">
              <span className="live-dot h-2.5 w-2.5 rounded-full bg-pulse text-pulse" /> Care available now in all 24 governorates
            </p>
            <h1 className="mt-6 text-4xl font-semibold text-white sm:text-6xl">Care at home that keeps every day safe, calm and dignified.</h1>
            <p className="mt-6 max-w-xl text-lg text-white/75 sm:text-xl">
              Compassionate and professional elderly care across Tunisia, delivered with dignity and love.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/booking" className="rounded-full bg-pulse px-7 py-3.5 text-lg font-semibold text-ink shadow-[0_0_40px_-8px_#22e4cf] transition hover:brightness-110">Book a service</Link>
              <Link href="/services" className="glass rounded-full px-7 py-3.5 text-lg font-semibold text-white transition hover:bg-white/20">See our services</Link>
            </div>
            <PulseLine className="mt-10 h-12 w-full max-w-lg" />
          </div>

          <aside className="glass hero-in rounded-[2rem] p-6 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.7)]" aria-label="Example of a care day">
            <h2 className="font-display text-lg font-semibold text-white">A typical care day</h2>
            <p className="mt-1 text-sm text-white/60">Example schedule, tailored to each person.</p>
            <ol className="mt-5 space-y-3">
              {DAY.map((d) => (
                <li key={d.t} className="flex items-start gap-4 rounded-2xl bg-white/[0.07] p-4">
                  <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${d.done ? "bg-pulse text-ink" : "border border-pulse/70 text-pulse"}`}>{d.done ? "✓" : ""}</span>
                  <div><p className="font-display font-semibold text-white">{d.t}</p><p className="text-white/75">{d.what}</p></div>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-16 max-w-6xl px-6">
        <div className="relative aspect-[16/7] overflow-hidden rounded-[2rem] shadow-[0_30px_80px_-30px_rgb(6_32_43/0.6)] ring-1 ring-ink/10">
          <Image src="/images/hero_welc.jpg" alt="A caregiver in teal scrubs smiling and supporting an elderly woman at home" fill priority sizes="(min-width:1152px) 1100px, 100vw" className="object-cover" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="max-w-xl text-3xl font-semibold sm:text-4xl">Why families choose us</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {WHY.map(({ icon: Icon, title, text }) => (
            <SpotlightCard key={title} className="rounded-3xl border border-ink/10 bg-white p-7">
              <Icon className="h-8 w-8 text-teal" aria-hidden="true" />
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-ink-text/80">{text}</p>
            </SpotlightCard>
          ))}
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-xl text-3xl font-semibold sm:text-4xl">Care that fits the day</h2>
            <Link href="/services" className="font-semibold text-teal underline-offset-4 hover:underline">View all services</Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {services.map((s) => (
              <SpotlightCard key={s.slug} className="rounded-3xl border border-ink/10 bg-mist p-7">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-pulse"><ServiceIcon slug={s.slug} /></span>
                <h3 className="mt-5 text-xl font-semibold">{s.name}</h3>
                <p className="mt-2 text-ink-text/80">{s.description}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-3xl font-semibold sm:text-4xl">What families say</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {[
            ["Senior Care helped my mother feel safe and cared for at home.", "Salma M., Sousse"],
            ["The professionalism and kindness of the staff was exceptional.", "Ahmed T., Tunis"],
          ].map(([q, who]) => (
            <figure key={who} className="rounded-3xl border border-ink/10 bg-white p-8">
              <Quote className="h-8 w-8 text-pulse" aria-hidden="true" />
              <blockquote className="mt-4 font-display text-xl leading-snug">{q}</blockquote>
              <figcaption className="mt-5 text-ink-text/70">{who}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="night py-24 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <MapPinned className="mx-auto h-10 w-10 text-pulse" aria-hidden="true" />
          <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">Have questions? Need assistance?</h2>
          <p className="mt-4 text-lg text-white/75">We're here to help your family make the right care decisions.</p>
          <Link href="/contact" className="mt-8 inline-block rounded-full bg-pulse px-8 py-3.5 text-lg font-semibold text-ink transition hover:brightness-110">Contact us</Link>
        </div>
      </section>
    </>
  );
}
