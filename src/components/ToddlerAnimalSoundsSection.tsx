import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  ChevronLeft,
  ChevronRight,
  Music,
  MapPin,
  Heart
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import { speakIndianEnglish, isVoiceMuted } from '../lib/indianSpeech';

export type AnimalCategory = 'all' | 'forest' | 'village' | 'birds_pets';

export interface AnimalItem {
  id: string;
  name: string;
  hindiName: string;
  category: AnimalCategory;
  categoryLabel: string;
  emoji: string;
  imageUrl: string;
  soundName: string;
  soundPhonetic: string;
  babyName: string;
  habitat: string;
  funFact: string;
  colorName: string;
  borderColor: string;
  bgColor: string;
  freqStart: number;
  freqEnd: number;
  soundType: OscillatorType;
  duration: number;
}

export const CATEGORIES_CONFIG: { id: AnimalCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'All Indian Animals', icon: '🇮🇳' },
  { id: 'forest', label: 'Forest & Safari', icon: '🌲' },
  { id: 'village', label: 'Village & Farm', icon: '🌾' },
  { id: 'birds_pets', label: 'Birds & Gentle Friends', icon: '🦚' }
];

export const ANIMALS_DATA: AnimalItem[] = [
  // 🌾 Village & Farm (Authentic Indian Domestic Animals)
  {
    id: 'cow',
    name: 'Indian Desi Cow',
    hindiName: 'Gau Mata / Gai',
    category: 'village',
    categoryLabel: 'Village & Farm',
    emoji: '🐮',
    imageUrl: '/assets/animals/cow.jpg',
    soundName: 'Sweet Village Moo',
    soundPhonetic: 'MOOOOO!',
    babyName: 'Calf (Bachhda)',
    habitat: 'Indian Village & Gaushala',
    funFact: 'Desi cows have a prominent hump, curved horns, and give nourishing milk for growing toddlers.',
    colorName: 'text-emerald-400',
    borderColor: 'border-emerald-400/50',
    bgColor: 'bg-emerald-500/10',
    freqStart: 160,
    freqEnd: 130,
    soundType: 'triangle',
    duration: 1.2
  },
  {
    id: 'buffalo',
    name: 'Indian Water Buffalo',
    hindiName: 'Bhains',
    category: 'village',
    categoryLabel: 'Village & Farm',
    emoji: '🐃',
    imageUrl: '/assets/animals/buffalo.jpg',
    soundName: 'Deep Village Grunt',
    soundPhonetic: 'BOOOF-MOO!',
    babyName: 'Buffalo Calf (Katta)',
    habitat: 'Paddy Fields & Village Ponds',
    funFact: 'Water buffaloes love wallowing in cool village ponds during hot sunny afternoons.',
    colorName: 'text-slate-300',
    borderColor: 'border-slate-400/50',
    bgColor: 'bg-slate-500/10',
    freqStart: 130,
    freqEnd: 100,
    soundType: 'sawtooth',
    duration: 1.0
  },
  {
    id: 'goat',
    name: 'Indian Village Goat',
    hindiName: 'Bakri',
    category: 'village',
    categoryLabel: 'Village & Farm',
    emoji: '🐐',
    imageUrl: '/assets/animals/goat.jpg',
    soundName: 'Playful Bleat',
    soundPhonetic: 'MEEEH-MAAA!',
    babyName: 'Kid (Memna)',
    habitat: 'Sunny Farm & Green Hillside',
    funFact: 'Baby goats are nimble jumpers that love skipping across rocks and munching green grass.',
    colorName: 'text-teal-300',
    borderColor: 'border-teal-400/50',
    bgColor: 'bg-teal-500/10',
    freqStart: 320,
    freqEnd: 280,
    soundType: 'sawtooth',
    duration: 0.7
  },
  {
    id: 'sheep',
    name: 'Fluffy Sheep',
    hindiName: 'Bhed',
    category: 'village',
    categoryLabel: 'Village & Farm',
    emoji: '🐑',
    imageUrl: '/assets/animals/sheep.jpg',
    soundName: 'Woolly Bleat',
    soundPhonetic: 'BAAA BAAA!',
    babyName: 'Little Lamb',
    habitat: 'Green Meadow & Rolling Hills',
    funFact: 'Sheep grow warm fluffy wool that is spun into soft winter blankets and cozy sweaters.',
    colorName: 'text-sky-300',
    borderColor: 'border-sky-400/50',
    bgColor: 'bg-sky-500/10',
    freqStart: 250,
    freqEnd: 210,
    soundType: 'sawtooth',
    duration: 0.8
  },
  {
    id: 'horse',
    name: 'Marwari Horse',
    hindiName: 'Ghoda',
    category: 'village',
    categoryLabel: 'Village & Farm',
    emoji: '🐴',
    imageUrl: '/assets/animals/horse.jpg',
    soundName: 'Proud Whinny',
    soundPhonetic: 'WHINNY NEIGH!',
    babyName: 'Foal (Bacheda)',
    habitat: 'Royal Meadows & Pastures',
    funFact: 'Famous Indian Marwari horses have distinctive inward-curving ears and can gallop fast like the wind.',
    colorName: 'text-amber-300',
    borderColor: 'border-amber-400/50',
    bgColor: 'bg-amber-500/10',
    freqStart: 350,
    freqEnd: 550,
    soundType: 'sawtooth',
    duration: 0.9
  },
  {
    id: 'camel',
    name: 'Thar Desert Camel',
    hindiName: 'Oont',
    category: 'village',
    categoryLabel: 'Village & Farm',
    emoji: '🐪',
    imageUrl: '/assets/animals/camel.jpg',
    soundName: 'Desert Grunt',
    soundPhonetic: 'GRRR-HUMPH!',
    babyName: 'Camel Calf (Todia)',
    habitat: 'Golden Thar Desert, Rajasthan',
    funFact: 'Known as the "Ship of the Desert", camels have padded feet that glide effortlessly across golden sand.',
    colorName: 'text-yellow-400',
    borderColor: 'border-yellow-400/50',
    bgColor: 'bg-yellow-500/10',
    freqStart: 180,
    freqEnd: 120,
    soundType: 'sawtooth',
    duration: 0.8
  },

  // 🌲 Forest & Safari (Indian Wildlife in Natural Habitat)
  {
    id: 'tiger',
    name: 'Royal Bengal Tiger',
    hindiName: 'Bagh',
    category: 'forest',
    categoryLabel: 'Forest & Safari',
    emoji: '🐯',
    imageUrl: '/assets/animals/tiger.jpg',
    soundName: 'Mighty Jungle Roar',
    soundPhonetic: 'GRRR-ROAAAR!',
    babyName: 'Tiger Cub',
    habitat: 'Ranthambore & Corbett Forests',
    funFact: 'The national animal of India, Bengal tigers love cooling off in forest streams and have gorgeous stripes.',
    colorName: 'text-orange-400',
    borderColor: 'border-orange-400/50',
    bgColor: 'bg-orange-500/10',
    freqStart: 140,
    freqEnd: 90,
    soundType: 'sawtooth',
    duration: 1.0
  },
  {
    id: 'lion',
    name: 'Asiatic Lion',
    hindiName: 'Sher / Babar Sher',
    category: 'forest',
    categoryLabel: 'Forest & Safari',
    emoji: '🦁',
    imageUrl: '/assets/animals/lion.jpg',
    soundName: 'Majestic Roar',
    soundPhonetic: 'ROOOAAAR!',
    babyName: 'Lion Cub',
    habitat: 'Gir Forest National Park, Gujarat',
    funFact: 'Gir Forest is the only natural home of Asiatic lions in the world, living peacefully in family prides.',
    colorName: 'text-amber-400',
    borderColor: 'border-amber-400/50',
    bgColor: 'bg-amber-500/10',
    freqStart: 120,
    freqEnd: 80,
    soundType: 'sawtooth',
    duration: 0.9
  },
  {
    id: 'elephant',
    name: 'Asian Elephant',
    hindiName: 'Haathi',
    category: 'forest',
    categoryLabel: 'Forest & Safari',
    emoji: '🐘',
    imageUrl: '/assets/animals/elephant.jpg',
    soundName: 'Loud Trumpet',
    soundPhonetic: 'PAWOOOOO!',
    babyName: 'Elephant Calf (Haathi ka Bachha)',
    habitat: 'Wayanad, Bandipur & Kaziranga',
    funFact: 'Elephants have gentle trunks with over 40,000 muscles used to pick sweet sugarcane and spray water.',
    colorName: 'text-slate-200',
    borderColor: 'border-slate-300/50',
    bgColor: 'bg-slate-500/10',
    freqStart: 280,
    freqEnd: 520,
    soundType: 'sawtooth',
    duration: 1.1
  },
  {
    id: 'deer',
    name: 'Spotted Chital Deer',
    hindiName: 'Chital / Hiran',
    category: 'forest',
    categoryLabel: 'Forest & Safari',
    emoji: '🦌',
    imageUrl: '/assets/animals/deer.jpg',
    soundName: 'Gentle Whistle Call',
    soundPhonetic: 'PEEP-WHEEE!',
    babyName: 'Fawn (Hiran ka Bachha)',
    habitat: 'Sal Forests & Nagarhole Meadows',
    funFact: 'Spotted deer keep their bright white spots their entire lives and leap gracefully over high bushes.',
    colorName: 'text-amber-300',
    borderColor: 'border-amber-400/50',
    bgColor: 'bg-amber-500/10',
    freqStart: 440,
    freqEnd: 600,
    soundType: 'sine',
    duration: 0.5
  },
  {
    id: 'monkey',
    name: 'Gray Langur Monkey',
    hindiName: 'Langur / Bandar',
    category: 'forest',
    categoryLabel: 'Forest & Safari',
    emoji: '🐵',
    imageUrl: '/assets/animals/monkey.jpg',
    soundName: 'Playful Whoop',
    soundPhonetic: 'WHOOP WHOOP-AAH!',
    babyName: 'Infant Monkey',
    habitat: 'Ancient Banyan Trees & Temples',
    funFact: 'Gray langurs have long balancing tails and make cheerful alarm calls to warn deer when a tiger is near.',
    colorName: 'text-amber-400',
    borderColor: 'border-amber-400/50',
    bgColor: 'bg-amber-500/10',
    freqStart: 450,
    freqEnd: 750,
    soundType: 'triangle',
    duration: 0.6
  },

  // 🦚 Birds & Friendly Friends
  {
    id: 'peacock',
    name: 'Indian Blue Peacock',
    hindiName: 'Mayur / Mor',
    category: 'birds_pets',
    categoryLabel: 'Birds & Gentle Friends',
    emoji: '🦚',
    imageUrl: '/assets/animals/peacock.jpg',
    soundName: 'Monsoon Call',
    soundPhonetic: 'MAYUR / KEH-O!',
    babyName: 'Peachick',
    habitat: 'National Bird of India',
    funFact: 'Peacocks spread out their iridescent fan of shimmering emerald feathers to celebrate monsoon rain clouds.',
    colorName: 'text-indigo-400',
    borderColor: 'border-indigo-400/50',
    bgColor: 'bg-indigo-500/10',
    freqStart: 500,
    freqEnd: 350,
    soundType: 'sine',
    duration: 0.8
  },
  {
    id: 'parrot',
    name: 'Rose-Ringed Parakeet',
    hindiName: 'Tota',
    category: 'birds_pets',
    categoryLabel: 'Birds & Gentle Friends',
    emoji: '🦜',
    imageUrl: '/assets/animals/parrot.jpg',
    soundName: 'Sweet Chirp-Squawk',
    soundPhonetic: 'MEETHOO-KEE-KEE!',
    babyName: 'Parrot Chick',
    habitat: 'Mango & Neem Trees across India',
    funFact: 'Indian parrots love juicy red chillies and sweet mangoes, and can learn to say "Meethoo"!',
    colorName: 'text-emerald-400',
    borderColor: 'border-emerald-400/50',
    bgColor: 'bg-emerald-500/10',
    freqStart: 580,
    freqEnd: 760,
    soundType: 'triangle',
    duration: 0.5
  },
  {
    id: 'rooster',
    name: 'Desi Country Rooster',
    hindiName: 'Kukdu-Koo Murga',
    category: 'birds_pets',
    categoryLabel: 'Birds & Gentle Friends',
    emoji: '🐓',
    imageUrl: '/assets/animals/rooster.jpg',
    soundName: 'Morning Crow',
    soundPhonetic: 'KUKDU-KOOO!',
    babyName: 'Chick (Chooza)',
    habitat: 'Indian Village Farmyard',
    funFact: 'Roosters crow bright and early at dawn to wake up village farmers and singing birds.',
    colorName: 'text-rose-400',
    borderColor: 'border-rose-400/50',
    bgColor: 'bg-rose-500/10',
    freqStart: 420,
    freqEnd: 680,
    soundType: 'triangle',
    duration: 1.0
  },
  {
    id: 'duck',
    name: 'Indian Pond Duck',
    hindiName: 'Batakh',
    category: 'birds_pets',
    categoryLabel: 'Birds & Gentle Friends',
    emoji: '🦆',
    imageUrl: '/assets/animals/duck.jpg',
    soundName: 'Splashing Quack',
    soundPhonetic: 'QUACK QUACK!',
    babyName: 'Duckling',
    habitat: 'Village Lotus Ponds',
    funFact: 'Ducks have waterproof feathers and webbed orange feet that paddle smoothly across lotus ponds.',
    colorName: 'text-teal-400',
    borderColor: 'border-teal-400/50',
    bgColor: 'bg-teal-500/10',
    freqStart: 320,
    freqEnd: 280,
    soundType: 'sawtooth',
    duration: 0.5
  },
  {
    id: 'dog',
    name: 'Friendly Desi Dog',
    hindiName: 'Kutta / Tommy',
    category: 'birds_pets',
    categoryLabel: 'Birds & Gentle Friends',
    emoji: '🐶',
    imageUrl: '/assets/animals/dog.jpg',
    soundName: 'Happy Bark',
    soundPhonetic: 'BHO-BHO / WOOF!',
    babyName: 'Puppy (Pilla)',
    habitat: 'Cozy Courtyard & Garden',
    funFact: 'Desi Indian dogs are exceptionally loyal, intelligent, and wag their tails warmly to greet children.',
    colorName: 'text-yellow-400',
    borderColor: 'border-yellow-400/50',
    bgColor: 'bg-yellow-500/10',
    freqStart: 380,
    freqEnd: 240,
    soundType: 'square',
    duration: 0.4
  },
  {
    id: 'cat',
    name: 'Gentle Indian Cat',
    hindiName: 'Billi',
    category: 'birds_pets',
    categoryLabel: 'Birds & Gentle Friends',
    emoji: '🐱',
    imageUrl: '/assets/animals/cat.jpg',
    soundName: 'Sweet Meow',
    soundPhonetic: 'MYAA-OOWW!',
    babyName: 'Kitten (Billi ka Bachha)',
    habitat: 'Warm Verandah & Windowsill',
    funFact: 'Cats purr gently when stroked softly behind the ears and love curling up in warm sunshine.',
    colorName: 'text-pink-400',
    borderColor: 'border-pink-400/50',
    bgColor: 'bg-pink-500/10',
    freqStart: 600,
    freqEnd: 320,
    soundType: 'sine',
    duration: 0.7
  }
];

export const ToddlerAnimalSoundsSection: React.FC = () => {
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalItem>(ANIMALS_DATA[0]);
  const [activeTab, setActiveTab] = useState<'soundboard' | 'quiz'>('soundboard');
  const [activeCategory, setActiveCategory] = useState<AnimalCategory>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 9 items per page = 3 rows of 3 big cards in a 3-column grid
  const ITEMS_PER_PAGE = 9;

  // Filter animals by category
  const filteredAnimals = useMemo(() => {
    if (activeCategory === 'all') return ANIMALS_DATA;
    return ANIMALS_DATA.filter((a) => a.category === activeCategory);
  }, [activeCategory]);

  const totalPages = Math.ceil(filteredAnimals.length / ITEMS_PER_PAGE);

  // Paginated animals for current page
  const paginatedAnimals = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAnimals.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAnimals, currentPage]);

  // Quiz State
  const [quizAnimal, setQuizAnimal] = useState<AnimalItem>(() => {
    return ANIMALS_DATA[Math.floor(Math.random() * ANIMALS_DATA.length)];
  });
  const [quizChoices, setQuizChoices] = useState<AnimalItem[]>([]);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);

  const handleSelectCategory = (catId: AnimalCategory) => {
    playSound('click');
    setActiveCategory(catId);
    setCurrentPage(1);
  };

  const playAnimalSynth = (item: AnimalItem) => {
    if (isVoiceMuted()) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = item.soundType;
      osc.frequency.setValueAtTime(item.freqStart, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, item.freqEnd), ctx.currentTime + item.duration);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + item.duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + item.duration);
    } catch (e) {
      console.warn('Audio synth fallback engaged:', e);
    }
  };

  const speakText = (text: string) => {
    speakIndianEnglish(text);
  };

  const handleSelectAnimal = (animal: AnimalItem) => {
    playSound('pop');
    setSelectedAnimal(animal);
    playAnimalSynth(animal);
    setTimeout(() => {
      speakText(`${animal.name} says ${animal.soundPhonetic}!`);
    }, 350);
  };

  const generateQuizRound = (target: AnimalItem) => {
    const decoys = ANIMALS_DATA.filter((a) => a.id !== target.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const roundChoices = [target, ...decoys].sort(() => 0.5 - Math.random());
    setQuizAnimal(target);
    setQuizChoices(roundChoices);
  };

  const handleQuizAnswer = (animal: AnimalItem) => {
    if (animal.id === quizAnimal.id) {
      playSound('glass');
      setQuizFeedback('correct');
      setQuizScore((prev) => prev + 1);
      speakText(`Shabash! The ${animal.name} says ${animal.soundPhonetic}! You got it right!`);
      setTimeout(() => {
        setQuizFeedback(null);
        const remaining = ANIMALS_DATA.filter((a) => a.id !== animal.id);
        const next = remaining[Math.floor(Math.random() * remaining.length)];
        generateQuizRound(next);
        playAnimalSynth(next);
        speakText(`Who makes this sound: ${next.soundPhonetic}?`);
      }, 1800);
    } else {
      playSound('click');
      setQuizFeedback('wrong');
      speakText(`That is a ${animal.name}. Listen again carefully!`);
      setTimeout(() => setQuizFeedback(null), 1400);
    }
  };

  const startQuiz = () => {
    playSound('glass');
    setActiveTab('quiz');
    setQuizScore(0);
    const first = ANIMALS_DATA[Math.floor(Math.random() * ANIMALS_DATA.length)];
    generateQuizRound(first);
    playAnimalSynth(first);
    speakText(`Let us play Who Said That! Listen: ${first.soundPhonetic}! Which Indian animal makes this sound?`);
  };

  return (
    <div className="space-y-6 sm:space-y-8 font-sans">
      {/* Sub Mode Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/[0.03] border border-white/10 p-3 sm:p-4 rounded-3xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
            🐮
          </div>
          <div className="text-left">
            <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
              <span>Indian Animal Kingdom & Sounds</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
                17 Desi & Wildlife Species
              </span>
            </h2>
            <p className="text-xs text-white/50">
              Clear whole-view Indian animals, authentic calls, Hindi names, baby names, and curious nature facts!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              setActiveTab('soundboard');
              speakText('Let us explore wonderful Indian animals!');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'soundboard'
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            Animal Soundboard
          </button>
          <button
            type="button"
            onClick={startQuiz}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-emerald-400 text-slate-950 shadow-md font-black'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Who Said That? Quiz</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Soundboard Explorer */}
      {activeTab === 'soundboard' && (
        <div className="space-y-6">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES_CONFIG.map((cat) => {
              const count = cat.id === 'all' 
                ? ANIMALS_DATA.length 
                : ANIMALS_DATA.filter((a) => a.category === cat.id).length;
              const isSelected = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/20 font-black scale-102'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/25 hover:bg-white/10'
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isSelected ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-white/10 text-white/60'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Full Width 3-in-a-Row Animal Cards Grid (No Right Section) */}
          <div className="space-y-6">
            {/* 3-in-a-Row Big Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {paginatedAnimals.map((animal) => {
                const isSelected = selectedAnimal.id === animal.id;
                return (
                  <motion.button
                    key={animal.id}
                    type="button"
                    whileHover={{ scale: 1.02, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectAnimal(animal)}
                    className={`relative p-4 rounded-3xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between group overflow-hidden ${
                      isSelected
                        ? `bg-white/15 ${animal.borderColor} ring-2 ring-amber-400 shadow-xl shadow-amber-500/15`
                        : `${animal.bgColor} border-white/10 hover:border-white/20 hover:bg-white/10`
                    }`}
                  >
                    {/* Real Indian Animal Photo - Clear Full Body View */}
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3 border border-white/20 bg-slate-900 flex-shrink-0 relative shadow-md">
                      <img
                        src={animal.imageUrl}
                        alt={animal.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="eager"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Animal Name & Sound Action (No Hindi name, No baby name) */}
                    <div className="w-full text-center space-y-2">
                      <div className="font-black text-base sm:text-lg text-white tracking-wide">
                        {animal.name}
                      </div>

                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          playAnimalSynth(animal);
                          speakText(`${animal.name} says ${animal.soundPhonetic}!`);
                        }}
                        className="px-3 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>"{animal.soundPhonetic}"</span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="absolute top-3 right-3 w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="text-xs text-white/60 font-medium">
                  Showing <strong className="text-white font-bold">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredAnimals.length)}</strong> of <strong className="text-amber-300 font-bold">{filteredAnimals.length}</strong> Indian animals
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => {
                      playSound('click');
                      setCurrentPage((p) => Math.max(1, p - 1));
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white cursor-pointer transition-all"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setCurrentPage(pageNum);
                      }}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                          : 'bg-white/5 text-white/70 hover:bg-white/15 hover:text-white border border-white/10'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      playSound('click');
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white cursor-pointer transition-all"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: "Who Said That?" Mystery Quiz (Real Quiz: NO Names, NO Clues, ONLY Animal Photos!) */}
      {activeTab === 'quiz' && (
        <div className="max-w-3xl mx-auto p-6 sm:p-10 rounded-3xl border-2 border-emerald-400/40 bg-gradient-to-br from-[#122421] via-[#0d1a18] to-[#07100e] shadow-2xl text-center space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">
              Wildlife Score: <strong className="text-emerald-300 font-black text-base">{quizScore}</strong> ⭐
            </span>
            <button
              type="button"
              onClick={() => {
                playAnimalSynth(quizAnimal);
                speakText(`Who makes this sound: ${quizAnimal.soundPhonetic}?`);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-400/30 font-bold cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Replay Sound</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-black text-emerald-400 uppercase tracking-widest">
              Who Said That? Sound Quiz
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white">
              Who says <span className="text-amber-300">"{quizAnimal.soundPhonetic}"</span>?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Listen carefully to the sound! Tap the animal picture that makes this sound.
            </p>
          </div>

          {/* Feedback Splash */}
          <AnimatePresence>
            {quizFeedback && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`py-3 px-6 rounded-2xl text-sm font-black inline-flex items-center gap-2 ${
                  quizFeedback === 'correct'
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'bg-rose-500 text-white shadow-lg'
                }`}
              >
                {quizFeedback === 'correct' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Bingo! That was the {quizAnimal.name}! 🌟</span>
                  </>
                ) : (
                  <span>Not quite! Listen again and give it another try! 🐾</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 4 Choice Tiles: ONLY THE PHOTO OF THE ANIMAL, NO TEXT LABELS OR CLUES! */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-4">
            {(quizChoices.length > 0 ? quizChoices : ANIMALS_DATA.slice(0, 4)).map((animal) => (
              <button
                key={animal.id}
                type="button"
                onClick={() => handleQuizAnswer(animal)}
                className="p-3 sm:p-4 rounded-3xl bg-white/5 hover:bg-white/15 border-2 border-white/10 hover:border-emerald-400/80 transition-all cursor-pointer flex flex-col items-center justify-center active:scale-95 shadow-xl group"
              >
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/20 bg-slate-900 shadow-inner">
                  <img
                    src={animal.imageUrl}
                    alt="Animal option"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="eager"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
