'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PremiumButtonProps {
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
  form,
}: PremiumButtonProps) {
  const variants = {
    primary:   'bg-[#14532D] text-white shadow-md shadow-[#14532D]/20 hover:bg-[#166534]',
    secondary: 'bg-white text-[#14532D] border border-stone-200 hover:border-stone-300 hover:bg-stone-50 shadow-sm',
    danger:    'bg-rose-600 text-white shadow-md shadow-rose-600/20 hover:bg-rose-700',
    ghost:     'bg-transparent text-[#14532D] hover:bg-[#DCFCE7]/50',
  }

  const sizes = {
    sm: 'px-3.5 py-2 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  }

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.015 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      disabled={disabled}
      className={cn(
        'rounded-xl font-semibold tracking-wide transition-colors flex items-center justify-center cursor-pointer',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        disabled && 'opacity-40 cursor-not-allowed',
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
