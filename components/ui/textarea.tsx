import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-16 w-full rounded-lg border border-white/10 bg-transparent px-4 py-3 text-white placeholder:text-gray-400 transition-all duration-200 resize-none",
        "focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none",
        "hover:border-white/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
