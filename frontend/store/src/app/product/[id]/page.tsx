'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { WeightSelector } from '@/components/store/weight-selector'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassBadge } from '@/components/ui/glass-badge'
import { GlassCard } from '@/components/ui/glass-card'
import { useCart } from '@/lib/store/use-cart'
import { getProductById, getProductsByCategory } from '@/lib/data/products'
import { formatPrice, formatWeight } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingBag, Share2, Heart, Plus, Minus } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { VegetableCard } from '@/components/store/vegetable-card'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const product = getProductById(id)
  
  const { addItem } = useCart()
  const [weight, setWeight] = useState(1000)
  const [quantity, setQuantity] = useState(1)
  
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-emerald-800 mb-4">Product Not Found</h2>
        <GlassButton onClick={() => router.back()}>Go Back</GlassButton>
      </div>
    )
  }
  
  const categorySlug = typeof product.category === 'string' 
    ? product.category 
    : (product.category as any)?.slug || 'fruits-vegetables'
  const relatedProducts = getProductsByCategory(categorySlug)
    .filter(p => p.id !== product.id)
    .slice(0, 4)

  const handleAddToCart = () => {
    // Add item (quantity times)
    for (let i = 0; i < quantity; i++) {
        addItem(product, weight)
    }
    toast.success(`🛒 ${product.name} added to cart!`)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out fresh ${product.name} at our store!`,
        url: window.location.href,
      }).catch(console.error)
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <div className="flex flex-col min-h-screen pb-28">
      {/* Header section with emoji */}
      <div className="relative pt-6 px-4 pb-12 bg-gradient-to-b from-emerald-100/50 to-transparent">
        <div className="flex items-center justify-between z-10 relative mb-8">
          <GlassButton onClick={() => router.back()} size="sm" className="rounded-full !px-3 !py-3">
            <ArrowLeft className="h-5 w-5 text-emerald-800" />
          </GlassButton>
          <div className="flex gap-2">
            <GlassButton onClick={handleShare} size="sm" className="rounded-full !px-3 !py-3">
              <Share2 className="h-5 w-5 text-emerald-800" />
            </GlassButton>
            <GlassButton size="sm" className="rounded-full !px-3 !py-3">
              <Heart className="h-5 w-5 text-emerald-800" />
            </GlassButton>
          </div>
        </div>
        
        <motion.div 
          className="flex justify-center my-8"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring' as const, stiffness: 200, damping: 15 }}
        >
          <div className="w-48 h-48 bg-white/40 backdrop-blur-2xl rounded-3xl flex items-center justify-center border-4 border-white/60 shadow-xl overflow-hidden relative">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover rounded-2xl"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  const fallback = (e.target as HTMLElement).nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
            ) : null}
            <span className={`text-8xl drop-shadow-lg ${product.imageUrl ? 'hidden' : 'block'}`}>
              {product.emoji}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Details section */}
      <motion.div 
        className="px-4 -mt-8 flex flex-col gap-6 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 200, damping: 20, delay: 0.1 }}
      >
        <GlassCard className="p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-3xl font-bold text-emerald-950">{product.name}</h1>
              {product.tamilName && (
                <p className="text-emerald-700/70 text-lg mt-1">{product.tamilName}</p>
              )}
            </div>
            {product.inStock ? (
              <GlassBadge className="bg-emerald-100/80 text-emerald-800">In Stock</GlassBadge>
            ) : (
              <GlassBadge className="bg-rose-100/80 text-rose-800">Out of Stock</GlassBadge>
            )}
          </div>
          
          <div className="mt-4 flex items-end gap-3">
            <span className="text-3xl font-bold text-emerald-600">
              {formatPrice(product.price * (1 - (product.discount || 0) / 100))}
            </span>
            <span className="text-emerald-800/60 pb-1">/ {product.unit}</span>
            {product.discount && product.discount > 0 && (
              <span className="text-lg line-through text-rose-400/70 ml-2 pb-1">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </GlassCard>

        {product.unit === 'kg' && (
          <GlassCard className="p-5">
            <h3 className="font-semibold text-emerald-900 mb-3">Select Quantity</h3>
            <WeightSelector 
              selectedWeight={weight} 
              onWeightChange={setWeight} 
              unit={product.unit}
            />
          </GlassCard>
        )}

        <GlassCard className="p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-emerald-900">Number of items</span>
            <div className="flex items-center gap-4 bg-white/50 rounded-full px-2 py-1 border border-white/50">
              <button 
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-emerald-800 shadow-sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </button>
              <motion.span 
                key={quantity}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-4 text-center font-bold text-emerald-900"
              >
                {quantity}
              </motion.span>
              <button 
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-emerald-800 shadow-sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <GlassButton 
            className="w-full py-4 text-lg font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30 shadow-lg"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </GlassButton>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="font-semibold text-emerald-900 mb-2">Description</h3>
          <p className="text-emerald-800/80 leading-relaxed">
            {product.description || `Fresh, locally sourced ${product.name}. Perfect for your daily cooking needs. Hand-picked to ensure the best quality and taste for your family.`}
          </p>
        </GlassCard>

        {relatedProducts.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-emerald-900 mb-4 px-1">Similar Items</h3>
            <div className="grid grid-cols-2 gap-4">
              {relatedProducts.map(p => (
                <VegetableCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
