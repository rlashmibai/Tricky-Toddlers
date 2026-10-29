import React from 'react';
import { 
  Sparkles
} from 'lucide-react';
import ecosystemImage from '../assets/images/ecosystem.png';

export const NutriBandIntegratedEcosystem: React.FC = () => {
  return (
    <section 
      id="integrated-ecosystem" 
      className="relative overflow-hidden rounded-[2.5rem] border border-cyan-500/30 bg-gradient-to-b from-[#0a1526] via-[#07111e] to-[#040812] p-4 sm:p-6 lg:p-8 shadow-2xl backdrop-blur-2xl my-8 scroll-mt-20 font-sans"
    >
      {/* Ambient background glows */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 relative z-10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-200 text-xs font-black uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>TrickyToddlers NutriBand Ecosystem</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            FoodLens AI + NutriBand + AI Assistant
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed">
            Real-time integration flow connecting plate nutrition vision, wearable health vitals, and pediatric intelligence.
          </p>
        </div>
      </div>

      {/* Main Ecosystem Image Display */}
      <div className="relative z-10 w-full rounded-2xl sm:rounded-3xl bg-slate-950/80 border border-white/10 shadow-2xl p-2 sm:p-3 overflow-hidden flex items-center justify-center">
        <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden group">
          <img 
            src={ecosystemImage} 
            alt="TrickyToddlers NutriBand Ecosystem - Integration between FoodLens AI, NutriBand Smartwatch, and AI Assistant"
            className="w-full h-auto object-contain block select-none rounded-xl"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
};
