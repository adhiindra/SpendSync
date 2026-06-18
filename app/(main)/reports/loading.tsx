import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ReportsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Skeleton className="h-10 w-48 bg-white/10 dark:bg-white/5" />
        <Skeleton className="h-10 w-[240px] bg-white/10 dark:bg-white/5" />
      </div>

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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card className="bg-white/5 dark:bg-black/20 backdrop-blur-xl border-white/20 dark:border-white/10">
          <CardHeader className="items-center pb-0">
            <Skeleton className="h-5 w-40 bg-white/10 dark:bg-white/5" />
            <Skeleton className="h-4 w-48 mt-1 bg-white/10 dark:bg-white/5" />
          </CardHeader>
          <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[300px]">
            <Skeleton className="h-48 w-48 rounded-full bg-white/10 dark:bg-white/5" />
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 dark:bg-black/20 backdrop-blur-xl border-white/20 dark:border-white/10">
          <CardHeader>
            <Skeleton className="h-5 w-40 bg-white/10 dark:bg-white/5" />
            <Skeleton className="h-4 w-56 mt-1 bg-white/10 dark:bg-white/5" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full bg-white/10 dark:bg-white/5" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
