"use client";

import { useState } from "react";
import { MoreVertical, Calendar as CalendarIcon, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { StudentAttendanceStatus } from "@prisma/client";
import { toggleAttendance, updateStudentDetails } from "./actions";

interface StudentProps {
  id: string;
  name: string;
  schedule: string | null;
  attachments: string | null;
  attendances: { date: Date; status: StudentAttendanceStatus }[];
}

export function StudentDetailClient({ student }: { student: StudentProps }) {
  const [activeSheet, setActiveSheet] = useState<"schedule" | "attachments" | null>(null);
  const [schedule, setSchedule] = useState(student.schedule || "");
  const [attachments, setAttachments] = useState(student.attachments || "");
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleSaveDetails = async (formData: FormData) => {
    formData.append("schedule", schedule);
    formData.append("attachments", attachments);
    await updateStudentDetails(student.id, formData);
    setActiveSheet(null);
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const getAttendanceForDay = (day: number) => {
    const target = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    target.setHours(0, 0, 0, 0);
    return student.attendances.find((a) => {
      const d = new Date(a.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === target.getTime();
    });
  };

  const handleStatusCycle = async (day: number) => {
    const existing = getAttendanceForDay(day);
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    let nextStatus: StudentAttendanceStatus | null = StudentAttendanceStatus.PRESENT;
    if (existing?.status === StudentAttendanceStatus.PRESENT) nextStatus = StudentAttendanceStatus.ABSENT;
    else if (existing?.status === StudentAttendanceStatus.ABSENT) nextStatus = StudentAttendanceStatus.MISSED;
    else if (existing?.status === StudentAttendanceStatus.MISSED) nextStatus = null;

    await toggleAttendance(student.id, targetDate.toISOString(), nextStatus);
  };

  return (
    <div className="bg-card text-card-foreground rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          {student.name}&apos;s Attendance
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setActiveSheet("schedule")} className="cursor-pointer gap-2">
              <Clock className="w-4 h-4" /> Schedule
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveSheet("attachments")} className="cursor-pointer gap-2">
              <FileText className="w-4 h-4" /> Attachments
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="outline" 
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
        >
          Prev
        </Button>
        <span className="font-semibold text-lg">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <Button 
          variant="outline" 
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
        >
          Next
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="font-medium text-muted-foreground text-sm py-2">{d}</div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const att = getAttendanceForDay(day);
          
          let bgColor = "hover:bg-muted bg-transparent";
          if (att?.status === "PRESENT") bgColor = "bg-teal-500 text-white hover:bg-teal-600";
          if (att?.status === "ABSENT") bgColor = "bg-red-500 text-white hover:bg-red-600";
          if (att?.status === "MISSED") bgColor = "bg-amber-500 text-white hover:bg-amber-600";

          return (
            <div
              key={day}
              onClick={() => handleStatusCycle(day)}
              className={`aspect-square flex items-center justify-center rounded-md cursor-pointer transition-colors ${bgColor}`}
            >
              {day}
            </div>
          )
        })}
      </div>
      
      <div className="flex justify-center gap-4 mt-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-teal-500"></div> Present</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div> Absent</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Missed</div>
      </div>

      {/* Slide-out Sidebar for Schedule/Attachments */}
      <Sheet open={activeSheet !== null} onOpenChange={(open) => !open && setActiveSheet(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {activeSheet === 'schedule' ? 'Class Schedule' : 'Student Attachments'}
            </SheetTitle>
          </SheetHeader>
          <form action={handleSaveDetails} className="mt-6 flex flex-col h-full gap-4">
            {activeSheet === 'schedule' ? (
              <Textarea 
                placeholder="e.g. Mon/Wed/Fri at 5:00 PM"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="min-h-[200px]"
              />
            ) : (
              <Textarea 
                placeholder="Notes, link to Google Drive folder, syllabus requirements..."
                value={attachments}
                onChange={(e) => setAttachments(e.target.value)}
                className="min-h-[200px]"
              />
            )}
            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white">Save Changes</Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
