import type { Metadata, Viewport } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { FloatingNav } from '@/components/ui/floating-nav';
import { DesktopNavbar } from '@/components/store/desktop-navbar';
import { ReduxProvider } from '@/components/providers/redux-provider';
import { InstallPromptModal } from '@/components/pwa/install-prompt-modal';
import { ServiceWorkerRegister } from '@/components/pwa/service-worker-register';

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

export const viewport: Viewport = {
  themeColor: '#14532D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Kaikaari | உங்கள் காய்கறி கடை',
  description: 'Farm fresh vegetables delivered to your doorstep. Handpicked quality every day.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Kaikaari',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans text-gray-900 bg-[#FAFAF6] selection:bg-forest selection:text-white"
      >
        <ReduxProvider>
          {/* Service Worker Registration */}
          <ServiceWorkerRegister />

          {/* QR Code Scan / Mobile PWA Install Prompt Modal */}
          <InstallPromptModal />

          {/* Subtle warm texture overlay */}
          <div className="fixed inset-0 pointer-events-none -z-10 noise-texture" />

          {/* Desktop Navigation for Laptops & Screens */}
          <DesktopNavbar />

          {/* Main Content Area - Responsive for Mobile & Laptops */}
          <main className="flex-1 pb-32 sm:pb-28 md:pb-12 max-w-lg md:max-w-7xl mx-auto w-full min-h-screen bg-[#FAFAF6] md:border-x border-stone-200/60 shadow-[0_0_80px_rgba(0,0,0,0.04)]">
            {children}
          </main>

          <Toaster position="top-center" richColors />

          {/* Floating Mobile Nav */}
          <div className="w-full">
            <FloatingNav />
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
