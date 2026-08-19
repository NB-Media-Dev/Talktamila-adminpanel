import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,#E6703A,#FFA663)] text-white hover:brightness-110 transition-all duration-200",

        destructive:
          "bg-gradient-to-br from-[#FF416C] to-[#FF4B2B] text-white",
        
        sucess:
        "bg-emerald-200 text-emerald-700 border border-emerald-100",

        outline:
          "border border-brand bg-transparent text-brand hover:bg-brand hover:text-white",

        secondary:
          "bg-secondary text-[#000000]/70 hover:bg-secondary-hover transition-all duration-200",

        ghost:
          "text-foreground/70 hover:bg-muted hover:text-foreground",

        link:
          "text-brand underline-offset-4 hover:underline",
        bgcolor:
        "bg-[#FFEFE0] hover:bg-[#FCE3CC]  text-gray-600 ",
        hovericon:
        "hover:text-[#E05D24] transition-colors cursor-pointer",
        hoverButton:
        "border border-[#FF6B35] text-[#FF6B35] font-semibold text-sm hover:bg-[linear-gradient(135deg,#E6703A,#FFA663)]  hover:text-white transition-all duration-200 active:scale-98 cursor-pointer"
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
