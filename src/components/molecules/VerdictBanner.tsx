import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerdictBannerProps {
  verdict: 'safe' | 'suspicious' | 'high_risk';
}

export default function VerdictBanner({ verdict }: VerdictBannerProps) {
  const getVerdictSpecs = () => {
    switch (verdict) {
      case 'safe':
        return {
          bg: 'from-emerald-950/40 to-emerald-900/10 border-emerald-500/20 text-emerald-400',
          icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
          title: 'No scam patterns found',
          desc: 'This message does not match any known scam templates. Always use personal judgment before responding.',
        };
      case 'suspicious':
        return {
          bg: 'from-amber-950/40 to-amber-900/10 border-amber-500/20 text-amber-400',
          icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
          title: 'Suspicious — Proceed with caution',
          desc: 'We detected moderate risk patterns commonly associated with spam or early-stage phishing campaigns.',
        };
      case 'high_risk':
      default:
        return {
          bg: 'from-rose-950/40 to-rose-900/10 border-rose-500/20 text-rose-400',
          icon: <ShieldAlert className="w-6 h-6 text-rose-400" />,
          title: 'High Risk — Likely scam pattern',
          desc: 'Contains strong, high-severity scam patterns (e.g. pressure language, threat constructs, or brand impersonation).',
        };
    }
  };

  const specs = getVerdictSpecs();

  return (
    <div className={cn(
      "w-full border rounded-2xl p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-gradient-to-r shadow-lg",
      specs.bg
    )}>
      {/* Icon frame */}
      <div className="p-3 rounded-xl bg-slate-950/50 border border-white/5 flex-shrink-0">
        {specs.icon}
      </div>

      {/* Description text */}
      <div className="flex-1 text-center sm:text-left space-y-1">
        <h4 className="font-outfit font-extrabold text-lg tracking-wide text-white">
          {specs.title}
        </h4>
        <p className="text-sm text-slate-300 leading-relaxed font-sans">
          {specs.desc}
        </p>
      </div>
    </div>
  );
}
