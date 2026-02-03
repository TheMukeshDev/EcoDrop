"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ActionCardProps {
    href: string
    icon: ReactNode
    title: string
    subtitle: string
    className?: string
    color?: "primary" | "secondary"
}

export function ActionCard({ href, icon, title, subtitle, className, color = "primary" }: ActionCardProps) {
    return (
        <Link href={href} className="block h-full">
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="h-full"
            >
                <Card className={cn(
                    "h-full transition-colors border-transparent shadow-lg",
                    color === "primary"
                        ? "bg-primary/5 hover:bg-primary/10 border-primary/10"
                        : "bg-secondary/5 hover:bg-secondary/10 border-secondary/10",
                    className
                )}>
                    <CardContent className="flex flex-col items-center justify-center p-6 gap-4 text-center h-full">
                        <div className={cn(
                            "h-14 w-14 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                            color === "primary"
                                ? "bg-primary text-primary-foreground shadow-primary/20"
                                : "bg-secondary text-secondary-foreground shadow-secondary/20"
                        )}>
                            {icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">{title}</h3>
                            <p className="text-sm text-muted-foreground">{subtitle}</p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </Link>
    )
}
