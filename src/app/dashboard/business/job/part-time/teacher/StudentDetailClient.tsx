"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { MoreVertical, Calendar as CalendarIcon, FileText, Clock, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
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
import { toggleAttendance, updateStudentDetails, deleteStudent } from "./actions";

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
  
  // Optimistic UI state
  const [attendances, setAttendances] = useState(student.attendances);
  const [isPending, startTransition] = useTransition();

  // Long press / click tracking
  const [longPressMenuDay, setLongPressMenuDay] = useState<number | null>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state if props change (e.g. server revalidated)
  useEffect(() => {
    setAttendances(student.attendances);
  }, [student.attendances]);

  const handleSaveDetails = async (formData: FormData) => {
    formData.append("schedule", schedule);
    formData.append("attachments", attachments);
    await updateStudentDetails(student.id, formData);
    setActiveSheet(null);
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const today = new Date();

  const getAttendanceForDay = (day: number) => {
    const target = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    target.setHours(0, 0, 0, 0);
    return attendances.find((a) => {
      const d = new Date(a.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === target.getTime();
    });
  };

  const updateStatus = (day: number, status: StudentAttendanceStatus | null) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    targetDate.setHours(0, 0, 0, 0);

    // Optimistic update
    setAttendances((prev) => {
      const filtered = prev.filter(a => new Date(a.date).getTime() !== targetDate.getTime());
      if (status) {
        filtered.push({ date: targetDate, status });
      }
      return filtered;
    });

    // Server update
    startTransition(() => {
      toggleAttendance(student.id, targetDate.toISOString(), status);
    });
    
    setLongPressMenuDay(null);
  };

  const handlePointerDown = (day: number) => {
    if (isFuture(day)) return;
    longPressTimeoutRef.current = setTimeout(() => {
      setLongPressMenuDay(day);
      longPressTimeoutRef.current = null;
    }, 500); // 500ms for long press
  };

  const handlePointerUp = (day: number) => {
    if (isFuture(day)) return;
    
    // If long press triggered, do nothing on up
    if (!longPressTimeoutRef.current && longPressMenuDay === day) {
      return; 
    }
    
    // Clear long press timer
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }

    // Handle single/double click
    if (clickTimeoutRef.current) {
      // It's a double click
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      updateStatus(day, StudentAttendanceStatus.ABSENT);
    } else {
      // It's a single click (wait a bit to see if double click happens)
      clickTimeoutRef.current = setTimeout(() => {
        // Single click confirmed
        const current = getAttendanceForDay(day);
        if (current?.status) {
          updateStatus(day, null); // Clear ANY existing mark
        } else {
          updateStatus(day, StudentAttendanceStatus.PRESENT); // Mark Present if empty
        }
        clickTimeoutRef.current = null;
      }, 250);
    }
  };

  const handlePointerCancel = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  const isFuture = (day: number) => {
    const target = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    target.setHours(23, 59, 59, 999);
    return target.getTime() > today.getTime();
  };

  const getStatusDisplay = (status?: StudentAttendanceStatus) => {
    switch (status) {
      case "PRESENT": return { bg: "bg-teal-500", text: "text-white", label: "P" };
      case "ABSENT": return { bg: "bg-red-500", text: "text-white", label: "A" };
      case "MISSED": return { bg: "bg-amber-500", text: "text-white", label: "M" };
      case "RESCHEDULED": return { bg: "bg-blue-500", text: "text-white", label: "R" };
      case "HOLIDAY": return { bg: "bg-purple-500", text: "text-white", label: "H" };
      default: return { bg: "bg-transparent", text: "text-foreground", label: "" };
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-xl shadow-sm border p-4 md:p-6 select-none">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
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
            <DropdownMenuItem 
              onClick={() => {
                if (confirm('Are you sure you want to delete this student?')) {
                  startTransition(() => {
                    deleteStudent(student.id)
                  })
                }
              }} 
              className="cursor-pointer gap-2 text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950"
            >
              <Trash className="w-4 h-4" /> Delete Student
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
        >
          Prev
        </Button>
        <span className="font-semibold text-base md:text-lg">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <Button 
          variant="outline"
          size="sm"
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
        >
          Next
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 text-center relative">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="font-medium text-muted-foreground text-xs md:text-sm py-2">{d}</div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="p-1 md:p-2" />
        ))}
        
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const att = getAttendanceForDay(day);
          const future = isFuture(day);
          const display = getStatusDisplay(att?.status);
          
          return (
            <div key={day} className="relative aspect-square">
              <div
                onPointerDown={() => handlePointerDown(day)}
                onPointerUp={() => handlePointerUp(day)}
                onPointerCancel={handlePointerCancel}
                onPointerLeave={handlePointerCancel}
                className={`w-full h-full flex flex-col items-center justify-center rounded-md transition-all touch-manipulation
                  ${future ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer active:scale-90 hover:bg-muted'}
                  ${display.bg} ${display.text} border border-transparent ${att?.status ? 'border-border shadow-sm' : ''}
                `}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <span className={`text-xs md:text-sm font-semibold ${att?.status ? 'opacity-40 text-[10px] -mt-2' : ''}`}>
                  {day}
                </span>
                
                {/* Animated Letter */}
                <AnimatePresence>
                  {att?.status && (
                    <motion.div
                      initial={{ scale: 0.2, y: 10, opacity: 0 }}
                      animate={{ scale: 1, y: 0, opacity: 1 }}
                      exit={{ scale: 0.2, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="absolute font-black text-lg md:text-xl drop-shadow-md"
                    >
                      {display.label}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Long Press Menu Overlay */}
              <AnimatePresence>
                {longPressMenuDay === day && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute z-50 -top-16 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground shadow-xl rounded-lg p-1 flex gap-1 border border-border"
                  >
                    <button onClick={() => updateStatus(day, StudentAttendanceStatus.PRESENT)} className="w-8 h-8 rounded bg-teal-500 text-white font-bold flex items-center justify-center text-xs">P</button>
                    <button onClick={() => updateStatus(day, StudentAttendanceStatus.ABSENT)} className="w-8 h-8 rounded bg-red-500 text-white font-bold flex items-center justify-center text-xs">A</button>
                    <button onClick={() => updateStatus(day, StudentAttendanceStatus.MISSED)} className="w-8 h-8 rounded bg-amber-500 text-white font-bold flex items-center justify-center text-xs">M</button>
                    <button onClick={() => updateStatus(day, StudentAttendanceStatus.RESCHEDULED)} className="w-8 h-8 rounded bg-blue-500 text-white font-bold flex items-center justify-center text-xs">R</button>
                    <button onClick={() => updateStatus(day, StudentAttendanceStatus.HOLIDAY)} className="w-8 h-8 rounded bg-purple-500 text-white font-bold flex items-center justify-center text-xs">H</button>
                    <button onClick={() => { updateStatus(day, null); setLongPressMenuDay(null); }} className="w-8 h-8 rounded bg-muted text-muted-foreground font-bold flex items-center justify-center text-xs">✕</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-8 text-xs text-muted-foreground">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-teal-500"></div> Present (P)</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div> Absent (A)</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Missed (M)</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Rescheduled (R)</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-purple-500"></div> Holiday (H)</div>
      </div>
      <div className="text-center text-[10px] text-muted-foreground mt-4 opacity-70">
        Single tap = Present • Double tap = Absent • Long press = More options
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
