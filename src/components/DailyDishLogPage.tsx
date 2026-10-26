import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Plus, 
  Apple, 
  Flame, 
  ShieldCheck, 
  ArrowLeft, 
  Clock, 
  Check, 
  X,
  Sparkles,
  Utensils
} from 'lucide-react';
import { playSound } from '../lib/sounds';

export interface LoggedDishItem {
  id: string;
  date: string; // 'YYYY-MM-DD'
  time: string; // '10:30 AM'
  dishName: string;
  calories: string;
  protein: string;
  sodium: string;
  score: string;
  mealType?: string;
}

const STORAGE_KEY = 'foodlens_logged_meals';

// Helper to get local date as YYYY-MM-DD
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatFriendlyDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateObj.setHours(0, 0, 0, 0);

    const diffDays = Math.round((dateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays === 1) return 'Tomorrow';

    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export function getStoredLoggedMeals(): LoggedDishItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed initial sample entry for today so user sees data immediately
      const initial: LoggedDishItem[] = [
        {
          id: 'seed-1',
          date: getTodayDateString(),
          time: '08:30 AM',
          dishName: 'Sprouted Ragi Porridge with Ghee',
          calories: '95 kcal',
          protein: '3.1 g',
          sodium: '0.01 g',
          score: '9.9 / 10',
          mealType: 'Breakfast'
        },
        {
          id: 'seed-2',
          date: getTodayDateString(),
          time: '12:45 PM',
          dishName: 'Moong Dal Khichdi with Pure Desi Ghee',
          calories: '145 kcal',
          protein: '5.2 g',
          sodium: '0.04 g',
          score: '9.8 / 10',
          mealType: 'Lunch'
        }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse logged meals:', e);
    return [];
  }
}

export function saveLoggedMeal(item: Omit<LoggedDishItem, 'id' | 'date' | 'time'> & { date?: string }): LoggedDishItem {
  const current = getStoredLoggedMeals();
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const date = item.date || getTodayDateString();

  const newEntry: LoggedDishItem = {
    id: 'meal-' + Date.now(),
    date,
    time,
    dishName: item.dishName,
    calories: item.calories || '145 kcal',
    protein: item.protein || '5.0 g',
    sodium: item.sodium || '0.03 g',
    score: item.score || '9.6 / 10',
    mealType: item.mealType || 'Meal'
  };

  const updated = [newEntry, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return newEntry;
}

export const DailyDishLogPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [meals, setMeals] = useState<LoggedDishItem[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newDishName, setNewDishName] = useState<string>('');
  const [newCalories, setNewCalories] = useState<string>('150 kcal');
  const [newProtein, setNewProtein] = useState<string>('5.0 g');
  const [newMealType, setNewMealType] = useState<string>('Lunch');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setMeals(getStoredLoggedMeals());
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const changeDateBy = (offsetDays: number) => {
    playSound('pop');
    try {
      const [y, m, d] = selectedDate.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      dateObj.setDate(dateObj.getDate() + offsetDays);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      setSelectedDate(`${year}-${month}-${day}`);
    } catch {
      setSelectedDate(getTodayDateString());
    }
  };

  const handleDeleteMeal = (id: string) => {
    playSound('click');
    const updated = meals.filter(m => m.id !== id);
    setMeals(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    setToastMessage('Dish removed from log');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAddCustomDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;
    playSound('glass');
    const added = saveLoggedMeal({
      dishName: newDishName.trim(),
      calories: newCalories || '145 kcal',
      protein: newProtein || '5.0 g',
      sodium: '0.03 g',
      score: '9.6 / 10',
      mealType: newMealType,
      date: selectedDate
    });
    setMeals(prev => [added, ...prev]);
    setNewDishName('');
    setShowAddModal(false);
    setToastMessage(`Logged "${added.dishName}" for ${formatFriendlyDate(selectedDate)}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter meals for the selected date
  const filteredMeals = meals.filter(m => m.date === selectedDate);

  // Compute daily totals
  const totalCalories = filteredMeals.reduce((acc, m) => {
    const num = parseFloat(m.calories.replace(/[^\d.]/g, '')) || 0;
    return acc + num;
  }, 0);

  const totalProtein = filteredMeals.reduce((acc, m) => {
    const num = parseFloat(m.protein.replace(/[^\d.]/g, '')) || 0;
    return acc + num;
  }, 0);

  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Top Breadcrumb & Return Action */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              playSound('glass');
              navigate('/sample-foods');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/15 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sample Food Scorecard</span>
          </button>

          <button
            onClick={() => {
              playSound('pop');
              navigate('/?tab=foodlens');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs transition-all cursor-pointer border border-white/10"
          >
            <Utensils className="w-3.5 h-3.5 text-amber-400" />
            <span>Open FoodLens Scanner</span>
          </button>
        </div>

        {/* Toast alert */}
        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs sm:text-sm flex items-center justify-between shadow-xl">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{toastMessage}</span>
            </span>
            <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header Hero Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#121c33] via-[#0e1629] to-[#080e1d] border border-white/10 shadow-2xl text-left space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Daily Meal &amp; Dish Journal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Logged Dishes for the Day
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-normal">
                Review all meals, snacks, and dishes logged for your child with daily calorie and nutrient totals.
              </p>
            </div>

            <button
              onClick={() => {
                playSound('pop');
                setShowAddModal(true);
              }}
              className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Log Custom Dish</span>
            </button>
          </div>

          {/* Calendar Day Picker Control Bar */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeDateBy(-1)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-all cursor-pointer"
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0b1325] border border-white/15">
                <CalendarIcon className="w-4 h-4 text-amber-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    playSound('click');
                    setSelectedDate(e.target.value);
                  }}
                  className="bg-transparent text-white font-black text-xs sm:text-sm focus:outline-none cursor-pointer"
                />
              </div>

              <button
                onClick={() => changeDateBy(1)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-all cursor-pointer"
                title="Next Day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  playSound('pop');
                  setSelectedDate(getTodayDateString());
                }}
                className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                  selectedDate === getTodayDateString()
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                }`}
              >
                Today
              </button>
            </div>

            <span className="text-xs sm:text-sm font-bold text-amber-300">
              {formatFriendlyDate(selectedDate)}
            </span>
          </div>
        </div>

        {/* Daily Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="p-4 rounded-2xl bg-[#0e172a] border border-white/10">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Dishes Logged</span>
            <span className="text-xl sm:text-2xl font-black text-white mt-1 block">
              {filteredMeals.length}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">For selected date</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e172a] border border-white/10">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Calories</span>
            <span className="text-xl sm:text-2xl font-black text-amber-300 mt-1 block">
              {Math.round(totalCalories)} <span className="text-xs font-bold text-slate-400">kcal</span>
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Total energy value</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e172a] border border-white/10">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Protein</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 block">
              {totalProtein.toFixed(1)} <span className="text-xs font-bold text-slate-400">g</span>
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Growth &amp; tissue repair</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e172a] border border-white/10">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Avg Score</span>
            <span className="text-xl sm:text-2xl font-black text-cyan-300 mt-1 block">
              {filteredMeals.length > 0 
                ? (filteredMeals.reduce((acc, m) => acc + (parseFloat(m.score) || 9.5), 0) / filteredMeals.length).toFixed(1)
                : '10.0'} <span className="text-xs font-bold text-slate-400">/ 10</span>
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Nutritional quality</span>
          </div>
        </div>

        {/* List of Logged Dishes */}
        <div className="space-y-3 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-base font-black text-white">
              Dishes on {formatFriendlyDate(selectedDate)} ({filteredMeals.length})
            </h3>
            {filteredMeals.length > 0 && (
              <span className="text-xs text-slate-400">
                Click any dish to check nutrition
              </span>
            )}
          </div>

          {filteredMeals.length === 0 ? (
            <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-3">
              <Utensils className="w-10 h-10 text-slate-500 mx-auto" />
              <h4 className="text-base font-bold text-white">No Dishes Logged for {formatFriendlyDate(selectedDate)}</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Browse the Sample Food Scorecard and click "Log This Dish", or use the button below to add a quick entry.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs cursor-pointer active:scale-95"
                >
                  + Add Dish for {formatFriendlyDate(selectedDate)}
                </button>
                <button
                  onClick={() => navigate('/sample-foods')}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-xs cursor-pointer hover:bg-white/15"
                >
                  Browse Sample Foods
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#0f182c] border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between shadow-lg space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 font-black text-[10px] border border-amber-500/25">
                          {meal.mealType || 'Meal'}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
                          <Clock className="w-3 h-3" />
                          <span>{meal.time}</span>
                        </span>
                      </div>

                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 font-black text-xs border border-emerald-500/25 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{meal.score}</span>
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-black text-white">
                      {meal.dishName}
                    </h4>

                    <div className="flex items-center gap-4 text-xs text-slate-300 mt-2">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <strong>{meal.calories}</strong>
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-emerald-400 font-bold">
                        {meal.protein} protein
                      </span>
                      {meal.sodium && (
                        <>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 text-[11px]">
                            {meal.sodium}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => {
                        playSound('pop');
                        navigate(`/sample-foods?search=${encodeURIComponent(meal.dishName)}`);
                      }}
                      className="text-xs text-amber-300 hover:text-white font-bold transition-colors cursor-pointer"
                    >
                      Check Nutrients →
                    </button>

                    <button
                      onClick={() => handleDeleteMeal(meal.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Remove from daily log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Custom Dish Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0f172a] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-left space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-amber-400" />
                  <span>Log Dish for {formatFriendlyDate(selectedDate)}</span>
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCustomDish} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Dish or Food Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    placeholder="e.g. Curd Rice with Tadka, Steamed Idli"
                    className="w-full bg-[#18233c] border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Meal Slot
                    </label>
                    <select
                      value={newMealType}
                      onChange={(e) => setNewMealType(e.target.value)}
                      className="w-full bg-[#18233c] border border-white/20 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none cursor-pointer"
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Snack">Snack</option>
                      <option value="Dinner">Dinner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Calories
                    </label>
                    <input
                      type="text"
                      value={newCalories}
                      onChange={(e) => setNewCalories(e.target.value)}
                      placeholder="e.g. 140 kcal"
                      className="w-full bg-[#18233c] border border-white/20 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Protein
                  </label>
                  <input
                    type="text"
                    value={newProtein}
                    onChange={(e) => setNewProtein(e.target.value)}
                    placeholder="e.g. 4.5 g"
                    className="w-full bg-[#18233c] border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 font-bold text-xs hover:bg-white/15 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs cursor-pointer shadow-md"
                  >
                    Save to Journal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
