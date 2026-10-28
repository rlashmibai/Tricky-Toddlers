import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Baby, 
  ShieldAlert, 
  Utensils, 
  Syringe, 
  Check, 
  Plus, 
  X, 
  Save, 
  Loader2, 
  CheckCircle2, 
  Calendar, 
  AlertCircle, 
  Sparkles,
  Info,
  Heart,
  Trash2,
  Clock,
  RotateCcw,
  ArrowRight,
  ExternalLink,
  User,
  Award,
  Bot
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { db, handleFirestoreError } from '../lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { playSound } from '../lib/sounds';
import { ALL_VACCINES } from './VaccineTracker';

export interface VaccineRecord {
  id: string;
  ageMilestone: string;
  vaccineName: string;
  diseaseProtected: string;
  status: 'Completed' | 'Upcoming' | 'Scheduled';
  doseNumber: string;
  recommendedDate?: string;
  dateAdministered?: string;
  notes?: string;
  isCustom?: boolean;
}

const DEFAULT_VACCINES: VaccineRecord[] = ALL_VACCINES.map(v => ({
  id: v.id,
  ageMilestone: v.ageMilestone,
  vaccineName: v.vaccineName,
  diseaseProtected: v.diseaseProtected,
  status: (v.status || 'Upcoming') as 'Completed' | 'Upcoming' | 'Scheduled',
  doseNumber: v.doseNumber,
  recommendedDate: v.recommendedWindow,
  dateAdministered: v.dateAdministered || '',
  notes: v.description || '',
  isCustom: v.isCustom || false
}));

export const DIET_TYPES = [
  'Vegetarian',
  'Vegetarian + Eggs',
  'Non-Vegetarian'
] as const;

export const RELIGIOUS_CULTURAL_OPTIONS = [
  'No specific restrictions',
  'Jain',
  'Halal',
  'Sattvic'
] as const;

export const FOODS_TO_AVOID_OPTIONS = [
  'No onion',
  'No garlic',
  'No root vegetables',
  'No eggs',
  'No meat',
  'No Seafood',
  'No pork',
  'No chemicals',
  'No artificial sweeteners',
  'No food coloring / artificial colors',
  'No Mushrooms'
] as const;

export const ALLERGIES_INTOLERANCES_OPTIONS = [
  'Milk / dairy',
  'Lactose',
  'Egg',
  'Peanut',
  'Nuts',
  'Wheat / gluten',
  'Soy',
  'Sesame',
  'Seafood'
] as const;

export const FEEDING_STYLE_OPTIONS = [
  'Baby-led weaning (BLW)',
  'Spoon feeding',
  'Combination feeding',
  'Finger foods',
  'Mashed / soft foods'
] as const;

export const ASHWATH_DEFAULT_PROMPT = "Ashwath is a healthy, active toddler who loves sensory play and outdoor exploration. Prefers nutritious, home-cooked vegetarian meals (khichdi, curd rice, steamed vegetables, and fruit slices) with low salt, zero refined sugar, and no artificial additives. Sensitive to loud noises, experiences teething discomfort, and thrives on a consistent afternoon nap and soothing bedtime routine. Please keep all advice gentle, actionable, and age-appropriate.";

export const BabyHealthSettings: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // Basic Info
  const [parentName, setParentName] = useState(() => {
    return profile?.parentName || profile?.name || profile?.firstName || localStorage.getItem('parent_name') || 'Lashmi';
  });

  const [babyName, setBabyName] = useState(() => {
    return profile?.babyName || profile?.childName || localStorage.getItem('baby_name') || 'Ashwath';
  });

  const [babyBirthDate, setBabyBirthDate] = useState(() => {
    return profile?.babyBirthDate || localStorage.getItem('baby_birthdate') || '2024-04-12';
  });

  const [aiInstructions, setAiInstructions] = useState(() => {
    return profile?.aiInstructions || localStorage.getItem('baby_ai_instructions') || ASHWATH_DEFAULT_PROMPT;
  });

  // Calculate baby age automatically from mandatory DOB
  const calculateAgeFromDob = (dob: string) => {
    if (!dob) return '';
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) return '';
    const now = new Date();
    let totalMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    if (now.getDate() < birth.getDate()) {
      totalMonths--;
    }
    if (totalMonths < 0) return 'Just born (0 Months)';
    if (totalMonths < 1) return 'Newborn (< 1 Month)';
    if (totalMonths < 12) return `${totalMonths} Month${totalMonths > 1 ? 's' : ''}`;
    const years = Math.floor(totalMonths / 12);
    const remMonths = totalMonths % 12;
    if (remMonths === 0) return `${years} Year${years > 1 ? 's' : ''}`;
    return `${years} Year${years > 1 ? 's' : ''} ${remMonths} Month${remMonths > 1 ? 's' : ''}`;
  };

  const calculatedAge = calculateAgeFromDob(babyBirthDate);

  // 1. Diet Type (Single Select)
  const [dietType, setDietType] = useState<string>(() => {
    return profile?.dietType || localStorage.getItem('baby_diet_type') || 'Vegetarian';
  });

  // 2. Religious / Cultural (Multi Select + 2 text boxes)
  const [religiousCultural, setReligiousCultural] = useState<string[]>(() => {
    if (profile?.religiousCultural && Array.isArray(profile.religiousCultural)) {
      return profile.religiousCultural;
    }
    try {
      const saved = localStorage.getItem('baby_religious_cultural');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['No specific restrictions'];
  });
  const [otherReligiousPreference, setOtherReligiousPreference] = useState<string>(() => {
    return profile?.otherReligiousPreference || localStorage.getItem('baby_other_religious_preference') || '';
  });
  const [customRestrictions, setCustomRestrictions] = useState<string>(() => {
    return profile?.customRestrictions || localStorage.getItem('baby_custom_restrictions') || '';
  });

  // 3. Foods to Avoid (Multi Select + 1 text box)
  const [foodsToAvoid, setFoodsToAvoid] = useState<string[]>(() => {
    if (profile?.foodsToAvoid && Array.isArray(profile.foodsToAvoid)) {
      return profile.foodsToAvoid;
    }
    try {
      const saved = localStorage.getItem('baby_foods_to_avoid');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  const [otherFoodsToAvoid, setOtherFoodsToAvoid] = useState<string>(() => {
    return profile?.otherFoodsToAvoid || localStorage.getItem('baby_other_foods_to_avoid') || '';
  });

  // 4. Allergies / Intolerances (Multi Select + 1 text box)
  const [allergiesIntolerances, setAllergiesIntolerances] = useState<string[]>(() => {
    if (profile?.allergiesIntolerances && Array.isArray(profile.allergiesIntolerances)) {
      return profile.allergiesIntolerances;
    }
    try {
      const saved = localStorage.getItem('baby_allergies_intolerances');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['Peanut'];
  });
  const [otherAllergyIntolerance, setOtherAllergyIntolerance] = useState<string>(() => {
    return profile?.otherAllergyIntolerance || localStorage.getItem('baby_other_allergy_intolerance') || '';
  });

  // 5. Feeding Style (Multi Select)
  const [feedingStyles, setFeedingStyles] = useState<string[]>(() => {
    if (profile?.feedingStyles && Array.isArray(profile.feedingStyles)) {
      return profile.feedingStyles;
    }
    try {
      const saved = localStorage.getItem('baby_feeding_styles');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['Baby-led weaning (BLW)', 'Finger foods'];
  });

  // Vaccinations (strictly 0% completed by default, all 42 official IAP vaccines Upcoming)
  const [vaccinations, setVaccinations] = useState<VaccineRecord[]>(() => {
    try {
      const savedV2 = localStorage.getItem('comprehensive_baby_vaccines_v2');
      if (savedV2) {
        const parsed = JSON.parse(savedV2);
        if (Array.isArray(parsed) && parsed.length >= 40) return parsed;
      }
      const savedV3 = localStorage.getItem('baby_vaccinations_v3');
      if (savedV3) {
        const parsed = JSON.parse(savedV3);
        if (Array.isArray(parsed) && parsed.length >= 40) return parsed;
      }
      const savedV2Old = localStorage.getItem('baby_vaccinations_v2');
      if (savedV2Old) {
        const parsed = JSON.parse(savedV2Old);
        if (Array.isArray(parsed) && parsed.length >= 40) return parsed;
      }
    } catch (e) {}

    // Only load profile vaccinations if explicitly set in v2+ and has full 40+ schedule
    if ((profile as any)?.vaccinationsVersion === 'v2' && profile?.vaccinations && Array.isArray(profile.vaccinations) && profile.vaccinations.length >= 40) {
      return profile.vaccinations;
    }

    return DEFAULT_VACCINES.map(v => ({ ...v, status: 'Upcoming' as const, dateAdministered: '' }));
  });

  const [vaccineFilter, setVaccineFilter] = useState<'All' | 'Completed' | 'Upcoming'>('All');
  const [showAddVaccine, setShowAddVaccine] = useState(false);
  const [customVaccineName, setCustomVaccineName] = useState('');
  const [customVaccineMilestone, setCustomVaccineMilestone] = useState('18 Months');
  const [customVaccineProtection, setCustomVaccineProtection] = useState('');

  // Form states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync with Firestore profile when profile updates
  useEffect(() => {
    if (profile) {
      if (profile.parentName || profile.name || profile.firstName) {
        setParentName(profile.parentName || profile.name || profile.firstName);
      } else if (!parentName) {
        setParentName('Lashmi');
      }
      if (profile.babyName || profile.childName) {
        setBabyName(profile.babyName || profile.childName);
      } else if (!babyName) {
        setBabyName('Ashwath');
      }
      if (profile.babyBirthDate) setBabyBirthDate(profile.babyBirthDate);
      if (profile.aiInstructions) setAiInstructions(profile.aiInstructions);
      if (profile.dietType) setDietType(profile.dietType);
      if (profile.religiousCultural && Array.isArray(profile.religiousCultural)) setReligiousCultural(profile.religiousCultural);
      if (profile.otherReligiousPreference !== undefined) setOtherReligiousPreference(profile.otherReligiousPreference);
      if (profile.customRestrictions !== undefined) setCustomRestrictions(profile.customRestrictions);
      if (profile.foodsToAvoid && Array.isArray(profile.foodsToAvoid)) setFoodsToAvoid(profile.foodsToAvoid);
      if (profile.otherFoodsToAvoid !== undefined) setOtherFoodsToAvoid(profile.otherFoodsToAvoid);
      if (profile.allergiesIntolerances && Array.isArray(profile.allergiesIntolerances)) setAllergiesIntolerances(profile.allergiesIntolerances);
      if (profile.otherAllergyIntolerance !== undefined) setOtherAllergyIntolerance(profile.otherAllergyIntolerance);
      if (profile.feedingStyles && Array.isArray(profile.feedingStyles)) setFeedingStyles(profile.feedingStyles);
      if ((profile as any)?.vaccinationsVersion === 'v2' && profile.vaccinations && Array.isArray(profile.vaccinations) && profile.vaccinations.length >= 40) {
        setVaccinations(profile.vaccinations);
      }
    }
  }, [profile]);

  // Listen for local changes from Dedicated Vaccine Tracker
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('comprehensive_baby_vaccines_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length >= 40) {
            setVaccinations(parsed);
          }
        }
      } catch (e) {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Toggle Religious / Cultural
  const toggleReligiousCultural = (item: string) => {
    playSound('pop');
    setReligiousCultural(prev => {
      if (item === 'No specific restrictions') {
        return prev.includes(item) ? [] : ['No specific restrictions'];
      }
      const withoutNoRestrictions = prev.filter(r => r !== 'No specific restrictions');
      if (withoutNoRestrictions.includes(item)) {
        const next = withoutNoRestrictions.filter(r => r !== item);
        return next.length === 0 ? ['No specific restrictions'] : next;
      } else {
        return [...withoutNoRestrictions, item];
      }
    });
  };

  // Toggle Foods to Avoid
  const toggleFoodToAvoid = (item: string) => {
    playSound('pop');
    setFoodsToAvoid(prev => 
      prev.includes(item) ? prev.filter(f => f !== item) : [...prev, item]
    );
  };

  // Toggle Allergies / Intolerances
  const toggleAllergyIntolerance = (item: string) => {
    playSound('pop');
    setAllergiesIntolerances(prev => 
      prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]
    );
  };

  // Toggle Feeding Style
  const toggleFeedingStyle = (item: string) => {
    playSound('pop');
    setFeedingStyles(prev => 
      prev.includes(item) ? prev.filter(s => s !== item) : [...prev, item]
    );
  };

  // Vaccine status toggle
  const toggleVaccineStatus = (id: string) => {
    playSound('pop');
    setVaccinations(prev => prev.map(v => {
      if (v.id === id) {
        const nextStatus = v.status === 'Completed' ? 'Upcoming' : 'Completed';
        return {
          ...v,
          status: nextStatus,
          dateAdministered: nextStatus === 'Completed' ? (v.dateAdministered || 'Administered') : ''
        };
      }
      return v;
    }));
  };

  const handleVaccineDateChange = (id: string, newDate: string) => {
    setVaccinations(prev => prev.map(v => v.id === id ? { ...v, dateAdministered: newDate } : v));
  };

  const handleAddCustomVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customVaccineName.trim()) return;
    playSound('glass');
    const newRecord: VaccineRecord = {
      id: `v-custom-${Date.now()}`,
      ageMilestone: customVaccineMilestone || 'Custom',
      vaccineName: customVaccineName.trim(),
      diseaseProtected: customVaccineProtection.trim() || 'Pediatric protection',
      status: 'Upcoming',
      doseNumber: 'Custom Dose',
      isCustom: true
    };
    setVaccinations(prev => [...prev, newRecord]);
    setCustomVaccineName('');
    setCustomVaccineProtection('');
    setShowAddVaccine(false);
  };

  const deleteVaccineRecord = (id: string) => {
    playSound('pop');
    setVaccinations(prev => prev.filter(v => v.id !== id));
  };

  // Save baby profile to Firestore and LocalStorage, then redirect to Home AI Assistant
  const handleSaveAll = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validate required fields: Parent Name, Baby Name, and DOB
    if (!parentName.trim()) {
      setError("Parent Name is required. Please enter parent's name.");
      setLoading(false);
      return;
    }
    if (!babyName.trim()) {
      setError("Baby Name is required. Please enter baby's name.");
      setLoading(false);
      return;
    }
    if (!babyBirthDate) {
      setError("Date of Birth (DOB) is required. Please select your baby's birth date.");
      setLoading(false);
      return;
    }

    const calculatedAgeString = calculatedAge || '14 Months';

    try {
      // Local storage fallbacks & persistence
      localStorage.setItem('parent_name', parentName.trim());
      localStorage.setItem('baby_name', babyName.trim());
      localStorage.setItem('child_name', babyName.trim());
      localStorage.setItem('toddler_name', babyName.trim());
      localStorage.setItem('baby_age', calculatedAgeString);
      localStorage.setItem('toddler_age', calculatedAgeString);
      localStorage.setItem('baby_birthdate', babyBirthDate);
      localStorage.setItem('baby_ai_instructions', aiInstructions.trim());

      // Save all dietary, religious, foods to avoid, allergies, and feeding preferences
      localStorage.setItem('baby_diet_type', dietType);
      localStorage.setItem('baby_religious_cultural', JSON.stringify(religiousCultural));
      localStorage.setItem('baby_other_religious_preference', otherReligiousPreference.trim());
      localStorage.setItem('baby_custom_restrictions', customRestrictions.trim());
      localStorage.setItem('baby_foods_to_avoid', JSON.stringify(foodsToAvoid));
      localStorage.setItem('baby_other_foods_to_avoid', otherFoodsToAvoid.trim());
      localStorage.setItem('baby_allergies_intolerances', JSON.stringify(allergiesIntolerances));
      localStorage.setItem('baby_other_allergy_intolerance', otherAllergyIntolerance.trim());
      localStorage.setItem('baby_feeding_styles', JSON.stringify(feedingStyles));

      // Maintain legacy keys for backward-compatibility
      const combinedAllergies = [
        ...allergiesIntolerances,
        ...(otherAllergyIntolerance.trim() ? [otherAllergyIntolerance.trim()] : [])
      ];
      localStorage.setItem('baby_allergies', JSON.stringify(combinedAllergies));
      localStorage.setItem('baby_dietary_preferences', JSON.stringify([dietType, ...religiousCultural, ...feedingStyles]));

      localStorage.setItem('baby_vaccinations', JSON.stringify(vaccinations));
      localStorage.setItem('baby_vaccinations_v2', JSON.stringify(vaccinations));
      localStorage.setItem('baby_vaccinations_v3', JSON.stringify(vaccinations));
      localStorage.setItem('comprehensive_baby_vaccines_v2', JSON.stringify(vaccinations));
      localStorage.setItem('needs_profile_setup', 'false');
      localStorage.setItem('profile_completed', 'true');

      if (user && db) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const updatePayload = {
            parentName: parentName.trim(),
            babyName: babyName.trim(),
            childName: babyName.trim(),
            toddlerName: babyName.trim(),
            babyAge: calculatedAgeString,
            toddlerAge: calculatedAgeString,
            babyBirthDate: babyBirthDate,
            aiInstructions: aiInstructions.trim(),
            dietType,
            religiousCultural,
            otherReligiousPreference: otherReligiousPreference.trim(),
            customRestrictions: customRestrictions.trim(),
            foodsToAvoid,
            otherFoodsToAvoid: otherFoodsToAvoid.trim(),
            allergiesIntolerances,
            otherAllergyIntolerance: otherAllergyIntolerance.trim(),
            feedingStyles,
            allergies: combinedAllergies,
            dietaryPreferences: [dietType, ...religiousCultural, ...feedingStyles],
            vaccinations,
            vaccinationsVersion: 'v2',
            needsProfileSetup: false,
            profileCompleted: true,
            updatedAt: serverTimestamp(),
          };

          await updateDoc(userRef, updatePayload);
          await refreshProfile();
        } catch (dbErr: any) {
          console.warn("Firestore update notice:", dbErr);
        }
      }

      playSound('glass');
      setSuccess("Baby profile & health settings saved! Redirecting to Home AI Assistant...");

      // Scroll window to top
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Navigate to Home Page
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        navigate('/?tab=home');
      }, 400);
    } catch (err: any) {
      setError(err.message || "Failed to save baby profile");
      setLoading(false);
    }
  };

  const filteredVaccines = vaccinations.filter(v => {
    if (vaccineFilter === 'Completed') return v.status === 'Completed';
    if (vaccineFilter === 'Upcoming') return v.status !== 'Completed';
    return true;
  });

  const completedCount = vaccinations.filter(v => v.status === 'Completed').length;

  return (
    <div className="space-y-8 text-left">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-[#0e1626] border border-emerald-400/30 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/10">
              <Baby className="w-8 h-8" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PEDIATRIC HEALTH & NUTRITION RECORD
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 text-balance">
                Dietary Preferences &amp; Child Health
              </h1>
            </div>
          </div>

          <button
            onClick={handleSaveAll}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>Save Baby Profile</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 pt-1 border-t border-white/10 font-normal leading-relaxed text-balance">
          Configure your child’s name, age, allergen sensitivities, dietary rules, and immunization history to personalize all AI food scans and pediatric advice.
        </p>
      </div>

      {/* Quick Section Jump Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-[#0c1424]/90 border border-white/10 shadow-lg">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Jump to section:</span>
        <button
          type="button"
          onClick={() => {
            playSound('click');
            document.getElementById('section-diet-type')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Utensils className="w-3.5 h-3.5 text-emerald-400" />
          <span>Diet Type</span>
        </button>
        <button
          type="button"
          onClick={() => {
            playSound('click');
            document.getElementById('section-religious-cultural')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>🛕 Religious</span>
        </button>
        <button
          type="button"
          onClick={() => {
            playSound('click');
            document.getElementById('section-foods-to-avoid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-200 hover:text-rose-300 border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>🚫 Foods to Avoid</span>
        </button>
        <button
          type="button"
          onClick={() => {
            playSound('click');
            document.getElementById('section-allergies')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>⚠️ Allergies</span>
        </button>
        <button
          type="button"
          onClick={() => {
            playSound('click');
            document.getElementById('section-feeding-style')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>👶 Feeding Style</span>
        </button>
        <button
          type="button"
          onClick={() => {
            playSound('click');
            document.getElementById('section-ai-instructions')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 hover:bg-indigo-500/20 text-slate-200 hover:text-indigo-300 border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Bot className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI Notes</span>
        </button>
        <button
          type="button"
          onClick={() => {
            playSound('click');
            document.getElementById('section-trackers')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Syringe className="w-3.5 h-3.5 text-cyan-300" />
          <span>Trackers</span>
        </button>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Core Diet Type Section */}
      <div id="section-diet-type" className="p-6 sm:p-8 rounded-3xl bg-[#111c30]/90 border border-emerald-500/30 shadow-xl space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-4 text-emerald-400">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0 shadow-md">
              <Utensils className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">1. Core Diet Type</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Select your toddler’s primary nutritional framework.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-300 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
              Current: {dietType}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Single Choice
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {DIET_TYPES.map(type => {
            const isSelected = dietType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => {
                  playSound('pop');
                  setDietType(type);
                }}
                className={`p-5 rounded-2xl text-left border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-500/15 ring-2 ring-emerald-500/30'
                    : 'bg-[#16223a] border-white/10 text-slate-300 hover:border-white/25 hover:text-white'
                }`}
              >
                <div>
                  <span className="text-base font-black block text-white">{type}</span>
                  <span className="text-xs text-slate-400 mt-1.5 block leading-relaxed">
                    {type === 'Vegetarian' && 'Plant-based with dairy, zero meat or eggs'}
                    {type === 'Vegetarian + Eggs' && 'Plant-based & dairy plus eggs (eggetarian)'}
                    {type === 'Non-Vegetarian' && 'Poultry, meat, fish, and eggs included'}
                  </span>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  isSelected
                    ? 'border-emerald-400 bg-emerald-400 text-slate-950'
                    : 'border-white/30 bg-transparent'
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Religious & Cultural Preferences Section */}
      {/* 2. Religious / Cultural Dietary Restrictions Section */}
      <div id="section-religious-cultural" className="p-6 sm:p-8 rounded-3xl bg-[#111c30]/90 border border-cyan-500/30 shadow-xl space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-4 text-cyan-400">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 text-2xl shrink-0 shadow-md">
              🛕
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">2. Religious &amp; Cultural Dietary Customs</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Apply community culinary traditions, spiritual food codes, or faith-based dietary guidelines.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-300 bg-cyan-500/15 px-3 py-1 rounded-full border border-cyan-500/30">
              {religiousCultural.length} selected
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Multi-Select
            </span>
          </div>
        </div>

        {/* Options grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Select standard religious preferences
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {RELIGIOUS_CULTURAL_OPTIONS.map(opt => {
              const isSelected = religiousCultural.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleReligiousCultural(opt)}
                  className={`p-3.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/10'
                      : 'bg-[#16223a] border-white/10 text-slate-300 hover:border-white/25 hover:text-white'
                  }`}
                >
                  <span className="font-extrabold">{opt}</span>
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? 'bg-cyan-400 border-cyan-400 text-slate-950'
                      : 'border-white/30 bg-transparent'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom text inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Other religious preference <span className="text-slate-500 text-[10px] normal-case">(Press Enter for line break)</span>
            </label>
            <textarea
              rows={2}
              value={otherReligiousPreference}
              onChange={(e) => setOtherReligiousPreference(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                }
              }}
              placeholder="e.g. Buddhist, Hindu fasting customs, Jain dietary rules...&#10;Press Enter for new line"
              className="w-full bg-[#16223a] border border-white/15 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/10 placeholder:text-slate-500 font-medium resize-y"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Custom restrictions & traditions <span className="text-slate-500 text-[10px] normal-case">(Press Enter for line break)</span>
            </label>
            <textarea
              rows={2}
              value={customRestrictions}
              onChange={(e) => setCustomRestrictions(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                }
              }}
              placeholder="e.g. No beef, seasonal fasting, special family traditions...&#10;Press Enter for new line"
              className="w-full bg-[#16223a] border border-white/15 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/10 placeholder:text-slate-500 font-medium resize-y"
            />
          </div>
        </div>
      </div>

      {/* 3. Foods to Avoid Section */}
      <div id="section-foods-to-avoid" className="p-6 sm:p-8 rounded-3xl bg-[#111c30]/90 border border-rose-500/30 shadow-xl space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-4 text-rose-400">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300 text-2xl shrink-0 shadow-md">
              🚫
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">3. Specific Foods &amp; Ingredients to Avoid</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Ingredients your child should never receive in AI meal suggestions, recipes, or solid food guides.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-rose-300 bg-rose-500/15 px-3 py-1 rounded-full border border-rose-500/30">
              {foodsToAvoid.length} selected
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Multi-Select
            </span>
          </div>
        </div>

        {/* Options grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Click to toggle ingredients to exclude
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {FOODS_TO_AVOID_OPTIONS.map(opt => {
              const isSelected = foodsToAvoid.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleFoodToAvoid(opt)}
                  className={`p-3.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-rose-500/20 border-rose-400 text-rose-200 shadow-md shadow-rose-500/10'
                      : 'bg-[#16223a] border-white/10 text-slate-300 hover:border-white/25 hover:text-white'
                  }`}
                >
                  <span className="font-extrabold">{opt}</span>
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? 'bg-rose-400 border-rose-400 text-slate-950'
                      : 'border-white/30 bg-transparent'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom text input */}
        <div className="space-y-1.5 pt-2 border-t border-white/5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Other foods to avoid <span className="text-slate-500 text-[10px] normal-case">(Press Enter for line break)</span>
          </label>
          <textarea
            rows={2}
            value={otherFoodsToAvoid}
            onChange={(e) => setOtherFoodsToAvoid(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.stopPropagation();
              }
            }}
            placeholder="e.g. Preservatives, refined sugar, high-sodium snacks, specific seeds...&#10;Press Enter for new line"
            className="w-full bg-[#16223a] border border-white/15 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/10 placeholder:text-slate-500 font-medium resize-y"
          />
        </div>
      </div>

      {/* 4. Allergies & Intolerances Section */}
      <div id="section-allergies" className="p-6 sm:p-8 rounded-3xl bg-[#111c30]/90 border border-amber-500/30 shadow-xl space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-4 text-amber-400">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 text-2xl shrink-0 shadow-md">
              ⚠️
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">4. Allergies &amp; Intolerances</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Critical allergies flagged across all FoodLens scans, AI recipes, and pediatrician consults.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-300 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
              {allergiesIntolerances.length} flagged
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Crucial Safety
            </span>
          </div>
        </div>

        {/* Options grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Common Allergen Flags
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ALLERGIES_INTOLERANCES_OPTIONS.map(opt => {
              const isSelected = allergiesIntolerances.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleAllergyIntolerance(opt)}
                  className={`p-3.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md shadow-amber-500/10'
                      : 'bg-[#16223a] border-white/10 text-slate-300 hover:border-white/25 hover:text-white'
                  }`}
                >
                  <span className="font-extrabold">⚠️ {opt}</span>
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? 'bg-amber-400 border-amber-400 text-slate-950'
                      : 'border-white/30 bg-transparent'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom text input */}
        <div className="space-y-1.5 pt-2 border-t border-white/5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Other allergy / intolerance <span className="text-slate-500 text-[10px] normal-case">(Press Enter for line break)</span>
          </label>
          <textarea
            rows={2}
            value={otherAllergyIntolerance}
            onChange={(e) => setOtherAllergyIntolerance(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.stopPropagation();
              }
            }}
            placeholder="e.g. Mustard, kiwi, strawberry, sulfites, corn, specific seeds...&#10;Press Enter for new line"
            className="w-full bg-[#16223a] border border-white/15 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/10 placeholder:text-slate-500 font-medium resize-y"
          />
        </div>
      </div>

      {/* 5. Feeding Style Section */}
      <div id="section-feeding-style" className="p-6 sm:p-8 rounded-3xl bg-[#111c30]/90 border border-purple-500/30 shadow-xl space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-4 text-purple-400">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 text-2xl shrink-0 shadow-md">
              👶
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">5. Feeding Style &amp; Weaning Methodology</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                How your child is introduced to solid foods and practices self-feeding independence.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-300 bg-purple-500/15 px-3 py-1 rounded-full border border-purple-500/30">
              {feedingStyles.length} selected
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Multi-Select
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Choose all feeding methods you practice
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEEDING_STYLE_OPTIONS.map(opt => {
              const isSelected = feedingStyles.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleFeedingStyle(opt)}
                  className={`p-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-purple-500/20 border-purple-400 text-purple-200 shadow-md shadow-purple-500/10'
                      : 'bg-[#16223a] border-white/10 text-slate-300 hover:border-white/25 hover:text-white'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-black">{opt}</span>
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? 'bg-purple-400 border-purple-400 text-slate-950'
                      : 'border-white/30 bg-transparent'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pediatric Immunization & Developmental Milestone Trackers (Unified Single Section) */}
      <div id="section-trackers" className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c182c] via-[#0e1b33] to-[#0a1324] border border-cyan-400/30 shadow-2xl space-y-6 text-left">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/10 shrink-0">
              <Syringe className="w-7 h-7 text-cyan-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Pediatric Vaccine & Milestone Trackers</h2>
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-sm">
                  100% Free · 42 Vaccines
                </span>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold">
                  0 - 18 Years
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
                Complete childhood immunization schedule and developmental milestone records from birth to 18 years (IAP, FSSAI &amp; ICMR standards). Track clinic dates, batch numbers, first steps, speech leaps, emotional growth, and print official reports.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => {
              playSound('glass');
              navigate('/?tab=vaccine');
            }}
            className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-sm tracking-wide shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer transform hover:scale-[1.02] active:scale-95"
          >
            <Syringe className="w-4 h-4 text-cyan-200" />
            <span>Open Dedicated Vaccine Tracker</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </button>

          <button
            type="button"
            onClick={() => {
              playSound('glass');
              navigate('/?tab=milestones');
            }}
            className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer transform hover:scale-[1.02] active:scale-95"
          >
            <Award className="w-4 h-4 text-slate-950" />
            <span>Add / Update Milestone Tracker</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </button>
        </div>
      </div>

      {/* Instructions for Tricky Toddler AI Assistant */}
      <div id="section-ai-instructions" className="p-6 sm:p-8 rounded-3xl bg-[#111c30]/90 border border-indigo-500/30 shadow-xl space-y-6 text-left">
        <div className="flex items-center gap-4 pb-4 border-b border-white/10 text-indigo-400">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0 shadow-md">
            <Bot className="w-7 h-7" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight whitespace-nowrap">
              Instructions for Tricky Toddler AI Assistant
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Custom prompt &amp; behavioral context saved directly for Ashwath's pediatric profile.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Custom Prompt for Ashwath Profile (AI Guidance Context)
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playSound('pop');
                  setAiInstructions(ASHWATH_DEFAULT_PROMPT);
                  localStorage.setItem('baby_ai_instructions', ASHWATH_DEFAULT_PROMPT);
                  setSuccess("Loaded Ashwath's complete default prompt!");
                  setTimeout(() => setSuccess(null), 3000);
                }}
                className="text-xs font-bold text-indigo-300 hover:text-white bg-indigo-500/15 hover:bg-indigo-500/25 px-3 py-1.5 rounded-lg border border-indigo-500/30 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Reset to Ashwath Prompt</span>
              </button>
            </div>
          </div>

          {/* Quick Prompt Modifier Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">Quick Prompt Additions:</span>
            {[
              { label: 'Low Salt & Zero Refined Sugar', text: ' Strict low salt and zero refined sugar in all meal advice.' },
              { label: 'Teething & Soothing Cues', text: ' Experiences teething discomfort and needs gentle soothing cues.' },
              { label: 'Vegetarian Home-Cooked Only', text: ' Strictly vegetarian, home-cooked Indian meals only.' },
              { label: 'Sensory Play Focus', text: ' Highly responsive to sensory play and outdoor exploration.' }
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  playSound('click');
                  const newText = aiInstructions.includes(chip.text.trim()) 
                    ? aiInstructions 
                    : `${aiInstructions.trim()} ${chip.text}`.trim();
                  setAiInstructions(newText);
                  localStorage.setItem('baby_ai_instructions', newText);
                }}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/5 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-200 border border-white/10 transition-all cursor-pointer"
              >
                + {chip.label}
              </button>
            ))}
          </div>

          <textarea
            rows={5}
            value={aiInstructions}
            onChange={(e) => {
              setAiInstructions(e.target.value);
              localStorage.setItem('baby_ai_instructions', e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.stopPropagation();
              }
            }}
            placeholder="Enter custom prompt instructions for Ashwath..."
            className="w-full bg-[#16223a] border border-indigo-500/40 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-500 font-normal leading-relaxed resize-y"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <span className="text-[11px] text-slate-400">
              The Tricky Toddler AI Assistant will incorporate this custom prompt across all routine checks, advice, and responses for Ashwath.
            </span>
            <button
              type="button"
              onClick={async () => {
                playSound('glass');
                localStorage.setItem('baby_ai_instructions', aiInstructions);
                if (user && db) {
                  try {
                    await updateDoc(doc(db, 'users', user.uid), {
                      aiInstructions: aiInstructions,
                      updatedAt: serverTimestamp()
                    });
                  } catch (e) {
                    console.warn("Saved to localStorage:", e);
                  }
                }
                setSuccess("Custom prompt saved successfully for Ashwath's profile!");
                setTimeout(() => setSuccess(null), 3500);
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Custom Prompt for Ashwath</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Button at Bottom */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
        <p className="text-xs text-slate-400 text-center sm:text-left">
          All settings immediately synchronize with Tricky Toddler AI, FoodLens, and your pediatric profile.
        </p>
        <button
          onClick={handleSaveAll}
          disabled={loading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-base shadow-2xl shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>Save Baby Profile & Health Settings</span>
        </button>
      </div>

    </div>
  );
};
