import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("id")

        let user
        if (userId) {
            user = await User.findById(userId).lean()
        } else {
            // Mock Authentication: Get the first user
            user = await User.findOne({}).lean()
        }

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, data: user })
    } catch (error) {
        console.error("Error fetching user:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch user" },
            { status: 500 }
        )
    }
}
