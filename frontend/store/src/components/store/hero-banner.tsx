'use client'

import { motion } from 'framer-motion'
import { GlassButton } from '@/components/ui/glass-button'
import { Sparkles, Truck, Clock, Leaf } from 'lucide-react'
import Link from 'next/link'

export function HeroBanner() {
  const floatingEmojis = [
    { emoji: '🍅', delay: 0, left: '10%', top: '20%' },
    { emoji: '🥬', delay: 1, left: '80%', top: '15%' },
    { emoji: '🥕', delay: 0.5, left: '75%', top: '65%' },
    { emoji: '🍆', delay: 1.5, left: '15%', top: '70%' },
    { emoji: '🧅', delay: 2, left: '50%', top: '10%' },
  ]

  const features = [
    { icon: <Truck className="w-4 h-4" />, text: 'Free Delivery' },
    { icon: <Clock className="w-4 h-4" />, text: '30 Min' },
    { icon: <Leaf className="w-4 h-4" />, text: '100% Fresh' },
    { icon: <Sparkles className="w-4 h-4" />, text: 'Best Price' },
  ]

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-white/30 shadow-lg p-6 sm:p-8 mt-4">
      {/* Floating Emojis Background */}
      {floatingEmojis.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-20 pointer-events-none"
          style={{ left: item.left, top: item.top }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut"
          }}
        >
          {item.emoji}
        </motion.div>
      ))}

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-xl"
        >
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-semibold tracking-wide">
            🌱 FRESH HARVEST TODAY
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 text-gray-900 tracking-tight">
            Fresh <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-lime-500 bg-clip-text text-transparent">Veggies</span>
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4 opacity-90">
            உங்கள் காய்கறி கடை
          </h2>
          <p className="text-gray-600 mb-8 max-w-sm">
            Farm fresh vegetables delivered to your doorstep. Handpicked quality every single day.
          </p>

          <Link href="/category/all">
            <GlassButton size="lg" icon={<ShoppingBagIcon className="w-5 h-5" />}>
              Shop Now
            </GlassButton>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-white/50 backdrop-blur-md rounded-xl p-2.5 border border-white/40 shadow-sm text-sm font-medium text-gray-700">
              <span className="text-emerald-600">{feature.icon}</span>
              {feature.text}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

function ShoppingBagIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
