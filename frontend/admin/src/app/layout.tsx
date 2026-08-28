import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { AdminSidebar } from '@/components/admin/sidebar';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Fresh Veggies Admin 🥬 | கடை நிர்வாகம்',
  description: 'Vegetable Store Admin Dashboard with Cloudflare Image Integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans text-slate-800 bg-slate-50/50 selection:bg-sky-500 selection:text-white">
        {/* Background Mesh Gradient */}
        <div className="fixed inset-0 pointer-events-none -z-10 mesh-gradient opacity-60" />
        
        <div className="flex flex-col md:flex-row min-h-screen">
          <AdminSidebar />
          
          <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>

        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
