import { prisma } from '@/lib/prisma'

import { getOrCreateUser } from '@/lib/getOrCreateUser'
import { createSubject } from './actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

export default async function SubjectsPage() {
  const user = await getOrCreateUser()

  const subjects = user
    ? await prisma.subject.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      })
    : []

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Subjects</h1>

      <form action={createSubject} className="flex gap-2 mb-8">
        <Input
          type="text"
          name="title"
          placeholder="e.g. Mathematics"
          required
          className="flex-1"
        />
        <Button type="submit">Add Subject</Button>
      </form>

      <div className="space-y-3">
        {subjects.length === 0 && (
          <p className="text-gray-500">No subjects yet. Add one above.</p>
        )}
        {subjects.map((subject) => (
          <Link key={subject.id} href={`/dashboard/subjects/${subject.id}`}>
            <Card className="hover:bg-gray-50 cursor-pointer transition">
              <CardHeader>
                <CardTitle>{subject.title}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}