import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, ChevronLeft, ChevronRight, Baby } from 'lucide-react';
import { playSound } from '../lib/sounds';
import { speakIndianEnglish } from '../lib/indianSpeech';

export interface EmotionItem {
  id: string;
  name: string;
  colorName: string;
  cardBorder: string;
  headerColor: string;
  badgeBg: string;
  whatItFeelsLike: string;
  parentSupportTip: string;
  funAction: string;
  expressionType:
    | 'happy'
    | 'sad'
    | 'angry'
    | 'scared'
    | 'surprised'
    | 'shy'
    | 'tired'
    | 'excited'
    | 'confused'
    | 'proud'
    | 'jealous'
    | 'calm'
    | 'silly'
    | 'nervous'
    | 'bored'
    | 'loved'
    | 'frustrated'
    | 'curious'
    | 'disgusted'
    | 'brave'
    | 'impatient'
    | 'embarrassed'
    | 'grateful'
    | 'hopeful'
    | 'playful';
}

export const TODDLER_EMOTIONS: EmotionItem[] = [
  {
    id: 'happy',
    name: 'HAPPY',
    colorName: 'amber',
    cardBorder: 'border-amber-400/50 hover:border-amber-400',
    headerColor: 'text-amber-400',
    badgeBg: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
    whatItFeelsLike: 'My heart feels warm and bouncy like a bright yellow balloon! I want to smile, clap, and giggle.',
    parentSupportTip: 'Share their joy! Say: "Look at your big, bright smile! You are having so much fun building with your blocks!"',
    funAction: 'Clap your hands 3 times and give your biggest, sunniest smile!',
    expressionType: 'happy'
  },
  {
    id: 'sad',
    name: 'SAD',
    colorName: 'blue',
    cardBorder: 'border-sky-400/50 hover:border-sky-400',
    headerColor: 'text-sky-400',
    badgeBg: 'bg-sky-400/10 text-sky-300 border-sky-400/30',
    whatItFeelsLike: 'My eyes feel heavy and watery, my lip quivers down, and I just want a warm, quiet cuddle.',
    parentSupportTip: 'Validate feelings without rushing to fix them: "It is okay to feel sad when play time ends. I am right here to hold you."',
    funAction: 'Give yourself a gentle, warm hug and take one slow, deep breath in and out.',
    expressionType: 'sad'
  },
  {
    id: 'angry',
    name: 'ANGRY',
    colorName: 'red',
    cardBorder: 'border-rose-500/50 hover:border-rose-500',
    headerColor: 'text-rose-400',
    badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    whatItFeelsLike: 'My face feels hot, my eyebrows scrunch down tight, and my hands want to squeeze like a roaring lion!',
    parentSupportTip: 'Stay calm as their anchor: "I see you are feeling very angry. I won’t let you hit, but we can stomp our feet together."',
    funAction: 'Stomp both feet like a big dinosaur, then blow out the birthday candles slowly: Whooooosh!',
    expressionType: 'angry'
  },
  {
    id: 'scared',
    name: 'SCARED',
    colorName: 'purple',
    cardBorder: 'border-purple-400/50 hover:border-purple-400',
    headerColor: 'text-purple-400',
    badgeBg: 'bg-purple-400/10 text-purple-300 border-purple-400/30',
    whatItFeelsLike: 'My tummy feels fluttery, my eyes open super wide, and I want to hold onto Mommy or Daddy tight.',
    parentSupportTip: 'Offer immediate physical safety: "That loud thunder was startling! You are completely safe here in my arms."',
    funAction: 'Wrap your arms around your shoulders like a cozy turtle shell and whisper "I am safe!"',
    expressionType: 'scared'
  },
  {
    id: 'surprised',
    name: 'SURPRISED',
    colorName: 'cyan',
    cardBorder: 'border-cyan-400/50 hover:border-cyan-400',
    headerColor: 'text-cyan-400',
    badgeBg: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/30',
    whatItFeelsLike: 'Whoa! Something unexpected just popped up! My eyebrows jump up high and my mouth makes a big O!',
    parentSupportTip: 'Turn surprises into playful discovery: "Pop! Did the jack-in-the-box surprise you? Look how wide your eyes went!"',
    funAction: 'Open your eyes and mouth wide like a circle and say "WHOA!"',
    expressionType: 'surprised'
  },
  {
    id: 'shy',
    name: 'SHY',
    colorName: 'pink',
    cardBorder: 'border-pink-400/50 hover:border-pink-400',
    headerColor: 'text-pink-400',
    badgeBg: 'bg-pink-400/10 text-pink-300 border-pink-400/30',
    whatItFeelsLike: 'I want to peek from behind your leg when I meet someone new. I need a little time to warm up.',
    parentSupportTip: 'Never force greetings; protect their pace: "She is taking her time warming up. She will wave when she feels ready."',
    funAction: 'Peek out with a tiny smile and give a little two-finger wave!',
    expressionType: 'shy'
  },
  {
    id: 'tired',
    name: 'TIRED',
    colorName: 'indigo',
    cardBorder: 'border-indigo-400/50 hover:border-indigo-400',
    headerColor: 'text-indigo-400',
    badgeBg: 'bg-indigo-400/10 text-indigo-300 border-indigo-400/30',
    whatItFeelsLike: 'My eyelids feel super sleepy, I am rubbing my eyes and yawning big, and my body wants a soft pillow.',
    parentSupportTip: 'Spot early sleepy cues (eye rubbing, yawning) before overtiredness hits, and dim the lights gently.',
    funAction: 'Stretch your arms high to the sky, let out a big yawn, and rest your cheek on your hands!',
    expressionType: 'tired'
  },
  {
    id: 'excited',
    name: 'EXCITED',
    colorName: 'orange',
    cardBorder: 'border-orange-400/50 hover:border-orange-400',
    headerColor: 'text-orange-400',
    badgeBg: 'bg-orange-400/10 text-orange-300 border-orange-400/30',
    whatItFeelsLike: 'I have fizzy sparkles in my toes! I want to jump up and down because something awesome is happening!',
    parentSupportTip: 'Channel high energy positively: "You are so excited to go to the park! Let’s hop like bunnies to get our shoes!"',
    funAction: 'Do 3 happy bunny hops in place and cheer "YAY!"',
    expressionType: 'excited'
  },
  {
    id: 'confused',
    name: 'CONFUSED',
    colorName: 'teal',
    cardBorder: 'border-teal-400/50 hover:border-teal-400',
    headerColor: 'text-teal-400',
    badgeBg: 'bg-teal-400/10 text-teal-300 border-teal-400/30',
    whatItFeelsLike: 'Hmm... I don’t quite understand how this puzzle works yet. My head tilts and one eyebrow goes up.',
    parentSupportTip: 'Break tasks into one simple step: "That puzzle piece is tricky! Let’s turn it around together and see if it fits."',
    funAction: 'Tap your chin with one finger, tilt your head, and say "Hmmmm?"',
    expressionType: 'confused'
  },
  {
    id: 'proud',
    name: 'PROUD',
    colorName: 'emerald',
    cardBorder: 'border-emerald-400/50 hover:border-emerald-400',
    headerColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30',
    whatItFeelsLike: 'I did it all by myself! I put on my own shoes and my chest feels tall and strong!',
    parentSupportTip: 'Praise the effort, not just the result: "You kept trying until you zipped your jacket! You should feel so proud!"',
    funAction: 'Stand tall with hands on your hips like a superhero and say "I DID IT!"',
    expressionType: 'proud'
  },
  {
    id: 'jealous',
    name: 'JEALOUS',
    colorName: 'lime',
    cardBorder: 'border-lime-400/50 hover:border-lime-400',
    headerColor: 'text-lime-400',
    badgeBg: 'bg-lime-400/10 text-lime-300 border-lime-400/30',
    whatItFeelsLike: 'I really want the toy my friend is holding right now, and it feels super hard to wait for my turn.',
    parentSupportTip: 'Acknowledge desire while holding boundaries: "You really want that red truck! It’s hard to wait. Let’s set a 2-minute timer."',
    funAction: 'Put your hands on your tummy and count slowly: "1, 2, 3... my turn is coming soon!"',
    expressionType: 'jealous'
  },
  {
    id: 'calm',
    name: 'CALM',
    colorName: 'sky',
    cardBorder: 'border-sky-300/50 hover:border-sky-300',
    headerColor: 'text-sky-300',
    badgeBg: 'bg-sky-300/10 text-sky-200 border-sky-300/30',
    whatItFeelsLike: 'My breathing is slow and gentle like a floating cloud. My body feels peaceful, cozy, and relaxed.',
    parentSupportTip: 'Notice and anchor peaceful moments: "Your body is so calm and cozy while we read this book together."',
    funAction: 'Close your eyes softly, smell a pretend flower, and blow a pretend dandelion!',
    expressionType: 'calm'
  },
  {
    id: 'silly',
    name: 'SILLY',
    colorName: 'fuchsia',
    cardBorder: 'border-fuchsia-400/50 hover:border-fuchsia-400',
    headerColor: 'text-fuchsia-400',
    badgeBg: 'bg-fuchsia-400/10 text-fuchsia-300 border-fuchsia-400/30',
    whatItFeelsLike: 'I have the giggles! I want to make funny faces, stick out my tongue, and wiggle my whole body!',
    parentSupportTip: 'Join the silliness! Shared laughter releases tension and strengthens parent-child attachment.',
    funAction: 'Wiggle your fingers by your ears and make your funniest goofy face!',
    expressionType: 'silly'
  },
  {
    id: 'nervous',
    name: 'NERVOUS',
    colorName: 'violet',
    cardBorder: 'border-violet-400/50 hover:border-violet-400',
    headerColor: 'text-violet-400',
    badgeBg: 'bg-violet-400/10 text-violet-300 border-violet-400/30',
    whatItFeelsLike: 'There are little butterflies fluttering in my tummy before trying something brand new.',
    parentSupportTip: 'Prepare toddlers ahead of time: "First we will walk into the doctor’s room, and you can sit right on my lap the whole time."',
    funAction: 'Gently tap your knees Left-Right-Left-Right and give your hands a gentle squeeze.',
    expressionType: 'nervous'
  },
  {
    id: 'bored',
    name: 'BORED',
    colorName: 'slate',
    cardBorder: 'border-slate-400/50 hover:border-slate-400',
    headerColor: 'text-slate-300',
    badgeBg: 'bg-slate-400/10 text-slate-300 border-slate-400/30',
    whatItFeelsLike: 'I don’t know what to play with right now and my chin is resting on my hands waiting for fun.',
    parentSupportTip: 'Offer two simple choices to spark engagement: "Would you like to build a block tower or draw with crayons?"',
    funAction: 'Look around the room and spot 3 things that are bright blue!',
    expressionType: 'bored'
  },
  {
    id: 'loved',
    name: 'LOVED',
    colorName: 'rose',
    cardBorder: 'border-rose-400/50 hover:border-rose-400',
    headerColor: 'text-rose-400',
    badgeBg: 'bg-rose-400/10 text-rose-300 border-rose-400/30',
    whatItFeelsLike: 'When I get snuggles, kisses, and bedtime stories, I feel safe, cherished, and special inside.',
    parentSupportTip: 'Unconditional connection: "No matter what feelings you have today, I love you all the way to the moon and back."',
    funAction: 'Make a heart shape with your hands and blow a sweet kiss to someone you love!',
    expressionType: 'loved'
  },
  {
    id: 'frustrated',
    name: 'FRUSTRATED',
    colorName: 'amber',
    cardBorder: 'border-amber-500/50 hover:border-amber-500',
    headerColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    whatItFeelsLike: 'Ugh! My block tower keeps falling down! My cheeks puff up because it isn’t working the way I want.',
    parentSupportTip: 'Coach persistence with empathy: "It is frustrating when the blocks fall! Let’s take a breath and put the biggest block at the bottom."',
    funAction: 'Squeeze your hands into tight balls for 3 seconds, then shake them loose like wet puppy paws!',
    expressionType: 'frustrated'
  },
  {
    id: 'curious',
    name: 'CURIOUS',
    colorName: 'cyan',
    cardBorder: 'border-cyan-400/50 hover:border-cyan-400',
    headerColor: 'text-cyan-300',
    badgeBg: 'bg-cyan-400/10 text-cyan-200 border-cyan-400/30',
    whatItFeelsLike: 'Ooh, what is that little ladybug doing on the leaf? I want to look closer, touch, and explore!',
    parentSupportTip: 'Nurture their natural scientist: "Look how closely you are watching that ant! Where do you think it is carrying that crumb?"',
    funAction: 'Make binocular circles with your hands around your eyes and look all around!',
    expressionType: 'curious'
  },
  {
    id: 'disgusted',
    name: 'DISGUSTED',
    colorName: 'green',
    cardBorder: 'border-emerald-500/50 hover:border-emerald-500',
    headerColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    whatItFeelsLike: 'Eww, yuck! That mud is sticky on my fingers or that new taste surprised my tongue! My nose scrunches up.',
    parentSupportTip: 'Respect sensory boundaries calmly: "That texture feels squishy to your fingers! Let’s wipe your hands with a warm cloth."',
    funAction: 'Scrunch up your nose like a bunny and say a silly "Blech!"',
    expressionType: 'disgusted'
  },
  {
    id: 'brave',
    name: 'BRAVE',
    colorName: 'yellow',
    cardBorder: 'border-yellow-400/50 hover:border-yellow-400',
    headerColor: 'text-yellow-400',
    badgeBg: 'bg-yellow-400/10 text-yellow-300 border-yellow-400/30',
    whatItFeelsLike: 'Even though the slide looks tall, I take a deep breath, hold the rail, and try it anyway!',
    parentSupportTip: 'Celebrate courage over perfection: "You felt a little nervous about the big slide, and you tried it anyway! That was so brave!"',
    funAction: 'Pat your heart twice and say "I am strong and brave!"',
    expressionType: 'brave'
  },
  {
    id: 'impatient',
    name: 'IMPATIENT',
    colorName: 'orange',
    cardBorder: 'border-orange-500/50 hover:border-orange-500',
    headerColor: 'text-orange-400',
    badgeBg: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
    whatItFeelsLike: 'Are we there yet? Is the milk warm yet? My feet are tapping because waiting feels like forever!',
    parentSupportTip: 'Give concrete time anchors toddlers understand: "Your milk will be ready right after we sing the ABC song one time!"',
    funAction: 'Tap your shoulders to a slow beat and count from 1 to 5 together.',
    expressionType: 'impatient'
  },
  {
    id: 'embarrassed',
    name: 'EMBARRASSED',
    colorName: 'pink',
    cardBorder: 'border-pink-400/50 hover:border-pink-400',
    headerColor: 'text-pink-300',
    badgeBg: 'bg-pink-400/10 text-pink-200 border-pink-400/30',
    whatItFeelsLike: 'Oops! I spilled my water cup and everyone looked at me. My cheeks feel warm and pink.',
    parentSupportTip: 'Normalize accidents matter-of-factly: "Whoops, water spilled! Everybody spills sometimes. Let’s grab our little towel together."',
    funAction: 'Put your hands on your rosy cheeks, smile, and say "Oopsie daisy, that’s okay!"',
    expressionType: 'embarrassed'
  },
  {
    id: 'grateful',
    name: 'GRATEFUL',
    colorName: 'emerald',
    cardBorder: 'border-emerald-400/50 hover:border-emerald-400',
    headerColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30',
    whatItFeelsLike: 'Warm fuzzy thankfulness when someone shares a snack, helps me build, or reads my favorite story.',
    parentSupportTip: 'Model everyday gratitude: "Thank you for handing me the spoon! That was so helpful and kind of you."',
    funAction: 'Bring your hands together in Namaste and say a sweet "Thank you!"',
    expressionType: 'grateful'
  },
  {
    id: 'hopeful',
    name: 'HOPEFUL',
    colorName: 'sky',
    cardBorder: 'border-sky-400/50 hover:border-sky-400',
    headerColor: 'text-sky-400',
    badgeBg: 'bg-sky-400/10 text-sky-300 border-sky-400/30',
    whatItFeelsLike: 'Looking out the window with bright, wishing eyes waiting for the rain to stop so we can see a rainbow!',
    parentSupportTip: 'Encourage gentle optimism: "Even though it is raining right now, the sun will come back and we can splash in puddles!"',
    funAction: 'Look up at the sky, clasp your hands under your chin, and make a happy wish!',
    expressionType: 'hopeful'
  },
  {
    id: 'playful',
    name: 'PLAYFUL',
    colorName: 'violet',
    cardBorder: 'border-violet-400/50 hover:border-violet-400',
    headerColor: 'text-violet-400',
    badgeBg: 'bg-violet-400/10 text-violet-300 border-violet-400/30',
    whatItFeelsLike: 'Ready to zoom like an airplane, hide behind the curtain for peek-a-boo, and laugh with my whole heart!',
    parentSupportTip: 'Ten minutes of undivided floor play fills a toddler’s emotional cup for hours.',
    funAction: 'Cover your eyes with both hands, wait 2 seconds, then pop open and shout "PEEK-A-BOO!"',
    expressionType: 'playful'
  }
];

/**
 * Expressive Illustrated Toddler Portrait Component
 * Renders a distinct, unmistakable toddler facial expression for each of the 25 emotions
 * without any duplicate text overlays or gender labels.
 */
export const ToddlerCharacterAvatar: React.FC<{
  item: EmotionItem;
  size?: 'sm' | 'md' | 'lg';
}> = ({ item, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-28 h-28 sm:w-32 sm:h-32',
    md: 'w-36 h-36 sm:w-40 sm:h-40',
    lg: 'w-48 h-48 sm:w-56 sm:h-56'
  }[size];

  const expr = item.expressionType;

  // Background gradient per emotion family
  const bgMap: Record<string, string> = {
    happy: 'from-amber-500/30 via-yellow-500/15 to-slate-900',
    sad: 'from-sky-600/30 via-blue-900/20 to-slate-900',
    angry: 'from-rose-600/35 via-red-900/25 to-slate-900',
    scared: 'from-purple-600/30 via-indigo-900/25 to-slate-900',
    surprised: 'from-cyan-500/30 via-teal-900/20 to-slate-900',
    shy: 'from-pink-500/30 via-rose-900/20 to-slate-900',
    tired: 'from-indigo-600/30 via-slate-900 to-slate-950',
    excited: 'from-orange-500/30 via-amber-900/20 to-slate-900',
    confused: 'from-teal-500/30 via-slate-900 to-slate-950',
    proud: 'from-emerald-500/30 via-teal-900/20 to-slate-900',
    jealous: 'from-lime-500/25 via-emerald-950/30 to-slate-900',
    calm: 'from-sky-400/25 via-cyan-950/25 to-slate-900',
    silly: 'from-fuchsia-500/30 via-purple-900/20 to-slate-900',
    nervous: 'from-violet-500/30 via-indigo-950/25 to-slate-900',
    bored: 'from-slate-500/25 via-slate-800/30 to-slate-900',
    loved: 'from-rose-500/35 via-pink-900/25 to-slate-900',
    frustrated: 'from-amber-600/30 via-orange-950/25 to-slate-900',
    curious: 'from-cyan-500/30 via-sky-900/20 to-slate-900',
    disgusted: 'from-emerald-600/30 via-green-950/25 to-slate-900',
    brave: 'from-yellow-500/30 via-amber-900/25 to-slate-900',
    impatient: 'from-orange-500/30 via-red-950/20 to-slate-900',
    embarrassed: 'from-pink-500/35 via-rose-950/25 to-slate-900',
    grateful: 'from-emerald-500/30 via-teal-950/20 to-slate-900',
    hopeful: 'from-sky-500/30 via-indigo-950/25 to-slate-900',
    playful: 'from-violet-500/30 via-fuchsia-950/25 to-slate-900'
  };

  const shirtColors: Record<string, string> = {
    happy: '#F59E0B',
    sad: '#38BDF8',
    angry: '#EF4444',
    scared: '#A855F7',
    surprised: '#06B6D4',
    shy: '#EC4899',
    tired: '#6366F1',
    excited: '#F97316',
    confused: '#14B8A6',
    proud: '#10B981',
    jealous: '#84CC16',
    calm: '#38BDF8',
    silly: '#D946EF',
    nervous: '#8B5CF6',
    bored: '#64748B',
    loved: '#F43F5E',
    frustrated: '#D97706',
    curious: '#0EA5E9',
    disgusted: '#22C55E',
    brave: '#EAB308',
    impatient: '#EA580C',
    embarrassed: '#F472B6',
    grateful: '#10B981',
    hopeful: '#38BDF8',
    playful: '#A855F7'
  };

  return (
    <div
      className={`relative ${sizeClasses} rounded-2xl overflow-hidden border-2 ${item.cardBorder} shadow-lg bg-gradient-to-b ${
        bgMap[expr] || 'from-slate-800 to-slate-950'
      } flex items-center justify-center shrink-0`}
    >
      <svg
        viewBox="0 0 160 160"
        className="w-full h-full transition-transform duration-300 group-hover:scale-105"
        aria-label={`${item.name} toddler expression`}
      >
        <defs>
          <radialGradient id={`skin-${item.id}`} cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor="#F5CBA7" />
            <stop offset="70%" stopColor="#E5A97C" />
            <stop offset="100%" stopColor="#D38B5D" />
          </radialGradient>
          <radialGradient id={`cheek-${item.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FB7185" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#FB7185" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`angry-flush-${item.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft halo glow behind head */}
        <circle cx="80" cy="78" r="56" fill="white" fillOpacity="0.06" />

        {/* Shoulders & Shirt */}
        <path
          d="M 32 160 C 34 128, 126 128, 128 160 Z"
          fill={shirtColors[expr] || '#38BDF8'}
        />
        <path
          d="M 62 132 Q 80 144 98 132"
          fill="none"
          stroke="#FFF"
          strokeWidth="3"
          strokeOpacity="0.5"
        />

        {/* Neck */}
        <rect x="68" y="114" width="24" height="20" rx="8" fill="#D38B5D" />

        {/* Ears */}
        <circle cx="33" cy="82" r="11" fill="#E5A97C" />
        <circle cx="33" cy="82" r="6" fill="#C67D50" />
        <circle cx="127" cy="82" r="11" fill="#E5A97C" />
        <circle cx="127" cy="82" r="6" fill="#C67D50" />

        {/* Toddler Head */}
        <ellipse cx="80" cy="78" rx="46" ry="44" fill={`url(#skin-${item.id})`} />

        {/* Soft Curly Toddler Hair */}
        <path
          d="M 34 72 C 30 40, 55 24, 80 24 C 105 24, 130 40, 126 72 C 122 52, 108 40, 80 40 C 52 40, 38 52, 34 72 Z"
          fill="#271810"
        />
        <circle cx="52" cy="36" r="12" fill="#271810" />
        <circle cx="80" cy="31" r="14" fill="#271810" />
        <circle cx="108" cy="36" r="12" fill="#271810" />
        {/* Cute Forehead Curl */}
        <path
          d="M 75 34 Q 86 44 77 50 Q 70 46 74 39"
          fill="none"
          stroke="#271810"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Cheeks */}
        {expr === 'angry' || expr === 'frustrated' ? (
          <>
            <circle cx="48" cy="90" r="14" fill={`url(#angry-flush-${item.id})`} />
            <circle cx="112" cy="90" r="14" fill={`url(#angry-flush-${item.id})`} />
          </>
        ) : expr === 'shy' || expr === 'embarrassed' || expr === 'loved' ? (
          <>
            <circle cx="48" cy="90" r="15" fill={`url(#cheek-${item.id})`} />
            <circle cx="112" cy="90" r="15" fill={`url(#cheek-${item.id})`} />
            <line x1="42" y1="88" x2="47" y2="93" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
            <line x1="49" y1="88" x2="54" y2="93" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
            <line x1="106" y1="88" x2="111" y2="93" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
            <line x1="113" y1="88" x2="118" y2="93" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
          </>
        ) : (
          <>
            <circle cx="48" cy="90" r="11" fill={`url(#cheek-${item.id})`} />
            <circle cx="112" cy="90" r="11" fill={`url(#cheek-${item.id})`} />
          </>
        )}

        {/* Cute Button Nose */}
        <ellipse cx="80" cy="84" rx="4.5" ry="3.2" fill="#C67D50" />

        {/* ================= DISTINCT FACIAL EXPRESSIONS ================= */}

        {/* 1. HAPPY */}
        {expr === 'happy' && (
          <>
            <path d="M 48 60 Q 58 53 68 59" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 92 59 Q 102 53 112 60" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="58" cy="72" r="7.5" fill="#1E1B18" />
            <circle cx="102" cy="72" r="7.5" fill="#1E1B18" />
            <circle cx="55.5" cy="69.5" r="2.8" fill="#FFF" />
            <circle cx="99.5" cy="69.5" r="2.8" fill="#FFF" />
            {/* Big joyful open smile with baby teeth */}
            <path d="M 56 93 Q 80 116 104 93 Z" fill="#991B1B" stroke="#7F1D1D" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M 66 94 L 94 94 L 92 99 L 68 99 Z" fill="#FFFFFF" />
            <path d="M 68 105 Q 80 99 92 105 Q 80 112 68 105 Z" fill="#FB7185" />
          </>
        )}

        {/* 2. SAD (Downturned quivering pout & sad droopy eyes — NOT screaming newborn!) */}
        {expr === 'sad' && (
          <>
            {/* Inner brows raised in classic sad angle */}
            <path d="M 46 64 Q 58 61 68 54" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 92 54 Q 102 61 114 64" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            {/* Glistening sad eyes */}
            <circle cx="58" cy="74" r="7.5" fill="#1E1B18" />
            <circle cx="102" cy="74" r="7.5" fill="#1E1B18" />
            <circle cx="56" cy="71" r="2.8" fill="#FFF" />
            <circle cx="100" cy="71" r="2.8" fill="#FFF" />
            <circle cx="60" cy="77" r="1.5" fill="#FFF" />
            <circle cx="104" cy="77" r="1.5" fill="#FFF" />
            {/* Single gentle tear drop on cheek */}
            <path d="M 49 81 C 46 87, 46 92, 49 93 C 52 92, 52 87, 49 81 Z" fill="#38BDF8" />
            {/* Pronounced downturned sad pouty lip */}
            <path d="M 60 106 Q 80 92 100 106" fill="none" stroke="#7F1D1D" strokeWidth="4" strokeLinecap="round" />
            <path d="M 70 105 Q 80 101 90 105" fill="none" stroke="#E5A97C" strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {/* 3. ANGRY (Strong V-brows, narrowed intense eyes, gritted frown & steam puffs — NOT dull!) */}
        {expr === 'angry' && (
          <>
            {/* Deep V-shaped angry eyebrows */}
            <path d="M 45 55 L 70 66" fill="none" stroke="#271810" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 115 55 L 90 66" fill="none" stroke="#271810" strokeWidth="4.5" strokeLinecap="round" />
            {/* Forehead scrunch lines */}
            <path d="M 75 56 L 76 62" stroke="#B4653A" strokeWidth="2" strokeLinecap="round" />
            <path d="M 85 56 L 84 62" stroke="#B4653A" strokeWidth="2" strokeLinecap="round" />
            {/* Intense narrowed eyes */}
            <path d="M 49 71 L 67 74 A 8 8 0 0 1 49 71 Z" fill="#1E1B18" />
            <path d="M 111 71 L 93 74 A 8 8 0 0 0 111 71 Z" fill="#1E1B18" />
            <circle cx="58" cy="73" r="6.5" fill="#1E1B18" />
            <circle cx="102" cy="73" r="6.5" fill="#1E1B18" />
            <circle cx="56.5" cy="72" r="2" fill="#FFF" />
            <circle cx="100.5" cy="72" r="2" fill="#FFF" />
            {/* Upper eyelid cut for fierce look */}
            <path d="M 48 66 L 68 72" stroke="#E5A97C" strokeWidth="4" />
            <path d="M 112 66 L 92 72" stroke="#E5A97C" strokeWidth="4" />
            {/* Gritted angry scowl mouth */}
            <path d="M 58 104 Q 80 93 102 104 Q 98 110 62 110 Z" fill="#FFFFFF" stroke="#7F1D1D" strokeWidth="3" strokeLinejoin="round" />
            <line x1="62" y1="104" x2="98" y2="104" stroke="#7F1D1D" strokeWidth="2" />
            {/* Little steam puffs at temples */}
            <path d="M 18 52 Q 12 46 18 40 Q 24 38 26 44" fill="none" stroke="#FCA5A5" strokeWidth="3" strokeLinecap="round" />
            <path d="M 142 52 Q 148 46 142 40 Q 136 38 134 44" fill="none" stroke="#FCA5A5" strokeWidth="3" strokeLinecap="round" />
          </>
        )}

        {/* 4. SCARED (High worried brows, huge wide eyes with small pupils, trembling mouth & hands on cheeks — NOT crying!) */}
        {expr === 'scared' && (
          <>
            {/* High worried eyebrows */}
            <path d="M 45 58 Q 58 48 68 53" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 92 53 Q 102 48 115 58" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            {/* Huge wide fearful eyes showing white sclera all around */}
            <circle cx="58" cy="72" r="10.5" fill="#FFFFFF" stroke="#271810" strokeWidth="2.5" />
            <circle cx="102" cy="72" r="10.5" fill="#FFFFFF" stroke="#271810" strokeWidth="2.5" />
            <circle cx="58" cy="72" r="4.5" fill="#1E1B18" />
            <circle cx="102" cy="72" r="4.5" fill="#1E1B18" />
            <circle cx="56.5" cy="70.5" r="1.8" fill="#FFF" />
            <circle cx="100.5" cy="70.5" r="1.8" fill="#FFF" />
            {/* Trembling wavy scared mouth */}
            <path d="M 62 102 Q 70 96 80 100 Q 90 96 98 102 Q 90 109 80 106 Q 70 109 62 102 Z" fill="#7F1D1D" stroke="#450A0A" strokeWidth="2" />
            {/* Little toddler hands pressed to cheeks in fear */}
            <ellipse cx="38" cy="104" rx="9" ry="13" transform="rotate(-18 38 104)" fill="#E5A97C" stroke="#C67D50" strokeWidth="2" />
            <ellipse cx="122" cy="104" rx="9" ry="13" transform="rotate(18 122 104)" fill="#E5A97C" stroke="#C67D50" strokeWidth="2" />
          </>
        )}

        {/* 5. SURPRISED */}
        {expr === 'surprised' && (
          <>
            <path d="M 46 52 Q 58 43 69 52" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 91 52 Q 102 43 114 52" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="58" cy="71" r="9" fill="#1E1B18" />
            <circle cx="102" cy="71" r="9" fill="#1E1B18" />
            <circle cx="55.5" cy="68.5" r="3.2" fill="#FFF" />
            <circle cx="99.5" cy="68.5" r="3.2" fill="#FFF" />
            {/* Big round O mouth */}
            <ellipse cx="80" cy="102" rx="10" ry="12" fill="#991B1B" stroke="#7F1D1D" strokeWidth="2.5" />
            <ellipse cx="80" cy="108" rx="6" ry="4" fill="#FB7185" />
          </>
        )}

        {/* 6. SHY */}
        {expr === 'shy' && (
          <>
            <path d="M 48 61 Q 58 57 68 62" fill="none" stroke="#271810" strokeWidth="3" strokeLinecap="round" />
            <path d="M 92 62 Q 102 57 112 61" fill="none" stroke="#271810" strokeWidth="3" strokeLinecap="round" />
            {/* Eyes glancing shyly to the side */}
            <circle cx="58" cy="73" r="7" fill="#1E1B18" />
            <circle cx="102" cy="73" r="7" fill="#1E1B18" />
            <circle cx="61" cy="71" r="2.6" fill="#FFF" />
            <circle cx="105" cy="71" r="2.6" fill="#FFF" />
            {/* Bashful small curved smile */}
            <path d="M 68 98 Q 80 105 92 97" fill="none" stroke="#7F1D1D" strokeWidth="3.5" strokeLinecap="round" />
            {/* Little hand touching chin shyly */}
            <circle cx="95" cy="112" r="10" fill="#E5A97C" stroke="#C67D50" strokeWidth="2" />
          </>
        )}

        {/* 7. TIRED */}
        {expr === 'tired' && (
          <>
            <path d="M 47 62 Q 58 65 68 61" fill="none" stroke="#271810" strokeWidth="3" strokeLinecap="round" />
            <path d="M 92 61 Q 102 65 113 62" fill="none" stroke="#271810" strokeWidth="3" strokeLinecap="round" />
            {/* Sleepy half-closed droopy eyelids */}
            <path d="M 48 74 Q 58 81 68 74" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 92 74 Q 102 81 112 74" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            {/* Big sleepy yawn */}
            <ellipse cx="80" cy="101" rx="9" ry="11" fill="#991B1B" stroke="#7F1D1D" strokeWidth="2.5" />
            {/* Floating Zzz */}
            <text x="118" y="45" fill="#A5B4FC" fontSize="14" fontWeight="900">Z</text>
            <text x="130" y="33" fill="#818CF8" fontSize="11" fontWeight="900">z</text>
          </>
        )}

        {/* 8. EXCITED */}
        {expr === 'excited' && (
          <>
            <path d="M 46 55 Q 58 47 68 55" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 92 55 Q 102 47 114 55" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            {/* Starry sparkling eyes */}
            <circle cx="58" cy="72" r="8.5" fill="#1E1B18" />
            <circle cx="102" cy="72" r="8.5" fill="#1E1B18" />
            <polygon points="58,65 60,70 65,72 60,74 58,79 56,74 51,72 56,70" fill="#FEF08A" />
            <polygon points="102,65 104,70 109,72 104,74 102,79 100,74 95,72 100,70" fill="#FEF08A" />
            {/* Huge cheering grin */}
            <path d="M 52 92 Q 80 120 108 92 Z" fill="#991B1B" stroke="#7F1D1D" strokeWidth="2.5" />
            <path d="M 62 93 L 98 93 L 95 99 L 65 99 Z" fill="#FFFFFF" />
            <path d="M 66 106 Q 80 99 94 106 Q 80 115 66 106 Z" fill="#FB7185" />
          </>
        )}

        {/* 9. CONFUSED */}
        {expr === 'confused' && (
          <>
            {/* Asymmetric eyebrows: one raised high, one flat */}
            <path d="M 46 63 L 68 62" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 92 54 Q 103 46 114 55" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="58" cy="73" r="7" fill="#1E1B18" />
            <circle cx="102" cy="71" r="7.5" fill="#1E1B18" />
            <circle cx="56" cy="70" r="2.5" fill="#FFF" />
            <circle cx="100" cy="68" r="2.5" fill="#FFF" />
            {/* Crooked squiggly mouth */}
            <path d="M 62 101 Q 74 96 84 102 Q 92 105 98 98" fill="none" stroke="#7F1D1D" strokeWidth="3.5" strokeLinecap="round" />
            <text x="122" y="42" fill="#5EEAD4" fontSize="18" fontWeight="900">?</text>
          </>
        )}

        {/* 10. PROUD */}
        {expr === 'proud' && (
          <>
            <path d="M 47 57 Q 58 51 68 57" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 92 57 Q 102 51 113 57" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            {/* Happy confident curved eyes */}
            <path d="M 49 72 Q 58 63 67 72" fill="none" stroke="#1E1B18" strokeWidth="4" strokeLinecap="round" />
            <path d="M 93 72 Q 102 63 111 72" fill="none" stroke="#1E1B18" strokeWidth="4" strokeLinecap="round" />
            {/* Wide confident smile */}
            <path d="M 56 95 Q 80 112 104 95" fill="none" stroke="#7F1D1D" strokeWidth="4" strokeLinecap="round" />
            <polygon points="124,42 127,48 134,49 129,54 130,60 124,57 118,60 119,54 114,49 121,48" fill="#FBBF24" />
          </>
        )}

        {/* 11. JEALOUS */}
        {expr === 'jealous' && (
          <>
            <path d="M 46 58 L 68 63" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 114 58 L 92 63" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            {/* Side-eye glance */}
            <circle cx="58" cy="73" r="8" fill="#FFF" stroke="#271810" strokeWidth="2" />
            <circle cx="102" cy="73" r="8" fill="#FFF" stroke="#271810" strokeWidth="2" />
            <circle cx="62" cy="73" r="4.5" fill="#1E1B18" />
            <circle cx="106" cy="73" r="4.5" fill="#1E1B18" />
            {/* Tight side pout */}
            <path d="M 66 101 Q 80 97 96 103" fill="none" stroke="#7F1D1D" strokeWidth="3.5" strokeLinecap="round" />
          </>
        )}

        {/* 12. CALM */}
        {expr === 'calm' && (
          <>
            <path d="M 48 60 Q 58 56 68 60" fill="none" stroke="#271810" strokeWidth="3" strokeLinecap="round" />
            <path d="M 92 60 Q 102 56 112 60" fill="none" stroke="#271810" strokeWidth="3" strokeLinecap="round" />
            {/* Serene closed curved eyes */}
            <path d="M 48 73 Q 58 80 68 73" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 92 73 Q 102 80 112 73" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            {/* Peaceful gentle smile */}
            <path d="M 62 96 Q 80 107 98 96" fill="none" stroke="#7F1D1D" strokeWidth="3.5" strokeLinecap="round" />
          </>
        )}

        {/* 13. SILLY */}
        {expr === 'silly' && (
          <>
            <path d="M 46 56 Q 58 49 68 57" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 92 55 Q 102 48 114 56" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            {/* Left eye playful wink, Right eye big & bright */}
            <path d="M 48 72 Q 58 64 68 72" fill="none" stroke="#271810" strokeWidth="4" strokeLinecap="round" />
            <circle cx="102" cy="72" r="8" fill="#1E1B18" />
            <circle cx="99.5" cy="69.5" r="3" fill="#FFF" />
            {/* Big grin with playful pink tongue sticking out */}
            <path d="M 58 95 Q 80 110 102 95" fill="none" stroke="#7F1D1D" strokeWidth="4" strokeLinecap="round" />
            <path d="M 73 101 L 73 111 A 7 7 0 0 0 87 111 L 87 101 Z" fill="#FB7185" stroke="#9F1239" strokeWidth="2" />
            <line x1="80" y1="102" x2="80" y2="111" stroke="#9F1239" strokeWidth="1.5" />
          </>
        )}

        {/* 14. NERVOUS */}
        {expr === 'nervous' && (
          <>
            <path d="M 46 61 Q 58 58 68 53" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 92 53 Q 102 58 114 61" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="58" cy="73" r="8" fill="#1E1B18" />
            <circle cx="102" cy="73" r="8" fill="#1E1B18" />
            <circle cx="56" cy="71" r="2.8" fill="#FFF" />
            <circle cx="100" cy="71" r="2.8" fill="#FFF" />
            {/* Wavy nervous lip */}
            <path d="M 60 101 Q 67 96 74 101 T 88 101 T 100 101" fill="none" stroke="#7F1D1D" strokeWidth="3.5" strokeLinecap="round" />
            {/* Sweat drop on forehead */}
            <path d="M 118 54 C 115 61, 115 65, 118 66 C 121 65, 121 61, 118 54 Z" fill="#38BDF8" />
          </>
        )}

        {/* 15. BORED */}
        {expr === 'bored' && (
          <>
            <line x1="47" y1="60" x2="68" y2="60" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="92" y1="60" x2="113" y2="60" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            {/* Half-lidded flat eyes */}
            <circle cx="58" cy="73" r="7" fill="#1E1B18" />
            <circle cx="102" cy="73" r="7" fill="#1E1B18" />
            <rect x="48" y="64" width="20" height="8" fill="#E5A97C" />
            <rect x="92" y="64" width="20" height="8" fill="#E5A97C" />
            <line x1="48" y1="72" x2="68" y2="72" stroke="#271810" strokeWidth="3" strokeLinecap="round" />
            <line x1="92" y1="72" x2="112" y2="72" stroke="#271810" strokeWidth="3" strokeLinecap="round" />
            {/* Flat straight mouth */}
            <line x1="66" y1="101" x2="94" y2="101" stroke="#7F1D1D" strokeWidth="3.5" strokeLinecap="round" />
          </>
        )}

        {/* 16. LOVED */}
        {expr === 'loved' && (
          <>
            <path d="M 48 58 Q 58 52 68 58" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 92 58 Q 102 52 112 58" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="58" cy="72" r="8" fill="#1E1B18" />
            <circle cx="102" cy="72" r="8" fill="#1E1B18" />
            <circle cx="55.5" cy="69.5" r="3" fill="#FFF" />
            <circle cx="99.5" cy="69.5" r="3" fill="#FFF" />
            <path d="M 58 95 Q 80 113 102 95" fill="none" stroke="#7F1D1D" strokeWidth="4" strokeLinecap="round" />
            {/* Floating hearts */}
            <path d="M 26 52 C 26 48, 20 48, 20 52 C 20 56, 26 60, 26 62 C 26 60, 32 56, 32 52 C 32 48, 26 48, 26 52 Z" fill="#F43F5E" />
            <path d="M 134 46 C 134 42, 128 42, 128 46 C 128 50, 134 54, 134 56 C 134 54, 140 50, 140 46 C 140 42, 134 42, 134 46 Z" fill="#FB7185" />
          </>
        )}

        {/* 17. FRUSTRATED */}
        {expr === 'frustrated' && (
          <>
            <path d="M 46 57 L 69 65" fill="none" stroke="#271810" strokeWidth="4" strokeLinecap="round" />
            <path d="M 114 57 L 91 65" fill="none" stroke="#271810" strokeWidth="4" strokeLinecap="round" />
            <circle cx="58" cy="73" r="7" fill="#1E1B18" />
            <circle cx="102" cy="73" r="7" fill="#1E1B18" />
            <circle cx="56" cy="71" r="2.2" fill="#FFF" />
            <circle cx="100" cy="71" r="2.2" fill="#FFF" />
            {/* Puffed cheeks & tight scrunched mouth */}
            <path d="M 62 103 Q 71 97 80 103 Q 89 97 98 103" fill="none" stroke="#7F1D1D" strokeWidth="4" strokeLinecap="round" />
            <path d="M 52 96 Q 46 102 52 108" fill="none" stroke="#B4653A" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 108 96 Q 114 102 108 108" fill="none" stroke="#B4653A" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}

        {/* 18. CURIOUS */}
        {expr === 'curious' && (
          <>
            <path d="M 46 54 Q 58 46 68 54" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 92 52 Q 102 44 114 52" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="58" cy="72" r="9" fill="#1E1B18" />
            <circle cx="102" cy="72" r="9" fill="#1E1B18" />
            <circle cx="55" cy="69" r="3.4" fill="#FFF" />
            <circle cx="99" cy="69" r="3.4" fill="#FFF" />
            {/* Small inquisitive 'ooh' mouth */}
            <circle cx="80" cy="101" r="6" fill="#991B1B" />
          </>
        )}

        {/* 19. DISGUSTED */}
        {expr === 'disgusted' && (
          <>
            <path d="M 46 60 L 68 65" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 114 60 L 92 65" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            {/* Squinted > < eyes */}
            <path d="M 49 69 L 65 74 L 49 79" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 111 69 L 95 74 L 111 79" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Scrunched yuck mouth with tongue */}
            <path d="M 60 103 Q 80 94 100 103" fill="none" stroke="#7F1D1D" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 73 99 L 73 108 A 7 7 0 0 0 87 108 L 87 99 Z" fill="#FB7185" stroke="#9F1239" strokeWidth="2" />
          </>
        )}

        {/* 20. BRAVE */}
        {expr === 'brave' && (
          <>
            <path d="M 46 58 L 68 61" fill="none" stroke="#271810" strokeWidth="4" strokeLinecap="round" />
            <path d="M 114 58 L 92 61" fill="none" stroke="#271810" strokeWidth="4" strokeLinecap="round" />
            <circle cx="58" cy="72" r="8" fill="#1E1B18" />
            <circle cx="102" cy="72" r="8" fill="#1E1B18" />
            <circle cx="55.5" cy="69.5" r="2.8" fill="#FFF" />
            <circle cx="99.5" cy="69.5" r="2.8" fill="#FFF" />
            {/* Determined strong smile */}
            <path d="M 58 96 Q 80 109 102 96" fill="none" stroke="#7F1D1D" strokeWidth="4" strokeLinecap="round" />
          </>
        )}

        {/* 21. IMPATIENT */}
        {expr === 'impatient' && (
          <>
            <path d="M 46 58 L 68 63" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 92 56 Q 103 50 114 58" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="58" cy="73" r="7.5" fill="#1E1B18" />
            <circle cx="102" cy="73" r="7.5" fill="#1E1B18" />
            <circle cx="61" cy="71" r="2.5" fill="#FFF" />
            <circle cx="105" cy="71" r="2.5" fill="#FFF" />
            <path d="M 62 102 L 98 99" stroke="#7F1D1D" strokeWidth="3.5" strokeLinecap="round" />
          </>
        )}

        {/* 22. EMBARRASSED */}
        {expr === 'embarrassed' && (
          <>
            <path d="M 46 61 Q 58 55 68 62" fill="none" stroke="#271810" strokeWidth="3" strokeLinecap="round" />
            <path d="M 92 62 Q 102 55 114 61" fill="none" stroke="#271810" strokeWidth="3" strokeLinecap="round" />
            <path d="M 49 73 Q 58 66 67 73" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 93 73 Q 102 66 111 73" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 64 98 Q 80 106 96 98" fill="none" stroke="#7F1D1D" strokeWidth="3.5" strokeLinecap="round" />
          </>
        )}

        {/* 23. GRATEFUL */}
        {expr === 'grateful' && (
          <>
            <path d="M 48 58 Q 58 53 68 58" fill="none" stroke="#271810" strokeWidth="3" strokeLinecap="round" />
            <path d="M 92 58 Q 102 53 112 58" fill="none" stroke="#271810" strokeWidth="3" strokeLinecap="round" />
            <circle cx="58" cy="72" r="7.5" fill="#1E1B18" />
            <circle cx="102" cy="72" r="7.5" fill="#1E1B18" />
            <circle cx="55.5" cy="69.5" r="2.8" fill="#FFF" />
            <circle cx="99.5" cy="69.5" r="2.8" fill="#FFF" />
            <path d="M 58 95 Q 80 110 102 95" fill="none" stroke="#7F1D1D" strokeWidth="3.8" strokeLinecap="round" />
            {/* Hands in Namaste / Thank You */}
            <path d="M 80 122 L 71 144 L 80 148 L 89 144 Z" fill="#E5A97C" stroke="#C67D50" strokeWidth="2" strokeLinejoin="round" />
            <line x1="80" y1="122" x2="80" y2="148" stroke="#B4653A" strokeWidth="1.5" />
          </>
        )}

        {/* 24. HOPEFUL */}
        {expr === 'hopeful' && (
          <>
            <path d="M 47 55 Q 58 49 68 56" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 92 56 Q 102 49 113 55" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="58" cy="71" r="8.5" fill="#1E1B18" />
            <circle cx="102" cy="71" r="8.5" fill="#1E1B18" />
            <circle cx="57" cy="67.5" r="3.2" fill="#FFF" />
            <circle cx="101" cy="67.5" r="3.2" fill="#FFF" />
            <circle cx="61" cy="73" r="1.5" fill="#FFF" />
            <circle cx="105" cy="73" r="1.5" fill="#FFF" />
            <path d="M 62 96 Q 80 108 98 96" fill="none" stroke="#7F1D1D" strokeWidth="3.5" strokeLinecap="round" />
          </>
        )}

        {/* 25. PLAYFUL */}
        {expr === 'playful' && (
          <>
            <path d="M 46 56 Q 58 48 68 56" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 92 56 Q 102 48 114 56" fill="none" stroke="#271810" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="58" cy="72" r="8" fill="#1E1B18" />
            <circle cx="102" cy="72" r="8" fill="#1E1B18" />
            <circle cx="55.5" cy="69.5" r="3" fill="#FFF" />
            <circle cx="99.5" cy="69.5" r="3" fill="#FFF" />
            <path d="M 55 93 Q 80 117 105 93 Z" fill="#991B1B" stroke="#7F1D1D" strokeWidth="2.5" />
            <path d="M 65 94 L 95 94 L 93 99 L 67 99 Z" fill="#FFFFFF" />
          </>
        )}
      </svg>
    </div>
  );
};

export const ToddlerEmotionsSection: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionItem | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Play audio pronunciation & description (no gender labels)
  const speakEmotion = (item: EmotionItem) => {
    playSound('pop');
    setIsPlayingAudio(true);

    const speechText = `${item.name}. ${item.whatItFeelsLike} ${item.parentSupportTip}`;
    speakIndianEnglish(speechText, {
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
      pitch: 1.0,
      rate: 0.88
    });
  };

  const handleSelectEmotion = (item: EmotionItem) => {
    setSelectedEmotion(item);
    speakEmotion(item);
  };

  const handleNext = () => {
    if (!selectedEmotion) return;
    const currentIndex = TODDLER_EMOTIONS.findIndex((e) => e.id === selectedEmotion.id);
    const nextIndex = (currentIndex + 1) % TODDLER_EMOTIONS.length;
    const nextItem = TODDLER_EMOTIONS[nextIndex];
    setSelectedEmotion(nextItem);
    speakEmotion(nextItem);
  };

  const handlePrev = () => {
    if (!selectedEmotion) return;
    const currentIndex = TODDLER_EMOTIONS.findIndex((e) => e.id === selectedEmotion.id);
    const prevIndex = (currentIndex - 1 + TODDLER_EMOTIONS.length) % TODDLER_EMOTIONS.length;
    const prevItem = TODDLER_EMOTIONS[prevIndex];
    setSelectedEmotion(prevItem);
    speakEmotion(prevItem);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 select-none">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-black uppercase tracking-widest">
          <Baby className="w-3.5 h-3.5" />
          <span>My Emotions • Toddler Expressions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
          How Are You Feeling Today?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
          Tap any emotion card to explore facial cues, body language, and practical calming routines.
        </p>
      </div>

      {/* Strictly 2 Emotions in a Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {TODDLER_EMOTIONS.map((item) => {
          const isSelected = selectedEmotion?.id === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => handleSelectEmotion(item)}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={`p-5 rounded-3xl border-2 transition-all flex items-center gap-5 text-left relative overflow-hidden group cursor-pointer shadow-lg bg-[#0b101f]/95 ${item.cardBorder} ${
                isSelected
                  ? 'ring-4 ring-white/40 shadow-2xl scale-102 bg-[#12192e]'
                  : 'hover:bg-[#10172c]'
              }`}
            >
              {/* Left: Expressive Toddler Avatar (No duplicate text on image, no gender label, no smiley badge) */}
              <ToddlerCharacterAvatar item={item} size="sm" />

              {/* Right: Emotion Name (single clean heading, no phonetic duplicate text) & Feeling Description */}
              <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <span className={`font-black text-lg sm:text-xl tracking-wider ${item.headerColor}`}>
                    {item.name}
                  </span>
                  <span className="p-1.5 rounded-full bg-white/10 group-hover:bg-white/20 text-white/80 transition-colors">
                    <Volume2 className="w-4 h-4" />
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                  {item.whatItFeelsLike}
                </p>

                <span className="text-[11px] font-bold text-white/50 group-hover:text-white/80 transition-colors">
                  Tap for Parent Support Tip →
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Emotion Detail Spotlight Modal */}
      <AnimatePresence>
        {selectedEmotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedEmotion(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`max-w-xl w-full rounded-3xl p-6 sm:p-8 border-2 shadow-2xl bg-[#090e1c] relative overflow-hidden text-left ${selectedEmotion.cardBorder}`}
            >
              {/* Top Bar with Name, Audio and Close Button */}
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4 mb-6">
                <div>
                  <h3 className={`text-2xl sm:text-3xl font-black tracking-tight ${selectedEmotion.headerColor}`}>
                    {selectedEmotion.name}
                  </h3>
                  <span className="text-xs text-slate-400">
                    Facial Cues & Regulation Guide
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => speakEmotion(selectedEmotion)}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Speak Emotion"
                  >
                    <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-pulse text-rose-400' : ''}`} />
                  </button>
                  <button
                    onClick={() => setSelectedEmotion(null)}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs font-bold"
                  >
                    ✕ Close
                  </button>
                </div>
              </div>

              {/* Main Content Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                {/* Large Character Avatar */}
                <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <ToddlerCharacterAvatar item={selectedEmotion} size="lg" />
                </div>

                {/* Explanation & Parenting Wisdom */}
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
                    <div className="font-black uppercase text-[10px] tracking-wider text-indigo-300">
                      What Toddlers Feel Inside
                    </div>
                    <p className="text-slate-200 leading-relaxed">
                      {selectedEmotion.whatItFeelsLike}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                    <div className="font-black text-emerald-300 uppercase text-[10px] tracking-wider">
                      Pediatric Support Tip
                    </div>
                    <p className="text-slate-200 leading-relaxed">
                      {selectedEmotion.parentSupportTip}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                    <div className="font-black text-rose-300 uppercase text-[10px] tracking-wider">
                      Try It Together!
                    </div>
                    <p className="text-slate-200 leading-relaxed">
                      {selectedEmotion.funAction}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Navigation Between Flashcards */}
              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-6">
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <span className="text-xs text-slate-400 font-bold">
                  {TODDLER_EMOTIONS.findIndex((e) => e.id === selectedEmotion.id) + 1} of {TODDLER_EMOTIONS.length}
                </span>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
