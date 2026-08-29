'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PremiumBadgeProps {
  children: ReactNode
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'sale'
  className?: string
  size?: 'sm' | 'md'
}

export function GlassBadge({
  children,
  variant = 'info',
  className,
  size = 'md',
}: PremiumBadgeProps) {
  const variants = {
    success: 'bg-[#DCFCE7] text-[#14532D] border border-[#14532D]/20',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger:  'bg-rose-50 text-rose-700 border border-rose-200',
    info:    'bg-sky-50 text-sky-800 border border-sky-200',
    sale:    'bg-[#14532D] text-white',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  }

  return (
    <span
      className={cn(
        'rounded-full font-bold uppercase tracking-wider inline-flex items-center justify-center',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}
