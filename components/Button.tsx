import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-70",
  {
    variants: {
      intent: {
        primary:
          "border border-[#b85f43]/35 bg-[#ead7c5] text-[#261f19] shadow-[0_16px_36px_-24px_rgba(38,31,25,0.45)] hover:bg-[#e1c9b2] focus-visible:outline-[#b85f43]",
        secondary:
          "border border-[#cdbca6] bg-[#fffaf2]/80 text-[#261f19] hover:border-[#b85f43]/50 hover:bg-[#f3e8d7] focus-visible:outline-[#b85f43]",
        subtle:
          "bg-[#ead7c5] text-[#261f19] hover:bg-[#e1c9b2] focus-visible:outline-[#b85f43]",
        ghost: "text-[#8f3e2e] hover:text-[#261f19]",
      },
      size: {
        sm: "px-3 py-1.5",
        md: "px-4 py-2",
        lg: "px-5 py-2.5 text-base",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles>;

export function Button({ className, intent, size, ...props }: ButtonProps) {
  return <button className={cn(buttonStyles({ intent, size }), className)} {...props} />;
}
