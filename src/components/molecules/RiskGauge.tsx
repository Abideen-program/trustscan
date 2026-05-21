'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface RiskGaugeProps {
  score: number;
}

export default function RiskGauge({ score }: RiskGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [offset, setOffset] = useState(314.16); // Circle circumference with r=50

  const radius = 50;
  const circumference = 2 * Math.PI * radius; // ~314.16

  useEffect(() => {
    // 1. Animate SVG path offset
    const targetOffset = circumference - (circumference * score) / 100;
    const timer = setTimeout(() => {
      setOffset(targetOffset);
    }, 100);

    // 2. Animate counter number
    let start = 0;
    const end = score;
    if (end === 0) return () => clearTimeout(timer);

    const duration = 1200; // 1.2 seconds
    const incrementTime = Math.max(Math.floor(duration / end), 15);
    
    const countTimer = setInterval(() => {
      start += 1;
      setAnimatedScore(start);
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(countTimer);
      }
    }, incrementTime);

    return () => {
      clearTimeout(timer);
      clearInterval(countTimer);
    };
  }, [score, circumference]);

  // Color selection based on rating
  const getGaugeColors = () => {
    if (score <= 30) {
      return {
        stroke: 'stroke-emerald-500',
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/20',
        label: 'Low Risk',
      };
    }
    if (score <= 65) {
      return {
        stroke: 'stroke-amber-500',
        text: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/20',
        label: 'Suspicious',
      };
    }
    return {
      stroke: 'stroke-rose-500',
      text: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
      label: 'High Risk',
    };
  };

  const colors = getGaugeColors();

  return (
    <div className="flex flex-col items-center justify-center p-6 glass-card rounded-2xl border border-white/5 space-y-4 max-w-xs mx-auto">
      <div className="relative flex items-center justify-center w-36 h-36">
        
        {/* SVG Progress Ring */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Inner Background Track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            className="stroke-slate-900 fill-none"
            strokeWidth="8"
          />
          {/* Active Animated Track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeWidth="8"
            strokeLinecap="round"
            className={cn(
              "fill-none progress-ring-circle",
              colors.stroke
            )}
          />
        </svg>

        {/* Central Text Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-outfit font-extrabold text-4xl leading-none", colors.text)}>
            {animatedScore}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">
            Risk Index
          </span>
        </div>
      </div>

      {/* Dynamic Badge Status */}
      <span className={cn(
        "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border",
        colors.bg,
        colors.text
      )}>
        {colors.label}
      </span>
    </div>
  );
}
