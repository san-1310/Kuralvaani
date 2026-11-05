import React from 'react';
import { VoiceOption, VoiceStylePreset } from '../types';
import {
  Sparkles,
  Volume2,
  Check,
  User,
  Radio,
  BookOpen,
  Feather,
  MessageSquare,
  Mic,
  Sliders,
} from 'lucide-react';

interface VoiceSelectorProps {
  voices: VoiceOption[];
  selectedVoiceId: string;
  onSelectVoice: (voiceId: string) => void;
  voiceStyles: VoiceStylePreset[];
  selectedStyleId: string;
  onSelectStyle: (styleId: string) => void;
  language: 'ta' | 'en';
  onPreviewVoiceSample?: (voice: VoiceOption) => void;
  previewingVoiceId?: string | null;
  // Browser voices if available
  browserVoices?: SpeechSynthesisVoice[];
  selectedBrowserVoiceUri?: string;
  onSelectBrowserVoice?: (uri: string) => void;
  engine: 'gemini' | 'browser';
  browserGender: 'female' | 'male';
  onSelectBrowserGender: (gender: 'female' | 'male') => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  voices,
  selectedVoiceId,
  onSelectVoice,
  voiceStyles,
  selectedStyleId,
  onSelectStyle,
  language,
  onPreviewVoiceSample,
  previewingVoiceId,
  browserVoices = [],
  selectedBrowserVoiceUri,
  onSelectBrowserVoice,
  engine,
  browserGender,
  onSelectBrowserGender,
}) => {
  const isTa = language === 'ta';

  const femaleVoices = voices.filter((v) => v.gender === 'female');
  const maleVoices = voices.filter((v) => v.gender === 'male');

  const getStyleIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquare':
        return <MessageSquare className="w-3.5 h-3.5" />;
      case 'Radio':
        return <Radio className="w-3.5 h-3.5" />;
      case 'BookOpen':
        return <BookOpen className="w-3.5 h-3.5" />;
      case 'Feather':
        return <Feather className="w-3.5 h-3.5" />;
      case 'Mic':
      default:
        return <Mic className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Voice Picker */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              <span>{isTa ? 'தமிழ் குரலைத் தேர்ந்தெடுக்கவும்' : 'Select Tamil Voice'}</span>
            </h3>
            <p className="text-xs text-stone-400">
              {isTa
                ? 'ஆண் மற்றும் பெண் குரல்களில் உங்கள் விருப்பத்தைத் தேர்வு செய்யவும்'
                : 'Choose from distinct male & female Tamil voice personas'}
            </p>
          </div>

          {/* Quick Gender Filter Counters */}
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-pink-500/10 text-pink-300 border border-pink-500/30 flex items-center gap-1.5 font-medium">
              <span>👩</span>
              <span>{isTa ? 'பெண் குரல் (2)' : 'Female (2)'}</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/30 flex items-center gap-1.5 font-medium">
              <span>👨</span>
              <span>{isTa ? 'ஆண் குரல் (3)' : 'Male (3)'}</span>
            </span>
          </div>
        </div>

        {engine === 'gemini' ? (
          <div className="mt-4 space-y-4">
            {/* Female Voices Group */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-pink-300 tracking-wider uppercase">
                <span>👩</span>
                <span>{isTa ? 'பெண் குரல்கள் (Female Voices)' : 'Female Voices'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {femaleVoices.map((voice) => {
                  const isSelected = selectedVoiceId === voice.id;
                  const isPreviewing = previewingVoiceId === voice.id;

                  return (
                    <div
                      key={voice.id}
                      onClick={() => onSelectVoice(voice.id)}
                      className={`relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-900 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/50'
                          : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${voice.avatarColor} p-0.5 flex items-center justify-center shadow`}
                          >
                            <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center font-bold text-white text-base">
                              {voice.tamilName[0]}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-white">
                                {voice.tamilName}
                              </span>
                              <span className="text-xs text-stone-400 font-mono">
                                ({voice.name})
                              </span>
                            </div>
                            <span className="inline-block text-[11px] font-medium text-pink-400">
                              {isTa ? 'பெண் குரல்' : 'Female Voice'}
                            </span>
                          </div>
                        </div>

                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : null}
                      </div>

                      <p className="mt-2 text-xs text-stone-300 leading-relaxed">
                        {isTa ? voice.toneTamil : voice.tone}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between">
                        <span className="text-[10px] text-stone-400">
                          {isTa ? 'இயற்கையான ஒலி' : 'Natural Neural Audio'}
                        </span>
                        {onPreviewVoiceSample && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onPreviewVoiceSample(voice);
                            }}
                            className="px-2 py-1 rounded-md bg-stone-800 hover:bg-amber-500/20 text-amber-300 text-[11px] font-medium flex items-center gap-1 transition"
                          >
                            <Volume2 className={`w-3 h-3 ${isPreviewing ? 'animate-bounce text-amber-400' : ''}`} />
                            <span>{isPreviewing ? (isTa ? 'ஒலிக்கிறது...' : 'Playing...') : (isTa ? 'மாதிரி' : 'Sample')}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Male Voices Group */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-sky-300 tracking-wider uppercase">
                <span>👨</span>
                <span>{isTa ? 'ஆண் குரல்கள் (Male Voices)' : 'Male Voices'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {maleVoices.map((voice) => {
                  const isSelected = selectedVoiceId === voice.id;
                  const isPreviewing = previewingVoiceId === voice.id;

                  return (
                    <div
                      key={voice.id}
                      onClick={() => onSelectVoice(voice.id)}
                      className={`relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-900 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/50'
                          : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${voice.avatarColor} p-0.5 flex items-center justify-center shadow`}
                          >
                            <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center font-bold text-white text-base">
                              {voice.tamilName[0]}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-white">
                                {voice.tamilName}
                              </span>
                              <span className="text-xs text-stone-400 font-mono">
                                ({voice.name})
                              </span>
                            </div>
                            <span className="inline-block text-[11px] font-medium text-sky-400">
                              {isTa ? 'ஆண் குரல்' : 'Male Voice'}
                            </span>
                          </div>
                        </div>

                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : null}
                      </div>

                      <p className="mt-2 text-xs text-stone-300 leading-relaxed">
                        {isTa ? voice.toneTamil : voice.tone}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between">
                        <span className="text-[10px] text-stone-400">
                          {isTa ? 'தெளிவான உச்சரிப்பு' : 'Clear Diction'}
                        </span>
                        {onPreviewVoiceSample && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onPreviewVoiceSample(voice);
                            }}
                            className="px-2 py-1 rounded-md bg-stone-800 hover:bg-amber-500/20 text-amber-300 text-[11px] font-medium flex items-center gap-1 transition"
                          >
                            <Volume2 className={`w-3 h-3 ${isPreviewing ? 'animate-bounce text-amber-400' : ''}`} />
                            <span>{isPreviewing ? (isTa ? 'ஒலிக்கிறது...' : 'Playing...') : (isTa ? 'மாதிரி' : 'Sample')}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Browser Voice Engine Controls */
          <div className="mt-4 space-y-4">
            <div className="bg-stone-950/70 p-4 rounded-xl border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-300">
                  {isTa ? 'உலாவி குரல் தேர்வு (Browser Voices)' : 'Device Voice Profile'}
                </span>
                <span className="text-xs text-amber-400 font-medium">
                  {browserVoices.length > 0
                    ? `${browserVoices.length} ${isTa ? 'தமிழ் குரல்(கள்) கண்டறியப்பட்டது' : 'voice(s) detected'}`
                    : isTa
                    ? 'இயல்புநிலை குரல் பயன்படுத்தப்படும்'
                    : 'Default synthesized voice active'}
                </span>
              </div>

              {/* Gender selector for browser engine */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-stone-400">
                  {isTa ? 'பாலினம் தேர்வு:' : 'Gender Profile:'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectBrowserGender('female')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      browserGender === 'female'
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-500/50 shadow'
                        : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span>👩</span>
                    <span>{isTa ? 'பெண் குரல்' : 'Female Voice'}</span>
                  </button>
                  <button
                    onClick={() => onSelectBrowserGender('male')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      browserGender === 'male'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow'
                        : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span>👨</span>
                    <span>{isTa ? 'ஆண் குரல்' : 'Male Voice'}</span>
                  </button>
                </div>
              </div>

              {browserVoices.length > 0 && onSelectBrowserVoice && (
                <div className="pt-2">
                  <label className="block text-xs text-stone-400 mb-1">
                    {isTa ? 'கணினியில் உள்ள தமிழ் குரல் பட்டியல்:' : 'Installed System Voice:'}
                  </label>
                  <select
                    value={selectedBrowserVoiceUri}
                    onChange={(e) => onSelectBrowserVoice(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  >
                    {browserVoices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang}) {v.default ? '★ Default' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Speech Delivery Style (When Gemini Engine is Active) */}
      {engine === 'gemini' && (
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>{isTa ? 'பேச்சு பாணி & பாவணை' : 'Delivery Tone & Style'}</span>
              </h4>
              <p className="text-xs text-stone-400">
                {isTa
                  ? 'உரைக்கு ஏற்ற உணர்ச்சி மற்றும் பேசுமுறையைத் தேர்வு செய்க'
                  : 'Adjust cadence, emotion, and vocal style for your content'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-3">
            {voiceStyles.map((style) => {
              const isSelected = selectedStyleId === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => onSelectStyle(style.id)}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/80 text-amber-300 shadow-sm shadow-amber-500/10'
                      : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`p-1.5 rounded-lg ${isSelected ? 'bg-amber-500/20 text-amber-300' : 'bg-stone-800 text-stone-400'}`}>
                      {getStyleIcon(style.iconName)}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </div>
                  <span className="text-xs font-semibold">
                    {isTa ? style.labelTamil : style.label}
                  </span>
                  <span className="text-[10px] text-stone-400 truncate mt-0.5">
                    {isTa ? style.label : style.labelTamil}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
