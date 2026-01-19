import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-sun-cocoa/60 flex field-sizing-content min-h-16 w-full rounded-2xl border border-sun-sand bg-sun-paper text-sun-cocoa px-4 py-3 text-base outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "transition-all duration-200 ease-out",
        "focus-visible:border-sun-plum focus-visible:ring-2 focus-visible:ring-sun-plum/30 focus-visible:ring-offset-0",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
