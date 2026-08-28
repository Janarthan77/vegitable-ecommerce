'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Order } from '@/types'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassBadge } from '@/components/ui/glass-badge'
import { GlassButton } from '@/components/ui/glass-button'
import { formatPrice } from '@/lib/utils'
import { ChevronDown, MapPin, Phone, User, Clock, Package } from 'lucide-react'

interface OrderCardProps {
  order: Order
  onStatusChange: (orderId: string, status: Order['status']) => void
}

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false)

  const statusColors: Record<Order['status'], { bg: string, text: string, label: string }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
    confirmed: { bg: 'bg-sky-100', text: 'text-sky-700', label: 'Confirmed' },
    preparing: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Preparing' },
    'out-for-delivery': { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Out for Delivery' },
    delivered: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Delivered' },
    cancelled: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Cancelled' }
  }

  const statuses: Order['status'][] = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled']

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <GlassCard className="p-4 sm:p-5 relative overflow-visible">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-sky-100 p-2 rounded-lg text-sky-600">
              <Package size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">#{order.id}</h4>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Clock size={12} />
                {new Date(order.createdAt).toLocaleString('en-IN', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between sm:justify-end gap-3 relative">
            <h4 className="font-bold text-slate-800">{formatPrice(order.total)}</h4>
            
            <div className="relative">
              <button 
                onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-white/40 shadow-sm backdrop-blur-md transition-all ${statusColors[order.status].bg} ${statusColors[order.status].text}`}
              >
                {statusColors[order.status].label}
                <ChevronDown size={14} className={`transition-transform ${isStatusMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isStatusMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-2 z-20 flex flex-col gap-1"
                  >
                    {statuses.map(s => (
                      <button
                        key={s}
                        onClick={() => {
                          onStatusChange(order.id, s)
                          setIsStatusMenuOpen(false)
                        }}
                        className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-slate-100 ${
                          order.status === s ? 'bg-slate-50 text-slate-900' : 'text-slate-600'
                        }`}
                      >
                        {statusColors[s].label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-slate-50/50 rounded-xl p-3 border border-white/40">
          <div className="flex items-start gap-2 text-sm text-slate-600">
            <User size={16} className="mt-0.5 text-slate-400 shrink-0" />
            <div>
              <p className="font-medium text-slate-800">{order.customerName || 'Guest User'}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Phone size={12} className="text-slate-400" />
                <span>{order.customerPhone || 'N/A'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-600">
            <MapPin size={16} className="mt-0.5 text-slate-400 shrink-0" />
            <p className="line-clamp-2">{order.customerAddress || 'Pickup in store'}</p>
          </div>
        </div>

        <div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-2 text-sm text-sky-600 font-medium flex items-center justify-center gap-1 hover:bg-white/40 rounded-xl transition-colors"
          >
            {isExpanded ? 'Hide Items' : `View ${order.items.length} Items`}
            <ChevronDown size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3 border-t border-slate-200/50 mt-2 space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm py-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.product.emoji}</span>
                        <span className="text-slate-700">{item.product.name}</span>
                        <span className="text-xs text-slate-400">x{item.quantity}</span>
                      </div>
                      <span className="font-medium text-slate-800">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassCard>
    </motion.div>
  )
}
