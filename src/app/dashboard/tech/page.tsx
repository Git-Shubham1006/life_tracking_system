import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/getOrCreateUser'
import { createTechProject, deleteTechProject, toggleTechStatus, updateTechProject } from './actions'
import { EditButton } from '@/components/EditButton'
import { DeleteButton } from '@/components/DeleteButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default async function TechPage() {
  const user = await getOrCreateUser()

  const projects = user
    ? await prisma.techProject.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      })
    : []

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-emerald-700">Tech Projects</h1>

      <form action={createTechProject} className="flex flex-col gap-2 mb-8">
        <Input type="text" name="title" placeholder="Project name" required />
        <Input type="text" name="description" placeholder="Short description (optional)" />
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 self-start">
          Add Project
        </Button>
      </form>

      <div className="space-y-3">
        {projects.length === 0 && (
          <p className="text-gray-500">No projects yet. Add one above.</p>
        )}
        {projects.map((project) => (
          <Card
            key={project.id}
            className={`border-l-4 ${
              project.status === 'COMPLETED' ? 'border-l-green-500 bg-green-50' : 'border-l-emerald-300'
            }`}
          >
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle
                  className={project.status === 'COMPLETED' ? 'line-through text-gray-500' : ''}
                >
                  {project.title}
                </CardTitle>
                {project.description && (
                  <CardDescription>{project.description}</CardDescription>
                )}
              </div>
              <div className="flex gap-2">
                <EditButton
                  action={updateTechProject.bind(null, project.id)}
                  initialTitle={project.title}
                  initialDescription={project.description ?? ''}
                  hasDescription
                />
                <form action={toggleTechStatus.bind(null, project.id, project.status)}>
                  <Button type="submit" variant="outline" size="sm">
                    {project.status === 'COMPLETED' ? '↺ Reopen' : '✓ Complete'}
                  </Button>
                </form>
                <DeleteButton
                  action={deleteTechProject.bind(null, project.id)}
                  itemName={project.title}
                />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
