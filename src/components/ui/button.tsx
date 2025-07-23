import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-base font-semibold shadow-md ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C79F61] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:shadow-xl hover:scale-105",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#C79F61] to-[#8B6F43] text-white hover:from-[#8B6F43] hover:to-[#C79F61] border border-[#C79F61]",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 border border-[#C79F61]",
        outline:
          "border-2 border-[#C79F61] bg-[#FFF8E7] text-[#2D2212] hover:bg-[#F5E9D7] hover:text-[#8B6F43]",
        secondary:
          "bg-[#F5E9D7] text-[#2D2212] hover:bg-[#FFF8E7] border border-[#C79F61]",
        ghost: "hover:bg-[#FFF8E7] hover:text-[#C79F61]",
        link: "text-[#C79F61] underline-offset-4 hover:underline hover:text-[#8B6F43]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
