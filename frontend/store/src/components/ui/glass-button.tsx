'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  fullWidth?: boolean
  icon?: ReactNode
  type?: 'button' | 'submit' | 'reset'
  form?: string
}

export function GlassButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  fullWidth,
  icon,
  type,
  form
}: GlassButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25',
    secondary: 'bg-white/50 backdrop-blur-lg border border-white/40 text-gray-700',
    danger: 'bg-gradient-to-r from-rose-500 to-red-600 text-white',
    ghost: 'bg-transparent text-gray-600 hover:bg-white/30',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  }

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      disabled={disabled}
      className={cn(
        'rounded-xl font-semibold transition-all flex items-center justify-center gap-2',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={onClick}
      type={type}
      form={form}
    >
      {icon}
      {children}
    </motion.button>
  )
}
