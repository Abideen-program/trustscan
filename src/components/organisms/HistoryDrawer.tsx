'use client';

import React, { useEffect, useState } from 'react';
import { X, Trash2, Clock, ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/components/context/LanguageContext';
import { getHistory, deleteFromHistory, clearHistory, HistoryItem } from '@/lib/history';
import Link from 'next/link';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryDrawer({ isOpen, onClose }: HistoryDrawerProps) {
  const { t, isPidgin } = useLanguage();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  const loadHistory = () => {
    setHistoryItems(getHistory());
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
      // Lock scroll when drawer is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    // Listen to local history change events
    const handleUpdate = () => {
      loadHistory();
    };

    window.addEventListener('trustscan_history_update', handleUpdate);
    return () => {
      window.removeEventListener('trustscan_history_update', handleUpdate);
    };
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    deleteFromHistory(id);
  };

  const handleClearAll = () => {
    const confirmMessage = isPidgin 
      ? 'You sure say you wan delete all your history?' 
      : 'Are you sure you want to clear your entire scan history?';
    if (window.confirm(confirmMessage)) {
      clearHistory();
    }
  };

  // Helper to format time ago
  const formatTimeAgo = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
      
      let interval = Math.floor(seconds / 31536000);
      if (interval >= 1) return isPidgin ? 'many months ago' : `${interval} yr ago`;
      
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) return isPidgin ? `${interval} month ago` : `${interval} mo ago`;
      
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        if (interval === 1) return isPidgin ? 'Yesterday' : 'Yesterday';
        return isPidgin ? `${interval} days ago` : `${interval} days ago`;
      }
      
      interval = Math.floor(seconds / 3600);
      if (interval >= 1) return isPidgin ? `${interval} hr ago` : `${interval} hr ago`;
      
      interval = Math.floor(seconds / 60);
      if (interval >= 1) return isPidgin ? `${interval} min ago` : `${interval} min ago`;
      
      return isPidgin ? 'Na now now' : 'Just now';
    } catch (_) {
      return '';
    }
  };

  return (
    <>
      {/* Drawer Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slide-over Drawer Container */}
      <div
        className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-slate-950/95 border-l border-white/10 shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-outfit font-black text-xl text-white tracking-tight">
              {t('historyDrawerTitle')}
            </h3>
            <p className="text-xs text-slate-500 max-w-[280px]">
              {t('historyDrawerSub')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/5 bg-slate-900 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {historyItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Clock className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-500 max-w-[220px] mx-auto">
                {t('historyEmptyHistory')}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {historyItems.map((item) => {
                // Get color strips based on verdict
                const verdictColors = {
                  safe: 'bg-emerald-500 border-emerald-500/20 text-emerald-400',
                  suspicious: 'bg-amber-500 border-amber-500/20 text-amber-400',
                  high_risk: 'bg-rose-500 border-rose-500/20 text-rose-400',
                };

                const verdictLabels = {
                  safe: t('verdictLabelSafe'),
                  suspicious: t('verdictLabelSuspicious'),
                  high_risk: t('verdictLabelHighRisk'),
                };

                return (
                  <Link
                    key={item.id}
                    href={`/result/${item.id}`}
                    onClick={onClose}
                    className="block group relative p-4 bg-slate-950/40 border border-white/5 rounded-xl hover:border-white/10 hover:bg-white/5 transition-all overflow-hidden"
                  >
                    {/* Verdict Color Indicator Strip */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                      item.verdict === 'safe' ? 'bg-emerald-500' : item.verdict === 'suspicious' ? 'bg-amber-500' : 'bg-rose-500'
                    }`} />

                    <div className="pl-2 space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        {/* Score & Verdict badges */}
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black font-mono px-1.5 py-0.5 rounded border ${verdictColors[item.verdict]}`}>
                            {item.risk_score}/100
                          </span>
                          <span className="text-xs font-bold text-slate-300">
                            {verdictLabels[item.verdict]}
                          </span>
                        </div>
                        {/* Time Ago */}
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(item.scanned_at)}
                        </span>
                      </div>

                      {/* Content Preview */}
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {item.preview}
                      </p>

                      {/* Footer Info & Actions */}
                      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                        <span className="text-slate-500 uppercase tracking-widest font-bold">
                          {item.input_type} Scan
                        </span>
                        
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => handleDelete(e, item.id)}
                            className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title={t('historyDeleteLabel')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          
                          <span className="text-violet-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 font-bold">
                            <span>Open</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {historyItems.length > 0 && (
          <div className="p-6 border-t border-white/5 bg-slate-950">
            <button
              onClick={handleClearAll}
              className="w-full py-3 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-300 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t('historyClearAll')}</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
