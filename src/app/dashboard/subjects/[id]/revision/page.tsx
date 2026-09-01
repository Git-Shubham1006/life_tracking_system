import { prisma } from '@/lib/prisma'
import { createNode, deleteNode, toggleKeyPoint } from '../../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type NodeWithChildren = {
  id: string
  title: string
  isKeyPoint: boolean
  children: NodeWithChildren[]
}

function buildTree(
  nodes: { id: string; title: string; isKeyPoint: boolean; parentId: string | null }[]
): NodeWithChildren[] {
  const map = new Map<string, NodeWithChildren>()
  nodes.forEach((n) => map.set(n.id, { ...n, children: [] }))

  const roots: NodeWithChildren[] = []
  nodes.forEach((n) => {
    const node = map.get(n.id)!
    if (n.parentId && map.has(n.parentId)) {
      map.get(n.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  })
  return roots
}

function NodeItem({ node, subjectId }: { node: NodeWithChildren; subjectId: string }) {
  return (
    <div className="ml-4 mt-2">
      <div className="flex items-center gap-2 p-2 border rounded-lg bg-white">
        <form action={toggleKeyPoint.bind(null, node.id, subjectId, node.isKeyPoint)}>
          <button type="submit" title="Mark as key revision point">
            {node.isKeyPoint ? '⭐' : '☆'}
          </button>
        </form>
        <span className={node.isKeyPoint ? 'font-semibold text-amber-700' : ''}>{node.title}</span>
        <form action={deleteNode.bind(null, node.id, subjectId)} className="ml-auto">
          <Button type="submit" variant="ghost" size="sm" className="text-gray-400 hover:text-red-600">
            ✕
          </Button>
        </form>
      </div>

      <form action={createNode} className="flex gap-2 mt-1 ml-6">
        <input type="hidden" name="subjectId" value={subjectId} />
        <input type="hidden" name="parentId" value={node.id} />
        <Input type="text" name="title" placeholder="Add sub-branch..." className="h-8 text-sm" required />
        <Button type="submit" size="sm" variant="outline">+</Button>
      </form>

      {node.children.map((child) => (
        <NodeItem key={child.id} node={child} subjectId={subjectId} />
      ))}
    </div>
  )
}

export default async function RevisionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const subject = await prisma.subject.findUnique({ where: { id } })
  if (!subject) notFound()

  const nodes = await prisma.node.findMany({
    where: { subjectId: id },
    orderBy: { order: 'asc' },
  })

  const tree = buildTree(nodes)
  const keyPoints = nodes.filter((n) => n.isKeyPoint)

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <Link href={`/dashboard/subjects/${id}`} className="text-sm text-blue-600 hover:underline">
        ← Back to Attendance
      </Link>
      <h1 className="text-3xl font-bold mt-2 mb-6">{subject.title} — Revision & Chapters</h1>

      <div className="mb-8 p-4 border rounded-lg bg-amber-50">
        <h3 className="font-semibold mb-2">⭐ Key Revision Points ({keyPoints.length})</h3>
        {keyPoints.length === 0 && (
          <p className="text-sm text-gray-500">Star any topic to add it here for last-minute revision.</p>
        )}
        <ul className="list-disc ml-5 text-sm">
          {keyPoints.map((kp) => (
            <li key={kp.id}>{kp.title}</li>
          ))}
        </ul>
      </div>

      <form action={createNode} className="flex gap-2 mb-6">
        <input type="hidden" name="subjectId" value={id} />
        <Input type="text" name="title" placeholder="Add a new chapter..." required />
        <Button type="submit">Add Chapter</Button>
      </form>

      <div className="space-y-2">
        {tree.length === 0 && <p className="text-gray-500">No chapters yet. Add one above.</p>}
        {tree.map((node) => (
          <NodeItem key={node.id} node={node} subjectId={id} />
        ))}
      </div>
    </div>
  )
}
