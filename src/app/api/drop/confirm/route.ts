import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Bin from "@/models/Bin"
import User from "@/models/User"
import DropEvent from "@/models/DropEvent"
import UserActivity from "@/models/UserActivity"

/**
 * POST /api/drop/confirm
 * 
 * Verifies and records an e-waste drop confirmation using geo-proximity validation
 * Implements Smart City sustainability verification standards
 */
export async function POST(request: NextRequest) {
    try {
        // 1. Validate user authentication via localStorage user ID
        // For hackathon demo, we'll use a simple header-based auth
        // In production, this would be JWT-based
        const userId = request.headers.get("x-user-id")
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Authentication required" },
                { status: 401 }
            )
        }

        // 2. Parse and validate request body
        const body = await request.json()
        const { binId, lat, lng, timeSpent } = body

        if (!binId || !lat || !lng || timeSpent === undefined) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            )
        }

        // Validate GPS coordinates
        if (typeof lat !== "number" || typeof lng !== "number" ||
            lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            return NextResponse.json(
                { success: false, message: "Invalid coordinates" },
                { status: 400 }
            )
        }

        // Validate time spent (minimum 30 seconds, maximum 1 hour)
        if (timeSpent < 30 || timeSpent > 3600) {
            return NextResponse.json(
                { success: false, message: "Invalid verification time" },
                { status: 400 }
            )
        }

        // 3. Connect to database
        await dbConnect()

        // 4. Validate bin exists and is operational
        const bin = await Bin.findById(binId)
        if (!bin) {
            return NextResponse.json(
                { success: false, message: "Bin not found" },
                { status: 404 }
            )
        }

        if (bin.status !== "operational") {
            return NextResponse.json(
                { success: false, message: "Bin is not currently operational" },
                { status: 400 }
            )
        }

        // 5. Verify proximity (server-side validation as anti-cheat measure)
        const distance = calculateDistance(lat, lng, bin.latitude, bin.longitude)
        if (distance > 100) { // Allow 100m tolerance for GPS inaccuracies
            return NextResponse.json(
                { 
                    success: false, 
                    message: `Too far from bin location. Distance: ${Math.round(distance)}m` 
                },
                { status: 400 }
            )
        }

        // 6. Check for duplicate confirmation (anti-cheat: prevent same-day duplicates)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const existingDrop = await DropEvent.findOne({
            userId: userId,
            binId: binId,
            confirmedAt: {
                $gte: today,
                $lt: tomorrow
            }
        })

        if (existingDrop) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: "E-waste already confirmed at this bin today. Please visit tomorrow." 
                },
                { status: 409 }
            )
        }

        // 7. Create drop event record
        const dropEvent = await DropEvent.create({
            userId: userId,
            binId: binId,
            location: {
                latitude: lat,
                longitude: lng
            },
            verified: true,
            verificationMethod: 'geo_proximity',
            timeSpentInRadius: timeSpent,
            startedAt: new Date(Date.now() - (timeSpent * 1000)), // Estimate start time
            confirmedAt: new Date()
        })

        // 8. Calculate rewards and update user stats
        const pointsEarned = 150 // Standard e-waste drop points
        const co2Saved = 5.2 // Estimated CO2 impact in kg

        await User.findByIdAndUpdate(
            userId,
            {
                $inc: {
                    totalItemsRecycled: 1,
                    totalCO2Saved: co2Saved,
                    points: pointsEarned
                }
            }
        )

        // 9. Log user activity for gamification and analytics
        await UserActivity.create({
            userId: userId,
            action: "E_WASTE_DROPPED",
            points: pointsEarned,
            metadata: {
                binId: bin._id,
                binName: bin.name,
                verificationMethod: 'geo_proximity',
                co2Saved: co2Saved
            },
            date: new Date()
        })

        // 10. Update bin fill level (simple increment - in production would be weight-based)
        await Bin.findByIdAndUpdate(
            binId,
            {
                $inc: { fillLevel: 2 }, // Increment by 2%
                lastCollection: new Date()
            }
        )

        // 11. Create transaction record for existing system compatibility
        // This maintains compatibility with the current transaction system
        const Transaction = (await import("@/models/Transaction")).default
        await Transaction.create({
            userId: userId,
            binId: binId,
            type: "recycle",
            itemName: "E-Waste Drop",
            itemType: "e-waste",
            confidence: 1.0, // High confidence due to geo-verification
            value: 10.0, // Estimated recycling value
            pointsEarned: pointsEarned,
            verificationMethod: 'geo_proximity',
            status: 'approved',
            verifiedAt: new Date(),
            verificationLocation: {
                latitude: lat,
                longitude: lng
            }
        })

        // 12. Return success response with impact data
        return NextResponse.json({
            success: true,
            message: "E-waste drop verified successfully!",
            data: {
                dropEventId: dropEvent._id,
                pointsEarned,
                co2Saved,
                binName: bin.name,
                verificationMethod: 'geo_proximity',
                impact: {
                    itemsRecycled: 1,
                    co2Saved: `${co2Saved}kg`,
                    energySaved: "~50 kWh" // Estimated energy savings
                }
            }
        })

    } catch (error) {
        console.error("Drop verification error:", error)
        return NextResponse.json(
            { 
                success: false, 
                message: "Internal server error during verification" 
            },
            { status: 500 }
        )
    }
}

/**
 * Helper function: Haversine formula for distance calculation
 * Server-side validation to prevent client-side spoofing
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000 // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lng2 - lng1) * Math.PI) / 180

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // distance in meters
}