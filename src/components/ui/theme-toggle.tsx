"use client"

import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/context/theme-context"

interface ThemeToggleProps {
  className?: string
  size?: "sm" | "md" | "lg"
  showTooltip?: boolean
}

export function ThemeToggle({ 
  className = "", 
  size = "md",
  showTooltip = true 
}: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  
  const sizeClasses = {
    sm: "w-8 h-8 p-1.5",
    md: "w-10 h-10 p-2",
    lg: "w-12 h-12 p-3"
  }
  
  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  }

  const tooltipText = isDark ? "Switch to Light Mode" : "Switch to Dark Mode"
  const Icon = isDark ? Sun : Moon

  return (
    <div className="relative group">
      <motion.button
        type="button"
        className={`
          relative overflow-hidden rounded-full 
          bg-gradient-to-br from-green-500/20 to-emerald-600/20
          dark:from-green-600/30 dark:to-emerald-700/30
          border border-green-500/20 dark:border-green-400/20
          hover:scale-105 active:scale-95
          transition-all duration-200 ease-out
          ${sizeClasses[size]}
          ${className}
        `}
        onClick={toggleTheme}
        aria-label={tooltipText}
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)" 
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Background glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 opacity-0"
          animate={{ opacity: isDark ? 0.1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Icon container */}
        <motion.div
          className="relative z-10 flex items-center justify-center w-full h-full"
          initial={{ rotate: 0 }}
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: isDark ? 0 : 1, 
              opacity: isDark ? 0 : 1 
            }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <Sun className={`${iconSizes[size]} text-yellow-500 dark:text-yellow-400`} />
          </motion.div>
          
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: isDark ? 1 : 0, 
              opacity: isDark ? 1 : 0 
            }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <Moon className={`${iconSizes[size]} text-blue-400 dark:text-blue-300`} />
          </motion.div>
          
          {/* Always render the current icon for accessibility */}
          <Icon className={`${iconSizes[size]} opacity-0`} />
        </motion.div>

        {/* Ripple effect on click */}
        <motion.span
          className="absolute inset-0 rounded-full bg-white/20"
          initial={{ scale: 0, opacity: 0.5 }}
          whileTap={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </motion.button>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 
                     bg-gray-900 dark:bg-gray-100 
                     text-white dark:text-gray-900 
                     text-xs px-2 py-1 rounded-md 
                     whitespace-nowrap opacity-0 group-hover:opacity-100
                     pointer-events-none transition-opacity duration-200
                     z-50"
          role="tooltip"
          aria-hidden="true"
        >
          {tooltipText}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
          </div>
        </div>
      )}
    </div>
  )
}