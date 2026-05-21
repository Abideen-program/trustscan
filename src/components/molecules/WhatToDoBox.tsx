import React from 'react';
import { EyeOff, AlertTriangle } from 'lucide-react';

interface WhatToDoBoxProps {
  actions: string[];
}

export default function WhatToDoBox({ actions }: WhatToDoBoxProps) {
  // If no action items were returned or empty, use a standard robust default list
  const displayActions = actions && actions.length > 0 ? actions : [
    'Do not click on any links or download files included in the message.',
    'Do not share passwords, PIN codes, OTPs, or personal identity numbers (like BVN/NIN/SSN).',
    'Report this incident to your local cybercrime authority or bank immediate support channel.'
  ];

  return (
    <div className="w-full glass-card rounded-2xl p-6 border border-white/5 space-y-5 bg-gradient-to-br from-slate-900/40 via-slate-950/20 to-slate-900/20">
      
      {/* Header section */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-white/5">
        <div className="p-1.5 rounded-lg bg-violet-600/10 border border-violet-500/20 text-violet-400">
          <EyeOff className="w-4 h-4" />
        </div>
        <h4 className="font-outfit font-extrabold text-base tracking-wide text-white">
          Recommended Next Steps
        </h4>
      </div>

      {/* Grid checklist list */}
      <div className="grid gap-4">
        {displayActions.map((action, idx) => (
          <div key={idx} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
            {/* Circle Node Counter */}
            <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center bg-violet-600/10 border border-violet-500/30 text-xs font-bold text-violet-400 font-mono">
              {idx + 1}
            </div>
            
            {/* Recommendation details */}
            <p className="text-sm text-slate-300 font-medium leading-relaxed font-sans pt-0.5">
              {action}
            </p>
          </div>
        ))}
      </div>

      {/* Humble warning banner */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-400/90 text-xs mt-2">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>
          TrustScan identifies patterns, not absolute truths. Always cross-check credentials manually before deciding.
        </span>
      </div>
    </div>
  );
}
