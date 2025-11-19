import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-sunshine-brown/60 selection:bg-primary selection:text-primary-foreground h-11 w-full min-w-0 rounded-full border-2 border-sunshine-purple bg-sunshine-white text-sunshine-brown px-4 py-3 text-base transition-[color,border] outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-sunshine-purple focus-visible:ring-2 focus-visible:ring-sunshine-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
      {...props}
    />
  )
}

export { Input }
