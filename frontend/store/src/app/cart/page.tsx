'use client'

import { useCart } from '@/lib/store/use-cart'
import { formatPrice, formatProductWeight, getItemTotalPrice } from '@/lib/utils'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassBadge } from '@/components/ui/glass-badge'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchStoreSettings } from '@/lib/api'

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const { items, updateQuantity, removeItem, getTotal, getItemCount } = useCart()
  const total = getTotal()
  const itemCount = getItemCount()
  const router = useRouter()

  const [deliverySettings, setDeliverySettings] = useState({
    minOrder: 100,
    deliveryCharge: 0,
    deliveryRadius: 10,
  })
  
  useEffect(() => {
    setMounted(true)
    fetchStoreSettings()
      .then(data => {
        if (data?.delivery_settings) {
          setDeliverySettings({
            minOrder: Number(data.delivery_settings.minOrder) || 100,
            deliveryCharge: Number(data.delivery_settings.deliveryCharge) || 0,
            deliveryRadius: Number(data.delivery_settings.deliveryRadius) || 10,
          })
        }
      })
      .catch(() => {})
  }, [])

  const subtotal = total
  const minOrder = deliverySettings.minOrder
  const baseDeliveryCharge = deliverySettings.deliveryCharge
  const isFreeDelivery = baseDeliveryCharge === 0 || subtotal >= minOrder
  const deliveryFee = isFreeDelivery ? 0 : baseDeliveryCharge
  const finalTotal = subtotal + deliveryFee

  if (!mounted) {
    return (
      <div className="py-20 flex flex-col items-center justify-center p-6 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-14 h-14 bg-stone-200 rounded-full mb-3" />
          <div className="h-5 w-32 bg-stone-200 rounded" />
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="py-24 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-[#F5F5F0] rounded-3xl flex items-center justify-center text-4xl mb-4 border border-stone-200">
          🛒
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-1">Your cart is empty</h2>
        <p className="text-stone-400 text-sm mb-6 max-w-xs font-sans">
          Looks like you haven't added any fresh farm vegetables yet.
        </p>
        <Link href="/">
          <button className="px-8 py-3.5 rounded-xl bg-[#14532D] text-white font-bold text-sm shadow-md shadow-[#14532D]/20 hover:bg-[#166534] transition-colors cursor-pointer">
            Start Shopping Fresh Produce
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col px-4 sm:px-6 lg:px-8 pt-6 pb-12 gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1A1A1A]">
          Your Shopping Cart
        </h1>
        <GlassBadge variant="success" size="sm">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </GlassBadge>
      </div>

      {/* 2-column layout on laptop/desktop screens */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left column: Cart items */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-3">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={`${item.product.id}-${item.weight}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -60, height: 0, margin: 0 }}
                transition={{ type: 'spring', damping: 24, stiffness: 300 }}
              >
                <GlassCard className="p-4 sm:p-5 flex gap-4 items-center">
                  <div className="w-16 h-16 bg-[#F5F5F0] rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 border border-stone-100">
                    {item.product.emoji}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-[#1A1A1A] text-sm sm:text-base leading-tight truncate">
                      {item.product.name}
                    </h3>
                    {item.product.tamilName && (
                      <p className="text-xs text-stone-400 font-sans mt-0.5">{item.product.tamilName}</p>
                    )}
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-xs text-stone-500 font-sans">
                        {formatProductWeight(item.product, item.weight)}
                      </span>
                      <span className="text-stone-300">·</span>
                      <span className="font-bold text-[#B45309] text-xs sm:text-sm">
                        {formatPrice(getItemTotalPrice(item))}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2 bg-[#F5F5F0] rounded-xl p-1 border border-stone-200">
                      <button 
                        onClick={() => {
                          if (item.quantity > 1) updateQuantity(item.product.id, item.quantity - 1)
                          else removeItem(item.product.id)
                        }}
                        className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-[#14532D] shadow-sm hover:bg-stone-50 transition-colors cursor-pointer"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-xs font-bold w-5 text-center text-[#1A1A1A]">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-[#14532D] shadow-sm hover:bg-stone-50 transition-colors cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeItem(item.product.id)}
                      className="p-2 text-stone-300 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Right column: Sticky Order Summary sidebar on desktop */}
        <div className="md:col-span-5 lg:col-span-4 md:sticky md:top-36">
          <GlassCard className="p-6">
            <h3 className="font-display font-semibold text-[#1A1A1A] mb-4 text-lg">Order Summary</h3>
            <div className="space-y-3 mb-5 text-sm font-sans">
              <div className="flex justify-between text-stone-500">
                <span>Items Subtotal ({itemCount})</span>
                <span className="text-[#1A1A1A] font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-stone-500">
                <span>Delivery Charge</span>
                {isFreeDelivery ? (
                  <GlassBadge variant="success" size="sm">FREE</GlassBadge>
                ) : (
                  <span className="font-bold text-[#B45309]">+{formatPrice(deliveryFee)}</span>
                )}
              </div>

              {!isFreeDelivery && subtotal < minOrder && (
                <p className="text-[11px] text-stone-500 font-sans bg-amber-50/70 p-2 rounded-lg border border-amber-200/60">
                  💡 Add <span className="font-bold text-[#B45309]">{formatPrice(minOrder - subtotal)}</span> more for Free Delivery!
                </p>
              )}

              <div className="h-px w-full bg-stone-100 my-2" />
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-base text-[#1A1A1A]">Total Payable</span>
                <span className="font-display font-bold text-3xl text-[#B45309]">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <button 
              className="w-full py-4 text-base font-bold bg-[#14532D] hover:bg-[#166534] text-white shadow-lg shadow-[#14532D]/20 rounded-xl flex items-center justify-center gap-2 transition-colors tracking-wide cursor-pointer"
              onClick={() => router.push('/checkout')}
            >
              Proceed to Checkout <ArrowRight className="h-5 w-5" />
            </button>
            
            <div className="mt-4 text-center">
              <Link href="/" className="text-xs text-[#14532D] hover:text-[#166534] font-medium">
                ← Continue Shopping
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
