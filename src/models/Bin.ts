import mongoose, { Schema, Document, Model } from "mongoose"

export interface IBin extends Document {
    name: string
    address: string
    latitude: number
    longitude: number
    qrCode: string
    acceptedItems: string[]
    fillLevel: number
    status: "operational" | "full" | "maintenance"
    lastCollection?: Date
    createdAt: Date
    updatedAt: Date
}

const BinSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        qrCode: { type: String, required: true, unique: true },
        acceptedItems: { type: [String], default: [] },
        fillLevel: { type: Number, default: 0, min: 0, max: 100 },
        status: {
            type: String,
            enum: ["operational", "full", "maintenance"],
            default: "operational",
        },
        lastCollection: { type: Date },
    },
    {
        timestamps: true,
    }
)

const Bin: Model<IBin> = mongoose.models.Bin || mongoose.model<IBin>("Bin", BinSchema)

export default Bin
