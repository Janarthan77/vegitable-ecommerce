'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PremiumButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'whatsapp'
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
    secondary: 'bg-white text-[#14532D] border border-[#14532D]/30 hover:border-[#14532D]/60 hover:bg-[#f0fdf4]',
    danger:    'bg-rose-600 text-white shadow-md shadow-rose-600/20 hover:bg-rose-700',
    ghost:     'bg-transparent text-[#14532D] hover:bg-[#DCFCE7]/60',
    whatsapp:  'bg-[#25D366] text-white shadow-md shadow-[#25D366]/20 hover:bg-[#22c55e]',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2',
  }

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.015 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      disabled={disabled}
      className={cn(
        'rounded-xl font-semibold tracking-wide transition-colors flex items-center justify-center',
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
