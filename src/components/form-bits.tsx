import type { ReactNode } from "react";

export function Field({ label, name, error, required, hint, children }: { label: string; name: string; error?: string; required?: boolean; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block font-semibold">{label}{required && <span className="text-orange-700" aria-hidden="true"> *</span>}</label>
      {children}
      {hint && !error && <p className="mt-1 text-sm text-ink-text/60">{hint}</p>}
      {error && <p id={`${name}-error`} role="alert" className="mt-1 text-sm font-semibold text-orange-800">{error}</p>}
    </div>
  );
}

export function Honeypot() {
  // Hidden from people & screen readers; bots fill it in.
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
    </div>
  );
}
