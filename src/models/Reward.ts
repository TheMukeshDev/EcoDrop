import mongoose, { Schema, Document, Model } from "mongoose"

export interface IReward extends Document {
    title: string
    pointsRequired: number
    description: string
    image?: string
    available: boolean
    createdAt: Date
    updatedAt: Date
}

const RewardSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        pointsRequired: { type: Number, required: true },
        description: { type: String, required: true },
        image: { type: String },
        available: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
)

const Reward: Model<IReward> = mongoose.models.Reward || mongoose.model<IReward>("Reward", RewardSchema)

export default Reward
