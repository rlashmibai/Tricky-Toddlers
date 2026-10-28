import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, Sparkles, Loader2, Baby, MessageCircle, 
  HelpCircle, ChevronRight, RotateCcw, ShieldCheck, Send, User, CornerDownLeft, Paperclip
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { useAuth } from '../lib/AuthContext';
import { useLanguage } from '../lib/LanguageContext';
import { playSound } from '../lib/sounds';
import { 
  saveAISearchRecord, 
  getFollowUpQuestions, 
  isOutOfScopeQuery, 
  isPersonalInfoQuery, 
  getResponsibleAIRefusal, 
  getOutOfScopePediatricNotice,
  getHowICanSupportYou 
} from '../lib/aiHistory';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

function cleanAssistantGreeting(text: string, parentName?: string): string {
  if (!text) return '';
  const p = (parentName || 'Lashmi').trim();
  return text
    .replace(new RegExp(`\\b${p}[,\\s]+${p.slice(-2)}[!\\?,\\s]*`, 'gi'), `${p}, `)
    .replace(new RegExp(`\\b${p}[,\\s]+${p}[!,\\s]*`, 'gi'), `${p}, `)
    .replace(/\b([A-Z][a-z]+)[,\s]+([a-z]{1,3})[!,\s]+/gi, (m, name, suffix) => {
      if (name.toLowerCase().endsWith(suffix.toLowerCase())) {
        return `${name}, `;
      }
      return m;
    });
}

function getSmartFallbackGuidance(q: string, parentName: string, childName: string, childAge?: string): string {
  const lq = q.toLowerCase();
  const pName = parentName?.trim() || 'Lashmi';
  const cName = childName?.trim() || 'Ashwath';

  // Responsible AI Check: Refuse questions asking for personal information (PII)
  if (isPersonalInfoQuery(lq)) {
    return getResponsibleAIRefusal(pName, cName, childAge);
  }

  // Strict Out-of-Scope refusal check for Tricky Toddler (Pediatric Scope: Birth up to 18 Years)
  if (isOutOfScopeQuery(lq)) {
    return getOutOfScopePediatricNotice(pName, cName, childAge);
  }

  // Potty Training
  if (lq.includes('potty') || lq.includes('toilet') || lq.includes('diaper') || lq.includes('pee') || lq.includes('poop') || lq.includes('undies') || lq.includes('withhold')) {
    return `### 🚽 Easy Potty Training Help for ${cName}

${pName}, here is simple, gentle guidance to help ${cName} with potty training:

### 📋 Step-by-Step Action Plan (for ${pName} & ${cName})
* **1. Keep a Small Potty Handy:** Keep a child-sized potty chair on the floor in the bathroom. Make sure ${cName}'s feet rest flat on the floor so they feel safe and comfortable.
* **2. Sit for 3 to 5 Minutes After Meals:** Try sitting ${cName} on the potty for just 3 to 5 minutes about 15 minutes after breakfast or dinner, when the tummy naturally wants to empty.
* **3. Switch to Soft Cotton Underpants:** During the day at home, let ${cName} wear regular cotton underpants. This helps ${cName} easily notice when they feel wet.
* **4. Keep Stools Soft with Water and Fruit:** Offer plenty of water and soft fruits like ripe papaya, chikoo, and fresh curd so passing stool is never painful.

### 🗣️ Calming Parent Scripts (What to Say to ${cName})
1. **When an accident happens:** *"Accidents are okay while you are learning, ${cName}. Pee goes in the potty. Let us put on clean dry clothes together."*
2. **Inviting to sit without pressure:** *"It is potty time before we play with your blocks, ${cName}. Would you like to use your little potty now?"*
3. **Praising effort:** *"You sat so patiently, ${cName}! Even if no pee came out, you did a wonderful job trying."*
4. **Keeping it low-stress:** *"Your potty is right here whenever you need it, ${cName}. Mamma is here to help you."*

### ⚠️ Common Mistakes to Avoid
* Never get angry, scold, or force ${cName} to sit on the potty for a long time.
* Avoid asking over and over *"Do you need to go?"*-just gently invite them at regular times.

### 🌐 Trusted Health Guidelines
* [Indian Academy of Pediatrics (IAP) - Child Development](https://iapindia.org)
* [Ministry of Health & Family Welfare (MoHFW)](https://www.mohfw.gov.in)
* [World Health Organization (WHO) - Child Health](https://www.who.int/health-topics/child-health)`;
  }

  // Bedtime & Sleep
  if (lq.includes('bedtime') || lq.includes('sleep') || lq.includes('night') || lq.includes('nap') || lq.includes('wake') || lq.includes('crib')) {
    return `### 🌙 Peaceful Bedtime Guidance for ${cName}

${pName}, here is a simple, peaceful bedtime routine for ${cName}:

### 📋 Step-by-Step Action Plan (for ${pName} & ${cName})
* **1. Start Relaxing 30 Minutes Early:**
  * **Warm Wash or Bath:** A gentle warm wash or foot wash helps ${cName}'s body feel cozy and sleepy.
  * **Gentle Massage & Patting (Maalish / Thappi):** Rub a few drops of warm coconut or sesame oil on ${cName}'s feet, and give slow, gentle back-patting (thappi).
  * **Dim Lights & Storytime:** Keep the room dimly lit, brush teeth together, and read 1 or 2 sweet picture books in bed.
  * **Turn Off All Screens:** Shut down all TVs, mobiles, and tablets at least 45 minutes before sleep.
* **2. Offer One Bedtime Pass:** Give ${cName} one small token or card for one last glass of water or one extra hug. Once used, it is time to close eyes.
* **3. Move Bedtime 20 Minutes Earlier:** If bedtime takes more than 40 minutes every night, ${cName} is likely overtired. Moving bedtime a little earlier makes falling asleep much easier.

### 🗣️ Calming Parent Scripts (What to Say to ${cName})
1. **When fighting sleep:** *"I know you want to keep playing, ${cName}. All your toys are sleeping now, and your body needs sweet rest."*
2. **Setting a loving boundary:** *"Night time is quiet resting time in our home, ${cName}. Mamma is right beside you."*
3. **Giving a simple bedtime choice:** *"Would you like the bird story or the elephant story tonight, ${cName}?"*
4. **Soothing fears:** *"I will stay right here and give you gentle thappi until your eyes feel heavy and sleepy, ${cName}."*
5. **Loving goodnight words:** *"Close your eyes, my sweet ${cName}. Tomorrow morning we will play together again."*

### ⚠️ Common Mistakes to Avoid
* Avoid letting ${cName} watch cartoons or phone screens near bedtime.
* Avoid getting into long arguments or debates; keep your voice quiet, low, and soothing.

### 🌐 Trusted Health Guidelines
* [Indian Academy of Pediatrics (IAP) - Child Sleep Guidelines](https://iapindia.org)
* [ICMR - National Institute of Nutrition (NIN)](https://www.nin.res.in)
* [World Health Organization (WHO) - Early Childhood Sleep](https://www.who.int/health-topics/child-health)`;
  }

  // Picky Eating & Nutrition
  if (lq.includes('picky') || lq.includes('eat') || lq.includes('food') || lq.includes('feed') || lq.includes('meal') || lq.includes('vegetable')) {
    return `### 🥦 Happy Mealtime Guidance for ${cName}

${pName}, here is practical, stress-free mealtime advice for ${cName}:

### 📋 Step-by-Step Action Plan (for ${pName} & ${cName})
* **1. Share the Mealtime Job:**
  * **Your job:** Decide what healthy food to cook and when to serve it at regular meal times.
  * **${cName}'s job:** Decide how much to eat. Never force-feed, bargain, or bribe.
* **2. Always Serve One Liked Food:** Always keep at least one food on the plate that ${cName} already loves (like warm moong dal khichdi with ghee, curd rice, soft idli, or banana slices) along with new vegetables.
* **3. Eat Together Without Screens:** Sit together as a family for meals. Seeing you and family members enjoy food naturally encourages ${cName} to try bites. Keep phones and TVs away during meals.
* **4. Start with Small Spoonfuls:** Serve small amounts on the plate. A big bowl can scare ${cName}. It is always better if ${cName} asks for a second small helping.

### 🗣️ Calming Parent Scripts (What to Say to ${cName})
1. **When refusing to taste:** *"You do not have to finish it, ${cName}. You can just smell it or leave it on your plate."*
2. **Encouraging curiosity:** *"Look at this soft yellow dal, ${cName}. Would you like to touch it with your spoon?"*
3. **Listening to their tummy:** *"Listen to your little tummy, ${cName}. Is your tummy full, or would you like one more bite?"*
4. **Table rule in gentle words:** *"Food stays at the table, ${cName}. When we leave the table, eating is finished until snack time."*

### ⚠️ Common Mistakes to Avoid
* Avoid cooking a separate junk-food meal when ${cName} says no to dinner; offer a simple healthy backup like warm milk or curd rice.
* Avoid bribing with chocolates or sweets (*"Eat your vegetables first if you want sweet"*).

### 🌐 Trusted Health Guidelines
* [Indian Academy of Pediatrics (IAP) - Infant & Young Child Nutrition](https://iapindia.org)
* [ICMR - National Institute of Nutrition (NIN)](https://www.nin.res.in)
* [Food Safety and Standards Authority of India (FSSAI)](https://eatrightindia.gov.in)`;
  }

  // Tantrums, Hitting & Meltdowns
  if (lq.includes('hit') || lq.includes('bite') || lq.includes('biting') || lq.includes('aggression') || lq.includes('pinch') || lq.includes('tantrum') || lq.includes('meltdown')) {
    return `### 🛡️ Helping ${cName} with Tantrums, Hitting & Big Feelings

${pName}, here is simple, caring guidance to handle big emotions with ${cName}:

### 📋 Step-by-Step Action Plan (for ${pName} & ${cName})
* **1. Connect Before Correcting:** When ${cName} is crying or angry, lectures do not work. Kneel down to ${cName}'s eye level, stay calm, and take a deep breath yourself.
* **2. Keep Everyone Safe with Gentle Hands:** If ${cName} tries to hit, bite, or throw:
  * Gently and firmly hold their hands: *"I will keep us both safe, ${cName}. I cannot let you hit."*
  * Move siblings or items out of reach without shouting.
* **3. Give Safe Ways to Let Anger Out:** Say: *"Hands are for hugging and clapping, ${cName}. If your body feels mad, you can stomp your feet on the floor or squeeze this soft pillow."*
* **4. Stay Close (Time-In):** Instead of locking ${cName} in a lonely room, sit quietly nearby. Offer gentle back patting (thappi) or an open hug when ${cName} is ready.

### 🗣️ Calming Parent Scripts (What to Say to ${cName})
1. **When upset:** *"You are feeling very angry right now, ${cName}. It is hard when things do not go our way. Mamma is right here with you."*
2. **Stopping hitting or biting:** *"My hands are gentle, and your hands are gentle, ${cName}. We do not hit."*
3. **Offering an easy choice:** *"You are having big tears, ${cName}. Would you like a warm hug, or would you like to hold your blanket?"*
4. **Helping calm down:** *"Whenever you are ready, ${cName}, my arms are wide open for a big cuddle."*

### ⚠️ Common Mistakes to Avoid
* Avoid shouting, arguing, or getting angry when ${cName} is having a meltdown.
* Avoid punishing or isolating ${cName} alone in a room. Staying close teaches safety and self-control much faster.

### 🌐 Trusted Health Guidelines
* [Indian Academy of Pediatrics (IAP) - Positive Parenting Guidelines](https://iapindia.org)
* [World Health Organization (WHO) - Nurturing Care Framework](https://www.who.int/health-topics/child-health)
* [Ministry of Health & Family Welfare (MoHFW)](https://www.mohfw.gov.in)`;
  }

  // Speech & Language
  if (lq.includes('speech') || lq.includes('word') || lq.includes('talk') || lq.includes('language') || lq.includes('babble')) {
    return `### 🗣️ Helping ${cName} Talk and Learn Words Naturally

${pName}, here are easy daily ways to help ${cName} learn new words:

### 📋 Step-by-Step Action Plan (for ${pName} & ${cName})
* **1. Talk About What You Are Doing:** Talk out loud during daily chores in your mother tongue and English: *"We are putting on your red shoes, ${cName}. Now let us walk outside!"*
* **2. The Plus-One Rule:** Whenever ${cName} says one word, repeat it and add one simple word:
  * If ${cName} says: *"Car!"* -> You say: *"Yes, big red car!"*
  * If ${cName} says: *"Water!"* -> You say: *"Cold water in your cup!"*
* **3. Look at Each Other Face-to-Face:** Get down to ${cName}'s eye level so they can clearly see your lips and mouth moving when you speak.
* **4. Sing Songs and Rhymes:** Sing simple nursery rhymes and traditional loris together with clapping and actions. Avoid background TV noise.

### 🗣️ Calming Parent Scripts (What to Say to ${cName})
1. **Encouraging words patiently:** *"You are pointing at the table, ${cName}. Are you asking for water or the banana? Tell Mamma with your words."* (Wait 5 seconds patiently).
2. **Validating sounds:** *"I hear you, ${cName}! You are telling Mamma about the bird outside."*
3. **Playing with sounds:** *"Look at the round ball, ${cName}! Roll the ball, roll, roll, roll!"*
4. **Encouraging conversation:** *"I love hearing your sweet voice, ${cName}. You are learning so many new words every day."*

### ⚠️ When to Consult Your Pediatrician
* If ${cName} is not using at least a few words by 18-24 months, or does not point to show what they want, ask your pediatrician for a quick routine check.

### 🌐 Trusted Health Guidelines
* [Indian Academy of Pediatrics (IAP) - Child Speech & Development](https://iapindia.org)
* [World Health Organization (WHO) - Child Health Standards](https://www.who.int/health-topics/child-health)`;
  }

  // General Pediatric Guidance
  return `### 👶 Practical Parenting Guidance for ${cName}: "${q}"

${pName}, here is simple, caring guidance for ${cName}:

### 📋 Step-by-Step Action Plan (for ${pName} & ${cName})
* **1. Keep a Simple Daily Routine:** Children feel most secure when daily timings for waking up, meals, play, and bedtime follow a familiar pattern every day.
* **2. Tell Them What To Do:** Use positive words instead of *"Don't"*. For example, say *"Walk with gentle feet inside our home"* instead of *"Don't run"*.
* **3. Keep Requests Simple:** Give one small instruction at a time so ${cName} does not feel confused or overwhelmed.
* **4. Stay Calm and Loving:** When ${cName} is having a hard moment, speak in a soft, calm voice. A gentle hug or thappi goes a long way.

### 🗣️ Calming Parent Scripts (What to Say to ${cName})
1. **Empathy:** *"I hear you, my sweet ${cName}. Mamma is right here with you."*
2. **Clear and gentle boundary:** *"We use gentle hands in our home, ${cName}. Let us keep everyone safe."*
3. **Simple choice:** *"Would you like to wear your blue shirt or your yellow shirt today, ${cName}?"*
4. **Loving encouragement:** *"You are doing such a good job trying, ${cName}. Mamma is very proud of you."*

### ⚠️ Common Mistakes to Avoid
* Avoid shouting or getting angry when things feel difficult.
* Avoid using mobile phones or screens to keep ${cName} quiet during meals or bedtime.

### 🌐 Trusted Health Guidelines
* [Indian Academy of Pediatrics (IAP) - Parenting Guidelines](https://iapindia.org)
* [ICMR - National Institute of Nutrition (NIN)](https://www.nin.res.in)
* [World Health Organization (WHO) - Child Health](https://www.who.int/health-topics/child-health)`;
}

// Client-side instant query cache for sub-millisecond response replay
const clientInstantCache = new Map<string, string>();

export const SearchSection: React.FC = () => {
  const { user, profile } = useAuth();
  const { t, getAIPromptModifier } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [query, setQuery] = useState('');
  const [followUpText, setFollowUpText] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Google AI Mode conversational messages history
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const followUpInputRef = useRef<HTMLTextAreaElement>(null);
  const searchFormRef = useRef<HTMLDivElement>(null);
  const responseContainerRef = useRef<HTMLDivElement>(null);

  // Dynamic Parent & Child names from profile / local storage
  const parentName = profile?.parentName || profile?.firstName || profile?.name || localStorage.getItem('parent_name') || 'Lashmi';
  const childName = profile?.babyName || profile?.childName || localStorage.getItem('baby_name') || 'Ashwath';
  const childAge = profile?.babyAge || localStorage.getItem('baby_age') || '14 Months';

  // Auto-run query if coming from another page with initialQuery param
  useEffect(() => {
    const initQ = searchParams.get('initialQuery');
    if (initQ && initQ.trim()) {
      setQuery(initQ);
      handleSearch(undefined, initQ);
    }
  }, [searchParams]);

  const handleAskAnother = () => {
    playSound('pop');
    setQuery('');
    setFollowUpText('');
    setMessages([]);
    setHasSearched(false);

    if (searchParams.get('initialQuery')) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('initialQuery');
      setSearchParams(newParams, { replace: true });
    }

    // Smoothly scroll back to the search bar
    setTimeout(() => {
      if (searchFormRef.current) {
        searchFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 180, behavior: 'smooth' });
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
    }, 50);
  };

  useEffect(() => {
    const handleNavRefresh = (e: any) => {
      if (e?.detail?.tab === 'ai') {
        handleAskAnother();
      }
    };
    window.addEventListener('nav-tab-refresh', handleNavRefresh);
    return () => window.removeEventListener('nav-tab-refresh', handleNavRefresh);
  }, []);

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = (customQuery || query).trim();
    if (!finalQuery) return;

    playSound('glass');
    setLoading(true);
    setHasSearched(true);
    if (customQuery) setQuery(customQuery);

    // Gently bring the response card into view so the parent can read from the top
    setTimeout(() => {
      responseContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);

    const userMessage: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: finalQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const assistantPlaceholderId = `a_${Date.now()}`;
    const initialAssistantMessage: ChatMessage = {
      id: assistantPlaceholderId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Initialize or reset conversation with the first question
    const updatedMessages = [userMessage, initialAssistantMessage];
    setMessages(updatedMessages);

    // Responsible AI Check: Refuse questions asking for personal information (PII)
    if (isPersonalInfoQuery(finalQuery)) {
      const piiNotice = getResponsibleAIRefusal(parentName, childName, childAge);
      setMessages([
        userMessage,
        { ...initialAssistantMessage, content: piiNotice }
      ]);
      saveAISearchRecord(finalQuery, piiNotice);
      setLoading(false);
      playSound('pop');
      return;
    }

    // Quick client-side check for out-of-scope non-pediatric queries (0-18 years scope)
    if (isOutOfScopeQuery(finalQuery)) {
      const refusalNotice = getSmartFallbackGuidance(finalQuery, parentName, childName, childAge);
      setMessages([
        userMessage,
        { ...initialAssistantMessage, content: refusalNotice }
      ]);
      saveAISearchRecord(finalQuery, refusalNotice);
      setLoading(false);
      playSound('pop');
      return;
    }

    // Instant local cache check for sub-millisecond response replay
    const langModifier = getAIPromptModifier();
    const cacheKey = `${finalQuery.trim().toLowerCase()}|${parentName}|${childName}|${childAge}|${langModifier}`;
    const cachedResponse = clientInstantCache.get(cacheKey);
    if (cachedResponse) {
      setMessages([
        userMessage,
        { ...initialAssistantMessage, content: cachedResponse }
      ]);
      saveAISearchRecord(finalQuery, cachedResponse);
      setLoading(false);
      playSound('pop');
      return;
    }

    let accumulatedText = '';
    const abortController = new AbortController();
    let timeoutId: any = setTimeout(() => {
      abortController.abort();
    }, 7000);

    try {
      const apiRes = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortController.signal,
        body: JSON.stringify({
          query: finalQuery,
          messages: [{ role: 'user', content: finalQuery }],
          parentName,
          childName,
          childAge,
          languagePromptModifier: langModifier,
        }),
      });

      if (!apiRes.ok || !apiRes.body) {
        throw new Error(`AI service responded with status ${apiRes.status}`);
      }

      const reader = apiRes.body.getReader();
      const decoder = new TextDecoder();
      let firstChunk = true;
      let streamedAny = false;
      let updateScheduled = false;
      let animFrameId: number | null = null;

      const scheduleStateUpdate = () => {
        if (!updateScheduled) {
          updateScheduled = true;
          animFrameId = requestAnimationFrame(() => {
            setMessages(prev => 
              prev.map(m => m.id === assistantPlaceholderId ? { ...m, content: accumulatedText } : m)
            );
            updateScheduled = false;
          });
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        if (chunkText) {
          streamedAny = true;
          accumulatedText += chunkText;
          if (firstChunk) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
              abortController.abort();
            }, 10000);
            playSound('pop');
            firstChunk = false;
          }
          scheduleStateUpdate();
        }
      }

      clearTimeout(timeoutId);
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
      }

      const rawResponse = streamedAny && accumulatedText.trim().length > 0 
        ? accumulatedText 
        : getSmartFallbackGuidance(finalQuery, parentName, childName, childAge);
      const finalResponse = cleanAssistantGreeting(rawResponse, parentName);

      clientInstantCache.set(cacheKey, finalResponse);
      setMessages(prev => 
        prev.map(m => m.id === assistantPlaceholderId ? { ...m, content: finalResponse } : m)
      );
      saveAISearchRecord(finalQuery, finalResponse);
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn("Server AI streaming encountered issue, using comprehensive pediatric guidance:", error);
      const fallbackText = getSmartFallbackGuidance(finalQuery, parentName, childName, childAge);
      clientInstantCache.set(cacheKey, fallbackText);
      setMessages(prev => 
        prev.map(m => m.id === assistantPlaceholderId ? { ...m, content: fallbackText } : m)
      );
      saveAISearchRecord(finalQuery, fallbackText);
      playSound('pop');
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  // Handle follow-up queries in continuous Google AI Mode
  const handleFollowUp = async (e?: React.FormEvent, customFollowUp?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customFollowUp || followUpText).trim();
    if (!textToSend || loading) return;

    playSound('glass');
    setLoading(true);
    setFollowUpText('');

    const userMessage: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const assistantPlaceholderId = `a_${Date.now()}`;
    const initialAssistantMessage: ChatMessage = {
      id: assistantPlaceholderId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const conversationHistoryForApi = [
      ...messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: textToSend }
    ];

    setMessages(prev => [...prev, userMessage, initialAssistantMessage]);

    // Responsible AI Check: Refuse questions asking for personal information (PII)
    if (isPersonalInfoQuery(textToSend)) {
      const piiNotice = getResponsibleAIRefusal(parentName, childName, childAge);
      setMessages(prev => 
        prev.map(m => m.id === assistantPlaceholderId ? { ...m, content: piiNotice } : m)
      );
      saveAISearchRecord(textToSend, piiNotice);
      setLoading(false);
      playSound('pop');
      return;
    }

    // Quick out-of-scope check (0-18 years pediatric scope)
    if (isOutOfScopeQuery(textToSend)) {
      const refusalNotice = getSmartFallbackGuidance(textToSend, parentName, childName, childAge);
      setMessages(prev => 
        prev.map(m => m.id === assistantPlaceholderId ? { ...m, content: refusalNotice } : m)
      );
      saveAISearchRecord(textToSend, refusalNotice);
      setLoading(false);
      playSound('pop');
      return;
    }

    // Instant local cache check for sub-millisecond follow-up response replay
    const langModifier = getAIPromptModifier();
    const followUpCacheKey = `${textToSend.trim().toLowerCase()}|${parentName}|${childName}|${childAge}|${langModifier}`;
    const cachedFollowUp = clientInstantCache.get(followUpCacheKey);
    if (cachedFollowUp) {
      setMessages(prev => 
        prev.map(m => m.id === assistantPlaceholderId ? { ...m, content: cachedFollowUp } : m)
      );
      saveAISearchRecord(textToSend, cachedFollowUp);
      setLoading(false);
      playSound('pop');
      return;
    }

    let accumulatedText = '';
    const abortController = new AbortController();
    let timeoutId: any = setTimeout(() => {
      abortController.abort();
    }, 7000);

    try {
      const apiRes = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortController.signal,
        body: JSON.stringify({
          query: textToSend,
          messages: conversationHistoryForApi,
          parentName,
          childName,
          childAge,
          languagePromptModifier: langModifier,
        }),
      });

      if (!apiRes.ok || !apiRes.body) {
        throw new Error(`AI service responded with status ${apiRes.status}`);
      }

      const reader = apiRes.body.getReader();
      const decoder = new TextDecoder();
      let firstChunk = true;
      let streamedAny = false;
      let updateScheduled = false;
      let animFrameId: number | null = null;

      const scheduleStateUpdate = () => {
        if (!updateScheduled) {
          updateScheduled = true;
          animFrameId = requestAnimationFrame(() => {
            setMessages(prev => 
              prev.map(m => m.id === assistantPlaceholderId ? { ...m, content: accumulatedText } : m)
            );
            updateScheduled = false;
          });
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        if (chunkText) {
          streamedAny = true;
          accumulatedText += chunkText;
          if (firstChunk) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
              abortController.abort();
            }, 10000);
            playSound('pop');
            firstChunk = false;
          }
          scheduleStateUpdate();
        }
      }

      clearTimeout(timeoutId);
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
      }

      const rawResponse = streamedAny && accumulatedText.trim().length > 0 
        ? accumulatedText 
        : getSmartFallbackGuidance(textToSend, parentName, childName, childAge);
      const finalResponse = cleanAssistantGreeting(rawResponse, parentName);

      clientInstantCache.set(followUpCacheKey, finalResponse);
      setMessages(prev => 
        prev.map(m => m.id === assistantPlaceholderId ? { ...m, content: finalResponse } : m)
      );
      saveAISearchRecord(textToSend, finalResponse);
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn("Server AI streaming encountered issue, using comprehensive pediatric guidance:", error);
      const fallbackText = getSmartFallbackGuidance(textToSend, parentName, childName, childAge);
      clientInstantCache.set(followUpCacheKey, fallbackText);
      setMessages(prev => 
        prev.map(m => m.id === assistantPlaceholderId ? { ...m, content: fallbackText } : m)
      );
      saveAISearchRecord(textToSend, fallbackText);
      playSound('pop');
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    t('qBedtimeTantrum'),
    t('qPickyEaters'),
    t('qHittingBiting'),
    t('qPottyTraining'),
    t('qNoEveryTime'),
    t('qBigBedTransition')
  ];

  // Derive follow-up suggestion chips based on the latest question & answer
  const latestUserMsg = [...messages].reverse().find(m => m.role === 'user');
  const latestAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
  const followUpChips = latestUserMsg && latestAssistantMsg?.content
    ? getFollowUpQuestions(latestUserMsg.content, latestAssistantMsg.content)
    : [];

  return (
    <div className="w-full max-w-full mx-auto py-2 sm:py-4 px-2 sm:px-4 lg:px-6 text-center">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-bold text-indigo-300 tracking-tight mb-1"
      >
        AI-Powered, Certified Parenting Guidance
      </motion.h2>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-4xl md:text-5xl font-sans font-black tracking-normal sm:tracking-tight leading-tight mb-4 px-2 overflow-visible"
      >
        <span className="text-white">
          How can we help{' '}
        </span>
        <span className="italic font-serif bg-gradient-to-r from-teal-300 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
          today?
        </span>
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto mb-6 font-medium leading-relaxed px-4"
      >
        Expert toddler advice at your fingertips. Ask about behavior, sleep, health, or nutrition.
      </motion.p>

      {/* Main Search Bar (Multi-line enabled with Enter / Shift+Enter for line breaks) */}
      <div id="ask-ai-search-bar" ref={searchFormRef} className="relative group w-full mx-auto mb-4 text-left">
        <div className="relative rounded-2xl sm:rounded-3xl bg-white/[0.04] border border-white/[0.12] focus-within:border-indigo-400/60 focus-within:ring-4 focus-within:ring-indigo-500/15 transition-all shadow-2xl p-2.5 sm:p-3.5 backdrop-blur-xl">
          <div className="flex items-start gap-2.5">
            <div className="text-white/40 group-focus-within:text-indigo-400 transition-colors pt-1 shrink-0">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <textarea
              ref={inputRef}
              rows={2}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // Enter and Shift+Enter both insert line breaks; do not submit or select button
                  e.stopPropagation();
                }
              }}
              placeholder={t('placeholderSearch')}
              className="w-full bg-transparent border-none text-sm sm:text-base md:text-lg text-white focus:outline-none resize-y placeholder:text-white/30 leading-relaxed min-h-[50px]"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 mt-1 border-t border-white/5">
            <span className="text-[10px] sm:text-[11px] text-white/40 font-medium">
              Press <strong>Enter</strong> for line break • Click button to ask
            </span>
            <div className="flex items-center gap-2">
              <label className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer border border-white/20" title="Upload Image/File">
                <Paperclip className="w-4 h-4" />
                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    // Logic to upload
                  }
                }} />
              </label>
              <button
                type="button"
                onClick={() => handleSearch()}
                disabled={loading || !query.trim()}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-xs sm:text-sm hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-indigo-500/20 cursor-pointer whitespace-nowrap self-end sm:self-auto"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Ask Tricky Toddlers'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Questions Bubbles (Initial State) */}
      {!hasSearched && (
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {suggestedQuestions.map((q, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => handleSearch(undefined, q)}
              disabled={loading}
              className="px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs sm:text-sm font-semibold hover:bg-white/15 hover:text-white hover:border-indigo-400/40 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {q}
            </motion.button>
          ))}
        </div>
      )}

      {/* Dynamic Profile-Age Based Support Card (Pediatric Scope: Birth up to 18 Years) */}
      {!hasSearched && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-10 text-left glass-card p-6 sm:p-8 rounded-3xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/40 via-slate-900/70 to-purple-950/40 shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
                <Sparkles className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  How I Can Support You and {childName}
                </h3>
                <p className="text-xs text-indigo-200/80">
                  Pediatric &amp; developmental guidance fine-tuned for {childName} based on profile age
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                Child Age: {childAge}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                0-18 Years
              </span>
            </div>
          </div>

          <div className="prose prose-invert prose-indigo max-w-none text-xs sm:text-sm text-slate-200 leading-relaxed">
            <Markdown>{getHowICanSupportYou(childName, childAge)}</Markdown>
          </div>
        </motion.div>
      )}

      {/* AI Continuous Conversation View */}
      <AnimatePresence mode="wait">
        {hasSearched && (
          <motion.div
            ref={responseContainerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5 sm:p-7 md:p-8 lg:p-10 relative overflow-hidden text-left border border-white/10 shadow-2xl rounded-3xl w-full max-w-full mx-auto"
          >
            <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
              <Baby className="w-32 h-32 rotate-12" />
            </div>
            
            <div className="relative z-10">
              {/* Clean Header: Retaining only "Tailored guidance for {childName}" */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Tailored guidance for {childName}
                </h2>
              </div>

              {/* Conversational Message Thread */}
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <div key={msg.id || index} className="space-y-3">
                    {msg.role === 'user' ? (
                      /* User Message Bubble */
                      <div className="flex items-start justify-end gap-3">
                        <div className="max-w-4xl sm:max-w-5xl lg:max-w-6xl bg-gradient-to-br from-indigo-600/90 to-indigo-700/90 text-white p-3.5 sm:p-4 rounded-2xl rounded-tr-sm shadow-lg border border-indigo-400/20">
                          <div className="flex items-center justify-between gap-4 mb-1 text-[11px] text-indigo-200 font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5" />
                              <span>{parentName} (You)</span>
                            </span>
                            <span className="text-[10px] opacity-75">{msg.timestamp}</span>
                          </div>
                          <p className="text-sm sm:text-[15px] font-medium leading-relaxed">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Assistant Response Card */
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-1">
                          <Sparkles className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-2xl p-4 sm:p-6 md:p-7 shadow-inner relative overflow-hidden">
                          <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-white/5">
                            <span className="text-xs text-slate-300 font-medium">
                              Plan for <strong className="text-white">{childName}</strong>
                            </span>
                            <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                          </div>

                          {!msg.content && loading ? (
                            <div className="flex items-center gap-3 text-indigo-300 animate-pulse py-5">
                              <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                              <span className="text-sm font-medium">
                                Preparing pediatric guidance for {childName}...
                              </span>
                            </div>
                          ) : (
                            <div className="prose prose-invert max-w-none text-slate-100 leading-relaxed font-sans text-left">
                              <Markdown
                                components={{
                                  h1: ({ children }) => <h1 className="text-lg sm:text-xl font-bold text-white mt-4 mb-2 flex items-center gap-2 border-b border-white/10 pb-1.5 tracking-tight">{children}</h1>,
                                  h2: ({ children }) => <h2 className="text-base sm:text-lg font-bold text-indigo-300 mt-3.5 mb-1.5 tracking-tight">{children}</h2>,
                                  h3: ({ children }) => <h3 className="text-sm sm:text-base font-semibold text-emerald-400 mt-3 mb-1 tracking-tight">{children}</h3>,
                                  p: ({ children }) => <p className="mb-3 text-slate-200 leading-relaxed text-sm sm:text-[15px]">{children}</p>,
                                  ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-sm sm:text-[15px]">{children}</ul>,
                                  ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-sm sm:text-[15px]">{children}</ol>,
                                  li: ({ children }) => <li className="text-sm sm:text-[15px] text-slate-200 leading-relaxed">{children}</li>,
                                  strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                                  em: ({ children }) => <em className="italic text-slate-300">{children}</em>,
                                  a: ({ href, children }) => (
                                    <a
                                      href={href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 underline font-semibold transition-colors decoration-indigo-400/60 hover:decoration-indigo-300 text-sm"
                                    >
                                      {children}
                                    </a>
                                  ),
                                }}
                              >
                                {msg.content}
                              </Markdown>
                              {loading && index === messages.length - 1 && (
                                <span className="inline-block w-2 h-3.5 bg-indigo-400 animate-pulse ml-1 align-middle" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Continuous Conversation Input Box */}
              <div className="mt-6 pt-5 border-t border-white/10 text-left">
                <div className="flex items-center justify-between mb-2.5 px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-indigo-400" />
                      Continue conversation for {childName}
                    </span>
                  </div>
                </div>

                <div 
                  className="relative group rounded-2xl bg-[#090e1c]/90 border border-indigo-500/30 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/20 transition-all p-3 sm:p-4 flex flex-col gap-2.5 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="pt-1.5 text-indigo-400 shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <textarea
                      ref={followUpInputRef}
                      rows={2}
                      value={followUpText}
                      onChange={(e) => setFollowUpText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          // Allow line breaks for Enter / Shift+Enter; do not submit
                          e.stopPropagation();
                        }
                      }}
                      placeholder={`Ask a follow-up or reply about ${childName}... (e.g. "What if ${childName} refuses?" or "How can grandparents help?")`}
                      disabled={loading}
                      className="w-full bg-transparent border-none text-sm sm:text-base text-white placeholder:text-white/40 focus:outline-none resize-y min-h-[48px] leading-relaxed"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 border-t border-white/5">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Press <strong>Enter</strong> for line break • Click <strong>Send</strong> to submit
                    </span>
                    <div className="flex items-center gap-2">
                      <label className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer border border-white/20" title="Upload Image/File">
                        <Paperclip className="w-4 h-4" />
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            // Logic to upload
                          }
                        }} />
                      </label>
                      <button
                        type="button"
                        onClick={() => handleFollowUp()}
                        disabled={loading || !followUpText.trim()}
                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-40 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 cursor-pointer active:scale-95 shrink-0 self-end sm:self-auto"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <span>Send</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Follow-Up Questions (Quick Prompt Suggestions) */}
              {!loading && followUpChips.length > 0 && (
                <div className="mt-6 pt-5 border-t border-white/5 text-left">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Or tap a quick follow-up for {childName}:
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {followUpChips.map((fq, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleFollowUp(undefined, fq)}
                        disabled={loading}
                        className="text-left p-3 rounded-xl bg-white/[0.04] hover:bg-indigo-500/15 border border-white/10 hover:border-indigo-500/40 text-xs text-slate-200 hover:text-white font-medium transition-all flex items-start gap-2.5 cursor-pointer group shadow-sm hover:shadow-indigo-500/10"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <span className="flex-1 leading-snug">{fq}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-white/30 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions Row: Ask Another Question */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button 
                    onClick={handleAskAnother}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold tracking-wide transition-all uppercase cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{t('askAnother')}</span>
                  </button>
                </div>

                <span className="text-[11px] text-slate-400 italic">
                  Pediatric guidance aligned with WHO, Indian IAP and FSSAI
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
