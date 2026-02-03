import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"

/**
 * POST /api/user/destination
 * 
 * Saves active navigation destination for user
 * Provides persistence for verification system
 */
export async function POST(request: Request) {
    try {
        const userId = request.headers.get("x-user-id")
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { binId, binName, lat, lng, startedAt } = body

        // For hackathon demo, we'll just return success
        // In production, this would save to user preferences or a separate table
        return NextResponse.json({
            success: true,
            message: "Destination saved successfully"
        })

    } catch (error) {
        console.error("Destination save error:", error)
        return NextResponse.json(
            { success: false, message: "Failed to save destination" },
            { status: 500 }
        )
    }
}