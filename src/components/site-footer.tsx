import Link from "next/link";
import { LogoMark } from "./pulse-line";

export function SiteFooter() {
  return (
    <footer className="night mt-0 pb-10 pt-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5 font-display text-xl font-semibold"><LogoMark className="h-9 w-9" /> Senior Care Tunisia</div>
          <p className="mt-4 max-w-sm text-white/70">Compassionate, professional care for seniors at home, with dignity and respect, in every governorate of Tunisia.</p>
        </div>
        <nav aria-label="Footer" className="grid content-start gap-2 text-white/80">
          <span className="font-display font-semibold text-white">Explore</span>
          <Link className="hover:text-pulse" href="/about">About us</Link>
          <Link className="hover:text-pulse" href="/services">Services</Link>
          <Link className="hover:text-pulse" href="/activities">Activities</Link>
          <Link className="hover:text-pulse" href="/booking">Book a service</Link>
          <Link className="hover:text-pulse" href="/contact">Contact</Link>
        </nav>
        <div className="grid content-start gap-2 text-white/80">
          <span className="font-display font-semibold text-white">Care line</span>
          <p>Available 24/7, every day of the week.</p>
          <Link className="font-semibold text-pulse hover:underline" href="/contact">Send us a message</Link>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-wrap items-center justify-between gap-2 border-t border-white/10 px-6 pt-6 text-sm text-white/55">
        <p>&copy; {new Date().getFullYear()} Senior Care Tunisia. All rights reserved.</p>
        <p>Developed with ❤️ in Tunisia</p>
      </div>
    </footer>
  );
}
