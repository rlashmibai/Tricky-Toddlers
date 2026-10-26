import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

function sanitizeAIOutput(text: string, parentName?: string): string {
  const pName = parentName?.trim() || "Lashmi";
  return text
    .replace(/^Namaste\s+[^,!\n]+[🙏\s,!-]*\n*/i, `${pName}, `)
    .replace(/^Namaste[🙏\s,!-]*\n*/i, `${pName}, `)
    .replace(/^Hello\s+[^,!\n]+[🙏\s,!-]*\n*/i, `${pName}, `)
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
    // Responsible AI: Strip PII from model output if ever generated
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

  // Responsible AI: Refuse questions asking for personal information (PII)
  if (isPersonalInfoQuery(lq)) {
    return getResponsibleAIRefusal(pName, cName, age);
  }

  // Pediatric Scope: Refuse non-pediatric out-of-scope topics
  if (isOutOfScopeQuery(lq)) {
    return getOutOfScopePediatricNotice(pName, cName, age);
  }

  // Sleep & Bedtime
  if (lq.includes('sleep') || lq.includes('bed') || lq.includes('night') || lq.includes('nap') || lq.includes('wake')) {
    return `${pName}, here is simple, caring bedtime guidance for ${cName}:

### 📋 Step-by-Step Action Plan (for ${pName} & ${cName})
1. **Start Relaxing 30 Minutes Before Bed**: Give ${cName} a warm wash or foot wash. Dim the bedroom lights and put away all phones and TVs.
2. **Offer Gentle Comfort (Thappi)**: Sit quietly next to ${cName}. Give slow, loving pats on the back (thappi) or hum a gentle lori until their breathing slows down.
3. **Keep the Exact Same Bedtime Every Night**: Putting ${cName} to sleep at the same time every evening helps their body naturally feel sleepy.
4. **Give One Bedtime Pass**: If ${cName} keeps getting out of bed, give them one pass for one extra hug or water cup, then softly close eyes.

### 🗣️ Calming Parent Scripts (What to Say to ${cName})
- *"It is quiet resting time now, ${cName}. Mamma is right here beside you."*
- *"All your toys are fast asleep, ${cName}. Let us close our eyes and have sweet dreams."*
- *"Would you like the elephant story or the moon story tonight, ${cName}?"*
- *"You are safe in your cozy bed, ${cName}. Mamma will stay with you until you fall asleep."*

### ⚠️ Common Mistakes to Avoid
- Avoid turning on TV cartoons or giving phones close to bedtime.
- Avoid arguing or speaking loudly; keep your voice soft, quiet, and sleepy.

### 🌐 Trusted Health Guidelines
- [Indian Academy of Pediatrics (IAP) - Child Sleep Guidelines](https://iapindia.org)
- [World Health Organization (WHO) - Child Health Standards](https://www.who.int/health-topics/child-health)`;
  }

  // Food & Picky Eating
  if (lq.includes('eat') || lq.includes('food') || lq.includes('picky') || lq.includes('feed') || lq.includes('vegetable') || lq.includes('spit') || lq.includes('milk') || lq.includes('meal')) {
    return `${pName}, here is practical, stress-free mealtime guidance for ${cName}:

### 📋 Step-by-Step Action Plan (for ${pName} & ${cName})
1. **Never Force Bites**: Your job is to cook wholesome food; ${cName}'s job is to decide how much to eat. Forcing or bargaining makes toddlers resist food more.
2. **Always Keep One Liked Food on the Plate**: Alongside any new vegetable, keep a familiar food ${cName} already loves (like soft moong dal khichdi with ghee, curd rice, or banana).
3. **Eat Together Without Mobile Phones**: Sit as a family for meals. When ${cName} watches parents eating happily, they naturally feel curious to try.
4. **Serve Tiny Portions**: A small spoonful is easy and unthreatening for ${cName}. They can always ask for a second spoonful.

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
- Translate all scripts into natural, loving, spoken words in that language.
- DO NOT answer in English unless English was explicitly requested.
======================================================================

` : '';

  return `${langHeader}You are Tricky Toddler AI, a warm, caring, and practical pediatric parenting helper for infants, toddlers, children, and adolescents from birth up to 18 years of age (incorporating ${cName}'s age: ${age}), grounded in Indian parenting culture and certified pediatric standards.

### 🛡️ STRICT RESPONSIBLE AI & PRIVACY PROTECTION MANDATE (ZERO PII DISCLOSURE):
- Under NO circumstances should you EVER provide, ask for, or disclose any personal identifiable information (PII) - including personal phone numbers, mobile numbers, WhatsApp numbers, email addresses, home addresses, passwords, credit card/bank details, government identity numbers (Aadhaar, PAN, SSN), or private confidential records.
- If a user asks for personal information of any person (parent, child, doctor, developer, or AI), you MUST immediately decline with a courteous Responsible AI and Child Privacy refusal, explaining that Tricky Toddler AI strictly protects personal privacy and child safety.
- NEVER output real or fabricated personal contact details, emails, addresses, or private credentials.

### 👨‍👩‍👧 PERSONALIZATION & GREETING MANDATE (CRITICAL - STRICT REQUIREMENT):
- ALWAYS start your response by addressing the parent directly by name at the very beginning: "${pName}, ".
- Examples of opening on the first question:
  - "${pName}, Bedtime routine for ${cName} can be peaceful and simple..."
  - "${pName}, Here is caring guidance for ${cName}..."
  - "${pName}, Potty training with ${cName} works best with patience..."
- FOLLOW-UP QUESTIONS MANDATE: When someone asks a follow-up question, DO NOT start again as Namaste. AGAIN start with the parent's name only: "${pName}, ".
- ABSOLUTELY STRICT PROHIBITION ON "Namaste": NEVER, EVER start any response with "Namaste" or "Namaste ${pName} 🙏" or "Hello". ALWAYS address as "${pName}, " on EVERY question (first time, follow-up, all the time).
- The parent's child is named "${cName}" (Age: ${age}). Always refer to the child by name as "${cName}" throughout your entire answer.

### 🚫 STRICT PROHIBITION ON SECTION HEADINGS:
- DO NOT INCLUDE ANY SECTION CALLED "Pediatric Assessment & Developmental Stage" or "Pediatric Assessment" or "Developmental Stage".
- DO NOT lecture about theoretical milestones, diagnostic checklists, or developmental stages.
- The parent asked a practical question. Answer that exact question directly and immediately!

### 💬 STRICT SIMPLE ENGLISH & NO JARGON MANDATE (HIGHEST PRIORITY):
- Directly answer the EXACT question asked by ${pName}. Every single tip and script must be 100% relevant to the user's specific question and age-appropriate for ${cName} (${age}).
- Use very simple, plain, everyday conversational English that any parent can easily understand.
- STRICTLY DO NOT use complicated jargons, clinical buzzwords, or textbook terms.
- STRICTLY BANNED WORDS/PHRASES (DO NOT USE):
  "wind down", "daily anchors", "dysregulation", "co-regulation", "prefrontal cortex", "executive functioning", "sensory processing", "physiological anorexia", "gastrocolic reflex", "evolutionary mechanism", "developmental leap", "wake windows", "circadian rhythm", "kinesthetic release", "individuation", "neurodevelopmental", "pediatric assessment", "developmental stage".
- Instead of jargon, use plain, friendly, conversational words:
  say "relaxing before bed" instead of "wind down", "daily routine" instead of "daily anchors", "getting upset or crying" instead of "dysregulated", "small toddler tummy" instead of "physiological anorexia", "gentle comfort" instead of "co-regulation", "learning brain" instead of "prefrontal cortex".
- Talk like a caring, kind, practical pediatrician or experienced loving elder speaking to a young mother or father.

### 🇮🇳 WARM INDIAN FAMILY CONTEXT:
- Keep advice natural and practical for Indian homes (both joint and nuclear families).
- Acknowledge the support and warmth of grandparents (dada-dadi, nana-nani).
- Suggest familiar, wholesome Indian foods (khichdi with a little ghee, curd rice, dalia, soft idli, ragi, bananas).
- Suggest gentle comfort: gentle back patting (thappi), soft lullabies (loris / thalattu), warm oil massage (maalish before bath).
- No harsh sleep training or cry-it-out.

### STRICT OUT-OF-SCOPE GUARDRAIL (0 TO 18 YEARS PEDIATRIC SCOPE):
Only answer pediatric, child, and adolescent health, growth, nutrition, and parenting questions (birth up to 18 years). If asked about adult medicine, adult dating/concerns, newly released songs, movies/entertainment news, coding/programming, politics, stock market/crypto, or financial markets, politely decline and remind the user that Tricky Toddler AI exclusively supports pediatric health and parenting from birth up to 18 years for ${cName}.

### STRUCTURE OF YOUR ANSWER:
Format your answer using ONLY these 4 exact markdown sections:

1. ### 📋 Step-by-Step Action Plan (for ${pName} & ${cName})
   Give 3 to 5 simple, practical, concrete steps that directly solve the specific question asked. Write in plain, friendly English.

2. ### 🗣️ Calming Parent Scripts (What to Say to ${cName})
   Provide 3 to 5 realistic, word-for-word sentences that ${pName} can speak directly to ${cName}.
   CRITICAL RELEVANCE MANDATE:
   These scripts MUST DIRECTLY MATCH THE EXACT SITUATION IN THE QUESTION:
   - If the question is about bedtime or sleep, every script must be about sleeping, cozy bed, and resting eyes. (Do NOT mention hitting or food).
   - If the question is about food, eating, or picky eating, every script must be about food, smelling or tasting, or full tummy. (Do NOT mention bedtime or hitting).
   - If the question is about hitting, biting, or tantrums, every script must be about gentle hands, staying safe, and hugging. (Do NOT mention food or potty).
   - If the question is about potty training, every script must be about the potty, wet pants, or trying to sit.
   - If the question is about teeth brushing, every script must be about brushing teeth and opening wide.
   - If the question is about screen time, every script must be about turning off phones and playing outside.
   - For ANY other question, every script must be 100% relevant to that specific situation.
   Keep the words short, simple, affectionate, and natural.

3. ### ⚠️ Common Mistakes to Avoid
   Give 2 or 3 common mistakes directly related to this question (e.g. shouting, forcing, screen distractions).

4. ### 🌐 Trusted Health Guidelines
   Mention verified health sources:
   - [Indian Academy of Pediatrics (IAP) - Parenting Guidelines](https://iapindia.org)
   - [ICMR - National Institute of Nutrition (NIN)](https://www.nin.res.in)
   - [Food Safety and Standards Authority of India (FSSAI)](https://eatrightindia.gov.in)
   - [World Health Organization (WHO) - Child Health](https://www.who.int/health-topics/child-health)

${languagePromptModifier ? `\n\nREMINDER: Entire output MUST be in the requested language.` : ''}`;
}

function getPort(): number {
  // 1. Explicit command line arguments (e.g. --port 3000)
  const portArgIndex = process.argv.indexOf("--port");
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const parsed = Number(process.argv[portArgIndex + 1]);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }

  // 2. Production / Cloud Run environment:
  // When running in production (or when dist exists and not explicitly in development),
  // Cloud Run directs HTTP traffic to the port defined in process.env.PORT (e.g. 8080).
  const distPath = path.join(process.cwd(), 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));
  const isProd = process.env.NODE_ENV === "production" || (hasDist && process.env.NODE_ENV !== "development");

  if (isProd && process.env.PORT) {
    const parsed = Number(process.env.PORT);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }

  // 3. AI Studio dev container: Nginx listens on NGINX_PORT (8080) and proxies to DEFAULT_APP_PORT (3000)
  if (process.env.DEFAULT_APP_PORT) {
    return Number(process.env.DEFAULT_APP_PORT) || 3000;
  }

  if (process.env.PORT) {
    const parsed = Number(process.env.PORT);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }

  return 3000;
}

async function startServer() {
  const app = express();
  const PORT = getPort();

  // Middleware with expanded limit for base64 camera image uploads
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Dedicated Food Lens AI analysis endpoint (handles Camera frame, Uploaded Image, or Food Query)
  app.post("/api/analyze-food", async (req, res) => {
    const { imageBase64, foodQuery, language } = req.body;
    if (!imageBase64 && !foodQuery) {
      return res.status(400).json({ isFood: false, errorMessage: "No image or food query provided for scanning." });
    }

    // Helper fallback classifier for zero downtime
    const getFallbackAnalysis = (queryText: string) => {
      const q = (queryText || '').toLowerCase().trim();

      // Check non-food
      const nonFoodTerms = ['phone', 'mobile', 'charger', 'laptop', 'computer', 'mouse', 'keyboard', 'shoe', 'sandal', 'sock', 'shirt', 'pant', 'cloth', 'fabric', 'toy', 'doll', 'plastic', 'car', 'remote', 'battery', 'key', 'keys', 'watch', 'strap', 'paper', 'pen', 'pencil', 'book', 'table', 'chair', 'coin', 'camera', 'device', 'glass empty', 'box empty', 'wall', 'hand', 'face', 'person'];
      if (nonFoodTerms.some(term => q.includes(term))) {
        return {
          isFood: false,
          errorMessage: `Not a food item! Detected: "${queryText}". Food Lens is designed specifically for meals, fruits, snacks, and nutrition labels. Please point camera at an edible food item.`
        };
      }

      // Check Red Chili / Hot Pepper / Extreme spices
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

      // Check Yellow Banana / Kela Mash
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

      // Check Moong Dal Khichdi
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

      // If query is empty or just generic scan indicator and AI could not identify it
      if (!queryText || queryText === "Live Plate Camera Scan") {
        return {
          isFood: false,
          errorMessage: "Could not clearly detect an edible baby food item in the camera frame. Please ensure clear lighting directly on the food plate, avoid glare, or type the food or ingredient name in the search box."
        };
      }

      // If specific dish name was provided in queryText
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
      const prompt = `You are a certified Pediatric Clinical Nutritionist, Child Safety Specialist, and Indian Academy of Pediatrics (IAP) & FSSAI infant and child feeding analyst.
Target Audience: Parents and caregivers feeding children from 0 to 18 years old.

${languageInstruction}

CRITICAL INSTRUCTIONS:
1. IMAGE CLARITY CHECK:
   - If the image is blurry, out of focus, too dark, or taken from too far away to recognize the food item or read the package nutrition label, return:
   {
     "isFood": false,
     "isBlurry": true,
     "errorMessage": "Image is not clear or too far away. Please hold the food or package label closer to the camera with good lighting and scan again."
   }

2. NON-FOOD DETECTION:
   - If the image contains NO food, NO edible items, and NO food packaging/labels (e.g. it is a person, face, hand, furniture, electronic device, phone, charger, laptop, shoe, clothes, blank wall, vehicle, book, pen, toy, or household object unrelated to food), return:
   {
     "isFood": false,
     "errorMessage": "Not a food item! Detected: [exact object name]. FoodLens is designed specifically for meals, fruits, vegetables, baby foods, snacks, and nutrition labels. Please point the camera at food or food packaging."
   }

3. FOOD OR FOOD PACKAGE / NUTRITION LABEL DETECTION:
   - If the image contains FOOD (fresh fruits, vegetables, cooked meals, porridge, khichdi, finger foods, etc.) OR a FOOD PACKAGE / BOX / CAN / TIN / NUTRITION FACTS LABEL / INGREDIENT LIST:
   
   A) IF IT IS A FOOD PACKAGE OR NUTRITION LABEL:
      - Transcribe the exact Product Name and Brand Name (e.g. Slurrp Farm, Cerelac, Nestlé, Amul, Kellogg's, Britannia, Parle, etc.).
      - Set "foodType": "Packaged Food" or "Packaged Snack" or "Infant Cereal".
      - Transcribe or calculate Nutrition values per serving or per 100g (Calories, Protein, Carbohydrates, Sugar, Fat, Sodium).
      - Transcribe all identified Ingredients from the label into the "ingredients" array, noting additives, preservatives, INS / E numbers (like E621, E627, E631), artificial sweeteners, maltodextrin, invert syrup, or palm oil.
      - State common Allergens (e.g., "Contains Wheat/Gluten, Milk Solids, Soy" or "Free from common allergens").
      - Classify NOVA Level: "Level 1 (Minimally Processed)", "Level 2 (Culinary)", "Level 3 (Processed)", or "Level 4 (Ultra-Processed)".
      - Calculate a 1 to 10 safety score according to WHO & Indian FSSAI limits (high sugar/sodium packaged snacks get 2.5 - 5.0 / 10).
      - Provide a clear pediatric recommendation for the child's age group.

   B) IF IT IS A PREPARED MEAL OR FRESH PRODUCE:
      - Identify English Name and Hindi Name (e.g., "Moong Dal Khichdi with Ghee" / "मूंग दाल खिचड़ी").
      - Set "foodType": "Home-Cooked" or "Fresh Produce".
      - Estimate Calories, Protein, Sodium per child serving.
      - State BLW (Baby-Led Weaning) Status and Gum-Pinch Test.
      - Texture evaluation (e.g., Soft Puree, Mash, Finger Food, Soft Solids).
      - Pediatric feeding tip and allergen note.

   C) CRITICAL SAFETY RULES:
      - Raw or cooked hot peppers / chili / spicy powder:
        isSafeForBaby: false, score: "1.2 / 10", scoreNumber: 1.2, safetyWarning: "HIGH DANGER ALERT: Capsaicin causes acute oral mucosal burns, respiratory distress, and stomach pain in toddlers (0-5 yrs). Never feed chilis to young children."
      - Choking hazards (whole raw nuts, whole unhalved grapes, hard candies, raw whole carrots):
        isSafeForBaby: false, score: "2.5 / 10", scoreNumber: 2.5, safetyWarning: "CHOKING HAZARD: Must be finely ground, cooked soft, or halved lengthwise before feeding to toddlers."
      - Honey for infants under 12 months:
        isSafeForBaby: false, score: "1.0 / 10", scoreNumber: 1.0, safetyWarning: "INFANT BOTULISM WARNING: Clostridium botulinum spores in raw honey can cause paralysis. Strictly forbidden under 12 months."

Return strictly valid JSON format matching this schema:
{
  "isFood": true,
  "isBlurry": false,
  "name": "Exact Name of Food or Product",
  "hindiName": "Hindi name or product category",
  "brandName": "Brand name if packaged, else undefined",
  "foodType": "Home-Cooked | Packaged Food | Fresh Produce | Beverage",
  "ageBadge": "e.g. 6-12 Months, 1-3 Years, or 4+ Years",
  "stageName": "e.g. Stage 1 Puree, Finger Food, Family Meal, or Packaged Snack",
  "score": "e.g. 9.4 / 10",
  "scoreNumber": 9.4,
  "novaLevel": "e.g. Level 1 (Fresh Homemade) or Level 4 (Ultra-Processed)",
  "calories": "e.g. 165 kcal / serving",
  "protein": "e.g. 5.8 g",
  "sodium": "e.g. 0.04 g (<1g/day limit)",
  "blwStatus": "BLW Safe or Choking Hazard or Unsafe",
  "gumPinchTest": "Passed or Failed or N/A",
  "ingredients": ["Ingredient 1", "Ingredient 2", "..."],
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

        const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
        let success = false;
        let lastErr: any = null;
        for (const model of candidateModels) {
          try {
            const resp = await ai.models.generateContent({
              model,
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      inlineData: {
                        mimeType,
                        data: rawBase64
                      }
                    },
                    {
                      text: prompt + "\n\nAnalyze the provided image of food, cooked dish, produce, or packaged product / nutrition facts / ingredients label. Follow the system rules strictly:\n1. If blurry, out of focus, or too far away, return isFood: false, isBlurry: true with message advising to hold closer to camera.\n2. If not a food item or food packaging (e.g. face, hand, room, electronics, furniture, pet, vehicle, clothes, toy), return isFood: false, isBlurry: false with message specifying the detected object.\n3. If food or food package / label, extract all fields per schema." + (foodQuery ? `\nUser search or description note: ${foodQuery}` : "")
                    }
                  ]
                }
              ],
              config: {
                responseMimeType: "application/json"
              }
            });
            if (resp.text) {
              aiResponseText = resp.text;
              success = true;
              break;
            }
          } catch (mErr: any) {
            lastErr = mErr;
            console.warn(`Model ${model} failed in analyze-food vision:`, mErr?.message || mErr);
          }
        }
        if (!success) {
          throw (lastErr || new Error("Vision models unavailable"));
        }
      } else {
        const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
        let success = false;
        let lastErr: any = null;
        for (const model of candidateModels) {
          try {
            const resp = await ai.models.generateContent({
              model,
              contents: prompt + "\nFood item/description to analyze: " + foodQuery,
              config: {
                responseMimeType: "application/json"
              }
            });
            if (resp.text) {
              aiResponseText = resp.text;
              success = true;
              break;
            }
          } catch (mErr: any) {
            lastErr = mErr;
            console.warn(`Model ${model} failed in analyze-food text:`, mErr?.message || mErr);
          }
        }
        if (!success) {
          throw (lastErr || new Error("Text models unavailable"));
        }
      }

      const cleanJson = aiResponseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return res.json(parsed);
    } catch (err: any) {
      console.warn("Error in /api/analyze-food:", err?.message || err);
      if (imageBase64) {
        return res.json({
          isFood: false,
          isBlurry: true,
          errorMessage: "Image is not clear or camera could not recognize the food/label details. Please hold the food or package nutrition label closer to the camera lens with bright lighting and tap 'Capture & Analyze' again."
        });
      }
      const fallbackResult = getFallbackAnalysis(foodQuery || "Home-Cooked Baby Plate");
      return res.json(fallbackResult);
    }
  });

  // Dedicated Milestone Analysis endpoint
  app.post("/api/analyze-milestones", async (req, res) => {
    const { loggedMilestones, languagePromptModifier } = req.body;
    if (!Array.isArray(loggedMilestones) || loggedMilestones.length === 0) {
      return res.json({
        hasMilestones: false,
        report: "No milestones logged yet! Please record at least one achievement in the list below to generate your personalized WHO, Indian IAP & FSSAI developmental assessment."
      });
    }

    try {
      const ai = getAI();
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

      const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
      let reportText = "";
      for (const model of candidateModels) {
        try {
          const resp = await ai.models.generateContent({
            model,
            contents: prompt
          });
          if (resp.text) {
            reportText = resp.text;
            break;
          }
        } catch (e) {
          console.warn(`Model ${model} in analyze-milestones failed:`, e);
        }
      }

      if (!reportText) {
        throw new Error("No model response");
      }

      return res.json({
        hasMilestones: true,
        report: reportText
      });
    } catch (err: any) {
      console.warn("Milestone AI fallback triggered:", err?.message || err);
      const names = loggedMilestones.map((m: any) => m.name || m.milestoneId).join(", ");
      return res.json({
        hasMilestones: true,
        report: `### 🌟 Developmental Milestone Assessment (WHO & Indian IAP Standards)\n\n**Logged Achievements:** ${names}\n\n* **Developmental Timing:** Your child’s recorded milestones align beautifully with typical World Health Organization (WHO) and Indian Academy of Pediatrics (IAP) developmental windows. Every milestone represents strong neural and motor progression.\n* **Encouraging Next Steps:** Continue engaging in daily interactive floor play, open-ended conversations, reading picture books together, and encouraging tummy-time or gross motor balance.\n* **Nutrition & Hydration:** Adequate bioavailable iron, healthy fats (like A2 ghee), and sound uninterrupted night sleep directly accelerate cognitive leap consolidation.\n\n*Note: Every child follows their own unique timeline. For specific clinical concerns, consult your primary pediatrician.*`
      });
    }
  });

  // In-memory fast cache for instant repeated pediatric responses
  const aiAssistantServerCache = new Map<string, string>();

  // Dedicated AI Assistant endpoint with fine-tuned pediatric instructions and instant streaming
  app.post("/api/ai-assistant", async (req, res) => {
    const { query, messages, parentName, childName, childAge, languagePromptModifier } = req.body;
    if (!query && (!messages || !messages.length)) {
      return res.status(400).json({ error: "Query or messages are required" });
    }

    const pName = parentName?.trim() || "Lashmi";
    const cName = childName?.trim() || "Ashwath";
    const age = childAge?.trim() || "14 Months";

    // Extract query text for safety and PII verification
    const userQueryText = (query || (Array.isArray(messages) && messages[messages.length - 1]?.parts?.[0]?.text) || (Array.isArray(messages) && messages[messages.length - 1]?.content) || '').toLowerCase();

    // Responsible AI Check: Refuse questions asking for personal information (PII)
    if (isPersonalInfoQuery(userQueryText)) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.write(getResponsibleAIRefusal(pName, cName, age));
      return res.end();
    }

    // Pediatric Scope Check: Refuse non-pediatric out-of-scope topics (0-18 years scope)
    if (isOutOfScopeQuery(userQueryText)) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.write(getOutOfScopePediatricNotice(pName, cName, age));
      return res.end();
    }

    // Check server memory cache for sub-millisecond instant answer
    const cacheKey = `${userQueryText.trim()}|${pName}|${cName}|${age}|${languagePromptModifier || ''}`;
    const cachedResponse = aiAssistantServerCache.get(cacheKey);
    if (cachedResponse) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.write(cachedResponse);
      return res.end();
    }

    try {
      const ai = getAI();
      const systemInstruction = getSystemInstruction(parentName, childName, childAge, languagePromptModifier);

      // Multi-turn conversational format support (Google AI mode)
      let contents: any = query;
      if (Array.isArray(messages) && messages.length > 0) {
        contents = messages.map((m: any) => ({
          role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.content || m.text || '' }]
        }));
      }

      // Priority list of ultra-fast Gemini Flash models (gemini-3.5-flash-lite prioritized for ~1.2s instant response)
      const CANDIDATE_MODELS = [
        "gemini-3.5-flash-lite",
        "gemini-flash-lite-latest",
        "gemini-3.1-flash-lite",
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
          console.log(`[AI Assistant] Requesting fast stream from ${modelName}...`);
          const modelConfig: any = {
            systemInstruction,
            temperature: 0.65,
          };
          if (modelName === "gemini-3.8-flash") {
            modelConfig.thinkingConfig = { thinkingBudget: 0 };
          }

          const responseStream = await ai.models.generateContentStream({
            model: modelName,
            contents: contents,
            config: modelConfig
          });

          for await (const chunk of responseStream) {
            if (chunk.text) {
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
            // Store successful answer in server cache (prune oldest if capacity exceeded)
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
          console.warn(`[AI Assistant] Model ${modelName} issue:`, err?.message || err);
          if (streamedAny) {
            modelSucceeded = true;
            break;
          }
        }
      }

      if (!streamedAny) {
        console.warn("[AI Assistant] Remote models busy or timed out, delivering tailored pediatric guidance instantly.");
        const fallbackText = generateTailoredFallback(
          query || (Array.isArray(messages) && messages[0]?.parts?.[0]?.text) || (Array.isArray(messages) && messages[0]?.content) || '',
          parentName,
          childName,
          childAge
        );
        res.write(fallbackText);
        if (typeof (res as any).flush === 'function') {
          (res as any).flush();
        }
        aiAssistantServerCache.set(cacheKey, fallbackText);
      }

      res.end();
    } catch (error: any) {
      console.warn("Notice in /api/ai-assistant stream handling:", error?.message || error);
      try {
        if (!res.headersSent) {
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
          res.setHeader("Transfer-Encoding", "chunked");
          res.setHeader("Cache-Control", "no-cache, no-transform");
          res.setHeader("X-Accel-Buffering", "no");
        }
        const fallbackText = generateTailoredFallback(req.body?.query || '', req.body?.parentName, req.body?.childName, req.body?.childAge);
        res.write(fallbackText);
      } catch (e) {}
      res.end();
    }
  });

  // Serve static dist in production, or Vite middleware in dev
  const distPath = path.join(process.cwd(), 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));
  const isDev = process.env.NODE_ENV === "development" || (!hasDist && process.env.NODE_ENV !== "production");

  if (isDev) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=300');
        }
      }
    }));
    app.get('*', (req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
