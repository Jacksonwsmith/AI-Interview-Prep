import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-70",
  {
    variants: {
      intent: {
        primary:
          "bg-indigo-500 text-white hover:bg-indigo-400 focus-visible:outline-indigo-300",
        secondary:
          "border border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500 focus-visible:outline-slate-400",
        subtle:
          "bg-slate-800/80 text-slate-100 hover:bg-slate-700/60 focus-visible:outline-slate-300",
        ghost: "text-slate-300 hover:text-white",
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
