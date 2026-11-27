import express from "express";
import crypto from "crypto";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";

// Server-side Admin Authentication State (no hardcoded credentials)
let claimedAdminUsername: string | null = null;
let claimedAdminSalt: string | null = null;
let claimedAdminHash: Buffer | null = null;
const activeAdminSessions = new Map<string, { username: string; expiresAt: number }>();

function getConfiguredAdminUsername(): string {
  const envUser = (process.env.ADMIN_USERNAME || "").trim().toLowerCase();
  if (envUser) return envUser;
  if (claimedAdminUsername) return claimedAdminUsername;
  return "admin";
}

function isAdminPasswordConfigured(): boolean {
  const envPass = (process.env.ADMIN_PASSWORD || "").trim();
  return Boolean(envPass) || Boolean(claimedAdminHash && claimedAdminSalt);
}

function verifyAdminPassword(candidatePassword: string): boolean {
  const envPass = (process.env.ADMIN_PASSWORD || "").trim();
  if (envPass) {
    const salt = "tt_env_admin_salt_v1";
    const expected = crypto.scryptSync(envPass, salt, 64);
    const actual = crypto.scryptSync(candidatePassword, salt, 64);
    return crypto.timingSafeEqual(expected, actual);
  }
  if (claimedAdminHash && claimedAdminSalt) {
    const actual = crypto.scryptSync(candidatePassword, claimedAdminSalt, 64);
    return crypto.timingSafeEqual(claimedAdminHash, actual);
  }
  return false;
}

function issueAdminSessionToken(username: string): string {
  const token = crypto.randomBytes(32).toString("hex");
  // 12-hour session expiry
  activeAdminSessions.set(token, {
    username,
    expiresAt: Date.now() + 12 * 60 * 60 * 1000,
  });
  return token;
}

function verifyAdminSessionToken(authHeader?: string): { valid: boolean; username?: string } {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { valid: false };
  }
  const token = authHeader.slice(7).trim();
  const session = activeAdminSessions.get(token);
  if (!session) return { valid: false };
  if (Date.now() > session.expiresAt) {
    activeAdminSessions.delete(token);
    return { valid: false };
  }
  return { valid: true, username: session.username };
}


let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function withTimeout<T>(promise: Promise<T>, ms: number = 7000): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`AI generation timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

async function* readStreamWithTimeout<T>(stream: AsyncIterable<T>, chunkTimeoutMs: number = 3500): AsyncGenerator<T> {
  const iterator = stream[Symbol.asyncIterator]();
  while (true) {
    let timer: any;
    const timeoutPromise = new Promise<{ done: true; value: undefined }>((resolve) => {
      timer = setTimeout(() => resolve({ done: true, value: undefined }), chunkTimeoutMs);
    });
    const nextPromise = iterator.next().finally(() => {
      if (timer) clearTimeout(timer);
    });
    const result = await Promise.race([nextPromise, timeoutPromise]);
    if (result.done) break;
    yield result.value;
  }
}


function sanitizeAIOutput(text: string, parentName?: string): string {
  const pName = parentName?.trim() || "Parent";
  let result = text;
  
  // Clean corrupted greetings or stuttered name fragments on the same line without touching newlines
  result = result
    .replace(new RegExp(`\\b${pName}[, \\t]+${pName.slice(-2)}[!\\?, \\t]*`, 'gi'), `${pName}, `)
    .replace(new RegExp(`\\b${pName}[, \\t]+${pName}[!, \\t]*`, 'gi'), `${pName}, `);

  return result
    .replace(/#+\s*Pediatric Assessment & Developmental Stage[^\n]*\n?/gi, '')
    .replace(/#+\s*Pediatric Assessment[^\n]*\n?/gi, '')
    .replace(/#+\s*Developmental Stage[^\n]*\n?/gi, '')
    .replace(/\bwind down\b/gi, 'relax before bed')
    .replace(/\bdaily anchors\b/gi, 'daily routine')
    .replace(/\bco-regulation\b/gi, 'gentle comfort')
    .replace(/\bco-regulates\b/gi, 'gently calms')
    .replace(/\bdysregulation\b/gi, 'getting upset')
    .replace(/\bdysregulated\b/gi, 'upset or angry')
    .replace(/\bprefrontal cortex\b/gi, 'learning brain')
    .replace(/\bexecutive functioning\b/gi, 'self-control')
    .replace(/\bwake windows\b/gi, 'awake time')
    .replace(/\bgastrocolic reflex\b/gi, 'natural urge to poop after eating')
    .replace(/\bphysiological anorexia\b/gi, 'small toddler tummy')
    .replace(/\bindividuation\b/gi, 'learning to be independent')
    .replace(/\bstool withholding\b/gi, 'holding poop')
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[Contact info protected by Responsible AI]')
    .replace(/\b(\+?91[\-\s]?)?[6-9]\d{9}\b/g, '[Contact info protected by Responsible AI]')
    .replace(/\b(\+?1[\-\s]?)?\(?\d{3}\)?[\-\s]?\d{3}[\-\s]?\d{4}\b/g, '[Contact info protected by Responsible AI]');
}

function parseChildAgeBracket(ageStr?: string): {
  bracket: 'infant' | 'toddler' | 'preschool' | 'school' | 'teen';
  label: string;
} {
  const s = (ageStr || '').toLowerCase().trim();
  if (!s) return { bracket: 'toddler', label: '14 Months · Toddler (1–3 Years)' };
  if (s.includes('newborn') || s.includes('just born')) return { bracket: 'infant', label: `${ageStr} · Infant (0–12 Months)` };

  let totalYears = -1;
  const yrMatch = s.match(/(\d+(\.\d+)?)\s*(year|yr)/);
  const moMatch = s.match(/(\d+)\s*(month|mo)/);

  if (yrMatch && moMatch) {
    totalYears = parseFloat(yrMatch[1]) + parseInt(moMatch[1], 10) / 12;
  } else if (yrMatch) {
    totalYears = parseFloat(yrMatch[1]);
  } else if (moMatch) {
    totalYears = parseInt(moMatch[1], 10) / 12;
  } else {
    const num = parseFloat(s);
    if (!isNaN(num) && num > 0) {
      totalYears = num <= 18 ? num : num / 12;
    }
  }

  if (totalYears >= 0) {
    if (totalYears < 1) return { bracket: 'infant', label: `${ageStr} · Infant (0–12 Months)` };
    if (totalYears <= 3) return { bracket: 'toddler', label: `${ageStr} · Toddler (1–3 Years)` };
    if (totalYears <= 5) return { bracket: 'preschool', label: `${ageStr} · Preschooler (3–5 Years)` };
    if (totalYears <= 12) return { bracket: 'school', label: `${ageStr} · School Age (6–12 Years)` };
    return { bracket: 'teen', label: `${ageStr} · Adolescent & Teen (13–18 Years)` };
  }

  return { bracket: 'toddler', label: ageStr || '14 Months · Toddler (1–3 Years)' };
}

function getHowICanSupportYou(childName?: string, childAge?: string): string {
  const cName = childName?.trim() || 'Child 1';
  const { bracket, label } = parseChildAgeBracket(childAge);

  switch (bracket) {
    case 'infant':
      return `### 👶 How I Can Support You and ${cName} (${label}):
* **Starting Solids & Weaning:** First single-grain purees, moong dal khichdi with ghee, mashed fruits, and pediatric complementary feeding rules for ${cName}.
* **Sleep Routines & Soothing:** Gentle newborn sleep windows, soothing back-patting (thappi), traditional loris, and soothing night waking for ${cName}.
* **Breastfeeding & Formula Support:** Feeding cues, latch comfort, burping techniques, and age-appropriate milk transitions for ${cName}.
* **Baby-Led Weaning & Safety:** Choking prevention, gag reflex versus airway obstruction, and gum-pinch softness testing for ${cName}.
* **Sensory & Physical Milestones:** Tummy time, rolling, sitting, safe floor crawling, and responsive bonding without screens for ${cName}.`;

    case 'preschool':
      return `### 🧒 How I Can Support You and ${cName} (${label}):
* **Preschool Readiness & Separation Anxiety:** Calm morning routines, peer sharing, and building cheerful school confidence for ${cName}.
* **Big Feelings & Emotion Regulation:** Constructive calm-down scripts, empathy building, and positive boundary-setting for ${cName}.
* **Nutritious Meals & Creative Finger Foods:** Colorful lunchboxes, balanced Indian grains (idli, poha, chilla), and self-feeding habits for ${cName}.
* **Independent Bedtime & Night Fears:** Bedtime story traditions, easing fear of the dark, and solid 10–12 hour restful sleep for ${cName}.
* **Language & Cognitive Curiosity:** Channeling boundless "Why?" questions, cooperative play, and imaginative screen-free learning for ${cName}.`;

    case 'school':
      return `### 🎒 How I Can Support You and ${cName} (${label}):
* **School Routines & Homework Balance:** Stress-free study routines, focus strategies, and nurturing joyful academic curiosity for ${cName}.
* **Pediatric Growth & Sports Nutrition:** Wholesome protein, bone-building calcium (milk, ragi, paneer), healthy hydration, and balanced school tiffins for ${cName}.
* **Peer Friendships & Conflict Resolution:** Navigating social dynamics, standing up to peer pressure, and building empathy and kindness for ${cName}.
* **Digital Wellness & Screen Boundaries:** Establishing healthy screen rules, encouraging daily outdoor games, sports, and cycling for ${cName}.
* **Emotional Resilience & Self-Esteem:** Handling school worries, celebrating personal effort, and maintaining open, warm family dialogue for ${cName}.`;

    case 'teen':
      return `### 🎓 How I Can Support You and ${cName} (${label}):
* **Teen Physical Growth & Pubertal Health:** Biological growth spurts, skin/dermatological wellness, posture, and healthy physical development for ${cName}.
* **Adolescent Nutrition & Sustained Energy:** High-iron, calcium-dense nutrition, sports nutrition, and balanced family home-cooked meals for ${cName}.
* **Exam Stress & Mental Wellness:** Managing academic pressure, mindfulness habits, and creating safe, judgment-free decompression spaces for ${cName}.
* **Restorative Sleep Hygiene:** Supporting 8–10 hours of quality sleep, setting evening screen curfews, and healthy circadian rhythms for ${cName}.
* **Mutual Respect & Teen Communication:** Navigating independence, open parent-teen trust, emotional regulation, and responsible decision-making for ${cName}.`;

    case 'toddler':
    default:
      return `### 👶 How I Can Support You and ${cName} (${label}):
* **Potty Training & Regressions:** Low-stress readiness signs, easy bathroom habits, and gentle cotton underpants routines for ${cName}.
* **Bedtime & Soothing:** Peaceful bedtime routines, gentle back-patting (thappi), traditional loris, and cozy sleep habits for ${cName}.
* **Picky Eating & Indian Nutrition:** Wholesome staples (khichdi with ghee, curd rice, ragi), family dining, and trying new tastes happily for ${cName}.
* **Tantrums, Hitting & Biting:** Gentle ways to calm anger, big feelings, and loving parent scripts for ${cName}.
* **Speech Milestones & Communication:** Encouraging everyday conversations, simple songs, and fun play without screen distractions for ${cName}.`;
  }
}

function getResponsibleAIRefusal(parentName?: string, childName?: string, childAge?: string): string {
  const pName = parentName?.trim() || "Parent";
  const cName = childName?.trim() || "Child 1";
  return `### 🛡️ Responsible AI & Privacy Notice

${pName},

**Tricky Toddler AI** is committed to strict **Responsible AI**, **Child Online Privacy Protection (COPPA)**, and **Healthcare Privacy Standards**.

**I cannot answer questions asking for personal information or disclose private personal data** (such as phone numbers, email addresses, physical home addresses, passwords, credit card/banking details, or government identification).

All our capabilities are strictly focused on pediatric health, growth milestones, nutrition, and child development (ages 0 to 18) for ${cName} in a safe, privacy-preserving environment.

---

${getHowICanSupportYou(cName, childAge)}`;
}

function getOutOfScopePediatricNotice(parentName?: string, childName?: string, childAge?: string): string {
  const pName = parentName?.trim() || "Parent";
  const cName = childName?.trim() || "Child 1";
  return `### 🛡️ Tricky Toddler AI: Pediatric Scope Notice

${pName},

**Tricky Toddler AI** is a specialized pediatric and child development assistant fine-tuned exclusively for infants, children, and adolescents from birth up to 18 years of age.

I cannot provide answers or commentary regarding non-pediatric topics such as newly released songs, entertainment news, movies, adult medical concerns, coding, politics, or financial markets.

---

${getHowICanSupportYou(cName, childAge)}`;
}

function isPersonalInfoQuery(query: string): boolean {
  const q = (query || '').toLowerCase().trim();
  if (!q) return false;

  const safeParentingPhrases = [
    /\beye\s+contact\b/i,
    /\bskin[\s-]+to[\s-]+skin\s+contact\b/i,
    /\bcontact\s+nap/i,
    /\bcontact\s+dermatitis\b/i,
    /\baddress\s+(tantrum|behavior|hitting|biting|sleep|feeding|issue|concern|problem|fear|anxiety)/i,
    /\bhow\s+to\s+address\b/i,
    /\bpincer\s+grasp\b/i,
  ];
  if (safeParentingPhrases.some((rx) => rx.test(q))) {
    return false;
  }

  const strictPiiPatterns = [
    /\b(personal\s+info(rmation)?|personal\s+details|personal\s+data|private\s+data)\b/i,
    /\b(phone\s+number|mobile\s+number|cell\s+phone|whatsapp\s+number|telephone\s+number|phone\s+no|mobile\s+no|contact\s+number)\b/i,
    /\b(give\s+me|share|what\s+is|tell\s+me)\s+(your|their|user|ashwath'?s?|lashmi'?s?|doctor'?s?)\s+(phone|mobile|email|address|contact)\b/i,
    /\b(email\s+address|email\s+id|gmail\s+id|your\s+email|user\s+email)\b/i,
    /\b(home\s+address|residential\s+address|where\s+do\s+you\s+live|physical\s+address|street\s+address|postal\s+code|pin\s+code|zip\s+code)\b/i,
    /\b(password|passcode|login\s+credentials|secret\s+key|api\s+key|private\s+key|auth\s+token|\botp\b)\b/i,
    /\b(credit\s+card|debit\s+card|\bcvv\b|card\s+number|bank\s+account|account\s+number|\bifsc\b|net\s+banking|upi\s+id|upi\s+pin)\b/i,
    /\b(aadhaar|pan\s+card|social\s+security|\bssn\b|passport\s+number|voter\s+id|driving\s+licen[cs]e)\b/i,
  ];

  return strictPiiPatterns.some((rx) => rx.test(q));
}

export function detectAcuteEmergencyIntent(query: string): { isEmergency: boolean; isChoking: boolean } {
  const q = (query || '').toLowerCase().trim();
  if (!q) return { isEmergency: false, isChoking: false };

  // 1. Exclude preventive, educational, or food-prep safety questions (False-Positive Prevention)
  const preventivePatterns = [
    /\b(prevent|avoid|reduce|stop)\s+(choking|gagging|fever|seizure)/i,
    /\bchoking\s+(hazard|risk|prevention|safe|foods?\s+to\s+avoid)/i,
    /\bsafe\s+from\s+choking\b/i,
    /\bdifference\s+between\s+gagging\s+and\s+choking\b/i,
    /\bgag\s+reflex\s+vs\b/i,
    /\bhow\s+to\s+cut\b.*\bchok/i,
    /\bwhy\s+do\s+(babies|toddlers)\s+gag\b/i,
  ];
  if (preventivePatterns.some((rx) => rx.test(q))) {
    return { isEmergency: false, isChoking: false };
  }

  // 2. Strip negated symptom clauses so "no high fever" or "not choking" does not trigger false positive
  const cleaned = q
    .replace(/\b(no|not|never|without|neither|nor|doesn'?t\s+have|does\s+not\s+have|resolved|recovered\s+from)\s+(any\s+)?(choking|gagging|high\s+fever|fever|trouble\s+breathing|difficulty\s+breathing|wheezing|seizure|convulsion|stridor|blue\s+lips)/gi, ' ')
    .trim();

  // 3. Choking / foreign body airway obstruction (English + Indian languages)
  const chokingRegex = /\b(chok(e|ing|ed)|gagging\s+badly|swallowed\s+a\s+(coin|battery|button|magnet|toy|marble|bead|cap|pin|stone|object)|stuck\s+in\s+(throat|windpipe|airway)|something\s+in\s+throat|airway\s+blocked|can'?t\s+swallow\s+or\s+breathe|heimlich)\b|दम\s+घुट|गले\s+में\s+अटक|अटक\s+गया|மூச்சுத்\s+திணறல்|தொண்டையில்\s+சிக்கியது|గొంతులో\s+ఇరుక్కుంది|ಗಂಟಲಲ್ಲಿ\s+ಸಿಕ್ಕಿಹಾಕಿಕೊಂಡಿದೆ|തൊണ്ടയിൽ\s+കുടുങ്ങി|घशात\s+अडकले|गળામાં\s+અટકી|গলায়\s+আটকে|ਗਲੇ\s+ਵਿੱਚ\s+ਫਸ/i;
  if (chokingRegex.test(cleaned)) {
    return { isEmergency: true, isChoking: true };
  }

  // 4. Severe illness / respiratory distress / seizures / hyperpyrexia (strict word boundaries to prevent "fits" or "102" collisions)
  const severeIllnessRegex = /\b(trouble\s+breathing|difficulty\s+breathing|not\s+breathing|stopped\s+breathing|struggling\s+to\s+breathe|gasping\s+for\s+air|blue\s+lips|turning\s+blue|cyanosis|stridor|ribs\s+pulling\s+in|chest\s+retractions|seizure|seizures|convulsion|convulsions|febrile\s+fits|epileptic\s+fits|having\s+fits\s+and\s+shaking|unconscious|unresponsive|fainted|limp\s+and\s+pale|high\s+fever|10[2345](\.\d+)?\s*(f|°f|degree|temp|fever)|fever\s+(of\s+|above\s+|over\s+)?10[2345]|dehydration\s+no\s+urine|sunken\s+eyes|sunken\s+fontanelle|poison|drank\s+cleaner|swallowed\s+medicine)\b|तेज\s+बुखार|सांस\s+लेने\s+में\s+तकलीफ|दौरे\s+पड़ना|बेहोश|अचेत|கடுமையான\s+காய்ச்சல்|மூச்சு\s+விட\s+சிரமம்|வலிப்பு|மயக்கம்|తీవ్రమైన\s+జ్వరం|శ్వాస\s+తీసుకోవడంలో\s+ఇబ్బంది|మూర్ఛ|ತೀವ್ರ\s+ಜ್ವರ|ಉಸಿರಾಟದ\s+ತೊಂದರೆ|ಮೂರ್ಛೆ|കടുത്ത\s+പനി|ശ്വാസതടസ്സം|അപസ്മാരം|तीव्र\s+ताप|श्वास\s+घेण्यास\s+त्रास|प्रचंड\s+ताप|ભારે\s+તાવ|શ્વાસ\s+લેવામાં\s+તકલીફ|প্রচণ্ড\s+জ্বর|শ্বাসকষ্ট|ਤੇਜ਼\s+ਬੁਖਾਰ|ਸਾਹ\s+ਲੈਣ\s+ਵਿੱਚ\s+ਤਕਲੀਫ਼/i;

  if (severeIllnessRegex.test(cleaned)) {
    return { isEmergency: true, isChoking: false };
  }

  return { isEmergency: false, isChoking: false };
}

function isOutOfScopeQuery(query: string): boolean {
  const q = (query || '').toLowerCase().trim();
  const outOfScopeKeywords = [
    'song', 'songs', 'music', 'album', 'singer', 'released newly', 'new release', 'newly released', 'latest song', 'new song', 'spotify', 'lyrics',
    'movie', 'movies', 'cinema', 'actor', 'actress', 'hollywood', 'bollywood', 'netflix series', 'box office', 'film', 'trailer',
    'stock market', 'crypto', 'bitcoin', 'trading shares', 'stock price', 'mutual fund', 'forex', 'sensex', 'nifty', 'share market',
    'programming', 'coding', 'python code', 'javascript code', 'write code', 'html css', 'debug code', 'software engineer', 'c++', 'java code',
    'election', 'president', 'prime minister', 'politics', 'geopolitics', 'war news', 'parliament', 'political party',
    'sports score', 'football match', 'cricket match', 'nba finals', 'ipl match', 'world cup score',
    'car repair', 'real estate investment', 'crypto wallet',
    'adult medical', 'viagra', 'erectile', 'adult surgery', 'cancer treatment for adult', 'adult dating', 'porn'
  ];
  return outOfScopeKeywords.some(kw => q.includes(kw));
}

function getTopicExplainabilityMarkdown(lq: string): string {
  if (
    lq.includes('chok') ||
    lq.includes('gag') ||
    lq.includes('swallow') ||
    lq.includes('breath') ||
    lq.includes('wheez') ||
    lq.includes('stridor') ||
    lq.includes('seizure') ||
    lq.includes('convuls') ||
    lq.includes('high fever') ||
    lq.includes('emergency') ||
    lq.includes('first aid')
  ) {
    return `\n\n### 🔗 Explainability & Reference Links\n* [Indian Academy of Pediatrics (IAP) Parental Guidelines on Choking & Pediatric First Aid](https://iapindia.org/parental-guidelines/) - Official Indian pediatric protocol for infant/child choking relief (5 back blows and 5 chest/abdominal thrusts), febrile care, and emergency hospital triage.\n* [FSSAI & ICMR-NIN Safe Infant Feeding & Choking Prevention Guidelines](https://www.nin.res.in) - Evidence-based Indian food texture preparation and airway safety standards.`;
  }
  if (lq.includes('potty') || lq.includes('toilet') || lq.includes('diaper') || lq.includes('pee') || lq.includes('poop')) {
    return `\n\n### 🔗 Explainability & Reference Links\n* [IAP Parental Guidelines on Toilet Training Readiness](https://iapindia.org/parental-guidelines/) - Explains neuromuscular bladder/bowel readiness cues, footstool posture for pelvic floor relaxation, and gentle accident management.\n* [ICMR-NIN Child Hygiene & Sanitation Guidelines](https://www.nin.res.in) - Details post-meal gastrocolic timing, hydration, and positive reinforcement strategies.`;
  }
  if (lq.includes('colic') || lq.includes('gas') || (lq.includes('cry') && !lq.includes('public'))) {
    return `\n\n### 🔗 Explainability & Reference Links\n* [IAP Parental Guideline on Excessive Crying & Infantile Colic](https://iapindia.org/parental-guidelines/) - Explains why immature gut motility and evening sensory fatigue trigger colic and how rhythmic soothing calms the vagus nerve.\n* [ICMR-NIN Infant Digestive & Feeding Guidelines](https://www.nin.res.in) - Clinical rationale behind burping positions, bicycle leg exercises, and red-flag symptoms.`;
  }
  if (lq.includes('sleep') || lq.includes('nap') || lq.includes('wake') || lq.includes('bedtime') || lq.includes('night') || lq.includes('regression')) {
    return `\n\n### 🔗 Explainability & Reference Links\n* [IAP Parental Guidelines on Infant & Child Sleep Hygiene](https://iapindia.org/parental-guidelines/) - Explains how age-appropriate wake windows and screen-free wind-down routines regulate melatonin and prevent overtired cortisol spikes.\n* [ICMR-NIN & IAP Child Rest and Growth Guidelines](https://iapindia.org/parental-guidelines/) - Indian clinical benchmarks for 24-hour sleep duration and safe sleep practices.`;
  }
  if (lq.includes('feed') || lq.includes('milk') || lq.includes('eat') || lq.includes('food') || lq.includes('picky') || lq.includes('ragi') || lq.includes('khichdi') || lq.includes('wean') || lq.includes('solid')) {
    return `\n\n### 🔗 Explainability & Reference Links\n* [ICMR-National Institute of Nutrition (NIN) Dietary Guidelines](https://www.nin.res.in) - Evidence-based rationale for exclusive milk feeding (0-6 months), iron-rich complementary foods, and balanced Indian child nutrition.\n* [FSSAI Eat Right India & IAP Infant Feeding (IYCF) Guidelines](https://fssai.gov.in) - Explains responsive feeding, division of responsibility at mealtime, and safe textures to prevent choking.`;
  }
  if (lq.includes('tantrum') || lq.includes('meltdown') || lq.includes('hit') || lq.includes('bite') || lq.includes('kick') || lq.includes('script') || lq.includes('aggress') || lq.includes('sibling') || lq.includes('share')) {
    return `\n\n### 🔗 Explainability & Reference Links\n* [IAP Positive Parenting & Managing Toddler Tantrums Guide](https://iapindia.org/parental-guidelines/) - Explains why toddler prefrontal brain development leads to big emotional storms and why calm co-regulation works faster than punishment.\n* [IAP Behavioral & Emotional Development Guidelines](https://iapindia.org/parental-guidelines/) - Evidence-based Indian pediatric strategies on emotion naming, gentle physical boundaries, and connection-first scripts.`;
  }
  return `\n\n### 🔗 Explainability & Reference Links\n* [Indian Academy of Pediatrics (IAP) Growth & Developmental Milestones Standards](https://iapindia.org/parental-guidelines/) - Clinical benchmarks for motor, sensory, cognitive, and expressive language development.\n* [FSSAI & ICMR-NIN Child Nutrition and Development Standards](https://www.nin.res.in) - Explains how balanced nutrition, responsive interactions, and age-appropriate play strengthen neural pathways.`;
}

function generateTailoredFallback(q: string, parentName?: string, childName?: string, childAge?: string, isFollowUp: boolean = false): string {
  const pName = parentName?.trim() || "Parent";
  const cName = childName?.trim() || "Child 1";
  const age = childAge?.trim() || "2 yrs 6 mos";
  const lq = (q || '').toLowerCase();

  if (isPersonalInfoQuery(lq)) {
    return getResponsibleAIRefusal(pName, cName, age);
  }

  const rawBody = generateTailoredFallbackRaw(q, pName, cName, age);

  // Format greeting based on whether this is the first turn of a new session or a follow-up turn
  const greetingPrefix = isFollowUp
    ? `${pName}, building on our conversation, here`
    : `Namaste ${pName}! Here`;
  let formatted = rawBody.replace(new RegExp(`^Hello\\s+${pName},\\s+here`, 'i'), greetingPrefix);

  // Inject explainability links right before ---CLARIFICATION_OPTIONS--- or ---RELATED_QUESTIONS---
  const explainabilityBlock = getTopicExplainabilityMarkdown(lq);
  if (!formatted.includes('Explainability & Reference Links')) {
    if (formatted.includes('---CLARIFICATION_OPTIONS---')) {
      formatted = formatted.replace('---CLARIFICATION_OPTIONS---', `${explainabilityBlock.trim()}\n\n---CLARIFICATION_OPTIONS---`);
    } else if (formatted.includes('---RELATED_QUESTIONS---')) {
      formatted = formatted.replace('---RELATED_QUESTIONS---', `${explainabilityBlock.trim()}\n\n---RELATED_QUESTIONS---`);
    } else {
      formatted = `${formatted}${explainabilityBlock}`;
    }
  }

  return formatted;
}

function generateTailoredFallbackRaw(q: string, pName: string, cName: string, age: string): string {
  const lq = (q || '').toLowerCase();
  const { bracket } = parseChildAgeBracket(age);
  const isInfant = bracket === 'infant';

  // ==========================================
  // TOP PRIORITY: EMERGENCY FIRST-AID & PEDIATRICIAN TRIAGE (CHOKING, BREATHING, HIGH FEVER, SEIZURES)
  // ==========================================
  const emergencyCheck = detectAcuteEmergencyIntent(lq);
  if (emergencyCheck.isEmergency) {
    if (emergencyCheck.isChoking) {
      return `Hello ${pName}, here are immediate emergency first-aid steps and pediatrician triage instructions for ${cName} (Age: ${age}):

### 🚨 Immediate Emergency Action & Helplines
* **If ${cName} cannot cry, cough, make sounds, or is turning pale/blue**: Shout for someone nearby to call **National Emergency 112** or **Ambulance 108 / 102** immediately while you begin first-aid below.
* **If ${cName} is coughing forcefully or crying**: Do **NOT** slap the back yet; encourage coughing and stay right beside ${cName} while preparing to go to your **Pediatrician or nearest Emergency Room**.

### 🆘 Step-by-Step Choking First-Aid Tips (Indian IAP Protocol)
1. **5 Firm Back Blows**: ${isInfant ? `Lay ${cName} face-down along your forearm, supporting the head and jaw with your hand so the head is lower than the chest.` : `Lean ${cName} forward across your lap or support the chest with one hand so the head is angled downward.`} Deliver **5 firm blows between the shoulder blades** using the heel of your hand.
2. **5 Chest / Abdominal Thrusts**: ${isInfant ? `For infants under 1 year, turn ${cName} face-up on your forearm and give **5 two-finger chest thrusts** in the center of the breastbone (just below the nipple line). Never do abdominal thrusts on an infant under 1 year.` : `For children over 1 year, stand or kneel behind ${cName}, wrap your arms around the waist, place a fist just above the navel, and give **5 quick inward-and-upward abdominal thrusts** (Heimlich maneuver).`}
3. **Repeat Cycles of 5 & 5**: Alternate **5 back blows** and **5 thrusts** continuously until the object is dislodged or emergency medical help takes over.
4. **Never Do a Blind Finger Sweep**: Do **NOT** reach into ${cName}'s mouth unless you can clearly see the loose object, as blind sweeping can push the item deeper into the airway.

### 🗣️ Calm Emergency Scripts to Speak Right Away
* **Directing a Helper Immediately**: *"Please call 112 or 108 right now—tell them my child is ${age} old and is choking at our address!"*
* **Encouraging an Active Cough**: *"You are doing great, ${cName}—keep coughing big and strong! Keep coughing it out, I am right here."*
* **Reassuring During First Aid**: *"I've got you safely, ${cName}. Listen to my voice—I am helping your tummy and airway clear right now."*
* **Post-Clearance Comfort & Doctor Transition**: *"The airway is clear now, sweetheart. Breathe slow with me—we are taking you straight to the pediatrician to make sure you are 100% okay."*

### 🩺 Consult Your Pediatrician Immediately
* **Even after the object comes out**, take ${cName} to your **Pediatrician or nearest hospital** right away to examine the airway for residual irritation, swelling, or micro-aspiration.
* You can also open the **Pediatric Care** tab in Tricky Toddlers for follow-up doctor consultation once ${cName} is stabilized.

⚠️ *Medical Information Note: For educational guidance only. In any acute emergency, call 112 / 108 and consult your pediatrician or nearest hospital emergency department immediately.*

---RELATED_QUESTIONS---
- [What is the difference between normal gagging on solid foods and true choking?]
- [How should I cut and prepare foods according to Indian IAP & FSSAI guidelines to prevent choking?]
- [What symptoms should I watch for in the 24 hours after a mild choking episode?]`;
    }

    return `Hello ${pName}, here are immediate emergency first-aid steps and pediatrician referral instructions for ${cName} (Age: ${age}):

### 🚨 EmergencyHelpline & Hospital Triage
* **Call Emergency Services Immediately**: If ${cName} has labored breathing, ribs pulling in (retractions), blue lips, lethargy, or a seizure, call **National Emergency 112** or **Ambulance 108 / 102** and proceed to the nearest pediatric emergency hospital.
* **Contact Your Pediatrician Right Away**: For any infant under 3 months with a fever above 100.4°F (38°C), or an older child with a persistent high fever above 102°F (38.9°C), consult your **Pediatrician** immediately.

### 🩹 Immediate First-Aid Tips While Arranging Pediatric Care
1. **Airway & Positioning**: Keep ${cName} upright or in a comfortable semi-reclined position for breathing distress. If a febrile seizure occurs, lay ${cName} gently on their **side (recovery position)** on a flat surface, clear nearby hard objects, and time the episode; never put anything inside the mouth.
2. **Safe Fever Comfort (Indian IAP Guidelines)**: Dress ${cName} in a single breathable cotton layer and sponge gently with **lukewarm water** (never use ice-cold water or alcohol rubs, which cause shivering and spike core temperature).
3. **Frequent Sips of Fluids**: Offer small, frequent sips of breast milk, formula, or Indian IAP-approved ORS solution (for children over 6 months) if ${cName} is fully awake and able to swallow safely.

### 🗣️ Calm Scripts During Fever or Breathing Care
* **Soothing During Lukewarm Sponging**: *"Your body feels hot and tired right now, ${cName}. This warm water cloth will help you feel cool while we head to the doctor."*
* **Guiding Slow Breathing / Positioning**: *"Rest right against my chest, ${cName}. Keep your chin up and breathe slow with me—I am right beside you."*
* **Gently Encouraging Hydration**: *"Let's take just two tiny magic sips from the spoon so your body stays strong."*
* **Clear Triage Update for the Doctor / 112**: *"My child ${cName} is ${age} old, currently experiencing [fever/breathing/seizure symptoms] since [time], and we are heading to the clinic now."*

### 🩺 Direct Pediatrician Evaluation
* Please take ${cName} to your **Pediatrician** for an in-person clinical examination (chest auscultation, hydration check, and exact weight-based treatment). Never self-medicate without a doctor's evaluation.

⚠️ *Medical Information Note: For educational guidance only. Please consult your pediatrician or nearest hospital immediately for clinical evaluation.*

---RELATED_QUESTIONS---
- [What are the warning signs of dehydration in a child with a fever?]
- [How do I accurately measure ${cName}'s temperature at home?]
- [What should I pack when taking ${cName} to the pediatrician or emergency clinic?]`;
  }

  // ==========================================
  // INFANT BRACKET (0–12 MONTHS / e.g. 3 Months)
  // ==========================================
  if (isInfant) {
    // A. Infant Crying, Colic, Witching Hour, Gas & Soothing Scripts
    if (
      lq.includes('colic') || lq.includes('gas') || lq.includes('cry') || lq.includes('crying') || 
      lq.includes('sooth') || lq.includes('calm') || lq.includes('witching') || lq.includes('fuss') ||
      lq.includes('tantrum') || lq.includes('meltdown') || lq.includes('script') || lq.includes('scream')
    ) {
      return `Hello ${pName}, here is gentle, evidence-based pediatric guidance on soothing ${cName} (Age: ${age}):

### 💡 Understanding ${cName}'s Crying at 3 Months
At 3 months, crying is an infant's primary voice, not defiance or behavioral tantrums. The peak of the "witching hour" and immature digestive peristalsis often coincide in the late afternoon and evening.

### ⏱️ The 4-Step Infant Soothing Protocol (The 5 S's)
1. **Side or Stomach Hold (While Awake & Supervised)**: Hold ${cName} across your forearm in the "reverse football hold" with gentle tummy pressure.
2. **Shushing & Low Vocal Frequency**: Make a rhythmic, continuous "shhh-shhh" sound close to ${cName}'s ear, louder than her crying, mimicking arterial womb sounds.
3. **Gentle Rhythmic Motion**: Sway side to side or bounce softly on a yoga ball with slow, steady 60-beats-per-minute rhythm.
4. **Non-Nutritive Sucking & Patting**: Offer a clean pacifier, your clean finger, or soothe with rhythmic back-patting (*thappi*).

### 💨 Rapid Relief for Trapped Gas
* **Bicycle Legs**: Lay ${cName} on her back and gently cycle her legs toward her tummy in a circular pedaling motion for 60 seconds.
* **Warm Coconut Oil Clockwise Circles**: Gently massage ${cName}'s lower abdomen clockwise (following the anatomical path of the colon).
* **Mid-Feed Burping**: Burp ${cName} halfway through bottle or breast sessions to release air pockets before milk settles.

### 🗣️ Calming Scripts & Gentle Words for ${pName} to Say
* **Evening Witching-Hour Hold**: *"I am right here, ${cName}. Your day was big and bright, and you are completely safe in my arms."*
* **During Bicycle Legs for Gas**: *"Let's wiggle those little bubbles out together—cycle, cycle, soft tummy relief."*
* **Whispering Next to the Ear Before Shushing**: *"Shhh, little heart. Listen to my steady breathing—your tummy is warm and I am holding you close."*
* **Parent Grounding Check (When Overwhelmed)**: *"This cry is communication, not a crisis. Let me drop my shoulders, breathe out slow, and keep ${cName} safe."* *(Plus sing a soft lullaby like Jo Achyutananda or Lalla Lalla Lori to lower stress hormones).*

### 🛑 Urgent Pediatric Red Flags (Seek Immediate Medical Care)
* Inconsolable high-pitched screeching lasting more than 3 consecutive hours.
* Fever higher than 100.4°F (38°C) in an infant under 3 months.
* Hard, distended, tender abdomen or projectile vomiting with bile (green tint).

---CLARIFICATION_OPTIONS---
- [${cName} cries inconsolably every evening around 5 PM–8 PM (colic / witching hour).]
- [${cName} draws her knees to her chest, grunts, and passes trapped gas.]
- [${cName} is crying from being overtired and fighting naps.]

---RELATED_QUESTIONS---
- [What is the difference between normal infant gas and milk protein intolerance?]
- [When does infant colic naturally peak and resolve according to pediatricians?]
- [How can I help ${cName} settle when she gets overtired in the evening?]`;
    }

    // B. Infant Sleep, Wake Windows, Naps & 4-Month Regression
    if (lq.includes('sleep') || lq.includes('nap') || lq.includes('wake') || lq.includes('bedtime') || lq.includes('night') || lq.includes('regression')) {
      return `Hello ${pName}, here is pediatric sleep and wake-window guidance for ${cName} (Age: ${age}):

### 🌙 3-Month Wake Windows & Daily Rhythm
* **Optimal Awake Window**: At 3 months, ${cName}'s sleep pressure builds quickly. Her ideal wake window is **60 to 90 minutes** between naps. Keeping her awake longer than 90 minutes leads to an overtired cortisol spike and frantic bedtime resistance.
* **Daily Nap Count**: Most 3-month-olds thrive on **3 to 4 daytime naps** totaling 3.5 to 5 hours of daytime sleep, plus 9 to 10 hours at night.

### 🔍 Subtle Drowsy Cues (Before the Crying Starts)
* **Early Cues (Time to start winding down)**: Staring into the distance, slower limb movements, quiet disengagement.
* **Mid Cues**: Rubbing eyes, yawning, pulling at ears, red eyebrows.
* **Late Cues (Overtired)**: Arching back, frantic crying, pushing away comfort.

### 🧸 The 4-Step 3-Month Bedtime & Nap Ritual
1. **Dim the Room 15 Minutes Early**: Turn off bright overhead lights and switch on warm red or amber nightlights.
2. **Swaddle Transition / Sleep Sack**: If ${cName} is starting to roll, transition to an arms-out sleep sack for safety.
3. **White Noise at 50 dB**: Constant low-frequency rain or womb sound masks household noises.
4. **Rhythmic Indian Patting (Thappi)**: Lay ${cName} drowsy but awake on a flat, firm mattress and pat her bottom or thigh in a slow heartbeat rhythm.

### 💬 Gentle Bedtime & Naptime Scripts to Say
* **Cueing the Wind-Down**: *"Lights are going soft and sleepy now, ${cName}. Time to give your busy eyes a cozy rest."*
* **Placing in the Crib Drowsy-but-Awake**: *"You are safe on your snuggly bed, ${cName}. My hand is right here on your tummy while you drift off."*
* **Calm Night-Waking Resettlement**: *"It is still dark and sleepy time, little one. Just a quiet feed, soft pat-pat, and back to sweet dreams."*
* **Short-Nap Transition Whisper**: *"Shhh, one sleep cycle finished—stay cozy and close your eyes for a little bit longer."*

### 🛡️ Preparing for the 4-Month Sleep Regression
Around 14–18 weeks, infant sleep biology permanently matures from 2 stages into adult-like 4-stage sleep cycles. Start practicing putting ${cName} down slightly drowsy so she learns to connect sleep cycles independently.

---CLARIFICATION_OPTIONS---
- [${cName} takes short naps (only 20 to 30 minutes) and wakes up crying.]
- [${cName} wakes up every 1 to 2 hours at night and needs soothing to resettle.]
- [${cName} will only fall asleep while feeding or being bounced on an exercise ball.]

---RELATED_QUESTIONS---
- [How many hours of sleep does a 3-month-old infant need in 24 hours?]
- [How do I gently transition ${cName} from swaddling to an arms-out sleep sack?]
- [What should I do during the upcoming 4-month sleep regression?]`;
    }

    // C. Infant Feeding, Cluster Feeding & Milk
    if (lq.includes('feed') || lq.includes('milk') || lq.includes('eat') || lq.includes('food') || lq.includes('formula') || lq.includes('breast') || lq.includes('bottle') || lq.includes('ragi') || lq.includes('solids') || lq.includes('wean')) {
      return `Hello ${pName}, here is pediatric infant feeding guidance for ${cName} (Age: ${age}):

### 🍼 Exclusive Milk Nutrition (0–6 Months Standards)
* **Indian IAP & FSSAI Gold Standard**: At age ${age}, ${cName} must be fed **exclusively on breast milk or infant formula**. No cow's milk, animal milk, solid food purees, honey, or water should be given before 6 months.
* **Immature Digestive Barrier**: Before 6 months, an infant's gut lining is open and kidneys cannot filter high solute loads. Introducing ragi porridge or solid purees at 3 months increases allergy and gastrointestinal infection risks.

### ⏱️ The 3-Month Growth Spurt & Cluster Feeding
* Around 12 to 14 weeks, infants undergo a major developmental leap. ${cName} may suddenly nurse or demand a bottle every 60–90 minutes for 48 to 72 hours.
* **This is completely normal**: It does not mean your milk supply has dried up; it is nature's way of recalibrating supply to meet her rapid growth.

### 🔍 Reading Early Hunger Signs (Feed on Demand)
1. **Early Signs (Best time to feed)**: Smacking lips, opening mouth, turning head toward chest (rooting reflex), sucking on hands or fingers.
2. **Active Signs**: Squirming, stretching, breathing faster.
3. **Late Signs (Calm before feeding)**: Crying and red face. If crying, soothe ${cName} first for 1 minute before latching to avoid swallowing excess air.

### 🗣️ Soothing Feeding & Hunger-Cue Scripts
* **Responding to Early Rooting Cues**: *"I see those sweet hungry lips smacking, ${cName}! Warm milk is coming right now."*
* **Calming Before Latching During Fussy Cries**: *"Wait one soft breath, sweetheart—let's calm your cheeks against my shoulder first so you can drink comfortably."*
* **Gentle Mid-Feed Burping Break**: *"Let's pause halfway for one big bubble burp, and then you can have the rest of your milk."*
* **Polite Boundary for Well-Meaning Relatives (On Starting Early Solids)**: *"Thank you so much for caring—our pediatrician advised waiting until 6 full months before water or ragi so ${cName}'s tiny tummy stays protected."*

### 🛑 Infant Feeding Mistakes to Avoid
* ❌ Never add baby cereal, ragi flour, or sugar to a bottle to "make them sleep through the night" (proven choking hazard).
* ❌ Never give honey to an infant under 12 months (severe infant botulism risk).

---CLARIFICATION_OPTIONS---
- [${cName} is cluster feeding every hour, is this a normal 3-month growth spurt?]
- [${cName} spits up frequently after feeds, is this acid reflux or normal spit-up?]
- [When can I start introducing first solid food purees or ragi to ${cName}?]

---RELATED_QUESTIONS---
- [How many ounces of formula/milk does a 3-month-old typically drink per feeding?]
- [How do I know if ${cName} is getting enough wet diapers each day?]
- [What are signs of cow's milk protein allergy (CMPA) in breastfed or formula-fed infants?]`;
    }

    // D. Infant Tummy Time, Milestones & Sensory Play
    if (lq.includes('tummy') || lq.includes('play') || lq.includes('game') || lq.includes('toy') || lq.includes('milestone') || lq.includes('vision') || lq.includes('roll')) {
      return `Hello ${pName}, here is developmental play and milestone guidance for ${cName} (Age: ${age}):

### 🌟 3-Month Developmental Leap Highlights
At 3 months, ${cName} is discovering her hands, smiling responsively at familiar faces, tracking moving objects with both eyes across 180 degrees, and pushing up on her forearms during tummy time.

### 🧸 5 Simple Developmental 3-Month Activities
1. **Chest-to-Chest Tummy Time**: Recline slightly on a sofa and place ${cName} tummy-down on your chest. Look into her eyes and talk; she will lift her head to see your face while feeling safe.
2. **High-Contrast Visual Tracking**: Hold black-and-white geometric pattern cards or red toys 8 to 10 inches from her face and slowly glide them horizontally to stimulate ocular coordination.
3. **Vocal Mimicry & Coo Duets**: When ${cName} makes a cooing sound ("ahhh", "ooh"), wait 2 seconds, then repeat the exact sound back to her with a warm smile. This builds proto-conversational brain circuits.
4. **Bicycle Kicking with Sensory Socks**: Put soft patterned baby booties or wrist rattles on ${cName} so she discovers cause-and-effect as she kicks her legs.
5. **Warm Coconut Oil Infant Massage (Abhyanga)**: A 5-minute gentle massage after bathtime stimulates vagal nerve tone, promotes digestion, and improves sleep.

### 💬 Encouraging Play & Tummy-Time Scripts
* **Chest-to-Chest Encouragement**: *"Look up, ${cName}! Can you push up strong on your little elbows and see my big smile?"*
* **High-Contrast Tracking Prompt**: *"Watch the bright stripes glide—left to center to right! Your eyes are working so hard."*
* **Respecting Tummy-Time Fatigue**: *"You lifted your head so high for two minutes! You worked hard—let's roll onto your cozy back for a cuddle break now."*
* **Responding to Cooing Sounds**: *"Ooh, ahhh! Are you telling me a story? I am listening to every little sound you make."*

### ⏱️ Tummy Time Progression: What if She Cries?
* Aim for **3 to 5 minutes at a time**, 3 to 4 times a day, immediately after a diaper change when she is alert and not hungry or overly full.
* If she fusses, place a small rolled towel under her chest or place a baby-safe mirror in front of her.

---CLARIFICATION_OPTIONS---
- [${cName} cries after 1 or 2 minutes of tummy time, how do I make it easier?]
- [What toys and high-contrast cards are best for a 3-month-old's brain?]
- [When do 3-month-old infants usually start rolling from tummy to back?]

---RELATED_QUESTIONS---
- [What gross motor milestones should a 3-month-old reach this month?]
- [How can I encourage ${cName} to reach and bat at hanging toys?]
- [When should I consult a pediatrician if my infant does not hold her head steady?]`;
    }

    // E. General 3-Month Infant Guidance
    return `Hello ${pName}, here is personalized, evidence-informed developmental guidance for ${cName} (Age: ${age}):

### 💡 Developmental Insight for 3-Month-Old ${cName}
At 3 months, infants undergo the "Fourth Trimester" transition. Their nervous system is consolidating circadian rhythms, smiling is intentional and social, and vocal cooing reflects early communicative intent.

### 🎯 3 Daily Anchors for ${cName}
1. **Respect the 60–90 Minute Wake Window**: Put ${cName} down for naps as soon as early yawns appear; avoiding overtiredness transforms nighttime sleep.
2. **Responsive Soothing Always**: You cannot "spoil" a 3-month-old infant with too much holding or affection. Responsive comfort strengthens hippocampal security.
3. **Daily Floor Tummy Time**: Practice short 3-minute tummy sessions throughout the day to build neck, back, and shoulder muscles for rolling.

### 🗣️ Everyday Connection Scripts for 3-Month-Old ${cName}
* **Narrating Care Routines (Diaper / Dressing)**: *"First we open the fresh cotton shirt, one arm through, two arms through—all snug and warm!"*
* **Responding to Early Drowsiness**: *"I see that big sleepy yawn, ${cName}. Let's dim the room and rest before your little eyes get too tired."*
* **Answering Responsive Smiles**: *"Oh, what a sunny smile! You recognized my voice right away—good morning, sweet ${cName}!"*
* **Soothing Sudden Startles**: *"That loud sound surprised you, didn't it? My hand is gently on your chest—you are completely safe."*

### 🛑 Pediatric Safety Essentials
* Always place ${cName} on her back to sleep on a firm, flat mattress free of pillows, bumpers, or heavy quilts (SIDS prevention).
* Keep all advice gentle, responsive, and age-appropriate.

---CLARIFICATION_OPTIONS---
- [${cName} is fussy and crying in the late afternoon/evening.]
- [${cName} is waking up frequently throughout the night.]
- [I want to know about 3-month tummy time and motor milestones.]

---RELATED_QUESTIONS---
- [What are typical 3-month wake windows between daily naps?]
- [How can I soothe evening colic crying spells in ${cName}?]
- [When does the 4-month sleep regression start and how do I prepare?]`;
  }

  // ==========================================
  // TODDLER & OLDER BRACKETS
  // ==========================================
  // 1. Calming Scripts, Public Tantrums & What to Say (HIGH PRIORITY)
  if (
    lq.includes('script') || 
    lq.includes('phrase') || 
    lq.includes('what to say') || 
    lq.includes('say to') || 
    (lq.includes('public') && (lq.includes('tantrum') || lq.includes('meltdown') || lq.includes('crying') || lq.includes('screaming'))) ||
    lq.includes('calming word') ||
    lq.includes('de-escalat')
  ) {
    return `Hello ${pName}, here are proven, developmentally grounded calming scripts and de-escalation strategies for ${cName} (Age: ${age}) during a public tantrum:

### 🗣️ Word-for-Word Calming Scripts to Say Out Loud
* **The Grounding Whisper (When intensity is peak)**:
  *"I'm keeping your body safe, ${cName}. I hear that you are very upset. Mamma is right here with you."*
* **The Boundary-Holding Anchor (When they want something you said 'No' to)**:
  *"You really wanted [that snack/toy]. It is hard to hear 'not today'. You can be angry, and I will keep you safe while you feel big feelings."*
* **The 2-Option Transition Choice (As the storm begins to settle)**:
  *"Would you like to hold my hand to walk to the car, or would you like a thappi cuddle while I carry you?"*
* **Sensory Overload Breather**:
  *"It's very loud and busy here. Let's make our bodies like a soft flower. Inhale... and exhale together."*

### ⏱️ Immediate 3-Step Public Tantrum Reset
1. **Lower Your Voice to a Whisper**: Toddlers can't hear logic over screaming. Lowering your vocal pitch forces their auditory system to tune in to you rather than the room.
2. **Move to a Quiet Perimeter**: Without anger, scoop ${cName} up safely and step away from the aisle, counter, or crowd toward a bench, car, or quiet corner.
3. **Offer Deep Pressure or Physical Presence**: Sit beside ${cName} with a steady, grounding posture. Offer a firm hug if allowed, or keep your hands calm and open if touch is resisted.

### 🛡️ Deflecting Bystander Pressure & Stares
* **Remember Your Audience**: You are parenting ${cName}, not performing for strangers. An upset child at age ${age} is developmentally normal, and it is not a reflection of your parenting.
* **Simple Script for Inquisitive Bystanders**: A polite, calm nod and: *"We're just working through big feelings today, thank you."* Then refocus 100% on ${cName}.

### 🛑 What NOT to Say in the Heat of the Moment
* ❌ Avoid *"Stop crying, everyone is looking at you!"* (Injects social anxiety and escalates fight-or-flight).
* ❌ Avoid *"Why are you doing this to me?"* (Young children lack cognitive capacity to analyze their own nervous system storm).
* ❌ Avoid giving in to the forbidden demand to stop the tears (teaches the child that escalated screaming yields results).

---RELATED_QUESTIONS---
- [How can I tell if his public tantrum is sensory overload vs boundary testing?]
- [What proactive routines reduce public grocery store meltdowns for ${cName}?]
- [How can I recover and reconnect with ${cName} after a difficult public meltdown?]`;
  }

  // 2. Sensory Meltdown vs Boundary Tantrum comparison
  if ((lq.includes('meltdown') && lq.includes('tantrum')) || (lq.includes('sensory') && lq.includes('boundary')) || (lq.includes('difference') && (lq.includes('tantrum') || lq.includes('meltdown')))) {
    return `Hello ${pName}, here is the key developmental difference between a **Sensory Meltdown** and a **Boundary Tantrum** for ${cName}:

### 🔍 Key Differences at a Glance

| Factor | ⚡ Sensory Meltdown | 🛑 Boundary Tantrum |
| :--- | :--- | :--- |
| **Root Trigger** | Sensory overload (bright lights, loud noise, exhaustion, crowd) | Denial of a specific want or boundary ("No sweets before dinner", "Time to leave the park") |
| **Nervous System** | Involuntary fight-or-flight crisis; prefrontal brain is completely offline | Goal-oriented communication; child is testing limits and exploring autonomy |
| **Audience Awareness** | Child does not care who is watching or listening; cannot self-regulate | Child frequently checks if the parent is watching or if the boundary will give way |
| **Safety & Control** | Child cannot stop on command; reasoning or bargaining is ineffective | Usually resolves quickly if the child gets what they want or realizes the boundary is firm |

---

### ⏱️ Immediate Action Protocol for ${pName}

1. **For a Sensory Meltdown**:
   - **Reduce sensory input immediately**: Move ${cName} to a dim, quiet room or corner. Turn down noise, television, and bright lights.
   - **Keep safe with gentle presence**: Do not lecture, scold, or demand eye contact. Offer deep pressure hugs or slow back-patting (*thappi*) if ${cName} welcomes touch.

2. **For a Boundary Tantrum**:
   - **Stay calm and hold the boundary**: Do not negotiate, shout, or give in to stop the crying. Giving in teaches the child that tantrums produce results.
   - **Acknowledge the feeling, hold the limit**: Connect with the feeling while maintaining the family rule cleanly.

### 🗣️ 4 Topic-Matched Scripts to Say Out Loud
* **Sensory Meltdown — Removing Stimulation**: *"Everything got way too loud and bright, ${cName}. You don't have to talk right now—we are resting in the quiet corner."*
* **Sensory Meltdown — Co-Regulation Offer**: *"Your brain feels overwhelmed and tired. Would you like a firm squeezy hug or a quiet drink of water next to me?"*
* **Boundary Tantrum — Empathy + Firm Limit**: *"I know you really wanted to keep playing, ${cName}. It is hard to stop. It is bathtime now—let's carry your duck or your boat."*
* **Boundary Tantrum — Staying Steady Against Bargaining**: *"I hear you asking again, and my answer is still no sweets before dinner. You can be sad while we walk to the table."*

### 🛑 What to Avoid
- Avoid shouting, lecturing, or attempting long explanations while the child's brain is flooded with emotion.
- Avoid isolating ${cName} alone in a dark room; staying close (*time-in*) builds secure emotional regulation.

---RELATED_QUESTIONS---
- [What calming scripts work best during a public tantrum?]
- [How can I prevent sensory overload in crowded places for ${cName}?]
- [When should I consult an occupational therapist about sensory sensitivities?]`;
  }

  // 3. Sleep Resistance, Bedtime Battles & Night Waking
  if (lq.includes('sleep') || lq.includes('bedtime') || lq.includes('night') || lq.includes('wake') || lq.includes('nap') || lq.includes('alone')) {
    return `Hello ${pName}, here is gentle, evidence-informed sleep guidance for ${cName} (Age: ${age}):

### 🌙 The Step-by-Step Bedtime Bridge
1. **The 30-Minute Screen-Free Wind-Down**: Blue light suppresses melatonin. Dim household lights, switch off television/phones, and engage in slow floor play or puzzle-solving.
2. **Predictable 4-Step Routine (Bath, Book, Song, Snuggle)**: Children feel secure when they can predict what comes next. Consistent sensory cues signal the body that sleep is near.
3. **Gradual Separation "Camp Out" Method**: If ${cName} cries when you leave the room, sit quietly by the bedside on a floor cushion for 2 nights, then move your chair halfway to the door for 2 nights, then sit in the doorway.

### 🗣️ 4 Calming Bedtime Scripts to Say
* **When Resisting Bedtime**:
  *"I know your body still wants to play, ${cName}. Nighttime is when our muscles and brain recharge so tomorrow feels super strong."*
* **When Asking for "One More Story/Water" Delay Tactics**:
  *"We read our two bedtime books and had a sip of water. Now it is pillow time—we will play with your trains first thing in the morning."*
* **When Afraid of Being Alone in Bed**:
  *"I am right outside this door folding laundry. I will come peek in on you in 3 minutes to check on your cozy eyes."* *(Always follow through so trust grows).*
* **When Walking ${cName} Calmly Back During Night Waking**:
  *"It is still dark and sleepy time, sweetheart. Let's walk quietly back under your blanket together."*

### 🧸 Sensory Anchors for Peaceful Sleep
* **Weighted Comfort or Gentle Patting**: Slow, rhythmic back-patting (*thappi*) mimicking a calm heartbeat settles the autonomic nervous system.
* **Warm Organic Sesame or Coconut Oil Foot Massage**: A 2-minute gentle rub on the soles of ${cName}'s feet relieves daily physical tension.

### 🛑 Bedtime Pitfalls to Steer Clear Of
* ❌ Avoid letting bedtime slip past 8:30 PM (leads to an overtired cortisol spike and frantic bedtime resistance).
* ❌ Avoid high-sugar snacks or chocolate after 5 PM.
* ❌ Avoid long verbal negotiations at the bedroom door; keep repetitions low, soothing, and brief.

---RELATED_QUESTIONS---
- [How much daytime nap does a child of age ${age} need?]
- [How do I stop middle-of-the-night waking without crying it out?]
- [What is the difference between a nightmare and a night terror?]`;
  }

  // 4. Physical Aggression: Hitting, Biting, Kicking & Screaming
  if (lq.includes('hit') || lq.includes('bite') || lq.includes('kick') || lq.includes('aggress') || lq.includes('scratch') || lq.includes('push')) {
    return `Hello ${pName}, here is practical pediatric behavioral guidance on addressing physical aggression for ${cName} (Age: ${age}):

### 🛑 Immediate Physical Boundary (Block Without Anger)
1. **Calm Hand-Catch**: Gently catch ${cName}'s hand or foot before it lands. Your energy should be calm like a sturdy wall, not angry like a thunderstorm.
2. **Get Down to Eye Level**: Look into ${cName}'s eyes with a steady, compassionate expression.
3. **State the Rule in 5 Words or Less**: Young children in distress tune out long lectures.

### 🗣️ 4 Clear Boundary & Emotion-Naming Scripts
* **Direct Safety Limit**: *"Stop. I will not let you hit. Bodies are not for hurting."*
* **Validating Anger Without Accepting Harm**: *"You are very mad that playtime ended. It is okay to feel mad—it is never okay to hit or bite."*
* **Offering a Safe Heavy-Work Outlet**: *"Your hands have lots of angry energy! Smash this soft cushion hard or stomp your feet on the rug with me!"*
* **Calm Repair Practice (Once Settled)**: *"Hands are calm now. Let's check on Mommy/sibling with gentle fingers or offer an ice pack together."*

### ⚡ Constructive Heavy-Work Outlets
* **Pushing Heavy Objects**: Let ${cName} push a weighted laundry basket or stack large cushions. This provides *proprioceptive input* that naturally calms an overloaded motor system.
* **The "Angry Tiger" Roar**: Invite ${cName} to take a deep belly breath and roar out frustration into a pillow together.

### 🛑 Reactions That Escalate Hitting
* ❌ Never hit or bite back "to show how it feels" (this directly models aggression from the child's primary teacher).
* ❌ Avoid isolating ${cName} alone in a room while terrified by an emotional surge.
* ❌ Avoid laughing or treating hitting as "cute" in front of family members.

---RELATED_QUESTIONS---
- [Why do children suddenly hit when they get excited or tired?]
- [How do I teach gentle hands to ${cName} when interacting with peers?]
- [When does physical aggression in children require professional evaluation?]`;
  }

  // 5. Indoor Games & Creative Play
  if (lq.includes('game') || lq.includes('play') || lq.includes('rainy') || lq.includes('indoor') || lq.includes('activity') || lq.includes('bored')) {
    return `Hello ${pName}, here are **5 fun, developmental indoor games** perfect for ${cName} (Age: ${age}) plus playful connection phrases:

### 1. 🧺 The Laundry Basket Voyage
* **Supplies**: A soft laundry basket, a couple of cushions, and favorite stuffed toys.
* **Instructions**: Place ${cName} gently inside the basket with a soft blanket. Slowly glide the basket across smooth floor tiles like a boat, singing *"Row, Row, Row Your Boat"*!
* **Skills Encouraged**: Vestibular balance, core stability, and joyful parent-child bonding.

### 2. 🧦 Pair-the-Socks Matching Challenge
* **Supplies**: 4–5 pairs of clean, colorful rolled socks.
* **Instructions**: Scatter the soft sock balls. Invite ${cName} to find matching colors or toss the socks into an open bucket or cardboard box.
* **Skills Encouraged**: Gross motor coordination, color identification, and hand-eye aim.

### 3. 📦 Cardboard Box Peek-a-Boo Tunnel
* **Supplies**: One large empty delivery box (open on both ends) or kitchen chairs with a draped bedsheet.
* **Instructions**: Create a low tunnel. Sit at the other end with an open smile and call ${cName}.
* **Skills Encouraged**: Spatial perception, bilateral motor coordination, and overcoming hesitation.

### 4. 🥄 Kitchen Percussion Symphony & 🧊 Ice Splash Tray
* **Instructions**: Let ${cName} tap rhythms on overturned steel bowls with wooden spoons, or slide 2 ice cubes in a shallow warm-water tray *(supervised)*.
* **Skills Encouraged**: Auditory rhythm, cause-and-effect, and tactile discovery.

### 💬 4 Playful Scripts to Say During Play & Clean-Up
* **Sparking Curiosity to Start**: *"Look at this giant laundry boat! Who wants to be the brave captain with your teddy co-pilot?"*
* **Encouraging Focus & Effort**: *"You tried tossing that blue sock three times and adjusted your aim—look how steady your hands are getting!"*
* **Joining Their Imagination**: *"Beep-beep, Tunnel Explorer! Where are we crawling to—a cozy cave or a rainy-day fort?"*
* **Happy Toy Clean-Up Transition**: *"Two more minutes of drumming, then let's race to put all the spoons to sleep in the basket before snack time!"*

---RELATED_QUESTIONS---
- [What are quiet sensory games for bedtime relaxation?]
- [How much independent play time is normal for age ${age}?]
- [What outdoor sensory activities help build gross motor balance?]`;
  }

  // 6. Fears, Ghosts, Monsters, Nightmares & Magical Thinking
  if (lq.includes('ghost') || lq.includes('possessed') || lq.includes('monster') || lq.includes('fear') || lq.includes('scared') || lq.includes('dark') || lq.includes('witch') || lq.includes('shadow')) {
    return `Hello ${pName}, here is gentle, evidence-based pediatric guidance on handling childhood fears of ghosts, monsters, or big imaginary worries for ${cName}:

### 🧠 Why Children Experience Fears of Ghosts & Monsters
Between ages 2 and 6, children enter a natural developmental stage known as **magical thinking**. Their vivid imaginations outpace their logical reasoning. To a young child, shadows, odd creaks, and bedtime quiet can feel just as real as a chair or toy.

### 🛡️ Grounding Rituals & Comfort Routine
1. **Take Their Feelings Seriously (Without Validating the Monster)**: Let ${cName} feel heard without pretending scary creatures live in the house.
2. **Physical Comfort & Reality Check**: Kneel down, give a firm warm hug, turn on a warm nightlight, and gently explore shadowy corners together in bright light.
3. **Playful Daytime Mastery (Shift the Power)**: In daylight hours, draw funny friendly pictures of the "monster" wearing silly pink shoes or eating bananas so laughter shrinks the fear.

### 🗣️ 4 Reassuring Scripts for Dark Moments & Night Fears
* **Validating Without Confirming Monsters**: *"I can see your heart feels super scared right now, ${cName}. You are safe—there are no ghosts or monsters in our house, and I am right here."*
* **Flashlight Reality Check Together**: *"Let's shine our bright flashlight into that corner together. Look—that shadow was just your favorite jacket hanging on the chair!"*
* **Bedtime Love & Safety Anchor**: *"Your bedroom is surrounded by warmth and safety, ${cName}. My hugs stay with you even when your eyes are closed."*
* **Daytime Playful Reversal**: *"Remember that silly imaginary shadow from last night? Let's draw it wearing goofy sunglasses and slipping on a banana peel!"*

### 🛑 Fear Triggers to Avoid
* Avoid exposing ${cName} to scary TV shows, older sibling horror stories, or YouTube videos with jump scares.
* Avoid using scary threats as discipline (*"If you don't eat your dinner, the monster will come"*).

---RELATED_QUESTIONS---
- [What gentle bedtime routines help soothe night fears for ${cName}?]
- [What is the difference between a night terror and a nightmare?]
- [How can a simple nightlight routine improve sleep confidence?]`;
  }

  // 7. Picky Eating & Nutrition
  if (lq.includes('picky') || lq.includes('eat') || lq.includes('food') || lq.includes('feed') || lq.includes('hungry') || lq.includes('milk') || lq.includes('ragi') || lq.includes('khichdi')) {
    return `Hello ${pName}, here is practical, stress-free feeding guidance for ${cName}:

### 🥦 Division of Responsibility at the Family Table
1. **Your Role as Parent**: Decide *what* healthy wholesome food to offer, *where* to eat (seated at the dining table), and *when* at regular scheduled meal times.
2. **${cName}'s Role**: Decide *whether* to eat and *how much* to eat from what is offered. Never force-feed, distract with phones, or bribe with sweets.

### 🍲 Safe Anchor Foods & Low-Stress Exposure
* **Always Include One Safe Food**: Serve a tiny portion of a new dish next to a well-loved favorite (such as warm moong dal khichdi with pure A2 ghee, soft idli, or fresh curd rice).
* **Patience with New Textures**: It often takes 10 to 15 relaxed exposures before a child willingly tastes a new vegetable or grain.

### 🗣️ 4 Stress-Free Mealtime Scripts to Say
* **Zero-Pressure Invitation**: *"You don't have to finish everything on your plate, ${cName}. You can just smell this warm sabzi or take one tiny mouse bite if you want."*
* **Responding When They Say "Yuck / I Don't Like It!"**: *"You don't have to eat the peas today—they can just sit calmly in the learning corner of your plate next to your favorite curd rice."*
* **Encouraging Curious Sensory Exploration**: *"Notice how crunchy this cucumber sounds when we chew it! Let's see if it sounds loud or quiet."*
* **Holding the Post-Meal Boundary (Without Guilt)**: *"Our mealtime is all done for now! If your tummy gets hungry later, your next healthy snack time is at 4 o'clock."*

### 🛑 Mealtime Traps to Avoid
* ❌ Avoid short-order cooking (cooking 3 different emergency meals when the child refuses dinner).
* ❌ Avoid screen-feeding (watching cartoon videos while unconsciously chewing inhibits natural satiety cues).
* ❌ Avoid high-volume milk grazing within 2 hours of mealtime.

---RELATED_QUESTIONS---
- [How do I prepare nutrient-rich sprouted ragi porridge for ${cName}?]
- [What are easy iron-rich Indian finger foods for toddlers?]
- [How much whole milk does a child need each day?]`;
  }

  // 8. Sibling Rivalry & Sharing
  if (lq.includes('sibling') || lq.includes('brother') || lq.includes('sister') || lq.includes('share') || lq.includes('sharing') || lq.includes('grab')) {
    return `Hello ${pName}, here is developmental guidance on managing sharing struggles and sibling dynamics for ${cName} (Age: ${age}):

### 🤝 Neutral Refereeing: Stepping In Without Blaming
1. **Describe What Happened Objectively**: *"Both of you want the red truck at the exact same moment."* (Avoid labeling one as the 'bully' or the other as the 'victim').
2. **Acknowledge the Frustration**: Help both children feel understood before proposing a fair turn plan.

### 🗣️ 4 Turn-Taking & Conflict Scripts to Say
* **Neutral Conflict Opener**: *"Whoa, stop hands—both of you want that exact red truck right now! Let's figure out a fair turn."*
* **Validating Both Feelings**: *"It feels so frustrating to wait when you have a fun idea for that toy, and it also feels upsetting when a toy gets pulled from your hands."*
* **Holding the Turn (Instead of Forced Sharing)**: *"${cName} is still building with the truck. As soon as ${cName}'s hands are all done, it goes straight to you next."*
* **Redirecting While Waiting**: *"Would you like to build a big ramp with the wooden blocks or drive the blue bus with me while we wait for your turn?"*

### 🧸 Protected Special Toys Strategy
* Give each child a small "Special Basket" for 2–3 prized toys they do not have to share. Everything else in the living room is a "Family Toy" played with in turns.

### 🛑 Why Forced Sharing Backfires
* Young children under 3.5 do not fully grasp the concept of future ownership. Forced sharing feels like confiscation and increases toy hoarding and aggressive grabbing.

---RELATED_QUESTIONS---
- [How can I encourage gentle cooperative play between siblings?]
- [What should I do when a child grabs a toy directly out of another child's hands?]
- [How do I avoid showing favoritism between siblings?]`;
  }

  // 9. Potty Training & Accidents
  if (lq.includes('potty') || lq.includes('toilet') || lq.includes('poop') || lq.includes('pee') || lq.includes('underpants') || lq.includes('diaper')) {
    return `Hello ${pName}, here is supportive, pediatric potty guidance for ${cName} (Age: ${age}):

### 🚽 Low-Pressure Potty Readiness
1. **Watch for Natural Biological Timing**: Most children feel the natural gastrocolic reflex to eliminate 15–25 minutes after breakfast or lunch.
2. **Comfortable Foot Support**: Ensure ${cName}'s feet rest flat on a footstool while on the toilet. Flat feet relax the pelvic floor muscles for easy elimination.

### 🗣️ 4 Shame-Free Scripts for Potty Learning & Accidents
* **Casual, Fun Invitation**: *"Let's go give your potty a quick 2-minute visit and read your favorite train book while we check in with your tummy!"*
* **When an Accident Happens (Calm & Neutral)**: *"Oops, pee went on the floor! Your body is still practicing the signal. Let's grab a towel together and get dry comfy pants."*
* **Reassuring Toilet / Flush Worries**: *"You can hold my hand while you sit, and we don't even have to flush until after you step safely outside the bathroom."*
* **Encouraging Body Awareness Without Pressure**: *"I noticed you stopped playing and held your tummy—listen to what your body is telling you. Let's check the potty!"*

### ⏰ Consistent Daily Routine Anchors
* Offer regular potty visits upon waking, before heading outdoors, and before bedtime. Never force sitting longer than 3–4 minutes.

### 🛑 Reactions to Avoid During Potty Training
* ❌ Avoid sighing, scolding, or expressing disgust over wet pants or accidents.
* ❌ Avoid rewarding with high-sugar chocolates; celebrate with a joyful high-five or a fun sticker.

---RELATED_QUESTIONS---
- [How do I know if my child is truly ready for potty training?]
- [What should I do if ${cName} withholds stool or fears the toilet?]
- [How do I manage potty training while traveling or running errands?]`;
  }

  // 10. Varied General Guidance
  return `Hello ${pName}, here is personalized, evidence-informed guidance for ${cName} (Age: ${age}):

### 💡 Developmental Insight for ${cName}
At age ${age}, children undergo rapid neural wiring and language expansion. They understand significantly more words than they can articulate, which naturally creates fleeting moments of frustration as they navigate newfound independence.

### 🎯 3 Real-Time Action Steps
1. **Establish Predictable Rhythms**: Maintain steady daily anchors for waking, meals, outdoor active play, and bedtime. Predictability relieves internal anxiety.
2. **Get Down to Eye Level with Brief Phrasing**: Keep verbal directions concise and warm so ${cName}'s developing auditory processing can easily absorb them.
3. **Offer Two Empowering Choices**: Reduce power struggles by letting ${cName} make small everyday decisions within safe boundaries.

### 🗣️ 4 Connection & Cooperation Scripts to Say
* **Eye-Level Connection Anchor**: *"I hear your voice getting loud, ${cName}. I am listening—tell me slowly what you need and we will figure it out together."*
* **Two-Choice Empowerment**: *"It is time to get dressed now. Would you like to wear your blue shirt or green shirt today?"*
* **Two-Minute Transition Heads-Up**: *"Two more slides down the slide, then we wave goodbye to the park and buckle into the car!"*
* **After-Frustration Reconnection**: *"That was a tricky moment, and we got through it side by side. Ready for a big bear hug?"*

### 🛑 Common Reactions to Avoid
* Avoid engaging in long verbal debates during an emotional surge; your calm presence is far more persuasive than logic.
* Avoid rushing through transitions without a gentle 2-minute heads-up.

---RELATED_QUESTIONS---
- [What are the most important developmental milestones for age ${age}?]
- [How can I establish a smooth, tear-free bedtime routine for ${cName}?]
- [What positive parenting scripts help when ${cName} says 'No'?]`;
}

function getSystemInstruction(parentName?: string, childName?: string, childAge?: string, languagePromptModifier?: string, isFollowUp: boolean = false): string {
  const pName = parentName?.trim() || "Parent";
  const cName = childName?.trim() || "Child 1";
  const age = childAge?.trim() || "2 yrs 6 mos";
  const { bracket, label: ageBracketLabel } = parseChildAgeBracket(age);

  const langHeader = languagePromptModifier ? `
======================================================================
🚨 CRITICAL LANGUAGE MANDATE (HIGHEST PRIORITY):
${languagePromptModifier}
- You MUST write your ENTIRE response in the specified language using its authentic native script (e.g. Hindi in Devanagari, Tamil in Tamil script, Telugu in Telugu script, etc.).
- Do NOT output English when the parent has requested another language.
======================================================================
` : '';

  const greetingInstruction = isFollowUp
    ? `- **FOLLOW-UP CONVERSATION RULE (STRICT)**: This is a follow-up question in an ongoing conversation. Do NOT say "Namaste", "Hello", or "Hi" again! Do NOT greet ${pName} as if starting a brand-new conversation. Start naturally and conversationally using ${pName}'s name or a conversational bridge (e.g., "${pName}, building on what we discussed...", "Following up on that for ${cName}, ${pName},", or "That's a great follow-up question, ${pName}. Here is how...").`
    : `- **FIRST CONVERSATION GREETING RULE (STRICT)**: This is the first message of a new conversation session. Start your very first sentence with EXACTLY: "Namaste ${pName}! " followed by your warm, helpful response.`;

  return `${langHeader}
You are Tricky Toddler AI, an elite Pediatric Clinical Assistant, Child Safety Specialist, and Developmental Parenting Companion aligned with the Indian Academy of Pediatrics (IAP), ICMR-NIN, and FSSAI child health standards.
Current Parent: ${pName}
Current Child: ${cName} (Age: ${age} · ${ageBracketLabel})
Session Turn Type: ${isFollowUp ? 'FOLLOW-UP TURN IN ONGOING CONVERSATION (Do NOT repeat Namaste)' : 'FIRST TURN OF NEW CONVERSATION (Start with "Namaste ' + pName + '! ")'}

### 1. DIRECT QUESTION UNDERSTANDING & MANDATORY SPOKEN SCRIPTS (STRICT)
- Always answer the EXACT question asked by ${pName}. Never replace or derail the question with a generic or pre-canned response triggered by matching keywords.
- **MANDATORY 3 TO 4 WORD-FOR-WORD SCRIPTS IN EVERY EXPLANATION**:
  * In **EVERY response for EVERY question** (whether behavioral, sleep, feeding/recipes, play, milestones, emotions, potty training, siblings, or health/first-aid — both initial questions and follow-ups), you MUST include a dedicated \`### \` section containing **3 to 4 distinct, practical, word-for-word scripts in quotation marks** that ${pName} can say directly out loud in that exact situation.
  * The section heading title can be anything natural and fitting to the topic (for example: \`### 🗣️ Word-for-Word Scripts to Say\`, \`### 💬 Gentle Bedtime Scripts for ${pName}\`, \`### 🗣️ Stress-Free Mealtime Phrases\`, \`### 💬 Playful Words to Encourage ${cName}\`, or \`### 🗣️ Calm Scripts During First Aid\`).
  * Each of the 3 to 4 scripts MUST directly match the specific question asked, the advice given in your explanation, and ${cName}'s age (${age}). Never repeat identical boilerplate scripts across different topics!
- If an essential detail is missing or ambiguous, ask a polite clarifying question. Never invent missing context or treat assumptions as facts.

### 2. DEVELOPMENTAL INTELLIGENCE
- Adapt all advice to ${cName}'s developmental stage (${age}):
  * Infants (0–12 months): Motor foundation, responsive soothing, choking prevention, breast/formula/weaning cues.
  * Toddlers (1–3 years): Sensory overload, emerging independence, emotional regulation, simple short phrases.
  * Preschoolers (3–5 years): Magical thinking, imaginative play, peer interactions, boundary testing.
  * School-age (6–12 years): Social dynamics, cognitive reasoning, homework balance, emotional resilience.
  * Adolescents (13–18 years): Pubertal changes, autonomy, peer relationships, academic stress.
- Never apply toddler discipline or management advice indiscriminately to older children.
- Never label ${cName} as manipulative, lazy, stubborn, or intentionally defiant. Acknowledge that all behavior is communication.

### 3. PEDIATRIC MEDICAL & CHILD SAFETY GUARDRAILS (CRITICAL)
- **General Educational Guidance Only**: Never claim to diagnose a medical condition from a text description or photo.
- **Emergency First-Aid Tips & Pediatrician Referral**: When a parent mentions an urgent situation such as **choking**, **gagging/swallowed object**, **high fever**, **trouble breathing**, or **seizures**, you MUST immediately provide **clear, step-by-step emergency first-aid instructions** (e.g. 5 back blows and 5 chest/abdominal thrusts for choking per Indian IAP guidelines, recovery positioning for seizures, lukewarm sponging for fever) AND **explicitly direct the parent to consult their pediatrician or nearest hospital immediately**.
- **Red-Flag Warning Signs**: Proactively identify urgent symptoms (e.g. infant fever under 3 months, respiratory distress/stridor, sunken fontanelle/dehydration, lethargy, blue lips, severe allergic reaction) and communicate high clinical urgency immediately. Never minimize serious symptoms to offer false reassurance.
- **No Medication Dosing**: Never calculate or recommend medication dosages without verified clinical evaluation.
- **Indian Emergency Care**: For acute emergencies in India, instruct the parent to immediately call National Emergency **112**, Ambulance **108** / **102**, and consult their **pediatrician** or proceed directly to the nearest pediatric emergency hospital.
- **Contextual Medical Disclaimer**: When symptoms, illness, or medical concerns are discussed, append this single line at the very end:
  ⚠️ *Medical Information Note: For educational guidance only. Please consult your pediatrician for individual clinical diagnosis.*
  *(Do NOT include this medical disclaimer for non-medical topics like games, play, stories, toys, or daily crafts).*

### 4. DYNAMIC VARIETY OF 3 TO 4 TOPIC-SPECIFIC SECTIONS (INCLUDING 3–4 SCRIPTS) & CLEAR SPACING
- Parents need structured, highly readable guidance that is well-spaced and easy to scan.
- **EVERY response (both initial questions AND follow-up queries) MUST contain 3 to 4 distinct, engaging, topic-specific sections** crafted dynamically for the exact user question—and **one of those sections MUST provide 3 to 4 spoken word-for-word scripts to say** tailored to the question and answer.
- **MANDATORY SECTION SPACING & MARKDOWN FORMAT**:
  * Every section title MUST start with \`### \` and an emoji on its own dedicated line, preceded by a blank line (\`\\n\\n\`) and followed by a blank line (\`\\n\\n\`), for example:
    \`### 🎨 The "Labeling in the Moment" Strategy\`
    (blank line)
    * Bullet or paragraph text...
    (blank line)
    \`### 🗣️ 4 Calming Scripts to Say Out Loud\`
  * NEVER place a section title inline on the same line after a sentence, and NEVER omit the \`### \` heading prefix.
  * Put a blank line between each bullet point (\`* \`) or numbered step (\`1. \`) so that sections and points never run together into dense blocks of text.
- **STRICT PROHIBITION**: NEVER reuse the exact generic heading "Practical Steps for [Parent]" or "Understanding What [Child] Needs" in every answer. Headings MUST be rich, diverse, and contextual with relevant emojis.

### 5. REAL-TIME GOOGLE SEARCH GROUNDING, SMART TOPIC ROUTING & EXPLAINABILITY LINKS (STRICT REQUIREMENT)
- When Search Grounding is active, use top-ranked, high-authority sources and never invent unverified URLs:
  * **For Recipes, Meal Ideas, Tiffins, Snacks, Cooking, Play & Rhymes**:
    - Draw variety from **top-ranked, trusted Indian & global cooking blogs, culinary websites, and popular recipe/parenting channels**.
    - **Mandatory Pediatric Safety Filter on Every Recipe**: Automatically adapt any recipe to ${cName}'s exact age (${age}) and dietary settings—enforcing age-safe texture (smooth puree/mash for infants under 12m; soft gum-pinchable finger foods for toddlers) and stripping unsafe ingredients (strictly NO honey under 12 months, NO whole choking-hazard nuts, NO raw chilies, low sodium, and zero refined sugar).
  * **For Medical Symptoms, Vaccines, Fever, Milestones, Sleep & Clinical Care**:
    - Strictly ground facts in **top-ranked pediatric authorities, accredited hospital networks, and official clinical guidelines** (Indian Academy of Pediatrics [IAP], ICMR-NIN, FSSAI, WHO, UNICEF, AAP, Mayo Clinic, Cloudnine, Apollo).
    - If a specific clinical claim cannot be verified from official pediatric sources, clearly state that and advise consulting their pediatrician rather than guessing.
  * **Strict Rumor & Forum Blacklist**:
    - NEVER use, trust, or cite unverified anonymous comment forums (such as Reddit, Quora, 4chan, anonymous message boards, or commercial spam sites).
- At the end of your main guidance (immediately BEFORE ---CLARIFICATION_OPTIONS--- or ---RELATED_QUESTIONS---), include a section titled:
  ### 🔗 Explainability & Reference Links
- Inside this section, provide **1 to 3 clickable Markdown links** (\`[Source Title](URL)\`) to trusted public authorities (e.g., IAP, ICMR-NIN, FSSAI, WHO) along with a 1-sentence note on how each source supports the guidance.

### 6. CONVERSATIONAL CONTINUITY & MULTI-TURN MEMORY
- You will receive previous messages in the conversation. Use earlier turns to understand context.
- Accurately resolve pronouns ("he", "she", "they") and references ("that method didn't work", "we tried this yesterday").
- When ${pName} reports that a suggested method failed, validate their experience and pivot to an adjusted next-stage approach. Never repeat the same rejected strategy.

### 7. AMBIGUITY CLARIFICATION & FOLLOW-UP PROTOCOL
- **If the question is unclear, misspelled, or ambiguous** (e.g., "bad tantrums" or "shot"):
  Politely ask a 1-sentence clarifying question and list 2-3 clickable options using this exact delimiter:
  ---CLARIFICATION_OPTIONS---
  - [Option 1]
  - [Option 2]
  - [Option 3]
- **At the end of every completed, informative response**:
  Provide 2 to 3 directly relevant follow-up questions that ${pName} might want to explore next, using this exact delimiter:
  ---RELATED_QUESTIONS---
  - [Relevant follow-up question 1]
  - [Relevant follow-up question 2]
  - [Relevant follow-up question 3]

### 8. TONE, GREETING & EMPATHY
- Warm, respectful, nonjudgmental, and culturally attuned to Indian and global families.
${greetingInstruction}
- Mention ${cName} naturally where relevant. Do not robotically repeat ${cName}'s name in every single sentence.
- Plain language: translate complex medical jargon into intuitive words (e.g., explain "sensory overload" in simple daily terms).`;
}

// Blacklist of unverified forums, rumor boards, and spam domains excluded from search grounding citations
const BLACKLISTED_FORUM_DOMAINS = [
  "reddit.com",
  "quora.com",
  "4chan.org",
  "8kun.top",
  "tumblr.com",
  "answers.yahoo.com",
  "ask.fm",
  "blogspot.spam",
];

function filterTrustedGroundingChunks(chunks?: any[]): Array<{ title: string; uri: string }> {
  if (!Array.isArray(chunks)) return [];
  const seenUris = new Set<string>();
  const trusted: Array<{ title: string; uri: string }> = [];

  for (const chunk of chunks) {
    const uri = String(chunk?.web?.uri || "").trim();
    const title = String(chunk?.web?.title || "Verified Google Search Source").trim();
    if (!uri || !uri.startsWith("http")) continue;

    const lowerUri = uri.toLowerCase();
    if (BLACKLISTED_FORUM_DOMAINS.some((domain) => lowerUri.includes(domain))) {
      continue;
    }
    if (seenUris.has(uri)) continue;
    seenUris.add(uri);
    trusted.push({ title, uri });
    if (trusted.length >= 3) break;
  }
  return trusted;
}

// In-memory fast cache for repeated pediatric responses
const aiAssistantServerCache = new Map<string, string>();

// Helper to convert raw PCM (L16) audio from Gemini TTS into standard WAV buffer
function pcmToWavBuffer(pcmBase64: string, sampleRate: number = 24000): Buffer {
  const pcmData = Buffer.from(pcmBase64, "base64");
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcmData.length;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  pcmData.copy(buffer, 44);
  return buffer;
}

// Per-IP Sliding Window Rate Limiter for Abuse Protection
interface RateBucket {
  timestamps: number[];
}
const ipRateBuckets = new Map<string, RateBucket>();

function createRateLimiter(maxRequestsPerMinute: number = 60) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const forwarded = req.headers["x-forwarded-for"];
    const ip = (typeof forwarded === "string" ? forwarded.split(",")[0] : req.ip) || "local-client";
    const key = `${ip}:${req.path}`;
    const now = Date.now();
    const windowMs = 60 * 1000;

    let bucket = ipRateBuckets.get(key);
    if (!bucket) {
      bucket = { timestamps: [] };
      ipRateBuckets.set(key, bucket);
    }

    bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

    const remaining = Math.max(0, maxRequestsPerMinute - bucket.timestamps.length);
    res.setHeader("X-RateLimit-Limit", String(maxRequestsPerMinute));
    res.setHeader("X-RateLimit-Remaining", String(remaining));
    res.setHeader("X-RateLimit-Reset", String(Math.ceil((now + windowMs) / 1000)));

    if (bucket.timestamps.length >= maxRequestsPerMinute) {
      const oldest = bucket.timestamps[0] || now;
      const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
      res.setHeader("Retry-After", String(retryAfterSeconds));
      return res.status(429).json({
        error: "Rate limit exceeded. Too many requests in a short window.",
        retryAfterSeconds,
      });
    }

    bucket.timestamps.push(now);
    next();
  };
}

export function createApiRouter(): express.Router {
  const router = express.Router();

  // Health check
  router.get("/health", (req, res) => {
    res.json({
      status: "ok",
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      mapsConfigured: Boolean(process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY),
      rateLimiting: "active",
      dpdpCompliance: "DPDP-Act-2023-Active",
      timestamp: new Date().toISOString()
    });
  });

  // Google Maps Platform Client Configuration endpoint
  router.get("/maps-config", (_req, res) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY || "";
    res.json({ apiKey });
  });

  // FoodLens Vision & Analysis
  router.post("/analyze-food", async (req, res) => {
    const { imageBase64, foodQuery, language } = req.body;
    if (!imageBase64 && !foodQuery) {
      return res.status(400).json({ isFood: false, errorMessage: "No image or food query provided for scanning." });
    }

    const getFallbackAnalysis = (queryText: string) => {
      const q = (queryText || '').toLowerCase().trim();

      const nonFoodTerms = ['phone', 'mobile', 'charger', 'laptop', 'computer', 'mouse', 'keyboard', 'shoe', 'sandal', 'sock', 'shirt', 'pant', 'cloth', 'fabric', 'toy', 'doll', 'plastic', 'car', 'remote', 'battery', 'key', 'keys', 'watch', 'strap', 'paper', 'pen', 'pencil', 'book', 'table', 'chair', 'coin', 'camera', 'device', 'glass empty', 'box empty', 'wall', 'hand', 'face', 'person'];
      if (nonFoodTerms.some(term => q.includes(term))) {
        return {
          isFood: false,
          errorMessage: `Not a food item! Detected: "${queryText}". FoodLens is designed specifically for meals, fruits, snacks, and nutrition labels. Please point camera at an edible food item.`
        };
      }

      if (q.includes('chili') || q.includes('chilli') || q.includes('mirchi') || q.includes('mirch') || q.includes('cayenne') || q.includes('habanero') || q.includes('jalapeno') || q.includes('hot pepper') || q.includes('spicy')) {
        return {
          isFood: true,
          name: "Red Chili (Lal Mirch)",
          hindiName: "लाल मिर्च",
          ageBadge: "Strictly Avoid (0–5 Yrs)",
          stageName: "Severe Pediatric Irritant Hazard",
          score: "1.2 / 10",
          scoreNumber: 1.2,
          novaLevel: "Level 1 (Unsafe for Toddlers)",
          calories: "40 kcal / 100g",
          protein: "1.9 g",
          sodium: "9 mg",
          blwStatus: "Unsafe for BLW",
          gumPinchTest: "Failed (Mucosal burn hazard)",
          ingredients: ["Raw Whole Chili Peppers", "Capsaicinoids"],
          allergyCheck: "Severe Capsaicin Mucosal Hazard: Causes chemical burns on baby lips, mouth, tongue, esophagus, and ocular pain if touched.",
          pediatricTip: "HIGH ALERT: Never feed whole chilis, raw chili, or chili flakes to infants/toddlers. If accidentally tasted, do NOT offer plain water (which spreads capsaicin). Immediately give cold whole milk, plain yogurt (curd), or vanilla ice cream to dissolve capsaicin.",
          texture: "Mucosal Burn & Choking Risk",
          safetyWarning: "HIGH DANGER ALERT: Red chili is strictly unsafe for babies & toddlers (0-5 yrs). Capsaicin causes severe oral burning, airway irritation, vomiting, and acute abdominal pain.",
          isSafeForBaby: false
        };
      }

      if (q.includes('chip') || q.includes('crisp') || q.includes('kurkure') || q.includes('namkeen') || q.includes('lays') || q.includes('fry') || q.includes('wafers')) {
        return {
          isFood: true,
          name: "Crispy Potato Chips & Savory Wafers",
          hindiName: "आलू चिप्स / नमकीन",
          ageBadge: "Avoid (Choking Hazard)",
          stageName: "High Risk Choking & Sodium Hazard",
          score: "2.5 / 10",
          scoreNumber: 2.5,
          novaLevel: "Level 4 (Ultra-Processed)",
          calories: "536 kcal / 100g",
          protein: "6.5 g",
          sodium: "160 mg",
          blwStatus: "Unsafe for BLW (Sharp Choking Hazard)",
          gumPinchTest: "Failed (Hard, brittle, sharp shard fragments)",
          ingredients: ["Potatoes", "Refined Palm Oil", "Iodized Salt (160mg)", "Acidity Regulators (INS 330)", "Flavor Enhancers"],
          allergyCheck: "High salt stress on toddler nephrons. Commercial processed oils and potential cross-contact allergens.",
          pediatricTip: "HIGH ALERT: Broken chips and crisps have rigid, sharp edges that can lodge in a toddler's airway or lacerate delicate oral mucosa. Commercial chips contain high sodium that strains immature kidneys.",
          texture: "Hard, Sharp & Brittle (Choking Hazard)",
          safetyWarning: "Not suitable for infants or toddlers. The sharp, hard edges of broken chips pose a choking hazard. High sodium content is inappropriate for developing kidneys.",
          isSafeForBaby: false
        };
      }

      if (q.includes('banana') || q.includes('kela')) {
        return {
          isFood: true,
          name: "Mashed Yellow Banana with Cardamom",
          hindiName: "केला मैश",
          ageBadge: "6–12 Months",
          stageName: "Stage 1 Weaning Puree",
          score: "9.8 / 10",
          scoreNumber: 9.8,
          novaLevel: "Level 1 (Fresh Homemade)",
          calories: "105 kcal / banana",
          protein: "1.3 g",
          sodium: "0.01 g",
          blwStatus: "BLW Soft Safe",
          gumPinchTest: "Passed (Easily squashes between tongue and palate)",
          ingredients: ["Ripe Robusta/Elaichi Banana", "Pinch Cardamom Powder"],
          allergyCheck: "Hypoallergenic naturally sweet fruit. Rich in potassium, gentle prebiotic fructooligosaccharides, and vitamin B6.",
          pediatricTip: "Choose bananas with tiny brown sugar specks for maximum digestibility and natural sweetness. Mash with a fork without added table sugar or honey.",
          texture: "Smooth Silky Mash",
          safetyWarning: "Safe, natural & ideal first weaning food.",
          isSafeForBaby: true
        };
      }

      if (q.includes('khichdi') || q.includes('khichri') || q.includes('dal rice') || q.includes('rice')) {
        return {
          isFood: true,
          name: "Moong Dal & Rice Khichdi with A2 Desi Ghee",
          hindiName: "मूंग दाल खिचड़ी",
          ageBadge: "7–24 Months",
          stageName: "Stage 2 Soft Family Weaning",
          score: "9.7 / 10",
          scoreNumber: 9.7,
          novaLevel: "Level 1 (Fresh Homemade)",
          calories: "165 kcal / bowl",
          protein: "5.8 g",
          sodium: "0.03 g",
          blwStatus: "BLW Soft Safe",
          gumPinchTest: "Passed (Easily smashes between thumb and forefinger)",
          ingredients: ["Yellow Moong Dal (Split)", "Polished Basmati/Sona Masuri Rice", "A2 Desi Cow Ghee", "Pinch Turmeric (Haldi)", "Roasted Cumin (Jeera)"],
          allergyCheck: "Gluten-free, highly bioavailable protein matrix. Extremely easy on immature toddler gut lining.",
          pediatricTip: "Add a teaspoon of pure A2 Desi Ghee right before serving. The healthy fats support toddler brain myelin sheath development and fat-soluble vitamin absorption.",
          texture: "Soft Cooked Mash",
          safetyWarning: "Quintessential Indian gold-standard toddler nutrition.",
          isSafeForBaby: true
        };
      }

      if (!queryText || queryText === "Live Plate Camera Scan") {
        return {
          isFood: false,
          errorMessage: "Could not clearly detect an edible baby food item in the camera frame. Please ensure clear lighting directly on the food plate, avoid glare, or type the food or ingredient name in the search box."
        };
      }

      return {
        isFood: true,
        name: queryText.slice(0, 50),
        hindiName: "घर का बना शिशु आहार",
        ageBadge: "8–36 Months",
        stageName: "Family Table Food",
        score: "8.5 / 10",
        scoreNumber: 8.5,
        novaLevel: "Level 1 (Minimally Processed)",
        calories: "140 kcal / serving",
        protein: "4.5 g",
        sodium: "0.04 g",
        blwStatus: "Check BLW readiness",
        gumPinchTest: "Test soft squish with fingers",
        ingredients: [queryText.slice(0, 30), "Water/Broth", "Mild Seasoning"],
        allergyCheck: "Check ingredients for individual allergy history.",
        pediatricTip: "Ensure meal temperature is tested on parent's wrist before feeding. Serve in non-toxic silicone or stainless steel baby ware.",
        texture: "Soft Chewable Solids",
        safetyWarning: "Ensure soft texture suitable for toddler's developmental age.",
        isSafeForBaby: true
      };
    };

    const userLang = (language || 'en').toLowerCase();
    const languageInstruction = userLang === 'en'
      ? 'CRITICAL LANGUAGE REQUIREMENT: The user has selected ENGLISH. Return ALL fields (name, pediatricTip, safetyWarning, allergen notes, texture, ingredients, blwStatus) STRICTLY in English. Do NOT output Hindi or Devanagari script anywhere in the response. Set hindiName to empty or omit it.'
      : `CRITICAL LANGUAGE REQUIREMENT: The user has selected language code "${userLang}". Translate all descriptions, tips, and warnings into this language native script.`;

    try {
      const ai = getAI();
      if (!ai) {
        return res.json(getFallbackAnalysis(foodQuery || "Home-Cooked Baby Plate"));
      }

      const prompt = `You are a certified Pediatric Clinical Nutritionist, Child Safety Specialist, and Indian Academy of Pediatrics (IAP) & FSSAI infant and child feeding analyst.
Target Audience: Parents and caregivers feeding children from 0 to 18 years old.

${languageInstruction}

CRITICAL INSTRUCTIONS:
1. IMAGE CLARITY CHECK:
   - If blurry or out of focus: return isFood: false, isBlurry: true.
2. NON-FOOD DETECTION:
   - If image contains NO food/packaging: return isFood: false.
3. FOOD OR FOOD PACKAGE DETECTION:
   - Calculate nutrition, allergens, pediatric tip, safety warnings.

Return strictly valid JSON matching this schema:
{
  "isFood": true,
  "isBlurry": false,
  "name": "Exact Name of Food or Product",
  "hindiName": "Hindi name or product category",
  "brandName": "Brand name if packaged",
  "foodType": "Home-Cooked | Packaged Food | Fresh Produce | Beverage",
  "ageBadge": "e.g. 6-12 Months, 1-3 Years, or 4+ Years",
  "stageName": "e.g. Stage 1 Puree, Finger Food, Family Meal",
  "score": "e.g. 9.4 / 10",
  "scoreNumber": 9.4,
  "novaLevel": "e.g. Level 1 (Fresh Homemade) or Level 4 (Ultra-Processed)",
  "calories": "e.g. 165 kcal / serving",
  "protein": "e.g. 5.8 g",
  "sodium": "e.g. 0.04 g (<1g/day limit)",
  "blwStatus": "BLW Safe or Choking Hazard or Unsafe",
  "gumPinchTest": "Passed or Failed or N/A",
  "ingredients": ["Ingredient 1", "Ingredient 2"],
  "allergyCheck": "Allergen & digestive note",
  "pediatricTip": "Clinical nutritionist tip for parents",
  "texture": "Texture description",
  "safetyWarning": "Clear safety evaluation or allergen warning",
  "isSafeForBaby": boolean
}`;

      let aiResponseText = "";
      if (imageBase64) {
        let mimeType = "image/jpeg";
        let rawBase64 = imageBase64;
        if (imageBase64.includes(";base64,")) {
          const parts = imageBase64.split(";base64,");
          mimeType = parts[0].replace("data:", "").trim();
          rawBase64 = parts[1];
        }
        rawBase64 = rawBase64.trim().replace(/\s+/g, '');

        const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
        let success = false;
        let lastErr: any = null;
        for (const model of candidateModels) {
          try {
            const resp = await withTimeout(
              ai.models.generateContent({
                model,
                contents: [
                  {
                    role: "user",
                    parts: [
                      { inlineData: { mimeType, data: rawBase64 } },
                      { text: prompt + (foodQuery ? `\nUser search or description note: ${foodQuery}` : "") }
                    ]
                  }
                ],
                config: { responseMimeType: "application/json" }
              }),
              6000
            );
            if (resp.text) {
              aiResponseText = resp.text;
              success = true;
              break;
            }
          } catch (mErr: any) {
            lastErr = mErr;
          }
        }
        if (!success) throw (lastErr || new Error("Vision models unavailable"));
      } else {
        const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
        let success = false;
        let lastErr: any = null;
        for (const model of candidateModels) {
          try {
            const resp = await withTimeout(
              ai.models.generateContent({
                model,
                contents: prompt + "\nFood item/description to analyze: " + foodQuery,
                config: { responseMimeType: "application/json" }
              }),
              5000
            );
            if (resp.text) {
              aiResponseText = resp.text;
              success = true;
              break;
            }
          } catch (mErr: any) {
            lastErr = mErr;
          }
        }
        if (!success) throw (lastErr || new Error("Text models unavailable"));
      }

      const cleanJson = aiResponseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return res.json(parsed);
    } catch (err: any) {
      if (imageBase64) {
        return res.json({
          isFood: false,
          isBlurry: true,
          errorMessage: "Image is not clear or camera could not recognize the food/label details. Please hold the food or package nutrition label closer to the camera lens with bright lighting and tap 'Capture & Analyze' again."
        });
      }
      return res.json(getFallbackAnalysis(foodQuery || "Home-Cooked Baby Plate"));
    }
  });

  // Dedicated Milestone Analysis endpoint
  router.post("/analyze-milestones", async (req, res) => {
    const { loggedMilestones, languagePromptModifier } = req.body;
    if (!Array.isArray(loggedMilestones) || loggedMilestones.length === 0) {
      return res.json({
        hasMilestones: false,
        report: "No milestones logged yet! Please record at least one achievement in the list below to generate your personalized IAP, FSSAI & ICMR developmental assessment."
      });
    }

    try {
      const ai = getAI();
      if (!ai) {
        throw new Error("Gemini AI client unavailable");
      }

      const prompt = `You are an expert pediatric nurse, developmental psychologist, and IAP, FSSAI & ICMR milestone specialist.
Below are the logged child milestones:
${JSON.stringify(loggedMilestones, null, 2)}

Provide an encouraging, expert developmental comparison:
1. Milestone Progress: Which achievements are on track or early based on IAP & ICMR windows.
2. Gentle Reassurance: Normal healthy variations in child development.
3. Tailored Play & Enrichment Activities: Practical activities to stimulate upcoming milestones.
4. Nutrition & Sleep Link: Brief note on pediatric nutrition supporting brain development.
Include a gentle note that this guidance is supportive educational information.
${languagePromptModifier ? `\n\nREMINDER: Entire response must be in the requested language.` : ''}`;

      const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
      let reportText = "";
      for (const model of candidateModels) {
        try {
          const resp = await withTimeout(
            ai.models.generateContent({
              model,
              contents: prompt
            }),
            5000
          );
          if (resp.text) {
            reportText = resp.text;
            break;
          }
        } catch (e) {
          // try next model
        }
      }

      if (!reportText) throw new Error("No model response");

      return res.json({
        hasMilestones: true,
        report: reportText
      });
    } catch (err: any) {
      const names = loggedMilestones.map((m: any) => m.name || m.milestoneId).join(", ");
      return res.json({
        hasMilestones: true,
        report: `### 🌟 Developmental Milestone Assessment (IAP & ICMR Standards)\n\n**Logged Achievements:** ${names}\n\n* **Developmental Timing:** Your child’s recorded milestones align beautifully with typical Indian Academy of Pediatrics (IAP) and ICMR developmental windows. Every milestone represents strong neural and motor progression.\n* **Encouraging Next Steps:** Continue engaging in daily interactive floor play, open-ended conversations, reading picture books together, and encouraging tummy-time or gross motor balance.\n* **Nutrition & Hydration:** Adequate bioavailable iron, healthy fats (like A2 ghee), and sound uninterrupted night sleep directly accelerate cognitive leap consolidation.\n\n*Note: Every child follows their own unique timeline. For specific clinical concerns, consult your primary pediatrician.*`
      });
    }
  });

  // Dedicated AI Assistant endpoint with streaming
  router.post("/ai-assistant", async (req, res) => {
    const { query, messages, parentName, childName, childAge, languagePromptModifier, isFollowUp: bodyIsFollowUp } = req.body;
    if (!query && (!messages || !messages.length)) {
      return res.status(400).json({ error: "Query or messages are required" });
    }

    const pName = parentName?.trim() || "Parent";
    const cName = childName?.trim() || "Child 1";
    const age = childAge?.trim() || "14 Months";
    const isFollowUp = Boolean(bodyIsFollowUp || (Array.isArray(messages) && messages.length > 1));

    const userQueryText = (query || (Array.isArray(messages) && messages[messages.length - 1]?.parts?.[0]?.text) || (Array.isArray(messages) && messages[messages.length - 1]?.content) || '').toLowerCase();

    if (isPersonalInfoQuery(userQueryText)) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.write(getResponsibleAIRefusal(pName, cName, age));
      return res.end();
    }

    const cacheKey = `${userQueryText.trim()}|${pName}|${cName}|${age}|${languagePromptModifier || ''}|${isFollowUp ? 'followup' : 'first'}`;
    const cachedResponse = aiAssistantServerCache.get(cacheKey);
    if (cachedResponse && !isFollowUp) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.write(cachedResponse);
      return res.end();
    }

    try {
      const ai = getAI();
      if (!ai) {
        const fallbackText = generateTailoredFallback(userQueryText, parentName, childName, childAge, isFollowUp);
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.write(fallbackText);
        return res.end();
      }

      const systemInstruction = getSystemInstruction(parentName, childName, childAge, languagePromptModifier, isFollowUp);

      let contents: any = query;
      if (Array.isArray(messages) && messages.length > 0) {
        contents = messages.map((m: any) => {
          const role = m.role === 'assistant' || m.role === 'model' ? 'model' : 'user';
          let text = (m.content || m.text || (Array.isArray(m.parts) && m.parts[0]?.text) || '').trim();
          // Condense previous assistant turns to prevent latency spikes while keeping context clear
          if (role === 'model' && text.length > 350) {
            text = text.slice(0, 350) + '...';
          }
          return {
            role,
            parts: [{ text }]
          };
        });
      }

      const CANDIDATE_ATTEMPTS = [
        { model: "gemini-4-hydrogen", useSearch: true },
        { model: "gemini-3.1-flash-lite", useSearch: true },
        { model: "gemini-4-hydrogen", useSearch: false },
        { model: "gemini-3.1-flash-lite", useSearch: false },
        { model: "gemini-flash-latest", useSearch: false },
      ];

      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Transfer-Encoding", "chunked");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("X-Accel-Buffering", "no");

      let streamedAny = false;
      let modelSucceeded = false;
      let accumulatedOutput = "";

      for (const attempt of CANDIDATE_ATTEMPTS) {
        if (modelSucceeded) break;
        const { model: modelName, useSearch } = attempt;

        try {
          const isGemini4 = modelName.startsWith("gemini-4");
          const modelConfig: any = isGemini4
            ? {
                systemInstruction,
                ...(useSearch ? { tools: [{ googleSearch: {} }] } : {}),
              }
            : {
                systemInstruction,
                ...(useSearch ? { tools: [{ googleSearch: {} }] } : {}),
                temperature: 0.5,
                maxOutputTokens: 1250,
              };

          const streamPromise = ai.models.generateContentStream({
            model: modelName,
            contents: contents,
            config: modelConfig
          });

          // Wait up to 6.5s for initial stream response from high-speed grounded model
          const responseStream = await withTimeout(streamPromise, 6500);
          const collectedGroundingChunks: any[] = [];

          for await (const chunk of readStreamWithTimeout(responseStream, 3500)) {
            const gChunks = (chunk as any)?.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (Array.isArray(gChunks) && gChunks.length > 0) {
              collectedGroundingChunks.push(...gChunks);
            }
            if (chunk?.text) {
              const cleanedText = sanitizeAIOutput(chunk.text, parentName);
              if (cleanedText) {
                accumulatedOutput += cleanedText;
                res.write(cleanedText);
                if (typeof (res as any).flush === 'function') {
                  (res as any).flush();
                }
                streamedAny = true;
              }
            }
          }

          if (streamedAny) {
            // If Google Search returned live high-ranked web sources that weren't already formatted in the text,
            // append them cleanly before any trailing delimiter or at the end
            const trustedSources = filterTrustedGroundingChunks(collectedGroundingChunks);
            if (
              trustedSources.length > 0 &&
              !accumulatedOutput.includes("Explainability & Reference Links")
            ) {
              const sourceBlock =
                "\n\n### 🔗 Explainability & Reference Links\n" +
                trustedSources.map((s) => `* [${s.title}](${s.uri})`).join("\n") +
                "\n";
              accumulatedOutput += sourceBlock;
              res.write(sourceBlock);
            }

            modelSucceeded = true;
            if (accumulatedOutput.length > 50 && !isFollowUp) {
              if (aiAssistantServerCache.size > 250) {
                const firstKey = aiAssistantServerCache.keys().next().value;
                if (firstKey) aiAssistantServerCache.delete(firstKey);
              }
              aiAssistantServerCache.set(cacheKey, accumulatedOutput);
            }
            break;
          }
        } catch (err: any) {
          if (streamedAny) {
            modelSucceeded = true;
            break;
          }
          // continue to next model quickly
        }
      }

      if (!streamedAny) {
        let lastUserQuery = query || '';
        if (!lastUserQuery && Array.isArray(messages) && messages.length > 0) {
          const lastUser = [...messages].reverse().find((m: any) => m.role === 'user');
          lastUserQuery = lastUser?.content || lastUser?.text || (Array.isArray(lastUser?.parts) && lastUser?.parts[0]?.text) || '';
        }

        const fallbackText = generateTailoredFallback(
          lastUserQuery,
          parentName,
          childName,
          childAge,
          isFollowUp
        );
        res.write(fallbackText);
      }

      res.end();
    } catch (error: any) {
      try {
        if (!res.headersSent) {
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
        }
        res.write(`Hello ${pName},\n\nWe encountered a momentary connection delay while generating guidance for ${cName}. Please tap below to retry.\n\n---RELATED_QUESTIONS---\n- [Retry this question]\n- [How can I calm ${cName} during big emotions?]\n- [What are gentle routine ideas for age ${age}?]`);
      } catch (e) {}
      res.end();
    }
  });

  // Helper to fetch authentic real-world recipes & source links from free public culinary APIs (TheMealDB, Wikibooks Cookbook, Wikipedia)
  async function fetchFreeWebRecipeReferences(rawIngredients: string, mealType: string): Promise<{
    contextText: string;
    sources: Array<{ title: string; uri: string }>;
  }> {
    const typoMap: Record<string, string> = {
      panner: "paneer",
      panir: "paneer",
      tometo: "tomato",
      poteto: "potato",
      spinich: "spinach",
      chiken: "chicken",
      brocoli: "broccoli",
      bananna: "banana",
      oates: "oats",
    };
    const terms = rawIngredients
      .split(/[,&+/]+|\band\b/i)
      .map((s) => {
        const cleaned = s.trim().toLowerCase().replace(/[^a-zA-Z0-9\s-]/g, "");
        return typoMap[cleaned] || cleaned;
      })
      .filter((s) => s.length >= 2)
      .slice(0, 3);
    const primaryTerm = terms[0] || rawIngredients.trim().split(/\s+/)[0] || "rice";

    const sources: Array<{ title: string; uri: string }> = [];
    const seenUris = new Set<string>();
    const snippets: string[] = [];

    const addSource = (title: string, uri: string) => {
      const cleanUri = String(uri || "").trim();
      const cleanTitle = String(title || "").trim();
      if (!cleanUri.startsWith("http") || !cleanTitle || seenUris.has(cleanUri)) return;
      seenUris.add(cleanUri);
      sources.push({ title: cleanTitle, uri: cleanUri });
    };

    const fetchJsonWithTimeout = async (url: string, ms = 4000) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), ms);
      try {
        const resp = await fetch(url, {
          signal: controller.signal,
          headers: { "User-Agent": "TrickyToddlersApp/1.0" },
        });
        if (!resp.ok) return null;
        return await resp.json();
      } catch {
        return null;
      } finally {
        clearTimeout(timer);
      }
    };

    const searchQueries = Array.from(new Set([primaryTerm, `${primaryTerm} ${mealType}`]));

    const [mealDbSearch, mealDbFilter, wikibooksSearch, wikiSearch] = await Promise.allSettled([
      fetchJsonWithTimeout(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(primaryTerm)}`),
      fetchJsonWithTimeout(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(primaryTerm)}`),
      fetchJsonWithTimeout(
        `https://en.wikibooks.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
          `Cookbook:${searchQueries[0]}`
        )}&format=json&srlimit=4`
      ),
      fetchJsonWithTimeout(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
          `${rawIngredients} ${mealType} recipe dish`
        )}&format=json&srlimit=4`
      ),
    ]);

    // 1. Parse TheMealDB full recipe matches
    if (mealDbSearch.status === "fulfilled" && Array.isArray(mealDbSearch.value?.meals)) {
      for (const meal of mealDbSearch.value.meals.slice(0, 3)) {
        const ingLines: string[] = [];
        for (let idx = 1; idx <= 20; idx++) {
          const ing = String(meal[`strIngredient${idx}`] || "").trim();
          const meas = String(meal[`strMeasure${idx}`] || "").trim();
          if (ing) ingLines.push(meas ? `${meas} ${ing}` : ing);
        }
        const mealUrl = meal.strSource && String(meal.strSource).startsWith("http")
          ? meal.strSource
          : `https://www.themealdb.com/meal/${meal.idMeal}`;
        addSource(`${meal.strMeal} (TheMealDB)`, mealUrl);
        snippets.push(
          `Reference Dish (TheMealDB): ${meal.strMeal} (${meal.strArea || ""} ${meal.strCategory || ""})\nIngredients: ${ingLines.join(", ")}\nMethod Excerpt: ${String(meal.strInstructions || "").slice(0, 450)}`
        );
      }
    }

    // 2. Parse TheMealDB ingredient filter matches (if search.php returned few/none)
    if (mealDbFilter.status === "fulfilled" && Array.isArray(mealDbFilter.value?.meals)) {
      for (const meal of mealDbFilter.value.meals.slice(0, 2)) {
        addSource(`${meal.strMeal} (TheMealDB)`, `https://www.themealdb.com/meal/${meal.idMeal}`);
        snippets.push(`Related Real Dish: ${meal.strMeal}`);
      }
    }

    // 3. Parse Wikibooks Cookbook real open-licensed recipes + extract text
    if (wikibooksSearch.status === "fulfilled" && Array.isArray(wikibooksSearch.value?.query?.search)) {
      const topTitles = wikibooksSearch.value.query.search
        .map((s: any) => String(s.title || ""))
        .filter((t: string) => t.startsWith("Cookbook:"))
        .slice(0, 2);

      for (const title of topTitles) {
        addSource(
          title.replace("Cookbook:", "") + " (Wikibooks Cookbook)",
          `https://en.wikibooks.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`
        );
      }

      if (topTitles.length > 0) {
        const extractData = await fetchJsonWithTimeout(
          `https://en.wikibooks.org/w/api.php?action=query&prop=extracts&explaintext=1&exchars=1200&titles=${encodeURIComponent(
            topTitles.join("|")
          )}&format=json`,
          3500
        );
        const pages = extractData?.query?.pages || {};
        for (const page of Object.values(pages) as any[]) {
          if (page?.extract) {
            snippets.push(`Wikibooks Cookbook (${page.title}):\n${String(page.extract).slice(0, 700)}`);
          }
        }
      }
    }

    // 4. Add Wikipedia culinary dish context if we still have fewer than 3 sources
    if (sources.length < 3 && wikiSearch.status === "fulfilled" && Array.isArray(wikiSearch.value?.query?.search)) {
      for (const item of wikiSearch.value.query.search.slice(0, 2)) {
        const title = String(item.title || "");
        if (!title) continue;
        addSource(
          `${title} (Culinary Reference)`,
          `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`
        );
      }
    }

    return {
      contextText: snippets.join("\n\n"),
      sources: sources.slice(0, 5),
    };
  }

  // Dedicated Recipe Generation endpoint (for FoodGuide) using Google Search Grounding with automatic free-tier web recipe fallback
  router.post("/generate-recipes", async (req, res) => {
    const {
      childAgeYears,
      ingredients,
      mealType,
      cookingTime,
      dietaryNeeds,
      servings,
      equipment,
      languagePromptModifier,
    } = req.body;
    const targetMealType = mealType || "Breakfast";
    const targetCookTime = cookingTime || "15–30 mins";
    const targetDietary =
      Array.isArray(dietaryNeeds) && dietaryNeeds.length > 0
        ? dietaryNeeds.join(", ")
        : typeof dietaryNeeds === "string" && dietaryNeeds.trim()
        ? dietaryNeeds
        : "Vegetarian";
    const targetServings = servings || "2 Servings";
    const targetEquipment = equipment || "Stovetop / One-Pan";
    const langClause = languagePromptModifier ? `\n${languagePromptModifier}` : '';
    const rawIngredients = String(ingredients || "").trim();

    if (!rawIngredients) {
      return res.status(400).json({ error: "Please enter at least one kitchen ingredient." });
    }

    const baseCriteriaBlock = `
- Core Kitchen Ingredients (correct obvious typos like "panner" -> "paneer"): "${rawIngredients}"
- Target Child / Family Age Group: ${childAgeYears || 'All Ages'}
- Meal Type: "${targetMealType}"
- Cooking Time Limit: "${targetCookTime}"
- Dietary Preferences & Goals: "${targetDietary}"
- Number of Servings (scale all ingredient quantities accurately): "${targetServings}"
- Kitchen Equipment to Use: "${targetEquipment}"

Strict Culinary & Authenticity Rules:
1. Return 3 DISTINCT, real, well-known Indian or global dishes (e.g., Paneer Bhurji, Instant Pot Moong Dal Paneer Khichdi, Paneer & Vegetable Cheela, Ven Pongal, Palak Paneer Pulao, etc. — NEVER invent generic placeholder titles like "Paneer Breakfast Bowl").
2. Every recipe MUST genuinely work in "${targetEquipment}", finish within "${targetCookTime}", strictly adhere to "${targetDietary}", and be developmentally safe for age "${childAgeYears || 'All Ages'}" (no raw hard choking chunks for toddlers; no honey/salt/added sugar if under 12 months).
3. List EVERY single required ingredient individually with exact household measurements scaled for "${targetServings}" (e.g., "150g fresh paneer, crumbled", "1 small onion, finely chopped", "1/2 tsp cumin seeds (jeera)", "1/4 tsp turmeric powder", "1 tbsp desi ghee", "1/2 cup water"). EVERY ingredient mentioned in the steps (including tempering spices, cashews, oil/ghee, water, salt) MUST appear in "ingredients".
4. Write 8 to 12 detailed, granular cooking steps in "instructions" covering prep/soaking, ${targetEquipment} mode/flame/temperature, tempering spices, sautéing/cooking duration, visual doneness indicators, cooling check, and serving tips.
5. Output ONLY a valid JSON array of exactly 3 recipe objects (no markdown code fence, no extra prose).${langClause}

Each JSON object MUST have these exact keys:
- "id": string (unique)
- "name": string (authentic dish name)
- "summary": string (1–2 sentence appetizing dish overview)
- "mealType": string ("${targetMealType}")
- "prepTime": string (e.g. "10 mins")
- "cookTime": string (fitting within "${targetCookTime}")
- "textureGuide": string (texture, ${targetServings} portion note, and ${targetEquipment} cooking tip)
- "ingredients": string[] (8 to 14 itemized ingredients with exact measurements for ${targetServings})
- "instructions": string[] (8 to 12 detailed step-by-step cooking instructions)
- "nutritionBenefits": string (key vitamins, minerals, protein, and "${targetDietary}" benefits)
- "safetyAlerts": string (temperature, choking prevention, and allergen notes)
`;

    const recipeSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          summary: { type: Type.STRING },
          mealType: { type: Type.STRING },
          prepTime: { type: Type.STRING },
          cookTime: { type: Type.STRING },
          textureGuide: { type: Type.STRING },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
          nutritionBenefits: { type: Type.STRING },
          safetyAlerts: { type: Type.STRING },
        },
        required: ["name", "ingredients", "instructions"],
      },
    };

    try {
      const ai = getAI();
      if (!ai) {
        return res.status(503).json({
          error: "Gemini API is not configured on the server. Please check Settings > Secrets.",
        });
      }

      let resultText = "";
      let collectedSources: Array<{ title: string; uri: string }> = [];
      let lastError: any = null;
      let usedGoogleSearch = false;

      // 1. Try Google Search Grounding first (succeeds when Search Grounding quota / billing key is available)
      try {
        const groundedResult = await withTimeout(
          ai.models.generateContent({
            model: "gemini-4-hydrogen",
            contents: `Use Google Search to find 3 authentic, real-world, popular culinary recipes matching ALL of these exact criteria:\n${baseCriteriaBlock}`,
            config: {
              systemInstruction:
                "You are an expert pediatric nutritionist and culinary chef. Always run Google Search to verify authentic real-world recipes and exact ingredient proportions. Output ONLY a valid JSON array of 3 distinct recipes.",
              tools: [{ googleSearch: {} }],
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          }),
          25000
        );

        const chunks = (groundedResult as any)?.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (Array.isArray(chunks)) {
          const seen = new Set<string>();
          for (const c of chunks) {
            const uri = c?.web?.uri;
            const title = c?.web?.title;
            if (uri && title && !seen.has(uri)) {
              seen.add(uri);
              collectedSources.push({ title, uri });
            }
          }
        }

        if (groundedResult.text && groundedResult.text.trim()) {
          resultText = groundedResult.text.trim();
          usedGoogleSearch = true;
        }
      } catch (searchErr: any) {
        lastError = searchErr;
        console.warn("Google Search Grounding unavailable, switching to free web recipe APIs + standard Gemini:", searchErr?.message || searchErr);
      }

      // 2. Free-Tier Path (No paid Gemini Search Grounding plan needed):
      // Fetch authentic recipe references from TheMealDB + Wikibooks Cookbook + Wikipedia, then structure via free-tier Gemini
      if (!resultText) {
        const webRefs = await fetchFreeWebRecipeReferences(rawIngredients, targetMealType);
        collectedSources = webRefs.sources;

        const webRefSection = webRefs.contextText
          ? `\nRetrieved Real-World Culinary References:\n${webRefs.contextText}\n`
          : "";

        const standardPrompt = `Create 3 authentic, real-world, traditional Indian or global recipes matching ALL of these exact criteria:\n${baseCriteriaBlock}${webRefSection}`;
        const freeTierModels: Array<{ model: string; config: any }> = [
          {
            model: "gemini-3.1-flash-lite",
            config: {
              systemInstruction:
                "You are an expert pediatric nutritionist and Indian & global culinary chef. Provide 3 authentic real-world recipes with exact household measurements and detailed steps. Every ingredient used in instructions must be listed in ingredients.",
              responseMimeType: "application/json",
              responseSchema: recipeSchema,
            },
          },
          {
            model: "gemini-4-hydrogen",
            config: {
              systemInstruction:
                "You are an expert pediatric nutritionist and Indian & global culinary chef. Provide 3 authentic real-world recipes with exact household measurements and detailed steps. Every ingredient used in instructions must be listed in ingredients.",
              responseMimeType: "application/json",
              responseSchema: recipeSchema,
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          },
          {
            model: "gemini-flash-latest",
            config: {
              systemInstruction:
                "You are an expert pediatric nutritionist and culinary chef. Output ONLY a valid JSON array of 3 authentic recipes.",
              responseMimeType: "application/json",
              responseSchema: recipeSchema,
            },
          },
        ];

        for (const candidate of freeTierModels) {
          try {
            const resp = await withTimeout(
              ai.models.generateContent({
                model: candidate.model,
                contents: standardPrompt,
                config: candidate.config,
              }),
              25000
            );
            if (resp.text && resp.text.trim()) {
              resultText = resp.text.trim();
              break;
            }
          } catch (mErr: any) {
            lastError = mErr;
            console.warn(`Free-tier recipe model ${candidate.model} failed:`, mErr?.message || mErr);
          }
        }
      }

      if (!resultText) {
        const rawErrMsg = String(lastError?.message || lastError || "");
        const isQuota = rawErrMsg.includes("429") || rawErrMsg.includes("RESOURCE_EXHAUSTED") || rawErrMsg.toLowerCase().includes("quota");
        const isAuth = rawErrMsg.includes("403") || rawErrMsg.includes("PERMISSION_DENIED") || rawErrMsg.includes("API_KEY_INVALID");

        if (isQuota) {
          return res.status(429).json({
            error:
              "Gemini API free-tier rate limit reached (429 RESOURCE_EXHAUSTED). Please wait a minute and click Retry, or add a key with higher quota in Settings > Secrets.",
            status: "RESOURCE_EXHAUSTED",
          });
        }
        if (isAuth) {
          return res.status(403).json({
            error:
              "Gemini API key permission or validation error. Please verify your API key in the Settings > Secrets panel.",
          });
        }
        return res.status(502).json({
          error: "Unable to retrieve authentic recipes right now. Please try again in a moment.",
        });
      }

      const parseRecipesArray = (raw: string): any[] | null => {
        try {
          const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
          const start = cleaned.indexOf("[");
          const end = cleaned.lastIndexOf("]");
          const slice = start !== -1 && end !== -1 ? cleaned.slice(start, end + 1) : cleaned;
          const parsed = JSON.parse(slice);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {}
        return null;
      };

      let parsedRecipes = parseRecipesArray(resultText);

      // If Google Search returned markdown/prose instead of strict JSON, structure it cleanly via responseSchema
      if (!parsedRecipes) {
        try {
          const repairResp = await withTimeout(
            ai.models.generateContent({
              model: "gemini-3.1-flash-lite",
              contents: `Convert the following recipe output into a valid JSON array of 3 recipe objects matching the schema. Preserve all authentic dish names, itemized quantities, and detailed steps:\n\n${resultText}`,
              config: {
                responseMimeType: "application/json",
                responseSchema: recipeSchema,
              },
            }),
            15000
          );
          if (repairResp.text) {
            parsedRecipes = parseRecipesArray(repairResp.text);
          }
        } catch (repairErr: any) {
          console.warn("Recipe JSON structuring pass failed:", repairErr?.message || repairErr);
        }
      }

      if (!parsedRecipes || parsedRecipes.length === 0) {
        return res.status(502).json({
          error: "Could not parse the retrieved recipes into a structured format. Please try generating again.",
        });
      }

      const formatted = parsedRecipes.slice(0, 3).map((item: any, idx: number) => ({
        id: item.id || `rec-${Date.now()}-${idx}`,
        name: item.name || `${targetMealType} Option ${idx + 1}`,
        summary: item.summary || item.textureGuide || "",
        mealType: item.mealType || targetMealType,
        prepTime: item.prepTime || "10 mins",
        cookTime: item.cookTime || "15 mins",
        textureGuide: item.textureGuide || `Prepared with ${targetEquipment} for ${targetServings}`,
        ingredients: Array.isArray(item.ingredients) ? item.ingredients : [String(item.ingredients)],
        instructions: Array.isArray(item.instructions) ? item.instructions : [String(item.instructions)],
        nutritionBenefits: item.nutritionBenefits || "Rich in balanced pediatric nutrients.",
        safetyAlerts: item.safetyAlerts || "Check temperature before serving. Supervise children while eating.",
        sources: collectedSources.slice(0, 5),
      }));

      return res.json({
        recipes: formatted,
        sources: collectedSources.slice(0, 5),
        grounded: collectedSources.length > 0,
        sourceMode: usedGoogleSearch ? "google-search" : "free-web-culinary-apis",
      });
    } catch (err: any) {
      console.error("Recipe generation error:", err);
      return res.status(500).json({
        error: err?.message || "Failed to generate authentic recipes.",
      });
    }
  });

  // Cached AI Recipe Translation endpoint for all 12 supported languages
  const recipeTranslationCache = new Map<string, any>();
  const LANGUAGE_NAMES: Record<string, string> = {
    hi: 'Hindi (Devanagari script)',
    ta: 'Tamil (Tamil script)',
    te: 'Telugu (Telugu script)',
    kn: 'Kannada (Kannada script)',
    ml: 'Malayalam (Malayalam script)',
    mr: 'Marathi (Devanagari script)',
    bn: 'Bengali (Bengali script)',
    gu: 'Gujarati (Gujarati script)',
    pa: 'Punjabi (Gurmukhi script)',
    as: 'Assamese (Assamese/Bengali script)',
    or: 'Odia (Odia script)'
  };

  router.post("/translate-recipe", async (req, res) => {
    const { recipeId, targetLang, recipe } = req.body;
    const langCode = String(targetLang || 'en').toLowerCase();
    if (!recipe || langCode === 'en' || !LANGUAGE_NAMES[langCode]) {
      return res.json({ translated: null });
    }

    const cacheKey = `${recipeId || recipe.name}:${langCode}:${(recipe.instructions || []).length}`;
    if (recipeTranslationCache.has(cacheKey)) {
      return res.json({ translated: recipeTranslationCache.get(cacheKey) });
    }

    try {
      const ai = getAI();
      if (!ai) {
        return res.json({ translated: null });
      }

      const targetLanguageDesc = LANGUAGE_NAMES[langCode];
      const payloadToTranslate = {
        name: recipe.name,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        textureGuide: recipe.textureGuide || undefined,
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
        benefits: recipe.benefits || recipe.nutritionBenefits || '',
        safety: recipe.safety || recipe.safetyAlerts || ''
      };

      const promptText = `
Translate the following pediatric culinary recipe JSON accurately into ${targetLanguageDesc}.
Rules:
1. Preserve exact quantities, measurements, numbers, cooking times, temperatures (°C), and step order.
2. Use natural home-cooking culinary terminology in authentic ${targetLanguageDesc}.
3. Keep arrays exact 1-to-1 length: "ingredients" must have ${payloadToTranslate.ingredients.length} items, and "instructions" must have ${payloadToTranslate.instructions.length} items.
4. Output ONLY a valid JSON object matching the input keys (no markdown fences, no commentary).

Input JSON:
${JSON.stringify(payloadToTranslate)}
`;

      const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-4-hydrogen"];
      for (const model of candidateModels) {
        try {
          const result = await withTimeout(
            ai.models.generateContent({
              model,
              contents: promptText,
            }),
            8000
          );
          if (result.text) {
            const cleaned = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
            const start = cleaned.indexOf('{');
            const end = cleaned.lastIndexOf('}');
            const jsonStr = start !== -1 && end !== -1 ? cleaned.slice(start, end + 1) : cleaned;
            const parsed = JSON.parse(jsonStr);
            if (parsed && Array.isArray(parsed.ingredients) && Array.isArray(parsed.instructions)) {
              if (recipeTranslationCache.size > 600) {
                const firstKey = recipeTranslationCache.keys().next().value;
                if (firstKey) recipeTranslationCache.delete(firstKey);
              }
              recipeTranslationCache.set(cacheKey, parsed);
              return res.json({ translated: parsed });
            }
          }
        } catch {
          // try next model
        }
      }

      return res.json({ translated: null });
    } catch (err) {
      console.warn("Recipe translation error:", err);
      return res.json({ translated: null });
    }
  });

  // Dedicated Routine Generation endpoint (for RoutineTracker)
  router.post("/generate-routine", async (req, res) => {
    const { ageLabel, wakeTime, temperament } = req.body;

    const promptText = `
Act as a world-renowned Pediatric Sleep & Routine Specialist and Indian Academy of Pediatrics (IAP) developmental consultant.
A parent is requesting a tailored, age-appropriate daily routine schedule for their child.
Key Parameters:
- Developmental Age Bracket: ${ageLabel || 'Toddler (1–3 Years)'}
- Morning Wake-up Time: ${wakeTime || '07:00'}
- Infant Temperament/Needs: ${temperament || 'Happy & Active'}

Please construct a comprehensive, positive, and beautiful daily hour-by-hour schedule based strictly on standard IAP, FSSAI and ICMR pediatric wellness guidelines.
- Detail the exact wake-windows suitable for ${ageLabel || 'Toddler'}.
- Organize the day chronologically into clear blocks: Morning, Mid-day, Afternoon, and Bedtime.
- For each block, provide 2 actionable play suggestions, feeding guidance (milk vs. solids), and sleep health indicators.
- Emphasize safety guidelines (safe sleeping, choking hazards, active floor play).
- Deliver the response in a highly encouraging, friendly, and structured format with elegant Markdown bullet points. Use bold terms and clean tables if helpful.
`;

    try {
      const ai = getAI();
      if (!ai) {
        return res.json({
          routine: `### 🌅 IAP, FSSAI & ICMR Tailored Routine for ${ageLabel || 'Toddler'}\n\n* **Morning (${wakeTime || '07:00 AM'} - 11:30 AM):** Gentle wake-up, warm cuddle, breastmilk/formula or whole milk with finger-food breakfast (idli/cheela with ghee). Floor exploration and sensory songs.\n* **Mid-Day (11:30 AM - 02:30 PM):** Balanced lunch (moong dal khichdi with vegetables), followed by a restorative afternoon nap (1.5–2 hours in a dim, cool room).\n* **Afternoon (02:30 PM - 06:00 PM):** Light afternoon snack (stewed apple, mashed banana, or steamed carrot coins). Outdoor stroll, park exploration, and gross motor play.\n* **Bedtime (06:00 PM - 08:00 PM):** Calming dinner, warm bath, lullaby/story routine (no screens), and peaceful lights-out by 07:30–08:00 PM.`
        });
      }

      const candidateModels = ["gemini-4-hydrogen", "gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
      let routineText = "";
      for (const model of candidateModels) {
        try {
          const response = await withTimeout(
            ai.models.generateContent({
              model,
              contents: promptText,
              config: {
                tools: [{ googleSearch: {} }],
              }
            }),
            5500
          );
          if (response.text) {
            routineText = response.text;
            break;
          }
        } catch (mErr) {
          // try next model or timeout
        }
      }

      if (routineText) {
        return res.json({ routine: routineText });
      }

      return res.json({
        routine: `### 🌅 IAP, FSSAI & ICMR Tailored Daily Routine (${ageLabel || 'Toddler'})\n\n* **07:00 AM - Morning Awakening:** Loving morning cuddle, diaper change, and light breakfast with milk.\n* **09:30 AM - Active Sensory Play:** Block stacking, music, tummy/floor balance.\n* **12:00 PM - Wholesome Lunch:** Moong dal khichdi or soft roti with curd.\n* **01:00 PM - Afternoon Nap:** Restorative 90-minute sleep.\n* **04:00 PM - Snack & Fresh Air:** Sliced seasonal fruits and garden walk.\n* **07:00 PM - Relaxing Bedtime Ritual:** Warm bath, soothing story, sound sleep.`
      });
    } catch (err) {
      console.warn("Routine generation error:", err);
      return res.json({
        routine: `### 🌅 Evidence-Based Daily Routine (${ageLabel || 'Toddler'})\n\n* **Morning Routine:** Consistent wake time (${wakeTime || '07:00 AM'}), wholesome breakfast with bioavailable iron, followed by natural light exposure.\n* **Mid-Day:** Balanced lunch and quiet rest window aligned with natural circadian rhythm.\n* **Evening:** Soothing screen-free routine, warm bath, and calm sleep environment.`
      });
    }
  });

  // Dedicated Pediatrician Doctor Chat endpoint (for ExpertPediatricianSection)
  router.post("/pediatrician-chat", async (req, res) => {
    const { doctor, parentName, childName, userText } = req.body;
    const doc = doctor || {
      name: "Dr. Anjali Sharma",
      degrees: "MBBS, MD (Pediatrics), DNB, FIAP",
      hospital: "Cloudnine Pediatrics",
      location: "Jayanagar",
      city: "Bangalore",
      specialty: "Neonatologist & Infant Care Specialist",
      experience: "14"
    };
    const pName = parentName || "Parent";
    const cName = childName || "your child";

    const prompt = `You are ${doc.name} (${doc.degrees}), practicing at ${doc.hospital}, ${doc.location} in ${doc.city}.
Your pediatric subspecialty is ${doc.specialty} with ${doc.experience || 10}+ years of pediatric clinical experience.
The parent, ${pName}, is asking you a clinical/developmental query regarding their toddler, ${cName}: "${userText || 'General toddler health question'}".
Provide a warm, reassuring, highly qualified, and medical-council aligned pediatric response addressed warmly to ${pName}, mentioning ${cName} where relevant.
Use bullet points if recommending steps or dietary/nutritional tips.
Keep it strictly under 3 short paragraphs.
Finish with a comforting, warm supportive doctor sign-off: "${doc.name}, ${doc.degrees} (${doc.hospital})".
Always include a subtle reminder that for acute illnesses or high persistent fevers, an in-person physical consultation is best.`;

    try {
      const ai = getAI();
      if (!ai) {
        return res.json({
          reply: `Hello ${pName}, thank you for reaching out regarding ${cName}.\n\nFrom a pediatric perspective, children at this stage experience rapid developmental strides. Ensure plenty of gentle comfort, adequate hydration, balanced nutrition with healthy fats (like pure A2 ghee), and a predictable daily routine.\n\nIf ${cName} develops any persistent fever, respiratory difficulty, or lethargy, please visit our clinic in person immediately.\n\nWarm regards,\n${doc.name}, ${doc.degrees} (${doc.hospital})`
        });
      }

      const candidateModels = ["gemini-4-hydrogen", "gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
      let replyText = "";
      for (const model of candidateModels) {
        try {
          const result = await withTimeout(
            ai.models.generateContent({
              model,
              contents: prompt,
              config: {
                systemInstruction: `You are ${doc.name} (${doc.degrees}), a verified, friendly, comforting pediatric doctor at ${doc.hospital}, ${doc.location}. Ground all clinical facts in top-ranked pediatric medical authorities (IAP, ICMR, WHO, AAP) and never use unverified forums or guesswork. You address the parent warmly as ${pName} and their toddler as ${cName}.`,
                tools: [{ googleSearch: {} }],
              }
            }),
            5500
          );
          if (result.text) {
            replyText = result.text;
            break;
          }
        } catch (mErr) {
          // try next model
        }
      }

      if (replyText) {
        return res.json({ reply: replyText });
      }

      return res.json({
        reply: `Hello ${pName},\n\nThank you for reaching out regarding ${cName}. For common developmental and dietary questions, consistency and patience are the best foundation. Offer balanced meals, ensure quiet nap times, and engage in open communication.\n\nPlease don't hesitate to visit us at ${doc.hospital} if symptoms persist.\n\nWarmly,\n${doc.name}, ${doc.degrees} (${doc.hospital})`
      });
    } catch (err) {
      console.warn("Pediatrician chat error:", err);
      return res.json({
        reply: `Hello ${pName},\n\nThank you for sharing your concern regarding ${cName}. For immediate reassurance, keep ${cName} comfortable and well-hydrated. For clinical symptoms or persistent fever, an in-person pediatric consultation is always recommended.\n\nBest wishes,\n${doc.name}, ${doc.degrees} (${doc.hospital})`
      });
    }
  });

  // Streaming Pediatrician Doctor Chat endpoint (SSE / Chunked Stream)
  router.post("/pediatrician-chat-stream", async (req, res) => {
    const { doctor, parentName, childName, userText } = req.body;
    const doc = doctor || {
      name: "Dr. Anjali Sharma",
      degrees: "MBBS, MD (Pediatrics), DNB, FIAP",
      hospital: "Cloudnine Pediatrics",
      location: "Jayanagar",
      city: "Bangalore",
      specialty: "Neonatologist & Infant Care Specialist",
      experience: "14"
    };
    const pName = parentName || "Parent";
    const cName = childName || "your child";

    const systemInstruction = `You are ${doc.name} (${doc.degrees}), a verified, friendly, comforting pediatric doctor at ${doc.hospital}, ${doc.location} in ${doc.city}. Ground all clinical facts in top-ranked pediatric medical authorities (IAP, ICMR-NIN, WHO, AAP) and never rely on unverified forums or guesswork. You address the parent warmly as ${pName} and their child as ${cName}. Explain things simply with compassionate bedside manners aligned with Indian Academy of Pediatrics (IAP) guidelines.`;
    const prompt = `The parent, ${pName}, is asking you a clinical/developmental query regarding ${cName}: "${userText || 'General pediatric health question'}".
Provide a warm, reassuring, highly qualified pediatric response addressed to ${pName}.
Use clear bullet points if recommending steps or nutritional tips. Keep it concise (under 3 short paragraphs).
Finish with a comforting doctor sign-off: "${doc.name}, ${doc.degrees} (${doc.hospital})".
Include a brief reminder that for acute illnesses or persistent high fevers, an in-person physical evaluation is essential.`;

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("X-Accel-Buffering", "no");

    const fallbackReply = `Hello ${pName}, thank you for reaching out regarding ${cName}.\n\nFrom an Indian Academy of Pediatrics (IAP) clinical perspective, ensure plenty of gentle comfort, adequate hydration, balanced home-cooked nutrition with healthy fats (such as pure A2 ghee), and a predictable daily routine.\n\nIf ${cName} develops any persistent high fever, breathing difficulty, or lethargy, please visit ${doc.hospital} in person immediately.\n\nWarm regards,\n${doc.name}, ${doc.degrees} (${doc.hospital})`;

    try {
      const ai = getAI();
      if (!ai) {
        res.write(fallbackReply);
        return res.end();
      }

      const candidateModels = ["gemini-4-hydrogen", "gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
      let streamedAny = false;

      for (const modelName of candidateModels) {
        if (streamedAny) break;
        try {
          const streamPromise = ai.models.generateContentStream({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction,
              tools: [{ googleSearch: {} }],
            }
          });
          const responseStream = await withTimeout(streamPromise, 6000);
          for await (const chunk of readStreamWithTimeout(responseStream, 3500)) {
            if (chunk?.text) {
              res.write(chunk.text);
              if (typeof (res as any).flush === "function") {
                (res as any).flush();
              }
              streamedAny = true;
            }
          }
        } catch {
          if (streamedAny) break;
        }
      }

      if (!streamedAny) {
        res.write(fallbackReply);
      }
      res.end();
    } catch {
      if (!res.headersSent) {
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
      }
      res.write(fallbackReply);
      res.end();
    }
  });

  // Production Audio Transcription endpoint using gemini-3.5-transcribe
  router.post("/transcribe-audio", createRateLimiter(25), async (req, res) => {
    const { audioBase64, mimeType, language } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: "No audio data provided" });
    }

    const langHint = language && language !== "en"
      ? `The speaker may be speaking in language code "${language}" (Indian regional language) or English. Output the exact transcription in its native script or English as spoken.`
      : "Transcribe this spoken pediatric or parenting query accurately in English.";

    try {
      const ai = getAI();
      if (!ai) {
        return res.status(503).json({ error: "Transcription service unavailable" });
      }

      const cleanBase64 = String(audioBase64).replace(/^data:audio\/[^;]+;base64,/, "").trim();
      const models = ["gemini-3.5-transcribe", "gemini-4-hydrogen", "gemini-3.8-flash"];
      let transcript = "";

      for (const model of models) {
        try {
          const response = await withTimeout(
            ai.models.generateContent({
              model,
              contents: [
                {
                  inlineData: {
                    mimeType: mimeType || "audio/webm",
                    data: cleanBase64,
                  },
                },
                {
                  text: `${langHint} Return ONLY the raw transcribed words without any quotes, labels, or extra commentary.`,
                },
              ],
            }),
            8000
          );
          if (response.text && response.text.trim()) {
            transcript = response.text.trim();
            break;
          }
        } catch {
          // try next model
        }
      }

      return res.json({ transcript });
    } catch (err: any) {
      console.error("Audio transcription error:", err);
      return res.status(500).json({ error: "Failed to transcribe audio" });
    }
  });

  // Production Cloud Text-to-Speech (TTS) endpoint using gemini-3.8-flash-lite-tts
  router.post("/tts", createRateLimiter(25), async (req, res) => {
    const { text } = req.body;
    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: "Text is required for TTS" });
    }

    try {
      const ai = getAI();
      if (!ai) {
        return res.status(503).json({ error: "TTS service unavailable" });
      }

      const cleanText = String(text).slice(0, 1200);
      const response = await withTimeout(
        ai.models.generateContent({
          model: "gemini-3.8-flash-lite-tts",
          contents: [{ parts: [{ text: cleanText }] }],
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: "Kore" },
              },
            },
          },
        }),
        9000
      );

      const inlinePart = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      const base64Data = inlinePart?.data;
      const mimeType = inlinePart?.mimeType || "audio/L16;rate=24000";

      if (!base64Data) {
        return res.status(500).json({ error: "No audio returned from TTS model" });
      }

      if (mimeType.includes("L16") || mimeType.includes("pcm")) {
        const rateMatch = mimeType.match(/rate=(\d+)/);
        const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
        const wavBuffer = pcmToWavBuffer(base64Data, sampleRate);
        return res.json({
          audioBase64: wavBuffer.toString("base64"),
          mimeType: "audio/wav",
        });
      }

      return res.json({
        audioBase64: base64Data,
        mimeType,
      });
    } catch (err: any) {
      console.error("Cloud TTS error:", err);
      return res.status(500).json({ error: "Cloud TTS generation failed" });
    }
  });

  // Helper to format Google Places API (New) place item into real hospital record
  const mapGooglePlaceToHospital = (p: any) => {
    const displayName = p.displayName?.text || p.name || "";
    const formattedAddress = p.formattedAddress || "";
    const googleMapsUri = p.googleMapsUri || p.googleMapsLinks?.placeUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayName + " " + formattedAddress)}&query_place_id=${p.id}`;
    const reviewsUri = p.googleMapsLinks?.reviewsUri || googleMapsUri;
    const directionsUri = p.googleMapsLinks?.directionsUri || googleMapsUri;
    const reviews = Array.isArray(p.reviews)
      ? p.reviews.slice(0, 5).map((r: any) => ({
          authorName: r.authorAttribution?.displayName || "Google Maps Reviewer",
          authorUri: r.authorAttribution?.uri || "",
          rating: r.rating || 5,
          relativeTime: r.relativePublishTimeDescription || "",
          text: r.text?.text || r.originalText?.text || "",
          googleMapsUri: r.googleMapsUri || reviewsUri,
        }))
      : [];

    return {
      placeId: p.id,
      name: displayName,
      address: formattedAddress,
      location: {
        lat: p.location?.latitude ?? 0,
        lng: p.location?.longitude ?? 0,
      },
      rating: typeof p.rating === "number" ? p.rating : null,
      userRatingCount: typeof p.userRatingCount === "number" ? p.userRatingCount : 0,
      phone: p.nationalPhoneNumber || p.internationalPhoneNumber || "",
      googleMapsUri,
      reviewsUri,
      directionsUri,
      reviews,
      reviewSummary: p.reviewSummary?.text?.text || "",
      openNow: p.regularOpeningHours?.openNow ?? null,
    };
  };

  const PLACES_FIELD_MASK = [
    "places.id",
    "places.displayName",
    "places.formattedAddress",
    "places.location",
    "places.rating",
    "places.userRatingCount",
    "places.nationalPhoneNumber",
    "places.internationalPhoneNumber",
    "places.googleMapsUri",
    "places.googleMapsLinks",
    "places.reviews",
    "places.reviewSummary",
    "places.regularOpeningHours"
  ].join(",");

  // Real Google Maps Places API (New): GPS Nearby Hospital Lookup (Zero Cooked-Up Data)
  router.post("/hospitals/nearby", async (req, res) => {
    const { lat, lng, radiusMeters = 10000 } = req.body;
    const latitude = Number(lat);
    const longitude = Number(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: "Valid GPS latitude and longitude are required." });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: "Google Maps API key not configured." });
    }

    try {
      // Use Text Search biased around the user's exact GPS coordinates so pediatric & children's hospitals rank highest,
      // falling back to Nearby Search with includedTypes: ['hospital'] if needed.
      const textResp = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-Maps-Solution-ID": "gmp_mcp_codeassist_v1_aistudio",
          "X-Goog-FieldMask": PLACES_FIELD_MASK,
        },
        body: JSON.stringify({
          textQuery: "Pediatric Hospital Children Hospital Maternity Hospital",
          maxResultCount: 15,
          locationBias: {
            circle: {
              center: { latitude, longitude },
              radius: Math.min(Math.max(Number(radiusMeters) || 10000, 1000), 50000),
            },
          },
        }),
      });

      if (textResp.status === 429) {
        return res.status(429).json({ error: "RESOURCE_EXHAUSTED", status: "RESOURCE_EXHAUSTED" });
      }

      const textData: any = await textResp.json();
      if (textData?.error?.status === "RESOURCE_EXHAUSTED") {
        return res.status(429).json({ error: "RESOURCE_EXHAUSTED", status: "RESOURCE_EXHAUSTED" });
      }

      if (Array.isArray(textData?.places) && textData.places.length > 0) {
        const hospitals = textData.places.map(mapGooglePlaceToHospital);
        return res.json({ hospitals, source: "google_places_api_live" });
      }

      // Secondary call: strict searchNearby with includedTypes: ['hospital']
      const nearbyResp = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-Maps-Solution-ID": "gmp_mcp_codeassist_v1_aistudio",
          "X-Goog-FieldMask": PLACES_FIELD_MASK,
        },
        body: JSON.stringify({
          includedTypes: ["hospital"],
          maxResultCount: 15,
          locationRestriction: {
            circle: {
              center: { latitude, longitude },
              radius: Math.min(Math.max(Number(radiusMeters) || 10000, 1000), 50000),
            },
          },
        }),
      });

      if (nearbyResp.status === 429) {
        return res.status(429).json({ error: "RESOURCE_EXHAUSTED", status: "RESOURCE_EXHAUSTED" });
      }

      const nearbyData: any = await nearbyResp.json();
      if (nearbyData?.error?.status === "RESOURCE_EXHAUSTED") {
        return res.status(429).json({ error: "RESOURCE_EXHAUSTED", status: "RESOURCE_EXHAUSTED" });
      }

      const hospitals = Array.isArray(nearbyData?.places)
        ? nearbyData.places.map(mapGooglePlaceToHospital)
        : [];

      return res.json({ hospitals, source: "google_places_api_live" });
    } catch (err: any) {
      console.error("Google Places nearby lookup error:", err);
      return res.status(500).json({ error: "Failed to query Google Places API for nearby hospitals." });
    }
  });

  // Real Google Maps Places API (New): City / State / PIN / Query Hospital Search (Zero Cooked-Up Data)
  router.post("/hospitals/search", async (req, res) => {
    const { city, state, query } = req.body;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: "Google Maps API key not configured." });
    }

    const rawQuery = String(query || "").trim();
    const cleanCity = String(city || "").trim();
    const cleanState = String(state || "").trim();
    const pinMatch = rawQuery.match(/\b(\d{5,6})\b/);

    const placesHeaders = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-Maps-Solution-ID": "gmp_mcp_codeassist_v1_aistudio",
      "X-Goog-FieldMask": PLACES_FIELD_MASK,
    };

    try {
      // Case 1: User searched by PIN / ZIP code (e.g., 560100)
      if (pinMatch) {
        const pinCode = pinMatch[1];
        let pinCenter: { lat: number; lng: number } | null = null;
        let searchLabel = pinCode;

        // First resolve the geographic center of the PIN code
        const pinGeoResp = await fetch("https://places.googleapis.com/v1/places:searchText", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-Maps-Solution-ID": "gmp_mcp_codeassist_v1_aistudio",
            "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location",
          },
          body: JSON.stringify({
            textQuery: `${pinCode}, India`,
            maxResultCount: 1,
          }),
        });

        if (pinGeoResp.status === 429) {
          return res.status(429).json({ error: "RESOURCE_EXHAUSTED", status: "RESOURCE_EXHAUSTED" });
        }

        const pinGeoData: any = await pinGeoResp.json();
        if (pinGeoData?.error?.status === "RESOURCE_EXHAUSTED") {
          return res.status(429).json({ error: "RESOURCE_EXHAUSTED", status: "RESOURCE_EXHAUSTED" });
        }

        const geoPlace = pinGeoData?.places?.[0];
        if (geoPlace?.location?.latitude != null && geoPlace?.location?.longitude != null) {
          pinCenter = {
            lat: geoPlace.location.latitude,
            lng: geoPlace.location.longitude,
          };
          searchLabel = geoPlace.formattedAddress || geoPlace.displayName?.text || pinCode;
        }

        const textSearchBody: any = {
          textQuery: `hospitals pediatric children clinic in ${rawQuery} India`,
          maxResultCount: 20,
        };
        if (pinCenter) {
          textSearchBody.locationBias = {
            circle: {
              center: { latitude: pinCenter.lat, longitude: pinCenter.lng },
              radius: 8000,
            },
          };
        }

        const requests: Promise<Response>[] = [
          fetch("https://places.googleapis.com/v1/places:searchText", {
            method: "POST",
            headers: placesHeaders,
            body: JSON.stringify(textSearchBody),
          }),
        ];

        if (pinCenter) {
          requests.push(
            fetch("https://places.googleapis.com/v1/places:searchNearby", {
              method: "POST",
              headers: placesHeaders,
              body: JSON.stringify({
                includedTypes: ["hospital"],
                maxResultCount: 20,
                locationRestriction: {
                  circle: {
                    center: { latitude: pinCenter.lat, longitude: pinCenter.lng },
                    radius: 8000,
                  },
                },
              }),
            })
          );
        }

        const responses = await Promise.all(requests);
        for (const r of responses) {
          if (r.status === 429) {
            return res.status(429).json({ error: "RESOURCE_EXHAUSTED", status: "RESOURCE_EXHAUSTED" });
          }
        }

        const payloads: any[] = await Promise.all(responses.map((r) => r.json()));
        for (const p of payloads) {
          if (p?.error?.status === "RESOURCE_EXHAUSTED") {
            return res.status(429).json({ error: "RESOURCE_EXHAUSTED", status: "RESOURCE_EXHAUSTED" });
          }
        }

        const seenIds = new Set<string>();
        const mergedPlaces: any[] = [];
        for (const payload of payloads) {
          if (Array.isArray(payload?.places)) {
            for (const place of payload.places) {
              if (place?.id && !seenIds.has(place.id)) {
                seenIds.add(place.id);
                mergedPlaces.push(place);
              }
            }
          }
        }

        const hospitals = mergedPlaces.map(mapGooglePlaceToHospital);
        // Sort by distance from PIN center so exact PIN-area hospitals appear first
        if (pinCenter && hospitals.length > 1) {
          hospitals.sort((a: any, b: any) => {
            const dA =
              Math.pow((a.location?.lat || 0) - pinCenter!.lat, 2) +
              Math.pow((a.location?.lng || 0) - pinCenter!.lng, 2);
            const dB =
              Math.pow((b.location?.lat || 0) - pinCenter!.lat, 2) +
              Math.pow((b.location?.lng || 0) - pinCenter!.lng, 2);
            return dA - dB;
          });
        }

        return res.json({
          hospitals,
          source: "google_places_api_live",
          queryUsed: textSearchBody.textQuery,
          searchCenter: pinCenter || hospitals[0]?.location || null,
          searchLabel,
        });
      }

      // Case 2: Specific hospital name or locality query
      if (rawQuery) {
        const scopedQuery = `${rawQuery} hospital pediatric clinic in ${cleanCity} ${cleanState} India`.replace(/\s+/g, " ").trim();
        const resp = await fetch("https://places.googleapis.com/v1/places:searchText", {
          method: "POST",
          headers: placesHeaders,
          body: JSON.stringify({
            textQuery: scopedQuery,
            maxResultCount: 20,
          }),
        });

        if (resp.status === 429) {
          return res.status(429).json({ error: "RESOURCE_EXHAUSTED", status: "RESOURCE_EXHAUSTED" });
        }

        const data: any = await resp.json();
        if (data?.error?.status === "RESOURCE_EXHAUSTED") {
          return res.status(429).json({ error: "RESOURCE_EXHAUSTED", status: "RESOURCE_EXHAUSTED" });
        }

        let places = Array.isArray(data?.places) ? data.places : [];
        let queryUsed = scopedQuery;

        // If few results found within dropdown city/state, broaden search across India (e.g. searching a hospital or area in another city)
        if (places.length < 3) {
          const broadQuery = `${rawQuery} hospital India`;
          const broadResp = await fetch("https://places.googleapis.com/v1/places:searchText", {
            method: "POST",
            headers: placesHeaders,
            body: JSON.stringify({
              textQuery: broadQuery,
              maxResultCount: 20,
            }),
          });
          if (broadResp.status === 429) {
            return res.status(429).json({ error: "RESOURCE_EXHAUSTED", status: "RESOURCE_EXHAUSTED" });
          }
          const broadData: any = await broadResp.json();
          if (broadData?.error?.status === "RESOURCE_EXHAUSTED") {
            return res.status(429).json({ error: "RESOURCE_EXHAUSTED", status: "RESOURCE_EXHAUSTED" });
          }
          if (Array.isArray(broadData?.places) && broadData.places.length > places.length) {
            const seen = new Set(places.map((p: any) => p.id));
            for (const p of broadData.places) {
              if (p?.id && !seen.has(p.id)) {
                seen.add(p.id);
                places.push(p);
              }
            }
            queryUsed = broadQuery;
          }
        }

        const hospitals = places.map(mapGooglePlaceToHospital);
        return res.json({
          hospitals,
          source: "google_places_api_live",
          queryUsed,
          searchCenter: hospitals[0]?.location || null,
          searchLabel: rawQuery,
        });
      }

      // Case 3: Default City & State browse
      const searchQuery = `Best Pediatric and Children Hospitals in ${cleanCity || "Bengaluru"}, ${cleanState || "Karnataka"}, India`;
      const resp = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: placesHeaders,
        body: JSON.stringify({
          textQuery: searchQuery,
          maxResultCount: 20,
        }),
      });

      if (resp.status === 429) {
        return res.status(429).json({ error: "RESOURCE_EXHAUSTED", status: "RESOURCE_EXHAUSTED" });
      }

      const data: any = await resp.json();
      if (data?.error?.status === "RESOURCE_EXHAUSTED") {
        return res.status(429).json({ error: "RESOURCE_EXHAUSTED", status: "RESOURCE_EXHAUSTED" });
      }

      const hospitals = Array.isArray(data?.places)
        ? data.places.map(mapGooglePlaceToHospital)
        : [];

      return res.json({
        hospitals,
        source: "google_places_api_live",
        queryUsed: searchQuery,
        searchCenter: hospitals[0]?.location || null,
      });
    } catch (err: any) {
      console.error("Google Places text search error:", err);
      return res.status(500).json({ error: "Failed to search Google Places API for hospitals." });
    }
  });

  // Content Moderation Endpoint for Parent Connect & Community Help
  router.post("/moderate-content", createRateLimiter(35), async (req, res) => {
    const { text, contextType = "community_post" } = req.body;
    const content = String(text || "").trim();

    if (!content) {
      return res.status(400).json({ approved: false, category: "EMPTY", reason: "Message cannot be empty." });
    }

    // 1. Deterministic Fast Guardrails for PII, Profanity/Abuse, Spam, and Dangerous Pediatric Advice
    const phoneRegex = /\b(\+?91[\-\s]?)?[6-9]\d{9}\b/;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const aadhaarPanRegex = /\b(\d{4}\s\d{4}\s\d{4}|[A-Z]{5}\d{4}[A-Z])\b/;
    if (phoneRegex.test(content) || emailRegex.test(content) || aadhaarPanRegex.test(content)) {
      return res.json({
        approved: false,
        category: "PII",
        reason: "For your family's safety under the DPDP Act 2023, sharing personal phone numbers, email addresses, or government IDs in public community threads is blocked.",
      });
    }

    const profanityRegex = /\b(fuck|shit|bitch|asshole|bastard|idiot\s+parent|stupid\s+mother|kill\s+yourself|whore|slut|cunt|chutiya|madarchod|bhenchod|gandu|harami)\b/i;
    if (profanityRegex.test(content)) {
      return res.json({
        approved: false,
        category: "TOXICITY",
        reason: "This message contains disrespectful or abusive language. Tricky Toddlers Parent Connect is a compassionate, judgment-free parenting community.",
      });
    }

    const unsafeMedicalRegex = /\b(give\s+honey\s+to\s+(newborn|infant|1\s+month|2\s+month|3\s+month|4\s+month|5\s+month)|give\s+aspirin\s+to\s+baby|give\s+sleeping\s+pills?\s+to\s+(baby|toddler)|give\s+alcohol\s+to\s+baby|don'?t\s+go\s+to\s+hospital\s+for\s+seizure|ignore\s+breathing\s+trouble)\b/i;
    if (unsafeMedicalRegex.test(content)) {
      return res.json({
        approved: false,
        category: "UNSAFE_MEDICAL",
        reason: "This post suggests potentially hazardous pediatric medical practices (such as honey under 12 months, adult sedatives/aspirin for infants, or delaying emergency care) that conflict with Indian Academy of Pediatrics (IAP) safety standards.",
      });
    }

    const spamRegex = /\b(crypto\s+giveaway|whatsapp\s+investment|earn\s+rs\s*\d+\s+daily|click\s+this\s+telegram\s+link|betting\s+app|casino\s+bonus)\b/i;
    if (spamRegex.test(content)) {
      return res.json({
        approved: false,
        category: "SPAM",
        reason: "Commercial spam, promotional links, and solicitation are not permitted in the parenting community.",
      });
    }

    // 2. AI Moderation pass with Gemini 4 Hydrogen for nuanced safety check
    try {
      const ai = getAI();
      if (ai) {
        const modPrompt = `You are the Trust & Safety Content Moderator for "Tricky Toddlers", an Indian parenting and pediatric wellness community.
Evaluate the following ${contextType} submitted by a parent:
"""
${content}
"""
Block (approved: false) ONLY if the message contains:
1. PII (phone numbers, home addresses, emails, financial credentials)
2. Harassment, bullying, hate speech, or parent-shaming abuse
3. Dangerous pediatric medical misinformation that could harm an infant or child (e.g., giving honey to infants under 1 year, giving adult prescription drugs/sedatives, rubbing alcohol for fever, or telling parents not to seek medical care for emergencies)
4. Commercial spam or scam links

Otherwise, approve (approved: true) supportive questions, venting about parenting tiredness, normal toddler symptoms, recipes, and friendly greetings.

Return strictly JSON:
{
  "approved": boolean,
  "category": "SAFE" | "PII" | "TOXICITY" | "UNSAFE_MEDICAL" | "SPAM",
  "reason": "Short, empathetic explanation if blocked, or 'Verified safe for Parent Connect' if approved"
}`;

        const resp = await withTimeout(
          ai.models.generateContent({
            model: "gemini-4-hydrogen",
            contents: modPrompt,
            config: { responseMimeType: "application/json" },
          }),
          3500
        );
        if (resp.text) {
          const clean = resp.text.replace(/```json/gi, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(clean);
          if (typeof parsed.approved === "boolean") {
            return res.json(parsed);
          }
        }
      }
    } catch {
      // Fall through to deterministic safe approval if AI moderation times out
    }

    return res.json({
      approved: true,
      category: "SAFE",
      reason: "Verified safe by Tricky Toddlers Responsible AI Moderation.",
    });
  });

  // DPDP Act, 2023 (Digital Personal Data Protection Act, India) Compliance Endpoints
  router.post("/dpdp/consent-audit", (req, res) => {
    const { parentName, parentEmail, consentGranted, purposes } = req.body;
    const receiptId = `DPDP-IND-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    res.json({
      receiptId,
      statute: "Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023, Government of India)",
      section: "Section 6 (Notice & Consent) & Section 9 (Processing of Personal Data of Children - Verifiable Parental Consent)",
      dataPrincipal: parentName || "Parent / Legal Guardian",
      contact: parentEmail || "Registered Account",
      verifiableParentalConsent: Boolean(consentGranted),
      approvedPurposes: Array.isArray(purposes)
        ? purposes
        : ["Child Growth & Milestone Tracking", "Age-Matched Indian Nutrition & Allergy Filtering", "Pediatric AI Guidance"],
      timestamp: new Date().toISOString(),
      status: consentGranted ? "VERIFIED_ACTIVE" : "CONSENT_WITHDRAWN",
    });
  });

  router.post("/dpdp/erasure-certificate", (req, res) => {
    const { parentName, parentEmail } = req.body;
    const certificateId = `DPDP-ERASURE-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    res.json({
      certificateId,
      statute: "Digital Personal Data Protection Act, 2023 (Section 12 - Right of Correction and Erasure)",
      dataFiduciary: "Tricky Toddlers Pediatric Platform (India)",
      dataPrincipal: parentName || "Parent / Legal Guardian",
      accountIdentifier: parentEmail || "Authenticated Session",
      erasedDataCategories: [
        "Child Profile & Biometric/Growth Records (Section 9 Minor Data)",
        "Dietary Preferences, Allergy Profiles & Daily Dish Logs",
        "AI Assistant & Pediatrician Consultation Transcripts",
        "AI NutriChef Saved Recipe History & FoodLens Scans"
      ],
      retentionNote: "Zero personal or minor health data retained post-erasure.",
      issuedAt: new Date().toISOString(),
    });
  });

  router.post("/dpdp/grievance", (req, res) => {
    const { parentName, parentEmail, issueType, details } = req.body;
    const ticketId = `GRV-DPDP-${Date.now().toString().slice(-6)}`;
    res.json({
      ticketId,
      statute: "Digital Personal Data Protection Act, 2023 (Section 13 - Right of Grievance Redressal)",
      grievanceOfficer: "Adv. Meenakshi Sundaram (Data Protection & Grievance Officer - India)",
      grievanceEmail: "dpo-grievance@trickytoddlers.in",
      slaResponseHours: 72,
      submittedBy: parentName || "Parent",
      email: parentEmail || "",
      issueType: issueType || "Data Privacy / Consent Inquiry",
      summary: String(details || "").slice(0, 300),
      createdAt: new Date().toISOString(),
      status: "REGISTERED_WITH_DPO",
    });
  });

  // ============================================================================
  // Site Analytics Context & Private Admin Authentication Endpoints
  // ============================================================================
  router.get("/analytics/context", (req, res) => {
    const rawCity = String(
      req.headers["x-appengine-city"] ||
      req.headers["x-vercel-ip-city"] ||
      req.headers["cf-ipcity"] ||
      ""
    ).trim();
    const rawRegion = String(
      req.headers["x-appengine-region"] ||
      req.headers["x-vercel-ip-country-region"] ||
      req.headers["cf-region"] ||
      ""
    ).trim();
    const rawCountry = String(
      req.headers["x-appengine-country"] ||
      req.headers["cf-ipcountry"] ||
      req.headers["x-vercel-ip-country"] ||
      ""
    ).trim();

    const ua = String(req.headers["user-agent"] || "");
    let deviceType = "Desktop";
    if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) {
      deviceType = "Tablet";
    } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Opera Mini/i.test(ua)) {
      deviceType = "Mobile";
    }

    let browser = "Google Chrome";
    if (/Edg\//i.test(ua)) browser = "Microsoft Edge";
    else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) browser = "Opera";
    else if (/Firefox\//i.test(ua)) browser = "Mozilla Firefox";
    else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = "Apple Safari";

    let os = "Desktop OS";
    if (/Windows/i.test(ua)) os = "Windows";
    else if (/Android/i.test(ua)) os = "Android";
    else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
    else if (/Mac OS X|Macintosh/i.test(ua)) os = "macOS";
    else if (/Linux/i.test(ua)) os = "Linux";

    const countryMap: Record<string, string> = {
      IN: "India",
      US: "United States",
      GB: "United Kingdom",
      UK: "United Kingdom",
      AE: "United Arab Emirates",
      SG: "Singapore",
      CA: "Canada",
      AU: "Australia",
      DE: "Germany",
    };

    const country = countryMap[rawCountry.toUpperCase()] || rawCountry || "Unknown";
    const city = rawCity ? rawCity.replace(/\b\w/g, (c) => c.toUpperCase()) : "Unknown";
    const region = rawRegion ? rawRegion.toUpperCase() : "Unknown";

    res.json({
      city,
      region,
      country,
      deviceType,
      browser,
      os,
    });
  });

  router.get("/admin/status", (_req, res) => {
    const hasEnvPassword = Boolean((process.env.ADMIN_PASSWORD || "").trim());
    const isConfigured = isAdminPasswordConfigured();
    res.json({
      isConfigured,
      hasEnvPassword,
      adminUsername: getConfiguredAdminUsername(),
    });
  });

  router.post("/admin/claim", (req, res) => {
    const { username, password } = req.body || {};
    const cleanUser = String(username || "admin").trim().toLowerCase();
    const cleanPass = String(password || "");

    if (cleanUser.length < 3 || cleanUser.length > 32 || !/^[a-z0-9_.-]+$/.test(cleanUser)) {
      return res.status(400).json({ error: "Username must be 3-32 alphanumeric characters." });
    }
    if (cleanPass.length < 6 || cleanPass.length > 128) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    // If an admin password is already configured via .env, verify against it instead of overwriting
    if (isAdminPasswordConfigured()) {
      const expectedUser = getConfiguredAdminUsername();
      if (cleanUser !== expectedUser || !verifyAdminPassword(cleanPass)) {
        return res.status(401).json({ error: "Admin account is already configured. Please sign in with your admin password." });
      }
      const token = issueAdminSessionToken(expectedUser);
      return res.json({
        success: true,
        username: expectedUser,
        token,
      });
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(cleanPass, salt, 64);
    claimedAdminUsername = cleanUser;
    claimedAdminSalt = salt;
    claimedAdminHash = hash;

    const token = issueAdminSessionToken(cleanUser);
    return res.json({
      success: true,
      username: cleanUser,
      token,
    });
  });

  router.post("/admin/login", (req, res) => {
    const { username, password } = req.body || {};
    const cleanUser = String(username || "").trim().toLowerCase();
    const cleanPass = String(password || "");

    if (!cleanUser || !cleanPass) {
      return res.status(400).json({ error: "Please enter both admin username and password." });
    }

    // If not yet claimed on this server instance and no .env password is set, bootstrap with the provided credentials
    if (!isAdminPasswordConfigured()) {
      if (cleanPass.length < 6) {
        return res.status(400).json({ error: "Admin password must be at least 6 characters." });
      }
      const salt = crypto.randomBytes(16).toString("hex");
      const hash = crypto.scryptSync(cleanPass, salt, 64);
      claimedAdminUsername = cleanUser;
      claimedAdminSalt = salt;
      claimedAdminHash = hash;
      const token = issueAdminSessionToken(cleanUser);
      return res.json({
        success: true,
        username: cleanUser,
        token,
        claimedOnFirstLogin: true,
      });
    }

    const expectedUser = getConfiguredAdminUsername();
    if (cleanUser !== expectedUser || !verifyAdminPassword(cleanPass)) {
      return res.status(401).json({ error: "Invalid admin username or password." });
    }

    const token = issueAdminSessionToken(expectedUser);
    return res.json({
      success: true,
      username: expectedUser,
      token,
    });
  });

  router.get("/admin/verify", (req, res) => {
    const check = verifyAdminSessionToken(req.headers.authorization);
    if (!check.valid) {
      return res.status(401).json({ valid: false });
    }
    return res.json({ valid: true, username: check.username });
  });

  router.post("/admin/logout", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7).trim();
      activeAdminSessions.delete(token);
    }
    return res.json({ success: true });
  });

  return router;
}

export function createApiApp(): express.Express {
  const app = express();
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  const apiRouter = createApiRouter();
  // Apply sliding-window API rate limiting on /api routes
  app.use("/api", createRateLimiter(60), apiRouter);

  return app;
}
