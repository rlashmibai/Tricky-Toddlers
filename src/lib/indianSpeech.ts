/**
 * Indian English Text-to-Speech Engine
 * Provides natural, normal-pitched Indian English voice for toddlers and parents.
 * Strictly eliminates artificial, stylish, high-pitched cartoon voices.
 * Uses clear, normal human pitch (1.0), gentle relaxed cadence (0.88-0.90),
 * and pristine en-IN localization that is easy for kids to understand.
 */

let selectedVoiceName: string | null = null;

// Clean text specifically for toddler-friendly, natural speech
export const cleanTextForIndianSpeech = (rawText: string): string => {
  if (!rawText) return '';

  let text = rawText
    // Remove emojis and special non-ASCII symbols
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, ' ')
    // Expand common pediatric & medical honorifics and terms
    .replace(/\bDr\.\s*/gi, 'Doctor ')
    .replace(/\bDr\b/gi, 'Doctor')
    .replace(/\bProf\.\s*/gi, 'Professor ')
    .replace(/\bvs\.\s*/gi, 'versus ')
    .replace(/\bapprox\.\s*/gi, 'approximately ')
    .replace(/\bmins?\b/gi, 'minutes')
    .replace(/\bsecs?\b/gi, 'seconds')
    .replace(/\btbsp\b/gi, 'tablespoons')
    .replace(/\btsp\b/gi, 'teaspoons')
    .replace(/\bkg\b/gi, 'kilograms')
    .replace(/\bgm\b|\bg\b/gi, 'grams')
    .replace(/\bml\b/gi, 'milliliters')
    // Remove parentheses and brackets but keep contents smoothly
    .replace(/[\(\)\[\]\{\}]/g, ', ')
    // Replace slashes and hyphens with spaces or commas
    .replace(/[\/\\|~^_*#]/g, ' ')
    // Clean multiple punctuation and whitespace
    .replace(/\s*([.,!?;:])\s*/g, '$1 ')
    .replace(/\s+/g, ' ')
    .trim();

  return text;
};

/**
 * Returns all detected English voices with Indian localization.
 * Strictly filters OUT non-English voices (e.g. Hindi, Tamil, Telugu)
 * so English text is never fed to a non-English acoustic model.
 */
export const getAvailableIndianVoices = (): SpeechSynthesisVoice[] => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];

  const voices = window.speechSynthesis.getVoices() || [];
  if (voices.length === 0) return [];

  // Filter ONLY voices that are English and Indian
  const indianVoices = voices.filter(v => {
    const lang = (v.lang || '').toLowerCase().replace('_', '-');
    const name = (v.name || '').toLowerCase();

    // Must NOT be a purely non-English language
    const nonEnglishLangs = ['hi-', 'ta-', 'te-', 'mr-', 'bn-', 'kn-', 'gu-', 'ml-', 'pa-', 'ur-'];
    if (nonEnglishLangs.some(prefix => lang.startsWith(prefix))) {
      return false;
    }

    const isIndianLangTag = lang === 'en-in' || lang.startsWith('en-in');
    const hasIndianName = /india|indian|heera|neerja|veena|rishi|kavya|prabhat|ravi|lekha/i.test(name);
    const isEnglish = lang.startsWith('en') || name.includes('english');

    return (isIndianLangTag || (isEnglish && hasIndianName));
  });

  return indianVoices;
};

export const getIndianEnglishVoice = (): SpeechSynthesisVoice | null => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices() || [];
  if (voices.length === 0) return null;

  const indianVoices = getAvailableIndianVoices();

  // If user explicitly picked a voice
  if (selectedVoiceName) {
    const custom = indianVoices.find(v => v.name === selectedVoiceName) ||
                   voices.find(v => v.name === selectedVoiceName);
    if (custom) return custom;
  }

  if (indianVoices.length > 0) {
    // Priority order for the highest-clarity, most natural Indian English voices:
    // 1. Natural cloud/edge voices (Neerja, Heera, Prabhat)
    // 2. Google English (India)
    // 3. Apple/iOS natural voices (Veena, Rishi, Kavya)
    const topNatural = indianVoices.find(v => /natural/i.test(v.name) && /neerja|prabhat|heera/i.test(v.name)) ||
                       indianVoices.find(v => /google/i.test(v.name) && /india/i.test(v.name)) ||
                       indianVoices.find(v => /heera|neerja|veena|rishi|kavya/i.test(v.name)) ||
                       indianVoices[0];
    return topNatural;
  }

  // Fallback: If OS has no en-IN voice pre-installed, pick standard clear English voice
  // without cartoon modulation
  const fallbackEn = voices.find(v => v.lang.startsWith('en') && /natural|google/i.test(v.name)) ||
                     voices.find(v => v.lang.startsWith('en')) ||
                     null;

  return fallbackEn;
};

export const setSelectedIndianVoice = (voiceName: string) => {
  selectedVoiceName = voiceName;
};

export const getSelectedIndianVoiceName = (): string => {
  const current = getIndianEnglishVoice();
  return current ? current.name : 'System Default (Indian English)';
};

// Listen for browser voice population
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    getIndianEnglishVoice();
  };
}

// Global voice state for Toddler Academy and interactive lessons
let isVoiceMutedState = false;
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('toddler_academy_voice_muted');
  if (saved !== null) {
    isVoiceMutedState = saved === 'true';
  }
}

export const isVoiceMuted = (): boolean => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('toddler_academy_voice_muted');
    if (saved !== null) {
      isVoiceMutedState = saved === 'true';
    }
  }
  return isVoiceMutedState;
};

export const setVoiceMuted = (muted: boolean): void => {
  isVoiceMutedState = muted;
  if (typeof window !== 'undefined') {
    localStorage.setItem('toddler_academy_voice_muted', String(muted));
    if (muted) {
      stopIndianSpeech();
    }
    window.dispatchEvent(new CustomEvent('toddler_voice_toggle', { detail: { muted } }));
  }
};

export const toggleVoiceMute = (): boolean => {
  const next = !isVoiceMuted();
  setVoiceMuted(next);
  return next;
};

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

/**
 * Speak text in normal, clear Indian English without stylish or squeaky distortion.
 * - Pitch: 1.0 (standard human conversational pitch; strictly prevents cartoon squeakiness)
 * - Rate: 0.88 - 0.90 (relaxed, clear pacing that kids and toddlers can easily understand)
 * - Lang: en-IN
 */
export const speakIndianEnglish = (text: string, options?: SpeakOptions) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  // If voice is muted by parent, do not synthesize speech
  if (isVoiceMuted()) return;

  // Always cancel preceding speech to prevent stuttering/overlap
  window.speechSynthesis.cancel();

  const clean = cleanTextForIndianSpeech(text);
  if (!clean) return;

  const utterance = new SpeechSynthesisUtterance(clean);
  
  // Set Indian English localization tag
  utterance.lang = 'en-IN';

  const voice = getIndianEnglishVoice();
  if (voice) {
    utterance.voice = voice;
  }

  // Normal human pitch: exactly 1.0 (no stylish or high-pitched modulation)
  utterance.pitch = options?.pitch ?? 1.0;

  // Easy-to-understand, gentle kid pace
  utterance.rate = options?.rate ?? 0.88;

  utterance.volume = options?.volume ?? 1.0;

  if (options?.onStart) utterance.onstart = options.onStart;
  if (options?.onEnd) utterance.onend = options.onEnd;
  if (options?.onError) utterance.onerror = options.onError;

  window.speechSynthesis.speak(utterance);
};

export const stopIndianSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const isSpeechSynthesizing = (): boolean => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  return window.speechSynthesis.speaking;
};
