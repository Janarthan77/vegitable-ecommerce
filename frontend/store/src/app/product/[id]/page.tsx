'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { WeightSelector } from '@/components/store/weight-selector'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassBadge } from '@/components/ui/glass-badge'
import { GlassCard } from '@/components/ui/glass-card'
import { useCart } from '@/lib/store/use-cart'
import { formatPrice } from '@/lib/utils'
import { fetchProductById, fetchProducts } from '@/lib/api'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingBag, Share2, Heart, Plus, Minus, Truck, ShieldCheck, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { VegetableCard } from '@/components/store/vegetable-card'

import { Product } from '@/types'
import { useEffect } from 'react'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const live = await fetchProductById(id)
        if (live) setProduct(live)
      } catch {
        // Fallback already in state
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])
  
  const { addItem } = useCart()
  const [weight, setWeight] = useState(250)
  const [quantity, setQuantity] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  useEffect(() => {
    if (product) {
      setWeight(product.unit === 'kg' ? 250 : 1)
    }
  }, [product])

  useEffect(() => {
    if (!product) return
    const categorySlug = typeof product.category === 'string' 
      ? product.category 
      : (product.category as any)?.slug || 'all'
    
    fetchProducts({ category: categorySlug })
      .then(list => {
        if (list && Array.isArray(list)) {
          setRelatedProducts(list.filter(p => p.id !== product.id).slice(0, 5))
        }
      })
      .catch(() => {})
  }, [product])
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-stone-200" />
          <div className="h-5 w-40 bg-stone-200 rounded" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h2 className="font-display text-2xl font-bold text-[#1A1A1A] mb-4">Product Not Found</h2>
        <GlassButton onClick={() => router.back()} variant="primary">Go Back</GlassButton>
      </div>
    )
  }


  const handleAddToCart = () => {
    const actualWeight = product.unit === 'kg' ? weight : 1
    for (let i = 0; i < quantity; i++) {
      addItem(product, actualWeight)
    }
    toast.success(`🛒 ${product.name} added to cart!`)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out fresh ${product.name} at Kaikaari!`,
        url: window.location.href,
      }).catch(console.error)
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <div className="flex flex-col px-4 sm:px-6 lg:px-8 py-6">
      {/* Back button row */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50 transition-colors text-xs font-semibold cursor-pointer shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </button>
        <div className="flex gap-2">
          <button 
            onClick={handleShare} 
            className="w-9 h-9 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button 
            className="w-9 h-9 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main product display: 2 columns on desktop/laptop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10">
        {/* Left Column: Product Image Card */}
        <div className="md:col-span-5 lg:col-span-5">
          <div className="card p-8 bg-white flex flex-col items-center justify-center min-h-[320px] md:min-h-[420px] relative overflow-hidden">
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
              {product.discount && (
                <GlassBadge variant="sale" size="sm">{product.discount}% OFF</GlassBadge>
              )}
              <GlassBadge variant={product.inStock ? 'success' : 'danger'} size="sm">
                {product.inStock ? 'Farm Fresh' : 'Sold Out'}
              </GlassBadge>
            </div>

            <motion.div 
              className="flex items-center justify-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-56 h-56 md:w-64 md:h-64 object-cover rounded-3xl shadow-md border border-stone-100"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                    const fallback = (e.target as HTMLElement).nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
              ) : null}
              <span className={`text-9xl select-none ${product.imageUrl ? 'hidden' : 'block'}`}>
                {product.emoji}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Right Column: Product Details and Actions */}
        <div className="md:col-span-7 lg:col-span-7 flex flex-col gap-4">
          <GlassCard className="p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A1A1A]">{product.name}</h1>
                {product.tamilName && (
                  <p className="text-stone-400 text-base mt-1 font-sans">{product.tamilName}</p>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex items-baseline gap-2.5">
              <span className="font-display text-3xl sm:text-4xl font-bold text-[#B45309]">
                {formatPrice(product.price * (1 - (product.discount || 0) / 100))}
              </span>
              <span className="text-stone-400 text-sm font-sans">/ {product.unit}</span>
              {product.discount && product.discount > 0 && (
                <span className="text-base line-through text-stone-400 ml-2">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Weight selector */}
            {product.unit === 'kg' && (
              <div className="mt-5 pt-4 border-t border-stone-100">
                <h3 className="font-display text-sm font-semibold text-[#1A1A1A] mb-2.5">Select Weight / Quantity</h3>
                <WeightSelector 
                  selectedWeight={weight} 
                  onWeightChange={setWeight} 
                  unit={product.unit}
                />
              </div>
            )}

            {/* Quantity and CTA */}
            <div className="mt-6 pt-5 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center justify-between sm:justify-start gap-3 bg-[#F5F5F0] rounded-xl px-3 py-2 border border-stone-200">
                <span className="text-xs font-semibold text-stone-500 font-sans">Quantity:</span>
                <div className="flex items-center gap-2">
                  <button 
                    className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#14532D] shadow-sm hover:bg-stone-50 transition-colors cursor-pointer"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-sm text-[#1A1A1A]">{quantity}</span>
                  <button 
                    className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#14532D] shadow-sm hover:bg-stone-50 transition-colors cursor-pointer"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              
              <button 
                className="flex-1 py-3.5 px-6 text-base font-bold bg-[#14532D] hover:bg-[#166534] text-white shadow-lg shadow-[#14532D]/20 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingBag className="h-5 w-5" />
                {product.inStock ? 'Add to Shopping Cart' : 'Out of Stock'}
              </button>
            </div>
          </GlassCard>

          {/* Description Card */}
          <GlassCard className="p-6">
            <h3 className="font-display text-base font-semibold text-[#1A1A1A] mb-2">About this Farm Produce</h3>
            <p className="text-stone-500 text-sm leading-relaxed font-sans">
              {product.description || `Fresh, locally sourced ${product.name}. Hand-picked from farms to ensure natural nutrition, vibrant taste, and peak freshness for your daily cooking.`}
            </p>
            
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-stone-100 text-xs font-sans text-stone-500">
              <div className="flex items-center gap-2">
                <Truck size={15} className="text-[#14532D] shrink-0" />
                <span>30-min express</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-[#14532D] shrink-0" />
                <span>100% organic</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw size={15} className="text-[#14532D] shrink-0" />
                <span>Easy replacement</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Similar products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#1A1A1A] mb-4">You may also need</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4.5">
            {relatedProducts.map((p, idx) => (
              <VegetableCard key={p.id} product={p} index={idx} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
