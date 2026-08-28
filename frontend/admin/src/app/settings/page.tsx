'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassInput } from '@/components/ui/glass-input'
import { Store, Phone, MapPin, Clock, Save, LogOut, Cloud, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useAdmin } from '@/lib/store/use-admin'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { shopName, logout } = useAdmin()
  const router = useRouter()

  const [formData, setFormData] = useState({
    shopName: shopName || 'Fresh Veggies 🥬',
    phone: '+91 98765 43210',
    address: '123 Anna Salai, Chennai, TN 600002',
    deliveryRadius: '10',
    minOrder: '100',
    deliveryCharge: '0',
    openTime: '06:00',
    closeTime: '21:00',
    // Cloudflare R2 Settings
    cfAccountId: 'your_cloudflare_account_id',
    cfBucketName: 'vegetable-shop-images',
    cfPublicDomain: 'https://pub-vegetables.r2.dev',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    toast.success('Settings and Cloudflare preferences saved!')
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
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
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Store Settings ⚙️</h1>
        <p className="text-slate-500 font-medium">Manage store information and Cloudflare image storage</p>
      </div>

      {/* Cloudflare Configuration Section */}
      <motion.div variants={item}>
        <GlassCard className="p-6 border-l-4 border-l-sky-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-100 text-sky-600 rounded-xl">
                <Cloud size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Cloudflare Image Storage (R2)</h2>
                <p className="text-xs text-slate-500">Only image URLs are stored in database; files stream to Cloudflare</p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold">
              <ShieldCheck size={14} /> Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">R2 Account ID</label>
              <GlassInput name="cfAccountId" value={formData.cfAccountId} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">R2 Bucket Name</label>
              <GlassInput name="cfBucketName" value={formData.cfBucketName} onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Public CDN Domain URL</label>
              <GlassInput name="cfPublicDomain" value={formData.cfPublicDomain} onChange={handleChange} placeholder="https://pub-xxxx.r2.dev" />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={item}>
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-sky-100 text-sky-600 rounded-xl">
              <Store size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Shop Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Shop Name</label>
              <GlassInput name="shopName" value={formData.shopName} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <GlassInput name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <GlassInput name="address" value={formData.address} onChange={handleChange} />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <MapPin size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Delivery Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Radius (km)</label>
              <GlassInput type="number" name="deliveryRadius" value={formData.deliveryRadius} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Order Amount (₹)</label>
              <GlassInput type="number" name="minOrder" value={formData.minOrder} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Charge (₹, 0 for Free)</label>
              <GlassInput type="number" name="deliveryCharge" value={formData.deliveryCharge} onChange={handleChange} />
            </div>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                <Clock size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Working Hours</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Opening Time</label>
                <GlassInput type="time" name="openTime" value={formData.openTime} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Closing Time</label>
                <GlassInput type="time" name="closeTime" value={formData.closeTime} onChange={handleChange} />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex flex-col gap-3">
              <GlassButton 
                onClick={handleSave}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white border-sky-400 py-3 text-base font-semibold"
              >
                <Save size={20} className="mr-2" /> Save All Settings
              </GlassButton>
              
              <button 
                onClick={handleLogout}
                className="w-full py-2.5 flex items-center justify-center gap-2 text-rose-500 font-medium hover:bg-rose-50 rounded-xl transition-colors text-sm"
              >
                <LogOut size={16} /> Logout from Admin
              </button>
            </div>
          </GlassCard>
        </div>
      </motion.div>
    </motion.div>
  )
}
