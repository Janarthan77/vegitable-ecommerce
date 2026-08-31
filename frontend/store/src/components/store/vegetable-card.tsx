'use client'

import { Product } from '@/types'
import { useCart } from '@/lib/store/use-cart'
import { formatPrice } from '@/lib/utils'
import { GlassBadge } from '@/components/ui/glass-badge'
import { Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface VegetableCardProps {
  product: Product
  index?: number
}

export function VegetableCard({ product, index = 0 }: VegetableCardProps) {
  const [mounted, setMounted] = useState(false)
  const { items, addItem, updateQuantity, removeItem } = useCart()

  useEffect(() => { setMounted(true) }, [])

  const cartItem = mounted
    ? items.find((item) => item.product.id === product.id)
    : undefined

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    const defaultWeight = product.unit === 'kg' ? 250 : 1
    addItem(product, defaultWeight)
    toast.success(`${product.name} (250g) added to cart`)
  }

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault()
    if (cartItem) updateQuantity(product.id, cartItem.quantity + 1)
  }

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault()
    if (cartItem) {
      if (cartItem.quantity > 1) updateQuantity(product.id, cartItem.quantity - 1)
      else removeItem(product.id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 280, damping: 24 }}
      className="h-full"
    >
      <Link href={`/product/${product.id}`} className="block h-full">
        <div
          className={`card h-full flex flex-col overflow-hidden group transition-all duration-200 hover:-translate-y-0.5 ${
            !product.inStock ? 'opacity-55' : ''
          }`}
          style={{ padding: 0 }}
        >
          {/* ── Image area ─────────────────────────────── */}
          <div className="relative h-36 bg-[#F5F5F0] flex items-center justify-center overflow-hidden">
            {/* Top badges */}
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
              {Boolean(product.discount && product.discount > 0) && (
                <GlassBadge variant="sale" size="sm">{product.discount}% off</GlassBadge>
              )}
              {!product.inStock && (
                <GlassBadge variant="danger" size="sm">Sold out</GlassBadge>
              )}
            </div>

            {/* Fresh badge top-right */}
            {product.inStock && (!product.discount || product.discount === 0) && (
              <div className="absolute top-2 right-2 z-10">
                <GlassBadge variant="fresh" size="sm">Fresh</GlassBadge>
              </div>
            )}

            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-2xl shadow-sm border border-stone-100 transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none'
                  const fb = (e.target as HTMLElement).nextElementSibling as HTMLElement
                  if (fb) fb.style.display = 'flex'
                }}
              />
            ) : null}
            <span
              className={`text-6xl transition-transform duration-300 group-hover:scale-105 ${
                product.imageUrl ? 'hidden' : 'flex'
              }`}
            >
              {product.emoji}
            </span>
          </div>

          {/* ── Info area ──────────────────────────────── */}
          <div className="flex flex-col flex-1 px-3 pt-2.5 pb-3">
            <p className="font-display font-semibold text-[#1A1A1A] text-[13px] leading-snug line-clamp-1">
              {product.name}
            </p>
            {product.tamilName && (
              <p className="text-[11px] text-stone-400 mt-0.5 font-sans">{product.tamilName}</p>
            )}

            {/* Price + action */}
            <div className="flex items-end justify-between mt-auto pt-2.5">
              <div>
                <p className="font-bold text-[#B45309] text-base leading-none">
                  {formatPrice(product.price)}
                </p>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  per {product.unit === 'piece' ? 'pc' : product.unit === 'bunch' ? 'bunch' : 'kg'}
                </p>
              </div>

              {product.inStock && (
                <div onClick={(e) => e.preventDefault()} className="z-10">
                  <AnimatePresence mode="wait">
                    {cartItem ? (
                      <motion.div
                        key="qty"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                        className="flex items-center gap-1.5 bg-[#14532D] rounded-xl px-2 py-1"
                      >
                        <button
                          onClick={handleDecrement}
                          className="w-5 h-5 rounded-lg bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-white text-xs w-4 text-center">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={handleIncrement}
                          className="w-5 h-5 rounded-lg bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.button
                        key="add"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                        onClick={handleAdd}
                        className="w-9 h-9 bg-[#14532D] text-white rounded-xl flex items-center justify-center shadow-md shadow-[#14532D]/25 hover:bg-[#166534] transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
