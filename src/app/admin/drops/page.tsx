
"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Search, Filter, Check, X, AlertOctagon } from "lucide-react"

interface IDrop {
    _id: string
    userId: { name: string; email: string }
    binId: { name: string; address: string }
    verified: boolean
    verificationMethod: string
    timeSpentInRadius: number
    confirmedAt: string
}

export default function AdminDropsPage() {
    const [drops, setDrops] = useState<IDrop[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("all")

    useEffect(() => {
        const fetchDrops = async () => {
            setLoading(true)
            try {
                const query = filter !== 'all' ? `?status=${filter}` : ''
                const response = await fetch(`/api/admin/drops${query}`)
                const data = await response.json()
                if (data.success) {
                    setDrops(data.data)
                }
            } catch (error) {
                console.error("Error", error)
            } finally {
                setLoading(false)
            }
        }
        fetchDrops()
    }, [filter])

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Verification Logs</h1>
                    <p className="text-gray-500">Audit user drop-off events and system verifications</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200">
                    <Button
                        variant={filter === "all" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setFilter("all")}
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === "verified" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setFilter("verified")}
                        className={filter === "verified" ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                        Verified
                    </Button>
                    <Button
                        variant={filter === "flagged" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setFilter("flagged")}
                        className={filter === "flagged" ? "bg-red-600 hover:bg-red-700" : ""}
                    >
                        Flagged
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900">Timestamp</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">User</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Bin Location</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Details</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {drops.map((drop) => (
                                <tr key={drop._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-600">
                                        {format(new Date(drop.confirmedAt), "MMM d, h:mm a")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{drop.userId?.name || "Unknown"}</div>
                                        <div className="text-xs text-gray-500">{drop.userId?.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-900">{drop.binId?.name}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{drop.binId?.address}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 text-xs">
                                            <span className="flex items-center gap-1 text-gray-600">
                                                <span className="font-semibold">Method:</span> {drop.verificationMethod}
                                            </span>
                                            <span className="flex items-center gap-1 text-gray-600">
                                                <span className="font-semibold">Time on site:</span> {drop.timeSpentInRadius}s
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {drop.verified ? (
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 gap-1 pl-1 pr-2">
                                                <Check className="w-3 h-3" />
                                                Verified
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-red-100 text-red-700 hover:bg-red-200 gap-1 pl-1 pr-2">
                                                <X className="w-3 h-3" />
                                                Flagged
                                            </Badge>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {drops.length === 0 && !loading && (
                    <div className="p-12 text-center text-gray-500">
                        No drop logs found matching your filter.
                    </div>
                )}
            </div>
        </div>
    )
}
