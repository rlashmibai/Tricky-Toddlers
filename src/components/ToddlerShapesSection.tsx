import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Volume2, 
  RotateCcw, 
  CheckCircle2, 
  Star, 
  HelpCircle,
  Shapes,
  Palette,
  Check
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import { speakIndianEnglish } from '../lib/indianSpeech';

export interface ShapeItem {
  id: string;
  name: string;
  emoji: string;
  sides: number;
  corners: number;
  sidesText: string;
  rhyme: string;
  colorName: string;
  colorHex: string;
  badgeBg: string;
  borderColor: string;
  realWorldExamples: {
    name: string;
    emoji: string;
    tip: string;
  }[];
}

export const SHAPES_DATA: ShapeItem[] = [
  {
    id: 'circle',
    name: 'Circle',
    emoji: '⚪',
    sides: 0,
    corners: 0,
    sidesText: '0 straight sides (Round & Round)',
    rhyme: 'A circle is round, it has no end, rolling along like a happy friend!',
    colorName: 'Cheerful Red',
    colorHex: 'from-rose-500 to-red-600',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
    borderColor: 'border-rose-400/50',
    realWorldExamples: [
      { name: 'Wall Clock', emoji: '🕒', tip: 'Ticking round and round!' },
      { name: 'Warm Roti', emoji: '🫓', tip: 'Mommy makes it round!' },
      { name: 'Shiny Coin', emoji: '🪙', tip: 'Rolls across the table!' },
      { name: 'Shirt Button', emoji: '🔘', tip: 'Keeps your cozy shirt neat!' }
    ]
  },
  {
    id: 'triangle',
    name: 'Triangle',
    emoji: '🔺',
    sides: 3,
    corners: 3,
    sidesText: '3 straight sides & 3 sharp corners',
    rhyme: 'One, two, three sides so neat, a crunchy pizza slice we love to eat!',
    colorName: 'Sunny Amber',
    colorHex: 'from-amber-400 to-yellow-500',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    borderColor: 'border-amber-400/50',
    realWorldExamples: [
      { name: 'Pizza Slice', emoji: '🍕', tip: 'Pointy slice full of cheese!' },
      { name: 'Party Hat', emoji: '🥳', tip: 'Wear it tall on your birthday!' },
      { name: 'Crispy Samosa', emoji: '🥟', tip: 'Warm and golden snack!' },
      { name: 'Watermelon Slice', emoji: '🍉', tip: 'Sweet, juicy and triangle shaped!' }
    ]
  },
  {
    id: 'square',
    name: 'Square',
    emoji: '🟦',
    sides: 4,
    corners: 4,
    sidesText: '4 equal sides & 4 square corners',
    rhyme: 'Four sides the same, four corners square, like a picture frame resting there!',
    colorName: 'Ocean Blue',
    colorHex: 'from-blue-500 to-cyan-500',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
    borderColor: 'border-blue-400/50',
    realWorldExamples: [
      { name: 'Bread Slice', emoji: '🍞', tip: 'Tasty morning toast!' },
      { name: 'Gift Box', emoji: '🎁', tip: 'Square box with a pretty bow!' },
      { name: 'Window Frame', emoji: '🪟', tip: 'Looking out at the sunshine!' },
      { name: 'Building Block', emoji: '🧱', tip: 'Stack them tall and high!' }
    ]
  },
  {
    id: 'rectangle',
    name: 'Rectangle',
    emoji: '🟩',
    sides: 4,
    corners: 4,
    sidesText: '2 long sides & 2 short sides',
    rhyme: 'Two sides are short, two sides are long, like a bedtime storybook singing a song!',
    colorName: 'Emerald Green',
    colorHex: 'from-emerald-500 to-teal-500',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    borderColor: 'border-emerald-400/50',
    realWorldExamples: [
      { name: 'Storybook', emoji: '📖', tip: 'Full of colorful adventures!' },
      { name: 'Door', emoji: '🚪', tip: 'Tall door to step inside!' },
      { name: 'Chocolate Bar', emoji: '🍫', tip: 'Sweet bar divided in blocks!' },
      { name: 'Pencil Box', emoji: '✏️', tip: 'Holds all your crayons!' }
    ]
  },
  {
    id: 'star',
    name: 'Star',
    emoji: '⭐',
    sides: 10,
    corners: 5,
    sidesText: '5 pointy points & magical twinkle',
    rhyme: 'Twinkle, twinkle high and bright, glowing softly through the night!',
    colorName: 'Twinkling Gold',
    colorHex: 'from-yellow-300 to-amber-400',
    badgeBg: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/40',
    borderColor: 'border-yellow-400/50',
    realWorldExamples: [
      { name: 'Night Sky Star', emoji: '✨', tip: 'Shining above your nursery!' },
      { name: 'Starfish', emoji: '🌊', tip: 'Resting on the ocean sand!' },
      { name: 'Reward Sticker', emoji: '🌟', tip: 'Gold star for doing great!' },
      { name: 'Magic Wand', emoji: '🪄', tip: 'Star tip for fairy tales!' }
    ]
  },
  {
    id: 'heart',
    name: 'Heart',
    emoji: '💖',
    sides: 0,
    corners: 1,
    sidesText: '2 curved arches meeting at 1 point',
    rhyme: 'A curve on the left, a curve on the right, filled with hugs and warm delight!',
    colorName: 'Loving Pink',
    colorHex: 'from-pink-500 to-rose-400',
    badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-400/40',
    borderColor: 'border-pink-400/50',
    realWorldExamples: [
      { name: 'Sweet Strawberry', emoji: '🍓', tip: 'Shaped like a heart!' },
      { name: 'Greeting Card', emoji: '💌', tip: 'Card with love for daddy and mommy!' },
      { name: 'Party Balloon', emoji: '🎈', tip: 'Floating high in the air!' },
      { name: 'Warm Hug', emoji: '🤗', tip: 'Feels like love in your heart!' }
    ]
  },
  {
    id: 'diamond',
    name: 'Diamond / Rhombus',
    emoji: '🔷',
    sides: 4,
    corners: 4,
    sidesText: '4 slanted equal sides',
    rhyme: 'Up in the sky like a dancing kite, four slanted sides flying light!',
    colorName: 'Indigo Sparkle',
    colorHex: 'from-indigo-400 to-purple-500',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
    borderColor: 'border-indigo-400/50',
    realWorldExamples: [
      { name: 'Flying Kite', emoji: '🪁', tip: 'Soaring high in the wind!' },
      { name: 'Kaju Katli Sweet', emoji: '🍬', tip: 'Delicious silver-coated treat!' },
      { name: 'Playing Card Gem', emoji: '♦️', tip: 'Gleaming diamond suit!' },
      { name: 'Traffic Sign', emoji: '🚧', tip: 'Warning sign on the road!' }
    ]
  },
  {
    id: 'oval',
    name: 'Oval',
    emoji: '🥚',
    sides: 0,
    corners: 0,
    sidesText: 'Stretched curved boundary (Egg shape)',
    rhyme: 'Like a circle stretched out tall, an egg that rolls but doesn’t fall!',
    colorName: 'Teal Meadow',
    colorHex: 'from-teal-400 to-cyan-500',
    badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-400/40',
    borderColor: 'border-teal-400/50',
    realWorldExamples: [
      { name: 'Breakfast Egg', emoji: '🥚', tip: 'Smooth and oval shell!' },
      { name: 'Big Watermelon', emoji: '🍉', tip: 'Green oval fruit on the farm!' },
      { name: 'Handheld Mirror', emoji: '🪞', tip: 'Seeing your happy smile!' },
      { name: 'Smooth River Pebble', emoji: '🪨', tip: 'Polished smooth by water!' }
    ]
  }
];

export const ToddlerShapesSection: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState<ShapeItem>(SHAPES_DATA[0]);
  const [activeTab, setActiveTab] = useState<'explore' | 'quiz' | 'builder'>('explore');

  // Quiz State
  const [quizShape, setQuizShape] = useState<ShapeItem>(() => {
    return SHAPES_DATA[Math.floor(Math.random() * SHAPES_DATA.length)];
  });
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Shape Builder / Stamping Playground
  const [stampedShapes, setStampedShapes] = useState<{ id: number; shape: ShapeItem; x: number; y: number }[]>([]);

  const speakText = (text: string) => {
    speakIndianEnglish(text);
  };

  const handleSelectShape = (shape: ShapeItem) => {
    playSound('pop');
    setSelectedShape(shape);
    speakText(`${shape.name}! ${shape.sidesText}. ${shape.rhyme}`);
  };

  const handleQuizAnswer = (shape: ShapeItem) => {
    if (shape.id === quizShape.id) {
      playSound('glass');
      setQuizFeedback('correct');
      setQuizScore((prev) => prev + 1);
      speakText(`Yes! That is a ${shape.name}! Super job!`);
      setTimeout(() => {
        setQuizFeedback(null);
        const remaining = SHAPES_DATA.filter((s) => s.id !== shape.id);
        const next = remaining[Math.floor(Math.random() * remaining.length)];
        setQuizShape(next);
        speakText(`Can you find the ${next.name}?`);
      }, 1600);
    } else {
      playSound('click');
      setQuizFeedback('wrong');
      speakText(`That is a ${shape.name}. Can you find the ${quizShape.name}?`);
      setTimeout(() => setQuizFeedback(null), 1400);
    }
  };

  const startQuiz = () => {
    playSound('glass');
    setActiveTab('quiz');
    setQuizScore(0);
    const first = SHAPES_DATA[Math.floor(Math.random() * SHAPES_DATA.length)];
    setQuizShape(first);
    speakText(`Let us play Shape Detective! Can you find the ${first.name}?`);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 24;
    const y = e.clientY - rect.top - 24;
    playSound('pop');
    setStampedShapes((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), shape: selectedShape, x, y }
    ]);
  };

  return (
    <div className="space-y-6 sm:space-y-8 font-sans">
      {/* Sub Mode Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/[0.03] border border-white/10 p-3 sm:p-4 rounded-3xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
            🔺
          </div>
          <div className="text-left">
            <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
              <span>Toddler Shape Detective</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
                Geometry & Spatial
              </span>
            </h2>
            <p className="text-xs text-white/50">
              Discover circles, triangles, stars, and everyday items shaped like them!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              setActiveTab('explore');
              speakText('Let us explore wonderful shapes!');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            Explore Shapes
          </button>
          <button
            type="button"
            onClick={startQuiz}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-rose-400 text-slate-950 shadow-md font-black'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Shape Quiz</span>
          </button>
          <button
            type="button"
            onClick={() => {
              playSound('click');
              setActiveTab('builder');
              speakText('Tap anywhere on the canvas to stamp your favorite shapes!');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'builder'
                ? 'bg-emerald-400 text-slate-950 shadow-md font-black'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Shape Stamping</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Explore Shapes */}
      {activeTab === 'explore' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Left Column: 8 Shape Tiles */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {SHAPES_DATA.map((shape) => {
                const isSelected = selectedShape.id === shape.id;
                return (
                  <motion.button
                    key={shape.id}
                    type="button"
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleSelectShape(shape)}
                    className={`relative p-5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[135px] ${
                      isSelected
                        ? `bg-white/15 ${shape.borderColor} ring-2 ring-amber-400 shadow-xl shadow-amber-500/10`
                        : `bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/10`
                    }`}
                  >
                    <div className="text-4xl mb-2 filter drop-shadow-md">
                      {shape.emoji}
                    </div>
                    <div className="font-black text-sm text-white tracking-wide">
                      {shape.name}
                    </div>
                    <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mt-0.5">
                      {shape.sides > 0 ? `${shape.sides} Sides` : 'No Corners'}
                    </div>
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Real World Everyday Examples for Selected Shape */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 text-left space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Everyday Things Shaped Like a {selectedShape.name}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {selectedShape.realWorldExamples.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => speakText(`${item.name} is shaped like a ${selectedShape.name}! ${item.tip}`)}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center cursor-pointer hover:bg-white/10 hover:scale-102 transition-all active:scale-95"
                  >
                    <div className="text-3xl mb-1">{item.emoji}</div>
                    <div className="font-bold text-xs text-white">{item.name}</div>
                    <div className="text-[10px] text-white/50 mt-0.5 leading-tight">{item.tip}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Active Shape Spotlight Card */}
          <div className="lg:col-span-1">
            <motion.div
              key={selectedShape.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-6 sm:p-7 rounded-3xl border-2 ${selectedShape.borderColor} bg-gradient-to-br from-[#1c1828] via-[#14121d] to-[#0a0910] shadow-2xl text-left space-y-5`}
            >
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-4xl shadow-inner">
                  {selectedShape.emoji}
                </div>
                <button
                  type="button"
                  onClick={() => speakText(`${selectedShape.name}! ${selectedShape.rhyme}`)}
                  className="p-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-md"
                  title="Speak Rhyme"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="text-xs font-bold">Hear Rhyme</span>
                </button>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  {selectedShape.sidesText}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                  {selectedShape.name}
                </h3>
              </div>

              {/* Catchy Rhyme Block */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 space-y-1">
                <div className="text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Toddler Shape Rhyme</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-100 font-bold leading-relaxed italic">
                  "{selectedShape.rhyme}"
                </p>
              </div>

              {/* Geometry Specs */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs text-white/40 uppercase font-bold">Sides</div>
                  <div className="text-lg font-black text-white">{selectedShape.sides}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs text-white/40 uppercase font-bold">Corners</div>
                  <div className="text-lg font-black text-white">{selectedShape.corners}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Mode 2: Shape Quiz */}
      {activeTab === 'quiz' && (
        <div className="max-w-3xl mx-auto p-6 sm:p-10 rounded-3xl border-2 border-rose-400/40 bg-gradient-to-br from-[#241320] via-[#180d15] to-[#0c060a] shadow-2xl text-center space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">
              Detective Score: <strong className="text-rose-300 font-black text-base">{quizScore}</strong> ⭐
            </span>
            <button
              type="button"
              onClick={() => speakText(`Can you find the ${quizShape.name}?`)}
              className="inline-flex items-center gap-1.5 text-xs text-rose-300 bg-rose-500/20 px-3 py-1.5 rounded-xl border border-rose-400/30 font-bold cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Repeat Clue</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-black text-rose-400 uppercase tracking-widest">
              Shape Detective Challenge
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white">
              Can you find the <span className="text-rose-300 underline decoration-rose-400 underline-offset-4">{quizShape.name}</span>?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Clue: {quizShape.sidesText}
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
                    <span>Hooray! That is the {quizShape.name}! 🌟</span>
                  </>
                ) : (
                  <span>Oops! Let's try once more! Look for {quizShape.name} 😊</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Choice Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4">
            {SHAPES_DATA.map((shape) => (
              <button
                key={shape.id}
                type="button"
                onClick={() => handleQuizAnswer(shape)}
                className="p-5 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-rose-400/60 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 active:scale-95 shadow-md"
              >
                <span className="text-4xl">{shape.emoji}</span>
                <span className="text-xs sm:text-sm font-bold text-white">{shape.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mode 3: Shape Stamping Playground */}
      {activeTab === 'builder' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <span className="text-xs font-bold text-slate-400">Current Stamp:</span>{' '}
              <span className="text-sm font-black text-emerald-300">{selectedShape.emoji} {selectedShape.name}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                playSound('pop');
                setStampedShapes([]);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Canvas</span>
            </button>
          </div>

          {/* Stamp Palette Selector */}
          <div className="flex flex-wrap gap-2 justify-center">
            {SHAPES_DATA.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  playSound('click');
                  setSelectedShape(s);
                  speakText(s.name);
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedShape.id === s.id
                    ? 'bg-emerald-400 text-slate-950 border-emerald-400 shadow-md'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                }`}
              >
                <span>{s.emoji}</span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>

          {/* Interactive Stamping Canvas */}
          <div
            onClick={handleCanvasClick}
            className="w-full h-80 sm:h-96 rounded-3xl border-2 border-dashed border-emerald-500/30 bg-[#0d1822] relative overflow-hidden cursor-crosshair shadow-inner"
          >
            {stampedShapes.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/30 space-y-2 pointer-events-none">
                <Palette className="w-8 h-8 opacity-40" />
                <p className="text-xs sm:text-sm font-bold">
                  Tap anywhere on this black canvas to stamp colorful {selectedShape.name}s!
                </p>
                <span className="text-[10px] text-white/20">Build a house, rocket, car or robot! 🚀</span>
              </div>
            )}

            {stampedShapes.map((st) => (
              <motion.div
                key={st.id}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                style={{ position: 'absolute', left: st.x, top: st.y }}
                className="text-4xl sm:text-5xl select-none filter drop-shadow-lg"
              >
                {st.shape.emoji}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
