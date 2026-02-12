"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { User, Mail, Lock, RefreshCw, Eye, EyeOff, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateStrongPassword } from "@/lib/auth-utils"
import { useAuth } from "@/context/auth-context"
import { useTranslation } from "@/context/language-context"
import { useTheme } from "@/context/theme-context"
import { Logo } from "@/components/ui/logo"

// Needs to be duplicated/imported to avoid server module import issues in client
function generateStrongPasswordClient(length: number = 14): string {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let retVal = ""
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n))
    }
    return retVal
}

export default function SignupPage() {
    const router = useRouter()
    const { login } = useAuth()
    const { t } = useTranslation()
    const { resolvedTheme } = useTheme()
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const suggestPassword = () => {
        const strongPass = generateStrongPasswordClient()
        setFormData(prev => ({ ...prev, password: strongPass, confirmPassword: strongPass }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            setLoading(false)
            return
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters")
            setLoading(false)
            return
        }

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            })

            const data = await res.json()

            if (data.success) {
                // Auto-login after successful signup
                login(data.data)
                router.push("/")
            } else {
                setError(data.error || "Signup failed")
            }
        } catch (error) {
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-green-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            >


                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-green-600 dark:from-green-500 to-blue-600 dark:to-blue-500" />

                <div className="mb-8 text-center">
                    <div className="flex justify-center mb-4">
                        <Logo className="w-16 h-16" />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-br from-green-600 dark:from-green-400 to-blue-600 dark:to-blue-400">
                        {t("create_account")}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{t("join_ecodrop")}</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-6 flex items-center gap-2">
                        <CheckCircle className="rotate-45 w-4 h-4" /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium ml-1 text-gray-700 dark:text-gray-300">{t("full_name")}</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                autoComplete="name"
                                placeholder="Alex Green"
                                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-10 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Username */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium ml-1 text-gray-700 dark:text-gray-300">{t("username")}</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                            <input
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                autoComplete="username"
                                placeholder="alexg"
                                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-10 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium ml-1 text-gray-700 dark:text-gray-300">{t("email")}</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                placeholder={t("email_placeholder")}
                                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-10 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium ml-1 text-gray-700 dark:text-gray-300">{t("password")}</label>
                            <button
                                type="button"
                                onClick={suggestPassword}
                                className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 hover:underline transition-colors"
                            >
                                <RefreshCw className="w-3 h-3" /> {t("suggest_strong")}
                            </button>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                placeholder={t("password_placeholder")}
                                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl pl-10 pr-10 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium ml-1 text-gray-700 dark:text-gray-300">{t("confirm_password")}</label>
                        <div className="relative">
                            <CheckCircle className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                            <input
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                                placeholder={t("confirm_password")}
                                className={`w-full bg-gray-50 dark:bg-gray-700 border rounded-xl px-10 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${formData.confirmPassword && formData.password === formData.confirmPassword
                                    ? "border-green-500 dark:border-green-400 focus:ring-green-500/30 dark:focus:ring-green-400/30"
                                    : "border-gray-300 dark:border-gray-600 focus:ring-green-500/30 dark:focus:ring-green-400/30"
                                    }`}
                                required
                            />
                        </div>
                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                            <p className="text-xs text-green-600 dark:text-green-400 ml-1">✓ Passwords match</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full h-12 text-base rounded-xl mt-4 bg-linear-to-r from-green-600 dark:from-green-500 to-blue-600 dark:to-blue-500 hover:from-green-700 dark:hover:from-green-600 hover:to-blue-700 dark:hover:to-blue-600 text-white font-medium transition-all" disabled={loading}>
                        {loading ? t("creating_account") : t("sign_up")} <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm">
                    <p className="text-gray-600 dark:text-gray-400">
                        {t("already_have_account")}{" "}
                        <Link href="/auth/login" className="text-green-600 dark:text-green-400 font-medium hover:underline transition-colors">
                            {t("log_in")}
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
