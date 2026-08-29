'use client'

import { HeroBanner }     from '@/components/store/hero-banner'
import { SearchBar }      from '@/components/store/search-bar'
import { CategoryChips }  from '@/components/store/category-chips'
import { VegetableCard }  from '@/components/store/vegetable-card'
import { products }       from '@/lib/data/products'
import { motion }         from 'framer-motion'
import { useState, useEffect } from 'react'
import { fetchProducts }  from '@/lib/api'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 26 } },
}

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="mb-4">
      <div className="section-accent" />
      <div className="flex items-baseline gap-2">
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#1A1A1A]">{title}</h2>
        {count !== undefined && (
          <span className="text-xs sm:text-sm text-stone-400 font-sans">({count} items)</span>
        )}
      </div>
    </div>
  )
}

export default function HomePage() {
  const [productList, setProductList] = useState(products)

  useEffect(() => {
    async function load() {
      try {
        const live = await fetchProducts()
        if (live && live.length > 0) setProductList(live)
      } catch { /* fallback */ }
    }
    load()
  }, [])

  const popularProducts = productList.filter((p) => p.isPopular)

  return (
    <div className="flex flex-col">
      {/* ── Mobile Sticky Search Bar (Desktop has search in top navbar) ── */}
      <div className="md:hidden sticky top-0 z-[80] px-4 pt-3.5 pb-3 bg-[#FAFAF6] border-b border-stone-200 shadow-sm">
        <SearchBar />
      </div>

      {/* ── Hero Banner ────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-8">
        <HeroBanner />
      </div>

      {/* ── Shop by Category ───────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-8 mt-7 sm:mt-9">
        <SectionHeader title="Shop by Category" />
        <CategoryChips />
      </div>

      {/* ── Popular items ───────────────────────────── */}
      {popularProducts.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8 mt-7 sm:mt-9">
          <SectionHeader title="Popular Harvests" count={popularProducts.length} />
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4.5"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {popularProducts.map((product, idx) => (
              <motion.div key={product.id} variants={item} className="h-full">
                <VegetableCard product={product} index={idx} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* ── All vegetables ──────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-8 mt-7 sm:mt-9 pb-8">
        <SectionHeader title="All Farm Vegetables" count={productList.length} />
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4.5"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {productList.map((product, idx) => (
            <motion.div key={product.id} variants={item} className="h-full">
              <VegetableCard product={product} index={idx} />
            </motion.div>
          ))}
        </motion.div>

        {/* Ending note so last card never feels cut off */}
        <div className="text-center pt-8 pb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100/70 border border-stone-200 text-stone-500 text-xs font-sans">
            <span>🌿</span>
            <span>You've explored all fresh farm harvests for today</span>
          </div>
        </div>
      </div>
    </div>
  )
}
