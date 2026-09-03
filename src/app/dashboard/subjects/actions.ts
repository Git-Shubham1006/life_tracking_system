'use server'

import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/getOrCreateUser'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createSubject(formData: FormData) {
  const user = await getOrCreateUser()
  if (!user) throw new Error('Not authenticated')

  const title = formData.get('title') as string

  await prisma.subject.create({
    data: {
      title,
      userId: user.id,
    },
  })

  revalidatePath('/dashboard/subjects')
}

export async function markAttendance(subjectId: string, status: 'PRESENT' | 'ABSENT') {
  await prisma.classLog.create({
    data: {
      subjectId,
      status,
    },
  })

  revalidatePath(`/dashboard/subjects/${subjectId}`)
}

export async function deleteSubject(subjectId: string) {
  await prisma.subject.delete({
    where: { id: subjectId },
  })
  revalidatePath('/dashboard/subjects')
  redirect('/dashboard/subjects')
}

export async function deleteClassLog(logId: string, subjectId: string) {
  await prisma.classLog.delete({
    where: { id: logId },
  })
  revalidatePath(`/dashboard/subjects/${subjectId}`)
}
export async function markAttendanceWithDate(formData: FormData) {
  const subjectId = formData.get('subjectId') as string
  const date = formData.get('date') as string
  const status = formData.get('status') as 'PRESENT' | 'ABSENT'

  await prisma.classLog.create({
    data: {
      subjectId,
      date: new Date(date),
      status,
    },
  })

  revalidatePath(`/dashboard/subjects/${subjectId}`)
}
export async function createNode(formData: FormData) {
  const subjectId = formData.get('subjectId') as string
  const parentId = formData.get('parentId') as string | null
  const title = formData.get('title') as string

  await prisma.node.create({
    data: {
      subjectId,
      parentId: parentId || null,
      title,
      type: parentId ? 'BRANCH' : 'CHAPTER',
    },
  })

  revalidatePath(`/dashboard/subjects/${subjectId}/revision`)
}

export async function deleteNode(nodeId: string, subjectId: string) {
  await prisma.node.delete({
    where: { id: nodeId },
  })
  revalidatePath(`/dashboard/subjects/${subjectId}/revision`)
}

export async function toggleKeyPoint(nodeId: string, subjectId: string, current: boolean) {
  await prisma.node.update({
    where: { id: nodeId },
    data: { isKeyPoint: !current },
  })
  revalidatePath(`/dashboard/subjects/${subjectId}/revision`)
}

export async function toggleNodeCompletion(nodeId: string, subjectId: string, current: boolean) {
  await prisma.node.update({
    where: { id: nodeId },
    data: { isCompleted: !current },
  })
  revalidatePath(`/dashboard/subjects/${subjectId}/revision`)
}