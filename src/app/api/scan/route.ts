import { NextResponse } from "next/server";
import { detectWaste } from "@/lib/ai-service";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { image, userId } = body;

        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        const result = await detectWaste(image);

        // If scanning was successful and we have a valid result (not unknown error)
        if (result.confidence > 0 && userId) {
            // HACKATHON FIX: Give small points for scanning to encourage engagement
            // But don't update environmental stats - only for confirmed drops
            await User.findByIdAndUpdate(userId, {
                $inc: {
                    points: 10, // Small reward for scanning effort
                }
            });

            // Create Transaction Record (scan type, small points)
            await Transaction.create({
                userId,
                type: "scan",
                itemName: result.type,
                itemType: result.category,
                confidence: result.confidence,
                value: 2.0, // Small value for scan
                pointsEarned: 10
            });
        }

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error("Scan error:", error);
        return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
    }
}
