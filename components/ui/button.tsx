'use client';

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[14px] text-sm font-semibold tracking-wide font-subhead transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sun-plum focus-visible:ring-offset-background hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-sun-plum text-white hover:bg-sun-plum/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive",
        outline:
          "border-2 border-sun-sand bg-transparent hover:bg-sun-sand/50 hover:text-sun-cocoa",
        secondary:
          "bg-sun-sand text-sun-cocoa hover:bg-sun-sand/80",
        ghost:
          "hover:bg-sun-sand/50 hover:text-sun-cocoa",
        link: "text-sun-plum underline-offset-4 hover:underline hover:text-sun-plum/80 rounded-none hover:scale-100 active:scale-100",
        glow: "bg-sun-plum text-white ring-4 ring-sun-gold/40 hover:ring-sun-gold/60 hover:bg-sun-plum/90",
        "glow-purple": "bg-sun-plum text-white ring-4 ring-sun-gold/30 hover:ring-sun-gold/50 hover:bg-sun-plum/90",
        "glow-yellow": "bg-sun-gold text-sun-cocoa ring-4 ring-sun-plum/30 hover:ring-sun-plum/50 hover:bg-sun-gold/90",
      },
      size: {
        default: "h-11 px-6 has-[>svg]:px-5",
        sm: "h-9 gap-1.5 px-4 has-[>svg]:px-3.5",
        lg: "h-12 px-7 has-[>svg]:px-6 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
