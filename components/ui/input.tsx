import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-sun-cocoa/60 selection:bg-primary selection:text-primary-foreground h-11 w-full min-w-0 rounded-full border-2 border-sun-sand bg-sun-paper text-sun-cocoa px-4 py-3 text-base outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "transition-all duration-200 ease-out",
        "focus-visible:border-sun-plum focus-visible:ring-2 focus-visible:ring-sun-plum/30 focus-visible:ring-offset-0",
        className
      )}
      {...props}
    />
  )
}

export { Input }
