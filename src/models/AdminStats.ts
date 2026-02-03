import mongoose, { Schema, Document, Model } from "mongoose"

export interface IAdminStats extends Document {
    overview: {
        totalBins: number
        activeBins: number
        fullBins: number
        maintenanceBins: number
        totalVerifiedDrops: number
        totalCO2Saved: number
        totalUsers: number
        activeUsers: number
        todayDrops: number
        todayCO2Saved: number
        weeklyGrowth: number
    }
    recentActivity: Array<{
        userId: mongoose.Types.ObjectId
        userName: string
        action: string
        points: number
        timestamp: Date
    }>
    binStatus: Array<{
        id: mongoose.Types.ObjectId
        name: string
        status: string
        fillLevel: number
        lastVerifiedDrop?: Date
    }>
}

const AdminStatsSchema = new Schema<IAdminStats>({
    overview: {
        totalBins: { type: Number, default: 0 },
        activeBins: { type: Number, default: 0 },
        fullBins: { type: Number, default: 0 },
        maintenanceBins: { type: Number, default: 0 },
        totalVerifiedDrops: { type: Number, default: 0 },
        totalCO2Saved: { type: Number, default: 0 },
        totalUsers: { type: Number, default: 0 },
        activeUsers: { type: Number, default: 0 },
        todayDrops: { type: Number, default: 0 },
        todayCO2Saved: { type: Number, default: 0 },
        weeklyGrowth: { type: Number, default: 0 },
    },
    recentActivity: [{
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        userName: { type: String, required: true },
        action: { type: String, required: true },
        points: { type: Number, required: true },
        timestamp: { type: Date, required: true },
    }],
    binStatus: [{
        id: { type: Schema.Types.ObjectId, ref: "Bin", required: true },
        name: { type: String, required: true },
        status: { type: String, required: true },
        fillLevel: { type: Number, default: 0 },
        lastVerifiedDrop: { type: Date },
    }],
}, {
    timestamps: true
})

const AdminStats: Model<IAdminStats> = mongoose.models.AdminStats || mongoose.model<IAdminStats>("AdminStats", AdminStatsSchema)

export default AdminStats