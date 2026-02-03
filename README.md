# EcoDrop – Smart E-Waste Recycling Platform

> **Drop e-waste. Earn impact.**

---

## 1. Project Overview

**The Problem**
E-waste is the fastest-growing waste stream globally, yet recycling rates remain critically low (less than 20%). Validated barriers to participation include:
1.  **Inconvenience**: Users don't know where to find recycling bins.
2.  **Lack of Trust**: Users are unsure if deposited items are actually recycled.
3.  **No Incentive**: There is no immediate tangible reward for the effort.

**The Solution**
EcoDrop is a "UI/UX-First" Smart E-Waste Bin System designed to bridge the gap between intent and action. By leveraging geolocation, transparent tracking, and gamification, EcoDrop makes recycling:
*   **Easy to Find**: Real-time map navigation to the nearest operational bin.
*   **Transparent**: AI-verified item detection and impact tracking.
*   **Rewarding**: Instant points redeemable for eco-friendly products.

*This prototype is localized for **Prayagraj (Allahabad)**, demonstrating deployment readiness in key areas like Teliyarganj, Civil Lines, and Jhusi.*

---

## 2. Key Features

*   **Location-Based Bin Finder**: Integrated Google Maps to locate nearest smart bins with real-time status (Operational, Full, or Maintenance).
*   **AI-Powered Waste Detection**: Explainable AI system that identifies e-waste types (e.g., smartphone, battery, laptop) with confidence scores.
*   **Smart Bin Interaction**: Simulated IoT handshake for secure bin opening and depositing.
*   **Rewards & Gamification**: Points system with a "Marketplace" for redeeming rewards, driving sustained user engagement.
*   **Environmental Impact Wallet**: Visual stats tracking CO₂ saved and total items recycled.
*   **Admin Dashboard**: Centralized view for municipal authorities to monitor bin fill levels and collection routes.

---

## 3. User Flow

1.  **Select Item**: User identifies the e-waste they wish to recycle.
2.  **Find Bin**: App locates the nearest *operational* bin using Geolocation and Google Maps.
3.  **Navigate**: "Get Directions" feature guides the user to the bin location.
4.  **Scan**: User scans the item at the bin. AI verifies the object type and condition.
5.  **Deposit**: Upon high-confidence valid verification, the bin converts to "Receiving Mode".
6.  **Earn**: User receives points (`EcoCoins`) and sees their updated carbon offset stats.

---

## 4. System Architecture

EcoDrop follows a modern, scalable **Serverless Architecture** to ensure high availability and low maintenance overhead.

*   **Frontend**: Next.js (App Router) for hybrid static/server rendering, ensuring incredibly fast load times and SEO optimization.
*   **Styling & UI**: Tailwind CSS for a utility-first design system, coupled with **Framer Motion** for high-fidelity micro-interactions (60fps animations).
*   **Backend**: Next.js API Routes (Node.js) serving as the REST API layer.
*   **Database**: MongoDB (Atlas) with Mongoose ODM for flexible schema modeling of heterogeneous e-waste data.
*   **Services**:
    *   **Google Maps Platform**: For Geocoding, Maps JavaScript API, and Directions.
    *   **AI Simulation**: Logic-based verification layer (adaptable to TensorFlow.js/Custom Vision integration).

This architecture allows independent scaling of frontend and backend logic, ready for "City-Scale" deployment.

---

## 5. Database Design

The data layer is built on **MongoDB** to handle unstructured log data and relationship-heavy user functionality.

*   **`Users`**: Stores profile, authenticated sessions, total points, and aggregated impact stats (CO₂ saved).
*   **`Bins`**: Geo-spatial data (Lat/Lng), current fill level (0-100%), status (Operational/Full), and accepted item types.
*   **`Transactions`**: Immutable ledger of every recycling event, linking `User`, `Bin`, and `Item` with timestamps.
*   **`Rewards`**: Catalog of redeemable items and their point costs.
*   **`DetectionLogs`**: Audit trail of AI scans, including confidence scores and raw inputs for system training.

---

## 6. Location & Maps Integration

EcoDrop utilizes the **Google Maps JavaScript API** for a premium mapping experience.

*   **Smart Geolocation**: The app attempts to acquire the user's high-accuracy GPS position.
*   **Fallbacks**: If permission is denied or GPS is unavailable, the system gracefully degrades to a default "City Center" view (Teliyarganj, Prayagraj).
*   **Distance Logic**: Uses the **Haversine Formula** on the client-side to calculate precise distance from the user to each bin, sorting results by proximity.

---

## 7. AI Transparency

Trust is paramount. Unlike "Black Box" systems, EcoDrop prioritizes **Explainable AI**.

*   **Confidence Scores**: Every scan returns a % confidence. Scores (>85%) auto-unlock the bin.
*   **Human-in-the-Loop**: "Low Confidence" scans (e.g., damaged items) trigger a manual review flag or prompt the user for manual category selection, ensuring no valid recycling attempt is rejected erroneously.
*   **Feedback**: Users see exactly *what* the system detected and *why* it was accepted or flagged.

---

## 8. Setup Instructions

### Prerequisites
*   Node.js (v18+)
*   npm or yarn
*   MongoDB Instance (Local or Atlas)
*   Google Maps API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/TheMukeshDev/EcoDrop.git
    cd EcoDrop
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env.local` file in the root directory:
    ```env
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecodrop
    
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
    ```

4.  **Seed the Database**
    Populate the database with demo users, smart bins (Prayagraj locations), and rewards.
    ```bash
    npx tsx scripts/seed.ts
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 9. Hackathon Alignment

**Theme: Smart City / Sustainability**

*   **User Experience (UX)**: We prioritized a "no-learning-curve" interface. The floating action button (`Scan`) and bottom navigation mirror familiar apps like Instagram/Uber, reducing cognitive load.
*   **Accessibility**: High-contrast dark mode, large touch targets (44px+), and screen-reader-friendly semantic HTML.
*   **Scalability**: The system is designed to handle thousands of bins. The "Find Bin" logic performs geospatial queries that scale efficiently with database indexing.

---

## 10. Future Improvements

*   **Predictive Analytics**: Using Machine Learning to predict "Bin Full" events before they happen based on usage history.
*   **IoT Integration**: replacing simulated handshake with actual MQTT/Bluetooth Low Energy (BLE) communication with physical bin locks.
*   **Regional Expansion**: Dynamic localization support for other smart cities.

---

## 11. Team & Credits

**Team Name**: Binary Bloom  
*Haxplore Hackathon Submission*

*   **Mukesh Kumar** – Team Leader
*   **Deepa Tiwari** – Presenter
*   **Ankit Kumar** – Frontend Developer

---

*Built with ❤️ for a cleaner planet.*
