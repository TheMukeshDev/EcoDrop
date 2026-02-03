import { config } from "dotenv"
import mongoose from "mongoose"
// Load environment variables from .env.local or .env
config({ path: ".env.local" })
config({ path: ".env" })

import Bin from "../src/models/Bin"
import User from "../src/models/User"
import Reward from "../src/models/Reward"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    console.error("Please define the MONGODB_URI environment variable inside .env.local")
    process.exit(1)
}

const ITEMS = ["plastic_bottle", "glass_bottle", "aluminum_can", "smartphone", "laptop", "battery"]
const STATUSES = ["operational", "full", "maintenance"]

// Helper for random number
const random = (min: number, max: number) => Math.random() * (max - min) + min
const randomInt = (min: number, max: number) => Math.floor(random(min, max))
const randomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]

async function seed() {
    try {
        console.log("Connecting to MongoDB...")
        await mongoose.connect(MONGODB_URI!)
        console.log("Connected!")

        console.log("Clearing existing data...")
        await Bin.deleteMany({})
        await User.deleteMany({})
        await Reward.deleteMany({})

        console.log("Seeding Bins...")
        console.log("Seeding Bins...")

        const PRAYAGRAJ_LOCATIONS = [
            { name: "Civil Lines Main Market", lat: 25.4526, lng: 81.8340 },
            { name: "Sangam Area", lat: 25.4293, lng: 81.8841 },
            { name: "Teliyarganj", lat: 25.4746, lng: 81.8654 },
            { name: "George Town", lat: 25.4435, lng: 81.8493 },
            { name: "Allahabad University", lat: 25.4593, lng: 81.8507 },
            { name: "Chowk Market", lat: 25.4380, lng: 81.8347 },
            { name: "Naini Industrial Area", lat: 25.3952, lng: 81.8557 },
            { name: "Phaphamau Bridge", lat: 25.5034, lng: 81.8576 },
            { name: "Jhunsi", lat: 25.4312, lng: 81.9126 },
            { name: "Bamrauli Airport", lat: 25.4419, lng: 81.7456 },
        ]

        const bins = PRAYAGRAJ_LOCATIONS.map((loc) => ({
            name: `${loc.name} E-Bin`,
            latitude: loc.lat,
            longitude: loc.lng,
            acceptedItems: [
                randomElement(ITEMS),
                randomElement(ITEMS),
                randomElement(ITEMS),
                randomElement(ITEMS)
            ].filter((v, i, a) => a.indexOf(v) === i), // Unique items
            fillLevel: randomInt(0, 100),
            status: Math.random() > 0.8 ? "full" : (Math.random() > 0.9 ? "maintenance" : "operational")
        }))

        await Bin.insertMany(bins)
        console.log(`Created ${bins.length} bins in Prayagraj.`)

        console.log("Seeding Users...")
        const users = []
        for (let i = 0; i < 5; i++) {
            users.push({
                name: `User ${i + 1}`,
                username: `user${i + 1}`,
                email: `user${i + 1}@example.com`,
                totalItemsRecycled: randomInt(5, 500),
                totalCO2Saved: parseFloat(random(1, 50).toFixed(2)),
                points: randomInt(100, 5000),
            })
        }
        await User.insertMany(users)
        console.log(`Created ${users.length} users.`)

        console.log("Seeding Rewards...")
        const rewards = [
            { title: "Coffee Voucher", pointsRequired: 500, description: "Get a free coffee at local cafes." },
            { title: "Eco Tote Bag", pointsRequired: 1000, description: "Reusable cotton tote bag." },
            { title: "$10 Gift Card", pointsRequired: 2500, description: "Redeemable at major retailers." },
            { title: "Tree Planting", pointsRequired: 3000, description: "We plant a tree in your name." },
        ]
        await Reward.insertMany(rewards)
        console.log(`Created ${rewards.length} rewards.`)

        console.log("Database seeded successfully! 🌱")
        process.exit(0)
    } catch (error) {
        console.error("Error seeding database:", error)
        process.exit(1)
    }
}

seed()
