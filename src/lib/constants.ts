export const GOVERNORATES = [
  "Ariana", "Beja", "Ben Arous", "Bizerte", "Gabes", "Gafsa", "Jendouba", "Kairouan",
  "Kasserine", "Kebili", "Kef", "Mahdia", "Manouba", "Medenine", "Monastir", "Nabeul",
  "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan",
] as const;

export type ServiceInfo = {
  id?: number;
  slug: string;
  name: string;
  description: string;
  priceTnd: number;
  durationMinutes: number;
};

/**
 * Used by the seed script AND as a fallback if the database is unreachable,
 * so the public site never shows an empty services list.
 * NOTE: prices are placeholders - set real ones in /admin/services.
 */
export const DEFAULT_SERVICES: ServiceInfo[] = [
  { slug: "home-visits", name: "Home Visits", priceTnd: 40, durationMinutes: 60,
    description: "Regular visits by trained caregivers to assist with daily activities and companionship." },
  { slug: "medication-management", name: "Medication Management", priceTnd: 30, durationMinutes: 45,
    description: "Help with medication schedules, reminders, and ensuring safety in medication intake." },
  { slug: "personal-care", name: "Personal Care", priceTnd: 50, durationMinutes: 60,
    description: "Assistance with hygiene, dressing, and mobility support delivered respectfully and professionally." },
  { slug: "emotional-support", name: "Emotional Support", priceTnd: 35, durationMinutes: 60,
    description: "Companionship and social interaction to improve mental wellbeing." },
  { slug: "rehabilitation-assistance", name: "Rehabilitation Assistance", priceTnd: 60, durationMinutes: 90,
    description: "Support during recovery from surgery or illness, helping seniors regain strength and independence." },
  { slug: "respite-care", name: "Respite Care", priceTnd: 80, durationMinutes: 240,
    description: "Temporary relief for primary caregivers, ensuring continuous care without interruption." },
];
