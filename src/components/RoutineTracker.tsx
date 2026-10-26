import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, Sun, Moon, Calendar, Check, Star, RefreshCw, Sparkles, 
  Trophy, Smile, HelpCircle, Shield, AlertCircle, Award, Compass, Heart,
  Baby, Info, Loader2, ChevronRight, Zap
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useLanguage } from '../lib/LanguageContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { withRetry } from '../lib/firebaseUtils';
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import Markdown from 'react-markdown';
import { playSound } from '../lib/sounds';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

import { AGE_GROUPS, RoutineItem, AgeGroupData } from '../data/routinesData';

export const RoutineTracker: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('0_6m');
  const [selectedTimeType, setSelectedTimeType] = useState<'all' | 'morning' | 'evening' | 'bedtime'>('all');
  const [checkedRoutines, setCheckedRoutines] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [dbLoading, setDbLoading] = useState(false);

  // AI custom routine state
  const [wakeTime, setWakeTime] = useState('07:00');
  const [temperament, setTemperament] = useState('Happy & Active');
  const [aiCustomRoutine, setAiCustomRoutine] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

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

  // Handle generating custom AI routine schedule using standard guidelines
  const handleGenerateCustomRoutine = async () => {
    if (aiLoading) return;
    playSound('click');
    setAiLoading(true);
    setAiCustomRoutine('');

    const promptText = `
You are an expert WHO, Indian IAP & FSSAI Pediatric Coach. The parent requests an hour-by-hour custom baby routine with the following details:
- Baby's Age Group: ${currentAgeGroupData.label}
- Morning Wake-up Time: ${wakeTime}
- Infant Temperament/Needs: ${temperament}

Please construct a comprehensive, positive, and beautiful daily hour-by-hour schedule based strictly on standard WHO, Indian IAP and FSSAI pediatric wellness guidelines.
- Detail the exact wake-windows suitable for ${currentAgeGroupData.label}.
- Organize the day chronologically into clear blocks: Morning, Mid-day, Afternoon, and Bedtime.
- For each block, provide 2 actionable play suggestions, feeding guidance (milk vs. solids), and sleep health indicators.
- Emphasize safety guidelines (safe sleeping, choking hazards, active floor play).
- Deliver the response in a highly encouraging, friendly, and structured format with elegant Markdown bullet points. Use bold terms and clean tables if helpful.
`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptText,
        config: {
          thinkingConfig: {
            thinkingBudget: 1024,
          },
        }
      });
      
      const text = response.text;
      setAiCustomRoutine(text || 'Could not generate customized routine at this time.');
      playSound('glass');
    } catch (error) {
      console.error("Gemini routine customizer error:", error);
      setAiCustomRoutine("Failed to reach pediatric advisor. Please verify network or key environment parameters.");
    } finally {
      setAiLoading(false);
    }
  };

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
              Pediatric Milestone Assist
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1.5 tracking-tight uppercase">
            Routine Coach
          </h1>
          <p className="text-white/75 text-xs sm:text-sm md:text-[14px] w-full max-w-4xl mx-auto leading-relaxed px-2">
            Configure optimal day-to-day schedules optimized for infant age-brackets. Built to follow WHO, Indian IAP and FSSAI benchmarks for active wake windows, safe sleep, and early supplementary sensory inputs.
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

      {/* Age Details Sub-card */}
      <div className="mb-8 bg-white/[0.02] border border-white/5 rounded-3xl p-6 text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-cheerful-blue/10 border border-cheerful-blue/20 rounded-2xl text-cheerful-blue">
            <Baby className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
              {currentAgeGroupData.label} Schedule Parameters
            </h2>
            <p className="text-sm text-white/60 font-medium">
              {currentAgeGroupData.rangeDesc}
            </p>
          </div>
        </div>
        <div className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl shrink-0 self-start md:self-auto">
          ⭐ {currentAgeGroupData.whoAesthetic}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentRoutinesList.map((item, idx) => {
                const isChecked = checkedRoutines.includes(item.id);
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleToggleCheck(item.id)}
                    className={`p-6 border-4 flex flex-col justify-between cursor-pointer rounded-3xl transition-all duration-300 relative overflow-hidden group min-h-[220px] bg-slate-950/40 text-left ${
                      isChecked
                        ? 'border-white shadow-2xl scale-[1.02]'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Background color bleed */}
                    <div className={`absolute inset-0 opacity-5 transition-opacity duration-300 ${isChecked ? 'opacity-15' : 'opacity-[0.02]'} bg-gradient-to-br ${item.colorClass}`} />

                    <div className="relative z-10 w-full flex justify-between items-start gap-2">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="text-4xl select-none leading-none mb-1.5">{item.emoji}</span>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight leading-snug">
                          {item.name}
                        </h3>
                      </div>

                      {/* Circular check box */}
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                        isChecked 
                          ? 'bg-cheerful-blue border-cheerful-blue animate-pulse' 
                          : 'border-white/20'
                      }`}>
                        {isChecked ? (
                          <Check className="w-5 h-5 text-slate-950 stroke-[3px]" />
                        ) : (
                          <span className="text-[10px] text-white/20 font-black">TA</span>
                        )}
                      </div>
                    </div>

                    <div className="relative z-10 mt-4">
                      <p className="text-xs text-white/60 font-medium leading-relaxed mb-3">
                        {item.desc}
                      </p>
                      <div className="text-[9px] font-black tracking-widest uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md inline-block">
                        🛡️ {item.whoReference.startsWith('WHO') ? item.whoReference.replace('WHO', 'WHO, Indian IAP & FSSAI') : item.whoReference}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Premium AI customizer form */}
      <div className="bg-gradient-to-br from-indigo-950/40 to-slate-950/80 border border-white/10 rounded-[2.5rem] p-6 md:p-8 shadow-xl text-left relative overflow-hidden">
        <div className="absolute top-0 left-0 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-white/5 mb-6">
          <div>
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Sparkles className="w-5 h-5 fill-amber-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.22em]">PRO Routine Engine</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
              AI Daily Schedule Customizer
            </h2>
            <p className="text-white/50 text-xs md:text-sm font-medium">
              Formulate hour-by-hour guidelines tailored specifically to your baby’s exact wake time and sleep temperament.
            </p>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[9px] font-black tracking-widest uppercase shadow-lg border border-amber-300/30 flex items-center gap-1 shrink-0">
            <Zap className="w-3 h-3 fill-black text-black" />
            Premium
          </div>
        </div>

        {/* Customizer form inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-white/40 block mb-2">
              Baby Wake-up Time
            </label>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold focus:border-cheerful-blue outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-white/40 block mb-2">
              Toddler Temperament / Primary Focus
            </label>
            <select
              value={temperament}
              onChange={(e) => setTemperament(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 p-4 rounded-2xl text-white font-bold focus:border-cheerful-blue outline-none transition-all"
            >
              <option value="Happy & Active (Focus on crawl stimulation)">Happy & Active (Focus on crawl/floor plays)</option>
              <option value="Tends to fight naps (Focus on gentle wind-down sleep)">Nap Refusal (Focus on calming sleep transition)</option>
              <option value="Sensitive to heavy stimulus (Focus on low-noise triggers)">Sensitive to stimulus (Focus on calm environments)</option>
              <option value="Transitioning to solid foods (Focus on sensory feeding)">Starting complementary food solids (Focus on tasting)</option>
              <option value="High verbal chatter (Focus on talking & rhyming)">Extremely vocal (Focus on language & speech mapping)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerateCustomRoutine}
          disabled={aiLoading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-amber-500/10 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {aiLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-black" />
              Formulating optimal WHO, Indian IAP & FSSAI day schedule...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 fill-black text-black" />
              Generate Customized Daily Schedule
            </>
          )}
        </button>

        {/* AI Output view */}
        <AnimatePresence>
          {(aiCustomRoutine || aiLoading) && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="mt-8 bg-slate-950/60 rounded-3xl p-6 border border-white/10 relative"
            >
              <div className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest text-white/30 border border-white/10 px-2.5 py-1 rounded-md">
                Gemini Coach Analysis
              </div>

              {aiLoading && !aiCustomRoutine && (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-amber-400/20 border-t-amber-400 animate-spin" />
                    <Sparkles className="w-5 h-5 text-amber-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-amber-400 animate-pulse" />
                  </div>
                  <p className="text-sm font-black text-white uppercase tracking-wider">AI is structuring your timeline...</p>
                  <p className="text-xs text-white/40 max-w-sm">Generating an hour-by-hour routine respecting WHO, Indian IAP and FSSAI wake windows and developmental milestones.</p>
                </div>
              )}

              {aiCustomRoutine && (
                <div className="prose prose-invert max-w-none text-white/80 text-left">
                  <Markdown
                    components={{
                      h1: ({ children }) => <h1 className="text-xl md:text-2xl font-black text-white mt-4 mb-3 flex items-center gap-2 border-b border-white/10 pb-1.5 tracking-tight uppercase">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-lg md:text-xl font-black text-cheerful-blue mt-5 mb-2 tracking-tight uppercase">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-base md:text-lg font-black text-emerald-400 mt-4 mb-2 tracking-tight">{children}</h3>,
                      p: ({ children }) => <p className="mb-4 text-white/80 leading-relaxed text-sm md:text-base font-medium">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-2 font-medium">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-2 font-medium">{children}</ol>,
                      li: ({ children }) => <li className="text-sm md:text-base text-white/75 leading-relaxed">{children}</li>,
                      strong: ({ children }) => <strong className="font-extrabold text-white">{children}</strong>,
                      em: ({ children }) => <em className="italic text-white/60">{children}</em>,
                    }}
                  >
                    {aiCustomRoutine}
                  </Markdown>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
