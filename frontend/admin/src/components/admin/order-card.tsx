'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Order } from '@/types'
import { GlassCard } from '@/components/ui/glass-card'
import { formatPrice } from '@/lib/utils'
import { ChevronDown, MapPin, Phone, User, Clock, Package, Trash2, MessageCircle } from 'lucide-react'
import { buildAdminOrderWhatsAppMessage } from '@/lib/utils'

interface OrderCardProps {
  order: Order
  onStatusChange: (orderId: string, status: Order['status']) => void
  onDelete?: (orderId: string) => void
}

export function OrderCard({ order, onStatusChange, onDelete }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false)

  const statusColors: Record<Order['status'], { bg: string, text: string, label: string }> = {
    pending: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', label: 'Pending' },
    confirmed: { bg: 'bg-sky-50 border-sky-200', text: 'text-sky-800', label: 'Confirmed' },
    preparing: { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-800', label: 'Preparing' },
    'out-for-delivery': { bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-800', label: 'Out for Delivery' },
    delivered: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800', label: 'Delivered' },
    cancelled: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', label: 'Cancelled' }
  }

  const statuses: Order['status'][] = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled']

  const displayId = order.id.length > 12 
    ? `#${order.id.slice(0, 8).toUpperCase()}` 
    : `#${order.id}`

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={isStatusMenuOpen ? 'relative z-50' : 'relative z-10'}
    >
      {/* Click outside backdrop */}
      {isStatusMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsStatusMenuOpen(false)} 
        />
      )}

      <GlassCard className="p-4 sm:p-5 relative overflow-visible">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 p-2.5 rounded-xl text-[#14532D] shadow-sm">
              <Package size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-display font-bold text-base text-[#1A1A1A]">{displayId}</h4>
                <span className="text-[10px] text-stone-400 font-mono hidden sm:inline" title={order.id}>
                  ({order.id.slice(-6)})
                </span>
              </div>
              <p className="text-xs text-stone-400 flex items-center gap-1 mt-0.5 font-sans">
                <Clock size={12} />
                {new Date(order.createdAt).toLocaleString('en-IN', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between sm:justify-end gap-3 relative">
            <h4 className="font-display font-bold text-lg text-[#B45309]">{formatPrice(order.total)}</h4>
            
            <div className="relative flex items-center gap-1.5 z-50">
              <button 
                type="button"
                onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border shadow-sm transition-all cursor-pointer ${statusColors[order.status].bg} ${statusColors[order.status].text}`}
              >
                {statusColors[order.status].label}
                <ChevronDown size={14} className={`transition-transform ${isStatusMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {onDelete && (
                <button
                  type="button"
                  title="Delete Order"
                  onClick={() => onDelete(order.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              )}

              <AnimatePresence>
                {isStatusMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white border border-stone-200 shadow-2xl rounded-xl p-1.5 z-50 flex flex-col gap-1"
                  >
                    {statuses.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onStatusChange(order.id, s)
                          setIsStatusMenuOpen(false)
                        }}
                        className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                          order.status === s ? 'bg-[#DCFCE7] text-[#14532D]' : 'text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <span>{statusColors[s].label}</span>
                        {order.status === s && <span className="w-1.5 h-1.5 rounded-full bg-[#14532D]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 bg-[#FAFAF6] rounded-xl p-3.5 border border-stone-100 text-xs font-sans">
          <div className="flex items-start justify-between gap-2.5 text-stone-600">
            <div className="flex items-start gap-2.5">
              <User size={15} className="mt-0.5 text-stone-400 shrink-0" />
              <div>
                <p className="font-semibold text-[#1A1A1A]">{order.customerName || 'Customer'}</p>
                <div className="flex items-center gap-1 mt-0.5 text-stone-500">
                  <Phone size={11} className="text-stone-400" />
                  <span>{order.customerPhone || 'N/A'}</span>
                </div>
              </div>
            </div>

            {order.customerPhone && (
              <a
                href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(buildAdminOrderWhatsAppMessage(order))}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-[11px] font-bold shadow-sm transition-transform active:scale-95 shrink-0"
                title="Send Order Details to Customer on WhatsApp"
              >
                <MessageCircle size={13} />
                <span>WhatsApp</span>
              </a>
            )}
          </div>
          <div className="flex items-start gap-2.5 text-stone-600">
            <MapPin size={15} className="mt-0.5 text-stone-400 shrink-0" />
            <div>
              <p className="line-clamp-2 text-stone-600">{order.customerAddress || 'Pickup in store'}</p>
              {order.notes && (
                <p className="text-[11px] text-amber-800 bg-amber-50 rounded px-1.5 py-0.5 mt-1 inline-block">
                  Note: {order.notes}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-2 text-xs text-[#14532D] font-semibold flex items-center justify-center gap-1 hover:bg-[#DCFCE7]/30 rounded-xl transition-colors cursor-pointer"
          >
            {isExpanded ? 'Hide Items' : `View ${Array.isArray(order.items) ? order.items.length : 0} Items`}
            <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3 border-t border-stone-100 mt-2 space-y-2 text-xs font-sans">
                  {Array.isArray(order.items) && order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 border-b border-stone-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{item.product?.emoji || '🥬'}</span>
                        <span className="font-medium text-[#1A1A1A]">{item.product?.name || 'Produce Item'}</span>
                        <span className="text-stone-400">× {item.quantity || 1}</span>
                      </div>
                      <span className="font-semibold text-[#B45309]">
                        {formatPrice((item.product?.price || 0) * (item.quantity || 1))}
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
