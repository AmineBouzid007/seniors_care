/**
 * Creates the first admin + default services. Safe to re-run (idempotent).
 *   npm run db:seed
 * Needs DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD in .env.local
 */
import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import * as schema from "../src/lib/schema";
import { DEFAULT_ACTIVITIES, DEFAULT_SERVICES } from "../src/lib/constants";

config({ path: ".env.local" });
config();

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is missing");
  const db = drizzle(neon(url), { schema });

  for (const [i, s] of DEFAULT_SERVICES.entries()) {
    await db.insert(schema.services).values({
      slug: s.slug, name: s.name, description: s.description,
      priceTnd: s.priceTnd.toFixed(2), durationMinutes: s.durationMinutes, sortOrder: i,
    }).onConflictDoUpdate({ // refresh text but never overwrite prices you edited in /admin
      target: schema.services.slug,
      set: { name: s.name, description: s.description, sortOrder: i },
    });
  }
  console.log(`✔ ${DEFAULT_SERVICES.length} services ready`);

  // Activities: inserted once; later edits made in /admin/activities are never overwritten.
  for (const [i, a] of DEFAULT_ACTIVITIES.entries()) {
    await db.insert(schema.activities).values({ ...a, sortOrder: i }).onConflictDoNothing({ target: schema.activities.slug });
  }
  console.log(`✔ ${DEFAULT_ACTIVITIES.length} activities ready`);

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("• ADMIN_EMAIL / ADMIN_PASSWORD not set, skipping admin creation");
  } else if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters");
  } else {
    const passwordHash = await bcrypt.hash(password, 12);
    await db.insert(schema.adminUsers).values({ email, passwordHash, name: "Admin" })
      .onConflictDoUpdate({ target: schema.adminUsers.email, set: { passwordHash } });
    console.log(`✔ admin ready: ${email}`);
  }
  await db.execute(sql`select 1`);
}

main().catch((e) => { console.error("✖", e.message); process.exit(1); });
