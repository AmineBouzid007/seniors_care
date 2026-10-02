import "server-only";
import { and, asc, desc, eq, ilike, or, sql, count } from "drizzle-orm";
import { getDb } from "./db";
import { bookings, clients, contactMessages, services, type BookingStatus } from "./schema";
import { DEFAULT_SERVICES, type ServiceInfo } from "./constants";

/* ───────────── Public ───────────── */

/** Active services. Falls back to built-in defaults if the DB is missing/unreachable. */
export async function getServices(): Promise<ServiceInfo[]> {
  try {
    const rows = await getDb().select().from(services)
      .where(eq(services.active, true)).orderBy(asc(services.sortOrder), asc(services.id));
    if (!rows.length) return DEFAULT_SERVICES;
    return rows.map((r) => ({
      id: r.id, slug: r.slug, name: r.name, description: r.description,
      priceTnd: Number(r.priceTnd), durationMinutes: r.durationMinutes,
    }));
  } catch (e) {
    console.error("[getServices] falling back to defaults:", e instanceof Error ? e.message : e);
    return DEFAULT_SERVICES;
  }
}

/* ───────────── Admin: dashboard ───────────── */

export async function getDashboard() {
  const db = getDb();
  const [byStatus, [clientCount], [msgCount], recent, upcoming] = await Promise.all([
    db.select({ status: bookings.status, n: sql<number>`count(*)::int`, total: sql<string>`coalesce(sum(${bookings.priceTnd}),0)` })
      .from(bookings).groupBy(bookings.status),
    db.select({ n: count() }).from(clients),
    db.select({ n: count() }).from(contactMessages).where(eq(contactMessages.handled, false)),
    db.select({
      id: bookings.id, reference: bookings.reference, status: bookings.status, date: bookings.bookingDate,
      time: bookings.bookingTime, client: clients.fullName, service: services.name, governorate: bookings.governorate,
    }).from(bookings).innerJoin(clients, eq(bookings.clientId, clients.id)).innerJoin(services, eq(bookings.serviceId, services.id))
      .orderBy(desc(bookings.createdAt)).limit(6),
    db.select({ n: count() }).from(bookings)
      .where(and(eq(bookings.status, "confirmed"), sql`${bookings.bookingDate} >= current_date`)),
  ]);

  const stat = (s: BookingStatus) => byStatus.find((b) => b.status === s);
  return {
    totalBookings: byStatus.reduce((a, b) => a + b.n, 0),
    pending: stat("pending")?.n ?? 0,
    confirmed: stat("confirmed")?.n ?? 0,
    completed: stat("completed")?.n ?? 0,
    cancelled: stat("cancelled")?.n ?? 0,
    revenueCompleted: Number(stat("completed")?.total ?? 0),
    pipeline: Number(stat("pending")?.total ?? 0) + Number(stat("confirmed")?.total ?? 0),
    clients: clientCount.n,
    unreadMessages: msgCount.n,
    upcomingConfirmed: upcoming[0].n,
    recent,
  };
}

/* ───────────── Admin: bookings ───────────── */

export const PAGE_SIZE = 25;

export async function listBookings(opts: { status?: string; q?: string; page?: number }) {
  const db = getDb();
  const filters = [];
  if (opts.status && ["pending", "confirmed", "completed", "cancelled"].includes(opts.status)) {
    filters.push(eq(bookings.status, opts.status as BookingStatus));
  }
  if (opts.q) {
    const like = `%${opts.q.replace(/[%_]/g, "")}%`;
    filters.push(or(ilike(bookings.reference, like), ilike(clients.fullName, like), ilike(bookings.contactPhone, like), ilike(clients.cin, like)));
  }
  const where = filters.length ? and(...filters) : undefined;
  const page = Math.max(1, opts.page ?? 1);

  const [rows, [total]] = await Promise.all([
    db.select({
      id: bookings.id, reference: bookings.reference, status: bookings.status, date: bookings.bookingDate,
      time: bookings.bookingTime, price: bookings.priceTnd, notes: bookings.notes, governorate: bookings.governorate,
      address: bookings.address, phone: bookings.contactPhone, email: bookings.contactEmail,
      client: clients.fullName, cin: clients.cin, service: services.name,
    }).from(bookings).innerJoin(clients, eq(bookings.clientId, clients.id)).innerJoin(services, eq(bookings.serviceId, services.id))
      .where(where).orderBy(desc(bookings.createdAt)).limit(PAGE_SIZE).offset((page - 1) * PAGE_SIZE),
    db.select({ n: count() }).from(bookings).innerJoin(clients, eq(bookings.clientId, clients.id)).where(where),
  ]);
  return { rows, total: total.n, page, pages: Math.max(1, Math.ceil(total.n / PAGE_SIZE)) };
}

export async function exportBookings() {
  return getDb().select({
    reference: bookings.reference, status: bookings.status, date: bookings.bookingDate, time: bookings.bookingTime,
    service: services.name, price: bookings.priceTnd, client: clients.fullName, cin: clients.cin,
    phone: bookings.contactPhone, email: bookings.contactEmail, governorate: bookings.governorate,
    address: bookings.address, notes: bookings.notes, created: bookings.createdAt,
  }).from(bookings).innerJoin(clients, eq(bookings.clientId, clients.id)).innerJoin(services, eq(bookings.serviceId, services.id))
    .orderBy(desc(bookings.createdAt));
}

/* ───────────── Admin: clients, messages, services ───────────── */

export async function listClients(q?: string) {
  const like = q ? `%${q.replace(/[%_]/g, "")}%` : null;
  return getDb().select({
    id: clients.id, name: clients.fullName, cin: clients.cin, email: clients.email, phone: clients.phone,
    governorate: clients.governorate, createdAt: clients.createdAt,
    bookings: sql<number>`count(${bookings.id})::int`,
    spent: sql<string>`coalesce(sum(${bookings.priceTnd}) filter (where ${bookings.status} = 'completed'),0)`,
  }).from(clients).leftJoin(bookings, eq(bookings.clientId, clients.id))
    .where(like ? or(ilike(clients.fullName, like), ilike(clients.cin, like), ilike(clients.phone, like), ilike(clients.email, like)) : undefined)
    .groupBy(clients.id).orderBy(desc(clients.createdAt)).limit(200);
}

export async function listMessages() {
  return getDb().select().from(contactMessages).orderBy(asc(contactMessages.handled), desc(contactMessages.createdAt)).limit(200);
}

export async function listAllServices() {
  return getDb().select().from(services).orderBy(asc(services.sortOrder), asc(services.id));
}

/* ───────────── Admin: financial reports ───────────── */

export async function getReports() {
  const db = getDb();
  const month = sql<string>`to_char(${bookings.bookingDate}, 'YYYY-MM')`;
  const revenue = sql<string>`coalesce(sum(${bookings.priceTnd}),0)`;
  const done = eq(bookings.status, "completed");

  const [byMonth, byService, byGovernorate, [totals]] = await Promise.all([
    db.select({ label: month, revenue, n: sql<number>`count(*)::int` }).from(bookings).where(done)
      .groupBy(month).orderBy(desc(month)).limit(12),
    db.select({ label: services.name, revenue, n: sql<number>`count(*)::int` }).from(bookings)
      .innerJoin(services, eq(bookings.serviceId, services.id)).where(done).groupBy(services.name).orderBy(desc(revenue)),
    db.select({ label: bookings.governorate, revenue, n: sql<number>`count(*)::int` }).from(bookings)
      .where(done).groupBy(bookings.governorate).orderBy(desc(revenue)).limit(10),
    db.select({ revenue, n: sql<number>`count(*)::int` }).from(bookings).where(done),
  ]);

  const norm = (r: { label: string; revenue: string; n: number }[]) =>
    r.map((x) => ({ label: x.label, revenue: Number(x.revenue), n: x.n }));
  return {
    byMonth: norm(byMonth).reverse(),
    byService: norm(byService),
    byGovernorate: norm(byGovernorate),
    totalRevenue: Number(totals.revenue),
    completedCount: totals.n,
    average: totals.n ? Number(totals.revenue) / totals.n : 0,
  };
}
