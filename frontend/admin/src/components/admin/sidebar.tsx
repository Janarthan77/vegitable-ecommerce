'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Package, ClipboardList, FolderTree, Settings, LogOut, Store, Leaf } from 'lucide-react'
import { useAdmin } from '@/lib/store/use-admin'

export function AdminSidebar() {
  const pathname = usePathname()
  const { shopName, logout } = useAdmin()

  const navItems = [
    { name: 'Dashboard',  path: '/',           icon: LayoutDashboard },
    { name: 'Products',   path: '/products',   icon: Package },
    { name: 'Orders',     path: '/orders',     icon: ClipboardList },
    { name: 'Categories', path: '/categories', icon: FolderTree },
    { name: 'Settings',   path: '/settings',   icon: Settings },
  ]

  if (pathname === '/login') {
    return null
  }

  return (
    <>
      {/* ── Mobile Bottom Nav ─────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <Link key={item.path} href={item.path} className="flex flex-col items-center gap-1 min-w-[54px] py-1">
                <div className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
                  isActive ? 'bg-[#DCFCE7] text-[#14532D]' : 'text-stone-400 hover:text-stone-600'
                }`}>
                  <Icon size={18} />
                </div>
                <span className={`text-[10px] font-semibold tracking-tight ${
                  isActive ? 'text-[#14532D]' : 'text-stone-400'
                }`}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── Desktop Sidebar ───────────────────────── */}
      <div className="hidden md:flex flex-col w-64 h-screen bg-[#14532D] text-white shrink-0 sticky top-0">
        {/* Brand header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shadow-inner">
              <Leaf className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white leading-tight">{shopName || 'Kaikaari'}</h2>
              <p className="text-xs text-emerald-200/60 font-sans mt-0.5">Admin Management</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                className="relative flex items-center gap-3 px-3.5 py-3 rounded-xl transition-colors group"
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="admin-active-pill"
                      className="absolute inset-0 bg-white/15 rounded-xl border border-white/20"
                      transition={{ type: 'spring', stiffness: 340, damping: 26 }}
                    />
                  )}
                </AnimatePresence>
                <Icon size={19} className={`relative z-10 transition-colors ${
                  isActive ? 'text-white' : 'text-emerald-200/60 group-hover:text-white'
                }`} />
                <span className={`relative z-10 text-sm font-medium transition-colors ${
                  isActive ? 'text-white font-semibold' : 'text-emerald-200/70 group-hover:text-white'
                }`}>
                  {item.name}
                </span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-300 relative z-10" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer links */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-emerald-200/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
          >
            <Store size={18} />
            Customer Store ↗
          </a>
          <button
            onClick={() => {
              logout()
              window.location.href = '/login'
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 transition-colors text-sm font-medium cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </>
  )
}
