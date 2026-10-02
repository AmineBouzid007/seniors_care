"use client";
import type { ReactNode, PointerEvent } from "react";

export function SpotlightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  function move(e: PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  }
  return <div onPointerMove={move} className={`spot ${className}`}>{children}</div>;
}
