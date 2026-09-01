import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const sections = [
  { name: 'Business', href: '/dashboard/business', description: 'Track your ventures and priorities' },
  { name: 'Subjects', href: '/dashboard/subjects', description: 'Attendance and revision tracking' },
  { name: 'Tech', href: '/dashboard/tech', description: 'Your coding projects' },
  { name: 'Hobbies', href: '/dashboard/hobbies', description: 'Personal interests and skills' },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Life Tracking Dashboard</h1>
        <UserButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Link key={section.name} href={section.href}>
            <Card className="hover:shadow-md transition cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-xl">{section.name}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}