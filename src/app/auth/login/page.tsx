"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useTranslation } from "@/context/language-context"
import { useTheme } from "@/context/theme-context"
import { Logo } from "@/components/ui/logo"

function LoginContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { t } = useTranslation()
    const { login } = useAuth()
    const { resolvedTheme } = useTheme()
    const registered = searchParams.get("registered")
    const redirectUrl = searchParams.get("redirect") || "/"

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (data.success) {
                login(data.data)
                router.push(redirectUrl)
            } else {
                setError(data.error || "Login failed")
            }
        } catch (error: any) {
            console.error("Login error:", error)
            setError("Login failed")
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("welcome_back")}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{t("signin_continue")}</p>
                </div>

                {/* Registration Success Message */}
                {registered === "success" && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg"
                    >
                        <p className="text-green-800 dark:text-green-200 text-sm text-center">
                            🎉 {t("reg_success")}
                        </p>
                    </motion.div>
                )}

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

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t("email")}
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:focus:ring-green-400 transition-all duration-200 outline-none"
                                placeholder={t("email_placeholder")}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t("password")}
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:focus:ring-green-400 transition-all duration-200 outline-none"
                                placeholder={t("password_placeholder")}
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

                    <Button
                        type="submit"
                        className="w-full bg-linear-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 dark:from-green-500 dark:to-blue-500 dark:hover:from-green-600 dark:hover:to-blue-600 text-white font-medium transition-all duration-200"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                {t("signing_in")}
                            </span>
                        ) : (
                            <span className="flex items-center">
                                {t("sign_in")}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </span>
                        )}
                    </Button>
                </form>

                {/* Signup Link */}
                <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
                    {t("dont_have_account")}{" "}
                    <Link href="/auth/signup" className="text-green-600 dark:text-green-400 font-medium hover:underline transition-colors">
                        {t("sign_up")}
                    </Link>
                </p>

                {/* Forgot Password Link */}
                <p className="text-center mt-3">
                    <Link href="/auth/forgot-password" className="text-sm text-green-600 dark:text-green-400 font-medium hover:underline transition-colors">
                        Forgot Password?
                    </Link>
                </p>
            </motion.div>
        </div >
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <LoginContent />
        </Suspense>
    )
}