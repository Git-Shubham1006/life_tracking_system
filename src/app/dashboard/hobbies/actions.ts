'use server'

import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/getOrCreateUser'
import { revalidatePath } from 'next/cache'

export async function createHobby(formData: FormData) {
  const user = await getOrCreateUser()
  if (!user) throw new Error('Not authenticated')

  const title = formData.get('title') as string
  const description = formData.get('description') as string

  await prisma.hobby.create({
    data: {
      title,
      description,
      userId: user.id,
    },
  })

  revalidatePath('/dashboard/hobbies')
}

export async function deleteHobby(id: string) {
  await prisma.hobby.delete({ where: { id } })
  revalidatePath('/dashboard/hobbies')
}

export async function updateHobby(id: string, formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  await prisma.hobby.update({
    where: { id },
    data: { title, description },
  })
  revalidatePath('/dashboard/hobbies')
}
