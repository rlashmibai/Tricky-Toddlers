import React from 'react';
import { Baby, Check } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { playSound } from '../lib/sounds';

interface ChildProfileSelectorProps {
  selectedChildId: 1 | 2;
  onSelectChild: (id: 1 | 2) => void;
  sectionContextName: string;
  className?: string;
}

export const ChildProfileSelector: React.FC<ChildProfileSelectorProps> = ({
  selectedChildId,
  onSelectChild,
  sectionContextName,
  className = '',
}) => {
  const { childProfiles } = useAuth();

  if (!childProfiles || childProfiles.length === 0) {
    return null;
  }

  if (childProfiles.length > 1) {
    return (
      <div className={`w-full bg-[#0a1224]/95 border-2 border-indigo-500/40 rounded-3xl p-3 sm:p-4 shadow-2xl backdrop-blur-md ${className}`}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Baby className="w-4 h-4 text-emerald-400" />
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-300">
            Select Child Profile:
          </span>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            (Click checkbox to select child profile for {sectionContextName})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {childProfiles.map((cp) => {
            const isSelected = selectedChildId === cp.id;
            return (
              <button
                key={cp.id}
                type="button"
                onClick={() => {
                  if (!isSelected) {
                    playSound('pop');
                    onSelectChild(cp.id);
                  }
                }}
                className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl border-2 transition-all text-left cursor-pointer shadow-lg select-none ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-950/90 via-teal-950/80 to-slate-900/90 border-emerald-400 text-white shadow-[0_0_25px_rgba(16,185,129,0.35)] ring-2 ring-emerald-400/40'
                    : 'bg-[#0f172a]/80 border-white/20 text-slate-300 hover:border-emerald-400/50 hover:bg-[#131f3b] hover:text-white'
                }`}
              >
                {/* High-contrast custom checkbox */}
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border-2 transition-all ${
                    isSelected
                      ? 'bg-emerald-500 border-emerald-300 text-slate-950 shadow-sm'
                      : 'bg-white/5 border-slate-500 text-transparent'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3.5]" />
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-base sm:text-lg font-black tracking-tight ${
                      isSelected ? 'text-white' : 'text-slate-200'
                    }`}>
                      {cp.name}
                    </span>
                    <span className={`text-xs font-black px-2.5 py-0.5 rounded-lg shrink-0 border ${
                      isSelected
                        ? 'bg-emerald-500/25 border-emerald-400/50 text-emerald-200'
                        : 'bg-white/10 border-white/15 text-slate-400'
                    }`}>
                      {cp.age}
                    </span>
                  </div>
                  <span className={`text-[11px] font-bold mt-1 flex items-center gap-1.5 ${
                    isSelected ? 'text-emerald-300' : 'text-slate-400'
                  }`}>
                    {isSelected ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Active for {sectionContextName}
                      </>
                    ) : (
                      'Tap checkbox to select'
                    )}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Single profile active (Child 2 marked Not Applicable or only 1 child)
  return (
    <div className={`inline-flex items-center gap-3 p-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/70 to-slate-900/90 border-2 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)] ${className}`}>
      <div className="w-6 h-6 rounded-lg bg-emerald-500 border-2 border-emerald-300 text-slate-950 flex items-center justify-center shrink-0">
        <Check className="w-4 h-4 stroke-[3.5]" />
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-base sm:text-lg font-black text-white">{childProfiles[0]?.name || 'Ashwath'}</span>
        <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-emerald-500/25 border border-emerald-400/40 text-emerald-200">
          {childProfiles[0]?.age || '2 yrs 6 mos'}
        </span>
        <span className="text-xs font-bold text-emerald-300 ml-1">· Active for {sectionContextName}</span>
      </div>
    </div>
  );
};
