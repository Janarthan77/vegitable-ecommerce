'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassInput } from '@/components/ui/glass-input'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { adminLogin } from '@/lib/api'
import { useAdmin } from '@/lib/store/use-admin'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { setAuth } = useAdmin()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) {
      toast.error('Please enter admin password')
      return
    }

    try {
      setLoading(true)
      const res = await adminLogin(password)
      if (res.success) {
        setAuth(res.token || 'admin_token', res.shopName)
        toast.success('Welcome back, Shop Owner! 🥬')
        router.push('/')
      }
    } catch (err: any) {
      toast.error(err.message || 'Invalid admin password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8 backdrop-blur-2xl bg-white/80 shadow-2xl border border-white/60">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
              🥬
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Portal</h1>
            <p className="text-slate-500 text-sm mt-1">கடை நிர்வாக மேலாண்மை</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Admin Secret Password
              </label>
              <div className="relative">
                <GlassInput
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (default: admin123)"
                  icon={<Lock size={18} />}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <GlassButton
              type="submit"
              fullWidth
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Enter Admin Panel'}
            </GlassButton>

            <p className="text-center text-xs text-slate-400">
              Demo access: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">admin123</code>
            </p>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  )
}
