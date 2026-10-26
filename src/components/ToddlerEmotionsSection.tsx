import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  Sparkles, 
  Heart, 
  RotateCcw, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  Baby
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import { speakIndianEnglish, stopIndianSpeech } from '../lib/indianSpeech';

export type GenderType = 'boy' | 'girl';

export interface EmotionItem {
  id: string;
  name: string;
  pronunciation: string;
  gender: GenderType;
  genderLabel: string;
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
    pronunciation: 'HAP-ee',
    gender: 'boy',
    genderLabel: '👦 Toddler Boy',
    colorName: 'amber',
    cardBorder: 'border-amber-400/50 hover:border-amber-400',
    headerColor: 'text-amber-400',
    badgeBg: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
    whatItFeelsLike: 'Warm, sunny and cheerful inside! Smiling, laughing, and wanting to dance or clap hands.',
    parentSupportTip: 'Celebrate their joy! Sing songs together, clap, and reflect: "You are feeling so happy playing with your blocks!"',
    funAction: 'Raise both arms up in the air and give two big joyful claps!',
    expressionType: 'happy'
  },
  {
    id: 'sad',
    name: 'SAD',
    pronunciation: 'SAD',
    gender: 'girl',
    genderLabel: '👧 Toddler Girl',
    colorName: 'sky',
    cardBorder: 'border-sky-400/50 hover:border-sky-400',
    headerColor: 'text-sky-400',
    badgeBg: 'bg-sky-400/10 text-sky-300 border-sky-400/30',
    whatItFeelsLike: 'Heavy, rainy and teardrops fall. When a favorite toy breaks, someone leaves, or a knee gets bumped.',
    parentSupportTip: 'Offer a safe comforting lap and a gentle hug. Name it: "It is okay to cry. I am right here with you."',
    funAction: 'Wrap your arms around a soft pillow or ask mom or dad for a big warm cuddle.',
    expressionType: 'sad'
  },
  {
    id: 'angry',
    name: 'ANGRY',
    pronunciation: 'ANG-gree',
    gender: 'boy',
    genderLabel: '👦 Toddler Boy',
    colorName: 'red',
    cardBorder: 'border-red-400/50 hover:border-red-400',
    headerColor: 'text-red-400',
    badgeBg: 'bg-red-400/10 text-red-300 border-red-400/30',
    whatItFeelsLike: 'Hot like a volcano, eyebrows pull down tight, fists curl up, and wanting to stomp or yell.',
    parentSupportTip: 'Stay calm and be the anchor. Validate feelings while keeping safety limits: "You are mad that playtime ended. Let us take 3 lion breaths together."',
    funAction: 'Blow out pretend birthday candles: breathe in deep through nose, and gently blow out slowly.',
    expressionType: 'angry'
  },
  {
    id: 'scared',
    name: 'SCARED',
    pronunciation: 'SKAIR-d',
    gender: 'girl',
    genderLabel: '👧 Toddler Girl',
    colorName: 'emerald',
    cardBorder: 'border-emerald-400/50 hover:border-emerald-400',
    headerColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30',
    whatItFeelsLike: 'Tummy flutters, eyes open wide, hands tremble, wanting to hide from loud sounds, thunder, or shadows.',
    parentSupportTip: 'Get down to their eye level, hold hands, and offer reassurance: "You are safe. That was just thunder, and I am holding you."',
    funAction: 'Hold an adult’s hand tight and squeeze three times to feel safe and grounded.',
    expressionType: 'scared'
  },
  {
    id: 'surprised',
    name: 'SURPRISED',
    pronunciation: 'ser-PRYZD',
    gender: 'boy',
    genderLabel: '👦 Toddler Boy',
    colorName: 'orange',
    cardBorder: 'border-orange-400/50 hover:border-orange-400',
    headerColor: 'text-orange-400',
    badgeBg: 'bg-orange-400/10 text-orange-300 border-orange-400/30',
    whatItFeelsLike: 'Whoa! Eyes grow wide like saucers, hands go to cheeks, mouth makes a round "O" shape!',
    parentSupportTip: 'Match their curiosity: "Oh, look what popped out of the box! What a surprise!"',
    funAction: 'Put both hands on your cheeks, open your mouth in an "O", and say "Whoaaaa!"',
    expressionType: 'surprised'
  },
  {
    id: 'shy',
    name: 'SHY',
    pronunciation: 'SHY',
    gender: 'girl',
    genderLabel: '👧 Toddler Girl',
    colorName: 'pink',
    cardBorder: 'border-pink-400/50 hover:border-pink-400',
    headerColor: 'text-pink-400',
    badgeBg: 'bg-pink-400/10 text-pink-300 border-pink-400/30',
    whatItFeelsLike: 'Cheeks feel pink and warm, looking down at shoes, hiding behind mom or dad when meeting someone new.',
    parentSupportTip: 'Never force them to speak or hug strangers. Allow them to observe from the safety of your side at their own pace.',
    funAction: 'Peek out with one eye from behind your fingers, then flash a soft gentle wave.',
    expressionType: 'shy'
  },
  {
    id: 'tired',
    name: 'TIRED',
    pronunciation: 'TY-erd',
    gender: 'boy',
    genderLabel: '👦 Toddler Boy',
    colorName: 'purple',
    cardBorder: 'border-purple-400/50 hover:border-purple-400',
    headerColor: 'text-purple-400',
    badgeBg: 'bg-purple-400/10 text-purple-300 border-purple-400/30',
    whatItFeelsLike: 'Eyes feel heavy and droopy, yawning wide with "Zzz", rubbing eyes, wanting a soft blanket and story.',
    parentSupportTip: 'Begin a calm wind-down routine immediately: dim lights, put screens away, play soft lullabies.',
    funAction: 'Cover your mouth with your hand, let out a sleepy yawn, and rest your head on pretend pillow hands.',
    expressionType: 'tired'
  },
  {
    id: 'excited',
    name: 'EXCITED',
    pronunciation: 'ek-SY-ted',
    gender: 'girl',
    genderLabel: '👧 Toddler Girl',
    colorName: 'yellow',
    cardBorder: 'border-yellow-400/50 hover:border-yellow-400',
    headerColor: 'text-yellow-400',
    badgeBg: 'bg-yellow-400/10 text-yellow-300 border-yellow-400/30',
    whatItFeelsLike: 'Bouncing up and down, sparkling star eyes, can’t sit still because something awesome is happening!',
    parentSupportTip: 'Channel the excitement into active movement: "Let’s do 5 big kangaroo jumps before we get in the car!"',
    funAction: 'Wiggle your fingers fast and do a happy little happy dance on the spot!',
    expressionType: 'excited'
  },
  {
    id: 'confused',
    name: 'CONFUSED',
    pronunciation: 'kuhn-FYOOZD',
    gender: 'boy',
    genderLabel: '👦 Toddler Boy',
    colorName: 'violet',
    cardBorder: 'border-violet-400/50 hover:border-violet-400',
    headerColor: 'text-violet-400',
    badgeBg: 'bg-violet-400/10 text-violet-300 border-violet-400/30',
    whatItFeelsLike: 'Head tilts, one eyebrow goes up, wondering "Huh? Where did the ball go? How does this block fit?"',
    parentSupportTip: 'Break it into small steps and explore together: "Hmm, that piece didn’t fit that way. What happens if we turn it around?"',
    funAction: 'Tap your chin with one finger, tilt your head sideways, and say "Hmmmm?"',
    expressionType: 'confused'
  },
  {
    id: 'proud',
    name: 'PROUD',
    pronunciation: 'PROWD',
    gender: 'boy',
    genderLabel: '👦 Toddler Boy',
    colorName: 'teal',
    cardBorder: 'border-teal-400/50 hover:border-teal-400',
    headerColor: 'text-teal-400',
    badgeBg: 'bg-teal-400/10 text-teal-300 border-teal-400/30',
    whatItFeelsLike: 'Standing tall, hand on chest, feeling like a champ because you tried hard and learned to put your shoes on!',
    parentSupportTip: 'Praise effort and perseverance: "You kept trying until you stacked all 5 blocks! Look at how proud you look!"',
    funAction: 'Put your hand over your heart, stand tall like a tall giraffe, and give a big thumbs-up!',
    expressionType: 'proud'
  },
  {
    id: 'jealous',
    name: 'JEALOUS',
    pronunciation: 'JEL-us',
    gender: 'girl',
    genderLabel: '👧 Toddler Girl',
    colorName: 'lime',
    cardBorder: 'border-lime-400/50 hover:border-lime-400',
    headerColor: 'text-lime-400',
    badgeBg: 'bg-lime-400/10 text-lime-300 border-lime-400/30',
    whatItFeelsLike: 'Arms crossed, pouting sideways when another child is playing with the toy you wanted or holding mommy’s hand.',
    parentSupportTip: 'Acknowledge the wish: "You really want to drive that red car too. When Leo finishes his turn in 2 minutes, you will get it."',
    funAction: 'Practice saying: "May I have a turn after you, please?" with a friendly smile.',
    expressionType: 'jealous'
  },
  {
    id: 'calm',
    name: 'CALM',
    pronunciation: 'KAHM',
    gender: 'girl',
    genderLabel: '👧 Toddler Girl',
    colorName: 'indigo',
    cardBorder: 'border-indigo-400/50 hover:border-indigo-400',
    headerColor: 'text-indigo-400',
    badgeBg: 'bg-indigo-400/10 text-indigo-300 border-indigo-400/30',
    whatItFeelsLike: 'Quiet, smooth like still water, relaxed shoulders, gentle breathing, feeling completely peaceful.',
    parentSupportTip: 'Nurture calm moments: sit together on the rug, listen to quiet instrumental music, or stroke their back.',
    funAction: 'Close your eyes gently, place hands over your tummy, and feel it rise and fall as you breathe.',
    expressionType: 'calm'
  },
  {
    id: 'silly',
    name: 'SILLY',
    pronunciation: 'SIL-ee',
    gender: 'boy',
    genderLabel: '👦 Toddler Boy',
    colorName: 'amber',
    cardBorder: 'border-amber-400/50 hover:border-amber-400',
    headerColor: 'text-amber-400',
    badgeBg: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
    whatItFeelsLike: 'Making funny faces, walking like a penguin, sticking your tongue out, making everyone giggle!',
    parentSupportTip: 'Silliness is how toddlers connect! Laugh with them and make a funny animal sound back.',
    funAction: 'Wink one eye, stick your tongue out sideways, and make a funny bubbling sound with your lips!',
    expressionType: 'silly'
  },
  {
    id: 'nervous',
    name: 'NERVOUS',
    pronunciation: 'NER-vus',
    gender: 'girl',
    genderLabel: '👧 Toddler Girl',
    colorName: 'rose',
    cardBorder: 'border-rose-400/50 hover:border-rose-400',
    headerColor: 'text-rose-400',
    badgeBg: 'bg-rose-400/10 text-rose-300 border-rose-400/30',
    whatItFeelsLike: 'Butterflies flutter in the tummy, biting lip, holding tightly onto parents before entering a new preschool classroom.',
    parentSupportTip: 'Prep them in advance: tell them what will happen step-by-step: "We will walk in, hang your coat on the lion peg, and read a book together."',
    funAction: 'Blow imaginary bubbles out of your hand: blow softly and watch the worry bubble float away.',
    expressionType: 'nervous'
  },
  {
    id: 'bored',
    name: 'BORED',
    pronunciation: 'BORD',
    gender: 'boy',
    genderLabel: '👦 Toddler Boy',
    colorName: 'slate',
    cardBorder: 'border-slate-400/50 hover:border-slate-400',
    headerColor: 'text-slate-300',
    badgeBg: 'bg-slate-400/10 text-slate-300 border-slate-400/30',
    whatItFeelsLike: 'Chin resting on hand, eyes half-closed, sighing "There is nothing to do!" during a long wait or quiet afternoon.',
    parentSupportTip: 'Boredom sparks imagination! Offer open-ended items like an empty cardboard box, wooden spoons, or plastic cups.',
    funAction: 'Look around the room and find 3 things that are colored yellow or round like a ball!',
    expressionType: 'bored'
  },
  {
    id: 'loved',
    name: 'LOVED',
    pronunciation: 'LUVD',
    gender: 'girl',
    genderLabel: '👧 Toddler Girl',
    colorName: 'pink',
    cardBorder: 'border-pink-400/50 hover:border-pink-400',
    headerColor: 'text-pink-400',
    badgeBg: 'bg-pink-400/10 text-pink-300 border-pink-400/30',
    whatItFeelsLike: 'Warm, cozy like wearing fuzzy pajamas, hugging your teddy bear, knowing mommy and daddy love you forever.',
    parentSupportTip: 'Express unconditional love every day: "I love you when you are happy, and I love you when you are sad."',
    funAction: 'Cross both arms across your chest and give yourself a big cozy teddy bear hug!',
    expressionType: 'loved'
  },
  {
    id: 'frustrated',
    name: 'FRUSTRATED',
    pronunciation: 'FRUHS-tray-ted',
    gender: 'boy',
    genderLabel: '👦 Toddler Boy',
    colorName: 'orange',
    cardBorder: 'border-orange-400/50 hover:border-orange-400',
    headerColor: 'text-orange-400',
    badgeBg: 'bg-orange-400/10 text-orange-300 border-orange-400/30',
    whatItFeelsLike: 'Gritting teeth, wanting to throw the puzzle piece because it just won’t fit right now.',
    parentSupportTip: 'Teach the word "help": "You are trying so hard! If it feels tricky, you can say: "Can you help me, please?""',
    funAction: 'Shake your hands out fast like water droplets flying off your fingers, then take a deep breath.',
    expressionType: 'frustrated'
  },
  {
    id: 'curious',
    name: 'CURIOUS',
    pronunciation: 'KYUR-ee-us',
    gender: 'girl',
    genderLabel: '👧 Toddler Girl',
    colorName: 'cyan',
    cardBorder: 'border-cyan-400/50 hover:border-cyan-400',
    headerColor: 'text-cyan-400',
    badgeBg: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/30',
    whatItFeelsLike: 'Peeking into grass to see an ant, asking "Why?" 20 times, wanting to touch, open, and explore everything.',
    parentSupportTip: 'Turn questions into shared discovery: "Look at the ant carrying that crumb! Where do you think his home is?"',
    funAction: 'Make pretend binoculars around your eyes with your fingers and spot something tiny on the floor!',
    expressionType: 'curious'
  },
  {
    id: 'disgusted',
    name: 'DISGUSTED',
    pronunciation: 'dis-GUHS-ted',
    gender: 'boy',
    genderLabel: '👦 Toddler Boy',
    colorName: 'emerald',
    cardBorder: 'border-emerald-400/50 hover:border-emerald-400',
    headerColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30',
    whatItFeelsLike: 'Nose crinkles up, tongue sticks out slightly, saying "Ewww! Yuck!" at a new bitter vegetable or slimy texture.',
    parentSupportTip: 'Never force eating! Respect their sensory boundaries: "You don’t have to eat it. It can just sit on your plate to look at."',
    funAction: 'Crinkle your nose like a bunny and say "No thank you, not for me today!" with polite manners.',
    expressionType: 'disgusted'
  },
  {
    id: 'brave',
    name: 'BRAVE',
    pronunciation: 'BRAYV',
    gender: 'girl',
    genderLabel: '👧 Toddler Girl',
    colorName: 'amber',
    cardBorder: 'border-amber-400/50 hover:border-amber-400',
    headerColor: 'text-amber-400',
    badgeBg: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
    whatItFeelsLike: 'Feeling a little scared inside, but stepping onto the tall playground slide or taking a vaccine pinch anyway!',
    parentSupportTip: 'Remind them bravery isn’t having no fear-it’s trying even when nervous: "You were so brave holding my hand during the doctor checkup!"',
    funAction: 'Put hands on your hips like a superhero and say in a strong voice: "I am strong and brave!"',
    expressionType: 'brave'
  },
  {
    id: 'impatient',
    name: 'IMPATIENT',
    pronunciation: 'im-PAY-shent',
    gender: 'boy',
    genderLabel: '👦 Toddler Boy',
    colorName: 'yellow',
    cardBorder: 'border-yellow-400/50 hover:border-yellow-400',
    headerColor: 'text-yellow-400',
    badgeBg: 'bg-yellow-400/10 text-yellow-300 border-yellow-400/30',
    whatItFeelsLike: 'Tapping feet, jumping up and down, whining "Now! I want it NOW!" while waiting for dinner to warm up.',
    parentSupportTip: 'Use visual timers and songs: "We will sing the ABC song twice, and when we finish, your snack will be ready!"',
    funAction: 'Count slowly on your fingers: 1... 2... 3... 4... 5! Waiting takes practice!',
    expressionType: 'impatient'
  },
  {
    id: 'embarrassed',
    name: 'EMBARRASSED',
    pronunciation: 'em-BAIR-ust',
    gender: 'girl',
    genderLabel: '👧 Toddler Girl',
    colorName: 'rose',
    cardBorder: 'border-rose-400/50 hover:border-rose-400',
    headerColor: 'text-rose-400',
    badgeBg: 'bg-rose-400/10 text-rose-300 border-rose-400/30',
    whatItFeelsLike: 'Cheeks burn hot, covering eyes with both hands when spilling milk or tripping in front of everyone.',
    parentSupportTip: 'Normalize mistakes quickly with a warm smile: "Oops, spills happen to everyone! Let’s get a paper towel and wipe it up together."',
    funAction: 'Peek through your fingers with a gentle giggle and say: "Oops! We can clean that up!"',
    expressionType: 'embarrassed'
  },
  {
    id: 'grateful',
    name: 'GRATEFUL',
    pronunciation: 'GRAYT-ful',
    gender: 'boy',
    genderLabel: '👦 Toddler Boy',
    colorName: 'emerald',
    cardBorder: 'border-emerald-400/50 hover:border-emerald-400',
    headerColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30',
    whatItFeelsLike: 'Warm fuzzy gratitude when someone shares a cookie, helps tie a shoelace, or reads your favorite book.',
    parentSupportTip: 'Model daily gratitude: "Thank you for holding the door for mommy! That was so helpful and kind."',
    funAction: 'Put your hands together in front of your chest and say a sweet, sunny "Thank you!"',
    expressionType: 'grateful'
  },
  {
    id: 'hopeful',
    name: 'HOPEFUL',
    pronunciation: 'HOHP-ful',
    gender: 'girl',
    genderLabel: '👧 Toddler Girl',
    colorName: 'sky',
    cardBorder: 'border-sky-400/50 hover:border-sky-400',
    headerColor: 'text-sky-400',
    badgeBg: 'bg-sky-400/10 text-sky-300 border-sky-400/30',
    whatItFeelsLike: 'Looking out the window wishing for the rain to stop so you can ride your tricycle at the park!',
    parentSupportTip: 'Encourage optimism: "Let’s look at the sky! Even if it rains now, the sun will come back and maybe make a rainbow!"',
    funAction: 'Look up, clasp your hands together under your chin, and make a secret wish on an imaginary star!',
    expressionType: 'hopeful'
  },
  {
    id: 'playful',
    name: 'PLAYFUL',
    pronunciation: 'PLAY-ful',
    gender: 'boy',
    genderLabel: '👦 Toddler Boy',
    colorName: 'violet',
    cardBorder: 'border-violet-400/50 hover:border-violet-400',
    headerColor: 'text-violet-400',
    badgeBg: 'bg-violet-400/10 text-violet-300 border-violet-400/30',
    whatItFeelsLike: 'Ready to zoom like a race car, play tag, hide behind the door for peek-a-boo, and make silly sounds!',
    parentSupportTip: 'Join in their play world for just 10 minutes of uninterrupted floor play-it fills their emotional cup for hours.',
    funAction: 'Cover your face with both hands, wait 2 seconds, then pop hands open and shout "PEEK-A-BOO!"',
    expressionType: 'playful'
  }
];

/**
 * High-Fidelity Toddler Character Avatar Component
 * Accurately models cute toddler boy and toddler girl characters with hairstyles,
 * clothing, and facial expressions matching preschool emotion flashcards.
 */
export const ToddlerCharacterAvatar: React.FC<{
  item: EmotionItem;
  size?: 'sm' | 'md' | 'lg';
}> = ({ item, size = 'md' }) => {
  const isBoy = item.gender === 'boy';
  const expr = item.expressionType;

  // Pixel dimensions based on size
  const svgSize = size === 'sm' ? 120 : size === 'lg' ? 220 : 150;

  return (
    <div className="relative flex items-center justify-center select-none">
      <svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 160 160"
        className="overflow-visible transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          <radialGradient id={`glow-${item.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <filter id={`shadow-${item.id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Soft radial background aura */}
        <circle cx="80" cy="80" r="72" fill={`url(#glow-${item.id})`} />

        {/* --- GIRL BACK HAIR (Pigtails / Ponytails) --- */}
        {!isBoy && (
          <g id="girl-back-hair">
            {expr === 'jealous' ? (
              // Twin high braids/pigtails with red ties
              <>
                <ellipse cx="28" cy="70" rx="14" ry="24" fill="#3b2314" transform="rotate(-15 28 70)" />
                <ellipse cx="132" cy="70" rx="14" ry="24" fill="#3b2314" transform="rotate(15 132 70)" />
                <circle cx="34" cy="55" r="5" fill="#f43f5e" />
                <circle cx="126" cy="55" r="5" fill="#f43f5e" />
              </>
            ) : expr === 'shy' ? (
              // Twin low cute buns/pigtails with pink ribbons
              <>
                <ellipse cx="30" cy="76" rx="15" ry="20" fill="#4a2e1b" transform="rotate(-10 30 76)" />
                <ellipse cx="130" cy="76" rx="15" ry="20" fill="#4a2e1b" transform="rotate(10 130 76)" />
                <circle cx="36" cy="64" r="5" fill="#ec4899" />
                <circle cx="124" cy="64" r="5" fill="#ec4899" />
              </>
            ) : expr === 'scared' ? (
              // Shivering hair with big purple bow
              <>
                <ellipse cx="28" cy="72" rx="15" ry="22" fill="#3b2314" />
                <ellipse cx="132" cy="72" rx="15" ry="22" fill="#3b2314" />
                <path d="M 120 32 L 140 24 L 132 40 Z" fill="#8b5cf6" />
                <path d="M 120 32 L 140 40 L 132 24 Z" fill="#8b5cf6" />
                <circle cx="126" cy="32" r="4" fill="#c084fc" />
              </>
            ) : (
              // Classic soft shoulder-length girl hair
              <>
                <ellipse cx="32" cy="78" rx="14" ry="26" fill="#3b2314" />
                <ellipse cx="128" cy="78" rx="14" ry="26" fill="#3b2314" />
              </>
            )}
          </g>
        )}

        {/* --- TODDLER BODY / SHIRT --- */}
        <g id="toddler-torso">
          {isBoy ? (
            // Boy Shirt
            <>
              <path
                d="M 40 160 Q 44 122 80 122 Q 116 122 120 160 Z"
                fill={
                  expr === 'happy' ? '#22c55e' : // Green
                  expr === 'angry' ? '#ef4444' : // Red
                  expr === 'surprised' ? '#3b82f6' : // Blue
                  expr === 'tired' ? '#6366f1' : // Indigo
                  expr === 'confused' ? '#0ea5e9' : // Cyan
                  expr === 'proud' ? '#16a34a' : // Emerald
                  expr === 'silly' ? '#f59e0b' : // Amber
                  expr === 'bored' ? '#64748b' : // Slate
                  expr === 'frustrated' ? '#f97316' : // Orange
                  expr === 'disgusted' ? '#84cc16' : // Lime
                  expr === 'impatient' ? '#eab308' : // Yellow
                  expr === 'grateful' ? '#10b981' : // Teal
                  '#8b5cf6' // Violet
                }
              />
              {/* Crew neck collar */}
              <path d="M 68 122 Q 80 134 92 122" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          ) : (
            // Girl Top / Dress
            <>
              <path
                d="M 38 160 Q 42 122 80 122 Q 118 122 122 160 Z"
                fill={
                  expr === 'sad' ? '#8b5cf6' : // Purple
                  expr === 'scared' ? '#facc15' : // Yellow
                  expr === 'excited' ? '#fbbf24' : // Amber
                  expr === 'calm' ? '#a855f7' : // Lavender
                  expr === 'shy' ? '#f472b6' : // Pink
                  expr === 'jealous' ? '#ec4899' : // Rose
                  expr === 'nervous' ? '#fb7185' : // Peach
                  expr === 'loved' ? '#f43f5e' : // Crimson Rose
                  expr === 'curious' ? '#06b6d4' : // Cyan
                  expr === 'brave' ? '#ef4444' : // Hero Red
                  expr === 'embarrassed' ? '#fb7185' : // Coral
                  '#38bdf8' // Sky
                }
              />
              {/* Girl collar / white heart emblem */}
              {expr === 'sad' ? (
                // Heart emblem on purple shirt like sample
                <path d="M 80 138 Q 74 130 70 135 Q 66 142 80 152 Q 94 142 90 135 Q 86 130 80 138 Z" fill="#ffffff" />
              ) : expr === 'scared' ? (
                // Peter Pan collar on yellow shirt
                <path d="M 64 122 Q 80 132 96 122" stroke="#ffffff" strokeWidth="4" fill="none" />
              ) : (
                <path d="M 66 122 Q 80 134 94 122" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
              )}
            </>
          )}

          {/* Neck */}
          <rect x="72" y="112" width="16" height="14" fill="#fcd3b2" rx="4" />
        </g>

        {/* --- TODDLER ARMS & HAND GESTURES (Matching Sample) --- */}
        <g id="toddler-arms">
          {expr === 'happy' && (
            // Raised hands celebration
            <>
              <path d="M 46 132 Q 24 100 24 82" stroke="#22c55e" strokeWidth="12" strokeLinecap="round" fill="none" />
              <circle cx="24" cy="80" r="8" fill="#fcd3b2" />
              <path d="M 114 132 Q 136 100 136 82" stroke="#22c55e" strokeWidth="12" strokeLinecap="round" fill="none" />
              <circle cx="136" cy="80" r="8" fill="#fcd3b2" />
            </>
          )}

          {(expr === 'angry' || expr === 'jealous') && (
            // Crossed arms
            <>
              <path 
                d="M 44 142 Q 80 156 116 142" 
                stroke={expr === 'angry' ? '#dc2626' : '#db2777'} 
                strokeWidth="14" 
                strokeLinecap="round" 
                fill="none" 
              />
              <circle cx="56" cy="148" r="7" fill="#fcd3b2" />
              <circle cx="104" cy="148" r="7" fill="#fcd3b2" />
            </>
          )}

          {expr === 'scared' && (
            // Hands to mouth trembling
            <>
              <path d="M 48 140 Q 64 116 72 108" stroke="#eab308" strokeWidth="10" strokeLinecap="round" fill="none" />
              <circle cx="70" cy="106" r="7" fill="#fcd3b2" />
              <path d="M 112 140 Q 96 116 88 108" stroke="#eab308" strokeWidth="10" strokeLinecap="round" fill="none" />
              <circle cx="90" cy="106" r="7" fill="#fcd3b2" />
            </>
          )}

          {expr === 'surprised' && (
            // Hands on cheeks
            <>
              <path d="M 48 138 Q 44 106 52 86" stroke="#2563eb" strokeWidth="10" strokeLinecap="round" fill="none" />
              <circle cx="52" cy="84" r="7" fill="#fcd3b2" />
              <path d="M 112 138 Q 116 106 108 86" stroke="#2563eb" strokeWidth="10" strokeLinecap="round" fill="none" />
              <circle cx="108" cy="84" r="7" fill="#fcd3b2" />
            </>
          )}

          {expr === 'tired' && (
            // Hand over yawning mouth
            <>
              <path d="M 112 140 Q 106 114 92 102" stroke="#4f46e5" strokeWidth="10" strokeLinecap="round" fill="none" />
              <ellipse cx="90" cy="100" rx="8" ry="7" fill="#fcd3b2" />
            </>
          )}

          {expr === 'confused' && (
            // Finger scratching chin
            <>
              <path d="M 112 140 Q 106 116 94 106" stroke="#0284c7" strokeWidth="10" strokeLinecap="round" fill="none" />
              <circle cx="94" cy="104" r="7" fill="#fcd3b2" />
            </>
          )}

          {expr === 'proud' && (
            // Hand on chest
            <>
              <path d="M 112 140 Q 98 128 82 128" stroke="#15803d" strokeWidth="10" strokeLinecap="round" fill="none" />
              <ellipse cx="80" cy="128" rx="8" ry="7" fill="#fcd3b2" />
            </>
          )}

          {expr === 'calm' && (
            // Hands over heart
            <>
              <path d="M 52 140 Q 72 130 80 130" stroke="#9333ea" strokeWidth="8" strokeLinecap="round" fill="none" />
              <path d="M 108 140 Q 88 130 80 130" stroke="#9333ea" strokeWidth="8" strokeLinecap="round" fill="none" />
              <ellipse cx="80" cy="130" rx="9" ry="6" fill="#fcd3b2" />
            </>
          )}

          {expr === 'grateful' && (
            // Prayer thank you hands
            <>
              <path d="M 60 142 Q 74 132 80 126" stroke="#059669" strokeWidth="9" strokeLinecap="round" fill="none" />
              <path d="M 100 142 Q 86 132 80 126" stroke="#059669" strokeWidth="9" strokeLinecap="round" fill="none" />
              <ellipse cx="80" cy="124" rx="6" ry="9" fill="#fcd3b2" />
            </>
          )}

          {expr === 'playful' && (
            // Peek-a-boo hands near eyes
            <>
              <path d="M 48 138 Q 46 96 56 76" stroke="#7c3aed" strokeWidth="10" strokeLinecap="round" fill="none" />
              <circle cx="56" cy="74" r="8" fill="#fcd3b2" />
              <path d="M 112 138 Q 114 96 104 76" stroke="#7c3aed" strokeWidth="10" strokeLinecap="round" fill="none" />
              <circle cx="104" cy="74" r="8" fill="#fcd3b2" />
            </>
          )}
        </g>

        {/* --- TODDLER FACE (Chubby cheeks & soft skin tone) --- */}
        <g id="toddler-head">
          {/* Ears */}
          <circle cx="44" cy="78" r="9" fill="#fcd3b2" />
          <circle cx="44" cy="78" r="5" fill="#f8b688" />
          <circle cx="116" cy="78" r="9" fill="#fcd3b2" />
          <circle cx="116" cy="78" r="5" fill="#f8b688" />

          {/* Chubby Round Face Base */}
          <ellipse cx="80" cy="78" rx="38" ry="40" fill="#fde0c8" />
          {/* Lower cheek curve */}
          <path d="M 44 80 Q 42 108 80 114 Q 118 108 116 80 Z" fill="#fde0c8" />

          {/* Rosy Cheeks */}
          <ellipse cx="56" cy="88" rx="7" ry="5" fill="#fca5a5" opacity="0.65" />
          <ellipse cx="104" cy="88" rx="7" ry="5" fill="#fca5a5" opacity="0.65" />
          {/* Extra blush for shy or embarrassed */}
          {(expr === 'shy' || expr === 'embarrassed') && (
            <>
              <ellipse cx="56" cy="88" rx="10" ry="7" fill="#f43f5e" opacity="0.5" />
              <ellipse cx="104" cy="88" rx="10" ry="7" fill="#f43f5e" opacity="0.5" />
            </>
          )}
        </g>

        {/* --- TODDLER HAIR (Front / Bangs) --- */}
        <g id="toddler-front-hair">
          {isBoy ? (
            // Boy Short Hair / Spikes / Bangs
            <path
              d="M 42 74 Q 38 42 72 36 Q 84 34 100 38 Q 118 44 118 74 Q 110 58 98 62 Q 88 52 74 62 Q 60 52 48 64 Q 44 68 42 74 Z"
              fill="#3a2212"
            />
          ) : (
            // Girl Bangs with headband or clips
            <>
              <path
                d="M 40 76 Q 38 40 74 36 Q 88 34 104 38 Q 120 44 120 76 Q 114 62 102 66 Q 92 56 80 64 Q 68 56 56 64 Q 46 66 40 76 Z"
                fill="#3a2212"
              />
              {/* Girl Headband (Excited) */}
              {expr === 'excited' && (
                <path d="M 42 62 Q 80 42 118 62" stroke="#facc15" strokeWidth="6" fill="none" strokeLinecap="round" />
              )}
              {/* Pink Hair Clips (Shy) */}
              {expr === 'shy' && (
                <>
                  <rect x="48" y="52" width="10" height="4" rx="2" fill="#ec4899" transform="rotate(-15 48 52)" />
                  <rect x="50" y="58" width="10" height="4" rx="2" fill="#ec4899" transform="rotate(-15 50 58)" />
                </>
              )}
            </>
          )}
        </g>

        {/* --- NOSE --- */}
        <circle cx="80" cy="85" r="2.5" fill="#f8a773" />

        {/* --- EYEBROWS & EYES (Emotion Specific Expressions) --- */}
        <g id="toddler-expression">
          {/* 1. HAPPY */}
          {expr === 'happy' && (
            <>
              {/* Curved happy eyebrows */}
              <path d="M 58 66 Q 66 61 74 66" stroke="#3a2212" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 86 66 Q 94 61 102 66" stroke="#3a2212" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Beaming big eyes */}
              <ellipse cx="66" cy="76" rx="5.5" ry="6" fill="#1e293b" />
              <circle cx="68" cy="74" r="2" fill="#ffffff" />
              <ellipse cx="94" cy="76" rx="5.5" ry="6" fill="#1e293b" />
              <circle cx="96" cy="74" r="2" fill="#ffffff" />
              {/* Big cheerful open smile */}
              <path d="M 64 92 Q 80 110 96 92 Z" fill="#ef4444" />
              <path d="M 68 93 Q 80 97 92 93" stroke="#ffffff" strokeWidth="2" fill="none" />
            </>
          )}

          {/* 2. SAD */}
          {expr === 'sad' && (
            <>
              {/* Drooping sad eyebrows slanted down */}
              <path d="M 58 64 Q 66 68 74 69" stroke="#3a2212" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 86 69 Q 94 68 102 64" stroke="#3a2212" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Sad drooping teary eyes */}
              <ellipse cx="66" cy="77" rx="5" ry="5.5" fill="#1e293b" />
              <ellipse cx="94" cy="77" rx="5" ry="5.5" fill="#1e293b" />
              {/* Teardrops flowing down both cheeks! */}
              <path d="M 62 82 Q 58 92 60 96 Q 62 100 65 98 Q 68 94 62 82 Z" fill="#38bdf8" />
              <path d="M 98 82 Q 102 92 100 96 Q 98 100 95 98 Q 92 94 98 82 Z" fill="#38bdf8" />
              {/* Downturned crying mouth */}
              <path d="M 68 98 Q 80 91 92 98" stroke="#881337" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* 3. ANGRY */}
          {expr === 'angry' && (
            <>
              {/* Sharp angry V eyebrows */}
              <path d="M 58 68 L 74 72" stroke="#3a2212" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 102 68 L 86 72" stroke="#3a2212" strokeWidth="3.5" strokeLinecap="round" />
              {/* Glaring focused eyes */}
              <ellipse cx="66" cy="78" rx="5" ry="4.5" fill="#1e293b" />
              <circle cx="68" cy="77" r="1.5" fill="#ffffff" />
              <ellipse cx="94" cy="78" rx="5" ry="4.5" fill="#1e293b" />
              <circle cx="92" cy="77" r="1.5" fill="#ffffff" />
              {/* Frowning angry mouth */}
              <path d="M 68 97 Q 80 90 92 97" stroke="#991b1b" strokeWidth="3" fill="none" strokeLinecap="round" />
              {/* Anger steam sparks on sides */}
              <path d="M 36 60 L 26 56 M 34 68 L 24 72" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 124 60 L 134 56 M 126 68 L 136 72" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}

          {/* 4. SCARED */}
          {expr === 'scared' && (
            <>
              {/* High trembling eyebrows */}
              <path d="M 58 64 Q 66 61 74 65" stroke="#3a2212" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 86 65 Q 94 61 102 64" stroke="#3a2212" strokeWidth="2" fill="none" strokeLinecap="round" />
              {/* Wide frightened eyes with tiny pupils */}
              <circle cx="66" cy="76" r="6" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
              <circle cx="66" cy="76" r="2.5" fill="#1e293b" />
              <circle cx="94" cy="76" r="6" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
              <circle cx="94" cy="76" r="2.5" fill="#1e293b" />
              {/* Trembling wavy mouth */}
              <path d="M 72 96 Q 76 93 80 96 Q 84 99 88 96" stroke="#881337" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Shiver squiggles around head */}
              <path d="M 32 74 Q 28 78 32 82" stroke="#38bdf8" strokeWidth="2" fill="none" />
              <path d="M 128 74 Q 132 78 128 82" stroke="#38bdf8" strokeWidth="2" fill="none" />
            </>
          )}

          {/* 5. SURPRISED */}
          {expr === 'surprised' && (
            <>
              {/* High arched brows */}
              <path d="M 58 61 Q 66 54 74 61" stroke="#3a2212" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 86 61 Q 94 54 102 61" stroke="#3a2212" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Big round circular shocked eyes */}
              <circle cx="66" cy="74" r="7" fill="#1e293b" />
              <circle cx="68" cy="72" r="2.5" fill="#ffffff" />
              <circle cx="94" cy="74" r="7" fill="#1e293b" />
              <circle cx="96" cy="72" r="2.5" fill="#ffffff" />
              {/* Round "O" mouth */}
              <ellipse cx="80" cy="96" rx="6" ry="8" fill="#1e293b" />
              {/* Shock sparkle lines */}
              <path d="M 34 50 L 26 44 M 126 50 L 134 44" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
            </>
          )}

          {/* 6. SHY */}
          {expr === 'shy' && (
            <>
              {/* Gentle bashful brows */}
              <path d="M 58 67 Q 66 65 74 68" stroke="#3a2212" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 86 68 Q 94 65 102 67" stroke="#3a2212" strokeWidth="2" fill="none" strokeLinecap="round" />
              {/* Looking down and sideways */}
              <ellipse cx="64" cy="78" rx="4.5" ry="5" fill="#1e293b" />
              <circle cx="63" cy="76" r="1.5" fill="#ffffff" />
              <ellipse cx="92" cy="78" rx="4.5" ry="5" fill="#1e293b" />
              <circle cx="91" cy="76" r="1.5" fill="#ffffff" />
              {/* Soft bashful little smile */}
              <path d="M 72 93 Q 78 97 86 94" stroke="#be185d" strokeWidth="2" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* 7. TIRED / SLEEPY */}
          {expr === 'tired' && (
            <>
              {/* Droopy sleepy curved eyes */}
              <path d="M 60 76 Q 66 82 72 76" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 88 76 Q 94 82 100 76" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Yawning wide open mouth */}
              <ellipse cx="80" cy="95" rx="8" ry="10" fill="#991b1b" />
              {/* Floating blue Z z z */}
              <text x="116" y="54" fill="#60a5fa" fontSize="16" fontWeight="bold">Z</text>
              <text x="126" y="42" fill="#93c5fd" fontSize="13" fontWeight="bold">z</text>
              <text x="134" y="32" fill="#bfdbfe" fontSize="10" fontWeight="bold">z</text>
            </>
          )}

          {/* 8. EXCITED */}
          {expr === 'excited' && (
            <>
              {/* High cheerful brows */}
              <path d="M 58 64 Q 66 58 74 64" stroke="#3a2212" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 86 64 Q 94 58 102 64" stroke="#3a2212" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Star Eyes! */}
              <g transform="translate(66, 75)">
                <path d="M 0 -6 L 2 -2 L 6 0 L 2 2 L 0 6 L -2 2 L -6 0 L -2 -2 Z" fill="#eab308" />
              </g>
              <g transform="translate(94, 75)">
                <path d="M 0 -6 L 2 -2 L 6 0 L 2 2 L 0 6 L -2 2 L -6 0 L -2 -2 Z" fill="#eab308" />
              </g>
              {/* Beaming open laugh */}
              <path d="M 65 92 Q 80 110 95 92 Z" fill="#ef4444" />
              <path d="M 70 93 Q 80 97 90 93" stroke="#ffffff" strokeWidth="2" fill="none" />
              {/* Star sparkles */}
              <circle cx="28" cy="50" r="3" fill="#facc15" />
              <circle cx="132" cy="50" r="3" fill="#facc15" />
            </>
          )}

          {/* 9. CONFUSED */}
          {expr === 'confused' && (
            <>
              {/* One brow raised, one lowered */}
              <path d="M 58 68 Q 66 70 74 68" stroke="#3a2212" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 86 62 Q 94 54 102 62" stroke="#3a2212" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Puzzled eyes */}
              <ellipse cx="66" cy="76" rx="4.5" ry="5.5" fill="#1e293b" />
              <circle cx="67" cy="75" r="1.5" fill="#ffffff" />
              <circle cx="94" cy="74" r="6" fill="#1e293b" />
              <circle cx="95" cy="73" r="2" fill="#ffffff" />
              {/* Tilted squiggly mouth */}
              <path d="M 70 94 Q 78 98 88 93" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Purple question mark */}
              <text x="114" y="52" fill="#a855f7" fontSize="22" fontWeight="bold">?</text>
            </>
          )}

          {/* 10. PROUD */}
          {expr === 'proud' && (
            <>
              <path d="M 58 64 Q 66 60 74 64" stroke="#3a2212" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 86 64 Q 94 60 102 64" stroke="#3a2212" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Confident eyes */}
              <ellipse cx="66" cy="75" rx="5" ry="5.5" fill="#1e293b" />
              <circle cx="68" cy="73" r="2" fill="#ffffff" />
              <ellipse cx="94" cy="75" rx="5" ry="5.5" fill="#1e293b" />
              <circle cx="96" cy="73" r="2" fill="#ffffff" />
              {/* Confident smile */}
              <path d="M 68 93 Q 80 103 92 93" stroke="#15803d" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* 11. JEALOUS */}
          {expr === 'jealous' && (
            <>
              <path d="M 58 69 L 74 66" stroke="#3a2212" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 86 66 L 102 69" stroke="#3a2212" strokeWidth="2.5" strokeLinecap="round" />
              {/* Eyes glaring to the side */}
              <ellipse cx="63" cy="77" rx="4.5" ry="4.5" fill="#1e293b" />
              <circle cx="61" cy="76" r="1.5" fill="#ffffff" />
              <ellipse cx="91" cy="77" rx="4.5" ry="4.5" fill="#1e293b" />
              <circle cx="89" cy="76" r="1.5" fill="#ffffff" />
              {/* Pouting mouth */}
              <path d="M 70 96 Q 78 92 88 96" stroke="#831843" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* 12. CALM */}
          {expr === 'calm' && (
            <>
              {/* Soft serene brows */}
              <path d="M 58 66 Q 66 63 74 66" stroke="#3a2212" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 86 66 Q 94 63 102 66" stroke="#3a2212" strokeWidth="2" fill="none" strokeLinecap="round" />
              {/* Peaceful closed curved eyes with lashes */}
              <path d="M 60 76 Q 66 82 72 76" stroke="#3a2212" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 88 76 Q 94 82 100 76" stroke="#3a2212" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Peaceful gentle smile */}
              <path d="M 72 94 Q 80 99 88 94" stroke="#7e22ce" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Floating pink peaceful hearts */}
              <path d="M 120 45 Q 116 40 112 43 Q 109 47 120 54 Q 131 47 128 43 Q 124 40 120 45 Z" fill="#ec4899" />
              <path d="M 38 48 Q 35 44 32 46 Q 29 50 38 56 Q 47 50 44 46 Q 41 44 38 48 Z" fill="#ec4899" />
            </>
          )}

          {/* 13. SILLY */}
          {expr === 'silly' && (
            <>
              {/* One winking eye, one open eye */}
              <path d="M 60 76 L 72 76" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
              <circle cx="94" cy="74" r="6" fill="#1e293b" />
              <circle cx="96" cy="72" r="2" fill="#ffffff" />
              {/* Open smile with tongue sticking out */}
              <path d="M 68 92 Q 80 102 92 92" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 76 96 Q 80 108 84 96 Z" fill="#f43f5e" />
            </>
          )}

          {/* 14. NERVOUS */}
          {expr === 'nervous' && (
            <>
              <path d="M 58 66 Q 66 63 74 67" stroke="#3a2212" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 86 67 Q 94 63 102 66" stroke="#3a2212" strokeWidth="2" fill="none" strokeLinecap="round" />
              <ellipse cx="66" cy="76" rx="5" ry="5.5" fill="#1e293b" />
              <ellipse cx="94" cy="76" rx="5" ry="5.5" fill="#1e293b" />
              {/* Sweat drop on brow */}
              <path d="M 104 56 Q 106 60 104 62 Q 102 64 100 62 Q 98 60 104 56 Z" fill="#38bdf8" />
              {/* Biting lip / squiggly mouth */}
              <path d="M 72 95 Q 76 92 80 95 Q 84 98 88 95" stroke="#9f1239" strokeWidth="2" fill="none" />
            </>
          )}

          {/* 15. BORED */}
          {expr === 'bored' && (
            <>
              {/* Flat eyebrows */}
              <line x1="58" y1="67" x2="74" y2="67" stroke="#3a2212" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="86" y1="67" x2="102" y2="67" stroke="#3a2212" strokeWidth="2.5" strokeLinecap="round" />
              {/* Half-closed heavy eyelids */}
              <path d="M 60 76 Q 66 79 72 76" stroke="#1e293b" strokeWidth="2.5" fill="none" />
              <path d="M 88 76 Q 94 79 100 76" stroke="#1e293b" strokeWidth="2.5" fill="none" />
              {/* Straight flat mouth */}
              <line x1="72" y1="95" x2="88" y2="95" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}

          {/* 16. LOVED */}
          {expr === 'loved' && (
            <>
              {/* Heart Eyes */}
              <path d="M 66 75 Q 63 70 60 72 Q 57 76 66 82 Q 75 76 72 72 Q 69 70 66 75 Z" fill="#f43f5e" />
              <path d="M 94 75 Q 91 70 88 72 Q 85 76 94 82 Q 103 76 100 72 Q 97 70 94 75 Z" fill="#f43f5e" />
              {/* Sweet warm smile */}
              <path d="M 70 93 Q 80 102 90 93" stroke="#be123c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* 17. FRUSTRATED */}
          {expr === 'frustrated' && (
            <>
              {/* Tight crinkled eyebrows */}
              <path d="M 58 70 L 74 74" stroke="#3a2212" strokeWidth="3" strokeLinecap="round" />
              <path d="M 102 70 L 86 74" stroke="#3a2212" strokeWidth="3" strokeLinecap="round" />
              {/* Clenched squinting eyes */}
              <path d="M 60 78 L 72 78" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 88 78 L 100 78" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
              {/* Gritted teeth with zigzag mouth */}
              <path d="M 70 95 L 74 92 L 78 96 L 82 92 L 86 96 L 90 93" stroke="#9a3412" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Frustration squiggle scribble cloud */}
              <path d="M 72 40 Q 76 34 82 40 Q 88 34 92 40 Q 86 46 80 44 Z" stroke="#ea580c" strokeWidth="2" fill="none" />
            </>
          )}

          {/* 18. CURIOUS */}
          {expr === 'curious' && (
            <>
              {/* Inquisitive eyebrow */}
              <path d="M 58 66 Q 66 61 74 66" stroke="#3a2212" strokeWidth="2" fill="none" />
              <path d="M 86 62 Q 94 55 102 62" stroke="#3a2212" strokeWidth="2.5" fill="none" />
              {/* Big curious eyes */}
              <circle cx="66" cy="75" r="5" fill="#1e293b" />
              <circle cx="68" cy="73" r="1.5" fill="#ffffff" />
              <circle cx="94" cy="74" r="6" fill="#1e293b" />
              <circle cx="96" cy="72" r="2" fill="#ffffff" />
              {/* Little curious "o" mouth */}
              <ellipse cx="80" cy="94" rx="4" ry="4.5" fill="#0891b2" />
            </>
          )}

          {/* 19. DISGUSTED */}
          {expr === 'disgusted' && (
            <>
              {/* Furrowed brows */}
              <path d="M 58 68 L 72 71" stroke="#3a2212" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 102 68 L 88 71" stroke="#3a2212" strokeWidth="2.5" strokeLinecap="round" />
              {/* Squinted crinkled eyes */}
              <path d="M 62 76 L 70 76" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 90 76 L 98 76" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
              {/* Scrunched nose lines */}
              <path d="M 76 83 L 84 83" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
              {/* Tongue sticking out at yucky food */}
              <path d="M 72 94 Q 80 97 88 94" stroke="#1e293b" strokeWidth="2" fill="none" />
              <path d="M 77 95 Q 80 104 83 95 Z" fill="#84cc16" />
            </>
          )}

          {/* 20. BRAVE */}
          {expr === 'brave' && (
            <>
              {/* Confident angled brows */}
              <path d="M 58 65 L 74 63" stroke="#3a2212" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 102 65 L 86 63" stroke="#3a2212" strokeWidth="2.5" strokeLinecap="round" />
              {/* Determined bright eyes */}
              <ellipse cx="66" cy="74" rx="5.5" ry="6" fill="#1e293b" />
              <circle cx="68" cy="72" r="2" fill="#ffffff" />
              <ellipse cx="94" cy="74" rx="5.5" ry="6" fill="#1e293b" />
              <circle cx="96" cy="72" r="2" fill="#ffffff" />
              {/* Confident strong smile */}
              <path d="M 68 93 Q 80 102 92 93" stroke="#dc2626" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* 21. IMPATIENT */}
          {expr === 'impatient' && (
            <>
              <path d="M 58 68 L 74 65" stroke="#3a2212" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 86 65 L 102 68" stroke="#3a2212" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="66" cy="76" rx="4.5" ry="4.5" fill="#1e293b" />
              <ellipse cx="94" cy="76" rx="4.5" ry="4.5" fill="#1e293b" />
              {/* Pouted tight mouth */}
              <line x1="72" y1="94" x2="88" y2="94" stroke="#854d0e" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}

          {/* 22. EMBARRASSED */}
          {expr === 'embarrassed' && (
            <>
              <path d="M 58 67 Q 66 64 74 67" stroke="#3a2212" strokeWidth="2" fill="none" />
              <path d="M 86 67 Q 94 64 102 67" stroke="#3a2212" strokeWidth="2" fill="none" />
              <ellipse cx="66" cy="77" rx="4.5" ry="5" fill="#1e293b" />
              <circle cx="67" cy="76" r="1.5" fill="#ffffff" />
              <ellipse cx="94" cy="77" rx="4.5" ry="5" fill="#1e293b" />
              <circle cx="95" cy="76" r="1.5" fill="#ffffff" />
              {/* Awkward bashful grin */}
              <path d="M 72 94 Q 80 98 88 94" stroke="#9f1239" strokeWidth="2" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* 23. GRATEFUL */}
          {expr === 'grateful' && (
            <>
              <path d="M 58 66 Q 66 62 74 66" stroke="#3a2212" strokeWidth="2" fill="none" />
              <path d="M 86 66 Q 94 62 102 66" stroke="#3a2212" strokeWidth="2" fill="none" />
              {/* Gentle curved closed eyes */}
              <path d="M 60 76 Q 66 81 72 76" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 88 76 Q 94 81 100 76" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Serene grateful smile */}
              <path d="M 70 93 Q 80 101 90 93" stroke="#047857" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* 24. HOPEFUL */}
          {expr === 'hopeful' && (
            <>
              <path d="M 58 64 Q 66 59 74 64" stroke="#3a2212" strokeWidth="2.5" fill="none" />
              <path d="M 86 64 Q 94 59 102 64" stroke="#3a2212" strokeWidth="2.5" fill="none" />
              {/* Big starry glossy eyes looking up */}
              <circle cx="66" cy="73" r="6" fill="#1e293b" />
              <circle cx="68" cy="71" r="2.5" fill="#ffffff" />
              <circle cx="94" cy="73" r="6" fill="#1e293b" />
              <circle cx="96" cy="71" r="2.5" fill="#ffffff" />
              {/* Sweet expectant smile */}
              <path d="M 71 93 Q 80 100 89 93" stroke="#0284c7" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* 25. PLAYFUL */}
          {expr === 'playful' && (
            <>
              <path d="M 58 64 Q 66 58 74 64" stroke="#3a2212" strokeWidth="2.5" fill="none" />
              <path d="M 86 64 Q 94 58 102 64" stroke="#3a2212" strokeWidth="2.5" fill="none" />
              {/* Winking playful eye */}
              <path d="M 60 75 L 72 75" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
              <circle cx="94" cy="74" r="6" fill="#1e293b" />
              <circle cx="96" cy="72" r="2" fill="#ffffff" />
              {/* Mischievous grin */}
              <path d="M 68 92 Q 80 104 92 92" stroke="#6d28d9" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
};

/**
 * Little circular emotion face badge matching the sample flashcards
 */
const MiniEmotionFaceBadge: React.FC<{ expr: EmotionItem['expressionType'] }> = ({ expr }) => {
  return (
    <div className="w-6 h-6 rounded-full border border-white/20 bg-white/5 flex items-center justify-center">
      <svg width="18" height="18" viewBox="0 0 24 24" className="overflow-visible">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        {expr === 'happy' && (
          <>
            <circle cx="9" cy="10" r="1.2" fill="currentColor" />
            <circle cx="15" cy="10" r="1.2" fill="currentColor" />
            <path d="M 8 14 Q 12 18 16 14" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </>
        )}
        {expr === 'sad' && (
          <>
            <circle cx="9" cy="10" r="1.2" fill="currentColor" />
            <circle cx="15" cy="10" r="1.2" fill="currentColor" />
            <path d="M 8 16 Q 12 12 16 16" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M 16 11 Q 17 14 16 15" stroke="#38bdf8" strokeWidth="1.5" fill="none" />
          </>
        )}
        {expr === 'angry' && (
          <>
            <line x1="7" y1="8" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5" />
            <line x1="17" y1="8" x2="14" y2="10" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="9" cy="11" r="1" fill="currentColor" />
            <circle cx="15" cy="11" r="1" fill="currentColor" />
            <path d="M 8 16 Q 12 13 16 16" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </>
        )}
        {expr === 'scared' && (
          <>
            <circle cx="9" cy="10" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="15" cy="10" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <ellipse cx="12" cy="16" rx="2.5" ry="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </>
        )}
        {expr === 'tired' && (
          <>
            <path d="M 7 10 Q 9 12 11 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M 13 10 Q 15 12 17 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <ellipse cx="12" cy="15" rx="2.5" ry="3" fill="currentColor" />
          </>
        )}
        {expr === 'surprised' && (
          <>
            <circle cx="9" cy="9" r="1.5" fill="currentColor" />
            <circle cx="15" cy="9" r="1.5" fill="currentColor" />
            <ellipse cx="12" cy="15" rx="2.5" ry="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </>
        )}
        {expr !== 'happy' && expr !== 'sad' && expr !== 'angry' && expr !== 'scared' && expr !== 'tired' && expr !== 'surprised' && (
          <>
            <circle cx="9" cy="10" r="1.2" fill="currentColor" />
            <circle cx="15" cy="10" r="1.2" fill="currentColor" />
            <path d="M 8 15 Q 12 18 16 15" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </>
        )}
      </svg>
    </div>
  );
};

export const ToddlerEmotionsSection: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionItem | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Play audio pronunciation & description
  const speakEmotion = (item: EmotionItem) => {
    playSound('pop');
    setIsPlayingAudio(true);

    const speechText = `${item.name}. ${item.genderLabel}. ${item.whatItFeelsLike} ${item.parentSupportTip}`;
    speakIndianEnglish(speechText, {
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
      pitch: 1.0,
      rate: 0.88,
    });
  };

  const handleSelectEmotion = (item: EmotionItem) => {
    setSelectedEmotion(item);
    speakEmotion(item);
  };

  const handleNext = () => {
    if (!selectedEmotion) return;
    const currentIndex = TODDLER_EMOTIONS.findIndex(e => e.id === selectedEmotion.id);
    const nextIndex = (currentIndex + 1) % TODDLER_EMOTIONS.length;
    const nextItem = TODDLER_EMOTIONS[nextIndex];
    setSelectedEmotion(nextItem);
    speakEmotion(nextItem);
  };

  const handlePrev = () => {
    if (!selectedEmotion) return;
    const currentIndex = TODDLER_EMOTIONS.findIndex(e => e.id === selectedEmotion.id);
    const prevIndex = (currentIndex - 1 + TODDLER_EMOTIONS.length) % TODDLER_EMOTIONS.length;
    const prevItem = TODDLER_EMOTIONS[prevIndex];
    setSelectedEmotion(prevItem);
    speakEmotion(prevItem);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 select-none">
      {/* Title Header - Direct and Clean (No category filters!) */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-black uppercase tracking-widest">
          <Baby className="w-3.5 h-3.5" />
          <span>My Emotions • Real Toddler Expressions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
          How Are You Feeling Today?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
          Tap any toddler emotion card to explore facial cues, body language, and practical calming routines.
        </p>
      </div>

      {/* Grid of 25 Toddler Emotion Thumbnails (No filters at top, boy and girl alternating) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
        {TODDLER_EMOTIONS.map((item) => {
          const isSelected = selectedEmotion?.id === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => handleSelectEmotion(item)}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-center justify-between text-center relative overflow-hidden group cursor-pointer shadow-lg bg-[#0b101f]/95 ${item.cardBorder} ${
                isSelected 
                  ? 'ring-4 ring-white/40 shadow-2xl scale-102 bg-[#12192e]' 
                  : 'hover:bg-[#10172c]'
              }`}
            >
              {/* TOP HEADER: Emotion Name in Bold Uppercase */}
              <div className="w-full flex items-center justify-between gap-1 border-b border-white/10 pb-1.5 mb-2">
                <span className={`font-black text-sm sm:text-base tracking-wider ${item.headerColor}`}>
                  {item.name}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {item.pronunciation}
                </span>
              </div>

              {/* CENTER: Toddler Character Avatar */}
              <div className="my-1 py-1">
                <ToddlerCharacterAvatar item={item} size="sm" />
              </div>

              {/* BOTTOM: Gender label & Mini emotion circle badge */}
              <div className="w-full flex items-center justify-between gap-1 pt-2 border-t border-white/10 text-[11px] font-bold text-slate-300">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                  {item.genderLabel}
                </span>
                <div className={item.headerColor}>
                  <MiniEmotionFaceBadge expr={item.expressionType} />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Emotion Detail Spotlight Modal / Drawer */}
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
                  <div className="flex items-center gap-2">
                    <h3 className={`text-2xl sm:text-3xl font-black tracking-tight ${selectedEmotion.headerColor}`}>
                      {selectedEmotion.name}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      /{selectedEmotion.pronunciation}/
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white font-bold">
                      {selectedEmotion.genderLabel}
                    </span>
                    <span className="text-xs text-slate-400">
                      Facial Cues & Regulation Guide
                    </span>
                  </div>
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
                  <div className="flex items-center gap-2 mt-2 text-xs font-bold text-slate-300">
                    <span>Emotion Badge:</span>
                    <div className={selectedEmotion.headerColor}>
                      <MiniEmotionFaceBadge expr={selectedEmotion.expressionType} />
                    </div>
                  </div>
                </div>

                {/* Explanation & Parenting Wisdom */}
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
                    <div className="font-black text-white uppercase text-[10px] tracking-wider text-indigo-300">
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
                  {TODDLER_EMOTIONS.findIndex(e => e.id === selectedEmotion.id) + 1} of {TODDLER_EMOTIONS.length}
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
