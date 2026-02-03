
import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

const NEW_NAMES = [
    "Priya Verma",
    "Rahul Mishra",
    "Anjali Srivastava",
    "Amit Patel",
    "Sneha Gupta",
    "Vikram Singh",
    "Aarav Yadav",
    "Diya Sharma",
    "Rohan Kumar",
    "Ishita Singh"
]

export async function GET() {
    try {
        await dbConnect()

        const users = await User.find({}).sort({ points: -1 }).limit(NEW_NAMES.length)

        let updatedCount = 0

        for (let i = 0; i < users.length; i++) {
            const user = users[i]
            // Skip if it's the current main user "Mukesh Kumar"
            if (user.name.includes("Mukesh")) continue

            user.name = NEW_NAMES[i]
            user.username = NEW_NAMES[i].toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 100)
            await user.save()
            updatedCount++
        }

        return NextResponse.json({
            success: true,
            message: `Renamed ${updatedCount} users to random Indian names.`
        })

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
