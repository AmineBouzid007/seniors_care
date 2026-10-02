import { House, Pill, HandHeart, MessageCircleHeart, Activity, Armchair, HeartPulse, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  "home-visits": House,
  "medication-management": Pill,
  "personal-care": HandHeart,
  "emotional-support": MessageCircleHeart,
  "rehabilitation-assistance": Activity,
  "respite-care": Armchair,
};

export function ServiceIcon({ slug, className = "h-6 w-6" }: { slug: string; className?: string }) {
  const Icon = ICONS[slug] ?? HeartPulse;
  return <Icon className={className} aria-hidden="true" />;
}
