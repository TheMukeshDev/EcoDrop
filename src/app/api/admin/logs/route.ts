import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import AdminAuditLog from "@/models/AdminAuditLog"
import { verifyAdminToken } from "@/lib/auth-admin"
import { cookies } from "next/headers"

export async function GET() {
    try {
        await dbConnect()
        const token = (await cookies()).get("admin_token")?.value
        if (!token || !(await verifyAdminToken(token))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        // Populate admin details if possible, or just raw
        const logs = await AdminAuditLog.find().sort({ createdAt: -1 }).limit(50)
        return NextResponse.json({ success: true, logs })
    } catch (e) {
        return NextResponse.json({ success: false, error: "Failed to fetch logs" }, { status: 500 })
    }
}
