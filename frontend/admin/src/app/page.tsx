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
import { fetchOrders, updateOrderStatus, fetchDashboardStats } from '@/lib/api'
import { toast } from 'sonner'

export default function AdminDashboard() {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 25,
    inStockCount: 25,
    totalOrders: 2,
    totalRevenue: 285,
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
      toast.success(`Order #${orderId} marked as ${status}`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status')
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 md:space-y-8">
      <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{greeting} 👋</h1>
          <p className="text-slate-500 font-medium">Vegetable shop live inventory and order overview</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <GlassButton onClick={loadData} size="sm" variant="secondary" className="border-slate-200">
            <RefreshCw size={16} className={`mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </GlassButton>
          <Link href="/products" className="flex-1 sm:flex-none">
            <GlassButton className="w-full bg-sky-600 hover:bg-sky-700 text-white border-sky-400">
              <Plus size={18} className="mr-1.5" /> Add Product
            </GlassButton>
          </Link>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatsCard title="Total Revenue" value={stats.totalRevenue} icon={<IndianRupee size={24} />} trend="Live from DB" color="emerald" />
        <StatsCard title="Total Orders" value={stats.totalOrders} icon={<ShoppingCart size={24} />} trend="Active orders" color="sky" />
        <StatsCard title="Total Products" value={stats.totalProducts} icon={<Package size={24} />} color="orange" />
        <StatsCard title="In Stock" value={stats.inStockCount} icon={<TrendingUp size={24} />} color="yellow" />
      </motion.div>

      <motion.div variants={item} className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Recent Customer Orders</h2>
          <Link href="/orders" className="text-sky-600 hover:text-sky-700 text-sm font-medium flex items-center gap-1 transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid gap-4">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
            ))
          ) : (
            <GlassCard className="p-8 text-center text-slate-400">
              <ShoppingCart size={36} className="mx-auto mb-2 opacity-30" />
              <p>No orders yet today</p>
            </GlassCard>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
