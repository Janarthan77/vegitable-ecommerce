'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassInput } from '@/components/ui/glass-input'
import { Store, MapPin, Clock, Save, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { useAdmin } from '@/lib/store/use-admin'
import { useRouter } from 'next/navigation'
import { WorkingHoursPicker, WorkingHoursData } from '@/components/admin/working-hours-picker'
import { fetchStoreSettings, updateStoreSettings } from '@/lib/api'

export default function SettingsPage() {
  const { shopName, setAuth, logout } = useAdmin()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    shopName: shopName || 'Kaikaari 🥬',
    phone: '+91 98765 43210',
    address: '123 Anna Salai, Chennai, TN 600002',
    deliveryRadius: '10',
    minOrder: '100',
    deliveryCharge: '0',
  })

  const [workingHours, setWorkingHours] = useState<WorkingHoursData>({
    openHour: '06',
    openMinute: '00',
    openPeriod: 'AM',
    closeHour: '09',
    closeMinute: '00',
    closePeriod: 'PM',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  })

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchStoreSettings()
        if (data) {
          if (data.shop_profile || data.delivery_settings) {
            setFormData(prev => ({
              ...prev,
              ...(data.shop_profile || {}),
              ...(data.delivery_settings || {}),
            }))
          }
          if (data.working_hours) {
            setWorkingHours(data.working_hours)
          }
          return
        }
      } catch (err) {
        console.warn('API settings load failed, trying localStorage fallback', err)
      }

      // LocalStorage fallback
      try {
        const savedTimings = localStorage.getItem('veggie_store_timings')
        if (savedTimings) setWorkingHours(JSON.parse(savedTimings))
        const savedProfile = localStorage.getItem('veggie_store_profile')
        if (savedProfile) setFormData(JSON.parse(savedProfile))
      } catch {
        // default
      }
    }

    load()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const payload = {
        shop_profile: {
          shopName: formData.shopName,
          phone: formData.phone,
          address: formData.address,
        },
        delivery_settings: {
          deliveryRadius: formData.deliveryRadius,
          minOrder: formData.minOrder,
          deliveryCharge: formData.deliveryCharge,
        },
        working_hours: workingHours,
      }

      await updateStoreSettings(payload)
      localStorage.setItem('veggie_store_timings', JSON.stringify(workingHours))
      localStorage.setItem('veggie_store_profile', JSON.stringify(formData))

      setAuth('admin_active_token', formData.shopName)
      toast.success('Delivery & Store settings updated successfully in Database!')
    } catch (err: any) {
      console.error('Settings save error:', err)
      // Save locally as backup
      localStorage.setItem('veggie_store_timings', JSON.stringify(workingHours))
      localStorage.setItem('veggie_store_profile', JSON.stringify(formData))
      toast.error(`Database error: ${err.message || 'API connection failed'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
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
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 w-full">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-[#1A1A1A]">Store Settings ⚙️</h1>
        <p className="text-stone-500 font-sans text-sm mt-0.5">
          Manage your vegetable store profile, AM/PM operational timings, operating days, and delivery guidelines
        </p>
      </div>

      {/* ── Shop Info Card ─────────────────────────── */}
      <motion.div variants={item}>
        <GlassCard className="p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 bg-emerald-50 text-[#14532D] rounded-xl shadow-sm">
              <Store size={20} />
            </div>
            <h2 className="font-display text-lg font-bold text-[#1A1A1A]">Shop Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <GlassInput label="Shop Name" name="shopName" value={formData.shopName} onChange={handleChange} />
            </div>
            <div>
              <GlassInput label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <GlassInput label="Shop Address" name="address" value={formData.address} onChange={handleChange} />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Working Hours Card (AM/PM & Days) ─────── */}
        <div className="lg:col-span-7">
          <GlassCard className="p-5 sm:p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-orange-50 text-orange-800 rounded-xl shadow-sm">
                  <Clock size={20} />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-[#1A1A1A]">Working Hours & Operating Days</h2>
                  <p className="text-xs text-stone-400 font-sans">Set exact store opening and closing times in 12-hour AM/PM format</p>
                </div>
              </div>

              <WorkingHoursPicker value={workingHours} onChange={setWorkingHours} />
            </div>
          </GlassCard>
        </div>

        {/* ── Delivery Settings & Actions ─────────────── */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl shadow-sm">
                <MapPin size={20} />
              </div>
              <h2 className="font-display text-lg font-bold text-[#1A1A1A]">Delivery Settings</h2>
            </div>
            
            <div className="space-y-3.5">
              <div>
                <GlassInput label="Delivery Radius (km)" type="number" name="deliveryRadius" value={formData.deliveryRadius} onChange={handleChange} />
              </div>
              <div>
                <GlassInput label="Minimum Order Amount (₹)" type="number" name="minOrder" value={formData.minOrder} onChange={handleChange} />
              </div>
              <div>
                <GlassInput label="Delivery Charge (₹, 0 for Free)" type="number" name="deliveryCharge" value={formData.deliveryCharge} onChange={handleChange} />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex flex-col gap-2.5">
              <GlassButton 
                onClick={handleSave}
                disabled={loading}
                variant="primary"
                className="w-full py-3.5 text-sm font-semibold tracking-wide shadow-md"
              >
                <Save size={18} className="mr-2" /> {loading ? 'Saving Settings...' : 'Save All Settings'}
              </GlassButton>
              
              <button 
                onClick={handleLogout}
                className="w-full py-2.5 flex items-center justify-center gap-2 text-rose-600 font-semibold hover:bg-rose-50 rounded-xl transition-colors text-xs cursor-pointer"
              >
                <LogOut size={15} /> Logout from Admin
              </button>
            </div>
          </GlassCard>
        </div>
      </motion.div>
    </motion.div>
  )
}
