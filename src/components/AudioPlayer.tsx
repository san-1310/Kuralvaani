import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Volume2,
  VolumeX,
  Gauge,
  Sparkles,
  Music,
  Check,
  FileAudio,
} from 'lucide-react';

interface AudioPlayerProps {
  audioSrc: string | null;
  rawBase64?: string | null;
  text: string;
  voiceName: string;
  engine: 'gemini' | 'browser';
  language: 'ta' | 'en';
  isGenerating?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioSrc,
  rawBase64,
  text,
  voiceName,
  engine,
  language,
  isGenerating,
}) => {
  const isTa = language === 'ta';
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Synchronize audio element when audioSrc changes
  useEffect(() => {
    if (audioRef.current && audioSrc) {
      audioRef.current.src = audioSrc;
      audioRef.current.load();
      audioRef.current.playbackRate = playbackRate;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [audioSrc]);

  const togglePlay = () => {
    if (!audioRef.current || !audioSrc) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.error('Audio play error:', err));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const changeSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      if (val === 0) setIsMuted(true);
      else setIsMuted(false);
    }
  };

  // Robust function to download the audio as a WAV file from base64 source
  const handleDownloadWav = () => {
    const source = rawBase64 || audioSrc;
    if (!source) return;

    try {
      // Extract raw base64 data whether provided as data URL or raw string
      const base64Data = source.includes('base64,')
        ? source.split('base64,')[1]
        : source;

      // Decode base64 string to byte array
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create a Blob with audio/wav mime type
      const blob = new Blob([bytes], { type: 'audio/wav' });
      const blobUrl = URL.createObjectURL(blob);

      // Create descriptive filename with sanitized Tamil / ASCII text
      const cleanPrefix = text
        .slice(0, 18)
        .trim()
        .replace(/[^\w\u0B80-\u0BFF]/g, '_');
      const filename = `kuralvaani-${cleanPrefix || 'tamil-speech'}-${Date.now()}.wav`;

      // Trigger file save
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        setDownloadSuccess(false);
      }, 2500);
    } catch (err) {
      console.warn('Blob WAV download failed, using direct data-URI fallback:', err);
      // Fallback directly to anchor click with data URI
      const link = document.createElement('a');
      link.href = source.startsWith('data:') ? source : `data:audio/wav;base64,${source}`;
      link.download = `kuralvaani-tamil-speech-${Date.now()}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const hasAudio = Boolean(rawBase64 || audioSrc);

  return (
    <div className="bg-gradient-to-b from-stone-900 to-stone-950 border border-amber-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Player Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white">
                {isTa ? 'ஒலி இயக்ககம்' : 'Audio Player'}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-800 border border-stone-700 text-stone-300 font-medium">
                {voiceName}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-semibold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                {engine === 'gemini' ? 'Gemini Neural AI (24kHz WAV)' : 'Browser Speech'}
              </span>
            </div>
            <p className="text-xs text-stone-400 truncate max-w-xs sm:max-w-md mt-0.5">
              {text ? text.slice(0, 60) + (text.length > 60 ? '...' : '') : isTa ? 'உரை ஏதுமில்லை' : 'No text loaded'}
            </p>
          </div>
        </div>

        {/* Header Action: Download WAV Button */}
        <button
          onClick={handleDownloadWav}
          disabled={!hasAudio || isGenerating}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition active:scale-95 shadow-md ${
            !hasAudio || isGenerating
              ? 'bg-stone-900 border border-stone-800 text-stone-600 cursor-not-allowed'
              : downloadSuccess
              ? 'bg-emerald-600 text-white border border-emerald-400'
              : 'bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-stone-950 border border-amber-400/50 shadow-amber-500/20'
          }`}
          title={
            hasAudio
              ? isTa
                ? 'தற்போதைய ஒலியை WAV கோப்பாகப் பதிவிறக்கவும்'
                : 'Download current audio as a WAV file'
              : isTa
              ? 'ஒலியை உருவாக்கியதும் WAV கோப்பாகப் பதிவிறக்கலாம்'
              : 'Synthesize speech to download WAV file'
          }
        >
          {downloadSuccess ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isTa ? 'பதிவிறக்கப்பட்டது!' : 'Saved .WAV!'}</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>{isTa ? 'WAV பதிவிறக்கம்' : 'Download .WAV'}</span>
            </>
          )}
        </button>
      </div>

      {/* Animated Waveform Visualizer */}
      <div className="h-14 bg-stone-950/80 rounded-xl border border-stone-800/80 px-4 flex items-center justify-center gap-1.5 mb-4 relative overflow-hidden">
        {isGenerating ? (
          <div className="flex items-center gap-2 text-xs text-amber-400 animate-pulse font-medium">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>{isTa ? 'தமிழ் குரல் உருவாக்கப்படுகிறது... காத்திருக்கவும்' : 'Synthesizing Tamil voice with Gemini AI...'}</span>
          </div>
        ) : !audioSrc ? (
          <p className="text-xs text-stone-500 italic">
            {isTa ? 'பேச "ஒலி உருவாக்கு" பொத்தானை அழுத்தவும்' : 'Press "Synthesize Speech" to generate audio'}
          </p>
        ) : (
          <div className="flex items-center justify-center gap-1 w-full h-8">
            {Array.from({ length: 36 }).map((_, i) => {
              const heightMultiplier = isPlaying ? Math.sin((i / 36) * Math.PI) * 0.8 + 0.2 : 0.15;
              const animIndex = (i % 5) + 1;
              return (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isPlaying
                      ? `bg-gradient-to-t from-amber-600 to-orange-400 animate-pulse-wave-${animIndex}`
                      : 'bg-stone-700 h-2'
                  }`}
                  style={{
                    height: isPlaying ? undefined : `${Math.max(4, heightMultiplier * 26)}px`,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Scrub Bar & Time */}
      <div className="space-y-1 mb-4">
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.05"
          value={currentTime}
          onChange={handleSeek}
          disabled={!audioSrc}
          className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500 disabled:opacity-40"
        />
        <div className="flex justify-between text-[11px] text-stone-400 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-stone-800/80">
        {/* Play/Pause, Replay & Secondary Download Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            disabled={!audioSrc || isGenerating}
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-white transition active:scale-95 shadow-lg ${
              !audioSrc || isGenerating
                ? 'bg-stone-800 text-stone-600 cursor-not-allowed'
                : 'bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-500 hover:from-amber-500 hover:to-orange-400 shadow-amber-600/30 text-stone-950 font-bold'
            }`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current text-stone-950" />
            ) : (
              <Play className="w-5 h-5 fill-current text-stone-950 ml-0.5" />
            )}
          </button>

          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
              }
            }}
            disabled={!audioSrc}
            className="p-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition disabled:opacity-40"
            title={isTa ? 'மீண்டும் தொடக்கத்திலிருந்து கேள்' : 'Replay from start'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Quick Download WAV icon button in controls bar */}
          <button
            onClick={handleDownloadWav}
            disabled={!hasAudio || isGenerating}
            className={`p-2.5 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold ${
              !hasAudio || isGenerating
                ? 'bg-stone-900 text-stone-600 border border-stone-800 cursor-not-allowed'
                : downloadSuccess
                ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                : 'bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 hover:border-amber-500'
            }`}
            title={isTa ? 'WAV கோப்பைச் சேமிக்கவும்' : 'Save as WAV Audio File'}
          >
            {downloadSuccess ? (
              <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">.WAV</span>
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 bg-stone-950/70 p-1 rounded-xl border border-stone-800/80">
          <span className="text-[10px] text-stone-400 px-1.5 flex items-center gap-1">
            <Gauge className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">{isTa ? 'வேகம்' : 'Speed'}:</span>
          </span>
          {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
            <button
              key={rate}
              onClick={() => changeSpeed(rate)}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition ${
                playbackRate === rate
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>

        {/* Volume slider */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="text-stone-400 hover:text-stone-200 transition"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 sm:w-20 h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>
      </div>
    </div>
  );
};
