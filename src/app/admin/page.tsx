
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Users, Package, TrendingUp, AlertTriangle } from "lucide-react"

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalBins: 0,
        activeBins: 0,
        fullBins: 0,
        maintenanceBins: 0,
        totalVerifiedDrops: 0,
        totalCO2Saved: 0,
        totalUsers: 0,
        activeUsers: 0,
        todayVerifiedDrops: 0,
        todayCO2Saved: 0,
        weeklyGrowth: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch("/api/admin/stats")
                if (response.ok) {
                    const data = await response.json()
                    if (data.success) {
                        setStats(data.data)
                    }
                }
            } catch (error) {
                console.error("Failed to fetch stats:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    const StatCard = ({ title, value, icon, color = "blue", trend }: any) => (
        <Card className="bg-white border text-card-foreground shadow-sm">
            <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    {trend && (
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                            {trend === "up" ? "↑" : "↓"} {Math.abs(stats.weeklyGrowth)}%
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-4 pt-2">
                    <div className={`p-3 rounded-xl bg-${color}-50`}>
                        {icon}
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{value}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Updated just now
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    if (loading) {
        return (
            <div className="flexh-[calc(100vh-4rem)] items-center justify-center">
                <div className="w-8 h-8 border-4 border-t-green-600 border-solid rounded-full border-t-transparent animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600 mt-2">
                    Welcome back, Admin. Here's what's happening in your city today.
                </p>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Bins"
                    value={`${stats.activeBins}/${stats.totalBins}`}
                    color="green"
                    icon={<div className="w-5 h-5 text-green-600">♻️</div>}
                />
                <StatCard
                    title="Full Bins"
                    value={stats.fullBins}
                    color="red"
                    icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
                />
                <StatCard
                    title="Total Drops"
                    value={stats.totalVerifiedDrops}
                    color="blue"
                    trend="up"
                    icon={<CheckCircle className="w-5 h-5 text-blue-600" />}
                />
                <StatCard
                    title="CO₂ Saved"
                    value={`${stats.totalCO2Saved}kg`}
                    color="emerald"
                    trend="up"
                    icon={<div className="font-bold text-emerald-600 text-xs">CO₂</div>}
                />
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Activity Chart Area (Placeholder for now) */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm min-h-[400px]">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Activity Trends</h3>
                    <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        Chart: Daily Verified Drops vs CO₂ Saced
                    </div>
                </div>

                {/* Right Side - Today's Highlights */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Impact</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Package className="w-5 h-5 text-purple-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">New Deposits</p>
                                        <p className="text-xs text-purple-600">Today</p>
                                    </div>
                                </div>
                                <span className="text-xl font-bold text-gray-900">{stats.todayVerifiedDrops}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 text-emerald-600 font-bold text-xs flex items-center justify-center">CO₂</div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Carbon Saved</p>
                                        <p className="text-xs text-emerald-600">Today</p>
                                    </div>
                                </div>
                                <span className="text-xl font-bold text-gray-900">{stats.todayCO2Saved}kg</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-600">Total Users</span>
                            <span className="font-bold text-gray-900">{stats.totalUsers}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Active (24h)</span>
                            <span className="font-bold text-blue-600">{stats.activeUsers}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}