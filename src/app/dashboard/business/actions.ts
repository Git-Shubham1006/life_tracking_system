'use server'

import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/getOrCreateUser'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createBusiness(formData: FormData) {
  const user = await getOrCreateUser()
  if (!user) throw new Error('Not authenticated')

  const title = formData.get('title') as string

  await prisma.business.create({
    data: {
      title,
      userId: user.id,
    },
  })

  revalidatePath('/dashboard/business')
}

export async function deleteBusiness(businessId: string) {
  await prisma.business.delete({
    where: { id: businessId },
  })
  revalidatePath('/dashboard/business')
  redirect('/dashboard/business')
}

export async function createBusinessNode(formData: FormData) {
  const businessId = formData.get('businessId') as string
  const parentId = formData.get('parentId') as string | null
  const title = formData.get('title') as string

  await prisma.node.create({
    data: {
      businessId,
      parentId: parentId || null,
      title,
      type: parentId ? 'BRANCH' : 'PRIORITY_ITEM',
    },
  })

  revalidatePath(`/dashboard/business/${businessId}`)
}

export async function deleteBusinessNode(nodeId: string, businessId: string) {
  await prisma.node.delete({
    where: { id: nodeId },
  })
  revalidatePath(`/dashboard/business/${businessId}`)
}

export async function toggleBusinessNodeCompleted(nodeId: string, businessId: string, current: boolean) {
  await prisma.node.update({
    where: { id: nodeId },
    data: { isCompleted: !current },
  })
  revalidatePath(`/dashboard/business/${businessId}`)
}

export async function updateBusiness(businessId: string, formData: FormData) {
  const title = formData.get('title') as string
  await prisma.business.update({
    where: { id: businessId },
    data: { title },
  })
  revalidatePath('/dashboard/business')
  revalidatePath(`/dashboard/business/${businessId}`)
}
