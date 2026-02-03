import mongoose, { Schema, Document, Model } from "mongoose"

export interface IDropEvent extends Document {
    userId: mongoose.Types.ObjectId
    binId: mongoose.Types.ObjectId
    location: {
        latitude: number
        longitude: number
    }
    verified: boolean
    verificationMethod: 'geo_proximity'
    timeSpentInRadius: number // seconds spent within 50m radius
    startedAt: Date // when user started navigation
    confirmedAt: Date // when user confirmed drop
    createdAt: Date
}

const DropEventSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        binId: { type: Schema.Types.ObjectId, ref: "Bin", required: true, index: true },
        location: {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true },
        },
        verified: { type: Boolean, required: true, default: true },
        verificationMethod: { 
            type: String, 
            enum: ['geo_proximity'], 
            required: true,
            default: 'geo_proximity'
        },
        timeSpentInRadius: { type: Number, required: true }, // seconds
        startedAt: { type: Date, required: true }, // navigation start time
        confirmedAt: { type: Date, required: true }, // confirmation time
    },
    {
        timestamps: true,
        // Prevent duplicate drops at same bin on same day by same user
        index: { userId: 1, binId: 1, confirmedAt: 1 },
    }
)

// Compound index to prevent duplicate confirmations within 24 hours
DropEventSchema.index({ 
    userId: 1, 
    binId: 1, 
    confirmedAt: 1 
}, { 
    unique: true,
    partialFilterExpression: { 
        confirmedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }
})

const DropEvent: Model<IDropEvent> = mongoose.models.DropEvent || mongoose.model<IDropEvent>("DropEvent", DropEventSchema)

export default DropEvent