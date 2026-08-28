'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LayoutDashboard, Package, ClipboardList, FolderTree, Settings, LogOut, Store } from 'lucide-react'
import { useAdmin } from '@/lib/store/use-admin'
import { GlassCard } from '@/components/ui/glass-card'

export function AdminSidebar() {
  const pathname = usePathname()
  const { shopName, logout } = useAdmin()

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Orders', path: '/orders', icon: ClipboardList },
    { name: 'Categories', path: '/categories', icon: FolderTree },
    { name: 'Settings', path: '/settings', icon: Settings },
  ]

  return (
    <>
      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3">
        <GlassCard className="flex justify-around items-center p-2 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <Link key={item.path} href={item.path} className="relative p-2 flex flex-col items-center gap-1 min-w-[60px]">
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-bg-admin"
                    className="absolute inset-0 bg-sky-100 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={20} className={isActive ? 'text-sky-600' : 'text-slate-500'} />
                <span className={`text-[10px] font-medium ${isActive ? 'text-sky-700' : 'text-slate-500'}`}>
                  {item.name}
                </span>
              </Link>
            )
          })}
          <Link href="/settings" className="relative p-2 flex flex-col items-center gap-1 min-w-[60px]">
            <Settings size={20} className={pathname === '/settings' ? 'text-sky-600' : 'text-slate-500'} />
            <span className={`text-[10px] font-medium ${pathname === '/settings' ? 'text-sky-700' : 'text-slate-500'}`}>
              Settings
            </span>
          </Link>
        </GlassCard>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 h-screen sticky top-0 p-4 shrink-0">
        <GlassCard className="h-full flex flex-col p-4 bg-white/60 backdrop-blur-xl border border-white/40 shadow-sm">
          <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-white/40">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-md">
              <Store size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-lg leading-tight">{shopName}</h2>
              <p className="text-xs text-slate-500 font-medium">Admin Panel</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group"
                >
                  {isActive && (
                    <motion.div
                      layoutId="desktop-nav-bg-admin"
                      className="absolute inset-0 bg-sky-100 rounded-xl shadow-sm border border-sky-200/50"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  <Icon size={18} className={`relative z-10 transition-colors ${isActive ? 'text-sky-600' : 'text-slate-500 group-hover:text-slate-700'}`} />
                  <span className={`relative z-10 font-medium text-sm transition-colors ${isActive ? 'text-sky-700' : 'text-slate-600 group-hover:text-slate-800'}`}>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto space-y-2 pt-4 border-t border-white/40">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-white/50 hover:text-slate-800 transition-colors text-sm font-medium"
            >
              <Store size={18} />
              View Customer Store ↗
            </a>
            <button
              onClick={() => {
                logout()
                window.location.href = '/login'
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors text-sm font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </GlassCard>
      </div>
    </>
  )
}
