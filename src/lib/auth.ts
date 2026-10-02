import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SESSION_HOURS, signSession, verifySession } from "./session";

export async function startSession(user: { id: number; email: string; name: string }) {
  const token = await signSession({ sub: String(user.id), email: user.email, name: user.name });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSession() {
  return verifySession((await cookies()).get(SESSION_COOKIE)?.value);
}

/** Call at the top of every admin page, action and route. Middleware alone is not enough. */
export async function requireAdmin() {
  const s = await getSession();
  if (!s) redirect("/admin/login");
  return s;
}
