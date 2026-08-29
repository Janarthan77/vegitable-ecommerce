'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassInput } from '@/components/ui/glass-input'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, Leaf, ArrowLeft, ShieldCheck } from 'lucide-react'
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

  const fillDemoPassword = () => {
    setPassword('admin123')
    toast.info('Demo password filled: admin123')
  }

  return (
    <div className="w-full flex flex-col items-center justify-center py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-6 sm:p-9 bg-white shadow-2xl border border-stone-200/80 rounded-2xl">
          {/* Logo & Header */}
          <div className="text-center mb-7">
            <div className="w-16 h-16 bg-[#DCFCE7] rounded-2xl flex items-center justify-center mx-auto mb-3.5 text-[#14532D] shadow-sm border border-emerald-200/60">
              <Leaf size={32} />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              Admin Portal
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm font-sans mt-1">
              கடை நிர்வாக மேலாண்மை • Store Management
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <div>
              <div className="relative">
                <GlassInput
                  label="Admin Secret Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (default: admin123)"
                  icon={<Lock size={16} />}
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-9 text-stone-400 hover:text-stone-600 cursor-pointer p-1 rounded-md"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <GlassButton
              type="submit"
              variant="primary"
              fullWidth
              className="py-3.5 text-sm font-semibold tracking-wide shadow-md shadow-[#14532D]/20 cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShieldCheck size={18} />
                  Enter Admin Panel
                </span>
              )}
            </GlassButton>

            {/* Demo access pill */}
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={fillDemoPassword}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100/80 hover:bg-stone-200/70 text-[11px] text-stone-600 font-sans transition-colors cursor-pointer border border-stone-200/60"
              >
                <span>Demo Password:</span>
                <code className="font-mono font-bold text-[#14532D]">admin123</code>
                <span className="text-[10px] text-stone-400">(Click to Fill)</span>
              </button>
            </div>
          </form>
        </GlassCard>

        {/* Back to store navigation link */}
        <div className="mt-6 text-center">
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-[#14532D] transition-colors py-1 px-3 rounded-lg hover:bg-white/60"
          >
            <ArrowLeft size={14} />
            <span>Go to Customer Storefront (localhost:3000)</span>
          </a>
        </div>
      </motion.div>
    </div>
  )
}
