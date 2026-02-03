import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Bin from "@/models/Bin"
import { SUPPORTED_CITIES } from "@/lib/constants"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const city = searchParams.get("city")

        if (!city) {
            await dbConnect()
            const bins = await Bin.find({}).lean()
            return NextResponse.json({ success: true, data: bins })
        }

        const isSupported = SUPPORTED_CITIES.some(
            supportedCity => 
                supportedCity.toLowerCase() === city.toLowerCase().trim()
        )

        if (!isSupported) {
            return NextResponse.json({
                supported: false,
                city: city,
                message: `${city} is not yet supported`
            })
        }

        await dbConnect()

        const bins = await Bin.find({ 
            "location.latitude": { $exists: true },
            "location.longitude": { $exists: true }
        }).lean()

        return NextResponse.json({
            supported: true,
            city: city,
            bins: bins,
            count: bins.length
        })

    } catch (error) {
        console.error("Error fetching bins:", error)
        return NextResponse.json(
            { error: "Failed to fetch bins" },
            { status: 500 }
        )
    }
}
