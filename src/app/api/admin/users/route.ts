import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import AdminAuditLog from "@/models/AdminAuditLog"

/**
 * GET /api/admin/users
 * 
 * Fetch user list with pagination and filtering
 */
export async function GET(request: NextRequest) {
    try {
        const adminId = request.headers.get("x-admin-id")
        if (!adminId) {
            return NextResponse.json(
                { success: false, error: "Admin authentication required" },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "20")
        const search = searchParams.get("search") as string || null
        const role = searchParams.get("role") as string || null
        const active = searchParams.get("active") as string

        await dbConnect()

        // Build query
        const query: any = {}
        if (role) query.role = role
        if (active !== null) {
            query.isActive = active === "true"
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ]
        }

        // Execute queries
        const [users, totalCount] = await Promise.all([
            User.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .select("-password") // Don't include password in results
                .lean(),
            User.countDocuments(query)
        ])

        // Log admin action
        await AdminAuditLog.create({
            adminId,
            action: "VIEW_USERS",
            resource: "user_list",
            details: { 
                page, 
                limit, 
                filters: { search, role, active }, 
                totalFetched: users.length 
            },
            ipAddress: request.headers.get("x-forwarded-for") || "unknown",
            userAgent: request.headers.get("user-agent") || "unknown",
            success: true
        })

        return NextResponse.json({
            success: true,
            data: {
                users: users.map(user => ({
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    points: user.points,
                    totalItemsRecycled: user.totalItemsRecycled,
                    totalCO2Saved: user.totalCO2Saved,
                    joinDate: user.createdAt,
                    lastActiveDate: user.updatedAt,
                    role: user.role || "user",
                    isActive: user.updatedAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    suspiciousFlags: user.suspiciousFlags || []
                })),
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalCount / limit),
                    totalUsers: totalCount,
                    hasNext: page * limit < totalCount,
                    hasPrev: page > 1
                }
            }
        })

    } catch (error) {
        console.error("Admin users error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch users" },
            { status: 500 }
        )
    }
}

/**
 * POST /api/admin/users
 * 
 * Update user role or suspicious flags
 */
export async function POST(request: NextRequest) {
    try {
        const adminId = request.headers.get("x-admin-id")
        if (!adminId) {
            return NextResponse.json(
                { success: false, error: "Admin authentication required" },
                { status: 401 }
            )
        }

        const { id, role, suspiciousFlags } = await request.json()
        if (!id) {
            return NextResponse.json(
                { success: false, error: "User ID is required" },
                { status: 400 }
            )
        }

        await dbConnect()

        // Build update object
        const updateData: any = {}
        if (role) updateData.role = role
        if (suspiciousFlags) updateData.suspiciousFlags = suspiciousFlags

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, timestamps: false }
        )

        // Log admin action
        await AdminAuditLog.create({
            adminId,
            action: "UPDATE_USER",
            resource: "user",
            details: { userId: id, updates: updateData },
            ipAddress: request.headers.get("x-forwarded-for") || "unknown",
            userAgent: request.headers.get("user-agent") || "unknown",
            success: true
        })

        return NextResponse.json({
            success: true,
            message: "User updated successfully",
            data: updatedUser
        })

    } catch (error) {
        console.error("Admin users error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to update user" },
            { status: 500 }
        )
    }
}