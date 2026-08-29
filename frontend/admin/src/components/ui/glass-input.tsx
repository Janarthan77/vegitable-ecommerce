'use client'

import { InputHTMLAttributes, ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: ReactNode
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, label, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5 font-sans">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 outline-none transition-all text-sm text-[#1A1A1A] placeholder:text-stone-400',
              'focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/10',
              icon ? 'pl-10' : undefined,
              className
            )}
            {...props}
          />
        </div>
      </div>
    )
  }
)
GlassInput.displayName = 'GlassInput'
