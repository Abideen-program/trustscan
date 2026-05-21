'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Info, Library, Shield, ShieldAlert, Clock } from 'lucide-react';
import { useLanguage } from '@/components/context/LanguageContext';
import { getHistory } from '@/lib/history';
import HistoryDrawer from '@/components/organisms/HistoryDrawer';

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const [historyCount, setHistoryCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const updateCount = () => {
    const history = getHistory();
    setHistoryCount(history.length);
  };

  useEffect(() => {
    updateCount();

    // Listen to history updates
    const handleUpdate = () => {
      updateCount();
    };

    window.addEventListener('trustscan_history_update', handleUpdate);
    return () => {
      window.removeEventListener('trustscan_history_update', handleUpdate);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="p-2 rounded-xl bg-violet-600/10 border border-violet-500/20 group-hover:border-violet-500/40 transition-colors">
              <Shield className="w-5 h-5 text-violet-400" />
            </div>
            <span className="font-outfit font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-violet-300 bg-clip-text text-transparent">
              {t('appTitle')}
            </span>
          </Link>
          
          {/* Right Navigation & Tools */}
          <div className="flex items-center gap-1 sm:gap-3 flex-1 justify-end">
            
            {/* Language Toggle Controller */}
            <div className="flex items-center bg-slate-950/60 p-1 rounded-xl border border-white/5 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  language === 'en'
                    ? 'bg-violet-600 text-white shadow shadow-violet-500/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🇬🇧 English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('pidgin')}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  language === 'pidgin'
                    ? 'bg-violet-600 text-white shadow shadow-violet-500/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🇳🇬 Pidgin
              </button>
            </div>

            {/* Navbar Page Links */}
            <nav className="flex items-center gap-1 sm:gap-2">
              <Link 
                href="/" 
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                <ShieldAlert className="w-4 h-4 text-slate-400" />
                <span className="hidden md:inline">{t('navHome')}</span>
              </Link>
              
              <Link 
                href="/library" 
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                <Library className="w-4 h-4 text-slate-400" />
                <span className="hidden md:inline">{t('navLibrary')}</span>
              </Link>
              
              <Link 
                href="/about" 
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                <Info className="w-4 h-4 text-slate-400" />
                <span className="hidden md:inline">{t('navAbout')}</span>
              </Link>

              {/* History Toggle Trigger */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 transition-all bg-white/5 md:bg-transparent"
              >
                <Clock className="w-4 h-4 text-violet-400" />
                <span className="hidden sm:inline">{t('historyButton')}</span>
                {historyCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-violet-600 text-white font-mono text-[9px] font-black animate-pulse">
                    {historyCount}
                  </span>
                )}
              </button>
            </nav>

          </div>
        </div>
      </header>

      {/* History Slide-over Drawer Portal */}
      <HistoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};

export default Navbar;