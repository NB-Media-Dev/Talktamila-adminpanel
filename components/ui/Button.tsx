import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,#E6703A,#FFA663)] text-white hover:bg-brand-hover ",

        destructive:
          "bg-gradient-to-br from-[#FF416C] to-[#FF4B2B] text-white",

        outline:
          "border border-brand bg-transparent text-brand hover:bg-brand hover:text-white",

        secondary:
          "bg-secondary text-[#000000]/70 hover:bg-white/90",

        ghost:
          "text-foreground/70 hover:bg-muted hover:text-foreground",

        link:
          "text-brand underline-offset-4 hover:underline",
        bgcolor:
        "bg-[#FFEFE0] hover:bg-[#FCE3CC]  text-gray-600 "
      },

    },

    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant,type = "button", ...props }, ref) => {
    return (
      <button
        type={type}
        className={buttonVariants({ variant, className })}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
