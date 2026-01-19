import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-sun-plum focus-visible:ring-sun-plum/50 focus-visible:ring-[3px] transition-[color,border] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-sun-plum text-white [a&]:hover:bg-sun-plum/90",
        secondary:
          "border-transparent bg-sun-sand text-sun-cocoa [a&]:hover:bg-sun-sand/80",
        destructive:
          "border-transparent bg-sun-coral text-white [a&]:hover:bg-sun-coral/90 focus-visible:ring-sun-coral/20",
        outline:
          "border-sun-sand text-sun-cocoa [a&]:hover:bg-sun-sand [a&]:hover:text-sun-cocoa",
        success:
          "border-transparent bg-sun-leaf text-white [a&]:hover:bg-sun-leaf/90",
        gold:
          "border-transparent bg-sun-gold text-sun-cocoa [a&]:hover:bg-sun-gold/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
