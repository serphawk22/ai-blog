import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon: Icon, ...props }, ref) => {
    return (
      <div className="relative group w-full">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-ds-cyan transition-colors z-10 duration-300">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex w-full rounded-2xl border border-white/10 bg-[#0C1224]/50 px-5 py-4 text-sm text-white transition-all duration-300 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-ds-cyan/50 focus:border-ds-cyan focus:bg-[#0C1224] shadow-inner",
            Icon && "pl-12",
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
Input.displayName = "Input"
