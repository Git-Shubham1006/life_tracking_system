import { UserButton } from '@clerk/nextjs'
import { DashboardNav } from '@/components/DashboardNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <DashboardNav />
          <span className="font-semibold text-gray-800">Life Tracker</span>
        </div>
        <UserButton />
      </header>
      <main>{children}</main>
    </div>
  )
}
