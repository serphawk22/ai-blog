import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative group w-full">
        <textarea
          className={cn(
            "flex min-h-[150px] w-full rounded-2xl border border-white/10 bg-[#0C1224]/50 px-5 py-4 text-sm text-white transition-all duration-300 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-ds-cyan/50 focus:border-ds-cyan focus:bg-[#0C1224] shadow-inner resize-none",
            className
          )}
          ref={ref}
          {...props}
        />
        <div className="absolute inset-0 rounded-2xl pointer-events-none group-focus-within:shadow-[0_0_20px_rgba(0,229,255,0.15)] transition-all duration-500"></div>
      </div>
    )
  }
)
Textarea.displayName = "Textarea"
