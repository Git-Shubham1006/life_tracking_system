import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/getOrCreateUser'
import { createHobby, deleteHobby, updateHobby } from './actions'
import { EditButton } from '@/components/EditButton'
import { DeleteButton } from '@/components/DeleteButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default async function HobbiesPage() {
  const user = await getOrCreateUser()

  const hobbies = user
    ? await prisma.hobby.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      })
    : []

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-amber-700">Hobbies</h1>

      <form action={createHobby} className="flex flex-col gap-2 mb-8">
        <Input type="text" name="title" placeholder="e.g. Pencil Sketching" required />
        <Input type="text" name="description" placeholder="Short note (optional)" />
        <Button type="submit" className="bg-amber-600 hover:bg-amber-700 self-start">
          Add Hobby
        </Button>
      </form>

      <div className="space-y-3">
        {hobbies.length === 0 && (
          <p className="text-gray-500">No hobbies yet. Add one above.</p>
        )}
        {hobbies.map((hobby) => (
          <Card key={hobby.id} className="border-l-4 border-l-amber-300">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{hobby.title}</CardTitle>
                {hobby.description && <CardDescription>{hobby.description}</CardDescription>}
              </div>
              <div className="flex gap-1">
                <EditButton
                  action={updateHobby.bind(null, hobby.id)}
                  initialTitle={hobby.title}
                  initialDescription={hobby.description ?? ''}
                  hasDescription
                />
                <DeleteButton
                  action={deleteHobby.bind(null, hobby.id)}
                  itemName={hobby.title}
                />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
