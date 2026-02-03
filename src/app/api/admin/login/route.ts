import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"
import { signAdminToken } from "@/lib/auth-admin"

export async function POST(request: Request) {
    try {
        await dbConnect()
        const { email, password } = await request.json()

        // ---------------------------------------------------------
        // SELF-HEALING SEED: Ensure at least one admin exists
        // ---------------------------------------------------------
        const adminCount = await User.countDocuments({ role: "admin" })
        if (adminCount === 0) {
            console.log("No admins found. Seeding default admin...")
            const hashedPassword = await bcrypt.hash("admin123", 10)
            await User.create({
                name: "Super Admin",
                username: "admin",
                email: "admin@ecodrop.com",
                password: hashedPassword,
                role: "admin",
                points: 9999,
                isActive: true
            })
        }
        // ---------------------------------------------------------

        // 1. Find User
        // explicit select('+password') because password is { select: false } in schema
        const user = await User.findOne({ email }).select("+password")

        if (!user || user.role !== "admin") {
            return NextResponse.json(
                { success: false, error: "Invalid credentials or unauthorized" },
                { status: 401 }
            )
        }

        // 2. Verify Password
        const isMatch = await bcrypt.compare(password, user.password!)
        if (!isMatch) {
            return NextResponse.json(
                { success: false, error: "Invalid credentials" },
                { status: 401 }
            )
        }

        // 3. Generate Token
        const token = await signAdminToken({
            id: user._id,
            email: user.email,
            role: "admin"
        })

        // 4. Set Cookie
        const response = NextResponse.json({ success: true, message: "Login successful" })
        response.cookies.set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 // 1 day
        })

        return response

    } catch (error) {
        console.error("Admin Login Error:", error)
        return NextResponse.json(
            { success: false, error: "Server error" },
            { status: 500 }
        )
    }
}
