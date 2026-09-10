import Link from "next/link";
import { Clock, BriefcaseBusiness } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function JobHubPage() {
  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-8">
      <div className="w-full flex justify-start mb-4">
        <Link href="/dashboard/business">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Business
          </Button>
        </Link>
      </div>
      
      <h1 className="text-4xl font-bold text-teal-700 dark:text-teal-400">
        Job Management
      </h1>
      <p className="text-muted-foreground text-center max-w-lg mb-8">
        Are you working Part-Time or Full-Time?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <Link href="/dashboard/business/job/part-time" className="group">
          <Card className="h-64 flex flex-col items-center justify-center hover:bg-beige-100/50 dark:hover:bg-brown-800/50 hover:border-teal-500 transition-all cursor-pointer">
            <CardHeader className="text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-8 h-8 text-teal-600 dark:text-teal-300" />
              </div>
              <CardTitle className="text-2xl mb-2">Part Time</CardTitle>
              <CardDescription>
                Teacher, Assistant, Management
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/business/job/full-time" className="group">
          <Card className="h-64 flex flex-col items-center justify-center hover:bg-beige-100/50 dark:hover:bg-brown-800/50 hover:border-teal-500 transition-all cursor-pointer">
            <CardHeader className="text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BriefcaseBusiness className="w-8 h-8 text-blue-600 dark:text-blue-300" />
              </div>
              <CardTitle className="text-2xl mb-2">Full Time</CardTitle>
              <CardDescription>
                Manage your full-time job details
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
