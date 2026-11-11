import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { useLanguage } from '../lib/LanguageContext';
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
  // Same-color mixes
  'Red+Red': 'Red',
  'Orange+Orange': 'Orange',
  'Yellow+Yellow': 'Yellow',
  'Green+Green': 'Green',
  'Blue+Blue': 'Blue',
  'Purple+Purple': 'Purple',
  'Pink+Pink': 'Pink',
  'Brown+Brown': 'Brown',
  'Black+Black': 'Black',
  'White+White': 'White',

  // Red combinations
  'Red+Orange': 'Vermilion',
  'Orange+Red': 'Vermilion',
  'Red+Yellow': 'Orange',
  'Yellow+Red': 'Orange',
  'Red+Green': 'Brown',
  'Green+Red': 'Brown',
  'Red+Blue': 'Purple',
  'Blue+Red': 'Purple',
  'Red+Purple': 'Magenta',
  'Purple+Red': 'Magenta',
  'Red+Pink': 'Coral Red',
  'Pink+Red': 'Coral Red',
  'Red+Brown': 'Brick Red',
  'Brown+Red': 'Brick Red',
  'Red+Black': 'Maroon',
  'Black+Red': 'Maroon',
  'Red+White': 'Rose Pink',
  'White+Red': 'Rose Pink',

  // Orange combinations
  'Orange+Yellow': 'Amber',
  'Yellow+Orange': 'Amber',
  'Orange+Green': 'Olive',
  'Green+Orange': 'Olive',
  'Orange+Blue': 'Terracotta Slate',
  'Blue+Orange': 'Terracotta Slate',
  'Orange+Purple': 'Russet',
  'Purple+Orange': 'Russet',
  'Orange+Pink': 'Coral',
  'Pink+Orange': 'Coral',
  'Orange+Brown': 'Rust',
  'Brown+Orange': 'Rust',
  'Orange+Black': 'Burnt Umber',
  'Black+Orange': 'Burnt Umber',
  'Orange+White': 'Peach',
  'White+Orange': 'Peach',

  // Yellow combinations
  'Yellow+Green': 'Lime Green',
  'Green+Yellow': 'Lime Green',
  'Yellow+Blue': 'Green',
  'Blue+Yellow': 'Green',
  'Yellow+Purple': 'Golden Ochre',
  'Purple+Yellow': 'Golden Ochre',
  'Yellow+Pink': 'Peach Coral',
  'Pink+Yellow': 'Peach Coral',
  'Yellow+Brown': 'Mustard',
  'Brown+Yellow': 'Mustard',
  'Yellow+Black': 'Olive Green',
  'Black+Yellow': 'Olive Green',
  'Yellow+White': 'Lemon Cream',
  'White+Yellow': 'Lemon Cream',

  // Green combinations
  'Green+Blue': 'Teal',
  'Blue+Green': 'Teal',
  'Green+Purple': 'Deep Forest',
  'Purple+Green': 'Deep Forest',
  'Green+Pink': 'Sage Rose',
  'Pink+Green': 'Sage Rose',
  'Green+Brown': 'Moss Green',
  'Brown+Green': 'Moss Green',
  'Green+Black': 'Dark Green',
  'Black+Green': 'Dark Green',
  'Green+White': 'Mint',
  'White+Green': 'Mint',

  // Blue combinations
  'Blue+Purple': 'Violet',
  'Purple+Blue': 'Violet',
  'Blue+Pink': 'Lilac Blue',
  'Pink+Blue': 'Lilac Blue',
  'Blue+Brown': 'Slate Blue',
  'Brown+Blue': 'Slate Blue',
  'Blue+Black': 'Navy Blue',
  'Black+Blue': 'Navy Blue',
  'Blue+White': 'Sky Blue',
  'White+Blue': 'Sky Blue',

  // Purple combinations
  'Purple+Pink': 'Fuchsia',
  'Pink+Purple': 'Fuchsia',
  'Purple+Brown': 'Burgundy',
  'Brown+Purple': 'Burgundy',
  'Purple+Black': 'Plum',
  'Black+Purple': 'Plum',
  'Purple+White': 'Lavender',
  'White+Purple': 'Lavender',

  // Pink combinations
  'Pink+Brown': 'Dusty Rose',
  'Brown+Pink': 'Dusty Rose',
  'Pink+Black': 'Mulberry',
  'Black+Pink': 'Mulberry',
  'Pink+White': 'Baby Pink',
  'White+Pink': 'Baby Pink',

  // Brown combinations
  'Brown+Black': 'Espresso',
  'Black+Brown': 'Espresso',
  'Brown+White': 'Tan',
  'White+Brown': 'Tan',

  // Black & White
  'Black+White': 'Gray',
  'White+Black': 'Gray',
};

const COLOR_SWATCH_MAP: Record<string, { hex: string; border: string; lightText?: boolean }> = {
  'Red': { hex: '#EF4444', border: '#FCA5A5' },
  'Orange': { hex: '#F97316', border: '#FDBA74' },
  'Yellow': { hex: '#FACC15', border: '#FEF08A', lightText: true },
  'Green': { hex: '#22C55E', border: '#86EFAC' },
  'Blue': { hex: '#3B82F6', border: '#93C5FD' },
  'Purple': { hex: '#9333EA', border: '#D8B4FE' },
  'Pink': { hex: '#EC4899', border: '#F9A8D4' },
  'Brown': { hex: '#8B4513', border: '#CD853F' },
  'Black': { hex: '#111827', border: '#6B7280' },
  'White': { hex: '#FFFFFF', border: '#E5E7EB', lightText: true },
  'Vermilion': { hex: '#EA580C', border: '#FDBA74' },
  'Magenta': { hex: '#DB2777', border: '#F9A8D4' },
  'Coral Red': { hex: '#F43F5E', border: '#FDA4AF' },
  'Brick Red': { hex: '#991B1B', border: '#F87171' },
  'Maroon': { hex: '#7F1D1D', border: '#EF4444' },
  'Rose Pink': { hex: '#FB7185', border: '#FECDD3' },
  'Rose': { hex: '#FB7185', border: '#FECDD3' },
  'Amber': { hex: '#F59E0B', border: '#FDE68A' },
  'Olive': { hex: '#65A30D', border: '#BEF264' },
  'Terracotta Slate': { hex: '#64748B', border: '#CBD5E1' },
  'Russet': { hex: '#9A3412', border: '#FDBA74' },
  'Coral': { hex: '#FB7185', border: '#FECDD3' },
  'Rust': { hex: '#B45309', border: '#FCD34D' },
  'Burnt Umber': { hex: '#7C2D12', border: '#FDBA74' },
  'Peach': { hex: '#FDBA74', border: '#FFEDD5', lightText: true },
  'Lime Green': { hex: '#84CC16', border: '#D9F99D', lightText: true },
  'Chartreuse': { hex: '#84CC16', border: '#D9F99D', lightText: true },
  'Golden Ochre': { hex: '#CA8A04', border: '#FEF08A' },
  'Peach Coral': { hex: '#FCA5A5', border: '#FEE2E2', lightText: true },
  'Mustard': { hex: '#D97706', border: '#FDE68A' },
  'Olive Green': { hex: '#4D7C0F', border: '#BEF264' },
  'Lemon Cream': { hex: '#FEF08A', border: '#FEF9C3', lightText: true },
  'Teal': { hex: '#0D9488', border: '#5EEAD4' },
  'Deep Forest': { hex: '#1E293B', border: '#64748B' },
  'Sage Rose': { hex: '#A7F3D0', border: '#D1FAE5', lightText: true },
  'Moss Green': { hex: '#3F6212', border: '#A3E635' },
  'Dark Green': { hex: '#14532D', border: '#4ADE80' },
  'Mint': { hex: '#34D399', border: '#A7F3D0', lightText: true },
  'Violet': { hex: '#7C3AED', border: '#C4B5FD' },
  'Lilac Blue': { hex: '#818CF8', border: '#C7D2FE' },
  'Slate Blue': { hex: '#334155', border: '#94A3B8' },
  'Navy Blue': { hex: '#1E3A8A', border: '#60A5FA' },
  'Navy': { hex: '#1E3A8A', border: '#60A5FA' },
  'Sky Blue': { hex: '#38BDF8', border: '#BAE6FD', lightText: true },
  'Fuchsia': { hex: '#D946EF', border: '#F5D0FE' },
  'Burgundy': { hex: '#581C87', border: '#C084FC' },
  'Plum': { hex: '#4C1D95', border: '#A78BFA' },
  'Lavender': { hex: '#C084FC', border: '#E9D5FF' },
  'Dusty Rose': { hex: '#BE185D', border: '#FBCFE8' },
  'Mulberry': { hex: '#831843', border: '#F472B6' },
  'Baby Pink': { hex: '#F9A8D4', border: '#FCE7F3', lightText: true },
  'Espresso': { hex: '#451A03', border: '#B45309' },
  'Tan': { hex: '#D2B48C', border: '#F5DEB3', lightText: true },
  'Gray': { hex: '#9CA3AF', border: '#E5E7EB', lightText: true },
};

const COLOR_QUESTS = [
  { id: 1, color1: 'Red', color2: 'Yellow', target: 'Orange', text: 'Mix Orange! 🍊', desc: 'Can you mix Red and Yellow together?' },
  { id: 2, color1: 'Blue', color2: 'Yellow', target: 'Green', text: 'Mix Green! 🌿', desc: 'Can you mix Blue and Yellow together?' },
  { id: 3, color1: 'Red', color2: 'Blue', target: 'Purple', text: 'Mix Purple! 🍇', desc: 'Can you mix Red and Blue together?' },
  { id: 4, color1: 'Red', color2: 'White', target: 'Rose', text: 'Mix Rose Pink! 🌸', desc: 'Can you mix Red and White together?' },
  { id: 5, color1: 'Blue', color2: 'White', target: 'Sky Blue', text: 'Mix Sky Blue! ☁️', desc: 'Can you mix Blue and White together?' },
  { id: 6, color1: 'Black', color2: 'White', target: 'Gray', text: 'Mix Gray! 🐨', desc: 'Can you mix Black and White together?' },
];

export interface FirstWordItem {
  word: string;
  category: 'family' | 'food' | 'animals' | 'nature' | 'home' | 'actions';
  emoji: string;
  color: string;
  translations: Record<string, string>;
}

const FIRST_WORDS: FirstWordItem[] = [
  // 👨‍👩‍👧 Family & Dear Ones (1-9)
  { word: 'MOM', category: 'family', emoji: '👩‍🍼', color: 'bg-rose-500/10 border-rose-500/20 text-rose-400 font-black', translations: { hi: 'माँ', ta: 'அம்மா', te: 'అమ్మ', kn: 'ಅಮ್ಮ', ml: 'അമ്മ', mr: 'आई', bn: 'মা', gu: 'મમ્મી', pa: 'ਮਾਂ', as: 'মা', or: 'মা' } },
  { word: 'DAD', category: 'family', emoji: '👨‍🍼', color: 'bg-sky-500/10 border-sky-500/20 text-sky-400 font-black', translations: { hi: 'पापा', ta: 'அப்பா', te: 'నాన్న', kn: 'ಅಪ್ಪ', ml: 'അച്ഛൻ', mr: 'बाबा', bn: 'বাবা', gu: 'પપ્પા', pa: 'ਪਾਪਾ', as: 'দেউতা', or: 'ବାପା' } },
  { word: 'GRANDMA', category: 'family', emoji: '👵', color: 'bg-amber-500/10 border-amber-500/20 text-amber-400 font-black', translations: { hi: 'दादी', ta: 'பாட்டி', te: 'నానమ్మ', kn: 'ಅಜ್ಜಿ', ml: 'മുത്തശ്ശി', mr: 'आजी', bn: 'ঠাকুমা', gu: 'દાદી', pa: 'ਦਾਦੀ', as: 'আইতা', or: 'ଜେଜେମା' } },
  { word: 'GRANDPA', category: 'family', emoji: '👴', color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-black', translations: { hi: 'दादा', ta: 'தாத்தா', te: 'తాతయ్య', kn: 'ತಾತ', ml: 'മുത്തച്ഛൻ', mr: 'आजोबा', bn: 'দাদু', gu: 'દાદા', pa: 'ਦਾਦਾ', as: 'ককা', or: 'ଜେଜେବାପା' } },
  { word: 'AUNT', category: 'family', emoji: '👩', color: 'bg-pink-500/10 border-pink-500/20 text-pink-400 font-black', translations: { hi: 'मौसी', ta: 'சித்தி', te: 'పిన్ని', kn: 'ಚಿಕ್ಕಮ್ಮ', ml: 'ചിറ്റമ്മ', mr: 'मावशी', bn: 'মাসি', gu: 'માસી', pa: 'ਮਾਸੀ', as: 'মাহী', or: 'ମାଉସୀ' } },
  { word: 'UNCLE', category: 'family', emoji: '👨', color: 'bg-purple-500/10 border-purple-500/20 text-purple-400 font-black', translations: { hi: 'चाचा', ta: 'மாமா', te: 'మామయ్య', kn: 'ಮಾವ', ml: 'അമ്മാവൻ', mr: 'काका', bn: 'কাকা', gu: 'કાકા', pa: 'ਚਾਚਾ', as: 'খুড়া', or: 'ଦାଦା' } },
  { word: 'SISTER', category: 'family', emoji: '👧', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-black', translations: { hi: 'बहन', ta: 'அக்கா', te: 'అక్క', kn: 'ಅಕ್ಕ', ml: 'ചേച്ചി', mr: 'बहीण', bn: 'দিদি', gu: 'બહેન', pa: 'ਭੈਣ', as: 'ভনী', or: 'ଭଉଣୀ' } },
  { word: 'BROTHER', category: 'family', emoji: '👦', color: 'bg-blue-500/10 border-blue-500/20 text-blue-400 font-black', translations: { hi: 'भाई', ta: 'அண்ணா', te: 'అన్నయ్య', kn: 'ಅಣ್ಣ', ml: 'ചേട്ടൻ', mr: 'भाऊ', bn: 'দাদা', gu: 'ભાઈ', pa: 'ਭਰਾ', as: 'ভাই', or: 'ଭାଇ' } },
  { word: 'BABY', category: 'family', emoji: '👶', color: 'bg-orange-500/10 border-orange-500/20 text-orange-400 font-black', translations: { hi: 'बच्चा', ta: 'குழந்தை', te: 'పాప', kn: 'ಮಗು', ml: 'കുഞ്ഞ്', mr: 'बाळ', bn: 'শিশু', gu: 'બાળક', pa: 'ਬੱਚਾ', as: 'কেঁচুৱা', or: 'ଶିଶୁ' } },

  // 🍛 Food & Drinks (10-26)
  { word: 'WATER', category: 'food', emoji: '💧', color: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 font-black', translations: { hi: 'पानी', ta: 'தண்ணீர்', te: 'నీరు', kn: 'ನೀರು', ml: 'വെള്ളം', mr: 'पाणी', bn: 'জল', gu: 'પાણી', pa: 'ਪਾਣੀ', as: 'পানী', or: 'ପାଣି' } },
  { word: 'MILK', category: 'food', emoji: '🥛', color: 'bg-slate-300/10 border-slate-300/20 text-slate-200 font-black', translations: { hi: 'दूध', ta: 'பால்', te: 'పాలు', kn: 'ಹಾಲು', ml: 'പാൽ', mr: 'दूध', bn: 'দুধ', gu: 'દૂધ', pa: 'ਦੁੱਧ', as: 'গাখীৰ', or: 'କ୍ଷୀର' } },
  { word: 'BREAD', category: 'food', emoji: '🍞', color: 'bg-amber-600/10 border-amber-600/20 text-amber-500 font-black', translations: { hi: 'रोटी', ta: 'ரொட்டி', te: 'రొట్టె', kn: 'ರೊಟ್ಟಿ', ml: 'റൊട്ടി', mr: 'पोळी', bn: 'রুটি', gu: 'રોટલી', pa: 'ਰੋਟੀ', as: 'ৰুটি', or: 'ରୁଟି' } },
  { word: 'RICE', category: 'food', emoji: '🍚', color: 'bg-zinc-300/10 border-zinc-300/20 text-zinc-300 font-black', translations: { hi: 'चावल', ta: 'சாதம்', te: 'అన్నం', kn: 'ಅನ್ನ', ml: 'ചോറ്', mr: 'भात', bn: 'ভাত', gu: 'ભાત', pa: 'ਚੌਲ', as: 'ভাত', or: 'ଭାତ' } },
  { word: 'SOUP', category: 'food', emoji: '🍲', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 font-black', translations: { hi: 'सूप', ta: 'சூப்', te: 'సూప్', kn: 'ಸೂಪ್', ml: 'സൂപ്പ്', mr: 'सूप', bn: 'স্যুপ', gu: 'સૂપ', pa: 'ਸੂਪ', as: 'চুপ', or: 'ସୁପ୍' } },
  { word: 'BANANA', category: 'food', emoji: '🍌', color: 'bg-yellow-400/10 border-yellow-400/20 text-yellow-300 font-black', translations: { hi: 'केला', ta: 'வாழைப்பழம்', te: 'అరటిపండు', kn: 'ಬಾಳೆಹಣ್ಣು', ml: 'പഴം', mr: 'केळी', bn: 'কলা', gu: 'કેળું', pa: 'ਕੇਲਾ', as: 'কল', or: 'କଦଳୀ' } },
  { word: 'APPLE', category: 'food', emoji: '🍎', color: 'bg-red-500/10 border-red-500/20 text-red-400 font-black', translations: { hi: 'सेब', ta: 'ஆப்பிள்', te: 'ఆపిల్', kn: 'ಸೇಬು', ml: 'ആപ്പിൾ', mr: 'सफरचंद', bn: 'আপেল', gu: 'સફરજન', pa: 'ਸੇਬ', as: 'আপেল', or: 'ସେଓ' } },
  { word: 'MANGO', category: 'food', emoji: '🥭', color: 'bg-amber-500/10 border-amber-500/20 text-amber-400 font-black', translations: { hi: 'आम', ta: 'மாம்பழம்', te: 'మామిడి', kn: 'ಮಾವಿನಹಣ್ಣು', ml: 'മാമ്പഴം', mr: 'आंबा', bn: 'আম', gu: 'કેરી', pa: 'ਅੰਬ', as: 'আম', or: 'ଆମ୍ବ' } },
  { word: 'YOGURT', category: 'food', emoji: '🥣', color: 'bg-teal-500/10 border-teal-500/20 text-teal-300 font-black', translations: { hi: 'दही', ta: 'தயிர்', te: 'పెరుగు', kn: 'ಮೊಸರು', ml: 'തൈര്', mr: 'दही', bn: 'দই', gu: 'દહીં', pa: 'ਦਹੀਂ', as: 'দৈ', or: 'ଦହି' } },
  { word: 'ORANGE', category: 'food', emoji: '🍊', color: 'bg-orange-400/10 border-orange-400/20 text-orange-300 font-black', translations: { hi: 'संतरा', ta: 'ஆரஞ்சு', te: 'నారింజ', kn: 'ಕಿತ್ತಳೆ', ml: 'ഓറഞ്ച്', mr: 'संत्री', bn: 'কমলা', gu: 'નારંગી', pa: 'ਸੰਤਰਾ', as: 'কমলা', or: 'କମଳା' } },
  { word: 'GRAPES', category: 'food', emoji: '🍇', color: 'bg-purple-500/10 border-purple-500/20 text-purple-400 font-black', translations: { hi: 'अंगूर', ta: 'திராட்சை', te: 'ద్రాక్ష', kn: 'ದ್ರಾಕ್ಷಿ', ml: 'മുന്തിരി', mr: 'द्राक्षे', bn: 'আঙুর', gu: 'દ્રાક્ષ', pa: 'ਅੰਗੂਰ', as: 'আঙুৰ', or: 'ଅଙ୍ଗୁର' } },
  { word: 'PORRIDGE', category: 'food', emoji: '🥣', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-black', translations: { hi: 'दलिया', ta: 'கஞ்சி', te: 'జావ', kn: 'ಗಂಜಿ', ml: 'കഞ്ഞി', mr: 'पेज', bn: 'খুদের জাউ', gu: 'ખીચડી', pa: 'ਦਲੀਆ', as: 'খীচিৰি', or: 'ଖିଚୁଡ଼ି' } },
  { word: 'COOKIE', category: 'food', emoji: '🍪', color: 'bg-amber-700/10 border-amber-700/20 text-amber-500 font-black', translations: { hi: 'बिस्कुट', ta: 'பிஸ்கட்', te: 'బిస్కెట్', kn: 'ಬಿಸ್ಕತ್ತು', ml: 'ബിസ്കറ്റ്', mr: 'बिस्किट', bn: 'বিস্কুট', gu: 'બિસ્કિટ', pa: 'ਬਿਸਕੁਟ', as: 'বিস্কুট', or: 'ବିସ୍କୁଟ୍' } },
  { word: 'PUDDING', category: 'food', emoji: '🍮', color: 'bg-rose-500/10 border-rose-500/20 text-rose-400 font-black', translations: { hi: 'खीर', ta: 'பாயசம்', te: 'పాయసం', kn: 'ಪಾಯಸ', ml: 'പായസം', mr: 'खीर', bn: 'পায়েস', gu: 'ખીર', pa: 'ਖੀਰ', as: 'পায়স', or: 'କ୍ଷୀରି' } },
  { word: 'BUTTER', category: 'food', emoji: '🧈', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 font-black', translations: { hi: 'मक्खन', ta: 'வெண்ணெய்', te: 'వెన్న', kn: 'ಬೆಣ್ಣೆ', ml: 'വെണ്ണ', mr: 'लोणी', bn: 'মাখন', gu: 'માખણ', pa: 'ਮੱਖਣ', as: 'মাখন', or: 'ଲହୁଣୀ' } },
  { word: 'SWEET', category: 'food', emoji: '🍬', color: 'bg-amber-400/10 border-amber-400/20 text-amber-400 font-black', translations: { hi: 'मिठाई', ta: 'இனிப்பு', te: 'మిఠాయి', kn: 'ಸಿಹಿ', ml: 'മധുരം', mr: 'खाऊ', bn: 'মিষ্টি', gu: 'મીઠાઈ', pa: 'ਮਿਠਾਈ', as: 'মিঠাই', or: 'ମିଠା' } },
  { word: 'JUICE', category: 'food', emoji: '🧃', color: 'bg-amber-600/10 border-amber-600/20 text-amber-600 font-black', translations: { hi: 'जूस', ta: 'பழச்சாறு', te: 'పండ్ల రసం', kn: 'ಹಣ್ಣಿನ ರಸ', ml: 'ജ്യൂസ്', mr: 'फळांचा रस', bn: 'ফলের রস', gu: 'જ્યુસ', pa: 'ਜੂਸ', as: 'ফলৰ ৰস', or: 'ଫଳ ରସ' } },

  // 🌿 Nature & Wonders (27-34)
  { word: 'FLOWER', category: 'nature', emoji: '🌸', color: 'bg-pink-400/10 border-pink-400/20 text-pink-300 font-black', translations: { hi: 'फूल', ta: 'பூ', te: 'పువ్వు', kn: 'ಹೂವು', ml: 'പൂവ്', mr: 'फूल', bn: 'ফুল', gu: 'ફૂલ', pa: 'ਫੁੱਲ', as: 'ফুল', or: 'ଫୁଲ' } },
  { word: 'SUN', category: 'nature', emoji: '☀️', color: 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400 font-black', translations: { hi: 'सूरज', ta: 'சூரியன்', te: 'సూర్యుడు', kn: 'ಸೂರ್ಯ', ml: 'സൂര്യൻ', mr: 'सूर्य', bn: 'সূর্য', gu: 'સૂરજ', pa: 'ਸੂਰਜ', as: 'সূৰ্য', or: 'ସୂର୍ଯ୍ୟ' } },
  { word: 'MOON', category: 'nature', emoji: '🌙', color: 'bg-indigo-300/10 border-indigo-300/20 text-indigo-300 font-black', translations: { hi: 'चाँद', ta: 'நிலா', te: 'చంద్రుడు', kn: 'ಚಂದ್ರ', ml: 'ചന്ദ്രൻ', mr: 'चंद्र', bn: 'চাঁদ', gu: 'ચાંદો', pa: 'ਚੰਨ', as: 'জোন', or: 'ଜହ୍ନ' } },
  { word: 'STAR', category: 'nature', emoji: '⭐', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 font-black', translations: { hi: 'तारा', ta: 'நட்சத்திரம்', te: 'నక్షత్రం', kn: 'ನಕ್ಷತ್ರ', ml: 'നക്ഷത്രം', mr: 'चांदणी', bn: 'তারা', gu: 'તારો', pa: 'ਤਾਰਾ', as: 'তৰা', or: 'ତାରା' } },
  { word: 'RAIN', category: 'nature', emoji: '🌧️', color: 'bg-sky-400/10 border-sky-400/20 text-sky-400 font-black', translations: { hi: 'बारिश', ta: 'மழை', te: 'వర్షం', kn: 'ಮಳೆ', ml: 'മഴ', mr: 'पाऊस', bn: 'বৃষ্টি', gu: 'વરસાદ', pa: 'ਮੀਂਹ', as: 'বৰষুণ', or: 'ବର୍ଷା' } },
  { word: 'CLOUD', category: 'nature', emoji: '☁️', color: 'bg-blue-300/10 border-blue-300/20 text-blue-300 font-black', translations: { hi: 'बादल', ta: 'மேகம்', te: 'మేఘం', kn: 'ಮೋಡ', ml: 'മേഘം', mr: 'ढग', bn: 'মেঘ', gu: 'વાદળ', pa: 'ਬੱਦਲ', as: 'ডাৱৰ', or: 'ମେଘ' } },
  { word: 'TREE', category: 'nature', emoji: '🌳', color: 'bg-emerald-600/10 border-emerald-600/20 text-emerald-400 font-black', translations: { hi: 'पेड़', ta: 'மரம்', te: 'చెట్టు', kn: 'ಮರ', ml: 'മരം', mr: 'झाड', bn: 'গাছ', gu: 'ઝાડ', pa: 'ਰੁੱਖ', as: 'গছ', or: 'ଗଛ' } },
  { word: 'LEAF', category: 'nature', emoji: '🍃', color: 'bg-green-500/10 border-green-500/20 text-green-400 font-black', translations: { hi: 'पत्ता', ta: 'இலை', te: 'ఆకు', kn: 'ಎಲೆ', ml: 'ഇല', mr: 'पान', bn: 'পাতা', gu: 'પાંદડું', pa: 'ਪੱਤਾ', as: 'পাত', or: 'ପତ୍ର' } },

  // 🐾 Animals & Birds (35-52)
  { word: 'COW', category: 'animals', emoji: '🐮', color: 'bg-amber-500/10 border-amber-500/20 text-amber-400 font-black', translations: { hi: 'गाय', ta: 'பசு', te: 'ఆవు', kn: 'ಹಸು', ml: 'പശു', mr: 'गाय', bn: 'গরু', gu: 'ગાય', pa: 'ਗਾਂ', as: 'গৰু', or: 'ଗାଈ' } },
  { word: 'DOG', category: 'animals', emoji: '🐶', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 font-black', translations: { hi: 'कुत्ता', ta: 'நாய்', te: 'కుక్క', kn: 'ನಾಯಿ', ml: 'നായ', mr: 'कुत्रा', bn: 'কুকুর', gu: 'કૂતરો', pa: 'ਕੁੱਤਾ', as: 'কুকুৰ', or: 'କୁକୁର' } },
  { word: 'CAT', category: 'animals', emoji: '🐱', color: 'bg-orange-400/10 border-orange-400/20 text-orange-400 font-black', translations: { hi: 'बिल्ली', ta: 'பூனை', te: 'పిల్లి', kn: 'ಬೆಕ್ಕು', ml: 'പൂച്ച', mr: 'मांजर', bn: 'বিড়াল', gu: 'બિલાડી', pa: 'ਬਿੱਲੀ', as: 'মেকুৰী', or: 'ବିରାଡ଼ି' } },
  { word: 'ELEPHANT', category: 'animals', emoji: '🐘', color: 'bg-slate-400/10 border-slate-400/20 text-slate-300 font-black', translations: { hi: 'हाथी', ta: 'யானை', te: 'ఏనుగు', kn: 'ಆನೆ', ml: 'ആന', mr: 'हत्ती', bn: 'হাতি', gu: 'હાથી', pa: 'ਹਾਥੀ', as: 'হাতী', or: 'ହାତୀ' } },
  { word: 'MONKEY', category: 'animals', emoji: '🐒', color: 'bg-amber-600/10 border-amber-600/20 text-amber-500 font-black', translations: { hi: 'बंदर', ta: 'குரங்கு', te: 'కోతి', kn: 'ಕೋತಿ', ml: 'കുരങ്ങ്', mr: 'माकड', bn: 'বানর', gu: 'વાંદરો', pa: 'ਬਾਂਦਰ', as: 'বান্দৰ', or: 'ମାଙ୍କଡ଼' } },
  { word: 'PARROT', category: 'animals', emoji: '🦜', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-black', translations: { hi: 'तोता', ta: 'கிளி', te: 'చిలుక', kn: 'ಗಿಳಿ', ml: 'തത്ത', mr: 'पोपट', bn: 'টিয়া', gu: 'પોપટ', pa: 'ਤੋਤਾ', as: 'ভাটৌ', or: 'ଶୁଆ' } },
  { word: 'PEACOCK', category: 'animals', emoji: '🦚', color: 'bg-teal-500/10 border-teal-500/20 text-teal-400 font-black', translations: { hi: 'मोर', ta: 'மயில்', te: 'నెమలి', kn: 'ನವಿಲು', ml: 'മയിൽ', mr: 'मोर', bn: 'ময়ূর', gu: 'મોર', pa: 'ਮੋਰ', as: 'ময়ূৰ', or: 'ମୟୂର' } },
  { word: 'BIRD', category: 'animals', emoji: '🐦', color: 'bg-sky-400/10 border-sky-400/20 text-sky-400 font-black', translations: { hi: 'चिड़िया', ta: 'பறவை', te: 'పక్షి', kn: 'ಹಕ್ಕಿ', ml: 'പക്ഷി', mr: 'चिमणी', bn: 'পাখি', gu: 'પક્ષી', pa: 'ਪੰਛੀ', as: 'চৰাই', or: 'ଚଢ଼େଇ' } },
  { word: 'GOAT', category: 'animals', emoji: '🐐', color: 'bg-stone-400/10 border-stone-400/20 text-stone-300 font-black', translations: { hi: 'बकरी', ta: 'ஆடு', te: 'మేక', kn: 'ಮೇಕೆ', ml: 'ആട്', mr: 'शेळी', bn: 'ছাগল', gu: 'બકરી', pa: 'ਬੱਕਰੀ', as: 'ছাগলী', or: 'ଛେଳି' } },
  { word: 'HORSE', category: 'animals', emoji: '🐴', color: 'bg-amber-700/10 border-amber-700/20 text-amber-500 font-black', translations: { hi: 'घोड़ा', ta: 'குதிரை', te: 'గుర్రం', kn: 'ಕುದುರೆ', ml: 'കുതിര', mr: 'घोडा', bn: 'ঘোড়া', gu: 'ઘોડો', pa: 'ਘੋੜਾ', as: 'ঘোঁৰা', or: 'ଘୋଡ଼ା' } },
  { word: 'LION', category: 'animals', emoji: '🦁', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500 font-black', translations: { hi: 'शेर', ta: 'சிங்கம்', te: 'సింహం', kn: 'ಸಿಂಹ', ml: 'സിംഹം', mr: 'सिंह', bn: 'সিংহ', gu: 'સિંહ', pa: 'ਸ਼ੇਰ', as: 'সিংহ', or: 'ସିଂହ' } },
  { word: 'BUTTERFLY', category: 'animals', emoji: '🦋', color: 'bg-pink-500/10 border-pink-500/20 text-pink-400 font-black', translations: { hi: 'तितली', ta: 'வண்ணத்துப்பூச்சி', te: 'సీతాకోకచిలుక', kn: 'ಚಿಟ್ಟೆ', ml: 'പൂമ്പാറ്റ', mr: 'फुलपाखरू', bn: 'প্রজাপতি', gu: 'પતંગિયું', pa: 'ਤਿਤਲੀ', as: 'পখিলা', or: 'ପ୍ରଜାପତି' } },
  { word: 'FISH', category: 'animals', emoji: '🐟', color: 'bg-blue-400/10 border-blue-400/20 text-blue-400 font-black', translations: { hi: 'मछली', ta: 'மீன்', te: 'చేప', kn: 'ಮೀನು', ml: 'മീൻ', mr: 'मासा', bn: 'মাছ', gu: 'માછલી', pa: 'ਮੱਛੀ', as: 'মাছ', or: 'ମାଛ' } },
  { word: 'CROW', category: 'animals', emoji: '🐦‍⬛', color: 'bg-zinc-500/10 border-zinc-500/20 text-zinc-300 font-black', translations: { hi: 'कौआ', ta: 'காகம்', te: 'కాకి', kn: 'ಕಾಗೆ', ml: 'കാക്ക', mr: 'कावळा', bn: 'কাক', gu: 'કાગડો', pa: 'ਕਾਂ', as: 'কাউৰী', or: 'କାଉ' } },
  { word: 'CAMEL', category: 'animals', emoji: '🐪', color: 'bg-amber-500/10 border-amber-500/20 text-amber-400 font-black', translations: { hi: 'ऊँट', ta: 'ஒட்டகம்', te: 'ఒంటె', kn: 'ಒಂಟೆ', ml: 'ഒട്ടകം', mr: 'उंट', bn: 'উট', gu: 'ઊંટ', pa: 'ਊਠ', as: 'উট', or: 'ଓଟ' } },
  { word: 'BEAR', category: 'animals', emoji: '🐻', color: 'bg-amber-800/10 border-amber-800/20 text-amber-600 font-black', translations: { hi: 'भालू', ta: 'கரடி', te: 'ఎలుగుబంటి', kn: 'ಕರಡಿ', ml: 'കരടി', mr: 'अस्वल', bn: 'ভাল্লুক', gu: 'રીંછ', pa: 'ਰਿੱਛ', as: 'ভালুক', or: 'ଭାଲୁ' } },
  { word: 'RABBIT', category: 'animals', emoji: '🐰', color: 'bg-rose-300/10 border-rose-300/20 text-rose-300 font-black', translations: { hi: 'खरगोश', ta: 'முயல்', te: 'కుందేలు', kn: 'ಮೊಲ', ml: 'മുയൽ', mr: 'ससा', bn: 'খরগোশ', gu: 'સસલું', pa: 'ਖਰਗੋਸ਼', as: 'শহা', or: 'ଠେକୁଆ' } },
  { word: 'DUCK', category: 'animals', emoji: '🦆', color: 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400 font-black', translations: { hi: 'बत्तख', ta: 'வாத்து', te: 'బాతు', kn: 'ಬಾತುಕೋಳಿ', ml: 'താറാവ്', mr: 'बदक', bn: 'হাঁস', gu: 'બતક', pa: 'ਬੱਤਖ', as: 'হাঁহ', or: 'ବତକ' } },

  // 🏠 Home, Vehicles & Everyday Toys (53-88)
  { word: 'CAR', category: 'home', emoji: '🚗', color: 'bg-red-500/10 border-red-500/20 text-red-500 font-black', translations: { hi: 'गाड़ी', ta: 'கார்', te: 'కారు', kn: 'ಕಾರು', ml: 'കാർ', mr: 'गाडी', bn: 'গাড়ি', gu: 'ગાડી', pa: 'ਕਾਰ', as: 'গাড়ী', or: 'ଗାଡ଼ି' } },
  { word: 'SCOOTER', category: 'home', emoji: '🛵', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 font-black', translations: { hi: 'स्कूटर', ta: 'ஸ்கூட்டர்', te: 'స్కూటర్', kn: 'ಸ್ಕೂಟರ್', ml: 'സ്കൂട്ടർ', mr: 'स्कूटर', bn: 'স্কুটার', gu: 'સ્કૂટર', pa: 'ਸਕੂਟਰ', as: 'স্কুটাৰ', or: 'ସ୍କୁଟର' } },
  { word: 'BUS', category: 'home', emoji: '🚌', color: 'bg-amber-500/10 border-amber-500/20 text-amber-400 font-black', translations: { hi: 'बस', ta: 'பேருந்து', te: 'బస్సు', kn: 'ಬಸ್ಸು', ml: 'ബസ്', mr: 'बस', bn: 'বাস', gu: 'બસ', pa: 'ਬੱਸ', as: 'বাছ', or: 'ବସ୍' } },
  { word: 'TRAIN', category: 'home', emoji: '🚂', color: 'bg-zinc-400/10 border-zinc-400/20 text-zinc-300 font-black', translations: { hi: 'रेलगाड़ी', ta: 'ரயில்', te: 'రైలు', kn: 'ರೈಲು', ml: 'തീവണ്ടി', mr: 'रेल्वे', bn: 'রেলগাড়ি', gu: 'ટ્રેન', pa: 'ਰੇਲਗੱਡੀ', as: 'ৰেলগাড়ী', or: 'ରେଳଗାଡ଼ି' } },
  { word: 'BICYCLE', category: 'home', emoji: '🚲', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-black', translations: { hi: 'साइकिल', ta: 'மிதிவண்டி', te: 'సైకిల్', kn: 'ಸೈಕಲ್', ml: 'സൈക്കിൾ', mr: 'सायकल', bn: 'সাইকেল', gu: 'સાયકલ', pa: 'ਸਾਈਕਲ', as: 'চাইকেল', or: 'ସାଇକେଲ' } },
  { word: 'AIRPLANE', category: 'home', emoji: '✈️', color: 'bg-sky-500/10 border-sky-500/20 text-sky-400 font-black', translations: { hi: 'हवाई जहाज़', ta: 'விமானம்', te: 'విమానం', kn: 'ವಿಮಾನ', ml: 'വിമാനം', mr: 'विमान', bn: 'বিমান', gu: 'વિમાન', pa: 'ਹਵਾਈ ਜਹਾਜ਼', as: 'বিমান', or: 'ବିମାନ' } },
  { word: 'BOAT', category: 'home', emoji: '⛵', color: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 font-black', translations: { hi: 'नाव', ta: 'படகு', te: 'పడవ', kn: 'ದೋಣಿ', ml: 'വള്ളം', mr: 'होडी', bn: 'নৌকা', gu: 'હોડી', pa: 'ਕਿਸ਼ਤੀ', as: 'নাও', or: 'ଡଙ୍ଗା' } },
  { word: 'BALL', category: 'home', emoji: '⚽', color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-black', translations: { hi: 'गेंद', ta: 'பந்து', te: 'బంతి', kn: 'ಚೆಂಡು', ml: 'പന്ത്', mr: 'चेंडू', bn: 'বল', gu: 'દડો', pa: 'ਗੇਂਦ', as: 'বল', or: 'ବଲ୍' } },
  { word: 'DOLL', category: 'home', emoji: '🪆', color: 'bg-pink-500/10 border-pink-500/20 text-pink-400 font-black', translations: { hi: 'गुड़िया', ta: 'பொம்மை', te: 'బొమ్మ', kn: 'ಗೊಂಬೆ', ml: 'പാവ', mr: 'बाहुली', bn: 'পুতুল', gu: 'ઢીંગલી', pa: 'ਗੁੱਡੀ', as: 'পুতলা', or: 'କଣ୍ଢେଇ' } },
  { word: 'BALLOON', category: 'home', emoji: '🎈', color: 'bg-rose-500/10 border-rose-500/20 text-rose-500 font-black', translations: { hi: 'गुब्बारा', ta: 'பலூன்', te: 'బెలూన్', kn: 'ಬಲೂನು', ml: 'ബലൂൺ', mr: 'फुगा', bn: 'বেলুন', gu: 'ફુગ્ગો', pa: 'ਗੁਬਾਰਾ', as: 'বেলুন', or: 'ବେଲୁନ୍' } },
  { word: 'TOY', category: 'home', emoji: '🧸', color: 'bg-amber-600/10 border-amber-600/20 text-amber-400 font-black', translations: { hi: 'खिलौना', ta: 'விளையாட்டு பொம்மை', te: 'ఆటబొమ్మ', kn: 'ಆಟಿಕೆ', ml: 'കളിപ്പാട്ടം', mr: 'खेळणी', bn: 'খেলনা', gu: 'રમકડું', pa: 'ਖਿਡੌਣਾ', as: 'পুতলা', or: 'ଖେଳଣା' } },
  { word: 'SWING', category: 'home', emoji: '🎠', color: 'bg-purple-500/10 border-purple-500/20 text-purple-400 font-black', translations: { hi: 'झूला', ta: 'ஊஞ்சல்', te: 'ఊయల', kn: 'ಉಯ್ಯಾಲೆ', ml: 'ഊഞ്ഞാൽ', mr: 'झोका', bn: 'দোলনা', gu: 'હિંચકો', pa: 'ਪੀਂਘ', as: 'দোলনা', or: 'ଦୋଳି' } },
  { word: 'HOME', category: 'home', emoji: '🏠', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-black', translations: { hi: 'घर', ta: 'வீடு', te: 'ఇల్లు', kn: 'ಮನೆ', ml: 'വീട്', mr: 'घर', bn: 'বাড়ি', gu: 'ઘર', pa: 'ਘਰ', as: 'ঘৰ', or: 'ଘର' } },
  { word: 'DOOR', category: 'home', emoji: '🚪', color: 'bg-amber-700/10 border-amber-700/20 text-amber-500 font-black', translations: { hi: 'दरवाज़ा', ta: 'கதவு', te: 'తలుపు', kn: 'ಬಾಗಿಲು', ml: 'വാതിൽ', mr: 'दार', bn: 'দরজা', gu: 'દરવાજો', pa: 'ਦਰਵਾਜ਼ਾ', as: 'দুৱাৰ', or: 'କବାଟ' } },
  { word: 'WINDOW', category: 'home', emoji: '🪟', color: 'bg-sky-400/10 border-sky-400/20 text-sky-400 font-black', translations: { hi: 'खिड़की', ta: 'ஜன்னல்', te: 'కిటికీ', kn: 'ಕಿಟಕಿ', ml: 'ജനൽ', mr: 'खिडकी', bn: 'জানালা', gu: 'બારી', pa: 'ਖਿੜਕੀ', as: 'খিৰিকী', or: 'ଝରକା' } },
  { word: 'FAN', category: 'home', emoji: '🪭', color: 'bg-teal-400/10 border-teal-400/20 text-teal-300 font-black', translations: { hi: 'पंखा', ta: 'மின்விசிறி', te: 'ఫ్యాన్', kn: 'ಫ್ಯಾನ್', ml: 'ഫാൻ', mr: 'पंखा', bn: 'পাখা', gu: 'પંખો', pa: 'ਪੱਖਾ', as: 'বিচনী', or: 'ପଙ୍ଖା' } },
  { word: 'CLOCK', category: 'home', emoji: '⏰', color: 'bg-rose-400/10 border-rose-400/20 text-rose-400 font-black', translations: { hi: 'घड़ी', ta: 'கடிகாரம்', te: 'గడియారం', kn: 'ಗಡಿಯಾರ', ml: 'ഘടികാരം', mr: 'घड्याळ', bn: 'ঘড়ি', gu: 'ઘડિયાળ', pa: 'ਘੜੀ', as: 'ঘড়ী', or: 'ଘଣ୍ଟା' } },
  { word: 'LIGHT', category: 'home', emoji: '💡', color: 'bg-yellow-400/10 border-yellow-400/20 text-yellow-300 font-black', translations: { hi: 'बत्ती', ta: 'விளக்கு', te: 'దీపం', kn: 'ದೀಪ', ml: 'വിളക്ക്', mr: 'दिवा', bn: 'আলো', gu: 'લાઈટ', pa: 'ਬੱਤੀ', as: 'চাকি', or: 'ଆଲୁଅ' } },
  { word: 'KEY', category: 'home', emoji: '🔑', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 font-black', translations: { hi: 'चाबी', ta: 'சாவி', te: 'తాళంచెవి', kn: 'ಕೀಲಿ', ml: 'താക്കോൽ', mr: 'किल्ली', bn: 'চাবি', gu: 'ચાવી', pa: 'ਚਾਬੀ', as: 'চাবি', or: 'ଚାବି' } },
  { word: 'BED', category: 'home', emoji: '🛏️', color: 'bg-indigo-400/10 border-indigo-400/20 text-indigo-400 font-black', translations: { hi: 'बिस्तर', ta: 'படுக்கை', te: 'మంచం', kn: 'ಹಾಸಿಗೆ', ml: 'കിടക്ക', mr: 'पलंग', bn: 'বিছানা', gu: 'પથારી', pa: 'ਬਿਸਤਰਾ', as: 'বিছনা', or: 'ବିଛଣା' } },
  { word: 'BLANKET', category: 'home', emoji: '🛋️', color: 'bg-purple-400/10 border-purple-400/20 text-purple-400 font-black', translations: { hi: 'कंबल', ta: 'போர்வை', te: 'దుప్పటి', kn: 'ಹೊದಿಕೆ', ml: 'പുതപ്പ്', mr: 'पांघरूण', bn: 'কম্বল', gu: 'ધાબળો', pa: 'ਕੰਬਲ', as: 'কম্বল', or: 'କମ୍ବଳ' } },
  { word: 'PLATE', category: 'home', emoji: '🍽️', color: 'bg-slate-300/10 border-slate-300/20 text-slate-200 font-black', translations: { hi: 'थाली', ta: 'தட்டு', te: 'పళ్లెం', kn: 'ತಟ್ಟೆ', ml: 'പാത്രം', mr: 'ताट', bn: 'থালা', gu: 'થાળી', pa: 'ਥਾਲੀ', as: 'কাহী', or: 'ଥାଳି' } },
  { word: 'CUP', category: 'home', emoji: '🥛', color: 'bg-cyan-400/10 border-cyan-400/20 text-cyan-300 font-black', translations: { hi: 'कप', ta: 'கோப்பை', te: 'కప్పు', kn: 'ಲೋಟ', ml: 'കപ്പ്', mr: 'पेला', bn: 'কাপ', gu: 'કપ', pa: 'ਕੱਪ', as: 'কাপ', or: 'କପ୍' } },
  { word: 'SPOON', category: 'home', emoji: '🥄', color: 'bg-zinc-400/10 border-zinc-400/20 text-zinc-300 font-black', translations: { hi: 'चम्मच', ta: 'கரண்டி', te: 'చెంచా', kn: 'ಚಮಚ', ml: 'സ്പൂൺ', mr: 'चमचा', bn: 'চামচ', gu: 'ચમચી', pa: 'ਚਮਚਾ', as: 'চামুচ', or: 'ଚାମଚ' } },
  { word: 'BOWL', category: 'home', emoji: '🥣', color: 'bg-amber-400/10 border-amber-400/20 text-amber-400 font-black', translations: { hi: 'कटोरी', ta: 'கிண்ணம்', te: 'గిన్నె', kn: 'ಬಟ್ಟಲು', ml: 'കിണ്ണം', mr: 'वाटी', bn: 'বাটি', gu: 'વાટકી', pa: 'ਕੌਲੀ', as: 'বাতি', or: 'ଗିନା' } },
  { word: 'BOTTLE', category: 'home', emoji: '🍼', color: 'bg-sky-400/10 border-sky-400/20 text-sky-400 font-black', translations: { hi: 'बोतल', ta: 'பாட்டில்', te: 'సీసా', kn: 'ಬಾಟಲಿ', ml: 'കുപ്പി', mr: 'बाटली', bn: 'বোতল', gu: 'બોટલ', pa: 'ਬੋਤਲ', as: 'বটল', or: 'ବୋତଲ' } },
  { word: 'SHOE', category: 'home', emoji: '👟', color: 'bg-blue-500/10 border-blue-500/20 text-blue-400 font-black', translations: { hi: 'जूता', ta: 'காலணி', te: 'బూట్లు', kn: 'ಶೂ', ml: 'ഷൂസ്', mr: 'बूट', bn: 'জুতো', gu: 'બૂટ', pa: 'ਜੁੱਤੀ', as: 'জোতা', or: 'ଜୋତା' } },
  { word: 'SLIPPER', category: 'home', emoji: '🩴', color: 'bg-teal-500/10 border-teal-500/20 text-teal-400 font-black', translations: { hi: 'चप्पल', ta: 'செருப்பு', te: 'చెప్పులు', kn: 'ಚಪ್ಪಲಿ', ml: 'ചെരിപ്പ്', mr: 'चप्पल', bn: 'চপ্পল', gu: 'ચંપલ', pa: 'ਚੱਪਲ', as: 'চেণ্ডেল', or: 'ଚପଲ' } },
  { word: 'SOCKS', category: 'home', emoji: '🧦', color: 'bg-rose-400/10 border-rose-400/20 text-rose-400 font-black', translations: { hi: 'मोज़ा', ta: 'காலுறை', te: 'సాక్స్', kn: 'ಕಾಲುಚೀಲ', ml: 'സോക്സ്', mr: 'मोजे', bn: 'মোজা', gu: 'મોજાં', pa: 'ਜੁਰਾਬਾਂ', as: 'মোজা', or: 'ମୋଜା' } },
  { word: 'HAT', category: 'home', emoji: '🧢', color: 'bg-amber-500/10 border-amber-500/20 text-amber-400 font-black', translations: { hi: 'टोपी', ta: 'தொப்பி', te: 'టోపీ', kn: 'ಟೋಪಿ', ml: 'തൊപ്പി', mr: 'टोपी', bn: 'টুপি', gu: 'ટોપી', pa: 'ਟੋਪੀ', as: 'টুপী', or: 'ଟୋପି' } },
  { word: 'DRESS', category: 'home', emoji: '👗', color: 'bg-pink-500/10 border-pink-500/20 text-pink-400 font-black', translations: { hi: 'कपड़े', ta: 'ஆடை', te: 'దుస్తులు', kn: 'ಉಡುಪು', ml: 'വസ്ത്രം', mr: 'कपडे', bn: 'জামা', gu: 'કપડાં', pa: 'ਕੱਪੜੇ', as: 'কাপোৰ', or: 'ପୋଷାକ' } },
  { word: 'BAG', category: 'home', emoji: '🎒', color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-black', translations: { hi: 'बस्ता', ta: 'பை', te: 'సంచి', kn: 'ಚೀಲ', ml: 'ബാഗ്', mr: 'दफ्तर', bn: 'ব্যাগ', gu: 'દફતર', pa: 'ਬਸਤਾ', as: 'মোনা', or: 'ବ୍ୟାଗ୍' } },
  { word: 'COMB', category: 'home', emoji: '🪮', color: 'bg-yellow-600/10 border-yellow-600/20 text-yellow-500 font-black', translations: { hi: 'कंघी', ta: 'சீப்பு', te: 'దువ్వెన', kn: 'ಬಾಚಣಿಗೆ', ml: 'ചീപ്പ്', mr: 'फणी', bn: 'চিরুনি', gu: 'કાંસકો', pa: 'ਕੰਘੀ', as: 'ফণি', or: 'ପାନିଆ' } },
  { word: 'SOAP', category: 'home', emoji: '🧼', color: 'bg-emerald-400/10 border-emerald-400/20 text-emerald-300 font-black', translations: { hi: 'साबुन', ta: 'சோப்பு', te: 'సబ్బు', kn: 'ಸಾಬೂನು', ml: 'സോപ്പ്', mr: 'साबण', bn: 'সাবান', gu: 'સાબુ', pa: 'ਸਾਬਣ', as: 'চাবোন', or: 'ସାବୁନ' } },
  { word: 'TOWEL', category: 'home', emoji: '🧖', color: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 font-black', translations: { hi: 'तौलिया', ta: 'துண்டு', te: 'తువ్వాలు', kn: 'ಟವೆಲ್', ml: 'തോർത്ത്', mr: 'टॉवेल', bn: 'তোয়ালে', gu: 'ટુવાલ', pa: 'ਤੌਲੀਆ', as: 'গামোচা', or: 'ଗାମୁଛା' } },
  { word: 'BRUSH', category: 'home', emoji: '🪥', color: 'bg-teal-500/10 border-teal-500/20 text-teal-400 font-black', translations: { hi: 'ब्रश', ta: 'பல் துலக்கி', te: 'బ్రష్', kn: 'ಬ್ರಷ್', ml: 'ബ്രഷ്', mr: 'ब्रश', bn: 'ব্রাশ', gu: 'બ્રશ', pa: 'ਬੁਰਸ਼', as: 'ব্ৰাছ', or: 'ବ୍ରଶ୍' } },

  // 🎨 Learning & Daily Actions (89-100)
  { word: 'BOOK', category: 'actions', emoji: '📖', color: 'bg-teal-500/10 border-teal-500/20 text-teal-400 font-black', translations: { hi: 'किताब', ta: 'புத்தகம்', te: 'పుస్తకం', kn: 'ಪುಸ್ತಕ', ml: 'പുസ്തകം', mr: 'पुस्तक', bn: 'বই', gu: 'ચોપડી', pa: 'ਕਿਤਾਬ', as: 'কিতাপ', or: 'ବହି' } },
  { word: 'PENCIL', category: 'actions', emoji: '✏️', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 font-black', translations: { hi: 'पेंसिल', ta: 'பென்சில்', te: 'పెన్సిల్', kn: 'ಪೆನ್ಸಿಲ್', ml: 'പെൻസിൽ', mr: 'पेन्सिल', bn: 'পেন্সিল', gu: 'પેન્સિલ', pa: 'ਪੈਨਸਿਲ', as: 'পেঞ্চিল', or: 'ପେନସିଲ୍' } },
  { word: 'COLOR', category: 'actions', emoji: '🎨', color: 'bg-purple-500/10 border-purple-500/20 text-purple-400 font-black', translations: { hi: 'रंग', ta: 'நிறம்', te: 'రంగు', kn: 'ಬಣ್ಣ', ml: 'നിറം', mr: 'रंग', bn: 'রঙ', gu: 'રંગ', pa: 'ਰੰਗ', as: 'ৰং', or: 'ରଙ୍ଗ' } },
  { word: 'SONG', category: 'actions', emoji: '🎵', color: 'bg-rose-500/10 border-rose-500/20 text-rose-400 font-black', translations: { hi: 'गाना', ta: 'பாடல்', te: 'పాట', kn: 'ಹಾಡು', ml: 'പാട്ട്', mr: 'गाणे', bn: 'গান', gu: 'ગીત', pa: 'ਗੀਤ', as: 'গান', or: 'ଗୀତ' } },
  { word: 'CLAP', category: 'actions', emoji: '👏', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-black', translations: { hi: 'ताली', ta: 'கைதட்டு', te: 'చప్పట్లు', kn: 'ಚಪ್ಪಾಳೆ', ml: 'കൈയ്യടി', mr: 'टाळी', bn: 'হাততালি', gu: 'તાળી', pa: 'ਤਾੜੀ', as: 'হাতচাপৰি', or: 'ତାଳି' } },
  { word: 'HELLO', category: 'actions', emoji: '🙏', color: 'bg-amber-400/10 border-amber-400/20 text-amber-300 font-black', translations: { hi: 'नमस्ते', ta: 'வணக்கம்', te: 'నమస్కారం', kn: 'ನಮಸ್ಕಾರ', ml: 'നമസ്കാരം', mr: 'नमस्कार', bn: 'নমস্কার', gu: 'નમસ્તે', pa: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', as: 'নমস্কাৰ', or: 'ନମସ୍କାର' } },
  { word: 'GOODBYE', category: 'actions', emoji: '👋', color: 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400 font-black', translations: { hi: 'बाय-बाय', ta: 'போய் வருகிறேன்', te: 'వెళ్ళొస్తా', kn: 'ಟಾಟಾ', ml: 'ടാറ്റാ', mr: 'टाटा', bn: 'টাটা', gu: 'આવજો', pa: 'ਬਾਏ-ਬਾਏ', as: 'বিদায়', or: 'ଟାଟା' } },
  { word: 'SLEEP', category: 'actions', emoji: '😴', color: 'bg-indigo-400/10 border-indigo-400/20 text-indigo-300 font-black', translations: { hi: 'सोना', ta: 'தூக்கம்', te: 'నిద్ర', kn: 'ನಿದ್ದೆ', ml: 'ഉറക്കം', mr: 'झोप', bn: 'ঘুম', gu: 'ઊંઘ', pa: 'ਸੌਣਾ', as: 'টোপনি', or: 'ନିଦ' } },
  { word: 'BATH', category: 'actions', emoji: '🛁', color: 'bg-cyan-400/10 border-cyan-400/20 text-cyan-300 font-black', translations: { hi: 'नहाना', ta: 'குளியல்', te: 'స్నానం', kn: 'ಸ್ನಾನ', ml: 'കുളി', mr: 'आंघोळ', bn: 'স্নান', gu: 'સ્નાન', pa: 'ਨਹਾਉਣਾ', as: 'গা ধোৱা', or: 'ଗାଧୋଇବା' } },
  { word: 'SMILE', category: 'actions', emoji: '😄', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 font-black', translations: { hi: 'हँसना', ta: 'புன்னகை', te: 'చిరునవ్వు', kn: 'ನಗು', ml: 'പുഞ്ചിരി', mr: 'हसू', bn: 'হাসি', gu: 'સ્મિત', pa: 'ਮੁਸਕਾਨ', as: 'হাঁহি', or: 'ହସ' } },
  { word: 'LOVE', category: 'actions', emoji: '❤️', color: 'bg-rose-500/10 border-rose-500/20 text-rose-400 font-black', translations: { hi: 'प्यार', ta: 'அன்பு', te: 'ప్రేమ', kn: 'ಪ್ರೀತಿ', ml: 'സ്നേഹം', mr: 'प्रेम', bn: 'ভালোবাসা', gu: 'પ્રેમ', pa: 'ਪਿਆਰ', as: 'মৰম', or: 'ଭଲପାଇବା' } },
  { word: 'BRAVO', category: 'actions', emoji: '🌟', color: 'bg-amber-300/10 border-amber-300/20 text-amber-300 font-black', translations: { hi: 'शाबाश', ta: 'பாராட்டு', te: 'శభాష్', kn: 'ಶಹಬ್ಬಾಸ್', ml: 'മിടുക്കൻ', mr: 'शाब्बास', bn: 'সাবাশ', gu: 'શાબાશ', pa: 'ਸ਼ਾਬਾਸ਼', as: 'চাব্বাছ', or: 'ସାବାସ୍' } }
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
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const getDisplayWord = (item: FirstWordItem) =>
    language === 'en' ? item.word : (item.translations[language] || item.word);
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
  const [activeWordCategory, setActiveWordCategory] = useState<string>('all');

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
    } else if (!mix2) {
      setMix2(color);
      const key = `${mix1.name}+${color.name}`;
      const result = MIX_LOGIC[key] || color.name;
      setMixResult(result);
      playSound('glass');
      speakIndianEnglish(`${mix1.name} and ${color.name} make ${result}!`);
      const currentQuest = COLOR_QUESTS[questIndex];
      if (currentQuest && result === currentQuest.target) {
        setShowQuestSuccess(true);
        if (!completedQuests.includes(currentQuest.id)) {
          setCompletedQuests(prev => [...prev, currentQuest.id]);
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
    <div className="w-full max-w-[1640px] mx-auto px-2 sm:px-3 flex flex-col gap-3">
      {/* Ultra-Thin Horizontal Navigation Bar (All 9 Modules on Laptop >=768px, Compact Grouped Dropdown on Mobile <768px + Voice Toggle) */}
      <nav className="w-full bg-slate-900/90 px-2.5 py-1.5 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-1.5">
        {/* Mobile Only (< 768px): Compact Topic Selector Dropdown Grouped by Category */}
        <div className="flex md:hidden items-center gap-2 flex-1 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 shrink-0">
            Topic:
          </span>
          <select
            aria-label="Select Learning Module"
            value={activeMode}
            onChange={(e) => handleModeChange(e.target.value as typeof activeMode)}
            className="flex-1 min-w-0 bg-slate-800/95 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs font-extrabold text-white focus:outline-none focus:border-cheerful-yellow"
          >
            <optgroup label="Math & Logic">
              <option value="numbers">🔢 Numbers</option>
              <option value="counting">⭐ Counting</option>
              <option value="shapes">✨ Shapes</option>
            </optgroup>
            <optgroup label="Language & Words">
              <option value="words">📖 First Words</option>
              <option value="alphabet">⌨️ Sentence Builder</option>
            </optgroup>
            <optgroup label="Discovery & Play">
              <option value="colors">🎨 Colors</option>
              <option value="emotions">💖 Emotions</option>
              <option value="bodyparts">😊 Body Parts</option>
              <option value="animals">🔊 Animal Sounds</option>
            </optgroup>
          </select>
        </div>

        {/* Laptop/Desktop (>= 768px): Horizontal Module Buttons with Thin Height (100% Untouched) */}
        <div className="hidden md:flex flex-wrap items-center gap-1.5 flex-1">
          <button
            id="btn-mode-numbers"
            onClick={() => handleModeChange('numbers')}
            className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all duration-200 font-extrabold text-xs tracking-wide cursor-pointer shadow-sm select-none whitespace-nowrap ${
              activeMode === 'numbers' 
                ? 'bg-cheerful-yellow text-black shadow-md shadow-cheerful-yellow/20 ring-1 ring-cheerful-yellow/50' 
                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Hash className="w-3.5 h-3.5 shrink-0" />
            <span>Numbers</span>
          </button>
          <button
            id="btn-mode-counting"
            onClick={() => handleModeChange('counting')}
            className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all duration-200 font-extrabold text-xs tracking-wide cursor-pointer shadow-sm select-none whitespace-nowrap ${
              activeMode === 'counting' 
                ? 'bg-cheerful-pink text-black shadow-md shadow-cheerful-pink/20 ring-1 ring-cheerful-pink/50' 
                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 shrink-0" />
            <span>Counting</span>
          </button>
          <button
            id="btn-mode-words"
            onClick={() => handleModeChange('words')}
            className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all duration-200 font-extrabold text-xs tracking-wide cursor-pointer shadow-sm select-none whitespace-nowrap ${
              activeMode === 'words' 
                ? 'bg-cheerful-blue text-black shadow-md shadow-cheerful-blue/20 ring-1 ring-cheerful-blue/50' 
                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>First Words</span>
          </button>
          <button
            id="btn-mode-alphabet"
            onClick={() => handleModeChange('alphabet')}
            className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all duration-200 font-extrabold text-xs tracking-wide cursor-pointer shadow-sm select-none whitespace-nowrap ${
              activeMode === 'alphabet' 
                ? 'bg-indigo-400 text-black shadow-md shadow-indigo-400/20 ring-1 ring-indigo-400/50' 
                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5 shrink-0" />
            <span>Sentence Builder</span>
          </button>
          <button
            id="btn-mode-colors"
            onClick={() => handleModeChange('colors')}
            className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all duration-200 font-extrabold text-xs tracking-wide cursor-pointer shadow-sm select-none whitespace-nowrap ${
              activeMode === 'colors' 
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20 ring-1 ring-purple-400/50' 
                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5 shrink-0" />
            <span>Colors</span>
          </button>
          <button
            id="btn-mode-emotions"
            onClick={() => handleModeChange('emotions')}
            className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all duration-200 font-extrabold text-xs tracking-wide cursor-pointer shadow-sm select-none whitespace-nowrap ${
              activeMode === 'emotions' 
                ? 'bg-rose-400 text-black shadow-md shadow-rose-400/20 ring-1 ring-rose-300/50' 
                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-pink-300 shrink-0" />
            <span>Emotions</span>
          </button>
          <button
            id="btn-mode-bodyparts"
            onClick={() => handleModeChange('bodyparts')}
            className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all duration-200 font-extrabold text-xs tracking-wide cursor-pointer shadow-sm select-none whitespace-nowrap ${
              activeMode === 'bodyparts' 
                ? 'bg-sky-400 text-black shadow-md shadow-sky-400/20 ring-1 ring-sky-300/50' 
                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Smile className="w-3.5 h-3.5 text-sky-300 shrink-0" />
            <span>Body Parts</span>
          </button>
          <button
            id="btn-mode-shapes"
            onClick={() => handleModeChange('shapes')}
            className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all duration-200 font-extrabold text-xs tracking-wide cursor-pointer shadow-sm select-none whitespace-nowrap ${
              activeMode === 'shapes' 
                ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20 ring-1 ring-amber-300/50' 
                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Shapes</span>
          </button>
          <button
            id="btn-mode-animals"
            onClick={() => handleModeChange('animals')}
            className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all duration-200 font-extrabold text-xs tracking-wide cursor-pointer shadow-sm select-none whitespace-nowrap ${
              activeMode === 'animals' 
                ? 'bg-emerald-400 text-black shadow-md shadow-emerald-400/20 ring-1 ring-emerald-300/50' 
                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span>Animal Sounds</span>
          </button>
        </div>

        {/* Compact Voice Toggle Button */}
        <button
          type="button"
          id="toddler-academy-voice-toggle"
          onClick={handleToggleVoice}
          className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm active:scale-95 select-none whitespace-nowrap shrink-0 ${
            isMuted
              ? 'bg-rose-950/70 hover:bg-rose-900/70 text-rose-300 border border-rose-500/60 hover:border-rose-400'
              : 'bg-emerald-950/70 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-500/60 hover:border-emerald-400'
          }`}
          title={isMuted ? 'Voice is Muted - Click to turn voice ON' : 'Voice is Active - Click to turn voice OFF'}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Voice On</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
              <span>Voice Off</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] shrink-0" />
            </>
          )}
        </button>
      </nav>

      {/* Active Module Content - Starts immediately below the thin horizontal bar */}
      <div className="w-full min-w-0 mt-0 pt-0">
      <AnimatePresence mode="wait">
          {activeMode === 'numbers' ? (
          <motion.div
            key="numbers-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {/* Header with interesting numbers title */}
            <header className="text-center mb-3 sm:mb-4">
              <motion.div
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 mb-1"
              >
                <Hash className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[11px] font-black uppercase tracking-widest">Little Math Explorer</span>
              </motion.div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                ✨ Magic Numbers & Talking Calculator ✨
              </h1>
              <p className="text-white/60 text-xs sm:text-sm font-medium mt-0.5">
                Tap numbers to hear them spoken aloud, see magic colors glow, and calculate together!
              </p>
            </header>

            {/* Unified No-Scroll Screen: Side-by-Side on Desktop, stacked compact on Mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Left Column: Calculator Screen & Operators */}
              <div className="lg:col-span-5 flex flex-col justify-between glass-card p-5 sm:p-6 border-3 border-white/10 rounded-3xl relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-pink-500/5 to-transparent pointer-events-none" />
                
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs font-black uppercase tracking-wider text-white/50">
                    <span className="flex items-center gap-1.5 text-amber-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      Math Screen
                    </span>
                    <button
                      onClick={() => {
                        playSound('glass');
                        speakIndianEnglish(calcDisplay);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all text-[11px] cursor-pointer"
                      title="Speak number"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Speak</span>
                    </button>
                  </div>

                  {/* Calculator Big Number Display */}
                  <div className="w-full bg-black/40 rounded-2xl p-5 text-right relative border border-white/10 shadow-inner min-h-[96px] flex items-center justify-end overflow-hidden">
                    {operator && (
                      <div className="absolute top-2 left-3 px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-black text-xl border border-amber-400/30">
                        {operator}
                      </div>
                    )}
                    <AnimatePresence mode="wait">
                      <motion.span 
                        key={calcDisplay}
                        initial={{ scale: 1.15, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-5xl sm:text-6xl font-black text-white tracking-widest block truncate"
                      >
                        {calcDisplay}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Arithmetic Operators Row */}
                <div className="mt-4 pt-3 border-t border-white/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-2">Math Actions</span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    <button 
                      onClick={() => handleOperator('+')}
                      className="glass-card py-3 rounded-xl flex items-center justify-center border-2 border-white/10 hover:border-cheerful-pink/60 hover:bg-cheerful-pink/10 text-white font-black text-xl transition-all active:scale-95 cursor-pointer"
                      title="Add"
                    >
                      <Plus className="w-5 h-5 text-pink-400" />
                    </button>
                    <button 
                      onClick={() => handleOperator('-')}
                      className="glass-card py-3 rounded-xl flex items-center justify-center border-2 border-white/10 hover:border-sky-400/60 hover:bg-sky-400/10 text-white font-black text-xl transition-all active:scale-95 cursor-pointer"
                      title="Subtract"
                    >
                      <Minus className="w-5 h-5 text-sky-400" />
                    </button>
                    <button 
                      onClick={() => handleOperator('×')}
                      className="glass-card py-3 rounded-xl flex items-center justify-center border-2 border-white/10 hover:border-amber-400/60 hover:bg-amber-400/10 text-amber-300 font-black text-xl transition-all active:scale-95 cursor-pointer"
                      title="Multiply"
                    >
                      ×
                    </button>
                    <button 
                      onClick={() => handleOperator('÷')}
                      className="glass-card py-3 rounded-xl flex items-center justify-center border-2 border-white/10 hover:border-teal-400/60 hover:bg-teal-400/10 text-teal-300 font-black text-xl transition-all active:scale-95 cursor-pointer"
                      title="Divide"
                    >
                      ÷
                    </button>
                    <button 
                      onClick={calculateResults}
                      className="glass-card py-3 rounded-xl flex items-center justify-center border-2 border-emerald-400/50 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-black text-xl transition-all active:scale-95 cursor-pointer shadow-lg shadow-emerald-500/20"
                      title="Calculate Result"
                    >
                      <Equal className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={clearCalc}
                      className="glass-card py-3 rounded-xl flex items-center justify-center border-2 border-rose-400/40 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-black text-base transition-all active:scale-95 cursor-pointer"
                      title="Clear"
                    >
                      <Eraser className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Number Keypad (1-9, 0) in 2 compact rows of 5 */}
              <div className="lg:col-span-7 glass-card p-5 sm:p-6 border-3 border-white/10 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-2xl">
                <div className="flex items-center justify-between mb-3 text-xs font-black uppercase tracking-wider text-white/50">
                  <span className="flex items-center gap-1.5 text-pink-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    Interactive Keypad (Tap Any Number)
                  </span>
                  <span className="text-white/40 text-[11px]">Audio + Colors Active</span>
                </div>

                <div className="grid grid-cols-5 gap-2.5 sm:gap-3 flex-1 items-stretch">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num, idx) => {
                    const colorIndex = numberColors[idx];
                    const activeColor = COLORS[colorIndex];
                    
                    return (
                      <motion.button
                        key={num}
                        whileHover={{ scale: 1.06, y: -2 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleNumberInput(num, idx)}
                        className={`h-20 sm:h-24 rounded-2xl flex flex-col items-center justify-center cursor-pointer border-3 transition-all duration-300 shadow-lg relative overflow-hidden select-none ${activeColor.border} ${activeColor.glow} bg-white/5 hover:bg-white/10`}
                      >
                        <div className={`absolute inset-0 opacity-15 transition-colors duration-500 ${activeColor.bg}`} />
                        <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight relative z-10 drop-shadow-md">
                          {num}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        ) : activeMode === 'counting' ? (
          <motion.div
            key="counting-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {/* Header */}
            <header className="text-center mb-3 sm:mb-4">
              <motion.div
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-400/10 border border-pink-400/25 text-pink-300 mb-1"
              >
                <Star className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                <span className="text-[11px] font-black uppercase tracking-widest">Count-With-Me Academy</span>
              </motion.div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                ⭐ Interactive Counting Arena ⭐
              </h1>
              <p className="text-white/60 text-xs sm:text-sm font-medium mt-0.5">
                Choose any number (1-20) below, pick your favorite objects, and tap them to count together!
              </p>
            </header>

            {/* Single Unified Interactive Card: Everything in same view without scrolling */}
            <div className="glass-card p-5 sm:p-6 border-3 border-white/10 rounded-3xl relative overflow-hidden shadow-2xl flex flex-col gap-4">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-amber-400/5 to-transparent pointer-events-none" />

              {/* Top Controls Bar: Object Selector Tabs + Quick Status */}
              <div className="w-full flex flex-wrap items-center justify-between gap-3 relative z-10 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Count Object:
                  </span>
                  <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 select-none">
                    {(['star', 'cookie', 'heart', 'smile'] as const).map((obj) => (
                      <button
                        key={obj}
                        onClick={() => {
                          playSound('click');
                          setSelectedObject(obj);
                          const objNames = { star: 'Stars', cookie: 'Cookies', heart: 'Hearts', smile: 'Smiles' };
                          speakIndianEnglish(objNames[obj]);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          selectedObject === obj 
                            ? 'bg-white/20 text-white shadow-md font-black ring-1 ring-white/30' 
                            : 'text-white/40 hover:text-white/80'
                        }`}
                      >
                        <span>{obj === 'star' ? '⭐' : obj === 'cookie' ? '🍪' : obj === 'heart' ? '💖' : '😊'}</span>
                        <span className="hidden sm:inline capitalize">{obj}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white">
                    {activeNumber > 0 ? `${countedIndices.length} / ${activeNumber} Counted` : 'Pick Number Below'}
                  </span>
                  {activeNumber > 0 && countedIndices.length > 0 && (
                    <button
                      onClick={() => {
                        setCountedIndices([]);
                        playSound('pop');
                      }}
                      className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-all cursor-pointer"
                    >
                      Reset Count
                    </button>
                  )}
                </div>
              </div>

              {/* Number Buttons: 1 to 20 in 2 clean compact rows of 10 */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-white/50">
                    Choose Number to Count (1 - 20):
                  </span>
                  <span className="text-[11px] font-bold text-amber-300">
                    Target: {activeNumber}
                  </span>
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2 select-none">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => {
                    const isSelected = activeNumber === num;
                    return (
                      <motion.button
                        key={num}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => {
                          playSound('pop');
                          setCalcDisplay(String(num));
                          speakIndianEnglish(`Count ${num}`);
                        }}
                        className={`h-9 sm:h-10 rounded-xl border-2 transition-all duration-200 font-black text-xs sm:text-sm flex items-center justify-center cursor-pointer select-none ${
                          isSelected
                            ? 'bg-cheerful-pink border-white text-black shadow-lg shadow-pink-500/30 scale-105 ring-2 ring-pink-300'
                            : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {num}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Arena Stage: Immediately visible right below the numbers */}
              <div className="w-full bg-black/35 rounded-2xl p-4 sm:p-5 min-h-[170px] flex flex-wrap items-center justify-center gap-3 relative z-10 border border-white/10 shadow-inner">
                {activeNumber === 0 ? (
                  <div className="text-center py-6 select-none">
                    <p className="text-white/40 text-sm font-bold uppercase tracking-wider">
                      👆 Tap any number (1-20) above to populate the arena!
                    </p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {Array.from({ length: activeNumber }).map((_, index) => {
                      const isCounted = countedIndices.includes(index);
                      const countedNum = countedIndices.indexOf(index) + 1;
                      return (
                        <motion.button
                          key={`${selectedObject}-${index}`}
                          initial={{ scale: 0, rotate: -30 }}
                          animate={{ scale: 1, rotate: isCounted ? [0, 12, -12, 0] : 0 }}
                          exit={{ scale: 0, rotate: 30 }}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleObjectTap(index)}
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center relative cursor-pointer border-2 transition-all shadow-md select-none ${
                            isCounted 
                              ? 'bg-white/25 border-white text-white shadow-xl ring-2 ring-amber-300/70 scale-105' 
                              : 'bg-white/10 border-white/20 hover:border-white/40 hover:bg-white/15'
                          }`}
                        >
                          <div className={`transition-transform duration-300 flex items-center justify-center ${isCounted ? 'scale-110' : 'opacity-90'}`}>
                            {selectedObject === 'star' && (
                              <span className="text-2xl sm:text-3xl filter drop-shadow-md leading-none">⭐</span>
                            )}
                            {selectedObject === 'cookie' && (
                              <span className="text-2xl sm:text-3xl filter drop-shadow-md leading-none">🍪</span>
                            )}
                            {selectedObject === 'heart' && (
                              <span className="text-2xl sm:text-3xl filter drop-shadow-md leading-none">💖</span>
                            )}
                            {selectedObject === 'smile' && (
                              <span className="text-2xl sm:text-3xl filter drop-shadow-md leading-none">😊</span>
                            )}
                          </div>

                          {/* Sequential Counting Number Badge */}
                          {isCounted && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1.5 -right-1.5 bg-cheerful-pink text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-md"
                            >
                              {countedNum}
                            </motion.span>
                          )}
                        </motion.button>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>

              {/* Progress bar */}
              {activeNumber > 0 && (
                <div className="w-full bg-white/5 rounded-full h-2 relative z-10 overflow-hidden border border-white/5 select-none">
                  <div 
                    className="bg-gradient-to-r from-amber-400 via-pink-500 to-emerald-400 h-full transition-all duration-300"
                    style={{ width: `${(countedIndices.length / activeNumber) * 100}%` }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        ) : activeMode === 'colors' ? (
          <motion.div
            key="colors-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {/* Header */}
            <header className="text-center mb-3 sm:mb-4">
              <motion.div
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-400/10 border border-purple-400/25 text-purple-300 mb-1"
              >
                <Palette className="w-3.5 h-3.5 text-purple-300" />
                <span className="text-[11px] font-black uppercase tracking-widest">Magic Color Laboratory</span>
              </motion.div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                🎨 Magic Color Mixing Studio
              </h1>
              <p className="text-white/60 text-xs sm:text-sm font-medium mt-0.5">
                Tap any two colors on the right to mix them like magic in the beaker!
              </p>
            </header>

            {/* Side-by-Side Unified No-Scroll Studio */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Left Column: Mixing Laboratory & Live Result */}
              <div className="lg:col-span-5 glass-card p-5 sm:p-6 border-3 border-white/10 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-cyan-500/5 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      Mixing Beaker
                    </span>
                    {(mix1 || mix2 || mixResult) && (
                      <button 
                        onClick={clearMix}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                        title="Reset Mixing"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-rose-300" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>

                  {/* Formula Row: Beaker 1 + Beaker 2 = Result */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3 py-2">
                    {/* Beaker 1 */}
                    <div className="flex flex-col items-center gap-1.5">
                      <motion.div 
                        key={mix1?.name || 'empty1'}
                        animate={{ scale: mix1 ? 1.08 : 1 }}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-3 flex items-center justify-center shadow-lg transition-all ${
                          mix1 ? `${mix1.class} ${mix1.border}` : 'bg-white/5 border-dashed border-white/20 text-white/30'
                        }`}
                      >
                        {!mix1 ? <span className="text-sm font-black">?</span> : <span className="text-xl">✨</span>}
                      </motion.div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-white/60">
                        {mix1?.name || 'Color 1'}
                      </span>
                    </div>

                    <Plus className="w-5 h-5 text-white/40 shrink-0" />

                    {/* Beaker 2 */}
                    <div className="flex flex-col items-center gap-1.5">
                      <motion.div 
                        key={mix2?.name || 'empty2'}
                        animate={{ scale: mix2 ? 1.08 : 1 }}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-3 flex items-center justify-center shadow-lg transition-all ${
                          mix2 ? `${mix2.class} ${mix2.border}` : 'bg-white/5 border-dashed border-white/20 text-white/30'
                        }`}
                      >
                        {!mix2 ? <span className="text-sm font-black">?</span> : <span className="text-xl">✨</span>}
                      </motion.div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-white/60">
                        {mix2?.name || 'Color 2'}
                      </span>
                    </div>

                    <Equal className="w-5 h-5 text-white/40 shrink-0" />

                    {/* Result Swatch */}
                    <div className="flex flex-col items-center gap-1.5">
                      <motion.div 
                        key={mixResult || 'empty-res'}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: mixResult ? 1.15 : 1, rotate: mixResult ? [0, 8, -8, 0] : 0 }}
                        style={
                          mixResult && COLOR_SWATCH_MAP[mixResult]
                            ? {
                                backgroundColor: COLOR_SWATCH_MAP[mixResult].hex,
                                borderColor: COLOR_SWATCH_MAP[mixResult].border,
                              }
                            : undefined
                        }
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-4 shadow-2xl flex items-center justify-center transition-all duration-300 ${
                          mixResult && COLOR_SWATCH_MAP[mixResult]
                            ? ''
                            : 'bg-white/5 border-dashed border-white/20 text-white/30'
                        }`}
                      >
                        {mixResult ? (
                          <Star
                            className={`w-7 h-7 drop-shadow-md ${
                              COLOR_SWATCH_MAP[mixResult]?.lightText
                                ? 'text-slate-900 fill-slate-900'
                                : 'text-white fill-white'
                            }`}
                          />
                        ) : (
                          <Sparkles className="w-6 h-6 text-white/20" />
                        )}
                      </motion.div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                        {mixResult || 'Result'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Result Announcement Box */}
                <div className="mt-3 p-3.5 bg-black/35 rounded-2xl border border-white/10 text-center relative z-10 shadow-inner">
                  <p className="text-xs sm:text-sm font-black text-white tracking-wide">
                    {mixResult ? (
                      <span className="text-amber-300">🎉 {mixResult}</span>
                    ) : mix1 && !mix2 ? (
                      <span className="text-purple-300">Now tap a second color on the right! ➡️</span>
                    ) : (
                      <span className="text-white/60">Tap any color on the right to start! 🌈</span>
                    )}
                  </p>
                  {mixResult && (
                    <button
                      onClick={() => {
                        playSound('glass');
                        speakIndianEnglish(`${mix1?.name} plus ${mix2?.name} makes ${mixResult}!`);
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-emerald-300 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Hear Pronunciation</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: 10 Colors in a compact 5x2 grid */}
              <div className="lg:col-span-7 glass-card p-5 sm:p-6 border-3 border-white/10 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-2xl">
                <div className="flex items-center justify-between mb-3 text-xs font-black uppercase tracking-wider text-white/50">
                  <span className="flex items-center gap-1.5 text-cyan-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    Color Palette (10 Vibrant Colors)
                  </span>
                  <span className="text-white/40 text-[11px]">Tap to mix</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 flex-1 items-stretch">
                  {COLOR_CHART.map((color, idx) => {
                    const isSelected = mix1?.name === color.name || mix2?.name === color.name;
                    return (
                      <motion.button
                        key={color.name}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.94 }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        onClick={() => handleColorSelect(color)}
                        className={`h-20 sm:h-22 rounded-2xl flex flex-col items-center justify-center cursor-pointer border-3 transition-all duration-300 shadow-lg relative overflow-hidden group select-none ${
                          isSelected ? 'border-white scale-105 ring-4 ring-white/50 shadow-2xl' : color.border
                        } ${color.glow}`}
                      >
                        <div className={`absolute inset-0 opacity-85 ${color.class}`} />
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/15 transition-colors" />
                        
                        <div className="relative z-10 text-center px-1">
                          <span className={`text-base sm:text-lg font-black tracking-tight uppercase ${
                            color.name === 'White' || color.name === 'Yellow' ? 'text-black' : 'text-white'
                          } drop-shadow-md`}>
                            {color.name}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-white shadow-md animate-ping" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
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
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center w-full"
          >
            {/* Header without the old prompt text */}
            <header className="text-center mb-3 sm:mb-4">
              <motion.div
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/25 text-cyan-300 mb-1"
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
                <span className="text-[11px] font-black uppercase tracking-widest">100 Essential First Words</span>
              </motion.div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
                My First Words Palace
              </h1>
              <p className="text-white/60 text-xs sm:text-sm font-medium mt-0.5 max-w-xl mx-auto">
                100 essential toddler first words: Family, Food, Nature, Animals, Daily Items & Actions
              </p>
            </header>

            {/* Category Filter: Dropdown on Mobile (< 768px), Buttons on Laptop/Desktop (>= 768px) */}
            <div className="w-full max-w-sm md:hidden mb-4">
              <select
                aria-label="Filter First Words Category"
                value={activeWordCategory}
                onChange={(e) => {
                  playSound('click');
                  setActiveWordCategory(e.target.value);
                }}
                className="w-full bg-slate-900/90 border border-cyan-400/40 rounded-xl px-3.5 py-2 text-xs font-black text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="all">🌟 All 100 Words ({FIRST_WORDS.length})</option>
                <option value="family">👨‍👩‍👧 Family (9)</option>
                <option value="food">🍎 Food & Drink (17)</option>
                <option value="nature">🌿 Nature & Sky (8)</option>
                <option value="animals">🐘 Animals (18)</option>
                <option value="home">🏠 Daily Items (36)</option>
                <option value="actions">🏃 Actions (12)</option>
              </select>
            </div>

            <div className="hidden md:flex flex-wrap items-center justify-center gap-2 mb-5 select-none max-w-4xl">
              {[
                { id: 'all', label: `All 100 Words (${FIRST_WORDS.length})`, icon: '🌟' },
                { id: 'family', label: 'Family (9)', icon: '👨‍👩‍👧' },
                { id: 'food', label: 'Food & Drink (17)', icon: '🍎' },
                { id: 'nature', label: 'Nature & Sky (8)', icon: '🌿' },
                { id: 'animals', label: 'Animals (18)', icon: '🐘' },
                { id: 'home', label: 'Daily Items (36)', icon: '🏠' },
                { id: 'actions', label: 'Actions (12)', icon: '🏃' },
              ].map((cat) => {
                const isActive = activeWordCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      playSound('click');
                      setActiveWordCategory(cat.id);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer select-none ${
                      isActive
                        ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/25 scale-105'
                        : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Spelling helper panel */}
            {selectedWord && (() => {
              const currentWordData = FIRST_WORDS.find(w => w.word === selectedWord);
              if (!currentWordData) return null;
              const localizedCurrentWord = getDisplayWord(currentWordData);
              return (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-4xl p-6 sm:p-8 rounded-[2.5rem] border-4 border-cyan-400/30 glass-card relative overflow-hidden mb-8 text-center shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Giant floating emoji of targeted word */}
                  <motion.div 
                    animate={{ y: [0, -8, 0], scale: [1, 1.06, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-7xl sm:text-8xl md:text-9xl mb-4 select-none filter drop-shadow-2xl"
                  >
                    {currentWordData.emoji}
                  </motion.div>

                  <h2 className="notranslate text-3xl sm:text-4xl font-black text-white tracking-wide uppercase mb-4">
                    {localizedCurrentWord}
                  </h2>

                  {/* Bubbled Spelling Board */}
                  {language === 'en' && (
                    <>
                      <h3 className="text-white/40 text-xs font-black uppercase tracking-[0.25em] mb-4">
                        Tap each letter to hear its sound!
                      </h3>
                      
                      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 select-none">
                        {currentWordData.word.split('').map((letter, letterIdx) => (
                          <motion.button
                            key={`${letter}-${letterIdx}`}
                            whileHover={{ scale: 1.15, rotate: [0, 8, -8, 0] }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              playSound('pop');
                              speakIndianEnglish(letter);
                            }}
                            className="notranslate w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-white/20 bg-white/5 hover:border-white text-white font-black text-2xl sm:text-3xl flex items-center justify-center cursor-pointer shadow-lg transition-all"
                          >
                            {letter}
                          </motion.button>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="flex flex-wrap justify-center gap-3 relative z-10">
                    <button
                      onClick={() => {
                        playSound('glass');
                        speakIndianEnglish(localizedCurrentWord);
                      }}
                      className="px-5 py-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 font-black rounded-xl uppercase text-xs tracking-wider flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
                    >
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      Listen to Word
                    </button>
                    <button
                      onClick={() => {
                        handleWordPreset(currentWordData.word);
                        playSound('glass');
                      }}
                      className="px-5 py-2.5 bg-cyan-400 text-slate-950 font-black rounded-xl uppercase text-xs tracking-wider flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg shadow-cyan-400/20"
                    >
                      📝 Add to Typewriter Sentence
                    </button>
                    <button
                      onClick={() => {
                        setSelectedWord(null);
                        playSound('click');
                      }}
                      className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white font-black rounded-xl uppercase text-xs tracking-wider hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      Close Card
                    </button>
                  </div>
                </motion.div>
              );
            })()}

            {/* Grid of Big Cards: 3 in a row on desktop, 100% aligned & clean */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16 select-none">
              {(activeWordCategory === 'all' 
                ? FIRST_WORDS 
                : FIRST_WORDS.filter(w => w.category === activeWordCategory)
              ).map((item) => {
                const isSelected = selectedWord === item.word;
                const displayWord = getDisplayWord(item);
                return (
                  <motion.div
                    key={item.word}
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSelectedWord(item.word);
                      playSound('pop');
                      speakIndianEnglish(displayWord);
                    }}
                    className={`glass-card p-6 border-2 rounded-3xl flex flex-col items-center justify-between gap-3 cursor-pointer relative overflow-hidden transition-all duration-300 h-[210px] shadow-xl ${
                      isSelected 
                        ? 'border-cyan-400 bg-cyan-400/10 shadow-2xl ring-2 ring-cyan-300' 
                        : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                    }`}
                  >
                    <div className="w-full flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-white/60">
                        {item.category}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playSound('glass');
                          speakIndianEnglish(displayWord);
                        }}
                        className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-emerald-300 transition-all cursor-pointer"
                        title="Speak Word"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-6xl sm:text-7xl leading-none flex items-center justify-center flex-1 drop-shadow-xl select-none transition-transform duration-300 hover:scale-110">
                      {item.emoji}
                    </div>

                    <div className="text-center w-full flex items-center justify-center min-h-[36px]">
                      <h3 className="notranslate text-2xl sm:text-3xl font-black text-white tracking-wider uppercase leading-tight">
                        {displayWord}
                      </h3>
                    </div>
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
            className="w-full max-w-5xl mx-auto"
          >
            {/* Compact Header matching Numbers, Counting & Colors */}
            <header className="text-center mb-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-400/10 border border-indigo-400/25 text-indigo-300 mb-1">
                <Keyboard className="w-3.5 h-3.5" />
                <span className="text-[11px] font-black uppercase tracking-widest">Sentence Discovery Studio</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                ✨ Word & Sentence Builder ✨
              </h1>
            </header>

            {/* Unified Single-Screen Card: Sentence Display + Quick Words + A-Z Keyboard with ZERO scrolling */}
            <div className="glass-card p-4 sm:p-5 border-3 border-white/10 rounded-3xl relative overflow-hidden shadow-2xl flex flex-col gap-3">
              <div className={`absolute inset-0 opacity-5 transition-colors duration-500 pointer-events-none ${COLORS[keyColorIndex].bg}`} />

              {/* Row 1: Live Sentence Display & Instant Action Controls */}
              <div className="w-full bg-black/40 rounded-2xl p-3 sm:p-4 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10 min-h-[76px]">
                <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start flex-1 min-w-0">
                  {getEmojisToDisplay().length > 0 && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {getEmojisToDisplay().map((emo, eIdx) => (
                        <motion.span
                          key={`${emo}-${eIdx}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-2xl sm:text-3xl filter drop-shadow select-none"
                        >
                          {emo}
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {sentence ? (
                    <motion.p
                      key={sentence}
                      initial={{ scale: 1.03, opacity: 0.8 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-wide break-words uppercase text-center sm:text-left"
                    >
                      {sentence}
                    </motion.p>
                  ) : (
                    <p className="text-sm sm:text-base font-bold text-white/35 italic tracking-wide uppercase select-none">
                      Tap letters or quick words below to build your sentence...
                    </p>
                  )}
                </div>

                {/* Action Controls right inside the sentence bar */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    disabled={!sentence}
                    onClick={() => {
                      if (!sentence) return;
                      playSound('glass');
                      speakIndianEnglish(sentence);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md ${
                      sentence
                        ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-95'
                        : 'bg-white/5 text-white/25 border border-white/10 cursor-not-allowed'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Speak</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleKeyPress(' ')}
                    className="px-3 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 font-black text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                  >
                    Space
                  </button>

                  <button
                    type="button"
                    onClick={backspace}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/30 text-rose-300 font-black text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                  >
                    <Delete className="w-3.5 h-3.5" />
                    <span>Del</span>
                  </button>

                  <button
                    type="button"
                    onClick={clearSentence}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-amber-300 font-black text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              {/* Row 2: 1-Tap Quick Toddler Word Starters */}
              <div className="flex items-center gap-1.5 flex-wrap justify-center relative z-10 py-0.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mr-1">
                  Quick Words:
                </span>
                {[
                  { label: 'MOM', emoji: '👩‍🍼' },
                  { label: 'DAD', emoji: '👨‍🍼' },
                  { label: 'I LOVE', emoji: '❤️' },
                  { label: 'WATER', emoji: '💧' },
                  { label: 'MILK', emoji: '🥛' },
                  { label: 'APPLE', emoji: '🍎' },
                  { label: 'BALL', emoji: '⚽' },
                  { label: 'STAR', emoji: '⭐' },
                  { label: 'HAPPY', emoji: '😊' },
                ].map((qw) => (
                  <button
                    key={qw.label}
                    type="button"
                    onClick={() => handleWordPreset(qw.label)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-indigo-500/25 border border-white/10 hover:border-indigo-400/40 text-white/80 hover:text-white text-xs font-extrabold transition-all cursor-pointer active:scale-95"
                  >
                    <span>{qw.emoji}</span>
                    <span>{qw.label}</span>
                  </button>
                ))}
              </div>

              {/* Row 3: Compact A-Z Keyboard Grid (All 3 rows visible simultaneously without scrolling) */}
              <div className="w-full space-y-1.5 sm:space-y-2 relative z-10 select-none">
                {ALPHABET_ROWS.map((row, rowIdx) => (
                  <div key={rowIdx} className="grid grid-cols-9 gap-1 sm:gap-2">
                    {row.map((char) => (
                      <motion.button
                        key={char}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleKeyPress(char)}
                        className="h-10 sm:h-12 rounded-xl bg-white/10 hover:bg-indigo-500/30 border-2 border-white/15 hover:border-indigo-300 flex items-center justify-center transition-all cursor-pointer font-black text-base sm:text-xl text-white shadow-sm"
                      >
                        {char}
                      </motion.button>
                    ))}
                    {row.length === 8 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleKeyPress(' ')}
                        className="h-10 sm:h-12 rounded-xl bg-indigo-500/25 hover:bg-indigo-500/40 border-2 border-indigo-400/40 flex items-center justify-center transition-all cursor-pointer font-black text-[9px] sm:text-xs uppercase tracking-wider text-indigo-200 shadow-sm"
                      >
                        SPACE
                      </motion.button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};
