"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Lock, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/context/language-context"
import { useTheme } from "@/context/theme-context"
import { Logo } from "@/components/ui/logo"

function VerifyOTPContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { t } = useTranslation()
    const { resolvedTheme } = useTheme()
    const email = searchParams.get("email") || ""

    const [otp, setOtp] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [timeLeft, setTimeLeft] = useState(300) // 5 minutes

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0) return

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6)
        setOtp(value)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        if (otp.length !== 6) {
            setError("Please enter a 6-digit OTP")
            setLoading(false)
            return
        }

        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp })
            })

            const data = await res.json()

            if (data.success) {
                // Redirect to reset password page
                router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`)
            } else {
                setError(data.error || "Invalid OTP")
            }
        } catch (error: any) {
            console.error("OTP verification error:", error)
            setError("OTP verification failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <Logo className="w-20 h-20 shadow-xl rounded-full" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Verify OTP</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Enter the 6-digit code sent to your email
                    </p>
                </div>

                {/* Timer */}
                <div className="text-center mb-6">
                    <div className={`text-sm font-medium ${timeLeft < 60 ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"}`}>
                        Time remaining: {formatTime(timeLeft)}
                    </div>
                    {timeLeft === 0 && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-2">OTP has expired. Please request a new one.</p>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg"
                    >
                        <p className="text-red-800 dark:text-red-200 text-sm text-center">{error}</p>
                    </motion.div>
                )}

                {/* Form */}
                {timeLeft > 0 ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                6-Digit OTP
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={handleOtpChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:focus:ring-green-400 transition-all duration-200 outline-none text-center text-2xl tracking-widest"
                                    placeholder="000000"
                                    maxLength={6}
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Only numbers are accepted</p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-linear-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 dark:from-green-500 dark:to-blue-500 dark:hover:from-green-600 dark:hover:to-blue-600 text-white font-medium transition-all duration-200"
                            disabled={loading || otp.length !== 6}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Verifying...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    Verify OTP
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </span>
                            )}
                        </Button>
                    </form>
                ) : (
                    <div className="text-center">
                        <Link href="/auth/forgot-password" className="text-green-600 dark:text-green-400 font-medium hover:underline">
                            Request a new OTP
                        </Link>
                    </div>
                )}

                {/* Back to Forgot Password */}
                <p className="text-center mt-6">
                    <Link href="/auth/forgot-password" className="text-green-600 dark:text-green-400 font-medium hover:underline flex items-center justify-center gap-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>
                </p>
            </motion.div>
        </div>
    )
}

export default function VerifyOTPPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <VerifyOTPContent />
        </Suspense>
    )
}
