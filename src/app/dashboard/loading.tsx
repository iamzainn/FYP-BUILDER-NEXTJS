import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="container mx-auto p-4">
      <div className="space-y-8">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-12 w-[250px]" />
          <Skeleton className="h-10 w-[120px] rounded-md" />
        </div>

        {/* Dashboard card skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="p-6 border rounded-lg shadow">
              <Skeleton className="h-8 w-[180px] mb-4" />
              <Skeleton className="h-24 w-full mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-6 w-[100px]" />
                <Skeleton className="h-6 w-[80px]" />
              </div>
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="border rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <Skeleton className="h-8 w-[200px]" />
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex justify-between items-center py-2">
                  <Skeleton className="h-6 w-[250px]" />
                  <Skeleton className="h-6 w-[120px]" />
                  <Skeleton className="h-6 w-[100px]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 