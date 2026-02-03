
import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Notification, { INotification } from "@/models/Notification"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const FALLBACK_NOTIFICATIONS = [
    { title: "Battery Safety", message: "Tape battery terminals before disposal to prevent fires! 🔋", category: "action" },
    { title: "Did You Know?", message: "90% of a smartphone's materials can be recovered and reused. 📱", category: "awareness" },
    { title: "Local Impact", message: "Your city recycled 5 tons of e-waste last month! 🌱", category: "local" },
    { title: "Gamification", message: "You act, we track! Earn points for every item recycled. 🏅", category: "gamification" }
]

export async function GET() {
    try {
        await dbConnect()

        // 1. Check for existing notification for today
        const todayStr = new Date().toISOString().split('T')[0] // "YYYY-MM-DD"

        // Find notification for TODAY
        let notification = await Notification.findOne({ dateId: todayStr })

        if (notification) {
            return NextResponse.json({ success: true, data: notification })
        }

        // 2. If not found, GENERATE one
        let newContent = { ...FALLBACK_NOTIFICATIONS[Math.floor(Math.random() * FALLBACK_NOTIFICATIONS.length)] }

        try {
            if (process.env.GEMINI_API_KEY) {
                const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }) // Optimized for speed
                const prompt = `Generate a single short, engaging, and educational notification about e-waste recycling for a smart city app.
                Categories: Awareness (facts), Action (tips), Local (community), Gamification (points).
                Output JSON ONLY: { "title": "string", "message": "string (max 120 chars)", "category": "awareness"|"action"|"local"|"gamification" }
                Make it catchy and use emojis.`

                const result = await model.generateContent(prompt)
                const text = result.response.text()
                // Simple cleanup to ensure JSON
                const jsonText = text.replace(/```json/g, "").replace(/```/g, "").trim()
                const aiContent = JSON.parse(jsonText)

                if (aiContent.title && aiContent.message && aiContent.category) {
                    newContent = aiContent
                }
            }
        } catch (aiError) {
            console.error("AI Generation failed, using fallback", aiError)
        }

        // 3. Save to DB
        notification = await Notification.create({
            dateId: todayStr,
            title: newContent.title,
            message: newContent.message,
            category: newContent.category,
            createdAt: new Date()
        })

        return NextResponse.json({ success: true, data: notification })

    } catch (error) {
        console.error("Daily Notification Error", error)
        return NextResponse.json({ success: false, error: "Failed to fetch notification" }, { status: 500 })
    }
}
