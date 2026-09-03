import { prisma } from '@/lib/prisma'
import { createBusinessNode, deleteBusinessNode, toggleBusinessNodeCompleted, deleteBusiness } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type NodeWithChildren = {
  id: string
  title: string
  isCompleted: boolean
  children: NodeWithChildren[]
}

function buildTree(
  nodes: { id: string; title: string; isCompleted: boolean; parentId: string | null }[]
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

function BusinessNodeItem({ node, businessId }: { node: NodeWithChildren; businessId: string }) {
  return (
    <div className="ml-4 mt-2">
      <div className={`flex items-center gap-2 p-2 border rounded-lg ${node.isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-blue-100'}`}>
        <form action={toggleBusinessNodeCompleted.bind(null, node.id, businessId, node.isCompleted)}>
          <button type="submit" title="Mark as completed">
            {node.isCompleted ? '✅' : '⬜'}
          </button>
        </form>
        <span className={node.isCompleted ? 'line-through text-green-700' : ''}>{node.title}</span>
        <form action={deleteBusinessNode.bind(null, node.id, businessId)} className="ml-auto">
          <Button type="submit" variant="ghost" size="sm" className="text-gray-400 hover:text-red-600">
            ✕
          </Button>
        </form>
      </div>

      <form action={createBusinessNode} className="flex gap-2 mt-1 ml-6">
        <input type="hidden" name="businessId" value={businessId} />
        <input type="hidden" name="parentId" value={node.id} />
        <Input type="text" name="title" placeholder="Add sub-task..." className="h-8 text-sm" required />
        <Button type="submit" size="sm" variant="outline">+</Button>
      </form>

      {node.children.map((child) => (
        <BusinessNodeItem key={child.id} node={child} businessId={businessId} />
      ))}
    </div>
  )
}

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const business = await prisma.business.findUnique({ where: { id } })
  if (!business) notFound()

  const nodes = await prisma.node.findMany({
    where: { businessId: id },
    orderBy: { order: 'asc' },
  })

  const tree = buildTree(nodes)
  const total = nodes.length
  const completed = nodes.filter((n) => n.isCompleted).length

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <Link href="/dashboard/business" className="text-sm text-blue-600 hover:underline">
        ← Back to Businesses
      </Link>

      <div className="flex justify-between items-center mt-2 mb-2">
        <h1 className="text-3xl font-bold text-blue-700">{business.title}</h1>
        <form action={deleteBusiness.bind(null, id)}>
          <Button type="submit" variant="outline" className="text-red-600 border-red-600">
            Delete Business
          </Button>
        </form>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        {completed}/{total} tasks completed
      </p>

      <form action={createBusinessNode} className="flex gap-2 mb-6">
        <input type="hidden" name="businessId" value={id} />
        <Input type="text" name="title" placeholder="Add a priority item..." required />
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Add</Button>
      </form>

      <div className="space-y-2">
        {tree.length === 0 && <p className="text-gray-500">No priority items yet. Add one above.</p>}
        {tree.map((node) => (
          <BusinessNodeItem key={node.id} node={node} businessId={id} />
        ))}
      </div>
    </div>
  )
}
