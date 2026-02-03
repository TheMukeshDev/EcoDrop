import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Bin from "@/models/Bin"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect()

        const { id } = await params

        // Mock response for testing
        if (id === "BIN_TEST_01") {
            return NextResponse.json({
                success: true,
                data: {
                    _id: "test_bin_id_01",
                    name: "Test Recycling Bin",
                    address: "123 Green Street, Test City",
                    location: {
                        latitude: 0,
                        longitude: 0
                    },
                    status: "operational",
                    fillLevel: 50,
                    acceptedItems: ["plastic", "paper", "e-waste"],
                    qrCode: "BIN_TEST_01"
                }
            })
        }

        // Try to find bin by ID or QR code
        const bin = await Bin.findOne({
            $or: [
                { _id: id },
                { qrCode: id }
            ]
        })

        if (!bin) {
            return NextResponse.json({
                success: false,
                error: "Bin not found"
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            data: bin
        })

    } catch (error) {
        console.error("Bin fetch error:", error)
        return NextResponse.json({
            success: false,
            error: "Failed to fetch bin details"
        }, { status: 500 })
    }
}
