import Link from "next/link";
import { LayoutDashboard, CalendarCheck, Sparkles, Users, Wallet, Inbox, Settings2, LogOut, Globe } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "../actions";
import { LogoMark } from "@/components/pulse-line";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/reports", label: "Financial reports", icon: Wallet },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
  { href: "/admin/services", label: "Services & prices", icon: Settings2 },
  { href: "/admin/activities", label: "Activities", icon: Sparkles },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="night flex flex-col gap-1 p-4 lg:sticky lg:top-0 lg:h-screen">
        <div className="mb-4 flex items-center gap-2.5 px-2 py-2 font-display text-lg font-semibold"><LogoMark /> Admin</div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto lg:flex-col">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-white/85 hover:bg-white/10"><Icon className="h-5 w-5 text-pulse" aria-hidden="true" />{label}</Link>
          ))}
        </nav>
        <div className="mt-auto hidden border-t border-white/10 pt-4 lg:block">
          <p className="truncate px-2 text-sm text-white/60">{session.email}</p>
          <Link href="/" className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-white/85 hover:bg-white/10"><Globe className="h-5 w-5" aria-hidden="true" />View site</Link>
          <form action={logoutAction}><button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-white/85 hover:bg-white/10"><LogOut className="h-5 w-5" aria-hidden="true" />Sign out</button></form>
        </div>
      </aside>
      <div className="min-w-0 p-4 sm:p-8">{children}
        <form action={logoutAction} className="mt-10 lg:hidden"><button className="rounded-full border border-ink/20 px-5 py-2.5 font-semibold">Sign out</button></form>
      </div>
    </div>
  );
}
