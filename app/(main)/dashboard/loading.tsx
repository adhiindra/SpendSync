import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48 bg-white/10 dark:bg-white/5" />

      {/* Summary Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-white/5 dark:bg-black/20 backdrop-blur-xl border-white/20 dark:border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24 bg-white/10 dark:bg-white/5" />
              <Skeleton className="h-4 w-4 rounded-full bg-white/10 dark:bg-white/5" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-1 bg-white/10 dark:bg-white/5" />
              <Skeleton className="h-3 w-20 bg-white/10 dark:bg-white/5" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 bg-white/5 dark:bg-black/20 backdrop-blur-xl border-white/20 dark:border-white/10">
          <CardHeader>
            <Skeleton className="h-5 w-32 bg-white/10 dark:bg-white/5" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full bg-white/10 dark:bg-white/5" />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 bg-white/5 dark:bg-black/20 backdrop-blur-xl border-white/20 dark:border-white/10">
          <CardHeader>
            <Skeleton className="h-5 w-40 bg-white/10 dark:bg-white/5" />
            <Skeleton className="h-4 w-56 mt-1 bg-white/10 dark:bg-white/5" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <Skeleton className="h-9 w-9 rounded-full bg-white/10 dark:bg-white/5" />
                  <div className="ml-4 space-y-1">
                    <Skeleton className="h-4 w-32 bg-white/10 dark:bg-white/5" />
                    <Skeleton className="h-3 w-24 bg-white/10 dark:bg-white/5" />
                  </div>
                  <div className="ml-auto">
                    <Skeleton className="h-4 w-16 bg-white/10 dark:bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
