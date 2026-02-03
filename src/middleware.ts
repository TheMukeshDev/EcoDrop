import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyAdminToken } from "@/lib/auth-admin"

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Only protect /admin routes
    if (pathname.startsWith("/admin")) {
        // Allow public access to login
        if (pathname === "/admin/login") {
            const token = request.cookies.get("admin_token")?.value
            // If already logged in, redirect to dashboard
            if (token && (await verifyAdminToken(token))) {
                return NextResponse.redirect(new URL("/admin/dashboard", request.url))
            }
            return NextResponse.next()
        }

        // Protect other admin routes
        const token = request.cookies.get("admin_token")?.value

        if (!token) {
            return NextResponse.redirect(new URL("/admin/login", request.url))
        }

        const payload = await verifyAdminToken(token)
        if (!payload || payload.role !== "admin") {
            // Invalid token or not an admin
            return NextResponse.redirect(new URL("/admin/login", request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/:path*"],
}
