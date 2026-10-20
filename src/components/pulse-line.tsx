export function PulseLine({ className = "" }: { className?: string }) {
  return (
    <svg className={`pulse-line ${className}`} viewBox="0 0 640 70" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <path
        pathLength={1}
        d="M0 38 H210 L226 38 L240 10 L258 62 L274 24 L286 38 H420 L432 38 L444 20 L456 52 L466 38 H640"
        stroke="#22e4cf" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  // The real Seniors Care logo, on a white tile so it stays readable on dark and light backgrounds.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo.png" alt="" aria-hidden="true" className={`${className} shrink-0 rounded-xl bg-white object-contain p-1`} />
  );
}
