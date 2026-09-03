import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/getOrCreateUser'
import { createBusiness } from './actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

export default async function BusinessPage() {
  const user = await getOrCreateUser()

  const businesses = user
    ? await prisma.business.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      })
    : []

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">My Businesses</h1>

      <form action={createBusiness} className="flex gap-2 mb-8">
        <Input
          type="text"
          name="title"
          placeholder="e.g. Freelance Design Work"
          required
          className="flex-1"
        />
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Add Business</Button>
      </form>

      <div className="space-y-3">
        {businesses.length === 0 && (
          <p className="text-gray-500">No businesses yet. Add one above.</p>
        )}
        {businesses.map((business) => (
          <Link key={business.id} href={`/dashboard/business/${business.id}`}>
            <Card className="hover:bg-blue-50 border-blue-100 cursor-pointer transition">
              <CardHeader>
                <CardTitle>{business.title}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
