import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, Sparkles, Loader2, Baby, MessageCircle, 
  HelpCircle, ChevronRight, RotateCcw, Send, User, 
  Mic, MicOff, RefreshCw, AlertTriangle, ShieldCheck,
  CheckCircle2, Info, ArrowRight, BookOpen, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '../lib/AuthContext';
import { useLanguage } from '../lib/LanguageContext';
import { playSound } from '../lib/sounds';
import { ChildProfileSelector } from './ChildProfileSelector';
import { 
  saveAISearchRecord, 
  isPersonalInfoQuery, 
  getResponsibleAIRefusal, 
  getHowICanSupportYou 
} from '../lib/aiHistory';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isError?: boolean;
  failedQuery?: string;
}

interface ParsedResponse {
  cleanContent: string;
  clarificationOptions: string[];
  relatedQuestions: string[];
  medicalDisclaimer?: string;
}

function parseAIResponse(rawText: string): ParsedResponse {
  if (!rawText) {
    return { cleanContent: '', clarificationOptions: [], relatedQuestions: [] };
  }

  let text = rawText;
  let clarificationOptions: string[] = [];
  let relatedQuestions: string[] = [];
  let medicalDisclaimer: string | undefined = undefined;

  const isDisclaimerLine = (line: string) => {
    const lower = line.toLowerCase();
    return (
      lower.includes('medical information note') ||
      lower.includes('educational guidance only') ||
      lower.includes('consult your pediatrician') ||
      lower.includes('clinical diagnosis') ||
      lower.includes('medical disclaimer') ||
      lower.includes('emergency care') ||
      lower.startsWith('⚠️') ||
      lower.startsWith('*medical information')
    );
  };

  // Extract Clarification Options delimiter
  if (text.includes('---CLARIFICATION_OPTIONS---')) {
    const parts = text.split('---CLARIFICATION_OPTIONS---');
    text = parts[0].trim();
    const optionsBlock = parts[1] || '';
    clarificationOptions = optionsBlock
      .split('\n')
      .map(line => line.replace(/^[-*•\d.]+\s*/, '').replace(/[\[\]]/g, '').trim())
      .filter(line => {
        if (!line || line.includes('---')) return false;
        if (isDisclaimerLine(line)) {
          if (!medicalDisclaimer) {
            medicalDisclaimer = line.replace(/⚠️\s*\*?|\*?$/g, '').trim();
          }
          return false;
        }
        return true;
      });
  }

  // Extract Related Questions delimiter
  if (text.includes('---RELATED_QUESTIONS---')) {
    const parts = text.split('---RELATED_QUESTIONS---');
    text = parts[0].trim();
    const questionsBlock = parts[1] || '';
    relatedQuestions = questionsBlock
      .split('\n')
      .map(line => line.replace(/^[-*•\d.]+\s*/, '').replace(/[\[\]]/g, '').trim())
      .filter(line => {
        if (!line || line.includes('---')) return false;
        if (isDisclaimerLine(line)) {
          if (!medicalDisclaimer) {
            medicalDisclaimer = line.replace(/⚠️\s*\*?|\*?$/g, '').trim();
          }
          return false;
        }
        return true;
      });
  }

  // Extract Contextual Medical Disclaimer
  const disclaimerMatch = text.match(/(⚠️\s*\*?Medical Information Note:[^*]+\*?)/i);
  if (disclaimerMatch) {
    if (!medicalDisclaimer) {
      medicalDisclaimer = disclaimerMatch[1].replace(/⚠️\s*\*?|\*?$/g, '').trim();
    }
    text = text.replace(disclaimerMatch[0], '').trim();
  }

  // Robust Markdown Table Normalization
  // 1. If rows are joined by '| |' or '||' on a single line, split them with newlines
  text = text.replace(/\|\s*\|\s*/g, '|\n| ');
  text = text.replace(/\|:(-+)/g, '| :$1');

  // 2. Ensure heading preceding a table is cleanly separated by double newlines
  text = text.replace(/([^\n|])\s*\n*(\|(?:\s*[^|\n]+\s*\|)+)\n*(\|(?:\s*[:\-]+\s*\|)+)/g, '$1\n\n$2\n$3');
  text = text.replace(/([^\n|])\n+(\|(?:\s*[^|\n]+\s*\|)+)/g, '$1\n\n$2');

  // 3. Ensure heading immediately following a table row gets a blank line before it
  text = text.replace(/\|\s*(#{1,6}\s+)/g, '|\n\n$1');

  // 4. Ensure double newline follows the end of the table before regular text
  text = text.replace(/(\|(?:\s*[^|\n]+\s*\|)+)\n+([^\n|#\s])/g, '$1\n\n$2');

  // 5. Clean up any trailing double pipe at end of lines
  text = text.replace(/\|\s*\|\s*$/gm, '|');

  return {
    cleanContent: text,
    clarificationOptions,
    relatedQuestions,
    medicalDisclaimer,
  };
}

export interface AgeTopicItem {
  title: string;
  query: string;
  badge: string;
  color: string;
}

export const getChildAgeInMonths = (
  birthDateStr?: string | null, 
  ageStr?: string | null,
  childName?: string,
  childId?: number
): number => {
  const nameLower = (childName || '').toLowerCase();
  const isAshwath = childId === 1 || nameLower.includes('ashwath') || nameLower.includes('ashath') || nameLower.includes('rashwath');
  const isAnanya = childId === 2 || nameLower.includes('ananya');

  // If age string explicitly indicates years or months, prioritize parsing ageStr
  if (ageStr) {
    const lower = ageStr.toLowerCase();
    const yrMatch = lower.match(/(\d+)\s*(?:year|yr)/);
    const moMatch = lower.match(/(\d+)\s*(?:month|mo)/);
    let total = 0;
    if (yrMatch) total += parseInt(yrMatch[1], 10) * 12;
    if (moMatch) total += parseInt(moMatch[1], 10);
    if (total > 0) {
      if (isAshwath && total < 12) return 30; // Ashwath is ~2.5 yrs (30 mo)
      return total;
    }
  }

  // Parse birthDateStr if provided
  if (birthDateStr) {
    const dob = new Date(birthDateStr);
    if (!isNaN(dob.getTime())) {
      const now = new Date();
      let diff = (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());
      if (now.getDate() < dob.getDate()) diff--;
      if (diff >= 0) {
        if (isAshwath && diff < 12) return 30; // Ashwath is ~2.5 yrs (30 mo)
        return diff;
      }
    }
  }

  if (isAnanya) return 3; // Ananya is 3 months
  if (isAshwath) return 30; // Ashwath is 2.5 years (30 months)

  return 30; // Default toddler
};

export const getAgeSpecificTopics = (
  childName: string, 
  childAgeStr?: string | null, 
  birthDateStr?: string | null,
  childId?: number
): AgeTopicItem[] => {
  const months = getChildAgeInMonths(birthDateStr, childAgeStr, childName, childId);

  // 1. Young Infant: 0 to 5 Months (e.g. 3-4 months)
  if (months < 6) {
    return [
      {
        badge: "Sleep & Routine",
        title: "Wake windows & nap cues for 3-4 months",
        query: `What are the ideal wake windows, daily nap patterns, and sleepy cues for 3 to 4-month-old ${childName}?`,
        color: "border-purple-500/30 bg-purple-500/10 text-purple-200 hover:border-purple-400"
      },
      {
        badge: "Soothing & Comfort",
        title: "Relieving evening colic & trapped gas",
        query: `What gentle techniques, tummy massages, and bicycle leg exercises relieve evening colic and trapped gas in ${childName}?`,
        color: "border-amber-500/30 bg-amber-500/10 text-amber-200 hover:border-amber-400"
      },
      {
        badge: "Motor Skills",
        title: "Tummy time & building head control",
        query: `How much tummy time should ${childName} do daily, and how can I help if they get fussy after a couple of minutes?`,
        color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200 hover:border-emerald-400"
      },
      {
        badge: "Sensory Play",
        title: "High-contrast cards & visual tracking",
        query: `What black-and-white visual stimulation and sensory tracking toys best support brain development for ${childName}?`,
        color: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200 hover:border-cyan-400"
      },
      {
        badge: "Infant Feeding",
        title: "Growth spurts vs cluster feeding",
        query: `How do I tell if ${childName} is going through a growth spurt cluster feeding session versus overtired fussiness?`,
        color: "border-rose-500/30 bg-rose-500/10 text-rose-200 hover:border-rose-400"
      },
      {
        badge: "Sleep Progression",
        title: "Easing the 4-month sleep regression",
        query: `What gentle sleep habits and circadian cues can I establish to prepare ${childName} for the 4-month sleep regression?`,
        color: "border-indigo-500/30 bg-indigo-500/10 text-indigo-200 hover:border-indigo-400"
      },
      {
        badge: "Physical Milestones",
        title: "Rolling over readiness & floor play",
        query: `What early motor signs show ${childName} is getting ready to roll over, and how should I set up safe floor space?`,
        color: "border-teal-500/30 bg-teal-500/10 text-teal-200 hover:border-teal-400"
      },
      {
        badge: "Teething & Oral",
        title: "Drooling, hand-chewing & gum comfort",
        query: `Is heavy drooling and constant hand-sucking at this age early teething or normal developmental exploration for ${childName}?`,
        color: "border-amber-500/30 bg-amber-500/10 text-amber-200 hover:border-amber-400"
      },
      {
        badge: "Communication",
        title: "Encouraging responsive babbling & coos",
        query: `How can I engage in back-and-forth conversational babbling and vocal games with ${childName}?`,
        color: "border-blue-500/30 bg-blue-500/10 text-blue-200 hover:border-blue-400"
      }
    ];
  }

  // 2. Older Infant: 6 to 11 Months
  if (months < 12) {
    return [
      {
        badge: "First Solid Foods",
        title: "First solids & Indian weaning guide",
        query: `How should I introduce first solid foods (steamed apple, sprouted ragi porridge, and moong dal) to ${childName}?`,
        color: "border-rose-500/30 bg-rose-500/10 text-rose-200 hover:border-rose-400"
      },
      {
        badge: "Feeding Safety",
        title: "Gagging vs choking in finger foods",
        query: `What is the difference between normal gagging and real choking when offering soft finger foods to ${childName}?`,
        color: "border-amber-500/30 bg-amber-500/10 text-amber-200 hover:border-amber-400"
      },
      {
        badge: "Motor Skills",
        title: "Sitting balance & crawling exercises",
        query: `What playful floor games encourage independent sitting balance and core strength for crawling in ${childName}?`,
        color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200 hover:border-emerald-400"
      },
      {
        badge: "Teething Relief",
        title: "Soothing swollen teething gums safely",
        query: `What safe, pediatrician-approved home remedies soothe painful swollen gums during teething for ${childName}?`,
        color: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200 hover:border-cyan-400"
      },
      {
        badge: "Sleep & Separation",
        title: "Bedtime separation anxiety & routines",
        query: `How do I handle infant separation anxiety at bedtime and night wakings peacefully with ${childName}?`,
        color: "border-purple-500/30 bg-purple-500/10 text-purple-200 hover:border-purple-400"
      },
      {
        badge: "Fine Motor",
        title: "Pincer grasp & self-feeding practice",
        query: `What finger food textures and grasping toys help ${childName} develop a strong pincer grasp?`,
        color: "border-teal-500/30 bg-teal-500/10 text-teal-200 hover:border-teal-400"
      },
      {
        badge: "Cup Drinking",
        title: "Introducing open cups & water sips",
        query: `When and how should I introduce water sips in an open cup or straw cup to ${childName}?`,
        color: "border-blue-500/30 bg-blue-500/10 text-blue-200 hover:border-blue-400"
      },
      {
        badge: "Cognitive Play",
        title: "Object permanence & peek-a-boo",
        query: `What interactive games teach ${childName} object permanence and help with separation reassurance?`,
        color: "border-indigo-500/30 bg-indigo-500/10 text-indigo-200 hover:border-indigo-400"
      },
      {
        badge: "Baby Proofing",
        title: "Pulling to stand & furniture safety",
        query: `What crucial baby-proofing steps should I take now that ${childName} is pulling up on tables and furniture?`,
        color: "border-amber-500/30 bg-amber-500/10 text-amber-200 hover:border-amber-400"
      }
    ];
  }

  // 3. Young Toddler: 12 to 23 Months (1 to 2 Years)
  if (months < 24) {
    return [
      {
        badge: "Nap Transition",
        title: "Dropping from 2 naps to 1 nap",
        query: `What schedule adjustments help ${childName} transition smoothly from two naps down to one afternoon nap?`,
        color: "border-purple-500/30 bg-purple-500/10 text-purple-200 hover:border-purple-400"
      },
      {
        badge: "Speech Explosion",
        title: "First 50 words & language modeling",
        query: `How can I encourage speech milestones and help ${childName} expand beyond single words into simple phrases?`,
        color: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200 hover:border-cyan-400"
      },
      {
        badge: "Big Emotions",
        title: "Calming early tantrums with empathy",
        query: `How do I respond when ${childName} has a frustration tantrum because they cannot communicate what they want?`,
        color: "border-rose-500/30 bg-rose-500/10 text-rose-200 hover:border-rose-400"
      },
      {
        badge: "Toddler Nutrition",
        title: "Picky eating & family table foods",
        query: `How can I ensure ${childName} gets balanced iron and protein from home-cooked Indian family meals?`,
        color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200 hover:border-emerald-400"
      },
      {
        badge: "Boundary Setting",
        title: "Gentle scripts to stop hitting or biting",
        query: `What calm, immediate scripts stop ${childName} from hitting or biting when excited or frustrated?`,
        color: "border-amber-500/30 bg-amber-500/10 text-amber-200 hover:border-amber-400"
      },
      {
        badge: "Physical Activity",
        title: "Steady walking & climbing confidence",
        query: `What safe indoor obstacle activities build balance, coordination, and climbing skills for ${childName}?`,
        color: "border-teal-500/30 bg-teal-500/10 text-teal-200 hover:border-teal-400"
      },
      {
        badge: "Bedtime Routine",
        title: "Soothing bedtime routine without tears",
        query: `How can I create a calming 20-minute bedtime routine that helps ${childName} fall asleep without tears?`,
        color: "border-indigo-500/30 bg-indigo-500/10 text-indigo-200 hover:border-indigo-400"
      },
      {
        badge: "Dental Care",
        title: "Brushing toddler teeth twice daily",
        query: `What playful methods and toothbrush habits make brushing toddler teeth easy and tear-free for ${childName}?`,
        color: "border-blue-500/30 bg-blue-500/10 text-blue-200 hover:border-blue-400"
      },
      {
        badge: "Sensory Play",
        title: "Mess-free sensory & water exploration",
        query: `What simple sensory play ideas with kitchen items keep ${childName} focused and happily exploring?`,
        color: "border-pink-500/30 bg-pink-500/10 text-pink-200 hover:border-pink-400"
      }
    ];
  }

  // 4. Older Toddler: 24 to 47 Months (2 to 4 Years - Ashwath's stage!)
  if (months < 48) {
    return [
      {
        badge: "Big Emotions",
        title: "Respectful scripts for toddler tantrums",
        query: `What calm, respectful scripts work best to de-escalate big emotional tantrums with ${childName}?`,
        color: "border-purple-500/30 bg-purple-500/10 text-purple-200 hover:border-purple-400"
      },
      {
        badge: "Potty Training",
        title: "Potty training readiness & first steps",
        query: `What clear signs show ${childName} is ready for gentle, pressure-free potty training?`,
        color: "border-teal-500/30 bg-teal-500/10 text-teal-200 hover:border-teal-400"
      },
      {
        badge: "Speech & Sentences",
        title: "3-word sentences & storytelling habits",
        query: `What daily conversational questions stimulate 3-word sentences and expressive vocabulary in ${childName}?`,
        color: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200 hover:border-cyan-400"
      },
      {
        badge: "Picky Eating",
        title: "Indian toddler meals & vegetable intake",
        query: `How can I encourage ${childName} to happily eat vegetables and lentils without mealtime battles?`,
        color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200 hover:border-emerald-400"
      },
      {
        badge: "Bedtime Routine",
        title: "Handling bedtime stalling & curtain calls",
        query: `How do I stop bedtime stalling (asking for water, leaving bed, bedtime excuses) with ${childName}?`,
        color: "border-indigo-500/30 bg-indigo-500/10 text-indigo-200 hover:border-indigo-400"
      },
      {
        badge: "Social Skills",
        title: "Parallel play, turn-taking & sharing",
        query: `How do I teach ${childName} gentle turn-taking and playing alongside peers without forced sharing?`,
        color: "border-amber-500/30 bg-amber-500/10 text-amber-200 hover:border-amber-400"
      },
      {
        badge: "Behavior Comparison",
        title: "Sensory meltdown vs boundary testing",
        query: `How can I tell the difference between a sensory meltdown and a boundary-testing tantrum in ${childName}?`,
        color: "border-rose-500/30 bg-rose-500/10 text-rose-200 hover:border-rose-400"
      },
      {
        badge: "Screen Time",
        title: "Screen-free play & outdoor focus",
        query: `What engaging screen-free indoor and playground games keep ${childName} actively occupied?`,
        color: "border-blue-500/30 bg-blue-500/10 text-blue-200 hover:border-blue-400"
      },
      {
        badge: "Independence",
        title: "Self-dressing, shoes & washing hands",
        query: `How can I foster daily independence like washing hands, putting on shoes, and toy cleanup for ${childName}?`,
        color: "border-pink-500/30 bg-pink-500/10 text-pink-200 hover:border-pink-400"
      }
    ];
  }

  // 5. Preschool / Older Child: 4+ Years
  return [
    {
      badge: "Emotional Growth",
      title: "Cooling down anger & deep breathing",
      query: `What fun breathing games help ${childName} learn self-regulation when feeling angry or upset?`,
      color: "border-purple-500/30 bg-purple-500/10 text-purple-200 hover:border-purple-400"
    },
    {
      badge: "Friendships",
      title: "Resolving playground conflict & sharing",
      query: `How can I guide ${childName} through resolving disagreements and building strong friendships at school?`,
      color: "border-teal-500/30 bg-teal-500/10 text-teal-200 hover:border-teal-400"
    },
    {
      badge: "Pre-Writing",
      title: "Pencil grip & scissor cutting games",
      query: `What playful fine motor activities strengthen hand muscles for pencil grip and writing in ${childName}?`,
      color: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200 hover:border-cyan-400"
    },
    {
      badge: "Nighttime Fears",
      title: "Handling fears of dark, shadows & dreams",
      query: `How should I talk to ${childName} when they are scared of monsters, shadows, or bad dreams?`,
      color: "border-indigo-500/30 bg-indigo-500/10 text-indigo-200 hover:border-indigo-400"
    },
    {
      badge: "Healthy Meals",
      title: "Nutritious school lunchbox recipes",
      query: `What quick, wholesome Indian lunchbox recipes will ${childName} happily finish at school?`,
      color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200 hover:border-emerald-400"
    },
    {
      badge: "Focus & Play",
      title: "Building 20-min independent play focus",
      query: `How can I gently cultivate 20+ minutes of focused, creative independent play for ${childName}?`,
      color: "border-amber-500/30 bg-amber-500/10 text-amber-200 hover:border-amber-400"
    },
    {
      badge: "Sibling Harmony",
      title: "Reducing jealousy & fostering teamwork",
      query: `What daily strategies reduce sibling rivalry and help ${childName} feel valued alongside their sibling?`,
      color: "border-rose-500/30 bg-rose-500/10 text-rose-200 hover:border-rose-400"
    },
    {
      badge: "Curiosity",
      title: "Answering relentless 'Why' questions",
      query: `How can I use ${childName}'s endless 'Why' questions to foster curiosity and critical thinking?`,
      color: "border-blue-500/30 bg-blue-500/10 text-blue-200 hover:border-blue-400"
    },
    {
      badge: "Morning Routine",
      title: "Stress-free morning school routine",
      query: `How do I set up a calm morning routine so ${childName} gets ready for school without rushing or stress?`,
      color: "border-pink-500/30 bg-pink-500/10 text-pink-200 hover:border-pink-400"
    }
  ];
};

export const SearchSection: React.FC = () => {
  const { profile, childProfiles, activeChildIndex } = useAuth();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // Scoped to AI Assistant page (defaults to active child or child 1)
  const [pageChildId, setPageChildId] = useState<1 | 2>(() => (activeChildIndex === 2 ? 2 : 1));

  useEffect(() => {
    if (activeChildIndex) {
      setPageChildId(activeChildIndex);
    }
  }, [activeChildIndex]);

  const [query, setQuery] = useState('');
  const [followUpText, setFollowUpText] = useState('');
  const [otherClarificationMap, setOtherClarificationMap] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const followUpInputRef = useRef<HTMLTextAreaElement>(null);
  const searchFormRef = useRef<HTMLDivElement>(null);
  const responseContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Dynamic Child Profile for AI Assistant
  const activeChild = childProfiles.find(cp => cp.id === pageChildId) || childProfiles[0];
  const parentName = profile?.parentName || profile?.firstName || profile?.name || (typeof window !== 'undefined' ? localStorage.getItem('parent_name') : null) || 'Lashmi';
  const childName = activeChild?.name || profile?.babyName || profile?.childName || (pageChildId === 2 ? 'Ananya' : 'Ashwath');
  const childAge = activeChild?.age || profile?.babyAge || (pageChildId === 2 ? '3 Months' : '2 Years 6 Months');

  // Accurate age calculation for stage determination
  const childAgeMonths = useMemo(() => {
    return getChildAgeInMonths(activeChild?.birthDate, childAge, childName, pageChildId);
  }, [activeChild?.birthDate, childAge, childName, pageChildId]);

  const isInfant = childAgeMonths < 12;

  const starterTopics = useMemo(() => {
    return getAgeSpecificTopics(childName, childAge, activeChild?.birthDate, pageChildId);
  }, [childName, childAge, activeChild?.birthDate, pageChildId]);

  // Voice speech-to-text integration
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          if (hasSearched) {
            setFollowUpText(prev => (prev ? `${prev} ${transcript}` : transcript));
          } else {
            setQuery(prev => (prev ? `${prev} ${transcript}` : transcript));
          }
          playSound('pop');
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [hasSearched]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Please use keyboard input.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        playSound('glass');
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  // Auto-run query if coming from another page with initialQuery param
  useEffect(() => {
    const initQ = searchParams.get('initialQuery');
    if (initQ && initQ.trim()) {
      setQuery(initQ);
      handleExecuteQuery(initQ, []);
    }
  }, [searchParams]);

  const handleStartNewTopic = () => {
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

    setTimeout(() => {
      if (searchFormRef.current) {
        searchFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }, 50);
  };

  const handleExecuteQuery = async (userPrompt: string, existingHistory: ChatMessage[]) => {
    const promptText = userPrompt.trim();
    if (!promptText || loading) return;

    playSound('glass');
    setLoading(true);
    setHasSearched(true);
    setQuery('');
    setFollowUpText('');

    const userMessage: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const assistantPlaceholderId = `a_${Date.now()}`;
    const initialAssistantMessage: ChatMessage = {
      id: assistantPlaceholderId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      failedQuery: promptText,
    };

    const newMessagesList = [...existingHistory, userMessage, initialAssistantMessage];
    setMessages(newMessagesList);

    // Scroll to bottom of conversation
    setTimeout(() => {
      responseContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);

    // Responsible AI: Refuse sensitive personal info / credentials
    if (isPersonalInfoQuery(promptText)) {
      const piiNotice = getResponsibleAIRefusal(parentName, childName, childAge);
      setMessages(prev =>
        prev.map(m => m.id === assistantPlaceholderId ? { ...m, content: piiNotice } : m)
      );
      saveAISearchRecord(promptText, piiNotice);
      setLoading(false);
      playSound('pop');
      return;
    }

    // Build multi-turn conversational array for Gemini
    const conversationHistoryForApi = existingHistory
      .filter(m => !m.isError && m.content)
      .map(m => {
        if (m.role === 'assistant') {
          // Keep summary/first 350 chars of previous assistant responses to avoid latency lag while preserving memory
          const trimmed = m.content.length > 350 ? m.content.slice(0, 350) + '...' : m.content;
          return { role: m.role, content: trimmed };
        }
        return { role: m.role, content: m.content };
      });
    conversationHistoryForApi.push({ role: 'user', content: promptText });

    let accumulatedText = '';
    let lastUpdate = 0;
    let updateTimer: any = null;

    const flushTextToState = (text: string) => {
      setMessages(prev =>
        prev.map(m => m.id === assistantPlaceholderId ? { ...m, content: text, isError: false } : m)
      );
    };

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, 15000); // 15-second stream timeout

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortController.signal,
        body: JSON.stringify({
          query: promptText,
          messages: conversationHistoryForApi,
          parentName,
          childName,
          childAge,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`AI service responded with HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let isFirstChunk = true;
      let isHtmlErrorPayload = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        if (chunk) {
          // Detect and discard raw HTML server error pages (504/502 gateway timeouts)
          if (isFirstChunk) {
            const trimmed = chunk.trim().toLowerCase();
            if (trimmed.startsWith('<!doctype') || trimmed.startsWith('<html') || trimmed.startsWith('<head')) {
              isHtmlErrorPayload = true;
              break;
            }
            playSound('pop');
            isFirstChunk = false;
          }

          accumulatedText += chunk;
          
          // Throttled UI update for smooth real-time rendering
          const now = Date.now();
          if (now - lastUpdate > 60) {
            lastUpdate = now;
            flushTextToState(accumulatedText);
          } else if (!updateTimer) {
            updateTimer = setTimeout(() => {
              flushTextToState(accumulatedText);
              updateTimer = null;
            }, 60);
          }
        }
      }

      clearTimeout(timeoutId);
      if (updateTimer) clearTimeout(updateTimer);

      if (isHtmlErrorPayload || !accumulatedText.trim()) {
        throw new Error("Invalid or empty response payload");
      }

      // Synchronously flush the final text so no chunk is ever dropped
      flushTextToState(accumulatedText);

      // Save valid record
      saveAISearchRecord(promptText, accumulatedText);
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (updateTimer) clearTimeout(updateTimer);

      console.warn("AI Assistant streaming interrupted:", err);

      // Render the Smart Retry Card without raw HTML code glitches
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantPlaceholderId
            ? {
                ...m,
                content: '',
                isError: true,
                failedQuery: promptText,
              }
            : m
        )
      );
      playSound('pop');
    } finally {
      clearTimeout(timeoutId);
      if (updateTimer) clearTimeout(updateTimer);
      setLoading(false);
    }
  };

  const handleRetry = (failedQuery?: string) => {
    if (!failedQuery) return;
    // Strip the failed assistant message and re-run
    const cleanHistory = messages.filter(m => !m.isError && m.content);
    // Remove the last user message if it was the failed query
    if (cleanHistory.length > 0 && cleanHistory[cleanHistory.length - 1].content === failedQuery) {
      cleanHistory.pop();
    }
    handleExecuteQuery(failedQuery, cleanHistory);
  };

  return (
    <div className="w-full max-w-full mx-auto py-2 sm:py-4 px-2 sm:px-4 lg:px-6 text-center">
      {/* AI Powered Parenting Header */}
      <div className="flex flex-col items-center justify-center text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-black uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>AI Powered Parenting</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-sans font-black tracking-tight leading-tight px-2">
          <span className="text-white">How can we help </span>
          <span className="italic font-serif bg-gradient-to-r from-teal-300 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
            today?
          </span>
        </h1>

        {/* Child Profile Selector & Session Controls (Scoped to AI Assistant) */}
        <div className="flex flex-col items-center justify-center gap-3 pt-2 w-full max-w-2xl mx-auto">
          <ChildProfileSelector
            selectedChildId={pageChildId}
            onSelectChild={(id) => setPageChildId(id)}
            sectionContextName="AI Assistant"
          />

          {hasSearched && (
            <div className="flex items-center justify-center pt-1">
              <button
                onClick={handleStartNewTopic}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
                title="Start a new conversation topic and reset history"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Topic</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Omnibox (Always Available on Empty State) */}
      {!hasSearched && (
        <div id="ask-ai-search-bar" ref={searchFormRef} className="relative group max-w-4xl mx-auto mb-8 text-left">
          <div className="relative rounded-3xl bg-[#090f1f]/80 border-2 border-indigo-500/30 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/20 transition-all shadow-2xl p-3 sm:p-4 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="text-indigo-400 pt-1.5 shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <textarea
                ref={inputRef}
                rows={2}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (query.trim() && !loading) {
                      handleExecuteQuery(query, []);
                    }
                  }
                }}
                placeholder={
                  isInfant
                    ? `Ask any question about ${childName} (${childAge || '3 Months'}) - e.g. "What is an ideal wake window for a 3-month-old?" or "How to soothe evening colic & trapped gas?"`
                    : `Ask any question about ${childName} (${childAge || '2 yrs 6 mos'}) - e.g. "What calming scripts work best during a public tantrum?" or "Sensory meltdown vs boundary tantrum"`
                }
                className="w-full bg-transparent border-none text-sm sm:text-base md:text-lg text-white focus:outline-none resize-none placeholder:text-slate-500 leading-relaxed min-h-[56px]"
              />
            </div>

            <div className="flex items-center justify-between gap-2.5 pt-3 mt-2 border-t border-white/10">
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                Press <strong>Enter</strong> to submit · <strong>Shift+Enter</strong> for line break
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isListening
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                      : 'bg-white/5 hover:bg-white/15 text-slate-300 border-white/15'
                  }`}
                  title={isListening ? "Listening... click to stop" : "Speak your question"}
                >
                  {isListening ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleExecuteQuery(query, [])}
                  disabled={loading || !query.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 disabled:opacity-40 text-white rounded-xl font-black text-xs sm:text-sm transition-all shadow-lg shadow-indigo-500/25 active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Thinking...</span>
                    </>
                  ) : (
                    <>
                      <span>Ask Tricky Toddlers</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categorized Starter Suggestion Cards (Compact size, text-fitted, 9 age-matched questions) */}
      {!hasSearched && (
        <div className="max-w-5xl mx-auto mb-10 text-left">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5 px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Explore Everyday Topics for {childName} ({childAge})</span>
            </span>
            <span className="text-[11px] font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
              {starterTopics.length} Age-Matched Questions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
            {starterTopics.map((topic, idx) => (
              <motion.button
                key={`${pageChildId}-${idx}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => handleExecuteQuery(topic.query, [])}
                className={`p-2.5 sm:px-3 sm:py-2 rounded-xl border text-left transition-all active:scale-[0.98] hover:scale-[1.01] cursor-pointer shadow-sm group flex items-center justify-between gap-2 ${topic.color} hover:bg-white/[0.08] min-h-[50px]`}
              >
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-black uppercase tracking-wider opacity-75 block truncate">
                    {topic.badge}
                  </span>
                  <div className="text-[11.5px] sm:text-xs font-semibold text-white group-hover:text-indigo-200 transition-colors leading-snug line-clamp-2 mt-0.5">
                    {topic.title}
                  </div>
                </div>
                <div className="w-5 h-5 rounded-md bg-white/10 group-hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors">
                  <ChevronRight className="w-3 h-3 text-white/80 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Multi-Turn Continuous Conversation Feed */}
      <AnimatePresence mode="wait">
        {hasSearched && (
          <motion.div
            ref={responseContainerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl mx-auto text-left space-y-6 mb-8"
          >
            {messages.map((msg, index) => {
              if (msg.role === 'user') {
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-3.5 rounded-3xl rounded-tr-sm shadow-xl border border-indigo-400/20">
                      <div className="flex items-center justify-between gap-3 mb-1 text-[10px] text-indigo-200 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3 h-3" />
                          <span>{parentName}</span>
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="text-sm sm:text-base font-medium leading-relaxed">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                );
              }

              // Assistant Message Turn
              const parsed = parseAIResponse(msg.content);

              return (
                <div key={msg.id} className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20 mt-1">
                    <Sparkles className="w-5 h-5" />
                  </div>

                  <div className="flex-1 bg-[#090f1f]/90 border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                    <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-white/10 text-xs text-slate-400">
                      <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                        <Baby className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Guidance for {childName} ({childAge})</span>
                      </span>
                      <span className="text-[10px]">{msg.timestamp}</span>
                    </div>

                    {/* Loading State */}
                    {!msg.content && loading && !msg.isError && (
                      <div className="flex items-center gap-3 text-indigo-300 py-6 animate-pulse">
                        <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                        <span className="text-sm font-bold">
                          Evaluating developmental guidance for {childName}...
                        </span>
                      </div>
                    )}

                    {/* Smart Retry Card on Interruption/Error (Zero HTML code glitch) */}
                    {msg.isError && (
                      <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-slate-200 space-y-3">
                        <div className="flex items-center gap-2.5 text-rose-300 font-bold text-sm">
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>Connection delay encountered</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          We were unable to complete the response due to a momentary network delay. Tap below to continue smoothly.
                        </p>
                        <button
                          onClick={() => handleRetry(msg.failedQuery)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Retry this question</span>
                        </button>
                      </div>
                    )}

                    {/* Empty Content Fallback (Never show a blank card) */}
                    {!msg.content && !loading && !msg.isError && (
                      <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-slate-200 space-y-3">
                        <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                          <Sparkles className="w-4 h-4 text-indigo-400" />
                          <span>Personalized Guidance for {childName}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          Tap below to load the guidance for this question.
                        </p>
                        <button
                          onClick={() => handleRetry(msg.failedQuery)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Load Guidance Now</span>
                        </button>
                      </div>
                    )}

                    {/* Clean Markdown Response */}
                    {parsed.cleanContent && (
                      <div className="prose prose-invert max-w-none text-slate-200 leading-relaxed font-sans text-sm sm:text-base">
                        <Markdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ children }) => <h1 className="text-lg sm:text-xl font-black text-white mt-4 mb-2 pb-1 border-b border-white/10">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-base sm:text-lg font-bold text-indigo-300 mt-4 mb-2">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-sm sm:text-base font-bold text-emerald-400 mt-3.5 mb-1.5">{children}</h3>,
                            p: ({ children }) => <p className="mb-3 text-slate-200 leading-relaxed">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1.5 text-slate-200">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1.5 text-slate-200">{children}</ol>,
                            li: ({ children }) => <li className="text-slate-200">{children}</li>,
                            strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                            table: ({ children }) => (
                              <div className="overflow-x-auto my-5 rounded-2xl border border-indigo-500/30 bg-[#090f1f]/95 shadow-xl shadow-black/40">
                                <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[540px]">{children}</table>
                              </div>
                            ),
                            thead: ({ children }) => (
                              <thead className="bg-gradient-to-r from-indigo-950/90 via-purple-950/70 to-slate-900/90 border-b border-indigo-500/30">
                                {children}
                              </thead>
                            ),
                            th: ({ children }) => (
                              <th className="p-3.5 sm:p-4 text-indigo-200 font-extrabold text-xs sm:text-sm tracking-wide border-r border-white/10 last:border-r-0">
                                {children}
                              </th>
                            ),
                            tbody: ({ children }) => (
                              <tbody className="divide-y divide-white/10">
                                {children}
                              </tbody>
                            ),
                            tr: ({ children }) => (
                              <tr className="hover:bg-white/[0.04] transition-colors">
                                {children}
                              </tr>
                            ),
                            td: ({ children }) => (
                              <td className="p-3.5 sm:p-4 border-r border-white/10 last:border-r-0 text-slate-200 text-xs sm:text-sm leading-relaxed align-top">
                                {children}
                              </td>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="my-3 p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 italic font-medium">
                                {children}
                              </blockquote>
                            ),
                          }}
                        >
                          {parsed.cleanContent}
                        </Markdown>

                        {loading && index === messages.length - 1 && (
                          <span className="inline-block w-2 h-4 bg-indigo-400 animate-pulse ml-1 align-middle" />
                        )}

                        {/* In-Chat Responsible AI Trust Badges */}
                        {!loading && (
                          <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Verified against IAP Infant Guidelines</span>
                              </span>
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                                <span>WHO &amp; FSSAI Standards</span>
                              </span>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400 text-[10px] font-mono">
                                🔒 Zero Ad Selling · 100% Private
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Ambiguity Clarification Options as Clickable Buttons */}
                    {parsed.clarificationOptions.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-white/10 space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Tap your intended question:</span>
                        </span>

                        {/* Strictly vertical stack: one below the other even if small */}
                        <div className="flex flex-col gap-2.5 w-full">
                          {parsed.clarificationOptions.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => handleExecuteQuery(opt, messages.slice(0, index + 1))}
                              disabled={loading}
                              className="w-full text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 hover:border-amber-400/60 text-amber-100 hover:text-white font-medium text-xs sm:text-sm transition-all shadow-sm flex items-center justify-between gap-3 group active:scale-[0.99] cursor-pointer"
                            >
                              <span className="flex-1 leading-snug">{opt}</span>
                              <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 group-hover:translate-x-1 transition-transform" />
                            </button>
                          ))}
                        </div>

                        {/* Other - text box for parent to write their own question for clarification */}
                        <div className="pt-2 w-full">
                          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#090e1d]/90 border border-amber-400/35 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all shadow-md">
                            <div className="flex items-center gap-2 mb-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                              <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[11px] font-black">
                                Other
                              </span>
                              <span>Write your own question for clarification:</span>
                            </div>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                              <input
                                type="text"
                                value={otherClarificationMap[msg.id] || ''}
                                onChange={(e) => setOtherClarificationMap(prev => ({ ...prev, [msg.id]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const val = (otherClarificationMap[msg.id] || '').trim();
                                    if (val && !loading) {
                                      handleExecuteQuery(val, messages.slice(0, index + 1));
                                      setOtherClarificationMap(prev => ({ ...prev, [msg.id]: '' }));
                                    }
                                  }
                                }}
                                placeholder={`Write your specific clarification or question for ${childName}...`}
                                disabled={loading}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-400/60 transition-colors"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const val = (otherClarificationMap[msg.id] || '').trim();
                                  if (val && !loading) {
                                    handleExecuteQuery(val, messages.slice(0, index + 1));
                                    setOtherClarificationMap(prev => ({ ...prev, [msg.id]: '' }));
                                  }
                                }}
                                disabled={loading || !(otherClarificationMap[msg.id] || '').trim()}
                                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                              >
                                <span>Submit</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Contextual Medical Disclaimer Note */}
                    {parsed.medicalDisclaimer && (
                      <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200/90 flex items-start gap-2">
                        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{parsed.medicalDisclaimer}</span>
                      </div>
                    )}

                    {/* Related Follow-Up Questions (Interactive Chips) */}
                    {parsed.relatedQuestions.length > 0 && !loading && (
                      <div className="mt-6 pt-4 border-t border-white/10 space-y-2.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Related questions parents ask:</span>
                        </span>
                        <div className="flex flex-col gap-2 w-full">
                          {parsed.relatedQuestions.map((qText, qIdx) => (
                            <button
                              key={qIdx}
                              onClick={() => handleExecuteQuery(qText, messages.slice(0, index + 1))}
                              disabled={loading}
                              className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-400/40 text-slate-200 hover:text-white text-xs font-medium transition-all active:scale-[0.99] cursor-pointer shadow-sm flex items-center justify-between gap-2.5 group"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0 group-hover:scale-110 transition-transform" />
                                <span className="leading-snug">{qText}</span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 group-hover:translate-x-1 transition-transform" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Conversation Follow-Up Omnibox (Docked at Bottom of Chat) */}
            <div className="pt-4">
              <div className="relative rounded-3xl bg-[#090f1f]/90 border border-indigo-500/30 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/20 transition-all p-3 sm:p-4 shadow-2xl backdrop-blur-xl">
                <div className="flex items-start gap-3">
                  <div className="text-indigo-400 pt-1.5 shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <textarea
                    ref={followUpInputRef}
                    rows={2}
                    value={followUpText}
                    onChange={(e) => setFollowUpText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (followUpText.trim() && !loading) {
                          handleExecuteQuery(followUpText, messages);
                        }
                      }
                    }}
                    placeholder={`Reply or ask follow-up for ${childName}... (e.g. "What if ${childName} refuses that?" or "How long should I wait?")`}
                    disabled={loading}
                    className="w-full bg-transparent border-none text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none resize-none leading-relaxed min-h-[50px]"
                  />
                </div>

                <div className="flex items-center justify-between gap-2.5 pt-2.5 mt-2 border-t border-white/10">
                  <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                    Conversation remembers context · Press <strong>Enter</strong> to send
                  </span>
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={toggleVoiceInput}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isListening
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                          : 'bg-white/5 hover:bg-white/15 text-slate-300 border-white/15'
                      }`}
                      title={isListening ? "Listening... click to stop" : "Speak reply"}
                    >
                      {isListening ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExecuteQuery(followUpText, messages)}
                      disabled={loading || !followUpText.trim()}
                      className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 disabled:opacity-40 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg shadow-indigo-500/25 active:scale-95 cursor-pointer flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending...</span>
                        </>
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

            {/* Bottom Actions: Clear / New Topic */}
            <div className="flex items-center justify-between pt-2 px-1 text-xs text-slate-400">
              <button
                onClick={handleStartNewTopic}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white font-bold transition-all cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
                <span>Start New Topic</span>
              </button>

              <span className="italic text-[11px] text-slate-400">
                Pediatric guidance aligned with IAP, ICMR-NIN &amp; WHO
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
