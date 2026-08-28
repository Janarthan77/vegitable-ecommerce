'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Order } from '@/types'
import { OrderCard } from '@/components/admin/order-card'
import { ClipboardList, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { fetchOrders, updateOrderStatus } from '@/lib/api'

export default function OrdersPage() {
  const [filter, setFilter] = useState<Order['status'] | 'all'>('all')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await fetchOrders(filter === 'all' ? undefined : filter)
      setOrders(data)
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [filter])

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus(orderId, status)
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
      toast.success(`Order #${orderId} marked as ${status}`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to update order status')
    }
  }

  const tabs: { id: Order['status'] | 'all', label: string }[] = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'out-for-delivery', label: 'Out for Delivery' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Orders Management 📋</h1>
          <p className="text-slate-500 font-medium">Track customer orders, prepare bags, and update delivery status</p>
        </div>
        <GlassButton onClick={loadOrders} size="sm" variant="secondary">
          <RefreshCw size={16} className={`mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </GlassButton>
      </div>

      <GlassCard className="p-2 sm:p-3 overflow-x-auto hide-scrollbar">
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className="relative px-4 py-2 text-sm font-medium rounded-xl transition-colors"
            >
              {filter === tab.id && (
                <motion.div
                  layoutId="order-filter-active"
                  className="absolute inset-0 bg-sky-100 rounded-xl border border-sky-200"
                  transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
                />
              )}
              <span className={`relative z-10 ${filter === tab.id ? 'text-sky-700' : 'text-slate-600 hover:text-slate-800'}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </GlassCard>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {orders.length > 0 ? (
            orders.map(order => (
              <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="text-center py-16 text-slate-500 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/40"
            >
              <ClipboardList size={48} className="mx-auto mb-4 opacity-20" />
              <p>No orders found for this status.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
