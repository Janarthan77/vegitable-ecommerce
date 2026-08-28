'use client'

import { HeroBanner } from '@/components/store/hero-banner'
import { SearchBar } from '@/components/store/search-bar'
import { CategoryChips } from '@/components/store/category-chips'
import { VegetableCard } from '@/components/store/vegetable-card'
import { products, getPopularProducts } from '@/lib/data/products'
import { motion } from 'framer-motion'

import { useState, useEffect } from 'react'
import { fetchProducts } from '@/lib/api'

export default function HomePage() {
  const [productList, setProductList] = useState(products)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const liveProducts = await fetchProducts()
        if (liveProducts && liveProducts.length > 0) {
          setProductList(liveProducts)
        }
      } catch (err) {
        console.warn('Using local products fallback')
      }
    }
    load()
  }, [])

  const popularProducts = productList.filter(p => p.isPopular)

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
    <div className="flex flex-col gap-6 pb-28">
      <div className="sticky top-0 z-10 pt-4 px-4 bg-white/40 backdrop-blur-xl border-b border-white/30">
        <SearchBar />
      </div>
      
      <div className="px-4">
        <HeroBanner />
      </div>

      <div className="px-4">
        <CategoryChips />
      </div>

      <div className="px-4">
        <h2 className="text-xl font-bold mb-4 bg-white/40 backdrop-blur-xl inline-block px-4 py-2 rounded-2xl border border-white/30 text-emerald-800">
          Popular Items 🔥
        </h2>
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {popularProducts.map((product) => (
            <motion.div key={product.id} variants={item}>
              <VegetableCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="px-4">
        <h2 className="text-xl font-bold mb-4 bg-white/40 backdrop-blur-xl inline-block px-4 py-2 rounded-2xl border border-white/30 text-emerald-800">
          All Vegetables 🥬
        </h2>
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {productList.map((product) => (
            <motion.div key={product.id} variants={item}>
              <VegetableCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
