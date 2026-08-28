'use client'

import { categories } from '@/lib/data/categories'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CategoryChipsProps {
  activeCategory?: string
}

export function CategoryChips({ activeCategory = 'all' }: CategoryChipsProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-3 w-max">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Link
            href="/"
            className={cn(
              'rounded-full px-4 py-2 flex items-center gap-2 whitespace-nowrap transition-all shadow-sm font-medium',
              activeCategory === 'all'
                ? 'bg-emerald-500 text-white'
                : 'bg-white/40 backdrop-blur-sm border border-white/30 text-gray-700 hover:bg-white/60'
            )}
          >
            <span>🛒</span>
            <span>All</span>
          </Link>
        </motion.div>
        
        {categories.map((category, index) => {
          const isActive = activeCategory === category.slug
          return (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (index + 1) * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Link
                href={`/category/${category.slug}`}
                className={cn(
                  'rounded-full px-4 py-2 flex items-center gap-2 whitespace-nowrap transition-all shadow-sm font-medium',
                  isActive
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/40 backdrop-blur-sm border border-white/30 text-gray-700 hover:bg-white/60'
                )}
              >
                <span>{category.emoji}</span>
                <span>{category.name}</span>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
