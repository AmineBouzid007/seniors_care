import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let _db: ReturnType<typeof create> | null = null;

function create() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set. See docs/DOCUMENTATION.md → Database.");
  return drizzle(neon(url), { schema });
}

/** Lazy singleton so the site can still build/render before a DB is attached. */
export function getDb() {
  if (!_db) _db = create();
  return _db;
}
