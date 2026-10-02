"use client";
import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Field, Honeypot } from "./form-bits";

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setErrors({}); setFormError("");
    const body = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.ok) setSent(true); else { setErrors(data.errors ?? {}); setFormError(data.message ?? "Something went wrong."); }
    } catch { setFormError("Network problem. Check your connection and try again."); }
    finally { setLoading(false); }
  }

  if (sent) return (
    <div role="status" className="rounded-[2rem] border border-teal/30 bg-white p-10 text-center shadow-xl">
      <CheckCircle2 className="mx-auto h-14 w-14 text-teal" aria-hidden="true" />
      <h2 className="mt-4 text-3xl font-semibold">Message sent</h2>
      <p className="mt-3">Thank you. We'll reply as soon as we can.</p>
    </div>
  );

  const inv = (k: string) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `${k}-error` : undefined } as const);
  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-5 rounded-[2rem] border border-ink/10 bg-white p-6 shadow-xl sm:p-10">
      <Honeypot />
      {formError && <p role="alert" className="rounded-2xl bg-orange-50 p-4 font-semibold text-orange-900">{formError}</p>}
      <Field label="Full name" name="name" required error={errors.name}><input id="name" name="name" autoComplete="name" required className="field" {...inv("name")} /></Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email address" name="email" required error={errors.email}><input id="email" name="email" type="email" autoComplete="email" required className="field" {...inv("email")} /></Field>
        <Field label="Phone number" name="phone" error={errors.phone}><input id="phone" name="phone" type="tel" autoComplete="tel" className="field" {...inv("phone")} /></Field>
      </div>
      <Field label="Message" name="message" required error={errors.message}><textarea id="message" name="message" rows={6} required className="field" {...inv("message")} /></Field>
      <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-8 py-4 text-lg font-semibold text-white transition hover:bg-ink-2 disabled:opacity-60">
        {loading && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />} {loading ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
