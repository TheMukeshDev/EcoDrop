import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import { AuthProvider } from "@/context/auth-context";
import { LanguageProvider } from "@/context/language-context";
import { ThemeProvider } from "@/context/theme-context";
import { ThemeScript } from "@/components/theme-script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EcoDrop - Smart E-Waste Bin",
  description: "Find bins, recycle e-waste, and earn rewards.",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg", // Apple touch icon usually prefers PNG
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AuthProvider>
            <LanguageProvider>
              <div className="min-h-screen flex justify-center md:bg-zinc-100 dark:md:bg-zinc-950 md:items-center md:py-8">
                <div className="flex flex-col relative w-full max-w-md h-dvh md:h-212.5 bg-background md:rounded-4xl md:shadow-2xl md:border overflow-hidden ring-1 ring-zinc-900/5 dark:ring-white/10">
                  <Header />
                  <main className="flex-1 w-full p-4 pt-6 overflow-y-auto scrollbar-hide pb-24">
                    {children}
                  </main>
                  {/* Bottom Nav is constrained within this container due to strict width, but fixed positioning might break out. 
                    However, BottomNav uses `fixed bottom-0` which routes to viewport. 
                    To fix this for the "phone view" on desktop, BottomNav needs to be absolute within this relative container 
                    OR we accept it floats at bottom of screen on desktop (which is weird). 
                    
                    BETTER FIX: In BottomNav, change `fixed` to `absolute` when on desktop if we want it inside of the phone frame?
                    Actually, `layout.tsx` defines the container. If I leave BottomNav as fixed, it attaches to window.
                    Solution: Create a context or just update BottomNav to be `absolute bottom-0` and the container relative.
                  */}
                  <div className="md:absolute md:bottom-0 md:w-full z-50">
                    <BottomNav />
                  </div>
                </div>
              </div>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
