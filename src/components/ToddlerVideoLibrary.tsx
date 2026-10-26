import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { isPremiumUser as checkIsPremium } from '../lib/premiumUtils';
import { 
  Play, 
  Lock, 
  Sparkles, 
  Clock, 
  Search, 
  CheckCircle, 
  Bookmark, 
  Share2, 
  Tv, 
  Filter, 
  X, 
  Check, 
  Award, 
  ThumbsUp, 
  Zap, 
  ShieldCheck,
  ChevronRight,
  BookOpen,
  ExternalLink,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  ArrowLeft,
  Home,
  AlertTriangle,
  RefreshCw,
  Film
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import { useLanguage } from '../lib/LanguageContext';
import { 
  speakIndianEnglish, 
  stopIndianSpeech, 
  getAvailableIndianVoices, 
  setSelectedIndianVoice, 
  getSelectedIndianVoiceName 
} from '../lib/indianSpeech';

// Authentic local high-resolution baby assets for 100% topic alignment
import babyPottyChairImg from '../assets/images/baby_potty_chair_1789455703811.jpg';
import babyStackRingsImg from '../assets/images/baby_stack_rings_1789455768371.jpg';
import toddlerCutleryImg from '../assets/images/toddler_cutlery_1789455614797.jpg';
import babySensoryCardImg from '../assets/images/baby_sensory_card_1789455589560.jpg';

export interface ToddlerVideoLibraryProps {
  onGoHome?: () => void;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  expertName: string;
  expertTitle: string;
  youtubeId: string;
  thumbnailUrl: string;
  sampleVideoUrl: string;
  backupVideoUrl?: string;
  isPremium: boolean;
  views: string;
  rating: string;
  keyTakeaways: string[];
}

const CATEGORIES = [
  'All',
  'Sleep & Naps',
  'Tantrums & Discipline',
  'Speech & Language',
  'Potty Training',
  'Play & Activities',
  'Nutrition & Food'
];

const VIDEOS_DATA: VideoItem[] = [
  {
    id: 'v1',
    title: 'Instantly Improve Toddler Sleep: 6 Science-Backed Changes',
    description: 'Pediatric occupational therapist Emma Hubbard breaks down 6 simple, high-impact changes to improve your toddler bedtime routines and sleep quality.',
    category: 'Sleep & Naps',
    duration: '11 min',
    expertName: 'Emma Hubbard',
    expertTitle: 'Pediatric Occupational Therapist',
    youtubeId: 'ZMCk35lloBM',
    thumbnailUrl: 'https://i.ytimg.com/vi/ZMCk35lloBM/hqdefault.jpg',
    sampleVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    backupVideoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    isPremium: false,
    views: '42.5k',
    rating: '4.9',
    keyTakeaways: [
      'Establish predictable sensory wind-down cues 30 minutes before sleep.',
      'Dim overhead lights and eliminate blue screens 1 hour prior to sleep.',
      'Maintain consistent wake windows across weekdays and weekends.'
    ]
  },
  {
    id: 'v2',
    title: "5 Hidden Mistakes Ruining Your Child's Sleep (And How to Fix Them)",
    description: 'Clinical pediatric guidance on subtle bedtime and nap scheduling mistakes that cause midnight wakeups, early rising, and nighttime resistance.',
    category: 'Sleep & Naps',
    duration: '14 min',
    expertName: 'Emma Hubbard',
    expertTitle: 'Pediatric Occupational Therapist',
    youtubeId: 'InjMe5Q1_ks',
    thumbnailUrl: 'https://i.ytimg.com/vi/InjMe5Q1_ks/hqdefault.jpg',
    sampleVideoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    backupVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    isPremium: false,
    views: '88.5k',
    rating: '5.0',
    keyTakeaways: [
      'Spotting and correcting late-afternoon nap timing traps.',
      'Managing room temperature and darkness for optimal melatonin.',
      'Building toddler confidence to self-soothe through night sleep cycles.'
    ]
  },
  {
    id: 'v3',
    title: "How to Handle Toddler Tantrums: Pediatrician's S.E.R.E.N.E. Method",
    description: 'Board-certified pediatrician Dr. Mona Amin explains the step-by-step S.E.R.E.N.E. method to de-escalate toddler tantrums calmly in public and at home without shouting or power struggles.',
    category: 'Tantrums & Discipline',
    duration: '12 min',
    expertName: 'Dr. Mona Amin, MD',
    expertTitle: 'Board-Certified Pediatrician (PedsDocTalk)',
    youtubeId: 'uJnQ5NLKn_c',
    thumbnailUrl: 'https://i.ytimg.com/vi/uJnQ5NLKn_c/hqdefault.jpg',
    sampleVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    backupVideoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    isPremium: false,
    views: '64.1k',
    rating: '4.9',
    keyTakeaways: [
      'The S.E.R.E.N.E. framework: Stay calm, Empathize, Regulate, Evaluate, Name feelings, Encourage.',
      'Lower your physical posture and tone of voice to invite mutual co-regulation.',
      'Avoid logic-heavy lectures or bargaining while the child\'s amygdala is overwhelmed.'
    ]
  },
  {
    id: 'v4',
    title: 'Why Your Toddler Keeps Pushing Boundaries (And Loving Limits That Work)',
    description: 'Understand why toddler boundary-testing is healthy neurological development, and how to hold firm, loving boundaries without yelling or repeating yourself all day.',
    category: 'Tantrums & Discipline',
    duration: '15 min',
    expertName: 'Coach John',
    expertTitle: 'Child Behavior & Parenting Specialist (Whole Parent)',
    youtubeId: '18rbG4cSwsk',
    thumbnailUrl: 'https://i.ytimg.com/vi/18rbG4cSwsk/hqdefault.jpg',
    sampleVideoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    backupVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    isPremium: false,
    views: '51.8k',
    rating: '4.9',
    keyTakeaways: [
      'Boundary-pushing is how toddlers test if their environment is safe and predictable.',
      'Deliver calm, declarative boundaries rather than open-ended questions.',
      'Follow through reliably without emotional guilt or anger.'
    ]
  },
  {
    id: 'v5',
    title: 'Speech Therapy at Home: Helping Toddlers Say Their First Words',
    description: 'Pediatric speech-language pathologist techniques, vocabulary prompts, and play strategies to stimulate verbal communication and first words at home.',
    category: 'Speech & Language',
    duration: '10 min',
    expertName: 'Brooke, SLP',
    expertTitle: 'Pediatric Speech-Language Pathologist (Toddler Speech Therapy)',
    youtubeId: 'GflztJEx1Rs',
    thumbnailUrl: 'https://i.ytimg.com/vi/GflztJEx1Rs/hqdefault.jpg',
    sampleVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    backupVideoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    isPremium: false,
    views: '56.3k',
    rating: '4.9',
    keyTakeaways: [
      'Use high-engagement toys with purposeful pauses (expectant waiting).',
      'Emphasize exclamatory words and action verbs (Uh-oh, Pop, Go, More, Wheee).',
      'Acknowledge and praise all attempts to communicate, including pointing and babble.'
    ]
  },
  {
    id: 'v6',
    title: 'Baby & Toddler Speech Milestones: Language Skills and Parent Tips',
    description: 'Pediatrician overview of normal communication milestones, word counts, receptive vs expressive speech, and actionable daily conversational habits.',
    category: 'Speech & Language',
    duration: '13 min',
    expertName: 'Dr. Mona Amin, MD',
    expertTitle: 'Board-Certified Pediatrician (PedsDocTalk)',
    youtubeId: '6B4IHAXY7hc',
    thumbnailUrl: 'https://i.ytimg.com/vi/6B4IHAXY7hc/hqdefault.jpg',
    sampleVideoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    backupVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    isPremium: false,
    views: '32.4k',
    rating: '5.0',
    keyTakeaways: [
      'Clear benchmarks for 12, 18, and 24-month developmental communication.',
      'Understanding gestures and joint attention as stepping stones to sentences.',
      'Parent narration and expansion techniques that double daily vocabulary exposure.'
    ]
  },
  {
    id: 'v7',
    title: "Potty Training Tips for Toddlers: Pediatrician's Guide to Avoid Mistakes",
    description: 'Pediatrician-backed practical guide to identifying genuine readiness cues, choosing the right potty gear, and avoiding stressful toilet-training traps.',
    category: 'Potty Training',
    duration: '11 min',
    expertName: 'Dr. Mona Amin, MD',
    expertTitle: 'Board-Certified Pediatrician (PedsDocTalk)',
    youtubeId: 'hXAEJJpk_Tk',
    thumbnailUrl: 'https://i.ytimg.com/vi/hXAEJJpk_Tk/hqdefault.jpg',
    sampleVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    backupVideoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    isPremium: false,
    views: '68.2k',
    rating: '4.8',
    keyTakeaways: [
      'Check for 2-hour dry diaper intervals and verbal or gestural interest in the toilet.',
      'Normalize the potty chair with low-pressure routines and favorite books.',
      'Treat accidents as neutral learning moments rather than setbacks.'
    ]
  },
  {
    id: 'v8',
    title: 'Potty Training in Days, Not Weeks: 8 Essential Steps to Fast Success',
    description: 'Pediatric occupational therapist Emma Hubbard walks through 8 evidence-based steps to guide your toddler from diapers to the toilet with confidence.',
    category: 'Potty Training',
    duration: '16 min',
    expertName: 'Emma Hubbard',
    expertTitle: 'Pediatric Occupational Therapist',
    youtubeId: 'FuEOVu6U4CI',
    thumbnailUrl: 'https://i.ytimg.com/vi/FuEOVu6U4CI/hqdefault.jpg',
    sampleVideoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    backupVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    isPremium: false,
    views: '94.6k',
    rating: '4.9',
    keyTakeaways: [
      'Sequential 8-step roadmap from diaper-free prep to daytime independence.',
      'Using ergonomic foot stools to support knees above hips for easy bowel movements.',
      'Overcoming bathroom hesitation without turning training into a power struggle.'
    ]
  },
  {
    id: 'v9',
    title: '8 Fun Sensory Activities to Boost Toddler Development & Motor Skills',
    description: 'Engaging indoor sensory play activities that improve fine motor coordination, sensory regulation, and cognitive problem-solving using simple household materials.',
    category: 'Play & Activities',
    duration: '9 min',
    expertName: 'Harkla Therapy Team',
    expertTitle: 'Sensory Integration Specialists (Harkla)',
    youtubeId: 'fzE52DffTi0',
    thumbnailUrl: 'https://i.ytimg.com/vi/fzE52DffTi0/hqdefault.jpg',
    sampleVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    backupVideoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    isPremium: false,
    views: '38.5k',
    rating: '4.9',
    keyTakeaways: [
      'Proprioceptive heavy-work play (cushion crash pads, log rolls) to calm restless toddlers.',
      'Tactile bins that safely build tactile exploration and hand dexterity.',
      'Indoor balance lines with masking tape that promote vestibular coordination.'
    ]
  },
  {
    id: 'v10',
    title: 'The Top 7 Mistakes That Make Picky Eating Worse (And 7 Simple Fixes)',
    description: 'Pediatric occupational therapist Emma Hubbard explains subtle mealtime mistakes that trigger toddler food refusal and tantrums, and how to fix them calmly.',
    category: 'Nutrition & Food',
    duration: '12 min',
    expertName: 'Emma Hubbard',
    expertTitle: 'Pediatric Occupational Therapist',
    youtubeId: 'pCXF1_f401U',
    thumbnailUrl: 'https://i.ytimg.com/vi/pCXF1_f401U/hqdefault.jpg',
    sampleVideoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    backupVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    isPremium: false,
    views: '79.1k',
    rating: '4.9',
    keyTakeaways: [
      'Avoid short-order cooking which unintentionally reinforces fear of new foods.',
      'Always serve one familiar "safe food" alongside small, non-pressuring tastes of new dishes.',
      'Eliminate mealtime bargaining: curiosity and parental modeling beat pressure every time.'
    ]
  },
  {
    id: 'v11',
    title: 'How to Handle Hitting, Throwing, and Tantrums in Toddlers',
    description: 'Board-certified pediatrician Dr. Mona Amin explains how developing toddler brain impulses trigger physical aggression, and how to stay calm and set protective boundaries without yelling.',
    category: 'Tantrums & Discipline',
    duration: '14 min',
    expertName: 'Dr. Mona Amin, MD',
    expertTitle: 'Board-Certified Pediatrician (PedsDocTalk)',
    youtubeId: '8-GBx2t0w40',
    thumbnailUrl: 'https://i.ytimg.com/vi/8-GBx2t0w40/hqdefault.jpg',
    sampleVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    backupVideoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    isPremium: false,
    views: '52.3k',
    rating: '4.9',
    keyTakeaways: [
      'Recognize that toddler hitting is an impulsive fight-or-flight response, not malicious behavior.',
      'Block hits gently with open palms while keeping your verbal responses concise and neutral.',
      'Teach hands-are-not-for-hitting replacement actions once the child is fully calmed.'
    ]
  },
  {
    id: 'v12',
    title: 'What To Do When Your Child Bites To Actually Get Them to Stop',
    description: 'Pediatric occupational therapist Emma Hubbard details why 1 to 3-year-olds bite, sensory triggers, teething pressure, and exact phrases to stop biting for good.',
    category: 'Tantrums & Discipline',
    duration: '13 min',
    expertName: 'Emma Hubbard',
    expertTitle: 'Pediatric Occupational Therapist',
    youtubeId: '58zhtVKiywU',
    thumbnailUrl: 'https://i.ytimg.com/vi/58zhtVKiywU/hqdefault.jpg',
    sampleVideoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    backupVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    isPremium: false,
    views: '71.0k',
    rating: '5.0',
    keyTakeaways: [
      'Identify if the biting is oral sensory seeking, frustration communication, or overwhelming excitement.',
      'Provide safe chewable alternatives and prompt deep pressure or heavy-work input.',
      'Focus immediate care and attention on the recipient first to avoid accidental reward loops.'
    ]
  },
  {
    id: 'v13',
    title: 'How to Make the 2 to 1 Nap Transition & Set the Right Toddler Sleep Schedule',
    description: 'Step-by-step guidance on identifying readiness cues between 14-20 months, avoiding premature nap drops, and gradually adjusting wake windows to prevent chronic overtiredness.',
    category: 'Sleep & Naps',
    duration: '15 min',
    expertName: 'Slumber and Bloom Team',
    expertTitle: 'Certified Pediatric Sleep Specialists',
    youtubeId: 'xRuLiCFROGw',
    thumbnailUrl: 'https://i.ytimg.com/vi/xRuLiCFROGw/hqdefault.jpg',
    sampleVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    backupVideoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    isPremium: false,
    views: '45.8k',
    rating: '4.8',
    keyTakeaways: [
      'Recognize true 2-to-1 readiness: resisting the afternoon nap consistently for 2+ consecutive weeks.',
      'Shift the morning nap 15 to 30 minutes later every few days until landing near 12:30 PM.',
      'Temporarily move bedtime 30 minutes earlier during the transition month to stave off bedtime meltdowns.'
    ]
  },
  {
    id: 'v14',
    title: 'Speech Delays in Toddlers: Myths, Facts, and When to Get Help',
    description: 'Dr. Mona Amin demystifies late-talking toddlers, explains the difference between receptive and expressive delay, and shares clear red flags that warrant early intervention before age 3.',
    category: 'Speech & Language',
    duration: '16 min',
    expertName: 'Dr. Mona Amin, MD',
    expertTitle: 'Board-Certified Pediatrician (PedsDocTalk)',
    youtubeId: 'xzzSBxkquP4',
    thumbnailUrl: 'https://i.ytimg.com/vi/xzzSBxkquP4/hqdefault.jpg',
    sampleVideoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    backupVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    isPremium: false,
    views: '63.9k',
    rating: '4.9',
    keyTakeaways: [
      'Evaluate receptive language: can your toddler understand instructions even before speaking fluently?',
      'Track non-verbal pointing, waving, and joint attention as foundational communication milestones.',
      'Seek early intervention screening promptly if your child has fewer than 20-50 words by 24 months.'
    ]
  },
  {
    id: 'v15',
    title: 'Child Mispronouncing Words? Speech Therapist Tips for Toddler Speech Clarity',
    description: 'Speech-language pathologist Adrienne shares an easy developmental sound chart and practical play exercises to help toddlers enunciate consonant sounds and improve intelligibility.',
    category: 'Speech & Language',
    duration: '11 min',
    expertName: 'Adrienne, SLP',
    expertTitle: 'Pediatric Speech-Language Pathologist (Learn With Adrienne)',
    youtubeId: 'QfByfNA6CJw',
    thumbnailUrl: 'https://i.ytimg.com/vi/QfByfNA6CJw/hqdefault.jpg',
    sampleVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    backupVideoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    isPremium: false,
    views: '58.4k',
    rating: '4.9',
    keyTakeaways: [
      'Understand natural phonological development: early sounds (p, b, m, d, n) come before blend sounds.',
      'Model the correct pronunciation with exaggerated mouth movements instead of asking the child to repeat.',
      'Use play-based auditory bombardment by repeating targeted sounds naturally in playful songs.'
    ]
  },
  {
    id: 'v16',
    title: 'Is Your Child Withholding Poop? Signs, Causes & Practical Solutions',
    description: 'Jamie Glowacki, author of Oh Crap! Potty Training, explains why toddlers withhold bowel movements, how to address toilet withholding anxiety, and how to relax pelvic floor muscles.',
    category: 'Potty Training',
    duration: '18 min',
    expertName: 'Jamie Glowacki',
    expertTitle: 'Author & Master Potty Training Consultant (Oh Crap!)',
    youtubeId: '8Kc6y6lupeY',
    thumbnailUrl: 'https://i.ytimg.com/vi/8Kc6y6lupeY/hqdefault.jpg',
    sampleVideoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    backupVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    isPremium: false,
    views: '112.5k',
    rating: '4.9',
    keyTakeaways: [
      'Withholding is almost always an involuntary tension reaction to previous pain, fear, or loss of control.',
      'Never force, bribe, or physically restrain a toddler on the potty; remove performance pressure.',
      'Pair hydration and fiber with relaxed physical squatting positions and deep belly-laughing activities.'
    ]
  },
  {
    id: 'v17',
    title: 'Toddler Development Activities (19-24 Months): Coordination, Creativity & Motor Skills',
    description: 'Physical and occupational therapy-approved activities for older toddlers to develop spatial awareness, bilateral coordination, balance, and creative exploratory play at home.',
    category: 'Play & Activities',
    duration: '10 min',
    expertName: 'Pathways Therapy Team',
    expertTitle: 'Pediatric Physical & Occupational Specialists (Pathways)',
    youtubeId: 'PtUMlCmgtTk',
    thumbnailUrl: 'https://i.ytimg.com/vi/PtUMlCmgtTk/hqdefault.jpg',
    sampleVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    backupVideoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    isPremium: false,
    views: '41.2k',
    rating: '4.9',
    keyTakeaways: [
      'Engage in gross motor balance play like stepping over small pillow cushions and tape balance lines.',
      'Practice bilateral coordination tasks like holding a bowl with one hand while stirring with the other.',
      'Encourage stacking and container sorting to strengthen wrist stabilization and visual tracking.'
    ]
  },
  {
    id: 'v18',
    title: 'How to Encourage Independent Play: Tips for Building Creativity & Confidence',
    description: 'Child development specialists demonstrate how to set up invitation-to-play spaces that empower toddlers ages 1 to 3 to focus independently, build grit, and play happily without screen time.',
    category: 'Play & Activities',
    duration: '12 min',
    expertName: 'Pathways Child Development',
    expertTitle: 'Pediatric Early Development Specialists',
    youtubeId: 'BHdXhZpfgT8',
    thumbnailUrl: 'https://i.ytimg.com/vi/BHdXhZpfgT8/hqdefault.jpg',
    sampleVideoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    backupVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    isPremium: false,
    views: '37.8k',
    rating: '4.8',
    keyTakeaways: [
      'Use open-ended toy rotation (3-5 choices accessible) to eliminate choice paralysis and overstimulation.',
      'Sit nearby silently during the first 3 minutes of play to provide emotional anchor before stepping back.',
      'Praise effort and process rather than constantly directing the storyline of their imaginative play.'
    ]
  },
  {
    id: 'v19',
    title: "Your Toddler Won't Feed Themself? (Stop Making This Mistake!)",
    description: 'Pediatric registered dietitian Jill Castle explains why toddlers resist utensils or feeding themselves, and gives proven tips to foster feeding autonomy, utensil grip, and meal enjoyment.',
    category: 'Nutrition & Food',
    duration: '11 min',
    expertName: 'Jill Castle, MS, RDN',
    expertTitle: 'Pediatric Registered Dietitian & Child Nutritionist',
    youtubeId: 'WO_pNv-Zy5s',
    thumbnailUrl: 'https://i.ytimg.com/vi/WO_pNv-Zy5s/hqdefault.jpg',
    sampleVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    backupVideoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    isPremium: false,
    views: '34.6k',
    rating: '4.8',
    keyTakeaways: [
      'Resist hovering or spoon-feeding older toddlers out of concern for speed or cleanliness.',
      'Provide ergonomically curved toddler spoons and suction bowls that provide counter-leverage.',
      'Embrace sensory mess as a critical brain milestone that reduces tactile defensiveness to textures.'
    ]
  },
  {
    id: 'v20',
    title: 'How to Transition Your Baby or Toddler From Bottle to Cup',
    description: 'Pediatrician Dr. Mona Amin shares when and how to transition toddlers from feeding bottles to open cups and straw cups, protecting teeth and encouraging healthy speech muscle development.',
    category: 'Nutrition & Food',
    duration: '13 min',
    expertName: 'Dr. Mona Amin, MD',
    expertTitle: 'Board-Certified Pediatrician (PedsDocTalk)',
    youtubeId: 'zPAu74Bw08U',
    thumbnailUrl: 'https://i.ytimg.com/vi/zPAu74Bw08U/hqdefault.jpg',
    sampleVideoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    backupVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    isPremium: false,
    views: '49.7k',
    rating: '4.9',
    keyTakeaways: [
      'Introduce straw and open cup skills by 12 months to support proper jaw and speech motor mechanics.',
      'Choose gradual weaning: drop the midday bottle first, saving the bedtime or morning bottle for last.',
      'Offer warm milk or water in a favorite colorful cup to establish positive associations with the switch.'
    ]
  }
];

export const ToddlerVideoLibrary: React.FC<ToddlerVideoLibraryProps> = ({ onGoHome }) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isPremiumUser = checkIsPremium(profile);

  // Active Video Modal State
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [useYoutubeEmbed, setUseYoutubeEmbed] = useState<boolean>(true);
  const [videoLoading, setVideoLoading] = useState<boolean>(true);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [activeStreamSource, setActiveStreamSource] = useState<'primary' | 'backup'>('primary');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Saved / Favorited Videos
  const [savedVideoIds, setSavedVideoIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('toddler_tv_saved');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Text to Speech State (Normal Indian Accent English - Gentle & Kid-Friendly)
  const [isSpeakingVideo, setIsSpeakingVideo] = useState<boolean>(false);
  const [speakingCardId, setSpeakingCardId] = useState<string | null>(null);
  const [isTestingVoice, setIsTestingVoice] = useState<boolean>(false);
  const [speechPace, setSpeechPace] = useState<'normal' | 'gentle'>('normal');
  const [currentVoiceName, setCurrentVoiceName] = useState<string>('Normal Indian English');
  const [availableIndianVoices, setAvailableIndianVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Detect and synchronize available Indian English voices on device
  useEffect(() => {
    const updateVoices = () => {
      const voices = getAvailableIndianVoices();
      setAvailableIndianVoices(voices);
      setCurrentVoiceName(getSelectedIndianVoiceName());
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const effectiveRate = speechPace === 'gentle' ? 0.82 : 0.88;

  const handleTestVoice = () => {
    playSound('pop');
    if (isTestingVoice) {
      stopIndianSpeech();
      setIsTestingVoice(false);
      return;
    }

    setIsTestingVoice(true);
    const sampleScript = "Hello! Welcome to Toddler TV. I am speaking in normal, clear Indian English with natural pronunciation so it is very easy for children and parents to understand.";
    speakIndianEnglish(sampleScript, {
      onEnd: () => setIsTestingVoice(false),
      onError: () => setIsTestingVoice(false),
      pitch: 1.0,
      rate: effectiveRate,
    });
  };

  const toggleSpeakVideo = (video: VideoItem) => {
    playSound('pop');
    if (isSpeakingVideo) {
      stopIndianSpeech();
      setIsSpeakingVideo(false);
      return;
    }
    setIsSpeakingVideo(true);
    const cleanTakeaways = video.keyTakeaways.join('. ');
    const speechScript = `${video.title}. Pediatric guide by ${video.expertName}. ${video.description}. Key expert takeaways: ${cleanTakeaways}.`;
    speakIndianEnglish(speechScript, {
      onEnd: () => setIsSpeakingVideo(false),
      onError: () => setIsSpeakingVideo(false),
      pitch: 1.0,
      rate: effectiveRate,
    });
  };

  const handleSpeakCard = (video: VideoItem) => {
    playSound('pop');
    if (speakingCardId === video.id) {
      stopIndianSpeech();
      setSpeakingCardId(null);
      return;
    }
    setSpeakingCardId(video.id);
    const textToSpeak = `${video.title}. By ${video.expertName}. ${video.description}`;
    speakIndianEnglish(textToSpeak, {
      onEnd: () => setSpeakingCardId(null),
      onError: () => setSpeakingCardId(null),
      pitch: 1.0,
      rate: effectiveRate,
    });
  };

  const handleCloseActiveVideo = () => {
    stopIndianSpeech();
    setIsSpeakingVideo(false);
    setIsTestingVoice(false);
    setActiveVideo(null);
    setVideoLoading(false);
    setVideoError(null);
    setIsBuffering(false);
  };

  // Watched History
  const [watchedVideoIds, setWatchedVideoIds] = useState<string[]>(() => {
    try {
      const watched = localStorage.getItem('toddler_tv_watched');
      return watched ? JSON.parse(watched) : [];
    } catch (e) {
      return [];
    }
  });

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('toddler_tv_saved', JSON.stringify(savedVideoIds));
  }, [savedVideoIds]);

  useEffect(() => {
    localStorage.setItem('toddler_tv_watched', JSON.stringify(watchedVideoIds));
  }, [watchedVideoIds]);

  const toggleSaveVideo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('pop');
    setSavedVideoIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleVideoClick = (video: VideoItem) => {
    playSound('click');
    setActiveVideo(video);
    setUseYoutubeEmbed(true);
    setActiveStreamSource('primary');
    setVideoLoading(true);
    setVideoError(null);
    setIsBuffering(false);
    if (!watchedVideoIds.includes(video.id)) {
      setWatchedVideoIds((prev) => [...prev, video.id]);
    }
  };

  const handleToggleStreamType = (toYoutube: boolean) => {
    playSound('click');
    setUseYoutubeEmbed(toYoutube);
    setVideoLoading(true);
    setVideoError(null);
    setIsBuffering(false);
  };

  const handleRetryStream = () => {
    playSound('pop');
    setVideoError(null);
    setVideoLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  };

  const handleSwitchToBackup = () => {
    playSound('pop');
    setActiveStreamSource((prev) => (prev === 'primary' ? 'backup' : 'primary'));
    setVideoError(null);
    setVideoLoading(true);
  };

  // Filter videos based on category and search (all videos are 100% free)
  const filteredVideos = VIDEOS_DATA.filter((video) => {
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    const matchesSearch = 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.expertName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-slate-900/80 border border-purple-500/20 p-6 sm:p-10 mb-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1 min-w-0 pr-0 lg:pr-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-black tracking-wider uppercase mb-3">
              <Tv className="w-4 h-4 text-cheerful-yellow" />
              Toddler TV • Expert Video Library
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
              Pediatric Guidance <span className="bg-gradient-to-r from-cheerful-yellow via-amber-300 to-purple-300 bg-clip-text text-transparent">On Demand</span>
            </h1>
            <p className="text-xs sm:text-sm lg:text-[15px] text-purple-100/80 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
              Bite-sized, evidence-backed video lessons from top pediatric sleep consultants, speech therapists, and child behavior experts.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search video guides, sleep, tantrums, speech, experts..."
              className="w-full bg-white/5 border border-white/15 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-white/35 focus:outline-none focus:border-cheerful-yellow focus:bg-white/[0.08] transition-all font-medium text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 100% Free Video Library Badge */}
          <div className="flex items-center bg-emerald-500/10 border border-emerald-400/30 rounded-2xl px-4 py-2 shrink-0 text-xs font-bold text-emerald-300">
            <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
            <span>100% Free Video Library</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playSound('click');
                setSelectedCategory(cat);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all border shrink-0 ${
                selectedCategory === cat 
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-400 shadow-lg shadow-purple-500/20' 
                  : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      {filteredVideos.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-white/10 my-8">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-white/40">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-white mb-2">No videos found</h3>
          <p className="text-sm text-white/60 max-w-md mx-auto mb-6">
            We couldn't find any videos matching your filter criteria. Try adjusting your search keywords.
          </p>
          <button
            onClick={() => {
              playSound('pop');
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-6 py-3 bg-cheerful-yellow text-black font-black text-sm rounded-2xl shadow-lg hover:scale-105 transition-transform"
          >
            Show All Videos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const isSaved = savedVideoIds.includes(video.id);
            const isWatched = watchedVideoIds.includes(video.id);
            const isLocked = false;

            return (
              <motion.div
                key={video.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => handleVideoClick(video)}
                className="glass-card rounded-3xl overflow-hidden border border-white/10 hover:border-white/25 transition-all duration-300 group cursor-pointer flex flex-col justify-between relative hover:shadow-indigo-500/20"
              >
                <div>
                  {/* Featured Thumbnail Container */}
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80';
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-black/30" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-md border bg-emerald-500/90 text-white border-emerald-400/40">
                        FREE GUIDE
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSpeakCard(video);
                          }}
                          className={`p-2 rounded-full backdrop-blur-md transition-all ${
                            speakingCardId === video.id 
                              ? 'bg-amber-400 text-slate-950 scale-110 shadow-lg animate-pulse' 
                              : 'bg-black/50 text-white/80 hover:text-white hover:bg-black/70'
                          }`}
                          title={speakingCardId === video.id ? "Stop voice" : "Listen in Indian English (Clear & Normal)"}
                        >
                          {speakingCardId === video.id ? (
                            <VolumeX className="w-3.5 h-3.5" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5 text-cheerful-yellow" />
                          )}
                        </button>
                        <button
                          onClick={(e) => toggleSaveVideo(video.id, e)}
                          className={`p-2 rounded-full backdrop-blur-md transition-all ${
                            isSaved 
                              ? 'bg-cheerful-pink text-white scale-110 shadow-lg' 
                              : 'bg-black/40 text-white/70 hover:text-white hover:bg-black/60'
                          }`}
                          title={isSaved ? "Remove bookmark" : "Bookmark video"}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Center Play / Lock Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      {isLocked ? (
                        <div className="w-14 h-14 rounded-full bg-amber-500/90 text-black flex items-center justify-center shadow-2xl backdrop-blur-md group-hover:scale-110 transition-transform border border-amber-300">
                          <Lock className="w-6 h-6 fill-black" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-white/25 hover:bg-white text-white hover:text-black flex items-center justify-center backdrop-blur-md shadow-2xl group-hover:scale-110 transition-all border border-white/40">
                          <Play className="w-6 h-6 fill-current translate-x-0.5" />
                        </div>
                      )}
                    </div>

                    {/* Bottom Metadata */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 text-[11px] font-bold text-white/90">
                      <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                        <Clock className="w-3 h-3 text-cheerful-yellow" />
                        {video.duration}
                      </span>

                      {isWatched && (
                        <span className="flex items-center gap-1 bg-emerald-500/80 text-white px-2.5 py-1 rounded-lg backdrop-blur-md">
                          <CheckCircle className="w-3 h-3" />
                          Watched
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2 text-xs text-cheerful-yellow font-black uppercase tracking-wider">
                      <span>{video.category}</span>
                      <span className="text-white/20">•</span>
                      <span className="text-white/60 text-[11px] font-medium">{video.views} views</span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-cheerful-yellow transition-colors">
                      {video.title}
                    </h3>

                    <p className="text-xs text-white/60 line-clamp-2 mb-4 font-medium leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 pb-5 pt-0 border-t border-white/5 mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2 pt-3">
                    <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs font-black border border-purple-400/30">
                      {video.expertName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{video.expertName}</div>
                      <div className="text-[10px] text-white/40">{video.expertTitle}</div>
                    </div>
                  </div>

                  <div className="pt-3">
                    {isLocked ? (
                      <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                        Unlock <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="text-xs font-black text-white/60 group-hover:text-white transition-colors flex items-center gap-1">
                        Watch <Play className="w-3 h-3 fill-current" />
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full-Page Active Video Player (Zero Dual Scrollbars, Dedicated Theater View) */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950 flex flex-col w-screen h-screen overflow-y-auto"
          >
            {/* Full-Page Header Bar */}
            <div className="sticky top-0 z-40 bg-slate-900/95 border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between backdrop-blur-md">
              <button
                onClick={() => {
                  playSound('pop');
                  handleCloseActiveVideo();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Toddler TV</span>
              </button>

              <div className="flex items-center gap-2.5">
                <span className="hidden sm:inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-black">
                  FREE GUIDE
                </span>
                <span className="text-xs text-white/60 font-bold hidden sm:inline-block">{activeVideo.category}</span>

                {onGoHome && (
                  <button
                    onClick={() => {
                      playSound('pop');
                      handleCloseActiveVideo();
                      onGoHome();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 flex items-center gap-1.5 shadow-md active:scale-95"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Home</span>
                  </button>
                )}

                <a
                  href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                  title="Watch on YouTube"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">YouTube</span>
                </a>

                <button
                  onClick={() => {
                    playSound('pop');
                    handleCloseActiveVideo();
                  }}
                  className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all active:scale-95"
                  title="Close and return to Toddler TV"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Video Body (Max-width Theater Container) */}
            <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Responsive Video Container */}
              <div className="relative aspect-video bg-black w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/15">
                {useYoutubeEmbed ? (
                  <>
                    {videoLoading && (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
                        <div className="w-10 h-10 border-4 border-cheerful-yellow border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm font-bold text-white/90">Connecting to YouTube Stream...</span>
                      </div>
                    )}
                    <iframe
                      src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&enablejsapi=1`}
                      title={activeVideo.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onLoad={() => setVideoLoading(false)}
                    />
                  </>
                ) : (
                  <>
                    {/* Video loading spinner overlay */}
                    {videoLoading && !videoError && (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
                        <div className="w-10 h-10 border-4 border-cheerful-yellow border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm font-bold text-white/90">Loading video playback...</span>
                        <span className="text-xs text-white/50">High-definition educational media</span>
                      </div>
                    )}

                    {/* Buffering overlay */}
                    {isBuffering && !videoLoading && !videoError && (
                      <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full z-20 flex items-center gap-2 border border-white/10">
                        <div className="w-3.5 h-3.5 border-2 border-cheerful-yellow border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-bold text-white/80">Buffering...</span>
                      </div>
                    )}

                    {/* Video playback error state */}
                    {videoError ? (
                      <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-6 text-center z-20">
                        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4 shadow-lg">
                          <AlertTriangle className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-black text-white mb-1.5">Stream Playback Notice</h3>
                        <p className="text-xs text-white/70 max-w-md mb-6 leading-relaxed">
                          {videoError}
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                          <button
                            onClick={handleRetryStream}
                            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all border border-white/10 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Retry Stream
                          </button>
                          {activeVideo.backupVideoUrl && (
                            <button
                              onClick={handleSwitchToBackup}
                              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                            >
                              <Film className="w-3.5 h-3.5" />
                              Try Alternate Stream
                            </button>
                          )}
                          <button
                            onClick={() => handleToggleStreamType(true)}
                            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Switch to YouTube
                          </button>
                        </div>
                      </div>
                    ) : (
                      <video
                        ref={videoRef}
                        key={`${activeVideo.id}-${activeStreamSource}`}
                        src={activeStreamSource === 'primary' ? activeVideo.sampleVideoUrl : (activeVideo.backupVideoUrl || activeVideo.sampleVideoUrl)}
                        poster={activeVideo.thumbnailUrl}
                        controls
                        autoPlay
                        playsInline
                        preload="metadata"
                        onLoadStart={() => setVideoLoading(true)}
                        onLoadedData={() => {
                          setVideoLoading(false);
                          setVideoError(null);
                        }}
                        onCanPlay={() => setVideoLoading(false)}
                        onPlaying={() => {
                          setVideoLoading(false);
                          setIsBuffering(false);
                        }}
                        onWaiting={() => setIsBuffering(true)}
                        onError={(e) => {
                          console.warn('Direct video stream encountered issue:', e);
                          if (activeStreamSource === 'primary' && activeVideo.backupVideoUrl) {
                            setActiveStreamSource('backup');
                            setVideoLoading(true);
                          } else {
                            setVideoLoading(false);
                            setVideoError('Unable to play direct stream on this device. You can retry, switch to alternate feed, or watch on YouTube.');
                          }
                        }}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </>
                )}
              </div>

              {/* Video Info Section */}
              <div className="bg-slate-900/80 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-5 backdrop-blur-md">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight mb-2">
                      {activeVideo.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-white/60 font-medium">
                      <span className="flex items-center gap-1.5 text-white/90 font-bold">
                        <Award className="w-4 h-4 text-cheerful-yellow" />
                        {activeVideo.expertName} ({activeVideo.expertTitle})
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cheerful-yellow" />
                        {activeVideo.duration}
                      </span>
                      <span>•</span>
                      <span>{activeVideo.views} views</span>
                      {!useYoutubeEmbed && (
                        <>
                          <span>•</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/10 text-white/80 font-mono">
                            {activeStreamSource === 'primary' ? 'Feed: Primary HD' : 'Feed: Alternate HD'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white/5 border border-white/10 p-1 rounded-xl">
                      <button
                        onClick={() => handleToggleStreamType(false)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          !useYoutubeEmbed 
                            ? 'bg-purple-600 text-white shadow-sm' 
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Film className="w-3.5 h-3.5" />
                        <span>Direct Stream</span>
                      </button>
                      <button
                        onClick={() => handleToggleStreamType(true)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          useYoutubeEmbed 
                            ? 'bg-red-600 text-white shadow-sm' 
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>YouTube</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSpeakVideo(activeVideo)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSpeakingVideo 
                          ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse' 
                          : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                      }`}
                      title="Listen to lesson summary in Indian English"
                    >
                      {isSpeakingVideo ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cheerful-yellow" />}
                      <span>{isSpeakingVideo ? 'Stop Audio' : 'Audio Guide'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-medium bg-white/[0.03] p-4 rounded-xl border border-white/5">
                  {activeVideo.description}
                </p>

                {/* Key Takeaways */}
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cheerful-yellow" />
                    Key Expert Takeaways
                  </h4>
                  <ul className="space-y-2.5">
                    {activeVideo.keyTakeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/80 font-medium">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Back Button */}
                <div className="pt-4 border-t border-white/10 flex justify-start">
                  <button
                    onClick={() => {
                      playSound('pop');
                      handleCloseActiveVideo();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Toddler TV Library</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
