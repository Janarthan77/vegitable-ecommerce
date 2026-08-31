'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Leaf, ShoppingBag, MessageCircle, ShieldCheck, Search } from 'lucide-react'
import { useCart } from '@/lib/store/use-cart'
import { formatPrice, isStoreOpen } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { SearchBar } from '@/components/store/search-bar'
import { fetchStoreSettings, fetchCategories } from '@/lib/api'

export function DesktopNavbar() {
  const pathname = usePathname()
  const { getItemCount, getTotal } = useCart()
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
    fetchStoreSettings().then(data => {
      if (data) setSettings(data)
    }).catch(() => {})

    fetchCategories().then(data => {
      if (data && Array.isArray(data)) setCategories(data)
    }).catch(() => {})
  }, [])

  const navLinks = [
    { name: 'All Items', href: '/category/all' },
    ...categories.map(c => ({
      name: `${c.name} ${c.emoji || ''}`,
      href: `/category/${c.slug}`,
    })),
  ]

  const itemCount = mounted ? getItemCount() : 0
  const total = mounted ? getTotal() : 0

  const workingHours = settings?.working_hours
  const storeStatus = isStoreOpen(workingHours)
  const openTime = workingHours ? `${workingHours.openHour}:${workingHours.openMinute} ${workingHours.openPeriod}` : '06:00 AM'
  const closeTime = workingHours ? `${workingHours.closeHour}:${workingHours.closeMinute} ${workingHours.closePeriod}` : '09:00 PM'

  return (
    <header className="hidden md:block sticky top-0 z-[100] bg-[#FAFAF6]/95 backdrop-blur-md border-b border-stone-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      {/* Top utility strip */}
      <div className="bg-[#14532D] text-white text-xs py-1.5 px-6 font-sans">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${storeStatus.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            <span className="font-semibold text-emerald-200">{storeStatus.isOpen ? 'Open:' : 'Shop Closed:'}</span>
            <span>{openTime} – {closeTime}</span>
            <span className="text-emerald-300/40 hidden lg:inline">|</span>
            <span className="hidden lg:inline">{storeStatus.isOpen ? 'Farm fresh produce delivered within 30 minutes' : 'Orders paused outside working hours'}</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-100">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <MessageCircle size={13} />
              <span>WhatsApp: +91 98765 43210</span>
            </a>
            <span>·</span>
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors font-medium"
            >
              <ShieldCheck size={13} />
              <span>Admin Portal ↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-6">
        {/* Brand logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 rounded-2xl bg-[#14532D] text-white flex items-center justify-center shadow-md shadow-[#14532D]/20 group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <span className="font-display text-2xl font-bold text-[#14532D] tracking-tight block leading-none">
              Kaikaari
            </span>
            <span className="text-[11px] text-stone-400 font-sans tracking-wide block mt-1">
              உங்கள் காய்கறி கடை
            </span>
          </div>
        </Link>

        {/* Desktop Search bar */}
        <div className="flex-1 max-w-md">
          <SearchBar />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/cart"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-stone-200 hover:border-[#14532D]/40 shadow-sm transition-all group cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-[#14532D] group-hover:scale-110 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2.5 min-w-[18px] h-4.5 bg-[#B45309] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
                  {itemCount}
                </span>
              )}
            </div>
            <div className="text-left font-sans">
              <span className="text-[11px] text-stone-400 block leading-tight">My Cart</span>
              <span className="text-sm font-bold text-[#1A1A1A] block leading-tight">
                {formatPrice(total)}
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Category navigation bar */}
      <div className="border-t border-stone-100 bg-white/60">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-1 overflow-x-auto py-2 font-sans text-xs">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              pathname === '/' ? 'bg-[#14532D] text-white' : 'text-stone-600 hover:text-[#14532D] hover:bg-stone-100'
            }`}
          >
            Home
          </Link>
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  isActive ? 'bg-[#14532D] text-white' : 'text-stone-600 hover:text-[#14532D] hover:bg-stone-100'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </div>
      </div>
    </header>
  )
}
