# Project Structure - EcoDrop Organization

## 📂 Folder Architecture Overview

EcoDrop follows **Next.js 16 App Router structure** with clear separation of concerns, scalability in mind, and developer experience prioritized.

```
ecodrop/
├── docs/                  # Project documentation (this folder)
├── public/                 # Static assets and images
├── src/
│   ├── app/               # Next.js 16 App Router pages
│   │   ├── (auth)/      # Route groups for authentication
│   │   ├── api/         # Backend API routes
│   │   ├── find-bin/    # Bin discovery page
│   │   ├── profile/      # User profile and stats
│   │   ├── scan/         # AI-powered scanning
│   │   ├── schedule/     # Pickup scheduling
│   │   └── page.tsx      # Homepage
│   ├── components/         # Reusable React components
│   │   ├── ui/          # Base UI components
│   │   ├── layout/       # Layout components
│   │   └── features/    # Feature-specific components
│   ├── hooks/             # Custom React hooks
│   ├── context/           # React context providers
│   ├── lib/              # Utility libraries
│   ├── models/           # Database models (Mongoose)
│   └── types/            # TypeScript type definitions
├── scripts/              # Database seeding and utilities
└── configuration files     # package.json, next.config.ts, etc.
```

## 📱 Frontend Structure (src/)

### App Router Pages (src/app/)
```
app/
├── (auth)/                     # Authentication route group
│   ├── login/
│   │   └── page.tsx         # User login
│   └── signup/
│       └── page.tsx         # User registration
├── api/                       # Backend API routes
│   ├── auth/
│   │   ├── login/
│   │   │   └── route.ts     # Login API
│   │   └── signup/
│   │       └── route.ts     # Registration API
│   ├── bins/
│   │   ├── route.ts          # List all bins
│   │   └── [id]/
│   │       └── route.ts     # Get specific bin
│   ├── drop/
│   │   └── confirm/
│   │       └── route.ts     # Verified drop confirmation
│   ├── user/
│   │   ├── route.ts          # User management
│   │   └── destination/
│   │       └── route.ts     # Destination persistence
│   ├── transactions/             # Transaction history
│   ├── rewards/                # Rewards system
│   └── notifications/           # AI notifications
├── find-bin/
│   └── page.tsx              # Interactive bin map
├── profile/
│   └── page.tsx              # User dashboard
├── scan/
│   └── page.tsx              # AI e-waste scanner
├── schedule/
│   └── page.tsx              # Pickup scheduling
├── admin/
│   └── page.tsx              # Admin dashboard
├── layout.tsx                  # Root layout
└── page.tsx                   # Homepage
```

#### Key Features Per Route
- **/** (Root)**: Homepage with feature overview
- **/**find-bin**: Interactive map with all E-Bins
- **/**scan**: AI-powered e-waste identification
- **/**profile**: User stats, achievements, history
- **/**schedule**: Bin pickup scheduling system
- **/**(auth)/login**: User authentication
- **/**(auth)/signup**: New user registration
- **/**admin**: Municipal dashboard (future feature)

### Components Structure (src/components/)
```
components/
├── ui/                         # Reusable base components
│   ├── button.tsx              # Custom button with variants
│   ├── card.tsx                # Base card component
│   ├── motion-wrapper.tsx      # Animation wrapper
│   └── skeleton.tsx            # Loading skeleton
├── layout/                     # Layout components
│   ├── header.tsx              # App header with navigation
│   └── bottom-nav.tsx          # Mobile bottom navigation
└── features/                   # Feature-specific components
    ├── verification-banner.tsx      # Main verification UI
    ├── verification-success-modal.tsx # Success modal with rewards
    ├── bin-map.tsx               # Interactive Google Maps
    ├── bin-list.tsx              # Bin listing with filtering
    ├── qr-scanner.tsx            # Camera-based scanning
    ├── dropoff-confirmation-modal.tsx # Traditional drop confirmation
    ├── location-permission-fallback.tsx # GPS permission handling
    └── daily-tip.tsx              # AI-powered daily tips
```

#### Component Design Patterns
- **Composition**: Complex features built from smaller components
- **Props Interface**: Clear TypeScript interfaces for all props
- **State Management**: Local state with hooks, global with context
- **Styling Consistency**: Tailwind classes with design tokens

## 🔧 Backend Structure (src/app/api/)

### API Routes Organization
```
api/
├── auth/                    # User authentication
│   ├── login/route.ts       # Email/password validation
│   └── signup/route.ts     # New user creation
├── bins/                   # E-Bin management
│   ├── route.ts             # GET all bins with filtering
│   └── [id]/route.ts        # GET specific bin details
├── drop/                   # Verification system
│   └── confirm/route.ts      # POST verified drop confirmation
├── user/                   # User management
│   ├── route.ts             # GET user profile and stats
│   └── destination/route.ts  # POST destination persistence
├── transactions/            # Transaction history
│   └── route.ts             # GET user transactions
├── rewards/                # Rewards system
│   ├── route.ts             # GET available rewards
│   └── redeem/route.ts      # POST reward redemption
└── notifications/          # AI-powered engagement
    └── daily/route.ts        # GET daily AI tips
```

### API Design Principles
- **RESTful**: Standard HTTP methods and status codes
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Consistent error response format
- **Validation**: Input validation with Zod schemas
- **Documentation**: Clear API descriptions and examples

## 🧠 Business Logic Structure

### Custom Hooks (src/hooks/)
```
hooks/
├── use-ew-drop-verification.ts   # Verification state management
├── use-user-location.ts          # GPS tracking and permissions
└── use-auth.ts                  # Authentication context (imported)
```

#### Hook Patterns
- **State Logic**: Complex state extracted from components
- **API Integration**: Data fetching and caching logic
- **Side Effects**: useEffect for browser APIs and subscriptions
- **Performance**: useMemo and useCallback optimizations

### Context Providers (src/context/)
```
context/
└── auth-context.tsx               # User authentication state
```

#### Context Design
- **Global State**: Authentication and user data
- **LocalStorage**: Session persistence across page reloads
- **Type Safety**: Clear interfaces for context data
- **Provider Pattern**: React Context with custom hooks

## 🗃️ Database Structure (src/models/)

### Mongoose Models
```
models/
├── User.ts                     # User profiles and statistics
├── Bin.ts                      # E-Bin locations and status
├── Transaction.ts              # Transaction history
├── DropEvent.ts               # Verified drop events
├── UserActivity.ts             # Activity logs and analytics
├── Reward.ts                  # Available rewards
└── Notification.ts             # Daily AI notifications
```

#### Model Design Patterns
- **TypeScript Interfaces**: Clear data structures with validation
- **Indexes**: Optimized for common query patterns
- **Relationships**: Proper foreign key references
- **Timestamps**: Automatic createdAt/updatedAt tracking
- **Validation**: Schema-level data validation

## 🛠️ Utilities and Libraries (src/lib/)

### Core Libraries
```
lib/
├── geo-verification.ts         # GPS tracking and Haversine calculations
├── ai-service.ts              # Google Gemini AI integration
├── auth-utils.ts              # Password hashing and validation
├── mongodb.ts                # Database connection management
├── utils.ts                  # General utility functions
└── constants.ts              # Application constants
```

#### Utility Patterns
- **Pure Functions**: No side effects, predictable behavior
- **Error Handling**: Consistent error types and messages
- **Type Safety**: Full TypeScript implementation
- **Performance**: Optimized algorithms and caching
- **Testing**: Mock implementations for unit testing

## 📁 Configuration Files

### Build and Development
```
Root Directory:
├── package.json                # Dependencies and scripts
├── next.config.ts             # Next.js configuration
├── tsconfig.json              # TypeScript compiler options
├── tailwind.config.mjs         # Tailwind CSS configuration
├── postcss.config.mjs          # PostCSS processing
├── eslint.config.mjs           # Code quality rules
└── .env.local                 # Environment variables
```

### Development Workflow
- **Hot Reloading**: Fast development with instant updates
- **Type Checking**: Real-time TypeScript errors
- **Code Quality**: ESLint and Prettier integration
- **Build Optimization**: Production-ready code generation
- **Environment Management**: Separate development/production configs

## 🎨 Asset Organization

### Static Assets (public/)
```
public/
├── icons/                   # App icons and favicons
├── images/                  # Static images and illustrations
└── _next/                   # Next.js build output
```

### Image Optimization
- **Next.js Image**: Automatic optimization and WebP conversion
- **Responsive Images**: srcset for different screen densities
- **Lazy Loading**: Images load only when needed
- **Compression**: Optimized file sizes without quality loss

## 📦 Package Management

### Dependencies Strategy
- **Production Dependencies**: Only essential packages
- **Development Dependencies**: Development tools and testing
- **Security**: Regular updates and vulnerability scanning
- **Bundle Analysis**: Monitor package size impact
- **Tree Shaking**: Elimination of unused code

This structure provides **clear separation of concerns**, **scalable architecture**, and **excellent developer experience** for team collaboration and long-term maintenance.