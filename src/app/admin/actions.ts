"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { activities, adminUsers, bookings, contactMessages, services, BOOKING_STATUSES } from "@/lib/schema";
import { ACTIVITY_ICONS } from "@/lib/constants";
import { endSession, requireAdmin, startSession } from "@/lib/auth";

export type LoginState = { error?: string };

// Compared against when the email is unknown, so response time doesn't reveal which emails exist.
const DUMMY_HASH = "$2b$10$CwTycUXWue0Thq9StjUM0uJ8.1uWyZ8yqkqzEx0o0v5N1wV5oX9aW";

export async function loginAction(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  let user: typeof adminUsers.$inferSelect | undefined;
  try {
    [user] = await getDb().select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  } catch (e) {
    console.error("[login] db error", e);
    return { error: "The database is unreachable. Check DATABASE_URL." };
  }
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) return { error: "Incorrect email or password." };

  await startSession({ id: user.id, email: user.email, name: user.name });
  redirect("/admin");
}

export async function logoutAction() {
  await endSession();
  redirect("/admin/login");
}

export async function updateBookingStatus(form: FormData) {
  await requireAdmin();
  const id = z.string().uuid().parse(form.get("id"));
  const status = z.enum(BOOKING_STATUSES).parse(form.get("status"));
  await getDb().update(bookings).set({ status, updatedAt: new Date() }).where(eq(bookings.id, id));
  revalidatePath("/admin", "layout");
}

export async function toggleMessageHandled(form: FormData) {
  await requireAdmin();
  const id = z.coerce.number().int().parse(form.get("id"));
  const handled = form.get("handled") === "true";
  await getDb().update(contactMessages).set({ handled }).where(eq(contactMessages.id, id));
  revalidatePath("/admin", "layout");
}

export async function updateService(form: FormData) {
  await requireAdmin();
  const data = z.object({
    id: z.coerce.number().int(),
    priceTnd: z.coerce.number().min(0).max(100000),
    durationMinutes: z.coerce.number().int().min(15).max(1440),
    active: z.boolean(),
  }).parse({
    id: form.get("id"), priceTnd: form.get("priceTnd"),
    durationMinutes: form.get("durationMinutes"), active: form.get("active") === "on",
  });
  await getDb().update(services).set({
    priceTnd: data.priceTnd.toFixed(2), durationMinutes: data.durationMinutes, active: data.active,
  }).where(eq(services.id, data.id));
  revalidatePath("/admin", "layout");
  revalidatePath("/services");
  revalidatePath("/booking");
  revalidatePath("/");
}

/* ───────────── Activities ───────────── */

const activityFields = z.object({
  title: z.string().trim().min(2).max(80),
  description: z.string().trim().min(5).max(400),
  icon: z.enum(ACTIVITY_ICONS),
});

function refreshActivities() {
  revalidatePath("/admin/activities");
  revalidatePath("/activities");
  revalidatePath("/");
}

const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "activity";

export async function saveActivity(form: FormData) {
  await requireAdmin();
  const id = z.coerce.number().int().parse(form.get("id"));
  const f = activityFields.parse({ title: form.get("title"), description: form.get("description"), icon: form.get("icon") });
  const sortOrder = z.coerce.number().int().min(0).max(999).parse(form.get("sortOrder") ?? 0);
  await getDb().update(activities).set({ ...f, sortOrder, active: form.get("active") === "on" }).where(eq(activities.id, id));
  refreshActivities();
}

export async function createActivity(form: FormData) {
  await requireAdmin();
  const f = activityFields.parse({ title: form.get("title"), description: form.get("description"), icon: form.get("icon") });
  const slug = `${slugify(f.title)}-${Math.random().toString(36).slice(2, 6)}`;
  await getDb().insert(activities).values({ ...f, slug, sortOrder: 100 });
  refreshActivities();
}

export async function deleteActivity(form: FormData) {
  await requireAdmin();
  await getDb().delete(activities).where(eq(activities.id, z.coerce.number().int().parse(form.get("id"))));
  refreshActivities();
}
