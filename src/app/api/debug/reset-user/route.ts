
import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import Transaction from "@/models/Transaction"
import DropEvent from "@/models/DropEvent"

export async function GET(request: Request) {
    try {
        await dbConnect()

        // Find user "Mukesh"
        const user = await User.findOne({ name: { $regex: "Mukesh", $options: "i" } })

        if (!user) {
            return NextResponse.json({ success: false, error: "User 'Mukesh' not found" }, { status: 404 })
        }

        // Reset stats
        user.points = 0
        user.totalItemsRecycled = 0
        user.totalCO2Saved = 0
        await user.save()

        // Delete transactions
        await Transaction.deleteMany({ userId: user._id })

        // Delete drop events (if any)
        if (DropEvent) {
            await DropEvent.deleteMany({ userId: user._id })
        }

        return NextResponse.json({
            success: true,
            message: `Successfully reset data for user: ${user.name} (${user.email})`,
            userId: user._id
        })

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
