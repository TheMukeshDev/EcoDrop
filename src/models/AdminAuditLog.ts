import mongoose, { Schema, Document, Model } from "mongoose"

export interface IAdminAuditLog extends Document {
    adminId: mongoose.Types.ObjectId
    action: string
    resource: string
    details: object
    ipAddress: string
    userAgent: string
    success: boolean
    resolved: boolean
    error?: string
    severity: "low" | "medium" | "high"
    createdAt: Date
}

const AdminAuditLogSchema = new Schema<IAdminAuditLog>({
    adminId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    action: { type: String, required: true, index: true }, // 'CREATE_BIN', 'UPDATE_STATUS', 'VIEW_DROPS'
    resource: { type: String, required: true, index: true }, // 'bin', 'user', 'drop_event'
    details: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    success: { type: Boolean, required: true },
    error: { type: String },
    severity: { type: String, enum: ["low", "medium", "high"], default: "medium" },
}, {
    timestamps: true
})

const AdminAuditLog: Model<IAdminAuditLog> = mongoose.models.AdminAuditLog || mongoose.model<IAdminAuditLog>("AdminAuditLog", AdminAuditLogSchema)

export default AdminAuditLog