"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LogoMark } from "./pulse-line";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="glass mx-auto max-w-6xl rounded-3xl bg-ink/60 px-4 py-2.5 text-white shadow-[0_8px_40px_-12px_rgb(0_0_0/0.6)] sm:rounded-full sm:pl-5 sm:pr-2.5">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight" onClick={() => setOpen(false)}>
            <LogoMark /> Senior Care
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} aria-current={path === l.href ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-[0.95rem] transition-colors hover:bg-white/10 ${path === l.href ? "bg-white/15 text-white" : "text-white/80"}`}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/booking" className="hidden rounded-full bg-pulse px-5 py-2.5 font-semibold text-ink transition hover:brightness-110 sm:inline-block">
              Book a service
            </Link>
            <button type="button" className="rounded-full p-2.5 hover:bg-white/10 md:hidden" aria-expanded={open} aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {open && (
          <nav id="mobile-nav" aria-label="Mobile" className="mt-3 grid gap-1 border-t border-white/15 pt-3 md:hidden">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} aria-current={path === l.href ? "page" : undefined}
                className={`rounded-2xl px-4 py-3 text-lg ${path === l.href ? "bg-white/15" : "hover:bg-white/10"}`}>
                {l.label}
              </Link>
            ))}
            <Link href="/booking" onClick={() => setOpen(false)} className="mt-1 rounded-2xl bg-pulse px-4 py-3 text-center text-lg font-semibold text-ink">
              Book a service
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
