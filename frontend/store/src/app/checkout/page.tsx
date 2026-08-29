'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/store/use-cart'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassInput } from '@/components/ui/glass-input'
import { formatPrice, formatProductWeight, getItemTotalPrice, buildWhatsAppMessage, generateOrderId } from '@/lib/utils'
import { submitOrder, fetchStoreSettings } from '@/lib/api'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'

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

  const [deliverySettings, setDeliverySettings] = useState({
    minOrder: 100,
    deliveryCharge: 0,
    deliveryRadius: 10,
  })

  const [submitting, setSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items.length, router])

  useEffect(() => {
    fetchStoreSettings()
      .then(data => {
        if (data?.delivery_settings) {
          setDeliverySettings({
            minOrder: Number(data.delivery_settings.minOrder) || 100,
            deliveryCharge: Number(data.delivery_settings.deliveryCharge) || 0,
            deliveryRadius: Number(data.delivery_settings.deliveryRadius) || 10,
          })
        }
      })
      .catch(() => {})
  }, [])

  const subtotal = total
  const minOrder = deliverySettings.minOrder
  const baseDeliveryCharge = deliverySettings.deliveryCharge
  const isFreeDelivery = baseDeliveryCharge === 0 || subtotal >= minOrder
  const deliveryFee = isFreeDelivery ? 0 : baseDeliveryCharge
  const finalTotal = subtotal + deliveryFee

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

  const handleOrder = async () => {
    if (!validateForm()) return
    setSubmitting(true)

    let orderId = generateOrderId()
    try {
      const created = await submitOrder({
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        notes: formData.notes,
        items,
        total: finalTotal,
      })
      if (created?.id) {
        orderId = created.id
      }
    } catch {
      // Continue with local order id
    }

    // Build WhatsApp message for owner
    const message = buildWhatsAppMessage(
      items,
      finalTotal,
      formData.name,
      formData.phone,
      formData.address,
      formData.notes,
      orderId.slice(0, 8).toUpperCase()
    )

    // Open WhatsApp directly to shop owner (+91 98765 43210)
    const ownerNumber = '919876543210'
    const waUrl = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(message)}`
    window.open(waUrl, '_blank')

    clearCart()
    toast.success('Order placed successfully!')
    router.push(`/order-success?id=${orderId}`)
  }

  return (
    <div className="flex flex-col px-4 sm:px-6 lg:px-8 pt-6 pb-12 gap-6">
      <div className="flex items-center gap-3">
        <GlassButton onClick={() => router.back()} size="sm" variant="ghost" className="!px-2.5 !py-2">
          <ArrowLeft className="h-5 w-5 text-[#14532D]" />
        </GlassButton>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1A1A1A]">Checkout & Delivery</h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start"
      >
        {/* Left column: Form inputs */}
        <div className="md:col-span-7 lg:col-span-8">
          <GlassCard className="p-6 flex flex-col gap-4">
            <h2 className="font-display font-semibold text-[#1A1A1A] text-lg">Recipient & Delivery Address</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassInput 
                  label="Full Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Anand Kumar" 
                />
                <GlassInput 
                  label="Phone Number *"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210" 
                  type="tel"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5 font-sans">Full Delivery Address *</label>
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/10 text-sm text-[#1A1A1A] placeholder:text-stone-400 min-h-[90px] resize-none transition-all font-sans"
                  placeholder="Door no, Street name, Landmark, City & Pincode"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5 font-sans">Delivery Instructions (Optional)</label>
                <textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/10 text-sm text-[#1A1A1A] placeholder:text-stone-400 min-h-[70px] resize-none transition-all font-sans"
                  placeholder="Any special notes for our delivery executive..."
                />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right column: Sticky Summary on desktop */}
        <div className="md:col-span-5 lg:col-span-4 md:sticky md:top-36">
          <GlassCard className="p-6">
            <h2 className="font-display font-semibold text-[#1A1A1A] text-lg mb-3">Order Items Review</h2>
            <div className="space-y-2.5 mb-4 pr-1">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.weight}`} className="flex justify-between text-xs font-sans">
                  <span className="text-stone-600">
                    {item.quantity}× {item.product.name} ({formatProductWeight(item.product, item.weight)})
                  </span>
                  <span className="font-semibold text-[#B45309]">
                    {formatPrice(getItemTotalPrice(item))}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="h-px w-full bg-stone-100 my-3" />

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs sm:text-sm font-sans text-stone-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#1A1A1A]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm font-sans items-center">
                <span className="text-stone-600">Delivery Charge</span>
                {isFreeDelivery ? (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] border border-emerald-200">
                    FREE
                  </span>
                ) : (
                  <span className="font-bold text-[#B45309]">+{formatPrice(deliveryFee)}</span>
                )}
              </div>

              {!isFreeDelivery && subtotal < minOrder && (
                <p className="text-[11px] text-stone-500 font-sans bg-amber-50/70 p-2 rounded-lg border border-amber-200/60 mt-1">
                  💡 Add <span className="font-bold text-[#B45309]">{formatPrice(minOrder - subtotal)}</span> more for Free Delivery!
                </p>
              )}
            </div>

            <div className="h-px w-full bg-stone-100 my-3" />
            
            <div className="flex justify-between items-baseline mb-5">
              <span className="font-bold text-base text-[#1A1A1A]">Total Payable</span>
              <span className="font-display font-bold text-3xl text-[#B45309]">{formatPrice(finalTotal)}</span>
            </div>

            <button 
              type="button"
              disabled={submitting}
              onClick={handleOrder}
              className="w-full py-4 bg-[#14532D] hover:bg-[#166534] active:scale-[0.99] text-white font-bold text-base rounded-xl shadow-lg shadow-[#14532D]/20 flex items-center justify-center gap-2 transition-all cursor-pointer tracking-wide disabled:opacity-50"
            >
              {submitting ? 'Placing Order...' : 'Order'}
            </button>
          </GlassCard>
        </div>
      </motion.div>
    </div>
  )
}
