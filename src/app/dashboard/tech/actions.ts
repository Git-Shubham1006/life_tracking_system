'use server'

import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/getOrCreateUser'
import { revalidatePath } from 'next/cache'

export async function createTechProject(formData: FormData) {
  const user = await getOrCreateUser()
  if (!user) throw new Error('Not authenticated')

  const title = formData.get('title') as string
  const description = formData.get('description') as string

  await prisma.techProject.create({
    data: {
      title,
      description,
      userId: user.id,
    },
  })

  revalidatePath('/dashboard/tech')
}

export async function deleteTechProject(id: string) {
  await prisma.techProject.delete({ where: { id } })
  revalidatePath('/dashboard/tech')
}

export async function toggleTechStatus(id: string, currentStatus: string) {
  const newStatus = currentStatus === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED'
  await prisma.techProject.update({
    where: { id },
    data: { status: newStatus },
  })
  revalidatePath('/dashboard/tech')
}

export async function updateTechProject(id: string, formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  await prisma.techProject.update({
    where: { id },
    data: { title, description },
  })
  revalidatePath('/dashboard/tech')
}
