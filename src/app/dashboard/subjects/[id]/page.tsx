import { prisma } from '@/lib/prisma'

import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'
import { markAttendance, deleteSubject, deleteClassLog, markAttendanceWithDate } from '../actions'
export default async function SubjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const subject = await prisma.subject.findUnique({
    where: { id },
    include: {
      classLogs: {
        orderBy: { date: 'desc' },
      },
    },
  })

  if (!subject) {
    notFound()
  }

  const total = subject.classLogs.length
  const present = subject.classLogs.filter((log) => log.status === 'PRESENT').length
  const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : '0'

  async function markPresent() {
    'use server'
    await markAttendance(id, 'PRESENT')
  }

  async function markAbsent() {
    'use server'
    await markAttendance(id, 'ABSENT')
  }

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold">{subject.title}</h1>
        <form action={deleteSubject.bind(null, id)}>
          <Button type="submit" variant="outline" className="text-red-600 border-red-600">
            Delete Subject
          </Button>
        </form>
      </div>
      <p className="text-lg text-gray-600 mb-6">
        Attendance: {present}/{total} classes ({percentage}%)
      </p>

      <div className="flex gap-3 mb-8">
        <form action={markPresent}>
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            Mark Present
          </Button>
        </form>
        <form action={markAbsent}>
          <Button type="submit" variant="destructive">
            Mark Absent
          </Button>
        </form>
      </div>
            <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h3 className="font-semibold mb-3">Add Past Entry</h3>
        <form action={markAttendanceWithDate} className="flex gap-2 items-end flex-wrap">
          <input type="hidden" name="subjectId" value={id} />
          <div>
            <label className="text-sm text-gray-600 block mb-1">Date</label>
            <input
              type="date"
              name="date"
              required
              className="border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Status</label>
            <select name="status" required className="border rounded px-3 py-2">
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
            </select>
          </div>
          <Button type="submit">Add Entry</Button>
        </form>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold mb-3">History</h2>
        {subject.classLogs.length === 0 && (
          <p className="text-gray-500">No classes marked yet.</p>
        )}
        {subject.classLogs.map((log) => (
          <div
            key={log.id}
            className="flex justify-between items-center p-3 border rounded-lg"
          >
            <span>{new Date(log.date).toLocaleDateString()}</span>
            <div className="flex items-center gap-3">
              <span
                className={
                  log.status === 'PRESENT' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'
                }
              >
                {log.status}
              </span>
              <form action={deleteClassLog.bind(null, log.id, id)}>
                <Button type="submit" variant="ghost" size="sm" className="text-gray-400 hover:text-red-600">
                  ✕
                </Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}