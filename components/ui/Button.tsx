import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,#E6703A,#FFA663)] rounded-full text-white hover:brightness-110 transition-all duration-200 cursor-pointer",

        destructive:
          "bg-gradient-to-br from-[#FF416C] to-[#FF4B2B] text-white cursor-pointer rounded-full",
        
        sucess:
        "bg-emerald-200 text-emerald-700 border border-emerald-100 cursor-pointer rounded-full",

        outline:
          "border-2 border-[#C04808] text-[#C04808] hover:bg-[#FFF2EC] active:scale-195 rounded-full font-bold transition-all text-center cursor-pointer duration-300 bg-transparent",

        secondary:
          "bg-secondary text-[#000000]/70 hover:bg-secondary-hover rounded-full transition-all duration-200 cursor-pointer",

        ghost:
          "w-10 h-10 rounded-2xl bg-[#FFF2EC] text-[#C04808] rounded-full flex items-center justify-center shrink-0 cursor-pointer",

        link:
          "text-brand underline-offset-4  cursor-pointer",
        bgcolor:
        "bg-[#FFEFE0] hover:bg-[#FCE3CC]  text-gray-600 cursor-pointer rounded-full",
        hovericon:
        "hover:text-[#E05D24] transition-colors cursor-pointer cursor-pointer rounded-full",
        hoverButton:
        "border border-[#FF6B35] text-[#FF6B35] font-semibold text-sm hover:bg-[linear-gradient(135deg,#E6703A,#FFA663)]  hover:text-white transition-all duration-200 rounded-full active:scale-98 cursor-pointer"
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
