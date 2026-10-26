export interface RoutineItem {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  colorClass: string;
  glowClass: string;
  indicatorColor: string;
  whoReference: string;
}

export interface AgeGroupData {
  id: string;
  label: string;
  emoji: string;
  rangeDesc: string;
  whoAesthetic: string;
  morning: RoutineItem[];
  evening: RoutineItem[];
  bedtime: RoutineItem[];
}

export const AGE_GROUPS: AgeGroupData[] = [
  // ==========================================
  // 1. 0 - 6 MONTHS (24 Routines)
  // ==========================================
  {
    id: '0_6m',
    label: '0 - 6 Months',
    emoji: '🍼',
    rangeDesc: 'Establishing rhythm & sleep-wake windows of 60 to 90 minutes.',
    whoAesthetic: 'Ideal for early sensory stimulation, neck development, and safe sleep.',
    morning: [
      {
        id: '0_6_m_feed',
        name: 'Gentle Awakening & First Feed',
        emoji: '🍼',
        desc: 'Begin with morning breastmilk or formula in a peaceful, quiet, light-filled room.',
        colorClass: 'from-amber-400/10 to-amber-400/5 border-amber-400/20 text-amber-300',
        glowClass: 'shadow-amber-400/10',
        indicatorColor: 'bg-amber-400',
        whoReference: 'WHO Nutrition Standard'
      },
      {
        id: '0_6_m_sun',
        name: 'Indirect Morning Sun & Circadian Reset',
        emoji: '☀️',
        desc: 'Expose baby to 5-10 minutes of gentle morning ambient light to lock in circadian melatonin rhythms.',
        colorClass: 'from-yellow-400/10 to-yellow-400/5 border-yellow-400/20 text-yellow-300',
        glowClass: 'shadow-yellow-400/10',
        indicatorColor: 'bg-yellow-400',
        whoReference: 'WHO Circadian Rhythm Benchmark'
      },
      {
        id: '0_6_m_diaper',
        name: 'Fresh Diaper & Skin Fold Check',
        emoji: '🧷',
        desc: 'Cleanse with warm water wipes, air dry diaper area completely, and apply barrier cream if needed.',
        colorClass: 'from-sky-400/10 to-sky-400/5 border-sky-400/20 text-sky-300',
        glowClass: 'shadow-sky-400/10',
        indicatorColor: 'bg-sky-400',
        whoReference: 'WHO Pediatric Skin Safety'
      },
      {
        id: '0_6_m_tummy',
        name: 'Daily Tummy Time (3-5 min)',
        emoji: '🌱',
        desc: 'Place baby on tummy on a firm playmat to strengthen neck, shoulder, and spinal core muscles.',
        colorClass: 'from-emerald-400/10 to-emerald-400/5 border-emerald-400/20 text-emerald-300',
        glowClass: 'shadow-emerald-400/10',
        indicatorColor: 'bg-emerald-400',
        whoReference: 'WHO Physical Activity Standard'
      },
      {
        id: '0_6_m_talk',
        name: 'High-Contrast Card Tracking',
        emoji: '🪞',
        desc: 'Move black-and-white visual pattern cards slowly across baby’s field of vision to train optical focus.',
        colorClass: 'from-indigo-400/10 to-indigo-400/5 border-indigo-400/20 text-indigo-300',
        glowClass: 'shadow-indigo-400/10',
        indicatorColor: 'bg-indigo-400',
        whoReference: 'WHO Cognitive Pathway Standard'
      },
      {
        id: '0_6_m_stretch',
        name: 'Gentle Leg Bicycle & Colic Relief',
        emoji: '🤸',
        desc: 'Gently bicycle baby’s legs toward their tummy to ease intestinal gas and activate hip flexibility.',
        colorClass: 'from-teal-400/10 to-teal-400/5 border-teal-400/20 text-teal-300',
        glowClass: 'shadow-teal-400/10',
        indicatorColor: 'bg-teal-400',
        whoReference: 'WHO Pediatric Comfort Guide'
      },
      {
        id: '0_6_m_music',
        name: 'Soothing Classical / Voice Humming',
        emoji: '🎵',
        desc: 'Hum soft melodic tones or play calming acoustic instruments to stimulate early auditory neurons.',
        colorClass: 'from-purple-400/10 to-purple-400/5 border-purple-400/20 text-purple-300',
        glowClass: 'shadow-purple-400/10',
        indicatorColor: 'bg-purple-400',
        whoReference: 'WHO Auditory Integration Guide'
      },
      {
        id: '0_6_m_nap1',
        name: 'Morning Wake-Window Nap Watch',
        emoji: '💤',
        desc: 'Watch for drowsy signs (staring blankly, redness around eyes) at the 60-90 min mark and swaddle for Nap 1.',
        colorClass: 'from-blue-400/10 to-blue-400/5 border-blue-400/20 text-blue-300',
        glowClass: 'shadow-blue-400/10',
        indicatorColor: 'bg-blue-400',
        whoReference: 'WHO Wake-Window Guideline'
      }
    ],
    evening: [
      {
        id: '0_6_e_feed',
        name: 'Midday Nutritive Feed & Burp',
        emoji: '🍼',
        desc: 'Full feeding session with gentle burping over shoulder or sitting upright for 15 minutes.',
        colorClass: 'from-amber-400/10 to-amber-400/5 border-amber-400/20 text-amber-300',
        glowClass: 'shadow-amber-400/10',
        indicatorColor: 'bg-amber-400',
        whoReference: 'WHO Feeding & Digestion Standard'
      },
      {
        id: '0_6_e_nap',
        name: 'Consolidated Afternoon Nap',
        emoji: '💤',
        desc: 'Restful 1.5-2 hour afternoon nap in a dim room with ambient pink noise to prevent overtiredness.',
        colorClass: 'from-blue-400/10 to-blue-400/5 border-blue-400/20 text-blue-300',
        glowClass: 'shadow-blue-400/10',
        indicatorColor: 'bg-blue-400',
        whoReference: 'WHO Sleep Standard'
      },
      {
        id: '0_6_e_stroll',
        name: 'Shaded Outdoor Stroller Walk',
        emoji: '🌳',
        desc: 'Take a short, low-stimulus stroller walk in the fresh air to naturally reset cortisol and sensory state.',
        colorClass: 'from-green-400/10 to-green-400/5 border-green-400/20 text-green-300',
        glowClass: 'shadow-green-400/10',
        indicatorColor: 'bg-green-400',
        whoReference: 'WHO Environmental Health Standard'
      },
      {
        id: '0_6_e_massage',
        name: 'Abdominal Oil Massage',
        emoji: '🧴',
        desc: 'Warm virgin coconut or almond oil massage on limbs and back to relax muscles and soothe digestion.',
        colorClass: 'from-pink-400/10 to-pink-400/5 border-pink-400/20 text-pink-300',
        glowClass: 'shadow-pink-400/10',
        indicatorColor: 'bg-pink-400',
        whoReference: 'IAP Infant Massage & Bonding'
      },
      {
        id: '0_6_e_texture',
        name: 'Tactile Fabric & Sensory Touch',
        emoji: '🪶',
        desc: 'Gently stroke baby’s palms and soles with muslin, silk, and textured cotton fabrics.',
        colorClass: 'from-rose-400/10 to-rose-400/5 border-rose-400/20 text-rose-300',
        glowClass: 'shadow-rose-400/10',
        indicatorColor: 'bg-rose-400',
        whoReference: 'WHO Sensory Integration Guideline'
      },
      {
        id: '0_6_e_rattle',
        name: 'Rattle Reach & Grasp Play',
        emoji: '🧸',
        desc: 'Dangle a soft silicone rattle to stimulate palmar grasp reflex and hand-eye coordination.',
        colorClass: 'from-violet-400/10 to-violet-400/5 border-violet-400/20 text-violet-300',
        glowClass: 'shadow-violet-400/10',
        indicatorColor: 'bg-violet-400',
        whoReference: 'WHO Motor Skill Protocol'
      },
      {
        id: '0_6_e_babble',
        name: 'Face-to-Face Babble & Smiles',
        emoji: '🗣️',
        desc: 'Imitate baby’s vowel coos ("ooh", "aah") with exaggerated mouth expressions to cultivate early speech.',
        colorClass: 'from-indigo-400/10 to-indigo-400/5 border-indigo-400/20 text-indigo-300',
        glowClass: 'shadow-indigo-400/10',
        indicatorColor: 'bg-indigo-400',
        whoReference: 'WHO Language Initiation Standard'
      },
      {
        id: '0_6_e_bridge',
        name: 'Late Afternoon Power Catnap',
        emoji: '😴',
        desc: 'Short 30-min bridge nap preventing bedtime meltdowns before evening bath routine.',
        colorClass: 'from-cyan-400/10 to-cyan-400/5 border-cyan-400/20 text-cyan-300',
        glowClass: 'shadow-cyan-400/10',
        indicatorColor: 'bg-cyan-400',
        whoReference: 'WHO Infant Sleep Hygiene'
      }
    ],
    bedtime: [
      {
        id: '0_6_b_sponge',
        name: 'Warm Sponge Wash / Bath',
        emoji: '🚿',
        desc: 'Wipe down baby’s neck folds, hands, and diaper area with warm water (37°C) to relax body temperature.',
        colorClass: 'from-cyan-400/10 to-cyan-400/5 border-cyan-400/20 text-cyan-300',
        glowClass: 'shadow-cyan-400/10',
        indicatorColor: 'bg-cyan-400',
        whoReference: 'WHO Hygiene & Thermoregulation'
      },
      {
        id: '0_6_b_cotton',
        name: 'Breathable Cotton Sleepwear',
        emoji: '👕',
        desc: 'Dress in pure breathable cotton layers without loose strings, caps, or restrictive tags.',
        colorClass: 'from-sky-400/10 to-sky-400/5 border-sky-400/20 text-sky-300',
        glowClass: 'shadow-sky-400/10',
        indicatorColor: 'bg-sky-400',
        whoReference: 'WHO Safe Infant Clothing'
      },
      {
        id: '0_6_b_dim',
        name: 'Digital Detox & Red Nightlight',
        emoji: '💡',
        desc: 'Extinguish harsh blue light and screens 60 minutes before bed; turn on a warm dim red nightlight.',
        colorClass: 'from-amber-400/10 to-amber-400/5 border-amber-400/20 text-amber-300',
        glowClass: 'shadow-amber-400/10',
        indicatorColor: 'bg-amber-400',
        whoReference: 'AAP Safe Sleep Environment'
      },
      {
        id: '0_6_b_feed',
        name: 'Bedtime Feed in Dim Silence',
        emoji: '🍼',
        desc: 'Offer full nutritive feed in quiet surroundings with minimal eye stimulation to encourage drowsiness.',
        colorClass: 'from-orange-400/10 to-orange-400/5 border-orange-400/20 text-orange-300',
        glowClass: 'shadow-orange-400/10',
        indicatorColor: 'bg-orange-400',
        whoReference: 'WHO Nighttime Satiety Standard'
      },
      {
        id: '0_6_b_noise',
        name: 'Continuous White/Pink Noise',
        emoji: '🌊',
        desc: 'Activate continuous waterfall or rain sound at a safe 6-foot distance (<50dB) to mask household noises.',
        colorClass: 'from-indigo-400/10 to-indigo-400/5 border-indigo-400/20 text-indigo-300',
        glowClass: 'shadow-indigo-400/10',
        indicatorColor: 'bg-indigo-400',
        whoReference: 'Pediatric Acoustic Safety'
      },
      {
        id: '0_6_b_reading',
        name: 'Soft Lullaby & Rhythmic Patting',
        emoji: '📚',
        desc: 'Read a short board book or sing a traditional lullaby with gentle back thappi (back pats).',
        colorClass: 'from-purple-400/10 to-purple-400/5 border-purple-400/20 text-purple-300',
        glowClass: 'shadow-purple-400/10',
        indicatorColor: 'bg-purple-400',
        whoReference: 'WHO Co-Regulation Protocol'
      },
      {
        id: '0_6_b_swaddle',
        name: 'Safe Arms-Out Swaddle / Sleep Sack',
        emoji: '🧸',
        desc: 'Zip into a secure, hip-healthy sleep sack allowing free kicking and arm mobility.',
        colorClass: 'from-teal-400/10 to-teal-400/5 border-teal-400/20 text-teal-300',
        glowClass: 'shadow-teal-400/10',
        indicatorColor: 'bg-teal-400',
        whoReference: 'AAP Hip Dysplasia Prevention'
      },
      {
        id: '0_6_b_sleep',
        name: 'Back to Sleep on Firm Cot',
        emoji: '😴',
        desc: 'Place baby flat on their back in an empty cot free from pillows, bumper pads, or plushies.',
        colorClass: 'from-violet-500/10 to-violet-500/5 border-violet-500/20 text-violet-400',
        glowClass: 'shadow-violet-500/10',
        indicatorColor: 'bg-violet-500',
        whoReference: 'WHO Sudden Death Prevention Standard'
      }
    ]
  },

  // ==========================================
  // 2. 6 - 12 MONTHS (24 Routines)
  // ==========================================
  {
    id: '6_12m',
    label: '6 - 12 Months',
    emoji: '👶',
    rangeDesc: 'Exploring solid food textures, sit-to-crawl transitions, and sleep consolidation.',
    whoAesthetic: 'Crucial for gross motor coordination, oral motor skills, and complementary solid nutrition.',
    morning: [
      {
        id: '6_12_m_solids',
        name: 'Warm Complementary Solid Breakfast',
        emoji: '🥑',
        desc: 'Offer mashed moong dal khichdi, ragi porridge, or mashed avocado with ghee 30 mins after milk.',
        colorClass: 'from-orange-400/10 to-orange-400/5 border-orange-400/20 text-orange-300',
        glowClass: 'shadow-orange-400/10',
        indicatorColor: 'bg-orange-400',
        whoReference: 'WHO Solid Feed Introduction'
      },
      {
        id: '6_12_m_water',
        name: 'Open Cup Water Sips',
        emoji: '🥤',
        desc: 'Offer 1-2 ounces of clean boiled water in an open silicone cup to build lip seal and tongue posture.',
        colorClass: 'from-cyan-400/10 to-cyan-400/5 border-cyan-400/20 text-cyan-300',
        glowClass: 'shadow-cyan-400/10',
        indicatorColor: 'bg-cyan-400',
        whoReference: 'WHO Oral Motor Development'
      },
      {
        id: '6_12_m_reach',
        name: 'Interactive Floor Crawl & Cruise',
        emoji: '🧸',
        desc: 'Place colorful toys just out of reach on a soft rug to encourage crawling, scooting, and pulling to stand.',
        colorClass: 'from-emerald-400/10 to-emerald-400/5 border-emerald-400/20 text-emerald-300',
        glowClass: 'shadow-emerald-400/10',
        indicatorColor: 'bg-emerald-400',
        whoReference: 'WHO Gross Motor Development'
      },
      {
        id: '6_12_m_gum',
        name: 'Teething Brush & Gum Care',
        emoji: '🪥',
        desc: 'Gently wipe emerging teeth with a soft silicone finger brush or soft gauze twice daily after meals.',
        colorClass: 'from-pink-400/10 to-pink-400/5 border-pink-400/20 text-pink-300',
        glowClass: 'shadow-pink-400/10',
        indicatorColor: 'bg-pink-400',
        whoReference: 'WHO Oral Hygiene Protocol'
      },
      {
        id: '6_12_m_peek',
        name: 'Object Permanence Games',
        emoji: '📦',
        desc: 'Play Peek-a-boo with a cloth or hide a toy under a cup to teach baby that things exist when unseen.',
        colorClass: 'from-indigo-400/10 to-indigo-400/5 border-indigo-400/20 text-indigo-300',
        glowClass: 'shadow-indigo-400/10',
        indicatorColor: 'bg-indigo-400',
        whoReference: 'WHO Cognitive Standard'
      },
      {
        id: '6_12_m_sun',
        name: 'Morning Balcony / Garden Fresh Air',
        emoji: '☀️',
        desc: 'Spend 15 minutes outdoors watching birds, rustling tree leaves, and greeting family members.',
        colorClass: 'from-yellow-400/10 to-yellow-400/5 border-yellow-400/20 text-yellow-300',
        glowClass: 'shadow-yellow-400/10',
        indicatorColor: 'bg-yellow-400',
        whoReference: 'WHO Sensory Integration Guideline'
      },
      {
        id: '6_12_m_pincer',
        name: 'Cheerio & Pea Pincer Grasp Practice',
        emoji: '🤏',
        desc: 'Encourage baby to pick up single steamed peas or soft banana cubes using index finger and thumb.',
        colorClass: 'from-rose-400/10 to-rose-400/5 border-rose-400/20 text-rose-300',
        glowClass: 'shadow-rose-400/10',
        indicatorColor: 'bg-rose-400',
        whoReference: 'WHO Fine Motor Milestone'
      },
      {
        id: '6_12_m_nap1',
        name: 'Morning Nap 1 (9:30 AM)',
        emoji: '💤',
        desc: 'Consolidate first 60-90 minute morning nap after 2.5-3 hours of active waking time.',
        colorClass: 'from-blue-400/10 to-blue-400/5 border-blue-400/20 text-blue-300',
        glowClass: 'shadow-blue-400/10',
        indicatorColor: 'bg-blue-400',
        whoReference: 'WHO Sleep Consolidation Standard'
      }
    ],
    evening: [
      {
        id: '6_12_e_solids',
        name: 'Nutritious Solid Lunch & Self-Feeding',
        emoji: '🍲',
        desc: 'Provide steamed carrot sticks, soft paneer cubes, or lentil puree in a suction bowl for tactile self-feeding.',
        colorClass: 'from-amber-400/10 to-amber-400/5 border-amber-400/20 text-amber-300',
        glowClass: 'shadow-amber-400/10',
        indicatorColor: 'bg-amber-400',
        whoReference: 'WHO Responsive Feeding Guide'
      },
      {
        id: '6_12_e_naps',
        name: 'Afternoon Restful Nap 2',
        emoji: '💤',
        desc: 'Second daytime restorative nap (usually 1.5 hours) to recharge before late afternoon sensory play.',
        colorClass: 'from-blue-400/10 to-blue-400/5 border-blue-400/20 text-blue-300',
        glowClass: 'shadow-blue-400/10',
        indicatorColor: 'bg-blue-400',
        whoReference: 'WHO Sleep Standard'
      },
      {
        id: '6_12_e_stroll',
        name: 'Park Stroller & Texture Stroll',
        emoji: '🌳',
        desc: 'Walk outdoors and let baby feel tree bark, cool grass, and gentle breezes to stimulate curiosity.',
        colorClass: 'from-green-400/10 to-green-400/5 border-green-400/20 text-green-300',
        glowClass: 'shadow-green-400/10',
        indicatorColor: 'bg-green-400',
        whoReference: 'WHO Environmental Exploration'
      },
      {
        id: '6_12_e_blocks',
        name: 'Wooden Block Clapping & Banging',
        emoji: '🧱',
        desc: 'Bang two wooden blocks together to demonstrate cause-and-effect and stimulate bilateral brain wiring.',
        colorClass: 'from-purple-400/10 to-purple-400/5 border-purple-400/20 text-purple-300',
        glowClass: 'shadow-purple-400/10',
        indicatorColor: 'bg-purple-400',
        whoReference: 'WHO Bilateral Coordination'
      },
      {
        id: '6_12_e_snack',
        name: 'Late Afternoon Fruit Mash Snack',
        emoji: '🍎',
        desc: 'Serve grated apple, papaya mash, or stewed pear to deliver vitamins and dietary fiber for regular bowel habits.',
        colorClass: 'from-rose-400/10 to-rose-400/5 border-rose-400/20 text-rose-300',
        glowClass: 'shadow-rose-400/10',
        indicatorColor: 'bg-rose-400',
        whoReference: 'WHO Micronutrient Standards'
      },
      {
        id: '6_12_e_music',
        name: 'Action Songs & Hand Clapping',
        emoji: '👏',
        desc: 'Sing "Clap Your Hands" or "Pat-a-Cake" guiding baby’s hands to coordinate social rhythm.',
        colorClass: 'from-teal-400/10 to-teal-400/5 border-teal-400/20 text-teal-300',
        glowClass: 'shadow-teal-400/10',
        indicatorColor: 'bg-teal-400',
        whoReference: 'WHO Social-Emotional Milestone'
      },
      {
        id: '6_12_e_hydration',
        name: 'Evening Hydration & Milk Top-Up',
        emoji: '🥛',
        desc: 'Offer breastmilk or formula alongside water sips to ensure optimal hydration before sunset.',
        colorClass: 'from-sky-400/10 to-sky-400/5 border-sky-400/20 text-sky-300',
        glowClass: 'shadow-sky-400/10',
        indicatorColor: 'bg-sky-400',
        whoReference: 'WHO Infant Fluid Intake'
      },
      {
        id: '6_12_e_clean',
        name: 'High Chair Wipe-Down & Fresh Diaper',
        emoji: '🧼',
        desc: 'Clean hands and face with warm water cloth, changing into dry evening diaper.',
        colorClass: 'from-indigo-400/10 to-indigo-400/5 border-indigo-400/20 text-indigo-300',
        glowClass: 'shadow-indigo-400/10',
        indicatorColor: 'bg-indigo-400',
        whoReference: 'WHO Hygiene Benchmark'
      }
    ],
    bedtime: [
      {
        id: '6_12_b_bath',
        name: 'Warm Bath & Splash Relaxation',
        emoji: '🛁',
        desc: 'A warm 10-min bath to release motor tension and signal the brain that nighttime has arrived.',
        colorClass: 'from-sky-400/10 to-sky-400/5 border-sky-400/20 text-sky-300',
        glowClass: 'shadow-sky-400/10',
        indicatorColor: 'bg-sky-400',
        whoReference: 'WHO Pediatric Bathing Safety'
      },
      {
        id: '6_12_b_massage',
        name: 'Gentle Leg & Back Stroke',
        emoji: '🧴',
        desc: 'Moisturize skin with hypoallergenic cream or coconut oil, massaging tired calves and arms.',
        colorClass: 'from-teal-400/10 to-teal-400/5 border-teal-400/20 text-teal-300',
        glowClass: 'shadow-teal-400/10',
        indicatorColor: 'bg-teal-400',
        whoReference: 'IAP Calming Touch Guidelines'
      },
      {
        id: '6_12_b_teeth',
        name: 'Bedtime Dental Gum Cleaning',
        emoji: '🪥',
        desc: 'Clean front incisors and wipe tongue to remove milk sugars and prevent early childhood caries.',
        colorClass: 'from-pink-400/10 to-pink-400/5 border-pink-400/20 text-pink-300',
        glowClass: 'shadow-pink-400/10',
        indicatorColor: 'bg-pink-400',
        whoReference: 'WHO Early Dental Care Protocol'
      },
      {
        id: '6_12_b_pajamas',
        name: 'Cozy Cotton Sleep Suit',
        emoji: '👕',
        desc: 'Dress in two-piece soft cotton pajamas or wearable blanket suited for 20-22°C room temperature.',
        colorClass: 'from-indigo-400/10 to-indigo-400/5 border-indigo-400/20 text-indigo-300',
        glowClass: 'shadow-indigo-400/10',
        indicatorColor: 'bg-indigo-400',
        whoReference: 'WHO Thermal Comfort Standard'
      },
      {
        id: '6_12_b_dim',
        name: 'Dim Transition & Curtain Draw',
        emoji: '🌙',
        desc: 'Draw 100% blackout curtains, extinguish screens, and speak in quiet bedtime whispers.',
        colorClass: 'from-violet-500/10 to-violet-500/5 border-violet-500/20 text-violet-400',
        glowClass: 'shadow-violet-500/10',
        indicatorColor: 'bg-violet-500',
        whoReference: 'WHO Melatonin Protection'
      },
      {
        id: '6_12_b_read',
        name: 'Touch-and-Feel Board Book',
        emoji: '📖',
        desc: 'Snuggle close and read 2 sensory textured books, pointing to animals and labeling sounds.',
        colorClass: 'from-purple-400/10 to-purple-400/5 border-purple-400/20 text-purple-300',
        glowClass: 'shadow-purple-400/10',
        indicatorColor: 'bg-purple-400',
        whoReference: 'WHO Pre-Literacy Standard'
      },
      {
        id: '6_12_b_lullaby',
        name: 'Soft Lullaby & Rhythmic Rocking',
        emoji: '🎶',
        desc: 'Sing a familiar lullaby while rocking gently, lowering baby into the cot when drowsy but awake.',
        colorClass: 'from-rose-400/10 to-rose-400/5 border-rose-400/20 text-rose-300',
        glowClass: 'shadow-rose-400/10',
        indicatorColor: 'bg-rose-400',
        whoReference: 'WHO Self-Soothing Guidelines'
      },
      {
        id: '6_12_b_sleep',
        name: 'Uninterrupted Overnight Sleep',
        emoji: '😴',
        desc: 'Ensure cot is clear of pillows and loose items. Safe flat sleep supporting 10-12 hours overnight rest.',
        colorClass: 'from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-400',
        glowClass: 'shadow-blue-500/10',
        indicatorColor: 'bg-blue-500',
        whoReference: 'AAP Safe Infant Sleep Standard'
      }
    ]
  },

  // ==========================================
  // 3. 12 - 18 MONTHS (24 Routines)
  // ==========================================
  {
    id: '12_18m',
    label: '12 - 18 Months',
    emoji: '🚶',
    rangeDesc: 'First steps, walking, active floor play, and vocabulary growth.',
    whoAesthetic: 'Fosters motor independence, early word mimicking, and solid self-feeding.',
    morning: [
      {
        id: '12_18_m_breakfast',
        name: 'Toddler Solid Breakfast & Milk',
        emoji: '🥞',
        desc: 'Serve idli with ghee, vegetable oats, or scrambled eggs with whole milk in an open cup.',
        colorClass: 'from-amber-400/10 to-amber-400/5 border-amber-400/20 text-amber-300',
        glowClass: 'shadow-amber-400/10',
        indicatorColor: 'bg-amber-400',
        whoReference: 'WHO Daily Nutrition Target'
      },
      {
        id: '12_18_m_brush',
        name: 'Morning Toothbrush Drill',
        emoji: '🪥',
        desc: 'Brush all teeth using a soft toddler toothbrush and a rice-grain amount of safe fluoride paste.',
        colorClass: 'from-pink-400/10 to-pink-400/5 border-pink-400/20 text-pink-300',
        glowClass: 'shadow-pink-400/10',
        indicatorColor: 'bg-pink-400',
        whoReference: 'WHO Pediatric Dental Standard'
      },
      {
        id: '12_18_m_walk',
        name: 'Independent Walking & Balance',
        emoji: '🚶',
        desc: 'Encourage cruising, barefoot walking on safe carpets, and stepping over low cushion hurdles.',
        colorClass: 'from-emerald-400/10 to-emerald-400/5 border-emerald-400/20 text-emerald-300',
        glowClass: 'shadow-emerald-400/10',
        indicatorColor: 'bg-emerald-400',
        whoReference: 'WHO Daily Activity Guide'
      },
      {
        id: '12_18_m_vocab',
        name: 'Object Naming & Word Imitation',
        emoji: '🗣️',
        desc: 'Point to common objects (ball, dog, spoon, shoe) naming them clearly to build vocabulary burst.',
        colorClass: 'from-indigo-400/10 to-indigo-400/5 border-indigo-400/20 text-indigo-300',
        glowClass: 'shadow-indigo-400/10',
        indicatorColor: 'bg-indigo-400',
        whoReference: 'WHO Early Language Standard'
      },
      {
        id: '12_18_m_sun',
        name: 'Morning Sunshine & Outdoor Ball Roll',
        emoji: '⚽',
        desc: 'Roll a soft ball back and forth outdoors on grass to train hand-eye coordination and spatial grasp.',
        colorClass: 'from-yellow-400/10 to-yellow-400/5 border-yellow-400/20 text-yellow-300',
        glowClass: 'shadow-yellow-400/10',
        indicatorColor: 'bg-yellow-400',
        whoReference: 'WHO Gross Motor Benchmark'
      },
      {
        id: '12_18_m_stack',
        name: 'Stacking Cups & Ring Pyramid',
        emoji: '🟡',
        desc: 'Demonstrate stacking 3 to 4 rings by size; praise effort when toddler places rings on the post.',
        colorClass: 'from-teal-400/10 to-teal-400/5 border-teal-400/20 text-teal-300',
        glowClass: 'shadow-teal-400/10',
        indicatorColor: 'bg-teal-400',
        whoReference: 'WHO Cognitive Spatial Standard'
      },
      {
        id: '12_18_m_water',
        name: 'Mid-Morning Hydration Water Break',
        emoji: '💧',
        desc: 'Offer water from a weighted straw cup to ensure adequate hydration before lunch.',
        colorClass: 'from-cyan-400/10 to-cyan-400/5 border-cyan-400/20 text-cyan-300',
        glowClass: 'shadow-cyan-400/10',
        indicatorColor: 'bg-cyan-400',
        whoReference: 'WHO Fluid Balance Target'
      },
      {
        id: '12_18_m_hands',
        name: 'Pre-Lunch Hand Washing',
        emoji: '🧼',
        desc: 'Practice washing hands with soap and water at the bathroom stool, singing the 20-second hand song.',
        colorClass: 'from-blue-400/10 to-blue-400/5 border-blue-400/20 text-blue-300',
        glowClass: 'shadow-blue-400/10',
        indicatorColor: 'bg-blue-400',
        whoReference: 'WHO Hygiene Habit Benchmark'
      }
    ],
    evening: [
      {
        id: '12_18_e_lunch',
        name: 'Family Lunch with Spoon Exploration',
        emoji: '🍲',
        desc: 'Provide vegetable khichdi or soft pasta with toddler spoon; celebrate independent scoop attempts.',
        colorClass: 'from-amber-400/10 to-amber-400/5 border-amber-400/20 text-amber-300',
        glowClass: 'shadow-amber-400/10',
        indicatorColor: 'bg-amber-400',
        whoReference: 'WHO Self-Feeding Independence'
      },
      {
        id: '12_18_e_nap',
        name: 'Consolidated Single Afternoon Nap',
        emoji: '💤',
        desc: 'Shift toward 1 solid afternoon nap (12:30-2:30 PM) lasting 1.5-2 hours to consolidate deep brain rest.',
        colorClass: 'from-blue-400/10 to-blue-400/5 border-blue-400/20 text-blue-300',
        glowClass: 'shadow-blue-400/10',
        indicatorColor: 'bg-blue-400',
        whoReference: 'WHO Sleep Consolidation Standard'
      },
      {
        id: '12_18_e_snack',
        name: 'Post-Nap Healthy Fruit / Yogurt Snack',
        emoji: '🍌',
        desc: 'Offer banana discs, curd (yogurt) with honey-free puree, or steamed apple slices to recharge energy.',
        colorClass: 'from-rose-400/10 to-rose-400/5 border-rose-400/20 text-rose-300',
        glowClass: 'shadow-rose-400/10',
        indicatorColor: 'bg-rose-400',
        whoReference: 'WHO Nutritional Diversity Protocol'
      },
      {
        id: '12_18_e_park',
        name: 'Outdoor Park & Texture Exploration',
        emoji: '🌳',
        desc: 'Explore fallen leaves, sandboxes, and safe park steps to develop ankle tendons and balance equilibrium.',
        colorClass: 'from-green-400/10 to-green-400/5 border-green-400/20 text-green-300',
        glowClass: 'shadow-green-400/10',
        indicatorColor: 'bg-green-400',
        whoReference: 'WHO Sensory Integration Guideline'
      },
      {
        id: '12_18_e_scribble',
        name: 'Chubby Crayon Scribbling',
        emoji: '🖍️',
        desc: 'Give thick triangular crayons and plain paper to practice gross shoulder-to-wrist drawing marks.',
        colorClass: 'from-purple-400/10 to-purple-400/5 border-purple-400/20 text-purple-300',
        glowClass: 'shadow-purple-400/10',
        indicatorColor: 'bg-purple-400',
        whoReference: 'WHO Fine Motor Milestone'
      },
      {
        id: '12_18_e_help',
        name: 'Toy Basket Cleanup Imitation',
        emoji: '🧹',
        desc: 'Encourage toddler to drop blocks back into the toy basket ("Clean up, clean up!") to build helpful habits.',
        colorClass: 'from-orange-400/10 to-orange-400/5 border-orange-400/20 text-orange-300',
        glowClass: 'shadow-orange-400/10',
        indicatorColor: 'bg-orange-400',
        whoReference: 'WHO Social-Emotional Behavior'
      },
      {
        id: '12_18_e_dance',
        name: 'Rhythm Dance & Music Movement',
        emoji: '💃',
        desc: 'Put on cheerful tunes and dance together, clapping hands and wiggling hips to build auditory rhythm.',
        colorClass: 'from-teal-400/10 to-teal-400/5 border-teal-400/20 text-teal-300',
        glowClass: 'shadow-teal-400/10',
        indicatorColor: 'bg-teal-400',
        whoReference: 'WHO Physical Coordination Guide'
      },
      {
        id: '12_18_e_potty',
        name: 'Floor Potty Seat Familiarity',
        emoji: '🚽',
        desc: 'Introduce the standalone floor potty in the bathroom; let toddler sit fully clothed to build comfort.',
        colorClass: 'from-indigo-400/10 to-indigo-400/5 border-indigo-400/20 text-indigo-300',
        glowClass: 'shadow-indigo-400/10',
        indicatorColor: 'bg-indigo-400',
        whoReference: 'WHO Potty Readiness Protocol'
      }
    ],
    bedtime: [
      {
        id: '12_18_b_dinner',
        name: 'Wholesome Early Dinner (6:30 PM)',
        emoji: '🍲',
        desc: 'Nutritious dinner with complex grains, vegetables, and warm milk to ensure overnight satiety.',
        colorClass: 'from-amber-400/10 to-amber-400/5 border-amber-400/20 text-amber-300',
        glowClass: 'shadow-amber-400/10',
        indicatorColor: 'bg-amber-400',
        whoReference: 'WHO Evening Nutrition Protocol'
      },
      {
        id: '12_18_b_bath',
        name: 'Warm Bath & Sensory Splash',
        emoji: '🛁',
        desc: 'Soak in a warm bath with a washcloth to relax active leg muscles and wash away daily sweat.',
        colorClass: 'from-sky-400/10 to-sky-400/5 border-sky-400/20 text-sky-300',
        glowClass: 'shadow-sky-400/10',
        indicatorColor: 'bg-sky-400',
        whoReference: 'WHO Pediatric Hygiene Standard'
      },
      {
        id: '12_18_b_brush',
        name: 'Fluoride Toothbrushing (2 Minutes)',
        emoji: '🪥',
        desc: 'Parent brushes all teeth gently with a grain-sized fluoride paste, humming the brushing song.',
        colorClass: 'from-pink-400/10 to-pink-400/5 border-pink-400/20 text-pink-300',
        glowClass: 'shadow-pink-400/10',
        indicatorColor: 'bg-pink-400',
        whoReference: 'WHO Dental Health Guidelines'
      },
      {
        id: '12_18_b_pajamas',
        name: 'Cozy Cotton Sleepwear & Diaper',
        emoji: '👕',
        desc: 'Change into fresh overnight diaper and soft 100% cotton footed sleeper.',
        colorClass: 'from-indigo-400/10 to-indigo-400/5 border-indigo-400/20 text-indigo-300',
        glowClass: 'shadow-indigo-400/10',
        indicatorColor: 'bg-indigo-400',
        whoReference: 'WHO Infant Sleep Attire'
      },
      {
        id: '12_18_b_lights',
        name: 'Screen-Free Amber Lighting',
        emoji: '💡',
        desc: 'Turn off all televisions, phones, and overhead white bulbs; switch to a soft amber nightlight.',
        colorClass: 'from-orange-400/10 to-orange-400/5 border-orange-400/20 text-orange-300',
        glowClass: 'shadow-orange-400/10',
        indicatorColor: 'bg-orange-400',
        whoReference: 'AAP Screen-Free Bedtime Rule'
      },
      {
        id: '12_18_b_books',
        name: 'Choice of 2 Picture Books',
        emoji: '📚',
        desc: 'Let toddler pick exactly 2 picture books from the shelf; snuggle in bed and read in a calm voice.',
        colorClass: 'from-purple-400/10 to-purple-400/5 border-purple-400/20 text-purple-300',
        glowClass: 'shadow-purple-400/10',
        indicatorColor: 'bg-purple-400',
        whoReference: 'WHO Pre-Literacy Benchmark'
      },
      {
        id: '12_18_b_cuddle',
        name: 'Security Blankie / Plush Snuggle',
        emoji: '🧸',
        desc: 'Introduce a designated bedtime comfort object (blanket or soft bear) to foster secure attachment.',
        colorClass: 'from-teal-400/10 to-teal-400/5 border-teal-400/20 text-teal-300',
        glowClass: 'shadow-teal-400/10',
        indicatorColor: 'bg-teal-400',
        whoReference: 'WHO Emotional Security Guide'
      },
      {
        id: '12_18_b_sleep',
        name: 'Cot Settling & Goodnight Affirmations',
        emoji: '😴',
        desc: 'Say gentle goodnight words ("You are safe, mama/papa is right here") and let toddler drift to sleep.',
        colorClass: 'from-violet-500/10 to-violet-500/5 border-violet-500/20 text-violet-400',
        glowClass: 'shadow-violet-500/10',
        indicatorColor: 'bg-violet-500',
        whoReference: 'WHO Independent Sleep Standard'
      }
    ]
  },

  // ==========================================
  // 4. 18 - 24 MONTHS (24 Routines)
  // ==========================================
  {
    id: '18_24m',
    label: '18 - 24 Months',
    emoji: '🏃',
    rangeDesc: 'Boundless physical energy, complex stacking, fine motor play, and active vocabulary.',
    whoAesthetic: 'Builds self-care skills, hands washing, shape sorting, and emotional reassurance.',
    morning: [
      {
        id: '18_24_m_breakfast',
        name: 'High-Protein Toddler Breakfast',
        emoji: '🥞',
        desc: 'Serve egg or paneer paratha, oats with seeds, or fruit smoothies to power high-octane toddler muscles.',
        colorClass: 'from-amber-400/10 to-amber-400/5 border-amber-400/20 text-amber-300',
        glowClass: 'shadow-amber-400/10',
        indicatorColor: 'bg-amber-400',
        whoReference: 'WHO Healthy Nutrition Standard'
      },
      {
        id: '18_24_m_potty',
        name: 'Morning Potty Routine',
        emoji: '🚽',
        desc: 'Guide toddler to sit on the potty right after waking; celebrate dry morning diapers with high-fives.',
        colorClass: 'from-blue-400/10 to-blue-400/5 border-blue-400/20 text-blue-300',
        glowClass: 'shadow-blue-400/10',
        indicatorColor: 'bg-blue-400',
        whoReference: 'WHO Potty Habit Formation'
      },
      {
        id: '18_24_m_teeth',
        name: 'Active Toothbrushing with Pea-Sized Paste',
        emoji: '🪥',
        desc: 'Let toddler practice holding the brush first, then parent thoroughly brushes all 16-20 emerging teeth.',
        colorClass: 'from-pink-400/10 to-pink-400/5 border-pink-400/20 text-pink-300',
        glowClass: 'shadow-pink-400/10',
        indicatorColor: 'bg-pink-400',
        whoReference: 'WHO Oral Hygiene Protocol'
      },
      {
        id: '18_24_m_active',
        name: 'Active Motor Run, Climb & Jump',
        emoji: '🏃',
        desc: 'Head to the playground or living room obstacle course to practice jumping off low steps and running.',
        colorClass: 'from-emerald-400/10 to-emerald-400/5 border-emerald-400/20 text-emerald-300',
        glowClass: 'shadow-emerald-400/10',
        indicatorColor: 'bg-emerald-400',
        whoReference: 'WHO Daily Activity Standard'
      },
      {
        id: '18_24_m_fine',
        name: 'Playdough & Masking Tape Peeling',
        emoji: '🎨',
        desc: 'Squish homemade wheat flour playdough or peel masking tape off the floor to strengthen finger arches.',
        colorClass: 'from-indigo-400/10 to-indigo-400/5 border-indigo-400/20 text-indigo-300',
        glowClass: 'shadow-indigo-400/10',
        indicatorColor: 'bg-indigo-400',
        whoReference: 'WHO Fine Motor Skill Standard'
      },
      {
        id: '18_24_m_puzzle',
        name: 'Shape Sorter & 4-Piece Wooden Puzzle',
        emoji: '🧱',
        desc: 'Solve simple inset wooden puzzles with knobs (circle, square, triangle) to sharpen spatial reasoning.',
        colorClass: 'from-teal-400/10 to-teal-400/5 border-teal-400/20 text-teal-300',
        glowClass: 'shadow-teal-400/10',
        indicatorColor: 'bg-teal-400',
        whoReference: 'WHO Cognitive Problem-Solving'
      },
      {
        id: '18_24_m_speech',
        name: 'Two-Word Sentence Expansion',
        emoji: '🗣️',
        desc: 'Expand on single words: when toddler says "Car", respond with "Yes, big red car goes beep beep!"',
        colorClass: 'from-purple-400/10 to-purple-400/5 border-purple-400/20 text-purple-300',
        glowClass: 'shadow-purple-400/10',
        indicatorColor: 'bg-purple-400',
        whoReference: 'WHO Language Milestones'
      },
      {
        id: '18_24_m_shoes',
        name: 'Shoe & Sock Self-Dressing Attempt',
        emoji: '👟',
        desc: 'Encourage toddler to pull on their own socks or velcro shoes, praising persistence over perfection.',
        colorClass: 'from-rose-400/10 to-rose-400/5 border-rose-400/20 text-rose-300',
        glowClass: 'shadow-rose-400/10',
        indicatorColor: 'bg-rose-400',
        whoReference: 'WHO Self-Care Autonomy'
      }
    ],
    evening: [
      {
        id: '18_24_e_lunch',
        name: 'Balanced Family Dining',
        emoji: '🍲',
        desc: 'Serve balanced meal with greens, protein, and grains; let toddler feed themselves with toddler fork.',
        colorClass: 'from-amber-400/10 to-amber-400/5 border-amber-400/20 text-amber-300',
        glowClass: 'shadow-amber-400/10',
        indicatorColor: 'bg-amber-400',
        whoReference: 'WHO Responsive Feeding'
      },
      {
        id: '18_24_e_hands',
        name: 'Self-Soap Hand Washing',
        emoji: '🧼',
        desc: 'Turn on water tap, lather soap foam for 20 seconds, and dry with personal towel independently.',
        colorClass: 'from-cyan-400/10 to-cyan-400/5 border-cyan-400/20 text-cyan-300',
        glowClass: 'shadow-cyan-400/10',
        indicatorColor: 'bg-cyan-400',
        whoReference: 'WHO Hygiene & Safety Protocol'
      },
      {
        id: '18_24_e_nap',
        name: 'Single 2-Hour Afternoon Sleep',
        emoji: '💤',
        desc: 'Ensure quiet 1.5-2 hour afternoon nap in dark cool room (1-3 PM) to prevent evening behavioral meltdowns.',
        colorClass: 'from-blue-400/10 to-blue-400/5 border-blue-400/20 text-blue-300',
        glowClass: 'shadow-blue-400/10',
        indicatorColor: 'bg-blue-400',
        whoReference: 'WHO Sleep Quality Standard'
      },
      {
        id: '18_24_e_snack',
        name: 'Healthy Post-Nap Crunch Snack',
        emoji: '🥕',
        desc: 'Offer cucumber batons, roasted makhana, or cheese cubes with water to fuel afternoon play.',
        colorClass: 'from-rose-400/10 to-rose-400/5 border-rose-400/20 text-rose-300',
        glowClass: 'shadow-rose-400/10',
        indicatorColor: 'bg-rose-400',
        whoReference: 'WHO Healthy Snack Guidelines'
      },
      {
        id: '18_24_e_playground',
        name: 'Sandpit & Trike Outdoor Play',
        emoji: '🛝',
        desc: 'Practice climbing playground ladder, riding balance trike, and digging in clean sand with shovel.',
        colorClass: 'from-green-400/10 to-green-400/5 border-green-400/20 text-green-300',
        glowClass: 'shadow-green-400/10',
        indicatorColor: 'bg-green-400',
        whoReference: 'WHO Outdoor Physical Activity'
      },
      {
        id: '18_24_e_parallel',
        name: 'Parallel Play with Peers',
        emoji: '🏎️',
        desc: 'Host a low-pressure playdate driving toy trucks side by side without forcing sharing prematurely.',
        colorClass: 'from-indigo-400/10 to-indigo-400/5 border-indigo-400/20 text-indigo-300',
        glowClass: 'shadow-indigo-400/10',
        indicatorColor: 'bg-indigo-400',
        whoReference: 'WHO Social Interaction Milestones'
      },
      {
        id: '18_24_e_tidy',
        name: 'Tidy-Up Song & Sorting Toys',
        emoji: '🧹',
        desc: 'Sing the cleanup song while putting animals into the farm box and cars into the garage.',
        colorClass: 'from-teal-400/10 to-teal-400/5 border-teal-400/20 text-teal-300',
        glowClass: 'shadow-teal-400/10',
        indicatorColor: 'bg-teal-400',
        whoReference: 'WHO Cooperative Behavior Standard'
      },
      {
        id: '18_24_e_potty2',
        name: 'Evening Potty Reminder',
        emoji: '🚽',
        desc: 'Ask, "Does your tummy need to pee in the potty?" and guide them for a quick sit before dinner.',
        colorClass: 'from-purple-400/10 to-purple-400/5 border-purple-400/20 text-purple-300',
        glowClass: 'shadow-purple-400/10',
        indicatorColor: 'bg-purple-400',
        whoReference: 'WHO Toileting Cue Recognition'
      }
    ],
    bedtime: [
      {
        id: '18_24_b_dinner',
        name: 'Screen-Free Wholesome Dinner',
        emoji: '🍲',
        desc: 'Sit together at dining table; no iPads or phones. Eat nutritious dinner and discuss the day.',
        colorClass: 'from-amber-400/10 to-amber-400/5 border-amber-400/20 text-amber-300',
        glowClass: 'shadow-amber-400/10',
        indicatorColor: 'bg-amber-400',
        whoReference: 'WHO Family Mealtime Standards'
      },
      {
        id: '18_24_b_bubble',
        name: 'Relaxing Warm Bubble Cleanse',
        emoji: '🛁',
        desc: 'Warm bath with gentle splash toys to wash away park dirt and calm the nervous system.',
        colorClass: 'from-sky-400/10 to-sky-400/5 border-sky-400/20 text-sky-300',
        glowClass: 'shadow-sky-400/10',
        indicatorColor: 'bg-sky-400',
        whoReference: 'WHO Hygiene & Sleep Readiness'
      },
      {
        id: '18_24_b_potty',
        name: 'Pre-Bed Potty Sit',
        emoji: '🚽',
        desc: 'Encourage toddler to sit on potty for 2 minutes before putting on overnight pull-up diaper.',
        colorClass: 'from-purple-400/10 to-purple-400/5 border-purple-400/20 text-purple-300',
        glowClass: 'shadow-purple-400/10',
        indicatorColor: 'bg-purple-400',
        whoReference: 'WHO Potty Readiness Guide'
      },
      {
        id: '18_24_b_brush',
        name: 'Fluoride Toothbrushing & Spit Practice',
        emoji: '🪥',
        desc: 'Brush all molars and front teeth; practice spitting foam into the sink without swallowing.',
        colorClass: 'from-pink-400/10 to-pink-400/5 border-pink-400/20 text-pink-300',
        glowClass: 'shadow-pink-400/10',
        indicatorColor: 'bg-pink-400',
        whoReference: 'WHO Dental Caries Prevention'
      },
      {
        id: '18_24_b_pajamas',
        name: 'Toddler Pajama Choice',
        emoji: '👕',
        desc: 'Give choice between two pajamas ("Dino or Stars?") to satisfy autonomy drive before bedtime.',
        colorClass: 'from-teal-400/10 to-teal-400/5 border-teal-400/20 text-teal-300',
        glowClass: 'shadow-teal-400/10',
        indicatorColor: 'bg-teal-400',
        whoReference: 'WHO Autonomy & Choice Standard'
      },
      {
        id: '18_24_b_story',
        name: 'Dialogue Reading (2 Storybooks)',
        emoji: '📖',
        desc: 'Read together, pausing to ask interactive questions: "Where is the puppy hiding?"',
        colorClass: 'from-indigo-400/10 to-indigo-400/5 border-indigo-400/20 text-indigo-300',
        glowClass: 'shadow-indigo-400/10',
        indicatorColor: 'bg-indigo-400',
        whoReference: 'WHO Dialogic Reading Protocol'
      },
      {
        id: '18_24_b_candle',
        name: 'Playful Candle Blowing Breaths',
        emoji: '🕯️',
        desc: 'Blow out pretend birthday candles on parent’s fingers to trigger deep diaphragmatic breaths.',
        colorClass: 'from-rose-400/10 to-rose-400/5 border-rose-400/20 text-rose-300',
        glowClass: 'shadow-rose-400/10',
        indicatorColor: 'bg-rose-400',
        whoReference: 'Pediatric Nervous System Reset'
      },
      {
        id: '18_24_b_sleep',
        name: 'Cozy Lights Out & Restful Sleep',
        emoji: '😴',
        desc: 'Tuck in with security bear; dim amber light and play soft white noise for 11 hours night rest.',
        colorClass: 'from-violet-500/10 to-violet-500/5 border-violet-500/20 text-violet-400',
        glowClass: 'shadow-violet-500/10',
        indicatorColor: 'bg-violet-500',
        whoReference: 'WHO Emotional Health Standard'
      }
    ]
  },

  // ==========================================
  // 5. 2 - 3 YEARS (24 Routines)
  // ==========================================
  {
    id: '2_3y',
    label: '2 - 3 Years',
    emoji: '🎨',
    rangeDesc: 'Potty training readiness, preschool prep, emotional regulation, and rich creative academy.',
    whoAesthetic: 'Cultivates self-choice, emotional vocabulary, playground sharing, and thorough dental care.',
    morning: [
      {
        id: '2_3_m_potty',
        name: 'Wake-Up Toilet / Potty Visit',
        emoji: '🚽',
        desc: 'Head straight to toilet with seat reducer and step stool; celebrate morning pee success.',
        colorClass: 'from-blue-400/10 to-blue-400/5 border-blue-400/20 text-blue-300',
        glowClass: 'shadow-blue-400/10',
        indicatorColor: 'bg-blue-400',
        whoReference: 'WHO Independent Toileting Protocol'
      },
      {
        id: '2_3_m_wash',
        name: 'Hand Washing & Face Splash',
        emoji: '🧼',
        desc: 'Wash hands with foaming soap, splash cool water on cheeks, and dry with hand towel.',
        colorClass: 'from-cyan-400/10 to-cyan-400/5 border-cyan-400/20 text-cyan-300',
        glowClass: 'shadow-cyan-400/10',
        indicatorColor: 'bg-cyan-400',
        whoReference: 'WHO Hygiene Routine Benchmark'
      },
      {
        id: '2_3_m_cereal',
        name: 'Autonomous Breakfast Choices',
        emoji: '🥣',
        desc: 'Let toddler scoop their cereal or choose between two options ("Idli or Banana Toast?").',
        colorClass: 'from-amber-400/10 to-amber-400/5 border-amber-400/20 text-amber-300',
        glowClass: 'shadow-amber-400/10',
        indicatorColor: 'bg-amber-400',
        whoReference: 'WHO Behavioral Independence'
      },
      {
        id: '2_3_m_teeth',
        name: 'Brush & Spit 2-Minute Drill',
        emoji: '🪥',
        desc: 'Brush molars thoroughly; practice spitting out toothpaste foam into the sink without swallowing.',
        colorClass: 'from-pink-400/10 to-pink-400/5 border-pink-400/20 text-pink-300',
        glowClass: 'shadow-pink-400/10',
        indicatorColor: 'bg-pink-400',
        whoReference: 'WHO Dental Standard'
      },
      {
        id: '2_3_m_clothes',
        name: 'Self-Dressing & Underwear Selection',
        emoji: '👕',
        desc: 'Encourage toddler to step into big kid underwear, pull up elastic pants, and choose shirt.',
        colorClass: 'from-teal-400/10 to-teal-400/5 border-teal-400/20 text-teal-300',
        glowClass: 'shadow-teal-400/10',
        indicatorColor: 'bg-teal-400',
        whoReference: 'WHO Self-Care Skill Development'
      },
      {
        id: '2_3_m_emotion',
        name: 'Morning Feelings Check-In',
        emoji: '🗣️',
        desc: 'Ask: "Are you feeling happy, excited, or sleepy today?" Helps toddler name feelings and regulate.',
        colorClass: 'from-emerald-400/10 to-emerald-400/5 border-emerald-400/20 text-emerald-300',
        glowClass: 'shadow-emerald-400/10',
        indicatorColor: 'bg-emerald-400',
        whoReference: 'WHO Mental & Emotional Standard'
      },
      {
        id: '2_3_m_preschool',
        name: 'Color & Counting Scavenger Hunt',
        emoji: '🧩',
        desc: 'Ask: "Can you find 3 yellow blocks in the room?" Builds color recognition, counting, and focus.',
        colorClass: 'from-indigo-400/10 to-indigo-400/5 border-indigo-400/20 text-indigo-300',
        glowClass: 'shadow-indigo-400/10',
        indicatorColor: 'bg-indigo-400',
        whoReference: 'WHO Early Cognitive Standard'
      },
      {
        id: '2_3_m_run',
        name: 'Active Outdoor Scooter / Walk',
        emoji: '🛴',
        desc: 'Ride mini 3-wheel scooter or jog outdoors in morning sunshine to build balance and cardiovascular stamina.',
        colorClass: 'from-yellow-400/10 to-yellow-400/5 border-yellow-400/20 text-yellow-300',
        glowClass: 'shadow-yellow-400/10',
        indicatorColor: 'bg-yellow-400',
        whoReference: 'WHO 60-Minute Physical Guideline'
      }
    ],
    evening: [
      {
        id: '2_3_e_lunch',
        name: 'Healthy Family Lunch & Table Manners',
        emoji: '🍲',
        desc: 'Eat lunch together with family; practice saying "Please" and "Thank you" and using a napkin.',
        colorClass: 'from-amber-400/10 to-amber-400/5 border-amber-400/20 text-amber-300',
        glowClass: 'shadow-amber-400/10',
        indicatorColor: 'bg-amber-400',
        whoReference: 'WHO Social Mealtime Modeling'
      },
      {
        id: '2_3_e_potty',
        name: 'Post-Lunch Potty Break',
        emoji: '🚽',
        desc: 'Prompt: "Let us try the potty before rest time!" Natural gastrocolic reflex after lunch aids easy poop.',
        colorClass: 'from-blue-400/10 to-blue-400/5 border-blue-400/20 text-blue-300',
        glowClass: 'shadow-blue-400/10',
        indicatorColor: 'bg-blue-400',
        whoReference: 'WHO Potty Timing Standard'
      },
      {
        id: '2_3_e_nap',
        name: 'Quiet Rest Hour / Consolidated Nap',
        emoji: '💤',
        desc: '1 to 2 hours of quiet rest or nap in dim bedroom. If not napping, engage in quiet bed book-looking.',
        colorClass: 'from-indigo-400/10 to-indigo-400/5 border-indigo-400/20 text-indigo-300',
        glowClass: 'shadow-indigo-400/10',
        indicatorColor: 'bg-indigo-400',
        whoReference: 'WHO Daily Rest Guidelines'
      },
      {
        id: '2_3_e_snack',
        name: 'Independent Snack & Juice/Water',
        emoji: '🍪',
        desc: 'Provide sliced cucumber, hummus, fruit, and water. Toddler carries their plate to the sink afterwards.',
        colorClass: 'from-green-400/10 to-green-400/5 border-green-400/20 text-green-300',
        glowClass: 'shadow-green-400/10',
        indicatorColor: 'bg-green-400',
        whoReference: 'WHO Habit Formation Standard'
      },
      {
        id: '2_3_e_playground',
        name: 'Social Playground Sharing & Swings',
        emoji: '🛝',
        desc: 'Practice taking turns on the slide ("My turn, your turn!") and running freely on grass.',
        colorClass: 'from-teal-400/10 to-teal-400/5 border-teal-400/20 text-teal-300',
        glowClass: 'shadow-teal-400/10',
        indicatorColor: 'bg-teal-400',
        whoReference: 'WHO Social-Emotional Milestone'
      },
      {
        id: '2_3_e_creative',
        name: 'Sensory Art & Play-Dough Sculpting',
        emoji: '🎨',
        desc: 'Roll dough balls, use safety scissors to cut paper strips, or watercolor paint to build finger strength.',
        colorClass: 'from-orange-400/10 to-orange-400/5 border-orange-400/20 text-orange-300',
        glowClass: 'shadow-orange-400/10',
        indicatorColor: 'bg-orange-400',
        whoReference: 'WHO Fine Motor Skill Standard'
      },
      {
        id: '2_3_e_reading',
        name: 'Story Drama & Pretend Tea Party',
        emoji: '🧸',
        desc: 'Imaginative pretend play with stuffed animals; pour pretend tea to foster empathy and narrative.',
        colorClass: 'from-purple-400/10 to-purple-400/5 border-purple-400/20 text-purple-300',
        glowClass: 'shadow-purple-400/10',
        indicatorColor: 'bg-purple-400',
        whoReference: 'WHO Pretend Play Development'
      },
      {
        id: '2_3_e_tidy',
        name: '5-Minute Warning & Toy Cleanup',
        emoji: '🧹',
        desc: 'Give a 5-minute visual timer warning before dinner, then work together to pack toys into storage bins.',
        colorClass: 'from-rose-400/10 to-rose-400/5 border-rose-400/20 text-rose-300',
        glowClass: 'shadow-rose-400/10',
        indicatorColor: 'bg-rose-400',
        whoReference: 'WHO Executive Functioning Protocol'
      }
    ],
    bedtime: [
      {
        id: '2_3_b_dinner',
        name: 'Family Dinner (Screen-Free Zone)',
        emoji: '🍲',
        desc: 'Enjoy warm evening meal with parents; share highs and lows of the day without background TV.',
        colorClass: 'from-amber-400/10 to-amber-400/5 border-amber-400/20 text-amber-300',
        glowClass: 'shadow-amber-400/10',
        indicatorColor: 'bg-amber-400',
        whoReference: 'WHO Family Routine Standard'
      },
      {
        id: '2_3_b_bath',
        name: 'Warm Bath & Sponge Play',
        emoji: '🛁',
        desc: 'Relaxing bath with boats or cups; washes away playground dirt and lowers core body temperature.',
        colorClass: 'from-sky-400/10 to-sky-400/5 border-sky-400/20 text-sky-300',
        glowClass: 'shadow-sky-400/10',
        indicatorColor: 'bg-sky-400',
        whoReference: 'WHO Evening Hygiene Standard'
      },
      {
        id: '2_3_b_potty',
        name: 'Nighttime Toilet / Potty Pass',
        emoji: '🚽',
        desc: 'Sit on the potty with step stool before bed; put on nighttime training pants or cotton underwear.',
        colorClass: 'from-blue-400/10 to-blue-400/5 border-blue-400/20 text-blue-300',
        glowClass: 'shadow-blue-400/10',
        indicatorColor: 'bg-blue-400',
        whoReference: 'WHO Overnight Dryness Practice'
      },
      {
        id: '2_3_b_brush',
        name: 'Thorough Brush & Spit Drill',
        emoji: '🪥',
        desc: 'Brush all molars with pea-sized fluoride toothpaste, spitting foam into sink with praise.',
        colorClass: 'from-pink-400/10 to-pink-400/5 border-pink-400/20 text-pink-300',
        glowClass: 'shadow-pink-400/10',
        indicatorColor: 'bg-pink-400',
        whoReference: 'WHO Oral Hygiene Protocol'
      },
      {
        id: '2_3_b_pajamas',
        name: 'Pajama Selection & Dressing',
        emoji: '👕',
        desc: 'Toddler puts on their two-piece pajama set independently with minor button help.',
        colorClass: 'from-teal-400/10 to-teal-400/5 border-teal-400/20 text-teal-300',
        glowClass: 'shadow-teal-400/10',
        indicatorColor: 'bg-teal-400',
        whoReference: 'WHO Daily Autonomy Protocol'
      },
      {
        id: '2_3_b_books',
        name: 'Double Bedtime Book Selection',
        emoji: '📚',
        desc: 'Toddler selects 2 favorite books; cuddle together in bed with soft reading lamp.',
        colorClass: 'from-purple-400/10 to-purple-400/5 border-purple-400/20 text-purple-300',
        glowClass: 'shadow-purple-400/10',
        indicatorColor: 'bg-purple-400',
        whoReference: 'WHO Pre-Literacy Standard'
      },
      {
        id: '2_3_b_breathing',
        name: 'Balloon Belly & Candle Breathing',
        emoji: '🌌',
        desc: 'Take slow belly breaths: "Smell the flower, blow out the candle" to slow heart rate.',
        colorClass: 'from-violet-500/10 to-violet-500/5 border-violet-500/20 text-violet-400',
        glowClass: 'shadow-violet-500/10',
        indicatorColor: 'bg-violet-500',
        whoReference: 'WHO Pediatric Relaxation Standard'
      },
      {
        id: '2_3_b_sleep',
        name: 'Goodnight Hug & Unbroken Sleep',
        emoji: '😴',
        desc: 'Give two warm hugs, exchange bedtime pass, dim light to red glow, and sleep for 10-12 hours.',
        colorClass: 'from-indigo-500/10 to-indigo-500/5 border-indigo-500/20 text-indigo-400',
        glowClass: 'shadow-indigo-500/10',
        indicatorColor: 'bg-indigo-500',
        whoReference: 'WHO Consolidated Sleep Health'
      }
    ]
  }
];
