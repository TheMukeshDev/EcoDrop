"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { motionItem } from "@/components/ui/motion-wrapper"

interface ActivityItemProps {
    title: string
    time: string
    points: number
    icon: LucideIcon
}

export function ActivityItem({ title, time, points, icon: Icon }: ActivityItemProps) {
    return (
        <motion.div
            className="flex items-center justify-between p-3 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm cursor-pointer hover:bg-card/80 transition-colors"
            variants={motionItem}
            whileHover="hover"
            whileTap="tap"
        >
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-foreground truncate">{title}</span>
                    <span className="text-xs text-muted-foreground">{time}</span>
                </div>
            </div>
            <div className="text-sm font-semibold text-primary whitespace-nowrap">
                +{points}
            </div>
        </motion.div>
    )
}
