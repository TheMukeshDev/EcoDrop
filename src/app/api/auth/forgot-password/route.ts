import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { sendEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(request: Request) {
    try {
        await dbConnect()
        const body = await request.json()
        const { email } = body

        if (!email) {
            return NextResponse.json(
                { success: false, error: "Email is required" },
                { status: 400 }
            )
        }

        // Find user by email
        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json(
                { success: false, error: "Email not found" },
                { status: 404 }
            )
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        // Set OTP to expire in 5 minutes
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

        // Update user with OTP
        user.resetPasswordOTP = otp
        user.resetPasswordOTPExpiresAt = expiresAt
        await user.save()

        // Send OTP via email
        try {
            await sendEmail({
                to: email,
                subject: "EcoDrop - Password Reset OTP",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #16a34a;">Password Reset Request</h2>
                        <p>Hello ${user.name},</p>
                        <p>You requested to reset your password. Here is your OTP:</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <p style="font-size: 36px; font-weight: bold; letter-spacing: 5px; color: #16a34a;">${otp}</p>
                        </div>
                        
                        <p style="color: #666;">This OTP is valid for <strong>5 minutes</strong> only.</p>
                        <p style="color: #666;">If you didn't request this, please ignore this email.</p>
                        
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
                        <p style="color: #999; font-size: 12px;">© 2024 EcoDrop. All rights reserved.</p>
                    </div>
                `
            })
        } catch (emailError: any) {
            console.error("Email sending failed:", emailError)
            // Continue even if email fails - OTP is still set
        }

        return NextResponse.json({ success: true, message: "OTP sent to your email" })

    } catch (error: any) {
        console.error("Forgot password error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Failed to process request" },
            { status: 500 }
        )
    }
}
