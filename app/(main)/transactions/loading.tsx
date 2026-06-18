import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function TransactionsLoading() {
  return (
    <div className="container mx-auto space-y-6">
      <Skeleton className="h-10 w-48 bg-white/10 dark:bg-white/5" />

      {/* Top bar skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Skeleton className="h-10 w-full sm:w-[250px] bg-white/10 dark:bg-white/5" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[120px] bg-white/10 dark:bg-white/5" />
            <Skeleton className="h-10 w-[120px] bg-white/10 dark:bg-white/5" />
          </div>
        </div>
        <Skeleton className="h-10 w-full sm:w-[150px] bg-white/10 dark:bg-white/5" />
      </div>

      <Card className="bg-white/5 dark:bg-black/20 backdrop-blur-xl border-white/20 dark:border-white/10 overflow-hidden">
        <CardContent className="p-0">
          <div className="hidden md:block">
            {/* Table Header Skeleton */}
            <div className="border-b border-white/10 flex px-4 py-3">
              <Skeleton className="h-4 w-24 mr-auto bg-white/10 dark:bg-white/5" />
              <div className="flex gap-24 mr-16">
                <Skeleton className="h-4 w-20 bg-white/10 dark:bg-white/5" />
                <Skeleton className="h-4 w-20 bg-white/10 dark:bg-white/5" />
                <Skeleton className="h-4 w-20 bg-white/10 dark:bg-white/5" />
                <Skeleton className="h-4 w-20 bg-white/10 dark:bg-white/5" />
              </div>
            </div>
            
            {/* Table Rows Skeleton */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex px-4 py-4 border-b border-white/5 items-center">
                <Skeleton className="h-4 w-40 mr-auto bg-white/10 dark:bg-white/5" />
                <div className="flex gap-20 mr-12 items-center">
                  <Skeleton className="h-6 w-20 rounded-full bg-white/10 dark:bg-white/5" />
                  <Skeleton className="h-4 w-24 bg-white/10 dark:bg-white/5" />
                  <Skeleton className="h-4 w-24 bg-white/10 dark:bg-white/5" />
                  <Skeleton className="h-8 w-8 rounded-md bg-white/10 dark:bg-white/5" />
                </div>
              </div>
            ))}
          </div>

          {/* Mobile view skeleton */}
          <div className="md:hidden flex flex-col p-4 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg border border-white/10 space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-32 bg-white/10 dark:bg-white/5" />
                  <Skeleton className="h-5 w-24 bg-white/10 dark:bg-white/5" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24 bg-white/10 dark:bg-white/5" />
                  <Skeleton className="h-6 w-20 rounded-full bg-white/10 dark:bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
