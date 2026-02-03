import mongoose, { Schema, Document, Model } from "mongoose"

export interface ICityRequest extends Document {
    city: string
    email?: string
    requestedAt: Date
    ip?: string
    userAgent?: string
}

const CityRequestSchema: Schema = new Schema(
    {
        city: { type: String, required: true, index: true },
        email: { type: String },
        requestedAt: { type: Date, default: Date.now },
        ip: { type: String },
        userAgent: { type: String },
    },
    {
        timestamps: true,
    }
)

const CityRequest: Model<ICityRequest> = mongoose.models.CityRequest || mongoose.model<ICityRequest>("CityRequest", CityRequestSchema)

export default CityRequest