import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '../lib/LanguageContext';
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Languages, 
  Baby, 
  Calendar,
  MapPin,
  Building2,
  Sparkles,
  Mail,
  Heart,
  Check
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import { INDIAN_CITIES_BY_STATE } from '../data/indianCitiesData';

export const INDIAN_STATES_AND_UTS = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi (NCT)",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

export const TODDLER_AGE_OPTIONS = [
  "0 - 6 Months (Infant / Exclusive Milk)",
  "6 - 9 Months (Stage 1 Weaning & Purees)",
  "9 - 12 Months (Stage 2 Mashed Foods)",
  "12 - 18 Months (1 - 1.5 Years Toddler)",
  "18 - 24 Months (1.5 - 2 Years Active Toddler)",
  "2 - 3 Years (Curious Explorer)",
  "3 - 5 Years (Preschooler)",
  "5 - 10 Years (School-Age Growth & Activity)",
  "10 - 15 Years (Pre-Teens & Sports)",
  "15 - 18 Years (Adolescent & Young Adult)",
  "Custom Age (Type exact age)..."
];

export const ProfilePage: React.FC = () => {
  const { user, profile, refreshProfile, needsProfileSetup } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isMandatorySetup = Boolean(searchParams.get('mandatory') === 'true' || needsProfileSetup);

  // Redirect old tabs cleanly to their dedicated top-level pages
  const tabParam = searchParams.get('tab');
  useEffect(() => {
    if (tabParam === 'plans' || tabParam === 'premium') {
      navigate('/plans', { replace: true });
    } else if (tabParam === 'baby' || tabParam === 'dietary' || tabParam === 'health') {
      navigate('/dietary-preferences', { replace: true });
    }
  }, [tabParam, navigate]);

  // Active guest account profile for Lashmi & Ashwath
  const isGuestAccount = Boolean(
    !user?.email ||
    user?.email === 'lashmi@gmail.com' ||
    user?.email === 'lashm@gmail.com' ||
    user?.isAnonymous ||
    profile?.email === 'lashmi@gmail.com' ||
    profile?.email === 'lashm@gmail.com' ||
    profile?.parentName === 'Lashmi' ||
    user?.uid === 'guest_instant_user'
  );

  // Complete profile fields state for Ashwath & Lashmi guest account
  const [firstName, setFirstName] = useState<string>(() => {
    return profile?.firstName || profile?.parentName || profile?.name || localStorage.getItem('parent_name') || 'Lashmi';
  });
  const [lastName, setLastName] = useState<string>(() => {
    return profile?.lastName || 'Ashwath';
  });
  const [contactEmail, setContactEmail] = useState<string>(() => {
    const saved = localStorage.getItem('user_contact_email');
    if (saved && saved !== 'rlashmi086@gmail.com') return saved;
    if (profile?.contactEmail && profile?.contactEmail !== 'rlashmi086@gmail.com') return profile.contactEmail;
    if (profile?.email && profile?.email !== 'rlashmi086@gmail.com' && !profile.email.includes('securepass.internal')) return profile.email;
    if (user?.email && user.email !== 'rlashmi086@gmail.com' && !user.email.includes('securepass.internal')) return user.email;
    return 'lashm@gmail.com';
  });

  const [indianState, setIndianState] = useState<string>(() => {
    return profile?.indianState || localStorage.getItem('user_indian_state') || 'Karnataka';
  });

  const [city, setCity] = useState<string>(() => {
    return profile?.city || localStorage.getItem('user_city') || 'Bengaluru (Bangalore)';
  });
  const [isCustomCity, setIsCustomCity] = useState<boolean>(false);
  const [customCityName, setCustomCityName] = useState<string>('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Settings saving states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [allowDirectMessages, setAllowDirectMessages] = useState<boolean>(profile?.allowDirectMessages ?? true);
  const [parentName, setParentName] = useState<string>(() => profile?.parentName || localStorage.getItem('parent_name') || 'Lashmi');

  // Child 1 Profile State (Primary / Default: Ashwath)
  const [child1Name, setChild1Name] = useState<string>(() => {
    return profile?.child1?.name || profile?.babyName || profile?.childName || localStorage.getItem('child_1_name') || localStorage.getItem('baby_name') || 'Ashwath';
  });
  const [child1DOB, setChild1DOB] = useState<string>(() => {
    return profile?.child1?.birthDate || profile?.babyBirthDate || localStorage.getItem('child_1_dob') || localStorage.getItem('baby_birth_date') || '2024-04-12';
  });
  const [child1Gender, setChild1Gender] = useState<string>(() => {
    return profile?.child1?.gender || localStorage.getItem('child_1_gender') || 'Boy';
  });
  const [child1BloodGroup, setChild1BloodGroup] = useState<string>(() => {
    return profile?.child1?.bloodGroup || profile?.bloodGroup || localStorage.getItem('child_1_blood') || 'O+';
  });
  const [child1DietaryNotes, setChild1DietaryNotes] = useState<string>(() => {
    return profile?.child1?.dietaryNotes || localStorage.getItem('child_1_dietary_notes') || 'Vegetarian, low salt, zero refined sugar';
  });

  // Child 2 Profile State (Second child profile)
  const [child2Name, setChild2Name] = useState<string>(() => {
    return profile?.child2?.name || localStorage.getItem('child_2_name') || 'Ananya';
  });
  const [child2DOB, setChild2DOB] = useState<string>(() => {
    return profile?.child2?.birthDate || localStorage.getItem('child_2_dob') || '2026-01-15';
  });
  const [child2Gender, setChild2Gender] = useState<string>(() => {
    return profile?.child2?.gender || localStorage.getItem('child_2_gender') || 'Girl';
  });
  const [child2BloodGroup, setChild2BloodGroup] = useState<string>(() => {
    return profile?.child2?.bloodGroup || localStorage.getItem('child_2_blood') || 'B+';
  });
  const [child2DietaryNotes, setChild2DietaryNotes] = useState<string>(() => {
    return profile?.child2?.dietaryNotes || localStorage.getItem('child_2_dietary_notes') || 'Mild lactose sensitivity, puree weaning stage';
  });

  // Active Child Index (1 or 2) - determines which child's profile is synced to health scans & guidance
  const [selectedChildTab, setSelectedChildTab] = useState<1 | 2>(1);
  const [activeChildIndex, setActiveChildIndex] = useState<1 | 2>(() => {
    const saved = localStorage.getItem('active_child_index');
    return (saved === '2' || profile?.activeChildIndex === 2) ? 2 : 1;
  });

  // Auto-calculated age helper
  const calculateAge = (dobString: string): string => {
    if (!dobString) return '';
    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) return '';
    const now = new Date();
    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    if (years === 0 && months === 0) {
      const days = Math.floor((now.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24));
      return `${Math.max(1, days)} days`;
    }
    if (years === 0) return `${months} month${months > 1 ? 's' : ''}`;
    return `${years} yr${years > 1 ? 's' : ''} ${months} mo${months > 1 ? 's' : ''}`;
  };

  // Sync profile fields state when data loads
  useEffect(() => {
    if (profile) {
      if (profile.firstName || profile.parentName || profile.name) {
        setFirstName(profile.firstName || profile.parentName || profile.name);
      } else {
        setFirstName('Lashmi');
      }

      if (profile.lastName !== undefined) {
        setLastName(profile.lastName || 'Ashwath');
      } else {
        setLastName('Ashwath');
      }

      if (profile.contactEmail && profile.contactEmail !== 'rlashmi086@gmail.com') {
        setContactEmail(profile.contactEmail);
        localStorage.setItem('user_contact_email', profile.contactEmail);
      } else if (profile.email && profile.email !== 'rlashmi086@gmail.com' && !profile.email.includes('securepass.internal')) {
        setContactEmail(profile.email);
        localStorage.setItem('user_contact_email', profile.email);
      } else {
        setContactEmail('lashm@gmail.com');
        localStorage.setItem('user_contact_email', 'lashm@gmail.com');
      }

      if (profile.child1) {
        if (profile.child1.name) setChild1Name(profile.child1.name);
        if (profile.child1.birthDate) setChild1DOB(profile.child1.birthDate);
        if (profile.child1.gender) setChild1Gender(profile.child1.gender);
        if (profile.child1.bloodGroup) setChild1BloodGroup(profile.child1.bloodGroup);
        if (profile.child1.dietaryNotes) setChild1DietaryNotes(profile.child1.dietaryNotes);
      }
      if (profile.child2) {
        if (profile.child2.name) setChild2Name(profile.child2.name);
        if (profile.child2.birthDate) setChild2DOB(profile.child2.birthDate);
        if (profile.child2.gender) setChild2Gender(profile.child2.gender);
        if (profile.child2.bloodGroup) setChild2BloodGroup(profile.child2.bloodGroup);
        if (profile.child2.dietaryNotes) setChild2DietaryNotes(profile.child2.dietaryNotes);
      }
      if (profile.activeChildIndex) {
        setActiveChildIndex(profile.activeChildIndex as 1 | 2);
      }

      if (profile.indianState) {
        setIndianState(profile.indianState);
        localStorage.setItem('user_indian_state', profile.indianState);
      } else {
        setIndianState('Karnataka');
        localStorage.setItem('user_indian_state', 'Karnataka');
      }

      if (profile.city) {
        setCity(profile.city);
        localStorage.setItem('user_city', profile.city);
        if (profile.indianState && INDIAN_CITIES_BY_STATE[profile.indianState]) {
          const list = INDIAN_CITIES_BY_STATE[profile.indianState];
          if (!list.includes(profile.city) && profile.city !== '') {
            setIsCustomCity(true);
            setCustomCityName(profile.city);
          } else {
            setIsCustomCity(false);
          }
        }
      } else {
        setCity('Bengaluru (Bangalore)');
        localStorage.setItem('user_city', 'Bengaluru (Bangalore)');
        setIsCustomCity(false);
        setCustomCityName('');
      }
    }
  }, [profile, isGuestAccount]);

  const activePlan = profile?.plan || localStorage.getItem('user_plan') || 'free';

  // Validation computations
  const effectiveCity = isCustomCity ? customCityName.trim() : city.trim();

  const isNameValid = Boolean(firstName.trim());
  const isStateValid = Boolean(indianState.trim());
  const isCityValid = Boolean(effectiveCity);
  const isLanguageValid = Boolean(language && language.trim());

  // Child info from profile or Dietary Preferences
  const savedChildName = profile?.childName || profile?.toddlerName || profile?.babyName || localStorage.getItem('baby_name') || 'Ashwath';
  const savedChildAge = profile?.toddlerAge || profile?.babyAge || localStorage.getItem('baby_age') || '2 - 3 Years (Curious Explorer)';

  // Available cities computed for selected Indian state
  const availableCities = (indianState && INDIAN_CITIES_BY_STATE[indianState]) 
    ? [...INDIAN_CITIES_BY_STATE[indianState]].sort((a, b) => a.localeCompare(b)) 
    : [];

  const isAllMandatoryComplete = isNameValid && isStateValid && isCityValid && isLanguageValid;

  const handleUpdateProfile = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!user || !db) return;

    // Strict validation: Required fields on General profile
    const missing: string[] = [];
    if (!firstName.trim()) missing.push("Parent / First Name");
    if (!indianState.trim()) missing.push("Indian State / UT");
    if (!effectiveCity) missing.push("City / District");
    if (!language || !language.trim()) missing.push("Language Preference");

    if (missing.length > 0) {
      playSound('glass');
      setError(`Please fill in all required fields to ensure accurate localization and care: ${missing.join(', ')}`);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const activeName = activeChildIndex === 1 ? child1Name.trim() : child2Name.trim();
      const activeDOB = activeChildIndex === 1 ? child1DOB : child2DOB;
      const activeAge = calculateAge(activeDOB) || savedChildAge;
      const activeGender = activeChildIndex === 1 ? child1Gender : child2Gender;
      const activeBlood = activeChildIndex === 1 ? child1BloodGroup : child2BloodGroup;
      const activeDiet = activeChildIndex === 1 ? child1DietaryNotes.trim() : child2DietaryNotes.trim();

      const userRef = doc(db, 'users', user.uid);
      const updateData: any = {
        username: profile?.username || firstName.trim() || 'User',
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        parentName: parentName.trim(),
        contactEmail: contactEmail.trim(),
        email: contactEmail.trim() || user.email,
        child1: {
          name: child1Name.trim(),
          birthDate: child1DOB,
          gender: child1Gender,
          bloodGroup: child1BloodGroup,
          dietaryNotes: child1DietaryNotes.trim(),
        },
        child2: {
          name: child2Name.trim(),
          birthDate: child2DOB,
          gender: child2Gender,
          bloodGroup: child2BloodGroup,
          dietaryNotes: child2DietaryNotes.trim(),
        },
        activeChildIndex,
        childName: activeName,
        babyName: activeName,
        toddlerName: activeName,
        babyBirthDate: activeDOB,
        bloodGroup: activeBlood,
        childGender: activeGender,
        toddlerAge: activeAge,
        babyAge: activeAge,
        dietaryNotes: activeDiet,
        needsProfileSetup: false,
        profileCompleted: true,
        ...(indianState ? { indianState: indianState.trim() } : {}),
        ...(effectiveCity ? { city: effectiveCity } : {}),
        language,
        allowDirectMessages,
        updatedAt: serverTimestamp(),
      };

      await setDoc(userRef, updateData, { merge: true });

      localStorage.setItem('needs_profile_setup', 'false');
      localStorage.setItem('profile_completed', 'true');
      localStorage.setItem('parent_name', firstName.trim());
      if (contactEmail.trim()) localStorage.setItem('user_contact_email', contactEmail.trim());

      localStorage.setItem('child_1_name', child1Name.trim());
      localStorage.setItem('child_1_dob', child1DOB);
      localStorage.setItem('child_1_gender', child1Gender);
      localStorage.setItem('child_1_blood', child1BloodGroup);
      localStorage.setItem('child_1_dietary_notes', child1DietaryNotes.trim());

      localStorage.setItem('child_2_name', child2Name.trim());
      localStorage.setItem('child_2_dob', child2DOB);
      localStorage.setItem('child_2_gender', child2Gender);
      localStorage.setItem('child_2_blood', child2BloodGroup);
      localStorage.setItem('child_2_dietary_notes', child2DietaryNotes.trim());

      localStorage.setItem('active_child_index', String(activeChildIndex));
      localStorage.setItem('baby_name', activeName);
      localStorage.setItem('child_name', activeName);
      localStorage.setItem('toddler_name', activeName);
      localStorage.setItem('baby_birth_date', activeDOB);
      localStorage.setItem('baby_age', activeAge);
      localStorage.setItem('toddler_age', activeAge);

      if (indianState) localStorage.setItem('user_indian_state', indianState.trim());
      if (effectiveCity) localStorage.setItem('user_city', effectiveCity);
      localStorage.setItem('user_language', language);
      localStorage.setItem('user_language_selected', language);

      await refreshProfile();
      playSound('pop');
      setSuccess("Profile settings saved successfully! All features and tabs are now unlocked.");
      
      // Auto-navigate to home so user can explore all tabs freely
      setTimeout(() => {
        setSuccess(null);
        navigate('/?tab=home', { replace: true });
        window.dispatchEvent(new CustomEvent('nav-reset-to-home'));
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
      handleFirestoreError(err, 'update', `users/${user.uid}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStateSelect = async (stateVal: string) => {
    playSound('glass');
    setIndianState(stateVal);
    localStorage.setItem('user_indian_state', stateVal);

    // If previously selected city does not belong to the newly selected state, reset city
    const newCities = INDIAN_CITIES_BY_STATE[stateVal] || [];
    if (!isCustomCity && city && !newCities.includes(city)) {
      setCity('');
      localStorage.removeItem('user_city');
    }

    if (user && db) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          indianState: stateVal,
          updatedAt: serverTimestamp(),
        });
        await refreshProfile();
      } catch (err) {
        console.warn("Saved state locally", err);
      }
    }
    setSuccess(`Indian State updated to ${stateVal}. Please select your city below.`);
    setTimeout(() => setSuccess(null), 3500);
  };

  const handleCitySelect = async (cityVal: string, isCustom = false) => {
    if (!cityVal) return;
    playSound('glass');
    setCity(cityVal);
    setIsCustomCity(isCustom);
    if (isCustom) {
      setCustomCityName(cityVal);
    }
    localStorage.setItem('user_city', cityVal);
    localStorage.setItem('user_is_custom_city', isCustom ? 'true' : 'false');

    if (user && db) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          city: cityVal,
          isCustomCity: isCustom,
          updatedAt: serverTimestamp(),
        });
        await refreshProfile();
      } catch (err) {
        console.warn("Saved city locally", err);
      }
    }
    setSuccess(`City updated to ${cityVal}`);
    setTimeout(() => setSuccess(null), 3500);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !auth.currentUser) return;
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      
      setSuccess("Password changed successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      if (err.code === 'auth/wrong-password') {
        setError("Current password is incorrect");
      } else {
        setError(err.message || "Failed to change password");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans"
    >
      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {isMandatorySetup && (
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-md">
                One-Time Mandatory Setup
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight text-balance">
            Account &amp; Regional Profile Settings
          </h1>
          <p className="text-white/50 text-sm mt-1 max-w-3xl leading-relaxed text-balance">
            Manage your personal credentials, Indian regional state &amp; city localization, and family languages.
          </p>
        </div>


        {/* Top Save Changes Button Removed */}
      </div>

      {/* Mandatory Profile Setup Welcome Banner */}
      {isMandatorySetup && (
        <div className="mb-8 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-500/25 via-indigo-600/25 to-purple-600/25 border-2 border-amber-400/50 shadow-2xl backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/40 shrink-0 shadow-inner">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1.5 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-mono">
                  Welcome to Tricky Toddlers
                </span>
                <span className="text-xs text-amber-200 font-semibold">• One-Time Mandatory Profile Setup</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Please complete and save your profile details below
              </h2>
              <p className="text-sm text-slate-200 leading-relaxed max-w-3xl">
                To tailor pediatrician insights, solid food guides, and developmental milestone tracking for your family, please verify your details below and click <strong className="text-white font-bold">"Save Changes"</strong>. Once saved, all features, navigation tabs, and health tools will be freely unlocked for you!
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8 text-left">
        {/* Row 1: Profile Information and Security side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Column 1 & 2: General & Child Information Card */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 sm:p-8 lg:p-10 rounded-3xl bg-[#0e1626]/90 border border-white/10 shadow-xl h-full">
              <div className="flex items-center gap-4 mb-6 text-indigo-400 pb-4 border-b border-white/10">
                <div className="p-3.5 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 shrink-0 shadow-md">
                  <User className="w-7 h-7 text-indigo-300" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">{t('generalInfo') || 'General Profile Information'}</h2>
                  <p className="text-xs sm:text-sm text-white/60 mt-1">Fields marked with <span className="text-rose-400 font-bold">*</span> are required for localization &amp; account setup.</p>
                </div>
              </div>

              <div className="mb-6 p-4 bg-white/[0.02] rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{t('username') || 'Username'}</label>
                  <p className="font-mono text-lg text-white/90">@{profile?.username || firstName || 'Lashmi'}</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* Parent Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                        {t('firstName') || 'Parent / First Name'} <span className="text-rose-400">*</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter parent first name"
                      className={`w-full bg-[#16223a] border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-4 transition-all placeholder:text-white/20 ${
                        !isNameValid ? 'border-rose-500/40 focus:border-rose-400 focus:ring-rose-500/10' : 'border-white/15 focus:border-indigo-400 focus:ring-indigo-500/10'
                      }`}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                        {t('lastName') || 'Last Name'}
                      </label>
                      <span className="text-[10px] text-white/40">Optional</span>
                    </div>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Ashwath"
                      className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all placeholder:text-white/20"
                    />
                  </div>
                </div>

                {/* Parent Name */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                      Parent Name
                    </label>
                  </div>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => {
                      setParentName(e.target.value);
                      localStorage.setItem('parent_name', e.target.value);
                    }}
                    placeholder="Enter parent name"
                    className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all placeholder:text-white/20"
                  />
                </div>


                {/* Mail ID Collection Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-semibold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Email Address / Mail ID</span>
                    </label>
                    <span className="text-[10px] text-indigo-400 font-semibold">For Reminders &amp; Doctor Consults</span>
                  </div>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => {
                      setContactEmail(e.target.value);
                      localStorage.setItem('user_contact_email', e.target.value);
                    }}
                    placeholder="lashm@gmail.com"
                    className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all placeholder:text-white/20"
                  />
                  <p className="text-[11px] text-white/40 ml-1">
                    Used for live webinar calendar invites, pediatric consultation appointment confirmations, and session updates.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Column 3: Security Section Card (Side by Side with Profile) */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sm:p-8 rounded-3xl bg-[#0e1626]/90 border border-white/10 shadow-xl h-full">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10 text-indigo-400">
                <div className="p-3.5 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 shrink-0 shadow-md">
                  <Lock className="w-7 h-7 text-indigo-300" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{t('security') || 'Security & Access'}</h2>
                  <p className="text-xs sm:text-sm text-white/60 mt-1">Update your account password</p>
                </div>
              </div>
              
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider ml-1">{t('currentPassword') || 'Current Password'}</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
                <div className="pt-2 border-t border-white/5 space-y-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider ml-1">{t('newPassword') || 'New Password'}</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider ml-1">{t('confirmNewPassword') || 'Confirm New Password'}</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>

                <div className="pt-4 border-t border-white/5 space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowDirectMessages}
                      onChange={(e) => setAllowDirectMessages(e.target.checked)}
                      className="w-5 h-5 rounded border-indigo-500/30 bg-indigo-500/10 text-indigo-500 focus:ring-indigo-500/20"
                    />
                    <span className="text-sm font-medium text-white">Allow other parents to send messages directly</span>
                  </label>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 text-white/80 border border-white/15 rounded-xl font-bold hover:bg-white/10 hover:text-white transition-all active:scale-95 disabled:opacity-50 mt-2 cursor-pointer"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{t('changePassword') || 'Change Password'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Row 2: Parent & Baby Identification (Two Child Profiles) */}
        <div id="section-identification" className="w-full">
          <div className="glass-card p-6 sm:p-8 lg:p-10 rounded-3xl bg-[#0e1626]/90 border border-emerald-500/30 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 text-emerald-400">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 shrink-0 shadow-md">
                  <Baby className="w-7 h-7 text-emerald-300" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-2.5">
                    <span>Parent &amp; Baby Identification</span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      2 Child Profiles Supported
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-white/60 mt-1">
                    Manage identification, date of birth, and health profiles for both children. Switch the active profile anytime.
                  </p>
                </div>
              </div>

              {/* Child Switcher Tabs */}
              <div className="flex items-center gap-2 bg-[#121d33] p-1.5 rounded-2xl border border-white/10 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => { playSound('pop'); setSelectedChildTab(1); }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                    selectedChildTab === 1 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Baby className="w-4 h-4" />
                  <span>Child 1: {child1Name || 'Ashwath'}</span>
                  {activeChildIndex === 1 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 text-slate-950 font-extrabold uppercase">Active</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => { playSound('pop'); setSelectedChildTab(2); }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                    selectedChildTab === 2 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Baby className="w-4 h-4" />
                  <span>Child 2: {child2Name || 'Child 2'}</span>
                  {activeChildIndex === 2 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 text-slate-950 font-extrabold uppercase">Active</span>
                  )}
                </button>
              </div>
            </div>

            {/* Active Status & Switcher Banner */}
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-3.5 h-3.5 rounded-full ${activeChildIndex === selectedChildTab ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                <span className="text-xs sm:text-sm font-medium text-slate-200">
                  Currently editing: <strong className="text-white font-bold">Child {selectedChildTab} ({selectedChildTab === 1 ? child1Name : child2Name})</strong>
                  {activeChildIndex === selectedChildTab ? ' (Currently Active in FoodLens & Health Tools ✓)' : ' (Inactive)'}
                </span>
              </div>
              {activeChildIndex !== selectedChildTab && (
                <button
                  type="button"
                  onClick={() => {
                    playSound('pop');
                    setActiveChildIndex(selectedChildTab);
                    const chosenName = selectedChildTab === 1 ? child1Name : child2Name;
                    const chosenDOB = selectedChildTab === 1 ? child1DOB : child2DOB;
                    localStorage.setItem('active_child_index', String(selectedChildTab));
                    localStorage.setItem('baby_name', chosenName);
                    localStorage.setItem('child_name', chosenName);
                    localStorage.setItem('toddler_name', chosenName);
                    localStorage.setItem('baby_birth_date', chosenDOB);
                    setSuccess(`Set ${chosenName} as the active child profile!`);
                    setTimeout(() => setSuccess(null), 3000);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer self-start sm:self-auto"
                >
                  Set as Active Child Profile
                </button>
              )}
            </div>

            {/* Child Tab 1 Form Fields */}
            {selectedChildTab === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Baby className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Child 1 Name</span> <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={child1Name}
                    onChange={(e) => setChild1Name(e.target.value)}
                    placeholder="e.g. Ashwath"
                    className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-500 font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Date of Birth (DOB)</span> <span className="text-rose-400">*</span>
                    </span>
                    {calculateAge(child1DOB) && (
                      <span className="text-[10px] font-bold text-emerald-300">{calculateAge(child1DOB)}</span>
                    )}
                  </label>
                  <input
                    type="date"
                    required
                    value={child1DOB}
                    onChange={(e) => setChild1DOB(e.target.value)}
                    className="w-full bg-[#16223a] border border-emerald-400/40 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 font-medium cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Gender
                  </label>
                  <select
                    value={child1Gender}
                    onChange={(e) => setChild1Gender(e.target.value)}
                    className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 font-medium cursor-pointer"
                  >
                    <option value="Boy">Boy</option>
                    <option value="Girl">Girl</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Blood Group
                  </label>
                  <select
                    value={child1BloodGroup}
                    onChange={(e) => setChild1BloodGroup(e.target.value)}
                    className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 font-medium cursor-pointer"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Not Known'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Dietary Sensitivities &amp; Allergies
                  </label>
                  <input
                    type="text"
                    value={child1DietaryNotes}
                    onChange={(e) => setChild1DietaryNotes(e.target.value)}
                    placeholder="e.g. Vegetarian, low salt, zero refined sugar"
                    className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-500 font-medium"
                  />
                </div>
              </div>
            )}

            {/* Child Tab 2 Form Fields */}
            {selectedChildTab === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Baby className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Child 2 Name</span> <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={child2Name}
                    onChange={(e) => setChild2Name(e.target.value)}
                    placeholder="e.g. Ananya"
                    className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-500 font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Date of Birth (DOB)</span> <span className="text-rose-400">*</span>
                    </span>
                    {calculateAge(child2DOB) && (
                      <span className="text-[10px] font-bold text-emerald-300">{calculateAge(child2DOB)}</span>
                    )}
                  </label>
                  <input
                    type="date"
                    required
                    value={child2DOB}
                    onChange={(e) => setChild2DOB(e.target.value)}
                    className="w-full bg-[#16223a] border border-emerald-400/40 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 font-medium cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Gender
                  </label>
                  <select
                    value={child2Gender}
                    onChange={(e) => setChild2Gender(e.target.value)}
                    className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 font-medium cursor-pointer"
                  >
                    <option value="Girl">Girl</option>
                    <option value="Boy">Boy</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Blood Group
                  </label>
                  <select
                    value={child2BloodGroup}
                    onChange={(e) => setChild2BloodGroup(e.target.value)}
                    className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 font-medium cursor-pointer"
                  >
                    {['B+', 'B-', 'O+', 'O-', 'A+', 'A-', 'AB+', 'AB-', 'Not Known'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Dietary Sensitivities &amp; Allergies
                  </label>
                  <input
                    type="text"
                    value={child2DietaryNotes}
                    onChange={(e) => setChild2DietaryNotes(e.target.value)}
                    placeholder="e.g. Mild lactose sensitivity, puree weaning stage"
                    className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-500 font-medium"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Location: Indian State & City (Full Width) */}
        <div className="w-full">
          <div className="glass-card p-6 sm:p-8 lg:p-10 rounded-3xl bg-[#0e1626]/90 border border-white/10 shadow-xl">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10 text-indigo-400">
              <div className="p-3.5 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 shrink-0 shadow-md">
                <MapPin className="w-7 h-7 text-indigo-300" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>Location: Indian State &amp; City</span>
                  <span className="text-rose-400">*</span>
                </h2>
                <p className="text-xs sm:text-sm text-white/60 mt-1">Used for regional pediatric care centers, doctors, and localized health advice</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Indian State / UT */}
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Indian State / UT</span> <span className="text-rose-400">*</span>
                  </label>
                </div>
                <select
                  id="profile-state-select"
                  value={indianState}
                  onChange={(e) => {
                    const newState = e.target.value;
                    setIndianState(newState);
                    localStorage.setItem('user_indian_state', newState);
                    const cities = INDIAN_CITIES_BY_STATE[newState] || [];
                    if (cities.length > 0) {
                      setCity(cities[0]);
                      setIsCustomCity(false);
                      localStorage.setItem('user_city', cities[0]);
                    } else {
                      setCity('');
                      setIsCustomCity(false);
                      localStorage.setItem('user_city', '');
                    }
                  }}
                  className={`w-full bg-[#111c30] border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-4 transition-all cursor-pointer ${
                    !isStateValid ? 'border-rose-500/40 focus:border-rose-400 focus:ring-rose-500/10' : 'border-white/15 focus:border-indigo-400 focus:ring-indigo-500/10'
                  }`}
                >
                  <option value="" disabled>-- Select Indian State / UT --</option>
                  {INDIAN_STATES_AND_UTS.map((st) => (
                    <option key={st} value={st} className="bg-[#0e1726] text-white py-1">
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* City / District */}
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>City / District</span> <span className="text-rose-400">*</span>
                  </label>
                </div>
                <select
                  id="profile-city-select"
                  disabled={!indianState}
                  value={isCustomCity ? 'Custom City (Type name)...' : city}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'Custom City (Type name)...') {
                      setIsCustomCity(true);
                    } else {
                      setIsCustomCity(false);
                      setCity(val);
                      localStorage.setItem('user_city', val);
                    }
                  }}
                  className={`w-full bg-[#111c30] border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-4 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    !isCityValid ? 'border-rose-500/40 focus:border-rose-400 focus:ring-rose-500/10' : 'border-white/15 focus:border-indigo-400 focus:ring-indigo-500/10'
                  }`}
                >
                  <option value="" disabled>
                    {!indianState ? '-- Select State first --' : '-- Select City / District --'}
                  </option>
                  {availableCities.map((ct) => (
                    <option key={ct} value={ct} className="bg-[#0e1726] text-white py-1">
                      {ct}
                    </option>
                  ))}
                  <option value="Custom City (Type name)..." className="bg-[#0e1726] text-indigo-300 font-semibold py-1">
                    Custom City (Type name)...
                  </option>
                </select>

                {isCustomCity && (
                  <div className="pt-2">
                    <input
                      type="text"
                      value={customCityName}
                      onChange={(e) => {
                        setCustomCityName(e.target.value);
                        localStorage.setItem('user_city', e.target.value.trim());
                      }}
                      placeholder="e.g. Mangaluru, Belagavi, Hubballi..."
                      className="w-full bg-[#16223a] border border-indigo-400/40 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-white/20"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Select App Language (Full Width) */}
        <div className="w-full">
          <div className="glass-card p-6 sm:p-8 lg:p-10 rounded-3xl bg-[#0e1626]/90 border border-white/10 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-4 text-indigo-400">
                <div className="p-3.5 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 shrink-0 shadow-md">
                  <Languages className="w-7 h-7 text-indigo-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-2">
                      <span>Choose Indian Language</span>
                      <span className="text-rose-400">*</span>
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-white/60 mt-1">Tricky Toddlers supports 12 Indian regional languages for family-friendly guidance</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 self-start sm:self-auto border ${
                language 
                  ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300' 
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              }`}>
                {SUPPORTED_LANGUAGES.find(l => l.code === language)?.localName || 'English'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={async () => {
                      playSound('glass');
                      await setLanguage(lang.code);
                      localStorage.setItem('user_language_selected', lang.code);
                      setSuccess(t('languageSaved') || `Language preference updated to ${lang.name}!`);
                      setTimeout(() => setSuccess(null), 3000);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/30 shadow-md shadow-indigo-500/10'
                        : 'bg-white/[0.02] border-white/10 text-white/70 hover:border-white/20 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="font-bold text-sm truncate">{lang.localName}</div>
                    <div className="text-[10px] opacity-60 uppercase tracking-wider font-semibold font-mono mt-0.5 truncate">{lang.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 4: Bottom Save Changes & Dietary Preferences Card (Full Width) */}
        <div className="w-full">
          <div className="glass-card p-6 sm:p-8 rounded-3xl bg-[#0e1626]/90 border border-white/10 shadow-xl flex flex-col xl:flex-row xl:items-center justify-between gap-5">
            {/* Right side: Validation Status & Save Changes button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            </div>
          </div>
        </div>

        {/* Row 5: Notification Settings (Full Width) */}
        <div className="w-full">
          <div className="glass-card p-6 sm:p-8 rounded-3xl bg-[#0e1626]/90 border border-white/10 shadow-xl">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10 text-indigo-400">
              <div className="p-3.5 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 shrink-0 shadow-md">
                <Mail className="w-7 h-7 text-indigo-300" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Notification Settings</h2>
                <p className="text-xs sm:text-sm text-white/60 mt-1">Customize your alert preferences</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { id: 'milestone', label: 'Milestone Alerts', description: 'Instant notification when baby reaches key developmental milestones.' },
                { id: 'vaccine', label: 'Vaccine Alerts', description: 'Instant reminder ahead of vaccine schedules.' },
                { id: 'nutrition', label: 'Nutrition Summary', description: 'Weekly digest of your child\'s nutritional intake and AI insights.' },
                { id: 'updates', label: 'App Updates', description: 'Stay informed about new app features and community announcements.' },
                { id: 'community', label: 'Community Pings', description: 'Get notified when you are part of an ongoing community conversation.' },
                { id: 'mentions', label: 'Direct Mentions', description: 'Instant alert when someone tags you in a discussion.' },
              ].map(option => (
                <div key={option.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-bold text-white">{option.label}</span>
                  </div>
                  <p className="text-xs text-white/50 mb-3">{option.description}</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-indigo-500/30 bg-indigo-500/10 text-indigo-500 focus:ring-indigo-500/20" />
                      <span className="text-xs text-white/70">Email</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-indigo-500/30 bg-indigo-500/10 text-indigo-500 focus:ring-indigo-500/20" />
                      <span className="text-xs text-white/70">Mobile App</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={handleUpdateProfile}
                disabled={loading}
                className="bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50 cursor-pointer w-full sm:w-auto"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{t('saveChanges') || 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Notifications */}
      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-8 right-8 flex items-center gap-3 px-8 py-5 rounded-[2rem] shadow-2xl z-50 border backdrop-blur-3xl ${
              error ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
            }`}
          >
            {error ? <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" /> : <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />}
            <span className="font-bold text-sm tracking-tight">{error || success}</span>
            <button 
              onClick={() => { setError(null); setSuccess(null); }}
              className="ml-6 p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white/60 hover:text-white"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
