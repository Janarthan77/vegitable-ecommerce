'use client'

import { usePathname } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'
import { useAdmin } from '@/lib/store/use-admin'
import { Leaf } from 'lucide-react'

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { shopName } = useAdmin()
  const isLoginPage = pathname === '/login'

  if (isLoginPage) {
    return (
      <main className="min-h-screen w-full bg-[#FAFAF6] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          {children}
        </div>
      </main>
    )
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col md:flex-row font-sans text-[#1A1A1A] bg-[#FAFAF6]">
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-9 pb-24 md:pb-10 w-full bg-[#FAFAF6]">
        {/* Mobile Top Header (only visible on phones/tablets < 768px) */}
        <div className="md:hidden flex items-center justify-between pb-3.5 mb-4 border-b border-stone-200/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#14532D] flex items-center justify-center text-white shadow-xs">
              <Leaf size={18} className="text-emerald-300" />
            </div>
            <div>
              <span className="font-display font-bold text-sm text-[#1A1A1A] leading-tight block">
                {shopName || 'Fresh Veggies 🥬'}
              </span>
              <span className="text-[10px] text-stone-400 font-sans block">கடை நிர்வாகம் (Admin)</span>
            </div>
          </div>
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-semibold text-[#14532D] bg-[#DCFCE7] hover:bg-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors border border-emerald-200/60 shadow-xs"
          >
            <span>Store</span>
            <span className="text-xs">↗</span>
          </a>
        </div>

        <div className="w-full max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
