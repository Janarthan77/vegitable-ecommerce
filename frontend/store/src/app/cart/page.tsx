'use client'

import { useCart } from '@/lib/store/use-cart'
import { formatPrice, formatWeight } from '@/lib/utils'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassBadge } from '@/components/ui/glass-badge'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, getItemCount } = useCart()
  const total = getTotal()
  const itemCount = getItemCount()
  const router = useRouter()
  
  const deliveryFee = 0 // Free delivery

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className="text-8xl mb-6 drop-shadow-xl"
        >
          🛒
        </motion.div>
        <h2 className="text-2xl font-bold text-emerald-900 mb-2">Your cart is empty</h2>
        <p className="text-emerald-700/70 mb-8">Looks like you haven't added any fresh vegetables yet.</p>
        <Link href="/">
          <GlassButton className="px-8 py-6 text-lg rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600">
            Start Shopping
          </GlassButton>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen pb-28 px-4 pt-6 gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-emerald-950 flex items-center gap-2">
          Your Cart 🛒
        </h1>
        <GlassBadge className="bg-emerald-100 text-emerald-800">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </GlassBadge>
      </div>

      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={`${item.product.id}-${item.weight}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, x: -100, height: 0, margin: 0 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <GlassCard className="p-4 flex gap-4 items-center">
                <div className="w-16 h-16 bg-white/50 rounded-xl flex items-center justify-center text-4xl shadow-sm border border-white/60">
                  {item.product.emoji}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-emerald-950 leading-tight">
                    {item.product.name}
                  </h3>
                  {item.product.tamilName && (
                    <p className="text-xs text-emerald-700/70">{item.product.tamilName}</p>
                  )}
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-medium bg-white/50 px-2 py-0.5 rounded text-emerald-800">
                      {item.product.unit === 'kg' ? formatWeight(item.weight) : `${item.weight} ${item.product.unit}`}
                    </span>
                    <span className="font-bold text-emerald-600 text-sm">
                      {formatPrice(item.product.price * (item.weight / (item.product.unit === 'kg' ? 1000 : 1)))}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button 
                    onClick={() => removeItem(item.product.id)}
                    className="p-1.5 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  
                  <div className="flex items-center gap-2 bg-white/50 rounded-lg p-1 border border-white/50">
                    <button 
                      onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                      className="w-6 h-6 bg-white rounded flex items-center justify-center text-emerald-800 shadow-sm"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 bg-white rounded flex items-center justify-center text-emerald-800 shadow-sm"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <GlassCard className="p-5 mt-auto">
        <h3 className="font-semibold text-emerald-950 mb-4">Order Summary</h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-emerald-800/80">
            <span>Subtotal</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between items-center text-emerald-800/80">
            <span>Delivery Fee</span>
            <GlassBadge className="bg-emerald-100 text-emerald-700 border-none">FREE</GlassBadge>
          </div>
          <div className="h-px w-full bg-white/50 my-2" />
          <div className="flex justify-between items-end">
            <span className="font-bold text-lg text-emerald-950">Total</span>
            <span className="font-bold text-2xl text-emerald-600">{formatPrice(total)}</span>
          </div>
        </div>

        <GlassButton 
          className="w-full py-6 text-lg font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30 shadow-lg rounded-xl flex items-center justify-center gap-2"
          onClick={() => router.push('/checkout')}
        >
          Proceed to Checkout <ArrowRight className="h-5 w-5" />
        </GlassButton>
        
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            Continue Shopping
          </Link>
        </div>
      </GlassCard>
    </div>
  )
}
