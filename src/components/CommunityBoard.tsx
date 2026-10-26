import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useAuth } from '../lib/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Send, Trash2, User, Loader2, Sparkles, 
  Hash, Bold, Italic, List, Smile, Paperclip, Reply, 
  ChevronDown, ChevronUp, Clock, Calendar, Filter
} from 'lucide-react';

interface ReplyData {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: any;
}

interface Post {
  id: string;
  userId: string;
  username: string;
  content: string;
  hashtags: string[];
  attachments: string[];
  createdAt: any;
  replies?: ReplyData[];
}

const DEFAULT_HASHTAGS = [
  '#Education', '#Health', '#Milestones', '#Nutrition', 
  '#Playtime', '#PottyTraining', 
  '#Routine', '#Safety', '#Sleep', '#Tantrums'
];

/**
 * Sanitizes and converts usernames into realistic Indian parent usernames for demo purposes.
 * Ensures a balanced mix of single first names (e.g. Karan, Ravi, Priyanka) and 
 * full first+last names (e.g. Ananya_Sen, Neha_Sharma, Siddharth_Rao), while preserving
 * verified expert designations like DrAnitaPediatric or Nurse_Kavita.
 */
export const cleanParentIndianUsername = (name?: string, idOrHint?: string): string => {
  if (!name) return 'Lashmi';
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();

  // Preserve DrAnitaPediatric or other pediatric healthcare expert handles
  if (lower.includes('dranita') || lower.includes('pediatric')) {
    return 'DrAnitaPediatric';
  }
  if (lower.includes('nursekavita') || lower.includes('nurse')) {
    return 'Nurse_Kavita';
  }
  if (lower.includes('meenakshi') || lower.includes('sleepcare')) {
    return 'DrMeenakshi_SleepCare';
  }

  // Convert "im god", "im_god", "im_god_2014", "imgod"
  if (lower.includes('god')) {
    return 'Ananya_Sen';
  }

  // Convert "guest_auto", "guest_auto_1785204540899", "guest_*"
  if (lower.includes('guest') || lower.includes('auto_')) {
    return 'Neha_Sharma';
  }

  // Convert common test/anonymous accounts
  if (lower.includes('admin') || lower.includes('dummy') || lower.includes('test') || lower.includes('unknown') || lower.includes('user')) {
    return 'Pooja_Sharma';
  }

  // Standardize demo accounts
  if (lower === 'lakshmi') return 'Lashmi';
  if (lower === 'lashmi') return 'Lashmi';

  // Map legacy usernames to Indian parent handles (mix of first name only & first + last name)
  const legacyMap: Record<string, string> = {
    'frugalparent_ananya': 'Ananya_Sen',
    'prelovedmama_ritu': 'Ritu_Verma',
    'ecoparent_karan': 'Karan',
    'worriedmom_neha': 'Neha_Sharma',
    'pottycoachsarah': 'Pooja_Nair',
    'experienceddad_ravi': 'Ravi',
    'playfulmama': 'Priyanka',
    'creativetoddler': 'Deepak_Gupta',
    'creative_toddler': 'Deepak_Gupta',
    'earlyyearscoach': 'Sneha_Kulkarni',
    'craftyparent': 'Vikram',
    'prouddad2024': 'Siddharth_Rao',
    'prouddad': 'Siddharth_Rao',
    'momoftwo': 'Aditi',
    'mamaclara': 'Swati_Reddy',
    'toddlerdad99': 'Rohan',
    'sleepconsultantjess': 'DrMeenakshi_SleepCare',
    'parentpal': 'Arjun_Patel',
    'chefmommy': 'Kavita',
    'healthybites': 'Gaurav_Verma',
    'nutritionistpooja': 'Pooja_Sharma',
    'toddlerkitchen': 'Harish_Mehta',
    'parentinginprogress': 'Divya_Menon',
    'calmmommy': 'Tanvi',
    'gentleparentcoach': 'Suresh_Kulkarni',
    'safetyfirstmom': 'Nidhi_Agarwal',
    'homesafedad': 'Arun_Kumar',
    'fixitpapa': 'Rajesh_Iyer',
    'babyproofpros': 'Amitabh',
    'caringdad': 'Manoj',
    'coolmistmom': 'Shreya_Joshi',
    'earlylearner': 'Radhika_Sen',
    'teachermom': 'Meera',
    'montessoriguide': 'Anand_Deshmukh',
    'sensoryplaylove': 'Preeti',
    'speechgrowth': 'Varun',
    'wordexplosion': 'Aparna_Bhatt',
    'speechtherapistmeera': 'Meera_Patel',
    'storytimedad': 'Nikhil_Rao',
    'concernedparent': 'Pooja',
    'parentsupport_kavita': 'Kavita_Nair',
    'experienceddad_arun': 'Arun_Kumar',
    'pediatricnurse_sneha': 'Nurse_Sneha'
  };

  if (legacyMap[lower]) {
    return legacyMap[lower];
  }

  return trimmed;
};

const SEED_POSTS = [
  {
    id: 'seed-used-toys',
    userId: 'seed_toys_mom',
    username: 'Ananya_Sen',
    content: 'Is there any parent willing to sell or pass on their gently used toddler toys? Looking for pre-loved wooden puzzles, blocks, or ride-ons for our 2-year-old!',
    hashtags: ['#Playtime', '#Safety', '#Routine'],
    createdAt: null,
    replies: [
      {
        id: 'r_toys_1',
        userId: 'seed_toys_ritu',
        username: 'Ritu_Verma',
        content: 'Hi Ananya! Yes, we have a wonderful box of gently used Melissa & Doug wooden shape sorters, peg puzzles, and building blocks that our daughter has outgrown. Everything is complete, clean, and sanitized with baby-safe disinfectant!',
        createdAt: null
      },
      {
        id: 'r_toys_2',
        userId: 'seed_toys_mom',
        username: 'Ananya_Sen',
        content: 'That sounds amazing Ritu! Are all the puzzle pieces intact, and which neighborhood/area are you located in?',
        createdAt: null
      },
      {
        id: 'r_toys_3',
        userId: 'seed_toys_ritu',
        username: 'Ritu_Verma',
        content: 'Yes, all pieces are intact in their original wooden trays! We are in Indiranagar/Koramangala. Happy to pass them along at a nominal price or coordinate a quick local delivery so another toddler enjoys them.',
        createdAt: null
      },
      {
        id: 'r_toys_4',
        userId: 'seed_toys_karan',
        username: 'Karan',
        content: 'Passing down pre-loved toys is so much better for both our wallets and the environment than buying cheap single-use plastic toys! We also have a wooden balance trike ready for its next little driver if you need one.',
        createdAt: null
      },
      {
        id: 'r_toys_5',
        userId: 'seed_toys_mom',
        username: 'Ananya_Sen',
        content: 'Thank you so much Ritu and Karan! This is exactly what we were hoping for. Connecting with you both in private messages right away. Thanks so much for the advice, support, and guidance on pre-loved toys! ❤️🧸',
        createdAt: null
      }
    ]
  },
  {
    id: 'seed-potty-4yo',
    userId: 'seed_potty_mom',
    username: 'Neha_Sharma',
    content: 'My son is 4 yrs old, still not potty trained. Tried all ways.. any suggestions?',
    hashtags: ['#PottyTraining', '#Routine', '#Health'],
    createdAt: null,
    replies: [
      {
        id: 'r_potty_1',
        userId: 'seed_doc_anita',
        username: 'DrAnitaPediatric',
        content: 'Please take a deep breath. At 4 years old, potty resistance is very common and usually linked to fear of pain or feeling pressured. First rule: completely remove all pressure, timers, and scolding for 1-2 weeks so his anxiety settles down.',
        createdAt: null
      },
      {
        id: 'r_potty_2',
        userId: 'seed_potty_mom',
        username: 'Neha_Sharma',
        content: 'Thank you so much Dr. Anita! Yes, we have been taking so much tension and he gets tense whenever we mention the bathroom. How do we restart gently without forcing him?',
        createdAt: null
      },
      {
        id: 'r_potty_3',
        userId: 'seed_coach_sarah',
        username: 'Pooja_Nair',
        content: 'Switch to a small floor potty chair so his feet rest flat on the ground. When toddler feet dangle, their tummy and pelvic muscles cannot relax. Also put 2 squares of toilet paper in the bowl first to stop splashing noise. That splash sound frightens so many 4-year-olds!',
        createdAt: null
      },
      {
        id: 'r_potty_4',
        userId: 'seed_dad_ravi',
        username: 'Ravi',
        content: 'What worked wonders for our 4-year-old was a "Special Potty Basket" with picture books and bubble blowers he was only allowed to touch while sitting on the potty. We did 5-minute relaxed sits 20 minutes after breakfast and dinner.',
        createdAt: null
      },
      {
        id: 'r_potty_5',
        userId: 'seed_potty_mom',
        username: 'Neha_Sharma',
        content: 'This brings tears of relief to my eyes! The floor potty, the splash trick, and the special basket sound so gentle and doable. Thank you all so much for the advice, support, and guidance. Feeling so much more confident today! ❤️',
        createdAt: null
      }
    ]
  },
  {
    id: 'seed-playtime',
    userId: 'seed_1',
    username: 'Priyanka',
    content: 'What are your favorite open-ended play activities for rainy afternoons? Need fun indoor ideas for 2yo!',
    hashtags: ['#Playtime', '#Education'],
    createdAt: null,
    replies: [
      {
        id: 'r1_1',
        userId: 'seed_2',
        username: 'Deepak_Gupta',
        content: 'Sensory bins with dried pasta, rajma, chickpeas, and measuring spoons keep my toddler busy for 45 minutes straight!',
        createdAt: null
      },
      {
        id: 'r1_2',
        userId: 'seed_1',
        username: 'Priyanka',
        content: 'I love that idea! Do you color the pasta or just keep it plain? And what kind of tray do you use to manage the mess?',
        createdAt: null
      },
      {
        id: 'r1_3',
        userId: 'seed_3',
        username: 'Sneha_Kulkarni',
        content: 'Put down a large cotton bedsheet or plastic mat on the living room floor. That way cleanup takes literally 10 seconds. Just fold up the four corners and shake it clean!',
        createdAt: null
      },
      {
        id: 'r1_4',
        userId: 'seed_4',
        username: 'Vikram',
        content: 'Another big hit in our house is sticking masking tape on the floor to make toy car roads, or making a cozy pillow fort with soft lighting.',
        createdAt: null
      },
      {
        id: 'r1_5',
        userId: 'seed_1',
        username: 'Priyanka',
        content: 'The bedsheet cleanup idea is pure genius! Set up the pasta bin and tape roads already. Thanks for the advice, support, and guidance everyone! 🎉',
        createdAt: null
      }
    ]
  },
  {
    id: 'seed-potty',
    userId: 'seed_4',
    username: 'Siddharth_Rao',
    content: 'Potty training milestone today! First time my 24-month-old requested the toilet on her own without prompting!',
    hashtags: ['#PottyTraining', '#Milestones'],
    createdAt: null,
    replies: [
      {
        id: 'r2_1',
        userId: 'seed_5',
        username: 'Sunita_Menon',
        content: 'Hearty congratulations! That first self-initiated trip is a wonderful milestone for the whole family!',
        createdAt: null
      },
      {
        id: 'r2_2',
        userId: 'seed_6',
        username: 'Aditi',
        content: 'What routine did you follow to help her understand the urge? Did you use a sticker chart at home?',
        createdAt: null
      },
      {
        id: 'r2_3',
        userId: 'seed_4',
        username: 'Siddharth_Rao',
        content: 'We went diaper-free for 3 days over the long weekend and watched her cues closely. Every time she sat, we clapped and sang her favorite nursery rhymes.',
        createdAt: null
      },
      {
        id: 'r2_4',
        userId: 'seed_7',
        username: 'DrAnitaPediatric',
        content: 'Consistency and low pressure are key. Keep encouraging every attempt, even false alarms, over the next few weeks.',
        createdAt: null
      },
      {
        id: 'r2_5',
        userId: 'seed_4',
        username: 'Siddharth_Rao',
        content: 'Will definitely keep the cheerful encouragement steady. Thanks for the advice, support, and guidance on this journey!',
        createdAt: null
      }
    ]
  },
  {
    id: 'seed-sleep',
    userId: 'seed_7',
    username: 'Swati_Reddy',
    content: 'Transitioning our 2-year-old from crib to toddler bed without 10 bedtime check-ins! Any advice?',
    hashtags: ['#Sleep', '#Routine'],
    createdAt: null,
    replies: [
      {
        id: 'r3_1',
        userId: 'seed_8',
        username: 'Rohan',
        content: 'We introduced a simple color-changing sleep light. Red means stay in bed to sleep, yellow means quiet morning rest, and green means wake up time!',
        createdAt: null
      },
      {
        id: 'r3_2',
        userId: 'seed_7',
        username: 'Swati_Reddy',
        content: 'Did he get out of bed repeatedly the first few nights? How did you respond when he popped up at the door?',
        createdAt: null
      },
      {
        id: 'r3_3',
        userId: 'seed_9',
        username: 'DrMeenakshi_SleepCare',
        content: 'Use the silent return method: first time say softly "It is sleep time, beta", and after that, quietly hold their hand and walk them back to bed without talking or turning on lights.',
        createdAt: null
      },
      {
        id: 'r3_4',
        userId: 'seed_10',
        username: 'Arjun_Patel',
        content: 'Letting them choose their own cartoon bedsheets during the daytime also gives them pride and comfort in sleeping in their own big bed.',
        createdAt: null
      },
      {
        id: 'r3_5',
        userId: 'seed_7',
        username: 'Swati_Reddy',
        content: 'We followed the gentle silent return with the night light and by night 3 she slept through peacefully. Thanks for the wonderful advice, support, and guidance! 🌙',
        createdAt: null
      }
    ]
  },
  {
    id: 'seed-nutrition',
    userId: 'seed_9',
    username: 'Kavita',
    content: 'My toddler suddenly refuses all green veggies! Any hidden-veggie pancake or smoothie recipes?',
    hashtags: ['#Nutrition', '#Health'],
    createdAt: null,
    replies: [
      {
        id: 'r4_1',
        userId: 'seed_10',
        username: 'Gaurav_Verma',
        content: 'Palak and ripe banana oat pancakes! Blend 1 cup oats, 1 ripe banana, a handful of washed spinach, and a little milk. They turn bright green and taste sweet like banana cake!',
        createdAt: null
      },
      {
        id: 'r4_2',
        userId: 'seed_9',
        username: 'Kavita',
        content: 'Oh that sounds yummy! Can they taste the palak or does the sweet banana mask it completely?',
        createdAt: null
      },
      {
        id: 'r4_3',
        userId: 'seed_11',
        username: 'Pooja_Sharma',
        content: 'The sweet banana completely covers any spinach taste! You can also finely grate peeled lauki (bottle gourd) or zucchini into paratha dough or paneer bhurji. It blends right in.',
        createdAt: null
      },
      {
        id: 'r4_4',
        userId: 'seed_12',
        username: 'Harish_Mehta',
        content: 'We call them "Chhota Bheem Green Pancakes" or "Dino Cakes", and my little one finishes two of them happily without any fuss!',
        createdAt: null
      },
      {
        id: 'r4_5',
        userId: 'seed_9',
        username: 'Kavita',
        content: 'Just made the green pancakes for breakfast and the plate was licked clean! Thanks for the delicious advice, support, and guidance! 🥞',
        createdAt: null
      }
    ]
  },
  {
    id: 'seed-tantrums',
    userId: 'seed_11',
    username: 'Divya_Menon',
    content: 'How do you stay calm when your toddler has a major meltdown at the grocery checkout line?',
    hashtags: ['#Tantrums', '#Routine'],
    createdAt: null,
    replies: [
      {
        id: 'r5_1',
        userId: 'seed_12',
        username: 'DrAnitaPediatric',
        content: 'Take deep breaths! Remember: they are not giving you a hard time, they are having a hard time. First acknowledge their feelings: "You really wanted that candy, it feels hard when mummy says no."',
        createdAt: null
      },
      {
        id: 'r5_2',
        userId: 'seed_11',
        username: 'Divya_Menon',
        content: 'It is the judging stares from onlookers that make me anxious. What do you do when people look at you?',
        createdAt: null
      },
      {
        id: 'r5_3',
        userId: 'seed_13',
        username: 'Tanvi',
        content: 'Look down gently at your child and tune out the surrounding crowd. Any experienced parent looking at you understands completely. You do not owe strangers an explanation.',
        createdAt: null
      },
      {
        id: 'r5_4',
        userId: 'seed_14',
        username: 'Suresh_Kulkarni',
        content: 'Give your child a small store helper job. Ask them to hold the packet of bread or help you spot yellow fruits on the counter.',
        createdAt: null
      },
      {
        id: 'r5_5',
        userId: 'seed_11',
        username: 'Divya_Menon',
        content: 'Gave him the bread packet to carry and stayed completely calm today. It really helped. Thanks for the advice, support, and guidance! ❤️',
        createdAt: null
      }
    ]
  },
  {
    id: 'seed-safety',
    userId: 'seed_13',
    username: 'Nidhi_Agarwal',
    content: 'Childproofing kitchen cabinets and drawers: magnetic locks vs traditional latch straps?',
    hashtags: ['#Safety', '#Routine'],
    createdAt: null,
    replies: [
      {
        id: 'r6_1',
        userId: 'seed_14',
        username: 'Arun_Kumar',
        content: 'Magnetic locks are best! They install inside the cabinets so the kitchen looks neat and tidy, and toddlers cannot pry open the magnetic latch.',
        createdAt: null
      },
      {
        id: 'r6_2',
        userId: 'seed_13',
        username: 'Nidhi_Agarwal',
        content: 'Do you ever misplace the magnetic key? What happens if you cannot open the pantry?',
        createdAt: null
      },
      {
        id: 'r6_3',
        userId: 'seed_15',
        username: 'Rajesh_Iyer',
        content: 'Stick the magnetic key high up on the refrigerator door or above the stove! We keep two keys in the house just in case one gets misplaced.',
        createdAt: null
      },
      {
        id: 'r6_4',
        userId: 'seed_16',
        username: 'Amitabh',
        content: 'Traditional strap latches can pinch tiny fingers when cabinets snap shut. Hidden magnetic locks prevent pinched fingers completely.',
        createdAt: null
      },
      {
        id: 'r6_5',
        userId: 'seed_13',
        username: 'Nidhi_Agarwal',
        content: 'Installed the magnetic kit yesterday with keys safely on top of fridge. The kitchen looks neat and baby is safe. Thanks for the advice, support, and guidance!',
        createdAt: null
      }
    ]
  },
  {
    id: 'seed-health',
    userId: 'seed_15',
    username: 'Manoj',
    content: 'Tips for managing runny noses and congestion during winter colds without tears during nasal suction?',
    hashtags: ['#Health', '#Sleep'],
    createdAt: null,
    replies: [
      {
        id: 'r7_1',
        userId: 'seed_16',
        username: 'DrAnitaPediatric',
        content: 'Turn on the bathroom shower hot and sit together in the steamy bathroom for 10 minutes first. It loosens mucus naturally before saline drops.',
        createdAt: null
      },
      {
        id: 'r7_2',
        userId: 'seed_15',
        username: 'Manoj',
        content: 'Should we do saline spray or drops? He twists his head away whenever he sees the aspirator.',
        createdAt: null
      },
      {
        id: 'r7_3',
        userId: 'seed_17',
        username: 'Nurse_Kavita',
        content: 'Saline mist spray is much gentler than heavy drops. Let him spray a drop on your hand or his favorite teddy bear first so he knows it does not hurt!',
        createdAt: null
      },
      {
        id: 'r7_4',
        userId: 'seed_18',
        username: 'Shreya_Joshi',
        content: 'Also run an ultrasonic cool-mist humidifier right next to the crib and elevate the head end of the crib mattress slightly with a rolled towel under the mattress.',
        createdAt: null
      },
      {
        id: 'r7_5',
        userId: 'seed_15',
        username: 'Manoj',
        content: 'The steam session plus letting him test the spray on teddy worked magic, with no tears tonight! Thanks for the advice, support, and guidance everyone! 🧸',
        createdAt: null
      }
    ]
  },
  {
    id: 'seed-education',
    userId: 'seed_17',
    username: 'Radhika_Sen',
    content: 'What early interactive learning games or alphabet toys do your 18-36 month toddlers love most?',
    hashtags: ['#Education', '#Playtime'],
    createdAt: null,
    replies: [
      {
        id: 'r8_1',
        userId: 'seed_18',
        username: 'Meera',
        content: 'Wooden shape sorters and sound puzzle boards where each wooden animal makes a sound when placed properly are fantastic!',
        createdAt: null
      },
      {
        id: 'r8_2',
        userId: 'seed_17',
        username: 'Radhika_Sen',
        content: 'What about alphabet recognition? Should we start with letter sounds or letter names?',
        createdAt: null
      },
      {
        id: 'r8_3',
        userId: 'seed_19',
        username: 'Anand_Deshmukh',
        content: 'Always start with phonetic sounds (e.g. "mmm" for M rather than "em")! It directly builds pre-reading decoding skills.',
        createdAt: null
      },
      {
        id: 'r8_4',
        userId: 'seed_20',
        username: 'Preeti',
        content: 'Bath foam alphabet letters that stick to wet tile walls make spelling and sounding out words an absolute daily delight.',
        createdAt: null
      },
      {
        id: 'r8_5',
        userId: 'seed_17',
        username: 'Radhika_Sen',
        content: 'Ordered the foam bath letters and started practicing phonics sounds during splash time. Thanks for the advice, support, and guidance! 🛁📚',
        createdAt: null
      }
    ]
  },
  {
    id: 'seed-milestones',
    userId: 'seed_19',
    username: 'Varun',
    content: 'At what month did your toddler start combining 2-3 words into full sentences? Observing big language growth!',
    hashtags: ['#Milestones', '#Education'],
    createdAt: null,
    replies: [
      {
        id: 'r9_1',
        userId: 'seed_20',
        username: 'Aparna_Bhatt',
        content: 'Right around 20 to 22 months for us! Phrases like "More apple please" and "Daddy shoe on" popped up out of nowhere.',
        createdAt: null
      },
      {
        id: 'r9_2',
        userId: 'seed_19',
        username: 'Varun',
        content: 'Did you notice any specific games or books that accelerated the sentence combining?',
        createdAt: null
      },
      {
        id: 'r9_3',
        userId: 'seed_21',
        username: 'Meera_Patel',
        content: 'Yes! The strategy of expansion. When your child says "Car", you respond "Fast blue car!". When they say "Milk", you say "More cold milk!".',
        createdAt: null
      },
      {
        id: 'r9_4',
        userId: 'seed_22',
        username: 'Nikhil_Rao',
        content: 'Reading repetitive rhyme books like "Brown Bear, Brown Bear" or "Goodnight Moon" helped our daughter memorize natural sentence cadence.',
        createdAt: null
      },
      {
        id: 'r9_5',
        userId: 'seed_19',
        username: 'Varun',
        content: 'Expansion has been working like a charm all weekend, and he just said "Big red bus go"! Thanks for the advice, support, and guidance! 🚌✨',
        createdAt: null
      }
    ]
  },
  {
    id: 'seed-trad-food',
    userId: 'seed_23',
    username: 'Priyanka',
    content: 'Struggling with traditional home-cooked khichdi vs store-bought cereals for my 8-month-old. Any thoughts?',
    hashtags: ['#Nutrition', '#Health'],
    createdAt: null,
    replies: [
      { id: 'r10_1', userId: 'seed_24', username: 'Gaurav_Verma', content: 'Khichdi is unbeatable! You can blend it smooth and add a drop of homemade ghee for brain development.', createdAt: null },
      { id: 'r10_2', userId: 'seed_25', username: 'Nurse_Sneha', content: 'Yes, homemade khichdi with seasonal vegetables is far better than processed cereals loaded with sugar and preservatives.', createdAt: null },
      { id: 'r10_3', userId: 'seed_23', username: 'Priyanka', content: 'Thanks! I will try to rotate veggies like lauki, carrot and palak in the khichdi itself.', createdAt: null },
      { id: 'r10_4', userId: 'seed_26', username: 'Harish_Mehta', content: 'Great idea! And add a pinch of cumin and ginger for easy digestion. It makes it tastier too!', createdAt: null },
      { id: 'r10_5', userId: 'seed_27', username: 'Divya_Menon', content: 'We followed the same! Homemade khichdi is the foundation of a healthy Indian palate.', createdAt: null },
      { id: 'r10_6', userId: 'seed_28', username: 'Tanvi', content: 'Absolutely, khichdi is so versatile. You can even add a bit of dal for protein.', createdAt: null }
    ]
  },
  {
    id: 'seed-screen-free',
    userId: 'seed_28',
    username: 'Neha_Sharma',
    content: 'How do you keep screen-free mealtimes engaging for a 3-year-old? He asks for rhymes while eating!',
    hashtags: ['#Routine', '#Playtime'],
    createdAt: null,
    replies: [
      { id: 'r11_1', userId: 'seed_29', username: 'Ananya_Sen', content: 'Involve him in meal preparation! Even simple tasks like washing veggies or setting his own small plate help.', createdAt: null },
      { id: 'r11_2', userId: 'seed_30', username: 'Arun_Kumar', content: 'Talk about colors of the food. "Look, the carrot is orange today!" or make small shapes with roti.', createdAt: null },
      { id: 'r11_3', userId: 'seed_28', username: 'Neha_Sharma', content: 'Tried the color game today, it actually worked! He was busy counting orange slices.', createdAt: null },
      { id: 'r11_4', userId: 'seed_31', username: 'Pooja_Sharma', content: 'Stories! We invent short stories about how the food items had a long journey to reach our table.', createdAt: null },
      { id: 'r11_5', userId: 'seed_32', username: 'Siddharth_Rao', content: 'And sit with them to eat. Role modeling screen-free eating is the most effective approach.', createdAt: null },
      { id: 'r11_6', userId: 'seed_33', username: 'Aditi', content: 'Exactly! Making mealtimes a family conversation time, not just about the child.', createdAt: null }
    ]
  },
  {
    id: 'seed-unsolicited',
    userId: 'seed_33',
    username: 'Sneha_Kulkarni',
    content: 'How to gracefully handle unsolicited advice from grandparents about our parenting choices?',
    hashtags: ['#Safety', '#Routine'],
    createdAt: null,
    replies: [
      { id: 'r12_1', userId: 'seed_34', username: 'Tanvi', content: 'A simple "Thank you for the suggestion, we will discuss it and decide what works for our baby" usually works.', createdAt: null },
      { id: 'r12_2', userId: 'seed_35', username: 'Rohan', content: 'Focus on your baby. Tell them you respect their experience but this approach is what our pediatrician suggested.', createdAt: null },
      { id: 'r12_3', userId: 'seed_33', username: 'Sneha_Kulkarni', content: 'That sounds firm yet respectful. I will try the pediatrician approach next time!', createdAt: null },
      { id: 'r12_4', userId: 'seed_36', username: 'Ritu_Verma', content: 'They only mean well, but it is your home and your rules. Keep it light, thank them, and continue doing what is right.', createdAt: null },
      { id: 'r12_5', userId: 'seed_37', username: 'Aditi', content: 'Stay united as parents in front of family, it makes it easier to maintain your boundaries.', createdAt: null },
      { id: 'r12_6', userId: 'seed_38', username: 'Meera_Patel', content: 'It takes time, but consistent boundary setting helps them understand your style.', createdAt: null }
    ]
  }
];

export const CommunityBoard: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<{ [postId: string]: string }>({});
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [allHashtags, setAllHashtags] = useState<string[]>([]);
  
  const currentAuthorName = cleanParentIndianUsername(profile?.parentName || profile?.name || profile?.firstName || localStorage.getItem('parent_name') || 'Lashmi');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const postsData = await Promise.all(snapshot.docs.map(async (pDoc) => {
        const data = pDoc.data();
        const postUsername = cleanParentIndianUsername(data.username, pDoc.id);
        // Fetch replies for each post
        const repliesSnapshot = await getDocs(query(collection(db, `posts/${pDoc.id}/replies`), orderBy('createdAt', 'asc')));
        const replies = repliesSnapshot.docs.map(rDoc => {
          const rData = rDoc.data();
          return {
            id: rDoc.id,
            ...rData,
            username: cleanParentIndianUsername(rData.username, rDoc.id)
          };
        }) as ReplyData[];

        return {
          id: pDoc.id,
          ...data,
          username: postUsername,
          replies
        } as Post;
      }));

      setPosts(postsData);
      setFetching(false);

      // Extract all unique hashtags
      const tags = new Set<string>(DEFAULT_HASHTAGS);
      postsData.forEach(p => p.hashtags?.forEach(t => {
        let tag = t;
        if (tag === '#Play') tag = '#Playtime';
        if (tag === '#Potty') tag = '#PottyTraining';
        tags.add(tag);
      }));
      setAllHashtags(Array.from(tags).sort());
    }, (err) => {
      console.warn("Firestore snapshot error, using default conversations:", err);
      setFetching(false);
      setAllHashtags(DEFAULT_HASHTAGS);
    });
    return () => unsubscribe();
  }, []);

  const generateHashtags = (text: string): string[] => {
    const keywords: { [key: string]: string[] } = {
      '#Sleep': ['sleep', 'nap', 'bedtime', 'night', 'wake'],
      '#Nutrition': ['eat', 'food', 'meal', 'vegetable', 'picky', 'hunger', 'nutrition'],
      '#Tantrums': ['tantrum', 'cry', 'scream', 'angry', 'emotion', 'hit', 'bite', 'meltdown'],
      '#PottyTraining': ['potty', 'toilet', 'diaper', 'pee', 'poop', 'training'],
      '#Playtime': ['play', 'playtime', 'toy', 'game', 'sensory', 'blocks', 'park'],
      '#Safety': ['safe', 'danger', 'hurt', 'protect', 'childproof'],
      '#Health': ['sick', 'fever', 'doctor', 'cough', 'cold', 'health'],
      '#Education': ['read', 'book', 'learn', 'alphabet', 'count', 'words', 'education'],
      '#Milestones': ['milestone', 'talk', 'walk', 'words', 'speak'],
      '#Routine': ['routine', 'schedule', 'morning', 'evening', 'bath']
    };

    const foundTags = new Set<string>();
    const lowerText = text.toLowerCase();
    
    Object.entries(keywords).forEach(([tag, words]) => {
      if (words.some(word => lowerText.includes(word))) {
        foundTags.add(tag);
      }
    });

    // Also extract any words the user explicitly marked with #
    const userTags = text.match(/#\w+/g);
    if (userTags) userTags.forEach(t => foundTags.add(t));

    return Array.from(foundTags).slice(0, 3); // Max 3 tags
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !user) return;

    setLoading(true);
    try {
      const hashtags = generateHashtags(newPost);
      const authorToSave = cleanParentIndianUsername(currentAuthorName);
      await addDoc(collection(db, 'posts'), {
        userId: user.uid,
        username: authorToSave,
        content: newPost,
        hashtags,
        attachments: [],
        createdAt: serverTimestamp()
      });
      setNewPost('');
    } catch (error) {
      console.error("Error adding post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (postId: string) => {
    const text = replyText[postId];
    if (!text?.trim() || !user) return;

    try {
      const authorToSave = cleanParentIndianUsername(currentAuthorName);
      if (!postId.startsWith('seed-')) {
        await addDoc(collection(db, `posts/${postId}/replies`), {
          userId: user.uid,
          username: authorToSave,
          content: text,
          createdAt: serverTimestamp()
        });
      }
      // Update local state for immediate feedback
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const newReply: ReplyData = {
            id: `reply_${Date.now()}`,
            userId: user.uid,
            username: authorToSave,
            content: text,
            createdAt: null
          };
          return {
            ...p,
            replies: [...(p.replies || []), newReply]
          };
        }
        return p;
      }));
      setReplyText(prev => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      if (!postId.startsWith('seed-')) {
        await deleteDoc(doc(db, 'posts', postId));
      }
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const insertFormat = (format: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = newPost;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const selection = text.substring(start, end);

    let newText = text;
    if (format === 'bold') newText = `${before}**${selection}**${after}`;
    if (format === 'italic') newText = `${before}_${selection}_${after}`;
    if (format === 'bullet') newText = `${before}\n• ${selection}${after}`;
    
    setNewPost(newText);
  };

  const displayPosts = React.useMemo(() => {
    const existingIds = new Set(posts.map(p => p.id));
    
    // Intelligent topic matching so conversations are strictly relevant to the post topic
    const findMatchingSeedOrReplies = (p: Post): ReplyData[] => {
      // 1. Direct match by ID or title snippet
      const direct = SEED_POSTS.find(s => s.id === p.id || p.content.toLowerCase().includes(s.content.toLowerCase().slice(0, 25)));
      if (direct) return direct.replies;

      const lower = (p.content || '').toLowerCase();

      // 2. Used toys / pre-loved gear / swapping / buying / selling toys
      if (
        lower.includes('toy') || 
        lower.includes('puzzle') || 
        lower.includes('used') || 
        lower.includes('swap') || 
        lower.includes('sell') || 
        lower.includes('pre-loved') || 
        lower.includes('preloved') || 
        lower.includes('pass on') || 
        lower.includes('ride-on') ||
        lower.includes('blocks')
      ) {
        const toySeed = SEED_POSTS.find(s => s.id === 'seed-used-toys');
        if (toySeed) return toySeed.replies;
      }

      // 3. Potty training
      if (lower.includes('potty') || lower.includes('toilet') || lower.includes('pee') || lower.includes('poop') || lower.includes('diaper')) {
        const pottySeed = SEED_POSTS.find(s => s.id === 'seed-potty-4yo') || SEED_POSTS.find(s => s.id === 'seed-potty');
        if (pottySeed) return pottySeed.replies;
      }

      // 4. Sleep & bedtime
      if (lower.includes('sleep') || lower.includes('bed') || lower.includes('crib') || lower.includes('night') || lower.includes('wake') || lower.includes('nap') || lower.includes('bedtime')) {
        const sleepSeed = SEED_POSTS.find(s => s.id === 'seed-sleep');
        if (sleepSeed) return sleepSeed.replies;
      }

      // 5. Nutrition & picky eating
      if (lower.includes('eat') || lower.includes('food') || lower.includes('veggie') || lower.includes('pancake') || lower.includes('smoothie') || lower.includes('milk') || lower.includes('picky') || lower.includes('nutrition') || lower.includes('diet')) {
        const nutritionSeed = SEED_POSTS.find(s => s.id === 'seed-nutrition');
        if (nutritionSeed) return nutritionSeed.replies;
      }

      // 6. Tantrums & behavior
      if (lower.includes('tantrum') || lower.includes('meltdown') || lower.includes('cry') || lower.includes('screaming') || lower.includes('angry') || lower.includes('hit') || lower.includes('checkout') || lower.includes('temper')) {
        const tantrumSeed = SEED_POSTS.find(s => s.id === 'seed-tantrums');
        if (tantrumSeed) return tantrumSeed.replies;
      }

      // 7. Safety & childproofing
      if (lower.includes('safe') || lower.includes('childproof') || lower.includes('cabinet') || lower.includes('drawer') || lower.includes('lock') || lower.includes('latch') || lower.includes('gate') || lower.includes('sharp')) {
        const safetySeed = SEED_POSTS.find(s => s.id === 'seed-safety');
        if (safetySeed) return safetySeed.replies;
      }

      // 8. Health & colds
      if (lower.includes('sick') || lower.includes('cold') || lower.includes('cough') || lower.includes('fever') || lower.includes('nose') || lower.includes('congestion') || lower.includes('health') || lower.includes('saline') || lower.includes('suction')) {
        const healthSeed = SEED_POSTS.find(s => s.id === 'seed-health');
        if (healthSeed) return healthSeed.replies;
      }

      // 9. Early education & phonics
      if (lower.includes('learn') || lower.includes('alphabet') || lower.includes('reading') || lower.includes('book') || lower.includes('abc') || lower.includes('phonic') || lower.includes('sorter') || lower.includes('montessori')) {
        const eduSeed = SEED_POSTS.find(s => s.id === 'seed-education');
        if (eduSeed) return eduSeed.replies;
      }

      // 10. Speech & words
      if (lower.includes('speech') || lower.includes('word') || lower.includes('sentence') || lower.includes('talk') || lower.includes('language') || lower.includes('milestone') || lower.includes('speak')) {
        const milestoneSeed = SEED_POSTS.find(s => s.id === 'seed-milestones');
        if (milestoneSeed) return milestoneSeed.replies;
      }

      // 11. Rainy day indoor play
      if (lower.includes('rain') || lower.includes('indoor') || lower.includes('sensory') || lower.includes('playtime') || lower.includes('afternoon')) {
        const playSeed = SEED_POSTS.find(s => s.id === 'seed-playtime');
        if (playSeed) return playSeed.replies;
      }

      // 12. Contextual fallback (Empathetic Indian parent & pediatric guidance)
      const parentName = cleanParentIndianUsername(p.username) || 'Pooja';
      return [
        {
          id: `cr_1_${p.id}`,
          userId: 'seed_care_coach',
          username: 'Kavita_Nair',
          content: 'Thank you for raising this! Many parents in our community have navigated this exact stage with their toddlers. You are doing a wonderful job.',
          createdAt: null
        },
        {
          id: `cr_2_${p.id}`,
          userId: 'seed_user',
          username: parentName,
          content: 'Thank you Kavita! It brings so much relief to know we are not alone. Did anything in particular help make this transition smoother for your child?',
          createdAt: null
        },
        {
          id: `cr_3_${p.id}`,
          userId: 'seed_experienced_dad',
          username: 'Arun_Kumar',
          content: 'Taking small, unhurried steps and keeping a predictable daily routine worked best for us. Toddlers feel most secure when we stay calm and consistent.',
          createdAt: null
        },
        {
          id: `cr_4_${p.id}`,
          userId: 'seed_pediatric_nurse',
          username: 'Nurse_Sneha',
          content: 'Completely agree with Arun. Patience and gentle positive reinforcement work wonders. Give it a few days of steady reassurance without pressure.',
          createdAt: null
        },
        {
          id: `cr_5_${p.id}`,
          userId: 'seed_user',
          username: parentName,
          content: 'Taking notes on this gentle, consistent approach. Thank you so much for the advice, support, and guidance on this! Feeling much more confident now! ❤️',
          createdAt: null
        }
      ];
    };

    // Ensure all posts have appropriate, topic-matched conversations with Indian parent handles
    const enrichedPosts = posts.map(p => {
      const sanitizedUsername = cleanParentIndianUsername(p.username, p.id);
      const existingReplies = (p.replies || []).map(r => ({
        ...r,
        username: cleanParentIndianUsername(r.username, r.id)
      }));
      if (existingReplies.length < 5) {
        const matchedReplies = findMatchingSeedOrReplies(p);
        return {
          ...p,
          username: sanitizedUsername,
          replies: [
            ...existingReplies,
            ...matchedReplies.slice(existingReplies.length).map(r => ({
              ...r,
              username: cleanParentIndianUsername(r.username, r.id)
            }))
          ]
        };
      }
      return {
        ...p,
        username: sanitizedUsername,
        replies: existingReplies
      };
    });

    const combined: Post[] = [...enrichedPosts];
    
    SEED_POSTS.forEach(seed => {
      if (!existingIds.has(seed.id)) {
        combined.push(seed as Post);
      }
    });

    return combined;
  }, [posts]);

  const filteredPosts = React.useMemo(() => {
    if (!selectedHashtag) return displayPosts;
    const cleanSelected = selectedHashtag.toLowerCase().replace('#', '').trim();
    
    return displayPosts.filter(p => {
      if (!p.hashtags || p.hashtags.length === 0) return false;
      return p.hashtags.some(h => {
        const cleanTag = h.toLowerCase().replace('#', '').trim();
        return cleanTag === cleanSelected || cleanTag.includes(cleanSelected) || cleanSelected.includes(cleanTag);
      });
    });
  }, [displayPosts, selectedHashtag]);

  return (
    <div className="w-full space-y-6">
      {/* Header and Intro Section */}
      <header className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Welcome to the Parent Circle</h1>
        <p className="text-xl text-white/70">A safe space to ask questions, share wins, and learn from other parents.</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <input
            type="text"
            placeholder="Search tips on sleep, potty training, or food..."
            className="w-full sm:w-96 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cheerful-green"
          />
          <button onClick={() => navigate('/community-guidelines')} className="px-6 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all">
            Read Community Guidelines
          </button>
        </div>
      </header>

      {/* Top Row: Topics and AI Auto-Tagging */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        {/* Topics Filter */}
        <div className="md:col-span-8 lg:col-span-9 glass-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-cheerful-green">
              <Filter className="w-4 h-4 shrink-0" />
              <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider">Topics</h3>
            </div>
            {selectedHashtag && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50">
                  Filtering by <span className="text-cheerful-green font-semibold">{selectedHashtag}</span>
                </span>
                <button
                  onClick={() => setSelectedHashtag(null)}
                  className="text-[11px] text-white/40 hover:text-white underline cursor-pointer"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedHashtag(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                !selectedHashtag
                  ? 'bg-cheerful-green text-black shadow-lg shadow-cheerful-green/20 font-bold'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              All
            </button>
            {allHashtags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedHashtag(tag === selectedHashtag ? null : tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  tag === selectedHashtag
                    ? 'bg-cheerful-green text-black shadow-lg shadow-cheerful-green/20 font-bold'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* AI Auto-Tagging card */}
        <div className="md:col-span-4 lg:col-span-3 glass-card p-5 bg-cheerful-green/5 border-cheerful-green/10 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2 text-cheerful-green">
            <Sparkles className="w-4 h-4 shrink-0" />
            <h3 className="font-semibold text-xs sm:text-sm">AI Auto-Tagging</h3>
          </div>
          <p className="text-xs text-white/50 leading-relaxed">
            Our AI analyzes your posts to suggest relevant topics automatically.
          </p>
        </div>
      </div>

      {/* Main Content Area - Full width Ask for Advice text box and Conversations below */}
      <div className="w-full space-y-6">
        {/* Full Page Ask for Advice Box */}
        <div className="glass-card p-6 overflow-visible w-full">
          <form onSubmit={handlePostSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // Enter / Shift+Enter for line break, never submit or select button
                    e.stopPropagation();
                  }
                }}
                placeholder="Ask for advice or share a win... (AI will auto-tag your post! Press Enter for line break)"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all min-h-[120px] resize-y leading-relaxed"
              />
              
              {/* Formatting Toolbar */}
              {!user && (
                <div className="text-amber-400 text-xs font-bold p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 mb-2">
                  Please create an account to post or reply to parents.
                </div>
              )}
              <div className="flex items-center gap-1 mt-2 px-2 pb-2">
                <button type="button" onClick={() => insertFormat('bold')} className="p-1.5 hover:bg-white/5 rounded text-white/40 hover:text-white" title="Bold">
                  <Bold className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => insertFormat('italic')} className="p-1.5 hover:bg-white/5 rounded text-white/40 hover:text-white" title="Italic">
                  <Italic className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => insertFormat('bullet')} className="p-1.5 hover:bg-white/5 rounded text-white/40 hover:text-white" title="Bullet List">
                  <List className="w-4 h-4" />
                </button>
                <label className="p-1.5 hover:bg-white/5 rounded text-white/40 hover:text-white cursor-pointer" title="Upload Image/File">
                  <Paperclip className="w-4 h-4" />
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      // Logic to be implemented
                    }
                  }} />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-white/40 font-medium">
                Press <strong>Enter</strong> for line break • Click <strong>Post</strong> to submit
              </span>
              <button
                type="button"
                onClick={handlePostSubmit}
                disabled={loading || !newPost.trim()}
                className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-6 py-2 font-semibold transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Post
              </button>
            </div>
          </form>
        </div>

        {/* Full Page Conversations / Posts List */}
        <div className="space-y-4 w-full">
          {fetching ? (
            <div className="flex items-center justify-center py-12 text-white/20">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12 glass-card">
              <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <p className="text-white/30">
                {selectedHashtag ? `No posts found for ${selectedHashtag}` : 'No posts yet. Be the first to share!'}
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 font-bold">
                          {cleanParentIndianUsername(post.username, post.id).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">@{cleanParentIndianUsername(post.username, post.id)}</h4>
                          <span className="text-[10px] text-white/30 uppercase tracking-wider">{post.createdAt?.toDate().toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {post.hashtags?.map(tag => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300 font-medium border border-indigo-500/20">
                            {tag}
                          </span>
                        ))}
                        {user?.uid === post.userId && (
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-1.5 text-white/10 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5 ml-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-white/70 leading-relaxed font-sans prose prose-invert prose-sm max-w-none">
                      {post.content.split('\n').map((line, i) => (
                        <p key={i} className="mb-2">{line}</p>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
                      <button
                        onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                        className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <Reply className="w-4 h-4" />
                        <span>{post.replies?.length || 0} Replies</span>
                        {expandedPost === post.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedPost === post.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-white/[0.01] border-t border-white/5"
                      >
                        <div className="p-6 space-y-4">
                          {/* List of Replies */}
                          <div className="space-y-4">
                            {post.replies?.map((reply) => (
                              <div key={reply.id} className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20 flex-shrink-0 text-sm font-bold">
                                  {cleanParentIndianUsername(reply.username, reply.id).charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 bg-white/[0.02] rounded-xl p-3 border border-white/5">
                                  <div className="flex justify-between mb-1">
                                    <span className="text-xs font-semibold text-white/40">@{cleanParentIndianUsername(reply.username, reply.id)}</span>
                                    <span className="text-[10px] text-white/20">
                                      {reply.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <p className="text-sm text-white/70 font-sans">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Reply Form */}
                          <div className="pt-4 flex items-end gap-2">
                            <textarea
                              rows={1}
                              value={replyText[post.id] || ''}
                              onChange={(e) => setReplyText({ ...replyText, [post.id]: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  // Enter / Shift+Enter for line break, never submit or select button
                                  e.stopPropagation();
                                }
                              }}
                              placeholder="Type a helpful reply... (Enter for line break)"
                              className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-y min-h-[42px] leading-relaxed"
                            />
                            <button
                              type="button"
                              onClick={() => handleReplySubmit(post.id)}
                              disabled={!replyText[post.id]?.trim()}
                              className="px-4 py-2.5 bg-indigo-500 rounded-xl text-white text-sm font-semibold hover:bg-indigo-600 disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-indigo-500/20 shrink-0 cursor-pointer"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};
