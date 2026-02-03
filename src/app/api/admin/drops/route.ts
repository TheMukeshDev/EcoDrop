import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import DropEvent from "@/models/DropEvent"
import User from "@/models/User" // Ensure these are registered
import Bin from "@/models/Bin"

export async function GET(request: Request) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get("limit") || "20")
        const page = parseInt(searchParams.get("page") || "1")
        const status = searchParams.get("status") // 'verified' | 'flagged' | 'all'

        const skip = (page - 1) * limit

        let query: any = {}
        if (status === 'verified') {
            query.verified = true
        } else if (status === 'flagged') {
            query.verified = false
        }

        const [drops, total] = await Promise.all([
            DropEvent.find(query)
                .sort({ confirmedAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("userId", "name email")
                .populate("binId", "name address"),
            DropEvent.countDocuments(query)
        ])

        return NextResponse.json({
            success: true,
            data: drops,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        })

    } catch (error) {
        console.error("Admin Drops API Error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch drop logs" },
            { status: 500 }
        )
    }
}