import React from 'react';
import { Sparkles, Camera, ExternalLink, ShieldCheck, Apple, Flame, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { playSound } from '../lib/sounds';

export const FoodLensSection: React.FC = () => {
  const foodLensAppUrl = "https://ais-pre-w3hncn5ot27atufhrg53ot-26432502266.asia-southeast1.run.app";

  return (
    <motion.section 
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 pt-6 pb-2"
      aria-label="FoodLens Premium Section"
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-amber-400/30 bg-gradient-to-r from-[#170e28] via-[#101935] to-[#0a1f2e] p-5 sm:p-7 shadow-[0_12px_40px_rgba(245,158,11,0.12)] backdrop-blur-2xl">
        {/* Glow & Ambient Background Effects */}
        <div className="pointer-events-none absolute -top-24 -left-20 h-64 w-64 rounded-full bg-amber-500/15 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-emerald-500/15 blur-[80px]" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left Column: Icon + Description */}
          <div className="flex items-start gap-4 sm:gap-5 max-w-3xl">
            {/* Visual Icon / Scanner Lens Avatar */}
            <div className="relative shrink-0 mt-0.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/25 flex items-center justify-center">
                <div className="w-full h-full bg-[#0d1326] rounded-[0.9rem] flex items-center justify-center">
                  <Camera className="w-7 h-7 text-amber-300" />
                </div>
              </div>
              {/* Pulsing Scan Indicator */}
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-400" />
              </span>
            </div>

            {/* Content Details */}
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  FoodLens
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 text-black text-[10px] font-black tracking-widest uppercase shadow-md flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 fill-black text-black" />
                  FREE DEMO
                </span>
                <span className="text-[11px] font-bold text-amber-200/80 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                  AI Nutrition &amp; Plate Scanner
                </span>
              </div>

              <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-3.5">
                Point your camera at any baby meal, snack, or ingredient label to instantly analyze nutritional value, verify baby-safe textures, spot allergens, and receive pediatric-backed feeding guidance tailored for toddler growth.
              </p>

              {/* Highlights Chips */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs text-white/75 font-semibold">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                  <Camera className="w-3.5 h-3.5 text-amber-300" /> Instant Plate Scan
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Allergy &amp; Choking Check
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                  <Apple className="w-3.5 h-3.5 text-rose-300" /> Micronutrient Breakdown
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                  <Flame className="w-3.5 h-3.5 text-orange-300" /> Age-Appropriate Portions
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Action Button */}
          <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-2">
            <a
              href={foodLensAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSound('pop')}
              className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 text-black font-black text-sm sm:text-base tracking-tight shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 border border-amber-300/60"
            >
              <Sparkles className="w-4 h-4 text-black fill-black" />
              <span>Launch FoodLens App</span>
              <ArrowUpRight className="w-4 h-4 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <span className="text-[11px] text-center lg:text-right text-white/40 font-medium">
              Opens full FoodLens AI suite in new tab
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
