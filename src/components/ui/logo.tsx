import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
    className?: string
    variant?: "default" | "white"
}

export function Logo({ className, variant = "default" }: LogoProps) {
    return (
        <div className={cn("relative shrink-0 rounded-full overflow-hidden", className)}>
            <Image
                src="/logo.svg"
                alt="EcoDrop Logo"
                fill
                className="object-contain"
                sizes="100px"
                priority
            />
        </div>
    )
}
