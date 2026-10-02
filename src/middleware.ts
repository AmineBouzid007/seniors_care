import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

// First line of defence for /admin/*. Every admin page/action ALSO calls requireAdmin().
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  let session = null;
  try {
    session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  } catch {
    // AUTH_SECRET missing → treat as signed out
  }
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
