import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Check, 
  Sparkles, 
  Crown, 
  ShieldCheck, 
  ArrowRight, 
  Camera, 
  Activity, 
  Trophy, 
  PhoneCall, 
  Users, 
  MessageCircle, 
  Utensils, 
  Baby, 
  Clock, 
  Zap, 
  Tv,
  ArrowLeft,
  CheckCircle2,
  Syringe,
  Lock,
  Globe2,
  Info
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import { useAuth } from '../lib/AuthContext';

export const PlansPremiumPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const activePlan = (() => {
    const unlocked = localStorage.getItem('tricky_toddlers_premium_unlocked') === 'true';
    const plan = localStorage.getItem('user_plan');
    if (unlocked || plan === 'comprehensive') return 'comprehensive';
    return 'free';
  })();

  const handleChooseFreePlan = () => {
    // "no action when someon choose free plan"
    playSound('click');
  };

  const handleChoosePremiumPlan = () => {
    playSound('pop');
    navigate(`/checkout?period=${billingPeriod}`);
  };

  return (
    <div className="flex-1 w-full text-slate-100 pb-10 pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/"
          onClick={() => playSound('click')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Active Plan Status Tag */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400 font-medium">Your Active Plan:</span>
          <span className={`font-bold ${activePlan === 'comprehensive' ? 'text-amber-300' : 'text-blue-300'}`}>
            {activePlan === 'comprehensive' ? 'Premium Plan ✨' : 'Free Plan'}
          </span>
        </div>
      </div>

      {/* Header & Billing Period Switcher */}
      <div className="text-center space-y-4 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>Tricky Toddlers Membership & Plans</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight text-balance">
          Simple, Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300">Parenting Plans</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto text-balance">
          Start with our generous 100% Free Plan forever, or unlock the Premium Plan for complete AI vision and biometric telemetry.
        </p>

        {/* Monthly / Yearly Toggle */}
        <div className="flex items-center justify-center gap-4 pt-3">
          <span className={`text-sm font-bold tracking-tight transition-colors ${billingPeriod === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
            Monthly Billing
          </span>
          <button
            type="button"
            onClick={() => {
              playSound('click');
              setBillingPeriod(prev => prev === 'monthly' ? 'yearly' : 'monthly');
            }}
            className="relative w-16 h-8 bg-indigo-950 rounded-full p-1 border border-white/20 transition-all cursor-pointer hover:border-amber-400/50"
          >
            <motion.div
              layout
              className="w-6 h-6 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full shadow-lg flex items-center justify-center"
              animate={{ x: billingPeriod === 'yearly' ? 32 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />
            </motion.div>
          </button>
          <span className={`text-sm font-bold tracking-tight transition-colors flex items-center gap-1.5 ${billingPeriod === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
            <span>Yearly Billing</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-black uppercase tracking-wider border border-emerald-500/30">
              Save 15%
            </span>
          </span>
        </div>
      </div>

      {/* =========================================================
          THE TWO PLANS: FREE PLAN & COMPREHENSIVE PREMIUM (499/mo)
      ========================================================== */}
      <div id="pricing-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
        
        {/* ================= PLAN 1: FREE PLAN ================= */}
        <motion.div
          whileHover={{ y: -4 }}
          className={`relative rounded-[2.25rem] p-8 sm:p-10 flex flex-col justify-between border backdrop-blur-xl transition-all shadow-2xl ${
            activePlan === 'free'
              ? 'bg-[#0b1329]/90 border-blue-500/40 ring-2 ring-blue-500/20'
              : 'bg-[#080d1c]/80 border-white/10'
          }`}
        >
          {activePlan === 'free' && (
            <div className="absolute top-6 right-6 bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
              Current Plan
            </div>
          )}

          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-400 mb-2 font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Standard Daily Care</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
              FREE
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Everything you need for everyday toddler parenting.
            </p>

            {/* Price Tag */}
            <div className="flex items-baseline gap-2 mb-8 pb-6 border-b border-white/10">
              <span className="text-4xl sm:text-5xl font-black text-white">₹0</span>
              <span className="text-slate-400 text-sm font-medium">/ Free Forever</span>
            </div>

            {/* Included Free Features List */}
            <div className="space-y-3.5">
              <div className="text-xs font-black uppercase tracking-wider text-blue-300 font-mono">
                Included Free Features:
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
                {[
                  'Toddler Academy: Complete interactive learning (Numbers, Counting, Words, Sentences, Colors & 25 Emotions)',
                  'Pediatric Care: Clinic directory, 24/7 doctor chat & consultation guides',
                  'Weekly live interactive pediatric Q&A webinars & expert doctor reports',
                  'AI Parenting Assistant: 24/7 evidence-based toddler, sleep & tantrum guidance',
                  'Parent Community: Forums, crowdsourced advice & 1:1 peer connect messaging',
                  'Smart Guide to First Foods: 100+ ingredient safety guide & wholesome Indian recipes',
                  'Milestone Tracker: Developmental leap logs compliant with WHO, Indian IAP and FSSAI',
                  'Daily Routine Checker: Nap routines, bedtime habits & meal logging',
                  'Vaccine Tracker: 100% free childhood immunization records & date reminders',
                  'Toddler TV: Curated safe screen-time educational videos & bedtime stories',
                  '12 Major Indian Languages: Full app translation in Hindi, Tamil, Telugu, Kannada, etc.',
                  '100% Parental Privacy: Zero data selling & strict confidentiality'
                ].map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="leading-snug text-slate-200">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Button: No Action when someone chooses free plan */}
          <div className="pt-8 mt-8 border-t border-white/10">
            <button
              type="button"
              onClick={handleChooseFreePlan}
              className="w-full py-4 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 font-bold text-sm uppercase tracking-wider transition-all cursor-default"
              title="You already have full access to all Free Plan features"
            >
              {activePlan === 'free' ? 'Currently Active • Free Forever' : 'Free Forever (Included)'}
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              No credit card required. Never expires.
            </p>
          </div>
        </motion.div>

        {/* ================= PLAN 2: COMPREHENSIVE PREMIUM (₹499/mo) ================= */}
        <motion.div
          whileHover={{ y: -4 }}
          className={`relative rounded-[2.25rem] p-8 sm:p-10 flex flex-col justify-between border backdrop-blur-xl transition-all shadow-2xl ${
            activePlan === 'comprehensive'
              ? 'bg-gradient-to-b from-[#1f1705] via-[#140e03] to-[#0a0701] border-amber-400 ring-2 ring-amber-400/30'
              : 'bg-gradient-to-b from-[#1a1205] via-[#100b03] to-[#090702] border-amber-500/40 shadow-amber-950/40'
          }`}
        >
          {/* Top Banner */}
          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-yellow-300 text-slate-950 font-mono text-[9px] font-black px-6 py-2 rounded-bl-3xl uppercase tracking-widest shadow-lg">
            Most Popular ✨
          </div>

          {activePlan === 'comprehensive' && (
            <div className="absolute top-10 right-6 bg-amber-400 text-slate-950 font-mono text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
              Active Plan ✨
            </div>
          )}

          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-400 mb-2 font-mono">
              <Crown className="w-4 h-4" />
              <span>Advance Technology at Your Fingertips</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-200 mb-2 whitespace-nowrap">
              PREMIUM
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Advanced AI + vision + connected monitoring.
            </p>

            {/* Price Tag: 499 / month */}
            <div className="flex items-baseline gap-2 mb-8 pb-6 border-b border-amber-500/20">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-black text-amber-300">
                  {billingPeriod === 'monthly' ? '₹499' : '₹4,999'}
                </span>
                <span className="text-slate-300 text-sm font-medium">
                  /{billingPeriod === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
            </div>

            {/* Included Premium Suite Features List */}
            <div className="space-y-6">
              <div className="text-xs font-black uppercase tracking-wider text-amber-300 font-mono flex items-center justify-between border-b border-amber-500/20 pb-2">
                <span>Everything in the Free Plan, PLUS:</span>
                <span className="text-[10px] text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-sans">Full Premium Suite</span>
              </div>

              {/* Group 1: FOODLENS PRO | Smart Food Analysis */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 rounded-xl">
                  <Camera className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>FOODLENS PRO | Smart Food Analysis</span>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200 pl-1">
                  {[
                    'AI Food & Label Scanning',
                    'HFSS Check: High Fat, High Sodium, High Sugar & High Salt',
                    'Ingredient & Additive Analysis',
                    'Allergen & Food Safety Analysis',
                    'Personalised Nutrition Analysis',
                    'Nutrition Breakdown: Calories, Protein, Carbs, Fat, Sugar & Sodium',
                    '“Why This Score?” Transparent Factor Breakdown',
                    'Smart Food Comparisons & Alternatives',
                    'India-Focused Food Standards & Frameworks',
                    'Scan → Analyse → Decide'
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="leading-snug text-slate-100 font-medium">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Group 2: NUTRIBAND | Smart Wellness Monitoring */}
              <div className="space-y-3 pt-3 border-t border-amber-500/15">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-300 bg-cyan-500/10 border border-cyan-500/25 px-3 py-1.5 rounded-xl">
                  <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>NUTRIBAND | Smart Wellness Monitoring</span>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200 pl-1">
                  {[
                    'Nutriband Integration',
                    'One Modular Sensor, Three Ways to Wear',
                    'Diaper Clip for 0 to 12 Months',
                    'Soft Cotton Strap for Sensitive Skin (1 to 10 Years)',
                    'Silicone Smart Band for Big Kids (10+ Years)',
                    'Cordless & Lightweight Design',
                    'GPS Location',
                    'Sleep Tracking & Sleep Pattern Analysis',
                    'Skin Temperature Monitoring',
                    'Movement & Stillness Monitoring',
                    'Fall & Tumble Detection',
                    'Wellness Monitoring & Daily Insights',
                    'Real-Time Parent Alerts',
                    'Multi-Caregiver Cloud Sync',
                    'Live App Telemetry & Daily Summaries',
                    'Fast USB Quick Charge (Active 48 hrs · 30m charge)',
                    'BPA, Phthalate, Lead & Latex Free'
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="leading-snug text-slate-100 font-medium">{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Hardware Note moved to bottom of NutriBand */}
                <div className="mt-3 p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-xs text-cyan-200/95 leading-relaxed">
                  <div className="font-bold flex items-center gap-1.5 text-cyan-300 mb-1">
                    <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Hardware Note</span>
                  </div>
                  <span>NutriBand hardware cost is not included in monthly billing and yearly billing. It is a separate one-time purchase with straps available from Small to Large (Large).</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button: Navigates to full Checkout Page */}
          <div className="pt-8 mt-8 border-t border-amber-500/20">
            <button
              type="button"
              onClick={handleChoosePremiumPlan}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>{activePlan === 'comprehensive' ? 'Manage Premium Plan' : `Upgrade to Premium Plan (${billingPeriod === 'monthly' ? '₹499/month' : '₹4,999/year'})`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
            </p>
          </div>
        </motion.div>

      </div>

      {/* =========================================================
          FEATURE-BY-FEATURE COMPARISON SECTION (RECREATED)
      ========================================================== */}
      <div className="max-w-5xl mx-auto space-y-6 pt-4">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Complete Capability Matrix</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight text-balance">
            Feature-by-Feature Comparison
          </h3>
        </div>

        <div className="border border-white/10 rounded-3xl overflow-hidden bg-[#0a1020]/90 backdrop-blur-xl shadow-2xl">
          {/* Table Header */}
          <div className="grid grid-cols-12 p-4 sm:p-5 bg-white/[0.04] border-b border-white/10 text-xs font-black uppercase tracking-wider items-center">
            <div className="col-span-6 sm:col-span-6 text-slate-300 font-mono">Feature</div>
            <div className="col-span-3 sm:col-span-3 text-center text-blue-300 font-mono">Free Plan</div>
            <div className="col-span-3 sm:col-span-3 text-center text-amber-300 font-mono">
              Premium Plan ({billingPeriod === 'monthly' ? '₹499/month' : '₹4,999/year'})
            </div>
          </div>

          <div className="divide-y divide-white/5 text-xs sm:text-sm">
            {/* Category 1: Free Core Essentials */}
            <div className="p-3 sm:p-3.5 bg-blue-500/10 border-y border-blue-500/20 text-blue-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2 font-mono">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Core Parenting Essentials (Included in Free Plan)</span>
            </div>

            {[
              'Toddler Academy: Complete interactive learning (Numbers, Counting, Words, Sentences, Colors & 25 Emotions)',
              'Pediatric Care: Clinic directory, 24/7 doctor chat & consultation guides',
              'Weekly live interactive pediatric Q&A webinars & expert doctor reports',
              'AI Parenting Assistant: 24/7 evidence-based toddler, sleep & tantrum guidance',
              'Parent Community: Forums, crowdsourced advice & 1:1 peer connect messaging',
              'Smart Guide to First Foods: 100+ ingredient safety guide & wholesome Indian recipes',
              'Milestone Tracker: Developmental leap logs compliant with WHO, Indian IAP and FSSAI',
              'Daily Routine Checker: Nap routines, bedtime habits & meal logging',
              'Childhood Vaccine Tracker: 100% free immunization records & date reminders',
              'Toddler TV: Curated safe screen-time educational videos & bedtime stories',
              '12 Major Indian Languages: Full app translation in Hindi, Tamil, Telugu, Kannada, etc.',
              '100% Parental Privacy: Zero data selling & strict confidentiality'
            ].map((name, idx) => (
              <div key={`free-${idx}`} className="grid grid-cols-12 p-3 sm:p-3.5 items-center hover:bg-white/[0.02] transition-colors">
                <div className="col-span-6 sm:col-span-6 text-slate-200 font-medium text-xs sm:text-sm pr-2">
                  {name}
                </div>
                <div className="col-span-3 sm:col-span-3 flex justify-center">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
                <div className="col-span-3 sm:col-span-3 flex justify-center">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
              </div>
            ))}

            {/* Category 2: FoodLens Pro */}
            <div className="p-3 sm:p-3.5 bg-amber-500/10 border-y border-amber-500/20 text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2 font-mono">
              <Camera className="w-4 h-4 text-amber-400" />
              <span>FOODLENS PRO | Smart Food Analysis (Premium Only)</span>
            </div>

            {[
              'AI Food & Label Scanning',
              'HFSS Check: High Fat, High Sodium, High Sugar & High Salt',
              'Ingredient & Additive Analysis',
              'Allergen & Food Safety Analysis',
              'Personalised Nutrition Analysis',
              'Nutrition Breakdown: Calories, Protein, Carbs, Fat, Sugar & Sodium',
              '“Why This Score?” Transparent Factor Breakdown',
              'Smart Food Comparisons & Alternatives',
              'India-Focused Food Standards & Frameworks',
              'Scan → Analyse → Decide'
            ].map((name, idx) => (
              <div key={`foodlens-${idx}`} className="grid grid-cols-12 p-3 sm:p-3.5 items-center hover:bg-white/[0.02] transition-colors">
                <div className="col-span-6 sm:col-span-6 text-slate-200 font-medium text-xs sm:text-sm pr-2">
                  {name}
                </div>
                <div className="col-span-3 sm:col-span-3 flex justify-center">
                  <span className="text-slate-600 font-bold">-</span>
                </div>
                <div className="col-span-3 sm:col-span-3 flex justify-center">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
              </div>
            ))}

            {/* Category 3: NutriBand */}
            <div className="p-3 sm:p-3.5 bg-cyan-500/10 border-y border-cyan-500/20 text-cyan-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2 font-mono">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>NUTRIBAND | Smart Wellness Monitoring (Premium Only)</span>
            </div>

            {[
              'Nutriband Integration',
              'One Modular Sensor, Three Ways to Wear',
              'Diaper Clip for 0 to 12 Months',
              'Soft Cotton Strap for Sensitive Skin (1 to 10 Years)',
              'Silicone Smart Band for Big Kids (10+ Years)',
              'Cordless & Lightweight Design',
              'GPS Location',
              'Sleep Tracking & Sleep Pattern Analysis',
              'Skin Temperature Monitoring',
              'Movement & Stillness Monitoring',
              'Fall & Tumble Detection',
              'Wellness Monitoring & Daily Insights',
              'Real-Time Parent Alerts',
              'Multi-Caregiver Cloud Sync',
              'Live App Telemetry & Daily Summaries',
              'Fast USB Quick Charge (Active 48 hrs · 30m charge)',
              'BPA, Phthalate, Lead & Latex Free'
            ].map((name, idx) => (
              <div key={`nutriband-${idx}`} className="grid grid-cols-12 p-3 sm:p-3.5 items-center hover:bg-white/[0.02] transition-colors">
                <div className="col-span-6 sm:col-span-6 text-slate-200 font-medium text-xs sm:text-sm pr-2">
                  {name}
                </div>
                <div className="col-span-3 sm:col-span-3 flex justify-center">
                  <span className="text-slate-600 font-bold">-</span>
                </div>
                <div className="col-span-3 sm:col-span-3 flex justify-center">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
              </div>
            ))}

            {/* Hardware Note at bottom of NutriBand comparison */}
            <div className="p-3.5 bg-cyan-950/40 border-t border-cyan-500/20 text-xs text-cyan-200/90 flex items-start gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Hardware Note:</strong> NutriBand hardware cost is not included in monthly or yearly software billing. It is a separate one-time purchase with straps from Small to Large (Large).</span>
            </div>
          </div>
        </div>

        {/* Final CTA Strip */}
        <div className="text-center pt-4">
          <button
            onClick={handleChoosePremiumPlan}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 transition-all transform hover:scale-[1.02] active:scale-95 inline-flex items-center gap-2 cursor-pointer"
          >
            <Crown className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span>Upgrade to Premium Plan for {billingPeriod === 'monthly' ? '₹499/month' : '₹4,999/year'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
