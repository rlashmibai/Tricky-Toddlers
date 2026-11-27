export interface AISearchRecord {
  id: string;
  question: string;
  answer: string;
  date: string;
  time: string;
  month: string; // e.g. "September 2026", "August 2026"
  category: 'Bedtime & Sleep' | 'Nutrition & Feeding' | 'Tantrums & Behavior' | 'Potty Training' | 'Growth & Milestones' | 'General Pediatric';
  tags: string[];
}

export const AI_HISTORY_STORAGE_KEY = 'tt_ai_search_history';

export const CATEGORY_COLORS: Record<AISearchRecord['category'], { bg: string; text: string; border: string }> = {
  'Bedtime & Sleep': {
    bg: 'bg-indigo-500/15',
    text: 'text-indigo-300',
    border: 'border-indigo-500/30',
  },
  'Nutrition & Feeding': {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
  },
  'Tantrums & Behavior': {
    bg: 'bg-amber-500/15',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
  },
  'Potty Training': {
    bg: 'bg-cyan-500/15',
    text: 'text-cyan-300',
    border: 'border-cyan-500/30',
  },
  'Growth & Milestones': {
    bg: 'bg-purple-500/15',
    text: 'text-purple-300',
    border: 'border-purple-500/30',
  },
  'General Pediatric': {
    bg: 'bg-blue-500/15',
    text: 'text-blue-300',
    border: 'border-blue-500/30',
  },
};

export const AI_HISTORY_RESET_FLAG = 'tt_ai_history_fresh_start_2026_11_27';

export const INITIAL_AI_SEARCH_HISTORY: AISearchRecord[] = [];

export function ensureFreshAIHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    if (localStorage.getItem(AI_HISTORY_RESET_FLAG) !== '1') {
      localStorage.setItem(AI_HISTORY_STORAGE_KEY, JSON.stringify([]));
      localStorage.setItem(AI_HISTORY_RESET_FLAG, '1');
    }
  } catch {
    // ignore storage errors
  }
}

export function isPersonalInfoQuery(query: string): boolean {
  const q = (query || '').toLowerCase().trim();
  if (!q) return false;

  // Exclude normal pediatric/parenting phrases that contain words like "address", "contact", or "pin"
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


export function parseChildAgeBracket(ageStr?: string): {
  bracket: 'infant' | 'toddler' | 'preschool' | 'school' | 'teen';
  label: string;
} {
  const s = (ageStr || '').toLowerCase().trim();
  
  if (!s) {
    return { bracket: 'toddler', label: '14 Months · Toddler (1–3 Years)' };
  }

  if (s.includes('newborn') || s.includes('just born')) {
    return { bracket: 'infant', label: `${ageStr} · Infant (0–12 Months)` };
  }

  let totalYears = -1;

  // Check for combined pattern like "2 years 3 months" or "2 yr 3 mo"
  const yrMatch = s.match(/(\d+(\.\d+)?)\s*(year|yr)/);
  const moMatch = s.match(/(\d+)\s*(month|mo)/);

  if (yrMatch && moMatch) {
    const y = parseFloat(yrMatch[1]);
    const m = parseInt(moMatch[1], 10);
    totalYears = y + m / 12;
  } else if (yrMatch) {
    totalYears = parseFloat(yrMatch[1]);
  } else if (moMatch) {
    const m = parseInt(moMatch[1], 10);
    totalYears = m / 12;
  } else {
    const num = parseFloat(s);
    if (!isNaN(num) && num > 0) {
      if (num <= 18) {
        totalYears = num;
      } else {
        totalYears = num / 12;
      }
    }
  }

  if (totalYears >= 0) {
    if (totalYears < 1) {
      return { bracket: 'infant', label: `${ageStr} · Infant (0–12 Months)` };
    }
    if (totalYears <= 3) {
      return { bracket: 'toddler', label: `${ageStr} · Toddler (1–3 Years)` };
    }
    if (totalYears <= 5) {
      return { bracket: 'preschool', label: `${ageStr} · Preschooler (3–5 Years)` };
    }
    if (totalYears <= 12) {
      return { bracket: 'school', label: `${ageStr} · School Age (6–12 Years)` };
    }
    return { bracket: 'teen', label: `${ageStr} · Adolescent & Teen (13–18 Years)` };
  }

  return { bracket: 'toddler', label: ageStr || '14 Months · Toddler (1–3 Years)' };
}

export function getHowICanSupportYou(childName?: string, childAge?: string): string {
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

export function getResponsibleAIRefusal(parentName?: string, childName?: string, childAge?: string): string {
  const pName = parentName?.trim() || 'Parent';
  const cName = childName?.trim() || 'Child 1';
  return `### 🛡️ Responsible AI & Privacy Notice

${pName},

**Tricky Toddler AI** is committed to strict **Responsible AI**, **Child Online Privacy Protection (COPPA)**, and **Healthcare Privacy Standards**.

**I cannot answer questions asking for personal information or disclose private personal data** (such as phone numbers, email addresses, physical home addresses, passwords, credit card/banking details, or government identification).

All our capabilities are strictly focused on pediatric health, growth milestones, nutrition, and child development (ages 0 to 18) for ${cName} in a safe, privacy-preserving environment.

---

${getHowICanSupportYou(cName, childAge)}`;
}

export function getOutOfScopePediatricNotice(parentName?: string, childName?: string, childAge?: string): string {
  const pName = parentName?.trim() || 'Parent';
  const cName = childName?.trim() || 'Child 1';
  return `### 🛡️ Tricky Toddler AI: Pediatric Scope Notice

${pName},

**Tricky Toddler AI** is a specialized pediatric and child development assistant fine-tuned exclusively for infants, children, and adolescents from birth up to 18 years of age.

I cannot provide answers or commentary regarding non-pediatric topics such as newly released songs, entertainment news, movies, adult medical concerns, coding, politics, or financial markets.

---

${getHowICanSupportYou(cName, childAge)}`;
}

export function isOutOfScopeQuery(query: string): boolean {
  const q = query.toLowerCase().trim();
  const strictlyAdultKeywords = [
    'adult dating', 'porn', 'xxx', 'viagra', 'erectile dysfunction', 'cryptocurrency trading', 'forex trading bot'
  ];
  return strictlyAdultKeywords.some(kw => q.includes(kw));
}

export function detectCategory(question: string): AISearchRecord['category'] {
  const q = question.toLowerCase();
  // Specific domains first
  if (q.includes('potty') || q.includes('toilet') || q.includes('diaper') || q.includes('pee') || q.includes('poop') || q.includes('undies')) {
    return 'Potty Training';
  }
  if (q.includes('eat') || q.includes('food') || q.includes('meal') || q.includes('picky') || q.includes('feed') || q.includes('milk') || q.includes('vegetable') || q.includes('lentil') || q.includes('snack') || q.includes('choking') || q.includes('nutrition')) {
    return 'Nutrition & Feeding';
  }
  if (q.includes('hit') || q.includes('bite') || q.includes('tantrum') || q.includes('anger') || q.includes('scream') || q.includes('yell') || q.includes('no') || q.includes('defian') || q.includes('behavi') || q.includes('meltdown') || q.includes('kick')) {
    return 'Tantrums & Behavior';
  }
  if (q.includes('bedtime') || q.includes('sleep') || q.includes('night waking') || q.includes('night wake') || q.includes('nap') || q.includes('crib') || q.includes('wake window') || q.includes('falling asleep')) {
    return 'Bedtime & Sleep';
  }
  if (q.includes('speech') || q.includes('word') || q.includes('talk') || q.includes('walk') || q.includes('milestone') || q.includes('growth') || q.includes('weight') || q.includes('height') || q.includes('motor')) {
    return 'Growth & Milestones';
  }
  return 'General Pediatric';
}

export function getAISearchRecords(): AISearchRecord[] {
  try {
    ensureFreshAIHistory();
    const isGuest = typeof window !== 'undefined' && localStorage.getItem('tt_auth_mode') !== 'account';
    const normalizeRecord = (r: AISearchRecord): AISearchRecord => {
      if (!isGuest || !r?.answer) return r;
      return {
        ...r,
        answer: r.answer.replace(/\bLashmi\b/g, 'Parent').replace(/\bAshwath\b/g, 'Child 1').replace(/\bAnanya\b/g, 'Child 2')
      };
    };
    const raw = localStorage.getItem(AI_HISTORY_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(AI_HISTORY_STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map(normalizeRecord);
    }
    return [];
  } catch {
    return [];
  }
}

export function saveAISearchRecord(question: string, answer: string): AISearchRecord {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fullMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthAbbr = monthNames[now.getMonth()];
  const year = now.getFullYear();

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const timeStr = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

  const category = detectCategory(question);

  const newRecord: AISearchRecord = {
    id: `ai-hist-${Date.now()}`,
    question: question.trim(),
    answer: answer.trim(),
    date: `${day} ${monthAbbr} ${year}`,
    time: timeStr,
    month: `${fullMonthNames[now.getMonth()]} ${year}`,
    category,
    tags: [category.split(' ')[0], 'Pediatric Guidance']
  };

  try {
    const current = getAISearchRecords();
    const updated = [newRecord, ...current];
    localStorage.setItem(AI_HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save AI search history:', err);
  }

  return newRecord;
}

export function deleteAISearchRecord(id: string): AISearchRecord[] {
  try {
    const current = getAISearchRecords();
    const updated = current.filter(item => item.id !== id);
    localStorage.setItem(AI_HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearAllAISearchRecords(): void {
  try {
    localStorage.setItem(AI_HISTORY_STORAGE_KEY, JSON.stringify([]));
  } catch (err) {
    console.error('Failed to clear AI search history:', err);
  }
}

export function getFollowUpQuestions(query: string, response?: string): string[] {
  const userQ = query.toLowerCase().trim();
  const respText = (response || '').toLowerCase();

  // If user asked for personal info (PII), uphold Responsible AI
  if (isPersonalInfoQuery(userQ)) {
    return [
      'How does Tricky Toddler AI protect my family’s privacy and child data?',
      'What developmental milestones should I track for my child’s age?',
      'What wholesome Indian foods support my child’s growth?',
      'How do I establish a calming screen-free bedtime routine?'
    ];
  }

  // If user asked something out of scope, guide them back to pediatric development
  if (isOutOfScopeQuery(userQ)) {
    return [
      'What are the key pediatric milestones for my child’s age?',
      'How to handle bedtime stalling and establish a peaceful routine?',
      'What wholesome Indian foods support my child’s growth?',
      'What are positive parenting scripts for handling big feelings?'
    ];
  }

  // 1. Potty Training (strictly prioritized so potty never shows bedtime questions!)
  if (userQ.includes('potty') || userQ.includes('toilet') || userQ.includes('diaper') || userQ.includes('pee') || userQ.includes('poop') || userQ.includes('undies') || userQ.includes('withhold')) {
    return [
      'What should I do if my toddler holds their poop and refuses the potty?',
      'How do I handle potty training regression after illness or starting preschool?',
      'Should I use pull-ups or switch straight to cotton underwear?',
      'How often should I prompt my toddler to sit on the potty each day?'
    ];
  }

  // 2. Nutrition & Picky Eating
  if (userQ.includes('eat') || userQ.includes('picky') || userQ.includes('food') || userQ.includes('feed') || userQ.includes('vegetable') || userQ.includes('milk') || userQ.includes('meal') || userQ.includes('chok') || userQ.includes('snack')) {
    return [
      'How much whole milk or calcium does a toddler actually need daily?',
      'What are easy iron-rich finger foods for picky toddlers?',
      'How do I stop plate throwing and mealtime food refusal?',
      'Is my toddler getting enough nutrients if they only eat 1 meal a day?'
    ];
  }

  // 3. Tantrums, Hitting, Biting & Emotional Meltdowns
  if (userQ.includes('hit') || userQ.includes('bite') || userQ.includes('tantrum') || userQ.includes('scream') || userQ.includes('meltdown') || userQ.includes('aggression') || userQ.includes('kick') || userQ.includes('anger')) {
    return [
      'How can I co-regulate and stay calm during an intense public tantrum?',
      'What is the difference between a sensory meltdown and a boundary tantrum?',
      'How do I teach gentle hands without constantly shouting "No"?',
      'Should I use a calm-down corner, time-out, or time-in?'
    ];
  }

  // 4. Saying "No", Defiance & Power Struggles
  if (userQ.includes('no') || userQ.includes('defian') || userQ.includes('listen') || userQ.includes('refus') || userQ.includes('stubborn') || userQ.includes('power struggle')) {
    return [
      'How do I offer two choices to prevent power struggles at transition times?',
      'How do I get my toddler to leave the playground without screaming?',
      'How do I use "When... Then..." phrasing effectively with toddlers?',
      'What is the best way to respond when my toddler screams "NO" at me?'
    ];
  }

  // 5. Speech, Words & Language Milestones
  if (userQ.includes('speech') || userQ.includes('word') || userQ.includes('talk') || userQ.includes('language') || userQ.includes('babble') || userQ.includes('say')) {
    return [
      'What are the IAP and pediatric red flags for speech delay at 18–24 months?',
      'How do I encourage two-word combinations like "more water"?',
      'Does background TV or screen time delay speech development?',
      'What everyday interactive routines boost toddler language most?'
    ];
  }

  // 6. Bedtime, Sleep, Night Waking & Naps
  if (userQ.includes('sleep') || userQ.includes('bedtime') || userQ.includes('nap') || userQ.includes('wake') || userQ.includes('night') || userQ.includes('crib') || userQ.includes('cot') || userQ.includes('routine')) {
    return [
      'How do I handle sudden middle-of-the-night waking without creating new habits?',
      'What is the ideal wake window and nap schedule for my toddler’s age?',
      'How do I transition my toddler from crib to toddler bed safely?',
      'How do I handle bedtime separation anxiety when leaving their room?'
    ];
  }

  // 7. Health, Teething & Fever
  if (userQ.includes('fever') || userQ.includes('teeth') || userQ.includes('teething') || userQ.includes('drool') || userQ.includes('sick') || userQ.includes('cough') || userQ.includes('cold')) {
    return [
      'When does a toddler fever require an immediate pediatric doctor visit?',
      'What are safe, evidence-based ways to soothe painful teething gums?',
      'Can teething cause loose stool or diaper rash?',
      'What is the safest dosage schedule for infant/toddler fever reducers?'
    ];
  }

  // Fallback check on response content if query was ambiguous
  if (respText.includes('potty') || respText.includes('toilet') || respText.includes('diaper')) {
    return [
      'What should I do if my toddler holds their poop and refuses the potty?',
      'How do I handle potty training regression after illness or starting preschool?',
      'Should I use pull-ups or switch straight to cotton underwear?',
      'How often should I prompt my toddler to sit on the potty each day?'
    ];
  }

  if (respText.includes('vegetable') || respText.includes('picky') || respText.includes('feeding') || respText.includes('calories')) {
    return [
      'How much whole milk or calcium does a toddler actually need daily?',
      'What are easy iron-rich finger foods for picky toddlers?',
      'How do I stop plate throwing and mealtime food refusal?',
      'Is my toddler getting enough nutrients if they only eat 1 meal a day?'
    ];
  }

  return [
    'What are the most critical developmental milestones for this age?',
    'How much independent play time should I expect each day?',
    'What daily routine best balances active physical play and quiet time?',
    'When is the right time to consult a pediatrician about behavioral concerns?'
  ];
}
