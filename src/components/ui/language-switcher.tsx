"use client"

import { useTranslation } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageSwitcher() {
    const { language, setLanguage } = useTranslation()

    const languages = {
        en: "English",
        hi: "हिंदी",
        hinglish: "Hinglish"
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
                    <Globe className="h-4 w-4" />
                    <span className="sr-only">Switch Language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-accent" : ""}>
                    English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("hi")} className={language === "hi" ? "bg-accent" : ""}>
                    हिंदी (Hindi)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("hinglish")} className={language === "hinglish" ? "bg-accent" : ""}>
                    Hinglish
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
