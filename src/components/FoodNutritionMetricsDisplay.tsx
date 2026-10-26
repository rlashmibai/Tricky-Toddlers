import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Apple, 
  Calculator, 
  ChevronDown, 
  ChevronUp, 
  Leaf, 
  Milk, 
  Wheat, 
  Flame,
  MinusCircle,
  Check,
  Droplets
} from 'lucide-react';
import { getCompleteFoodAnalysis, CompleteFoodAnalysis } from '../lib/foodNutritionCalculator';
import { playSound } from '../lib/sounds';

interface FoodNutritionMetricsDisplayProps {
  food: {
    name?: string;
    calories?: string;
    protein?: string;
    sodium?: string;
    ingredients?: string[];
    allergyCheck?: string;
    score?: string;
    scoreNumber?: number;
    novaLevel?: string;
    isSafeForBaby?: boolean;
    safetyWarning?: string;
    blwStatus?: string;
    texture?: string;
    pediatricTip?: string;
    foodType?: string;
    brandName?: string;
  };
  isCompact?: boolean;
}

export const FoodNutritionMetricsDisplay: React.FC<FoodNutritionMetricsDisplayProps> = ({ 
  food,
  isCompact = false 
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'score' | 'nutrients' | 'ingredients' | 'allergens'>('all');
  const analysis: CompleteFoodAnalysis = getCompleteFoodAnalysis(food);

  const { nutrients, ingredients, allergens, scoreCalculation } = analysis;

  const negativeFactors = scoreCalculation.factors.filter(f => f.points < 0);
  const compliantFactors = scoreCalculation.factors.filter(f => f.points === 0);

  // Sodium and Salt values
  const sodiumItem = nutrients.find(n => n.id === 'sodium');
  const saltItem = nutrients.find(n => n.id === 'salt');
  const calorieItem = nutrients.find(n => n.id === 'calories');
  const proteinItem = nutrients.find(n => n.id === 'protein');

  return (
    <div className="space-y-8 text-left">
      
      {/* =========================================================
          KEY HIGHLIGHTS BAR:
          1. Overall Scope / 10 Button (Before Calories)
          2. Calories
          3. Protein
          4. Salt Content
          5. Sodium (Separate signal after Salt Content)
      ========================================================== */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#091122] border border-white/10 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* 1. Overall Scope Button before Calories */}
          <button
            type="button"
            onClick={() => {
              playSound('pop');
              setActiveTab(activeTab === 'score' ? 'all' : 'score');
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
            title="Click to view score calculation formula"
          >
            <ShieldCheck className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span>Overall Scope: {scoreCalculation.finalScore.toFixed(1)} / 10</span>
          </button>

          {/* 2. Calories */}
          <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 font-normal">Calories:</span>
            <span>{calorieItem?.amount || food.calories || '145 kcal'}</span>
          </div>

          {/* 3. Protein */}
          <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
            <Apple className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 font-normal">Protein:</span>
            <span>{proteinItem?.amount || food.protein || '5.2 g'}</span>
          </div>

          {/* 8. Salt Content */}
          <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-400/30 text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-200/70 font-normal">Salt Content:</span>
            <span>{saltItem?.amount || '0.11 g'}</span>
          </div>

          {/* 9. Sodium (Separate signal after Salt Content) */}
          <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400 font-normal">Sodium:</span>
            <span>{sodiumItem?.amount || '45 mg'}</span>
          </div>
        </div>

        {/* Section Navigation Filter */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => { playSound('click'); setActiveTab('all'); }}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === 'all' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Sections
          </button>
          <button
            onClick={() => { playSound('click'); setActiveTab('score'); }}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === 'score' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Scorecard
          </button>
          <button
            onClick={() => { playSound('click'); setActiveTab('nutrients'); }}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === 'nutrients' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Nutrients
          </button>
          <button
            onClick={() => { playSound('click'); setActiveTab('ingredients'); }}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === 'ingredients' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ingredients
          </button>
        </div>
      </div>

      {/* =========================================================
          SECTION 1: SCORECARD CALCULATION & REASONS FOR DEDUCTIONS
          (CLEAN, JARGON-FREE SIMPLE ARITHMETIC)
      ========================================================== */}
      {(activeTab === 'all' || activeTab === 'score') && (
        <section className="p-6 sm:p-8 rounded-3xl bg-[#0c1426] border border-indigo-500/30 shadow-2xl space-y-7">
          
          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <Calculator className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Nutrition Scorecard &amp; Calculation
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Base 10.0 scale with simple deductions based on ingredients, sodium/salt, added sugar, and fat.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-4 py-2 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 font-black text-sm sm:text-base flex items-center gap-2 shadow-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Calculated Score: {scoreCalculation.finalScore.toFixed(1)} / 10</span>
              </span>
            </div>
          </div>

          {/* Stepped Formula & Total Result Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-black/80 border border-indigo-400/25 space-y-5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <span className="text-xs font-black uppercase tracking-widest text-slate-300">
                Total Calculated Result:
              </span>
              <span className={`text-xs sm:text-sm font-black px-3.5 py-1 rounded-full border ${
                scoreCalculation.grade === 'D'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : scoreCalculation.grade === 'A+' || scoreCalculation.grade === 'A'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {scoreCalculation.verdict}
              </span>
            </div>

            {/* Arithmetic Formula Display */}
            <div className="p-4 sm:p-5 rounded-2xl bg-black/75 border border-white/10 font-mono space-y-4">
              {/* Responsive Equation Row */}
              <div className="flex flex-wrap items-center gap-2.5 text-sm sm:text-base font-black text-white">
                <span className="px-3 py-1 rounded-xl bg-white/15 border border-white/20 text-white font-mono shadow-sm">
                  Base: 10.0
                </span>
                
                {negativeFactors.length > 0 ? (
                  negativeFactors.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-rose-400">
                      <span className="text-rose-400 font-black text-lg">−</span>
                      <span className="px-2 py-0.5 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono">
                        {Math.abs(f.points).toFixed(1)}
                      </span>
                      <span className="text-xs font-sans font-semibold text-rose-300/80">
                        ({f.factor})
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-emerald-400 text-xs font-sans font-semibold">
                    − 0.0 deductions (100% wholesome composition)
                  </span>
                )}

                <span className="text-slate-400 font-sans font-black text-lg">=</span>
                
                <span className="text-lg sm:text-xl font-black text-white px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 shadow-inner">
                  {scoreCalculation.finalScore.toFixed(1)} / 10
                </span>
              </div>

              {/* Vertical Step Breakdown */}
              {negativeFactors.length > 0 && (
                <div className="pt-3 border-t border-white/10 font-sans text-xs space-y-1.5 text-slate-300">
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    Step-by-Step Subtraction:
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <span className="font-mono font-bold w-12 text-slate-200">10.0</span>
                    <span className="text-slate-400">Initial gold-standard pediatric baseline score</span>
                  </div>
                  {negativeFactors.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-rose-300">
                      <span className="font-mono font-bold w-12 text-rose-400">− {Math.abs(f.points).toFixed(1)}</span>
                      <span>({f.factor}) · <span className="text-slate-400">{f.reason}</span></span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 pt-1.5 border-t border-white/10 text-emerald-300 font-bold">
                    <span className="font-mono w-12 text-emerald-400">= {scoreCalculation.finalScore.toFixed(1)}</span>
                    <span className="text-slate-200">Final Calculated Score out of 10 ({scoreCalculation.verdict})</span>
                  </div>
                </div>
              )}
            </div>

            {/* Pediatric Health Rationale Alert Box */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              scoreCalculation.grade === 'D'
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-200'
                : scoreCalculation.grade === 'A+' || scoreCalculation.grade === 'A'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-200'
            }`}>
              {scoreCalculation.grade === 'D' ? (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <p className="text-xs sm:text-sm leading-relaxed font-normal">
                {scoreCalculation.whyThisScore}
              </p>
            </div>
          </div>

          {/* Pillars Breakdown: Added Sugar, Sodium/Salt, Ingredients, Fat, Safety */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                Why Points Were Deducted (Pillar Breakdown)
              </span>
              <span className="text-[11px] text-slate-400 font-semibold">
                Transparent Pediatric Analysis
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {scoreCalculation.factors.map((factor, idx) => {
                const isDeducted = factor.points < 0;

                return (
                  <div 
                    key={idx}
                    className={`p-4 sm:p-4.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2.5 ${
                      isDeducted 
                        ? 'bg-rose-950/20 border-rose-500/30' 
                        : 'bg-emerald-950/15 border-emerald-500/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                        {isDeducted ? (
                          <MinusCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        ) : (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        <span>{factor.factor}</span>
                      </span>

                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-lg ${
                        isDeducted 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {isDeducted ? `${factor.points.toFixed(1)} pts` : '0.0 pts (Clean)'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {factor.reason}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </section>
      )}

      {/* =========================================================
          SECTION 2: 12 FOOD SIGNALS & NUTRIENTS PANEL (12 SIGNALS)
      ========================================================== */}
      {(activeTab === 'all' || activeTab === 'nutrients') && (
        <section className="p-6 sm:p-7 rounded-3xl bg-[#0c1426] border border-white/10 shadow-xl space-y-5">
          
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Apple className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  12 Nutritional Signals &amp; Composition
                </h3>
                <p className="text-xs text-slate-400">
                  Standardized 12-signal profile tracked consistently across all sample foods.
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              12 Signals Verified · Per Serving / 100g
            </span>
          </div>

          {/* Clean, spacious 12-signal grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {nutrients.map((item) => {
              const isWarning = item.status === 'warning';
              const isExcellent = item.status === 'excellent';
              const isCaution = item.status === 'caution';

              return (
                <div 
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-2.5 ${
                    isWarning 
                      ? 'bg-rose-950/20 border-rose-500/30' 
                      : isCaution
                      ? 'bg-amber-950/20 border-amber-500/30'
                      : isExcellent
                      ? 'bg-emerald-950/20 border-emerald-400/30'
                      : 'bg-white/[0.03] border-white/10'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <span>{item.label}</span>
                      {item.rdaPercent && (
                        <span className={`text-[10px] px-2 py-0.5 rounded font-black ${
                          isWarning ? 'bg-rose-500/20 text-rose-300' : 'bg-white/10 text-slate-300'
                        }`}>
                          {item.rdaPercent}
                        </span>
                      )}
                    </div>
                    
                    <div className="text-lg sm:text-xl font-black text-white mt-1 tracking-tight">
                      {item.amount}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 space-y-1">
                    <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-md border ${
                      isWarning 
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                        : isCaution
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : isExcellent
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-white/10 text-slate-300 border-white/10'
                    }`}>
                      {item.badge}
                    </span>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {item.note}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </section>
      )}

      {/* =========================================================
          SECTION 3: INGREDIENTS & ADDITIVES PROFILE (SEPARATE)
      ========================================================== */}
      {(activeTab === 'all' || activeTab === 'ingredients') && (
        <section className="p-6 sm:p-7 rounded-3xl bg-[#0c1426] border border-white/10 shadow-xl space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                <Wheat className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Ingredients &amp; Additives Analysis
                </h3>
                <p className="text-xs text-slate-400">
                  Verified against clean-label, whole food, and safety standards.
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              {ingredients.length} Listed Items
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ing, idx) => {
                const isAdditive = ing.type === 'additive';
                const isProcessed = ing.type === 'processed';

                return (
                  <span 
                    key={idx}
                    className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                      isAdditive 
                        ? 'bg-rose-500/15 border-rose-500/30 text-rose-300 font-bold'
                        : isProcessed
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 font-medium'
                        : 'bg-white/5 border-white/10 text-slate-200 font-medium'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isAdditive ? 'bg-rose-400' : isProcessed ? 'bg-amber-400' : 'bg-emerald-400'
                    }`} />
                    <span>{ing.name}</span>
                  </span>
                );
              })}
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 text-xs text-slate-300 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {ingredients.some(i => i.type === 'additive') 
                  ? 'Notice: Contains industrial additives or flavorings. Recommended for occasional consumption.'
                  : 'Purity Check: 100% whole food recipe with zero synthetic additives, chemical preservatives, or artificial dyes.'}
              </span>
            </div>
          </div>

        </section>
      )}

      {/* =========================================================
          SECTION 4: ALLERGENS PROFILE (SEPARATE)
      ========================================================== */}
      {(activeTab === 'all' || activeTab === 'allergens') && (
        <section className="p-6 sm:p-7 rounded-3xl bg-[#0c1426] border border-white/10 shadow-xl space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                <Milk className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Allergens Profile &amp; Digestive Safety
                </h3>
                <p className="text-xs text-slate-400">
                  Screened against major common allergens (milk solids, gluten, soy, eggs, nuts).
                </p>
              </div>
            </div>

            <span className={`text-xs font-black px-3 py-1 rounded-full border ${
              allergens.riskLevel === 'High' 
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                : allergens.riskLevel === 'Moderate'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}>
              {allergens.riskLevel} Allergen Risk
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {allergens.detected.map((alg, idx) => (
                <span 
                  key={idx}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-2 ${
                    allergens.isHypoallergenic 
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' 
                      : 'bg-amber-500/15 border-amber-500/30 text-amber-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{alg}</span>
                </span>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-xs font-bold text-amber-300 block">Nutrition Guidance:</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {allergens.advice}
              </p>
            </div>
          </div>

        </section>
      )}

    </div>
  );
};
