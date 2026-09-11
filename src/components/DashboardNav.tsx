'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { useState } from 'react'

const navItems = [
  { name: 'Overview', href: '/dashboard', color: 'text-gray-700' },
  { name: 'Business', href: '/dashboard/business', color: 'text-blue-700' },
  { name: 'Subjects', href: '/dashboard/subjects', color: 'text-violet-700' },
  { name: 'Tech', href: '/dashboard/tech', color: 'text-emerald-700' },
  { name: 'Hobbies', href: '/dashboard/hobbies', color: 'text-amber-700' },
]

export function DashboardNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetTitle className="px-4 pt-4">Life Tracker</SheetTitle>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition ${item.color}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
