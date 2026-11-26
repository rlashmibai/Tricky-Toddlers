import React from 'react';
import { Users, Check } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { playSound } from '../lib/sounds';
import { trackSiteAnalyticsEvent } from '../lib/analyticsTracker';

export type ProfileSelectorOptionId = 1 | 2 | 'general';

interface ChildProfileSelectorProps {
  selectedChildId: any;
  onSelectChild: (id: any) => void;
  sectionContextName: string;
  allowGeneral?: boolean;
  className?: string;
}

export const ChildProfileSelector: React.FC<ChildProfileSelectorProps> = ({
  selectedChildId,
  onSelectChild,
  sectionContextName,
  allowGeneral = false,
  className = '',
}) => {
  const { childProfiles, switchActiveChild, isAccountUser, profile } = useAuth();

  if (!childProfiles || childProfiles.length === 0) {
    return null;
  }

  // Render multi-option selector when there are multiple child profiles OR when General option is enabled
  if (childProfiles.length > 1 || allowGeneral) {
    const totalOptions = childProfiles.length + (allowGeneral ? 1 : 0);
    const gridColsClass =
      totalOptions >= 3
        ? 'grid-cols-1 sm:grid-cols-3'
        : 'grid-cols-1 sm:grid-cols-2';

    return (
      <div className={`w-full bg-[#0a1224]/95 border-2 border-indigo-500/40 rounded-3xl p-3 sm:p-4 shadow-2xl backdrop-blur-md ${className}`}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Users className="w-4 h-4 text-emerald-400" />
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-300">
            Select Option:
          </span>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            (Click checkbox to select for {sectionContextName})
          </span>
        </div>

        <div className={`grid ${gridColsClass} gap-3`}>
          {allowGeneral && (() => {
            const isGeneralSelected = selectedChildId === 'general';
            return (
              <button
                type="button"
                onClick={() => {
                  if (!isGeneralSelected) {
                    playSound('pop');
                    onSelectChild('general');
                    trackSiteAnalyticsEvent({
                      accountType: isAccountUser ? 'Personal Account' : 'Guest Account',
                      eventType: 'persona_switch',
                      entryPoint: `Persona Switch (${sectionContextName})`,
                      personaName: isAccountUser ? (profile?.parentName || profile?.username || 'Parent') : 'Parent',
                      childProfile: 'General (All Ages)',
                      activeTab: sectionContextName,
                    });
                  }
                }}
                className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl border-2 transition-all text-left cursor-pointer shadow-lg select-none ${
                  isGeneralSelected
                    ? 'bg-gradient-to-r from-emerald-950/90 via-teal-950/80 to-slate-900/90 border-emerald-400 text-white shadow-[0_0_25px_rgba(16,185,129,0.35)] ring-2 ring-emerald-400/40'
                    : 'bg-[#0f172a]/80 border-white/20 text-slate-300 hover:border-emerald-400/50 hover:bg-[#131f3b] hover:text-white'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border-2 transition-all ${
                    isGeneralSelected
                      ? 'bg-emerald-500 border-emerald-300 text-slate-950 shadow-sm'
                      : 'bg-white/5 border-slate-500 text-transparent'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3.5]" />
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-base sm:text-lg font-black tracking-tight truncate ${
                      isGeneralSelected ? 'text-white' : 'text-slate-200'
                    }`}>
                      General
                    </span>
                    <span className={`text-xs font-black px-2.5 py-0.5 rounded-lg shrink-0 border ${
                      isGeneralSelected
                        ? 'bg-emerald-500/25 border-emerald-400/50 text-emerald-200'
                        : 'bg-white/10 border-white/15 text-slate-400'
                    }`}>
                      All Ages
                    </span>
                  </div>
                  <span className={`text-[11px] font-bold mt-1 flex items-center gap-1.5 ${
                    isGeneralSelected ? 'text-emerald-300' : 'text-slate-400'
                  }`}>
                    {isGeneralSelected ? (
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
          })()}

          {childProfiles.map((cp) => {
            const isSelected = selectedChildId === cp.id;
            return (
              <button
                key={cp.id}
                type="button"
                onClick={() => {
                  if (!isSelected) {
                    playSound('pop');
                    if (cp.id === 1 || cp.id === 2) {
                      switchActiveChild(cp.id);
                    }
                    onSelectChild(cp.id);
                    trackSiteAnalyticsEvent({
                      accountType: isAccountUser ? 'Personal Account' : 'Guest Account',
                      eventType: 'persona_switch',
                      entryPoint: `Persona Switch (${sectionContextName})`,
                      personaName: isAccountUser ? (profile?.parentName || profile?.username || 'Parent') : 'Parent',
                      childProfile: `${cp.name} (${cp.age})`,
                      activeTab: sectionContextName,
                    });
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
                    <span className={`text-base sm:text-lg font-black tracking-tight truncate ${
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

  // Single profile active (Child 2 marked Not Applicable or only 1 child, and allowGeneral is false)
  return (
    <div className={`inline-flex items-center gap-3 p-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/70 to-slate-900/90 border-2 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)] ${className}`}>
      <div className="w-6 h-6 rounded-lg bg-emerald-500 border-2 border-emerald-300 text-slate-950 flex items-center justify-center shrink-0">
        <Check className="w-4 h-4 stroke-[3.5]" />
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-base sm:text-lg font-black text-white">{childProfiles[0]?.name || 'Child'}</span>
        <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-emerald-500/25 border border-emerald-400/40 text-emerald-200">
          {childProfiles[0]?.age || 'Age not set'}
        </span>
        <span className="text-xs font-bold text-emerald-300 ml-1">· Active for {sectionContextName}</span>
      </div>
    </div>
  );
};
