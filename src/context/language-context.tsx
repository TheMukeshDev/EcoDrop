"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import en from "@/locales/en.json"
import hi from "@/locales/hi.json"
import hinglish from "@/locales/hinglish.json"

type Language = "en" | "hi" | "hinglish"
type Translations = typeof en

const translations: Record<Language, Translations> = {
    en,
    hi,
    hinglish
}

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: keyof Translations) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>("en")

    useEffect(() => {
        // Load persisted language on mount
        const savedLang = localStorage.getItem("app_language") as Language
        if (savedLang && ["en", "hi", "hinglish"].includes(savedLang)) {
            setLanguageState(savedLang)
        }
    }, [])

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        localStorage.setItem("app_language", lang)
    }

    const t = (key: keyof Translations) => {
        const translation = translations[language][key]
        return translation || translations["en"][key] || key
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useTranslation() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error("useTranslation must be used within a LanguageProvider")
    }
    return context
}
