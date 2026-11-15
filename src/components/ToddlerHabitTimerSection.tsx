import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Volume2,
  Trophy,
  Bath,
  Droplets,
  Smile,
  Award
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import { speakIndianEnglish } from '../lib/indianSpeech';

export interface HabitTimerActivity {
  id: 'potty' | 'brushing' | 'handwash' | 'bath';
  name: string;
  suggestedLabel: string;
  durationSeconds: number;
  emoji: string;
  tagline: string;
  color: string;
  ringStroke: string;
  badgeClass: string;
  borderClass: string;
  glowClass: string;
  steps: string[];
  startVoicePrompt: string;
  completeVoicePrompt: string;
}

export const HABIT_TIMER_ACTIVITIES: HabitTimerActivity[] = [
  {
    id: 'potty',
    name: 'Potty Training',
    suggestedLabel: '5 Minutes',
    durationSeconds: 5 * 60,
    emoji: '🚽',
    tagline: 'Calm sitting time with relaxed breathing and story talk',
    color: 'from-amber-400 to-orange-500',
    ringStroke: '#fbbf24',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    borderClass: 'border-amber-400/40',
    glowClass: 'shadow-amber-500/20',
    steps: [
      'Sit comfortably with feet supported on a small step stool.',
      'Take 3 slow belly breaths or blow pretend bubbles together.',
      'Stay relaxed for up to 5 minutes, then flush and wash hands!'
    ],
    startVoicePrompt: 'Potty training timer started for 5 minutes. Let us sit comfortably and relax!',
    completeVoicePrompt: '5 minutes complete! Wonderful job sitting on the potty! Now let us wash our hands.'
  },
  {
    id: 'brushing',
    name: 'Brushing Teeth',
    suggestedLabel: '2 Minutes',
    durationSeconds: 2 * 60,
    emoji: '🪥',
    tagline: 'Dentist-recommended 2-minute sparkle brush for top & bottom teeth',
    color: 'from-cyan-400 to-sky-500',
    ringStroke: '#38bdf8',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
    borderClass: 'border-sky-400/40',
    glowClass: 'shadow-sky-500/20',
    steps: [
      'Use a tiny rice-grain or pea-sized smear of toddler toothpaste.',
      'Brush outside, inside, and chewing surfaces in gentle circles.',
      'Brush top teeth for 1 minute, bottom teeth for 1 minute, then spit!'
    ],
    startVoicePrompt: 'Brushing teeth timer started for 2 minutes. Let us make your teeth super shiny!',
    completeVoicePrompt: '2 minutes are up! Your teeth are sparkling clean! Great job brushing!'
  },
  {
    id: 'handwash',
    name: 'Hand Washing',
    suggestedLabel: '20 Seconds',
    durationSeconds: 20,
    emoji: '🧼',
    tagline: 'IAP-recommended 20-second soap scrub to wash away germs',
    color: 'from-emerald-400 to-teal-500',
    ringStroke: '#34d399',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    borderClass: 'border-emerald-400/40',
    glowClass: 'shadow-emerald-500/20',
    steps: [
      'Wet hands with clean water and apply gentle baby soap.',
      'Rub palms, backs of hands, between fingers, and thumbs for 20 seconds.',
      'Rinse with clean water and pat dry with a soft towel.'
    ],
    startVoicePrompt: 'Hand washing timer started for 20 seconds. Rub your soapy hands together!',
    completeVoicePrompt: '20 seconds complete! Bye bye germs, your hands are squeaky clean!'
  },
  {
    id: 'bath',
    name: 'Bath Time',
    suggestedLabel: '10 Minutes',
    durationSeconds: 10 * 60,
    emoji: '🛁',
    tagline: 'Warm splash, gentle wash, and soothing sensory play',
    color: 'from-indigo-400 to-purple-500',
    ringStroke: '#818cf8',
    badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
    borderClass: 'border-indigo-400/40',
    glowClass: 'shadow-indigo-500/20',
    steps: [
      'Check warm water temperature (around 37°C to 38°C) before placing toddler in.',
      'Enjoy 5 to 7 minutes of warm water splash and sensory cup play.',
      'Wash hair and body gently in the final 3 minutes, then wrap in a cozy towel.'
    ],
    startVoicePrompt: 'Bath time timer started for 10 minutes. Have a happy splashy bath!',
    completeVoicePrompt: '10 minutes are up! Bath time is finished, time for a warm cozy towel!'
  }
];

const formatTimeDisplay = (totalSeconds: number): string => {
  const safeSeconds = Math.max(0, totalSeconds);
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const ToddlerHabitTimerSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState<HabitTimerActivity['id']>('potty');
  const activeActivity =
    HABIT_TIMER_ACTIVITIES.find((a) => a.id === selectedId) || HABIT_TIMER_ACTIVITIES[0];

  const [remainingSeconds, setRemainingSeconds] = useState<number>(activeActivity.durationSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [completedHistory, setCompletedHistory] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('toddler_habit_timer_counts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const intervalRef = useRef<number | null>(null);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Countdown tick logic with automatic stop when time ends
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          // Auto-stop when timer reaches 0
          setIsRunning(false);
          setIsCompleted(true);
          playSound('glass');
          speakIndianEnglish(activeActivity.completeVoicePrompt);
          setCompletedHistory((prevCounts) => {
            const updated = {
              ...prevCounts,
              [activeActivity.id]: (prevCounts[activeActivity.id] || 0) + 1
            };
            try {
              localStorage.setItem('toddler_habit_timer_counts', JSON.stringify(updated));
            } catch {
              // ignore storage errors
            }
            return updated;
          });
          return 0;
        }

        // Gentle tick cue on last 3 seconds
        if (prev <= 4) {
          playSound('click');
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, activeActivity]);

  const handleSelectActivity = (activity: HabitTimerActivity) => {
    playSound('glass');
    setIsRunning(false);
    setIsCompleted(false);
    setSelectedId(activity.id);
    setRemainingSeconds(activity.durationSeconds);
    speakIndianEnglish(`${activity.name}: ${activity.suggestedLabel}`);
  };

  const handleStartPause = () => {
    if (isCompleted || remainingSeconds === 0) {
      // Restart from full suggested duration and start immediately
      playSound('pop');
      setRemainingSeconds(activeActivity.durationSeconds);
      setIsCompleted(false);
      setIsRunning(true);
      speakIndianEnglish(activeActivity.startVoicePrompt);
      return;
    }

    if (!isRunning) {
      playSound('pop');
      setIsRunning(true);
      if (remainingSeconds === activeActivity.durationSeconds) {
        speakIndianEnglish(activeActivity.startVoicePrompt);
      } else {
        speakIndianEnglish('Timer resumed');
      }
    } else {
      playSound('click');
      setIsRunning(false);
      speakIndianEnglish('Timer paused');
    }
  };

  const handleReset = () => {
    playSound('pop');
    setIsRunning(false);
    setIsCompleted(false);
    setRemainingSeconds(activeActivity.durationSeconds);
    speakIndianEnglish(`${activeActivity.name} timer reset to ${activeActivity.suggestedLabel}`);
  };

  const totalSeconds = activeActivity.durationSeconds;
  const elapsedSeconds = totalSeconds - remainingSeconds;
  const progressPercent =
    totalSeconds > 0 ? Math.min(100, Math.round((elapsedSeconds / totalSeconds) * 100)) : 0;

  // SVG Ring Dimensions
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <motion.div
      key="timers-view"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="w-full space-y-5 text-left"
    >
      {/* Header */}
      <header className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-300">
          <Clock className="w-3.5 h-3.5 text-emerald-300" />
          <span className="text-[11px] font-black uppercase tracking-widest">
            Daily Habit Stopwatch &amp; Auto-Stop Timers
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
          ⏱️ Toddler Routine &amp; Habit Timers
        </h1>
        <p className="text-white/65 text-xs sm:text-sm font-medium max-w-2xl mx-auto">
          Select an activity below and tap Start. The timer counts down automatically and stops with a cheerful voice alert when time is up!
        </p>
      </header>

      {/* Main Responsive Grid: Activity Selector Cards (Left) + Big Stopwatch Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: All 4 Suggested Activity Cards */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3">
          <div className="glass-card rounded-3xl border border-white/15 p-4 sm:p-5 space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div>
                <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Select Toddler Activity</span>
                </h2>
                <p className="text-[11px] text-slate-400">
                  Tap any habit card to load its suggested timer
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-wider text-slate-300">
                4 Activities
              </span>
            </div>

            {/* 2x2 Grid on Mobile, 1-Column Stack on Desktop for easy thumb/mouse access */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {HABIT_TIMER_ACTIVITIES.map((item) => {
                const isSelected = item.id === selectedId;
                const doneCount = completedHistory[item.id] || 0;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectActivity(item)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? `bg-white/[0.10] ${item.borderClass} shadow-lg ${item.glowClass} scale-[1.01]`
                        : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl shadow-md shrink-0`}
                      >
                        {item.emoji}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-sm sm:text-base font-black text-white truncate">
                            {item.name}
                          </span>
                          {doneCount > 0 && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-black text-emerald-300">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              {doneCount}x
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                          {item.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 gap-1">
                      <span
                        className={`px-2.5 py-1 rounded-xl border text-xs font-black whitespace-nowrap ${item.badgeClass}`}
                      >
                        {item.suggestedLabel}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                          {isRunning ? '● Running' : isCompleted ? '✓ Done' : 'Selected'}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Stopwatch & Auto-Stop Display */}
        <div className="lg:col-span-7 flex flex-col justify-between glass-card rounded-3xl border border-white/15 p-5 sm:p-7 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

          {/* Top Bar inside Stopwatch Card */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl">{activeActivity.emoji}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-2xl font-black text-white">
                    {activeActivity.name}
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full border text-xs font-black ${activeActivity.badgeClass}`}
                  >
                    {activeActivity.suggestedLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">{activeActivity.tagline}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                playSound('glass');
                speakIndianEnglish(
                  `${activeActivity.name}. Suggested timer is ${activeActivity.suggestedLabel}. ${activeActivity.steps.join(' ')}`
                );
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white transition-all cursor-pointer"
              title="Read instructions aloud"
            >
              <Volume2 className="w-4 h-4 text-emerald-300" />
              <span>Speak Guide</span>
            </button>
          </div>

          {/* Center Circular Stopwatch + Primary Touch Controls */}
          <div className="relative z-10 my-5 flex flex-col md:flex-row items-center justify-around gap-6">
            {/* Circular Progress Ring */}
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke={isCompleted ? '#34d399' : activeActivity.ringStroke}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 ease-out"
                />
              </svg>

              {/* Center Digital Time Readout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {isCompleted
                    ? 'Time Ended!'
                    : isRunning
                    ? 'Counting Down'
                    : remainingSeconds < totalSeconds
                    ? 'Paused'
                    : 'Ready to Start'}
                </span>

                <div
                  className={`text-4xl sm:text-5xl font-mono font-black tracking-wider my-1 ${
                    isCompleted ? 'text-emerald-300' : 'text-white'
                  }`}
                >
                  {formatTimeDisplay(remainingSeconds)}
                </div>

                <span className="text-[11px] font-bold text-slate-300">
                  {progressPercent}% Complete
                </span>
              </div>
            </div>

            {/* Large Parent & Toddler Friendly Action Buttons */}
            <div className="w-full max-w-xs space-y-3">
              <button
                type="button"
                onClick={handleStartPause}
                className={`w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer ${
                  isRunning
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/25'
                    : isCompleted
                    ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-500/25'
                    : 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 shadow-emerald-500/25'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>Pause Timer</span>
                  </>
                ) : isCompleted ? (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>Start Again ({activeActivity.suggestedLabel})</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>
                      {remainingSeconds < totalSeconds ? 'Resume Timer' : 'Start Timer'}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs sm:text-sm transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-slate-300" />
                <span>Reset to {activeActivity.suggestedLabel}</span>
              </button>

              {/* Auto-Stop Status Pill */}
              <div className="px-3.5 py-2 rounded-xl bg-black/30 border border-white/10 text-center">
                <p className="text-[11px] text-slate-300 font-semibold">
                  🔔 <span className="text-white font-bold">Auto-Stop Enabled:</span> Automatically stops at 00:00 with a cheerful voice chime.
                </p>
              </div>
            </div>
          </div>

          {/* Completion Celebration Banner */}
          <AnimatePresence>
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="relative z-10 mb-4 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/25 border border-emerald-300/40 flex items-center justify-center text-emerald-300 shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-white">
                      Hurray! {activeActivity.name} Complete! 🎉
                    </h4>
                    <p className="text-xs text-emerald-200">
                      Timer auto-stopped at {activeActivity.suggestedLabel}. Give your little one a high-five!
                    </p>
                  </div>
                </div>
                <Award className="w-6 h-6 text-amber-300 shrink-0" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Parent Coaching Steps for Active Habit */}
          <div className="relative z-10 rounded-2xl bg-white/[0.04] border border-white/10 p-4 space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-indigo-300">
              Parent &amp; Toddler Steps During {activeActivity.name}
            </h3>
            <ul className="space-y-1.5">
              {activeActivity.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-2.5 text-xs text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/25 border border-indigo-400/40 text-indigo-300 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
