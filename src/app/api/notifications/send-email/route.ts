
import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"

export async function POST(request: Request) {
    try {
        const { email, type } = await request.json()

        if (!email) {
            return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
        }

        let subject = "EcoDrop Notification"
        let html = "<p>Notification from EcoDrop.</p>"

        if (type === "test") {
            subject = "Test Email from EcoDrop 🌿"
            html = `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #16a34a;">EcoDrop</h1>
                    </div>
                    <h2>Hello! 👋</h2>
                    <p>This is a test notification to confirm that your email updates are turned <strong>ON</strong>.</p>
                    <p>You're all set to receive:</p>
                    <ul>
                        <li>Weekly Impact Reports</li>
                        <li>Reward Unlock Alerts</li>
                        <li>Pickup Confirmations</li>
                    </ul>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #888;">Keep recycling and saving the planet!</p>
                </div>
            `
        }

        await sendEmail({ to: email, subject, html })

        return NextResponse.json({ success: true, message: "Email sent successfully" })

    } catch (error: any) {
        console.error("Email API Error:", error)
        return NextResponse.json({
            success: false,
            error: "Failed to send email. Ensure SMTP credentials are set in .env"
        }, { status: 500 })
    }
}
