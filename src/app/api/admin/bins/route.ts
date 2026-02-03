import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Bin from "@/models/Bin"

export async function GET(request: Request) {
    try {
        await dbConnect()

        const bins = await Bin.find({}).sort({ fillLevel: -1, status: 1 }) // Fullest first, then operational

        return NextResponse.json({
            success: true,
            data: bins
        })
    } catch (error) {
        console.error("Admin Bins API Error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch bins" },
            { status: 500 }
        )
    }
}

export async function PUT(request: Request) {
    try {
        await dbConnect()
        const body = await request.json()
        const { binId, status, fillLevel } = body

        if (!binId) {
            return NextResponse.json(
                { success: false, error: "Bin ID is required" },
                { status: 400 }
            )
        }

        const updateData: any = {}
        if (status) updateData.status = status
        if (fillLevel !== undefined) updateData.fillLevel = fillLevel

        // Auto-update status based on fill level if not explicitly set
        if (fillLevel !== undefined && !status) {
            if (fillLevel >= 90) updateData.status = "full"
            else if (fillLevel < 90 && updateData.status === "full") updateData.status = "operational"
        }

        const updatedBin = await Bin.findByIdAndUpdate(
            binId,
            { $set: updateData },
            { new: true }
        )

        if (!updatedBin) {
            return NextResponse.json(
                { success: false, error: "Bin not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: updatedBin
        })

    } catch (error) {
        console.error("Admin Bins Update Error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to update bin" },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect()
        const body = await request.json()

        // Basic validation
        if (!body.name || !body.latitude || !body.longitude) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Generate QR code if not provided
        if (!body.qrCode) {
            body.qrCode = `BIN_${Date.now().toString().slice(-6)}`
        }

        const newBin = await Bin.create(body)

        return NextResponse.json({
            success: true,
            data: newBin
        })

    } catch (error) {
        console.error("Create Bin Error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to create bin" },
            { status: 500 }
        )
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Bin ID required" },
                { status: 400 }
            )
        }

        await dbConnect()
        await Bin.findByIdAndDelete(id)

        return NextResponse.json({
            success: true,
            message: "Bin deleted successfully"
        })

    } catch (error) {
        console.error("Delete Bin Error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to delete bin" },
            { status: 500 }
        )
    }
}