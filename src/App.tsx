/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Sparkles,
  Play,
  RotateCcw,
  Languages,
  Wand2,
  Keyboard,
  Copy,
  Check,
  Trash2,
  BookMarked,
  Sliders,
  AlertCircle,
  FileText,
  Clock,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { VOICES, VOICE_STYLES, SAMPLE_TEXTS } from './data/presets';
import { VoiceOption, HistoryItem, SampleText } from './types';
import { Header } from './components/Header';
import { VoiceSelector } from './components/VoiceSelector';
import { AudioPlayer } from './components/AudioPlayer';
import { TamilKeyboard } from './components/TamilKeyboard';
import { HistoryDrawer } from './components/HistoryDrawer';
import { HelpModal } from './components/HelpModal';
import { ExpressionsBar } from './components/ExpressionsBar';
import { ExpressionsGuideModal } from './components/ExpressionsGuideModal';
import { localPhoneticTransliterate } from './utils/tamilTransliterator';

export default function App() {
  // Localization & Preferences
  const [language, setLanguage] = useState<'ta' | 'en'>('ta');
  const [activeEngine, setActiveEngine] = useState<'gemini' | 'browser'>('gemini');

  // Voice Selection (Multi-voice: Male and Female)
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('Kore'); // Female default
  const [selectedStyleId, setSelectedStyleId] = useState<string>('natural');
  const [browserGender, setBrowserGender] = useState<'female' | 'male'>('female');

  // Input & Editor State
  const [inputText, setInputText] = useState<string>(
    'வணக்கம்! குரல்வாணிக்கு நல்வரவு. எந்த ஒரு தமிழ் உரையையும் இயல்பான ஆண் அல்லது பெண் குரலில் கேட்கலாம்.'
  );
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Audio Playback & Generation State
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [currentRawBase64, setCurrentRawBase64] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);

  // AI Tool Actions State
  const [isTransliterating, setIsTransliterating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  // Drawers & Modals
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isExpressionsGuideOpen, setIsExpressionsGuideOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('natural');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Speech History
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('kuralvaani_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Browser SpeechSynthesis Voices
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedBrowserVoiceUri, setSelectedBrowserVoiceUri] = useState<string>('');

  const isTa = language === 'ta';

  // Load browser voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const allVoices = window.speechSynthesis.getVoices();
        const tamilVoices = allVoices.filter(
          (v) => v.lang.toLowerCase().startsWith('ta') || v.name.toLowerCase().includes('tamil')
        );
        setBrowserVoices(tamilVoices.length > 0 ? tamilVoices : allVoices.slice(0, 5));
        if (tamilVoices.length > 0) {
          setSelectedBrowserVoiceUri(tamilVoices[0].voiceURI);
        }
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kuralvaani_history', JSON.stringify(history.slice(0, 20)));
    } catch (e) {
      console.warn('Could not save history to localStorage', e);
    }
  }, [history]);

  // Flash status message
  const showStatus = (type: 'success' | 'error' | 'info', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  // Find active voice metadata
  const currentVoice = VOICES.find((v) => v.id === selectedVoiceId) || VOICES[0];
  const currentStyle = VOICE_STYLES.find((s) => s.id === selectedStyleId) || VOICE_STYLES[0];

  // Synthesize Speech Main Handler
  const handleSynthesizeSpeech = async () => {
    if (!inputText.trim()) {
      showStatus('error', isTa ? 'தயவுசெய்து உரையை உள்ளிடவும்' : 'Please enter some text to speak');
      return;
    }

    if (activeEngine === 'gemini') {
      setIsGenerating(true);
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: inputText.trim(),
            voiceName: selectedVoiceId,
            stylePrompt: currentStyle.prompt,
            emotion: selectedEmotion,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to generate speech');
        }

        const audioUri = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
        setCurrentAudioUrl(audioUri);
        setCurrentRawBase64(data.audioBase64);

        // Add to history
        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(),
          text: inputText.trim(),
          timestamp: Date.now(),
          voiceName: currentVoice.name,
          voiceTamilName: currentVoice.tamilName,
          audioUrl: audioUri,
          audioBase64: data.audioBase64,
          engine: 'gemini',
          stylePrompt: currentStyle.label,
        };
        setHistory((prev) => [newHistoryItem, ...prev]);

        showStatus(
          'success',
          isTa
            ? `${currentVoice.tamilName} குரலில் ஒலி வெற்றிகரமாக உருவாக்கப்பட்டது!`
            : `Tamil audio synthesized successfully with ${currentVoice.name}!`
        );
      } catch (err: any) {
        console.error('Synthesis error:', err);
        showStatus(
          'error',
          err.message || (isTa ? 'ஒலி உருவாக்குவதில் பிழை ஏற்பட்டது' : 'Failed to generate speech')
        );
      } finally {
        setIsGenerating(false);
      }
    } else {
      // Browser Web Speech Engine
      if (!('speechSynthesis' in window)) {
        showStatus('error', isTa ? 'உங்கள் உலாவி பேச்சு ஒலியை ஆதரிக்கவில்லை' : 'Browser does not support Speech Synthesis');
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(inputText.trim());
      utterance.lang = 'ta-IN';

      // Apply gender modulation
      if (browserGender === 'female') {
        utterance.pitch = 1.25;
        utterance.rate = 1.0;
      } else {
        utterance.pitch = 0.85;
        utterance.rate = 0.95;
      }

      const chosenVoice = browserVoices.find((v) => v.voiceURI === selectedBrowserVoiceUri);
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      utterance.onstart = () => {
        showStatus(
          'info',
          isTa
            ? `${browserGender === 'female' ? 'பெண் குரல்' : 'ஆண் குரல்'} ஒலிக்கிறது...`
            : `Speaking with browser ${browserGender} voice...`
        );
      };

      utterance.onerror = (e) => {
        console.error('Speech error:', e);
        showStatus('error', isTa ? 'பேசுவதில் பிழை ஏற்பட்டது' : 'Browser speech error');
      };

      window.speechSynthesis.speak(utterance);

      // Record to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        text: inputText.trim(),
        timestamp: Date.now(),
        voiceName: browserGender === 'female' ? 'Browser Female' : 'Browser Male',
        voiceTamilName: browserGender === 'female' ? 'உலாவி பெண் குரல்' : 'உலாவி ஆண் குரல்',
        engine: 'browser',
      };
      setHistory((prev) => [newHistoryItem, ...prev]);
    }
  };

  // Preview Voice Sample
  const handlePreviewVoiceSample = async (voice: VoiceOption) => {
    if (previewingVoiceId) return;
    setPreviewingVoiceId(voice.id);

    try {
      const sampleGreeting =
        voice.gender === 'female'
          ? `வணக்கம்! என் பெயர் ${voice.tamilName}. இது எனது தமிழ் பெண் குரல் மாதிரி.`
          : `வணக்கம்! என் பெயர் ${voice.tamilName}. இது எனது தமிழ் ஆண் குரல் மாதிரி.`;

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sampleGreeting,
          voiceName: voice.id,
          stylePrompt: 'Natural, warm, friendly native Tamil speech sample',
        }),
      });

      const data = await res.json();
      if (res.ok && data.audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
        audio.play();
        audio.onended = () => setPreviewingVoiceId(null);
      } else {
        setPreviewingVoiceId(null);
      }
    } catch (e) {
      console.error(e);
      setPreviewingVoiceId(null);
    }
  };

  // Transliterate Tanglish to Tamil Script
  const handleTransliterate = async () => {
    if (!inputText.trim()) {
      showStatus('error', isTa ? 'தங்கிலிஷ் உரையை உள்ளிடவும்' : 'Enter phonetic Tanglish text');
      return;
    }
    setIsTransliterating(true);
    try {
      const res = await fetch('/api/transliterate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tanglish: inputText }),
      });
      const data = await res.json();
      if (!res.ok || !data.tamilText) {
        throw new Error(data.error || 'Failed to transliterate');
      }
      setInputText(data.tamilText);
      showStatus('success', isTa ? 'தங்கிலிஷ் வெற்றிகரமாக தமிழாக மாற்றப்பட்டது!' : 'Tanglish converted to Tamil script!');
    } catch (e: any) {
      console.warn('Server transliteration error, applying local phonetic engine:', e);
      const fallback = localPhoneticTransliterate(inputText);
      setInputText(fallback);
      showStatus('success', isTa ? 'தங்கிலிஷ் தமிழாக மாற்றப்பட்டது!' : 'Tanglish converted to Tamil script!');
    } finally {
      setIsTransliterating(false);
    }
  };

  // Translate English to Tamil
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      showStatus('error', isTa ? 'மொழிபெயர்க்க உரையை உள்ளிடவும்' : 'Enter text to translate');
      return;
    }
    setIsTranslating(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setInputText(data.tamilText);
      showStatus('success', isTa ? 'தமிழில் மொழிபெயர்க்கப்பட்டது!' : 'Translated into Tamil!');
    } catch (e: any) {
      showStatus('error', e.message || 'Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  // Optimize Tamil text for TTS reading
  const handleOptimizeSpeech = async () => {
    if (!inputText.trim()) {
      showStatus('error', isTa ? 'உரையை உள்ளிடவும்' : 'Enter text to optimize');
      return;
    }
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/optimize-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setInputText(data.optimizedText);
      showStatus(
        'success',
        isTa
          ? 'எண்கள் மற்றும் நிறுத்தக்குறிகள் பேச்சிற்கு உகந்தவாறு மேம்படுத்தப்பட்டன!'
          : 'Numbers & pauses optimized for speech reading!'
      );
    } catch (e: any) {
      showStatus('error', e.message || 'Optimization failed');
    } finally {
      setIsOptimizing(false);
    }
  };

  // Insert character from virtual keyboard
  const handleInsertChar = (char: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart || inputText.length;
      const end = textareaRef.current.selectionEnd || inputText.length;
      const updated = inputText.substring(0, start) + char + inputText.substring(end);
      setInputText(updated);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + char.length;
          textareaRef.current.focus();
        }
      }, 10);
    } else {
      setInputText((prev) => prev + char);
    }
  };

  // Backspace character from virtual keyboard
  const handleBackspace = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      if (start !== end) {
        setInputText(inputText.substring(0, start) + inputText.substring(end));
      } else if (start > 0) {
        setInputText(inputText.substring(0, start - 1) + inputText.substring(start));
      }
    } else {
      setInputText((prev) => prev.slice(0, -1));
    }
  };

  // Copy text to clipboard
  const handleCopyText = () => {
    navigator.clipboard.writeText(inputText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Filter sample presets
  const filteredPresets =
    activeCategory === 'all'
      ? SAMPLE_TEXTS
      : SAMPLE_TEXTS.filter((s) => s.category.toLowerCase() === activeCategory.toLowerCase());

  // Text Stats
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;
  const estimatedSeconds = Math.max(1, Math.round((wordCount / 110) * 60));

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Global Header */}
      <Header
        language={language}
        onToggleLanguage={() => setLanguage((prev) => (prev === 'ta' ? 'en' : 'ta'))}
        activeEngine={activeEngine}
        onSelectEngine={setActiveEngine}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Status Notification Toast */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-200 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                : statusMessage.type === 'error'
                ? 'bg-red-950/80 border-red-500/50 text-red-200'
                : 'bg-amber-950/80 border-amber-500/50 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-stone-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Hero Banner / Quick Feature Bar */}
        <div className="relative rounded-3xl bg-gradient-to-r from-stone-900 via-stone-900/90 to-amber-950/40 border border-stone-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isTa ? 'செம்மொழித் தமிழ் குரல் கூடம்' : 'Studio Quality Tamil TTS with Gemini AI'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {isTa ? 'எழுத்தை உயிரோட்டமுள்ள தமிழ்க் குரலாக மாற்றுங்கள்' : 'Turn Tamil Text into Lifelike Spoken Speech'}
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              {isTa
                ? 'ஆண் மற்றும் பெண் குரல்களில், துல்லியமான உச்சரிப்புடன் இயற்கை முறையில் பேச்சைக் கேளுங்கள் அல்லது பதிவிறக்குங்கள். தங்கிலிஷ் உள்ளீட்டையும் தானாகவே தமிழாக மாற்றலாம்.'
                : 'Choose natural male and female Tamil voices with authentic regional pronunciation. Features Tanglish transliteration, audio export, and delivery styles.'}
            </p>
          </div>
        </div>

        {/* Main Grid: Left Column (Text Editor & Tools) | Right Column (Voice Controls & Audio Player) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Text Input & Enhancement Suite (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-xl space-y-4">
              {/* Textarea Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-bold text-white">
                    {isTa ? 'தமிழ் உரை உள்ளீடு' : 'Tamil Text Input'}
                  </span>
                </div>

                {/* Quick Editor Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsKeyboardOpen(!isKeyboardOpen)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      isKeyboardOpen
                        ? 'bg-amber-500 text-stone-950 shadow-md'
                        : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                    }`}
                    title={isTa ? 'தமிழ் விசைப்பலகை திறக்க' : 'Toggle Tamil Keyboard'}
                  >
                    <Keyboard className="w-3.5 h-3.5" />
                    <span>{isTa ? 'விசைப்பலகை' : 'Keyboard'}</span>
                  </button>

                  <button
                    onClick={handleCopyText}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition"
                    title={isTa ? 'உரையை நகலெடு' : 'Copy Text'}
                  >
                    {copySuccess ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => setInputText('')}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-red-400 transition"
                    title={isTa ? 'அனைத்தையும் அழிக்க' : 'Clear Text'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Collapsible Virtual Keyboard */}
              <TamilKeyboard
                isOpen={isKeyboardOpen}
                onClose={() => setIsKeyboardOpen(false)}
                onInsertChar={handleInsertChar}
                onBackspace={handleBackspace}
                language={language}
              />

              {/* Emotional Expressions & Vocal Bursts Toolbar */}
              <ExpressionsBar
                onInsertExpression={handleInsertChar}
                selectedEmotion={selectedEmotion}
                onSelectEmotion={setSelectedEmotion}
                language={language}
                onOpenGuide={() => setIsExpressionsGuideOpen(true)}
                onLoadExpressiveSample={(sampleText) => {
                  setInputText(sampleText);
                  showStatus('info', isTa ? 'உணர்ச்சிமிக்க மாதிரி உரை ஏற்றப்பட்டது!' : 'Expressive sample loaded!');
                }}
              />

              {/* The Textarea */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isTa
                      ? 'இங்கு உங்கள் தமிழ் உரையை தட்டச்சு செய்யவும்... அல்லது தங்கிலிஷில் "Vanakkam" என எழுதி "தமிழ் எழுத்தில் மாற்று" பொத்தானை அழுத்தவும்.'
                      : 'Type or paste Tamil text here... Or type Tanglish (e.g., "Vanakkam nanba") and click "Tanglish -> Tamil".'
                  }
                  rows={8}
                  className="w-full bg-stone-950/80 border border-stone-800 focus:border-amber-500 rounded-xl p-4 text-stone-100 placeholder:text-stone-500 text-base leading-relaxed resize-y focus:outline-none focus:ring-1 focus:ring-amber-500/50 font-normal"
                />
              </div>

              {/* Text Stats and AI Transformation Tools */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                {/* Stats */}
                <div className="flex items-center gap-3 text-stone-400 font-mono">
                  <span>
                    {wordCount} {isTa ? 'வார்த்தைகள்' : 'words'}
                  </span>
                  <span>•</span>
                  <span>
                    {charCount} {isTa ? 'எழுத்துக்கள்' : 'chars'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-400/90">
                    <Clock className="w-3 h-3" />
                    <span>~{estimatedSeconds}s</span>
                  </span>
                </div>

                {/* AI Tools */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Tanglish to Tamil */}
                  <button
                    onClick={handleTransliterate}
                    disabled={isTransliterating || !inputText.trim()}
                    className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 hover:border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
                    title={isTa ? 'ஆங்கில எழுத்துக்களில் உள்ள தமிழ் உரையை தமிழ் எழுத்தாக மாற்றும்' : 'Converts phonetic English (Tanglish) into Tamil script'}
                  >
                    <Languages className={`w-3.5 h-3.5 ${isTransliterating ? 'animate-spin' : ''}`} />
                    <span>{isTransliterating ? (isTa ? 'மாற்றுகிறது...' : 'Converting...') : (isTa ? 'தங்கிலிஷ் → தமிழ்' : 'Tanglish → Tamil')}</span>
                  </button>

                  {/* Translate English -> Tamil */}
                  <button
                    onClick={handleTranslate}
                    disabled={isTranslating || !inputText.trim()}
                    className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-sky-300 border border-stone-700 hover:border-sky-500/40 text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
                    title={isTa ? 'ஆங்கில உரையை இயல்பான தமிழில் மொழிபெயர்க்கும்' : 'Translates English to Tamil'}
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isTranslating ? 'animate-spin' : ''}`} />
                    <span>{isTranslating ? (isTa ? 'மொழிபெயர்க்கிறது...' : 'Translating...') : (isTa ? 'தமிழாக்கம் செய்' : 'Translate to Tamil')}</span>
                  </button>

                  {/* Optimize numbers & pronunciation */}
                  <button
                    onClick={handleOptimizeSpeech}
                    disabled={isOptimizing || !inputText.trim()}
                    className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-stone-700 hover:border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
                    title={isTa ? 'எண்கள், சுருக்கங்கள் மற்றும் இடைநிறுத்தங்களை பேச்சிற்கு ஏற்றவாறு மேம்படுத்தும்' : 'Expands numbers and punctuation for natural TTS delivery'}
                  >
                    <Wand2 className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
                    <span>{isOptimizing ? (isTa ? 'மேம்படுத்துகிறது...' : 'Optimizing...') : (isTa ? 'ஒலி மெருகூட்டு' : 'Optimize Speech')}</span>
                  </button>
                </div>
              </div>

              {/* Main Speak CTA Button */}
              <div className="pt-3">
                <button
                  onClick={handleSynthesizeSpeech}
                  disabled={isGenerating || !inputText.trim()}
                  className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 text-base font-bold shadow-xl transition-all duration-200 active:scale-[0.99] ${
                    isGenerating || !inputText.trim()
                      ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                      : 'bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500 hover:from-amber-500 hover:to-orange-400 text-stone-950 shadow-amber-600/25 ring-2 ring-amber-500/30'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>{isTa ? 'தமிழ் குரல் உருவாக்கப்படுகிறது...' : 'Synthesizing Tamil Speech...'}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-5 h-5" />
                      <span>
                        {isTa
                          ? `பேசுக (${currentVoice.tamilName} - ${currentVoice.gender === 'female' ? 'பெண் குரல்' : 'ஆண் குரல்'})`
                          : `Synthesize Speech (${currentVoice.name} - ${currentVoice.gender})`}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Curated Tamil Sample Presets */}
            <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <BookMarked className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">
                    {isTa ? 'மாதிரி தமிழ் உரைகள் (Sample Presets)' : 'Curated Tamil Presets'}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: 'all', label: isTa ? 'அனைத்தும்' : 'All' },
                    { id: 'literature', label: isTa ? 'திருக்குறள்' : 'Tirukkural' },
                    { id: 'poetry', label: isTa ? 'கவிதை' : 'Poetry' },
                    { id: 'news', label: isTa ? 'செய்தி' : 'News' },
                    { id: 'story', label: isTa ? 'கதை' : 'Story' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                        activeCategory === cat.id
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredPresets.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => {
                      setInputText(preset.text);
                      showStatus(
                        'info',
                        isTa
                          ? `"${preset.titleTamil}" உரை ஏற்றப்பட்டது`
                          : `Loaded: ${preset.title}`
                      );
                    }}
                    className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 hover:border-amber-500/50 hover:bg-stone-900/60 cursor-pointer transition group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-stone-200 group-hover:text-amber-300 transition">
                          {isTa ? preset.titleTamil : preset.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-800 text-stone-400 font-medium">
                          {isTa ? preset.categoryTamil : preset.category}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                        {preset.text}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-stone-800/60 flex items-center justify-between text-[11px] text-stone-500">
                      <span>{preset.author || (isTa ? 'பொது' : 'General')}</span>
                      <span className="text-amber-400/80 font-medium group-hover:translate-x-0.5 transition flex items-center gap-0.5">
                        <span>{isTa ? 'உரையை ஏற்று' : 'Use text'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Audio Player & Multiple Voice Selection (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Audio Waveform Player */}
            <AudioPlayer
              audioSrc={currentAudioUrl}
              rawBase64={currentRawBase64}
              text={inputText}
              voiceName={
                activeEngine === 'gemini'
                  ? `${currentVoice.tamilName} (${currentVoice.name} - ${currentVoice.gender === 'female' ? (isTa ? 'பெண்' : 'Female') : (isTa ? 'ஆண்' : 'Male')})`
                  : browserGender === 'female'
                  ? isTa
                    ? 'உலாவி பெண் குரல்'
                    : 'Browser Female'
                  : isTa
                  ? 'உலாவி ஆண் குரல்'
                  : 'Browser Male'
              }
              engine={activeEngine}
              language={language}
              isGenerating={isGenerating}
            />

            {/* Multiple Tamil Voice Options (Female and Male) */}
            <VoiceSelector
              voices={VOICES}
              selectedVoiceId={selectedVoiceId}
              onSelectVoice={setSelectedVoiceId}
              voiceStyles={VOICE_STYLES}
              selectedStyleId={selectedStyleId}
              onSelectStyle={setSelectedStyleId}
              language={language}
              onPreviewVoiceSample={handlePreviewVoiceSample}
              previewingVoiceId={previewingVoiceId}
              browserVoices={browserVoices}
              selectedBrowserVoiceUri={selectedBrowserVoiceUri}
              onSelectBrowserVoice={setSelectedBrowserVoiceUri}
              engine={activeEngine}
              browserGender={browserGender}
              onSelectBrowserGender={setBrowserGender}
            />
          </div>
        </div>
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={history}
        onPlayItem={(item) => {
          setInputText(item.text);
          if (item.audioUrl) {
            setCurrentAudioUrl(item.audioUrl);
            setCurrentRawBase64(item.audioBase64 || null);
          } else {
            handleSynthesizeSpeech();
          }
          setIsHistoryOpen(false);
        }}
        onClearHistory={() => setHistory([])}
        onDeleteItem={(id) => setHistory((prev) => prev.filter((i) => i.id !== id))}
        language={language}
      />

      {/* Help & Guide Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        language={language}
      />

      {/* How to Add Expressions Interactive Guide Modal */}
      <ExpressionsGuideModal
        isOpen={isExpressionsGuideOpen}
        onClose={() => setIsExpressionsGuideOpen(false)}
        onApplySnippet={(snippet) => {
          setInputText(snippet);
          showStatus('success', isTa ? 'உணர்ச்சி மாதிரி உரை ஆசிரியரில் ஏற்றப்பட்டது!' : 'Expressive sample loaded into editor!');
        }}
        language={language}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-800/80 bg-stone-950 py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            {isTa
              ? 'குரல்வாணி (KuralVaani) • தமிழ் உரை-ஒலி மாற்றகம்'
              : 'KuralVaani • Advanced Tamil Neural Text to Speech Studio'}
          </p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>{isTa ? 'ஆண் & பெண் குரல்கள்' : 'Male & Female Tamil Voices'}</span>
            <span>•</span>
            <span>{isTa ? 'தங்கிலிஷ் ஆதரவு' : 'Tanglish Support'}</span>
            <span>•</span>
            <span>{isTa ? 'WAV பதிவிறக்கம்' : 'WAV Audio Export'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
