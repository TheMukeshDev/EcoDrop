# Setup and Run - Quick Start Guide

## 🚀 Prerequisites

### Required Software
- **Node.js**: Version 18.0 or higher
- **npm**: Version 9.0 or higher (comes with Node.js)
- **Git**: For version control and collaboration
- **Code Editor**: VS Code recommended with extensions

### Required Accounts
- **MongoDB Atlas**: Free cluster for database
- **Google Cloud**: Maps API key and Gemini AI API key
- **Vercel** (optional): For deployment platform

### Browser Requirements
- **Chrome**: Version 90+ (recommended)
- **Safari**: Version 14+ 
- **Firefox**: Version 88+
- **Edge**: Version 90+

## 📋 Step 1: Repository Setup

### Clone the Repository
```bash
# Clone EcoDrop repository
git clone https://github.com/your-username/ecodrop.git
cd ecodrop

# Install dependencies
npm install

# Verify installation
npm run lint
```

### Environment Configuration
```bash
# Create .env.local file in project root
touch .env.local

# Add required environment variables
cat > .env.local << EOF
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecodrop

# Google Services
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Application
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
EOF
```

## 🗄️ Step 2: Database Setup

### MongoDB Atlas Configuration
1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Sign up with email/password or Google account

2. **Create New Cluster**
   - Choose **M0 Sandbox** (free tier)
   - Select cloud region closest to you
   - Name cluster: `ecodrop-cluster`

3. **Create Database User**
   - Database Access → Add New Database User
   - Username: `ecodrop-user`
   - Password: Generate secure password
   - Database User Privileges: Read/Write to `ecodrop` database

4. **Configure Network Access**
   - Network Access → Add IP Address
   - Allow access from `0.0.0.0/0` (all IPs)
   - Alternative: Add current IP address

5. **Get Connection String**
   - Database → Connect → Connect your application
   - Driver: Node.js
   - Copy connection string

### Database Seeding
```bash
# Populate database with sample data
npm run seed

# Verify data insertion
# Check MongoDB Atlas Collections tab
```

## 🔌 Step 3: API Keys Setup

### Google Maps API
1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project: `EcoDrop`

2. **Enable Maps JavaScript API**
   - APIs & Services → Library → Maps JavaScript API
   - Enable API (no billing required for basic usage)

3. **Get API Key**
   - Credentials → Create Credentials → API Key
   - Application restrictions: HTTP referrers (optional)
   - Copy API key to .env.local

### Google Gemini AI API
1. **Access Generative AI**
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Sign in with Google account

2. **Get API Key**
   - Click API key in left sidebar
   - Create new API key
   - Name: `EcoDrop Hackathon`
   - Copy API key to .env.local

## 🏃 Step 4: Run Development Server

### Start the Application
```bash
# Start Next.js development server
npm run dev

# Server will start at http://localhost:3000
# Hot reloading enabled for fast development
```

### Verify Development Setup
```bash
# Check for TypeScript errors
npm run build

# Run code quality checks
npm run lint

# Start development
npm run dev
```

## 📱 Step 5: Access the Application

### Initial Load
1. **Open Browser**: Navigate to `http://localhost:3000`
2. **Verify Loading**: Application should load without errors
3. **Check Console**: No error messages in browser console
4. **Test Navigation**: All pages should be accessible

### Create Test Account
1. **Go to Signup**: Click "Get Started" → "Sign Up"
2. **Fill Form**: Email, name, username, password
3. **Submit Form**: Account should be created successfully
4. **Login**: Verify login functionality with new credentials

### Test Core Features
1. **Scan Page**: Test AI e-waste identification
2. **Find Bin**: Test map display and bin filtering
3. **Verification**: Test GPS tracking and drop confirmation
4. **Profile**: Check stats display and achievement system

## 🔧 Step 6: Development Workflow

### Code Quality Tools
```bash
# Run ESLint for code quality
npm run lint

# Format code with Prettier
npm run format

# Type checking
npx tsc --noEmit
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/verification-system

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Implement geo-fencing verification system"

# Push to remote
git push origin feature/verification-system

# Merge to main when complete
git checkout main
git merge feature/verification-system
```

### Development Best Practices
- **Component First**: Build UI components then integrate
- **Type Safety**: Use TypeScript interfaces for all data
- **Testing**: Test components before integration
- **Documentation**: Comment complex logic and API endpoints
- **Performance**: Monitor bundle size and render times

## 🚀 Step 7: Production Deployment

### Build for Production
```bash
# Create optimized production build
npm run build

# Build will be in .next directory
# Static files optimized for production
```

### Environment Setup
```bash
# Production .env configuration
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
MONGODB_URI=production_mongodb_uri
GOOGLE_MAPS_API_KEY=production_api_key
GEMINI_API_KEY=production_api_key
```

### Vercel Deployment (Recommended)
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy Project**
   ```bash
   vercel --prod
   ```

3. **Configure Environment**
   - Follow prompts to add environment variables
   - Connect to MongoDB Atlas production database
   - Add API keys for production usage

4. **Verify Deployment**
   - Vercel provides production URL
   - Test all functionality in production
   - Check Vercel dashboard for deployment logs

## 🔍 Step 8: Troubleshooting

### Common Issues

#### Installation Problems
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18.0+
```

#### Database Connection
```bash
# Test MongoDB connection
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected')).catch(err => console.error(err));"

# Check network access
# MongoDB Atlas → Network Access → Verify IP allowed
```

#### API Key Issues
```bash
# Verify Google Maps API key
curl "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"

# Verify Gemini API key
curl -H "Content-Type: application/json" -d '{"contents":[{"parts":[{"text":"test"}]}'} "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_API_KEY"
```

#### Port Conflicts
```bash
# Check if port 3000 is in use
netstat -an | grep :3000

# Kill process using port (macOS/Linux)
sudo lsof -ti:3000 | xargs kill -9

# Kill process (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Development Tips
- **Hot Reload**: Save files to see instant updates
- **Console Logs**: Check browser console for errors
- **Network Tab**: Monitor API calls and responses
- **React DevTools**: Inspect component state and props
- **MongoDB Atlas**: Monitor database operations in real-time

## 📱 Step 9: Mobile Testing

### Local Development
```bash
# Find your local IP
ipconfig getifaddr en0  # macOS
ip addr show wlan0       # Linux
ipconfig               # Windows

# Access from mobile device
http://YOUR_LOCAL_IP:3000
```

### Testing Features on Mobile
- **GPS Permission**: Test location permission handling
- **Camera Access**: Verify e-waste scanning functionality
- **Touch Interface**: Test mobile-specific interactions
- **Responsive Design**: Verify layout on different screen sizes

## 🎯 Success Criteria

### Development Setup Complete When:
- ✅ Application runs without errors at `http://localhost:3000`
- ✅ All pages load successfully with proper routing
- ✅ Database connection established with sample data
- ✅ API keys working (Maps and AI)
- ✅ Core features functional: Scan, Find Bin, Verification
- ✅ Code passes linting and type checking
- ✅ Mobile responsive and touch-friendly interface

### Production Deployment Complete When:
- ✅ Application accessible at production URL
- ✅ All environment variables configured
- ✅ Database connected to production cluster
- ✅ HTTPS enabled and security headers configured
- ✅ Core functionality verified in production
- ✅ Performance optimized (bundle size, load times)
- ✅ Monitoring and error tracking in place

Following this setup guide will get EcoDrop running locally and prepared for production deployment in approximately 30-45 minutes.