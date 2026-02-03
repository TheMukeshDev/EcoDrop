import { Leaf } from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"

interface StatsCardProps {
    points: number
    weeklyPoints: number
    totalItems: number
    co2Saved: number
    className?: string
}

export function StatsCard({ points, weeklyPoints, totalItems, co2Saved, className }: StatsCardProps) {
    return (
        <div className={cn("relative overflow-hidden rounded-3xl bg-black p-6 text-white shadow-2xl shadow-primary/20", className)}>
            {/* Abstract Background Blobs */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-blue-500/30 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white/70">Total Impact</span>
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                        <Logo className="h-5 w-5" />
                    </div>
                </div>

                {/* Main Stat */}
                <div className="flex flex-col">
                    <span className="text-4xl font-bold tracking-tight">{points?.toLocaleString() || 0}</span>
                    <span className="text-sm text-primary font-medium">+{weeklyPoints?.toLocaleString() || 0} this week</span>
                </div>

                {/* Badges / Pills */}
                <div className="flex flex-wrap gap-2 mt-2">
                    <div className="flex items-center justify-center px-4 py-1.5 rounded-full bg-white/10 text-xs font-medium backdrop-blur-md border border-white/10 whitespace-nowrap min-w-[80px]">
                        {totalItems} Items
                    </div>
                    <div className="flex items-center justify-center px-4 py-1.5 rounded-full bg-white/10 text-xs font-medium backdrop-blur-md border border-white/10 whitespace-nowrap min-w-[100px]">
                        {co2Saved}kg CO₂ Saved
                    </div>
                </div>
            </div>
        </div>
    )
}
