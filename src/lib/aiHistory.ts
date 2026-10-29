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

export const INITIAL_AI_SEARCH_HISTORY: AISearchRecord[] = [
  {
    id: 'ai-hist-1',
    question: 'How to handle bedtime tantrums and screaming when lights go out?',
    answer: `Lashmi, Bedtime guidance for Ashwath:

Here is simple, caring guidance to help Ashwath fall asleep peacefully:

### 📋 Step-by-Step Action Plan (for Lashmi & Ashwath)
1. **Start Relaxing 30 Minutes Early**: Give Ashwath a warm wash or foot wash. Dim the bedroom lights and turn off all TVs and mobile phones.
2. **Offer Gentle Comfort (Thappi)**: Sit right beside Ashwath. Give gentle, slow back-patting (thappi) or sing a soft lullaby (lori) to help them settle down.
3. **Offer Two Simple Bedtime Choices**: Let Ashwath pick their pajamas or story: *"Would you like your blue pajamas or your animal pajamas tonight?"*
4. **Give One Bedtime Pass**: Give Ashwath one small token for one last sip of water or one extra hug. Once used, it is quiet resting time.

### 🗣️ Calming Parent Scripts (What to Say to Ashwath)
- *"It is quiet resting time now, Ashwath. Mamma is right here beside you."*
- *"All your toys are fast asleep, Ashwath. Let us close our eyes and have sweet dreams."*
- *"You are completely safe in your cozy bed, Ashwath. Mamma loves you very much."*
- *"Would you like the elephant story or the moon story tonight, Ashwath?"*

### ⚠️ Common Mistakes to Avoid
- Avoid turning on cartoon videos or phone screens near bedtime.
- Avoid arguing or raising your voice; speak in a soft, sleepy whisper.

### 🌐 Trusted Health Guidelines
- [Indian Academy of Pediatrics (IAP) - Child Sleep Guidelines](https://iapindia.org)
- [World Health Organization (WHO) - Child Health](https://www.who.int/health-topics/child-health)`,
    date: '18 Sep 2026',
    time: '08:45 PM',
    month: 'September 2026',
    category: 'Bedtime & Sleep',
    tags: ['Bedtime', 'Sleep Routine', 'Tantrums', 'Lullaby']
  },
  {
    id: 'ai-hist-2',
    question: 'My 18-month-old refuses to eat vegetables and spits out lentils. What should I do?',
    answer: `Lashmi, here is practical, stress-free mealtime guidance for Ashwath:

### 📋 Step-by-Step Action Plan (for Lashmi & Ashwath)
1. **Never Force Bites**: Your job is to serve healthy food at regular meal times; Ashwath decides how much to eat. Forcing food makes toddlers resist more.
2. **Always Keep One Liked Food on the Plate**: Along with dal or vegetables, always serve something Ashwath already loves (like curd rice, soft khichdi with ghee, or banana).
3. **Eat Together as a Family**: Sit together without phones or TV. Seeing you enjoy dal and vegetables makes Ashwath curious to try.
4. **Start with Tiny Portions**: Put just one spoonful of vegetable on the plate. A large bowl can feel overwhelming.

### 🗣️ Calming Parent Scripts (What to Say to Ashwath)
- *"You do not have to finish everything, Ashwath. You can just smell it or take one small taste."*
- *"Look at this warm khichdi with ghee, Ashwath. It tastes so yum!"*
- *"Is your tummy happy and full, Ashwath, or would you like one more bite?"*
- *"Food stays on the table, Ashwath. When we leave the table, eating is done until snack time."*

### ⚠️ Common Mistakes to Avoid
- Avoid playing YouTube videos or cartoons to trick Ashwath into opening their mouth.
- Avoid bribing with biscuits or sweets (*"Eat your dal if you want sweet"*).

### 🌐 Trusted Health Guidelines
- [Indian Academy of Pediatrics (IAP) - Infant & Young Child Feeding](https://iapindia.org)
- [ICMR - National Institute of Nutrition (NIN)](https://www.nin.res.in)`,
    date: '15 Sep 2026',
    time: '12:30 PM',
    month: 'September 2026',
    category: 'Nutrition & Feeding',
    tags: ['Picky Eating', 'Vegetables', 'Appetite', 'Khichdi']
  },
  {
    id: 'ai-hist-3',
    question: 'Why does my toddler hit and bite when angry or frustrated?',
    answer: `Lashmi, here is loving, gentle guidance to stop hitting and handle big feelings with Ashwath:

### 📋 Step-by-Step Action Plan (for Lashmi & Ashwath)
1. **Stay Calm and Gentle**: Take a slow breath before speaking. When you stay calm, Ashwath feels secure and settles down much faster.
2. **Hold Hands Firmly and Lovingly**: If Ashwath tries to hit or bite, gently hold their hands and say in a soft, firm voice: *"I will keep us safe, Ashwath. Hands are not for hitting."*
3. **Give a Safe Way to Let Feelings Out**: Tell Ashwath: *"If your body feels mad, you can stomp your feet on the floor, squeeze a soft pillow, or blow big breaths like a lion."*
4. **Stay Close (No Lonely Time-Outs)**: Sit near Ashwath and offer an open hug or gentle back patting (thappi) as soon as they are ready.

### 🗣️ Calming Parent Scripts (What to Say to Ashwath)
- *"You are feeling very upset right now, Ashwath. Mamma is right here with you."*
- *"My hands are gentle, and your hands are gentle, Ashwath. We use hands for hugging."*
- *"It is okay to feel angry, Ashwath, but it is not okay to hit or bite."*
- *"Whenever you are ready for a warm cuddle, Ashwath, my arms are wide open."*

### ⚠️ Common Mistakes to Avoid
- Avoid shouting, lecturing, or slapping back to teach a lesson.
- Avoid locking Ashwath alone in a room when they are crying or upset.

### 🌐 Trusted Health Guidelines
- [Indian Academy of Pediatrics (IAP) - Positive Parenting](https://iapindia.org)
- [World Health Organization (WHO) - Child Care](https://www.who.int/health-topics/child-health)`,
    date: '03 Sep 2026',
    time: '04:15 PM',
    month: 'September 2026',
    category: 'Tantrums & Behavior',
    tags: ['Hitting', 'Biting', 'Gentle Hands', 'Big Feelings']
  },
  {
    id: 'ai-hist-4',
    question: 'How do I know if my 2-year-old is ready for potty training?',
    answer: `Lashmi, here is simple, gentle guidance to start potty training with Ashwath:

### 📋 Step-by-Step Action Plan (for Lashmi & Ashwath)
1. **Look for Ready Signs**: Notice if Ashwath stays dry for 2 hours, tells you when their diaper is wet, or hides behind a chair to poop.
2. **Keep a Child Potty in the Bathroom**: Keep a small potty chair on the floor where Ashwath's feet rest flat and comfortable.
3. **Invite to Sit for 3 Minutes After Meals**: Ask Ashwath to sit for just a few minutes after breakfast or dinner, when the tummy naturally wants to empty.
4. **Switch to Soft Cotton Underpants at Home**: Letting Ashwath wear cotton pants helps them feel when they are wet. Keep stools soft with plenty of water and papaya.

### 🗣️ Calming Parent Scripts (What to Say to Ashwath)
- *"Accidents are totally okay while learning, Ashwath. Pee goes in the potty. Let us put on clean dry pants."*
- *"It is potty time before we play with your blocks, Ashwath. Would you like to sit on your potty?"*
- *"You did a great job trying, Ashwath! Even if no pee came, you sat so nicely."*
- *"Your potty is right here whenever you need it, Ashwath. Mamma is here to help."*

### ⚠️ Common Mistakes to Avoid
- Avoid scolding, shaming, or getting upset when accidents happen.
- Avoid forcing Ashwath to sit on the potty for more than 5 minutes.

### 🌐 Trusted Health Guidelines
- [Indian Academy of Pediatrics (IAP) - Child Health](https://iapindia.org)
- [World Health Organization (WHO) - Early Childhood Development](https://www.who.int/health-topics/child-health)`,
    date: '24 Aug 2026',
    time: '10:00 AM',
    month: 'August 2026',
    category: 'Potty Training',
    tags: ['Potty Training', 'Readiness', 'Cotton Pants', 'Gentle Routine']
  },
  {
    id: 'ai-hist-5',
    question: 'My child says "NO" to every single question and instruction. Is this normal?',
    answer: `Lashmi, here is practical, loving guidance for when Ashwath says "NO" to everything:

### 📋 Step-by-Step Action Plan (for Lashmi & Ashwath)
1. **Understand It Is Healthy**: Saying "No" means Ashwath is learning to be an independent little person. It is not defiance or bad behavior.
2. **Stop Asking Yes/No Questions**: Instead of asking *"Do you want to wear shoes?"*, offer two easy choices: *"It is time to go out. Would you like the red shoes or the blue shoes?"*
3. **Use "First... Then..."**: Keep requests simple: *"First we put the blocks in the basket, then we have our sweet papaya snack."*
4. **Make It a Fun Game**: Toddlers love games: *"Can you tiptoe like a little mouse to wash your hands?"*

### 🗣️ Calming Parent Scripts (What to Say to Ashwath)
- *"I hear your big 'NO', Ashwath! You really want to choose, and that is okay."*
- *"It is time to wash hands, Ashwath. Would you like to jump like a frog or walk like a bear to the sink?"*
- *"Mamma will put one shoe on, and you put the other shoe on, Ashwath."*
- *"You are growing into such a capable big helper, Ashwath."*

### ⚠️ Common Mistakes to Avoid
- Avoid getting drawn into endless arguments with a toddler.
- Avoid giving in to unsafe demands just to stop a protest; stay calm, firm, and loving.

### 🌐 Trusted Health Guidelines
- [Indian Academy of Pediatrics (IAP) - Positive Parenting](https://iapindia.org)
- [World Health Organization (WHO) - Nurturing Care](https://www.who.int/health-topics/child-health)`,
    date: '12 Aug 2026',
    time: '03:20 PM',
    month: 'August 2026',
    category: 'Tantrums & Behavior',
    tags: ['Toddler No', 'Choices', 'Cooperation', 'Loving Boundaries']
  },
  {
    id: 'ai-hist-6',
    question: 'Speech milestones at 18 months: how many words should my toddler say?',
    answer: `Lashmi, here is simple, encouraging guidance to help Ashwath learn new words:

### 📋 Step-by-Step Action Plan (for Lashmi & Ashwath)
1. **Talk About Daily Activities Out Loud**: Describe what you are doing in your mother tongue and English: *"Mamma is cutting the ripe yellow banana. Slice, slice, slice!"*
2. **Use the Plus-One Rule**: When Ashwath says one word, repeat it and add one simple word:
   - If Ashwath says: *"Car!"* -> You say: *"Yes, big red car!"*
   - If Ashwath says: *"Ball!"* -> You say: *"Bounce the round ball!"*
3. **Look Face-to-Face and Wait 5 Seconds**: Get down to Ashwath's eye level so they can see your mouth moving. Give them plenty of time to reply before speaking.
4. **Sing Simple Rhymes and Loris**: Sing nursery rhymes and traditional songs together with hand clapping and actions, keeping TVs and phones turned off.

### 🗣️ Calming Parent Scripts (What to Say to Ashwath)
- *"You are pointing at the cup, Ashwath. Are you asking for warm milk or water? Tell Mamma."*
- *"I hear you, Ashwath! You are telling Mamma all about the doggy outside."*
- *"Look at the birds flying in the sky, Ashwath! Up, up, up they go!"*
- *"I love hearing your sweet voice, Ashwath. You are learning so many new words."*

### ⚠️ Common Mistakes to Avoid
- Avoid letting TV screens or phone apps teach words; real human conversation works 10 times better.
- Avoid interrupting or finishing Ashwath's words too quickly.

### 🌐 Trusted Health Guidelines
- [Indian Academy of Pediatrics (IAP) - Child Speech & Development](https://iapindia.org)
- [World Health Organization (WHO) - Child Health](https://www.who.int/health-topics/child-health)`,
    date: '28 Jul 2026',
    time: '11:10 AM',
    month: 'July 2026',
    category: 'Growth & Milestones',
    tags: ['Speech', 'Talking Words', 'Loris & Rhymes', '18 Months']
  },
  {
    id: 'ai-hist-7',
    question: 'How to transition toddler from crib to toddler bed without constant escapes?',
    answer: `Lashmi, here is simple, gentle guidance to help Ashwath sleep comfortably in a toddler bed:

### 📋 Step-by-Step Action Plan (for Lashmi & Ashwath)
1. **Do Not Rush the Transition**: Keep Ashwath in a crib until age 2.5 or 3 unless they are climbing out, as younger toddlers naturally want to explore.
2. **Child-Proof the Whole Bedroom**: Anchor heavy cupboards and bookshelves to the wall, cover electric sockets, and put a safety gate at the bedroom door if needed.
3. **Use the Calm Silent Return**: When Ashwath gets out of bed, gently take their hand and lead them straight back to bed without scolding or turning on bright lights.
4. **Keep the Familiar Cozy Bedding**: Use the same soft blanket, familiar pillow, and gentle back-patting (thappi) so Ashwath feels secure.

### 🗣️ Calming Parent Scripts (What to Say to Ashwath)
- *"It is night-night time, Ashwath. Back into your cozy bed."*
- *"Your bed is warm and safe, Ashwath. Mamma is right in the next room."*
- *"Let us tuck your blanket in tight, Ashwath. Close your eyes and rest."*
- *"Tomorrow morning we will wake up and play blocks together, Ashwath."*

### ⚠️ Common Mistakes to Avoid
- Avoid getting into long conversations or games when Ashwath gets out of bed.
- Avoid scolding or locking the door; keep the atmosphere quiet, safe, and sleepy.

### 🌐 Trusted Health Guidelines
- [Indian Academy of Pediatrics (IAP) - Child Sleep](https://iapindia.org)
- [World Health Organization (WHO) - Child Health](https://www.who.int/health-topics/child-health)`,
    date: '16 Jul 2026',
    time: '09:40 PM',
    month: 'July 2026',
    category: 'Bedtime & Sleep',
    tags: ['Toddler Bed', 'Bedtime Routine', 'Cozy Sleep', 'Safety']
  }
];

export function isPersonalInfoQuery(query: string): boolean {
  const q = query.toLowerCase().trim();
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

export function getResponsibleAIRefusal(parentName?: string, childName?: string, childAge?: string): string {
  const pName = parentName?.trim() || 'Lashmi';
  const cName = childName?.trim() || 'Ashwath';
  return `### 🛡️ Responsible AI & Privacy Notice

${pName},

**Tricky Toddler AI** is committed to strict **Responsible AI**, **Child Online Privacy Protection (COPPA)**, and **Healthcare Privacy Standards**.

**I cannot answer questions asking for personal information or disclose private personal data** (such as phone numbers, email addresses, physical home addresses, passwords, credit card/banking details, or government identification).

All our capabilities are strictly focused on pediatric health, growth milestones, nutrition, and child development (ages 0 to 18) for ${cName} in a safe, privacy-preserving environment.

---

${getHowICanSupportYou(cName, childAge)}`;
}

export function getOutOfScopePediatricNotice(parentName?: string, childName?: string, childAge?: string): string {
  const pName = parentName?.trim() || 'Lashmi';
  const cName = childName?.trim() || 'Ashwath';
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
    const raw = localStorage.getItem(AI_HISTORY_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(AI_HISTORY_STORAGE_KEY, JSON.stringify(INITIAL_AI_SEARCH_HISTORY));
      return INITIAL_AI_SEARCH_HISTORY;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_AI_SEARCH_HISTORY;
  } catch {
    return INITIAL_AI_SEARCH_HISTORY;
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
