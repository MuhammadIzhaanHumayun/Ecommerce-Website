import { NextResponse } from "next/server";
import { decrypt } from "@/lib/jwt";

export async function proxy(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = req.cookies.get("session")?.value;
    const payload = await decrypt(token);

    // Redirect if no valid token OR user is not an admin
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
