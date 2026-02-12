import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { hashPassword } from "@/lib/auth-utils"

export async function POST(request: Request) {
    try {
        await dbConnect()
        const body = await request.json()
        const { email, otp, newPassword } = body

        if (!email || !otp || !newPassword) {
            return NextResponse.json(
                { success: false, error: "Email, OTP, and new password are required" },
                { status: 400 }
            )
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                { success: false, error: "Password must be at least 8 characters" },
                { status: 400 }
            )
        }

        // Find user and select OTP fields and password
        const user = await User.findOne({ email }).select("+resetPasswordOTP +resetPasswordOTPExpiresAt +password")

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

        // Hash new password
        const hashedPassword = await hashPassword(newPassword)

        // Update password and clear OTP
        user.password = hashedPassword
        user.resetPasswordOTP = undefined
        user.resetPasswordOTPExpiresAt = undefined
        await user.save()

        return NextResponse.json({ success: true, message: "Password reset successfully" })

    } catch (error: any) {
        console.error("Reset password error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Password reset failed" },
            { status: 500 }
        )
    }
}
