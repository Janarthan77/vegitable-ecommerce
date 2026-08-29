'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PremiumCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function GlassCard({
  children,
  className,
  onClick,
  hover = true,
  padding = 'md',
}: PremiumCardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4 sm:p-5',
    lg: 'p-6',
  }

  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -1.5 } : {}}
      whileTap={hover && onClick ? { scale: 0.99 } : {}}
      transition={{ type: 'spring', stiffness: 340, damping: 26 }}
      className={cn('card', paddingClasses[padding], onClick && 'cursor-pointer', className)}
    >
      {children}
    </motion.div>
  )
}
