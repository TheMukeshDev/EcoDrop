import AdminSidebar from "@/components/admin/admin-sidebar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background dark:bg-background">
            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 ml-64 pt-6 pb-10 px-6 md:px-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
