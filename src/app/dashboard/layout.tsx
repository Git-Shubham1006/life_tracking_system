import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

const navItems = [
  { name: 'Overview', href: '/dashboard', color: 'text-gray-700' },
  { name: 'Business', href: '/dashboard/business', color: 'text-blue-700' },
  { name: 'Subjects', href: '/dashboard/subjects', color: 'text-violet-700' },
  { name: 'Tech', href: '/dashboard/tech', color: 'text-emerald-700' },
  { name: 'Hobbies', href: '/dashboard/hobbies', color: 'text-amber-700' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-56 border-r bg-gray-50 p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-6 px-2">Life Tracker</h2>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:shadow-sm transition ${item.color}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t flex justify-center">
          <UserButton />
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
