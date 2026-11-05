# KuralVaani (குரல்வாணி) - Tamil Text to Speech Studio

An advanced, full-stack Tamil Text-to-Speech (TTS) studio featuring multiple male and female native Tamil voice options, emotional expressions (vocal bursts like laughs, gasps, breaths), Tanglish-to-Tamil transliteration, English-to-Tamil translation, audio visualizer, and direct WAV audio file export.

---

## 🚀 Quick Start on Local Machine

### 1. Prerequisites
- **Node.js**: Version 18 or higher (Node 20+ LTS recommended). Download from [nodejs.org](https://nodejs.org/).
- **npm**: Comes bundled with Node.js.
- **Gemini API Key**: Obtain a free API key from [Google AI Studio](https://aistudio.google.com/apikey).

---

### 2. Installation Steps

1. **Download or Clone the Repository**:
   ```bash
   git clone <your-repository-url>
   cd <project-folder>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root by copying the template:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and paste your Gemini API key:
   ```env
   GEMINI_API_KEY="AIzaSy..."
   PORT=3000
   ```

4. **Start the Local Development Server**:
   ```bash
   npm run dev
   ```

5. **Open in Your Browser**:
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🛠️ Available Scripts

- `npm run dev`: Starts the Express full-stack development server with Vite middleware on port 3000.
- `npm run build`: Compiles the React + Vite frontend into the `dist/` production folder.
- `npm run start`: Runs the production server (`NODE_ENV=production tsx server.ts`).
- `npm run lint`: Validates TypeScript types across the project (`tsc --noEmit`).

---

## 🎙️ Key Features

- **Male & Female Tamil Voices**: Choose from distinct personas — கோமதி (Kore), கயல்விழி (Zephyr), முருகன் (Puck), பாரதி (Fenrir), and வள்ளுவர் (Charon).
- **Vocal Bursts & Expressions**: Insert tags like `<laugh>`, `<gasp>`, `<breath>`, `<sigh>`, `<whisper>`, and choose emotional moods (Joyful, Excited, Calm, Dramatic, Gentle).
- **Tanglish to Tamil**: Automatically converts phonetic Tanglish (e.g. `Vanakkam eppadi irukkeenga`) to native Tamil script (`வணக்கம் எப்படி இருக்கீங்க`).
- **WAV Audio Export**: Download synthesized Tamil speech directly as high-fidelity 24kHz `.wav` files.
- **Dual Synthesis Engines**: Switch between Gemini AI Neural voice and offline browser speech synthesis.
