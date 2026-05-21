'use client';

import React, { useRef, useState } from 'react';
import { MessageSquare, Link2, UploadCloud, AlertCircle, FileImage, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/context/LanguageContext';

export type InputType = 'text' | 'url' | 'image';

interface InputTabsProps {
  activeTab: InputType;
  setActiveTab: (tab: InputType) => void;
  textInput: string;
  setTextInput: (val: string) => void;
  urlInput: string;
  setUrlInput: (val: string) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function InputTabs({
  activeTab,
  setActiveTab,
  textInput,
  setTextInput,
  urlInput,
  setUrlInput,
  imageFile,
  setImageFile,
  onSubmit,
  loading,
}: InputTabsProps) {
  const { t, isPidgin } = useLanguage();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Character limit
  const MAX_TEXT_LENGTH = 3000;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= MAX_TEXT_LENGTH) {
      setTextInput(val);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.target.value);
  };

  // Image upload handling
  const handleImageFile = (file: File) => {
    setError(null);
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError(
        isPidgin 
          ? 'Ejo upload normal image format like JPG, PNG, or WEBP.' 
          : 'Please upload a valid image file (JPG, PNG, or WEBP).'
      );
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(
        isPidgin 
          ? 'This file too big. E no suppose pass 5MB.' 
          : 'File is too large. Maximum size is 5MB.'
      );
      return;
    }
    
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Check if active input has valid data
  const isInputValid = () => {
    if (activeTab === 'text') return textInput.trim().length > 10; // Min 10 chars
    if (activeTab === 'url') {
      try {
        new URL(urlInput);
        return true;
      } catch (_) {
        return false;
      }
    }
    if (activeTab === 'image') return imageFile !== null;
    return false;
  };

  return (
    <form onSubmit={onSubmit} className="w-full">
      {/* Honeypot field to block bots */}
      <input type="text" name="name_honey" className="hidden" tabIndex={-1} autoComplete="off" />

      {/* Tabs list switcher */}
      <div className="flex border-b border-white/5 bg-slate-950/40 p-1.5 rounded-t-2xl gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all",
            activeTab === 'text'
              ? "bg-violet-600/15 border border-violet-500/35 text-violet-200 shadow-lg shadow-violet-500/5"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
          )}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t('tabText')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all",
            activeTab === 'url'
              ? "bg-violet-600/15 border border-violet-500/35 text-violet-200 shadow-lg shadow-violet-500/5"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
          )}
        >
          <Link2 className="w-4 h-4" />
          <span>{t('tabUrl')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('image')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all",
            activeTab === 'image'
              ? "bg-violet-600/15 border border-violet-500/35 text-violet-200 shadow-lg shadow-violet-500/5"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
          )}
        >
          <UploadCloud className="w-4 h-4" />
          <span>{t('tabImage')}</span>
        </button>
      </div>

      {/* Input content containers */}
      <div className="bg-slate-950/20 border-x border-b border-white/5 p-6 rounded-b-2xl">
        {/* Tab 1: TEXT INPUT */}
        {activeTab === 'text' && (
          <div className="space-y-2">
            <div className="relative">
              <textarea
                value={textInput}
                onChange={handleTextChange}
                placeholder={t('textPlaceholder')}
                className="w-full h-44 bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 resize-none transition-all"
              />
              <span className="absolute bottom-3 right-3 text-xs text-slate-600 font-mono">
                {textInput.length} / {MAX_TEXT_LENGTH}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {t('textMinLengthNotice')}
            </p>
          </div>
        )}

        {/* Tab 2: URL INPUT */}
        {activeTab === 'url' && (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={urlInput}
                onChange={handleUrlChange}
                placeholder={t('urlPlaceholder')}
                className="w-full bg-slate-950/40 border border-white/10 rounded-xl pl-4 pr-12 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Link2 className="w-4 h-4 text-slate-500" />
              </div>
            </div>
            <p className="text-xs text-slate-500">
              {t('urlValidationNotice')}
            </p>
          </div>
        )}

        {/* Tab 3: SCREENSHOT INPUT */}
        {activeTab === 'image' && (
          <div className="space-y-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileInputChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />

            {!imagePreview ? (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all",
                  dragActive
                    ? "border-violet-500 bg-violet-600/5"
                    : "border-white/10 hover:border-white/20 bg-slate-950/40"
                )}
              >
                <div className="p-3 rounded-full bg-slate-900 border border-white/5 text-slate-400">
                  <UploadCloud className="w-6 h-6 text-violet-400" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-semibold text-slate-200">
                    {t('imageUploadClick')}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t('imageUploadSpecs')}
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative border border-white/10 rounded-xl p-4 bg-slate-950/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={imagePreview} 
                      alt="Upload Preview" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200 truncate max-w-[200px] sm:max-w-sm">
                      {imageFile?.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {( (imageFile?.size || 0) / (1024 * 1024) ).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={clearImage}
                  className="p-1.5 rounded-lg border border-white/5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/20 border border-rose-500/10 rounded-lg p-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <p className="text-xs text-slate-500">
              {t('imageOcrNotice')}
            </p>
          </div>
        )}

        {/* CTA SUBMIT BUTTON */}
        <div className="mt-6 pt-6 border-t border-white/5 flex justify-end">
          <button
            type="submit"
            disabled={!isInputValid() || loading}
            className={cn(
              "px-6 py-3 rounded-xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all shadow-md",
              isInputValid() && !loading
                ? "bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white shadow-violet-600/20 cursor-pointer"
                : "bg-slate-900 border border-white/5 text-slate-500 cursor-not-allowed shadow-none"
            )}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-violet-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{t('analysing')}</span>
              </>
            ) : (
              <span>{t('analyseButton')}</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
