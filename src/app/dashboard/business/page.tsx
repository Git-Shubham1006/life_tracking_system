import Link from "next/link";
import { Briefcase, Building2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function BusinessHubPage() {
  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-8">
      <h1 className="text-4xl font-bold text-teal-700 dark:text-teal-400">
        Business & Work
      </h1>
      <p className="text-muted-foreground text-center max-w-lg mb-8">
        Select whether you want to manage your Job (Part-Time/Full-Time) or your own Business ventures.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link href="/dashboard/business/job" className="group block w-full">
          <Card className="h-64 flex flex-col items-center justify-center hover:bg-beige-100/50 dark:hover:bg-brown-800/50 hover:border-teal-500 transition-all cursor-pointer">
            <CardHeader className="text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8 text-teal-600 dark:text-teal-300" />
              </div>
              <CardTitle className="text-2xl mb-2">Job</CardTitle>
              <CardDescription className="text-base">
                Manage your part-time or full-time jobs, teaching schedules, and students.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/dashboard/business/owner" className="group block w-full">
          <Card className="h-64 flex flex-col items-center justify-center hover:bg-beige-100/50 dark:hover:bg-brown-800/50 hover:border-teal-500 transition-all cursor-pointer">
            <CardHeader className="text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-brown-100 dark:bg-brown-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-8 h-8 text-brown-600 dark:text-brown-300" />
              </div>
              <CardTitle className="text-2xl mb-2">Owner</CardTitle>
              <CardDescription>
                Manage your self-owned businesses and priority projects.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
