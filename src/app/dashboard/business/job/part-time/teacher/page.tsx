import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/getOrCreateUser'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, User } from 'lucide-react'
import { createStudent } from './actions'

export default async function TeacherStudentsPage() {
  const user = await getOrCreateUser()

  const students = user
    ? await prisma.student.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      })
    : []

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <div className="w-full flex justify-start mb-4">
        <Link href="/dashboard/business/job/part-time">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Roles
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-teal-700 dark:text-teal-400">My Students</h1>

      <form action={createStudent} className="flex gap-2 mb-8">
        <Input
          type="text"
          name="name"
          placeholder="Student Name (e.g. John Doe)"
          required
          className="flex-1"
        />
        <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">Add Student</Button>
      </form>

      <div className="space-y-3">
        {students.length === 0 && (
          <p className="text-muted-foreground">No students yet. Add one above.</p>
        )}
        {students.map((student) => (
          <Card key={student.id} className="hover:bg-teal-50 dark:hover:bg-teal-950/30 border-teal-100 dark:border-teal-900 transition">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <Link href={`/dashboard/business/job/part-time/teacher/${student.id}`} className="flex-1 flex items-center gap-3">
                <div className="bg-teal-100 dark:bg-teal-900 p-2 rounded-full">
                  <User className="w-5 h-5 text-teal-600 dark:text-teal-300" />
                </div>
                <CardTitle className="cursor-pointer text-lg">{student.name}</CardTitle>
              </Link>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
