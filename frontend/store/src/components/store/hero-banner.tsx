'use client'

import { motion } from 'framer-motion'
import { Truck, Clock, Leaf, Star, Sparkles } from 'lucide-react'
import Link from 'next/link'

const features = [
  { icon: Truck,  label: 'Free Delivery',   sub: 'On all orders'    },
  { icon: Clock,  label: '30 Minutes',       sub: 'Express delivery' },
  { icon: Leaf,   label: '100% Fresh',       sub: 'Farm to door'     },
  { icon: Star,   label: 'Best Price',       sub: 'Market guaranteed'},
]

export function HeroBanner() {
  return (
    <div className="mt-4 rounded-3xl overflow-hidden bg-[#14532D] relative shadow-xl shadow-[#14532D]/15">
      {/* Decorative pattern top-right */}
      <div
        className="absolute top-0 right-0 w-80 h-80 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)`,
          backgroundSize: '20px 20px',
        }}
      />
      {/* Decorative ambient circles */}
      <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-12 -right-8 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative z-10 px-6 sm:px-8 md:px-12 pt-8 sm:pt-10 md:pt-12 pb-6 md:pb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        {/* Left column content */}
        <div className="max-w-xl">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-3.5 py-1 mb-4 sm:mb-5"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-300" />
            </span>
            <span className="text-emerald-200 text-xs font-semibold tracking-widest uppercase">
              Fresh harvest today
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 22 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-2"
          >
            Farm Fresh<br />
            <span className="text-emerald-300">Vegetables</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="text-emerald-200/80 text-sm sm:text-base mb-2 font-sans font-medium"
          >
            உங்கள் காய்கறி கடை · Handpicked Daily
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="text-white/60 text-xs sm:text-sm mb-7 max-w-md leading-relaxed"
          >
            Organic freshness sourced straight from local farms in Tamil Nadu. Delivered direct to your home in under 30 minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="flex items-center gap-3.5"
          >
            <Link href="/category/all">
              <button className="inline-flex items-center gap-2 bg-white text-[#14532D] font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-xl shadow-black/20 hover:bg-emerald-50 transition-all cursor-pointer">
                <span>🛒</span>
                Shop Fresh Produce
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Right column: REAL Organic Harvest Image Showcase */}
        <div className="flex flex-col items-center justify-center relative shrink-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 240, damping: 20 }}
            className="w-full sm:w-80 md:w-80 lg:w-96 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/25 relative group bg-black/20"
          >
            <img
              src="/hero-veggies.jpg"
              alt="Fresh Organic Farm Vegetables Basket"
              className="w-full h-52 sm:h-56 md:h-60 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Gradient vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            
            {/* Bottom floating badge */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs px-3 py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/30">
              <div className="flex items-center gap-1.5 font-semibold">
                <Leaf className="w-3.5 h-3.5 text-emerald-300" />
                <span>100% Organic Harvest</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                Daily Fresh
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Feature strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 bg-black/10"
      >
        {features.map((f, i) => {
          const Icon = f.icon
          return (
            <div
              key={i}
              className={`flex items-center sm:flex-col justify-center py-3 sm:py-4 px-4 gap-2 sm:gap-1 ${
                i < 3 ? 'sm:border-r border-white/10' : ''
              } ${i % 2 === 0 ? 'border-r border-white/10 sm:border-r-0' : ''}`}
            >
              <Icon className="w-4 h-4 text-emerald-300 shrink-0" />
              <div className="sm:text-center">
                <p className="text-white text-xs sm:text-[11px] font-bold leading-tight">{f.label}</p>
                <p className="text-white/40 text-[10px] sm:text-[9px] leading-tight">{f.sub}</p>
              </div>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
