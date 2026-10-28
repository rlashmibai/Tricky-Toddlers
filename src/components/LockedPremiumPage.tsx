import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Sparkles, 
  ArrowLeft, 
  Crown, 
  CheckCircle2, 
  ShieldCheck, 
  Camera, 
  Activity, 
  ArrowRight,
  Zap,
  ExternalLink
} from 'lucide-react';
import { playSound } from '../lib/sounds';

interface LockedPremiumPageProps {
  feature: 'foodlens' | 'nutriband' | 'default';
  onGoHome?: () => void;
  onUpgrade?: () => void;
}

export const LockedPremiumPage: React.FC<LockedPremiumPageProps> = ({
  feature,
  onGoHome,
  onUpgrade,
}) => {
  const navigate = useNavigate();

  const handleUpgradeClick = () => {
    playSound('pop');
    if (onUpgrade) {
      onUpgrade();
    } else {
      navigate('/plans');
    }
  };

  const handleBackClick = () => {
    playSound('click');
    if (onGoHome) {
      onGoHome();
    } else {
      navigate('/');
    }
  };

  const featureDetails = {
    foodlens: {
      name: 'FoodLens Pro',
      subtitle: 'AI Camera Plate Scanner & Allergen Detector',
      badge: 'PREMIUM VISION AI',
      icon: Camera,
      iconColor: 'from-amber-400 to-yellow-500',
      description:
        'Point your camera at your toddler’s meal to get instant ingredient breakdowns, IAP, FSSAI & ICMR nutrient ratings, texture choking risk checks, and hidden allergen warnings.',
      perks: [
        'Real-time photo plate analysis powered by Gemini Multimodal AI',
        'Automatic cross-referencing against child’s allergy profile',
        'Macro & micronutrient breakdown (Calcium, Iron, Zinc, Protein)',
        'Pediatric-approved safe finger-food portioning guides'
      ],
      previewHint: 'Live plate scanning, allergen detection, and texture safety metrics are locked.',
    },
    nutriband: {
      name: 'NutriBand™ Monitor',
      subtitle: 'Continuous Hardware & Pediatric Telemetry',
      badge: 'PREMIUM HARDWARE & TELEMETRY',
      icon: Activity,
      iconColor: 'from-cyan-400 to-teal-500',
      description:
        'Sync cordless diaper clip and soft silicone wristband telemetry to monitor live nursery temperature, sleep restlessness, skin warmth, and fever trends.',
      perks: [
        'Continuous BLE telemetry (lowest night temp, afternoon peaks, fever index)',
        'Safe nursery perimeter & geofenced proximity lock',
        'Automated dehydration and metabolic curve correlation',
        'Instant alerts for irregular sleep respiration or high fever'
      ],
      previewHint: 'Continuous BLE telemetry, fever index, and nursery radar are locked.',
    },
    default: {
      name: 'Comprehensive Premium Feature',
      subtitle: 'Exclusive Advanced Parenting Capability',
      badge: 'PREMIUM MEMBERSHIP',
      icon: Crown,
      iconColor: 'from-amber-400 to-yellow-500',
      description:
        'This specialized module is part of the Tricky Toddlers Comprehensive Premium membership, built for parents who want full telemetry and clinical personalization.',
      perks: [
        'Full AI Vision nutrition scanner & recipe customizer',
        'Hardware telemetry & nursery environment monitoring',
        'Priority booking with verified pediatric doctors',
        'Offline PDF medical report exports for clinical checkups'
      ],
      previewHint: 'Upgrade your plan to unlock full access to this premium feature.',
    },
  }[feature] || {
    name: 'Comprehensive Premium Feature',
    subtitle: 'Exclusive Advanced Parenting Capability',
    badge: 'PREMIUM MEMBERSHIP',
    icon: Crown,
    iconColor: 'from-amber-400 to-yellow-500',
    description:
      'This specialized module is part of the Tricky Toddlers Comprehensive Premium membership.',
    perks: [
      'Full AI Vision nutrition scanner & recipe customizer',
      'Hardware telemetry & nursery environment monitoring'
    ],
    previewHint: 'Upgrade your plan to unlock full access to this premium feature.',
  };

  const Icon = featureDetails.icon;

  return (
    <div className="w-full max-w-5xl mx-auto py-6 sm:py-10 px-4 sm:px-6 text-left space-y-8 font-sans">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBackClick}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Locked Premium Feature</span>
        </div>
      </div>

      {/* Main Locked Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] border-2 border-amber-500/30 bg-gradient-to-b from-[#131d33] via-[#0d1627] to-[#080d19] p-6 sm:p-10 lg:p-12 shadow-2xl shadow-amber-500/10 text-center"
      >
        {/* Ambient Glows */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          {/* Badge & Lock Graphic */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 p-0.5 shadow-2xl shadow-amber-500/25 flex items-center justify-center">
                <div className="w-full h-full bg-[#0a101d] rounded-[22px] flex items-center justify-center">
                  <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-amber-400 text-slate-950 shadow-lg">
                <Sparkles className="w-4 h-4 fill-slate-950" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[11px] font-black uppercase tracking-widest">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>{featureDetails.badge}</span>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {featureDetails.name}
            </h1>
            <p className="text-amber-200/90 text-sm sm:text-base font-bold">
              {featureDetails.subtitle}
            </p>
          </div>

          {/* Locked Version Notice Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-sm sm:text-base font-bold flex items-center justify-center gap-3">
            <Lock className="w-5 h-5 text-amber-400 shrink-0" />
            <span>Upgrade to Premium for access</span>
          </div>

          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            {featureDetails.description} When creating a profile, you receive full free access to all core parenting tools, milestone checks, and immunization schedules. {featureDetails.name} is exclusive to the <strong>Comprehensive Premium Plan</strong>.
          </p>

          {/* Included Perks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
            {featureDetails.perks.map((perk, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs sm:text-sm text-slate-200"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{perk}</span>
              </div>
            ))}
          </div>

          {/* Price & Primary CTA */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Comprehensive Plan Price
              </div>
              <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                <span className="text-3xl font-black text-amber-300">₹499</span>
                <span className="text-xs text-slate-300 font-normal">/ month</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold block">
                Includes all 16 features, AI Vision plate scanner & continuous hardware telemetry
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleUpgradeClick}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                <span>Upgrade to Premium for access</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <button
                type="button"
                onClick={handleBackClick}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white font-bold text-xs transition-all cursor-pointer"
              >
                Explore Free Features
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Blurred Feature Preview Card underneath to reinforce the locked state */}
      <div className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 overflow-hidden">
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-300">
            <Lock className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Preview is Locked
          </h3>
          <p className="text-xs text-slate-300 max-w-md leading-relaxed">
            {featureDetails.previewHint}
          </p>
          <button
            type="button"
            onClick={handleUpgradeClick}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            Upgrade to Premium for access
          </button>
        </div>

        {/* Mock visual skeleton representing the locked tool */}
        <div className="opacity-25 pointer-events-none space-y-4 filter blur-[2px]">
          <div className="h-10 bg-white/10 rounded-xl w-1/3" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="h-32 bg-white/5 rounded-2xl border border-white/10" />
            <div className="h-32 bg-white/5 rounded-2xl border border-white/10" />
            <div className="h-32 bg-white/5 rounded-2xl border border-white/10" />
          </div>
          <div className="h-44 bg-white/5 rounded-2xl border border-white/10" />
        </div>
      </div>
    </div>
  );
};
