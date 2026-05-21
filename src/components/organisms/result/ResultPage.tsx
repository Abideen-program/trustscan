'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, ShieldAlert, BookOpen, Sparkles, Languages, HelpCircle } from 'lucide-react';
import VerdictBanner from '@/components/molecules/VerdictBanner';
import RiskGauge from '@/components/molecules/RiskGauge';
import FlagCard, { FlagItem } from '@/components/molecules/FlagCard';
import WhatToDoBox from '@/components/molecules/WhatToDoBox';
import ShareButton from '@/components/molecules/ShareButton';
import { useLanguage } from '@/components/context/LanguageContext';
import { saveToHistory } from '@/lib/history';

interface ScanResultData {
  id: string;
  risk_score: number;
  verdict: 'safe' | 'suspicious' | 'high_risk';
  summary: string;
  scam_type: string;
  flags: FlagItem[];
  what_to_do: string[];
  created_at: string;
  language?: 'en' | 'pidgin';
  input_type?: 'text' | 'url' | 'image';
}

interface Eli5ResultData {
  simple_verdict: string;
  simple_flags: {
    name: string;
    simple_explanation: string;
  }[];
  simple_actions: string[];
}

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { language: userLanguage, t, isPidgin } = useLanguage();

  const [result, setResult] = useState<ScanResultData | null>(null);
  const [displayedLanguage, setDisplayedLanguage] = useState<'en' | 'pidgin'>('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ELI5 state variables
  const [showEli5, setShowEli5] = useState(false);
  const [eli5Result, setEli5Result] = useState<Eli5ResultData | null>(null);
  const [eli5Loading, setEli5Loading] = useState(false);
  const [eli5Error, setEli5Error] = useState<string | null>(null);

  // Translation on-the-fly state
  const [translationLoading, setTranslationLoading] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchResult() {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(`/api/result/${id}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to retrieve scan result details.');
        }
        
        const data: ScanResultData = await res.json();
        setResult(data);
        
        const savedLang = data.language || 'en';
        setDisplayedLanguage(savedLang);

        // Save to browser search history
        saveToHistory({
          id: data.id,
          risk_score: data.risk_score,
          verdict: data.verdict,
          summary: data.summary,
          input_type: data.input_type || 'text',
          preview: data.scam_type 
            ? `${data.scam_type}: ${data.summary.substring(0, 35)}...`
            : `${data.summary.substring(0, 50)}...`,
        });
      } catch (err: any) {
        console.error('Fetch Result Error:', err);
        setError(err.message || 'We could not fetch this scan result. It may have expired or been deleted.');
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [id]);

  // ELI5 triggers
  const handleEli5Toggle = async () => {
    if (showEli5) {
      setShowEli5(false);
      return;
    }

    if (eli5Result) {
      setShowEli5(true);
      return;
    }

    if (!result) return;

    try {
      setEli5Loading(true);
      setEli5Error(null);

      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          result_id: result.id,
          risk_score: result.risk_score,
          verdict: result.verdict,
          summary: result.summary,
          flags: result.flags,
        }),
      });

      if (!res.ok) {
        throw new Error('AI simplifying failed.');
      }

      const data = await res.json();
      setEli5Result(data);
      setShowEli5(true);
    } catch (err) {
      console.error('ELI5 Error:', err);
      setEli5Error(isPidgin ? 'E fail to make am simple. Try again.' : 'Could not simplify right now. Try again.');
    } finally {
      setEli5Loading(false);
    }
  };

  // On-the-fly Translation Trigger
  const handleTranslateToggle = async () => {
    if (!result) return;

    const targetLang: 'en' | 'pidgin' = displayedLanguage === 'en' ? 'pidgin' : 'en';

    try {
      setTranslationLoading(true);
      setTranslationError(null);

      const res = await fetch('/api/translate-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          risk_score: result.risk_score,
          verdict: result.verdict,
          summary: result.summary,
          flags: result.flags,
          what_to_do: result.what_to_do,
          target_language: targetLang,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to translate results.');
      }

      const data = await res.json();
      
      // Update result state with translated text fields
      setResult({
        ...result,
        summary: data.summary,
        flags: data.flags,
        what_to_do: data.what_to_do,
      });
      setDisplayedLanguage(targetLang);
      
      // Reset ELI5 cache since language changed
      setEli5Result(null);
      if (showEli5) {
        setShowEli5(false);
      }
    } catch (err) {
      console.error('Translation error:', err);
      setTranslationError(isPidgin ? 'Translation fail. Try again.' : 'Translation failed. Try again.');
    } finally {
      setTranslationLoading(false);
    }
  };

  // Loading skeleton screen
  if (loading) {
    return (
      <div className="space-y-8 animate-pulse max-w-3xl mx-auto">
        <div className="h-6 w-32 bg-slate-900 rounded-lg border border-white/5" />
        <div className="h-28 w-full bg-slate-900 rounded-2xl border border-white/5" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 h-56 bg-slate-900 rounded-2xl border border-white/5" />
          <div className="md:col-span-2 space-y-4">
            <div className="h-6 w-3/4 bg-slate-900 rounded-lg border border-white/5" />
            <div className="h-12 w-full bg-slate-900 rounded-xl border border-white/5" />
            <div className="h-12 w-full bg-slate-900 rounded-xl border border-white/5" />
          </div>
        </div>
      </div>
    );
  }

  // Error boundary page
  if (error || !result) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-6 glass-card rounded-3xl border border-white/5 space-y-6">
        <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 w-16 h-16 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="font-outfit font-black text-xl text-white">{t('reportNotFound')}</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            {error || t('reportNotFoundDetail')}
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-3">
          <Link
            href="/"
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all"
          >
            {t('goBackHome')}
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 rounded-xl border border-white/5 bg-slate-950 text-slate-400 hover:text-white font-medium text-sm transition-all"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Determine if there is a mismatch between active user language and displayed result language
  const showLanguageTranslationBanner = userLanguage !== displayedLanguage;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* 1. BACK BUTTON ACCENT */}
      <div className="flex items-center justify-between gap-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('scanAnother')}</span>
        </Link>
        <span className="text-[10px] font-mono text-slate-500">
          ID: {result.id}
        </span>
      </div>

      {/* Language mismatch alert block */}
      {showLanguageTranslationBanner && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-violet-950/20 border border-violet-500/20 text-slate-300 text-sm animate-fade-in-up">
          <div className="flex items-center gap-2.5">
            <Languages className="w-5 h-5 flex-shrink-0 text-violet-400" />
            <p className="text-xs sm:text-sm">
              {displayedLanguage === 'en' 
                ? 'This report is currently in English. Translate it to Nigerian Pidgin!' 
                : 'This report is currently in Nigerian Pidgin. Translate it to English!'}
            </p>
          </div>
          <button
            onClick={handleTranslateToggle}
            disabled={translationLoading}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-slate-900 text-white text-xs font-bold transition-all flex items-center gap-2"
          >
            {translationLoading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-violet-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{t('translating')}</span>
              </>
            ) : displayedLanguage === 'en' ? (
              <span>{t('translateToPidginButton')}</span>
            ) : (
              <span>{t('translateToEnglishButton')}</span>
            )}
          </button>
        </div>
      )}

      {/* 2. VERDICT BANNER CARD */}
      <VerdictBanner verdict={result.verdict} />

      {/* 3. REPORT DUAL GRID COLUMNS */}
      <div className="grid md:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Risk Score & Action buttons */}
        <div className="md:col-span-1 space-y-6">
          <RiskGauge score={result.risk_score} />
          
          {/* Dashboard Tools */}
          <div className="flex flex-col gap-3">
            <ShareButton />
            <Link
              href="/"
              className="w-full py-3 rounded-xl border border-white/5 bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold text-sm text-center flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <RefreshCw className="w-4 h-4 text-slate-400" />
              <span>{t('scanAnother')}</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Key Details, Flags list & guidance boxes */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Option Toggle: ELI5 Button */}
          <div className="flex justify-between items-center gap-4">
            <h3 className="font-outfit font-black text-xl text-white tracking-tight">
              {showEli5 
                ? (isPidgin ? 'Simplified Report 🧒' : 'Simplified Report 🧒')
                : t('aiSummaryTitle')
              }
            </h3>

            <button
              onClick={handleEli5Toggle}
              disabled={eli5Loading}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-white/5 bg-slate-950/60 hover:bg-slate-900/60 text-violet-300 hover:text-violet-200"
            >
              {eli5Loading ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-violet-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{t('eli5ButtonLoading')}</span>
                </>
              ) : showEli5 ? (
                <span>{t('eli5ButtonBack')}</span>
              ) : (
                <>
                  <HelpCircle className="w-3.5 h-3.5 text-violet-400" />
                  <span>{t('eli5Button')}</span>
                </>
              )}
            </button>
          </div>

          {/* ELI5 Error alert inline */}
          {eli5Error && (
            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/10 text-rose-300 text-xs">
              {eli5Error}
            </div>
          )}

          {/* DYNAMIC SHIFT: Render ELI5 Mode or Standard Technical Mode */}
          {showEli5 && eli5Result ? (
            /* ELI5 PANEL */
            <div className="space-y-6 animate-fade-in-up">
              {/* Large friendly verdict sentence */}
              <div className="p-5 rounded-2xl bg-violet-600/5 border border-violet-500/10 space-y-2">
                <p className="text-white font-extrabold text-lg leading-relaxed">
                  {eli5Result.simple_verdict}
                </p>
              </div>

              {/* Simplified flags list */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  {isPidgin ? 'Why dis message get issue' : 'Why this is concerning'}
                </h4>
                <div className="grid gap-3">
                  {eli5Result.simple_flags.map((flag, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/40 border border-white/5 rounded-xl flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-violet-500 mt-2 shrink-0 animate-pulse" />
                      <div className="space-y-1">
                        <p className="font-bold text-sm text-slate-200">{flag.name}</p>
                        <p className="text-xs text-slate-400 leading-relaxed">{flag.simple_explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simple action steps */}
              <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>{t('whatToDoTitle')}</span>
                </h4>
                <ul className="space-y-2.5">
                  {eli5Result.simple_actions.map((act, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-slate-100 text-sm leading-relaxed">
                      <span className="text-amber-500 font-extrabold shrink-0 mt-0.5">•</span>
                      <span className="font-bold">{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            /* TECHNICAL REPORT PANEL */
            <div className="space-y-8 animate-fade-in-up">
              {/* Summary Sentence Box */}
              <div className="p-5 rounded-2xl bg-slate-950/30 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400">
                  <BookOpen className="w-4 h-4" />
                  <span>{t('aiSummaryTitle')}</span>
                </div>
                <p className="text-slate-100 font-medium leading-relaxed font-sans text-base">
                  {result.summary}
                </p>
              </div>

              {/* Red flags list section */}
              <div className="space-y-4">
                <h3 className="font-outfit font-black text-xl text-white tracking-tight border-b border-white/5 pb-2">
                  {t('flagsTitle')} ({result.flags.length})
                </h3>
                
                {result.flags.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-emerald-500/10 bg-emerald-500/5 rounded-2xl">
                    <p className="text-sm font-semibold text-emerald-400">
                      {t('noFlagsMessage')}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {t('noFlagsDetail')}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {result.flags.map((flag, idx) => (
                      <FlagCard key={idx} flag={flag} index={idx} />
                    ))}
                  </div>
                )}
              </div>

              {/* Structured guidance list box */}
              <WhatToDoBox actions={result.what_to_do} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
