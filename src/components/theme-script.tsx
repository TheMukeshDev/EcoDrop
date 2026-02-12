/**
 * ThemeScript Component
 * 
 * This script runs BEFORE the page renders to immediately apply the correct theme.
 * This prevents the "flash of unstyled content" (FOUC) that occurs when switching themes.
 * 
 * It must be included in the <head> or early in <body> of layout.tsx
 * 
 * @example
 * import { ThemeScript } from '@/components/theme-script'
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <head>
 *         <ThemeScript />
 *       </head>
 *       <body>{children}</body>
 *     </html>
 *   )
 * }
 */

export function ThemeScript() {
  const themeScript = `
    (function() {
      try {
        const storageKey = 'ecodrop-theme'
        const theme = localStorage.getItem(storageKey)
        
        // Helper to get system preference
        function getSystemTheme() {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        
        // Helper to resolve theme
        function resolveTheme(selectedTheme) {
          return selectedTheme === 'system' ? getSystemTheme() : selectedTheme
        }
        
        // Apply theme immediately
        function applyTheme(themeTApply) {
          const root = document.documentElement
          root.classList.remove('light', 'dark')
          root.classList.add(themeTApply)
          root.setAttribute('data-theme', themeTApply)
        }
        
        // Determine which theme to use
        const themeToApply = resolveTheme(theme || 'system')
        
        // Apply theme before React renders
        applyTheme(themeToApply)
      } catch (e) {
        // Silently fail if localStorage is not available
        console.error('Failed to apply theme:', e)
      }
    })()
  `

  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  )
}
