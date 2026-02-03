import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import Transaction from "@/models/Transaction"
import { ScanLog } from "@/models/ScanLog"
import DropEvent from "@/models/DropEvent"

export async function GET() {
    try {
        await dbConnect()

        // 1. Total Users
        const totalUsers = await User.countDocuments({ role: "user" })

        // 2. Verified Drops (Approved Transactions)
        const verifiedDrops = await Transaction.countDocuments({ status: "approved" })

        // 3. Pending Drops
        const pendingDrops = await DropEvent.countDocuments({ status: "pending" })

        // 4. Suspicious Flags (Users with non-empty flags)
        const suspiciousUsers = await User.countDocuments({ suspiciousFlags: { $ne: [] } })

        // 5. Total Scan Attempts
        const totalScans = await ScanLog.countDocuments({})

        // 6. Impact
        // Aggregate CO2 saved
        const impact = await Transaction.aggregate([
            { $match: { status: "approved" } },
            { $group: { _id: null, totalCO2: { $sum: "$co2Saved" } } }
        ])
        const totalCO2 = impact[0]?.totalCO2 || 0

        return NextResponse.json({
            success: true,
            stats: {
                totalUsers,
                verifiedDrops,
                pendingDrops,
                suspiciousUsers,
                totalScans,
                totalCO2
            }
        })
    } catch (error) {
        return NextResponse.json({ success: false, error: "Stats error" }, { status: 500 })
    }
}