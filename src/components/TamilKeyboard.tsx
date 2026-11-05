import React, { useState } from 'react';
import { Keyboard, X, Delete, CornerDownLeft, Sparkles } from 'lucide-react';

interface TamilKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertChar: (char: string) => void;
  onBackspace: () => void;
  language: 'ta' | 'en';
}

export const TamilKeyboard: React.FC<TamilKeyboardProps> = ({
  isOpen,
  onClose,
  onInsertChar,
  onBackspace,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'vowels' | 'consonants' | 'signs' | 'grantha' | 'common'>('consonants');

  if (!isOpen) return null;

  const isTa = language === 'ta';

  const vowels = ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ', 'ஃ'];
  const consonants = [
    'க்', 'ங்', 'ச்', 'ஞ்', 'ட்', 'ண்',
    'த்', 'ந்', 'ப்', 'ம்', 'ய்', 'ர்',
    'ல்', 'வ்', 'ழ்', 'ள்', 'ற்', 'ன்',
  ];
  const vowelSigns = ['ா', 'ி', 'ீ', 'ு', 'ூ', 'ெ', 'ே', 'ை', 'ொ', 'ோ', 'ௌ', '்'];
  const grantha = ['ஜ்', 'ஷ்', 'ஸ்', 'ஹ்', 'க்ஷ்', 'ஸ்ரீ', 'ஓம்'];
  const commonWords = [
    'வணக்கம்', 'நன்றி', 'வாழ்த்துகள்', 'மகிழ்ச்சி',
    'தமிழ்', 'அன்பு', 'அறிவு', 'வெற்றி', 'அமைதி',
    'ஆமாம்', 'இல்லை', 'நண்பா', 'வணக்கம்!', 'வணக்கம்.'
  ];

  return (
    <div className="bg-stone-900 border border-amber-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-stone-200">
            {isTa ? 'தமிழ் விசைப்பலகை (Tamil Keypad)' : 'Tamil Virtual Keyboard'}
          </h3>
          <span className="text-[11px] text-stone-400">
            {isTa ? 'எழுத்துகளை எளிதில் உள்ளிட' : 'Click to insert letters'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 py-3 border-b border-stone-800/80">
        {[
          { id: 'consonants', label: isTa ? 'மெய் (க்..ன்)' : 'Consonants (க்..ன்)' },
          { id: 'vowels', label: isTa ? 'உயிர் (அ..ஔ)' : 'Vowels (அ..ஔ)' },
          { id: 'signs', label: isTa ? 'குறிகள் (ா..ௌ)' : 'Vowel Signs (ா..ௌ)' },
          { id: 'grantha', label: isTa ? 'வடமொழி' : 'Grantha' },
          { id: 'common', label: isTa ? 'பொதுவான சொற்கள்' : 'Quick Words' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              activeTab === tab.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-stone-800/60 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Key grid */}
      <div className="pt-3">
        {activeTab === 'vowels' && (
          <div className="grid grid-cols-7 sm:grid-cols-13 gap-1.5">
            {vowels.map((char) => (
              <button
                key={char}
                onClick={() => onInsertChar(char)}
                className="h-10 rounded-xl bg-stone-800/90 hover:bg-amber-600 hover:text-white border border-stone-700/80 text-stone-100 font-bold text-base flex items-center justify-center transition active:scale-95 shadow-sm"
              >
                {char}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'consonants' && (
          <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5">
            {consonants.map((char) => (
              <button
                key={char}
                onClick={() => onInsertChar(char)}
                className="h-10 rounded-xl bg-stone-800/90 hover:bg-amber-600 hover:text-white border border-stone-700/80 text-stone-100 font-bold text-base flex items-center justify-center transition active:scale-95 shadow-sm"
              >
                {char}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'signs' && (
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
            {vowelSigns.map((char) => (
              <button
                key={char}
                onClick={() => onInsertChar(char)}
                className="h-10 rounded-xl bg-stone-800/90 hover:bg-amber-600 hover:text-white border border-stone-700/80 text-stone-100 font-bold text-lg flex items-center justify-center transition active:scale-95 shadow-sm"
              >
                {char}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'grantha' && (
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
            {grantha.map((char) => (
              <button
                key={char}
                onClick={() => onInsertChar(char)}
                className="h-10 rounded-xl bg-stone-800/90 hover:bg-amber-600 hover:text-white border border-stone-700/80 text-stone-100 font-bold text-base flex items-center justify-center transition active:scale-95 shadow-sm"
              >
                {char}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'common' && (
          <div className="flex flex-wrap gap-2">
            {commonWords.map((word) => (
              <button
                key={word}
                onClick={() => onInsertChar(word + ' ')}
                className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-amber-600 hover:text-white border border-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                {word}
              </button>
            ))}
          </div>
        )}

        {/* Keyboard bottom action bar: Space, comma, full-stop, Backspace */}
        <div className="mt-3 pt-3 border-t border-stone-800 flex items-center gap-2">
          <button
            onClick={() => onInsertChar(' , ')}
            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono font-bold"
            title="Comma (Pause)"
          >
            , (இடைநிறுத்தம்)
          </button>
          <button
            onClick={() => onInsertChar('. ')}
            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono font-bold"
            title="Full Stop"
          >
            . (முற்றுப்புள்ளி)
          </button>
          <button
            onClick={() => onInsertChar(' ')}
            className="flex-1 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium text-center"
          >
            Space (இடைவெளி)
          </button>
          <button
            onClick={onBackspace}
            className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 text-xs font-medium flex items-center gap-1"
          >
            <Delete className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">நீக்கு</span>
          </button>
        </div>
      </div>
    </div>
  );
};
