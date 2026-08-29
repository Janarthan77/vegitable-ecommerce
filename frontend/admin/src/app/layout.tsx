import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { AdminLayoutShell } from '@/components/admin/admin-layout-shell';

const playfair = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const dmSans = DM_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kaikaari Admin | கடை நிர்வாகம்',
  description: 'Farm Fresh Vegetables Admin Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-full font-sans text-[#1A1A1A] bg-[#FAFAF6] selection:bg-[#14532D] selection:text-white">
        <AdminLayoutShell>
          {children}
        </AdminLayoutShell>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
