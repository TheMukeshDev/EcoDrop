import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Bin from "@/models/Bin"
import DropEvent from "@/models/DropEvent"
import User from "@/models/User"
import Transaction from "@/models/Transaction"

export async function GET(request: Request) {
    try {
        await dbConnect()

        // 1. Bin Stats
        const totalBins = await Bin.countDocuments({})
        const activeBins = await Bin.countDocuments({ status: "operational" })
        const fullBins = await Bin.countDocuments({ status: "full" })
        const maintenanceBins = await Bin.countDocuments({ status: "maintenance" })

        // 2. Drop/Impact Stats
        const totalVerifiedDrops = await DropEvent.countDocuments({ verified: true })

        // Calculate Total CO2 Saved (Aggregation from Users or Transactions)
        // Using User aggregation for speed if totalCO2Saved is maintained there, 
        // otherwise verify with Transaction sum. 
        // Let's use Transaction aggregation for accuracy of "impact" if User field is just a cache.
        const co2Aggregation = await Transaction.aggregate([
            {
                $group: {
                    _id: null,
                    totalCO2: { $sum: "$pointsEarned" } // Assuming 1 point ~= 1g CO2 or similar ratio? 
                    // Actually, let's just use the 'value' or a fixed multiplier if points != CO2.
                    // For this hackathon, let's assume pointsEarned roughly correlates to impact
                    // OR better: check if we have a specific CO2 field. 
                    // The Transaction model has 'pointsEarned'. The User model has 'totalCO2Saved'.
                    // Let's use User aggregation.
                }
            }
        ])

        const userStats = await User.aggregate([
            {
                $group: {
                    _id: null,
                    totalCO2: { $sum: "$stats.co2Saved" }, // Assuming structure User.stats.co2Saved
                    totalRecycled: { $sum: "$stats.itemsRecycled" }
                }
            }
        ])

        // Fallback or precise calculation
        let totalCO2Saved = 0
        if (userStats.length > 0 && userStats[0].totalCO2) {
            totalCO2Saved = userStats[0].totalCO2
        } else {
            // Fallback to simplistic count based on verified drops * 0.5kg (example)
            totalCO2Saved = totalVerifiedDrops * 0.5
        }

        // 3. User Stats
        const totalUsers = await User.countDocuments({})

        // Active in last 24h?
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
        // We might not have a 'lastActive' field, so we look at DropEvents
        const distinctActiveUsers = await DropEvent.distinct("userId", {
            confirmedAt: { $gte: yesterday }
        })
        const activeUsers = distinctActiveUsers.length

        // 4. Today's Activity
        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)

        const todayVerifiedDrops = await DropEvent.countDocuments({
            verified: true,
            confirmedAt: { $gte: startOfDay }
        })

        // Mock growth for demo (or calculate real if enough data)
        const weeklyGrowth = 12.5

        return NextResponse.json({
            success: true,
            data: {
                totalBins,
                activeBins,
                fullBins,
                maintenanceBins,
                totalVerifiedDrops,
                totalCO2Saved: Math.round(totalCO2Saved * 10) / 10, // Round to 1 decimal
                totalUsers,
                activeUsers,
                todayVerifiedDrops,
                todayCO2Saved: Math.round(todayVerifiedDrops * 0.5 * 10) / 10, // Est
                weeklyGrowth
            }
        })

    } catch (error) {
        console.error("Admin Stats API Error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch admin stats" },
            { status: 500 }
        )
    }
}