# API Documentation - EcoDrop Backend Endpoints

## 🔐 Authentication

All admin endpoints require authentication via `x-user-id` header. Admin role validation should be implemented in production.

## 📊 Admin Analytics Endpoints

### GET /api/admin/stats

Fetch comprehensive admin dashboard statistics.

#### Request
```typescript
// Headers
x-user-id: string (required) - Admin user ID
```

#### Response
```typescript
{
  success: true,
  data: {
    overview: {
      totalBins: number,
      activeBins: number,
      fullBins: number,
      maintenanceBins: number,
      totalVerifiedDrops: number,
      totalCO2Saved: number,
      totalUsers: number,
      activeUsers: number,
      todayDrops: number,
      todayCO2Saved: number,
      weeklyGrowth: number
    },
    recentActivity: Array<{
      userId: string,
      userName: string,
      action: string,
      points: number,
      timestamp: string
    }>,
    binStatus: Array<{
      id: string,
      name: string,
      status: string,
      fillLevel: number,
      lastVerifiedDrop?: string
    }>
  }
}
```

### GET /api/admin/drops

Fetch verified e-waste drop logs with pagination and filtering.

#### Request
```typescript
// Query Parameters
page?: number (default: 1)
limit?: number (default: 20)
binId?: string (filter by specific bin)
userId?: string (filter by specific user)
startDate?: string (ISO date)
endDate?: string (ISO date)

// Headers
x-user-id: string (required) - Admin user ID
```

#### Response
```typescript
{
  success: true,
  data: {
    drops: Array<{
      id: string,
      userId: string,
      userName: string,
      binId: string,
      binName: string,
      location: {
        latitude: number,
        longitude: number
      },
      verificationMethod: string,
      timeSpent: number,
      startedAt: string,
      confirmedAt: string,
      co2Saved: number,
      pointsEarned: number,
      suspiciousFlags: string[]
    }>,
    pagination: {
      currentPage: number,
      totalPages: number,
      totalDrops: number,
      hasNext: boolean,
      hasPrev: boolean
    }
  }
}
```

### POST /api/admin/bins

Create, update, or delete E-Bin locations.

#### Request
```typescript
// Headers
x-user-id: string (required) - Admin user ID
Content-Type: application/json

// Body for Create
{
  name: string (required),
  address: string (required),
  latitude: number (required),
  longitude: number (required),
  acceptedItems: string[],
  capacity: number,
  status: "operational" | "full" | "maintenance"
}

// Body for Update
{
  id: string (required),
  name?: string,
  address?: string,
  latitude?: number,
  longitude?: number,
  acceptedItems?: string[],
  capacity?: number,
  status?: "operational" | "full" | "maintenance"
}

// Body for Delete
{
  id: string (required)
}
```

#### Response
```typescript
// Success Response
{
  success: true,
  message: string,
  data: {
    bin: Bin // Created/Updated bin object
  }
}

// Error Response
{
  success: false,
  error: string,
  code: string
}
```

## 👥 User Management Endpoints

### GET /api/admin/users

Fetch user list with pagination and filtering.

#### Request
```typescript
// Query Parameters
page?: number (default: 1)
limit?: number (default: 20)
search?: string (user name or email search)
role?: string (filter by user role)
active?: boolean (filter by active status)

// Headers
x-user-id: string (required) - Admin user ID
```

#### Response
```typescript
{
  success: true,
  data: {
    users: Array<{
      id: string,
      name: string,
      username: string,
      email: string,
      points: number,
      totalItemsRecycled: number,
      totalCO2Saved: number,
      joinDate: string,
      lastActiveDate: string,
      role: string,
      isActive: boolean,
      suspiciousFlags: string[]
    }>,
    pagination: {
      currentPage: number,
      totalPages: number,
      totalUsers: number,
      hasNext: boolean,
      hasPrev: boolean
    }
  }
}
```

## 🔍 Misuse Detection Endpoints

### GET /api/admin/anomalies

Detect suspicious activity patterns and potential system misuse.

#### Request
```typescript
// Headers
x-user-id: string (required) - Admin user ID

// Query Parameters
type?: "location" | "timing" | "frequency" | "duplicate"
severity?: "low" | "medium" | "high"
resolved?: boolean
```

#### Response
```typescript
{
  success: true,
  data: {
    anomalies: Array<{
      id: string,
      type: string,
      severity: string,
      description: string,
      userId: string,
      userName: string,
      binId?: string,
      details: object,
      detectedAt: string,
      resolved: boolean,
      resolvedAt?: string,
      adminNotes?: string
    }>,
    summary: {
      totalAnomalies: number,
      unresolvedCount: number,
      highSeverityCount: number,
      resolvedToday: number
    }
  }
}
```

### POST /api/admin/anomalies/:id/resolve

Mark detected anomalies as resolved.

#### Request
```typescript
// Headers
x-user-id: string (required) - Admin user ID
Content-Type: application/json

// Body
{
  adminNotes: string,
  resolution: string,
  severity: "low" | "medium" | "high"
}
```

## 📊 Analytics Export Endpoints

### GET /api/admin/export

Export analytics data in various formats.

#### Request
```typescript
// Headers
x-user-id: string (required) - Admin user ID

// Query Parameters
type: "drops" | "bins" | "users" | "activity"
format: "csv" | "json" | "xlsx"
startDate?: string (ISO date)
endDate?: string (ISO date)
```

#### Response
```typescript
// For CSV format
Content-Type: text/csv
Content-Disposition: attachment; filename="eco-drops-2024-01-01.csv"

// For JSON format
Content-Type: application/json
Content-Disposition: attachment; filename="eco-drops-2024-01-01.json"

// For Excel format
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="eco-drops-2024-01-01.xlsx"
```

## 🚀 Error Handling

### Standard Error Response Format
```typescript
{
  success: false,
  error: string,
  code: string,
  details?: object,
  timestamp: string,
  requestId: string
}
```

### Common Error Codes
- `AUTH_REQUIRED` - Admin authentication missing
- `AUTH_INVALID` - Invalid admin credentials
- `PERMISSION_DENIED` - Insufficient admin privileges
- `VALIDATION_ERROR` - Request data validation failed
- `NOT_FOUND` - Resource not found
- `DUPLICATE_ENTRY` - Resource already exists
- `RATE_LIMITED` - Too many requests
- `INTERNAL_ERROR` - Server error

## 📝 Rate Limiting

All admin endpoints implement rate limiting:
- **Window**: 15 minutes
- **Limit**: 100 requests per admin per window
- **Headers**: Rate limit info in response headers

## 📱 Pagination

All list endpoints support consistent pagination:
- **Default Limit**: 20 items per page
- **Maximum Limit**: 100 items per page
- **Navigation**: Links to next/previous pages
- **Metadata**: Total count and page information

This API structure provides comprehensive admin functionality while maintaining security, scalability, and ease of integration for municipal waste management systems.