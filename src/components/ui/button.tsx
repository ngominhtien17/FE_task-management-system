import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-primary-dark to-primary text-white shadow-button hover:shadow-button-hover hover:brightness-110 active:scale-[0.98]",
        outline: "border border-border bg-background hover:bg-background-secondary text-text",
        secondary: "bg-primary-light text-primary hover:bg-primary-light/80",
        ghost: "hover:bg-primary-light/50 hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-dark",
        destructive: "bg-error text-white hover:bg-error/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-[52px] px-8 text-[15px] font-medium tracking-wider",
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