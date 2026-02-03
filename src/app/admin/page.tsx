"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminRootPage() {
    const router = useRouter()
    useEffect(() => {
        router.push("/admin/dashboard")
    }, [])
    return <div className="flex h-screen items-center justify-center">Loading Admin Panel...</div>
}