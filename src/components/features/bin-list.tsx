"use client"

import { IBin } from "@/models/Bin"
import { calculateDistance, formatDistance } from "@/lib/geo"
import { Button } from "@/components/ui/button"
import { Navigation, MapPin, Battery, Smartphone, Monitor, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

// Temporary interface until shared types
type Bin = Omit<IBin, "_id"> & { _id: string }

export interface BinListProps {
    bins: Bin[]
    userLocation: { latitude: number; longitude: number }
    usingDefaultLocation: boolean
    onBinSelect: (bin: Bin) => void
    onNavigate: (lat: number, lng: number) => void
    onDropoff?: (bin: Bin) => void
    selectedBinId?: string | null
}

export function BinList({ bins, userLocation, usingDefaultLocation, onBinSelect, onNavigate, onDropoff, selectedBinId }: BinListProps) {
    // Sort bins by distance
    const sortedBins = [...bins].map(bin => {
        const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            bin.latitude,
            bin.longitude
        )
        return { ...bin, distance }
    }).sort((a, b) => a.distance - b.distance)

    // Distance calculation logic remains...

    // handleNavigate removed, direct usage of prop below

    return (
        <div className="flex flex-col gap-3 pb-20">
            {usingDefaultLocation && (
                <div className="bg-yellow-50 text-yellow-800 text-[10px] p-2 rounded-md border border-yellow-200 text-center">
                    Using default location (Prayagraj). Enable GPS for local results.
                </div>
            )}

            {sortedBins.map((bin) => {
                const isSelected = selectedBinId === bin._id

                return (
                    <motion.div
                        key={bin._id}
                        id={`bin-${bin._id}`}
                        layoutId={bin._id}
                        className={`group relative p-3 rounded-xl border transition-all cursor-pointer ${isSelected
                            ? "bg-primary/5 border-primary shadow-md ring-1 ring-primary/20"
                            : "bg-card border-border shadow-sm hover:border-primary/50"
                            }`}
                        onClick={() => onBinSelect(bin)}
                    >
                        <div className="flex justify-between items-start gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-bold text-sm truncate pr-2">{bin.name}</h3>
                                    <div className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold ${getStatusColor(bin.status)}`}>
                                        {bin.status}
                                    </div>
                                </div>

                                <div className="flex items-center text-muted-foreground text-xs font-medium mb-2">
                                    <MapPin className="w-3 h-3 mr-1 text-primary" />
                                    <span>{formatDistance(bin.distance)} away</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex -space-x-2 overflow-hidden py-1">
                                        {bin.acceptedItems.slice(0, 5).map((item, i) => (
                                            <div
                                                key={item}
                                                className="relative z-10 w-6 h-6 flex items-center justify-center bg-secondary rounded-full ring-2 ring-background border border-border/50 text-foreground"
                                                title={item.replace("_", " ")}
                                            >
                                                {getItemIcon(item)}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-2 ml-auto">
                                        {onDropoff && (
                                            <Button
                                                size="sm"
                                                variant="default"
                                                className="h-7 px-3 text-[10px] rounded-full gap-1"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onDropoff(bin)
                                                }}
                                            >
                                                <CheckCircle2 className="w-3 h-3" />
                                                Drop Off
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="h-7 px-3 text-[10px] rounded-full gap-1"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onNavigate(bin.latitude, bin.longitude)
                                            }}
                                        >
                                            <Navigation className="w-3 h-3" />
                                            Directions
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )
            })}
        </div>
    )
}

function getStatusColor(status: string) {
    switch (status) {
        case "operational": return "bg-green-100 text-green-700"
        case "full": return "bg-red-100 text-red-700"
        case "maintenance": return "bg-yellow-100 text-yellow-700"
        default: return "bg-gray-100 text-gray-700"
    }
}

function getItemIcon(item: string) {
    if (item.includes("battery")) return <Battery className="w-4 h-4" />
    if (item.includes("phone")) return <Smartphone className="w-4 h-4" />
    if (item.includes("laptop") || item.includes("screen")) return <Monitor className="w-4 h-4" />
    return <span className="text-[10px]">{item.slice(0, 2)}</span>
}
