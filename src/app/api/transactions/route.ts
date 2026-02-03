import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Transaction from "@/models/Transaction"
import User from "@/models/User"
import Bin from "@/models/Bin" // Ensure Bin model is registered

export async function GET(request: Request) {
    try {
        await dbConnect()

        // Explicitly ensuring model usage to prevent tree-shaking
        const _ = Bin;

        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")

        let query = {}
        if (userId) {
            query = { userId }
        } else {
            // Fallback to first user for demo if no ID (or return empty)
            const firstUser = await User.findOne({})
            if (firstUser) query = { userId: firstUser._id }
        }

        const limit = parseInt(searchParams.get("limit") || "10")

        // Fetch transactions
        const transactions = await Transaction.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate("binId", "name")
            .lean()

        return NextResponse.json({ success: true, data: transactions })
    } catch (error) {
        console.error("Error fetching transactions:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch transactions" },
            { status: 500 }
        )
    }
}
