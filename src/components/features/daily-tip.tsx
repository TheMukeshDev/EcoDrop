
"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Lightbulb, Trophy, MapPin, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface DailyTipProps {
    className?: string
}

export function DailyTip({ className }: DailyTipProps) {
    const [tip, setTip] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchTip() {
            try {
                const res = await fetch("/api/notifications/daily")
                const data = await res.json()
                if (data.success) {
                    setTip(data.data)
                }
            } catch (error) {
                console.error("Failed to fetch daily tip", error)
            } finally {
                setLoading(false)
            }
        }
        fetchTip()
    }, [])

    if (loading) return <Skeleton className="w-full h-24 rounded-2xl" />
    if (!tip) return null

    const getIcon = (cat: string) => {
        switch (cat) {
            case "awareness": return <Lightbulb className="w-5 h-5 text-yellow-600" />
            case "action": return <AlertCircle className="w-5 h-5 text-blue-600" />
            case "local": return <MapPin className="w-5 h-5 text-green-600" />
            case "gamification": return <Trophy className="w-5 h-5 text-purple-600" />
            default: return <Lightbulb className="w-5 h-5 text-yellow-600" />
        }
    }

    const getBgColor = (cat: string) => {
        switch (cat) {
            case "awareness": return "bg-yellow-50 border-yellow-100"
            case "action": return "bg-blue-50 border-blue-100"
            case "local": return "bg-green-50 border-green-100"
            case "gamification": return "bg-purple-50 border-purple-100"
            default: return "bg-secondary/30 border-border"
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={className}
        >
            <Card className={`border shadow-sm ${getBgColor(tip.category)}`}>
                <CardContent className="p-4 flex gap-4 items-start">
                    <div className="p-2 bg-white rounded-full shadow-sm shrink-0">
                        {getIcon(tip.category)}
                    </div>
                    <div>
                        <h3 className="font-bold text-sm mb-1">{tip.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {tip.message}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
