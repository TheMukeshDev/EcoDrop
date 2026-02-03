import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Transaction from "@/models/Transaction"
import { ScanLog } from "@/models/ScanLog"
import User from "@/models/User"
import Bin from "@/models/Bin"

export async function GET(request: Request) {
    try {
        await dbConnect()

        // Explicitly ensuring model usage
        const _ = Bin;

        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        const limit = parseInt(searchParams.get("limit") || "20")

        if (!userId) {
            return NextResponse.json({ success: true, data: [] })
        }

        // 1. Fetch Transactions (Recycles, Sells)
        const transactionsPromise = Transaction.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate("binId", "name")
            .lean()

        // 2. Fetch Scan Logs (Scans)
        // ScanLog might not have userId if I didn't save it in ScanPage... 
        // Wait, I didn't save userId in ScanPage's API call! 
        // I need to fix ScanPage API to save userId first, otherwise I can't query by userId.
        // But assuming I fix that, here is the merge logic.
        // For now, I will query ScanLogs where userId exists.
        const scansPromise = ScanLog.find({ userId })
            .sort({ detectedAt: -1 })
            .limit(limit)
            .lean()

        const [transactions, scans] = await Promise.all([transactionsPromise, scansPromise])

        // 3. Normalize and Merge
        const normalizedTransactions = transactions.map((t: any) => ({
            _id: t._id,
            type: t.type || 'recycle', // default
            itemType: t.itemName || 'Item',
            pointsEarned: t.amount || 0,
            status: t.status,
            createdAt: t.createdAt,
            binId: t.binId
        }))

        const normalizedScans = scans.map((s: any) => ({
            _id: s._id,
            type: 'scan',
            itemType: s.itemType,
            pointsEarned: 0,
            status: 'scanned',
            createdAt: s.detectedAt,
            confidence: s.confidence
        }))

        // Combine and sort by date
        const combined = [...normalizedTransactions, ...normalizedScans]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, limit)

        return NextResponse.json({ success: true, data: combined })

    } catch (error) {
        console.error("Error fetching activity:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch activity" },
            { status: 500 }
        )
    }
}
