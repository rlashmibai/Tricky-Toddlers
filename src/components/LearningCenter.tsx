import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, Palette, Keyboard, Hash, Delete, RefreshCw,
  Plus, Minus, Equal, Eraser, Sparkles, Cookie, Heart, Smile,
  Trophy, Check, BookOpen, Bath, Moon, Sun, Clock, LockKeyhole, ArrowRight, Volume2, VolumeX
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import { isVoiceMuted, setVoiceMuted, toggleVoiceMute, speakIndianEnglish } from '../lib/indianSpeech';
import { ToddlerEmotionsSection } from './ToddlerEmotionsSection';
import { ToddlerBodyPartsSection } from './ToddlerBodyPartsSection';
import { ToddlerShapesSection } from './ToddlerShapesSection';
import { ToddlerAnimalSoundsSection } from './ToddlerAnimalSoundsSection';

const COLORS = [
  { name: 'Pink', bg: 'bg-cheerful-pink', border: 'border-cheerful-pink/40', glow: 'shadow-cheerful-pink/20' },
  { name: 'Yellow', bg: 'bg-cheerful-yellow', border: 'border-cheerful-yellow/40', glow: 'shadow-cheerful-yellow/20' },
  { name: 'Blue', bg: 'bg-cheerful-blue', border: 'border-cheerful-blue/40', glow: 'shadow-cheerful-blue/20' },
  { name: 'Green', bg: 'bg-cheerful-green', border: 'border-cheerful-green/40', glow: 'shadow-cheerful-green/20' },
  { name: 'Indigo', bg: 'bg-indigo-500', border: 'border-indigo-500/40', glow: 'shadow-indigo-500/20' },
];

const ALPHABET_ROWS = [
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
  ['J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'],
  ['S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
];

const COLOR_CHART = [
  { name: 'Red', class: 'bg-red-500', border: 'border-red-500/40', glow: 'shadow-red-500/20' },
  { name: 'Orange', class: 'bg-orange-500', border: 'border-orange-500/40', glow: 'shadow-orange-500/20' },
  { name: 'Yellow', class: 'bg-yellow-400', border: 'border-yellow-400/40', glow: 'shadow-yellow-400/20' },
  { name: 'Green', class: 'bg-green-500', border: 'border-green-500/40', glow: 'shadow-green-500/20' },
  { name: 'Blue', class: 'bg-blue-500', border: 'border-blue-500/40', glow: 'shadow-blue-500/20' },
  { name: 'Purple', class: 'bg-purple-500', border: 'border-purple-500/40', glow: 'shadow-purple-500/20' },
  { name: 'Pink', class: 'bg-cheerful-pink', border: 'border-cheerful-pink/40', glow: 'shadow-cheerful-pink/20' },
  { name: 'Brown', class: 'bg-[#8B4513]', border: 'border-[#8B4513]/40', glow: 'shadow-[#8B4513]/20' },
  { name: 'Black', class: 'bg-black', border: 'border-white/20', glow: 'shadow-white/5' },
  { name: 'White', class: 'bg-white', border: 'border-white/40', glow: 'shadow-white/20' },
];

const MIX_LOGIC: { [key: string]: string } = {
  // Primary & Secondary
  'Red+Yellow': 'Orange',
  'Yellow+Red': 'Orange',
  'Red+Blue': 'Purple',
  'Blue+Red': 'Purple',
  'Blue+Yellow': 'Green',
  'Yellow+Blue': 'Green',
  
  // Tertiaries
  'Yellow+Orange': 'Amber',
  'Orange+Yellow': 'Amber',
  'Red+Orange': 'Vermilion',
  'Orange+Red': 'Vermilion',
  'Red+Purple': 'Magenta',
  'Purple+Red': 'Magenta',
  'Blue+Purple': 'Violet',
  'Purple+Blue': 'Violet',
  'Blue+Green': 'Teal',
  'Green+Blue': 'Teal',
  'Yellow+Green': 'Chartreuse',
  'Green+Yellow': 'Chartreuse',

  // Shades & Tints (White/Black)
  'Red+White': 'Rose',
  'White+Red': 'Rose',
  'Red+Black': 'Maroon',
  'Black+Red': 'Maroon',
  'Purple+White': 'Lavender',
  'White+Purple': 'Lavender',
  'Purple+Black': 'Plum',
  'Black+Purple': 'Plum',
  'Blue+White': 'Sky Blue',
  'White+Blue': 'Sky Blue',
  'Blue+Black': 'Navy',
  'Black+Blue': 'Navy',
  'Green+White': 'Mint',
  'White+Green': 'Mint',
  'Green+Black': 'Dark Green',
  'Black+Green': 'Dark Green',
  'Black+White': 'Gray',
  'White+Black': 'Gray',

  // Complex & Requested Mixes
  'Blue+Green+White': 'Turquoise',
  'Green+Blue+White': 'Turquoise',
  'Blue+White+Black': 'Slate',
  'Yellow+Brown': 'Mustard',
  'Brown+Yellow': 'Mustard',
  'Red+Brown': 'Brick',
  'Brown+Red': 'Brick',
  'Orange+Brown': 'Rust',
  'Brown+Orange': 'Rust',
  'Green+Brown': 'Olive',
  'Brown+Green': 'Olive',
  'Purple+Pink': 'Fuchsia',
  'Pink+Purple': 'Fuchsia',
};

const COLOR_QUESTS = [
  { id: 1, color1: 'Red', color2: 'Yellow', target: 'Orange', text: 'Mix Orange! 🍊', desc: 'Can you mix Red and Yellow together?' },
  { id: 2, color1: 'Blue', color2: 'Yellow', target: 'Green', text: 'Mix Green! 🌿', desc: 'Can you mix Blue and Yellow together?' },
  { id: 3, color1: 'Red', color2: 'Blue', target: 'Purple', text: 'Mix Purple! 🍇', desc: 'Can you mix Red and Blue together?' },
  { id: 4, color1: 'Red', color2: 'White', target: 'Rose', text: 'Mix Rose Pink! 🌸', desc: 'Can you mix Red and White together?' },
  { id: 5, color1: 'Blue', color2: 'White', target: 'Sky Blue', text: 'Mix Sky Blue! ☁️', desc: 'Can you mix Blue and White together?' },
  { id: 6, color1: 'Black', color2: 'White', target: 'Gray', text: 'Mix Gray! 🐨', desc: 'Can you mix Black and White together?' },
];

const FIRST_WORDS = [
  { word: 'CAT', emoji: '🐱', color: 'bg-orange-500/10 border-orange-500/20 text-orange-400 font-black' },
  { word: 'DOG', emoji: '🐶', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500 font-black' },
  { word: 'DINO', emoji: '🦖', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-black' },
  { word: 'SUN', emoji: '☀️', color: 'bg-amber-400/10 border-amber-400/20 text-amber-400 font-black' },
  { word: 'BALLOON', emoji: '🎈', color: 'bg-rose-500/10 border-rose-500/20 text-rose-500 font-black' },
  { word: 'CAR', emoji: '🚗', color: 'bg-red-500/10 border-red-500/20 text-red-500 font-black' },
  { word: 'COOKIE', emoji: '🍪', color: 'bg-amber-600/10 border-amber-600/20 text-amber-600 font-black' },
  { word: 'APPLE', emoji: '🍎', color: 'bg-red-400/10 border-red-400/20 text-red-400 font-black' },
  { word: 'CROWN', emoji: '👑', color: 'bg-yellow-400/10 border-yellow-400/20 text-[#FFD700] font-black' },
  { word: 'HOME', emoji: '🏠', color: 'bg-indigo-400/10 border-indigo-400/20 text-indigo-400 font-black' },
  { word: 'DUCK', emoji: '🦆', color: 'bg-yellow-300/10 border-yellow-300/20 text-yellow-300 font-black' },
  { word: 'FROG', emoji: '🐸', color: 'bg-green-400/10 border-green-400/20 text-green-400 font-black' },
  { word: 'FISH', emoji: '🐟', color: 'bg-blue-400/10 border-blue-400/20 text-blue-400 font-black' },
  { word: 'BIRD', emoji: '🐦', color: 'bg-sky-450/10 border-sky-450/20 text-sky-450 font-black' },
  { word: 'CAKE', emoji: '🍰', color: 'bg-pink-400/10 border-pink-400/20 text-pink-400 font-black' },
  { word: 'FLOWER', emoji: '🌸', color: 'bg-pink-300/10 border-pink-300/20 text-pink-300 font-black' },
  { word: 'STAR', emoji: '⭐', color: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-500 font-black' },
  { word: 'MOON', emoji: '🌙', color: 'bg-indigo-300/10 border-indigo-300/20 text-indigo-300 font-black' },
  { word: 'TREE', emoji: '🌳', color: 'bg-emerald-600/10 border-emerald-600/20 text-emerald-600 font-black' },
  { word: 'TRAIN', emoji: '🚂', color: 'bg-zinc-400/10 border-zinc-400/20 text-zinc-400 font-black' },
  { word: 'BOAT', emoji: '⛵', color: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 font-black' },
  { word: 'BABY', emoji: '👶', color: 'bg-orange-300/10 border-orange-300/20 text-orange-300 font-black' },
  { word: 'MILK', emoji: '🥛', color: 'bg-slate-300/10 border-slate-300/20 text-slate-300 font-black' },
  { word: 'BALL', emoji: '⚽', color: 'bg-neutral-300/10 border-neutral-300/20 text-neutral-300 font-black' },
  { word: 'BOOK', emoji: '📖', color: 'bg-teal-400/10 border-teal-400/20 text-teal-400 font-black' },
];

const ROUTINES: any[] = [];
/*
  // Morning Routines (10 items)
  {
    id: 'wake',
    name: 'Wake & Stretch',
    emoji: '🌅',
    icon: 'Sun',
    desc: 'Good morning, sweet child! Stretch up high!',
    colorClass: 'from-yellow-500/10 to-yellow-500/5 border-yellow-500/20 text-yellow-400',
    indicatorColor: 'bg-cheerful-yellow',
    glowClass: 'shadow-cheerful-yellow/20',
    time: 'morning',
  },
  {
    id: 'morning_teeth',
    name: 'Brush Teeth',
    emoji: '🪥',
    icon: 'Sparkles',
    desc: 'Fresh breath and bright smiles for a fun day!',
    colorClass: 'from-pink-500/10 to-pink-500/5 border-pink-500/20 text-pink-400',
    indicatorColor: 'bg-cheerful-pink',
    glowClass: 'shadow-cheerful-pink/20',
    time: 'morning',
  },
  {
    id: 'wash_face',
    name: 'Wash Face',
    emoji: '🧼',
    icon: 'Bath',
    desc: 'Splash cool water to feel awake and happy!',
    colorClass: 'from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-400',
    indicatorColor: 'bg-cheerful-blue',
    glowClass: 'shadow-cheerful-blue/20',
    time: 'morning',
  },
  {
    id: 'clothes',
    name: 'Get Dressed',
    emoji: '👟',
    icon: 'Star',
    desc: 'Put on your favorite outfit for today.',
    colorClass: 'from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-400',
    indicatorColor: 'bg-cheerful-blue',
    glowClass: 'shadow-cheerful-blue/20',
    time: 'morning',
  },
  {
    id: 'comb_hair',
    name: 'Comb Hair',
    emoji: '💇',
    icon: 'Smile',
    desc: 'Brush your hair to look neat and tidy.',
    colorClass: 'from-purple-500/10 to-purple-500/5 border-purple-500/20 text-purple-400',
    indicatorColor: 'bg-indigo-500',
    glowClass: 'shadow-indigo-500/20',
    time: 'morning',
  },
  {
    id: 'breakfast',
    name: 'Yummy Breakfast',
    emoji: '🥞',
    icon: 'Cookie',
    desc: 'Fuel up with a yummy, healthy morning meal.',
    colorClass: 'from-orange-500/10 to-orange-500/5 border-orange-500/20 text-orange-400',
    indicatorColor: 'bg-orange-500',
    glowClass: 'shadow-orange-500/20',
    time: 'morning',
  },
  {
    id: 'make_bed',
    name: 'Make Bed',
    emoji: '🛏️',
    icon: 'Star',
    desc: 'Pull up your sheets and tuck in your pillow.',
    colorClass: 'from-green-500/10 to-green-500/5 border-green-500/20 text-green-400',
    indicatorColor: 'bg-cheerful-green',
    glowClass: 'shadow-cheerful-green/20',
    time: 'morning',
  },
  {
    id: 'pack_backpack',
    name: 'Pack Backpack',
    emoji: '🎒',
    icon: 'BookOpen',
    desc: 'Put your books or toys inside your bag.',
    colorClass: 'from-indigo-500/10 to-indigo-500/5 border-indigo-500/20 text-indigo-400',
    indicatorColor: 'bg-indigo-600',
    glowClass: 'shadow-indigo-600/20',
    time: 'morning',
  },
  {
    id: 'shoes_on',
    name: 'Shoes On',
    emoji: '👞',
    icon: 'Smile',
    desc: 'Tie or strap your shoes to step out of the door!',
    colorClass: 'from-yellow-500/10 to-yellow-500/5 border-yellow-500/20 text-yellow-450',
    indicatorColor: 'bg-cheerful-yellow',
    glowClass: 'shadow-cheerful-yellow/20',
    time: 'morning',
  },
  {
    id: 'morning_hug',
    name: 'Good Morning Hug',
    emoji: '🫂',
    icon: 'Heart',
    desc: 'Give a warm hug to start the day with love!',
    colorClass: 'from-pink-500/10 to-pink-500/5 border-pink-500/20 text-pink-400',
    indicatorColor: 'bg-cheerful-pink',
    glowClass: 'shadow-cheerful-pink/20',
    time: 'morning',
  },

  // Evening Routines (10 items)
  {
    id: 'tidy_toys',
    name: 'Tidy Up Toys',
    emoji: '🧸',
    icon: 'Star',
    desc: 'Clean up toys and put them back in the chest.',
    colorClass: 'from-green-500/10 to-green-500/5 border-green-500/20 text-green-400',
    indicatorColor: 'bg-cheerful-green',
    glowClass: 'shadow-cheerful-green/20',
    time: 'evening',
  },
  {
    id: 'wash_hands',
    name: 'Wash Hands',
    emoji: '🧼',
    icon: 'Sparkles',
    desc: 'Wash off the play dust after a wonderful day!',
    colorClass: 'from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-400',
    indicatorColor: 'bg-cheerful-blue',
    glowClass: 'shadow-cheerful-blue/20',
    time: 'evening',
  },
  {
    id: 'drink_water',
    name: 'Drink Water',
    emoji: '🥛',
    icon: 'Bath',
    desc: 'Stay hydrated with a refreshing cup of water.',
    colorClass: 'from-sky-500/10 to-sky-500/5 border-sky-500/20 text-sky-450',
    indicatorColor: 'bg-sky-400',
    glowClass: 'shadow-sky-400/20',
    time: 'evening',
  },
  {
    id: 'evening_dinner',
    name: 'Yummy Dinner',
    emoji: '🍲',
    icon: 'Cookie',
    desc: 'Enjoy a tasty family meal to refuel.',
    colorClass: 'from-orange-500/10 to-orange-500/5 border-orange-500/20 text-orange-400',
    indicatorColor: 'bg-orange-500',
    glowClass: 'shadow-orange-500/20',
    time: 'evening',
  },
  {
    id: 'put_shoes',
    name: 'Put Away Shoes',
    emoji: '👟',
    icon: 'Smile',
    desc: 'Place your shoes side-by-side by the door.',
    colorClass: 'from-purple-500/10 to-purple-500/5 border-purple-500/20 text-purple-400',
    indicatorColor: 'bg-indigo-500',
    glowClass: 'shadow-indigo-500/20',
    time: 'evening',
  },
  {
    id: 'evening_stretch',
    name: 'Evening Stretch',
    emoji: '🧘',
    icon: 'Sun',
    desc: 'Do some gentle stretches to relax your body.',
    colorClass: 'from-yellow-500/10 to-yellow-500/5 border-yellow-500/20 text-yellow-400',
    indicatorColor: 'bg-cheerful-yellow',
    glowClass: 'shadow-cheerful-yellow/20',
    time: 'evening',
  },
  {
    id: 'choose_clothes',
    name: 'Pick Clothes',
    emoji: '👕',
    icon: 'Star',
    desc: 'Pick out your favorite outfit for tomorrow.',
    colorClass: 'from-pink-500/10 to-pink-500/5 border-pink-500/20 text-pink-400',
    indicatorColor: 'bg-cheerful-pink',
    glowClass: 'shadow-cheerful-pink/20',
    time: 'evening',
  },
  {
    id: 'feed_pet',
    name: 'Feed Pet',
    emoji: '🐱',
    icon: 'Smile',
    desc: 'Give food or water to our friendly pet.',
    colorClass: 'from-amber-500/10 to-amber-500/5 border-amber-500/20 text-amber-500',
    indicatorColor: 'bg-amber-600',
    glowClass: 'shadow-amber-600/20',
    time: 'evening',
  },
  {
    id: 'wipe_table',
    name: 'Help Clean Up',
    emoji: '🧹',
    icon: 'Sparkles',
    desc: 'Help clean up after dinner with a soft cloth.',
    colorClass: 'from-teal-500/10 to-teal-500/5 border-teal-500/20 text-teal-400',
    indicatorColor: 'bg-teal-500',
    glowClass: 'shadow-teal-500/20',
    time: 'evening',
  },
  {
    id: 'say_thanks',
    name: 'Say Thank You',
    emoji: '🙏',
    icon: 'Heart',
    desc: 'Reflect on one happy thing that happened today!',
    colorClass: 'from-red-500/10 to-red-500/5 border-red-500/20 text-red-400',
    indicatorColor: 'bg-rose-500',
    glowClass: 'shadow-rose-500/20',
    time: 'evening',
  },

  // Bedtime/Night Routines (10 items)
  {
    id: 'bath',
    name: 'Bath Time',
    emoji: '🛁',
    icon: 'Bath',
    desc: 'Splash splash! Time to get clean and bubbly.',
    colorClass: 'from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-400',
    indicatorColor: 'bg-cheerful-blue',
    glowClass: 'shadow-cheerful-blue/20',
    time: 'bedtime',
  },
  {
    id: 'teeth',
    name: 'Brush Teeth',
    emoji: '🪥',
    icon: 'Sparkles',
    desc: 'Brush your shiny teeth till they sparkle!',
    colorClass: 'from-pink-500/10 to-pink-500/5 border-pink-500/20 text-pink-400',
    indicatorColor: 'bg-cheerful-pink',
    glowClass: 'shadow-cheerful-pink/20',
    time: 'bedtime',
  },
  {
    id: 'potty',
    name: 'Go to Potty',
    emoji: '🚽',
    icon: 'Smile',
    desc: 'Use the bathroom before climbing into bed.',
    colorClass: 'from-yellow-500/10 to-yellow-500/5 border-yellow-500/20 text-yellow-400',
    indicatorColor: 'bg-cheerful-yellow',
    glowClass: 'shadow-cheerful-yellow/20',
    time: 'bedtime',
  },
  {
    id: 'pajamas',
    name: 'Put on Pajamas',
    emoji: '👕',
    icon: 'Star',
    desc: 'Get cozy in your favorite evening pajamas.',
    colorClass: 'from-purple-500/10 to-purple-500/5 border-purple-500/20 text-purple-400',
    indicatorColor: 'bg-indigo-500',
    glowClass: 'shadow-indigo-500/20',
    time: 'bedtime',
  },
  {
    id: 'warm_milk',
    name: 'Warm Drink',
    emoji: '🥛',
    icon: 'Cookie',
    desc: 'Sip a soothing cup of warm milk or water.',
    colorClass: 'from-slate-400/10 to-slate-400/5 border-slate-400/20 text-slate-300',
    indicatorColor: 'bg-slate-400',
    glowClass: 'shadow-slate-400/20',
    time: 'bedtime',
  },
  {
    id: 'dim_lights',
    name: 'Dim the Lights',
    emoji: '💡',
    icon: 'Clock',
    desc: 'Turn on the soft nightlight and say goodnight.',
    colorClass: 'from-amber-500/10 to-amber-500/5 border-amber-500/15 text-amber-400',
    indicatorColor: 'bg-amber-500',
    glowClass: 'shadow-amber-500/20',
    time: 'bedtime',
  },
  {
    id: 'story',
    name: 'Story Time',
    emoji: '📚',
    icon: 'BookOpen',
    desc: 'Snuggle up for a wonderful bedtime story.',
    colorClass: 'from-green-500/10 to-green-500/5 border-green-500/20 text-green-400',
    indicatorColor: 'bg-cheerful-green',
    glowClass: 'shadow-cheerful-green/20',
    time: 'bedtime',
  },
  {
    id: 'sing_lullaby',
    name: 'Sing Lullaby',
    emoji: '🎵',
    icon: 'Heart',
    desc: 'Listen to a soft evening song together.',
    colorClass: 'from-red-500/10 to-red-500/5 border-red-500/20 text-red-400',
    indicatorColor: 'bg-rose-500',
    glowClass: 'shadow-rose-500/20',
    time: 'bedtime',
  },
  {
    id: 'tuck_in',
    name: 'Tucked In Tight',
    emoji: '🛌',
    icon: 'Smile',
    desc: 'Snuggle under cozy blankets with a favorite toy.',
    colorClass: 'from-sky-500/10 to-sky-500/5 border-sky-500/20 text-sky-400',
    indicatorColor: 'bg-sky-500',
    glowClass: 'shadow-sky-500/20',
    time: 'bedtime',
  },
  {
    id: 'bed',
    name: 'Sleep Time',
    emoji: '😴',
    icon: 'Moon',
    desc: 'Close your eyes. Perfect dreams are waiting.',
    colorClass: 'from-indigo-500/10 to-indigo-500/5 border-indigo-500/20 text-indigo-400',
    indicatorColor: 'bg-indigo-600',
    glowClass: 'shadow-indigo-600/20',
    time: 'bedtime',
  },
];
*/

export const LearningCenter: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const activePlan = profile?.plan || localStorage.getItem('user_plan') || 'free';
  const isPremium = true; // Always unlocked for demo as requested

  // Voice toggle state (persisted across sessions)
  const [isMuted, setIsMuted] = useState<boolean>(() => isVoiceMuted());

  useEffect(() => {
    const handleVoiceToggle = (e: any) => {
      setIsMuted(Boolean(e.detail?.muted));
    };
    window.addEventListener('toddler_voice_toggle', handleVoiceToggle);
    return () => window.removeEventListener('toddler_voice_toggle', handleVoiceToggle);
  }, []);

  const handleToggleVoice = () => {
    playSound('pop');
    const next = toggleVoiceMute();
    setIsMuted(next);
    if (!next) {
      setTimeout(() => {
        speakIndianEnglish('Voice enabled! Ready to learn together.');
      }, 100);
    }
  };

  const [activeMode, setActiveMode] = useState<
    'numbers' | 'counting' | 'words' | 'alphabet' | 'colors' | 'emotions' | 'bodyparts' | 'shapes' | 'animals'
  >('numbers');
  const [numberColors, setNumberColors] = useState<number[]>(new Array(10).fill(0));
  const [sentence, setSentence] = useState('');
  const [keyColorIndex, setKeyColorIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  // Calculator State
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  // Count-With-Me State (Toddler Academy #1)
  const [selectedObject, setSelectedObject] = useState<'star' | 'cookie' | 'heart' | 'smile'>('star');
  const [countedIndices, setCountedIndices] = useState<number[]>([]);

  // Color Mix State
  const [mix1, setMix1] = useState<typeof COLOR_CHART[0] | null>(null);
  const [mix2, setMix2] = useState<typeof COLOR_CHART[0] | null>(null);
  const [mixResult, setMixResult] = useState<string | null>(null);

  // Color Quest State (Toddler Academy #3)
  const [questIndex, setQuestIndex] = useState(0);
  const [completedQuests, setCompletedQuests] = useState<number[]>([]);
  const [showQuestSuccess, setShowQuestSuccess] = useState(false);

  // Routines state and handlers removed
  const [selectedTimeType, setSelectedTimeType] = useState<'morning' | 'evening' | 'bedtime'>('bedtime');
  const [doneRoutines, setDoneRoutines] = useState<string[]>([]);
  const [showRoutineCelebration, setShowRoutineCelebration] = useState(false);
  const handleToggleRoutine = (id: string) => {};
  const handleResetRoutines = () => {};


  const activeNumber = Math.min(Math.max(0, parseInt(calcDisplay || '0') || 0), 20);

  // Reset sequential count progress when the number or object representation cycles
  React.useEffect(() => {
    setCountedIndices([]);
  }, [calcDisplay, selectedObject]);

  const handleModeChange = (mode: typeof activeMode) => {
    setActiveMode(mode);
    playSound('glass');
    const modeLabels: Record<string, string> = {
      numbers: 'Numbers',
      counting: 'Counting',
      words: 'First Words',
      alphabet: 'Sentence Builder',
      colors: 'Colors',
      emotions: 'Emotions',
      bodyparts: 'Body Parts',
      shapes: 'Shapes',
      animals: 'Animal Sounds',
    };
    if (modeLabels[mode]) {
      speakIndianEnglish(modeLabels[mode]);
    }
  };

  const handleColorSelect = (color: typeof COLOR_CHART[0]) => {
    playSound('click');
    speakIndianEnglish(color.name);
    if (!mix1) {
      setMix1(color);
      setMixResult(null);
    } else if (!mix2 && mix1.name !== color.name) {
      setMix2(color);
      const key = `${mix1.name}+${color.name}`;
      const result = MIX_LOGIC[key] || 'Oops, Not all colors mix into something bright';
      setMixResult(result);
      if (!result.includes('Oops')) {
        playSound('glass');
        speakIndianEnglish(`${mix1.name} and ${color.name} make ${result}!`);
        // Validate Quest matching (Toddler Academy #3)
        const currentQuest = COLOR_QUESTS[questIndex];
        if (currentQuest && result === currentQuest.target) {
          setShowQuestSuccess(true);
          if (!completedQuests.includes(currentQuest.id)) {
            setCompletedQuests(prev => [...prev, currentQuest.id]);
          }
        }
      }
    } else {
      setMix1(color);
      setMix2(null);
      setMixResult(null);
    }
  };

  const nextQuest = () => {
    playSound('glass');
    setShowQuestSuccess(false);
    setMix1(null);
    setMix2(null);
    setMixResult(null);
    const nextIdx = (questIndex + 1) % COLOR_QUESTS.length;
    setQuestIndex(nextIdx);
    if (COLOR_QUESTS[nextIdx]) {
      speakIndianEnglish(`Next Quest: Find ${COLOR_QUESTS[nextIdx].target}`);
    }
  };

  const clearMix = () => {
    playSound('pop');
    setMix1(null);
    setMix2(null);
    setMixResult(null);
    speakIndianEnglish('Cleared color mix');
  };

  const handleObjectTap = (index: number) => {
    if (!countedIndices.includes(index)) {
      playSound('pop');
      const nextCount = countedIndices.length + 1;
      setCountedIndices(prev => [...prev, index]);
      speakIndianEnglish(String(nextCount));
      if (nextCount === activeNumber && activeNumber > 0) {
        setTimeout(() => {
          speakIndianEnglish(`Great job! You counted all ${activeNumber} ${selectedObject}s!`);
        }, 600);
      }
    }
  };

  const handleWordPreset = (word: string) => {
    playSound('glass');
    speakIndianEnglish(word);
    setSentence(prev => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed} ${word}` : word;
    });
    setKeyColorIndex(prev => (prev + 1) % COLORS.length);
  };

  const getEmojisToDisplay = () => {
    const words = sentence.toUpperCase().split(/\s+/);
    const foundEmojis: string[] = [];
    words.forEach(w => {
      const match = FIRST_WORDS.find(fw => fw.word === w);
      if (match) {
        foundEmojis.push(match.emoji);
      }
    });
    return foundEmojis;
  };

  const cycleNumberColor = (index: number) => {
    setNumberColors(prev => {
      const next = [...prev];
      next[index] = (next[index] + 1) % COLORS.length;
      return next;
    });
  };

  const handleNumberInput = (num: number, idx: number) => {
    playSound('pop');
    cycleNumberColor(idx);
    const numWords = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
    speakIndianEnglish(numWords[num] || String(num));
    
    if (waitingForOperand) {
      setCalcDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setCalcDisplay(prev => prev === '0' ? String(num) : prev + String(num));
    }
  };

  const handleOperator = (nextOperator: string) => {
    playSound('click');
    const opWords: Record<string, string> = { '+': 'Plus', '-': 'Minus', '×': 'Times', '÷': 'Divided by' };
    speakIndianEnglish(opWords[nextOperator] || nextOperator);
    const inputValue = parseInt(calcDisplay);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation();
      setCalcDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = () => {
    const secondOperand = parseInt(calcDisplay);
    if (operator === '+') return (firstOperand || 0) + secondOperand;
    if (operator === '-') return (firstOperand || 0) - secondOperand;
    if (operator === '×') return (firstOperand || 0) * secondOperand;
    if (operator === '÷') return secondOperand === 0 ? 0 : Math.floor((firstOperand || 0) / secondOperand);
    return secondOperand;
  };

  const calculateResults = () => {
    if (!operator || firstOperand === null) return;
    playSound('glass');
    const result = performCalculation();
    setCalcDisplay(String(result));
    speakIndianEnglish(`Equals ${result}`);
    setFirstOperand(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const clearCalc = () => {
    playSound('pop');
    setCalcDisplay('0');
    speakIndianEnglish('Cleared');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const handleKeyPress = (char: string) => {
    playSound('click');
    setSentence(prev => prev + char);
    setKeyColorIndex(prev => (prev + 1) % COLORS.length);
    speakIndianEnglish(char);
  };

  const clearSentence = () => {
    playSound('pop');
    setSentence('');
    speakIndianEnglish('Cleared sentence');
  };
  
  const backspace = () => {
    playSound('pop');
    setSentence(prev => prev.slice(0, -1));
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* View Switcher Bar (All 9 Tabs + Elegant Master Voice Toggle) */}
      <div className="mb-6 sm:mb-8 bg-slate-900/90 p-3 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md space-y-3 sm:space-y-4">
        {/* Row 1: Academy Header + Dedicated Master Voice Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cheerful-yellow animate-pulse" />
            <span className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-300">
              Interactive Learning Modules
            </span>
          </div>

          {/* Master Voice Toggle Button - Placed Outside Menu Items */}
          <button
            type="button"
            id="toddler-academy-voice-toggle"
            onClick={handleToggleVoice}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md active:scale-95 select-none whitespace-nowrap ${
              isMuted
                ? 'bg-rose-950/70 hover:bg-rose-900/70 text-rose-300 border border-rose-500/60 hover:border-rose-400 shadow-rose-900/20'
                : 'bg-emerald-950/70 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-500/60 hover:border-emerald-400 shadow-emerald-900/20'
            }`}
            title={isMuted ? 'Voice is Muted - Click to turn voice ON' : 'Voice is Active - Click to turn voice OFF'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Turn Voice On</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
                <span>Turn Voice Off</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] shrink-0" />
              </>
            )}
          </button>
        </div>

        {/* Row 2: Category Menu Items - Single Line */}
        <div className="flex items-center justify-center gap-1.5 py-1">
          <button
            id="btn-mode-numbers"
            onClick={() => handleModeChange('numbers')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 font-extrabold text-xs tracking-wider cursor-pointer shadow-sm select-none whitespace-nowrap ${
              activeMode === 'numbers' 
                ? 'bg-cheerful-yellow text-black shadow-lg shadow-cheerful-yellow/20 scale-102 ring-2 ring-cheerful-yellow/50' 
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Numbers</span>
          </button>
          <button
            id="btn-mode-counting"
            onClick={() => handleModeChange('counting')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 font-extrabold text-xs tracking-wider cursor-pointer shadow-sm select-none whitespace-nowrap ${
              activeMode === 'counting' 
                ? 'bg-cheerful-pink text-black shadow-lg shadow-cheerful-pink/20 scale-102 ring-2 ring-cheerful-pink/50' 
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Counting</span>
          </button>
          <button
            id="btn-mode-words"
            onClick={() => handleModeChange('words')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 font-extrabold text-xs tracking-wider cursor-pointer shadow-sm select-none whitespace-nowrap ${
              activeMode === 'words' 
                ? 'bg-cheerful-blue text-black shadow-lg shadow-cheerful-blue/20 scale-102 ring-2 ring-cheerful-blue/50' 
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>First Words</span>
          </button>
          <button
            id="btn-mode-alphabet"
            onClick={() => handleModeChange('alphabet')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 font-extrabold text-xs tracking-wider cursor-pointer shadow-sm select-none whitespace-nowrap ${
              activeMode === 'alphabet' 
                ? 'bg-indigo-400 text-black shadow-lg shadow-indigo-400/20 scale-102 ring-2 ring-indigo-400/50' 
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Sentence Builder</span>
          </button>
          <button
            id="btn-mode-colors"
            onClick={() => handleModeChange('colors')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 font-extrabold text-xs tracking-wider cursor-pointer shadow-sm select-none whitespace-nowrap ${
              activeMode === 'colors' 
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20 scale-102 ring-2 ring-purple-400/50' 
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Colors</span>
          </button>
          <button
            id="btn-mode-emotions"
            onClick={() => handleModeChange('emotions')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 font-extrabold text-xs tracking-wider cursor-pointer shadow-sm select-none whitespace-nowrap ${
              activeMode === 'emotions' 
                ? 'bg-rose-400 text-black shadow-lg shadow-rose-400/20 scale-102 ring-2 ring-rose-300/50' 
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-pink-300" />
            <span>Emotions</span>
          </button>
          <button
            id="btn-mode-bodyparts"
            onClick={() => handleModeChange('bodyparts')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 font-extrabold text-xs tracking-wider cursor-pointer shadow-sm select-none whitespace-nowrap ${
              activeMode === 'bodyparts' 
                ? 'bg-sky-400 text-black shadow-lg shadow-sky-400/20 scale-102 ring-2 ring-sky-300/50' 
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Smile className="w-3.5 h-3.5 text-sky-300" />
            <span>Body Parts</span>
          </button>
          <button
            id="btn-mode-shapes"
            onClick={() => handleModeChange('shapes')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 font-extrabold text-xs tracking-wider cursor-pointer shadow-sm select-none whitespace-nowrap ${
              activeMode === 'shapes' 
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20 scale-102 ring-2 ring-amber-300/50' 
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Shapes</span>
          </button>
          <button
            id="btn-mode-animals"
            onClick={() => handleModeChange('animals')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 font-extrabold text-xs tracking-wider cursor-pointer shadow-sm select-none whitespace-nowrap ${
              activeMode === 'animals' 
                ? 'bg-emerald-400 text-black shadow-lg shadow-emerald-400/20 scale-102 ring-2 ring-emerald-300/50' 
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span className="whitespace-nowrap">Animal Sounds</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
          {activeMode === 'numbers' ? (
          <motion.div
            key="numbers-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <header className="text-center mb-12">
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 mb-4"
              >
                <Hash className="w-5 h-5" />
                <span className="text-sm font-black uppercase tracking-widest text-white/60">Arithmetics Discovery</span>
              </motion.div>
              <h1 className="text-5xl font-black text-white mb-2 tracking-tighter uppercase">Toddler Academy</h1>
            </header>

            {/* Calculator Interface */}
            <div className="max-w-xl mx-auto mb-10">
              <div className="glass-card p-6 border-4 border-white/10 flex flex-col items-center gap-4 relative overflow-hidden">
                <div className={`absolute inset-0 opacity-5 bg-cheerful-yellow`} />
                
                <div className="w-full bg-black/20 rounded-2xl p-6 text-right relative z-10 border border-white/5">
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={calcDisplay}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-6xl md:text-7xl font-black text-white tracking-widest block"
                    >
                      {calcDisplay}
                    </motion.span>
                  </AnimatePresence>
                  {operator && (
                     <div className="absolute top-2 left-4 text-cheerful-yellow font-black text-2xl">
                       {operator}
                     </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 w-full relative z-10">
                  <button 
                    onClick={() => handleOperator('+')}
                    className="flex-1 min-w-[60px] glass-card py-4 flex items-center justify-center border-2 border-white/10 hover:border-cheerful-pink/40 text-white transition-all active:scale-95"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => handleOperator('-')}
                    className="flex-1 min-w-[60px] glass-card py-4 flex items-center justify-center border-2 border-white/10 hover:border-cheerful-blue/40 text-white transition-all active:scale-95"
                  >
                    <Minus className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => handleOperator('×')}
                    className="flex-1 min-w-[60px] glass-card py-4 flex items-center justify-center border-2 border-white/10 hover:border-cheerful-yellow/40 text-white transition-all active:scale-95 font-black text-2xl"
                  >
                    ×
                  </button>
                  <button 
                    onClick={() => handleOperator('÷')}
                    className="flex-1 min-w-[60px] glass-card py-4 flex items-center justify-center border-2 border-white/10 hover:border-emerald-400/40 text-white transition-all active:scale-95 font-black text-2xl"
                  >
                    ÷
                  </button>
                  <button 
                    onClick={calculateResults}
                    className="flex-1 min-w-[60px] glass-card py-4 flex items-center justify-center border-2 border-white/10 hover:border-cheerful-green/40 text-cheerful-green transition-all active:scale-95"
                  >
                    <Equal className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={clearCalc}
                    className="px-6 glass-card py-4 flex items-center justify-center border-2 border-white/10 hover:border-white/40 text-white/40 transition-all active:scale-95"
                  >
                    <Eraser className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num, idx) => {
                const colorIndex = numberColors[idx];
                const activeColor = COLORS[colorIndex];
                
                return (
                  <motion.div
                    key={num}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleNumberInput(num, idx)}
                    className={`glass-card aspect-square flex items-center justify-center cursor-pointer border-4 transition-all duration-500 shadow-2xl relative overflow-hidden group ${activeColor.border} ${activeColor.glow}`}
                  >
                    <div className={`absolute inset-0 opacity-10 transition-colors duration-500 ${activeColor.bg}`} />
                    <span className="text-7xl sm:text-8xl md:text-9xl font-black text-white tracking-tighter relative z-10 drop-shadow-2xl">
                      {num}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : activeMode === 'counting' ? (
          <motion.div
            key="counting-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <header className="text-center mb-12">
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 mb-4"
              >
                <Star className="w-5 h-5 text-cheerful-pink" />
                <span className="text-sm font-black uppercase tracking-widest text-white/60">Count-With-Me Academy</span>
              </motion.div>
              <h1 className="text-5xl font-black text-white mb-2 tracking-tighter uppercase">Counting Playground</h1>
              <p className="text-white/40 font-bold max-w-lg mx-auto">
                Select a number below, pick your favorite objects, and tap them sequentially to learn counting!
              </p>
            </header>

            {/* Quick Count Selector */}
            <div className="max-w-4xl mx-auto mb-8 text-center bg-white/5 border border-white/10 p-6 rounded-3xl">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-cheerful-pink block mb-4">Choose a Number to Count! 🍒</span>
              <div className="flex flex-wrap justify-center gap-3 select-none">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => {
                  const isSelected = activeNumber === num;
                  return (
                    <motion.button
                      key={num}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        playSound('pop');
                        setCalcDisplay(String(num));
                        speakIndianEnglish(`Count ${num}`);
                      }}
                      className={`w-12 h-12 rounded-full border-2 transition-all duration-300 font-black text-lg flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-cheerful-pink border-white text-black shadow-lg shadow-cheerful-pink/20 scale-110'
                          : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {num}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Count-With-Me Stage */}
            <div className="max-w-4xl mx-auto mb-10">
              <div className="glass-card p-6 border-4 border-white/10 flex flex-col items-center gap-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cheerful-yellow/5 to-transparent opacity-50" />
                
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                  <div className="text-left w-full sm:w-auto">
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-cheerful-yellow animate-spin" style={{ animationDuration: '6s' }} />
                      Count-with-Me Arena
                    </h2>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-wider mt-1">
                      {activeNumber > 0 
                        ? `Tap the ${selectedObject}s sequentially to count: ${countedIndices.length} / ${activeNumber}` 
                        : 'Select a number above to start counting!'}
                    </p>
                  </div>

                  {/* Object Selector Tabs */}
                  <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5 select-none">
                    {(['star', 'cookie', 'heart', 'smile'] as const).map((obj) => (
                      <button
                        key={obj}
                        onClick={() => {
                          playSound('click');
                          setSelectedObject(obj);
                          const objNames = { star: 'Stars', cookie: 'Cookies', heart: 'Hearts', smile: 'Smiles' };
                          speakIndianEnglish(objNames[obj]);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          selectedObject === obj 
                            ? 'bg-white/10 text-white shadow-md font-black' 
                            : 'text-white/40 hover:text-white/60'
                        }`}
                      >
                        {obj === 'star' ? '⭐' : obj === 'cookie' ? '🍪' : obj === 'heart' ? '💖' : '😊'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Counting Stage */}
                <div className="w-full bg-black/25 rounded-2xl p-6 min-h-[180px] flex flex-wrap items-center justify-center gap-4 relative z-10 border border-white/5">
                  {activeNumber === 0 ? (
                    <div className="text-center py-4 select-none">
                      <p className="text-white/20 text-sm font-bold uppercase tracking-widest italic">
                        Select a number from the buttons above to start counting!
                      </p>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {Array.from({ length: activeNumber }).map((_, index) => {
                        const isCounted = countedIndices.includes(index);
                        const countedNum = countedIndices.indexOf(index) + 1;
                        return (
                          <motion.div
                            key={`${selectedObject}-${index}`}
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: isCounted ? [0, 15, -15, 0] : 0 }}
                            exit={{ scale: 0, rotate: 45 }}
                            whileHover={{ scale: 1.15 }}
                            onClick={() => handleObjectTap(index)}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center relative cursor-pointer border-2 transition-all shadow-lg select-none ${
                              isCounted 
                                ? 'bg-white/10 border-white text-white' 
                                : 'bg-white/5 border-white/10 hover:border-white/20 text-white/30'
                            }`}
                          >
                            <div className="transition-transform duration-300">
                              {selectedObject === 'star' && (
                                <Star className={`w-8 h-8 ${isCounted ? 'text-cheerful-yellow fill-cheerful-yellow' : 'text-white/20 fill-transparent'}`} />
                              )}
                              {selectedObject === 'cookie' && (
                                <Cookie className={`w-8 h-8 ${isCounted ? 'text-[#D2691E] fill-[#CD853F]' : 'text-white/20 fill-transparent'}`} />
                              )}
                              {selectedObject === 'heart' && (
                                <Heart className={`w-8 h-8 ${isCounted ? 'text-cheerful-pink fill-cheerful-pink' : 'text-white/20 fill-transparent'}`} />
                              )}
                              {selectedObject === 'smile' && (
                                <Smile className={`w-8 h-8 ${isCounted ? 'text-cheerful-blue fill-cheerful-blue' : 'text-white/20 fill-transparent'}`} />
                              )}
                            </div>

                            {/* Sequential Counting Badge */}
                            {isCounted && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1.5 -right-1.5 bg-cheerful-pink text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-md"
                              >
                                {countedNum}
                              </motion.span>
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  )}
                </div>

                {/* Progress bar */}
                {activeNumber > 0 && (
                  <div className="w-full bg-white/5 rounded-full h-2 relative z-10 overflow-hidden border border-white/5 select-none">
                    <div 
                      className="bg-cheerful-yellow h-full transition-all duration-300"
                      style={{ width: `${(countedIndices.length / activeNumber) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : activeMode === 'colors' ? (
          <motion.div
            key="colors-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <header className="text-center mb-12">
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 mb-4"
              >
                <Palette className="w-5 h-5" />
                <span className="text-sm font-black uppercase tracking-widest text-white/60">Color Discovery</span>
              </motion.div>
              <h1 className="text-5xl font-black text-white mb-4 tracking-tighter uppercase">Magic Color Chart</h1>
              <p className="text-white/40 font-bold">Tap a color to see its name and feel the magic!</p>
            </header>

            {/* Mixing Laboratory */}
            <div className="max-w-4xl mx-auto mb-16">
              <div className="glass-card p-10 border-4 border-white/10 flex flex-col md:flex-row items-center justify-center gap-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cheerful-pink/5 via-transparent to-cheerful-blue/5" />
                
                <div className="flex flex-col items-center gap-4">
                  <motion.div 
                    key={mix1?.name || 'empty'}
                    animate={{ scale: mix1 ? 1.1 : 1, rotate: mix1 ? 0 : 45 }}
                    className={`w-24 h-24 rounded-full border-4 ${mix1 ? `${mix1.class} ${mix1.border}` : 'bg-white/5 border-dashed border-white/20'} flex items-center justify-center`}
                  >
                    {!mix1 && <span className="text-white/20 text-xs font-black">?</span>}
                  </motion.div>
                  <span className="text-white/40 font-black text-[10px] uppercase tracking-widest">{mix1?.name || 'Color 1'}</span>
                </div>

                <Plus className="w-8 h-8 text-white/20" />

                <div className="flex flex-col items-center gap-4">
                   <motion.div 
                    key={mix2?.name || 'empty'}
                    animate={{ scale: mix2 ? 1.1 : 1, rotate: mix2 ? 0 : -45 }}
                    className={`w-24 h-24 rounded-full border-4 ${mix2 ? `${mix2.class} ${mix2.border}` : 'bg-white/5 border-dashed border-white/20'} flex items-center justify-center`}
                  >
                    {!mix2 && <span className="text-white/20 text-xs font-black">?</span>}
                  </motion.div>
                  <span className="text-white/40 font-black text-[10px] uppercase tracking-widest">{mix2?.name || 'Color 2'}</span>
                </div>

                <Equal className="w-8 h-8 text-white/20" />

                <div className="flex flex-col items-center gap-4">
                  <motion.div 
                    key={mixResult || 'result'}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ 
                      scale: mixResult ? 1.2 : 1, 
                      opacity: 1, 
                      rotate: mixResult ? (mixResult.includes('Oops') ? [0, -10, 10, -10, 0] : 360) : 0,
                    }}
                    transition={{ 
                      type: mixResult?.includes('Oops') ? 'keyframes' : 'spring',
                      damping: 10 
                    }}
                    className={`w-32 h-32 rounded-full border-4 shadow-2xl flex items-center justify-center transition-all duration-500 ${
                      mixResult === 'Orange' ? 'bg-orange-500 border-orange-500/40' :
                      mixResult === 'Purple' ? 'bg-purple-500 border-purple-500/40' :
                      mixResult === 'Green' ? 'bg-green-500 border-green-500/40' :
                      mixResult === 'Pink' ? 'bg-cheerful-pink border-cheerful-pink/40' :
                      mixResult === 'Gray' ? 'bg-gray-400 border-gray-400/40' :
                      mixResult === 'Brown' ? 'bg-[#8B4513] border-[#8B4513]/40' :
                      mixResult === 'Sky Blue' ? 'bg-blue-300 border-blue-300/40' :
                      mixResult === 'Indigo' ? 'bg-indigo-600 border-indigo-600/40' :
                      mixResult === 'Violet' ? 'bg-violet-600 border-violet-600/40' :
                      mixResult === 'Teal' ? 'bg-teal-600 border-teal-600/40' :
                      mixResult === 'Magenta' ? 'bg-magenta-600 border-magenta-600/40' :
                      mixResult === 'Amber' ? 'bg-amber-400 border-amber-400/40' :
                      mixResult === 'Vermilion' ? 'bg-orange-600 border-orange-600/40' :
                      mixResult === 'Rose' ? 'bg-rose-400 border-rose-400/40' :
                      mixResult === 'Lavender' ? 'bg-purple-200 border-purple-200/40' :
                      mixResult === 'Mint' ? 'bg-emerald-100 border-emerald-100/40' :
                      mixResult === 'Olive' ? 'bg-[#808000] border-[#808000]/40' :
                      mixResult === 'Fuchsia' ? 'bg-[#FF00FF] border-[#FF00FF]/40' :
                      mixResult === 'Maroon' ? 'bg-red-900 border-red-900/40' :
                      mixResult === 'Plum' ? 'bg-[#8E4585] border-[#8E4585]/40' :
                      mixResult === 'Navy' ? 'bg-blue-900 border-blue-900/40' :
                      mixResult === 'Dark Green' ? 'bg-green-900 border-green-900/40' :
                      mixResult === 'Turquoise' ? 'bg-turquoise-400 border-turquoise-400/40' :
                      mixResult === 'Slate' ? 'bg-slate-500 border-slate-500/40' :
                      mixResult === 'Mustard' ? 'bg-[#E1AD01] border-[#E1AD01]/40' :
                      mixResult === 'Brick' ? 'bg-[#B22222] border-[#B22222]/40' :
                      mixResult === 'Rust' ? 'bg-[#B7410E] border-[#B7410E]/40' :
                      mixResult === 'Chartreuse' ? 'bg-[#7FFF00] border-[#7FFF00]/40' :
                      mixResult?.includes('Oops') ? 'bg-white border-white animate-pulse shadow-white/50' :
                      'bg-white/5 border-dashed border-white/20'
                    }`}
                  >
                    {!mixResult && <Sparkles className="w-8 h-8 text-white/10" />}
                    {mixResult?.includes('Oops') && <Sparkles className="w-12 h-12 text-black" />}
                    {mixResult && !mixResult.includes('Oops') && <Star className="w-10 h-10 text-white fill-white shadow-xl" />}
                  </motion.div>
                  <span className={`font-black text-xs uppercase tracking-widest min-h-[120px] max-w-[200px] text-center flex items-center justify-center ${mixResult?.includes('Oops') ? 'text-cheerful-yellow italic bg-white/5 p-4 rounded-2xl border border-white/5' : 'text-white'}`}>
                    {mixResult || 'Wait for it...'}
                  </span>
                </div>

                {mix1 && (
                  <button 
                    onClick={clearMix}
                    className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all"
                  >
                    <RefreshCw className="w-4 h-4 text-white/40" />
                  </button>
                )}
              </div>
              <p className="text-center text-[10px] text-white/20 font-black uppercase tracking-[0.3em] mt-6">Color Laboratory: Mix two colors to see the results!</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
              {COLOR_CHART.map((color, idx) => (
                <motion.div
                  key={color.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleColorSelect(color)}
                  className={`glass-card aspect-square flex flex-col items-center justify-center cursor-pointer border-4 transition-all duration-500 shadow-2xl relative overflow-hidden group ${
                    mix1?.name === color.name || mix2?.name === color.name ? 'border-white scale-105' : color.border
                  } ${color.glow}`}
                >
                  <div className={`absolute inset-0 opacity-80 ${color.class}`} />
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  
                  <div className="relative z-10 text-center">
                    <span className={`text-2xl md:text-3xl font-black tracking-tighter uppercase ${
                      color.name === 'White' || color.name === 'Yellow' ? 'text-black' : 'text-white'
                    } drop-shadow-md`}>
                      {color.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : activeMode === 'emotions' ? (
          <motion.div
            key="emotions-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <ToddlerEmotionsSection />
          </motion.div>
        ) : activeMode === 'bodyparts' ? (
          <motion.div
            key="bodyparts-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <ToddlerBodyPartsSection />
          </motion.div>
        ) : activeMode === 'shapes' ? (
          <motion.div
            key="shapes-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <ToddlerShapesSection />
          </motion.div>
        ) : activeMode === 'animals' ? (
          <motion.div
            key="animals-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <ToddlerAnimalSoundsSection />
          </motion.div>
        ) : false ? (
          <motion.div
            key="routines-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center w-full"
          >
            <header className="text-center mb-12">
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 mb-4"
              >
                <Clock className="w-5 h-5 text-cheerful-green" />
                <span className="text-sm font-black uppercase tracking-widest text-white/60">Routine Builder</span>
              </motion.div>
              <h1 className="text-5xl font-black text-white mb-2 tracking-tighter uppercase">Routine Scheduler</h1>
              <p className="text-white/40 font-bold max-w-lg mx-auto">
                Check off your daily activities. Complete bedtime chores to sleep like a star, or morning ones to start the day!
              </p>
            </header>

            {/* Time toggle & Stars Counter panel */}
            <div className="w-full max-w-4xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6 glass-card p-6 border border-white/10">
              {/* Type Selector (Morning vs Evening vs Bedtime) */}
              <div className="flex flex-wrap gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/5 w-full md:w-auto">
                <button
                  id="routine-toggle-morning"
                  onClick={() => { playSound('click'); setSelectedTimeType('morning'); }}
                  className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    selectedTimeType === 'morning'
                      ? 'bg-cheerful-yellow text-slate-950 shadow-lg'
                      : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  Morning ☀️
                </button>
                <button
                  id="routine-toggle-evening"
                  onClick={() => { playSound('click'); setSelectedTimeType('evening'); }}
                  className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    selectedTimeType === 'evening'
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  <Clock className="w-4 h-4 text-orange-400" />
                  Evening 🌆
                </button>
                <button
                  id="routine-toggle-bedtime"
                  onClick={() => { playSound('click'); setSelectedTimeType('bedtime'); }}
                  className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    selectedTimeType === 'bedtime'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  <Moon className="w-4 h-4 text-indigo-300" />
                  Bedtime 🌙
                </button>
              </div>

              {/* Gold Stars scoreboard */}
              <div className="flex items-center gap-4 bg-black/15 px-6 py-3.5 rounded-2xl border border-white/5 w-full md:w-auto justify-between select-none">
                <div className="text-left">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Stars Earned</span>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-black text-white uppercase tracking-tight">
                      {ROUTINES.filter(r => r.time === selectedTimeType && doneRoutines.includes(r.id)).length} / {ROUTINES.filter(r => r.time === selectedTimeType).length}
                    </span>
                    <Star className="w-5 h-5 text-cheerful-yellow fill-cheerful-yellow animate-pulse" />
                  </div>
                </div>

                <button
                  id="btn-reset-routines"
                  onClick={handleResetRoutines}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Checklist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl relative">
              {/* Outer celebratory overlay strictly for active completions */}
              <AnimatePresence>
                {showRoutineCelebration && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 z-20 backdrop-blur-md bg-slate-950/90 rounded-3xl flex flex-col items-center justify-center p-8 text-center border-2 border-white/10"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.15, 1] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                      className="p-5 bg-cheerful-yellow/10 border-2 border-cheerful-yellow/20 rounded-full text-cheerful-yellow mb-4"
                    >
                      <Trophy className="w-16 h-16 fill-cheerful-yellow" />
                    </motion.div>

                    {selectedTimeType === 'bedtime' ? (
                      <>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
                          Sweet Dreams! 🌙✨
                        </h2>
                        <p className="text-white/60 text-sm max-w-md font-bold mb-6 uppercase tracking-wider">
                          Ready for cozy pajamas, soft blankets, and wonderful bedtime adventures in dreamland! You earned all Bedtime Stars! ⭐
                        </p>
                      </>
                    ) : selectedTimeType === 'evening' ? (
                      <>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
                          Wonderful Evening! 🌆🎈
                        </h2>
                        <p className="text-white/60 text-sm max-w-md font-bold mb-6 uppercase tracking-wider">
                          Super winding down! All toys are tidy, table is wiped clean, and everything is snug for a smooth night! You earned all Evening Stars! ⭐
                        </p>
                      </>
                    ) : (
                      <>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
                          Amazing Morning! ☀️🚀
                        </h2>
                        <p className="text-white/60 text-sm max-w-md font-bold mb-6 uppercase tracking-wider">
                          Ready to conquer the whole universe! Everything checked, breakfast eaten, clothes active! Let's play! You earned all Morning Stars! ⭐
                        </p>
                      </>
                    )}

                    <button
                      id="btn-dismiss-celebration"
                      onClick={() => setShowRoutineCelebration(false)}
                      className="px-8 py-4 bg-cheerful-green text-slate-950 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-cheerful-green/20"
                    >
                      Done / Hide 💖
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {ROUTINES.filter(r => r.time === selectedTimeType).map((item, idx) => {
                const isChecked = doneRoutines.includes(item.id);
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleToggleRoutine(item.id)}
                    className={`glass-card p-6 border-4 flex flex-col justify-between cursor-pointer transition-all duration-300 relative overflow-hidden group min-h-[220px] ${
                      isChecked
                        ? 'border-white shadow-2xl scale-[1.02]'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Background color block with pattern */}
                    <div className={`absolute inset-0 opacity-10 transition-opacity duration-300 ${isChecked ? 'opacity-20' : 'opacity-[0.03]'} bg-gradient-to-br ${item.colorClass}`} />
                    
                    <div className="relative z-10 w-full flex justify-between items-start">
                      <div className="flex flex-col gap-1 items-start text-left">
                        <span className="text-4xl select-none leading-none mb-1">{item.emoji}</span>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">
                          {item.name}
                        </h3>
                      </div>
                      
                      {/* Checkbox indicator */}
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        isChecked 
                          ? 'bg-cheerful-yellow border-cheerful-yellow animate-pulse' 
                          : 'border-white/20'
                      }`}>
                        {isChecked ? (
                          <Check className="w-5 h-5 text-slate-950 stroke-[3px]" />
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                        )}
                      </div>
                    </div>

                     {/* Highly cooperative friendly vector icons representation */}
                    <div className="relative z-10 flex justify-start py-1">
                      {item.icon === 'Bath' && <Bath className={`w-10 h-10 transition-all ${isChecked ? 'scale-110 text-cheerful-blue' : 'scale-100 text-white/20'}`} />}
                      {item.icon === 'Sparkles' && <Sparkles className={`w-10 h-10 transition-all ${isChecked ? 'scale-110 text-cheerful-yellow' : 'scale-100 text-white/20'}`} />}
                      {item.icon === 'Smile' && <Smile className={`w-10 h-10 transition-all ${isChecked ? 'scale-110 text-cheerful-pink' : 'scale-100 text-white/20'}`} />}
                      {item.icon === 'BookOpen' && <BookOpen className={`w-10 h-10 transition-all ${isChecked ? 'scale-110 text-cheerful-green' : 'scale-100 text-white/20'}`} />}
                      {item.icon === 'Moon' && <Moon className={`w-10 h-10 transition-all ${isChecked ? 'scale-110 text-indigo-400' : 'scale-100 text-white/20'}`} />}
                      {item.icon === 'Sun' && <Sun className={`w-10 h-10 transition-all ${isChecked ? 'scale-110 text-cheerful-yellow' : 'scale-100 text-white/20'}`} />}
                      {item.icon === 'Star' && <Star className={`w-10 h-10 transition-all ${isChecked ? 'scale-110 text-cheerful-yellow fill-cheerful-yellow' : 'scale-100 text-white/20'}`} />}
                      {item.icon === 'Cookie' && <Cookie className={`w-10 h-10 transition-all ${isChecked ? 'scale-110 text-amber-500' : 'scale-100 text-white/20'}`} />}
                      {item.icon === 'Heart' && <Heart className={`w-10 h-10 transition-all ${isChecked ? 'scale-110 text-cheerful-pink fill-cheerful-pink' : 'scale-100 text-white/20'}`} />}
                      {item.icon === 'Clock' && <Clock className={`w-10 h-10 transition-all ${isChecked ? 'scale-110 text-emerald-400' : 'scale-100 text-white/20'}`} />}
                    </div>

                    <div className="relative z-10 text-left pt-2">
                      <p className="text-white/50 text-xs font-bold leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {/* Progress feedback bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: isChecked ? '100%' : '0%' }}
                        className={`h-full ${item.indicatorColor}`} 
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : activeMode === 'words' ? (
          <motion.div
            key="words-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center w-full"
          >
            <header className="text-center mb-12">
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 mb-4"
              >
                <BookOpen className="w-5 h-5 text-cheerful-blue" />
                <span className="text-sm font-black uppercase tracking-widest text-white/60">My Vocabulary Academy</span>
              </motion.div>
              <h1 className="text-5xl font-black text-white mb-2 tracking-tighter uppercase">First Words Palette</h1>
              <p className="text-white/40 font-bold max-w-lg mx-auto">
                Discover 25 essential words! Select an item below to see spelling letter-bubbles pop, or add words to the keyboard typewriter!
              </p>
            </header>

            {/* Spelling helper panel */}
            {selectedWord && (() => {
              const currentWordData = FIRST_WORDS.find(w => w.word === selectedWord);
              if (!currentWordData) return null;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-4xl p-8 rounded-[2.5rem] border-4 border-white/10 glass-card relative overflow-hidden mb-12 text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-cheerful-blue/5 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Giant floating emoji of targeted word */}
                  <motion.div 
                    animate={{ y: [0, -10, 0], scale: [1, 1.08, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-8xl md:text-9xl mb-6 select-none filter drop-shadow-3xl"
                  >
                    {currentWordData.emoji}
                  </motion.div>

                  {/* Bubbled Spelling Board */}
                  <h3 className="text-white/30 text-xs font-black uppercase tracking-[0.25em] mb-4">Tap each letter of the spelling bubbles!</h3>
                  
                  <div className="flex flex-wrap justify-center gap-4 mb-8 select-none">
                    {currentWordData.word.split('').map((letter, letterIdx) => (
                      <motion.button
                        key={`${letter}-${letterIdx}`}
                        whileHover={{ scale: 1.2, rotate: [0, 10, -10, 0] }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          playSound('pop');
                          speakIndianEnglish(letter);
                        }}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full border-3 border-white/20 bg-white/5 hover:border-white text-white font-black text-3xl md:text-4xl flex items-center justify-center cursor-pointer shadow-xl transition-all"
                      >
                        {letter}
                      </motion.button>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                    <button
                      onClick={() => {
                        playSound('glass');
                        speakIndianEnglish(currentWordData.word);
                      }}
                      className="px-6 py-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 font-black rounded-2xl uppercase text-xs tracking-wider flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
                    >
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      Listen to Word
                    </button>
                    <button
                      onClick={() => {
                        handleWordPreset(currentWordData.word);
                        playSound('glass');
                      }}
                      className="px-6 py-3 bg-cheerful-blue text-slate-950 font-black rounded-2xl uppercase text-xs tracking-wider flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg shadow-cheerful-blue/15"
                    >
                      📝 Add to Typewriter Sentence
                    </button>
                    <button
                      onClick={() => {
                        setSelectedWord(null);
                        playSound('click');
                      }}
                      className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white font-black rounded-2xl uppercase text-xs tracking-wider hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      Close Card
                    </button>
                  </div>
                </motion.div>
              );
            })()}

            {/* Grid of 25 Word presets */}
            <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-16 select-none">
              {FIRST_WORDS.map((item) => {
                const isSelected = selectedWord === item.word;
                return (
                  <motion.div
                    key={item.word}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setSelectedWord(item.word);
                      playSound('pop');
                      speakIndianEnglish(item.word);
                    }}
                    className={`glass-card p-6 border-2 flex flex-col items-center justify-center gap-4 cursor-pointer relative overflow-hidden transition-all ${
                      isSelected 
                        ? 'border-cheerful-blue bg-cheerful-blue/5 scale-105 shadow-2xl shadow-cheerful-blue/10 animate-pulse' 
                        : 'border-white/5 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="text-5xl md:text-6xl drop-shadow-md select-none">{item.emoji}</div>
                    <div className="text-center">
                      <span className="text-white text-base font-black tracking-wider uppercase">{item.word}</span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-cheerful-blue animate-ping" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="alphabet-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <header className="text-center mb-12">
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 mb-4"
              >
                <Keyboard className="w-5 h-5" />
                <span className="text-sm font-black uppercase tracking-widest text-white/60">Sentence Discovery</span>
              </motion.div>
              <h1 className="text-5xl font-black text-white mb-4 tracking-tighter uppercase">Word Academy</h1>
            </header>

            {/* Sentence Display */}
            <div className={`w-full max-w-4xl min-h-[180px] glass-card mb-6 flex flex-col items-center justify-center p-8 border-4 border-white/10 relative overflow-hidden`}>
              <div className={`absolute inset-0 opacity-5 transition-colors duration-500 ${COLORS[keyColorIndex].bg}`} />
              
              <div className="flex flex-col items-center gap-4 relative z-10 w-full text-center">
                {/* Floating Emojis matching written letters (Toddler Academy #2) */}
                {getEmojisToDisplay().length > 0 && (
                  <div className="flex justify-center gap-3 mb-2 flex-wrap max-w-full">
                    <AnimatePresence>
                      {getEmojisToDisplay().map((emo, eIdx) => (
                        <motion.span
                          key={`${emo}-${eIdx}`}
                          initial={{ scale: 0, y: 15 }}
                          animate={{ scale: 1, y: 0, rotate: [0, 10, -10, 0] }}
                          exit={{ scale: 0 }}
                          className="text-5xl md:text-6xl filter drop-shadow-2xl select-none"
                        >
                          {emo}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                  <AnimatePresence mode="popLayout">
                  {sentence ? (
                    <div className="flex flex-col items-center gap-3">
                      <motion.p 
                        key={sentence}
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-4xl md:text-6xl font-black text-white tracking-tight break-words text-center uppercase"
                      >
                        {sentence}
                      </motion.p>
                      <button
                        type="button"
                        onClick={() => {
                          playSound('glass');
                          speakIndianEnglish(sentence);
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95"
                      >
                        <Volume2 className="w-4 h-4 text-indigo-300 animate-pulse" />
                        <span>Speak Full Sentence</span>
                      </button>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-white/20 italic tracking-wide uppercase text-center select-none">Start typing to build a sentence!</p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Keyboard Grid */}
            <div className="w-full max-w-4xl space-y-4">
              {ALPHABET_ROWS.map((row, rowIdx) => (
                <div key={rowIdx} className="flex justify-center gap-2 md:gap-4">
                  {row.map((char) => (
                    <motion.button
                      key={char}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleKeyPress(char)}
                      className="glass-card flex-1 min-h-[70px] md:min-h-[90px] flex items-center justify-center border-2 border-white/5 hover:border-white/20 transition-all cursor-pointer font-black text-3xl md:text-4xl text-white/80 hover:text-white"
                    >
                      {char}
                    </motion.button>
                  ))}
                </div>
              ))}
              
              {/* Feature Keys */}
              <div className="flex justify-center gap-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={backspace}
                  className="glass-card px-8 h-20 flex items-center justify-center border-2 border-cheerful-pink/20 text-cheerful-pink font-black text-xl tracking-widest uppercase gap-3"
                >
                  <Delete className="w-6 h-6" />
                  Del
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleKeyPress(' ')}
                  className="glass-card flex-[3] h-20 border-2 border-white/5 hover:border-white/20 text-white/40 font-black text-xl uppercase tracking-[0.4em]"
                >
                  Space
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={clearSentence}
                  className="glass-card px-8 h-20 border-2 border-cheerful-green/20 text-cheerful-green font-black text-xl uppercase tracking-widest gap-3 flex items-center"
                >
                  <RefreshCw className="w-6 h-6" />
                  Clear
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-4 px-8 py-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
           <Palette className="w-6 h-6 text-white/40" />
           <p className="text-white/40 text-sm font-bold italic">Interactive classroom mode enabled</p>
        </div>
      </div>

    </div>
  );
};
