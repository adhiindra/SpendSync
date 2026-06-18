import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SettingsLoading() {
  return (
    <div className="container mx-auto max-w-2xl space-y-6">
      <Skeleton className="h-10 w-40 mb-6 bg-white/10 dark:bg-white/5" />

      <Card className="bg-white/5 dark:bg-black/20 backdrop-blur-xl border-white/20 dark:border-white/10">
        <CardHeader>
          <Skeleton className="h-6 w-32 bg-white/10 dark:bg-white/5" />
          <Skeleton className="h-4 w-56 mt-1 bg-white/10 dark:bg-white/5" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 bg-white/10 dark:bg-white/5" />
            <Skeleton className="h-10 w-full bg-white/10 dark:bg-white/5" />
            <Skeleton className="h-4 w-64 bg-white/10 dark:bg-white/5" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-32 bg-white/10 dark:bg-white/5" />
            <Skeleton className="h-10 w-full bg-white/10 dark:bg-white/5" />
            <Skeleton className="h-4 w-72 bg-white/10 dark:bg-white/5" />
          </div>

          <Skeleton className="h-10 w-32 bg-white/10 dark:bg-white/5" />
        </CardContent>
      </Card>
    </div>
  )
}
