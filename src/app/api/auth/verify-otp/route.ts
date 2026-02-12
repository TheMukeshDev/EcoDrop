import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(request: Request) {
    try {
        await dbConnect()
        const body = await request.json()
        const { email, otp } = body

        if (!email || !otp) {
            return NextResponse.json(
                { success: false, error: "Email and OTP are required" },
                { status: 400 }
            )
        }

        if (otp.length !== 6) {
            return NextResponse.json(
                { success: false, error: "OTP must be 6 digits" },
                { status: 400 }
            )
        }

        // Find user and select OTP fields
        const user = await User.findOne({ email }).select("+resetPasswordOTP +resetPasswordOTPExpiresAt")

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            )
        }

        if (!user.resetPasswordOTP) {
            return NextResponse.json(
                { success: false, error: "No OTP requested for this email" },
                { status: 400 }
            )
        }

        // Check if OTP has expired
        if (new Date() > user.resetPasswordOTPExpiresAt!) {
            // Clear expired OTP
            user.resetPasswordOTP = undefined
            user.resetPasswordOTPExpiresAt = undefined
            await user.save()

            return NextResponse.json(
                { success: false, error: "OTP has expired" },
                { status: 400 }
            )
        }

        // Verify OTP
        if (user.resetPasswordOTP !== otp) {
            return NextResponse.json(
                { success: false, error: "Invalid OTP" },
                { status: 400 }
            )
        }

        return NextResponse.json({ success: true, message: "OTP verified successfully" })

    } catch (error: any) {
        console.error("OTP verification error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Verification failed" },
            { status: 500 }
        )
    }
}
