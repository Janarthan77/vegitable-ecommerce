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

const colorMap: Record<string, { bg: string; text: string; accent: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-[#14532D]', accent: '#14532D' },
  orange:  { bg: 'bg-amber-50',   text: 'text-amber-800', accent: '#B45309' },
  rose:    { bg: 'bg-rose-50',    text: 'text-rose-700',  accent: '#E11D48' },
  sky:     { bg: 'bg-sky-50',     text: 'text-sky-800',   accent: '#0284C7' },
  yellow:  { bg: 'bg-yellow-50',  text: 'text-yellow-800',accent: '#CA8A04' },
}

export function StatsCard({ title, value, icon, trend, color = 'emerald' }: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(typeof value === 'number' ? 0 : value)
  const c = colorMap[color] || colorMap.emerald

  useEffect(() => {
    if (typeof value === 'number') {
      const duration = 750
      const steps = 40
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <GlassCard className="relative overflow-hidden p-5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5 font-sans">
              {title}
            </p>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              {typeof value === 'number' && title.toLowerCase().includes('revenue') ? `₹${displayValue}` : displayValue}
            </h3>
            {trend && (
              <p className="text-xs mt-1.5 font-medium text-stone-400 font-sans">
                {trend}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-2xl ${c.bg} ${c.text} shadow-sm`}>
            {icon}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
