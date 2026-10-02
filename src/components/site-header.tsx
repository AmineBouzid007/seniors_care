"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { LogoMark } from "./pulse-line";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/activities", label: "Activities" },
  { href: "/contact", label: "Contact" },
];

type Tone = "dark" | "light"; // tone of the content BEHIND the navbar

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [tone, setTone] = useState<Tone>("dark");

  // Watch what is behind the bar: if the point just under it sits inside a ".night" (dark) section → dark, else light.
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const y = 44; // vertical middle of the navbar
      const dark = Array.from(document.querySelectorAll<HTMLElement>(".night")).some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= y && r.bottom >= y;
      });
      setTone(dark ? "dark" : "light");
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(measure); };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const t = setTimeout(measure, 150); // after the new page has rendered
    return () => { window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); clearTimeout(t); if (raf) cancelAnimationFrame(raf); };
  }, [path]);

  const dark = tone === "dark";
  const text = dark ? "text-white" : "text-ink";
  const soft = dark ? "text-white/80" : "text-ink/75";
  const hover = dark ? "hover:bg-white/10" : "hover:bg-ink/8";
  const active = dark ? "bg-white/15 text-white" : "bg-ink/10 text-ink";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <div
        className={`mx-auto max-w-6xl rounded-3xl border px-4 py-2.5 backdrop-blur-2xl backdrop-saturate-150 transition-colors duration-300 sm:rounded-full sm:pl-5 sm:pr-2.5 ${text} ${
          dark
            ? "border-white/15 bg-ink/35 shadow-[0_8px_40px_-12px_rgb(0_0_0/0.55)]"
            : "border-ink/10 bg-white/65 shadow-[0_8px_40px_-14px_rgb(6_32_43/0.35)]"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight" onClick={() => setOpen(false)}>
            <LogoMark /> Senior Care
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} aria-current={path === l.href ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-[0.95rem] transition-colors ${hover} ${path === l.href ? active : soft}`}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/booking" className="hidden rounded-full bg-pulse px-5 py-2.5 font-semibold text-ink transition hover:brightness-110 sm:inline-block">
              Book a service
            </Link>
            <button type="button" className={`rounded-full p-2.5 md:hidden ${hover}`} aria-expanded={open} aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {open && (
          <nav id="mobile-nav" aria-label="Mobile" className={`mt-3 grid gap-1 border-t pt-3 md:hidden ${dark ? "border-white/15" : "border-ink/10"}`}>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} aria-current={path === l.href ? "page" : undefined}
                className={`rounded-2xl px-4 py-3 text-lg ${path === l.href ? active : hover}`}>
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
