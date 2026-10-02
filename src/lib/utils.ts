export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatTnd(value: number | string) {
  const n = typeof value === "string" ? Number(value) : value;
  return `${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} TND`;
}

/** Today's date (YYYY-MM-DD) in Tunisia, regardless of server timezone. */
export function todayInTunis() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Tunis" }).format(new Date());
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")).replace(/\/$/, "");
}
