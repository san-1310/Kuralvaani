import React from 'react';
import { X, Sparkles, Smile, Wind, HelpCircle, Check, Copy } from 'lucide-react';

interface ExpressionsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySnippet: (snippet: string) => void;
  language: 'ta' | 'en';
}

export const ExpressionsGuideModal: React.FC<ExpressionsGuideModalProps> = ({
  isOpen,
  onClose,
  onApplySnippet,
  language,
}) => {
  if (!isOpen) return null;
  const isTa = language === 'ta';

  const snippets = [
    {
      title: isTa ? 'சிரிப்புடன் தொடங்கும் உரையாடல் (Greeting with Laughter)' : 'Greeting with Laughter',
      code: 'வணக்கம் நண்பா! <laugh> உன்னை நீண்ட நாட்களுக்குப் பிறகு பார்ப்பதில் மிக்க மகிழ்ச்சி. <breath> எப்படி இருக்கிறாய்?',
      explanation: isTa ? '<laugh> சிரிப்பு ஒலியையும், <breath> இயல்பான மூச்சு விடுதலையும் சேர்க்கும்.' : '<laugh> adds natural laughter, and <breath> adds a lifelike breathing pause.',
    },
    {
      title: isTa ? 'வியப்பும் ஆச்சரியமும் (Surprise & Wonder)' : 'Surprise & Wonder',
      code: 'அடடா! <gasp> என்ன ஒரு அற்புதம்! <breath> இந்த தமிழ் உரை-ஒலி தொழில்நுட்பம் உண்மையிலேயே வியக்க வைக்கிறது!',
      explanation: isTa ? '<gasp> என்பது திடீர் ஆச்சரிய மூச்சு வெளிப்பாடாகும்.' : '<gasp> simulates a genuine intake of breath in shock or astonishment.',
    },
    {
      title: isTa ? 'ஆழ்ந்த சிந்தனை & பெருமூச்சு (Sigh & Whisper)' : 'Deep Reflection & Whisper',
      code: 'அந்த பழைய நாட்கள்... <sigh> எவ்வளவு இனிமையானவை. <breath> <whisper> அதை ஒருபோதும் மறக்க முடியாது.',
      explanation: isTa ? '<sigh> பெருமூச்சையும், <whisper> மெல்லிய கிசுகிசுப்பையும் குறிக்கும்.' : '<sigh> generates a reflective exhalation, and <whisper> produces an intimate whisper.',
    },
    {
      title: isTa ? 'மறுமொழிகள் (Backchannel Reactions)' : 'Backchannel Reactions',
      code: 'ஆமாம், |ஆமாம்| நீ சொல்வது முற்றிலும் சரிதான். <breath> நாம் உடனே இதைத் தொடங்குவோம்!',
      explanation: isTa ? '|ஆமாம்| அல்லது |mhm| என்பது மனித உரையாடலின் இயற்கையான ஒப்புதல் மறுமொழியாகும்.' : '|mhm| or |yeah| creates conversational acknowledgment.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 p-0.5 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {isTa ? 'உணர்ச்சிகள் சேர்ப்பது எப்படி? (How to Add Expressions)' : 'How to Add Expressions in Tamil Speech'}
            </h3>
            <p className="text-xs text-stone-400">
              {isTa
                ? 'ஜெமினி 3.8 தமிழ் குரலில் சிரிப்பு, வியப்பு மற்றும் உணர்ச்சிகளை உருவாக்கும் வழிகாட்டி'
                : 'A comprehensive guide to adding vocal bursts, laughter, gasps, and emotional moods'}
            </p>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 space-y-1.5">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-white text-xs">
              {isTa ? 'ஒலி குறிச்சொற்களை இடுங்கள்' : 'Insert Vocal Tags'}
            </h4>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              {isTa
                ? 'உங்கள் உரையில் சிரிப்பு வர வேண்டிய இடத்தில் `<laugh>`, வியப்புக்கு `<gasp>`, மூச்சு இடைநிறுத்தத்திற்கு `<breath>` என எழுதவும் அல்லது பொத்தானை அழுத்தவும்.'
                : 'Type tags like `<laugh>`, `<gasp>`, `<breath>`, `<sigh>` or click the expression buttons directly into your sentence.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 space-y-1.5">
            <div className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-300 font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-white text-xs">
              {isTa ? 'உணர்ச்சி பாவனையைத் தேர்வு செய்க' : 'Choose Emotional Mood'}
            </h4>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              {isTa
                ? 'உணர்ச்சி பாவனை பட்டியில் "மகிழ்ச்சி 😊", "உற்சாகம் 🤩", "அமைதி 🧘", அல்லது "கம்பீரம் 🧐" என உங்கள் கதைக்கு ஏற்ற உணர்வைத் தேர்வு செய்க.'
                : 'Select an overall emotional mood (Joyful, Excited, Calm, Dramatic, or Gentle) to shape the speaker’s tone and melody.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 space-y-1.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-white text-xs">
              {isTa ? 'இயற்கையான இடைநிறுத்தங்கள்' : 'Control Pauses & Pace'}
            </h4>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              {isTa
                ? 'காற்புள்ளி (`,`), சிந்தனைப் புள்ளி (`...`) மற்றும் ஆச்சரியக்குறி (`!`) ஆகியவை பேச்சின் வேகத்தை மாற்றி இயல்பான மனித நடைபோல ஒலிக்கச் செய்யும்.'
                : 'Use commas (`,`) for short breath pauses, ellipses (`...`) for contemplation, and exclamation marks (`!`) for expressive punch.'}
            </p>
          </div>
        </div>

        {/* Available Tags Reference Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-stone-200">
            {isTa ? 'ஆதரிக்கப்படும் உணர்ச்சி குறிச்சொற்கள் (Supported Tags):' : 'Supported Expression Tags:'}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-between">
              <span className="font-mono text-amber-300">&lt;laugh&gt;</span>
              <span className="text-stone-400">{isTa ? 'சிரிப்பு (Laughter)' : 'Laugh'}</span>
            </div>
            <div className="p-2 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-between">
              <span className="font-mono text-amber-300">&lt;gasp&gt;</span>
              <span className="text-stone-400">{isTa ? 'வியப்பு மூச்சு (Gasp)' : 'Gasp'}</span>
            </div>
            <div className="p-2 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-between">
              <span className="font-mono text-amber-300">&lt;breath&gt;</span>
              <span className="text-stone-400">{isTa ? 'மனித மூச்சு (Breath)' : 'Breath'}</span>
            </div>
            <div className="p-2 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-between">
              <span className="font-mono text-amber-300">&lt;sigh&gt;</span>
              <span className="text-stone-400">{isTa ? 'பெருமூச்சு (Sigh)' : 'Sigh'}</span>
            </div>
            <div className="p-2 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-between">
              <span className="font-mono text-amber-300">&lt;whisper&gt;</span>
              <span className="text-stone-400">{isTa ? 'கிசுகிசுப்பு (Whisper)' : 'Whisper'}</span>
            </div>
            <div className="p-2 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-between">
              <span className="font-mono text-amber-300">&lt;chuckle&gt;</span>
              <span className="text-stone-400">{isTa ? 'மென்சிரிப்பு (Chuckle)' : 'Chuckle'}</span>
            </div>
          </div>
        </div>

        {/* Interactive Try-it Examples */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-stone-200">
            {isTa ? 'உடனடியாக முயற்சிக்க மாதிரி வரிகள் (Click to Try in Editor):' : 'Try Pre-formatted Examples in Editor:'}
          </h4>
          <div className="space-y-2">
            {snippets.map((snip, index) => (
              <div
                key={index}
                className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 hover:border-amber-500/50 transition space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">
                    {snip.title}
                  </span>
                  <button
                    onClick={() => {
                      onApplySnippet(snip.code);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-semibold flex items-center gap-1 transition"
                  >
                    <span>{isTa ? 'உரையில் ஏற்று' : 'Use this'}</span>
                  </button>
                </div>
                <p className="text-xs text-stone-300 font-mono bg-stone-900/60 p-2 rounded-lg border border-stone-800">
                  {snip.code}
                </p>
                <p className="text-[11px] text-stone-500">
                  {snip.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition"
          >
            {isTa ? 'புரிந்தது / மூடுக' : 'Close Guide'}
          </button>
        </div>
      </div>
    </div>
  );
};
