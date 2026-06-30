import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ds-cyan focus:ring-offset-2 focus:ring-offset-ds-background active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group relative overflow-hidden",
          {
            'bg-gradient-premium text-white shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(157,78,221,0.5)] hover:-translate-y-0.5': variant === 'primary',
            'bg-ds-secondary text-white hover:bg-[#151c33] border border-white/10 hover:border-white/20 shadow-sm': variant === 'secondary',
            'glass-panel glass-panel-hover text-white': variant === 'glass',
            'hover:bg-white/5 text-slate-300 hover:text-white': variant === 'ghost',
            'px-4 py-2 text-sm rounded-xl': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
            'p-3 rounded-full': size === 'icon',
          },
          className
        )}
        {...props}
      >
        {/* Glow effect for primary button */}
        {variant === 'primary' && (
          <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay"></span>
        )}
        <span className="relative z-10 flex items-center gap-2">{props.children}</span>
      </button>
    )
  }
)
Button.displayName = "Button"
