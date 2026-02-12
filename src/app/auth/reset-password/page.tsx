"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/context/language-context"
import { useTheme } from "@/context/theme-context"
import { Logo } from "@/components/ui/logo"

function ResetPasswordContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { t } = useTranslation()
    const { resolvedTheme } = useTheme()
    const email = searchParams.get("email") || ""
    const otp = searchParams.get("otp") || ""

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters")
            return
        }

        setLoading(true)

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    otp,
                    newPassword: formData.password
                })
            })

            const data = await res.json()

            if (data.success) {
                setSuccess(true)
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    router.push("/auth/login")
                }, 2000)
            } else {
                setError(data.error || "Failed to reset password")
            }
        } catch (error: any) {
            console.error("Reset password error:", error)
            setError("Failed to reset password. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 transition-colors duration-300">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md text-center"
                >
                    <div className="mb-6">
                        <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Password Reset!</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Your password has been successfully reset. You can now login with your new password.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Redirecting to login page...</p>
                </motion.div>
            </div>
        )
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Enter your new password
                    </p>
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
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:focus:ring-green-400 transition-all duration-200 outline-none"
                                placeholder="Enter new password (min 8 characters)"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all duration-200 outline-none ${formData.confirmPassword && formData.password === formData.confirmPassword
                                    ? "border-green-500 dark:border-green-400 focus:ring-green-500 dark:focus:ring-green-400"
                                    : "border-gray-300 dark:border-gray-600 focus:ring-green-500/30 dark:focus:ring-green-400/30"
                                    }`}
                                placeholder="Confirm password"
                                required
                            />
                        </div>
                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                            <p className="text-xs text-green-600 dark:text-green-400 ml-1 mt-1">✓ Passwords match</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-linear-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 dark:from-green-500 dark:to-blue-500 dark:hover:from-green-600 dark:hover:to-blue-600 text-white font-medium transition-all duration-200"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Resetting...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                Reset Password
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </span>
                        )}
                    </Button>
                </form>

                {/* Back to Login */}
                <p className="text-center mt-6">
                    <Link href="/auth/login" className="text-green-600 dark:text-green-400 font-medium hover:underline flex items-center justify-center gap-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </Link>
                </p>
            </motion.div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    )
}
