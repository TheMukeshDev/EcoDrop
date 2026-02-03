"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Lock, Unlock, User as UserIcon } from "lucide-react"

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchUsers = async () => {
        const res = await fetch("/api/admin/users")
        const data = await res.json()
        if (data.success) setUsers(data.users)
        setLoading(false)
    }

    useEffect(() => { fetchUsers() }, [])

    const toggleStatus = async (userId: string, currentStatus: boolean) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? "block" : "activate"} this user?`)) return
        const res = await fetch("/api/admin/users", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, isActive: !currentStatus })
        })
        const data = await res.json()
        if (data.success) {
            toast.success(data.message)
            fetchUsers()
        } else {
            toast.error(data.error)
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">User Management</h1>
            <Card>
                <CardHeader><CardTitle>Registered Users</CardTitle></CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-secondary/50 uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Points</th>
                                    <th className="px-4 py-3">CO2 Saved</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id} className="border-b border-border/50">
                                        <td className="px-4 py-3">
                                            <div className="font-medium">{u.name}</div>
                                            <div className="text-xs text-muted-foreground">{u.email}</div>
                                        </td>
                                        <td className="px-4 py-3">{u.points}</td>
                                        <td className="px-4 py-3">{u.totalCO2Saved}kg</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs ${u.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                                {u.isActive ? "Active" : "Blocked"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button
                                                size="sm"
                                                variant={u.isActive ? "destructive" : "default"}
                                                onClick={() => toggleStatus(u._id, u.isActive)}
                                            >
                                                {u.isActive ? <Lock className="w-4 h-4 mr-1" /> : <Unlock className="w-4 h-4 mr-1" />}
                                                {u.isActive ? "Block" : "Unblock"}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
