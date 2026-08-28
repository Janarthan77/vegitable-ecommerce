'use client'

import { motion } from 'framer-motion'
import { ReactNode, useEffect, useState } from 'react'
import { GlassCard } from '@/components/ui/glass-card'

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: string
  color?: string
}

export function StatsCard({ title, value, icon, trend, color = 'emerald' }: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(typeof value === 'number' ? 0 : value)

  useEffect(() => {
    if (typeof value === 'number') {
      const duration = 1000
      const steps = 60
      const stepTime = duration / steps
      const increment = value / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setDisplayValue(value)
          clearInterval(timer)
        } else {
          setDisplayValue(Math.floor(current))
        }
      }, stepTime)
      return () => clearInterval(timer)
    } else {
      setDisplayValue(value)
    }
  }, [value])

  const colorStyles: Record<string, string> = {
    emerald: 'border-l-emerald-500 text-emerald-500',
    orange: 'border-l-orange-500 text-orange-500',
    rose: 'border-l-rose-500 text-rose-500',
    sky: 'border-l-sky-500 text-sky-500',
    yellow: 'border-l-yellow-400 text-yellow-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <GlassCard className={`relative overflow-hidden border-l-4 ${colorStyles[color] || colorStyles.emerald} p-4 sm:p-6`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800">
              {displayValue}
            </h3>
            {trend && (
              <p className={`text-xs mt-2 font-medium ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {trend}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-white/50 backdrop-blur-md shadow-sm border border-white/40 ${colorStyles[color]?.split(' ')[1] || 'text-emerald-500'}`}>
            {icon}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
