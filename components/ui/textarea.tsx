import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-sunshine-brown/60 focus-visible:border-sunshine-purple focus-visible:ring-2 focus-visible:ring-sunshine-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-background flex field-sizing-content min-h-16 w-full rounded-2xl border-2 border-sunshine-purple bg-sunshine-white text-sunshine-brown px-4 py-3 text-base transition-[color,border] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
