import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const sections = [
  { name: 'Business', href: '/dashboard/business', description: 'Track your ventures and priorities', color: 'border-l-4 border-l-blue-500' },
  { name: 'Subjects', href: '/dashboard/subjects', description: 'Attendance and revision tracking', color: 'border-l-4 border-l-violet-500' },
  { name: 'Tech', href: '/dashboard/tech', description: 'Your coding projects', color: 'border-l-4 border-l-emerald-500' },
  { name: 'Hobbies', href: '/dashboard/hobbies', description: 'Personal interests and skills', color: 'border-l-4 border-l-amber-500' },
]

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-8 text-gray-800">Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Link key={section.name} href={section.href}>
            <Card className={`hover:shadow-md transition cursor-pointer h-full ${section.color}`}>
              <CardHeader>
                <CardTitle className="text-lg">{section.name}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}