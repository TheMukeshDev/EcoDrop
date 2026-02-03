"use client"

import { useEffect, useState } from "react"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table" // Using Shadcn table if available basically table tags
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, AlertOctagon, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DropsManagementPage() {
    const [drops, setDrops] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)

    const fetchDrops = async () => {
        try {
            const res = await fetch("/api/admin/drops")
            const data = await res.json()
            if (data.success) {
                setDrops(data.drops)
            }
        } catch (error) {
            toast.error("Failed to load drops")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDrops()
    }, [])

    const handleStatusUpdate = async (dropId: string, status: string) => {
        if (!confirm(`Are you sure you want to mark this as ${status}?`)) return

        setProcessingId(dropId)
        try {
            const res = await fetch("/api/admin/drops", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    dropId,
                    status,
                    reasoning: status === "rejected" ? "Admin manual rejection" : "Admin approval"
                })
            })

            const data = await res.json()
            if (data.success) {
                toast.success(`Drop marked as ${status}`)
                fetchDrops()
            } else {
                toast.error(data.error || "Action failed")
            }
        } catch (error) {
            toast.error("Network error")
        } finally {
            setProcessingId(null)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            default: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Drop Verification</h1>
                <Button onClick={fetchDrops} variant="outline" size="sm">
                    Refresh
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Drop Activities</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-secondary/50 text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3">User</th>
                                        <th className="px-4 py-3">Item</th>
                                        <th className="px-4 py-3">Bin Location</th>
                                        <th className="px-4 py-3">Points</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {drops.map((drop) => (
                                        <tr key={drop._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                            <td className="px-4 py-3 font-medium">
                                                {drop.userId?.name || "Unknown"}
                                                <div className="text-xs text-muted-foreground">{drop.userId?.email}</div>
                                            </td>
                                            <td className="px-4 py-3 capitalize">{drop.itemName} ({drop.itemType})</td>
                                            <td className="px-4 py-3">{drop.binId?.name || "N/A"}</td>
                                            <td className="px-4 py-3 font-bold">+{drop.pointsEarned}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(drop.status)}`}>
                                                    {drop.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-muted-foreground">
                                                {new Date(drop.createdAt).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-right space-x-2">
                                                {drop.status === "pending" && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                                                            onClick={() => handleStatusUpdate(drop._id, "approved")}
                                                            disabled={!!processingId}
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => handleStatusUpdate(drop._id, "rejected")}
                                                            disabled={!!processingId}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </>
                                                )}
                                                {drop.status === "approved" && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleStatusUpdate(drop._id, "rejected")}
                                                        disabled={!!processingId}
                                                        title="Revoke Approval (Fraud)"
                                                    >
                                                        <AlertOctagon className="w-4 h-4 mr-1" />
                                                        Revoke
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {drops.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                                No drop records found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
