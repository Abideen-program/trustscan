import React from 'react';
import { ShieldAlert, Calendar, Flag, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LibraryPattern {
  scam_type: string;
  count_this_week: number;
  top_flags: string[];
  last_seen: string;
}

interface LibraryCardProps {
  pattern: LibraryPattern;
}

export default function LibraryCard({ pattern }: LibraryCardProps) {
  // Format dates nicely
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (_) {
      return dateStr;
    }
  };

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-6 border border-white/5 flex flex-col justify-between h-full space-y-5">
      <div className="space-y-4">
        {/* Scam Category Title */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 mt-0.5">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-outfit font-extrabold text-base tracking-wide text-white leading-snug">
              {pattern.scam_type}
            </h4>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1 font-mono">
              <Calendar className="w-3.5 h-3.5" />
              <span>Last detected: {formatDate(pattern.last_seen)}</span>
            </div>
          </div>
        </div>

        {/* Top Associated Flags */}
        {pattern.top_flags && pattern.top_flags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <Flag className="w-3.5 h-3.5 text-slate-500" />
              <span>Top Flags</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {pattern.top_flags.slice(0, 3).map((flag, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-white/5 text-[10px] text-slate-300 font-medium"
                >
                  {flag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detections Stat Section */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-violet-400 animate-pulse" />
          <span className="text-xs text-slate-400 font-medium">Activity Frequency</span>
        </div>
        <span className="text-xs font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-lg">
          {pattern.count_this_week} scans this week
        </span>
      </div>
    </div>
  );
}
