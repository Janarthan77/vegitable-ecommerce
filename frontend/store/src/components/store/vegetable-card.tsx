'use client'

import { Product } from '@/types'
import { useCart } from '@/lib/store/use-cart'
import { formatPrice } from '@/lib/utils'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassBadge } from '@/components/ui/glass-badge'
import { Plus, Minus, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import Link from 'next/link'

interface VegetableCardProps {
  product: Product
  index?: number
}

export function VegetableCard({ product, index = 0 }: VegetableCardProps) {
  const { items, addItem, updateQuantity, removeItem } = useCart()
  const cartItem = items.find((item) => item.product.id === product.id)
  
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product, 500)
    toast.success(`${product.name} added to cart`)
  }

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault()
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + 1)
    }
  }

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault()
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateQuantity(product.id, cartItem.quantity - 1)
      } else {
        removeItem(product.id)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link href={`/product/${product.id}`}>
        <GlassCard className={`relative overflow-hidden h-full flex flex-col ${!product.inStock ? 'opacity-60' : ''}`}>
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
            {product.discount ? (
              <GlassBadge variant="sale">
                {product.discount}% OFF
              </GlassBadge>
            ) : null}
            {!product.inStock && (
              <GlassBadge variant="danger">
                Out of Stock
              </GlassBadge>
            )}
          </div>
          
          <div className="flex-1 flex items-center justify-center py-4 relative min-h-[120px]">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-28 h-28 object-cover rounded-2xl shadow-md border-2 border-white/60 transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  // Fallback to emoji if image URL fails to load
                  (e.target as HTMLElement).style.display = 'none';
                  const fallback = (e.target as HTMLElement).nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
            ) : null}
            <span
              className={`text-6xl ${product.imageUrl ? 'hidden' : 'block'}`}
            >
              {product.emoji}
            </span>
          </div>
          
          <div className="mt-auto">
            <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{product.name}</h3>
            {product.tamilName && (
              <p className="text-sm text-gray-500 mb-2">{product.tamilName}</p>
            )}
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex flex-col">
                <span className="font-bold text-emerald-600 text-lg">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs text-gray-500">per {product.unit === 'piece' ? 'pc' : product.unit === 'bunch' ? 'bunch' : 'kg'}</span>
              </div>
              
              {product.inStock && (
                <div onClick={(e) => e.preventDefault()} className="z-10 cursor-default">
                  {cartItem ? (
                    <div className="flex items-center gap-3 bg-emerald-100 rounded-full px-2 py-1">
                      <button 
                        onClick={handleDecrement}
                        className="w-7 h-7 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-sm hover:bg-emerald-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold text-emerald-700 w-4 text-center text-sm">{cartItem.quantity}</span>
                      <button 
                        onClick={handleIncrement}
                        className="w-7 h-7 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-sm hover:bg-emerald-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleAdd}
                      className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-emerald-600 transition-colors cursor-pointer"
                    >
                      <Plus className="w-6 h-6" />
                    </motion.button>
                  )}
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  )
}
