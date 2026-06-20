"use client"

import { WifiOff, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function OfflinePage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center text-center max-w-md space-y-6"
      >
        <motion.div
          initial={{ rotate: -15 }}
          animate={{ rotate: [15, -15, 0] }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
          <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-full border border-zinc-200 dark:border-zinc-800 relative shadow-sm">
            <WifiOff className="w-12 h-12 text-zinc-400 dark:text-zinc-500" strokeWidth={1.5} />
          </div>
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            You're offline
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            It looks like you've lost your internet connection. Some features may be unavailable, but you can still view cached pages.
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            onClick={() => window.location.reload()} 
            className="rounded-full shadow-md gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
