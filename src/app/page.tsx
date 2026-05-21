"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Flame,
  BookOpen,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/context/LanguageContext";
import InputTabs, { InputType } from "@/components/molecules/InputTabs";
import LoadingOverlay from "@/components/molecules/LoadingOverlay";
import LibraryCard, {
  LibraryPattern,
} from "@/components/molecules/LibraryCard";

export default function Home() {
  const router = useRouter();
  const { language, t } = useLanguage();

  // Input states
  const [activeTab, setActiveTab] = useState<InputType>("text");
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Library stats state
  const [recentPatterns, setRecentPatterns] = useState<LibraryPattern[]>([]);
  const [loadingPatterns, setLoadingPatterns] = useState(true);

  // Fetch recent scam pattern aggregates below the fold
  useEffect(() => {
    async function loadRecentPatterns() {
      try {
        const res = await fetch("/api/library?limit=3");
        if (res.ok) {
          const data = await res.json();
          setRecentPatterns(data.patterns || []);
        }
      } catch (err) {
        console.error("Failed to load library stats:", err);
      } finally {
        setLoadingPatterns(false);
      }
    }
    loadRecentPatterns();
  }, []);

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let content = "";
      let mimeType = "";

      if (activeTab === "text") {
        content = textInput;
      } else if (activeTab === "url") {
        content = urlInput;
      } else if (activeTab === "image" && imageFile) {
        // Convert file to base64
        content = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(imageFile);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
        mimeType = imageFile.type;
      }

      // Call API Endpoint - Pass active language preference to Gemini
      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: activeTab,
          content,
          mimeType,
          language,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to analyze content. Please try again.",
        );
      }

      // Redirect to result page
      router.push(`/result/${data.id}`);
    } catch (err: any) {
      console.error("Scan Error:", err);
      setError(
        err.message ||
          "Something went wrong. Please check your connection and try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* 1. HERO SECTION */}
      <section className="text-center max-w-2xl mx-auto space-y-5 pt-4">
        {/* Humble AI Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-bold text-violet-400 tracking-wide">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t("badgeText")}</span>
        </div>

        <h1 className="font-outfit font-black text-4xl sm:text-5xl tracking-tight leading-[1.1] text-white">
          {t("appTagline").split("?")[0]}?{" "}
          <span className="bg-gradient-to-r from-violet-400 via-indigo-200 to-purple-400 bg-clip-text text-transparent block sm:inline">
            {t("appTagline").split("?")[1] || "Let AI take a look."}
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl mx-auto">
          {t("appSubtagline")}
        </p>
      </section>

      {/* 2. DYNAMIC INPUT CARDS DASHBOARD */}
      <section className="max-w-3xl mx-auto glass-card rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />

        <InputTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          textInput={textInput}
          setTextInput={setTextInput}
          urlInput={urlInput}
          setUrlInput={setUrlInput}
          imageFile={imageFile}
          setImageFile={setImageFile}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </section>

      {/* Inline Error Messages */}
      {error && (
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3 p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 text-rose-300 text-sm animate-fade-in-up">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
          <button
            onClick={handleSubmit}
            className="text-xs font-bold underline hover:text-white transition-colors flex-shrink-0"
          >
            Retry Scan
          </button>
        </div>
      )}

      {/* 3. RECENT DETECTED PATTERNS BELOW THE FOLD */}
      <section className="space-y-6 pt-6">
        <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="space-y-1">
            <h2 className="font-outfit font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-violet-400" />
              <span>{t("libTitle")}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {t("historyEmptyState").split(". Ready")[0]}
            </p>
          </div>
          <Link
            href="/library"
            className="flex items-center gap-1 text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors shrink-0"
          >
            <span>{t("shareButton").replace("Share this result", "View Full Feed").replace("Share This Result", "View Full Feed")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingPatterns ? (
          <div className="grid sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-44 rounded-2xl bg-slate-950/20 border border-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : recentPatterns.length === 0 ? (
          <div className="text-center p-8 rounded-2xl bg-slate-950/20 border border-white/5">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500">
              {t("historyEmptyState")}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-6">
            {recentPatterns.map((pattern, idx) => (
              <div
                key={idx}
                className="animate-fade-in-up"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <LibraryCard pattern={pattern} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Full-screen processing portal overlay */}
      {loading && <LoadingOverlay />}
    </div>
  );
}
