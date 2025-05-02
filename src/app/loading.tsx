import { Skeleton } from "@/components/ui/skeleton"

export default function RootLoading() {
  return (
    <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl space-y-6">
        {/* Logo and navigation skeleton */}
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-10 w-32" />
          <div className="flex gap-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>

        {/* Hero section skeleton */}
        <div className="flex flex-col items-center text-center py-10">
          <Skeleton className="h-12 w-[80%] max-w-xl mb-4" />
          <Skeleton className="h-6 w-[60%] max-w-md mb-8" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>

        {/* Content section skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-[70%]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>

        {/* Loading indicator */}
        <div className="flex justify-center py-6">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
} 