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
  imageUrl: string;
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
    imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1533518463841-d62e1fc91373?auto=format&fit=crop&w=400&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=400&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=400&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=400&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1491013516836-7db643ee125a?auto=format&fit=crop&w=400&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=400&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=400&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=400&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=400&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=400&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=400&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1491013516836-7db643ee125a?auto=format&fit=crop&w=400&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=400&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80',
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
 * Real Baby Emotion Thumbnail Component
 * Displays authentic photography of real babies expressing emotions (smiling, crying, surprised, pouting, etc.)
 */
export const ToddlerCharacterAvatar: React.FC<{
  item: EmotionItem;
  size?: "sm" | "md" | "lg";
}> = ({ item, size = "md" }) => {
  const sizeClasses = {
    sm: "w-24 h-24 sm:w-28 sm:h-28",
    md: "w-36 h-36 sm:w-40 sm:h-40",
    lg: "w-48 h-48 sm:w-56 sm:h-56"
  }[size];

  return (
    <div className={`relative ${sizeClasses} rounded-2xl overflow-hidden border-2 ${item.cardBorder} shadow-lg bg-slate-900 group flex items-center justify-center`}>
      <img
        src={item.imageUrl}
        alt={`${item.name} real baby expression`}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="eager"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80';
        }}
      />
      <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-xs text-[10px] font-bold text-white shadow flex items-center gap-1">
        <span>{item.gender === "boy" ? "👦" : "👧"}</span>
        <span>{item.name}</span>
      </div>
    </div>
  );
}

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
