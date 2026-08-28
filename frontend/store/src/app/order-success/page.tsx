'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { motion } from 'framer-motion'
import { CheckCircle, Home, Phone } from 'lucide-react'
import { Suspense } from 'react'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('id') || 'ORD-UNKNOWN'

  // Floating emojis for background decoration
  const emojis = ['🥬', '🥕', '🍅', '🌽', '🥦', '🧅']

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center relative overflow-hidden">
      {/* Confetti emojis */}
      {emojis.map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-50 z-0 pointer-events-none"
          initial={{ 
            x: Math.random() * window.innerWidth - window.innerWidth / 2, 
            y: window.innerHeight / 2 + 100,
            rotate: 0,
            opacity: 0
          }}
          animate={{ 
            y: -window.innerHeight / 2 - 100,
            rotate: Math.random() * 360,
            opacity: [0, 1, 1, 0]
          }}
          transition={{ 
            duration: 5 + Math.random() * 5, 
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear" 
          }}
          style={{
            left: `${10 + Math.random() * 80}%`
          }}
        >
          {emoji}
        </motion.div>
      ))}

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="z-10 flex flex-col items-center"
      >
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20 border-4 border-white">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </div>

        <h1 className="text-3xl font-bold text-emerald-950 mb-2">
          Order Placed! 🎉
        </h1>
        
        <p className="text-emerald-700/80 mb-8 max-w-sm">
          Thank you for your order! We will contact you shortly to confirm your delivery details.
        </p>

        <GlassCard className="p-6 mb-8 w-full max-w-sm bg-white/60">
          <p className="text-sm text-emerald-800/60 mb-1">Order Reference</p>
          <p className="text-xl font-mono font-bold text-emerald-900 tracking-wider">
            {orderId}
          </p>
        </GlassCard>

        <div className="flex flex-col w-full max-w-sm gap-3">
          <GlassButton 
            onClick={() => router.push('/')}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg flex items-center justify-center gap-2"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </GlassButton>
          
          <GlassButton 
            onClick={() => window.location.href = 'tel:+919876543210'}
            className="w-full py-4 bg-white hover:bg-white/80 text-emerald-700 font-bold border border-emerald-100 flex items-center justify-center gap-2"
          >
            <Phone className="h-5 w-5" />
            Call Shop
          </GlassButton>
        </div>
      </motion.div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-emerald-500">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}
