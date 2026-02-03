
import mongoose, { Schema, Document } from "mongoose"

export interface INotification extends Document {
    dateId: string // e.g., "2024-02-03" to ensure unique daily
    title: string
    message: string
    category: "awareness" | "action" | "local" | "gamification"
    createdAt: Date
}

const NotificationSchema = new Schema<INotification>({
    dateId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    category: { type: String, required: true, enum: ["awareness", "action", "local", "gamification"] },
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema)
