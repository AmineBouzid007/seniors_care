import {
  pgTable, pgEnum, serial, text, integer, boolean, numeric, date, time,
  timestamp, uuid, index,
} from "drizzle-orm/pg-core";

export const bookingStatus = pgEnum("booking_status", [
  "pending", "confirmed", "completed", "cancelled",
]);

/** Care services offered. Prices are in Tunisian dinars (TND). */
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  priceTnd: numeric("price_tnd", { precision: 10, scale: 2 }).notNull().default("0"),
  durationMinutes: integer("duration_minutes").notNull().default(60),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

/** People who book. Recognised by phone number (phone_key = digits only, without +216). No national ID is stored. */
export const clients = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  phoneKey: text("phone_key").notNull().unique(),
  governorate: text("governorate").notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * One row per booking request.
 * Contact details + price are stored as a snapshot so history stays correct
 * even if the client profile or service price changes later.
 */
export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reference: text("reference").notNull().unique(), // e.g. SC-7K2M9Q
    clientId: uuid("client_id").notNull().references(() => clients.id, { onDelete: "restrict" }),
    serviceId: integer("service_id").notNull().references(() => services.id, { onDelete: "restrict" }),
    priceTnd: numeric("price_tnd", { precision: 10, scale: 2 }).notNull(),
    bookingDate: date("booking_date").notNull(),
    bookingTime: time("booking_time").notNull(),
    status: bookingStatus("status").notNull().default("pending"),
    notes: text("notes"),
    governorate: text("governorate").notNull(),
    address: text("address").notNull(),
    contactPhone: text("contact_phone").notNull(),
    contactEmail: text("contact_email").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("bookings_status_idx").on(t.status),
    index("bookings_date_idx").on(t.bookingDate),
    index("bookings_client_idx").on(t.clientId),
  ],
);

/** Wellbeing / social activities shown on the website (managed in /admin/activities). */
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull().default("heart"), // key from ACTIVITY_ICONS in constants.ts
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

/** Messages sent from the Contact page. */
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  handled: boolean("handled").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Staff who can sign in to /admin. Passwords are bcrypt hashes. */
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull().default("Admin"),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type BookingStatus = (typeof bookingStatus.enumValues)[number];
export const BOOKING_STATUSES = bookingStatus.enumValues;
