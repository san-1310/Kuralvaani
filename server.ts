import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize server-side Gemini client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      availableVoices: [
        { id: 'Kore', name: 'கோமதி (Kore)', gender: 'female', tone: 'தெளிவான, இதமான குரல் (Clear & Warm)' },
        { id: 'Puck', name: 'முருகன் (Puck)', gender: 'male', tone: 'உற்சாகமான, நேரடியான குரல் (Energetic & Dynamic)' },
        { id: 'Zephyr', name: 'கயல்விழி (Zephyr)', gender: 'female', tone: 'மென்மையான, கதைசொல்லும் குரல் (Gentle & Storyteller)' },
        { id: 'Fenrir', name: 'பாரதி (Fenrir)', gender: 'male', tone: 'கம்பீரமான, செய்தி வாசிப்பாளர் (Authoritative & News Anchor)' },
        { id: 'Charon', name: 'வள்ளுவர் (Charon)', gender: 'male', tone: 'அமைதியான, ஆழ்ந்த ஞானக்குரல் (Calm & Reflective)' },
      ],
    });
  });

  // Text-To-Speech endpoint supporting emotional expressions and vocal bursts
  app.post('/api/tts', async (req: Request, res: Response) => {
    try {
      const { text, voiceName = 'Kore', stylePrompt, emotion = 'natural' } = req.body;

      if (!text || typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({ error: 'உரை தேவைப்படுகிறது (Text is required)' });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY is missing. Please configure it in Settings > Secrets.',
        });
      }

      // Check if vocal bursts or backchanneling are used
      const hasVocalBursts = /<laugh>|<gasp>|<breath>|<sigh>|<whisper>|<chuckle>|\|mhm\||\|yeah\||\|ஆமாம்\||\|அடடா\|/i.test(text);

      // Emotion mappings for rich expression prompts
      const emotionPrompts: Record<string, string> = {
        joyful: 'Spoken with bright happiness, genuine laughter, smiling vocal tone, and warm native Tamil accent.',
        excited: 'High energy, vibrant, expressive, enthusiastic delivery with lively Tamil cadence.',
        calm: 'Serene, peaceful, meditative, slow-paced soothing voice with gentle breathing.',
        dramatic: 'Intense, theatrical, authoritative delivery with dramatic pauses and deep conviction.',
        gentle: 'Soft, tender, compassionate, affectionate bedtime storytelling tone.',
        surprised: 'Curious, astonished, intrigued tone with wide-eyed expressive dynamics.',
        natural: 'Clear, fluent Tamil speaker with authentic pronunciation, accurate intonation, natural pauses, and native accent.',
      };

      const selectedEmotionPrompt = emotionPrompts[emotion] || emotionPrompts.natural;
      const finalStyle = stylePrompt
        ? `${selectedEmotionPrompt} ${stylePrompt}`
        : `${selectedEmotionPrompt} Natural native Tamil speaker with realistic human emotions.`;

      // Select model: gemini-3.8-flash-tts for vocal bursts & custom personas, fallback to gemini-3.8-flash-lite-tts
      const modelsToTry = hasVocalBursts
        ? ['gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts']
        : ['gemini-3.8-flash-lite-tts', 'gemini-3.8-flash-tts'];

      let response: any = null;
      let lastError: any = null;

      for (const model of modelsToTry) {
        try {
          response = await ai.models.generateContent({
            model,
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: text.trim(),
                    speechMetadata: {
                      style: finalStyle,
                    },
                  },
                ],
              },
            ],
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: voiceName || 'Kore',
                  },
                },
              },
            },
          });
          if (response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
            break;
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`TTS Model ${model} failed, trying alternative:`, err?.message || err);
        }
      }

      if (!response) {
        throw lastError || new Error('TTS synthesis failed');
      }

      const audioPart = response.candidates?.[0]?.content?.parts?.find(
        (part: any) => part.inlineData && part.inlineData.data
      );

      const base64Audio = audioPart?.inlineData?.data;

      if (!base64Audio) {
        return res.status(500).json({
          error: 'ஒலி உருவாக்கம் தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும். (Audio generation returned empty result)',
        });
      }

      return res.json({
        audioBase64: base64Audio,
        mimeType: audioPart?.inlineData?.mimeType || 'audio/wav',
        text: text.trim(),
        voiceName,
        hasVocalBursts,
      });
    } catch (error: any) {
      console.error('Error generating Tamil TTS:', error);
      return res.status(500).json({
        error: error?.message || 'தமிழ் ஒலி உருவாக்குவதில் பிழை ஏற்பட்டது (Error synthesizing Tamil speech)',
      });
    }
  });

  // Helper for generating text with resilient fallback and fast timeout
  async function generateTextWithFallback(prompt: string, systemInstruction?: string) {
    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        // Enforce 6-second timeout per attempt to avoid hanging requests during spikes
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout calling ${model}`)), 6000)
        );

        const callPromise = ai.models.generateContent({
          model,
          contents: prompt,
          config: systemInstruction ? { systemInstruction } : undefined,
        });

        const response: any = await Promise.race([callPromise, timeoutPromise]);
        const text = (response.text || '').trim();
        if (text) return text;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} attempt failed:`, err?.message || err);
      }
    }
    throw lastError || new Error('All models failed to respond');
  }

  // Tanglish to Tamil Script Transliteration
  app.post('/api/transliterate', async (req: Request, res: Response) => {
    try {
      const { tanglish } = req.body;
      if (!tanglish || typeof tanglish !== 'string' || !tanglish.trim()) {
        return res.status(400).json({ error: 'Tanglish input is required' });
      }

      try {
        const prompt = `You are an expert Tamil linguistic transliterator. Transliterate the given phonetic Tanglish text (Tamil written in English/Latin letters) into correct, natural Tamil script (தமிழ் எழுத்து).
Retain proper punctuation and spacing.
Do not translate the meaning—strictly transliterate phonetically into accurate Tamil words.
Return ONLY the transliterated Tamil text, without any conversational preamble, notes, or markdown quotes.

Tanglish input:
${tanglish.trim()}`;

        const tamilText = await generateTextWithFallback(
          prompt,
          'You strictly output only the transliterated Tamil script with no extra commentary.'
        );

        return res.json({ tamilText });
      } catch (aiError) {
        console.warn('AI transliteration failed, applying phonetic fallback engine:', aiError);
        const { localPhoneticTransliterate } = await import('./src/utils/tamilTransliterator.ts');
        const fallbackText = localPhoneticTransliterate(tanglish.trim());
        return res.json({ tamilText: fallbackText, isFallback: true });
      }
    } catch (error: any) {
      console.error('Transliteration endpoint error:', error);
      return res.status(500).json({
        error: error?.message || 'Transliteration failed',
      });
    }
  });

  // English to Tamil Translation
  app.post('/api/translate', async (req: Request, res: Response) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({ error: 'Text to translate is required' });
      }

      const prompt = `You are an expert Tamil translator. Translate the following text into natural, idiomatic, spoken and literary Tamil that sounds beautiful and expressive when read aloud by a Text-to-Speech engine.
Ensure proper Tamil sentence structure and vocabulary.
Return ONLY the Tamil translation without any markdown quotes or explanations.

Source text:
${text.trim()}`;

      const tamilText = await generateTextWithFallback(
        prompt,
        'You strictly output only the Tamil translation without markdown quotes or commentary.'
      );

      return res.json({ tamilText });
    } catch (error: any) {
      console.error('Translation error:', error);
      return res.status(500).json({
        error: error?.message || 'Translation failed',
      });
    }
  });

  // Speech Optimization & Tamil Number/Pronunciation Enhancement
  app.post('/api/optimize-speech', async (req: Request, res: Response) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({ error: 'Text is required' });
      }

      const prompt = `You are an expert Tamil phonetics and speech synthesis assistant.
Your task is to take the given Tamil text and optimize it for a Text-to-Speech (TTS) voice synthesizer:
1. Convert any numerals or digits into full Tamil word equivalents (e.g. 100 -> நூறு, 2026 -> இரண்டாயிரத்து இருபத்து ஆறு, 50% -> ஐம்பது சதவீதம், 1st -> முதலாவது).
2. Expand common abbreviations or symbols (e.g. ரூ. -> ரூபாய், கி.மீ -> கிலோமீட்டர், & -> மற்றும்).
3. Add commas or full stops where natural breath pauses belong so speech cadence sounds human.
4. Correct any obvious typing/spelling mistakes in Tamil letters (such as ள/ழ/ல or ர/ற or ண/ன confusion).
Return ONLY the optimized Tamil text ready for speech reading, without explanations.

Input text:
${text.trim()}`;

      const optimizedText = await generateTextWithFallback(
        prompt,
        'You strictly output only the optimized Tamil text with no commentary.'
      );

      return res.json({ optimizedText });
    } catch (error: any) {
      console.error('Optimization error:', error);
      return res.status(500).json({
        error: error?.message || 'Text optimization failed',
      });
    }
  });

  // Download complete project source code as a ZIP archive
  app.get('/api/download-project', async (req: Request, res: Response) => {
    try {
      const { exec } = await import('child_process');
      const zipPath = path.resolve('/tmp', 'kuralvaani-tamil-tts.zip');
      const scriptPath = path.resolve(__dirname, 'create_zip.py');

      exec(`python3 "${scriptPath}" "${__dirname}" "${zipPath}"`, (error) => {
        if (error) {
          console.error('Failed to create zip archive:', error);
          return res.status(500).json({ error: 'Failed to generate zip archive' });
        }
        res.download(zipPath, 'kuralvaani-tamil-tts.zip');
      });
    } catch (err: any) {
      console.error('Download project route error:', err);
      res.status(500).json({ error: 'Failed to package project' });
    }
  });

  // Setup Vite dev server or static file serving
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KuralVaani Tamil TTS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
