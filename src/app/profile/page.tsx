"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { User, Settings, LogOut, Bell, Shield, Wallet, Share2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useTranslation } from "@/context/language-context"

export default function ProfilePage() {
    const { user, logout } = useAuth()
    const { t } = useTranslation()

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'EcoDrop Profile',
                text: `I've recycled ${user?.totalItemsRecycled} items and saved ${user?.totalCO2Saved}kg of CO2 with EcoDrop! 🌱`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            alert("Sharing not supported on this browser");
        }
    }

    const [activeModal, setActiveModal] = useState<string | null>(null)

    const Modal = ({ title, onClose, children }: { title: string, onClose: () => void, children: React.ReactNode }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-sm relative overflow-hidden">
                <div className="bg-primary/10 p-4 border-b">
                    <h3 className="font-bold text-lg">{title}</h3>
                </div>
                <div className="p-4">
                    {children}
                </div>
                <div className="p-4 border-t bg-secondary/20 flex justify-end">
                    <Button onClick={onClose}>Close</Button>
                </div>
            </Card>
        </div>
    )

    return (
        <div className="flex flex-col gap-6 pb-20">
            {activeModal && (
                <Modal title={activeModal} onClose={() => setActiveModal(null)}>
                    {activeModal === "Linked Accounts" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Google</span>
                                <span className="text-green-600 text-sm font-bold bg-green-100 px-2 py-1 rounded">{t("connected")}</span>
                            </div>
                        </div>
                    )}
                    {activeModal === "Notifications" && (
                        <NotificationSettings userEmail={user?.email} />
                    )}
                    {activeModal === "App Settings" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{t("language")}</span>
                                <span className="text-sm text-muted-foreground">English</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-medium">App Version</span>
                                <span className="text-sm text-muted-foreground">1.0.0</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Auto Backup</span>
                                <span className="text-sm text-muted-foreground">Enabled</span>
                            </div>
                        </div>
                    )}
                </Modal>
            )}

            <h1 className="text-3xl font-bold">{t("profile_title")}</h1>

            {/* Profile Header */}
            <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-primary border-4 border-background shadow-xl">
                    <User className="h-10 w-10" />
                </div>
                <div>
                    <h2 className="text-xl font-bold">{user?.name || "Guest User"}</h2>
                    <p className="text-muted-foreground text-sm">@{user?.username || "guest"}</p>
                    <div className="mt-1 inline-flex items-center gap-2">
                        <div className="inline-flex items-center bg-green-500/10 text-green-500 px-2 py-0.5 rounded text-xs font-medium">
                            {user?.points || 0} Points
                        </div>
                        <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full" onClick={handleShare}>
                            <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Impact Stats */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 flex flex-col items-center justify-center text-center bg-blue-50 border-blue-100">
                    <span className="text-2xl font-bold text-blue-600">{user?.totalItemsRecycled || 0}</span>
                    <span className="text-xs text-blue-800 font-medium">{t("items_recycled")}</span>
                </Card>
                <Card className="p-4 flex flex-col items-center justify-center text-center bg-green-50 border-green-100">
                    <span className="text-2xl font-bold text-green-600">{user?.totalCO2Saved || 0}kg</span>
                    <span className="text-xs text-green-800 font-medium">{t("co2_saved")}</span>
                </Card>
            </div>

            {/* Important User Guidance */}
            <Card className="p-4 bg-amber-50 border-amber-200">
                <div className="flex items-start gap-3">
                    <div className="p-1 bg-amber-100 rounded">
                        <span className="text-lg">ℹ️</span>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-amber-800 mb-1">{t("how_stats_work")}</h4>
                        <div className="text-sm text-amber-700 space-y-1">
                            <p><strong>Scanning</strong>: {t("scanning_desc")}</p>
                            <p><strong>Verified Drop</strong>: {t("verified_drop_desc")}</p>
                            <p className="text-xs mt-2 text-amber-600">{t("impact_note")}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Quick Guide */}
            <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                    <div className="p-1 bg-blue-100 rounded">
                        <span className="text-lg">🚀</span>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-blue-800 mb-1">{t("quick_guide_title")}</h4>
                        <div className="text-sm text-blue-700 space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">1.</span>
                                <span>{t("guide_step_1")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">2.</span>
                                <span>{t("guide_step_2")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">3.</span>
                                <span>{t("guide_step_3")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">4.</span>
                                <span>{t("guide_step_4")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">5.</span>
                                <span>{t("guide_step_5")}</span>
                            </div>
                        </div>
                        <div className="mt-3">
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                onClick={() => window.location.href = '/find-bin'}
                            >
                                {t("start_recycling_action")}
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Badges */}
            <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" /> {t("achievements")}
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {/* Dynamic Badges */}
                    {(user?.totalItemsRecycled || 0) >= 1 && (
                        <BadgeItem icon="🌱" title="First Step" color="bg-green-100 text-green-700" onClick={() => alert("Badge: First Step\nAwarded for recycling your first item!")} />
                    )}
                    {(user?.totalItemsRecycled || 0) >= 5 && (
                        <BadgeItem icon="♻️" title="Recycler" color="bg-blue-100 text-blue-700" onClick={() => alert("Badge: Recycler\nAwarded for recycling 5 items!")} />
                    )}
                    {(user?.totalItemsRecycled || 0) >= 10 && (
                        <BadgeItem icon="⭐" title="Super Star" color="bg-yellow-100 text-yellow-700" onClick={() => alert("Badge: Super Star\nAwarded for recycling 10 items!")} />
                    )}
                    {(user?.totalItemsRecycled || 0) >= 50 && (
                        <BadgeItem icon="👑" title="Eco King" color="bg-purple-100 text-purple-700" onClick={() => alert("Badge: Eco King\nAwarded for recycling 50 items!")} />
                    )}
                    {(!user?.totalItemsRecycled || user.totalItemsRecycled === 0) && (
                        <div className="text-sm text-muted-foreground italic px-2">{t("recycle_for_badges")}</div>
                    )}
                </div>
            </div>

            {/* Settings List */}
            <Card className="overflow-hidden">
                <div className="divide-y divide-border">
                    {[
                        { icon: Wallet, label: t("linked_accounts") },
                        { icon: Bell, label: t("notifications") },
                        { icon: Shield, label: t("privacy_security") },
                        { icon: Settings, label: t("app_settings") },
                    ].map((item, i) => (
                        <button
                            key={i}
                            className="flex w-full items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
                            onClick={() => setActiveModal(item.label)}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">{item.label}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </Card>

            <Button variant="destructive" className="w-full" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> {t("sign_out")}
            </Button>
        </div>
    )
}

function BadgeItem({ icon, title, color, onClick }: { icon: string, title: string, color: string, onClick?: () => void }) {
    return (
        <div
            className={`flex flex-col items-center justify-center p-3 rounded-xl min-w-[80px] shadow-sm border border-transparent ${color} cursor-pointer active:scale-95 transition-transform`}
            onClick={onClick}
        >
            <span className="text-2xl mb-1">{icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-tight">{title}</span>
        </div>
    )
}

function NotificationSettings({ userEmail }: { userEmail?: string }) {
    const { t } = useTranslation()
    const [emailEnabled, setEmailEnabled] = useState(true) // Default ON as requested

    const [pushEnabled, setPushEnabled] = useState(true)
    const [sending, setSending] = useState(false)

    const sendTestEmail = async () => {
        if (!userEmail) return alert("No email address found for user.")

        setSending(true)
        try {
            const res = await fetch("/api/notifications/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, type: "test" })
            })
            const data = await res.json()
            if (data.success) {
                alert("Test email sent successfully! 📧")
            } else {
                alert("Failed to send email: " + data.error)
            }
        } catch (e) {
            console.error(e)
            alert("Error sending test email.")
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <span className="font-medium">{t("push_notifications")}</span>
                <div
                    className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${pushEnabled ? "bg-primary" : "bg-muted"}`}
                    onClick={() => setPushEnabled(!pushEnabled)}
                >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${pushEnabled ? "right-1" : "left-1"}`}></div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <span className="font-medium d-block">{t("email_updates")}</span>
                    <p className="text-xs text-muted-foreground">{t("email_desc")}</p>
                </div>
                <div
                    className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${emailEnabled ? "bg-primary" : "bg-muted"}`}
                    onClick={() => setEmailEnabled(!emailEnabled)}
                >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${emailEnabled ? "right-1" : "left-1"}`}></div>
                </div>
            </div>

            {emailEnabled && (
                <div className="pt-2 border-t">
                    <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs"
                        onClick={sendTestEmail}
                        disabled={sending}
                    >
                        {sending ? "Sending..." : t("send_test_email")}
                    </Button>
                </div>
            )}
        </div>
    )
}
