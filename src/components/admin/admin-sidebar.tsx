"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, Users, MapPin, AlertTriangle, LogOut, Shield } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"

export default function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const navItems = [
        { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/drops", label: "Drops Management", icon: MapPin },
        { href: "/admin/logs", label: "Audit Logs", icon: Shield },
    ]

    const handleLogout = async () => {
        // Clear cookie
        document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
        router.push("/admin/login")
        router.refresh()
    }

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
            <div className="flex h-16 items-center border-b border-border px-6 gap-2">
                <Logo className="w-8 h-8" />
                <span className="font-bold text-lg">EcoAdmin</span>
            </div>

            <nav className="flex flex-col gap-2 p-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            <div className="absolute bottom-4 left-4 right-4">
                <Button
                    variant="outline"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Button>
            </div>
        </aside>
    )
}
