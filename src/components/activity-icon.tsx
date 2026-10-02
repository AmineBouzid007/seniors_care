import { Dumbbell, Brain, Music2, Palette, Flower2, BookOpen, Footprints, HeartPulse, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  exercise: Dumbbell, brain: Brain, music: Music2, art: Palette,
  garden: Flower2, book: BookOpen, walk: Footprints, heart: HeartPulse,
};

export function ActivityIcon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? HeartPulse;
  return <Icon className={className} aria-hidden="true" />;
}
