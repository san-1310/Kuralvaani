import React from 'react';
import { Volume2, Sparkles, Globe, History, HelpCircle, Download } from 'lucide-react';

interface HeaderProps {
  language: 'ta' | 'en';
  onToggleLanguage: () => void;
  activeEngine: 'gemini' | 'browser';
  onSelectEngine: (engine: 'gemini' | 'browser') => void;
  historyCount: number;
  onOpenHistory: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  activeEngine,
  onSelectEngine,
  historyCount,
  onOpenHistory,
  onOpenHelp,
}) => {
  const isTa = language === 'ta';

  return (
    <header className="border-b border-stone-800 bg-stone-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center">
              <span className="text-xl font-bold bg-gradient-to-tr from-amber-400 to-orange-400 bg-clip-text text-transparent">
                கு
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>குரல்வாணி</span>
                <span className="text-xs uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  KuralVaani
                </span>
              </h1>
            </div>
            <p className="text-xs text-stone-400 hidden sm:block">
              {isTa ? 'அதிநவீன தமிழ் உரை-ஒலி மாற்றி & குரல் கூடம்' : 'Advanced Tamil Neural Text-to-Speech Studio'}
            </p>
          </div>
        </div>

        {/* Engine Switcher & Top Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Dual Engine Tabs */}
          <div className="bg-stone-900/90 p-1 rounded-xl border border-stone-800 flex items-center text-xs font-medium">
            <button
              onClick={() => onSelectEngine('gemini')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeEngine === 'gemini'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-600/20 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title={isTa ? 'ஜெமினி செயற்கை நுண்ணறிவு தமிழ் குரல்' : 'Gemini AI Neural Tamil Voice'}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isTa ? 'செயற்கை நுண்ணறிவு (AI)' : 'AI Neural'}</span>
            </button>
            <button
              onClick={() => onSelectEngine('browser')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeEngine === 'browser'
                  ? 'bg-stone-800 text-amber-300 shadow font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title={isTa ? 'உடனடி உலாவி தமிழ் குரல்' : 'Instant Device Tamil Speech'}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isTa ? 'உலாவி ஒலி' : 'Device TTS'}</span>
            </button>
          </div>

          {/* History button */}
          <button
            onClick={onOpenHistory}
            className="relative p-2 sm:px-3 sm:py-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white text-xs flex items-center gap-1.5 transition"
            title={isTa ? 'முந்தைய ஒலிகள்' : 'Speech History'}
          >
            <History className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">{isTa ? 'வரலாறு' : 'History'}</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                {historyCount}
              </span>
            )}
          </button>

          {/* Help Tips Button */}
          <button
            onClick={onOpenHelp}
            className="p-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200 transition"
            title={isTa ? 'வழிகாட்டி' : 'Help & Guide'}
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Download Source Code Button */}
          <a
            href="/api/download-project"
            download="kuralvaani-tamil-tts.zip"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            title={isTa ? 'திட்ட மூலக் குறியீட்டைப் பதிவிறக்கவும் (.zip)' : 'Download Project Source Code (.ZIP)'}
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline">{isTa ? 'குறியீடு (.ZIP)' : 'Download Code'}</span>
          </a>

          {/* Language Toggle */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition"
            title="Switch Language / மொழியை மாற்றவும்"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isTa ? 'EN' : 'தமிழ்'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
