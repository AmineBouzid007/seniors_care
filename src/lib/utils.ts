export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Digits only, without the +216 / 00216 country code, so different spellings of one number match. */
export function phoneKey(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("00216")) d = d.slice(5);
  else if (d.startsWith("216") && d.length > 8) d = d.slice(3);
  return d;
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
