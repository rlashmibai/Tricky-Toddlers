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
    description: 'Consultations & Hospital Map Finder, Live Sessions Schedule, 24/7 AI Doctor Chat & Monthly Growth Reports.',
    icon: Stethoscope,
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-400/35',
    borderColor: 'border-sky-500/30',
    accentText: 'text-sky-300'
  },
  {
    id: 'ai-nutrichef',
    label: 'AI NutriChef & Meal Planning',
    shortLabel: 'AI NutriChef',
    description: 'AI Recipe Maker, 300+ Nutritious Recipes (0–18 Years), Stage Guidelines & AI Recipe History.',
    icon: Utensils,
    badgeColor: 'bg-green-500/20 text-green-300 border-green-400/35',
    borderColor: 'border-green-500/30',
    accentText: 'text-green-300'
  },
  {
    id: 'foodlens-nutrition',
    label: 'FoodLens AI, Sample Foods & Dish Log',
    shortLabel: 'FoodLens AI',
    description: 'Camera/upload food & label scans, Sample Foods catalog, HFSS & allergen checks, and Daily Dish Log.',
    icon: Camera,
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/35',
    borderColor: 'border-emerald-500/30',
    accentText: 'text-emerald-300'
  },
  {
    id: 'nutriband',
    label: 'NutriBand™ Smart Monitor',
    shortLabel: 'NutriBand™',
    description: '3-in-1 wearable sensor pod, diaper clip, cotton & silicone straps, 6 live wellness signals & starter kit.',
    icon: Activity,
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/35',
    borderColor: 'border-cyan-500/30',
    accentText: 'text-cyan-300'
  },
  {
    id: 'community-connect',
    label: 'Community Help & Parent Connect',
    shortLabel: 'Community & Connect',
    description: 'Topic-tagged parenting forum, AI Community Safety Moderation, Parent 1:1 Connect & Community Guidelines.',
    icon: Users,
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-400/35',
    borderColor: 'border-teal-500/30',
    accentText: 'text-teal-300'
  },
  {
    id: 'learning-community',
    label: 'Toddler Learning & Baby Store',
    shortLabel: 'Learning & Store',
    description: 'Toddler Academy (10 interactive modules), Toddler Tales articles, Toddler TV & curated Baby Store.',
    icon: Palette,
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-400/35',
    borderColor: 'border-pink-500/30',
    accentText: 'text-pink-300'
  },
  {
    id: 'plans-settings',
    label: 'Plans, Privacy & Profile Settings',
    shortLabel: 'Plans & Settings',
    description: 'Free vs. Premium plan, Free Guest Access, dual-child profiles, 12 languages, data export & DPDP privacy.',
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
      'The AI Parenting Assistant automatically reads your active child profile (Child 1 or Child 2), including age/date of birth, saved Dietary Preferences, allergies, Indian state/city, selected language, and custom AI instructions. It also supports voice dictation, read-aloud audio playback, and automatically saves your questions in AI Chat History.'
  },
  {
    id: 'ai-2',
    category: 'ai-trackers',
    question: 'Is the AI Parenting Assistant a replacement for my pediatrician?',
    answer:
      'No. The AI Parenting Assistant provides 24/7 educational guidance for everyday parenting questions and automatically flags urgent red-flag symptoms (such as choking, severe fever, breathing difficulty, or seizures) with immediate first-aid steps and emergency helpline numbers while advising you to consult your pediatrician or visit an emergency hospital immediately.'
  },
  {
    id: 'ai-3',
    category: 'ai-trackers',
    question: 'How do the Milestone Tracker and Vaccine Tracker work?',
    answer:
      'Both trackers are aligned with Indian Academy of Pediatrics (IAP), ICMR-NIN, and FSSAI guidelines. Milestone Tracker lets you filter by age stage and log motor, speech, cognitive, and social milestones along with an AI-generated Developmental Blueprint. Vaccine Tracker tracks scheduled, upcoming, completed, and custom vaccines with a printable / Save-as-PDF official Vaccine Card.'
  },
  {
    id: 'ai-4',
    category: 'ai-trackers',
    question: 'How does the Routine Checker help with daily toddler schedules?',
    answer:
      'Routine Checker provides age-calibrated Morning, Evening, and Bedtime checklists across infant-to-5-year brackets (0–6m, 6–12m, 1–2y, 2–3y, 3–4y, and 4–5y), automatically matched to your active child profile with your completed items saved for daily consistency.'
  },

  // ================= 2. PEDIATRIC CARE (ALL 4 FEATURES) =================
  {
    id: 'ped-1',
    category: 'pediatric-care',
    question: 'What are the 4 features included inside the Pediatric Care section?',
    answer:
      'The Pediatric Care hub brings together 4 tools in one place: (1) Consultations for locating nearby hospitals via Google Maps and scheduling Video or In-Clinic appointments (saved in Consultation History), (2) Live Sessions for browsing and registering for scheduled pediatric Q&A webinars, (3) 24/7 Doctor Chat for on-demand AI-assisted pediatric guidance (saved in Doctor Chat History), and (4) Growth Reports for printable / Save-as-PDF monthly summaries.'
  },
  {
    id: 'ped-2',
    category: 'pediatric-care',
    question: 'How do Consultations and Google Maps hospital lookup work?',
    answer:
      'In Consultations, you can choose your Indian State and City, search by hospital name or PIN/ZIP code (e.g., 560100), or click "Use My Live GPS Location" to view real hospitals on Google Maps, browse listed clinic specialists, and review saved Consultation History. Note: This site is currently a Pilot Version (not yet completely deployed to the market), so appointment booking confirmation runs in preview mode.'
  },
  {
    id: 'ped-3',
    category: 'pediatric-care',
    question: 'What happens in Live Sessions inside Pediatric Care?',
    answer:
      'Live Sessions showcases upcoming interactive pediatric webinar topics covering Nutrition, Sleep Science, Acute Care & Immunity, and Development, with date/slot filters and Q&A submission. Since this site is a Pilot Version not yet completely deployed to the market, live broadcasts run in pilot preview mode.'
  },
  {
    id: 'ped-4',
    category: 'pediatric-care',
    question: 'How does 24/7 Doctor Chat work for everyday child health questions?',
    answer:
      'Doctor Chat provides 24/7 AI-assisted pediatric guidance where you can describe non-emergency symptoms or everyday child health questions, receive structured care guidance in your preferred language, and revisit past threads anytime in Doctor Chat History.'
  },
  {
    id: 'ped-5',
    category: 'pediatric-care',
    question: 'What is included in Monthly Growth Reports?',
    answer:
      'Growth Reports compiles your active child’s profile details, developmental progress, and nutrition summary aligned with Indian IAP, ICMR-NIN, and FSSAI guidelines, with one-click Print / Save-as-PDF generation so you can easily carry it to your pediatrician.'
  },

  // ================= 3. AI NUTRICHEF & MEAL PLANNING =================
  {
    id: 'chef-1',
    category: 'ai-nutrichef',
    question: 'How does AI Recipe Maker create custom meals from ingredients at home?',
    answer:
      'Inside AI NutriChef, open AI Recipe Maker to select Child 1, Child 2, or General mode, type or dictate pantry items with Speak Ingredients, pick meal type, cooking time, servings, dietary preferences, and kitchen equipment, and generate 3 tailored recipes complete with prep steps, texture tips, and safety notes.'
  },
  {
    id: 'chef-2',
    category: 'ai-nutrichef',
    question: 'What recipes and Dietary Preferences does AI NutriChef support?',
    answer:
      'Nutritious Recipes inside AI NutriChef includes 300+ Indian & global dishes for ages 0 to 18 years (Veg, Eggitarian, and Non-Veg), filterable across 10 age stages, meal categories, keyword search, and Indian state/regional matching—with per-serving Calories, Protein, Iron, Calcium, Fiber, Carbs, Sodium, Salt, Sugar, and Fat. AI Recipe Maker also syncs with your saved Dietary Preferences, including Vegetarian, Vegan, Vegetarian + Eggs, Non-Vegetarian, Jain, Halal, Sattvic, foods to avoid, and allergies.'
  },
  {
    id: 'chef-3',
    category: 'ai-nutrichef',
    question: 'What is Stage Guidelines inside AI NutriChef?',
    answer:
      'Stage Guidelines breaks down recommended feeding consistencies, safe ingredient introductions, and age-appropriate meal progression across infant purees, soft mashes, toddler finger foods, and older children.'
  },
  {
    id: 'chef-4',
    category: 'ai-nutrichef',
    question: 'Are my custom AI Recipe Maker meals saved automatically?',
    answer:
      'Yes. Every 3-recipe batch generated by AI Recipe Maker is automatically saved to AI Recipe History, where you can reopen, search, filter, copy, print, or clear saved batches anytime.'
  },

  // ================= 4. FOODLENS AI, SAMPLE FOODS & DISH LOG =================
  {
    id: 'food-1',
    category: 'foodlens-nutrition',
    question: 'What is FoodLens AI and how does plate and food label scanning work?',
    answer:
      'FoodLens AI lets you capture a photo with your camera, upload a meal/package photo, or search foods via autocomplete. It analyzes the item for an overall Nutrition Score (out of 10), NOVA processing level, Calories, Protein, Fat, Sugar, Sodium, Fiber, baby-led weaning (BLW) & gum-pinch texture safety, and Indian ICMR-NIN / FSSAI alignment.'
  },
  {
    id: 'food-2',
    category: 'foodlens-nutrition',
    question: 'Does FoodLens AI check allergens, additives, and HFSS levels?',
    answer:
      'Yes. FoodLens AI flags High Fat, High Sugar, High Salt/Sodium (HFSS) warnings, hidden additives, and conflicts against your saved Dietary Preferences—including Milk/Dairy, Lactose, Egg, Peanut, Nuts, Wheat/Gluten, Soy, Sesame, Seafood, and rules like no chemicals, no artificial sweeteners, and no food coloring.'
  },
  {
    id: 'food-3',
    category: 'foodlens-nutrition',
    question: 'How do Sample Foods and Daily Dish Log work?',
    answer:
      'Sample Foods provides a searchable catalog of Indian baby foods and popular Indian packaged brands with interactive Nutrition Score details, camera/photo inspection, and 1x/2x serving comparison. Daily Dish Log lets you record what your child ate across meals, track reactions, and monitor daily nutrition totals.'
  },
  {
    id: 'food-4',
    category: 'foodlens-nutrition',
    question: 'Who has access to FoodLens AI and Sample Foods?',
    answer:
      'FoodLens AI and Sample Foods are open to preview in Free Guest Access and from the Home Landing Page. When you sign in with a personal account, FoodLens AI Pro and Sample Foods unlock with the Premium Plan.'
  },

  // ================= 5. NUTRIBAND SMART MONITOR =================
  {
    id: 'nb-1',
    category: 'nutriband',
    question: 'What is the NutriBand™ 3-in-1 Smart Monitor and what ages does it fit?',
    answer:
      'NutriBand™ is a modular 12g wearable telemetry sensor pod with 3 included wearing styles that grow with your child: a snap-on Diaper Clip for 0–12 months, Breathable Organic Cotton Cloth Straps in 3 sizes (Small 1–3y, Medium 4–7y, Large 8–10y) for 1–10 years, and a Soft Silicone Smart Band for kids 10+ years.'
  },
  {
    id: 'nb-2',
    category: 'nutriband',
    question: 'What 6 health and safety signals does NutriBand™ track?',
    answer:
      'The NutriBand™ dashboard previews 6 wellness signals: (1) Body Temperature (36.5°C–37.3°C normal baseline with >37.3°C fever elevation simulation), (2) Activity & Exertion, (3) Circadian Sleep & night wakings, (4) Movement & Impact (3-axis tumble, fall & stillness tracking), (5) Nutrient Absorption synced with FoodLens logs, and (6) GPS Safe Perimeter alerts. Because this site is a Pilot Version not yet completely deployed to the market, telemetry readings operate in preview simulation until physical hardware pairing is released.'
  },
  {
    id: 'nb-3',
    category: 'nutriband',
    question: 'What comes in the Starter Kit, and is hardware included in the Premium subscription?',
    answer:
      'No—the physical hardware kit is listed separately at ₹1,499 (incl. taxes), while NutriBand™ dashboard features unlock with the Premium Plan (and are open to preview in Free Guest Access). Note: This site is currently a Pilot Version and not yet completely deployed to the market—hardware kit checkout runs in preview mode without real payment or physical dispatch. The planned kit includes the sensor pod, diaper clip, 3 cotton straps (Small, Medium, Large), silicone band, USB magnetic charger, and storage box.'
  },
  {
    id: 'nb-4',
    category: 'nutriband',
    question: 'Is the NutriBand™ sensor designed for sensitive baby and toddler skin?',
    answer:
      'Yes. The sensor pod uses a smooth rounded hypoallergenic medical polymer backplate, is IP67 splash- and drool-resistant, uses ultra-low-energy BLE 5.3 connectivity, and is completely BPA-, phthalate-, lead-, and latex-free.'
  },

  // ================= 6. COMMUNITY HELP & PARENT CONNECT =================
  {
    id: 'cc-1',
    category: 'community-connect',
    question: 'How do Community Help and Parent Connect work together?',
    answer:
      'Community Help is a structured, topic-tagged parenting forum where you can ask questions, read replies, and share experiences, while Parent 1:1 Connect lets you search for fellow parents and message peer-to-peer directly.'
  },
  {
    id: 'cc-2',
    category: 'community-connect',
    question: 'What topics can I browse or filter in Community Help?',
    answer:
      'Community Help supports filtering and AI Auto-Tagging across #Education, #Health, #Milestones, #Nutrition, #Playtime, #PottyTraining, #Routine, #Safety, #Sleep, and #Tantrums, along with keyword search.'
  },
  {
    id: 'cc-3',
    category: 'community-connect',
    question: 'How are Community Help and Parent Connect kept safe and private?',
    answer:
      'Posts and replies run through AI Community Safety Moderation to block personal contact details, unsafe medical advice, and inappropriate content in line with our Community Guidelines. Your children’s private trackers and dietary/health logs stay completely separate from public posts.'
  },
  {
    id: 'cc-4',
    category: 'community-connect',
    question: 'Can guests browse Community Help and Parent Connect?',
    answer:
      'Yes. You can read discussions in Community Help and explore Parent Connect right away, and creating a personal account via Create Account lets you publish posts, reply, and message under your own parent identity.'
  },

  // ================= 7. TODDLER LEARNING & BABY STORE =================
  {
    id: 'lc-1',
    category: 'learning-community',
    question: 'What learning modules are included in Toddler Academy?',
    answer:
      'Toddler Academy includes 10 interactive, voice-guided modules (with a quick Voice On/Off toggle): Habit Timers (Potty, Brush, Wash & Bath), Numbers (Talking Math & Calculator), Counting, First Words (100 Essential Words), Sentence Builder (A–Z Phonics & Words), Colors, Emotions, Body Parts, Shapes, and Animal Sounds.'
  },
  {
    id: 'lc-2',
    category: 'learning-community',
    question: 'What content is available in Toddler Tales and Toddler TV?',
    answer:
      'Toddler Tales offers in-depth expert parenting articles across Mealtime, Development, Sleep Tips, Tantrums, Potty Training, and Learning with bookmarking and sharing. Toddler TV features a curated, ad-free library of parenting and toddler development videos organized by Sleep & Naps, Tantrums & Discipline, Speech & Language, Potty Training, Play & Activities, and Nutrition & Food with key takeaways.'
  },
  {
    id: 'lc-3',
    category: 'learning-community',
    question: 'What products and delivery options are in the Baby Store?',
    answer:
      'The Baby Store features essentials across Under ₹200, Clothing & Bedding, Diapering & Bathing, Feeding & Gear, and Toys & Play, filterable by age from 0–6 months up to 3+ years, with Cart management, Saved for Later, gift tagging, pincode check, and checkout selection. Because this site is currently a Pilot Version and not yet completely deployed to the market, Baby Store orders and checkout flows run in preview mode with no real payment or shipping fulfillment yet.'
  },

  // ================= 8. PLANS, PRIVACY & SETTINGS =================
  {
    id: 'ps-1',
    category: 'plans-settings',
    question: 'What is included in the Free Plan vs. the Premium Plan?',
    answer:
      'The Free Plan (₹0 forever) includes AI Parenting Assistant, Milestone Tracker, Routine Checker, Vaccine Tracker, AI NutriChef & AI Recipe Maker, Pediatric Care, Toddler Academy, Toddler Tales, Toddler TV, Community Help, Parent Connect, Baby Store, and 12 Indian languages. Upgrading to the Premium Plan (₹499/month or ₹4,999/year in pilot preview checkout) unlocks FoodLens AI Pro, Sample Foods, and NutriBand™ dashboard views for signed-in accounts.'
  },
  {
    id: 'ps-2',
    category: 'plans-settings',
    question: 'How does Free Guest Access differ from creating a personal account?',
    answer:
      'Clicking Free Guest Access lets you explore all features immediately—including previews of FoodLens AI and NutriBand™—with a pre-configured sample family profile (Parent, Child 1 & Child 2) and no email required. Creating a personal account via Create Account saves your own private family profiles, tracks your personal Free or Premium plan, and enables email password recovery.'
  },
  {
    id: 'ps-3',
    category: 'plans-settings',
    question: 'Can I manage two children and customized Dietary Preferences under one account?',
    answer:
      'Yes. Both Profile Settings and Dietary Preferences support Child 1 and Child 2 with one-click switching (or marking Child 2 as Not Applicable). You can configure Diet Type, Religious/Cultural rules (Jain, Halal, Sattvic), Foods to Avoid, Allergies/Intolerances, Feeding Styles, and Custom AI Instructions per setup.'
  },
  {
    id: 'ps-4',
    category: 'plans-settings',
    question: 'Which Indian regional languages are supported?',
    answer:
      'Tricky Toddlers supports 12 languages: English, Hindi (हिन्दी), Tamil (தமிழ்), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Marathi (मराठी), Gujarati (ગુજરાતી), Bengali (বাংলা), Punjabi (ਪੰਜਾਬੀ), Assamese (অসমীয়া), and Odia (ଓଡ଼ିଆ).'
  },
  {
    id: 'ps-5',
    category: 'plans-settings',
    question: 'Who owns my child’s data, and how can I export or manage privacy settings?',
    answer:
      'You retain full control of your family’s data. Inside Profile Settings, you can export your records as a JSON file, print/save a Pediatrician Health Summary PDF, set data retention preferences, and manage DPDP Act 2023 Verifiable Parental Consent & Grievance tickets. Note: This site is currently a Pilot Version (not yet completely deployed to the market), and self-service Delete controls are displayed in UI preview only without erasing account records.'
  },
  {
    id: 'ps-6',
    category: 'plans-settings',
    question: 'How do I create an account, reset a forgotten password, or contact support?',
    answer:
      'Click Create Account and enter a valid Email ID, unique Username (3–25 characters), and Password. If you forget your password, click "Forgot Password?" on the Sign In screen to send a password reset link to your registered email address, or reach our team via Contact & Feedback or support@trickytoddlers.com.'
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
            <div className="mt-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs sm:text-sm font-semibold">
              Pilot Version Notice: This site is currently a pilot version and is not yet completely deployed to the market. Live commerce checkouts, hardware reservations, and simulated clinical previews operate in pilot mode.
            </div>
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
            Switch to &ldquo;All Categories&rdquo; to browse all {ALL_FAQ_ITEMS.length} questions.
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
