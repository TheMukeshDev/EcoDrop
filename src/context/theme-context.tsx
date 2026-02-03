"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { toast } from "sonner"

type Theme = "dark" | "light" | "system"

interface ThemeContextType {
  theme: Theme
  resolvedTheme: "dark" | "light"
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({ 
  children, 
  defaultTheme = "system",
  storageKey = "ecodrop-theme"
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("light")

  // Get system preference
  const getSystemTheme = (): "dark" | "light" => {
    if (typeof window === "undefined") return "light"
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }

  // Resolve actual theme based on selection
  const resolveTheme = (selectedTheme: Theme): "dark" | "light" => {
    return selectedTheme === "system" ? getSystemTheme() : selectedTheme
  }

  // Apply theme to document
  const applyTheme = (newTheme: "dark" | "light") => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(newTheme)
    setResolvedTheme(newTheme)
  }

  // Set theme and persist
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(storageKey, newTheme)
    
    const actualTheme = resolveTheme(newTheme)
    applyTheme(actualTheme)
    
    // Show toast notification
    if (actualTheme === "dark") {
      toast.success("Dark mode enabled 🌙")
    } else {
      toast.success("Light mode enabled ☀️")
    }
  }

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark"
    setTheme(newTheme)
  }

  // Initialize theme on mount
  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem(storageKey) as Theme
    
    // Use saved theme or default
    const initialTheme = savedTheme || defaultTheme
    setThemeState(initialTheme)
    
    const actualTheme = resolveTheme(initialTheme)
    applyTheme(actualTheme)
  }, [storageKey, defaultTheme])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    
    const handleChange = () => {
      if (theme === "system") {
        const newResolvedTheme = getSystemTheme()
        applyTheme(newResolvedTheme)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  // Sync theme across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        const newTheme = e.newValue as Theme
        setThemeState(newTheme)
        applyTheme(resolveTheme(newTheme))
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [storageKey])

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}