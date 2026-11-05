/**
 * Robust phonetic Tanglish (Tamil in English letters) to Tamil script transliterator
 * Used as an ultra-fast local fallback and pre-processor.
 */

const DICTIONARY: Record<string, string> = {
  vanakkam: 'வணக்கம்',
  nandri: 'நன்றி',
  eppadi: 'எப்படி',
  irukkeenga: 'இருக்கீங்க',
  irukinga: 'இருக்கீங்க',
  irukeenga: 'இருக்கீங்க',
  irukkiren: 'இருக்கிறேன்',
  nanba: 'நண்பா',
  nanbargale: 'நண்பர்களே',
  tamil: 'தமிழ்',
  thamizh: 'தமிழ்',
  thamil: 'தமிழ்',
  ungal: 'உங்கள்',
  peyar: 'பெயர்',
  enna: 'என்ன',
  enge: 'எங்கே',
  eppodhu: 'எப்போது',
  kaalai: 'காலை',
  maalai: 'மாலை',
  iravu: 'இரவு',
  nalvaravu: 'நல்வரவு',
  vaazhthukkal: 'வாழ்த்துகள்',
  valthukal: 'வாழ்த்துகள்',
  vaalthukal: 'வாழ்த்துகள்',
  magizhchi: 'மகிழ்ச்சி',
  romba: 'ரொம்ப',
  nalla: 'நல்லா',
  nalladhu: 'நல்லது',
  arputham: 'அற்புதம்',
  kuralvaani: 'குரல்வாணி',
  kural: 'குரல்',
  pesu: 'பேசு',
  pesunga: 'பேசுங்க',
  ketka: 'கேட்க',
  padikka: 'படிக்க',
  aamaam: 'ஆமாம்',
  illai: 'இல்லை',
  seri: 'சரி',
  anbu: 'அன்பு',
  arivu: 'அறிவு',
  vetri: 'வெற்றி',
  amaithi: 'அமைதி',
  ulagam: 'உலகம்',
  naadu: 'நாடு',
  manidhan: 'மனிதன்',
  vidamuyarchi: 'விடாமுயற்சி',
  indha: 'இந்த',
  andha: 'அந்த',
  idhu: 'இது',
  adhu: 'அது',
  ennudaiya: 'என்னுடைய',
  ungaludaiya: 'உங்களுடைய',
};

// Syllable mappings
const VOWELS: Record<string, string> = {
  aa: 'ஆ',
  a: 'அ',
  ii: 'ஈ',
  ee: 'ஈ',
  i: 'இ',
  uu: 'ஊ',
  oo: 'ஊ',
  u: 'உ',
  ea: 'ஏ',
  ae: 'ஏ',
  e: 'எ',
  ai: 'ஐ',
  oa: 'ஓ',
  o: 'ஒ',
  au: 'ஔ',
  ow: 'ஔ',
};

const VOWEL_SIGNS: Record<string, string> = {
  aa: 'ா',
  a: '',
  ii: 'ீ',
  ee: 'ீ',
  i: 'ி',
  uu: 'ூ',
  oo: 'ூ',
  u: 'ு',
  ea: 'ே',
  ae: 'ே',
  e: 'ெ',
  ai: 'ை',
  oa: 'ோ',
  o: 'ொ',
  au: 'ௌ',
  ow: 'ௌ',
};

const CONSONANTS: Record<string, string> = {
  zh: 'ழ்',
  sh: 'ஷ்',
  th: 'த்',
  dh: 'த்',
  ch: 'ச்',
  nj: 'ஞ்',
  ng: 'ங்',
  nd: 'ண்ட்',
  nt: 'ந்த்',
  k: 'க்',
  g: 'க்',
  s: 'ஸ்',
  j: 'ஜ்',
  t: 'ட்',
  d: 'ட்',
  n: 'ன்',
  p: 'ப்',
  b: 'ப்',
  m: 'ம்',
  y: 'ய்',
  r: 'ர்',
  l: 'ல்',
  v: 'வ்',
  w: 'வ்',
  h: 'ஹ்',
  L: 'ள்',
  R: 'ற்',
  N: 'ண்',
};

export function localPhoneticTransliterate(text: string): string {
  if (!text || !text.trim()) return text;

  // Process words
  return text
    .split(/(\s+|[.,!?;:"'()\[\]{}]+)/)
    .map((token) => {
      if (!token || /^\s+$/.test(token) || /^[.,!?;:"'()\[\]{}]+$/.test(token)) {
        return token;
      }

      const lower = token.toLowerCase();
      // Check direct dictionary
      if (DICTIONARY[lower]) {
        return DICTIONARY[lower];
      }

      // Check if already Tamil characters
      if (/[\u0B80-\u0BFF]/.test(token)) {
        return token;
      }

      // Rule-based syllable transliteration
      let result = '';
      let i = 0;
      const str = lower;

      while (i < str.length) {
        // Look for 2-char consonant
        const twoCharCons = str.substring(i, i + 2);
        const oneCharCons = str.substring(i, i + 1);

        let cons = '';
        let consLen = 0;

        if (CONSONANTS[twoCharCons]) {
          cons = CONSONANTS[twoCharCons];
          consLen = 2;
        } else if (CONSONANTS[oneCharCons]) {
          cons = CONSONANTS[oneCharCons];
          consLen = 1;
        }

        if (cons) {
          // Look for vowel following consonant
          i += consLen;
          const nextTwo = str.substring(i, i + 2);
          const nextOne = str.substring(i, i + 1);

          let sign = '';
          let vowelLen = 0;

          if (VOWEL_SIGNS[nextTwo] !== undefined) {
            sign = VOWEL_SIGNS[nextTwo];
            vowelLen = 2;
          } else if (VOWEL_SIGNS[nextOne] !== undefined) {
            sign = VOWEL_SIGNS[nextOne];
            vowelLen = 1;
          }

          if (vowelLen > 0) {
            // Combine consonant base + vowel sign
            const pureBase = cons.replace('்', '');
            result += pureBase + sign;
            i += vowelLen;
          } else {
            // Standalone consonant with virama (pulli)
            result += cons;
          }
        } else {
          // Look for independent vowel
          const twoVowel = str.substring(i, i + 2);
          const oneVowel = str.substring(i, i + 1);

          if (VOWELS[twoVowel]) {
            result += VOWELS[twoVowel];
            i += 2;
          } else if (VOWELS[oneVowel]) {
            result += VOWELS[oneVowel];
            i += 1;
          } else {
            // Keep non-matching character as is
            result += str[i];
            i++;
          }
        }
      }

      return result || token;
    })
    .join('');
}
