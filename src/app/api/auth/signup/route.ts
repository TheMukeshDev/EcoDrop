import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { hashPassword } from "@/lib/auth-utils"

export async function POST(request: Request) {
    try {
        await dbConnect()
        const body = await request.json()
        const { name, username, email, password } = body

        if (!name || !username || !email || !password) {
            return NextResponse.json(
                { success: false, error: "All fields are required" },
                { status: 400 }
            )
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] })
        if (existingUser) {
            const field = existingUser.email === email ? "Email" : "Username"
            return NextResponse.json(
                { success: false, error: `${field} already exists` },
                { status: 400 }
            )
        }

        const hashedPassword = await hashPassword(password)

        const newUser = await User.create({
            name,
            username,
            email,
            password: hashedPassword,
            points: 100, // Welcome bonus
            totalItemsRecycled: 0,
            totalCO2Saved: 0
        })

        // Exclude password from response
        const userResponse = newUser.toObject()
        delete userResponse.password

        return NextResponse.json({ success: true, data: userResponse })

    } catch (error: any) {
        console.error("Signup error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Signup failed" },
            { status: 500 }
        )
    }
}
