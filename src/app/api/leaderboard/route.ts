
import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

export async function GET() {
    try {
        await dbConnect()
        // Fetch top 10 users by points, select only necessary fields
        const users = await User.find({})
            .sort({ points: -1 })
            .limit(10)
            .select("name username points totalItemsRecycled")

        return NextResponse.json({ success: true, data: users })
    } catch (error) {
        console.error("Failed to fetch leaderboard:", error)
        return NextResponse.json({ success: false, error: "Failed to fetch leaderboard" }, { status: 500 })
    }
}
