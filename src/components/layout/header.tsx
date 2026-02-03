import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"

import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function Header() {
    return (
        <header className="sticky top-0 z-40 w-full glass border-b-0 transition-colors duration-300">
            <div className="flex h-16 items-center justify-between px-6 max-w-md mx-auto">
                <div className="flex items-center gap-2">
                    <Logo className="w-8 h-8" />
                    <span className="text-xl font-bold tracking-tight text-foreground transition-colors">
                        Eco<span className="text-primary">Drop</span>
                    </span>
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
