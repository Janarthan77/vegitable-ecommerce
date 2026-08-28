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
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-white/40 backdrop-blur-lg border border-white/30 rounded-xl px-4 py-3 outline-none transition-all',
              'focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400',
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
