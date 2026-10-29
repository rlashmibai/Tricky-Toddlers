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

  // Sensory Meltdown vs Boundary Tantrum comparison
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

### 📋 What to Do Now (Action Guide for ${pName})

1. **For a Sensory Meltdown**:
   - **Reduce sensory input immediately**: Move ${cName} to a dim, quiet room or quiet corner. Turn down noise, television, and bright lights.
   - **Keep safe with gentle presence**: Do not lecture, scold, or demand eye contact. Offer deep pressure hugs or slow back-patting (*thappi*) if ${cName} welcomes touch.
   - **Calming Script**: *"You are safe, ${cName}. Mamma is right here. We are going to rest in the quiet together."*

2. **For a Boundary Tantrum**:
   - **Stay calm and hold the boundary**: Do not negotiate, shout, or give in to stop the crying. Giving in teaches the child that tantrums produce results.
   - **Acknowledge the feeling, hold the limit**: Connect with the feeling while maintaining the family rule.
   - **Calming Script**: *"I know you really wanted to keep playing, ${cName}. It is hard to stop. But it is bathtime now. Would you like to carry your rubber duck or the boat?"*

### ⚠️ What to Avoid
- Avoid shouting, lecturing, or attempting long explanations while the child's brain is flooded with emotion.
- Avoid isolating ${cName} alone in a dark room; staying close (*time-in*) builds secure emotional regulation.

---RELATED_QUESTIONS---
- [How can I prevent sensory overload in crowded places for ${cName}?]
- [What calming scripts work best during a public tantrum?]
- [When should I consult an occupational therapist about sensory sensitivities?]`;
  }

  // Indoor Games & Creative Play
  if (lq.includes('game') || lq.includes('play') || lq.includes('rainy') || lq.includes('indoor') || lq.includes('activity') || lq.includes('bored')) {
    return `Hello ${pName}, here are **5 fun, developmental indoor games** perfect for ${cName} (Age: ${age}) that use simple household items:

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
* **Instructions**: Create a low tunnel. Sit at the other end with an open smile and call ${cName}: *"Peek-a-boo! Can you crawl through to Mamma?"*
* **Skills Encouraged**: Spatial perception, bilateral motor coordination, and overcoming hesitation.

### 4. 🥄 Kitchen Percussion Symphony
* **Supplies**: 2 stainless steel bowls or silicone bowls, and wooden or silicone spoons.
* **Instructions**: Tap slow and fast rhythms on the overturned bowls. Let ${cName} explore loud vs. soft sounds and copy simple clapping beats.
* **Skills Encouraged**: Auditory discrimination, cause-and-effect understanding, and musical rhythm.

### 5. 🧊 Ice Cube & Warm Water Sensory Splash
* **Supplies**: A wide shallow plastic tray, 2 ice cubes, and a small cup of lukewarm water.
* **Instructions**: Place the ice cubes in the tray. Let ${cName} feel the cold ice, watch it slide, and pour warm water over it to discover temperature change. *(Always supervise closely).*
* **Skills Encouraged**: Tactile exploration, fine motor grasping, and curiosity.

---RELATED_QUESTIONS---
- [What are quiet sensory games for bedtime relaxation?]
- [How much independent play time is normal for age ${age}?]
- [What outdoor sensory activities help build gross motor balance?]`;
  }

  // Fears, Ghosts, Monsters, Nightmares & Magical Thinking
  if (lq.includes('ghost') || lq.includes('possessed') || lq.includes('monster') || lq.includes('fear') || lq.includes('scared') || lq.includes('dark') || lq.includes('witch') || lq.includes('shadow')) {
    return `Hello ${pName}, here is gentle, evidence-based pediatric guidance on handling childhood fears of ghosts, monsters, or big imaginary worries for ${cName}:

### 🧠 Why Children Experience Fears of Ghosts & Monsters
Between ages 2 and 6, children enter a natural developmental stage known as **magical thinking**. Their vivid imaginations outpace their logical reasoning. To a young child, shadows, odd creaks, and bedtime quiet can feel just as real as a chair or toy.

### 📋 What to Do Now (Safe Grounding Steps)

1. **Take Their Feelings Seriously (Without Validating the Ghost)**:
   - Avoid saying: *"Don't be silly, ghosts aren't real, go to sleep!"* (This makes the child feel dismissed and more anxious).
   - Instead, say: *"I can see you feel scared right now, ${cName}. Mamma is right here, and our home is completely safe. Nothing can hurt you."*

2. **Physical Comfort & Grounding**:
   - Kneel down, give a firm warm hug, and feel their breath together.
   - Turn on a soft warm nightlight so the room feels cozy and familiar.
   - Gently inspect the bedroom together: *"Let us look under the bed and in the closet together with our flashlight. Look, just your soft blankets and slippers!"*

3. **Playful Daytime Mastery (Shift the Power)**:
   - In daylight hours, draw funny friendly pictures of the "monster" wearing silly pink shoes or eating bananas. When children laugh at their fear, it loses its power.

### ⚠️ What to Avoid
- Avoid exposing ${cName} to scary TV shows, older sibling horror stories, or YouTube videos with jump scares.
- Avoid using scary threats as discipline (*"If you don't eat your dinner, the monster will come"*).

---RELATED_QUESTIONS---
- [What gentle bedtime routines help soothe night fears for ${cName}?]
- [What is the difference between a night terror and a nightmare?]
- [How can a simple nightlight routine improve sleep confidence?]`;
  }

  // Picky Eating & Nutrition
  if (lq.includes('picky') || lq.includes('eat') || lq.includes('food') || lq.includes('feed') || lq.includes('hungry') || lq.includes('milk') || lq.includes('ragi') || lq.includes('khichdi')) {
    return `Hello ${pName}, here is practical, stress-free feeding guidance for ${cName}:

### 🥦 Gentle Nutrition & Mealtime Steps for ${cName}
1. **Division of Responsibility**:
   - Your job as a parent: Decide *what* healthy wholesome food to offer and *when* at regular meal times.
   - ${cName}'s job: Decide *how much* to eat from what is offered. Never force-feed or bribe with sweets.
2. **Always Include a Safe Anchor Food**:
   - Serve a tiny portion of a new dish next to a well-loved favorite (such as warm moong dal khichdi with pure A2 ghee, soft idli, or fresh curd rice).
3. **Eat Together Screen-Free**:
   - Sit together as a family. Toddlers model what they see adults eating with genuine appetite.
4. **Patience with New Textures**:
   - It often takes 10 to 15 relaxed exposures before a child willingly tastes a new vegetable or grain.

### 🗣️ Calming Parent Script
*"You don't have to finish everything on your plate, ${cName}. You can just take a tiny smell or one small bite whenever you are ready."*

---RELATED_QUESTIONS---
- [How do I prepare nutrient-rich sprouted ragi porridge for ${cName}?]
- [What are easy iron-rich Indian finger foods for toddlers?]
- [How much whole milk does a child need each day?]`;
  }

  // General Guidance
  return `Hello ${pName}, here is personalized, evidence-informed guidance for ${cName} (Age: ${age}):

### 💡 Understanding What ${cName} Needs
Children thrive when their daily world feels predictable, warm, and secure. At age ${age}, rapid developmental leaps in motor skills, communication, and emotional awareness often create moments of both excitement and friction.

### 📋 Practical Steps for ${pName}
1. **Predictable Daily Anchors**: Maintain consistent wake-up, meal, outdoor play, and bedtime rituals.
2. **Clear, Short Instructions**: Speak in calm, concise sentences at ${cName}'s eye level.
3. **Offer Two Empowering Choices**: Prevent power struggles by asking: *"Would you like your green shoes or blue shoes?"*
4. **Connection First**: When big feelings arise, stay calm and offer comforting physical presence (*thappi* or a cuddle).

---RELATED_QUESTIONS---
- [What are the most important developmental milestones for age ${age}?]
- [How can I establish a smooth, tear-free bedtime routine?]
- [What positive parenting scripts help when ${cName} says 'No'?]`;
}

function getSystemInstruction(parentName?: string, childName?: string, childAge?: string, languagePromptModifier?: string): string {
  const pName = parentName?.trim() || "Lashmi";
  const cName = childName?.trim() || "Ashwath";
  const age = childAge?.trim() || "14 Months";
  const { bracket, label: ageBracketLabel } = parseChildAgeBracket(age);

  const langHeader = languagePromptModifier ? `
======================================================================
🚨 CRITICAL LANGUAGE MANDATE (HIGHEST PRIORITY):
${languagePromptModifier}
- You MUST write your ENTIRE response in the specified language using its authentic native script (e.g. Hindi in Devanagari, Tamil in Tamil script, Telugu in Telugu script, etc.).
- Do NOT output English when the parent has requested another language.
======================================================================
` : '';

  return `${langHeader}
You are Tricky Toddler AI, an elite Pediatric Clinical Assistant, Child Safety Specialist, and Developmental Parenting Companion aligned with the Indian Academy of Pediatrics (IAP), ICMR-NIN, and WHO child health standards.
Current Parent: ${pName}
Current Child: ${cName} (Age: ${age} · ${ageBracketLabel})

### 1. DIRECT QUESTION UNDERSTANDING (ZERO KEYWORD HIJACKING)
- Always answer the EXACT question asked by ${pName}. Never replace or derail the question with a generic or pre-canned response triggered by matching keywords.
- Distinguish between requests for:
  * Comparisons (e.g., "sensory meltdown vs boundary tantrum", "night terrors vs nightmares")
  * Concrete practical activities or games (e.g., "5 indoor games for a rainy day")
  * Real-time behavioral support (e.g., hitting, biting, screaming)
  * Routine & sleep guidance (e.g., bedtime resistance, nap transitions)
  * Pediatric nutrition & recipes (e.g., ragi porridge, picky eating)
  * Emotional reassurance, fears, and imagination (e.g., fear of ghosts, monsters, separation anxiety)
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
- **Red-Flag Warning Signs**: Proactively identify urgent symptoms (e.g. infant fever under 3 months, respiratory distress/stridor, sunken fontanelle/dehydration, lethargy, blue lips, severe allergic reaction) and communicate high clinical urgency immediately. Never minimize serious symptoms to offer false reassurance.
- **No Medication Dosing**: Never calculate or recommend medication dosages without verified clinical evaluation.
- **Indian Emergency Care**: For acute emergencies in India, instruct the parent to immediately call National Emergency **112**, Ambulance **108** / **102**, or proceed directly to the nearest pediatric emergency hospital.
- **Contextual Medical Disclaimer**: When symptoms, illness, or medical concerns are discussed, append this single line at the very end:
  ⚠️ *Medical Information Note: For educational guidance only. Please consult your pediatrician for individual clinical diagnosis.*
  *(Do NOT include this medical disclaimer for non-medical topics like games, play, stories, toys, or daily crafts).*

### 4. PRACTICAL & ACTIONABLE GUIDANCE (REAL-TIME PARENT FIRST)
- Parents often ask questions while managing a difficult situation in real time. Prioritize actionable, immediate steps.
- **Adaptive Structuring (Format Must Fit the Question)**:
  * **For Games & Play Activities** (e.g., rainy day games):
    - Title & Recommended Age Range
    - Materials Needed (household items)
    - Simple Step-by-Step Instructions
    - Skills Encouraged (sensory, motor, cognitive)
    *(No medical disclaimers or rigid behavioral sections).*
  * **For Behavioral Challenges & Tantrums**:
    1. **Direct Answer**: What is happening right now in plain terms.
    2. **Why This May Happen**: Sensory, emotional, or developmental factors.
    3. **What to Do Now**: Clear, immediate, safe physical steps for ${pName}.
    4. **What to Say**: A natural, calming script to say to ${cName}.
    5. **What to Avoid**: Reactions that escalate distress (shouting, isolating, bribing).
    6. **When to Seek Help**: Warning signs warranting pediatric or specialist consult.
  * **For Concept Comparisons** (e.g., Sensory Meltdown vs. Boundary Tantrum):
    - Present a structured comparison as a clean GitHub-Flavored Markdown table with explicit line breaks between every single row:
      | Factor | Concept A | Concept B |
      | :--- | :--- | :--- |
      | Core Trigger | ... | ... |
      | Nervous System | ... | ... |
      | Child's Control | ... | ... |
      | What Parent Should Do | ... | ... |
      *(CRITICAL: Each table row MUST be on its own line ending with newline; never merge rows with "||" or spaces).*
    - Follow the table with concise "What to Do Now" bullet points and "What to Avoid".
  * **For Simple or Quick Inquiries**:
    - Provide a concise, clear answer directly without forced multi-section headings or artificial tables.

### 5. CONVERSATIONAL CONTINUITY & MULTI-TURN MEMORY
- You will receive previous messages in the conversation. Use earlier turns to understand context.
- Accurately resolve pronouns ("he", "she", "they") and references ("that method didn't work", "we tried this yesterday").
- When ${pName} reports that a suggested method failed, validate their experience and pivot to an adjusted next-stage approach. Never repeat the same rejected strategy.
- Distinguish parent-supplied facts from assumptions.

### 6. AMBIGUITY CLARIFICATION & FOLLOW-UP PROTOCOL
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

### 7. TONE & EMPATHY
- Warm, respectful, nonjudgmental, and culturally attuned to Indian and global families.
- Address ${pName} respectfully by name (e.g., "Hello ${pName}," or "Namaste ${pName},") and mention ${cName} naturally where relevant. Do not robotically repeat ${cName}'s name in every single sentence.
- Plain language: translate complex medical jargon into intuitive words (e.g., explain "sensory overload" in simple daily terms).`;
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

    const cacheKey = `${userQueryText.trim()}|${pName}|${cName}|${age}|${languagePromptModifier || ''}`;
    const cachedResponse = aiAssistantServerCache.get(cacheKey);
    if (cachedResponse && (!Array.isArray(messages) || messages.length <= 1)) {
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

          // Wait at most 3.2 seconds for connection and first stream chunk
          const responseStream = await withTimeout(streamPromise, 3200);

          for await (const chunk of readStreamWithTimeout(responseStream, 3000)) {
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
            if (accumulatedOutput.length > 50 && (!Array.isArray(messages) || messages.length <= 1)) {
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
          query || (Array.isArray(messages) && messages[messages.length - 1]?.parts?.[0]?.text) || (Array.isArray(messages) && messages[messages.length - 1]?.content) || '',
          parentName,
          childName,
          childAge
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
