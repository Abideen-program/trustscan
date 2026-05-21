'use client';

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Get the full active URL dynamically
      const shareUrl = window.location.href;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className={cn(
          "w-full sm:w-auto px-5 py-3 rounded-xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2 border transition-all active:scale-[0.98]",
          copied
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            : "bg-slate-900 border-white/5 text-slate-300 hover:text-white hover:bg-slate-800"
        )}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span>Link Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4 text-slate-400" />
            <span>Share This Report</span>
          </>
        )}
      </button>

      {/* Floating mini toast confirmation */}
      <div className={cn(
        "absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs shadow-md transition-all duration-300 pointer-events-none whitespace-nowrap",
        copied ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}>
        Copied to clipboard!
      </div>
    </div>
  );
}
