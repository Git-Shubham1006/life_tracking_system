import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function TechPage() {
  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4 text-purple-700">Tech Projects</h1>
      <p className="text-xl text-gray-600 mb-8">This section is currently under construction.</p>
      <Link href="/dashboard">
        <div className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
          ← Back to Dashboard
        </div>
      </Link>
    </div>
  )
}
