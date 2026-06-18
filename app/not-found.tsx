"use client"

import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { OrbBackground } from "@/components/ui/orb-background"
import { SearchX, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden items-center justify-center p-4">
      <OrbBackground />
      
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="rounded-2xl bg-card/40 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10 ring-1 ring-foreground/5 p-8 sm:p-12 text-center flex flex-col items-center">
          
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-secondary-foreground border mb-6">
            <SearchX className="h-10 w-10 text-muted-foreground" />
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">404</h1>
          <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
          
          <p className="text-muted-foreground mb-8 text-sm sm:text-base">
            Oops! The page you are looking for doesn't exist or has been moved.
          </p>
          
          <Link 
            href="/dashboard"
            className={cn(buttonVariants({ variant: "default" }), "w-full sm:w-auto gap-2 rounded-full px-8")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

        </div>
      </div>
    </div>
  )
}
