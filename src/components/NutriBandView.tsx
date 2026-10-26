import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Thermometer, 
  Activity, 
  Moon, 
  Move, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  BatteryCharging, 
  Droplets, 
  Zap, 
  HeartPulse, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Utensils, 
  Baby, 
  Radio, 
  CheckCircle2, 
  TrendingUp, 
  Info,
  Calendar,
  Share2,
  PhoneCall,
  Video,
  ShoppingBag,
  Package,
  BellRing,
  Battery,
  Box,
  Layers,
  Compass,
  RotateCcw,
  Sparkle,
  MapPin,
  Palette
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import nutribandSensorPodImg from '../assets/images/nutriband_sensor_pod_standalone.svg';
import nutribandUsbChargerImg from '../assets/images/small_phone_usb_cable.svg';
import nutribandDiaperClipImg from '../assets/images/baby_diaper_clip_1789457013108.jpg';
import nutribandThreeStrapsImg from '../assets/images/three_cotton_straps_real.jpg';
import nutribandSiliconeWatchImg from '../assets/images/nutriband_silicone_smartwatch.svg';
import { NutriBandIntegratedEcosystem } from './NutriBandIntegratedEcosystem';
import { useAuth } from '../lib/AuthContext';

const formatChildAge = (birthDateStr?: string | null, fallbackAge?: string | null): string => {
  if (birthDateStr) {
    const birth = new Date(birthDateStr);
    if (!isNaN(birth.getTime())) {
      const now = new Date();
      let totalMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
      if (now.getDate() < birth.getDate()) {
        totalMonths--;
      }
      if (totalMonths >= 0) {
        if (totalMonths < 1) return '< 1 mo.';
        if (totalMonths < 12) return `${totalMonths} mo.`;
        const years = Math.floor(totalMonths / 12);
        const remMonths = totalMonths % 12;
        if (remMonths === 0) return `${years}y`;
        return `${years}y ${remMonths} mo.`;
      }
    }
  }

  if (fallbackAge && fallbackAge.trim()) {
    const match = fallbackAge.match(/^([0-9\s\-]+(?:Months|Years|mo|y))/i);
    if (match) return match[1].trim();
    return fallbackAge;
  }

  return '2y 3 mo.';
};

interface NutriBandViewProps {
  onNavigateToFoodLens?: () => void;
  onNavigateToPediatric?: () => void;
  onNavigateToStore?: (initialView?: 'catalog' | 'cart') => void;
  onNavigateToReserveCart?: () => void;
}

export const NutriBandView: React.FC<NutriBandViewProps> = ({ 
  onNavigateToFoodLens, 
  onNavigateToPediatric,
  onNavigateToStore,
  onNavigateToReserveCart
}) => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [, setTick] = useState(0);

  // Re-read if settings are updated in other views or localStorage
  useEffect(() => {
    const handleStorage = () => setTick(t => t + 1);
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const childName = (
    profile?.babyName || 
    profile?.childName || 
    (typeof window !== 'undefined' ? localStorage.getItem('baby_name') : null) || 
    'Ashwath'
  ).trim();

  const birthDate = profile?.babyBirthDate || (typeof window !== 'undefined' ? localStorage.getItem('baby_birthdate') : null);
  const rawAge = profile?.babyAge || profile?.toddlerAge || (typeof window !== 'undefined' ? localStorage.getItem('baby_age') : null);
  const childAge = formatChildAge(birthDate, rawAge);

  // Accordion expansion state for Live Dashboard - default to collapsed
  const [expandedSection, setExpandedSection] = useState<'temp' | 'sleep' | 'activity' | 'nutrients' | 'gps' | null>(null);
  // Alert telemetry simulation state: toggles between Normal (98.4°F) and High (99.8°F)
  const [isAlertTriggered, setIsAlertTriggered] = useState<boolean>(false);

  // Pediatric body temperature telemetry evaluation:
  // Normal: 98.4°F (97.6°-99.2°F baseline, Normal status)
  // High: 99.8°F (> 99.2°F pediatric low-grade fever elevation threshold, High status)
  const getPediatricTelemetry = (isAlert: boolean) => {
    if (isAlert) {
      return {
        wornTime: '14h 20m',
        tempValue: '99.8°F',
        status: 'High' as const,
        statusLabel: 'High',
        badgeColor: 'bg-rose-500/25 text-rose-300 border-rose-500/50 font-black',
        tileBorder: 'border-rose-500/50 bg-rose-950/20 shadow-lg shadow-rose-500/10',
        textColor: 'text-rose-300',
        rangeSubtitle: 'Above 99.2°F · High (Elevated)',
        statusBannerTitle: 'Mild Temp Elevation (High)',
        statusBannerMsg: `${childName}’s skin temp reached 99.8°F (+1.4°F above normal baseline). Pediatric low-grade elevation threshold exceeded. Rest and close temperature monitoring suggested.`,
        overallStatusTitle: 'FEVER ALERT (HIGH)',
        overallStatusSubtitle: 'Active Alert · Temp 99.8°F (High)',
        overallStatusBorder: 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-rose-500/20',
        pingColor: 'bg-rose-400',
        icon: AlertCircle,
        // High alert KPIs - logically consistent: low activity & resting in bed during fever
        activityValue: '0.8 hrs',
        activityStatus: 'Low',
        activityBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        activitySubtitle: 'Reduced play · Resting with fever',
        activityBorder: 'border-amber-500/30 bg-amber-950/15',

        sleepValue: '11h 50m',
        sleepStatus: 'Resting',
        sleepBadge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
        sleepSubtitle: 'Extended recovery sleep during fever',

        movementValue: '1 alert',
        movementStatus: 'Restless',
        movementBadge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        movementSubtitle: 'Elevated restlessness in bed · 1 alert',
        movementBorder: 'border-rose-500/30 bg-rose-950/15',

        nutrientsValue: 'Target Met',
        nutrientsStatus: 'Target Met',
        nutrientsBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        nutrientsSubtitle: 'Hydration & electrolyte targets met',
        nutrientsBorder: 'border-emerald-500/30 bg-emerald-950/15',

        peakTempAccordion: '99.8°F at 3:15 PM (High)',
        feverRiskAccordion: 'High Alert (Low-grade elevation detected at 3:15 PM)',
        feverRiskAccordionClass: 'bg-rose-500/15 border-rose-500/30 text-rose-300'
      };
    }

    // Default Normal state (98.4°F baseline)
    return {
      wornTime: '14h 20m',
      tempValue: '98.4°F',
      status: 'Normal' as const,
      statusLabel: 'Normal',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-bold',
      tileBorder: 'border-white/10 hover:border-emerald-400/30 bg-white/[0.03]',
      textColor: 'text-white',
      rangeSubtitle: '97.6°-99.2°F Normal Range',
      statusBannerTitle: '',
      statusBannerMsg: '',
      overallStatusTitle: 'ALL NORMAL',
      overallStatusSubtitle: 'No Alerts Today',
      overallStatusBorder: 'bg-emerald-500/15 border-emerald-400/30 shadow-emerald-500/10 text-emerald-300',
      pingColor: 'bg-emerald-400',
      icon: CheckCircle2,
      // Normal KPIs - logically consistent: 14h 20m worn = 10h 40m sleep + 3.1h active play + awake calm time
      activityValue: '3.1 hrs',
      activityStatus: 'Active',
      activityBadge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      activitySubtitle: 'Active play recorded',
      activityBorder: 'border-white/10 hover:border-amber-400/30 bg-white/[0.03]',

      sleepValue: '10h 40m',
      sleepStatus: 'Target',
      sleepBadge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      sleepSubtitle: 'Night + afternoon nap',

      movementValue: '0 alerts',
      movementStatus: 'Steady',
      movementBadge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      movementSubtitle: 'Normal play & quiet rests · 0 alerts',
      movementBorder: 'border-white/10 hover:border-teal-400/30 bg-white/[0.03]',

      nutrientsValue: 'Optimal',
      nutrientsStatus: 'RDA 94%',
      nutrientsBadge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      nutrientsSubtitle: 'Micronutrient sync',
      nutrientsBorder: 'border-white/10 hover:border-emerald-400/30 bg-white/[0.03]',

      peakTempAccordion: '98.6°F at 5:40 PM',
      feverRiskAccordion: 'Low (No rapid delta)',
      feverRiskAccordionClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
    };
  };

  const telemetry = getPediatricTelemetry(isAlertTriggered);
  const StatusIcon = telemetry.icon;

  const handleOpenReserveCart = () => {
    playSound('pop');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (onNavigateToReserveCart) {
      onNavigateToReserveCart();
    } else {
      navigate('/cart');
    }
  };

  const toggleAccordion = (section: 'temp' | 'sleep' | 'activity' | 'nutrients' | 'gps') => {
    playSound('click');
    setExpandedSection(prev => prev === section ? null : section);
  };

  return (
    <div className="space-y-12 sm:space-y-16 w-full py-2 font-sans text-slate-100">
      
      {/* =========================================================
          HERO SECTION: NUTRIBAND MODULAR CHILD-CARE MONITOR
      ========================================================== */}
      <section 
        id="nutriband-hero"
        className="relative overflow-hidden rounded-[2.5rem] border border-cyan-500/25 bg-gradient-to-br from-[#081326] via-[#091a33] to-[#040a16] p-6 sm:p-12 lg:p-14 shadow-2xl backdrop-blur-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <h1 className="font-black text-white tracking-tight leading-tight space-y-1 text-balance">
            <span className="block text-2xl sm:text-3xl lg:text-4xl text-slate-100 font-bold">
              Not Just a Wristband.
            </span>
            <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-300 bg-clip-text text-transparent text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black inline-block text-balance">
              Clips to Diapers. Straps to Wrists. Grows to Big Kids.
            </span>
          </h1>

          {/* In-Page Navigation Buttons */}
          <div className="w-full overflow-x-auto no-scrollbar py-2">
            <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-nowrap min-w-max mx-auto px-2">
              <a 
                href="#how-it-works" 
                onClick={(e) => {
                  e.preventDefault();
                  playSound('pop');
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="px-4 py-3 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 hover:border-cyan-300 text-cyan-200 hover:text-white font-black text-xs sm:text-sm tracking-tight transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer hover:scale-[1.02] active:scale-95 shadow-md shadow-cyan-950/40"
              >
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>How it Works</span>
              </a>

              <a 
                href="#six-signals" 
                onClick={(e) => {
                  e.preventDefault();
                  playSound('pop');
                  document.getElementById('six-signals')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="px-4 py-3 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 hover:border-cyan-300 text-cyan-200 hover:text-white font-black text-xs sm:text-sm tracking-tight transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer hover:scale-[1.02] active:scale-95 shadow-md"
              >
                <Radio className="w-4 h-4 text-cyan-300 shrink-0" />
                <span>Six Signals</span>
              </a>


              <a 
                href="#product-comparison" 
                onClick={() => playSound('pop')}
                className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-slate-200 hover:text-white font-bold text-xs sm:text-sm tracking-tight transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer hover:scale-[1.02] active:scale-95 shadow-md"
              >
                <ShieldCheck className="w-4 h-4 text-pink-400 shrink-0" />
                <span>Why Nutriband</span>
              </a>

              <a 
                href="#dashboard-preview" 
                onClick={() => playSound('glass')}
                className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-slate-200 hover:text-white font-bold text-xs sm:text-sm tracking-tight transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer hover:scale-[1.02] active:scale-95 shadow-md"
              >
                <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Live App Telemetry</span>
              </a>

              <a 
                href="#integrated-ecosystem" 
                onClick={() => playSound('pop')}
                className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-slate-200 hover:text-white font-bold text-xs sm:text-sm tracking-tight transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer hover:scale-[1.02] active:scale-95 shadow-md"
              >
                <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Nutriband Ecosystem</span>
              </a>
            </div>
          </div>

          {/* Effortless Everyday Use: 2 lines in medium-large text */}
          <div className="text-center pt-3 pb-1 space-y-1">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
              Effortless Everyday Use
            </h2>
            <p className="text-base sm:text-lg md:text-xl font-medium text-cyan-200/90 tracking-tight">
              Simply Clip On, Wear On and Track On
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================
          SECTION: HOW IT WORKS (ONE SINGLE DEVICE · THREE WAYS TO WEAR)
      ========================================================== */}
      <section 
        id="how-it-works" 
        className="relative overflow-hidden rounded-[2.5rem] border border-cyan-500/30 bg-gradient-to-b from-[#091524] via-[#06101c] to-[#040811] p-5 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-2xl space-y-8 scroll-mt-24"
      >
        <span id="three-ways-to-use" className="sr-only" />
        <span id="how-it-works-anchor" className="sr-only" />
        
        {/* Ambient background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="text-center space-y-3 max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 text-xs font-black uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>One Single Device · Three Ways to Wear</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            How to Wear NutriBand Across Every Childhood Stage
          </h2>
          <p className="text-cyan-100/80 text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            The same white pebble-shaped sensor pod docks seamlessly into 3 included wearing modes as your child grows from infant to big kid.
          </p>
        </div>

        {/* 3 Images Grid: First diaper clip, then cotton strap, then silicone band */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 items-stretch relative z-10 max-w-7xl mx-auto">
          {/* 1. Diaper Clip Image */}
          <div className="rounded-3xl overflow-hidden border border-sky-400/30 bg-slate-900/60 shadow-2xl hover:border-sky-400/60 transition-all hover:scale-[1.01] flex flex-col">
            <img 
              src="/assets/aistudio/Gemini_Generated_Image_a903hla903hla903_4e4f9611.png" 
              alt="Way 1 · 0 to 12 Months: Clipped to Diaper or Onesie"
              className="w-full h-auto object-contain rounded-3xl"
              loading="lazy"
            />
          </div>

          {/* 2. Cotton Strap Image */}
          <div className="rounded-3xl overflow-hidden border border-pink-400/30 bg-slate-900/60 shadow-2xl hover:border-pink-400/60 transition-all hover:scale-[1.01] flex flex-col">
            <img 
              src="/assets/aistudio/Gemini_Generated_Image_g662xzg662xzg662_4311780f.png" 
              alt="Way 2 · 1 to 10 Years: Inserted in Cotton Cloth Smart Band"
              className="w-full h-auto object-contain rounded-3xl"
              loading="lazy"
            />
          </div>

          {/* 3. Silicone Band Image */}
          <div className="rounded-3xl overflow-hidden border border-cyan-400/30 bg-slate-900/60 shadow-2xl hover:border-cyan-400/60 transition-all hover:scale-[1.01] flex flex-col">
            <img 
              src="/assets/aistudio/Gemini_Generated_Image_ar7fctar7fctar7f_81de696a.png" 
              alt="Way 3 · 10+ Years: Silicone Smart Band"
              className="w-full h-auto object-contain rounded-3xl"
              loading="lazy"
            />
          </div>
        </div>
      </section>


      {/* =========================================================
          SECTION: SIX SIGNALS SECTION (KEY BIOMETRIC INDICATORS)
          Eyebrow: What It Tracks
          Heading: Six signals. One simple picture.
          3 in row 1, 3 in row 2 within one section without scrolling
      ========================================================== */}
      <section 
        id="six-signals"
        className="min-h-[calc(100vh-4.5rem)] flex flex-col justify-center py-6 sm:py-8 lg:py-10 scroll-mt-16 sm:scroll-mt-20 relative"
      >
        <span id="key-indicators" className="absolute -top-20" />
        
        {/* Header */}
        <div className="text-center space-y-1.5 max-w-2xl mx-auto mb-5 sm:mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-[11px] font-black uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>What It Tracks</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Six signals. One simple picture.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Continuous pediatric telemetry unified in one single glance.
          </p>
        </div>

        {/* 3 in one line and 3 in another line (3x2 Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto w-full">
          
          {/* Signal 1: Body Temperature */}
          <div className="relative group rounded-2xl border border-rose-500/25 bg-gradient-to-br from-[#1c0d16] via-[#140a13] to-[#0a0509] p-4 sm:p-5 shadow-xl hover:border-rose-400/50 transition-all flex flex-col justify-between space-y-3">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/35 flex items-center justify-center text-rose-300 shrink-0 shadow-sm">
                  <Thermometer className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black tracking-wider border border-rose-500/30">
                  97.8°F – 99.1°F
                </span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Body Temperature
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Monitors fever spikes in real time without disturbing your child's sleep.
                </p>
              </div>
            </div>
            <div className="pt-2.5 border-t border-white/10 text-[11px] text-rose-300/90 font-bold flex items-center justify-between">
              <span>Clinical Skin Sensor</span>
              <span>±0.1°F Precision</span>
            </div>
          </div>

          {/* Signal 2: Activity */}
          <div className="relative group rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1a1309] via-[#140e06] to-[#0a0703] p-4 sm:p-5 shadow-xl hover:border-amber-400/50 transition-all flex flex-col justify-between space-y-3">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/35 flex items-center justify-center text-amber-300 shrink-0 shadow-sm">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black tracking-wider border border-amber-500/30">
                  3+ Hours Play
                </span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Activity &amp; Exertion
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Flags daylight lethargy and unusual fatigue before visible symptoms appear.
                </p>
              </div>
            </div>
            <div className="pt-2.5 border-t border-white/10 text-[11px] text-amber-300/90 font-bold flex items-center justify-between">
              <span>Daylight Play Tracking</span>
              <span>Fatigue Delta Alert</span>
            </div>
          </div>

          {/* Signal 3: Sleep */}
          <div className="relative group rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0e1128] via-[#090b1c] to-[#040611] p-4 sm:p-5 shadow-xl hover:border-indigo-400/50 transition-all flex flex-col justify-between space-y-3">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/35 flex items-center justify-center text-indigo-300 shrink-0 shadow-sm">
                  <Moon className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black tracking-wider border border-indigo-500/30">
                  WHO 11–14h
                </span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Circadian Sleep
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Measures nap quality, night wakings, and restorative deep-sleep cycles.
                </p>
              </div>
            </div>
            <div className="pt-2.5 border-t border-white/10 text-[11px] text-indigo-300/90 font-bold flex items-center justify-between">
              <span>Restorative Sleep Index</span>
              <span>Night Waking Counter</span>
            </div>
          </div>

          {/* Signal 4: Movement */}
          <div className="relative group rounded-2xl border border-teal-500/25 bg-gradient-to-br from-[#081b1d] via-[#061416] to-[#03090a] p-4 sm:p-5 shadow-xl hover:border-teal-400/50 transition-all flex flex-col justify-between space-y-3">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/35 flex items-center justify-center text-teal-300 shrink-0 shadow-sm">
                  <Move className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-black tracking-wider border border-teal-500/30">
                  Impact Radar
                </span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Movement &amp; Impact
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Immediate alerts for unexpected falls, physical bumps, or prolonged stillness.
                </p>
              </div>
            </div>
            <div className="pt-2.5 border-t border-white/10 text-[11px] text-teal-300/90 font-bold flex items-center justify-between">
              <span>3-Axis Accelerometer</span>
              <span>Tumble &amp; Fall Alert</span>
            </div>
          </div>

          {/* Signal 5: Nutrients */}
          <div className="relative group rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#0a1e16] via-[#06160f] to-[#030b08] p-4 sm:p-5 shadow-xl hover:border-emerald-400/50 transition-all flex flex-col justify-between space-y-3">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/35 flex items-center justify-center text-emerald-300 shrink-0 shadow-sm">
                  <Utensils className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black tracking-wider border border-emerald-500/30">
                  94% RDA Synergy
                </span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Nutrient Absorption
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Links digestive absorption and metabolic energy burn with FoodLens meal intake.
                </p>
              </div>
            </div>
            <div className="pt-2.5 border-t border-white/10 text-[11px] text-emerald-300/90 font-bold flex items-center justify-between">
              <span>Metabolic Energy Sync</span>
              <span>Post-Meal Telemetry</span>
            </div>
          </div>

          {/* Signal 6: GPS */}
          <div className="relative group rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#061826] via-[#04111c] to-[#02080e] p-4 sm:p-5 shadow-xl hover:border-cyan-400/50 transition-all flex flex-col justify-between space-y-3">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/35 flex items-center justify-center text-cyan-300 shrink-0 shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black tracking-wider border border-cyan-500/30">
                  Geofence Active
                </span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  GPS Safe Perimeter
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Instant geo-fencing alarm if your toddler wanders beyond designated nursery bounds.
                </p>
              </div>
            </div>
            <div className="pt-2.5 border-t border-white/10 text-[11px] text-cyan-300/90 font-bold flex items-center justify-between">
              <span>Live Perimeter Shield</span>
              <span>Safe-Zone Perimeter</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          SECTION: INTEGRATED ECOSYSTEM INFOGRAPHIC (FLOW OF INFO)
      ========================================================== */}
      <NutriBandIntegratedEcosystem />



      {/* =========================================================
          SECTION 8: LIVE DASHBOARD PREVIEW SECTION
          Label: "See NutriBand in Action"
          Sample profile: Ashwath · Age 2y 3 mo. · NutriBand worn 6h 20m today
          Status badge: ✅ ALL NORMAL / No Alerts Today
          Stat grid (6 tiles):
          Body Temp | Activity | Sleep | Movement | Nutrients | GPS Location
          Accordion details: Temperature trend, sleep breakdown, activity log, nutrients, GPS location
          Cross-sync box: Synced with Food Lens
      ========================================================== */}
      <section 
        id="dashboard-preview"
        className="relative overflow-hidden rounded-[2.5rem] border border-cyan-500/30 bg-gradient-to-b from-[#0a1526] via-[#07101e] to-[#040810] p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-8 scroll-mt-24"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-300 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Dashboard Preview</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              See NutriBand in Action
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Sample profile: <strong className="text-white">{childName}</strong> · Age {childAge} · NutriBand worn {telemetry.wornTime} today
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <div className={`p-3 sm:p-3.5 rounded-2xl border flex items-center gap-3 shadow-lg transition-all ${telemetry.overallStatusBorder}`}>
              <div className={`w-3 h-3 rounded-full ${telemetry.pingColor} animate-ping shrink-0`} />
              <div>
                <div className="font-black text-sm flex items-center gap-1.5 leading-none">
                  <StatusIcon className="w-4 h-4 shrink-0" />
                  <span>{telemetry.overallStatusTitle}</span>
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider opacity-85 mt-1">
                  {telemetry.overallStatusSubtitle}
                </div>
              </div>
            </div>

            {/* Single Simulate Alert / Reset Alert Toggle Button */}
            <button
              type="button"
              onClick={() => {
                playSound('pop');
                setIsAlertTriggered(!isAlertTriggered);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                isAlertTriggered 
                  ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/30 hover:bg-rose-600' 
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30'
              }`}
              title={isAlertTriggered ? 'Reset alert to normal' : 'Simulate high temperature alert (99.8°F)'}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{isAlertTriggered ? 'Reset Alert' : 'Simulate Alert'}</span>
            </button>
          </div>
        </div>

        {/* Simulated Alert Notification if toggled */}
        {isAlertTriggered && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/60 text-rose-200 shadow-rose-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm animate-pulse shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
              <div>
                <strong className="font-black text-white">{telemetry.statusBannerTitle}:</strong>{' '}
                {telemetry.statusBannerMsg}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {onNavigateToPediatric && (
                <button
                  type="button"
                  onClick={() => {
                    playSound('click');
                    onNavigateToPediatric();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Pediatrician</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  playSound('pop');
                  setIsAlertTriggered(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs shrink-0 cursor-pointer transition-all"
              >
                Reset Alert
              </button>
            </div>
          </div>
        )}

        {/* 6 Stat Tiles for 6 Signals */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Tile 1: Body Temp */}
          <div className={`p-4 sm:p-5 rounded-2xl ${telemetry.tileBorder} border transition-all relative overflow-hidden`}>
            {isAlertTriggered && (
              <div className="absolute top-0 right-0 left-0 h-1 bg-rose-500 animate-pulse" />
            )}
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
              <span className={`flex items-center gap-1.5 ${isAlertTriggered ? 'text-rose-300 font-black' : 'text-rose-300'}`}>
                <Thermometer className="w-4 h-4" /> Temp
              </span>
              <span className={`px-2 py-0.5 rounded-full border text-[10px] ${telemetry.badgeColor}`}>
                {telemetry.statusLabel}
              </span>
            </div>
            <div className={`text-xl sm:text-2xl font-black tracking-tight ${telemetry.textColor}`}>
              {telemetry.tempValue}
            </div>
            <div className="text-[11px] text-slate-400 font-semibold mt-1">
              {telemetry.rangeSubtitle}
            </div>
          </div>

          {/* Tile 2: Activity */}
          <div className={`p-4 sm:p-5 rounded-2xl ${telemetry.activityBorder} border transition-all`}>
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
              <span className="flex items-center gap-1.5 text-amber-300">
                <Activity className="w-4 h-4" /> Activity
              </span>
              <span className={`px-2 py-0.5 rounded-full border text-[10px] ${telemetry.activityBadge}`}>
                {telemetry.activityStatus}
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {telemetry.activityValue}
            </div>
            <div className="text-[11px] text-slate-400 font-semibold mt-1">
              {telemetry.activitySubtitle}
            </div>
          </div>

          {/* Tile 3: Sleep */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-400/30 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
              <span className="flex items-center gap-1.5 text-indigo-300">
                <Moon className="w-4 h-4" /> Sleep
              </span>
              <span className={`px-2 py-0.5 rounded-full border text-[10px] ${telemetry.sleepBadge}`}>
                {telemetry.sleepStatus}
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {telemetry.sleepValue}
            </div>
            <div className="text-[11px] text-slate-400 font-semibold mt-1">
              {telemetry.sleepSubtitle}
            </div>
          </div>

          {/* Tile 4: Movement */}
          <div className={`p-4 sm:p-5 rounded-2xl ${telemetry.movementBorder} border transition-all`}>
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
              <span className="flex items-center gap-1.5 text-teal-300">
                <Move className="w-4 h-4" /> Movement
              </span>
              <span className={`px-2 py-0.5 rounded-full border text-[10px] ${telemetry.movementBadge}`}>
                {telemetry.movementStatus}
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {telemetry.movementValue}
            </div>
            <div className="text-[11px] text-slate-400 font-semibold mt-1">
              {telemetry.movementSubtitle}
            </div>
          </div>

          {/* Tile 5: Nutrients */}
          <div className={`p-4 sm:p-5 rounded-2xl ${telemetry.nutrientsBorder} border transition-all`}>
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
              <span className="flex items-center gap-1.5 text-emerald-300">
                <Utensils className="w-4 h-4" /> Nutrients
              </span>
              <span className={`px-2 py-0.5 rounded-full border text-[10px] ${telemetry.nutrientsBadge}`}>
                {telemetry.nutrientsStatus}
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {telemetry.nutrientsValue}
            </div>
            <div className="text-[11px] text-slate-400 font-semibold mt-1">
              {telemetry.nutrientsSubtitle}
            </div>
          </div>

          {/* Tile 6: GPS Location */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/30 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <MapPin className="w-4 h-4" /> GPS
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px]">Safe</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Home Zone
            </div>
            <div className="text-[11px] text-slate-400 font-semibold mt-1">
              Nursery / Play Area
            </div>
          </div>
        </div>

        {/* =========================================================
            CROSS-SYNC CALLOUT: DISTINCT HIGHLIGHTED BOX
        ========================================================== */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-950/20 border-2 border-amber-400/40 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 shadow-md">
                <Utensils className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-black text-amber-300 uppercase tracking-wider">
                  <span>🔗 Cross-System Intelligence</span>
                  <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded text-[9px] font-black">SYNCED</span>
                </div>
                <p className="text-white text-sm sm:text-base font-bold leading-relaxed">
                  Synced with Food Lens: Today's high-sodium snack may be linked to reduced afternoon activity; see nutrition insight.
                </p>
                <p className="text-xs text-amber-200/80">
                  NutriBand sensor data dynamically correlates physical movement drops with scanned packaged foods in Tricky Toddlers.
                </p>
              </div>
            </div>

            {onNavigateToFoodLens && (
              <button
                onClick={() => {
                  playSound('pop');
                  onNavigateToFoodLens();
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs tracking-wide shadow-md hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <span>Open Food Lens</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>


      </section>



      {/* =========================================================
          SECTION 11: COMPARISON SECTION: SNUZA HERO SE (US) vs. NUTRIBAND (INDIA)
          5-Point Direct Comparison (Snug Proportional Columns & Big Clear Typography)
      ========================================================== */}
      <section 
        id="product-comparison"
        className="space-y-6 sm:space-y-8 scroll-mt-24 relative"
      >
        <span id="intelligence-comparison" className="absolute -top-24" />
        <div className="text-center space-y-2.5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-black uppercase tracking-wider border border-cyan-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Product Comparison</span>
          </div>
        </div>

        {/* Attached Comparison Infographic */}
        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden border border-cyan-500/20 bg-[#060c18] shadow-2xl p-2 sm:p-5 flex justify-center">
          <img 
            src="/assets/aistudio/NutriBand_Connected_Wellness_Infographic_394ce48c.png" 
            alt="Other Wearables vs. NutriBand Comparison" 
            className="w-full max-w-2xl sm:max-w-3xl h-auto object-contain rounded-2xl shadow-xl"
            loading="lazy"
          />
        </div>
      </section>

      {/* =========================================================
          SECTION: DETAILED TELEMETRY BREAKDOWN
      ========================================================== */}
      <section id="telemetry-breakdown" className="space-y-4 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-white/10">
          <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>Detailed Telemetry Breakdown</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">(Click row to inspect)</span>
        </div>

        <div className="space-y-4">

          {/* Row 1: Temperature Trend */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <button
              onClick={() => toggleAccordion('temp')}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-white">
                    Temperature Trend (24h continuous graph, fever threshold markers)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Continuous skin-temp readings every 60s with pediatric baseline comparison.
                  </p>
                </div>
              </div>
              <div className="text-slate-400">
                {expandedSection === 'temp' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            <AnimatePresence>
              {expandedSection === 'temp' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-6 pt-2 border-t border-white/5 space-y-4"
                >
                  {/* Visual 24h Temperature Curve Representation */}
                  <div className="bg-[#050b14] p-4 rounded-xl border border-white/10">
                    <div className="flex justify-between items-center text-xs text-slate-400 mb-3 font-semibold">
                      <span>12:00 AM (98.2°F)</span>
                      <span>6:00 AM (97.9°F)</span>
                      <span>12:00 PM (98.4°F)</span>
                      <span>6:00 PM (98.6°F)</span>
                      <span>11:59 PM (98.3°F)</span>
                    </div>

                    <div className="relative h-28 w-full flex items-end justify-between gap-1 pt-6 px-1">
                      {/* Fever Marker line */}
                      <div className="absolute top-3 left-0 right-0 border-b border-rose-500/50 border-dashed flex justify-between text-[10px] text-rose-400 px-2 font-bold">
                        <span>Fever Alert Line: 100.4°F</span>
                        <span>Toddler Threshold</span>
                      </div>
                      
                      {/* Ambient Normal line */}
                      <div className="absolute top-12 left-0 right-0 border-b border-emerald-500/30 border-dashed flex justify-between text-[10px] text-emerald-400 px-2">
                        <span>Normal Baseline: 98.6°F</span>
                      </div>

                      {/* Mock 24 hourly bars */}
                      {[
                        45, 43, 42, 40, 42, 46, 50, 52, 54, 55, 58, 60, 
                        isAlertTriggered ? 76 : 62, 
                        isAlertTriggered ? 78 : 60, 
                        isAlertTriggered ? 74 : 58, 
                        62, 64, 65, 62, 59, 56, 52, 48, 46
                      ].map((val, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                          <div 
                            className={`w-full rounded-t transition-all ${
                              val > 70 
                                ? 'bg-rose-500 shadow-md shadow-rose-500/50' 
                                : val > 64 
                                ? 'bg-amber-400' 
                                : 'bg-cyan-400/70 hover:bg-cyan-300'
                            }`} 
                            style={{ height: `${val}%` }} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-slate-400 block">Lowest Night Temp:</span>
                      <strong className="text-sm text-white">97.9°F at 4:12 AM</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-slate-400 block">Peak Afternoon Temp:</span>
                      <strong className={`text-sm ${isAlertTriggered ? 'text-rose-300 font-black' : 'text-white'}`}>
                        {telemetry.peakTempAccordion}
                      </strong>
                    </div>
                    <div className={`p-3 rounded-xl border ${telemetry.feverRiskAccordionClass}`}>
                      <span className="block font-bold opacity-80">Fever Risk Index:</span>
                      <strong className="text-sm">{telemetry.feverRiskAccordion}</strong>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Row 2: Sleep Breakdown */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <button
              onClick={() => toggleAccordion('sleep')}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-white">
                    Sleep Breakdown (naps, night sleep, wake events)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Restorative sleep architecture aligned with pediatric sleep guidelines.
                  </p>
                </div>
              </div>
              <div className="text-slate-400">
                {expandedSection === 'sleep' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            <AnimatePresence>
              {expandedSection === 'sleep' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-6 pt-2 border-t border-white/5 space-y-4"
                >
                  {/* Sleep Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Night Sleep (9h 10m)</span>
                      <span>Afternoon Nap (1h 30m)</span>
                      <span className="text-indigo-400 font-black">Total: 10h 40m / 11h Target</span>
                    </div>
                    <div className="h-4 rounded-full bg-white/10 overflow-hidden flex">
                      <div className="bg-indigo-500 h-full" style={{ width: '75%' }} title="Night Sleep" />
                      <div className="bg-cyan-400 h-full" style={{ width: '15%' }} title="Nap" />
                      <div className="bg-amber-400/80 h-full" style={{ width: '3%' }} title="Restless Wake" />
                      <div className="bg-white/10 h-full" style={{ width: '7%' }} title="Remaining Target" />
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Deep Night Rest
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Nap (1:15 PM - 2:45 PM)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> 1 Minor Wake Event (3:40 AM)
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#090f1b] border border-white/10 text-xs space-y-2">
                    <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Pediatric Sleep Assessment:
                    </div>
                    <p className="text-slate-300">
                      Ashwath is meeting 97% of the American Academy of Pediatrics sleep volume for his age (2y 3 mo.). Sleep latency was 14 minutes, indicating optimal pre-bed wind-down.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Row 3: Activity & Movement Log */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <button
              onClick={() => toggleAccordion('activity')}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-white">
                    Activity & Movement Log (active minutes, stillness alerts, fall detection)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time motion telemetry: tumble alerts, gross motor intervals, sedentary duration.
                  </p>
                </div>
              </div>
              <div className="text-slate-400">
                {expandedSection === 'activity' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            <AnimatePresence>
              {expandedSection === 'activity' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-6 pt-2 border-t border-white/5 space-y-3 text-xs"
                >
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="font-bold text-white">10:15 AM - 11:30 AM</span>
                        <span className="text-slate-400">High-intensity outdoor play (Park & balance beam)</span>
                      </div>
                      <span className="font-bold text-emerald-400">75 mins active</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-teal-400" />
                        <span className="font-bold text-white">11:42 AM</span>
                        <span className="text-slate-400">Minor tumble detected (immediate resumption of movement, 0 impact alert)</span>
                      </div>
                      <span className="text-teal-300 font-bold">Soft landing</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="font-bold text-white">3:30 PM - 4:45 PM</span>
                        <span className="text-slate-400">Prolonged stillness alert (75 min seated puzzle / coloring time)</span>
                      </div>
                      <span className="text-amber-300 font-bold">Sedentary flag</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300">
                    <strong>Fall Algorithm:</strong> NutriBand distinguishes regular playground rolls and carpet slips from high-velocity drops using calibrated 3-axis toddler accelerometers.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Row 4: Nutrients & Metabolic Detection in Toddler */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <button
              onClick={() => toggleAccordion('nutrients')}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-white">
                    Nutrients Detection & Consumption Alerts (FoodLens intake sync, high/low alerts, Indian RDA sync)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time physiological synergy with Food Lens logs: digestion rhythm, post-meal energy stability, and micronutrient synthesis.
                  </p>
                </div>
              </div>
              <div className="text-slate-400">
                {expandedSection === 'nutrients' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            <AnimatePresence>
              {expandedSection === 'nutrients' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-6 pt-2 border-t border-white/5 space-y-4 text-xs"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-slate-400 block mb-1">RDA Absorption Synergy:</span>
                      <strong className="text-emerald-300 text-sm font-black">94% Target Achieved</strong>
                      <span className="text-[10px] text-slate-400 block mt-1">Iron, Calcium & Zinc aligned</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-slate-400 block mb-1">Nutrient Consumption Alerts:</span>
                      <strong className="text-cyan-300 text-sm font-black">FoodLens Intake Synced</strong>
                      <span className="text-[10px] text-slate-400 block mt-1">High/low nutrient reminders active</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-emerald-400 block font-bold mb-1">Post-Meal Metabolic Curve:</span>
                      <strong className="text-white text-sm font-black">Smooth Digestibility</strong>
                      <span className="text-[10px] text-emerald-300 block mt-1">Synced with Moong Khichdi lunch</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#091712] border border-emerald-500/30 space-y-2">
                    <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-400" /> Pediatric Biometric &amp; Food Lens Synchronization:
                    </div>
                    <p className="text-slate-300 leading-relaxed font-normal">
                      NutriBand biometric sensor confirms steady metabolic energy release following 12:30 PM meal. Skin micro-circulation and temperature variance indicate optimal digestive comfort with zero gastrointestinal strain or bloating distress.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Row 5: GPS Location & Geofenced Safe Zones */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <button
              onClick={() => toggleAccordion('gps')}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-white">
                    GPS Location &amp; Safe Nursery Perimeter (real-time geofence, outdoor radar, proximity lock)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Continuous child positioning with automatic safe boundary alerts for nursery, daycare, garden, and park trips.
                  </p>
                </div>
              </div>
              <div className="text-slate-400">
                {expandedSection === 'gps' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            <AnimatePresence>
              {expandedSection === 'gps' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-6 pt-2 border-t border-white/5 space-y-4 text-xs"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-slate-400 block mb-1">Current Active Zone:</span>
                      <strong className="text-cyan-300 text-sm font-black flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Home Nursery (Zone A)
                      </strong>
                      <span className="text-[10px] text-slate-400 block mt-1">Living Room / Play Perimeter</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-slate-400 block mb-1">BLE + GPS Proximity:</span>
                      <strong className="text-emerald-300 text-sm font-black">Within 15m Range</strong>
                      <span className="text-[10px] text-slate-400 block mt-1">Parent nursery receiver locked</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                      <span className="text-cyan-400 block font-bold mb-1">Boundary Breaches:</span>
                      <strong className="text-white text-sm font-black">0 Alerts Today</strong>
                      <span className="text-[10px] text-cyan-300 block mt-1">Geofence boundary secured</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#061826] border border-cyan-500/30 space-y-2">
                    <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-cyan-400" /> Real-Time Geofence Safety Architecture:
                    </div>
                    <p className="text-slate-300 leading-relaxed font-normal">
                      NutriBand uses hybrid low-power BLE mesh in indoor nursery rooms and assisted GPS outdoors. If your toddler wanders past your pre-set 25-meter perimeter boundary at home, park or preschool, parents receive an instant vibration &amp; audible alarm on both phone and dashboard.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* =========================================================
          CLOSING CTA / PRE-ORDER BANNER
      ========================================================== */}
      <section className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-r from-cyan-950/40 via-teal-950/30 to-indigo-950/40 border border-cyan-400/30 text-center space-y-6 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 mx-auto shadow-xl">
          <Baby className="w-7 h-7" />
        </div>
        <div className="space-y-2.5 max-w-3xl mx-auto">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
            Empower Your Parenting with NutriBand
          </h3>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Continuous pediatric monitoring that seamlessly integrates with Food Lens and Tricky Toddlers expert consultations.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {onNavigateToFoodLens && (
            <button
              onClick={() => {
                playSound('pop');
                onNavigateToFoodLens();
              }}
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-xl flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <Utensils className="w-4 h-4" />
              <span>Explore Food Lens</span>
            </button>
          )}

          {onNavigateToPediatric && (
            <button
              onClick={() => {
                playSound('click');
                onNavigateToPediatric();
              }}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-sm shadow-xl flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <Video className="w-4 h-4" />
              <span>1:1 Pediatric Video Call</span>
            </button>
          )}

          <button
            onClick={handleOpenReserveCart}
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-300 hover:from-cyan-300 hover:via-teal-200 hover:to-emerald-200 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-slate-950" />
            <span>Reserve NutriBand Starter Kit (₹1,499 incl. taxes)</span>
          </button>

          {onNavigateToStore && (
            <button
              onClick={() => {
                playSound('click');
                onNavigateToStore('cart');
              }}
              className="px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white font-bold text-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Package className="w-4 h-4 text-emerald-400" />
              <span>View Baby Store Cart</span>
            </button>
          )}
        </div>
      </section>

    </div>
  );
};
