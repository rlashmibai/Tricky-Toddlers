import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { isPremiumUser, shouldLockPremiumFeature } from './premiumUtils';

export interface ChildProfile {
  id: 1 | 2;
  name: string;
  age: string;
  birthDate: string;
  gender: string;
  bloodGroup: string;
  dietaryNotes?: string;
}

export const formatChildAge = (dobString?: string | null, fallback?: string): string => {
  if (!dobString) return fallback || '14 Months';
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return fallback || '14 Months';
  const now = new Date();
  let totalMonths = (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());
  if (now.getDate() < dob.getDate()) {
    totalMonths--;
  }
  if (totalMonths <= 0) return 'Newborn (< 1 mo)';
  if (totalMonths < 12) return `${totalMonths} Month${totalMonths > 1 ? 's' : ''}`;
  const years = Math.floor(totalMonths / 12);
  const remMonths = totalMonths % 12;
  if (remMonths === 0) return `${years} Year${years > 1 ? 's' : ''}`;
  return `${years} Year${years > 1 ? 's' : ''} ${remMonths} Month${remMonths > 1 ? 's' : ''}`;
};

export type AuthMode = 'landing' | 'guest' | 'account';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  needsProfileSetup: boolean;
  isSessionActive: boolean;
  setSessionActive: (active: boolean) => void;
  authMode: AuthMode;
  isGuestDemo: boolean;
  isAccountUser: boolean;
  refreshProfile: () => Promise<void>;
  loginAsGuest: (activateUI?: boolean) => Promise<User | null>;
  activeChildIndex: 1 | 2;
  childProfiles: ChildProfile[];
  activeChild: ChildProfile;
  switchActiveChild: (index: 1 | 2) => Promise<void>;
  child2NotApplicable: boolean;
  setChild2NotApplicable: (notApplicable: boolean) => Promise<void>;
  isPremium: boolean;
  isPremiumLocked: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const clearDemoLocalStorageForAccount = () => {
  if (typeof window === 'undefined') return;
  const demoValues = ['lashmi', 'parent', 'ashwath', 'child 1', 'ananya', 'child 2', 'lashm@gmail.com', 'lashmi@gmail.com'];
  const checkAndClear = (key: string) => {
    const val = (localStorage.getItem(key) || '').trim().toLowerCase();
    if (demoValues.includes(val)) {
      localStorage.removeItem(key);
    }
  };
  ['parent_name', 'baby_name', 'child_name', 'toddler_name', 'child_1_name', 'child_2_name', 'user_contact_email'].forEach(checkAndClear);
  localStorage.removeItem('child_1_dob');
  localStorage.removeItem('child_2_dob');
  localStorage.removeItem('baby_birthdate');
  localStorage.removeItem('baby_birth_date');
  localStorage.removeItem('baby_age');
  localStorage.removeItem('toddler_age');
  localStorage.removeItem('child_1_dietary_config');
  localStorage.removeItem('child_2_dietary_config');
};

export const normalizeGuestParentName = (val?: string | null): string => {
  const trimmed = (val || '').trim();
  if (!trimmed || trimmed.toLowerCase() === 'lashmi' || trimmed.toLowerCase() === 'lakshmi') {
    return 'Parent';
  }
  return trimmed;
};

export const normalizeGuestChild1Name = (val?: string | null): string => {
  const trimmed = (val || '').trim();
  if (!trimmed || trimmed.toLowerCase() === 'ashwath' || trimmed.toLowerCase() === 'aanya') {
    return 'Child 1';
  }
  return trimmed;
};

export const normalizeGuestChild2Name = (val?: string | null): string => {
  const trimmed = (val || '').trim();
  if (!trimmed || trimmed.toLowerCase() === 'ananya') {
    return 'Child 2';
  }
  return trimmed;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSessionActive, setIsSessionActiveState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('tt_session_active') === 'true';
    }
    return false;
  });

  const setSessionActive = (active: boolean) => {
    setIsSessionActiveState(active);
    if (typeof window !== 'undefined') {
      if (active) {
        sessionStorage.setItem('tt_session_active', 'true');
      } else {
        sessionStorage.removeItem('tt_session_active');
      }
    }
  };

  const [child2NotApplicable, setChild2NotApplicableState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('child_2_not_applicable') === 'true';
    }
    return false;
  });

  const [activeChildIndex, setActiveChildIndexState] = useState<1 | 2>(() => {
    if (typeof window !== 'undefined') {
      const isNA = localStorage.getItem('child_2_not_applicable') === 'true';
      if (isNA) return 1;
      const saved = localStorage.getItem('active_child_index');
      if (saved === '2') return 2;
    }
    return 1;
  });

  const [user, setUser] = useState<User | null>(() => {
    const cachedUid = typeof window !== 'undefined' ? localStorage.getItem('cached_user_uid') : null;
    const isAccountMode = typeof window !== 'undefined' && localStorage.getItem('tt_auth_mode') === 'account';
    let cachedEmail = typeof window !== 'undefined' ? localStorage.getItem('cached_user_email') : null;
    if (!isAccountMode && (!cachedEmail || cachedEmail === 'guest_instant@securepass.internal' || cachedEmail.includes('securepass.internal') || cachedEmail === 'guest@instant.internal')) {
      cachedEmail = 'lashmi@gmail.com';
      if (typeof window !== 'undefined') localStorage.setItem('cached_user_email', 'lashmi@gmail.com');
    }
    return {
      uid: cachedUid || 'guest_instant_user',
      email: cachedEmail,
      isAnonymous: !isAccountMode,
    } as unknown as User;
  });

  const [profile, setProfile] = useState<any | null>(() => {
    const isAccountMode = typeof window !== 'undefined' && localStorage.getItem('tt_auth_mode') === 'account';
    const savedActiveIndex = (typeof window !== 'undefined' && localStorage.getItem('active_child_index')) === '2' ? 2 : 1;
    if (isAccountMode) {
      const savedParent = (typeof window !== 'undefined' && localStorage.getItem('parent_name')) || '';
      const savedBaby = (typeof window !== 'undefined' && localStorage.getItem('baby_name')) || '';
      const savedAge = (typeof window !== 'undefined' && localStorage.getItem('baby_age')) || '';
      return {
        username: savedParent,
        name: savedParent,
        firstName: savedParent,
        parentName: savedParent,
        babyName: savedBaby,
        childName: savedBaby,
        toddlerName: savedBaby,
        babyAge: savedAge,
        childAge: savedAge,
        activeChildIndex: savedActiveIndex,
        language: (typeof window !== 'undefined' && localStorage.getItem('user_language')) || 'en',
      };
    }
    const rawParent = typeof window !== 'undefined' ? localStorage.getItem('parent_name') : null;
    const parentName = normalizeGuestParentName(rawParent);
    if (typeof window !== 'undefined' && rawParent !== parentName) {
      localStorage.setItem('parent_name', parentName);
    }
    const rawBaby = typeof window !== 'undefined' ? localStorage.getItem('baby_name') : null;
    const babyName = savedActiveIndex === 2
      ? normalizeGuestChild2Name(rawBaby)
      : normalizeGuestChild1Name(rawBaby);
    if (typeof window !== 'undefined') {
      localStorage.setItem('baby_name', babyName);
      localStorage.setItem('child_name', babyName);
      localStorage.setItem('toddler_name', babyName);
      localStorage.setItem('child_1_name', normalizeGuestChild1Name(localStorage.getItem('child_1_name')));
      localStorage.setItem('child_2_name', normalizeGuestChild2Name(localStorage.getItem('child_2_name')));
    }
    const babyAge = (typeof window !== 'undefined' && localStorage.getItem('baby_age')) || (savedActiveIndex === 2 ? '3 Months' : '2 Years 6 Months');
    return {
      username: parentName,
      name: parentName,
      firstName: parentName,
      parentName,
      babyName,
      childName: babyName,
      toddlerName: babyName,
      babyAge,
      childAge: babyAge,
      activeChildIndex: savedActiveIndex,
      language: (typeof window !== 'undefined' && localStorage.getItem('user_language')) || 'en',
    };
  });

  const [loading, setLoading] = useState(false);

  const fetchProfile = async (uid: string) => {
    const isAccountMode = typeof window !== 'undefined' && localStorage.getItem('tt_auth_mode') === 'account';
    if (!db) {
      if (isAccountMode) {
        setProfile({
          language: 'en',
        });
      } else {
        setProfile({
          username: 'Parent',
          name: 'Parent',
          firstName: 'Parent',
          parentName: 'Parent',
          babyName: 'Child 1',
          childName: 'Child 1',
          language: 'en',
        });
      }
      return;
    }
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const isDemo = !isAccountMode && (uid === 'guest_instant_user' || data.email === 'lashmi@gmail.com' || data.email === 'lashm@gmail.com' || data.username === 'Lashmi' || data.username === 'Parent');

        // Normalize Guest Demo profile names from legacy Lashmi/Ashwath/Ananya to Parent/Child 1/Child 2
        if (isDemo && !data.needsProfileSetup) {
          const normParent = normalizeGuestParentName(data.parentName || data.firstName || data.name || data.username);
          data.parentName = normParent;
          data.firstName = normParent;
          data.name = normParent;
          data.username = normParent;
          if (!data.lastName || data.lastName.toLowerCase() === 'ashwath') {
            data.lastName = '';
          }
          const normC1 = normalizeGuestChild1Name(data.child1?.name || data.babyName || data.childName);
          const normC2 = normalizeGuestChild2Name(data.child2?.name);
          data.child1 = {
            ...(data.child1 || {}),
            name: normC1,
            birthDate: data.child1?.birthDate || data.babyBirthDate || '2024-04-12',
            gender: data.child1?.gender || 'Boy',
            bloodGroup: data.child1?.bloodGroup || 'O+',
            dietaryNotes: data.child1?.dietaryNotes || 'Vegetarian, low salt, zero refined sugar',
          };
          data.child2 = {
            ...(data.child2 || {}),
            name: normC2,
            birthDate: data.child2?.birthDate || '2026-01-15',
            gender: data.child2?.gender || 'Girl',
            bloodGroup: data.child2?.bloodGroup || 'B+',
            dietaryNotes: data.child2?.dietaryNotes || 'Mild lactose sensitivity, puree weaning stage',
          };
          const activeName = data.activeChildIndex === 2 ? normC2 : normC1;
          data.babyName = activeName;
          data.childName = activeName;
          data.toddlerName = activeName;
          if (typeof data.aiInstructions === 'string') {
            data.aiInstructions = data.aiInstructions.replace(/\bAshwath\b/g, 'Child 1').replace(/\bAnanya\b/g, 'Child 2');
          }
          if (typeof window !== 'undefined') {
            localStorage.setItem('parent_name', normParent);
            localStorage.setItem('child_1_name', normC1);
            localStorage.setItem('child_2_name', normC2);
            localStorage.setItem('baby_name', activeName);
            localStorage.setItem('child_name', activeName);
            localStorage.setItem('toddler_name', activeName);
          }
        } else if (isAccountMode) {
          // Sync localStorage with the signed-in user's actual Firestore settings
          if (typeof window !== 'undefined') {
            const pName = data.parentName || data.firstName || data.name || data.username || '';
            if (pName) localStorage.setItem('parent_name', pName);
            const c1Name = data.child1?.name || data.babyName || data.childName || '';
            if (c1Name) {
              localStorage.setItem('child_1_name', c1Name);
              localStorage.setItem('baby_name', data.activeChildIndex === 2 && data.child2?.name ? data.child2.name : c1Name);
              localStorage.setItem('child_name', data.activeChildIndex === 2 && data.child2?.name ? data.child2.name : c1Name);
              localStorage.setItem('toddler_name', data.activeChildIndex === 2 && data.child2?.name ? data.child2.name : c1Name);
            }
            if (data.child1?.birthDate || data.babyBirthDate) {
              localStorage.setItem('child_1_dob', data.child1?.birthDate || data.babyBirthDate);
            }
            if (data.child2?.name) {
              localStorage.setItem('child_2_name', data.child2.name);
            } else {
              localStorage.removeItem('child_2_name');
            }
            if (data.child2?.birthDate) {
              localStorage.setItem('child_2_dob', data.child2.birthDate);
            }
            if (data.indianState) localStorage.setItem('user_indian_state', data.indianState);
            if (data.city) localStorage.setItem('user_city', data.city);
            if (data.contactEmail) localStorage.setItem('user_contact_email', data.contactEmail);
          }
        }
        if (data.child2NotApplicable !== undefined) {
          const isNA = Boolean(data.child2NotApplicable);
          setChild2NotApplicableState(isNA);
          if (typeof window !== 'undefined') localStorage.setItem('child_2_not_applicable', String(isNA));
        }
        if (data.activeChildIndex === 1 || data.activeChildIndex === 2) {
          setActiveChildIndexState(data.activeChildIndex);
          if (typeof window !== 'undefined') localStorage.setItem('active_child_index', String(data.activeChildIndex));
        }
        setProfile(data);
      } else if (isAccountMode) {
        // Signed-in user without a document yet -> require profile setup
        const emptyAccountProfile = {
          uid,
          plan: 'free',
          needsProfileSetup: true,
          profileCompleted: false,
          language: 'en',
        };
        setProfile(emptyAccountProfile);
      } else {
        // Create complete guest profile for Parent, Child 1 & Child 2 with updated settings
        const defaultProfile = {
          username: 'Parent',
          name: 'Parent',
          firstName: 'Parent',
          lastName: '',
          parentName: 'Parent',
          contactEmail: 'lashm@gmail.com',
          email: 'lashm@gmail.com',
          babyName: 'Child 1',
          childName: 'Child 1',
          babyBirthDate: '2024-04-12',
          child1: {
            name: 'Child 1',
            birthDate: '2024-04-12',
            gender: 'Boy',
            bloodGroup: 'O+',
            dietaryNotes: 'Vegetarian, low salt, zero refined sugar',
          },
          child2: {
            name: 'Child 2',
            birthDate: '2026-01-15',
            gender: 'Girl',
            bloodGroup: 'B+',
            dietaryNotes: 'Mild lactose sensitivity, puree weaning stage',
          },
          indianState: 'Karnataka',
          city: 'Bengaluru (Bangalore)',
          language: 'en',
          dietType: 'Vegetarian',
          religiousCultural: ['No specific restrictions'],
          foodsToAvoid: ['No chemicals', 'No artificial sweeteners', 'No food coloring / artificial colors'],
          allergiesIntolerances: [],
          feedingStyles: ['Baby-led weaning (BLW)', 'Finger foods'],
          aiInstructions: 'Child 1 is a healthy, active toddler who loves sensory play and outdoor exploration. Prefers nutritious, home-cooked vegetarian meals (khichdi, curd rice, steamed vegetables, and fruit slices) with low salt, zero refined sugar, and no artificial additives. Sensitive to loud noises, experiences teething discomfort, and thrives on a consistent afternoon nap and soothing bedtime routine. Please keep all advice gentle, actionable, and age-appropriate.',
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        };
        try {
          await setDoc(docRef, defaultProfile, { merge: true });
        } catch (setErr) {
          console.warn("Using offline guest profile:", setErr);
        }
        setProfile(defaultProfile);
      }
    } catch (error) {
      console.warn("Profile fetch fallback engaged:", error);
      if (isAccountMode) {
        setProfile((prev: any) => prev || { language: 'en' });
      } else {
        setProfile({
          username: 'Parent',
          name: 'Parent',
          firstName: 'Parent',
          lastName: '',
          parentName: 'Parent',
          contactEmail: 'lashm@gmail.com',
          email: 'lashm@gmail.com',
          babyName: 'Child 1',
          childName: 'Child 1',
          babyBirthDate: '2024-04-12',
          child1: {
            name: 'Child 1',
            birthDate: '2024-04-12',
            gender: 'Boy',
            bloodGroup: 'O+',
            dietaryNotes: 'Vegetarian, low salt, zero refined sugar',
          },
          child2: {
            name: 'Child 2',
            birthDate: '2026-01-15',
            gender: 'Girl',
            bloodGroup: 'B+',
            dietaryNotes: 'Mild lactose sensitivity, puree weaning stage',
          },
          indianState: 'Karnataka',
          city: 'Bengaluru (Bangalore)',
          language: 'en',
          dietType: 'Vegetarian',
          religiousCultural: ['No specific restrictions'],
          foodsToAvoid: ['No chemicals', 'No artificial sweeteners', 'No food coloring / artificial colors'],
          allergiesIntolerances: [],
          feedingStyles: ['Baby-led weaning (BLW)', 'Finger foods'],
          aiInstructions: 'Child 1 is a healthy, active toddler who loves sensory play and outdoor exploration. Prefers nutritious, home-cooked vegetarian meals (khichdi, curd rice, steamed vegetables, and fruit slices) with low salt, zero refined sugar, and no artificial additives. Sensitive to loud noises, experiences teething discomfort, and thrives on a consistent afternoon nap and soothing bedtime routine. Please keep all advice gentle, actionable, and age-appropriate.',
        });
      }
    }
  };

  const loginAsGuest = async (activateUI: boolean = true): Promise<User | null> => {
    if (activateUI) {
      setSessionActive(true);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('tt_auth_mode', 'guest');
    }
    if (!auth) return null;
    try {
      localStorage.removeItem('user_logged_out');
      localStorage.setItem('parent_name', 'Parent');
      localStorage.setItem('baby_name', 'Child 1');
      localStorage.setItem('child_name', 'Child 1');
      localStorage.setItem('toddler_name', 'Child 1');
      localStorage.setItem('child_1_name', 'Child 1');
      localStorage.setItem('child_1_dob', '2024-04-12');
      localStorage.setItem('child_2_name', 'Child 2');
      localStorage.setItem('child_2_dob', '2026-01-15');
      const defaultGuestEmail = 'lashmi@gmail.com';
      const defaultGuestPass = 'Guest@Pass987!';

      // If already signed in as the background guest account, reuse immediately without network round-trip
      if (auth.currentUser && auth.currentUser.email === defaultGuestEmail) {
        setUser(auth.currentUser);
        return auth.currentUser;
      }

      let loggedInUser: User | null = null;

      try {
        const cred = await signInWithEmailAndPassword(auth, defaultGuestEmail, defaultGuestPass);
        loggedInUser = cred.user;
      } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          try {
            const newCred = await createUserWithEmailAndPassword(auth, defaultGuestEmail, defaultGuestPass);
            loggedInUser = newCred.user;
          } catch (createErr: any) {
            // If email already in use or error, generate unique guest
            const rand = Math.floor(1000 + Math.random() * 9000);
            const uniqueEmail = `guest_${Date.now()}_${rand}@securepass.internal`;
            const uniquePass = `GuestPass#${rand}!`;
            const uniqueCred = await createUserWithEmailAndPassword(auth, uniqueEmail, uniquePass);
            loggedInUser = uniqueCred.user;
          }
        } else {
          const rand = Math.floor(1000 + Math.random() * 9000);
          const uniqueEmail = `guest_${Date.now()}_${rand}@securepass.internal`;
          const uniquePass = `GuestPass#${rand}!`;
          const uniqueCred = await createUserWithEmailAndPassword(auth, uniqueEmail, uniquePass);
          loggedInUser = uniqueCred.user;
        }
      }

      if (loggedInUser) {
        setUser(loggedInUser);
        const guestData = {
          username: 'Parent',
          name: 'Parent',
          firstName: 'Parent',
          lastName: '',
          parentName: 'Parent',
          contactEmail: 'lashm@gmail.com',
          email: 'lashm@gmail.com',
          babyName: 'Child 1',
          childName: 'Child 1',
          babyBirthDate: '2024-04-12',
          activeChildIndex: 1,
          child2NotApplicable: false,
          child1: {
            name: 'Child 1',
            birthDate: '2024-04-12',
            gender: 'Boy',
            bloodGroup: 'O+',
            dietaryNotes: 'Vegetarian, low salt, zero refined sugar',
          },
          child2: {
            name: 'Child 2',
            birthDate: '2026-01-15',
            gender: 'Girl',
            bloodGroup: 'B+',
            dietaryNotes: 'Mild lactose sensitivity, puree weaning stage',
          },
          indianState: 'Karnataka',
          city: 'Bengaluru (Bangalore)',
          language: 'en',
          dietType: 'Vegetarian',
          religiousCultural: ['No specific restrictions'],
          foodsToAvoid: ['No chemicals', 'No artificial sweeteners', 'No food coloring / artificial colors'],
          allergiesIntolerances: [],
          feedingStyles: ['Baby-led weaning (BLW)', 'Finger foods'],
          aiInstructions: 'Child 1 is a healthy, active toddler who loves sensory play and outdoor exploration. Prefers nutritious, home-cooked vegetarian meals (khichdi, curd rice, steamed vegetables, and fruit slices) with low salt, zero refined sugar, and no artificial additives. Sensitive to loud noises, experiences teething discomfort, and thrives on a consistent afternoon nap and soothing bedtime routine. Please keep all advice gentle, actionable, and age-appropriate.',
          updatedAt: serverTimestamp(),
        };
        setChild2NotApplicableState(false);
        if (typeof window !== 'undefined') {
          localStorage.setItem('child_2_not_applicable', 'false');
          localStorage.setItem('child_1_name', 'Child 1');
          localStorage.setItem('child_1_dob', '2024-04-12');
          localStorage.setItem('child_2_name', 'Child 2');
          localStorage.setItem('child_2_dob', '2026-01-15');
        }
        if (db) {
          try {
            await setDoc(doc(db, 'users', loggedInUser.uid), guestData, { merge: true });
          } catch (fsErr) {
            console.warn("Guest profile save fallback:", fsErr);
          }
        }
        setProfile(guestData);
      }
      return loggedInUser;
    } catch (finalErr) {
      console.error("Guest login failed:", finalErr);
      // Emergency session user so app never hangs
      const fallbackUser = {
        uid: 'guest_instant_user',
        email: 'lashmi@gmail.com',
        isAnonymous: true,
      } as unknown as User;
      localStorage.setItem('cached_user_email', 'lashmi@gmail.com');
      setUser(fallbackUser);
      localStorage.setItem('parent_name', 'Parent');
      localStorage.setItem('baby_name', 'Child 1');
      localStorage.setItem('child_1_name', 'Child 1');
      localStorage.setItem('child_2_name', 'Child 2');
      setChild2NotApplicableState(false);
      localStorage.setItem('child_2_not_applicable', 'false');
      setProfile({
        username: 'Parent',
        name: 'Parent',
        firstName: 'Parent',
        lastName: '',
        parentName: 'Parent',
        contactEmail: 'lashm@gmail.com',
        email: 'lashm@gmail.com',
        babyName: 'Child 1',
        childName: 'Child 1',
        babyBirthDate: '2024-04-12',
        activeChildIndex: 1,
        child2NotApplicable: false,
        child1: {
          name: 'Child 1',
          birthDate: '2024-04-12',
          gender: 'Boy',
          bloodGroup: 'O+',
          dietaryNotes: 'Vegetarian, low salt, zero refined sugar',
        },
        child2: {
          name: 'Child 2',
          birthDate: '2026-01-15',
          gender: 'Girl',
          bloodGroup: 'B+',
          dietaryNotes: 'Mild lactose sensitivity, puree weaning stage',
        },
        indianState: 'Karnataka',
        city: 'Bengaluru (Bangalore)',
        language: 'en',
        dietType: 'Vegetarian',
        religiousCultural: ['No specific restrictions'],
        foodsToAvoid: ['No chemicals', 'No artificial sweeteners', 'No food coloring / artificial colors'],
        allergiesIntolerances: [],
        feedingStyles: ['Baby-led weaning (BLW)', 'Finger foods'],
        aiInstructions: 'Child 1 is a healthy, active toddler who loves sensory play and outdoor exploration. Prefers nutritious, home-cooked vegetarian meals (khichdi, curd rice, steamed vegetables, and fruit slices) with low salt, zero refined sugar, and no artificial additives. Sensitive to loud noises, experiences teething discomfort, and thrives on a consistent afternoon nap and soothing bedtime routine. Please keep all advice gentle, actionable, and age-appropriate.',
      });
      return fallbackUser;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isAccountMode = typeof window !== 'undefined' && localStorage.getItem('tt_auth_mode') === 'account';
    if (!isAccountMode) {
      // Cache default parent and child names only for guest browsing
      const storedParent = localStorage.getItem('parent_name');
      const normParent = normalizeGuestParentName(storedParent);
      if (storedParent !== normParent) {
        localStorage.setItem('parent_name', normParent);
      }
      const storedBaby = localStorage.getItem('baby_name');
      const savedIdx = localStorage.getItem('active_child_index') === '2' ? 2 : 1;
      const normBaby = savedIdx === 2 ? normalizeGuestChild2Name(storedBaby) : normalizeGuestChild1Name(storedBaby);
      if (storedBaby !== normBaby) {
        localStorage.setItem('baby_name', normBaby);
        localStorage.setItem('child_name', normBaby);
        localStorage.setItem('toddler_name', normBaby);
      }
      localStorage.setItem('child_1_name', normalizeGuestChild1Name(localStorage.getItem('child_1_name')));
      localStorage.setItem('child_2_name', normalizeGuestChild2Name(localStorage.getItem('child_2_name')));
    }
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem('cached_user_uid', currentUser.uid);
        if (currentUser.email) {
          localStorage.setItem('cached_user_email', currentUser.email);
        }
        await fetchProfile(currentUser.uid);
        setLoading(false);
      } else {
        // Maintain a silent background Firebase Auth session so Firestore rules work seamlessly
        // while keeping isSessionActive false on the Landing Page
        await loginAsGuest(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.uid);
    }
  };

  const storedAuthMode = typeof window !== 'undefined' ? localStorage.getItem('tt_auth_mode') : null;
  const isDemoSession = storedAuthMode !== 'account' && (
    storedAuthMode === 'guest' ||
    user?.uid === 'guest_instant_user' ||
    user?.email === 'lashmi@gmail.com' ||
    user?.email === 'lashm@gmail.com' ||
    profile?.username === 'Lashmi' ||
    profile?.username === 'Parent'
  );

  const authMode: AuthMode = !isSessionActive ? 'landing' : (isDemoSession ? 'guest' : 'account');
  const isGuestDemo = authMode === 'guest';
  const isAccountUser = authMode === 'account';

  // Child Profiles computation:
  // - In Guest Demo mode: retain the 1 demo family profile (Parent: Parent, Child 1: Child 1, Child 2: Child 2)
  // - In Signed-In Account mode: strictly use the user's own settings from Profile Settings & Dietary Preferences
  const child1Name = isAccountUser
    ? (profile?.child1?.name || (profile?.activeChildIndex !== 2 ? profile?.babyName : null) || (typeof window !== 'undefined' ? localStorage.getItem('child_1_name') : null) || profile?.childName || profile?.babyName || 'Child 1')
    : normalizeGuestChild1Name(profile?.child1?.name);
  const child1DOB = isAccountUser
    ? (profile?.child1?.birthDate || profile?.babyBirthDate || (typeof window !== 'undefined' ? localStorage.getItem('child_1_dob') : null) || '')
    : (profile?.child1?.birthDate || '2024-04-12');
  const child1Gender = isAccountUser
    ? (profile?.child1?.gender || profile?.childGender || (typeof window !== 'undefined' ? localStorage.getItem('child_1_gender') : null) || 'Boy')
    : (profile?.child1?.gender || 'Boy');
  const child1Blood = isAccountUser
    ? (profile?.child1?.bloodGroup || profile?.bloodGroup || (typeof window !== 'undefined' ? localStorage.getItem('child_1_blood') : null) || 'O+')
    : (profile?.child1?.bloodGroup || 'O+');
  const child1Age = isAccountUser
    ? (child1DOB ? formatChildAge(child1DOB, profile?.babyAge || '1 Year') : (profile?.babyAge || profile?.toddlerAge || '1 Year'))
    : formatChildAge(child1DOB, '2 Years 6 Months');

  const rawChild2NameAccount = profile?.child2?.name || (typeof window !== 'undefined' ? localStorage.getItem('child_2_name') : null) || '';
  const child2Name = isAccountUser
    ? (rawChild2NameAccount.trim() || 'Child 2')
    : normalizeGuestChild2Name(profile?.child2?.name);
  const child2DOB = isAccountUser
    ? (profile?.child2?.birthDate || (typeof window !== 'undefined' ? localStorage.getItem('child_2_dob') : null) || '')
    : (profile?.child2?.birthDate || '2026-01-15');
  const child2Gender = isAccountUser
    ? (profile?.child2?.gender || (typeof window !== 'undefined' ? localStorage.getItem('child_2_gender') : null) || 'Girl')
    : (profile?.child2?.gender || 'Girl');
  const child2Blood = isAccountUser
    ? (profile?.child2?.bloodGroup || (typeof window !== 'undefined' ? localStorage.getItem('child_2_blood') : null) || 'B+')
    : (profile?.child2?.bloodGroup || 'B+');
  const child2Age = isAccountUser
    ? (child2DOB ? formatChildAge(child2DOB, '6 Months') : '6 Months')
    : '3 Months';

  const hasSecondChildInProfile = isAccountUser
    ? (!child2NotApplicable && Boolean(rawChild2NameAccount.trim()))
    : !child2NotApplicable;

  const childProfiles: ChildProfile[] = [
    {
      id: 1,
      name: child1Name,
      age: child1Age,
      birthDate: child1DOB,
      gender: child1Gender,
      bloodGroup: child1Blood,
      dietaryNotes: isAccountUser
        ? (profile?.child1?.dietaryNotes || profile?.dietaryNotes || '')
        : (profile?.child1?.dietaryNotes || 'Vegetarian, low salt, zero refined sugar'),
    },
    ...(hasSecondChildInProfile ? [{
      id: 2 as const,
      name: child2Name,
      age: child2Age,
      birthDate: child2DOB,
      gender: child2Gender,
      bloodGroup: child2Blood,
      dietaryNotes: isAccountUser
        ? (profile?.child2?.dietaryNotes || '')
        : (profile?.child2?.dietaryNotes || 'Mild lactose sensitivity, puree weaning stage'),
    }] : [])
  ];

  const effectiveActiveIndex: 1 | 2 = (hasSecondChildInProfile && (profile?.activeChildIndex === 2 || activeChildIndex === 2)) ? 2 : 1;
  const activeChild: ChildProfile = childProfiles.find(cp => cp.id === effectiveActiveIndex) || childProfiles[0];

  const switchActiveChild = async (newIndex: 1 | 2) => {
    const safeIndex: 1 | 2 = (!hasSecondChildInProfile && newIndex === 2) ? 1 : newIndex;
    setActiveChildIndexState(safeIndex);
    const target = safeIndex === 2 && childProfiles.length > 1 ? childProfiles[1] : childProfiles[0];

    if (typeof window !== 'undefined') {
      localStorage.setItem('active_child_index', String(safeIndex));
      localStorage.setItem('baby_name', target.name);
      localStorage.setItem('child_name', target.name);
      localStorage.setItem('toddler_name', target.name);
      localStorage.setItem('baby_birthdate', target.birthDate);
      localStorage.setItem('baby_birth_date', target.birthDate);
      localStorage.setItem('baby_age', target.age);
      localStorage.setItem('toddler_age', target.age);
      localStorage.setItem('baby_gender', target.gender);
      localStorage.setItem('baby_blood_group', target.bloodGroup);

      // Dispatch custom events for reactive UI updating across tabs and components
      window.dispatchEvent(new CustomEvent('activeChildChanged', { detail: { index: safeIndex, child: target } }));
      window.dispatchEvent(new Event('storage'));
    }

    setProfile((prev: any) => {
      const fallbackParent = isAccountUser ? (prev?.username || '') : 'Parent';
      const base = prev || {
        parentName: fallbackParent,
        username: fallbackParent,
        firstName: fallbackParent,
      };
      return {
        ...base,
        activeChildIndex: safeIndex,
        babyName: target.name,
        childName: target.name,
        toddlerName: target.name,
        babyBirthDate: target.birthDate,
        babyAge: target.age,
        childAge: target.age,
        bloodGroup: target.bloodGroup,
        childGender: target.gender,
      };
    });

    if (user && db) {
      try {
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, {
          activeChildIndex: safeIndex,
          babyName: target.name,
          childName: target.name,
          toddlerName: target.name,
          babyBirthDate: target.birthDate,
          babyAge: target.age,
          childAge: target.age,
          bloodGroup: target.bloodGroup,
          childGender: target.gender,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (err) {
        console.warn("Could not sync activeChildIndex to Firestore:", err);
      }
    }
  };

  const setChild2NotApplicable = async (notApplicable: boolean) => {
    setChild2NotApplicableState(notApplicable);
    const targetChild = childProfiles[0];

    if (typeof window !== 'undefined') {
      localStorage.setItem('child_2_not_applicable', String(notApplicable));
      if (notApplicable) {
        localStorage.setItem('active_child_index', '1');
        setActiveChildIndexState(1);
        localStorage.setItem('baby_name', targetChild.name);
        localStorage.setItem('child_name', targetChild.name);
        localStorage.setItem('toddler_name', targetChild.name);
        localStorage.setItem('baby_birthdate', targetChild.birthDate);
        localStorage.setItem('baby_birth_date', targetChild.birthDate);
        localStorage.setItem('baby_age', targetChild.age);
        localStorage.setItem('toddler_age', targetChild.age);
        localStorage.setItem('baby_gender', targetChild.gender);
        localStorage.setItem('baby_blood_group', targetChild.bloodGroup);
      }
      window.dispatchEvent(new CustomEvent('activeChildChanged', { detail: { child2NotApplicable: notApplicable, child: targetChild } }));
      window.dispatchEvent(new Event('storage'));
    }

    setProfile((prev: any) => ({
      ...prev,
      child2NotApplicable: notApplicable,
      ...(notApplicable ? {
        activeChildIndex: 1,
        babyName: targetChild.name,
        childName: targetChild.name,
        toddlerName: targetChild.name,
        babyBirthDate: targetChild.birthDate,
        babyAge: targetChild.age,
        childAge: targetChild.age,
        bloodGroup: targetChild.bloodGroup,
        childGender: targetChild.gender,
      } : {})
    }));

    if (user && db) {
      try {
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, {
          child2NotApplicable: notApplicable,
          hasSecondChild: !notApplicable,
          ...(notApplicable ? {
            activeChildIndex: 1,
            babyName: targetChild.name,
            childName: targetChild.name,
            toddlerName: targetChild.name,
            babyBirthDate: targetChild.birthDate,
            babyAge: targetChild.age,
            childAge: targetChild.age,
            bloodGroup: targetChild.bloodGroup,
            childGender: targetChild.gender,
          } : {}),
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (e) {
        console.warn("Could not sync child2NotApplicable to Firestore:", e);
      }
    }
  };

  const isAdminAccount =
    user?.email === 'admin@securepass.internal' ||
    user?.email === 'rlashmi086@gmail.com';

  const needsProfileSetup = Boolean(
    user &&
    !isDemoSession &&
    !isAdminAccount &&
    (
      profile?.needsProfileSetup === true ||
      (typeof window !== 'undefined' && localStorage.getItem('needs_profile_setup') === 'true') ||
      (profile && profile.profileCompleted === false)
    )
  );

  const isPremium = isPremiumUser(profile, user);
  const isPremiumLocked = shouldLockPremiumFeature(user, profile, isSessionActive);

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      needsProfileSetup, 
      isSessionActive,
      setSessionActive,
      authMode,
      isGuestDemo,
      isAccountUser,
      refreshProfile, 
      loginAsGuest,
      activeChildIndex: effectiveActiveIndex,
      childProfiles,
      activeChild,
      switchActiveChild,
      child2NotApplicable,
      setChild2NotApplicable,
      isPremium,
      isPremiumLocked
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

