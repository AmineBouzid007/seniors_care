import { z } from "zod";
import { GOVERNORATES } from "./constants";
import { todayInTunis } from "./utils";

const phone = z.string().trim().regex(/^\+?[0-9 ()-]{8,20}$/, "Enter a valid phone number.")
  .refine((v) => v.replace(/\D/g, "").length >= 8, "Enter a valid phone number.");

export const bookingSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(160),
  phone,
  serviceSlug: z.string().trim().min(1, "Choose a service."),
  governorate: z.enum(GOVERNORATES, { errorMap: () => ({ message: "Choose a governorate." }) }),
  address: z.string().trim().min(5, "Enter the full address.").max(250),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date.")
    .refine((d) => d >= todayInTunis(), "The date can't be in the past."),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Choose a time."),
  notes: z.string().trim().max(1000, "Keep notes under 1000 characters.").optional().default(""),
  website: z.string().optional().default(""), // honeypot: real people leave it empty (checked in the route)
});
export type BookingInput = z.infer<typeof bookingSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(160),
  phone: z.union([phone, z.literal("")]).optional().default(""),
  message: z.string().trim().min(10, "Write at least 10 characters.").max(3000),
  website: z.string().optional().default(""),
});
export type ContactInput = z.infer<typeof contactSchema>;

export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
