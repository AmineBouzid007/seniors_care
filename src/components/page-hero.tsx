import type { ReactNode } from "react";
import { PulseLine } from "./pulse-line";

export function PageHero({ title, lead, children }: { title: string; lead: string; children?: ReactNode }) {
  return (
    <section className="night pb-16 pt-36 sm:pt-44">
      <div className="hero-in mx-auto max-w-6xl px-6">
        <h1 className="max-w-3xl text-4xl font-semibold text-white sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg text-white/75 sm:text-xl">{lead}</p>
        <PulseLine className="mt-8 h-10 w-full max-w-md" />
        {children}
      </div>
    </section>
  );
}
