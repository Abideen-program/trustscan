'use client';

import React, { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';

const SCAN_PHRASES = [
  'Extracting text characters securely...',
  'Analyzing syntax and urgency signals...',
  'Checking for emotional manipulation indicators...',
  'Verifying domain structural signatures...',
  'Comparing with known threat categories...',
  'Synthesizing final risk scores...'
];

export default function LoadingOverlay() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % SCAN_PHRASES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md p-6">
      <div className="flex flex-col items-center max-w-sm w-full text-center space-y-6">
        
        {/* Pulsing Outer Ring */}
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-violet-600/10 border border-violet-500/30 animate-pulse">
          {/* Pulsing Middle Ring */}
          <div className="absolute w-18 h-18 rounded-full bg-violet-500/20 border border-violet-500/40 animate-ping duration-1000 opacity-60" />
          {/* Glowing Inner Shield */}
          <div className="relative p-4 rounded-full bg-violet-600 border border-violet-400/40 shadow-lg shadow-violet-500/30">
            <Shield className="w-8 h-8 text-white animate-bounce" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2.5">
          <h3 className="font-outfit font-bold text-xl text-white tracking-wide">
            Analyzing for Scam Patterns
          </h3>
          <div className="h-6 flex items-center justify-center">
            <p className="text-sm font-medium text-violet-400 font-mono transition-opacity duration-300 animate-pulse">
              {SCAN_PHRASES[phraseIndex]}
            </p>
          </div>
        </div>

        {/* Technical Sub-label */}
        <p className="text-xs text-slate-500 max-w-[280px]">
          Google Gemini 2.5 Flash is inspecting semantic structure. No user parameters are stored permanently.
        </p>
      </div>
    </div>
  );
}
