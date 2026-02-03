
import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Transaction from "@/models/Transaction"
import AdminAuditLog from "@/models/AdminAuditLog"

/**
 * GET /api/admin/transactions
 * Fetch transactions with pagination and filtering
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "20")
        const status = searchParams.get("status")
        const type = searchParams.get("type")
        const userId = searchParams.get("userId")

        await dbConnect()

        const query: any = {}
        if (status && status !== 'all') query.status = status
        if (type && type !== 'all') query.type = type
        if (userId) query.userId = userId

        const [transactions, total] = await Promise.all([
            Transaction.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate("userId", "name email")
                .populate("binId", "name address")
                .lean(),
            Transaction.countDocuments(query)
        ])

        return NextResponse.json({
            success: true,
            data: {
                transactions,
                pagination: {
                    total,
                    page,
                    pages: Math.ceil(total / limit)
                }
            }
        })
    } catch (error) {
        console.error("Admin Transactions API Error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch transactions" },
            { status: 500 }
        )
    }
}

/**
 * PATCH /api/admin/transactions
 * Update transaction status
 */
export async function PATCH(request: NextRequest) {
    try {
        const adminId = request.headers.get("x-admin-id")
        const body = await request.json()
        const { transactionIds, status } = body

        if (!Array.isArray(transactionIds) || !status) {
            return NextResponse.json(
                { success: false, error: "Invalid request body" },
                { status: 400 }
            )
        }

        await dbConnect()

        // Update transactions
        const result = await Transaction.updateMany(
            { _id: { $in: transactionIds } },
            {
                $set: {
                    status,
                    verifiedAt: status === 'approved' ? new Date() : undefined
                }
            }
        )

        // Log audit (if AdminAuditLog exists)
        if (adminId) {
            try {
                await AdminAuditLog.create({
                    adminId,
                    action: "UPDATE_TRANSACTION_STATUS",
                    resource: "transaction",
                    details: { transactionIds, status, count: result.modifiedCount },
                    success: true
                })
            } catch (e) {
                console.warn("Failed to create audit log", e)
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                modifiedCount: result.modifiedCount
            }
        })

    } catch (error) {
        console.error("UPDATE Transaction Error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to update transactions" },
            { status: 500 }
        )
    }
}
