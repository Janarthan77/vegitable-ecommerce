'use client'

import { useParams, useRouter } from 'next/navigation'
import { CategoryChips } from '@/components/store/category-chips'
import { VegetableCard } from '@/components/store/vegetable-card'
import { getProductsByCategory, products } from '@/lib/data/products'
import { getCategoryBySlug, categories } from '@/lib/data/categories'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const category = getCategoryBySlug(slug)
  const categoryProducts = slug === 'all' ? products : getProductsByCategory(slug)
  
  const title = slug === 'all' ? 'All Items' : category?.name || 'Category'
  const emoji = slug === 'all' ? '🥬' : category?.emoji || '🏷️'

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  }

  return (
    <div className="flex flex-col gap-6 pb-28 min-h-screen">
      <div className="sticky top-0 z-10 pt-4 px-4 bg-white/40 backdrop-blur-xl border-b border-white/30 pb-4">
        <div className="flex items-center gap-4">
          <GlassButton onClick={() => router.back()} size="sm" variant="ghost">
            <ArrowLeft className="h-5 w-5 text-emerald-800" />
          </GlassButton>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-emerald-900">
            <span>{emoji}</span> {title}
          </h1>
        </div>
      </div>
      
      <div className="px-4">
        <CategoryChips activeCategory={slug} />
      </div>

      <div className="px-4 flex-grow">
        {categoryProducts.length > 0 ? (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {categoryProducts.map((product) => (
              <motion.div key={product.id} variants={item}>
                <VegetableCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-6xl mb-4 opacity-50">🥬</span>
            <h3 className="text-xl font-medium text-emerald-800 mb-2">No products found</h3>
            <p className="text-emerald-600/70">Check back later for fresh stock!</p>
          </div>
        )}
      </div>
    </div>
  )
}
