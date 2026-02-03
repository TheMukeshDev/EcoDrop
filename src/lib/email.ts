
import nodemailer from "nodemailer"

// Configure your SMTP credentials here
// For Gmail: Use 'service: "gmail"' and an App Password
// For production: Use SES, SendGrid, etc.
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER || "ecodrop.demo@gmail.com", // Replace or set in .env
        pass: process.env.EMAIL_PASS || "your-app-password"       // Replace or set in .env
    }
})

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
    if (!process.env.EMAIL_USER && !process.env.EMAIL_PASS) {
        console.warn("⚠️ Email credentials not found in env. Email simulation mode.");
        // Check if we are in a dev environment where we might just want to log
        if (process.env.NODE_ENV !== 'production') {
            return { messageId: "simulated-id" };
        }
    }

    try {
        const info = await transporter.sendMail({
            from: '"EcoDrop" <no-reply@ecodrop.com>',
            to,
            subject,
            html,
        })
        return info
    } catch (error) {
        console.error("Error sending email:", error)
        throw error
    }
}
