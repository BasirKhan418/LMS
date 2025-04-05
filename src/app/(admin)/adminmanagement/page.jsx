import { Suspense } from "react"
import AdminDashboard from "@/utilities/AddAdmin/admin-dashboard"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto py-8 px-4 sm:px-6">
        <div className="flex flex-col space-y-2 mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight ">
            Admin Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Create, view, edit, and delete admin accounts.</p>
        </div>

        <div className="bg-white dark:bg-slate-950 rounded-xl shadow-xl p-6 border border-slate-200 dark:border-slate-800">
          <Suspense fallback={<AdminTableSkeleton />}>
            <AdminDashboard />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function AdminTableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-12 w-[300px] rounded-lg" />
        <Skeleton className="h-12 w-[150px] rounded-lg" />
      </div>
      <Skeleton className="h-[450px] w-full rounded-lg" />
    </div>
  )
}

