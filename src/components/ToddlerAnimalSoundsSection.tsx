import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Star, 
  HelpCircle,
  Music,
  Play
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import { speakIndianEnglish, isVoiceMuted } from '../lib/indianSpeech';

export interface AnimalItem {
  id: string;
  name: string;
  emoji: string;
  soundName: string;
  soundPhonetic: string;
  babyName: string;
  habitat: string;
  funFact: string;
  colorName: string;
  borderColor: string;
  bgColor: string;
  // Audio synthesis parameters
  freqStart: number;
  freqEnd: number;
  soundType: OscillatorType;
  duration: number;
}

export const ANIMALS_DATA: AnimalItem[] = [
  {
    id: 'lion',
    name: 'Lion',
    emoji: '🦁',
    soundName: 'Mighty Roar',
    soundPhonetic: 'ROOOAAAR!',
    babyName: 'Lion Cub',
    habitat: 'Jungle & Savanna',
    funFact: 'Lions have majestic manes and sleep under shady acacia trees.',
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
    name: 'Elephant',
    emoji: '🐘',
    soundName: 'Trumpet',
    soundPhonetic: 'PAWOOOOO!',
    babyName: 'Baby Calf',
    habitat: 'Indian Forest & Grasslands',
    funFact: 'Elephants use their long trunks to drink water and give gentle shower hugs!',
    colorName: 'text-slate-300',
    borderColor: 'border-slate-400/50',
    bgColor: 'bg-slate-500/10',
    freqStart: 280,
    freqEnd: 520,
    soundType: 'sawtooth',
    duration: 1.1
  },
  {
    id: 'cow',
    name: 'Cow',
    emoji: '🐮',
    soundName: 'Gentle Moo',
    soundPhonetic: 'MOOOOO!',
    babyName: 'Calf',
    habitat: 'Farm & Village Meadow',
    funFact: 'Cows munch green grass and give healthy calcium-rich milk for growing toddlers.',
    colorName: 'text-emerald-400',
    borderColor: 'border-emerald-400/50',
    bgColor: 'bg-emerald-500/10',
    freqStart: 160,
    freqEnd: 130,
    soundType: 'triangle',
    duration: 1.2
  },
  {
    id: 'dog',
    name: 'Puppy Dog',
    emoji: '🐶',
    soundName: 'Happy Bark',
    soundPhonetic: 'WOOF WOOF!',
    babyName: 'Puppy',
    habitat: 'Cozy Home & Garden',
    funFact: 'Dogs wag their tails excitedly whenever their favorite little human comes home!',
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
    name: 'Kitten Cat',
    emoji: '🐱',
    soundName: 'Sweet Meow',
    soundPhonetic: 'MEEE-OWWW!',
    babyName: 'Kitten',
    habitat: 'Sunny Windowsill',
    funFact: 'Cats purr like a gentle motor when they feel super cozy and happy.',
    colorName: 'text-pink-400',
    borderColor: 'border-pink-400/50',
    bgColor: 'bg-pink-500/10',
    freqStart: 600,
    freqEnd: 320,
    soundType: 'sine',
    duration: 0.7
  },
  {
    id: 'duck',
    name: 'Duck',
    emoji: '🦆',
    soundName: 'Splashing Quack',
    soundPhonetic: 'QUACK QUACK!',
    babyName: 'Duckling',
    habitat: 'Sparkling Pond',
    funFact: 'Ducks have waterproof feathers and webbed feet that paddle like little oars.',
    colorName: 'text-teal-400',
    borderColor: 'border-teal-400/50',
    bgColor: 'bg-teal-500/10',
    freqStart: 320,
    freqEnd: 280,
    soundType: 'sawtooth',
    duration: 0.5
  },
  {
    id: 'monkey',
    name: 'Monkey',
    emoji: '🐵',
    soundName: 'Playful Chatter',
    soundPhonetic: 'OOH OOH AAH AAH!',
    babyName: 'Infant Monkey',
    habitat: 'High Tree Canopy',
    funFact: 'Monkeys swing from branch to branch with their strong tail and love sweet bananas.',
    colorName: 'text-orange-400',
    borderColor: 'border-orange-400/50',
    bgColor: 'bg-orange-500/10',
    freqStart: 450,
    freqEnd: 750,
    soundType: 'triangle',
    duration: 0.6
  },
  {
    id: 'sheep',
    name: 'Sheep',
    emoji: '🐑',
    soundName: 'Woolly Bleat',
    soundPhonetic: 'BAAA BAAA!',
    babyName: 'Little Lamb',
    habitat: 'Green Rolling Hills',
    funFact: 'Sheep grow fluffy warm wool that makes soft winter sweaters and blankets.',
    colorName: 'text-sky-300',
    borderColor: 'border-sky-400/50',
    bgColor: 'bg-sky-500/10',
    freqStart: 250,
    freqEnd: 210,
    soundType: 'sawtooth',
    duration: 0.8
  },
  {
    id: 'rooster',
    name: 'Rooster',
    emoji: '🐓',
    soundName: 'Morning Crow',
    soundPhonetic: 'COCK-A-DOODLE-DOO!',
    babyName: 'Chick',
    habitat: 'Sunrise Farmyard',
    funFact: 'Roosters crow bright and early when the sun peeks over the morning horizon.',
    colorName: 'text-rose-400',
    borderColor: 'border-rose-400/50',
    bgColor: 'bg-rose-500/10',
    freqStart: 400,
    freqEnd: 650,
    soundType: 'triangle',
    duration: 1.0
  },
  {
    id: 'peacock',
    name: 'Peacock',
    emoji: '🦚',
    soundName: 'Joyful Call',
    soundPhonetic: 'MAYUR / KEH-O!',
    babyName: 'Peachick',
    habitat: 'National Bird of India',
    funFact: 'Peacocks spread out their iridescent emerald feathers and dance when rain clouds arrive!',
    colorName: 'text-indigo-400',
    borderColor: 'border-indigo-400/50',
    bgColor: 'bg-indigo-500/10',
    freqStart: 500,
    freqEnd: 350,
    soundType: 'sine',
    duration: 0.8
  },
  {
    id: 'frog',
    name: 'Frog',
    emoji: '🐸',
    soundName: 'Ribbit Croak',
    soundPhonetic: 'RIBBIT RIBBIT!',
    babyName: 'Little Tadpole',
    habitat: 'Lily Pad Pond',
    funFact: 'Frogs start life as tiny swimming tadpoles before growing strong jumping legs.',
    colorName: 'text-lime-400',
    borderColor: 'border-lime-400/50',
    bgColor: 'bg-lime-500/10',
    freqStart: 180,
    freqEnd: 140,
    soundType: 'square',
    duration: 0.4
  },
  {
    id: 'horse',
    name: 'Horse',
    emoji: '🐴',
    soundName: 'Cheerful Neigh',
    soundPhonetic: 'WHINNY NEIGH!',
    babyName: 'Foal',
    habitat: 'Green Pasture',
    funFact: 'Horses can run fast like the wind and sleep both lying down and standing up!',
    colorName: 'text-amber-300',
    borderColor: 'border-amber-400/50',
    bgColor: 'bg-amber-500/10',
    freqStart: 350,
    freqEnd: 550,
    soundType: 'sawtooth',
    duration: 0.9
  }
];

export const ToddlerAnimalSoundsSection: React.FC = () => {
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalItem>(ANIMALS_DATA[0]);
  const [activeTab, setActiveTab] = useState<'soundboard' | 'quiz'>('soundboard');

  // Quiz State
  const [quizAnimal, setQuizAnimal] = useState<AnimalItem>(() => {
    return ANIMALS_DATA[Math.floor(Math.random() * ANIMALS_DATA.length)];
  });
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Play synthetic tone using Web Audio API
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
      speakText(`${animal.name} says ${animal.soundPhonetic}! Baby is called a ${animal.babyName}.`);
    }, 350);
  };

  const handleQuizAnswer = (animal: AnimalItem) => {
    if (animal.id === quizAnimal.id) {
      playSound('glass');
      setQuizFeedback('correct');
      setQuizScore((prev) => prev + 1);
      speakText(`Hooray! The ${animal.name} says ${animal.soundPhonetic}! You got it right!`);
      setTimeout(() => {
        setQuizFeedback(null);
        const remaining = ANIMALS_DATA.filter((a) => a.id !== animal.id);
        const next = remaining[Math.floor(Math.random() * remaining.length)];
        setQuizAnimal(next);
        playAnimalSynth(next);
        speakText(`Who makes this sound? ${next.soundPhonetic}?`);
      }, 1800);
    } else {
      playSound('click');
      setQuizFeedback('wrong');
      speakText(`That is a ${animal.name}. Listen again!`);
      setTimeout(() => setQuizFeedback(null), 1400);
    }
  };

  const startQuiz = () => {
    playSound('glass');
    setActiveTab('quiz');
    setQuizScore(0);
    const first = ANIMALS_DATA[Math.floor(Math.random() * ANIMALS_DATA.length)];
    setQuizAnimal(first);
    playAnimalSynth(first);
    speakText(`Let us play Who Said That! Listen: ${first.soundPhonetic}! Who made this sound?`);
  };

  return (
    <div className="space-y-6 sm:space-y-8 font-sans">
      {/* Sub Mode Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/[0.03] border border-white/10 p-3 sm:p-4 rounded-3xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
            🦁
          </div>
          <div className="text-left">
            <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
              <span>Animal Kingdom & Sounds</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
                Auditory & Wildlife
              </span>
            </h2>
            <p className="text-xs text-white/50">
              Tap any animal to hear its cheerful sound, baby animal names, and fun nature facts!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              setActiveTab('soundboard');
              speakText('Let us listen to wonderful animal sounds!');
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Left Column: 12 Animal Tiles */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {ANIMALS_DATA.map((animal) => {
                const isSelected = selectedAnimal.id === animal.id;
                return (
                  <motion.button
                    key={animal.id}
                    type="button"
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleSelectAnimal(animal)}
                    className={`relative p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[135px] ${
                      isSelected
                        ? `bg-white/15 ${animal.borderColor} ring-2 ring-amber-400 shadow-xl shadow-amber-500/10`
                        : `${animal.bgColor} border-white/10 hover:border-white/20 hover:bg-white/10`
                    }`}
                  >
                    <div className="text-4xl mb-2 filter drop-shadow-md">
                      {animal.emoji}
                    </div>
                    <div className="font-black text-sm text-white tracking-wide">
                      {animal.name}
                    </div>
                    <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mt-0.5">
                      {animal.soundPhonetic}
                    </div>
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Animal Spotlight Card */}
          <div className="lg:col-span-1">
            <motion.div
              key={selectedAnimal.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-6 sm:p-7 rounded-3xl border-2 ${selectedAnimal.borderColor} bg-gradient-to-br from-[#1d1b28] via-[#14121d] to-[#0a0910] shadow-2xl text-left space-y-5`}
            >
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-4xl shadow-inner">
                  {selectedAnimal.emoji}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playAnimalSynth(selectedAnimal);
                    speakText(`${selectedAnimal.soundPhonetic}! The ${selectedAnimal.name} says ${selectedAnimal.soundName}`);
                  }}
                  className="p-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-md"
                  title="Play Animal Sound"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="text-xs font-bold">Hear Sound</span>
                </button>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  {selectedAnimal.soundName}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                  {selectedAnimal.name}
                </h3>
              </div>

              {/* Sound Bubble Callout */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 space-y-1 text-center">
                <div className="text-[10px] uppercase font-bold text-amber-300">Animal Sound</div>
                <div className="text-2xl font-black text-amber-300 tracking-wider">
                  "{selectedAnimal.soundPhonetic}"
                </div>
              </div>

              {/* Baby Animal & Habitat */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase font-bold">Baby Name</div>
                  <div className="font-bold text-white mt-0.5">{selectedAnimal.babyName}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase font-bold">Home Habitat</div>
                  <div className="font-bold text-white mt-0.5">{selectedAnimal.habitat}</div>
                </div>
              </div>

              {/* Fun Nature Fact */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 space-y-1">
                <div className="text-[11px] font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Fun Nature Fact</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
                  {selectedAnimal.funFact}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Mode 2: "Who Said That?" Quiz */}
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
              Who Said That? Mystery Quiz
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white">
              Who says <span className="text-amber-300">"{quizAnimal.soundPhonetic}"</span>?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Listen carefully to the sound! Tap the animal that made it.
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

          {/* Choice Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4">
            {ANIMALS_DATA.map((animal) => (
              <button
                key={animal.id}
                type="button"
                onClick={() => handleQuizAnswer(animal)}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-emerald-400/60 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 active:scale-95 shadow-md"
              >
                <span className="text-4xl">{animal.emoji}</span>
                <span className="text-xs sm:text-sm font-bold text-white">{animal.name}</span>
                <span className="text-[10px] text-amber-300/80">{animal.soundName}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
