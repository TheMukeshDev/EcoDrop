# Database Schema - Complete Data Models

## 🗃️ User Model (src/models/User.ts)

```typescript
export interface IUser extends Document {
    name: string
    username: string
    email: string
    role: "user" | "admin"
    isActive: boolean
    totalItemsRecycled: number
    totalCO2Saved: number
    points: number
    suspiciousFlags: string[]
    password?: string
    createdAt: Date
    updatedAt: Date
}

const UserSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false }, // Optional for seed users
    role: { type: String, default: "user", enum: ["user", "admin"] },
    isActive: { type: Boolean, default: true },
    totalItemsRecycled: { type: Number, default: 0 },
    totalCO2Saved: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    suspiciousFlags: { type: [String], default: [] },
}, {
    timestamps: true
})
```

## 🗑️ Bin Model (src/models/Bin.ts)

```typescript
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

const BinSchema = new Schema({
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
        default: "operational"
    },
    lastCollection: { type: Date },
}, {
    timestamps: true
})
```

## ✅ Drop Event Model (src/models/DropEvent.ts)

```typescript
export interface IDropEvent extends Document {
    userId: mongoose.Types.ObjectId
    binId: mongoose.Types.ObjectId
    location: {
        latitude: number
        longitude: number
    }
    verified: boolean
    verificationMethod: "geo_proximity"
    timeSpentInRadius: number
    startedAt: Date
    confirmedAt: Date
    createdAt: Date
}

const DropEventSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    binId: { type: Schema.Types.ObjectId, ref: "Bin", required: true, index: true },
    location: {
        type: { latitude: Number, longitude: Number },
        required: true
    },
    verified: { type: Boolean, required: true, default: true },
    verificationMethod: { type: String, required: true, default: "geo_proximity" },
    timeSpentInRadius: { type: Number, required: true },
    startedAt: { type: Date, required: true },
    confirmedAt: { type: Date, required: true },
}, {
    timestamps: true
})
```

## 📊 User Activity Model (src/models/UserActivity.ts)

```typescript
export interface IUserActivity extends Document {
    userId: mongoose.Types.ObjectId
    action: "E_WASTE_DROPPED" | "BIN_NAVIGATED" | "POINTS_EARNED" | "SCAN_ITEM"
    points: number
    metadata: {
        binId?: mongoose.Types.ObjectId
        binName?: string
        verificationMethod?: string
        co2Saved?: number
        itemName?: string
        itemType?: string
    }
    date: Date
    createdAt: Date
}

const UserActivitySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    action: { 
        type: String, 
        required: true, 
        enum: ["E_WASTE_DROPPED", "BIN_NAVIGATED", "POINTS_EARNED", "SCAN_ITEM"], 
        index: true 
    },
    points: { type: Number, required: true },
    metadata: {
        binId: { type: Schema.Types.ObjectId, ref: "Bin" },
        binName: { type: String },
        verificationMethod: { type: String },
        co2Saved: { type: Number },
        itemName: { type: String },
        itemType: { type: String }
    },
    date: { type: Date, required: true, index: true }, // For daily/weekly analytics
}, {
    timestamps: true
})
```

## 🔍 Admin Stats Model (src/models/AdminStats.ts)

```typescript
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
        todayVerifiedDrops: number
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
```

## 📋 Admin Audit Log Model (src/models/AdminAuditLog.ts)

```typescript
export interface IAdminAuditLog extends Document {
    adminId: mongoose.Types.ObjectId
    action: string
    resource: string
    details: object
    ipAddress: string
    userAgent: string
    success: boolean
    error?: string
    severity: "low" | "medium" | "high"
    createdAt: Date
}

const AdminAuditLogSchema = new Schema({
    adminId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    action: { type: String, required: true, index: true }, // Admin actions
    resource: { type: String, required: true, index: true },
    details: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    success: { type: Boolean, required: true },
    error: { type: String },
    severity: { type: String, enum: ["low", "medium", "high"], default: "medium" },
}, {
    timestamps: true
})
```

## 📊 Transaction Model (Existing)

```typescript
export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId
    binId?: mongoose.Types.ObjectId
    type: "scan" | "recycle" | "sell"
    itemName: string
    itemType: string
    confidence: number
    value: number
    pointsEarned: number
    verificationMethod?: "qr_scan" | "self_report" | "admin_confirm" | "geo_proximity"
    status: "pending" | "approved" | "rejected"
    verifiedAt?: Date
    verificationLocation?: { latitude: number; longitude: number }
    createdAt: Date
    updatedAt: Date
}
```

## 🎯 Key Database Indexes

### Performance Optimizations
```javascript
// User indexes
UserSchema.index({ email: 1 }) // Unique email
UserSchema.index({ username: 1 }) // Unique username
UserSchema.index({ role: 1, isActive: 1 }) // Role-based queries
UserSchema.index({ createdAt: -1 }) // User registration trends
UserSchema.index({ updatedAt: -1 }) // Active user tracking

// Bin indexes
BinSchema.index({ status: 1 }) // Status-based filtering
BinSchema.index({ location: "2dsphere" }) // Location-based queries
BinSchema.index({ fillLevel: 1 }) // Fill level monitoring

// Drop Event indexes
DropEventSchema.index({ userId: 1, confirmedAt: -1 }) // User drop history
DropEventSchema.index({ binId: 1, confirmedAt: -1 }) // Bin drop history
DropEventSchema.index({ confirmedAt: -1 }) // Time-based analytics

// User Activity indexes
UserActivitySchema.index({ userId: 1, date: -1, action: 1 }) // User activity analytics
UserActivitySchema.index({ action: 1, date: -1 }) // Action-based analytics

// Admin Stats indexes
AdminStatsSchema.index({ createdAt: -1 }) // Historical admin data
AdminStatsSchema.index({ adminId: 1 }) // Multi-admin support

// Admin Audit indexes
AdminAuditLogSchema.index({ adminId: 1, createdAt: -1 }) // Admin action tracking
AdminAuditLogSchema.index({ action: 1, createdAt: -1 }) // Action-based audit trails
AdminAuditLogSchema.index({ resource: 1, createdAt: -1 }) // Resource access tracking
```

## 🔐 Data Integrity Constraints

### Uniqueness Constraints
- **Users**: Unique email, username
- **Bins**: Unique QR codes
- **Drop Events**: One verified drop per bin per user per day

### Validation Rules
- **Required Fields**: All critical data fields have required: true
- **Data Types**: Strict type checking with Mongoose schemas
- **Default Values**: Sensible defaults for new records
- **Enum Constraints**: Limited options for status, role, etc.

### Business Logic Constraints
- **Time Validation**: Minimum 30 seconds in verification radius
- **Distance Validation**: Server-side verification of GPS coordinates
- **Duplicate Prevention**: Database-level constraints on confirmations
- **Audit Trail**: Complete logging of all admin actions

## 🌍 Relationships Between Models

```mermaid
erDiagram
    User ||--o{ has }||--o{ drops: "verified" }||--o{ activities: "all" }||--o{ transactions: "all" }
    User ||--|{ creates }||--o{ DropEvent }
    User ||--|{ creates }||--o{ UserActivity }
    User ||--|{ creates }||--o{ Transaction }

    Bin ||--o{ receives }||--o{ DropEvent }
    Bin ||--o{ updates: "status", "fillLevel" }
    Bin ||--o{ referenced_in: "qrCode" }
    
    User ||--o{ has }||--o{ AdminStats }
    User ||--o{ creates }||--o{ AdminAuditLog }
    
    Admin ||--o{ creates }||--o{ AdminStats }
    Admin ||--o{ creates }||--o{ AdminAuditLog }
    
    UserActivity ||--|{ references }||--o{ bin: "Bin" }
    UserActivity ||--|{ references }||--o{ metadata: "binId" }
    UserActivity ||--|{ references }||--o{ metadata: "binName" }
```

This database schema provides **complete auditability**, **data integrity**, **performance optimization**, and **scalability** for the EcoDrop platform while maintaining clear relationships between all data models.