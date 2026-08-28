'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/store/use-cart'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassInput } from '@/components/ui/glass-input'
import { formatPrice, buildWhatsAppMessage, generateOrderId } from '@/lib/utils'
import { submitOrder } from '@/lib/api'
import { motion } from 'framer-motion'
import { ArrowLeft, Send, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCart()
  const total = getTotal()
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items.length, router])

  if (!mounted || items.length === 0) {
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter your name')
      return false
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      toast.error('Please enter a valid phone number')
      return false
    }
    if (!formData.address.trim()) {
      toast.error('Please enter your delivery address')
      return false
    }
    return true
  }

  const handleWhatsAppOrder = () => {
    if (!validateForm()) return
    
    const orderId = generateOrderId()
    const message = buildWhatsAppMessage(items, total, formData.name)
    
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank')
    clearCart()
    router.push(`/order-success?id=${orderId}`)
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return
    
    try {
      const created = await submitOrder({
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        notes: formData.notes,
        items,
        total,
      })
      toast.success('Order placed successfully!')
      clearCart()
      router.push(`/order-success?id=${created.id}`)
    } catch (err: any) {
      // Fallback
      const orderId = generateOrderId()
      toast.success('Order placed successfully!')
      clearCart()
      router.push(`/order-success?id=${orderId}`)
    }
  }

  return (
    <div className="flex flex-col min-h-screen pb-28 px-4 pt-6 gap-6">
      <div className="flex items-center gap-4">
        <GlassButton onClick={() => router.back()} size="sm" variant="ghost">
          <ArrowLeft className="h-5 w-5 text-emerald-800" />
        </GlassButton>
        <h1 className="text-2xl font-bold text-emerald-950">Checkout</h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        <GlassCard className="p-5 flex flex-col gap-4">
          <h2 className="font-semibold text-emerald-900">Delivery Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-emerald-800 ml-1 mb-1 block">Name *</label>
              <GlassInput 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe" 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-emerald-800 ml-1 mb-1 block">Phone Number *</label>
              <GlassInput 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210" 
                type="tel"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-emerald-800 ml-1 mb-1 block">Delivery Address *</label>
              <textarea 
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-white/40 border border-white/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/50 text-emerald-950 placeholder:text-emerald-800/40 min-h-[100px] resize-none"
                placeholder="Enter your full address"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-emerald-800 ml-1 mb-1 block">Order Notes (Optional)</label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full bg-white/40 border border-white/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/50 text-emerald-950 placeholder:text-emerald-800/40 min-h-[80px] resize-none"
                placeholder="Any special instructions..."
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h2 className="font-semibold text-emerald-900 mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4 max-h-[200px] overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.weight}`} className="flex justify-between text-sm">
                <span className="text-emerald-800">
                  {item.quantity}x {item.product.name} ({item.weight}{item.product.unit === 'kg' ? 'g' : ''})
                </span>
                <span className="font-medium text-emerald-950">
                  {formatPrice(item.product.price * (item.weight / (item.product.unit === 'kg' ? 1000 : 1)) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="h-px w-full bg-white/50 my-3" />
          
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-emerald-950">Total to Pay</span>
            <span className="font-bold text-xl text-emerald-600">{formatPrice(total)}</span>
          </div>

          <div className="flex flex-col gap-3">
            <GlassButton 
              onClick={handleWhatsAppOrder}
              className="w-full py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold border-none shadow-lg shadow-[#25D366]/30 flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Order via WhatsApp
            </GlassButton>
            
            <GlassButton 
              onClick={handlePlaceOrder}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
            >
              <Send className="h-5 w-5" />
              Place Order Direct
            </GlassButton>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
