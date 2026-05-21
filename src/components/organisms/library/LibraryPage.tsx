"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Library,
  ShieldAlert,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "@/components/context/LanguageContext";
import LibraryCard, {
  LibraryPattern,
} from "@/components/molecules/LibraryCard";

export default function LibraryPage() {
  const { t } = useLanguage();
  const [patterns, setPatterns] = useState<LibraryPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadLibraryData() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/library?limit=40");
        if (!res.ok) {
          throw new Error("Failed to retrieve recent scam stats.");
        }

        const data = await res.json();
        setPatterns(data.patterns || []);
      } catch (err: any) {
        console.error("Library Fetch Error:", err);
        setError(
          err.message || "We could not fetch the scam feed. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadLibraryData();
  }, []);

  // Filter patterns in real-time based on search queries
  const filteredPatterns = patterns.filter((pat) => {
    const query = searchQuery.toLowerCase();
    const matchesTitle = pat.scam_type.toLowerCase().includes(query);
    const matchesFlags = pat.top_flags.some((flag) =>
      flag.toLowerCase().includes(query),
    );
    return matchesTitle || matchesFlags;
  });

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* 1. Page Header */}
      <section className="space-y-4 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-bold text-violet-400 tracking-wide">
          <Library className="w-3.5 h-3.5" />
          <span>{t("libBadge")}</span>
        </div>

        <h1 className="font-outfit font-black text-3xl sm:text-4xl text-white tracking-tight leading-tight">
          {t("libTitle")}
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
          {t("libTagline")}
        </p>
      </section>

      {/* 2. Interactive Search Tool */}
      <section className="relative max-w-lg">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("libSearchPlaceholder")}
          className="w-full bg-slate-950/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all shadow-md"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Search className="w-4.5 h-4.5 text-slate-500" />
        </div>
      </section>

      {/* 3. Scam Cards Catalog Grid */}
      <section>
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-6">
            {[1, 2, 4, 5].map((i) => (
              <div
                key={i}
                className="h-44 rounded-2xl bg-slate-950/20 border border-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-950/20 border border-rose-500/10 text-rose-300 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        ) : filteredPatterns.length === 0 ? (
          <div className="text-center py-16 px-6 glass-card rounded-2xl border border-white/5 space-y-3">
            <ShieldAlert className="w-8 h-8 text-slate-500 mx-auto" />
            <h4 className="font-outfit font-extrabold text-white text-base">
              {t("libNoMatchTitle")}
            </h4>
            <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
              {t("libNoMatchDetail", { query: searchQuery })}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {filteredPatterns.map((pattern, idx) => (
              <div
                key={idx}
                className="animate-fade-in-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <LibraryCard pattern={pattern} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Information Accent Banner */}
      <section className="flex items-start gap-3 p-4 rounded-xl bg-violet-600/5 border border-violet-500/10 text-slate-300">
        <Sparkles className="w-5 h-5 flex-shrink-0 text-violet-400 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm">
          <p className="font-bold text-white leading-none">
            {t("libFooterTitle")}
          </p>
          <p className="text-slate-400 leading-relaxed">
            {t("libFooterDetail")}
          </p>
        </div>
      </section>
    </div>
  );
}
