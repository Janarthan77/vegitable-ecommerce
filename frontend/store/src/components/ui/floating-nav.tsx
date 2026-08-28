'use client'

import { Home, Grid3X3, ShoppingCart, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCart } from '@/lib/store/use-cart'
import { cn } from '@/lib/utils'

export function FloatingNav() {
  const pathname = usePathname()
  const { getItemCount } = useCart()
  const itemCount = getItemCount()

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Categories', href: '/category/all', icon: Grid3X3 },
    { name: 'Cart', href: '/cart', icon: ShoppingCart, badge: itemCount },
    { name: 'Account', href: '/admin', icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl border-t border-white/30 pb-safe pb-6">
      <div className="flex items-center justify-around px-4 py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center gap-1 text-xs transition-colors',
                isActive ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-500'
              )}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {item.badge ? (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="font-medium">{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-2 w-1 h-1 bg-emerald-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
