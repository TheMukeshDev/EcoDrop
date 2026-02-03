"use client"

import { useState, useEffect } from "react"
import { Search, Shield, ShieldAlert, User as UserIcon, MoreHorizontal, ArrowLeft, ArrowRight as ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"

interface User {
    id: string
    name: string
    email: string
    role: "user" | "admin"
    points: number
    totalItemsRecycled: number
    joinDate: string
    isActive: boolean
}

export default function UsersPage() {
    const { user: currentUser } = useAuth()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
                search
            })

            const res = await fetch(`/api/admin/users?${params}`, {
                headers: {
                    'x-admin-id': currentUser?._id || ''
                }
            })
            const data = await res.json()

            if (data.success) {
                setUsers(data.data.users)
                setTotalPages(data.data.pagination.totalPages)
            } else {
                toast.error(data.error || "Failed to fetch users")
            }
        } catch (error) {
            console.error("Fetch users error:", error)
        } finally {
            setLoading(false)
        }
    }

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1)
            fetchUsers()
        }, 500)
        return () => clearTimeout(timer)
    }, [search])

    useEffect(() => {
        fetchUsers()
    }, [page, currentUser])

    const handleRoleUpdate = async (userId: string, newRole: "user" | "admin") => {
        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'x-admin-id': currentUser?._id || ''
                },
                body: JSON.stringify({ id: userId, role: newRole })
            })
            const data = await res.json()

            if (data.success) {
                toast.success(`User role updated to ${newRole}`)
                fetchUsers() // Refresh list
            } else {
                toast.error(data.error || "Failed to update role")
            }
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-muted-foreground">Manage user accounts and permissions.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            className="pl-9"
                            value={search}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Stats</th>
                                <th className="px-6 py-3">Joined</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="bg-white border-b">
                                        <td className="px-6 py-4"><Skeleton className="h-10 w-40" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-6 w-24" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-6 w-24" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-8 w-8 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{user.name}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-green-100 text-green-700'
                                                }`}>
                                                {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-medium bg-secondary px-2 py-0.5 rounded-md w-fit">
                                                    {user.points} pts
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {user.totalItemsRecycled} items recycled
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(user.joinDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleRoleUpdate(user.id, user.role === 'admin' ? 'user' : 'admin')}>
                                                        {user.role === 'admin' ? (
                                                            <>
                                                                <UserIcon className="mr-2 h-4 w-4" /> Demote to User
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Shield className="mr-2 h-4 w-4" /> Promote to Admin
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                                        <ShieldAlert className="mr-2 h-4 w-4" /> Ban User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Page {page} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" /> Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Next <ArrowRightIcon className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
