
import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

export async function GET(request: Request) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
        }

        const user = await User.findById(id)

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            data: user
        })

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
