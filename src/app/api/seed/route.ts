
import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Bin from "@/models/Bin"

const PRAYAGRAJ_BINS = [
    {
        name: "Sangam Ghat Point",
        address: "Sangam Road, Prayagraj, Uttar Pradesh",
        location: { latitude: 25.4358, longitude: 81.8806 },
        status: "operational",
        fillLevel: 45,
        qrCode: "BIN_PRY_001",
        acceptedItems: ["plastic", "glass", "metal"]
    },
    {
        name: "Civil Lines Hub",
        address: "MG Marg, Civil Lines, Prayagraj",
        location: { latitude: 25.4534, longitude: 81.8335 },
        status: "full",
        fillLevel: 95,
        qrCode: "BIN_PRY_002",
        acceptedItems: ["e-waste", "batteries"]
    },
    {
        name: "Allahabad University",
        address: "Senate House Campus, University Road",
        location: { latitude: 25.4597, longitude: 81.8513 },
        status: "operational",
        fillLevel: 20,
        qrCode: "BIN_PRY_003",
        acceptedItems: ["paper", "plastic"]
    },
    {
        name: "Prayagraj Junction",
        address: "Railway Station Rd, Leader Road",
        location: { latitude: 25.4447, longitude: 81.8286 },
        status: "maintenance",
        fillLevel: 0,
        qrCode: "BIN_PRY_004",
        acceptedItems: ["all"]
    },
    {
        name: "Anand Bhawan",
        address: "Tagore Town, Prayagraj",
        location: { latitude: 25.4607, longitude: 81.8601 },
        status: "operational",
        fillLevel: 60,
        qrCode: "BIN_PRY_005",
        acceptedItems: ["plastic", "organic"]
    },
    {
        name: "Baba Saheb Ambedkar Park",
        address: "Baba Saheb Ambedkar Park, Prayagraj, Uttar Pradesh",
        location: { latitude: 25.4988146, longitude: 81.8535066 },
        status: "operational",
        fillLevel: 35,
        qrCode: "BIN_PRY_006",
        acceptedItems: ["all"]
    },
    {
        name: "Katra Market E-Waste Center",
        address: "Katra Market, Chowk, Prayagraj",
        location: { latitude: 25.4476, longitude: 81.8482 },
        status: "operational",
        fillLevel: 55,
        qrCode: "BIN_PRY_007",
        acceptedItems: ["smartphones", "laptops", "tablets", "batteries", "chargers", "cables", "printers", "monitors", "keyboards", "mice"]
    },
    {
        name: "MG Marg Digital Hub",
        address: "MG Marg, Civil Lines, Prayagraj",
        location: { latitude: 25.4521, longitude: 81.8348 },
        status: "operational",
        fillLevel: 25,
        qrCode: "BIN_PRY_008",
        acceptedItems: ["smartphones", "tablets", "headphones", "speakers", "smart-watches", "power-banks", "cables", "chargers"]
    },
    {
        name: "University Road Tech Collection",
        address: "Near Allahabad University, University Road, Prayagraj",
        location: { latitude: 25.4612, longitude: 81.8528 },
        status: "operational",
        fillLevel: 40,
        qrCode: "BIN_PRY_009",
        acceptedItems: ["laptops", "desktops", "monitors", "printers", "keyboards", "mice", "hard-drives", "memory-cards", "routers"]
    },
    {
        name: "George Town Electronics Drop",
        address: "George Town, Prayagraj",
        location: { latitude: 25.4398, longitude: 81.8412 },
        status: "operational",
        fillLevel: 30,
        qrCode: "BIN_PRY_010",
        acceptedItems: ["smartphones", "tablets", "headphones", "speakers", "cameras", "gaming-consoles", "chargers", "batteries"]
    },
    {
        name: "Civil Lines Central E-Waste Hub",
        address: "Civil Lines, Prayagraj, Uttar Pradesh",
        location: { latitude: 25.4528, longitude: 81.8356 },
        status: "operational",
        fillLevel: 45,
        qrCode: "BIN_PRY_011",
        acceptedItems: ["all"]
    },
    {
        name: "Sangam Area Universal Drop Point",
        address: "Near Sangam Ghat, Prayagraj",
        location: { latitude: 25.4332, longitude: 81.8789 },
        status: "operational",
        fillLevel: 28,
        qrCode: "BIN_PRY_012",
        acceptedItems: ["all"]
    },
    {
        name: "Railway Station Comprehensive Collection",
        address: "Prayagraj Junction Complex, Leader Road",
        location: { latitude: 25.4451, longitude: 81.8279 },
        status: "operational",
        fillLevel: 52,
        qrCode: "BIN_PRY_013",
        acceptedItems: ["all"]
    },
    {
        name: "University Campus All-Gadget Center",
        address: "Allahabad University Main Campus, University Road",
        location: { latitude: 25.4589, longitude: 81.8516 },
        status: "operational",
        fillLevel: 38,
        qrCode: "BIN_PRY_014",
        acceptedItems: ["all"]
    },
    {
        name: "Tagore Town Universal Electronics Drop",
        address: "Tagore Town, Prayagraj",
        location: { latitude: 25.4618, longitude: 81.8612 },
        status: "operational",
        fillLevel: 41,
        qrCode: "BIN_PRY_015",
        acceptedItems: ["all"]
    },
    {
        name: "Katra Complete E-Waste Station",
        address: "Katra Market Area, Chowk, Prayagraj",
        location: { latitude: 25.4485, longitude: 81.8476 },
        status: "operational",
        fillLevel: 33,
        qrCode: "BIN_PRY_016",
        acceptedItems: ["all"]
    },
    {
        name: "Muttiganj All-Gadget Collection Point",
        address: "Muttiganj, Prayagraj",
        location: { latitude: 25.4267, longitude: 81.8394 },
        status: "operational",
        fillLevel: 29,
        qrCode: "BIN_PRY_017",
        acceptedItems: ["all"]
    },
    {
        name: "Jhunsi Universal Electronics Hub",
        address: "Jhunsi Area, Prayagraj",
        location: { latitude: 25.5134, longitude: 81.8867 },
        status: "operational",
        fillLevel: 36,
        qrCode: "BIN_PRY_018",
        acceptedItems: ["all"]
    },
    {
        name: "Naini Central E-Waste Facility",
        address: "Naini Industrial Area, Prayagraj",
        location: { latitude: 25.3876, longitude: 81.7989 },
        status: "operational",
        fillLevel: 47,
        qrCode: "BIN_PRY_019",
        acceptedItems: ["all"]
    },
    {
        name: "Phaphamau Comprehensive Drop Center",
        address: "Phaphamau, Prayagraj",
        location: { latitude: 25.5567, longitude: 81.9234 },
        status: "operational",
        fillLevel: 31,
        qrCode: "BIN_PRY_020",
        acceptedItems: ["all"]
    },
    {
        name: "Mehdauri Drop Center",
        address: "187/2, Sainik Colony, Rasulabad, Teliarganj, Prayagraj, Uttar Pradesh 211004",
        location: { latitude: 25.4988143, longitude: 81.850934 },
        status: "operational",
        fillLevel: 42,
        qrCode: "BIN_PRY_021",
        acceptedItems: ["all"]
    }
]

export async function GET() {
    try {
        await dbConnect()

        // Upsert bins
        const operations = PRAYAGRAJ_BINS.map(bin => ({
            updateOne: {
                filter: { qrCode: bin.qrCode },
                update: { $set: bin as any }, // Cast to any to avoid strict union type mismatches in bulkWrite
                upsert: true
            }
        }))

        await Bin.bulkWrite(operations)

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${PRAYAGRAJ_BINS.length} bins for Prayagraj including gadget drop-off locations`,
            data: PRAYAGRAJ_BINS.map(b => ({ name: b.name, code: b.qrCode, acceptedItems: b.acceptedItems }))
        })

    } catch (error) {
        console.error("Seeding error:", error)
        return NextResponse.json({ success: false, error: "Failed to seed bins" }, { status: 500 })
    }
}
