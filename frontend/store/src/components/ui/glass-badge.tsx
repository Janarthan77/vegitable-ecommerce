'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassBadgeProps {
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
}: GlassBadgeProps) {
  const variants = {
    success: 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-700 border border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-700 border border-rose-500/30',
    info: 'bg-sky-500/15 text-sky-700 border border-sky-500/30',
    sale: 'bg-gradient-to-r from-orange-500 to-rose-500 text-white',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
  }

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'backdrop-blur-sm rounded-full font-semibold inline-flex items-center justify-center',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </motion.span>
  )
}
