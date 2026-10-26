import express from "express";
import { GoogleGenAI } from "@google/genai";

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
  const pName = parentName?.trim() || "Lashmi";
  let result = text;
  
  // Clean corrupted greetings, stuttered name fragments (e.g. "Lashmi, mi!", "Lashmi, Lashmi!")
  result = result
    .replace(new RegExp(`\\b${pName}[,\\s]+${pName.slice(-2)}[!\\?,\\s]*`, 'gi'), `${pName}, `)
    .replace(new RegExp(`\\b${pName}[,\\s]+${pName}[!,\\s]*`, 'gi'), `${pName}, `)
    .replace(/\b([A-Z][a-z]+)[,\s]+([a-z]{1,3})[!,\s]+/gi, (m, name, suffix) => {
      if (name.toLowerCase().endsWith(suffix.toLowerCase())) {
        return `${name}, `;
      }
      return m;
    });

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
  const cName = childName?.trim() || 'Ashwath';
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
  const pName = parentName?.trim() || "Lashmi";
  const cName = childName?.trim() || "Ashwath";
  return `### 🛡️ Responsible AI & Privacy Notice

${pName},

**Tricky Toddler AI** is committed to strict **Responsible AI**, **Child Online Privacy Protection (COPPA)**, and **Healthcare Privacy Standards**.

**I cannot answer questions asking for personal information or disclose private personal data** (such as phone numbers, email addresses, physical home addresses, passwords, credit card/banking details, or government identification).

All our capabilities are strictly focused on pediatric health, growth milestones, nutrition, and child development (ages 0 to 18) for ${cName} in a safe, privacy-preserving environment.

---

${getHowICanSupportYou(cName, childAge)}`;
}

function getOutOfScopePediatricNotice(parentName?: string, childName?: string, childAge?: string): string {
  const pName = parentName?.trim() || "Lashmi";
  const cName = childName?.trim() || "Ashwath";
  return `### 🛡️ Tricky Toddler AI: Pediatric Scope Notice

${pName},

**Tricky Toddler AI** is a specialized pediatric and child development assistant fine-tuned exclusively for infants, children, and adolescents from birth up to 18 years of age.

I cannot provide answers or commentary regarding non-pediatric topics such as newly released songs, entertainment news, movies, adult medical concerns, coding, politics, or financial markets.

---

${getHowICanSupportYou(cName, childAge)}`;
}

function isPersonalInfoQuery(query: string): boolean {
  const q = (query || '').toLowerCase().trim();
  const piiKeywords = [
    'personal info', 'personal information', 'personal details', 'personal data', 'pii',
    'phone number', 'mobile number', 'cell phone', 'contact number', 'whatsapp number', 'telephone',
    'phone no', 'mobile no', 'contact no', 'give me phone', 'what is your phone', 'share your phone',
    'email address', 'email id', 'gmail id', 'what is your email', 'give me email', 'share your email', 'your email', 'my email', 'user email',
    'home address', 'residential address', 'where do you live', 'physical address', 'street address', 'postal code', 'pin code', 'zip code', 'your address',
    'password', 'passcode', 'login credentials', 'secret key', 'api key', 'private key', 'auth token', 'otp',
    'credit card', 'debit card', 'cvv', 'card number', 'bank account', 'account number', 'ifsc', 'net banking', 'upi id', 'upi pin',
    'aadhaar', 'pan card', 'social security', 'ssn', 'passport number', 'voter id', 'driving license',
    'private record', 'confidential info', 'private identity', 'personal identity',
    'tell me personal', 'give me personal', 'what is user', 'who created you give their personal',
    'give me ashwath phone', 'give me lashmi phone', 'doctor phone', 'doctor contact',
    'contact details', 'contact info', 'share contact', 'give contact',
    'personal profile', 'user info', 'account details', 'give personal', 'share personal'
  ];
  return piiKeywords.some(kw => q.includes(kw));
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

function generateTailoredFallback(q: string, parentName?: string, childName?: string, childAge?: string): string {
  const pName = parentName?.trim() || "Lashmi";
  const cName = childName?.trim() || "Ashwath";
  const age = childAge?.trim() || "14 Months";
  const lq = (q || '').toLowerCase();

  if (isPersonalInfoQuery(lq)) {
    return getResponsibleAIRefusal(pName, cName, age);
  }
  if (isOutOfScopeQuery(lq)) {
    return getOutOfScopePediatricNotice(pName, cName, age);
  }

  // Picky Eating
  if (lq.includes('picky') || lq.includes('eat') || lq.includes('food') || lq.includes('feed') || lq.includes('hungry') || lq.includes('milk') || lq.includes('appetite')) {
    return `${pName}, here is gentle, practical guidance for feeding ${cName}:

### 📋 Step-by-Step Action Plan (for ${pName} & ${cName})
1. **Set Up a Calm Family Meal Table**: Sit together with ${cName} without phones, television, or noisy distractions. When children see parents enjoy eating, they naturally want to try.
2. **Offer Small Portions First**: Place just 2 small bites of a new dish alongside a familiar favorite like warm moong dal khichdi with pure A2 ghee.
3. **Respect the 'All Done' Cue**: Never force-feed ${cName}. Toddler tummies are small and self-regulate naturally.
4. **Try 10 to 15 Times Patiently**: It can take up to 15 calm exposures before a toddler accepts a new texture. Keep smiling!

### 🗣️ Calming Parent Scripts (What to Say to ${cName})
- *"You do not have to finish everything, ${cName}. You can take just one little taste."*
- *"Look at this warm khichdi with ghee, ${cName}. It smells so good!"*
- *"Is your tummy happy and full, ${cName}, or would you like one more bite?"*
- *"Food stays on the table, ${cName}. When we leave the table, eating is done until snack time."*

### ⚠️ Common Mistakes to Avoid
- Avoid offering mobile phone videos or cartoons to make ${cName} open their mouth.
- Avoid cooking a separate junk food meal when ${cName} says no to healthy dinner.

### 🌐 Trusted Health Guidelines
- [Indian Academy of Pediatrics (IAP) - Infant and Young Child Feeding](https://iapindia.org)
- [ICMR - National Institute of Nutrition (NIN)](https://www.nin.res.in)`;
  }

  // Hitting, Biting, Tantrums
  if (lq.includes('hit') || lq.includes('bite') || lq.includes('tantrum') || lq.includes('angry') || lq.includes('scream') || lq.includes('cry') || lq.includes('pinch')) {
    return `${pName}, here is loving, gentle guidance to handle big feelings and tantrums with ${cName}:

### 📋 Step-by-Step Action Plan (for ${pName} & ${cName})
1. **Stay Calm First**: Take a slow deep breath before speaking. When you stay calm, ${cName} feels secure and calms down much faster.
2. **Hold Hands Firmly and Lovingly**: If ${cName} tries to hit or bite, gently hold their hands: say quietly, *"I will keep us safe, ${cName}. Hands are not for hitting."*
3. **Give a Safe Way to Show Anger**: Tell ${cName} they can stomp their feet on the floor, squeeze a soft pillow, or blow big breaths like a lion.
4. **Stay Close Instead of Time-Out**: Sit near ${cName} and offer an open hug or gentle back patting (thappi) as soon as they are ready.

### 🗣️ Calming Parent Scripts (What to Say to ${cName})
- *"You are feeling very upset right now, ${cName}. Mamma is right here with you."*
- *"My hands are gentle, and your hands are gentle, ${cName}. We use hands for hugging."*
- *"It is okay to feel angry, ${cName}, but it is not okay to hit."*
- *"Whenever you want a big cuddle, ${cName}, my arms are wide open."*

### ⚠️ Common Mistakes to Avoid
- Avoid shouting, lecturing, or hitting back to teach a lesson.
- Avoid isolating ${cName} alone in a dark room when they are crying.

### 🌐 Trusted Health Guidelines
- [Indian Academy of Pediatrics (IAP) - Parenting Guidelines](https://iapindia.org)
- [World Health Organization (WHO) - Child Health](https://www.who.int/health-topics/child-health)`;
  }

  // Potty Training
  if (lq.includes('potty') || lq.includes('toilet') || lq.includes('diaper') || lq.includes('poop') || lq.includes('pee')) {
    return `${pName}, here is simple, low-stress potty training guidance for ${cName}:

### 📋 Step-by-Step Action Plan (for ${pName} & ${cName})
1. **Place a Child Potty on the Floor**: Keep a small potty chair in the bathroom where ${cName}'s feet rest flat on the floor.
2. **Invite to Sit for 3 Minutes After Meals**: Ask ${cName} to sit for just a few minutes after breakfast or lunch when digestion naturally moves.
3. **Use Simple Cotton Underpants at Home**: Let ${cName} wear regular cotton pants so they can feel when they are wet.
4. **Keep Tummy Happy with Water and Fruit**: Give plenty of water, ripe papaya, and curd so stool stays soft and easy to pass.

### 🗣️ Calming Parent Scripts (What to Say to ${cName})
- *"Accidents are totally okay, ${cName}. Pee goes in the potty. Let us change into dry clothes."*
- *"It is potty time before we play with blocks, ${cName}. Would you like to sit on your potty?"*
- *"Great job sitting so nicely, ${cName}! Even if no pee came, you tried so well."*
- *"Your potty is right here whenever you need it, ${cName}."*

### ⚠️ Common Mistakes to Avoid
- Avoid scolding, shaming, or getting upset when an accident happens.
- Avoid forcing ${cName} to sit for more than 5 minutes on the potty.

### 🌐 Trusted Health Guidelines
- [Indian Academy of Pediatrics (IAP) - Child Health](https://iapindia.org)
- [World Health Organization (WHO) - Child Care](https://www.who.int/health-topics/child-health)`;
  }

  // General Guidance
  return `${pName}, here is simple, caring guidance for ${cName}:

### 📋 Step-by-Step Action Plan (for ${pName} & ${cName})
1. **Keep a Simple Daily Routine**: Children feel happiest when wake-up, meals, play, and bedtime happen at regular, predictable times.
2. **Give Short, Clear Instructions**: Speak in short, warm sentences so ${cName} clearly understands what to do.
3. **Offer Two Easy Choices**: Instead of asking yes/no questions, ask *"Would you like the red cup or the blue cup?"* to help ${cName} cooperate.
4. **Comfort with Loving Touch**: A gentle hug or soft back patting (thappi) helps ${cName} feel safe and settled.

### 🗣️ Calming Parent Scripts (What to Say to ${cName})
- *"I hear you, my sweet ${cName}. Mamma is right here with you."*
- *"Let us take a slow breath together, ${cName}. You are completely safe."*
- *"You did such a wonderful job trying, ${cName}."*
- *"Would you like to do this together with Mamma?"*

### ⚠️ Common Mistakes to Avoid
- Avoid raising your voice or scolding when ${cName} is upset.
- Avoid handing over mobile phones or screens to stop crying.

### 🌐 Trusted Health Guidelines
- [Indian Academy of Pediatrics (IAP) - Parenting Guidelines](https://iapindia.org)
- [ICMR - National Institute of Nutrition (NIN)](https://www.nin.res.in)
- [World Health Organization (WHO) - Child Health](https://www.who.int/health-topics/child-health)`;
}

function getSystemInstruction(parentName?: string, childName?: string, childAge?: string, languagePromptModifier?: string): string {
  const pName = parentName?.trim() || "Lashmi";
  const cName = childName?.trim() || "Ashwath";
  const age = childAge?.trim() || "14 Months";

  const langHeader = languagePromptModifier ? `
======================================================================
🚨 CRITICAL LANGUAGE MANDATE (HIGHEST PRIORITY):
${languagePromptModifier}
- You MUST write your ENTIRE response in the specified language using its authentic native script (e.g. Hindi in Devanagari, Tamil in Tamil script, Telugu in Telugu script, etc.).
- Translate ALL section headings (Step-by-Step Action Plan, Calming Parent Scripts, Things to Avoid, Health Guidelines) into the specified language.
- Do NOT output English when the parent has requested another language.
======================================================================
` : '';

  return `${langHeader}
You are Tricky Toddler AI, an elite Pediatric Clinical Assistant, Child Safety Specialist, and Indian Academy of Pediatrics (IAP) & WHO expert advisor.
Target parent: ${pName}
Target child: ${cName} (Age: ${age})

Rules:
1. Always address parent ${pName} warmly and respectfully by name (e.g. "Namaste ${pName}," or "Hello ${pName},"). Never stutter, duplicate syllables, or append suffixes to the parent's name (never write "${pName}, mi!" or "${pName}, ${pName}!"). Always refer to the child as ${cName} (Age: ${age}).
2. Provide clear, empathetic, culturally respectful Indian parenting and pediatric advice.
3. Structure responses with:
   - Step-by-Step Action Plan (for ${pName} & ${cName})
   - Calming Parent Scripts (What to Say to ${cName})
   - Common Mistakes to Avoid
   - Trusted Health Guidelines (IAP, WHO, ICMR-NIN)
4. For emergencies, recommend seeing a doctor immediately.`;
}

// In-memory fast cache for repeated pediatric responses
const aiAssistantServerCache = new Map<string, string>();

export function createApiRouter(): express.Router {
  const router = express.Router();

  // Health check
  router.get("/health", (req, res) => {
    res.json({
      status: "ok",
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString()
    });
  });

  // Food Lens Vision & Analysis
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
          errorMessage: `Not a food item! Detected: "${queryText}". Food Lens is designed specifically for meals, fruits, snacks, and nutrition labels. Please point camera at an edible food item.`
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
        report: "No milestones logged yet! Please record at least one achievement in the list below to generate your personalized WHO, Indian IAP & FSSAI developmental assessment."
      });
    }

    try {
      const ai = getAI();
      if (!ai) {
        throw new Error("Gemini AI client unavailable");
      }

      const prompt = `You are an expert pediatric nurse, developmental psychologist, and WHO, Indian IAP & FSSAI milestone specialist.
Below are the logged child milestones:
${JSON.stringify(loggedMilestones, null, 2)}

Provide an encouraging, expert developmental comparison:
1. Milestone Progress: Which achievements are on track or early based on WHO/IAP windows.
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
        report: `### 🌟 Developmental Milestone Assessment (WHO & Indian IAP Standards)\n\n**Logged Achievements:** ${names}\n\n* **Developmental Timing:** Your child’s recorded milestones align beautifully with typical World Health Organization (WHO) and Indian Academy of Pediatrics (IAP) developmental windows. Every milestone represents strong neural and motor progression.\n* **Encouraging Next Steps:** Continue engaging in daily interactive floor play, open-ended conversations, reading picture books together, and encouraging tummy-time or gross motor balance.\n* **Nutrition & Hydration:** Adequate bioavailable iron, healthy fats (like A2 ghee), and sound uninterrupted night sleep directly accelerate cognitive leap consolidation.\n\n*Note: Every child follows their own unique timeline. For specific clinical concerns, consult your primary pediatrician.*`
      });
    }
  });

  // Dedicated AI Assistant endpoint with streaming
  router.post("/ai-assistant", async (req, res) => {
    const { query, messages, parentName, childName, childAge, languagePromptModifier } = req.body;
    if (!query && (!messages || !messages.length)) {
      return res.status(400).json({ error: "Query or messages are required" });
    }

    const pName = parentName?.trim() || "Lashmi";
    const cName = childName?.trim() || "Ashwath";
    const age = childAge?.trim() || "14 Months";

    const userQueryText = (query || (Array.isArray(messages) && messages[messages.length - 1]?.parts?.[0]?.text) || (Array.isArray(messages) && messages[messages.length - 1]?.content) || '').toLowerCase();

    if (isPersonalInfoQuery(userQueryText)) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.write(getResponsibleAIRefusal(pName, cName, age));
      return res.end();
    }

    if (isOutOfScopeQuery(userQueryText)) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.write(getOutOfScopePediatricNotice(pName, cName, age));
      return res.end();
    }

    const cacheKey = `${userQueryText.trim()}|${pName}|${cName}|${age}|${languagePromptModifier || ''}`;
    const cachedResponse = aiAssistantServerCache.get(cacheKey);
    if (cachedResponse) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.write(cachedResponse);
      return res.end();
    }

    try {
      const ai = getAI();
      if (!ai) {
        const fallbackText = generateTailoredFallback(userQueryText, parentName, childName, childAge);
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.write(fallbackText);
        return res.end();
      }

      const systemInstruction = getSystemInstruction(parentName, childName, childAge, languagePromptModifier);

      let contents: any = query;
      if (Array.isArray(messages) && messages.length > 0) {
        contents = messages.map((m: any) => ({
          role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.content || m.text || '' }]
        }));
      }

      const CANDIDATE_MODELS = [
        "gemini-3.1-flash-lite",
        "gemini-flash-latest",
        "gemini-3.8-flash"
      ];

      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Transfer-Encoding", "chunked");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("X-Accel-Buffering", "no");

      let streamedAny = false;
      let modelSucceeded = false;
      let accumulatedOutput = "";

      for (const modelName of CANDIDATE_MODELS) {
        if (modelSucceeded) break;

        try {
          const modelConfig: any = {
            systemInstruction,
            temperature: 0.65,
          };

          const streamPromise = ai.models.generateContentStream({
            model: modelName,
            contents: contents,
            config: modelConfig
          });

          // Wait at most 4.5 seconds for model connection and first stream handshake
          const responseStream = await withTimeout(streamPromise, 4500);

          for await (const chunk of readStreamWithTimeout(responseStream, 3500)) {
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
            modelSucceeded = true;
            if (accumulatedOutput.length > 50) {
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
        const fallbackText = generateTailoredFallback(
          query || (Array.isArray(messages) && messages[0]?.parts?.[0]?.text) || (Array.isArray(messages) && messages[0]?.content) || '',
          parentName,
          childName,
          childAge
        );
        res.write(fallbackText);
        aiAssistantServerCache.set(cacheKey, fallbackText);
      }

      res.end();
    } catch (error: any) {
      try {
        if (!res.headersSent) {
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
        }
        const fallbackText = generateTailoredFallback(req.body?.query || '', req.body?.parentName, req.body?.childName, req.body?.childAge);
        res.write(fallbackText);
      } catch (e) {}
      res.end();
    }
  });

  // Dedicated Recipe Generation endpoint (for FoodGuide)
  router.post("/generate-recipes", async (req, res) => {
    const { childAgeYears, ingredients, defaultRecipes } = req.body;
    const defaultBatchRecipes = Array.isArray(defaultRecipes) ? defaultRecipes : [];

    const promptText = `
You are an expert pediatric nutritionist and master chef specializing in toddler solid foods.
Construct a healthy, developmentally safe, and culturally authentic 3-recipe meal plan tailored to child age: ${childAgeYears || '1.5'} years.
Pantry Ingredients or Preferences provided by parent: "${ingredients || 'Moong dal, oats, banana, spinach'}".

Guidelines:
1. Every recipe must pass the toddler gum-pinch / palmar grasp safety test.
2. Seasoning must be gentle (low sodium, no refined sugar, pure A2 ghee or cold-pressed oil, mild pediatric spices).
3. Generate exactly 3 recipes:
   - Recipe 1: Breakfast (Soft Porridge, Idli, Steamed Mash, or Warm Cereal)
   - Recipe 2: Lunch (Wholesome Comfort Khichdi, Dal, or Savory Mash)
   - Recipe 3: Snack (Soft Finger Food, Pancake, or Tender Cheela)
4. Output ONLY a valid JSON array of exactly 3 objects (no conversational preamble, no markdown code fence).
Each object must have these exact keys:
- "id": string (unique)
- "name": string (engaging kid-friendly dish name)
- "mealType": string ("Breakfast" | "Lunch" | "Snack")
- "prepTime": string (e.g. "5 mins")
- "cookTime": string (e.g. "10 mins")
- "textureGuide": string (exact developmental texture suitable for ${childAgeYears || '1.5'} yr old)
- "ingredients": array of strings (with precise child proportions)
- "instructions": array of step-by-step strings
- "nutritionBenefits": string (vitamins, minerals, growth benefits)
- "safetyAlerts": string (temperature, choking prevention, allergen advice)
`;

    try {
      const ai = getAI();
      if (!ai) {
        return res.json({ recipes: defaultBatchRecipes });
      }

      const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
      let resultText = "";
      for (const model of candidateModels) {
        try {
          const result = await withTimeout(
            ai.models.generateContent({
              model,
              contents: promptText,
              config: {
                systemInstruction: "You are an expert pediatric nutritionist and master chef specializing in toddler solid foods. Return only a valid JSON array of 3 distinct recipes.",
                responseMimeType: "application/json"
              }
            }),
            5000
          );
          if (result.text) {
            resultText = result.text;
            break;
          }
        } catch (mErr) {
          // try next model or timeout
        }
      }

      if (resultText) {
        const cleanedText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedText);
        if (Array.isArray(parsed) && parsed.length >= 2) {
          const formatted = parsed.map((item: any, idx: number) => ({
            id: item.id || `rec-${Date.now()}-${idx}`,
            name: item.name || `Nutritious Meal ${idx + 1}`,
            mealType: item.mealType || (idx === 0 ? 'Breakfast' : idx === 1 ? 'Lunch' : 'Snack'),
            prepTime: item.prepTime || '10 mins',
            cookTime: item.cookTime || '12 mins',
            textureGuide: item.textureGuide || `Safe texture for ${childAgeYears || '1.5'} yr old`,
            ingredients: Array.isArray(item.ingredients) ? item.ingredients : [String(item.ingredients)],
            instructions: Array.isArray(item.instructions) ? item.instructions : [String(item.instructions)],
            nutritionBenefits: item.nutritionBenefits || 'Rich in essential micronutrients for toddler growth.',
            safetyAlerts: item.safetyAlerts || 'Check temperature before serving. Supervise toddler while eating.'
          }));
          return res.json({ recipes: formatted });
        }
      }

      return res.json({ recipes: defaultBatchRecipes });
    } catch (err) {
      console.warn("Recipe generation error, returning default recipes:", err);
      return res.json({ recipes: defaultBatchRecipes });
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

Please construct a comprehensive, positive, and beautiful daily hour-by-hour schedule based strictly on standard WHO, Indian IAP and FSSAI pediatric wellness guidelines.
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
          routine: `### 🌅 WHO & Indian IAP Tailored Routine for ${ageLabel || 'Toddler'}\n\n* **Morning (${wakeTime || '07:00 AM'} - 11:30 AM):** Gentle wake-up, warm cuddle, breastmilk/formula or whole milk with finger-food breakfast (idli/cheela with ghee). Floor exploration and sensory songs.\n* **Mid-Day (11:30 AM - 02:30 PM):** Balanced lunch (moong dal khichdi with vegetables), followed by a restorative afternoon nap (1.5–2 hours in a dim, cool room).\n* **Afternoon (02:30 PM - 06:00 PM):** Light afternoon snack (stewed apple, mashed banana, or steamed carrot coins). Outdoor stroll, park exploration, and gross motor play.\n* **Bedtime (06:00 PM - 08:00 PM):** Calming dinner, warm bath, lullaby/story routine (no screens), and peaceful lights-out by 07:30–08:00 PM.`
        });
      }

      const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
      let routineText = "";
      for (const model of candidateModels) {
        try {
          const response = await withTimeout(
            ai.models.generateContent({
              model,
              contents: promptText
            }),
            5000
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
        routine: `### 🌅 WHO & Indian IAP Tailored Daily Routine (${ageLabel || 'Toddler'})\n\n* **07:00 AM - Morning Awakening:** Loving morning cuddle, diaper change, and light breakfast with milk.\n* **09:30 AM - Active Sensory Play:** Block stacking, music, tummy/floor balance.\n* **12:00 PM - Wholesome Lunch:** Moong dal khichdi or soft roti with curd.\n* **01:00 PM - Afternoon Nap:** Restorative 90-minute sleep.\n* **04:00 PM - Snack & Fresh Air:** Sliced seasonal fruits and garden walk.\n* **07:00 PM - Relaxing Bedtime Ritual:** Warm bath, soothing story, sound sleep.`
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

      const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
      let replyText = "";
      for (const model of candidateModels) {
        try {
          const result = await withTimeout(
            ai.models.generateContent({
              model,
              contents: prompt,
              config: {
                systemInstruction: `You are ${doc.name} (${doc.degrees}), a verified, friendly, comforting pediatric doctor at ${doc.hospital}, ${doc.location}. You address the parent warmly as ${pName} and their toddler as ${cName}. You explain things simply with compassionate bedside manners and zero jargon.`
              }
            }),
            5000
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

  return router;
}

export function createApiApp(): express.Express {
  const app = express();
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  const apiRouter = createApiRouter();
  // Mount at both /api and root so both direct requests and rewritten requests resolve identically
  app.use("/api", apiRouter);
  app.use("/", apiRouter);

  return app;
}
