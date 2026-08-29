'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PremiumBadgeProps {
  children: ReactNode
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'sale' | 'fresh'
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
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger:  'bg-rose-50 text-rose-700 border border-rose-200',
    info:    'bg-sky-50 text-sky-700 border border-sky-200',
    sale:    'bg-[#14532D] text-white',
    fresh:   'bg-[#B45309]/10 text-[#B45309] border border-[#B45309]/20',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-[9px]',
    md: 'px-2.5 py-0.5 text-[10px]',
  }

  return (
    <span
      className={cn(
        'rounded-full font-bold uppercase tracking-wide inline-flex items-center justify-center',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}
