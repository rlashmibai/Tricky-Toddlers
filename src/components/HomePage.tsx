import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Baby, 
  Activity, 
  Camera, 
  Clock, 
  Utensils, 
  Stethoscope, 
  Palette, 
  Tv, 
  ShoppingBag, 
  MessageCircle, 
  Users, 
  ShieldCheck, 
  Shield,
  Lock, 
  Scale, 
  Eye, 
  HeartPulse, 
  Check, 
  ArrowRight, 
  Zap, 
  Crown, 
  Layers,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  ShieldAlert,
  Syringe,
  MessageSquare,
  FileText,
  Compass,
  Languages,
  UserPlus,
  LogIn
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import { useLanguage, LanguageCode } from '../lib/LanguageContext';
import { useAuth } from '../lib/AuthContext';

interface HomePageProps {
  onNavigate: (tab: string, subTab?: string) => void;
  onOpenStore?: (view?: 'catalog' | 'cart') => void;
  onOpenUpgrade?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  onNavigate, 
  onOpenStore,
  onOpenUpgrade 
}) => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { isSessionActive, setSessionActive, loginAsGuest } = useAuth();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [premiumActivated] = useState<boolean>(() => {
    return localStorage.getItem('tricky_toddlers_premium_unlocked') === 'true' || localStorage.getItem('user_plan') === 'comprehensive' || localStorage.getItem('user_plan') === 'essential';
  });

  const handleEnterAsGuest = async () => {
    playSound('glass');
    setLanguage('en');
    setSessionActive(true);
    localStorage.removeItem('user_logged_out');
    if (!localStorage.getItem('parent_name')) localStorage.setItem('parent_name', 'Lashmi');
    if (!localStorage.getItem('baby_name')) localStorage.setItem('baby_name', 'Ashwath');
    try {
      await loginAsGuest();
    } catch (err) {
      console.warn('Guest access initialized:', err);
    }
  };

  const handleGoToUpgradePlans = () => {
    playSound('glass');
    navigate('/profile?tab=plans');
  };

  // Concise list of all core features matching the exact order of the top menu bar
  const allFeatures = [
    {
      id: 'ai',
      name: 'AI Assistant',
      category: 'care',
      tag: 'Personalised Guidance',
      desc: 'Evidence-based advice for tantrums, sleep and behavior.',
      icon: Sparkles,
      color: 'from-amber-400 to-yellow-500',
      textColor: 'text-amber-300',
      bgColor: 'bg-amber-400/10 border-amber-400/25',
      badge: 'Core AI'
    },
    {
      id: 'milestones',
      name: 'Milestone Tracker',
      category: 'learning',
      tag: 'WHO, Indian IAP & FSSAI Standards',
      desc: 'Monitor developmental leaps, motor skills and speech growth.',
      icon: Baby,
      color: 'from-blue-400 to-indigo-500',
      textColor: 'text-blue-300',
      bgColor: 'bg-blue-400/10 border-blue-400/25',
      badge: 'Growth Log'
    },
    {
      id: 'routine',
      name: 'Routine Checker',
      category: 'care',
      tag: 'Daily Schedules & Sleep',
      desc: 'Plan nap routines, bedtime habits and healthy day-to-day schedules.',
      icon: Clock,
      color: 'from-yellow-400 to-amber-500',
      textColor: 'text-yellow-300',
      bgColor: 'bg-yellow-400/10 border-yellow-400/25',
      badge: 'Habit Builder'
    },
    {
      id: 'vaccine',
      name: 'Vaccine Tracker',
      category: 'care',
      tag: 'Universal Immunization',
      desc: 'WHO, Indian IAP & FSSAI schedules, dose milestone alerts, and verified records.',
      icon: Syringe,
      color: 'from-teal-400 to-cyan-500',
      textColor: 'text-teal-300',
      bgColor: 'bg-teal-400/10 border-teal-400/25',
      badge: 'Immunization'
    },
    {
      id: 'food',
      name: 'AI NutriChef',
      category: 'care',
      tag: 'Kitchen Assistant',
      desc: '250+ age-matched Indian recipes & custom ingredient cooker for all ages.',
      icon: Utensils,
      color: 'from-green-400 to-emerald-500',
      textColor: 'text-green-300',
      bgColor: 'bg-green-400/10 border-green-400/25',
      badge: 'AI KITCHEN'
    },
    {
      id: 'videos',
      name: 'Toddler TV',
      category: 'learning',
      tag: 'Safe Screen-Time',
      desc: 'Curated educational videos, rhymes and calm bedtime stories.',
      icon: Tv,
      color: 'from-purple-400 to-indigo-500',
      textColor: 'text-purple-300',
      bgColor: 'bg-purple-400/10 border-purple-400/25',
      badge: 'Curated TV'
    },
    {
      id: 'pediatric-consults',
      targetTab: 'pediatric',
      subTab: 'consults',
      name: 'Pediatric Care',
      category: 'care',
      tag: 'Qualified pediatrician network',
      desc: 'Book 1:1 telehealth appointments and clinic visits with qualified pediatricians in our partner network.',
      icon: Stethoscope,
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-300',
      bgColor: 'bg-blue-500/10 border-blue-500/30',
      badge: 'Clinical'
    },
    {
      id: 'pediatric-live',
      targetTab: 'pediatric',
      subTab: 'live',
      name: 'Live Sessions',
      category: 'care',
      tag: 'Weekly interactive Q&A',
      desc: 'Interactive weekly webinars and live Q&A sessions with pediatric specialists.',
      icon: Tv,
      color: 'from-indigo-500 to-purple-600',
      textColor: 'text-indigo-300',
      bgColor: 'bg-indigo-500/10 border-indigo-500/30',
      badge: 'Webinars'
    },
    {
      id: 'pediatric-chat',
      targetTab: 'pediatric',
      subTab: 'chat',
      name: 'Doctor Chat',
      category: 'care',
      tag: 'On-demand support via chat',
      desc: 'Direct on-demand clinical chat support for everyday toddler health advice.',
      icon: MessageSquare,
      color: 'from-sky-500 to-blue-600',
      textColor: 'text-sky-300',
      bgColor: 'bg-sky-500/10 border-sky-500/30',
      badge: '24/7 Chat'
    },
    {
      id: 'pediatric-reports',
      targetTab: 'pediatric',
      subTab: 'reports',
      name: 'Growth Reports',
      category: 'care',
      tag: 'Monthly development PDF',
      desc: 'Monthly developmental progress summaries, WHO, Indian IAP & FSSAI percentiles and exportable PDFs.',
      icon: FileText,
      color: 'from-teal-500 to-cyan-600',
      textColor: 'text-teal-300',
      bgColor: 'bg-teal-500/10 border-teal-500/30',
      badge: 'WHO, IAP & FSSAI'
    },
    {
      id: 'learning',
      name: 'Toddler Academy',
      category: 'learning',
      tag: 'Montessori Games',
      desc: 'Interactive sensory games, spelling, colors and cognitive quests.',
      icon: Palette,
      color: 'from-pink-400 to-rose-500',
      textColor: 'text-pink-300',
      bgColor: 'bg-pink-400/10 border-pink-400/25',
      badge: 'Academy'
    },
    {
      id: 'store',
      name: 'Baby Store',
      category: 'care',
      tag: 'Curated Essentials',
      desc: 'BPA-free feeding sets, NutriBand kits and organic essentials.',
      icon: ShoppingBag,
      color: 'from-emerald-400 to-teal-400',
      textColor: 'text-emerald-300',
      bgColor: 'bg-emerald-400/10 border-emerald-400/25',
      badge: 'Gear Store'
    },
    {
      id: 'community',
      name: 'Community Help',
      category: 'community',
      tag: 'Parent Forums',
      desc: 'Browse crowdsourced advice, pediatrician notes and stories.',
      icon: Users,
      color: 'from-teal-400 to-cyan-500',
      textColor: 'text-teal-300',
      bgColor: 'bg-teal-400/10 border-teal-400/25',
      badge: 'Forums'
    },
    {
      id: 'chat',
      name: 'Parent Connect',
      category: 'community',
      tag: 'Real-Time Chat',
      desc: 'Connect with fellow parents facing similar toddler milestones.',
      icon: MessageCircle,
      color: 'from-indigo-400 to-violet-500',
      textColor: 'text-indigo-300',
      bgColor: 'bg-indigo-400/10 border-indigo-400/25',
      badge: 'Live Chat'
    },
    {
      id: 'foodlens',
      name: 'FoodLens Pro',
      category: 'care',
      tag: 'Vision Nutrition',
      desc: 'Instant camera plate scan checking food textures and allergens.',
      icon: Camera,
      color: 'from-emerald-400 to-teal-500',
      textColor: 'text-emerald-300',
      bgColor: 'bg-emerald-400/10 border-emerald-400/25',
      badge: 'PREMIUM'
    },
    {
      id: 'nutriband',
      name: 'NutriBand™ Monitor',
      category: 'care',
      tag: 'Hardware Telemetry',
      desc: 'Cordless diaper clip and wristband tracking sleep and temperature.',
      icon: Activity,
      color: 'from-cyan-400 to-teal-400',
      textColor: 'text-cyan-300',
      bgColor: 'bg-cyan-400/10 border-cyan-400/25',
      badge: 'PREMIUM'
    }
  ];

  // Comprehensive Responsible AI Architecture: 9 Pillars
  const responsibleAIPrinciples = [
    {
      title: 'Fairness',
      subtitle: 'Advice for Every Family',
      badge: 'Inclusive Care',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      icon: Scale,
      color: 'from-blue-900/30 via-indigo-900/20 to-slate-900/40',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/15 border-blue-400/30',
      howWeApply: 'Works fairly for all families, whether your baby eats vegetarian, vegan, or traditional home-cooked meals, and in 12 major Indian languages (English, Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, etc.).'
    },
    {
      title: 'Transparency',
      subtitle: 'Clear Explanations You Can Trust',
      badge: 'Open & Clear',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      icon: Eye,
      color: 'from-amber-900/30 via-yellow-900/20 to-slate-900/40',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/15 border-amber-400/30',
      howWeApply: 'Every meal recommendation and sleep suggestion explains clearly why it helps your baby, backed by trusted health organizations (WHO, Indian IAP and FSSAI).'
    },
    {
      title: 'Accountability',
      subtitle: 'Clinician-Reviewed Content',
      badge: 'Clinician Reviewed',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      icon: ShieldCheck,
      color: 'from-emerald-900/30 via-teal-900/20 to-slate-900/40',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/15 border-emerald-400/30',
      howWeApply: 'Our pediatric content, safety rules, and clinical frameworks are reviewed by qualified healthcare professionals to ensure all automated guidance stays safe, sound, and responsible.'
    },
    {
      title: 'Privacy',
      subtitle: 'Your Family Privacy First',
      badge: 'Zero Ad Selling',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      icon: Lock,
      color: 'from-purple-900/30 via-pink-900/20 to-slate-900/40',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/15 border-purple-400/30',
      howWeApply: 'Your child’s photos, meals, and health logs are strictly private. We will never sell or share your family’s information with advertisers.'
    },
    {
      title: 'Security',
      subtitle: 'Bank-Grade Data Protection',
      badge: 'Strong Encryption',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
      icon: Shield,
      color: 'from-cyan-900/30 via-blue-900/20 to-slate-900/40',
      borderColor: 'border-cyan-500/30',
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/15 border-cyan-400/30',
      howWeApply: 'All baby monitor readings and health notes are locked with strong encryption so only you and your family can see them.'
    },
    {
      title: 'Reliability and Safety',
      subtitle: 'Emergency Care Alerts',
      badge: 'Safety Guardrails',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
      icon: HeartPulse,
      color: 'from-rose-900/30 via-red-900/20 to-slate-900/40',
      borderColor: 'border-rose-500/30',
      iconColor: 'text-rose-400',
      iconBg: 'bg-rose-500/15 border-rose-400/30',
      howWeApply: 'If you ever mention serious symptoms like high fever or trouble breathing, our app immediately shows emergency hotline numbers and directs you to a hospital.'
    },
    {
      title: 'Bias',
      subtitle: 'Fair Advice for All Cultures',
      badge: 'Zero Favoritism',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
      icon: Scale,
      color: 'from-indigo-900/30 via-blue-900/20 to-slate-900/40',
      borderColor: 'border-indigo-500/30',
      iconColor: 'text-indigo-400',
      iconBg: 'bg-indigo-500/15 border-indigo-400/30',
      howWeApply: 'Our advice is tested to avoid favoritism or stereotypes, supporting traditional Indian baby care alongside modern pediatric practices.'
    },
    {
      title: 'Compliance',
      subtitle: 'Following Official Standards',
      badge: 'Doctor Approved',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
      icon: ShieldCheck,
      color: 'from-teal-900/30 via-emerald-900/20 to-slate-900/40',
      borderColor: 'border-teal-500/30',
      iconColor: 'text-teal-400',
      iconBg: 'bg-teal-500/15 border-teal-400/30',
      howWeApply: 'Built strictly to match WHO, Indian IAP and FSSAI feeding, nutrition and growth milestones, keeping every stage safe.'
    },
    {
      title: 'Data Protection',
      subtitle: 'You Own Your Baby’s Data',
      badge: 'Your Data Stays Yours',
      badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/30',
      icon: Lock,
      color: 'from-fuchsia-900/30 via-purple-900/20 to-slate-900/40',
      borderColor: 'border-fuchsia-500/30',
      iconColor: 'text-fuchsia-400',
      iconBg: 'bg-fuchsia-500/15 border-fuchsia-400/30',
      howWeApply: 'Your baby’s sleep logs, meal photos, and growth charts are kept confidential and safe. You can delete or export them anytime.'
    }
  ];

  const indianLanguagesList: Array<{ code: LanguageCode; name: string; local: string }> = [
    { code: 'hi', name: 'Hindi', local: 'हिन्दी' },
    { code: 'en', name: 'English', local: 'English' },
    { code: 'ta', name: 'Tamil', local: 'தமிழ்' },
    { code: 'te', name: 'Telugu', local: 'తెలుగు' },
    { code: 'kn', name: 'Kannada', local: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', local: 'മലയാളം' },
    { code: 'mr', name: 'Marathi', local: 'मराठी' },
    { code: 'bn', name: 'Bengali', local: 'বাংলা' },
    { code: 'gu', name: 'Gujarati', local: 'ગુજરાતી' },
    { code: 'pa', name: 'Punjabi', local: 'ਪੰਜਾਬੀ' },
    { code: 'as', name: 'Assamese', local: 'অসমীয়া' },
    { code: 'or', name: 'Odia', local: 'ଓଡ଼ିଆ' }
  ];

  return (
    <div className="space-y-10 sm:space-y-14 py-2 sm:py-3 max-w-7xl mx-auto">
      
      {/* =========================================================
          HERO BANNER: PARENTING TODDLERS JUST GOT EASIER
      ========================================================== */}
      <section id="home-top" className="relative overflow-hidden rounded-3xl sm:rounded-[2.25rem] border border-white/15 bg-gradient-to-b from-[#0f172a]/95 via-[#0d1527]/90 to-[#070b14]/95 p-4 sm:p-6 lg:p-7 shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs sm:text-sm font-bold tracking-wide shadow-inner text-balance">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>The One Stop Solution to All Your Parenting Needs</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight py-0.5 text-balance">
            <span className="block sm:inline">Parenting Little Ones </span>
            <span className="bg-gradient-to-r from-amber-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent inline-block px-2 pt-0.5 pb-0.5">
              Just Got Easier
            </span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-300 w-full max-w-3xl mx-auto px-2 font-normal leading-relaxed text-balance">
            The all-in-one parenting co-pilot that decodes nutrition, crafts personalized AI recipes, provides certified parenting guidance, and puts trusted pediatric doctors just a tap away  -  all integrated in one ecosystem.
          </p>

          {/* Customer Journey In-Page Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1 max-w-6xl mx-auto">
            <a
              href="#vision"
              onClick={() => playSound('glass')}
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/35 text-purple-200 hover:text-white font-bold text-xs sm:text-sm tracking-tight transition-all transform hover:scale-[1.02] active:scale-95 flex items-center gap-1.5 shadow-md whitespace-nowrap"
            >
              <Eye className="w-3.5 h-3.5 text-purple-300 shrink-0" />
              <span className="notranslate" translate="no">{t('whyTrickyToddlers') || 'Why Tricky Toddlers'}</span>
            </a>

            <a
              href="#problem-and-mission"
              onClick={() => playSound('pop')}
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/35 text-amber-200 hover:text-white font-bold text-xs sm:text-sm tracking-tight transition-all transform hover:scale-[1.02] active:scale-95 flex items-center gap-1.5 shadow-md whitespace-nowrap"
            >
              <Compass className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="notranslate" translate="no">{t('whyChooseUs') || 'Why Choose Us?'}</span>
            </a>

            <a
              href="#features-directory"
              onClick={() => playSound('pop')}
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white font-black text-xs sm:text-sm tracking-tight shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span className="notranslate" translate="no">{t('exploreFeatures') || 'Explore Features'}</span>
            </a>

            <a
              href="#child-wellness-journey"
              onClick={() => playSound('glass')}
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/35 text-cyan-200 hover:text-white font-bold text-xs sm:text-sm tracking-tight transition-all transform hover:scale-[1.02] active:scale-95 flex items-center gap-1.5 shadow-md whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
              <span className="notranslate" translate="no">{t('howItWorks') || 'How It Works'}</span>
            </a>

            <a
              href="#responsible-ai"
              onClick={() => playSound('glass')}
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm tracking-tight transition-all transform hover:scale-[1.02] active:scale-95 flex items-center gap-1.5 shadow-md whitespace-nowrap"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="notranslate" translate="no">{t('responsibleAI') || 'Responsible AI'}</span>
            </a>

            <a
              href="#premium-plans"
              onClick={() => playSound('glass')}
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/35 text-amber-300 hover:text-white font-bold text-xs sm:text-sm tracking-tight transition-all transform hover:scale-[1.02] active:scale-95 flex items-center gap-1.5 shadow-md whitespace-nowrap cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="notranslate" translate="no">{t('premiumFeatures') || 'Premium Features'}</span>
            </a>
          </div>

          {/* Quick 5 Stats Bar */}
          <div className="pt-2 sm:pt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5 max-w-5xl mx-auto text-left">
            <a
              href="#features-directory"
              onClick={() => playSound('pop')}
              className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber-400/40 transition-all block group cursor-pointer"
            >
              <div className="text-base sm:text-xl font-black text-amber-300 group-hover:text-amber-200 transition-colors">16-in-1</div>
              <div className="text-[10px] sm:text-xs text-slate-300 font-medium">Parenting tools</div>
            </a>
            <a 
              href="#indian-languages"
              onClick={() => playSound('glass')}
              className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-400/40 transition-all block group cursor-pointer"
            >
              <div className="text-base sm:text-xl font-black text-cyan-300 group-hover:text-cyan-200 transition-colors">12</div>
              <div className="text-[10px] sm:text-xs text-slate-300 font-medium">Major Indian Languages</div>
            </a>
            <button 
              type="button"
              onClick={() => {
                playSound('glass');
                onNavigate('ai');
              }}
              className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-400/40 transition-all text-left block group cursor-pointer w-full"
            >
              <div className="text-base sm:text-xl font-black text-emerald-300 group-hover:text-emerald-200 transition-colors">24/7 Access</div>
              <div className="text-[10px] sm:text-xs text-slate-300 font-medium">Anytime guidance</div>
            </button>
            <a 
              href="#responsible-ai"
              onClick={() => playSound('glass')}
              className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-pink-400/40 transition-all block group cursor-pointer"
            >
              <div className="text-base sm:text-xl font-black text-pink-300 group-hover:text-pink-200 transition-colors">AI-Assisted</div>
              <div className="text-[10px] sm:text-xs text-slate-300 font-medium">Safety/Privacy first</div>
            </a>
            <a 
              href="#problem-and-mission"
              onClick={() => playSound('glass')}
              className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-purple-400/40 transition-all block group cursor-pointer col-span-2 sm:col-span-1 lg:col-span-1"
            >
              <div className="text-base sm:text-xl font-black text-purple-300 group-hover:text-purple-200 transition-colors">Personalised</div>
              <div className="text-[10px] sm:text-xs text-slate-300 font-medium">Child profile calibrated</div>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================
          1. GUIDING VISION / WHY TRICKY TODDLERS
      ========================================================== */}
      <section id="vision" className="space-y-4 rounded-3xl sm:rounded-[2.25rem] border border-purple-500/25 bg-gradient-to-br from-[#120d2b] via-[#0d0920] to-[#080514] p-5 sm:p-8 lg:p-10 shadow-2xl text-left scroll-mt-20 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-3.5 w-full">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-purple-300 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30">
            <Eye className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Guiding Vision</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Why <span className="notranslate" translate="no">Tricky Toddlers</span>
          </h2>

          <div className="text-lg sm:text-xl font-bold text-purple-200 tracking-tight leading-snug">
            “Less juggling apps, more caring.”
          </div>

          <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed font-normal w-full max-w-none text-left">
            Technology should quietly handle the clutter in the background, so parents can spend less time managing apps, reminders and scattered information, and more time enjoying the beautiful, funny and precious moments with their toddlers.
          </p>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-purple-500/10 border border-purple-500/25 w-full">
            <p className="text-xs sm:text-sm md:text-base text-purple-200 font-semibold leading-relaxed">
              <span className="notranslate" translate="no">Tricky Toddlers</span> is not about adding more technology to parenting. It is about making technology work for parents.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. PROBLEM STATEMENT & OUR MISSION / WHY CHOOSE US
      ========================================================== */}
      <section id="problem-and-mission" className="space-y-6 rounded-3xl sm:rounded-[2.25rem] border border-amber-500/25 bg-gradient-to-br from-[#161208] via-[#0e172a] to-[#070b15] p-5 sm:p-8 lg:p-10 shadow-2xl text-left scroll-mt-20 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            What Makes <span className="notranslate" translate="no">Tricky Toddlers</span> Different?
          </h2>

          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25">
            <p className="text-sm sm:text-base md:text-lg font-bold text-amber-200 leading-snug">
              “The problem is not a lack of information. The problem is scattered information.”
            </p>
          </div>

          <div className="space-y-4 pt-1">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>What Makes <span className="notranslate" translate="no">Tricky Toddlers</span> Different?</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-start gap-3 hover:border-amber-400/30 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 shadow-sm">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">16-in-1 Parenting Tools in One Ecosystem</h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-0.5 leading-relaxed">
                    Nutrition, sleep telemetry, vaccine schedules, milestone checklists, and tantrum coaching connected together instead of split across multiple apps.
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-start gap-3 hover:border-amber-400/30 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 shadow-sm">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">24/7 Availability for Everyday Questions</h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-0.5 leading-relaxed">
                    Always ready at 2 AM or during a busy dinner when you need immediate guidance without waiting or searching random websites.
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-start gap-3 hover:border-amber-400/30 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
                  <Baby className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">Fine-Tuned AI Specially Designed for Toddlers</h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-0.5 leading-relaxed">
                    <span className="notranslate" translate="no">Tricky Toddlers</span> is calibrated for parents of toddlers, using pediatric guidance and recognised health standards (IAP, FSSAI &amp; ICMR).
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-start gap-3 hover:border-amber-400/30 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">Real-Time Decision Support When Parents Need</h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-0.5 leading-relaxed">
                    Immediate step-by-step assistance when a meltdown happens, when introducing a new food, or when checking a rash.
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-500/30 md:col-span-2 flex items-start gap-3 shadow-md">
                <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">Personalisation Based on Each Child’s Profile</h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-0.5 leading-relaxed">
                    All you have to do is create your child’s profile with details like age, language and dietary preferences, select your plan, and start using it as your parenting partner.
                  </p>
                </div>
              </div>
            </div>

            {/* Moved below Personalisation Based on Each Child’s Profile */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25">
              <p className="text-sm sm:text-base md:text-lg font-bold text-amber-200 leading-snug text-balance">
                “Parents Don't Need More Information. They Need the Right Information at the Right Time.”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. ALL FEATURES DIRECTORY
      ========================================================== */}
      <section id="features-directory" className="space-y-6 scroll-mt-20">
        <div className="border-b border-white/10 pb-5">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-cyan-400 mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>16-in-1 Feature Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight text-balance">
            All Features at a Glance
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed text-balance">
            Click anywhere on any feature card below to open and use it immediately.
          </p>
        </div>

        {/* Feature Grid: Clean, Compact, 16 Integrated Features in 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {allFeatures.map((feat) => {
            const Icon = feat.icon;
            const isPremiumBadge = feat.badge === 'PREMIUM';
            return (
              <motion.button
                key={feat.id}
                type="button"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playSound('glass');
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  document.documentElement.scrollTop = 0;
                  document.body.scrollTop = 0;
                  if (feat.id === 'store' && onOpenStore) {
                    onOpenStore('catalog');
                  } else {
                    onNavigate((feat as any).targetTab || feat.id, (feat as any).subTab);
                  }
                  requestAnimationFrame(() => {
                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                  });
                }}
                className={`group relative p-5 rounded-2xl border transition-all cursor-pointer text-left backdrop-blur-md ${feat.bgColor} hover:border-white/40 shadow-lg flex flex-col justify-between w-full focus:outline-none focus:ring-2 focus:ring-cyan-400/50`}
              >
                <div className="w-full">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center text-slate-950 shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isPremiumBadge ? (
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-black shadow-sm flex items-center gap-1 font-sans tracking-wider">
                        <Sparkles className="w-2.5 h-2.5 fill-black shrink-0" />
                        PREMIUM
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/15">
                        {feat.badge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                      <span>{feat.name}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <div className="text-[11px] font-semibold text-slate-400 tracking-wide">
                      {feat.tag}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pt-1">
                      {feat.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-white transition-colors w-full">
                  <span className="font-semibold tracking-wide">Open {feat.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          4. HOW IT WORKS · CHILD WELLNESS JOURNEY
      ========================================================== */}
      <section id="child-wellness-journey" className="space-y-6 rounded-[2.5rem] border border-white/15 bg-gradient-to-b from-[#0c1322] via-[#090e1a] to-[#050810] p-6 sm:p-10 shadow-2xl text-left scroll-mt-20">
        <div className="w-full space-y-2 text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-cyan-400">
            <Sparkles className="w-4 h-4" />
            <span>Connected Health Ecosystem</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight text-balance">
            How It Works
          </h2>
        </div>

        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/95 shadow-xl max-w-6xl mx-auto flex items-center justify-center p-2 sm:p-4">
          <img 
            src="/child-wellness-journey.svg" 
            alt="Child Wellness Journey - A Brighter Tomorrow: 1 Register, 2 Collect, 3 Analyse, 4 Personalise, 5 Alert, 6 Monitor"
            className="w-full h-auto object-contain rounded-2xl shadow"
          />
        </div>
      </section>

      {/* =========================================================
          5. SPEAKING THE LANGUAGE OF INDIAN FAMILIES
      ========================================================== */}
      <section id="indian-languages" className="space-y-5 rounded-3xl sm:rounded-[2.25rem] border border-cyan-500/25 bg-gradient-to-br from-[#0c142b] via-[#091122] to-[#050a16] p-5 sm:p-8 lg:p-10 shadow-2xl text-left scroll-mt-20 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-cyan-300 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-balance">
            <Languages className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Speaking the Language of Indian Families</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug text-balance">
            <span className="notranslate" translate="no">Tricky Toddlers</span> speaks the language of Indian families.
          </h2>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-pink-500/15 border border-amber-400/30 shadow-md">
            <div className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-300 mb-0.5 text-balance">
              Core Architectural Anchor
            </div>
            <div className="text-sm sm:text-base font-black text-white text-balance">
              One Child Profile · One Integrated Ecosystem - Personalised Guidance
            </div>
          </div>

          {/* Supported Indian Languages Badges Grid (Click any language to switch immediately) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-1">
            {indianLanguagesList.map((l) => (
              <button
                type="button"
                key={l.code}
                onClick={() => {
                  playSound('glass');
                  setLanguage(l.code);
                }}
                className={`px-3 py-2.5 rounded-xl border text-center transition-all shadow-sm cursor-pointer active:scale-95 ${
                  language === l.code
                    ? 'bg-cyan-500/25 border-cyan-400 text-white shadow-cyan-500/20'
                    : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-cyan-400/40'
                }`}
              >
                <div className="notranslate text-sm sm:text-base font-bold text-white" translate="no">{l.local}</div>
                <div className="notranslate text-[10px] text-cyan-300 uppercase tracking-wider font-semibold font-mono mt-0.5" translate="no">{l.name}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          6. HOW RESPONSIBLE AI IS BUILT INTO TRICKY TODDLERS
      ========================================================== */}
      <section id="responsible-ai" className="space-y-8 rounded-[2.5rem] border border-white/15 bg-gradient-to-b from-[#0c1322] via-[#090e1a] to-[#050810] p-6 sm:p-10 shadow-2xl scroll-mt-20">
        <div className="w-full space-y-2 text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-400 text-balance">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Safety, Trust &amp; Ethics First</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight text-balance">
            How Responsible AI is Built into <span className="notranslate" translate="no">Tricky Toddlers</span>
          </h2>
        </div>

        {/* Responsible AI Principles Grid (All 9 Pillars) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {responsibleAIPrinciples.map((prin) => {
            const Icon = prin.icon;
            return (
              <div 
                key={prin.title}
                className={`p-6 sm:p-8 rounded-3xl border ${prin.borderColor} bg-gradient-to-br ${prin.color} backdrop-blur-md flex flex-col justify-between text-left shadow-xl hover:border-white/40 transition-all group`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${prin.iconBg} border flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${prin.iconColor}`} />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-black tracking-wide border ${prin.badgeColor}`}>
                      {prin.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight text-balance">
                      {prin.title}
                    </h3>
                    <p className="text-xs font-bold text-slate-300 mt-0.5 text-balance">
                      {prin.subtitle}
                    </p>
                  </div>

                  <p className="text-slate-200 text-sm leading-relaxed font-normal pt-2 border-t border-white/10 text-balance">
                    {prin.howWeApply}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clinical Guardrails Banner */}
        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed text-balance">
              <strong className="text-white font-bold block mb-0.5">Clinical Red-Flag Guardrails:</strong>
              If not confident in providing a safe answer, <span className="notranslate" translate="no">Tricky Toddlers</span> will advise seeking professional medical care and direct to appropriate emergency services.
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          7. PREMIUM PLAN CONVERSION CARD
      ========================================================== */}
      <section id="premium-plans" className="space-y-8 scroll-mt-20">
        <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-amber-500/40 bg-gradient-to-br from-[#1a1405] via-[#120e06] to-[#0a0703] p-6 sm:p-10 shadow-2xl shadow-amber-950/60 text-left space-y-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[90px] rounded-full pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider text-balance">
                <Crown className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Premium Plan Access</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight text-balance">
                Unlock the Complete All-in-One Parenting Suite
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed text-balance">
                Why juggle 5 separate app subscriptions? Get the <strong>one stop solution to all your parenting needs</strong> in an <strong>integrated app</strong> with <strong>everything at the click of a button</strong>.
              </p>
            </div>

            {/* Price & Primary CTA */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
              <div className="text-left lg:text-right">
                <span className="text-3xl sm:text-4xl font-black text-amber-300">₹499 <span className="text-sm font-normal text-slate-300">/ month</span></span>
                <p className="text-[10px] text-amber-300/80 mt-0.5">
                  NutriBand hardware is a separate one-time purchase (S, M, and L straps; not included in billing)
                </p>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={handleGoToUpgradePlans}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/25 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-slate-950" />
                  <span>{premiumActivated ? 'Manage / View Premium Plan ✨' : 'Upgrade to Premium Plan'}</span>
                </button>

                <button
                  onClick={() => {
                    playSound('glass');
                    navigate('/plans');
                  }}
                  className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs tracking-wide transition-all cursor-pointer"
                >
                  View Benefits
                </button>
              </div>
            </div>
          </div>

          {/* Premium Checklist Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-amber-500/20 text-xs text-slate-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Unlimited FoodLens plate scans</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Allergen &amp; chemical detection</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-400 shrink-0" />
              <span>NutriBand live vitals telemetry</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Smart fever &amp; movement alerts</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FREQUENTLY ASKED QUESTIONS (FAQ) SECTION
      ========================================================== */}
      <section id="faq-section" className="scroll-mt-24 space-y-6">
        <div className="text-center space-y-2.5 max-w-3xl mx-auto px-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs font-bold tracking-wider uppercase">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Parenting &amp; Platform FAQs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed">
            Everything you need to know about tracking your child’s milestones, nutrition, safe learning, and pediatric care in one place.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-3">
          {[
            {
              question: 'What age group is Tricky Toddlers designed for, and can I track more than one child?',
              answer:
                'Tricky Toddlers is tailored for babies and toddlers from 0 to 5 years old (Newborn through 60 months). Yes—you can manage up to two child profiles (for example, an older toddler and a younger infant) and switch between them anytime to get age-specific milestones, vaccine schedules, and meal ideas for each child.'
            },
            {
              question: 'How do AI NutriChef and FoodLens AI help with picky eaters and food allergies?',
              answer:
                'AI NutriChef generates custom, age-appropriate recipes based on the ingredients you have at home and automatically respects your saved Dietary Preferences (such as Vegetarian, Jain, Eggitarian, zero refined sugar, or specific allergies). FoodLens AI lets you snap or upload a photo of any meal to get an instant nutritional breakdown, choking-hazard check, and toddler-friendly serving tips.'
            },
            {
              question: 'Are the developmental milestones and immunization schedules aligned with pediatric standards?',
              answer:
                'Yes. Our Milestone Tracker (covering motor, cognitive, speech, and social skills) and Vaccine Tracker follow standard IAP (Indian Academy of Pediatrics) and WHO guidelines, complete with due-date tracking and downloadable PDF health summaries for your pediatrician visits.'
            },
            {
              question: 'Is the AI Parenting Assistant a replacement for my child’s pediatrician?',
              answer:
                'No. The AI Parenting Assistant and Pediatric Care guides provide 24/7 educational support for everyday parenting questions—like sleep regressions, teething relief, and tantrum calming—while highlighting red-flag symptoms so you know when to consult your pediatrician directly.'
            },
            {
              question: 'How is screen time kept safe in Toddler Academy, Toddler Tales, and Toddler TV?',
              answer:
                'Unlike passive, overstimulating video feeds, Toddler Academy focuses on interactive, bite-sized learning modules (First Words, Numbers, Emotions, Shapes, and Animal Sounds) with gentle audio feedback, while Toddler Tales and Toddler TV offer curated, ad-free stories and rhymes designed for calm co-viewing.'
            },
            {
              question: 'Can I use Tricky Toddlers in Indian regional languages?',
              answer:
                'Yes! You can switch the app interface and AI guidance across 10 supported languages—including English, Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, Bengali, and Punjabi—from the top language selector.'
            },
            {
              question: 'How does the Guest Account work, and is my family’s data private?',
              answer:
                'Clicking Guest Account (Instant Access) lets you explore all 14 features immediately with a pre-loaded sample profile without signing up. When you create your own account, your child’s logs, photos, and health records are stored privately in your encrypted account and never shared publicly unless you choose to post in Community Help or Parent Connect.'
            },
            {
              question: 'What is the difference between the Free plan and Premium plans?',
              answer:
                'Every parent gets access to core trackers, learning modules, and community support. Upgrading to a Monthly (₹299/mo), Yearly (₹2,499/yr), or Lifetime (₹4,999) plan unlocks unlimited AI Assistant consultations, unlimited FoodLens AI scans, personalized meal plans, downloadable pediatric PDF reports, and priority expert Q&A.'
            }
          ].map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className={`glass-card rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-indigo-400/40 bg-indigo-950/30 shadow-lg shadow-indigo-500/10'
                    : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    playSound('pop');
                    setOpenFaqIndex(isOpen ? null : idx);
                  }}
                  aria-expanded={isOpen}
                  className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-black shrink-0 mt-0.5 sm:mt-0">
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
                      <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-1 border-t border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed pl-13 sm:pl-16">
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

    </div>
  );
};

