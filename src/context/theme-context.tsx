"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { toast } from "sonner"

type Theme = "dark" | "light" | "system"

interface ThemeContextType {
  theme: Theme
  resolvedTheme: "dark" | "light"
  isLoaded: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * Hook to use the theme context
 * @throws Error if used outside of ThemeProvider
 */
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
  enableTransitions?: boolean
}

/**
 * ThemeProvider component that manages light/dark theme across the application.
 * 
 * Features:
 * - Persists theme preference to localStorage
 * - Defaults to system theme if no preference is saved
 * - Supports three modes: "light", "dark", and "system"
 * - Syncs theme across browser tabs
 * - Responsive to system theme changes
 * - Prevents hydration mismatches
 * - Smooth transitions between themes
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ecodrop-theme",
  enableTransitions = true
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("light")
  const [isLoaded, setIsLoaded] = useState(false)

  /**
   * Get the system's color scheme preference
   */
  const getSystemTheme = (): "dark" | "light" => {
    if (typeof window === "undefined") return "light"
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }

  /**
   * Resolve the actual theme based on the selected mode
   */
  const resolveTheme = (selectedTheme: Theme): "dark" | "light" => {
    return selectedTheme === "system" ? getSystemTheme() : selectedTheme
  }

  /**
   * Apply theme to the document root element
   */
  const applyTheme = (newTheme: "dark" | "light") => {
    const root = document.documentElement

    // Add transition class if enabled
    if (enableTransitions) {
      root.classList.add("theme-transition")
    }

    // Update theme
    root.classList.remove("light", "dark")
    root.classList.add(newTheme)
    root.setAttribute("data-theme", newTheme)

    // Remove transition class after animation
    if (enableTransitions) {
      setTimeout(() => {
        root.classList.remove("theme-transition")
      }, 300)
    }

    setResolvedTheme(newTheme)
  }

  /**
   * Set theme and persist to localStorage
   */
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(storageKey, newTheme)

    const actualTheme = resolveTheme(newTheme)
    applyTheme(actualTheme)

    // Show toast notification
    if (actualTheme === "dark") {
      toast.success("Dark mode enabled 🌙", {
        duration: 2000,
        position: "bottom-center",
      })
    } else {
      toast.success("Light mode enabled ☀️", {
        duration: 2000,
        position: "bottom-center",
      })
    }
  }

  /**
   * Toggle between light and dark modes
   */
  const toggleTheme = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark"
    setTheme(newTheme)
  }

  /**
   * Initialize theme on component mount
   */
  useEffect(() => {
    // Retrieve saved theme from localStorage or use default
    const savedTheme = (localStorage.getItem(storageKey) as Theme) || defaultTheme
    setThemeState(savedTheme)

    // Apply the resolved theme
    const actualTheme = resolveTheme(savedTheme)
    applyTheme(actualTheme)

    // Mark as loaded to prevent hydration mismatch
    setIsLoaded(true)
  }, [storageKey, defaultTheme])

  /**
   * Listen for system theme changes (if using system mode)
   */
  useEffect(() => {
    if (theme !== "system") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      const newResolvedTheme = getSystemTheme()
      applyTheme(newResolvedTheme)
    }

    // Modern API
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
    // Fallback for older browsers
    else {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [theme])

  /**
   * Sync theme across browser tabs
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        const newTheme = e.newValue as Theme
        setThemeState(newTheme)
        const actualTheme = resolveTheme(newTheme)
        applyTheme(actualTheme)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [storageKey])

  // Don't render until theme is loaded to prevent hydration mismatch
  if (!isLoaded) {
    return <>{children}</>
  }

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    isLoaded,
    setTheme,
    toggleTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}