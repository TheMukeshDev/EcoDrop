import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function Header() {
    return (
        <header className="sticky top-0 z-40 w-full glass border-b-0">
            <div className="flex h-16 items-center justify-between px-6 max-w-md mx-auto">
                <div className="flex items-center">
                    <div className="relative h-9 w-32 shrink-0">
                        <Image
                            src="/header.svg"
                            alt="EcoDrop"
                            fill
                            className="object-contain object-left brightness-0 invert"
                            priority
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle size="sm" />
                    <LanguageSwitcher />
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Share2 className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    )
}
