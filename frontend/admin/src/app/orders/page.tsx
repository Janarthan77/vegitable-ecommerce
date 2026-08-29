'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Order } from '@/types'
import { OrderCard } from '@/components/admin/order-card'
import { ClipboardList, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { fetchOrders, updateOrderStatus, deleteOrder } from '@/lib/api'

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
      toast.success(`Order #${orderId.slice(0, 8).toUpperCase()} updated to ${status}`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to update order status')
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return
    try {
      await deleteOrder(orderId)
      setOrders(prev => prev.filter(o => o.id !== orderId))
      toast.success(`Order #${orderId.slice(0, 8).toUpperCase()} deleted`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete order')
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
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#1A1A1A]">Orders Management 📋</h1>
          <p className="text-stone-500 font-sans text-sm mt-0.5">Track customer orders, prepare fresh bags, and update delivery status</p>
        </div>
        <GlassButton onClick={loadOrders} size="sm" variant="secondary">
          <RefreshCw size={15} className={`mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </GlassButton>
      </div>

      <GlassCard className="p-2 sm:p-2.5 overflow-x-auto">
        <div className="flex gap-1.5 min-w-max">
          {tabs.map((tab) => {
            const isActive = filter === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`relative px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  isActive ? 'bg-[#14532D] text-white shadow-sm' : 'text-stone-600 hover:text-[#1A1A1A] hover:bg-stone-50'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </GlassCard>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {orders.length > 0 ? (
            orders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusChange={handleStatusChange} 
                onDelete={handleDeleteOrder}
              />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="text-center py-16 text-stone-400 bg-white rounded-2xl border border-stone-200"
            >
              <ClipboardList size={40} className="mx-auto mb-3 opacity-30 text-[#14532D]" />
              <p className="text-sm font-sans">No orders found for this status.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
