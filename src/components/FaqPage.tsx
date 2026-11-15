import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Sparkles,
  Camera,
  Utensils,
  Stethoscope,
  Users,
  Activity,
  Crown,
  Palette,
  ChevronDown,
  ArrowLeft,
  MessageSquareHeart,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { playSound } from '../lib/sounds';

export type FaqCategoryId =
  | 'ai-trackers'
  | 'pediatric-care'
  | 'ai-nutrichef'
  | 'foodlens-nutrition'
  | 'nutriband'
  | 'community-connect'
  | 'learning-community'
  | 'plans-settings';

export interface FaqQuestionItem {
  id: string;
  category: FaqCategoryId;
  question: string;
  answer: string;
}

export interface FaqCategoryMeta {
  id: 'all' | FaqCategoryId;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeColor: string;
  borderColor: string;
  accentText: string;
}

export const FAQ_CATEGORIES: FaqCategoryMeta[] = [
  {
    id: 'all',
    label: 'All Categories',
    shortLabel: 'All FAQs',
    description: 'Browse all frequently asked questions across every Tricky Toddlers module.',
    icon: Layers,
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/35',
    borderColor: 'border-indigo-500/30',
    accentText: 'text-indigo-300'
  },
  {
    id: 'ai-trackers',
    label: 'AI Assistant & Health Trackers',
    shortLabel: 'AI Assistant & Trackers',
    description: '24/7 AI Parenting Assistant, Milestone Tracker, Routine Checker & Vaccine Tracker.',
    icon: Sparkles,
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/35',
    borderColor: 'border-amber-500/30',
    accentText: 'text-amber-300'
  },
  {
    id: 'pediatric-care',
    label: 'Pediatric Care',
    shortLabel: 'Pediatric Care',
    description: '1:1 Pediatric Consultations, Weekly Live Sessions, 24/7 Doctor Chat & Monthly Growth Reports.',
    icon: Stethoscope,
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-400/35',
    borderColor: 'border-sky-500/30',
    accentText: 'text-sky-300'
  },
  {
    id: 'ai-nutrichef',
    label: 'AI NutriChef & Meal Planning',
    shortLabel: 'AI NutriChef',
    description: 'Custom kitchen ingredient cooker, 250+ age-matched Indian toddler recipes, Sample Foods & Daily Dish Log.',
    icon: Utensils,
    badgeColor: 'bg-green-500/20 text-green-300 border-green-400/35',
    borderColor: 'border-green-500/30',
    accentText: 'text-green-300'
  },
  {
    id: 'foodlens-nutrition',
    label: 'FoodLens AI Vision Scanner',
    shortLabel: 'FoodLens AI',
    description: 'Instant camera plate scans, packaged label checks, macro/micronutrients, allergens & texture safety.',
    icon: Camera,
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/35',
    borderColor: 'border-emerald-500/30',
    accentText: 'text-emerald-300'
  },
  {
    id: 'nutriband',
    label: 'NutriBand™ Smart Monitor',
    shortLabel: 'NutriBand™',
    description: '3-in-1 wearable sensor pod, diaper clip, cotton & silicone straps, fever alerts & live telemetry.',
    icon: Activity,
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/35',
    borderColor: 'border-cyan-500/30',
    accentText: 'text-cyan-300'
  },
  {
    id: 'community-connect',
    label: 'Community Help & Parent Connect',
    shortLabel: 'Community & Connect',
    description: 'Moderated parenting discussion forums, topic-based advice, real-time parent chat rooms & safety rules.',
    icon: Users,
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-400/35',
    borderColor: 'border-teal-500/30',
    accentText: 'text-teal-300'
  },
  {
    id: 'learning-community',
    label: 'Toddler Learning & Baby Store',
    shortLabel: 'Learning & Store',
    description: 'Toddler Academy (9 interactive modules), Toddler Tales, Toddler TV & curated Baby Store.',
    icon: Palette,
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-400/35',
    borderColor: 'border-pink-500/30',
    accentText: 'text-pink-300'
  },
  {
    id: 'plans-settings',
    label: 'Plans, Privacy & Profile Settings',
    shortLabel: 'Plans & Settings',
    description: 'Free vs. Premium membership, Instant Guest Access, dual-child profiles, regional languages & data privacy.',
    icon: Crown,
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/35',
    borderColor: 'border-purple-500/30',
    accentText: 'text-purple-300'
  }
];

export const ALL_FAQ_ITEMS: FaqQuestionItem[] = [
  // ================= 1. AI ASSISTANT & HEALTH TRACKERS =================
  {
    id: 'ai-1',
    category: 'ai-trackers',
    question: 'How does the AI Parenting Assistant personalize advice for my child?',
    answer:
      'The AI Parenting Assistant automatically reads your active child profile, including exact age in months, dietary restrictions, allergies, Indian state/city, and custom parent instructions, so every suggestion on sleep regressions, tantrums, teething, or weaning is tailored specifically to your toddler.'
  },
  {
    id: 'ai-2',
    category: 'ai-trackers',
    question: 'Is the AI Parenting Assistant a replacement for my pediatrician?',
    answer:
      'No. The AI Parenting Assistant provides 24/7 educational guidance for everyday parenting questions and automatically flags urgent symptoms (such as choking, persistent high fever, breathing difficulty, or dehydration) with immediate step-by-step first-aid tips and emergency helpline numbers while directing you to consult your pediatrician immediately.'
  },
  {
    id: 'ai-3',
    category: 'ai-trackers',
    question: 'Are the Milestone Tracker and Vaccine Tracker aligned with Indian pediatric standards?',
    answer:
      'Yes. Our Milestone Tracker (motor, speech, cognitive, and social milestones) and Vaccine Tracker follow recognized Indian Academy of Pediatrics (IAP), ICMR-NIN, and FSSAI immunization and developmental schedules, with due-date reminders and downloadable PDF reports you can share with your doctor.'
  },
  {
    id: 'ai-4',
    category: 'ai-trackers',
    question: 'How does the Routine Checker help with toddler sleep and mealtime schedules?',
    answer:
      'Routine Checker provides age-calibrated daily schedules covering wake windows, nap durations, meal timings, sensory play, and bedtime wind-down rituals. Your checked items are saved automatically so you can track daily consistency.'
  },

  // ================= 2. PEDIATRIC CARE (ALL 4 FEATURES) =================
  {
    id: 'ped-1',
    category: 'pediatric-care',
    question: 'What are the 4 features included inside the Pediatric Care section?',
    answer:
      'The Pediatric Care hub brings together 4 dedicated clinical and developmental tools in one place: (1) 1:1 Pediatric Consultations for booking telehealth or in-clinic doctor visits, (2) Live Sessions for interactive weekly specialist webinars and Q&A, (3) Doctor Chat for 24/7 on-demand clinical chat guidance, and (4) Growth Reports for monthly Indian IAP, ICMR-NIN, and FSSAI developmental progress summaries and exportable PDFs.'
  },
  {
    id: 'ped-2',
    category: 'pediatric-care',
    question: 'How do 1:1 Pediatric Consultations and Consultation History work?',
    answer:
      'In the Consultations tab, you can browse qualified pediatricians, child nutritionists, and lactation/sleep specialists by specialty, experience, and language, then book a 1:1 video tele-consultation or clinic appointment. All your scheduled bookings and doctor notes are saved in Consultation History for easy reference.'
  },
  {
    id: 'ped-3',
    category: 'pediatric-care',
    question: 'What happens in Live Sessions and weekly pediatric webinars?',
    answer:
      'Live Sessions hosts interactive weekly webinars led by pediatricians and child development experts on high-priority topics like weaning, toddler speech delays, immunity building, and positive discipline. You can register for upcoming live sessions, submit questions for the live Q&A, or watch recorded replays anytime.'
  },
  {
    id: 'ped-4',
    category: 'pediatric-care',
    question: 'How does 24/7 Doctor Chat work for everyday toddler health questions?',
    answer:
      'Doctor Chat provides on-demand clinical chat support where you can describe non-emergency symptoms (such as mild rashes, teething discomfort, picky eating, or stool changes), get structured pediatric care advice and first-aid guidance, and revisit all past conversations inside Doctor Chat History.'
  },
  {
    id: 'ped-5',
    category: 'pediatric-care',
    question: 'What is included in the Monthly Growth Reports feature?',
    answer:
      'Growth Reports compiles your child’s logged milestones, immunization records, sleep/routine adherence, and nutritional progress into a structured monthly developmental summary benchmarked against Indian IAP, ICMR-NIN, and FSSAI standards, complete with one-click PDF export to share with your pediatrician.'
  },

  // ================= 3. AI NUTRICHEF & MEAL PLANNING =================
  {
    id: 'chef-1',
    category: 'ai-nutrichef',
    question: 'How does AI NutriChef create toddler recipes from ingredients I have at home?',
    answer:
      'In AI NutriChef, simply enter the ingredients available in your kitchen and select your child’s age stage (from 6-month smooth purees to 9-month mash, finger foods, and toddler family meals). AI NutriChef generates step-by-step, low-salt, zero-refined-sugar recipes with exact prep time, texture tips, and key nutrients.'
  },
  {
    id: 'chef-2',
    category: 'ai-nutrichef',
    question: 'Does AI NutriChef respect regional Indian diets, Jain/Sattvic rules, and food allergies?',
    answer:
      'Yes! AI NutriChef offers 250+ age-matched Indian and global recipes and automatically filters every recipe against your saved Dietary Preferences, including Vegetarian, Non-Vegetarian, Eggitarian, Vegan, Jain (no root vegetables), Sattvic, and Halal, while strictly excluding any allergens saved in your child’s profile.'
  },
  {
    id: 'chef-3',
    category: 'ai-nutrichef',
    question: 'How do Sample Foods and the Daily Dish Log work inside AI NutriChef?',
    answer:
      'Sample Foods provides a visual, age-graded catalog of pediatrician-approved first foods, khichdis, ragi porridges, and finger foods with safe cutting and serving guides. Daily Dish Log lets you record what your baby ate for breakfast, lunch, snacks, and dinner along with their reaction (loved it, picky, or sensitivity) so you can track food acceptance over time.'
  },
  {
    id: 'chef-4',
    category: 'ai-nutrichef',
    question: 'Are my custom-generated AI NutriChef recipes saved automatically?',
    answer:
      'Yes. Every custom recipe generated by AI NutriChef is saved in your AI Recipe History so you can revisit ingredients, cooking steps, and nutritional highlights without having to regenerate them.'
  },

  // ================= 4. FOODLENS AI VISION SCANNER =================
  {
    id: 'food-1',
    category: 'foodlens-nutrition',
    question: 'What is FoodLens AI and how does the camera plate scan work?',
    answer:
      'FoodLens AI lets you snap or upload a photo of your child’s meal plate or packaged food label. Within seconds, it identifies the food items, estimates macro and micronutrients (iron, calcium, protein, vitamins), checks texture safety for choking hazards, and flags any ingredients that conflict with your child’s saved allergies or dietary rules.'
  },
  {
    id: 'food-2',
    category: 'foodlens-nutrition',
    question: 'Does FoodLens AI detect hidden chemicals, artificial colors, and allergens?',
    answer:
      'Yes! FoodLens AI cross-checks meals and packaged food labels against your saved Dietary Preferences, including Milk/Dairy, Lactose, Peanut, Tree Nuts, Egg, Wheat/Gluten, Soy, and parent rules like zero refined sugar, no artificial sweeteners, and no synthetic food coloring.'
  },
  {
    id: 'food-3',
    category: 'foodlens-nutrition',
    question: 'How does FoodLens AI help prevent choking hazards for babies and toddlers?',
    answer:
      'When you scan a meal plate, FoodLens AI checks the visual cut and texture of foods (such as whole grapes, nuts, raw carrot coins, or large chunks) against your child’s exact age in months and provides immediate modification tips like quartering lengthwise, steaming until mashable, or grating.'
  },

  // ================= 5. NUTRIBAND SMART MONITOR =================
  {
    id: 'nb-1',
    category: 'nutriband',
    question: 'What is the NutriBand™ 3-in-1 Pediatric Smart Monitor?',
    answer:
      'NutriBand™ is a lightweight, baby-safe wearable sensor pod that works in 3 interchangeable ways: clipped gently onto the diaper waist (0–12 months), worn on a breathable organic cotton velcro strap (6–24 months), or worn as a soft medical-grade silicone wristband (2–5 years).'
  },
  {
    id: 'nb-2',
    category: 'nutriband',
    question: 'What health metrics does NutriBand™ track in real time?',
    answer:
      'NutriBand™ continuously monitors skin temperature (with instant pediatric fever elevation alerts above 37.3°C), sleep duration and restlessness, active play hours, hydration/nutrition sync, and safe-zone movement telemetry.'
  },
  {
    id: 'nb-3',
    category: 'nutriband',
    question: 'Is NutriBand™ included in the monthly Premium subscription?',
    answer:
      'The NutriBand™ live dashboard and fever alert telemetry are unlocked with the Premium Plan, while the physical NutriBand™ 3-in-1 Starter Kit (sensor pod, diaper clip, S/M/L breathable cotton straps, silicone strap, magnetic USB charger, and travel case) is a separate one-time hardware purchase of ₹1,499.'
  },
  {
    id: 'nb-4',
    category: 'nutriband',
    question: 'Is the NutriBand™ sensor safe for sensitive newborn and toddler skin?',
    answer:
      'Yes. The sensor pod is completely cordless, hypoallergenic, BPA/latex-free, water-resistant (IP67), and uses ultra-low-energy Bluetooth telemetry designed specifically for infants and toddlers.'
  },

  // ================= 6. COMMUNITY HELP & PARENT CONNECT =================
  {
    id: 'cc-1',
    category: 'community-connect',
    question: 'How do Community Help and Parent Connect work together for parents?',
    answer:
      'Community Help and Parent Connect give you two complementary ways to connect with fellow families: Community Help is a structured, topic-based parenting forum for posting detailed questions, sharing milestone stories, and reading threaded replies, while Parent Connect offers real-time live chat rooms for instant peer-to-peer conversations.'
  },
  {
    id: 'cc-2',
    category: 'community-connect',
    question: 'What topics can I discuss or filter in Community Help?',
    answer:
      'In Community Help, you can browse, search, and post across topics such as Sleep & Bedtime, Picky Eating & Weaning, Tantrums & Behavior, Milestones & Speech, Postpartum & Self-Care, and Pediatric Tips, as well as like and reply to other parents’ posts.'
  },
  {
    id: 'cc-3',
    category: 'community-connect',
    question: 'How are Community Help and Parent Connect kept safe, respectful, and private?',
    answer:
      'Both modules enforce our Community Guidelines: no medical misinformation, no shaming or bullying, and strict protection of children’s private health records. Only your chosen parent display name is shown when you post or chat, and your private child trackers remain completely hidden from other users.'
  },
  {
    id: 'cc-4',
    category: 'community-connect',
    question: 'Can I browse Community Help and Parent Connect using Instant Guest Access?',
    answer:
      'Yes! In Instant Guest Access mode, you can read existing parent discussions in Community Help and view live conversations in Parent Connect right away, and you can sign in or create a free account whenever you want to publish posts or send chat messages under your own profile.'
  },

  // ================= 7. TODDLER LEARNING & BABY STORE =================
  {
    id: 'lc-1',
    category: 'learning-community',
    question: 'What learning modules are included in Toddler Academy?',
    answer:
      'Toddler Academy features 9 interactive, voice-guided learning modules: Numbers, Counting, First Words, Sentence Builder, Colors, Emotions, Body Parts, Shapes, and Animal Sounds, designed with calm visuals and gentle audio feedback so toddlers learn without overstimulation.'
  },
  {
    id: 'lc-2',
    category: 'learning-community',
    question: 'How are Toddler Tales and Toddler TV different from regular video apps?',
    answer:
      'Toddler Tales and Toddler TV are 100% ad-free, algorithm-free libraries of moral stories, bedtime tales, and educational rhymes curated by age stage so your child is never exposed to random or overstimulating videos.'
  },
  {
    id: 'lc-3',
    category: 'learning-community',
    question: 'What can I find in the Baby Store?',
    answer:
      'The Baby Store offers curated, pediatrician-recommended essentials across Clothing & Bedding, Diapering & Bathing, Feeding & Gear, and Toys & Play, filterable by your baby’s exact age stage with free delivery on orders above ₹499.'
  },

  // ================= 8. PLANS, PRIVACY & SETTINGS =================
  {
    id: 'ps-1',
    category: 'plans-settings',
    question: 'What is included in the Free Plan vs. the Premium Plan?',
    answer:
      'The Free Plan gives you permanent access to the AI Parenting Assistant, Milestone Tracker, Routine Checker, Vaccine Tracker, AI NutriChef, Toddler Academy, Toddler Tales, Toddler TV, Community Help, Parent Connect, and Baby Store. Upgrading to the Premium Plan (₹499/month or ₹5,090/year with 15% savings) unlocks unlimited FoodLens AI camera scans, allergen & chemical detection, and full NutriBand™ live vitals telemetry.'
  },
  {
    id: 'ps-2',
    category: 'plans-settings',
    question: 'Can I manage two children under one parent account?',
    answer:
      'Yes! Both Profile Settings and Dietary Preferences support up to two separate child profiles (Child 1 and Child 2). You can switch between Child 1 and Child 2 with a single click, or mark Child 2 as Not Applicable if you have one child.'
  },
  {
    id: 'ps-3',
    category: 'plans-settings',
    question: 'How does Instant Guest Access work?',
    answer:
      'Clicking "Instant Guest Access" in the top navigation bar lets you immediately explore all 14 features with a pre-configured sample profile (Lashmi & Ashwath) without entering an email or password. You can create your own personal account whenever you are ready.'
  },
  {
    id: 'ps-4',
    category: 'plans-settings',
    question: 'Which Indian regional languages are supported?',
    answer:
      'Tricky Toddlers supports English, Hindi (हिन्दी), Tamil (தமிழ்), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Marathi (मराठी), Gujarati (ગુજરાતી), Bengali (বাংলা), Punjabi (ਪੰਜਾਬੀ), Assamese (অসমীয়া), and Odia (ଓଡ଼ିଆ), allowing families to read guidance and interact in the language they are most comfortable with.'
  },
  {
    id: 'ps-5',
    category: 'plans-settings',
    question: 'Who owns my child’s data, and can I export or delete it?',
    answer:
      'You own 100% of your family’s data. Your child’s profile, health logs, and photos are protected by strict user-level security rules. From Profile Settings, you can export a complete JSON/PDF archive of your data or permanently delete your meal photos, health logs, or entire account at any time.'
  }
];

export const FaqPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<FaqCategoryMeta['id']>('all');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'ai-1': true,
    'ped-1': true,
    'chef-1': true,
    'food-1': true,
    'nb-1': true,
    'cc-1': true,
    'lc-1': true,
    'ps-1': true
  });

  const toggleFaq = (id: string) => {
    playSound('pop');
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredFaqs = useMemo(() => {
    return ALL_FAQ_ITEMS.filter((item) => {
      return selectedCategory === 'all' || item.category === selectedCategory;
    });
  }, [selectedCategory]);

  const categoriesToRender = useMemo(() => {
    if (selectedCategory === 'all') {
      return FAQ_CATEGORIES.filter((c) => c.id !== 'all');
    }
    return FAQ_CATEGORIES.filter((c) => c.id === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 text-left">
      {/* Top Breadcrumb Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/?tab=home"
          onClick={() => playSound('click')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-400" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/about?tab=story"
            onClick={() => playSound('glass')}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all"
          >
            My Story
          </Link>
          <Link
            to="/contact"
            onClick={() => playSound('glass')}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-xs font-bold text-emerald-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <MessageSquareHeart className="w-3.5 h-3.5" />
            <span>Ask a Question / Feedback</span>
          </Link>
        </div>
      </div>

      {/* Hero Header Card */}
      <section className="w-full relative overflow-hidden rounded-3xl sm:rounded-[2.25rem] border border-indigo-500/30 bg-gradient-to-b from-[#0f172a]/95 via-[#0b1224]/95 to-[#070b14]/95 p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/15 blur-[110px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-500/10 blur-[110px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/35 text-indigo-300 text-xs font-black uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
              <span>Complete Knowledge Base · {ALL_FAQ_ITEMS.length} Questions Across {FAQ_CATEGORIES.length - 1} Categories</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Frequently Asked Questions
            </h1>
          </div>

          {/* Quick Category Filter Bar */}
          <div className="space-y-4 pt-1">
            {/* Category Selector: Dropdown on Mobile (< 768px), Pills on Desktop (>= 768px) */}
            <div className="md:hidden">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  playSound('glass');
                  setSelectedCategory(e.target.value as FaqCategoryMeta['id']);
                }}
                aria-label="Select FAQ Category"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1329] border border-indigo-400/40 text-xs font-bold text-white focus:outline-none focus:border-indigo-400"
              >
                {FAQ_CATEGORIES.map((cat) => {
                  const count =
                    cat.id === 'all'
                      ? ALL_FAQ_ITEMS.length
                      : ALL_FAQ_ITEMS.filter((i) => i.category === cat.id).length;
                  return (
                    <option key={cat.id} value={cat.id}>
                      {cat.label} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="hidden md:flex flex-wrap items-center gap-2">
              {FAQ_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                const count =
                  cat.id === 'all'
                    ? ALL_FAQ_ITEMS.length
                    : ALL_FAQ_ITEMS.filter((i) => i.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      playSound('glass');
                      setSelectedCategory(cat.id);
                    }}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? `${cat.badgeColor} shadow-lg scale-[1.02]`
                        : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{cat.shortLabel}</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-black/30 text-[10px] font-black">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Categorized FAQ Sections */}
      {filteredFaqs.length === 0 ? (
        <div className="glass-card rounded-3xl border border-white/15 p-8 sm:p-12 text-center space-y-3">
          <HelpCircle className="w-10 h-10 text-indigo-400 mx-auto" />
          <h3 className="text-lg sm:text-xl font-bold text-white">No matching questions found</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Try clearing your search query or switching to &ldquo;All Categories&rdquo; to browse all 22 questions.
          </p>
          <button
            type="button"
            onClick={() => {
              playSound('click');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {categoriesToRender.map((categoryMeta) => {
            const categoryQuestions = filteredFaqs.filter(
              (item) => item.category === categoryMeta.id
            );
            if (categoryQuestions.length === 0) return null;

            const CategoryIcon = categoryMeta.icon;

            return (
              <section
                key={categoryMeta.id}
                id={`faq-cat-${categoryMeta.id}`}
                className={`w-full space-y-5 rounded-3xl sm:rounded-[2.25rem] border ${categoryMeta.borderColor} bg-gradient-to-b from-[#0c1322] via-[#090e1a] to-[#050810] p-5 sm:p-8 lg:p-10 shadow-2xl`}
              >
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-black uppercase tracking-wider ${categoryMeta.badgeColor}`}
                    >
                      <CategoryIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>{categoryMeta.shortLabel}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight pt-1">
                      {categoryMeta.label}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300">
                      {categoryMeta.description}
                    </p>
                  </div>

                  <div className="text-xs font-bold text-slate-400 shrink-0">
                    {categoryQuestions.length} {categoryQuestions.length === 1 ? 'Question' : 'Questions'}
                  </div>
                </div>

                {/* Questions Accordion List */}
                <div className="w-full space-y-3">
                  {categoryQuestions.map((faq, idx) => {
                    const isOpen = Boolean(openIds[faq.id]);
                    return (
                      <div
                        key={faq.id}
                        className={`w-full glass-card rounded-2xl border transition-all duration-200 overflow-hidden ${
                          isOpen
                            ? 'border-indigo-400/40 bg-indigo-950/30 shadow-lg shadow-indigo-500/10'
                            : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(faq.id)}
                          aria-expanded={isOpen}
                          className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                        >
                          <div className="flex items-start sm:items-center gap-3 min-w-0">
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg border text-xs font-black shrink-0 mt-0.5 sm:mt-0 ${categoryMeta.badgeColor}`}
                            >
                              {idx + 1}
                            </span>
                            <span className="text-sm sm:text-base font-bold text-white leading-snug">
                              {faq.question}
                            </span>
                          </div>

                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 transition-transform duration-200 ${
                              isOpen
                                ? 'bg-indigo-500/25 border-indigo-400/40 text-indigo-300 rotate-180'
                                : 'bg-white/5 border-white/10 text-slate-400'
                            }`}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: 'easeInOut' }}
                            >
                              <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-2 border-t border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed pl-13 sm:pl-16">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Bottom Help CTA Banner */}
      <section className="w-full rounded-3xl sm:rounded-[2.25rem] border border-emerald-500/30 bg-gradient-to-r from-[#071917] via-[#0b1526] to-[#0f1026] p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Still Have a Question?</span>
          </div>
          <h3 className="text-lg sm:text-2xl font-black text-white">
            We’re Here to Help Your Parenting Journey
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Send your question or feedback directly, or ask our 24/7 AI Parenting Assistant anytime.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            to="/contact"
            onClick={() => playSound('glass')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5"
          >
            <MessageSquareHeart className="w-4 h-4 text-emerald-400" />
            <span>Contact &amp; Feedback</span>
          </Link>
        </div>
      </section>
    </div>
  );
};
