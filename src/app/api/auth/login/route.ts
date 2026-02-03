import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { comparePassword } from "@/lib/auth-utils"

export async function POST(request: Request) {
    try {
        await dbConnect()
        const body = await request.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: "Email and password are required" },
                { status: 400 }
            )
        }

        // Must explicitly select password since it's hidden by default
        const user = await User.findOne({ email }).select("+password")

        if (!user || !user.password) {
            return NextResponse.json(
                { success: false, error: "Invalid credentials" },
                { status: 401 }
            )
        }

        const isMatch = await comparePassword(password, user.password)

        if (!isMatch) {
            return NextResponse.json(
                { success: false, error: "Invalid credentials" },
                { status: 401 }
            )
        }

        // Return user data (excluding password)
        const userResponse = user.toObject()
        delete userResponse.password

        // In a real app, we'd set a JWT cookie here.
        // For this demo, we'll return the user object for client-side storage/context.

        return NextResponse.json({ success: true, data: userResponse })

    } catch (error: any) {
        console.error("Login error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Login failed" },
            { status: 500 }
        )
    }
}
