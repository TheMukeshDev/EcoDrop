
import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import Reward from "@/models/Reward"

export async function POST(request: Request) {
    try {
        await dbConnect()
        const { userId, rewardId } = await request.json()

        if (!userId || !rewardId) {
            return NextResponse.json({ success: false, error: "Missing userId or rewardId" }, { status: 400 })
        }

        const user = await User.findById(userId)
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
        }

        const reward = await Reward.findById(rewardId)
        if (!reward) {
            return NextResponse.json({ success: false, error: "Reward not found" }, { status: 404 })
        }

        if (user.points < reward.pointsRequired) {
            return NextResponse.json({ success: false, error: "Insufficient points" }, { status: 400 })
        }

        // Deduct points
        user.points -= reward.pointsRequired
        await user.save()

        // In a real app, we would create a Redemption record/Transaction here.
        // For now, just deducting points is sufficient for the demo.

        return NextResponse.json({ success: true, data: { points: user.points, reward: reward.title } })
    } catch (error) {
        console.error("Failed to redeem reward:", error)
        return NextResponse.json({ success: false, error: "Failed to redeem reward" }, { status: 500 })
    }
}
