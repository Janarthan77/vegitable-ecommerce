'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { CategoryChips } from '@/components/store/category-chips'
import { VegetableCard } from '@/components/store/vegetable-card'
import { getProductsByCategory, products } from '@/lib/data/products'
import { getCategoryBySlug } from '@/lib/data/categories'
import { fetchProducts } from '@/lib/api'
import { Product } from '@/types'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const category = getCategoryBySlug(slug)
  const [categoryProducts, setCategoryProducts] = useState<Product[]>(() =>
    slug === 'all' ? products : getProductsByCategory(slug)
  )

  useEffect(() => {
    async function load() {
      try {
        const live = await fetchProducts(slug === 'all' ? undefined : { category: slug })
        if (live && live.length > 0) {
          setCategoryProducts(live)
        }
      } catch {
        // Fallback to local synced products
      }
    }
    load()
  }, [slug])
  
  const title = slug === 'all' ? 'All Items' : category?.name || 'Category'
  const emoji = slug === 'all' ? '🥬' : category?.emoji || '🏷️'

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 26 } }
  }

  return (
    <div className="flex flex-col">
      {/* Sticky header on mobile, elegant sub-header on desktop */}
      <div className="sticky top-0 z-[80] pt-4 px-4 sm:px-6 lg:px-8 pb-3.5 bg-[#FAFAF6] border-b border-stone-200 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3">
          <GlassButton onClick={() => router.back()} size="sm" variant="ghost" className="!px-2.5 !py-2">
            <ArrowLeft className="h-5 w-5 text-[#14532D]" />
          </GlassButton>
          <div className="flex items-baseline gap-2.5">
            <h1 className="font-display text-xl sm:text-2xl font-semibold text-[#1A1A1A] flex items-center gap-2">
              <span>{emoji}</span> {title}
            </h1>
            <span className="text-xs sm:text-sm text-stone-400 font-sans">
              ({categoryProducts.length} items available)
            </span>
          </div>
        </div>
      </div>
      
      {/* Category selector grid */}
      <div className="px-4 sm:px-6 lg:px-8 mt-5">
        <CategoryChips activeCategory={slug} />
      </div>

      {/* Product grid */}
      <div className="px-4 sm:px-6 lg:px-8 mt-6">
        {categoryProducts.length > 0 ? (
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4.5"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {categoryProducts.map((product, idx) => (
              <motion.div key={product.id} variants={item} className="h-full">
                <VegetableCard product={product} index={idx} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-3 opacity-60">🥬</span>
            <h3 className="font-display text-lg font-semibold text-[#1A1A1A] mb-1">No products found</h3>
            <p className="text-stone-400 text-xs font-sans">Check back later for fresh farm stock!</p>
          </div>
        )}
      </div>
    </div>
  )
}
