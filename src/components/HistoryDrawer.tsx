import React from 'react';
import { HistoryItem } from '../types';
import { X, Play, Download, Trash2, Clock, Volume2, Sparkles } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onPlayItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
  language: 'ta' | 'en';
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onPlayItem,
  onClearHistory,
  onDeleteItem,
  language,
}) => {
  if (!isOpen) return null;

  const isTa = language === 'ta';

  const formatTimestamp = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + d.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-stone-900 border-l border-stone-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                {isTa ? 'ஒலி வரலாற்றுப் பதிவு' : 'Speech History'}
              </h3>
              <p className="text-xs text-stone-400">
                {items.length} {isTa ? 'ஒலிக்கோப்புகள் சேமிக்கப்பட்டுள்ளன' : 'audio clips saved'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-red-400 transition"
                title={isTa ? 'அனைத்தையும் அழிக்க' : 'Clear all'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <Volume2 className="w-10 h-10 text-stone-600 mb-2" />
              <p className="text-sm font-medium">
                {isTa ? 'வரலாற்றில் ஒலிக்கோப்புகள் ஏதுமில்லை' : 'No speech history yet'}
              </p>
              <p className="text-xs text-stone-500 mt-1">
                {isTa
                  ? 'நீங்கள் உருவாக்கும் தமிழ் ஒலிகள் தானாகவே இங்கு பதிவாகும்.'
                  : 'Generated Tamil audio clips will be recorded here.'}
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-stone-950/80 border border-stone-800 hover:border-stone-700 rounded-xl p-3.5 space-y-2 transition group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {item.voiceTamilName} ({item.voiceName})
                    </span>
                    <span className="text-[10px] text-stone-400 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      {item.engine === 'gemini' ? 'AI' : 'Browser'}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {formatTimestamp(item.timestamp)}
                  </span>
                </div>

                <p className="text-xs text-stone-200 line-clamp-2 leading-relaxed">
                  {item.text}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-stone-800/80">
                  <button
                    onClick={() => onPlayItem(item)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold transition active:scale-95"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isTa ? 'கேள்' : 'Play'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {item.audioUrl && (
                      <a
                        href={item.audioUrl}
                        download={`kuralvaani-${item.voiceName}-${item.timestamp}.wav`}
                        className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-amber-300 transition"
                        title="Download WAV"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-red-400 transition"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
