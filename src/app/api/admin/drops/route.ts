import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Transaction from "@/models/Transaction"
import User from "@/models/User"
import AdminAuditLog from "@/models/AdminAuditLog"
import { verifyAdminToken } from "@/lib/auth-admin"
import { cookies } from "next/headers"

export async function GET() {
    try {
        await dbConnect()

        // Verify Admin (Double check in API)
        const token = (await cookies()).get("admin_token")?.value
        const admin = token ? await verifyAdminToken(token) : null

        if (!admin) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const drops = await Transaction.find({ type: "recycle" })
            .populate("userId", "name email")
            .populate("binId", "name address")
            .sort({ createdAt: -1 })
            .lean()

        return NextResponse.json({ success: true, drops })
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch drops" }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        await dbConnect()
        const { dropId, status, reasoning } = await req.json()

        // Verify Admin
        const token = (await cookies()).get("admin_token")?.value
        const admin: any = token ? await verifyAdminToken(token) : null

        if (!admin) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        const transaction = await Transaction.findById(dropId)
        if (!transaction) {
            return NextResponse.json({ success: false, error: "Drop not found" }, { status: 404 })
        }

        const oldStatus = transaction.status

        // Logic: If rejecting an already approved drop, deduct points
        if (oldStatus === "approved" && status === "rejected") {
            await User.findByIdAndUpdate(transaction.userId, {
                $inc: {
                    points: -transaction.pointsEarned,
                    totalItemsRecycled: -1
                },
                $push: {
                    suspiciousFlags: `Drop ${dropId} rejected by admin: ${reasoning || "Fraud detected"}`
                }
            })
        }

        // Update Transaction
        transaction.status = status
        await transaction.save()

        // Audit Log
        await AdminAuditLog.create({
            adminId: admin.id,
            action: "UPDATE_DROP_STATUS",
            resource: "transaction",
            details: { dropId, oldStatus, newStatus: status, reasoning },
            ipAddress: "127.0.0.1", // In Next.js getting real IP is tricky in Edge, this is placeholder/local
            userAgent: req.headers.get("user-agent") || "Unknown",
            success: true,
            severity: status === "rejected" ? "high" : "medium"
        })

        return NextResponse.json({ success: true, message: "Status updated" })

    } catch (error) {
        console.error("Update error:", error)
        return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 })
    }
}