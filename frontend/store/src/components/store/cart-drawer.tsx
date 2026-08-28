'use client'

import { BottomSheet } from '@/components/ui/bottom-sheet'
import { useCart } from '@/lib/store/use-cart'
import { formatPrice, formatWeight } from '@/lib/utils'
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

export function CartDrawer() {
  const { items, getItemCount, getTotal, updateQuantity, removeItem } = useCart()
  const [open, setOpen] = useState(false)

  const itemCount = getItemCount()
  const total = getTotal()

  if (itemCount === 0) return null

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-40 w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30"
      >
        <ShoppingBag className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
          {itemCount}
        </span>
      </motion.button>

      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title={`Your Cart (${itemCount} items)`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-4 pb-24">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.product.id}-${item.weight}`}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0"
                >
                  <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-3xl">
                    {item.product.emoji}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 truncate">{item.product.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{formatWeight(item.weight)}</span>
                      <span>•</span>
                      <span className="font-medium text-emerald-600">
                        {formatPrice((item.product.price * item.weight) / (item.product.unit === 'kg' ? 1000 : 1))}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center bg-gray-50 rounded-lg">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 text-gray-500 hover:text-emerald-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                        }}
                        className="p-1 text-gray-500 hover:text-rose-500"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.product.id)}
                      className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="bg-white/90 backdrop-blur-xl border-t border-gray-100 p-4 sticky bottom-0 left-0 right-0 z-10 pb-safe">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 font-medium">Total Amount</span>
              <span className="text-xl font-bold text-gray-900">{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" onClick={() => setOpen(false)} className="block w-full">
              <GlassButton fullWidth size="lg" className="text-lg">
                Proceed to Checkout
              </GlassButton>
            </Link>
          </div>
        </div>
      </BottomSheet>
    </>
  )
}
