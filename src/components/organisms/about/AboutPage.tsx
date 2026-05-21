import React from 'react';
import { ShieldCheck, EyeOff, Cpu, Info, ShieldAlert, Sparkles, MessageSquare, ArrowRight, FileText } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* 1. Header Hero */}
      <section className="space-y-4 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-bold text-violet-400 tracking-wide">
          <Info className="w-3.5 h-3.5" />
          <span>Product Overview & Philosophy</span>
        </div>
        
        <h1 className="font-outfit font-black text-3xl sm:text-4xl text-white tracking-tight leading-tight">
          How TrustScan Works
        </h1>
        
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
          TrustScan was built to defend individuals against digital fraud by highlighting standard linguistic coercion triggers and imposter structures before any harm is done.
        </p>
      </section>

      {/* 2. Visual Step Workflow */}
      <section className="space-y-6">
        <h3 className="font-outfit font-extrabold text-xl text-white tracking-tight border-b border-white/5 pb-2">
          The Scrutiny Flow
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Step 1 */}
          <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-3 relative z-10 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-sm font-mono">
                1
              </div>
              <h4 className="font-outfit font-extrabold text-base text-white">Input Submission</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                You paste a text copy, input a suspicious hyperlink structure, or upload a WhatsApp/SMS screenshot.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-3 relative z-10 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-sm font-mono">
                2
              </div>
              <h4 className="font-outfit font-extrabold text-base text-white">AI Pattern Scrutiny</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                Google Gemini 2.5 Flash processes the linguistics: analyzing urgency, fear elements, threats, or impersonated branding attributes.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-3 relative z-10 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-sm font-mono">
                3
              </div>
              <h4 className="font-outfit font-extrabold text-base text-white">Risk Evaluation</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                You receive a localized, plain-language hazard breakdown showing exact danger triggers and specific safety checklists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Capabilities Dual Accordion (What it does vs what it doesn't) */}
      <section className="grid sm:grid-cols-2 gap-8">
        {/* Do's */}
        <div className="glass-card rounded-2xl p-6 border border-emerald-500/10 bg-emerald-950/5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5 text-emerald-400">
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            <h4 className="font-outfit font-bold text-base text-white">What TrustScan Does</h4>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed list-disc list-inside">
            <li>Identifies urgency patterns (&ldquo;Act now,&rdquo; &ldquo;Expires in 2 hours&rdquo;).</li>
            <li>Detects brand impersonation cues mimicking banks, agencies or service providers.</li>
            <li>Highlights suspicious URL subdomains and structure configurations.</li>
            <li>Translates complex phishing tricks into plain language cards.</li>
          </ul>
        </div>

        {/* Dont's */}
        <div className="glass-card rounded-2xl p-6 border border-rose-500/10 bg-rose-950/5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5 text-rose-400">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <h4 className="font-outfit font-bold text-base text-white">What TrustScan Doesn&apos;t Do</h4>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed list-disc list-inside">
            <li>Never makes definitive declarations of guilt (&ldquo;This is definitely a scammer&rdquo;).</li>
            <li>Does not access, inspect, or interact with external hyperlinks directly.</li>
            <li>Never logs or keeps record of original text inputs or image attachments.</li>
            <li>Does not guarantee 100% protection — scammers constantly adapt.</li>
          </ul>
        </div>
      </section>

      {/* 4. Privacy Policies Card */}
      <section className="glass-card rounded-2xl p-6 border border-white/5 space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-white/5 text-violet-400">
          <EyeOff className="w-5 h-5 flex-shrink-0" />
          <h3 className="font-outfit font-extrabold text-lg text-white tracking-tight">
            Our Privacy Guarantee
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 text-xs sm:text-sm leading-relaxed text-slate-400">
          <div className="space-y-3">
            <h5 className="font-bold text-slate-200">Zero Original Text Retention</h5>
            <p>
              When you paste messages or links, the payload is held in server memory long enough to run the Gemini analysis call and then instantly deleted. The database only logs structural metrics (e.g. classification group, counts, severity).
            </p>
          </div>
          <div className="space-y-3">
            <h5 className="font-bold text-slate-200">Secure Character Extract (OCR)</h5>
            <p>
              Screenshot file uploads are read dynamically. Characters are parsed locally or in-memory, converted to pure string properties, and sent over SSL. The screenshot file itself is never written to any database or storage bucket.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Core Model info & Disclaimer */}
      <section className="grid sm:grid-cols-3 gap-6 items-start">
        {/* Gemini engine card */}
        <div className="sm:col-span-1 glass-card rounded-2xl p-5 border border-white/5 flex flex-col justify-between h-full space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-violet-400">
              <Cpu className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">AI Engine</span>
            </div>
            <h5 className="font-outfit font-extrabold text-white text-sm">Gemini 2.5 Flash</h5>
            <p className="text-[11px] sm:text-xs text-slate-400 leading-normal font-sans">
              Google&apos;s advanced multimodality model, designed for blazing fast speed, precise linguistics analysis, and high-frequency structural evaluations under 3 seconds.
            </p>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="sm:col-span-2 glass-card rounded-2xl p-5 border border-amber-500/10 bg-amber-500/5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">Important Disclaimer</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            TrustScan is a decision-support system intended to heighten personal vigilance. It does not provide professional legal, financial, or cyber-forensic counsel. Scammers frequently invent new templates that bypass standard pattern recognitions. **Always confirm credentials directly with certified organizations through physical channels.**
          </p>
        </div>
      </section>
    </div>
  );
}
