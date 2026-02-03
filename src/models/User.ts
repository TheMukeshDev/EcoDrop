import mongoose, { Schema, Document, Model } from "mongoose"

export interface IUser extends Document {
    name: string
    username: string
    email: string
    role: string
    isActive: boolean
    totalItemsRecycled: number
    totalCO2Saved: number
    points: number
    suspiciousFlags: string[]
    password?: string
    createdAt: Date
    updatedAt: Date
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false }, // Optional for now to support old seed users
    role: { type: String, default: "user", enum: ["user", "admin"] },
    isActive: { type: Boolean, default: true },
    totalItemsRecycled: { type: Number, default: 0 },
    totalCO2Saved: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    suspiciousFlags: { type: [String], default: [] },
}, {
    timestamps: true
})

// Prevent model recompilation in Next.js hot reload
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User