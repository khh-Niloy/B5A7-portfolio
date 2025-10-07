import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full rounded-lg border border-white/10 bg-transparent px-4 py-2 text-white placeholder:text-gray-400 transition-all duration-200",
        "focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none",
        "hover:border-white/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
