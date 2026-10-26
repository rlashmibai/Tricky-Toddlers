import React, { useState, useMemo, useEffect } from 'react';
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
  ShieldCheck,
  Apple, 
  UtensilsCrossed, 
  Sunrise, 
  Sun, 
  Coffee, 
  Moon,
  Trash2, 
  CheckSquare, 
  Square, 
  ChevronRight,
  Printer,
  RotateCcw,
  BookOpen,
  Baby,
  Share2,
  ExternalLink,
  Info
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import { 
  GeneratedRecipe, 
  AIRecipeBatchRecord, 
  getSavedRecipeHistory, 
  deleteRecipeBatch, 
  clearAllRecipeHistory 
} from '../lib/aiRecipeHistory';

export const AIRecipeHistoryPage: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [batches, setBatches] = useState<AIRecipeBatchRecord[]>(() => getSavedRecipeHistory());
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  
  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<'All' | 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner'>('All');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // UI state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Sync initial batch & recipe selection
  useEffect(() => {
    if (batches.length > 0 && !selectedBatchId) {
      setSelectedBatchId(batches[0].id);
      if (batches[0].recipes && batches[0].recipes.length > 0) {
        setSelectedRecipeId(batches[0].recipes[0].id);
      }
    }
  }, [batches, selectedBatchId]);

  // Handle ingredient checklist
  const toggleIngredientCheck = (idx: number) => {
    playSound('click');
    setCheckedIngredients(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Filtered batches
  const filteredBatches = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return batches
      .filter(batch => {
        // Query filter
        const matchQuery = !q || 
          batch.ingredientsInput.toLowerCase().includes(q) ||
          batch.childAgeYears.toLowerCase().includes(q) ||
          batch.date.toLowerCase().includes(q) ||
          batch.recipes.some(r => 
            r.name.toLowerCase().includes(q) ||
            r.textureGuide.toLowerCase().includes(q) ||
            r.ingredients.some(ing => ing.toLowerCase().includes(q)) ||
            r.instructions.some(ins => ins.toLowerCase().includes(q))
          );

        // Meal type filter
        const matchMeal = selectedMealType === 'All' ||
          batch.recipes.some(r => r.mealType.toLowerCase() === selectedMealType.toLowerCase());

        // Age group filter
        const matchAge = selectedAgeGroup === 'All' ||
          batch.childAgeYears.toLowerCase().includes(selectedAgeGroup.toLowerCase());

        return matchQuery && matchMeal && matchAge;
      })
      .sort((a, b) => {
        const timeA = a.timestamp || 0;
        const timeB = b.timestamp || 0;
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [batches, searchQuery, selectedMealType, selectedAgeGroup, sortOrder]);

  // Currently active batch and recipe
  const activeBatch = useMemo(() => {
    if (selectedBatchId) {
      const found = filteredBatches.find(b => b.id === selectedBatchId) || batches.find(b => b.id === selectedBatchId);
      if (found) return found;
    }
    return filteredBatches[0] || null;
  }, [filteredBatches, batches, selectedBatchId]);

  const activeRecipe = useMemo(() => {
    if (!activeBatch) return null;
    if (selectedRecipeId) {
      const found = activeBatch.recipes.find(r => r.id === selectedRecipeId);
      if (found) return found;
    }
    return activeBatch.recipes[0] || null;
  }, [activeBatch, selectedRecipeId]);

  // Total recipes count across all batches
  const totalRecipesCount = useMemo(() => {
    return batches.reduce((acc, b) => acc + (b.recipes?.length || 0), 0);
  }, [batches]);

  // Actions
  const handleSelectRecipe = (batch: AIRecipeBatchRecord, recipe: GeneratedRecipe) => {
    playSound('glass');
    setSelectedBatchId(batch.id);
    setSelectedRecipeId(recipe.id);
    setCheckedIngredients({});
    // On small screens, scroll down to recipe reader
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        document.getElementById('active-recipe-reader')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const handleDeleteBatch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('pop');
    const updated = deleteRecipeBatch(id);
    setBatches(updated);
    if (selectedBatchId === id) {
      const next = updated[0];
      setSelectedBatchId(next ? next.id : null);
      setSelectedRecipeId(next?.recipes?.[0]?.id || null);
    }
  };

  const handleClearAll = () => {
    playSound('pop');
    clearAllRecipeHistory();
    setBatches([]);
    setSelectedBatchId(null);
    setSelectedRecipeId(null);
    setShowClearConfirm(false);
  };

  const handleCopyRecipe = (recipe: GeneratedRecipe) => {
    playSound('pop');
    const text = `${recipe.name} (${recipe.mealType})\n` +
      `Child Age: ${activeBatch?.childAgeYears || 'Toddler'}\n` +
      `Prep Time: ${recipe.prepTime} | Cook Time: ${recipe.cookTime}\n` +
      `Texture & Consistency: ${recipe.textureGuide}\n\n` +
      `Ingredients:\n${recipe.ingredients.map(i => `• ${i}`).join('\n')}\n\n` +
      `Cooking Instructions:\n${recipe.instructions.map((ins, idx) => `${idx + 1}. ${ins}`).join('\n')}\n\n` +
      `Pediatric Nutrition Benefits:\n${recipe.nutritionBenefits}\n\n` +
      `Safety Guidelines:\n${recipe.safetyAlerts}\n\n` +
      `Generated by Tricky Toddlers AI NutriChef`;

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(recipe.id);
      setTimeout(() => setCopiedId(null), 3000);
    }
  };

  const handleCookAgainInGenerator = (batch: AIRecipeBatchRecord) => {
    playSound('glass');
    // Navigate to food guide with tab
    navigate('/?tab=solid-food-guide');
    setTimeout(() => {
      document.getElementById('ai-recipe-maker-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

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
      case 'dinner':
        return {
          bg: 'bg-blue-500/20',
          text: 'text-blue-300',
          border: 'border-blue-400/30',
          activeRing: 'ring-blue-400/50',
          icon: Moon
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
    <div className="flex-1 w-full bg-[#0a0f1d] text-white font-sans selection:bg-emerald-500 selection:text-white pb-16 min-h-screen">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 blur-[150px] rounded-full" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-teal-600/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-indigo-600/10 blur-[160px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        {/* Top Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playSound('glass');
                navigate('/?tab=solid-food-guide');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider border border-white/10 transition-all cursor-pointer shadow-md active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>Back to Solid Food Guide</span>
            </button>

            <span className="text-white/20 hidden sm:inline">•</span>

            <span className="text-xs text-white/50 hidden sm:inline font-medium">
              AI NutriChef Kitchen Assistant
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playSound('pop');
                navigate('/?tab=solid-food-guide');
                setTimeout(() => {
                  document.getElementById('ai-recipe-maker-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 150);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate New Recipes</span>
            </button>

            {batches.length > 0 && (
              <button
                onClick={() => {
                  playSound('pop');
                  setShowClearConfirm(true);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-300 text-xs font-bold border border-white/10 transition-all cursor-pointer"
                title="Clear all recipe history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Clear All Confirmation Modal */}
        <AnimatePresence>
          {showClearConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-white/15 shadow-2xl text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white">Clear All AI Recipe History?</h3>
                <p className="text-xs text-white/70 mt-2 leading-relaxed">
                  This will remove all {batches.length} saved AI recipe batches and {totalRecipesCount} generated meals from your device. This action cannot be undone.
                </p>
                <div className="flex items-center justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-lg shadow-rose-600/30"
                  >
                    Yes, Delete Everything
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Header Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/25 p-6 sm:p-8 mb-8 bg-gradient-to-br from-[#0b1827] via-[#0d2238] to-[#081321] shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-black tracking-wider uppercase">
                <History className="w-3.5 h-3.5" />
                <span>Saved AI Generations Log</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                AI Recipe History &amp; Pantry Search Log
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-emerald-100/75 leading-relaxed font-medium">
                Review, filter, and cook from all previously generated pediatrician-approved Indian meals. Custom-tailored by developmental age, pantry ingredients, and baby-safe textures.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="grid grid-cols-2 gap-3 shrink-0">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                <div className="text-xl sm:text-2xl font-black text-emerald-400">
                  {batches.length}
                </div>
                <div className="text-[10px] uppercase font-bold text-white/60 tracking-wider mt-0.5">
                  Saved Sessions
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                <div className="text-xl sm:text-2xl font-black text-teal-300">
                  {totalRecipesCount}
                </div>
                <div className="text-[10px] uppercase font-bold text-white/60 tracking-wider mt-0.5">
                  Total Recipes
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Master Filters Toolbar */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl mb-8 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by recipe name, pantry ingredient, texture (e.g. oats, banana, khichdi)..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-white/30 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Age Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedAgeGroup}
                onChange={(e) => setSelectedAgeGroup(e.target.value)}
                aria-label="Filter recipes by child age group"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400 font-medium cursor-pointer"
              >
                <option value="All" className="bg-slate-900 text-white">All Child Ages</option>
                <option value="0.5" className="bg-slate-900 text-white">0-6 Months (Stage 1)</option>
                <option value="6 - 9" className="bg-slate-900 text-white">6-9 Months (Stage 2)</option>
                <option value="9 - 12" className="bg-slate-900 text-white">9-12 Months (Stage 3)</option>
                <option value="1.5" className="bg-slate-900 text-white">1-2 Years (Toddler)</option>
                <option value="2.5" className="bg-slate-900 text-white">2-3 Years (Early Child)</option>
                <option value="4" className="bg-slate-900 text-white">3-5 Years (Preschool)</option>
                <option value="6" className="bg-slate-900 text-white">5-8 Years (School Age)</option>
                <option value="10" className="bg-slate-900 text-white">8-12 Years (Pre-teen)</option>
                <option value="16" className="bg-slate-900 text-white">12-18 Years (Adolescent)</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="md:col-span-2">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                aria-label="Sort recipe generations by date"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400 font-medium cursor-pointer"
              >
                <option value="newest" className="bg-slate-900 text-white">Newest First</option>
                <option value="oldest" className="bg-slate-900 text-white">Oldest First</option>
              </select>
            </div>

            {/* Reset Filters button */}
            <div className="md:col-span-2 flex items-center justify-end">
              {(searchQuery || selectedMealType !== 'All' || selectedAgeGroup !== 'All') ? (
                <button
                  onClick={() => {
                    playSound('pop');
                    setSearchQuery('');
                    setSelectedMealType('All');
                    setSelectedAgeGroup('All');
                  }}
                  className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              ) : (
                <div className="text-[11px] text-white/40 text-right w-full pr-1">
                  Showing {filteredBatches.length} of {batches.length} sessions
                </div>
              )}
            </div>
          </div>

          {/* Meal Type Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/5">
            <span className="text-xs font-bold text-white/50 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-emerald-400" />
              Meal Type:
            </span>

            {(['All', 'Breakfast', 'Lunch', 'Snack', 'Dinner'] as const).map(meal => {
              const active = selectedMealType === meal;
              return (
                <button
                  key={meal}
                  onClick={() => {
                    playSound('click');
                    setSelectedMealType(meal);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    active 
                      ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/20 font-black'
                      : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                  }`}
                >
                  {meal === 'Breakfast' && <Sunrise className="w-3 h-3" />}
                  {meal === 'Lunch' && <Sun className="w-3 h-3" />}
                  {meal === 'Snack' && <Coffee className="w-3 h-3" />}
                  {meal === 'Dinner' && <Moon className="w-3 h-3" />}
                  <span>{meal}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredBatches.length === 0 ? (
          <div className="p-12 sm:p-16 rounded-3xl bg-slate-900/60 border border-white/10 text-center max-w-2xl mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-4">
              <ChefHat className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-white">No Matching Recipes in History</h3>

            <p className="text-xs sm:text-sm text-white/60 mt-2 leading-relaxed">
              {batches.length === 0
                ? "You haven't generated any AI recipes yet. Use the AI NutriChef Custom Ingredient Cooker to create tailored 3-meal menus for your child!"
                : "No saved recipes match your current search query or filter tags. Try clearing your filters or searching for another ingredient."}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              {(searchQuery || selectedMealType !== 'All' || selectedAgeGroup !== 'All') && (
                <button
                  onClick={() => {
                    playSound('pop');
                    setSearchQuery('');
                    setSelectedMealType('All');
                    setSelectedAgeGroup('All');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold"
                >
                  Reset All Filters
                </button>
              )}

              <button
                onClick={() => {
                  playSound('glass');
                  navigate('/?tab=solid-food-guide');
                  setTimeout(() => {
                    document.getElementById('ai-recipe-maker-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-400/20 cursor-pointer"
              >
                Cook with AI Recipe Maker
              </button>
            </div>
          </div>
        ) : (
          /* Split View: Left List of Batches / Recipes + Right Detailed Recipe Reader */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            {/* Left Column: Sessions & Recipe Cards */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-black uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  Past Cooking Generations ({filteredBatches.length})
                </span>
                <span className="text-[11px] text-white/40">
                  Tap to view full preparation
                </span>
              </div>

              {filteredBatches.map((batch) => {
                const isBatchSelected = activeBatch?.id === batch.id;

                return (
                  <div
                    key={batch.id}
                    className={`p-4 sm:p-5 rounded-3xl transition-all duration-300 border ${
                      isBatchSelected
                        ? 'bg-slate-900/95 border-emerald-500/50 shadow-xl shadow-emerald-500/5'
                        : 'bg-slate-900/60 hover:bg-slate-900/80 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Batch Header */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/5">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-emerald-400" />
                            {batch.date} • {batch.time}
                          </span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                            Age: {batch.childAgeYears}
                          </span>
                        </div>

                        <p className="text-[11px] text-white/60 mt-1 line-clamp-1">
                          <strong className="text-white/80">Pantry Items:</strong> {batch.ingredientsInput}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleCookAgainInGenerator(batch)}
                          title="Cook again with these ingredients in AI Generator"
                          className="p-1.5 rounded-lg text-white/40 hover:text-emerald-300 hover:bg-white/5 transition-all"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteBatch(batch.id, e)}
                          title="Delete this history record"
                          className="p-1.5 rounded-lg text-white/40 hover:text-rose-400 hover:bg-white/5 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* 3 Recipes Cards inside this batch */}
                    <div className="space-y-2 mt-3">
                      {batch.recipes.map((recipe) => {
                        const isRecipeSelected = isBatchSelected && activeRecipe?.id === recipe.id;
                        const mealStyle = getMealBadgeColor(recipe.mealType);
                        const MealIcon = mealStyle.icon;

                        return (
                          <div
                            key={recipe.id}
                            onClick={() => handleSelectRecipe(batch, recipe)}
                            className={`p-3 rounded-2xl transition-all cursor-pointer border flex items-center justify-between gap-3 ${
                              isRecipeSelected
                                ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-transparent border-emerald-400/60 shadow-md'
                                : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${mealStyle.bg} ${mealStyle.text} ${mealStyle.border}`}>
                                <MealIcon className="w-4 h-4" />
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded border ${mealStyle.bg} ${mealStyle.text} ${mealStyle.border}`}>
                                    {recipe.mealType}
                                  </span>
                                  <span className="text-[10px] text-white/40">
                                    {recipe.cookTime}
                                  </span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                                  {recipe.name}
                                </h4>
                              </div>
                            </div>

                            <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                              isRecipeSelected ? 'text-emerald-400 translate-x-1' : 'text-white/30'
                            }`} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Comprehensive Recipe Detail Reader */}
            <div id="active-recipe-reader" className="lg:col-span-7">
              {activeRecipe ? (
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-2xl relative backdrop-blur-xl">
                  {/* Top Bar for Selected Recipe */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0 shadow-inner">
                        <ChefHat className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                            {activeRecipe.mealType}
                          </span>
                          <span className="text-xs text-white/50 font-bold">
                            For {activeBatch?.childAgeYears || 'Toddler'}
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
                          {activeRecipe.name}
                        </h2>
                      </div>
                    </div>

                    {/* Actions: Copy & Print */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyRecipe(activeRecipe)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer active:scale-95"
                      >
                        {copiedId === activeRecipe.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Recipe</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          playSound('glass');
                          window.print();
                        }}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/70 hover:text-white transition-all cursor-pointer"
                        title="Print Recipe"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Timing & Consistency Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                      <div className="flex items-center gap-2 text-white/50 text-[10px] font-black uppercase tracking-wider mb-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Prep Time</span>
                      </div>
                      <div className="text-sm font-black text-white">
                        {activeRecipe.prepTime}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                      <div className="flex items-center gap-2 text-white/50 text-[10px] font-black uppercase tracking-wider mb-1">
                        <Flame className="w-3.5 h-3.5 text-rose-400" />
                        <span>Cook Time</span>
                      </div>
                      <div className="text-sm font-black text-white">
                        {activeRecipe.cookTime}
                      </div>
                    </div>

                    <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                      <div className="flex items-center gap-2 text-white/50 text-[10px] font-black uppercase tracking-wider mb-1">
                        <Apple className="w-3.5 h-3.5 text-teal-400" />
                        <span>Texture Profile</span>
                      </div>
                      <div className="text-xs font-bold text-emerald-300 line-clamp-2">
                        {activeRecipe.textureGuide.split('.')[0]}
                      </div>
                    </div>
                  </div>

                  {/* Texture & Consistency Alert */}
                  <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30 mb-6 flex items-start gap-3">
                    <Info className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-teal-300">
                        Age-Safe Texture Guide
                      </h4>
                      <p className="text-xs text-teal-100/80 mt-0.5 leading-relaxed">
                        {activeRecipe.textureGuide}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Ingredients Checklist */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
                        <span>Ingredients ({activeRecipe.ingredients.length})</span>
                      </h3>
                      <span className="text-[11px] text-white/40">
                        Tap item to check off while cooking
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeRecipe.ingredients.map((ingredient, idx) => {
                        const isChecked = !!checkedIngredients[idx];
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleIngredientCheck(idx)}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                              isChecked
                                ? 'bg-emerald-500/10 border-emerald-400/40 text-emerald-200 line-through opacity-70'
                                : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 text-white'
                            }`}
                          >
                            <div className="shrink-0 text-emerald-400">
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4" />
                              ) : (
                                <Square className="w-4 h-4 text-white/40" />
                              )}
                            </div>
                            <span className="text-xs font-medium leading-tight">
                              {ingredient}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step-by-Step Cooking Instructions */}
                  <div className="mb-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                      <ChefHat className="w-4 h-4 text-indigo-400" />
                      <span>Step-by-Step Cooking Method</span>
                    </h3>

                    <div className="space-y-3">
                      {activeRecipe.instructions.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3.5 text-left"
                        >
                          <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pediatric Nutrition & Safety Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-left">
                      <div className="flex items-center gap-2 text-emerald-300 mb-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        <h4 className="text-xs font-black uppercase tracking-wider">
                          Pediatric Nutrition
                        </h4>
                      </div>
                      <p className="text-xs text-emerald-100/75 leading-relaxed">
                        {activeRecipe.nutritionBenefits}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/20 text-left">
                      <div className="flex items-center gap-2 text-amber-300 mb-1.5">
                        <ShieldAlert className="w-4 h-4" />
                        <h4 className="text-xs font-black uppercase tracking-wider">
                          Pediatric Safety &amp; Choking Tips
                        </h4>
                      </div>
                      <p className="text-xs text-amber-100/75 leading-relaxed">
                        {activeRecipe.safetyAlerts}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Footer Actions */}
                  <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <button
                      onClick={() => {
                        playSound('glass');
                        navigate('/?tab=solid-food-guide');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Back to Solid Food Guide</span>
                    </button>

                    <button
                      onClick={() => activeBatch && handleCookAgainInGenerator(activeBatch)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                      <span>Cook Again with AI Generator</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-white/10 text-white/50 text-sm">
                  Select a recipe from the left column to view ingredients, step-by-step cooking steps, and pediatric nutrition details.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecipeHistoryPage;
