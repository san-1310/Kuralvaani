import React from 'react';
import { X, HelpCircle, CheckCircle2, Sparkles, Volume2 } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ta' | 'en';
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;
  const isTa = language === 'ta';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {isTa ? 'குரல்வாணி வழிகாட்டி & குறிப்புகள்' : 'KuralVaani User Guide & Tips'}
            </h3>
            <p className="text-xs text-stone-400">
              {isTa ? 'சிறந்த தமிழ் ஒலி அமைப்பைப் பெற எளிய வழிகள்' : 'How to get the most natural Tamil speech output'}
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-stone-300 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 space-y-2">
            <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>{isTa ? '1. தங்கிலிஷ் (Tanglish) உள்ளீடு' : '1. Tanglish Input'}</span>
            </h4>
            <p>
              {isTa
                ? 'உங்களுக்கு தமிழ் தட்டச்சு தெரியவில்லை என்றாலும் கவலையில்லை! ஆங்கிலத்தில் "Vanakkam nanba, eppadi irukkeenga" என எழுதி "தமிழ் எழுத்தில் மாற்று" பொத்தானை அழுத்தினால் அது தூய தமிழ் எழுத்தாக மாறும்.'
                : 'Do not have a Tamil keyboard? Simply type phonetically in English letters (e.g. "Vanakkam eppadi irukkeenga") and tap "Tanglish -> Tamil" to automatically convert into native Tamil script.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 space-y-2">
            <h4 className="font-bold text-pink-400 flex items-center gap-1.5">
              <span>👩</span>
              <span>{isTa ? '2. ஆண் & பெண் குரல்கள்' : '2. Male & Female Voices'}</span>
            </h4>
            <p>
              {isTa
                ? 'கோமதி மற்றும் கயல்விழி (பெண் குரல்கள்), முருகன், பாரதி மற்றும் வள்ளுவர் (ஆண் குரல்கள்) ஆகியவற்றில் உங்கள் விருப்பப்படி தேர்வு செய்யலாம்.'
                : 'Switch between Gomathi & Kayalvizhi (Female voices) or Murugan, Bharathi & Valluvar (Male voices) according to your desired audience.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 space-y-2">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4" />
              <span>{isTa ? '3. எண்கள் & சுருக்கங்களை விரிவாக்குதல்' : '3. Numbers & Abbreviations'}</span>
            </h4>
            <p>
              {isTa
                ? '"ஒலி மேம்படுத்து" (Optimize) பொத்தான் எண்களை (எ.கா. 2026 -> இரண்டாயிரத்து இருபத்து ஆறு) மற்றும் சுருக்கங்களை பேச்சிற்கு ஏற்றவாறு வார்த்தைகளாக மாற்றும்.'
                : 'The "Optimize for Speech" button converts digits (e.g. 2026 into Tamil words), adds breath pauses, and ensures fluent cadence.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 space-y-2">
            <h4 className="font-bold text-sky-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isTa ? '4. ஒலி கோப்பு பதிவிறக்கம்' : '4. Audio Export (.WAV)'}</span>
            </h4>
            <p>
              {isTa
                ? 'உருவாக்கப்பட்ட எந்த ஒரு தமிழ்க் குரலையும் நீங்கள் நேரடியாக உயர்தர WAV வடிவில் பதிவிறக்கம் செய்து வீடியோக்கள், போட்காஸ்ட்கள் அல்லது பிரசண்டேஷன்களில் பயன்படுத்தலாம்.'
                : 'Download generated studio-grade WAV files directly to use in presentations, YouTube videos, educational tutorials, and podcasts.'}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition"
          >
            {isTa ? 'புரிந்தது / மூடுக' : 'Got it / Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
