"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle2, AlertTriangle, ScanLine, Leaf, Clock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/admin/stats")
                const data = await res.json()
                if (data.success) {
                    setStats(data.stats)
                }
            } catch (error) {
                console.error("Failed to load stats")
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const statCards = [
        {
            title: "Total Users",
            value: stats?.totalUsers || 0,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Verified Drops",
            value: stats?.verifiedDrops || 0,
            icon: CheckCircle2,
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            title: "Pending Drops",
            value: stats?.pendingDrops || 0,
            icon: Clock,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        },
        {
            title: "Scan Attempts",
            value: stats?.totalScans || 0,
            icon: ScanLine,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            title: "Suspicious Users",
            value: stats?.suspiciousUsers || 0,
            icon: AlertTriangle,
            color: "text-red-500",
            bg: "bg-red-500/10"
        },
        {
            title: "CO₂ Saved (kg)",
            value: stats?.totalCO2?.toFixed(1) || 0,
            icon: Leaf,
            color: "text-emerald-600",
            bg: "bg-emerald-600/10"
        }
    ]

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <Skeleton className="h-4 w-1/2 mb-4" />
                            <Skeleton className="h-8 w-1/4" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, i) => (
                    <Card key={i} className="border-border/50 hover:border-border transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                            <div className={`p-2 rounded-full ${stat.bg}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Placeholder for Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="min-h-[300px] flex items-center justify-center border-dashed">
                    <p className="text-muted-foreground">Activity Chart (Coming Soon)</p>
                </Card>
                <Card className="min-h-[300px] flex items-center justify-center border-dashed">
                    <p className="text-muted-foreground">Drop Locations Map (Coming Soon)</p>
                </Card>
            </div>
        </div>
    )
}
