"use server"

import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/getOrCreateUser'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { StudentAttendanceStatus } from '@prisma/client'

export async function createStudent(formData: FormData) {
  const user = await getOrCreateUser()
  if (!user) throw new Error('Not authenticated')

  const name = formData.get('name') as string

  await prisma.student.create({
    data: {
      name,
      userId: user.id,
    },
  })

  revalidatePath('/dashboard/business/job/part-time/teacher')
}

export async function deleteStudent(studentId: string) {
  const user = await getOrCreateUser()
  if (!user) throw new Error('Not authenticated')

  await prisma.student.delete({
    where: {
      id: studentId,
      userId: user.id
    }
  })

  revalidatePath('/dashboard/business/job/part-time/teacher')
  redirect('/dashboard/business/job/part-time/teacher')
}

export async function updateStudentDetails(studentId: string, formData: FormData) {
  const schedule = formData.get('schedule') as string
  const attachments = formData.get('attachments') as string

  await prisma.student.update({
    where: { id: studentId },
    data: {
      schedule,
      attachments,
    },
  })

  revalidatePath(`/dashboard/business/job/part-time/teacher/${studentId}`)
}

export async function toggleAttendance(studentId: string, year: number, month: number, day: number, status: StudentAttendanceStatus | null) {
  // Construct absolute UTC date to prevent ANY timezone shifting
  const startOfDay = new Date(Date.UTC(year, month, day, 0, 0, 0, 0))
  const endOfDay = new Date(Date.UTC(year, month, day, 23, 59, 59, 999))
  
  if (!status) {
    // Delete attendance if null
    await prisma.studentAttendance.deleteMany({
      where: {
        studentId,
        date: {
          gte: startOfDay,
          lt: endOfDay,
        }
      }
    })
  } else {
    // We try to find existing for this day
    const existing = await prisma.studentAttendance.findFirst({
      where: {
        studentId,
        date: {
          gte: startOfDay,
          lt: endOfDay
        }
      }
    })

    if (existing) {
      await prisma.studentAttendance.update({
        where: { id: existing.id },
        data: { status }
      })
    } else {
      await prisma.studentAttendance.create({
        data: {
          studentId,
          date: startOfDay,
          status,
        }
      })
    }
  }

  revalidatePath(`/dashboard/business/job/part-time/teacher/${studentId}`)
}
