'use client'

import { categories } from '@/lib/data/categories'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CategoryGridProps {
  activeCategory?: string
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}
const cardVar = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 24 } },
}

const ALL = { id: 'all', name: 'All Items', tamilName: 'அனைத்தும்', slug: 'all', emoji: '🛒', color: 'from-[#14532D] to-[#166534]', href: '/' }

export function CategoryChips({ activeCategory = 'all' }: CategoryGridProps) {
  const all = [
    { ...ALL, href: '/' },
    ...categories.map((c) => ({ ...c, href: `/category/${c.slug}` })),
  ]

  return (
    <motion.div
      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {all.map((cat) => {
        const isActive = activeCategory === cat.slug
        return (
          <motion.div key={cat.slug} variants={cardVar}>
            <Link href={cat.href}>
              <div
                className={cn(
                  'card flex flex-col items-center gap-2 py-4 px-2 rounded-2xl text-center cursor-pointer transition-all duration-200',
                  isActive
                    ? 'border-[#14532D] ring-1 ring-[#14532D]/30 shadow-[0_4px_16px_rgba(20,83,45,0.14)]'
                    : 'hover:border-stone-300 hover:shadow-md'
                )}
              >
                {/* Icon circle */}
                <div
                  className={cn(
                    'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-all',
                    isActive ? 'bg-[#14532D] shadow-md' : 'bg-[#F5F5F0]'
                  )}
                >
                  {isActive ? (
                    <span>{cat.emoji}</span>
                  ) : (
                    <span>{cat.emoji}</span>
                  )}
                </div>

                {/* Name */}
                <div>
                  <p className={cn(
                    'font-display text-[11px] font-semibold leading-tight',
                    isActive ? 'text-[#14532D]' : 'text-[#1A1A1A]'
                  )}>
                    {cat.name}
                  </p>
                  {cat.tamilName && (
                    <p className="text-[9px] text-stone-400 mt-0.5 font-sans">{cat.tamilName}</p>
                  )}
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="w-6 h-0.5 rounded-full bg-[#14532D]" />
                )}
              </div>
            </Link>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
