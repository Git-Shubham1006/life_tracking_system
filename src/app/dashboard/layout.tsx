import { UserButton } from '@clerk/nextjs'
import { DashboardNav } from '@/components/DashboardNav'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-4 py-3 border-b bg-background sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <DashboardNav />
          <span className="font-semibold text-foreground">Life Tracker</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserButton />
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
