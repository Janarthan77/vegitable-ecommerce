'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { GlassCard } from '@/components/ui/glass-card'
import { motion } from 'framer-motion'
import { CheckCircle, Home, Phone } from 'lucide-react'
import { Suspense } from 'react'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('id') || 'ORD-UNKNOWN'

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="flex flex-col items-center w-full max-w-sm"
      >
        <div className="w-20 h-20 bg-[#DCFCE7] rounded-full flex items-center justify-center mb-5 shadow-lg shadow-[#14532D]/10 border-4 border-white">
          <CheckCircle className="w-10 h-10 text-[#14532D]" />
        </div>

        <h1 className="font-display text-3xl font-bold text-[#1A1A1A] mb-2">
          Order Placed!
        </h1>
        
        <p className="text-stone-500 text-sm mb-6 max-w-xs leading-relaxed font-sans">
          Thank you for choosing Kaikaari! We are preparing your fresh vegetables for fast delivery.
        </p>

        <GlassCard className="p-5 mb-6 w-full text-center">
          <p className="text-xs text-stone-400 font-sans uppercase tracking-wider mb-1">Order Reference</p>
          <p className="font-display text-xl font-bold text-[#14532D] tracking-wider">
            {orderId}
          </p>
        </GlassCard>

        <div className="flex flex-col w-full gap-2.5">
          <button 
            onClick={() => router.push('/')}
            className="w-full py-3.5 bg-[#14532D] hover:bg-[#166534] text-white font-bold text-sm rounded-xl shadow-md shadow-[#14532D]/20 flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </button>
          
          <button 
            onClick={() => window.location.href = 'tel:+919876543210'}
            className="w-full py-3.5 bg-white hover:bg-stone-50 text-[#14532D] font-bold text-sm border border-stone-200 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Phone className="h-4 w-4" />
            Call Store
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-24 text-[#14532D]">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}
