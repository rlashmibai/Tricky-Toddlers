import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  Flame, 
  ChefHat, 
  Check, 
  Copy, 
  Calendar, 
  History, 
  Search, 
  Filter, 
  ShieldAlert, 
  Apple, 
  UtensilsCrossed, 
  Sunrise, 
  Sun, 
  Coffee, 
  Loader2, 
  Trash2, 
  CheckSquare, 
  Square, 
  ChevronRight,
  Printer,
  Share2,
  ExternalLink
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import { GeneratedRecipe, AIRecipeBatchRecord, getSavedRecipeHistory, deleteRecipeBatch } from '../lib/aiRecipeHistory';

export interface AIRecipeResultsViewProps {
  batch: AIRecipeBatchRecord | null;
  isLoading: boolean;
  onBackToRecipes: () => void;
  onRegenerateNew: () => void;
  initialTab?: 'results' | 'history';
}

export const AIRecipeResultsView: React.FC<AIRecipeResultsViewProps> = ({
  batch,
  isLoading,
  onBackToRecipes,
  onRegenerateNew,
  initialTab = 'results'
}) => {
  const navigate = useNavigate();
  const [viewTab, setViewTab] = useState<'results' | 'history'>(initialTab);
  const [selectedRecipe, setSelectedRecipe] = useState<GeneratedRecipe | null>(() => {
    return batch?.recipes?.[0] || null;
  });

  // History state
  const [historyList, setHistoryList] = useState<AIRecipeBatchRecord[]>(() => getSavedRecipeHistory());
  const [searchFilter, setSearchFilter] = useState('');
  const [mealTypeFilter, setMealTypeFilter] = useState<'All' | 'Breakfast' | 'Lunch' | 'Snack'>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  // Auto-select first recipe if batch updates
  React.useEffect(() => {
    if (batch?.recipes && batch.recipes.length > 0) {
      setSelectedRecipe(batch.recipes[0]);
      setCheckedIngredients({});
    }
  }, [batch]);

  const toggleIngredientCheck = (idx: number) => {
    playSound('click');
    setCheckedIngredients(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleCopyRecipe = (recipe: GeneratedRecipe) => {
    playSound('pop');
    const text = `${recipe.name} (${recipe.mealType})\n\nPrep Time: ${recipe.prepTime} | Cook Time: ${recipe.cookTime}\nTexture Guide: ${recipe.textureGuide}\n\nIngredients:\n${recipe.ingredients.map(i => `• ${i}`).join('\n')}\n\nInstructions:\n${recipe.instructions.map((ins, idx) => `${idx + 1}. ${ins}`).join('\n')}\n\nNutritional Benefits:\n${recipe.nutritionBenefits}\n\nSafety Guidelines:\n${recipe.safetyAlerts}`;
    
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(recipe.id);
      setTimeout(() => setCopiedId(null), 3000);
    }
  };

  const handleDeleteBatch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('pop');
    const updated = deleteRecipeBatch(id);
    setHistoryList(updated);
  };

  const handleSelectHistoryRecipe = (recipe: GeneratedRecipe) => {
    playSound('glass');
    setSelectedRecipe(recipe);
    setViewTab('results');
    setCheckedIngredients({});
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  // Filtered history records
  const filteredHistory = useMemo(() => {
    return historyList.filter(record => {
      const matchQuery = searchFilter.trim() === '' || 
        record.ingredientsInput.toLowerCase().includes(searchFilter.toLowerCase()) ||
        record.date.toLowerCase().includes(searchFilter.toLowerCase()) ||
        record.recipes.some(r => r.name.toLowerCase().includes(searchFilter.toLowerCase()));
      
      const matchMeal = mealTypeFilter === 'All' ||
        record.recipes.some(r => r.mealType.toLowerCase() === mealTypeFilter.toLowerCase());

      return matchQuery && matchMeal;
    });
  }, [historyList, searchFilter, mealTypeFilter]);

  const getMealBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'breakfast':
        return {
          bg: 'bg-amber-500/20',
          text: 'text-amber-300',
          border: 'border-amber-400/30',
          activeRing: 'ring-amber-400/50',
          icon: Sunrise
        };
      case 'lunch':
        return {
          bg: 'bg-emerald-500/20',
          text: 'text-emerald-300',
          border: 'border-emerald-400/30',
          activeRing: 'ring-emerald-400/50',
          icon: Sun
        };
      case 'snack':
      default:
        return {
          bg: 'bg-purple-500/20',
          text: 'text-purple-300',
          border: 'border-purple-400/30',
          activeRing: 'ring-purple-400/50',
          icon: Coffee
        };
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Top Navigation Bar */}
      <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToRecipes}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md active:scale-95 border border-white/10"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Back to Recipes</span>
          </button>

          <div className="h-6 w-px bg-white/10 hidden sm:block" />

          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black text-emerald-300 uppercase tracking-widest">
              AI NutriChef: Your Kitchen Assistant
            </span>
          </div>
        </div>

        {/* View Switcher: Generated Results vs Recipe History */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { playSound('pop'); setViewTab('results'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              viewTab === 'results'
                ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/20'
                : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generated Recipes</span>
          </button>

          <button
            type="button"
            onClick={() => { 
              playSound('pop'); 
              setHistoryList(getSavedRecipeHistory());
              setViewTab('history'); 
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              viewTab === 'history'
                ? 'bg-indigo-400 text-slate-950 shadow-md shadow-indigo-400/20'
                : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Recipe History ({historyList.length})</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-white/10 my-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 animate-spin">
            <Loader2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
            AI Baby Chef is Crafting 3 Tailored Recipes...
          </h2>
          <p className="text-sm text-white/60 max-w-md mx-auto">
            Analyzing child developmental age, safety textures, allergy parameters, and your kitchen ingredients for balanced nutrition.
          </p>
        </div>
      )}

      {/* VIEW 1: GENERATED RECIPES (2 to 3 Different Meal Types) */}
      {!isLoading && viewTab === 'results' && (
        <div className="space-y-8">
          {/* Header Summary Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-teal-950/40 p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  3-Meal Nutritional Menu
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Personalized AI Recipes Ready!
                </h1>
                <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-2xl leading-relaxed">
                  Crafted 3 different meals (Breakfast, Lunch &amp; Snack) matching your child&apos;s chewing milestones and pantry ingredients. Select any recipe below to view detailed cooking steps.
                </p>
              </div>

              {/* Child Info Badge */}
              {batch && (
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1 text-xs shrink-0 min-w-[200px]">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 font-bold uppercase tracking-wider text-[10px]">Child Age:</span>
                    <span className="font-black text-emerald-300 font-mono">{batch.childAgeYears}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 font-bold uppercase tracking-wider text-[10px]">Date:</span>
                    <span className="text-white/80 font-mono text-[11px]">{batch.date}</span>
                  </div>
                  <div className="mt-1 pt-1 border-t border-white/5 text-[11px] text-white/70 line-clamp-2">
                    <strong className="text-white/90">Ingredients:</strong> {batch.ingredientsInput}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3 RECIPE SELECTION CARDS (Breakfast, Lunch, Snack) */}
          {batch?.recipes && batch.recipes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-black uppercase tracking-widest text-white/70 flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-emerald-400" />
                  <span>Choose Meal Type to View Full Recipe Below:</span>
                </h3>
                <span className="text-xs font-mono text-emerald-400/80">
                  {batch.recipes.length} Options Available
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {batch.recipes.map((rec) => {
                  const isSelected = selectedRecipe?.id === rec.id;
                  const styling = getMealBadgeColor(rec.mealType);
                  const IconComp = styling.icon;

                  return (
                    <button
                      key={rec.id}
                      type="button"
                      onClick={() => {
                        playSound('glass');
                        setSelectedRecipe(rec);
                        setCheckedIngredients({});
                      }}
                      className={`text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[170px] shadow-lg ${
                        isSelected
                          ? `bg-slate-800/90 border-emerald-400 ring-2 ${styling.activeRing} scale-[1.02] shadow-emerald-500/20`
                          : 'bg-slate-900/50 border-white/10 hover:border-white/25 hover:bg-slate-900/80'
                      }`}
                    >
                      {/* Selected Indicator Pill */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Active</span>
                        </div>
                      )}

                      <div>
                        {/* Meal Type Tag */}
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${styling.bg} ${styling.text} ${styling.border}`}>
                            <IconComp className="w-3 h-3" />
                            {rec.mealType}
                          </span>
                        </div>

                        <h4 className="text-base sm:text-lg font-black text-white tracking-tight line-clamp-2 leading-snug">
                          {rec.name}
                        </h4>

                        <p className="text-[11px] text-white/60 mt-1 line-clamp-2 leading-relaxed">
                          {rec.textureGuide}
                        </p>
                      </div>

                      {/* Card Footer: Timings & Prompt */}
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50 font-mono">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-indigo-300">
                            <Clock className="w-3 h-3" />
                            {rec.prepTime}
                          </span>
                          <span className="flex items-center gap-1 text-amber-300">
                            <Flame className="w-3 h-3" />
                            {rec.cookTime}
                          </span>
                        </div>
                        <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-0.5">
                          {isSelected ? 'Viewing' : 'Tap to View'}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SELECTED RECIPE DETAIL CARD (Displayed directly below the 3 recipe cards) */}
          {selectedRecipe ? (
            <div className="rounded-3xl border border-white/15 bg-slate-900/90 shadow-2xl p-6 sm:p-8 backdrop-blur-2xl relative">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {selectedRecipe.mealType} Selection
                    </span>
                    {batch?.childAgeYears && (
                      <span className="px-3 py-1 rounded-xl bg-white/5 text-white/80 border border-white/10 text-xs font-mono font-bold">
                        Age: {batch.childAgeYears}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {selectedRecipe.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-300/90 font-medium mt-1">
                    Texture Guidance: {selectedRecipe.textureGuide}
                  </p>
                </div>

                {/* Timers & Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 font-mono">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span>Prep: {selectedRecipe.prepTime}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 font-mono">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span>Cook: {selectedRecipe.cookTime}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyRecipe(selectedRecipe)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-black transition-all cursor-pointer active:scale-95 border border-white/10"
                  >
                    {copiedId === selectedRecipe.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-white/70" />
                        <span>Copy Recipe</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Recipe Body: Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
                {/* Left: Ingredients Checklist (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                      <Apple className="w-4 h-4 text-emerald-400" />
                      <span>Ingredients &amp; Quantities</span>
                    </h3>
                    <span className="text-[10px] text-white/40 uppercase font-mono">
                      Tap to check off
                    </span>
                  </div>

                  <div className="space-y-2">
                    {selectedRecipe.ingredients.map((ing, idx) => {
                      const isChecked = checkedIngredients[idx];
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleIngredientCheck(idx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 cursor-pointer ${
                            isChecked
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-white/50 line-through'
                              : 'bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.06]'
                          }`}
                        >
                          <span className="mt-0.5 text-emerald-400 shrink-0">
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4" />
                            ) : (
                              <Square className="w-4 h-4 text-white/40" />
                            )}
                          </span>
                          <span className="leading-snug">{ing}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Nutrition Insights Block */}
                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1.5 mt-6">
                    <h4 className="font-black text-indigo-300 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Pediatric Nutrient Benefits</span>
                    </h4>
                    <p className="text-white/80 leading-relaxed">
                      {selectedRecipe.nutritionBenefits}
                    </p>
                  </div>
                </div>

                {/* Right: Step-by-Step Instructions & Safety (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-indigo-300 flex items-center gap-2 mb-4">
                      <UtensilsCrossed className="w-4 h-4 text-indigo-400" />
                      <span>Cooking &amp; Preparation Steps</span>
                    </h3>

                    <div className="space-y-3.5">
                      {selectedRecipe.instructions.map((step, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/10"
                        >
                          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                            {idx + 1}
                          </div>
                          <p className="text-sm text-white/90 leading-relaxed">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Safety & Allergy Alerts */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs space-y-1.5">
                    <h4 className="font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Safety, Texture &amp; Temperature Advisory</span>
                    </h4>
                    <p className="text-amber-100/80 leading-relaxed">
                      {selectedRecipe.safetyAlerts}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onBackToRecipes}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 flex items-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Recipes Guide</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onRegenerateNew}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    <span>Generate Another Meal Batch</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-3xl bg-slate-900/50 border border-white/10 text-white/50 text-sm">
              Please select one of the recipes above to view full preparation details.
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: RECIPE HISTORY WITH CLEAR FILTERS */}
      {!isLoading && viewTab === 'history' && (
        <div className="space-y-6">
          {/* History Header & Search Filter Bar */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <History className="w-6 h-6 text-indigo-400" />
                  <span>AI Recipe History &amp; Saved Batches</span>
                </h2>
                <p className="text-xs sm:text-sm text-white/60 mt-0.5">
                  Browse and re-open all past AI-generated pediatric recipes with date, age, and ingredient filters.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  {historyList.length} Saved Generations
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playSound('glass');
                    navigate('/ai-recipe-history');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <span>Open Full Page History</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row items-center gap-3">
              {/* Search text box */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter by recipe name, ingredient, or date (e.g. banana, khichdi, Oct 4)..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-400 placeholder:text-white/30 font-medium"
                />
              </div>

              {/* Meal Filter Pills */}
              <div className="flex items-center gap-1.5 w-full md:w-auto shrink-0 overflow-x-auto pb-1 md:pb-0">
                {(['All', 'Breakfast', 'Lunch', 'Snack'] as const).map(meal => (
                  <button
                    key={meal}
                    type="button"
                    onClick={() => { playSound('click'); setMealTypeFilter(meal); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      mealTypeFilter === meal
                        ? 'bg-indigo-400 text-slate-950 font-black shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                    }`}
                  >
                    {meal}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* History List */}
          {filteredHistory.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-white/10 text-white/50 text-sm">
              <p>No past recipe generations match your filter criteria.</p>
              <button
                type="button"
                onClick={() => { setSearchFilter(''); setMealTypeFilter('All'); }}
                className="mt-3 text-xs text-indigo-400 hover:underline font-bold"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((batchRecord) => (
                <div
                  key={batchRecord.id}
                  className="p-5 sm:p-6 rounded-3xl bg-slate-900/70 border border-white/10 hover:border-white/20 transition-all shadow-md space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-white/90">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        {batchRecord.date} • {batchRecord.time}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        Age: {batchRecord.childAgeYears}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteBatch(batchRecord.id, e)}
                      title="Delete this history record"
                      className="text-white/40 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-all self-end sm:self-auto cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-white/60">
                    <strong className="text-white/80">Input Ingredients:</strong> {batchRecord.ingredientsInput}
                  </p>

                  {/* Recipes generated in this batch */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    {batchRecord.recipes.map((rec) => {
                      const styling = getMealBadgeColor(rec.mealType);
                      return (
                        <div
                          key={rec.id}
                          className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between gap-3 hover:bg-white/[0.06] transition-all"
                        >
                          <div>
                            <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider mb-1.5 border ${styling.bg} ${styling.text} ${styling.border}`}>
                              {rec.mealType}
                            </span>
                            <h4 className="text-xs sm:text-sm font-black text-white line-clamp-1">
                              {rec.name}
                            </h4>
                            <p className="text-[11px] text-white/50 line-clamp-2 mt-1">
                              {rec.textureGuide}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSelectHistoryRecipe(rec)}
                            className="w-full py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-white/80 hover:text-white border border-white/10 hover:border-emerald-400/30 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                          >
                            <span>Open Full Recipe</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
