import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Volume2, 
  RotateCcw, 
  CheckCircle2, 
  Smile, 
  Heart, 
  Star, 
  Check, 
  Timer, 
  Play, 
  Pause,
  Award
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import { speakIndianEnglish } from '../lib/indianSpeech';

export interface BodyPartItem {
  id: string;
  name: string;
  emoji: string;
  imageUrl: string;
  pronunciation: string;
  color: string;
  borderColor: string;
  bgColor: string;
  whatItDoes: string;
  funAction: string;
  sillyTip: string;
  count: string;
}

export const BODY_PARTS_DATA: BodyPartItem[] = [
  {
    id: 'eyes',
    name: 'Eyes',
    emoji: '👀',
    imageUrl: '/assets/body-parts/eyes.png',
    pronunciation: 'Eye-z',
    color: 'text-sky-300',
    borderColor: 'border-sky-400/40',
    bgColor: 'bg-sky-500/10',
    whatItDoes: 'We see colors, books, mommy, and daddy with our two sparkling eyes!',
    funAction: 'Blink your eyes 3 times like a happy little owl! 🦉',
    sillyTip: 'Can you close your eyes and guess what sounds you hear?',
    count: '2 Eyes'
  },
  {
    id: 'ears',
    name: 'Ears',
    emoji: '👂',
    imageUrl: '/assets/body-parts/ears.jpg',
    pronunciation: 'Ear-z',
    color: 'text-amber-300',
    borderColor: 'border-amber-400/40',
    bgColor: 'bg-amber-500/10',
    whatItDoes: 'We listen to sweet rhymes, bird chirps, and laughing sounds with our ears.',
    funAction: 'Gently wiggle your ears with your fingertips! 🐰',
    sillyTip: 'Cup your ears like elephant ears to hear super sounds!',
    count: '2 Ears'
  },
  {
    id: 'nose',
    name: 'Nose',
    emoji: '👃',
    imageUrl: '/assets/body-parts/nose.jpg',
    pronunciation: 'Noh-z',
    color: 'text-rose-300',
    borderColor: 'border-rose-400/40',
    bgColor: 'bg-rose-500/10',
    whatItDoes: 'We smell fragrant flowers, yummy food, and take deep fresh breaths.',
    funAction: 'Wiggle your cute button nose like a fluffy little bunny rabbit! 🐇',
    sillyTip: 'Take a big sniff like you are smelling fresh hot dosa or mangoes!',
    count: '1 Cute Nose'
  },
  {
    id: 'mouth',
    name: 'Mouth & Smile',
    emoji: '👄',
    imageUrl: '/assets/body-parts/mouth.jpg',
    pronunciation: 'Mow-th',
    color: 'text-pink-300',
    borderColor: 'border-pink-400/40',
    bgColor: 'bg-pink-500/10',
    whatItDoes: 'We eat delicious fruits, talk with our family, and share giant sweet smiles!',
    funAction: 'Give your biggest, happiest cheesy smile right now! 😁',
    sillyTip: 'Can you blow a gentle flying kiss to someone you love? 💋',
    count: '1 Smiling Mouth'
  },
  {
    id: 'teeth',
    name: 'Teeth',
    emoji: '🦷',
    imageUrl: '/assets/body-parts/teeth.jpg',
    pronunciation: 'Teeth',
    color: 'text-teal-300',
    borderColor: 'border-teal-400/40',
    bgColor: 'bg-teal-500/10',
    whatItDoes: 'Our clean, strong white baby teeth chew crunchy apples and carrots.',
    funAction: 'Chomp chomp gently like a friendly little squirrel eating nuts! 🐿️',
    sillyTip: 'Brush round and round morning and night to keep teeth sparkling white!',
    count: 'Sparkling Teeth'
  },
  {
    id: 'hands',
    name: 'Hands',
    emoji: '🖐️',
    imageUrl: '/assets/body-parts/hands.png',
    pronunciation: 'Hand-z',
    color: 'text-emerald-300',
    borderColor: 'border-emerald-400/40',
    bgColor: 'bg-emerald-500/10',
    whatItDoes: 'We draw, build blocks, hold mommy and daddy’s hand, and wave goodbye.',
    funAction: 'Clap your hands together 5 times! Clap, clap, clap! 👏',
    sillyTip: 'Open wide, give high-fives and make gentle butterfly wings!',
    count: '2 Warm Hands'
  },
  {
    id: 'fingers',
    name: 'Fingers',
    emoji: '🤏',
    imageUrl: '/assets/body-parts/fingers.jpg',
    pronunciation: 'Fing-ger-z',
    color: 'text-green-300',
    borderColor: 'border-green-400/40',
    bgColor: 'bg-green-500/10',
    whatItDoes: 'Our gentle fingers pinch small blueberries, turn book pages, and tickle!',
    funAction: 'Wiggle all 10 fingers like gentle raindrops falling from the clouds! 🌧️',
    sillyTip: 'Count your 5 fingers on each hand: 1, 2, 3, 4, 5!',
    count: '10 Tiny Fingers'
  },
  {
    id: 'tummy',
    name: 'Tummy / Belly',
    emoji: '🧸',
    imageUrl: '/assets/body-parts/tummy.jpg',
    pronunciation: 'Tum-mee',
    color: 'text-yellow-300',
    borderColor: 'border-yellow-400/40',
    bgColor: 'bg-yellow-500/10',
    whatItDoes: 'Our tummy digests yummy healthy food and helps us grow big and strong.',
    funAction: 'Give your tummy a gentle circular rub! Rub, rub, rub! 🍯',
    sillyTip: 'When we are happy, our belly giggles and jiggles with laughter!',
    count: '1 Happy Tummy'
  },
  {
    id: 'knees',
    name: 'Knees',
    emoji: '🦵',
    imageUrl: '/assets/body-parts/knees.jpg',
    pronunciation: 'Nee-z',
    color: 'text-indigo-300',
    borderColor: 'border-indigo-400/40',
    bgColor: 'bg-indigo-500/10',
    whatItDoes: 'Our bendy knees help us crawl, jump, sit criss-cross apple sauce, and run!',
    funAction: 'Bend your knees and bounce up and down softly like a kangaroo! 🦘',
    sillyTip: 'Touch your knees, then reach up high to the sky!',
    count: '2 Bendy Knees'
  },
  {
    id: 'feet',
    name: 'Feet',
    emoji: '🦶',
    imageUrl: '/assets/body-parts/feet.jpg',
    pronunciation: 'Feet',
    color: 'text-cyan-300',
    borderColor: 'border-cyan-400/40',
    bgColor: 'bg-cyan-500/10',
    whatItDoes: 'Our soft feet take us on adventures, balance us tall, and dance to music.',
    funAction: 'Tiptoe softly like a gentle little kitten across the floor! 🐾',
    sillyTip: 'Stamp your feet rhythmically like a friendly dancing baby bear!',
    count: '2 Soft Feet'
  },
  {
    id: 'toes',
    name: 'Toes',
    emoji: '👣',
    imageUrl: '/assets/body-parts/toes.jpg',
    pronunciation: 'Toh-z',
    color: 'text-sky-300',
    borderColor: 'border-sky-400/40',
    bgColor: 'bg-sky-500/10',
    whatItDoes: 'Our 10 little toes grip the ground, wiggle in the bath, and giggle when tickled!',
    funAction: 'Can you wiggle your big toe all by itself? Wiggle, wiggle! 🦶',
    sillyTip: 'Count your 10 little piggies from 1 all the way to 10!',
    count: '10 Little Toes'
  },
  {
    id: 'hair',
    name: 'Hair & Head',
    emoji: '💇',
    imageUrl: '/assets/body-parts/hair.jpg',
    pronunciation: 'Hair and Hed',
    color: 'text-purple-300',
    borderColor: 'border-purple-400/40',
    bgColor: 'bg-purple-500/10',
    whatItDoes: 'Our head protects our clever brain that thinks bright ideas and dreams!',
    funAction: 'Gently nod your head yes, then shake it side to side gently! 😊',
    sillyTip: 'Comb your fingers through your soft hair like a gentle breeze!',
    count: '1 Clever Head'
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
    emoji: '👕',
    imageUrl: '/assets/body-parts/shoulders.jpg',
    pronunciation: 'Shohl-der-z',
    color: 'text-orange-300',
    borderColor: 'border-orange-400/40',
    bgColor: 'bg-orange-500/10',
    whatItDoes: 'Our shoulders hold up our arms and help us carry fun backpacks.',
    funAction: 'Shrug your shoulders up high to your ears and let them drop! 🎶',
    sillyTip: 'Roll your shoulders backwards like wheels on a little train!',
    count: '2 Strong Shoulders'
  },
  {
    id: 'heart',
    name: 'Kind Heart',
    emoji: '❤️',
    imageUrl: '/assets/body-parts/heart.jpg',
    pronunciation: 'Hart',
    color: 'text-rose-400',
    borderColor: 'border-rose-400/40',
    bgColor: 'bg-rose-500/10',
    whatItDoes: 'Pumps blood everywhere and fills our body with love, joy, and kindness.',
    funAction: 'Put your hand over your chest and feel the gentle lub-dub! 💓',
    sillyTip: 'A kind heart gives warm hugs to family, friends, and pets!',
    count: '1 Loving Heart'
  }
];

export const ToddlerBodyPartsSection: React.FC = () => {
  const [selectedPart, setSelectedPart] = useState<BodyPartItem>(BODY_PARTS_DATA[0]);
  const [activeTab, setActiveTab] = useState<'explore' | 'quiz' | 'brushTimer'>('explore');

  // Quiz State
  const [quizTarget, setQuizTarget] = useState<BodyPartItem>(() => {
    return BODY_PARTS_DATA[Math.floor(Math.random() * BODY_PARTS_DATA.length)];
  });
  const [quizChoices, setQuizChoices] = useState<BodyPartItem[]>(() => {
    const initialTarget = BODY_PARTS_DATA[0];
    const others = BODY_PARTS_DATA.filter((p) => p.id !== initialTarget.id);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    return [...shuffledOthers, initialTarget].sort(() => 0.5 - Math.random());
  });
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateChoices = (target: BodyPartItem) => {
    const others = BODY_PARTS_DATA.filter((p) => p.id !== target.id);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    return [...shuffledOthers, target].sort(() => 0.5 - Math.random());
  };

  // Brush Timer State (2-Minute Healthy Habit Timer)
  const [brushSeconds, setBrushSeconds] = useState<number>(120);
  const [brushRunning, setBrushRunning] = useState<boolean>(false);

  React.useEffect(() => {
    let interval: any = null;
    if (brushRunning && brushSeconds > 0) {
      interval = setInterval(() => {
        setBrushSeconds((prev) => prev - 1);
      }, 1000);
    } else if (brushSeconds === 0) {
      setBrushRunning(false);
      playSound('glass');
    }
    return () => clearInterval(interval);
  }, [brushRunning, brushSeconds]);

  const speakText = (text: string) => {
    speakIndianEnglish(text);
  };

  const handleSelectPart = (part: BodyPartItem) => {
    playSound('pop');
    setSelectedPart(part);
    speakText(`${part.name}. ${part.whatItDoes}`);
  };

  const handleQuizAnswer = (part: BodyPartItem) => {
    if (part.id === quizTarget.id) {
      playSound('glass');
      setQuizFeedback('correct');
      setQuizScore((prev) => prev + 1);
      speakText(`Yes! That is ${part.name}! Wonderful job!`);
      setTimeout(() => {
        setQuizFeedback(null);
        const remaining = BODY_PARTS_DATA.filter((p) => p.id !== part.id);
        const next = remaining[Math.floor(Math.random() * remaining.length)];
        setQuizTarget(next);
        setQuizChoices(generateChoices(next));
        speakText(`Can you find the ${next.name}?`);
      }, 1600);
    } else {
      playSound('click');
      setQuizFeedback('wrong');
      speakText(`Try again! Can you find the ${quizTarget.name}?`);
      setTimeout(() => setQuizFeedback(null), 1400);
    }
  };

  const startQuiz = () => {
    playSound('glass');
    setActiveTab('quiz');
    setQuizScore(0);
    const firstTarget = BODY_PARTS_DATA[Math.floor(Math.random() * BODY_PARTS_DATA.length)];
    setQuizTarget(firstTarget);
    setQuizChoices(generateChoices(firstTarget));
    speakText(`Let us play Body Detective! Can you find the ${firstTarget.name}?`);
  };

  return (
    <div className="space-y-6 sm:space-y-8 font-sans">
      {/* Sub Mode Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/[0.03] border border-white/10 p-3 sm:p-4 rounded-3xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
            👀
          </div>
          <div className="text-left">
            <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
              <span>My Wonderful Body Parts</span>
              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-black uppercase tracking-wider border border-sky-400/30">
                Self-Awareness
              </span>
            </h2>
            <p className="text-xs text-white/50">
              Touch any body part to learn its name, fun action, and healthy habits!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              setActiveTab('explore');
              speakText(`Let us explore our body parts!`);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-sky-500 text-slate-950 shadow-md font-black'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            Explore & Learn
          </button>
          <button
            type="button"
            onClick={startQuiz}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Detective Quiz</span>
          </button>
          <button
            type="button"
            onClick={() => {
              playSound('click');
              setActiveTab('brushTimer');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'brushTimer'
                ? 'bg-teal-400 text-slate-950 shadow-md font-black'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>2-Min Brush Timer</span>
          </button>
        </div>
      </div>

      {activeTab === 'explore' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Left Column: Interactive Grid of 12 Body Parts (2 Images in One Row) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-3.5 sm:gap-5">
              {BODY_PARTS_DATA.map((part) => {
                const isSelected = selectedPart.id === part.id;
                return (
                  <motion.button
                    key={part.id}
                    type="button"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSelectPart(part)}
                    className={`relative p-3.5 sm:p-4 rounded-3xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between group overflow-hidden ${
                      isSelected
                        ? `bg-white/15 ${part.borderColor} ring-2 ring-sky-400 shadow-xl shadow-sky-500/10`
                        : `${part.bgColor} border-white/10 hover:border-white/20 hover:bg-white/10`
                    }`}
                  >
                    {/* Real Toddler Body Part Picture Thumbnail - Large & Clear (2 in One Row) */}
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3 relative shadow-md border border-white/20 bg-slate-900 flex-shrink-0">
                      <img
                        src={part.imageUrl}
                        alt={`${part.name} close-up`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="eager"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="absolute bottom-1.5 right-1.5 text-xs bg-black/75 backdrop-blur-xs rounded-full px-2 py-0.5 border border-white/15 shadow">
                        {part.emoji}
                      </span>
                    </div>
                    <div className="w-full text-center">
                      <div className="font-black text-sm sm:text-base text-white tracking-wide">
                        {part.name}
                      </div>
                      <div className="text-[11px] font-bold text-white/60 uppercase tracking-wider mt-0.5">
                        {part.count}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="absolute top-3 right-3 w-3 h-3 rounded-full bg-sky-400 animate-ping" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Body Part Spotlight Card (Sticky on Desktop) */}
          <div className="lg:col-span-1 lg:sticky lg:top-6">
            <motion.div
              key={selectedPart.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-6 sm:p-7 rounded-3xl border-2 ${selectedPart.borderColor} bg-gradient-to-br from-[#121c2e] via-[#0d1624] to-[#070c16] shadow-2xl text-left space-y-5`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold border border-white/15">
                    <span>{selectedPart.emoji}</span>
                    <span>{selectedPart.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakText(`${selectedPart.name}! ${selectedPart.whatItDoes} Fun action: ${selectedPart.funAction}`)}
                    className="p-2.5 px-3.5 rounded-2xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/40 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-md"
                    title="Pronounce again"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span className="text-xs font-bold">Hear Voice</span>
                  </button>
                </div>

                {/* Big Close-Up Photo in Spotlight Card */}
                <div className="relative w-full aspect-[16/11] rounded-2xl overflow-hidden border-2 border-white/25 shadow-2xl bg-slate-900">
                  <img
                    src={selectedPart.imageUrl}
                    alt={selectedPart.name}
                    className="w-full h-full object-cover"
                    loading="eager"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-xs font-bold text-white flex items-center gap-1.5 shadow border border-white/15">
                    <span>{selectedPart.emoji}</span>
                    <span>{selectedPart.count}</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400">
                  {selectedPart.pronunciation} • {selectedPart.count}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                  {selectedPart.name}
                </h3>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-[11px] font-bold text-sky-300 uppercase tracking-wider">
                  What It Does
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {selectedPart.whatItDoes}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 space-y-1">
                <div className="text-[11px] font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Fun Toddler Action</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-100 font-bold leading-relaxed">
                  {selectedPart.funAction}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-xs text-amber-200">
                <span className="font-bold">Playful Tip:</span> {selectedPart.sillyTip}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Mode 2: Body Detective Quiz */}
      {activeTab === 'quiz' && (
        <div className="max-w-3xl mx-auto p-6 sm:p-10 rounded-3xl border-2 border-amber-400/40 bg-gradient-to-br from-[#162238] via-[#0f1726] to-[#0a0f1a] shadow-2xl text-center space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">
              Detective Score: <strong className="text-amber-300 font-black text-base">{quizScore}</strong> ⭐
            </span>
            <button
              type="button"
              onClick={() => speakText(`Can you find the ${quizTarget.name}?`)}
              className="inline-flex items-center gap-1.5 text-xs text-sky-300 bg-sky-500/20 px-3 py-1.5 rounded-xl border border-sky-400/30 font-bold cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Hear Again</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-black text-amber-400 uppercase tracking-widest">
              Body Detective Challenge
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white">
              Can you find the <span className="text-amber-300 underline decoration-amber-400 underline-offset-4">{quizTarget.name}</span>?
            </h3>
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
                    <span>Wonderful! You found the {quizTarget.name}! 🎉</span>
                  </>
                ) : (
                  <span>Oops! That is a different part. Try again! 😊</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Choice Tiles - Real Quiz without Text Clues (Photo Only) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 max-w-2xl mx-auto">
            {(quizChoices.length > 0 ? quizChoices : BODY_PARTS_DATA.slice(0, 4)).map((part) => (
              <button
                key={part.id}
                type="button"
                onClick={() => handleQuizAnswer(part)}
                className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/15 border-2 border-white/15 hover:border-amber-400 transition-all cursor-pointer flex flex-col items-center justify-center active:scale-95 shadow-lg group overflow-hidden"
              >
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/20 bg-slate-900 shadow">
                  <img
                    src={part.imageUrl}
                    alt="Body part option"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="eager"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mode 3: 2-Minute Toothbrush Song Timer */}
      {activeTab === 'brushTimer' && (
        <div className="max-w-2xl mx-auto p-6 sm:p-10 rounded-3xl border-2 border-teal-400/40 bg-gradient-to-br from-[#10242e] via-[#0b171f] to-[#070f14] shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-teal-400/20 border border-teal-400/40 text-teal-300 flex items-center justify-center mx-auto text-3xl shadow-inner">
            🦷
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              2-Minute Sparkling Teeth Timer
            </h3>
            <p className="text-xs sm:text-sm text-teal-200/80">
              Dentists recommend brushing morning and bedtime for 2 minutes to keep teeth healthy and cavity-free!
            </p>
          </div>

          {/* Circular Countdown Display */}
          <div className="py-6">
            <div className="w-44 h-44 rounded-full border-4 border-teal-400/40 bg-teal-500/10 flex flex-col items-center justify-center mx-auto shadow-2xl shadow-teal-500/20">
              <span className="font-mono text-4xl sm:text-5xl font-black text-white">
                {Math.floor(brushSeconds / 60)}:{(brushSeconds % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase font-bold text-teal-300 tracking-wider mt-1">
                {brushSeconds === 0 ? 'All Done! ✨' : 'Brush Round & Round! 🪥'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                playSound('glass');
                setBrushRunning((prev) => !prev);
                if (!brushRunning) {
                  speakText('Let us brush our teeth! Top, bottom, front, and back!');
                }
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-teal-500/20 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              {brushRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-950" />}
              <span>{brushRunning ? 'Pause Timer' : 'Start Brushing!'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSound('pop');
                setBrushRunning(false);
                setBrushSeconds(120);
              }}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left pt-4 border-t border-white/10 text-[11px] text-teal-200">
            <div className="p-2.5 rounded-xl bg-white/5">1. Outer Surfaces 🪥</div>
            <div className="p-2.5 rounded-xl bg-white/5">2. Inner Surfaces 🦷</div>
            <div className="p-2.5 rounded-xl bg-white/5">3. Chewing Surfaces 🍎</div>
            <div className="p-2.5 rounded-xl bg-white/5">4. Gentle Tongue Clean ✨</div>
          </div>
        </div>
      )}
    </div>
  );
};
