// Edge-safe session helpers (used by middleware AND server code).
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "sc_admin";
export const SESSION_HOURS = 8;

function key() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) throw new Error("AUTH_SECRET is missing or shorter than 16 characters.");
  return new TextEncoder().encode(s);
}

export type SessionPayload = { sub: string; email: string; name: string };

export async function signSession(p: SessionPayload) {
  return new SignJWT({ email: p.email, name: p.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(p.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(key());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    return { sub: String(payload.sub), email: String(payload.email), name: String(payload.name ?? "Admin") };
  } catch {
    return null;
  }
}
