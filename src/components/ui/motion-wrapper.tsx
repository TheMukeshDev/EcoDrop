"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface MotionWrapperProps {
    children: ReactNode
    className?: string
    delay?: number
    direction?: "up" | "down" | "left" | "right" | "none"
    variant?: "fadeIn" | "slideUp" | "scale" | "none"
}

export function MotionWrapper({
    children,
    className,
    delay = 0,
    direction = "up",
    variant = "slideUp",
}: MotionWrapperProps) {
    const getVariants = () => {
        switch (variant) {
            case "fadeIn":
                return {
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                }
            case "scale":
                return {
                    hidden: { opacity: 0, scale: 0.95 },
                    visible: { opacity: 1, scale: 1 },
                }
            case "slideUp":
            default:
                const offset = 20
                const x = direction === "left" ? offset : direction === "right" ? -offset : 0
                const y = direction === "up" ? offset : direction === "down" ? -offset : 0

                return {
                    hidden: { opacity: 0, x, y },
                    visible: { opacity: 1, x: 0, y: 0 },
                }
        }
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={getVariants()}
            transition={{
                duration: 0.5,
                delay: delay,
                ease: [0.21, 0.47, 0.32, 0.98], // Custom spring-like easing
            }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    )
}

export const motionItem = {
    hover: { y: -4, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } },
}
