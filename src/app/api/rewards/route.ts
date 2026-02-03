
import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Reward from "@/models/Reward"

export async function GET() {
    try {
        await dbConnect()
        const rewards = await Reward.find({ available: true }).sort({ pointsRequired: 1 })
        return NextResponse.json({ success: true, data: rewards })
    } catch (error) {
        console.error("Failed to fetch rewards:", error)
        return NextResponse.json({ success: false, error: "Failed to fetch rewards" }, { status: 500 })
    }
}
