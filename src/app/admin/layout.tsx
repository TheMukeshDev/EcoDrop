import AdminSidebar from "@/components/admin/admin-sidebar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-secondary/20">
            <AdminSidebar />
            <main className="pl-64 p-8">
                {children}
            </main>
        </div>
    )
}
