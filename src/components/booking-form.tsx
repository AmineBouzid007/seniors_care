"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { GOVERNORATES, type ServiceInfo } from "@/lib/constants";
import { Field, Honeypot } from "./form-bits";

type Errors = Record<string, string>;

export function BookingForm({ services, defaultService }: { services: ServiceInfo[]; defaultService?: string }) {
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Tunis" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setErrors({}); setFormError("");
    const f = new FormData(e.currentTarget);
    const body = Object.fromEntries(f.entries());
    try {
      const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.ok) { setReference(data.reference); window.scrollTo({ top: 0, behavior: "smooth" }); }
      else { setErrors(data.errors ?? {}); setFormError(data.message ?? "Something went wrong."); }
    } catch {
      setFormError("Network problem. Check your connection and try again.");
    } finally { setLoading(false); }
  }

  if (reference) {
    return (
      <div role="status" className="rounded-[2rem] border border-teal/30 bg-white p-10 text-center shadow-xl">
        <CheckCircle2 className="mx-auto h-14 w-14 text-teal" aria-hidden="true" />
        <h2 className="mt-4 text-3xl font-semibold">Booking received</h2>
        <p className="mt-3">Your reference number is</p>
        <p className="mx-auto mt-2 w-fit rounded-2xl bg-ink px-6 py-3 font-display text-2xl font-semibold tracking-widest text-pulse">{reference}</p>
        <p className="mt-5">We'll contact you shortly to confirm the details. Keep this number in case you need to reach us.</p>
        <Link href="/" className="mt-8 inline-block rounded-full bg-ink px-7 py-3 font-semibold text-white">Back to home</Link>
      </div>
    );
  }

  const inv = (k: string) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `${k}-error` : undefined } as const);

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-5 rounded-[2rem] border border-ink/10 bg-white p-6 shadow-xl sm:p-10">
      <Honeypot />
      {formError && <p role="alert" className="rounded-2xl bg-orange-50 p-4 font-semibold text-orange-900">{formError}</p>}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="fullName" required error={errors.fullName}><input id="fullName" name="fullName" autoComplete="name" required className="field" {...inv("fullName")} /></Field>
        <Field label="Email address" name="email" required error={errors.email}><input id="email" name="email" type="email" autoComplete="email" required className="field" {...inv("email")} /></Field>
        <Field label="Phone number" name="phone" required error={errors.phone}><input id="phone" name="phone" type="tel" autoComplete="tel" required className="field" {...inv("phone")} /></Field>
      </div>

      <Field label="Service" name="serviceSlug" required error={errors.serviceSlug}>
        <select id="serviceSlug" name="serviceSlug" required defaultValue={services.some((s) => s.slug === defaultService) ? defaultService : ""} className="field" {...inv("serviceSlug")}>
          <option value="" disabled>Choose a service</option>
          {services.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
        </select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Governorate" name="governorate" required error={errors.governorate}>
          <select id="governorate" name="governorate" required defaultValue="" className="field" {...inv("governorate")}>
            <option value="" disabled>Select governorate</option>
            {GOVERNORATES.map((g) => <option key={g}>{g}</option>)}
          </select>
        </Field>
        <Field label="Full address" name="address" required error={errors.address}><input id="address" name="address" autoComplete="street-address" placeholder="Street, building, city" required className="field" {...inv("address")} /></Field>
        <Field label="Preferred date" name="date" required error={errors.date}><input id="date" name="date" type="date" min={today} required className="field" {...inv("date")} /></Field>
        <Field label="Preferred time" name="time" required error={errors.time}><input id="time" name="time" type="time" required className="field" {...inv("time")} /></Field>
      </div>

      <Field label="Additional information" name="notes" error={errors.notes}><textarea id="notes" name="notes" rows={4} maxLength={1000} placeholder="Health conditions, access instructions, anything we should know" className="field" {...inv("notes")} /></Field>

      <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-8 py-4 text-lg font-semibold text-white transition hover:bg-ink-2 disabled:opacity-60">
        {loading && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />} {loading ? "Sending..." : "Submit booking"}
      </button>
    </form>
  );
}
