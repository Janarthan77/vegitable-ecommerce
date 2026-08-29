'use client'

import { useState, useEffect } from 'react'
import { Home, Grid3X3, ShoppingCart } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/store/use-cart'
import { cn } from '@/lib/utils'

export function FloatingNav() {
  const pathname = usePathname()
  const { getItemCount } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const itemCount = mounted ? getItemCount() : 0

  const navItems = [
    { name: 'Home',       href: '/',             icon: Home },
    { name: 'Categories', href: '/category/all',  icon: Grid3X3 },
    { name: 'Cart',       href: '/cart',           icon: ShoppingCart, badge: itemCount },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 premium-nav">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname?.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-1 min-w-[60px] py-1"
            >
              {/* Active indicator line — top */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="nav-line"
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#14532D]"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0, scaleX: 0 }}
                    transition={{ type: 'spring', stiffness: 340, damping: 26 }}
                  />
                )}
              </AnimatePresence>

              {/* Icon */}
              <div className="relative">
                <div
                  className={cn(
                    'w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-[#DCFCE7] text-[#14532D]'
                      : 'text-stone-400 hover:text-stone-600'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Badge */}
                {item.badge ? (
                  <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 bg-[#B45309] text-white rounded-full flex items-center justify-center text-[9px] font-bold px-1">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                ) : null}
              </div>

              {/* Label */}
              <span
                className={cn(
                  'text-[10px] font-semibold transition-colors tracking-wide',
                  isActive ? 'text-[#14532D]' : 'text-stone-400'
                )}
              >
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
