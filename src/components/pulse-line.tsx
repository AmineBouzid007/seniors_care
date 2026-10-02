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
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="10" fill="#22e4cf" />
      <path d="M4 17h6l3-7 5 13 3-6h7" stroke="#06202b" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
