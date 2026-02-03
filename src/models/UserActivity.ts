import mongoose, { Schema, Document, Model } from "mongoose"

export interface IUserActivity extends Document {
    userId: mongoose.Types.ObjectId
    action: "E_WASTE_DROPPED" | "BIN_NAVIGATED" | "POINTS_EARNED" | "REWARD_CLAIMED"
    points?: number
    metadata?: {
        binId?: mongoose.Types.ObjectId
        binName?: string
        itemName?: string
        verificationMethod?: string
        co2Saved?: number
    }
    date: Date // For easy daily/weekly queries
    createdAt: Date
}

const UserActivitySchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        action: { 
            type: String, 
            enum: ["E_WASTE_DROPPED", "BIN_NAVIGATED", "POINTS_EARNED", "REWARD_CLAIMED"], 
            required: true,
            index: true
        },
        points: { type: Number, default: 0 },
        metadata: {
            binId: { type: Schema.Types.ObjectId, ref: "Bin" },
            binName: { type: String },
            itemName: { type: String },
            verificationMethod: { type: String },
            co2Saved: { type: Number },
        },
        // Store date separately for easier daily/weekly aggregations
        date: { type: Date, required: true, index: true },
    },
    {
        timestamps: true,
    }
)

// Index for efficient user activity queries
UserActivitySchema.index({ userId: 1, date: -1 })
UserActivitySchema.index({ action: 1, date: -1 })

const UserActivity: Model<IUserActivity> = mongoose.models.UserActivity || mongoose.model<IUserActivity>("UserActivity", UserActivitySchema)

export default UserActivity