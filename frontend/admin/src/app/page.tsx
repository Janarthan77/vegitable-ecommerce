'use client'

import { motion } from 'framer-motion'
import { StatsCard } from '@/components/admin/stats-card'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { Package, IndianRupee, ShoppingCart, TrendingUp, Plus, ArrowRight, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { OrderCard } from '@/components/admin/order-card'
import { useState, useEffect } from 'react'
import { Order, DashboardStats } from '@/types'
import { fetchOrders, updateOrderStatus, fetchDashboardStats, deleteOrder } from '@/lib/api'
import { toast } from 'sonner'

export default function AdminDashboard() {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    inStockCount: 0,
    totalOrders: 0,
    totalRevenue: 0,
  })

  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setLoading(true)
      const [statsData, ordersData] = await Promise.all([
        fetchDashboardStats().catch(() => null),
        fetchOrders().catch(() => []),
      ])

      if (statsData) setStats(statsData)
      if (ordersData) setRecentOrders(ordersData.slice(0, 4))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus(orderId, status)
      setRecentOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
      toast.success(`Order #${orderId.slice(0, 8).toUpperCase()} marked as ${status}`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status')
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return
    try {
      await deleteOrder(orderId)
      setRecentOrders(prev => prev.filter(o => o.id !== orderId))
      loadData()
      toast.success(`Order #${orderId.slice(0, 8).toUpperCase()} deleted`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete order')
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 md:space-y-8">
      <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#1A1A1A]">{greeting} 👋</h1>
          <p className="text-stone-500 font-sans text-sm mt-0.5">Vegetable shop live inventory and order overview</p>
        </div>
        <div className="flex gap-2.5 w-full sm:w-auto">
          <GlassButton onClick={loadData} size="sm" variant="secondary">
            <RefreshCw size={15} className={`mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </GlassButton>
          <Link href="/products" className="flex-1 sm:flex-none">
            <GlassButton size="sm" variant="primary" className="w-full">
              <Plus size={16} className="mr-1.5" /> Add Product
            </GlassButton>
          </Link>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatsCard title="Total Revenue" value={stats.totalRevenue} icon={<IndianRupee size={22} />} trend="Live from DB" color="emerald" />
        <StatsCard title="Total Orders" value={stats.totalOrders} icon={<ShoppingCart size={22} />} trend="Active orders" color="sky" />
        <StatsCard title="Total Products" value={stats.totalProducts} icon={<Package size={22} />} color="orange" />
        <StatsCard title="In Stock" value={stats.inStockCount} icon={<TrendingUp size={22} />} color="yellow" />
      </motion.div>

      <motion.div variants={item} className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-xl font-semibold text-[#1A1A1A]">Recent Customer Orders</h2>
          <Link href="/orders" className="text-[#14532D] hover:text-[#166534] text-xs font-semibold flex items-center gap-1 transition-colors">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        
        <div className="grid gap-3">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusChange={handleStatusChange} 
                onDelete={handleDeleteOrder}
              />
            ))
          ) : (
            <GlassCard className="p-8 text-center text-stone-400">
              <ShoppingCart size={32} className="mx-auto mb-2 opacity-30 text-[#14532D]" />
              <p className="text-sm font-sans">No customer orders placed yet today</p>
            </GlassCard>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
