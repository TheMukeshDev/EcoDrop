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

        // Check for "bad" data (nested location) and fix it
        const badData = await Bin.findOne({ "location.latitude": { $exists: true } })
        const count = await Bin.countDocuments()

        if (count === 0 || badData) {
            console.log("Seeding/Repairing Prayagraj Bins...")
            if (badData) await Bin.deleteMany({}) // Wipe bad data

            await Bin.insertMany([
                {
                    name: "Civil Lines E-Bin",
                    address: "Civil Lines, Near Hanuman Mandir, Prayagraj",
                    city: "Prayagraj",
                    latitude: 25.4534,
                    longitude: 81.8340,
                    qrCode: "BIN-PRJ-001",
                    acceptedItems: ["smartphone", "laptop", "battery"],
                    fillLevel: 45,
                    status: "operational"
                },
                {
                    name: "Teliyarganj Collection Point",
                    address: "Teliyarganj, Near MNNIT, Prayagraj",
                    city: "Prayagraj",
                    latitude: 25.4624,
                    longitude: 81.8605,
                    qrCode: "BIN-PRJ-002",
                    acceptedItems: ["smartphone", "cable", "battery", "e-waste"],
                    fillLevel: 20,
                    status: "operational"
                },
                {
                    name: "IIIT Allahabad Bin",
                    address: "IIIT Campus, Jhalwa, Prayagraj",
                    city: "Prayagraj",
                    latitude: 25.4294,
                    longitude: 81.7709,
                    qrCode: "BIN-PRJ-003",
                    acceptedItems: ["all", "laptop"],
                    fillLevel: 10,
                    status: "operational"
                },
                {

                    name: "Ghamaha, Uttar Pradesh Bin",
                    address: "Ghamaha, Near Bus Stop, Prayagraj",
                    city: "Prayagraj",
                    latitude: 25.4286196,
                    longitude:  82.2564493,
                    qrCode: "BIN-PRJ-004",
                    acceptedItems: ["mobile", "accessories", "battery"],
                    fillLevel: 75,
                    status: "operational"
                },
                {
                    name: "Radhe Motor E-Waste Bin",
                    address: "Motor,Near SantiPuram, Prayagraj",
                    city: "Prayagraj",
                    latitude: 25.5283335,
                    longitude: 81.8478447,
                    qrCode: "BIN-PRJ-003",
                    acceptedItems: ["all"],
                    fillLevel: 50,
                    status: "operational"
                },
                {
                    name: "Phaphamau Market Bin",
                    address: "Phaphamau Main Market, Prayagraj",
                    city: "Prayagraj",
                    latitude: 25.4988,
                    longitude: 81.8596,
                    qrCode: "BIN-PRJ-004",
                    acceptedItems: ["battery", "smartphone"],
                    fillLevel: 80,
                    status: "maintenance"
                },
                {
                    name: "High Court E-Waste Hub",
                    address: "Nyaya Marg, High Court, Prayagraj",
                    city: "Prayagraj",
                    latitude: 25.4485,
                    longitude: 81.8385,
                    qrCode: "BIN-PRJ-005",
                    acceptedItems: ["all"],
                    fillLevel: 60,
                    status: "operational"
                },
                {
                    name: "Naini Industrial Area Bin",
                    address: "Naini, Near Bridge, Prayagraj",
                    city: "Prayagraj",
                    latitude: 25.4180,
                    longitude: 81.8700,
                    qrCode: "BIN-PRJ-006",
                    acceptedItems: ["heavy-electronics", "large-appliances"],
                    fillLevel: 15,
                    status: "operational"
                },
                {
                    name: "Allahabad University Library",
                    address: "Senate House Campus, Prayagraj",
                    city: "Prayagraj",
                    latitude: 25.4590,
                    longitude: 81.8510,
                    qrCode: "BIN-PRJ-007",
                    acceptedItems: ["laptop", "smartphone", "tablet"],
                    fillLevel: 30,
                    status: "operational"
                },
                {
                    name: "Chowk Zero-Waste Point",
                    address: "Chowk, Clock Tower, Prayagraj",
                    city: "Prayagraj",
                    latitude: 25.4380,
                    longitude: 81.8330,
                    qrCode: "BIN-PRJ-008",
                    acceptedItems: ["mobile", "accessories"],
                    fillLevel: 90,
                    status: "full"
                }
            ])
        }

        const bins = await Bin.find({
            latitude: { $exists: true },
            longitude: { $exists: true }
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
