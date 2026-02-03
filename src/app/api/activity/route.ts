import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    // Redirect to transactions API which now handles full activity
    const url = new URL("/api/transactions", request.url)
    if (userId) url.searchParams.set("userId", userId)

    return NextResponse.redirect(url)
}
