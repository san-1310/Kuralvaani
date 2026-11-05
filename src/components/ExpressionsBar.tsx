import React, { useState } from 'react';
import {
  Smile,
  Sparkles,
  HelpCircle,
  Wind,
  Volume2,
  Heart,
  Flame,
  Coffee,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export interface EmotionOption {
  id: string;
  name: string;
  tamilName: string;
  emoji: string;
  desc: string;
  descTamil: string;
}

export const EMOTIONS: EmotionOption[] = [
  {
    id: 'natural',
    name: 'Natural',
    tamilName: 'இயல்பான பாவனை',
    emoji: '🎙️',
    desc: 'Balanced, clear, natural conversational tone',
    descTamil: 'இயல்பான, தெளிவான பேச்சு நடை',
  },
  {
    id: 'joyful',
    name: 'Joyful & Cheerful',
    tamilName: 'மகிழ்ச்சி & சிரிப்பு',
    emoji: '😊',
    desc: 'Bright, smiling voice full of warmth and delight',
    descTamil: 'புன்னகை நிறைந்த இதமான மகிழ்ச்சியான குரல்',
  },
  {
    id: 'excited',
    name: 'Excited & High Energy',
    tamilName: 'உற்சாகம் & வேகம்',
    emoji: '🤩',
    desc: 'Dynamic, animated, fast-paced RJ / host delivery',
    descTamil: 'சுறுசுறுப்பான, உற்சாக ஒலிபரப்பாளர் நடை',
  },
  {
    id: 'calm',
    name: 'Calm & Peaceful',
    tamilName: 'அமைதி & தியானம்',
    emoji: '🧘',
    desc: 'Gentle, soothing meditation pacing with deep breaths',
    descTamil: 'சாந்தமான, மெதுவான தியானக் குரல்',
  },
  {
    id: 'dramatic',
    name: 'Dramatic & Serious',
    tamilName: 'கம்பீரம் & மேடை உரை',
    emoji: '🧐',
    desc: 'Authoritative, resonant, deep dramatic orator style',
    descTamil: 'ஆழ்ந்த அழுத்தமும் கம்பீரமும் கொண்ட மேடைக் குரல்',
  },
  {
    id: 'gentle',
    name: 'Gentle & Affectionate',
    tamilName: 'பரிவு & கதை நடை',
    emoji: '🥺',
    desc: 'Tender, loving bedtime storytelling with emotional nuance',
    descTamil: 'அன்பான தாலாட்டு & கதைசொல்லும் கனிவான குரல்',
  },
  {
    id: 'surprised',
    name: 'Surprised & Astonished',
    tamilName: 'வியப்பு & ஆச்சரியம்',
    emoji: '😲',
    desc: 'Wide-eyed, curious, amazed vocal dynamics',
    descTamil: 'வியப்பும் ஆச்சரியமும் வெளிப்படும் நடை',
  },
];

interface ExpressionsBarProps {
  onInsertExpression: (tag: string) => void;
  selectedEmotion: string;
  onSelectEmotion: (emotionId: string) => void;
  language: 'ta' | 'en';
  onOpenGuide: () => void;
  onLoadExpressiveSample: (sampleText: string) => void;
}

export const ExpressionsBar: React.FC<ExpressionsBarProps> = ({
  onInsertExpression,
  selectedEmotion,
  onSelectEmotion,
  language,
  onOpenGuide,
  onLoadExpressiveSample,
}) => {
  const isTa = language === 'ta';
  const [isExpanded, setIsExpanded] = useState(true);

  const vocalBursts = [
    { tag: '<laugh>', label: isTa ? 'சிரிப்பு' : 'Laugh', emoji: '😄', hint: isTa ? 'உரையாடலில் சிரிப்பைச் சேர்க்கும்' : 'Adds natural laughter' },
    { tag: '<gasp>', label: isTa ? 'வியப்பு' : 'Gasp', emoji: '😮', hint: isTa ? 'ஆச்சரிய மூச்சு வெளிப்பாடு' : 'Surprise intake of breath' },
    { tag: '<breath>', label: isTa ? 'மூச்சு' : 'Breath', emoji: '😌', hint: isTa ? 'இயற்கையான மனித மூச்சு இடைநிறுத்தம்' : 'Natural human breathing pause' },
    { tag: '<sigh>', label: isTa ? 'பெருமூச்சு' : 'Sigh', emoji: '😔', hint: isTa ? 'உணர்ச்சிமிக்க பெருமூச்சு' : 'Emotional sigh' },
    { tag: '<whisper>', label: isTa ? 'கிசுகிசு' : 'Whisper', emoji: '🤫', hint: isTa ? 'ரகசிய மென்குரல்' : 'Soft intimate whisper' },
    { tag: '<chuckle>', label: isTa ? 'மென்சிரிப்பு' : 'Chuckle', emoji: '🤭', hint: isTa ? 'அடக்கமான மென்சிரிப்பு' : 'Gentle suppressed laugh' },
  ];

  const backchannels = [
    { tag: '|ஆமாம்|', label: isTa ? 'ஆமாம்' : 'Mhm', emoji: '👍' },
    { tag: '|அடடா|', label: isTa ? 'அடடா' : 'Wow', emoji: '✨' },
    { tag: '|ஓஹோ|', label: isTa ? 'ஓஹோ' : 'Oho', emoji: '💡' },
  ];

  const pauses = [
    { tag: ' , ', label: isTa ? ', இடைநிறுத்தம்' : ', Short Pause', emoji: '⏸️' },
    { tag: ' ... ', label: isTa ? '... நீண்ட யோசனை' : '... Contemplation', emoji: '⏳' },
    { tag: ' ! ', label: isTa ? '! அழுத்தம்' : '! Emphasis', emoji: '💥' },
  ];

  const expressivePresets = [
    {
      title: isTa ? 'சிரிப்பு நகைச்சுவை' : 'Funny Joke',
      text: 'இன்று காலையில ஒரு வேடிக்கை நடந்தது! <laugh> நண்பன் வந்து கேட்டான், "உனக்கு தமிழ் தெரியுமா?"ன்னு... <laugh> நான் சொன்னேன், "தமிழுக்கே என்னைத் தெரியுமே!" <chuckle>',
    },
    {
      title: isTa ? 'வியப்பான காட்சி' : 'Surprise Moment',
      text: 'அடடா! <gasp> என்ன ஒரு பேரழகு! <breath> மலை உச்சிக்குச் சென்றதும் அங்கே ஒரு பெரிய பொன்மயில் தோகை விரித்து ஆடிக்கொண்டிருந்தது! <gasp> கண்கொள்ளாக் காட்சி!',
    },
    {
      title: isTa ? 'அமைதியான தியானம்' : 'Calm Reflection',
      text: 'கண்களை மெதுவாக மூடிக் கொள்ளுங்கள்... <breath> உங்கள் மூச்சைக் கவனியுங்கள். <breath> மனதில் உள்ள அனைத்துக் கவலைகளும் விலகி, அமைதி பிறக்கிறது... <whisper> நீங்கள் இப்போது முற்றிலும் நிம்மதியாக இருக்கிறீர்கள்.',
    },
  ];

  return (
    <div className="bg-stone-900/90 border border-amber-500/30 rounded-2xl p-4 shadow-lg space-y-3.5">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm">
            ✨
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <span>{isTa ? 'உணர்ச்சிகள் & குரல் வெளிப்பாடுகள்' : 'Expressions & Vocal Bursts'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                Gemini 3.8 TTS
              </span>
            </h4>
            <p className="text-[11px] text-stone-400">
              {isTa
                ? 'சிரிப்பு, மூச்சு, வியப்பு போன்ற மனித உணர்ச்சிகளை உரைக்குள் சேர்க்க'
                : 'Inject natural laughs, gasps, breaths, and emotions into Tamil speech'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* How to add expressions button */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isTa ? 'சேர்ப்பது எப்படி?' : 'How to use?'}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-200"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3 pt-1">
          {/* Section 1: Emotional Mood Selector */}
          <div>
            <div className="text-[11px] font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
              <span>🎭</span>
              <span>{isTa ? 'உணர்ச்சி பாவனை தேர்வு (Emotional Mood):' : 'Overall Emotional Tone:'}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
              {EMOTIONS.map((emo) => {
                const isSelected = selectedEmotion === emo.id;
                return (
                  <button
                    key={emo.id}
                    onClick={() => onSelectEmotion(emo.id)}
                    className={`px-2.5 py-1.5 rounded-xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-sm'
                        : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 text-stone-300'
                    }`}
                    title={isTa ? emo.descTamil : emo.desc}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-base">{emo.emoji}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />}
                    </div>
                    <span className="text-[11px] font-bold mt-1 truncate">
                      {isTa ? emo.tamilName.split(' ')[0] : emo.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: 1-Click Vocal Burst Injection Buttons */}
          <div>
            <div className="text-[11px] font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
              <span>🗣️</span>
              <span>
                {isTa
                  ? 'உரைக்குள் சேர்க்கும் ஒலி வெளிப்பாடுகள் (Insert Vocal Bursts at Cursor):'
                  : 'Click to Insert Vocal Bursts into Your Text:'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {vocalBursts.map((vb) => (
                <button
                  key={vb.tag}
                  onClick={() => onInsertExpression(` ${vb.tag} `)}
                  className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-amber-600 hover:text-stone-950 border border-stone-700/80 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-sm group"
                  title={vb.hint}
                >
                  <span className="text-sm">{vb.emoji}</span>
                  <span>{vb.label}</span>
                  <span className="text-[10px] text-amber-400 group-hover:text-stone-950 font-mono">
                    {vb.tag}
                  </span>
                </button>
              ))}

              {/* Pause cues */}
              {pauses.map((p) => (
                <button
                  key={p.tag}
                  onClick={() => onInsertExpression(p.tag)}
                  className="px-2.5 py-1.5 rounded-xl bg-stone-950/80 hover:bg-stone-800 border border-stone-700/60 text-stone-300 text-xs font-mono font-medium flex items-center gap-1 transition"
                  title={p.label}
                >
                  <span>{p.emoji}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Try Expressive Tamil Examples */}
          <div className="pt-2 border-t border-stone-800/70 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-stone-400 font-medium">
              {isTa ? 'உணர்ச்சிமிக்க மாதிரி வாக்கியங்கள்:' : 'Try expressive examples:'}
            </span>
            {expressivePresets.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => onLoadExpressiveSample(ex.text)}
                className="px-2.5 py-1 rounded-lg bg-stone-800/80 hover:bg-amber-500/20 hover:text-amber-300 border border-stone-700 text-stone-300 text-[11px] font-medium flex items-center gap-1 transition"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{ex.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
