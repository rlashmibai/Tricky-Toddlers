import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, Crown, Sparkles, Check, Camera, Activity, ShieldCheck, ArrowRight, Home } from 'lucide-react';
import { playSound } from '../lib/sounds';

interface PremiumFeatureLockProps {
  featureName: 'FoodLens AI' | 'NutriBand';
  onGoHome?: () => void;
}

export const PremiumFeatureLock: React.FC<PremiumFeatureLockProps> = ({ featureName, onGoHome }) => {
  const navigate = useNavigate();
  const isFoodLens = featureName === 'FoodLens AI';

  const highlights = isFoodLens
    ? [
        'AI Vision OCR label & ingredient scanner with hidden sugar & E-number detection',
        'Instant 3M+ packaged food barcode lookup with NOVA processing score',
        'Home-cooked Indian plate & BLW texture analyzer with choking risk checks',
        'Personalized child allergen & ICMR-NIN macro compliance alerts'
      ]
    : [
        'Real-time NutriBand skin temperature, stillness & sleep cycle telemetry',
        'Modular sensor pod support: Newborn Diaper Clip (0–12m) & Smart Wrist Straps (1–18y)',
        'Smart fever alerts, rollover warnings & continuous night vitals monitoring',
        'One-click clinical PDF export for your pediatrician consultations'
      ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] border border-amber-400/35 bg-gradient-to-br from-[#1b1407] via-[#100d1a] to-[#080b14] p-7 sm:p-12 shadow-2xl text-center"
      >
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -top-28 -right-24 h-80 w-80 rounded-full bg-amber-500/15 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-indigo-500/15 blur-[100px]" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          {/* Top Locked Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Premium Feature • Locked on Free Account</span>
          </div>

          {/* Lock Icon & Feature Icon Emblem */}
          <div className="relative w-20 h-20 mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400/20 via-amber-500/15 to-yellow-500/10 border border-amber-400/40 flex items-center justify-center shadow-xl shadow-amber-500/10">
              {isFoodLens ? (
                <Camera className="w-9 h-9 text-amber-300" />
              ) : (
                <Activity className="w-9 h-9 text-cyan-300" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 flex items-center justify-center shadow-lg border-2 border-[#0e0c16]">
              <Lock className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-2.5">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {featureName} is a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                Premium Feature
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Your signed-in account is currently on the <strong className="text-white">Free Plan</strong>. Upgrade to the{' '}
              <strong className="text-amber-300">Comprehensive Premium Plan</strong> to unlock full access to{' '}
              <strong className="text-white">{featureName}</strong> along with all advanced AI vision and biometric monitoring tools.
            </p>
          </div>

          {/* Feature Checklist Card */}
          <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-5 sm:p-6 text-left space-y-3.5">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                What You Unlock with {featureName} Premium
              </span>
              <span className="text-xs font-black text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 px-2.5 py-0.5 rounded-full">
                ₹499 / month
              </span>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200">
              {highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              type="button"
              onClick={() => {
                playSound('pop');
                navigate('/plans');
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Crown className="w-4 h-4 fill-slate-950" />
              <span>Upgrade to Premium Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onGoHome && (
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  onGoHome();
                }}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Instant activation • Includes both FoodLens AI &amp; NutriBand telemetry</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
