import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { FloatingNav } from '@/components/ui/floating-nav';
import { CartDrawer } from '@/components/store/cart-drawer';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Fresh Veggies 🥬 | உங்கள் காய்கறி கடை',
  description: 'Farm fresh vegetables delivered to your doorstep. Order online with bright organic produce.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Fresh Veggies',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col relative font-sans text-gray-900 bg-emerald-50/40 selection:bg-emerald-500 selection:text-white">
        {/* Animated Mesh Gradient background */}
        <div className="fixed inset-0 pointer-events-none -z-10 mesh-gradient opacity-70" />
        
        {/* Main Content Area */}
        <main className="flex-1 pb-24 max-w-lg mx-auto w-full shadow-2xl shadow-emerald-900/5 min-h-screen bg-white/30 backdrop-blur-[2px]">
          {children}
        </main>

        {/* Global Toasts */}
        <Toaster position="top-center" richColors />

        {/* Floating App Navigation Bar & Cart Drawer */}
        <div className="max-w-lg mx-auto w-full">
          <FloatingNav />
          <CartDrawer />
        </div>
      </body>
    </html>
  );
}
