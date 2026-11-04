import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Volume2, 
  RotateCcw, 
  CheckCircle2, 
  Star, 
  Shapes,
  Palette
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import { speakIndianEnglish } from '../lib/indianSpeech';

export type ShapeCategory = 'core' | 'quadrilaterals' | 'polygons' | 'curved_special';

export interface ShapeItem {
  id: string;
  name: string;
  category: ShapeCategory;
  categoryTitle: string;
  emoji: string;
  sidesCount: number;
  sidesDisplay: string;
  cornersDisplay: string;
  sidesText: string;
  rhyme: string;
  colorHex: string;
  badgeBg: string;
  borderColor: string;
  visualAnchorOrTrick: string;
  realWorldExamples: {
    name: string;
    emoji: string;
    tip: string;
  }[];
}

export const SHAPES_DATA: ShapeItem[] = [
  // 1. Core Shapes (The Basics)
  {
    id: 'circle',
    name: 'Circle',
    category: 'core',
    categoryTitle: 'Core Shapes (The Basics)',
    emoji: '⚪',
    sidesCount: 0,
    sidesDisplay: '0 (Curved)',
    cornersDisplay: '0',
    sidesText: '0 straight sides (Curved all around)',
    rhyme: 'A circle is round, it has no end, rolling along like a happy friend!',
    colorHex: 'text-rose-400',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
    borderColor: 'border-rose-400/50',
    visualAnchorOrTrick: 'Wall Clock / Coin',
    realWorldExamples: [
      { name: 'Wall Clock', emoji: '🕒', tip: 'Ticking round and round!' },
      { name: 'Warm Roti', emoji: '🫓', tip: 'Mommy makes it round!' },
      { name: 'Shiny Coin', emoji: '🪙', tip: 'Rolls across the table!' },
      { name: 'Shirt Button', emoji: '🔘', tip: 'Keeps your cozy shirt neat!' }
    ]
  },
  {
    id: 'square',
    name: 'Square',
    category: 'core',
    categoryTitle: 'Core Shapes (The Basics)',
    emoji: '🟦',
    sidesCount: 4,
    sidesDisplay: '4 (All Equal)',
    cornersDisplay: '4',
    sidesText: '4 straight equal sides & 4 corners',
    rhyme: 'Four sides the same, four corners square, like a picture frame resting there!',
    colorHex: 'text-blue-400',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
    borderColor: 'border-blue-400/50',
    visualAnchorOrTrick: 'Slice of Bread / Dice Face',
    realWorldExamples: [
      { name: 'Bread Slice', emoji: '🍞', tip: 'Tasty morning toast!' },
      { name: 'Dice Face', emoji: '🎲', tip: 'Rolling fun numbers!' },
      { name: 'Gift Box', emoji: '🎁', tip: 'Square box with a pretty bow!' },
      { name: 'Window Frame', emoji: '🪟', tip: 'Looking out at the sunshine!' }
    ]
  },
  {
    id: 'triangle',
    name: 'Triangle',
    category: 'core',
    categoryTitle: 'Core Shapes (The Basics)',
    emoji: '🔺',
    sidesCount: 3,
    sidesDisplay: '3',
    cornersDisplay: '3',
    sidesText: '3 straight sides & 3 sharp corners',
    rhyme: 'One, two, three sides so neat, a crunchy pizza slice we love to eat!',
    colorHex: 'text-amber-400',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    borderColor: 'border-amber-400/50',
    visualAnchorOrTrick: 'Slice of Pizza / Watermelon Slice',
    realWorldExamples: [
      { name: 'Pizza Slice', emoji: '🍕', tip: 'Pointy slice full of cheese!' },
      { name: 'Watermelon Slice', emoji: '🍉', tip: 'Juicy triangle fruit!' },
      { name: 'Party Hat', emoji: '🥳', tip: 'Wear it tall on your birthday!' },
      { name: 'Crispy Samosa', emoji: '🥟', tip: 'Warm and golden snack!' }
    ]
  },
  {
    id: 'rectangle',
    name: 'Rectangle',
    category: 'core',
    categoryTitle: 'Core Shapes (The Basics)',
    emoji: '🟩',
    sidesCount: 4,
    sidesDisplay: '4 (2 Long, 2 Short)',
    cornersDisplay: '4',
    sidesText: '4 straight sides (2 Long, 2 Short) & 4 corners',
    rhyme: 'Two sides are short, two sides are long, like a bedtime storybook singing a song!',
    colorHex: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    borderColor: 'border-emerald-400/50',
    visualAnchorOrTrick: 'Classroom Door / Book Cover',
    realWorldExamples: [
      { name: 'Classroom Door', emoji: '🚪', tip: 'Tall door to step inside!' },
      { name: 'Book Cover', emoji: '📖', tip: 'Full of colorful adventures!' },
      { name: 'Chocolate Bar', emoji: '🍫', tip: 'Sweet bar divided in blocks!' },
      { name: 'Pencil Box', emoji: '✏️', tip: 'Holds all your crayons!' }
    ]
  },

  // 2. Advanced Four-Sided Shapes (Quadrilaterals)
  {
    id: 'diamond',
    name: 'Diamond / Rhombus',
    category: 'quadrilaterals',
    categoryTitle: 'Advanced Four-Sided Shapes (Quadrilaterals)',
    emoji: '🔷',
    sidesCount: 4,
    sidesDisplay: '4 (All Equal, Tilted)',
    cornersDisplay: '4',
    sidesText: '4 equal sides tilted with 4 corners',
    rhyme: 'Up in the sky like a dancing kite, four slanted sides flying light!',
    colorHex: 'text-indigo-400',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
    borderColor: 'border-indigo-400/50',
    visualAnchorOrTrick: 'Flying Kite',
    realWorldExamples: [
      { name: 'Flying Kite', emoji: '🪁', tip: 'Soaring high in the sky!' },
      { name: 'Kaju Katli Sweet', emoji: '🍬', tip: 'Delicious festive treat!' },
      { name: 'Diamond Card Gem', emoji: '♦️', tip: 'Sparkling diamond suit!' },
      { name: 'Road Sign', emoji: '🚧', tip: 'Yellow caution diamond!' }
    ]
  },
  {
    id: 'parallelogram',
    name: 'Parallelogram',
    category: 'quadrilaterals',
    categoryTitle: 'Advanced Four-Sided Shapes (Quadrilaterals)',
    emoji: '▱',
    sidesCount: 4,
    sidesDisplay: '4 (Slanted Rectangle)',
    cornersDisplay: '4',
    sidesText: '4 sides with opposite parallel slanted lines',
    rhyme: 'Slanted sides leaning in the breeze, a leaning rectangle among the trees!',
    colorHex: 'text-purple-400',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
    borderColor: 'border-purple-400/50',
    visualAnchorOrTrick: 'Side of a Cardboard Box',
    realWorldExamples: [
      { name: 'Side of Box', emoji: '📦', tip: 'Cardboard box tilted!' },
      { name: 'Staircase Shadow', emoji: '🪜', tip: 'Slanting up the wall!' },
      { name: 'Eraser Top', emoji: '✏️', tip: 'Angled rubber eraser!' },
      { name: 'Flag in Wind', emoji: '🚩', tip: 'Blowing slanted in breeze!' }
    ]
  },
  {
    id: 'trapezoid',
    name: 'Trapezoid',
    category: 'quadrilaterals',
    categoryTitle: 'Advanced Four-Sided Shapes (Quadrilaterals)',
    emoji: '⏢',
    sidesCount: 4,
    sidesDisplay: '4 (Looks like a table)',
    cornersDisplay: '4',
    sidesText: '4 sides with top and bottom parallel like a table',
    rhyme: 'Flat on top, wide on ground, a cozy table where snacks are found!',
    colorHex: 'text-orange-400',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
    borderColor: 'border-orange-400/50',
    visualAnchorOrTrick: 'Popcorn Bucket Face',
    realWorldExamples: [
      { name: 'Popcorn Bucket', emoji: '🍿', tip: 'Tapered bucket at the movies!' },
      { name: 'Flower Pot Face', emoji: '🪴', tip: 'Wide top, narrower base!' },
      { name: 'Lampshade', emoji: '🛋️', tip: 'Cozy glowing light shade!' },
      { name: 'Wooden Desk', emoji: '🪵', tip: 'Flat table surface!' }
    ]
  },
  {
    id: 'kite',
    name: 'Kite',
    category: 'quadrilaterals',
    categoryTitle: 'Advanced Four-Sided Shapes (Quadrilaterals)',
    emoji: '🪁',
    sidesCount: 4,
    sidesDisplay: '4 (2 Short Top, 2 Long Bottom)',
    cornersDisplay: '4',
    sidesText: '4 sides with 2 short top and 2 long bottom',
    rhyme: 'Two short wings and a long pointy tail, watch the colorful kite set sail!',
    colorHex: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
    borderColor: 'border-cyan-400/50',
    visualAnchorOrTrick: 'Classic Diamond Kite',
    realWorldExamples: [
      { name: 'Festival Kite', emoji: '🪁', tip: 'Flying high during Makar Sankranti!' },
      { name: 'Paper Dart', emoji: '✈️', tip: 'Zooming across the playroom!' },
      { name: 'Crystal Pendant', emoji: '💎', tip: 'Shimmering jewel!' },
      { name: 'Arrow Pointer', emoji: '🏹', tip: 'Pointing right on target!' }
    ]
  },

  // 3. Multi-Sided Shapes (The Polygon Family)
  {
    id: 'pentagon',
    name: 'Pentagon',
    category: 'polygons',
    categoryTitle: 'Multi-Sided Shapes (The Polygon Family)',
    emoji: '⬟',
    sidesCount: 5,
    sidesDisplay: '5',
    cornersDisplay: '5',
    sidesText: '5 straight sides & 5 corners',
    rhyme: 'Five proud sides like a cozy little home, where happy toddlers love to roam!',
    colorHex: 'text-teal-400',
    badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-400/40',
    borderColor: 'border-teal-400/50',
    visualAnchorOrTrick: 'Looks like a simple house drawing',
    realWorldExamples: [
      { name: 'House Drawing', emoji: '🏠', tip: 'Square with a pointed roof!' },
      { name: 'Soccer Ball Patch', emoji: '⚽', tip: 'Black patches on soccer balls!' },
      { name: 'Birdhouse Front', emoji: '🐦', tip: 'Cozy home for little birds!' },
      { name: 'School Crossing', emoji: '🚸', tip: 'Five-sided safety sign!' }
    ]
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    category: 'polygons',
    categoryTitle: 'Multi-Sided Shapes (The Polygon Family)',
    emoji: '⬢',
    sidesCount: 6,
    sidesDisplay: '6',
    cornersDisplay: '6',
    sidesText: '6 straight sides & 6 corners',
    rhyme: 'Six sweet sides where honeybees play, storing golden honey every day!',
    colorHex: 'text-amber-300',
    badgeBg: 'bg-amber-400/20 text-amber-200 border-amber-300/40',
    borderColor: 'border-amber-400/50',
    visualAnchorOrTrick: '"Hex" has an X, like the number six (Honeycomb)',
    realWorldExamples: [
      { name: 'Bee Honeycomb', emoji: '🍯', tip: 'Busy bees build hexagon cells!' },
      { name: 'Snowflake Crystal', emoji: '❄️', tip: 'Six icy crystal branches!' },
      { name: 'Nut & Bolt Head', emoji: '🔩', tip: 'Twisting tool fit!' },
      { name: 'Bathroom Tile', emoji: '🛁', tip: 'Interlocking honeycomb tiles!' }
    ]
  },
  {
    id: 'heptagon',
    name: 'Heptagon',
    category: 'polygons',
    categoryTitle: 'Multi-Sided Shapes (The Polygon Family)',
    emoji: '⬡',
    sidesCount: 7,
    sidesDisplay: '7',
    cornersDisplay: '7',
    sidesText: '7 straight sides & 7 corners',
    rhyme: 'Seven straight sides around and round, a lucky treasure we have found!',
    colorHex: 'text-violet-400',
    badgeBg: 'bg-violet-500/20 text-violet-300 border-violet-400/40',
    borderColor: 'border-violet-400/50',
    visualAnchorOrTrick: 'Think of a lucky 7-sided coin',
    realWorldExamples: [
      { name: 'Lucky Coin', emoji: '🪙', tip: 'Seven-sided coin edge!' },
      { name: 'Rainbow Flower', emoji: '🌸', tip: 'Seven colorful petals!' },
      { name: 'Music Bell', emoji: '🔔', tip: 'Seven notes of musical scale!' },
      { name: 'Star Badge', emoji: '🎖️', tip: 'Special honorary token!' }
    ]
  },
  {
    id: 'octagon',
    name: 'Octagon',
    category: 'polygons',
    categoryTitle: 'Multi-Sided Shapes (The Polygon Family)',
    emoji: '🛑',
    sidesCount: 8,
    sidesDisplay: '8',
    cornersDisplay: '8',
    sidesText: '8 straight sides & 8 corners',
    rhyme: 'Eight red sides say stop right there, look both ways with gentle care!',
    colorHex: 'text-red-500',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-400/40',
    borderColor: 'border-red-400/50',
    visualAnchorOrTrick: '"Octo" means 8, like an Octopus (Stop Sign)',
    realWorldExamples: [
      { name: 'Stop Sign', emoji: '🛑', tip: 'Eight red sides on the street!' },
      { name: 'Octopus Arms', emoji: '🐙', tip: 'Eight swimming tentacles!' },
      { name: 'Umbrella Canopy', emoji: '☂️', tip: 'Eight rib segments opening wide!' },
      { name: 'Gazebo Roof', emoji: '🏡', tip: 'Eight-sided park shelter!' }
    ]
  },
  {
    id: 'nonagon',
    name: 'Nonagon',
    category: 'polygons',
    categoryTitle: 'Multi-Sided Shapes (The Polygon Family)',
    emoji: '⬟',
    sidesCount: 9,
    sidesDisplay: '9',
    cornersDisplay: '9',
    sidesText: '9 straight sides & 9 corners',
    rhyme: 'Nonagon starts with N for nine, nine straight sides all in a line!',
    colorHex: 'text-fuchsia-400',
    badgeBg: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/40',
    borderColor: 'border-fuchsia-400/50',
    visualAnchorOrTrick: 'Nonagon starts with N, just like Nine',
    realWorldExamples: [
      { name: 'Bahá\'í Temple', emoji: '🏛️', tip: 'Nine-sided lotus architecture!' },
      { name: 'Nine-Petal Flower', emoji: '🌼', tip: 'Sun-worshipping blossom!' },
      { name: 'Carnival Wheel', emoji: '🎡', tip: 'Nine colorful carriage hubs!' },
      { name: 'Game Board Tile', emoji: '♟️', tip: 'Strategy grid shape!' }
    ]
  },
  {
    id: 'decagon',
    name: 'Decagon',
    category: 'polygons',
    categoryTitle: 'Multi-Sided Shapes (The Polygon Family)',
    emoji: '⯏',
    sidesCount: 10,
    sidesDisplay: '10',
    cornersDisplay: '10',
    sidesText: '10 straight sides & 10 corners',
    rhyme: 'A decade is ten, ten sides so grand, like ten little fingers on each hand!',
    colorHex: 'text-sky-400',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
    borderColor: 'border-sky-400/50',
    visualAnchorOrTrick: 'A Decade is 10 years, a Decagon has 10 sides',
    realWorldExamples: [
      { name: 'Ten Fingers', emoji: '👐', tip: 'Count all 10 fingers together!' },
      { name: 'Star Crest Coin', emoji: '🪙', tip: 'Ten-sided decorative medal!' },
      { name: 'Ferris Rim', emoji: '🎪', tip: 'Ten-spoke amusement wheel!' },
      { name: 'Clock Ring', emoji: '⏰', tip: 'Decagon clock rim!' }
    ]
  },
  {
    id: 'dodecagon',
    name: 'Dodecagon',
    category: 'polygons',
    categoryTitle: 'Multi-Sided Shapes (The Polygon Family)',
    emoji: '☼',
    sidesCount: 12,
    sidesDisplay: '12',
    cornersDisplay: '12',
    sidesText: '12 straight sides & 12 corners',
    rhyme: 'Twelve little sides like hours on a clock, tick-tock, tick-tock around the block!',
    colorHex: 'text-lime-400',
    badgeBg: 'bg-lime-500/20 text-lime-300 border-lime-400/40',
    borderColor: 'border-lime-400/50',
    visualAnchorOrTrick: 'A 12-sided starburst badge',
    realWorldExamples: [
      { name: 'Clock Face Hours', emoji: '🕰️', tip: 'Twelve hour markers in a ring!' },
      { name: 'Gold Medal Badge', emoji: '🏅', tip: 'Twelve-sided starburst award!' },
      { name: 'Special 1-Pound Coin', emoji: '🪙', tip: 'Twelve-sided security coin!' },
      { name: 'Kalash Pattern', emoji: '🏺', tip: 'Twelve traditional petal grooves!' }
    ]
  },

  // 4. Curved & Special Fun Shapes
  {
    id: 'oval',
    name: 'Oval',
    category: 'curved_special',
    categoryTitle: 'Curved & Special Fun Shapes',
    emoji: '🥚',
    sidesCount: 0,
    sidesDisplay: '0 (Curved)',
    cornersDisplay: '0',
    sidesText: '0 straight sides (Curved elongated loop)',
    rhyme: 'Like a circle stretched out tall, an egg that rolls but doesn’t fall!',
    colorHex: 'text-teal-300',
    badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-400/40',
    borderColor: 'border-teal-400/50',
    visualAnchorOrTrick: 'Chicken Egg / Rugby Ball',
    realWorldExamples: [
      { name: 'Chicken Egg', emoji: '🥚', tip: 'Smooth egg ready for breakfast!' },
      { name: 'Rugby Ball', emoji: '🏉', tip: 'Tossed across the grassy field!' },
      { name: 'Watermelon', emoji: '🍉', tip: 'Big oval juicy summer treat!' },
      { name: 'Mirror Frame', emoji: '🪞', tip: 'Shows your smiling face!' }
    ]
  },
  {
    id: 'semicircle',
    name: 'Semicircle',
    category: 'curved_special',
    categoryTitle: 'Curved & Special Fun Shapes',
    emoji: '🌗',
    sidesCount: 1,
    sidesDisplay: '1 Straight + 1 Curved',
    cornersDisplay: '2',
    sidesText: '1 straight bottom + 1 curved dome with 2 corners',
    rhyme: 'Cut a circle right in two, a smiling orange slice for you!',
    colorHex: 'text-orange-400',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
    borderColor: 'border-orange-400/50',
    visualAnchorOrTrick: 'Juicy Orange Slice / Protractor',
    realWorldExamples: [
      { name: 'Orange Slice', emoji: '🍊', tip: 'Juicy citrus sweet smile!' },
      { name: 'Protractor', emoji: '📐', tip: 'Math tool for measuring curves!' },
      { name: 'Taco Shell', emoji: '🌮', tip: 'Folded crunchy snack!' },
      { name: 'Rainbow Arch', emoji: '🌈', tip: 'Seven colors curving high!' }
    ]
  },
  {
    id: 'crescent',
    name: 'Crescent',
    category: 'curved_special',
    categoryTitle: 'Curved & Special Fun Shapes',
    emoji: '🌙',
    sidesCount: 0,
    sidesDisplay: '0 (2 Curved Edges)',
    cornersDisplay: '2 Sharp Points',
    sidesText: '0 straight sides (2 curved edges meeting at 2 tips)',
    rhyme: 'A glowing sliver in the dark, lighting up the bedtime park!',
    colorHex: 'text-yellow-300',
    badgeBg: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/40',
    borderColor: 'border-yellow-400/50',
    visualAnchorOrTrick: 'The Moon in the night sky',
    realWorldExamples: [
      { name: 'Night Sky Moon', emoji: '🌙', tip: 'Glowing softly outside window!' },
      { name: 'Banana Curve', emoji: '🍌', tip: 'Sweet yellow curved snack!' },
      { name: 'Croissant Pastry', emoji: '🥐', tip: 'Buttery breakfast bakery bite!' },
      { name: 'Baby Fingernail', emoji: '💅', tip: 'Tiny soft crescent curve!' }
    ]
  },
  {
    id: 'star',
    name: 'Star',
    category: 'curved_special',
    categoryTitle: 'Curved & Special Fun Shapes',
    emoji: '⭐',
    sidesCount: 10,
    sidesDisplay: '10 (Usually 5 Points)',
    cornersDisplay: '5 Outer, 5 Inner',
    sidesText: '10 straight sides (5 outer points & 5 inner corners)',
    rhyme: 'Twinkle, twinkle high and bright, glowing softly through the night!',
    colorHex: 'text-amber-300',
    badgeBg: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    borderColor: 'border-amber-400/50',
    visualAnchorOrTrick: 'Starfish / Sky Star',
    realWorldExamples: [
      { name: 'Sky Star', emoji: '✨', tip: 'Shining above your nursery!' },
      { name: 'Starfish', emoji: '🌊', tip: 'Resting on the beach sand!' },
      { name: 'Gold Star Sticker', emoji: '🌟', tip: 'Super sticker for good effort!' },
      { name: 'Star Fruit', emoji: '⭐', tip: 'Cut in half to see a star!' }
    ]
  },
  {
    id: 'heart',
    name: 'Heart',
    category: 'curved_special',
    categoryTitle: 'Curved & Special Fun Shapes',
    emoji: '💖',
    sidesCount: 0,
    sidesDisplay: '0 (2 Rounded Lobes)',
    cornersDisplay: '1 Sharp Point',
    sidesText: '0 straight sides (2 rounded top arches & 1 bottom point)',
    rhyme: 'A curve on the left, a curve on the right, filled with hugs and warm delight!',
    colorHex: 'text-pink-400',
    badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-400/40',
    borderColor: 'border-pink-400/50',
    visualAnchorOrTrick: 'Valentine’s Card / Strawberry',
    realWorldExamples: [
      { name: 'Sweet Strawberry', emoji: '🍓', tip: 'Red berry shaped like a heart!' },
      { name: 'Love Greeting Card', emoji: '💌', tip: 'Card for mommy and daddy!' },
      { name: 'Heart Balloon', emoji: '🎈', tip: 'Floating red love balloon!' },
      { name: 'Warm Hug', emoji: '🤗', tip: 'Feeling love inside your chest!' }
    ]
  }
];

export const CATEGORIES: { key: ShapeCategory; title: string; icon: string; count: number }[] = [
  { key: 'core', title: 'Core Shapes (The Basics)', icon: '📐', count: 4 },
  { key: 'quadrilaterals', title: 'Advanced Four-Sided Shapes (Quadrilaterals)', icon: '🔷', count: 4 },
  { key: 'polygons', title: 'Multi-Sided Shapes (The Polygon Family)', icon: '⬢', count: 7 },
  { key: 'curved_special', title: 'Curved & Special Fun Shapes', icon: '✨', count: 5 }
];

/**
 * Geometric Vector SVG Renderer for all 20 shapes
 */
export const ShapeGraphic: React.FC<{
  shapeId: string;
  className?: string;
  color?: string;
}> = ({ shapeId, className = 'w-10 h-10', color = 'currentColor' }) => {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {shapeId === 'circle' && (
        <circle cx="50" cy="50" r="40" fill={color} />
      )}
      {shapeId === 'square' && (
        <rect x="14" y="14" width="72" height="72" rx="6" fill={color} />
      )}
      {shapeId === 'triangle' && (
        <polygon points="50,12 88,86 12,86" fill={color} />
      )}
      {shapeId === 'rectangle' && (
        <rect x="10" y="24" width="80" height="52" rx="6" fill={color} />
      )}
      {shapeId === 'diamond' && (
        <polygon points="50,12 88,50 50,88 12,50" fill={color} />
      )}
      {shapeId === 'parallelogram' && (
        <polygon points="28,20 90,20 72,80 10,80" fill={color} />
      )}
      {shapeId === 'trapezoid' && (
        <polygon points="28,22 72,22 92,78 8,78" fill={color} />
      )}
      {shapeId === 'kite' && (
        <polygon points="50,8 84,38 50,92 16,38" fill={color} />
      )}
      {shapeId === 'pentagon' && (
        <polygon points="50,10 90,38 75,86 25,86 10,38" fill={color} />
      )}
      {shapeId === 'hexagon' && (
        <polygon points="50,10 86,30 86,70 50,90 14,70 14,30" fill={color} />
      )}
      {shapeId === 'heptagon' && (
        <polygon points="50,10 81,25 90,59 69,88 31,88 10,59 19,25" fill={color} />
      )}
      {shapeId === 'octagon' && (
        <polygon points="38,12 62,12 88,38 88,62 62,88 38,88 12,62 12,38" fill={color} />
      )}
      {shapeId === 'nonagon' && (
        <polygon points="50,10 76,20 90,44 86,72 63,89 37,89 14,72 10,44 24,20" fill={color} />
      )}
      {shapeId === 'decagon' && (
        <polygon points="50,10 74,18 89,37 90,63 77,83 50,90 23,83 10,63 11,37 26,18" fill={color} />
      )}
      {shapeId === 'dodecagon' && (
        <polygon points="50,10 70,15 85,30 90,50 85,70 70,85 50,90 30,85 15,70 10,50 15,30 30,15" fill={color} />
      )}
      {shapeId === 'oval' && (
        <ellipse cx="50" cy="50" rx="44" ry="28" fill={color} />
      )}
      {shapeId === 'semicircle' && (
        <path d="M 12 68 A 38 38 0 0 1 88 68 Z" fill={color} />
      )}
      {shapeId === 'crescent' && (
        <path d="M 62 12 A 38 38 0 1 0 62 88 A 28 28 0 0 1 62 12 Z" fill={color} />
      )}
      {shapeId === 'star' && (
        <polygon points="50,10 61,35 89,35 67,52 75,78 50,62 25,78 33,52 11,35 39,35" fill={color} />
      )}
      {shapeId === 'heart' && (
        <path d="M 50 84 C 47 81 12 55 12 28 A 20 20 0 0 1 50 22 A 20 20 0 0 1 88 28 C 88 55 53 81 50 84 Z" fill={color} />
      )}
    </svg>
  );
};

export const ToddlerShapesSection: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState<ShapeItem>(SHAPES_DATA[0]);
  const [activeTab, setActiveTab] = useState<'explore' | 'quiz' | 'builder'>('explore');

  // Quiz State
  const [quizShape, setQuizShape] = useState<ShapeItem>(() => {
    return SHAPES_DATA[Math.floor(Math.random() * SHAPES_DATA.length)];
  });
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateQuizChoices = (target: ShapeItem) => {
    const others = SHAPES_DATA.filter((s) => s.id !== target.id);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    return [...shuffledOthers, target].sort(() => 0.5 - Math.random());
  };

  const [quizChoices, setQuizChoices] = useState<ShapeItem[]>(() => {
    const initial = SHAPES_DATA[0];
    const others = SHAPES_DATA.filter((s) => s.id !== initial.id);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    return [...shuffledOthers, initial].sort(() => 0.5 - Math.random());
  });

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
      speakText(`Yes! That is the ${shape.name}! Super job!`);
      setTimeout(() => {
        setQuizFeedback(null);
        const remaining = SHAPES_DATA.filter((s) => s.id !== shape.id);
        const next = remaining[Math.floor(Math.random() * remaining.length)];
        setQuizShape(next);
        setQuizChoices(generateQuizChoices(next));
        speakText(`Can you find the ${next.name}?`);
      }, 1600);
    } else {
      playSound('click');
      setQuizFeedback('wrong');
      speakText(`Try again! Can you find the ${quizShape.name}?`);
      setTimeout(() => setQuizFeedback(null), 1400);
    }
  };

  const startQuiz = () => {
    playSound('glass');
    setActiveTab('quiz');
    setQuizScore(0);
    const first = SHAPES_DATA[Math.floor(Math.random() * SHAPES_DATA.length)];
    setQuizShape(first);
    setQuizChoices(generateQuizChoices(first));
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
            <Shapes className="w-6 h-6 text-slate-950" />
          </div>
          <div className="text-left">
            <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
              <span>Toddler Shape Detective</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
                20 Geometry Shapes
              </span>
            </h2>
            <p className="text-xs text-white/50">
              Discover basic shapes, quadrilaterals, polygons, and everyday curved forms!
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
            Explore 20 Shapes
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
              speakText('Tap anywhere on the canvas to stamp all 20 shapes!');
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

      {/* Mode 1: Explore Shapes (Categorized in 4 Sections) */}
      {activeTab === 'explore' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Left Column: Categorized Shape Sections */}
          <div className="lg:col-span-2 space-y-6">
            {CATEGORIES.map((cat) => {
              const catShapes = SHAPES_DATA.filter((s) => s.category === cat.key);
              return (
                <div key={cat.key} className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-base">{cat.icon}</span>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">
                      {cat.title}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 ml-auto">
                      {catShapes.length} Shapes
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {catShapes.map((shape) => {
                      const isSelected = selectedShape.id === shape.id;
                      return (
                        <motion.button
                          key={shape.id}
                          type="button"
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleSelectShape(shape)}
                          className={`relative p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[145px] ${
                            isSelected
                              ? `bg-white/15 ${shape.borderColor} ring-2 ring-amber-400 shadow-xl shadow-amber-500/10`
                              : `bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/10`
                          }`}
                        >
                          <div className={`w-12 h-12 flex items-center justify-center mb-1 ${shape.colorHex}`}>
                            <ShapeGraphic shapeId={shape.id} className="w-10 h-10" />
                          </div>
                          <div className="font-black text-xs sm:text-sm text-white tracking-wide">
                            {shape.name}
                          </div>
                          <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mt-0.5">
                            {shape.sidesDisplay} Sides
                          </div>
                          {isSelected && (
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Real World Everyday Examples for Selected Shape */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 text-left space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Real-World Visual Anchor & Everyday Examples: {selectedShape.name}</span>
              </div>
              <p className="text-xs text-slate-300">
                Anchor / Trick: <strong className="text-white">{selectedShape.visualAnchorOrTrick}</strong>
              </p>
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
          <div className="lg:col-span-1 lg:sticky lg:top-6">
            <motion.div
              key={selectedShape.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-6 sm:p-7 rounded-3xl border-2 ${selectedShape.borderColor} bg-gradient-to-br from-[#1c1828] via-[#14121d] to-[#0a0910] shadow-2xl text-left space-y-5`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-16 h-16 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center p-2.5 shadow-inner ${selectedShape.colorHex}`}>
                  <ShapeGraphic shapeId={selectedShape.id} className="w-12 h-12" />
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
                  {selectedShape.categoryTitle}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                  {selectedShape.name}
                </h3>
              </div>

              {/* Memory Trick / Anchor Box */}
              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Visual Anchor / Memory Trick
                </div>
                <p className="text-xs font-bold text-slate-200">
                  {selectedShape.visualAnchorOrTrick}
                </p>
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
                  <div className="text-[10px] text-white/40 uppercase font-bold">Straight Sides</div>
                  <div className="text-sm sm:text-base font-black text-white mt-0.5">{selectedShape.sidesDisplay}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase font-bold">Corners</div>
                  <div className="text-sm sm:text-base font-black text-white mt-0.5">{selectedShape.cornersDisplay}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Mode 2: Shape Quiz (Real Quiz - NO Text Clues & Shape Graphics ONLY on buttons) */}
      {activeTab === 'quiz' && (
        <div className="max-w-2xl mx-auto p-6 sm:p-10 rounded-3xl border-2 border-rose-400/40 bg-gradient-to-br from-[#241320] via-[#180d15] to-[#0c060a] shadow-2xl text-center space-y-6">
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
              <span>Hear Again</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-black text-rose-400 uppercase tracking-widest">
              Shape Detective Challenge
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white">
              Can you find the <span className="text-rose-300 underline decoration-rose-400 underline-offset-4">{quizShape.name}</span>?
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
                    <span>Hooray! That is the {quizShape.name}! 🌟</span>
                  </>
                ) : (
                  <span>Oops! Let's try once more! Look for {quizShape.name} 😊</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Choice Tiles - Real Quiz without Text Clues (Shape Graphic Only) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            {(quizChoices.length > 0 ? quizChoices : SHAPES_DATA.slice(0, 4)).map((shape) => (
              <button
                key={shape.id}
                type="button"
                onClick={() => handleQuizAnswer(shape)}
                className="p-5 rounded-2xl bg-white/5 hover:bg-white/15 border-2 border-white/15 hover:border-rose-400/80 transition-all cursor-pointer flex flex-col items-center justify-center active:scale-95 shadow-md group"
              >
                <div className={`w-16 h-16 flex items-center justify-center ${shape.colorHex}`}>
                  <ShapeGraphic shapeId={shape.id} className="w-14 h-14 group-hover:scale-110 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mode 3: Shape Stamping Playground (All 20 Shapes Available) */}
      {activeTab === 'builder' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-left flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Current Stamp:</span>
              <div className={`w-6 h-6 inline-flex items-center justify-center ${selectedShape.colorHex}`}>
                <ShapeGraphic shapeId={selectedShape.id} className="w-5 h-5" />
              </div>
              <span className="text-sm font-black text-emerald-300">{selectedShape.name}</span>
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

          {/* All 20 Shapes Categorized Stamp Palette */}
          <div className="space-y-3 p-4 rounded-3xl bg-white/[0.02] border border-white/10">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider text-left">
              Choose from All 20 Shapes to Stamp:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2">
              {SHAPES_DATA.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setSelectedShape(s);
                    speakText(s.name);
                  }}
                  className={`p-2 rounded-xl border text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    selectedShape.id === s.id
                      ? 'bg-emerald-400 text-slate-950 border-emerald-400 shadow-md scale-105'
                      : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                  title={s.name}
                >
                  <div className={`w-5 h-5 ${selectedShape.id === s.id ? 'text-slate-950' : s.colorHex}`}>
                    <ShapeGraphic shapeId={s.id} className="w-5 h-5" />
                  </div>
                  <span className="truncate max-w-[85px] text-[10px]">{s.name.split('/')[0]}</span>
                </button>
              ))}
            </div>
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
                  Tap anywhere on this dark canvas to stamp colorful {selectedShape.name}s!
                </p>
                <span className="text-[10px] text-white/20">Build houses, castles, robots, patterns and rockets! 🚀</span>
              </div>
            )}

            {stampedShapes.map((st) => (
              <motion.div
                key={st.id}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                style={{ position: 'absolute', left: st.x, top: st.y }}
                className={`w-10 h-10 select-none filter drop-shadow-lg ${st.shape.colorHex}`}
              >
                <ShapeGraphic shapeId={st.shape.id} className="w-10 h-10" />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
