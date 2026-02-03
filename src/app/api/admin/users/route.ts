import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { verifyAdminToken } from "@/lib/auth-admin"
import { cookies } from "next/headers"

// GET Users
export async function GET() {
    try {
        await dbConnect()
        // Auth Check
        const token = (await cookies()).get("admin_token")?.value
        if (!token || !(await verifyAdminToken(token))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const users = await User.find({ role: "user" }).sort({ createdAt: -1 })
        return NextResponse.json({ success: true, users })
    } catch (e) {
        return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 })
    }
}

// Block/Unblock
export async function PUT(req: Request) {
    try {
        await dbConnect()
        // Auth Check
        const token = (await cookies()).get("admin_token")?.value
        if (!token || !(await verifyAdminToken(token))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { userId, isActive } = await req.json()
        await User.findByIdAndUpdate(userId, { isActive })

        return NextResponse.json({ success: true, message: `User ${isActive ? "unblocked" : "blocked"}` })
    } catch (e) {
        return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 })
    }
}