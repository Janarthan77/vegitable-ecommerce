'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share, PlusSquare, Download, Sparkles, CheckCircle2, ShieldCheck, Zap, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPromptModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // 1. Check if application is already running in standalone mode (already installed & opened as app)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://') ||
        window.location.search.includes('source=pwa');

      return isStandaloneMode;
    };

    if (checkStandalone()) {
      setIsStandalone(true);
      return; // Already installed & opened as app: DO NOT show popup!
    }

    // 2. Check getInstalledRelatedApps if supported by browser
    if ('getInstalledRelatedApps' in navigator) {
      (navigator as unknown as { getInstalledRelatedApps: () => Promise<unknown[]> })
        .getInstalledRelatedApps()
        .then((apps) => {
          if (apps && apps.length > 0 && checkStandalone()) {
            setIsStandalone(true);
            return;
          }
        })
        .catch(() => {});
    }

    // 3. Detect iOS (Safari / WebKit)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    // 4. Android / Chrome beforeinstallprompt event listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Mandatory: open modal immediately
      setIsOpen(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Mandatory: Show immediately for all non-standalone browser visitors
    const timer = setTimeout(() => {
      if (!checkStandalone()) {
        setIsOpen(true);
      }
    }, 400);

    // 5. Listen for successful install event
    const handleAppInstalled = () => {
      setIsStandalone(true);
      setIsOpen(false);
      localStorage.setItem('kaikaari_app_installed', 'true');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      setInstalling(true);
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsOpen(false);
          setIsStandalone(true);
          localStorage.setItem('kaikaari_app_installed', 'true');
        }
      } catch (err) {
        console.error('Install prompt error:', err);
      } finally {
        setInstalling(false);
        setDeferredPrompt(null);
      }
    } else {
      // Fallback for browsers that don't pass deferredPrompt
      alert(
        'Please tap your browser menu (⋮ or share) and select "Install app" or "Add to Home screen" to continue.'
      );
    }
  };

  // If already standalone (installed & running as app), do not render anything
  if (isStandalone) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md">
          {/* Animated Background Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />

          {/* Modal Container */}
          <motion.div
            initial={{ y: 60, scale: 0.94, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 60, scale: 0.94, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full max-w-md bg-[#FAFAF6] rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-stone-200/90 shadow-[0_25px_70px_rgba(0,0,0,0.35)] overflow-hidden text-stone-800"
          >
            {/* Top Green Accent Gradient Banner */}
            <div className="relative h-28 bg-gradient-to-br from-[#14532D] via-[#166534] to-[#0d3b1f] overflow-hidden flex items-center justify-center">
              {/* Subtle patterned circles */}
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-emerald-400/10 blur-xl" />
              <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-emerald-300/10 blur-lg" />
              
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-emerald-100 text-[11px] font-semibold tracking-wide uppercase shadow-sm">
                <Smartphone size={12} className="text-emerald-300 animate-pulse" />
                <span>Mobile App Experience</span>
              </div>
            </div>

            {/* Overlapping App Icon */}
            <div className="relative -mt-12 flex justify-center px-6">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-[1.75rem] bg-gradient-to-r from-emerald-500 to-amber-500 opacity-40 blur-md group-hover:opacity-75 transition duration-500" />
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#FAFAF6] bg-[#14532D] flex items-center justify-center">
                  <img
                    src="/icons/icon-192.png"
                    alt="Kaikaari Icon"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Official Verified Badge */}
                <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-600 text-white p-1 rounded-full border-2 border-white shadow-md">
                  <CheckCircle2 size={14} className="fill-white text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="px-6 pt-3.5 pb-7 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="font-display font-bold text-2xl sm:text-[26px] text-[#1A1A1A] tracking-tight">
                  Kaikaari
                </h2>
                <span className="text-[10px] font-extrabold tracking-wider bg-emerald-800 text-white px-2 py-0.5 rounded-md shadow-sm">
                  OFFICIAL APP
                </span>
              </div>
              <p className="text-xs font-semibold text-[#14532D] font-sans">
                உங்கள் காய்கறி கடை · Farm Fresh Daily
              </p>

              <p className="text-xs text-stone-600 mt-2 px-2 leading-relaxed">
                வேகமான ஆர்டர் மற்றும் நேரடி WhatsApp சேவைக்கு செயலியை உங்கள் போனில் உடனே நிறுவுங்கள்!
              </p>

              {/* Luxury Feature Cards Grid */}
              <div className="grid grid-cols-3 gap-2 mt-5 mb-5">
                <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#14532D] flex items-center justify-center mb-1.5">
                    <Zap size={16} className="text-amber-500 fill-amber-500" />
                  </div>
                  <span className="text-[11px] font-bold text-stone-800">1-Tap Open</span>
                  <span className="text-[9px] text-stone-500 mt-0.5">நேரடி பயன்பாடு</span>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#14532D] flex items-center justify-center mb-1.5">
                    <CheckCircle2 size={16} className="text-[#14532D]" />
                  </div>
                  <span className="text-[11px] font-bold text-stone-800">WhatsApp Alert</span>
                  <span className="text-[9px] text-stone-500 mt-0.5">உடனடி ரசீது</span>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#14532D] flex items-center justify-center mb-1.5">
                    <ShieldCheck size={16} className="text-emerald-600" />
                  </div>
                  <span className="text-[11px] font-bold text-stone-800">Zero Storage</span>
                  <span className="text-[9px] text-stone-500 mt-0.5">இலகுவானது</span>
                </div>
              </div>

              {/* iOS Instructions or Android Install Button */}
              {isIOS ? (
                <div className="bg-gradient-to-b from-emerald-50/90 to-emerald-100/40 border border-emerald-200 rounded-2xl p-4 text-left shadow-sm">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Sparkles size={15} className="text-amber-600" />
                    <p className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                      iPhone நிறுவும் முறை (Install Guide)
                    </p>
                  </div>
                  <div className="space-y-2.5 text-xs text-stone-700">
                    <div className="flex items-center gap-3 bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                      <span className="w-6 h-6 rounded-full bg-[#14532D] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        1
                      </span>
                      <span className="flex-1 flex items-center gap-1.5">
                        Safari திரையின் கீழே உள்ள <strong>Share</strong> பட்டனை அழுத்தவும்:
                        <Share size={16} className="text-blue-600 inline ml-1 shrink-0" />
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                      <span className="w-6 h-6 rounded-full bg-[#14532D] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        2
                      </span>
                      <span className="flex-1 flex items-center gap-1.5">
                        கீழே நகர்த்தி <strong>&apos;Add to Home Screen&apos;</strong> பட்டனைத் தட்டவும்:
                        <PlusSquare size={16} className="text-stone-700 inline ml-1 shrink-0" />
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-900/80 font-medium text-center mt-3">
                    ✨ முகப்பு திரையில் ஆப் சேர்ந்தவுடன் அங்கிருந்து நேரடியாகத் திறக்கலாம்!
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <button
                    onClick={handleInstallClick}
                    disabled={installing}
                    className="w-full relative group overflow-hidden bg-gradient-to-r from-[#14532D] via-[#166534] to-[#14532D] hover:from-[#114525] hover:to-[#0f3d21] text-white font-bold py-4 px-6 rounded-2xl shadow-[0_8px_25px_rgba(20,83,45,0.35)] active:scale-[0.98] flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer border border-emerald-500/30"
                  >
                    <div className="p-1.5 rounded-lg bg-white/20">
                      <Download size={18} className="text-white" />
                    </div>
                    <div className="text-left font-sans">
                      <span className="text-sm font-bold block leading-tight">
                        {installing ? 'செயலி நிறுவப்படுகிறது...' : 'Install Kaikaari App'}
                      </span>
                      <span className="text-[11px] text-emerald-200/90 font-normal block leading-tight mt-0.5">
                        உடனே இன்ஸ்டால் செய்க · 100% Free
                      </span>
                    </div>
                  </button>
                  <p className="text-[11px] text-stone-400 font-sans">
                    🔒 Play Store அவசியமில்லை · ஒரே தட்டலில் நேரடி நிறுவல்
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


