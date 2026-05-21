import React from 'react';
import { AlertCircle, AlertOctagon, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FlagItem {
  name: string;
  explanation: string;
  severity: 'low' | 'medium' | 'high';
}

interface FlagCardProps {
  flag: FlagItem;
  index: number;
}

export default function FlagCard({ flag, index }: FlagCardProps) {
  const getSeverityBadge = () => {
    switch (flag.severity) {
      case 'low':
        return {
          bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
          border: 'border-blue-500/10 hover:border-blue-500/20',
          icon: <HelpCircle className="w-4 h-4 text-blue-400" />,
          label: 'Low Severity',
        };
      case 'medium':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
          border: 'border-amber-500/10 hover:border-amber-500/20',
          icon: <AlertCircle className="w-4 h-4 text-amber-400" />,
          label: 'Medium Severity',
        };
      case 'high':
      default:
        return {
          bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
          border: 'border-rose-500/10 hover:border-rose-500/20',
          icon: <AlertOctagon className="w-4 h-4 text-rose-400" />,
          label: 'High Severity',
        };
    }
  };

  const badge = getSeverityBadge();

  // Dynamic animation delay for staggered list loading
  const delayClass = `delay-${(index + 1) * 100}`;

  return (
    <div className={cn(
      "glass-card rounded-2xl p-5 border flex items-start gap-4 transition-all duration-300 hover:bg-slate-900/40 animate-fade-in-up",
      badge.border,
      delayClass
    )}>
      {/* Visual Icon Box */}
      <div className={cn(
        "p-2.5 rounded-xl border flex-shrink-0 bg-slate-950/40",
        badge.bg.split(' ')[1] // Extract border color
      )}>
        {badge.icon}
      </div>

      {/* Flag Details */}
      <div className="flex-1 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h5 className="font-outfit font-extrabold text-base tracking-wide text-white">
            {flag.name}
          </h5>
          <span className={cn(
            "w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
            badge.bg
          )}>
            {badge.label}
          </span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed font-sans">
          {flag.explanation}
        </p>
      </div>
    </div>
  );
}
