import Link from "next/link";
import { GraduationCap, UserCog, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PartTimeHubPage() {
  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto flex flex-col items-center justify-center space-y-8">
      <div className="w-full flex justify-start mb-4">
        <Link href="/dashboard/business/job">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </Button>
        </Link>
      </div>
      
      <h1 className="text-4xl font-bold text-teal-700 dark:text-teal-400">
        Part-Time Roles
      </h1>
      <p className="text-muted-foreground text-center max-w-lg mb-8">
        Select your role
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <Link href="/dashboard/business/job/part-time/teacher" className="group">
          <Card className="h-64 flex flex-col items-center justify-center hover:bg-beige-100/50 dark:hover:bg-brown-800/50 hover:border-teal-500 transition-all cursor-pointer">
            <CardHeader className="text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-8 h-8 text-orange-600 dark:text-orange-300" />
              </div>
              <CardTitle className="text-2xl mb-2">Teacher</CardTitle>
              <CardDescription>
                Manage your students and their attendance
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/business/job/part-time/assistant" className="group">
          <Card className="h-64 flex flex-col items-center justify-center hover:bg-beige-100/50 dark:hover:bg-brown-800/50 hover:border-teal-500 transition-all cursor-pointer">
            <CardHeader className="text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UserCog className="w-8 h-8 text-purple-600 dark:text-purple-300" />
              </div>
              <CardTitle className="text-2xl mb-2">Assistant</CardTitle>
              <CardDescription>
                Assistant responsibilities
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        
        <Link href="/dashboard/business/job/part-time/management" className="group">
          <Card className="h-64 flex flex-col items-center justify-center hover:bg-beige-100/50 dark:hover:bg-brown-800/50 hover:border-teal-500 transition-all cursor-pointer">
            <CardHeader className="text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-emerald-600 dark:text-emerald-300" />
              </div>
              <CardTitle className="text-2xl mb-2">Management</CardTitle>
              <CardDescription>
                Management tasks
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
