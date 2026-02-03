# System Architecture - EcoDrop Platform

## 🏗️ High-Level Architecture

EcoDrop uses a **separation of concerns** architecture with clear frontend/backend boundaries, API-driven communication, and scalable database design.

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend     │    │   Backend APIs   │    │   Database     │
│   (Next.js)    │    │   (Next.js)    │    │   (MongoDB)    │
│                 │    │                 │    │                 │
│ React + TS      │    │    API Routes    │    │ Mongoose ODM   │
│ Tailwind + FM    │    │    Business Logic  │    │ Schema Models    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │ HTTP/REST            │ Mongoose Queries     │
         │                       │                       │
         ▼                       ▼                       ▼
```

## 🎨 Frontend Architecture

### Technology Stack
- **Framework**: Next.js 16 (App Router) - Modern server-side rendering
- **Language**: TypeScript - Type safety and developer experience
- **Styling**: Tailwind CSS - Utility-first responsive design
- **Animations**: Framer Motion - Smooth state transitions
- **Icons**: Lucide React - Consistent icon system
- **Maps**: Google Maps API - Interactive navigation

### Component Structure
```
src/
├── components/
│   ├── ui/              # Reusable base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── skeleton.tsx
│   ├── layout/           # Layout components
│   │   ├── header.tsx
│   │   └── bottom-nav.tsx
│   └── features/         # Feature-specific components
│       ├── verification-banner.tsx
│       ├── verification-success-modal.tsx
│       ├── bin-map.tsx
│       └── qr-scanner.tsx
├── hooks/               # Custom React hooks
│   ├── use-ew-drop-verification.ts
│   └── use-user-location.ts
├── context/             # React context providers
│   └── auth-context.tsx
└── lib/                # Utility libraries
    ├── geo-verification.ts
    └── ai-service.ts
```

### State Management
- **Auth Context**: User session and profile data
- **Local State**: Component-level state with useState/useReducer
- **Persistence**: localStorage for destination/verification state
- **Server State**: API-driven data fetching with React Query patterns

## 🔧 Backend Architecture

### API Route Design
```
app/api/
├── auth/              # User authentication
│   ├── login/route.ts
│   └── signup/route.ts
├── bins/               # Bin management
│   ├── route.ts        # List all bins
│   └── [id]/route.ts   # Get specific bin
├── drop/               # Verification system
│   └── confirm/route.ts # Verified drop confirmation
├── user/               # User management
│   └── destination/route.ts # Destination persistence
├── transactions/        # Transaction history
├── rewards/           # Rewards system
└── notifications/      # AI notifications
```

### API Design Principles
- **RESTful design**: Standard HTTP methods and status codes
- **Type safety**: Full TypeScript implementation
- **Error handling**: Consistent error responses and logging
- **Validation**: Input validation and sanitization
- **Rate limiting**: Protection against abuse

## 🗃️ Database Architecture

### MongoDB Schema Design
```
Collections:
├── users              # User profiles and stats
├── bins               # E-Bin locations and status
├── drop_events        # Verified e-waste drops
├── user_activity      # Activity logs and analytics
├── transactions       # Transaction history
└── notifications      # Daily AI insights
```

### Data Relationships
- **One-to-Many**: User → Drop Events
- **One-to-Many**: User → Transactions  
- **One-to-Many**: User → Activity Logs
- **Many-to-One**: Drop Event → Bin
- **Indexing**: Optimized for common query patterns

## 🔐 Security Architecture

### Authentication Flow
1. **Client**: Email/password via custom auth context
2. **Server**: bcryptjs password hashing
3. **Session**: JWT-free localStorage persistence
4. **API**: User ID passed in headers for validation

### Data Protection
- **Encryption**: bcryptjs for password storage
- **Privacy**: Location data only used for verification
- **Validation**: Input sanitization on all endpoints
- **Error handling**: No sensitive data in error messages

## 🔌 Integration Points

### Third-Party Services
- **Google Maps API**: Navigation and geocoding
- **Google Gemini API**: AI-powered e-waste identification
- **Browser APIs**: GPS, camera, localStorage

### Smart City Readiness
- **Open standards**: RESTful API for integration
- **Data export**: JSON format for municipal systems
- **Webhook ready**: Event notifications for real-time sync
- **Scalable**: Cloud-based architecture

## 📊 Data Flow Architecture

```
1. User Action → Frontend Component
2. Frontend Component → API Route (HTTP)
3. API Route → Business Logic Validation
4. Business Logic → Database Query
5. Database → Response Data
6. Response Data → Frontend State Update
7. State Update → UI Re-render
```

## 🚀 Performance Optimizations

### Frontend Optimizations
- **Code splitting**: Dynamic imports for large components
- **Image optimization**: Next.js Image component
- **Bundle analysis**: Tree shaking for unused code
- **Caching**: localStorage for session data

### Backend Optimizations
- **Connection pooling**: MongoDB connection reuse
- **Indexing**: Optimized for common queries
- **Caching**: In-memory for frequently accessed data
- **Compression**: Gzip for API responses

## 🛠️ Development Workflow

### Code Quality
- **TypeScript**: Full type coverage
- **ESLint**: Consistent code standards
- **Prettier**: Automated formatting
- **Git hooks**: Pre-commit validation

### Deployment Architecture
- **Build system**: Next.js production optimization
- **Static generation**: SEO-friendly page rendering
- **API deployment**: Serverless function model
- **Database**: Managed MongoDB Atlas

This architecture supports rapid development, easy maintenance, and scalable production deployment for smart city e-waste management.