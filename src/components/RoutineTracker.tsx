import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, Sun, Moon, Calendar, Check, Star, RefreshCw, Sparkles, 
  Trophy, Smile, HelpCircle, Shield, AlertCircle, Award, Compass, Heart,
  Info, Loader2, ChevronRight
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useLanguage } from '../lib/LanguageContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { withRetry } from '../lib/firebaseUtils';
import { playSound } from '../lib/sounds';

import { AGE_GROUPS, RoutineItem, AgeGroupData } from '../data/routinesData';

export const RoutineTracker: React.FC = () => {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const childName = profile?.babyName || profile?.childName || localStorage.getItem('baby_name') || 'Ashwath';

  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('0_6m');
  const [selectedTimeType, setSelectedTimeType] = useState<'all' | 'morning' | 'evening' | 'bedtime'>('all');
  const [checkedRoutines, setCheckedRoutines] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [dbLoading, setDbLoading] = useState(false);


  const currentAgeGroupData = AGE_GROUPS.find(g => g.id === selectedAgeGroup) || AGE_GROUPS[0];
  const currentRoutinesList = selectedTimeType === 'all'
    ? [...currentAgeGroupData.morning, ...currentAgeGroupData.evening, ...currentAgeGroupData.bedtime]
    : selectedTimeType === 'morning' 
      ? currentAgeGroupData.morning 
      : selectedTimeType === 'evening' 
        ? currentAgeGroupData.evening 
        : currentAgeGroupData.bedtime;

  // Load checked routines from Firestore or local storage
  useEffect(() => {
    const fetchCheckedState = async () => {
      if (user && db) {
        setDbLoading(true);
        try {
          const docRef = doc(db, 'user_routines', user.uid);
          const docSnap = await withRetry(() => getDoc(docRef), 'get', docRef.path);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data && Array.isArray(data.completedIds)) {
              setCheckedRoutines(data.completedIds);
              setDbLoading(false);
              return;
            }
          }
        } catch (error) {
          console.warn("Could not sync user routines from Firestore, using local fallback:", error);
        } finally {
          setDbLoading(false);
        }
      }
      
      // Fallback to localStorage
      try {
        const saved = localStorage.getItem('checked_routines_v2');
        if (saved) {
          setCheckedRoutines(JSON.parse(saved));
        }
      } catch {
        setCheckedRoutines([]);
      }
    };

    fetchCheckedState();
  }, [user]);

  // Handle checking/unchecking routines
  const handleToggleCheck = async (id: string) => {
    playSound('pop');
    let updated: string[];
    if (checkedRoutines.includes(id)) {
      updated = checkedRoutines.filter(x => x !== id);
    } else {
      updated = [...checkedRoutines, id];
    }
    setCheckedRoutines(updated);

    // Persist checking
    if (user) {
      try {
        const docRef = doc(db, 'user_routines', user.uid);
        await setDoc(docRef, {
          completedIds: updated,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (error) {
        console.error("Error syncing checked routine to Firestore:", error);
      }
    } else {
      try {
        localStorage.setItem('checked_routines_v2', JSON.stringify(updated));
      } catch (error) {
        console.error("Local storage fail:", error);
      }
    }

    // Check if all items in current sub-list are checked off
    const currentIds = currentRoutinesList.map(r => r.id);
    const allChecked = currentIds.every(cid => updated.includes(cid));
    if (allChecked) {
      playSound('glass');
      setShowCelebration(true);
    }
  };

  const handleSelectAllSection = async () => {
    playSound('glass');
    const currentIds = currentRoutinesList.map(r => r.id);
    const updated = Array.from(new Set([...checkedRoutines, ...currentIds]));
    setCheckedRoutines(updated);

    if (user) {
      try {
        const docRef = doc(db, 'user_routines', user.uid);
        await setDoc(docRef, {
          completedIds: updated,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.setItem('checked_routines_v2', JSON.stringify(updated));
    }
    setShowCelebration(true);
  };

  const handleResetSection = async () => {
    playSound('glass');
    const currentIds = currentRoutinesList.map(r => r.id);
    const updated = checkedRoutines.filter(x => !currentIds.includes(x));
    setCheckedRoutines(updated);

    if (user) {
      try {
        const docRef = doc(db, 'user_routines', user.uid);
        await setDoc(docRef, {
          completedIds: updated,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.setItem('checked_routines_v2', JSON.stringify(updated));
    }
    setShowCelebration(false);
  };

  const completedCount = currentRoutinesList.filter(r => checkedRoutines.includes(r.id)).length;
  const totalCount = currentRoutinesList.length;


  return (
    <div id="routine-checker-section" className="w-full text-white font-sans max-w-5xl mx-auto pb-12">
      {/* Hero Banner Header - Compact & Sleek */}
      <div className="relative mb-5 text-center bg-gradient-to-br from-slate-900/90 to-indigo-950/50 py-4 px-5 sm:px-8 rounded-2xl md:rounded-3xl border border-white/10 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cheerful-blue/10 blur-[70px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-purple-500/5 blur-[60px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-cheerful-blue/10 rounded-lg border border-cheerful-blue/25">
              <Clock className="w-4 h-4 text-cheerful-blue shrink-0" />
            </div>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-cheerful-blue bg-cheerful-blue/10 px-3 py-1 rounded-full border border-cheerful-blue/20">
              Pediatric Routine Coach · Personalized for {childName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1.5 tracking-tight uppercase">
            Routine Coach
          </h1>
          <p className="text-white/75 text-xs sm:text-sm md:text-[14px] w-full max-w-4xl mx-auto leading-relaxed px-2">
            Configure optimal day-to-day schedules optimized for infant age-brackets. Built to follow IAP, FSSAI & ICMR benchmarks for active wake windows, safe sleep, and early supplementary sensory inputs.
          </p>
        </div>
      </div>

      {/* Age Group Switcher */}
      <div className="mb-8 bg-white/[0.03] p-2.5 rounded-[2rem] border border-white/10 shadow-lg">
        <div className="text-xs font-black uppercase tracking-wider text-white/40 mb-2 px-3 text-left">
          Select Child Age Bracket
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {AGE_GROUPS.map((g) => {
            const isActive = selectedAgeGroup === g.id;
            return (
              <button
                key={g.id}
                onClick={() => {
                  playSound('click');
                  setSelectedAgeGroup(g.id);
                  setShowCelebration(false);
                }}
                className={`px-3 py-3.5 rounded-2xl text-xs font-black tracking-tight flex flex-col items-center justify-center gap-1 transition-all transform hover:scale-[1.03] active:scale-95 cursor-pointer border ${
                  isActive
                    ? 'bg-cheerful-blue text-slate-950 shadow-xl shadow-cheerful-blue/30 border-white/20'
                    : 'bg-white/5 text-white/50 border-transparent hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-2xl leading-none">{g.emoji}</span>
                <span className="uppercase">{g.label}</span>
              </button>
            );
          })}
        </div>
      </div>


      {/* Main Checklist Card */}
      <div className="bg-slate-900/60 border border-white/10 rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative overflow-hidden mb-8">
        
        {/* Toggle time-of-day selector */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5 mb-8">
          
          {/* Time Tabs: Morning, Afternoon, Bedtime, and All next to them */}
          <div className="flex flex-wrap bg-black/30 p-1.5 rounded-2xl border border-white/5 w-full md:w-auto gap-1">
            <button
              onClick={() => { playSound('click'); setSelectedTimeType('morning'); }}
              className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedTimeType === 'morning'
                  ? 'bg-cheerful-yellow text-slate-950 shadow-lg font-black'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              <Sun className="w-3.5 h-3.5 shrink-0" />
              Morning ☀️
            </button>
            <button
              onClick={() => { playSound('click'); setSelectedTimeType('evening'); }}
              className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedTimeType === 'evening'
                  ? 'bg-orange-500 text-white shadow-lg font-black'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              <Clock className="w-3.5 h-3.5 shrink-0 text-white" />
              Afternoon 🌤️
            </button>
            <button
              onClick={() => { playSound('click'); setSelectedTimeType('bedtime'); }}
              className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedTimeType === 'bedtime'
                  ? 'bg-indigo-600 text-white shadow-lg font-black'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              <Moon className="w-3.5 h-3.5 shrink-0 text-indigo-300" />
              Bedtime 🌙
            </button>
            <button
              onClick={() => { playSound('click'); setSelectedTimeType('all'); }}
              className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedTimeType === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg font-black'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-300" />
              All 🌟
            </button>
          </div>

          {/* Section scoreboard with All Done & Reset */}
          <div className="flex items-center gap-4 bg-black/20 px-5 py-2.5 rounded-2xl border border-white/5 w-full md:w-auto justify-between select-none">
            <div className="text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Progress</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-white">
                  {completedCount} / {totalCount}
                </span>
                <Star className="w-4 h-4 text-cheerful-yellow fill-cheerful-yellow animate-pulse shrink-0" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectAllSection}
                className="px-3.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-emerald-200 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-500/30 transition-all cursor-pointer flex items-center gap-1"
                title="Mark all items in this section completed"
              >
                <Check className="w-3 h-3 stroke-[3]" />
                All Done
              </button>
              <button
                onClick={handleResetSection}
                className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/5 transition-all cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* List Grid */}
        <div className="relative min-h-[220px]">
          {/* Section celebration overlay */}
          <AnimatePresence>
            {showCelebration && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 z-20 backdrop-blur-md bg-slate-950/90 rounded-3xl flex flex-col items-center justify-center p-8 text-center border-2 border-white/10"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="p-5 bg-cheerful-yellow/10 border-2 border-cheerful-yellow/20 rounded-full text-cheerful-yellow mb-4 shrink-0"
                >
                  <Trophy className="w-16 h-16 fill-cheerful-yellow" />
                </motion.div>

                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-2">
                  Daily stars achieved! 🌟
                </h3>
                <p className="text-white/60 text-sm max-w-md font-bold uppercase tracking-wider mb-6">
                  You checked off every activity for the {selectedTimeType} routine! Continuous, structured day plans protect baby brain growth.
                </p>

                <button
                  onClick={() => setShowCelebration(false)}
                  className="px-8 py-3.5 bg-cheerful-blue text-slate-950 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-cheerful-blue/20 cursor-pointer"
                >
                  Return to Checklist 💖
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {dbLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-cheerful-blue" />
              <p className="text-xs font-black uppercase tracking-wider text-white/40">Syncing with database...</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {currentRoutinesList.map((item, idx) => {
                const isChecked = checkedRoutines.includes(item.id);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left relative overflow-hidden ${
                      isChecked
                        ? 'bg-[#0b1728]/85 border-emerald-500/35 shadow-md shadow-emerald-950/20'
                        : 'bg-[#0d1629]/90 border-white/10 hover:border-white/20 hover:bg-[#111e38]/90'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                      {/* Immediate Checkbox Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCheck(item.id);
                        }}
                        className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all shrink-0 mt-0.5 sm:mt-0 cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30'
                            : 'bg-white/5 border-white/20 text-transparent hover:border-cyan-400'
                        }`}
                        title={isChecked ? "Mark as Incomplete" : "Mark as Completed"}
                      >
                        <Check className={`w-4 h-4 stroke-[3] ${isChecked ? 'opacity-100 text-slate-950' : 'opacity-0'}`} />
                      </button>

                      {/* Emoji Avatar */}
                      <span className="text-2xl p-2 rounded-xl bg-white/5 border border-white/10 shrink-0 select-none">
                        {item.emoji}
                      </span>

                      {/* Details */}
                      <div className="space-y-1 min-w-0 flex-1">
                        {isChecked && (
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase border border-emerald-400/30 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Done
                            </span>
                          </div>
                        )}

                        <h3 className={`text-base font-black tracking-tight ${isChecked ? 'text-emerald-200 line-through decoration-emerald-400/60' : 'text-white'}`}>
                          {item.name}
                        </h3>

                        <p className="text-xs text-slate-300 font-medium line-clamp-2">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {/* Quick action button */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pl-11 sm:pl-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleCheck(item.id)}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30'
                            : 'bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {isChecked ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Completed</span>
                          </>
                        ) : (
                          <span>Mark Done</span>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>


    </div>
  );
};
