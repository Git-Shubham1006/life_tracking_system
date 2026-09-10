import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/getOrCreateUser'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { StudentDetailClient } from '../StudentDetailClient'

export default async function StudentDetailPage({
  params,
}: {
  params: { studentId: string }
}) {
  const user = await getOrCreateUser()
  if (!user) return notFound()

  const student = await prisma.student.findUnique({
    where: { 
      id: params.studentId,
      userId: user.id 
    },
    include: {
      attendances: true
    }
  })

  if (!student) return notFound()

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <div className="w-full flex justify-start mb-6">
        <Link href="/dashboard/business/job/part-time/teacher">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Students
          </Button>
        </Link>
      </div>
      
      <StudentDetailClient student={student} />
    </div>
  )
}
