import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

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

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  needsProfileSetup: boolean;
  refreshProfile: () => Promise<void>;
  loginAsGuest: () => Promise<User | null>;
  activeChildIndex: 1 | 2;
  childProfiles: ChildProfile[];
  activeChild: ChildProfile;
  switchActiveChild: (index: 1 | 2) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeChildIndex, setActiveChildIndexState] = useState<1 | 2>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('active_child_index');
      if (saved === '2') return 2;
    }
    return 1;
  });

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('user_logged_out') === 'true') {
      return null;
    }
    const cachedUid = typeof window !== 'undefined' ? localStorage.getItem('cached_user_uid') : null;
    let cachedEmail = typeof window !== 'undefined' ? localStorage.getItem('cached_user_email') : null;
    if (!cachedEmail || cachedEmail === 'guest_instant@securepass.internal' || cachedEmail.includes('securepass.internal') || cachedEmail === 'guest@instant.internal') {
      cachedEmail = 'lashmi@gmail.com';
      if (typeof window !== 'undefined') localStorage.setItem('cached_user_email', 'lashmi@gmail.com');
    }
    return {
      uid: cachedUid || 'guest_instant_user',
      email: cachedEmail,
      isAnonymous: true,
    } as unknown as User;
  });

  const [profile, setProfile] = useState<any | null>(() => {
    let parentName = (typeof window !== 'undefined' && localStorage.getItem('parent_name')) || 'Lashmi';
    if (parentName.toLowerCase() === 'lakshmi') {
      parentName = 'Lashmi';
      localStorage.setItem('parent_name', 'Lashmi');
    }
    const savedActiveIndex = (typeof window !== 'undefined' && localStorage.getItem('active_child_index')) === '2' ? 2 : 1;
    let babyName = (typeof window !== 'undefined' && localStorage.getItem('baby_name')) || (savedActiveIndex === 2 ? 'Ananya' : 'Ashwath');
    if (babyName.toLowerCase() === 'aanya') {
      babyName = 'Ashwath';
      localStorage.setItem('baby_name', 'Ashwath');
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

  const [loading, setLoading] = useState(() => {
    return typeof window !== 'undefined' && localStorage.getItem('user_logged_out') === 'true';
  });

  const fetchProfile = async (uid: string) => {
    if (!db) {
      setProfile({
        username: 'Lashmi',
        name: 'Lashmi',
        firstName: 'Lashmi',
        parentName: 'Lashmi',
        babyName: 'Ashwath',
        childName: 'Ashwath',
        language: 'en',
      });
      return;
    }
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const isDemo = uid === 'guest_instant_user' || data.email === 'lashmi@gmail.com' || data.email === 'lashm@gmail.com' || data.username === 'Lashmi';

        // Only default to Lashmi & Ashwath if it is the demo account and not a newly registered user
        if (isDemo && !data.needsProfileSetup) {
          if (!data.parentName && !data.firstName && !data.name) {
            data.parentName = 'Lashmi';
            data.firstName = 'Lashmi';
            data.name = 'Lashmi';
            data.username = data.username || 'Lashmi';
          }
          if (!data.babyName && !data.childName) {
            data.babyName = 'Ashwath';
            data.childName = 'Ashwath';
          }
        } else if (data.parentName?.toLowerCase() === 'lakshmi') {
          data.parentName = 'Lashmi';
          data.firstName = 'Lashmi';
          data.name = 'Lashmi';
        }
        setProfile(data);
      } else {
        // Create complete guest profile for Ashwath with updated settings
        const defaultProfile = {
          username: 'Lashmi',
          name: 'Lashmi',
          firstName: 'Lashmi',
          lastName: 'Ashwath',
          parentName: 'Lashmi',
          contactEmail: 'lashm@gmail.com',
          email: 'lashm@gmail.com',
          babyName: 'Ashwath',
          childName: 'Ashwath',
          babyBirthDate: '2024-04-12',
          indianState: 'Karnataka',
          city: 'Bengaluru (Bangalore)',
          language: 'en',
          dietType: 'Vegetarian',
          religiousCultural: ['No specific restrictions'],
          foodsToAvoid: ['No chemicals', 'No artificial sweeteners', 'No food coloring / artificial colors'],
          allergiesIntolerances: [],
          feedingStyles: ['Baby-led weaning (BLW)', 'Finger foods'],
          aiInstructions: 'Ashwath is a healthy, active toddler who loves sensory play and outdoor exploration. Prefers nutritious, home-cooked vegetarian meals (khichdi, curd rice, steamed vegetables, and fruit slices) with low salt, zero refined sugar, and no artificial additives. Sensitive to loud noises, experiences teething discomfort, and thrives on a consistent afternoon nap and soothing bedtime routine. Please keep all advice gentle, actionable, and age-appropriate.',
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
      setProfile({
        username: 'Lashmi',
        name: 'Lashmi',
        firstName: 'Lashmi',
        lastName: 'Ashwath',
        parentName: 'Lashmi',
        contactEmail: 'lashm@gmail.com',
        email: 'lashm@gmail.com',
        babyName: 'Ashwath',
        childName: 'Ashwath',
        babyBirthDate: '2024-04-12',
        indianState: 'Karnataka',
        city: 'Bengaluru (Bangalore)',
        language: 'en',
        dietType: 'Vegetarian',
        religiousCultural: ['No specific restrictions'],
        foodsToAvoid: ['No chemicals', 'No artificial sweeteners', 'No food coloring / artificial colors'],
        allergiesIntolerances: [],
        feedingStyles: ['Baby-led weaning (BLW)', 'Finger foods'],
        aiInstructions: 'Ashwath is a healthy, active toddler who loves sensory play and outdoor exploration. Prefers nutritious, home-cooked vegetarian meals (khichdi, curd rice, steamed vegetables, and fruit slices) with low salt, zero refined sugar, and no artificial additives. Sensitive to loud noises, experiences teething discomfort, and thrives on a consistent afternoon nap and soothing bedtime routine. Please keep all advice gentle, actionable, and age-appropriate.',
      });
    }
  };

  const loginAsGuest = async (): Promise<User | null> => {
    if (!auth) return null;
    setLoading(true);
    try {
      localStorage.removeItem('user_logged_out');
      localStorage.setItem('parent_name', 'Lashmi');
      localStorage.setItem('baby_name', 'Ashwath');
      const defaultGuestEmail = 'lashmi@gmail.com';
      const defaultGuestPass = 'Guest@Pass987!';
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
          username: 'Lashmi',
          name: 'Lashmi',
          firstName: 'Lashmi',
          lastName: 'Ashwath',
          parentName: 'Lashmi',
          contactEmail: 'lashm@gmail.com',
          email: 'lashm@gmail.com',
          babyName: 'Ashwath',
          childName: 'Ashwath',
          babyBirthDate: '2024-04-12',
          indianState: 'Karnataka',
          city: 'Bengaluru (Bangalore)',
          language: 'en',
          dietType: 'Vegetarian',
          religiousCultural: ['No specific restrictions'],
          foodsToAvoid: ['No chemicals', 'No artificial sweeteners', 'No food coloring / artificial colors'],
          allergiesIntolerances: [],
          feedingStyles: ['Baby-led weaning (BLW)', 'Finger foods'],
          aiInstructions: 'Ashwath is a healthy, active toddler who loves sensory play and outdoor exploration. Prefers nutritious, home-cooked vegetarian meals (khichdi, curd rice, steamed vegetables, and fruit slices) with low salt, zero refined sugar, and no artificial additives. Sensitive to loud noises, experiences teething discomfort, and thrives on a consistent afternoon nap and soothing bedtime routine. Please keep all advice gentle, actionable, and age-appropriate.',
          updatedAt: serverTimestamp(),
        };
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
      localStorage.setItem('parent_name', 'Lashmi');
      localStorage.setItem('baby_name', 'Ashwath');
      setProfile({
        username: 'Lashmi',
        name: 'Lashmi',
        firstName: 'Lashmi',
        lastName: 'Ashwath',
        parentName: 'Lashmi',
        contactEmail: 'lashm@gmail.com',
        email: 'lashm@gmail.com',
        babyName: 'Ashwath',
        childName: 'Ashwath',
        babyBirthDate: '2024-04-12',
        indianState: 'Karnataka',
        city: 'Bengaluru (Bangalore)',
        language: 'en',
        dietType: 'Vegetarian',
        religiousCultural: ['No specific restrictions'],
        foodsToAvoid: ['No chemicals', 'No artificial sweeteners', 'No food coloring / artificial colors'],
        allergiesIntolerances: [],
        feedingStyles: ['Baby-led weaning (BLW)', 'Finger foods'],
        aiInstructions: 'Ashwath is a healthy, active toddler who loves sensory play and outdoor exploration. Prefers nutritious, home-cooked vegetarian meals (khichdi, curd rice, steamed vegetables, and fruit slices) with low salt, zero refined sugar, and no artificial additives. Sensitive to loud noises, experiences teething discomfort, and thrives on a consistent afternoon nap and soothing bedtime routine. Please keep all advice gentle, actionable, and age-appropriate.',
      });
      return fallbackUser;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cache default parent and child names for guest browsing
    const storedParent = localStorage.getItem('parent_name');
    if (!storedParent || storedParent.toLowerCase() === 'lakshmi') {
      localStorage.setItem('parent_name', 'Lashmi');
    }
    const storedBaby = localStorage.getItem('baby_name');
    if (!storedBaby || storedBaby.toLowerCase() === 'aanya') {
      localStorage.setItem('baby_name', 'Ashwath');
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
        // If not logged in and user hasn't explicitly clicked Logout,
        // automatically grant seamless guest access so anyone can explore right away!
        const userLoggedOut = localStorage.getItem('user_logged_out') === 'true';
        if (!userLoggedOut) {
          try {
            await loginAsGuest();
            return;
          } catch (e) {
            console.warn("Auto-guest access fallback:", e);
          }
        }
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.uid);
    }
  };

  // Child Profiles computation
  const child1Name = profile?.child1?.name || (profile?.activeChildIndex === 1 ? profile?.babyName : null) || (typeof window !== 'undefined' ? localStorage.getItem('child_1_name') : null) || (typeof window !== 'undefined' && localStorage.getItem('active_child_index') !== '2' ? localStorage.getItem('baby_name') : null) || 'Ashwath';
  const child1DOB = profile?.child1?.birthDate || (typeof window !== 'undefined' ? localStorage.getItem('child_1_dob') : null) || '2024-04-12';
  const child1Gender = profile?.child1?.gender || (typeof window !== 'undefined' ? localStorage.getItem('child_1_gender') : null) || 'Boy';
  const child1Blood = profile?.child1?.bloodGroup || (typeof window !== 'undefined' ? localStorage.getItem('child_1_blood') : null) || 'O+';
  const child1Age = formatChildAge(child1DOB, '2 Years 6 Months');

  const child2Name = profile?.child2?.name || (profile?.activeChildIndex === 2 ? profile?.babyName : null) || (typeof window !== 'undefined' ? localStorage.getItem('child_2_name') : null) || (typeof window !== 'undefined' && localStorage.getItem('active_child_index') === '2' ? localStorage.getItem('baby_name') : null) || 'Ananya';
  const child2DOB = profile?.child2?.birthDate || (typeof window !== 'undefined' ? localStorage.getItem('child_2_dob') : null) || '2026-01-15';
  const child2Gender = profile?.child2?.gender || (typeof window !== 'undefined' ? localStorage.getItem('child_2_gender') : null) || 'Girl';
  const child2Blood = profile?.child2?.bloodGroup || (typeof window !== 'undefined' ? localStorage.getItem('child_2_blood') : null) || 'B+';
  const child2Age = formatChildAge(child2DOB, '3 Months');

  const childProfiles: ChildProfile[] = [
    {
      id: 1,
      name: child1Name,
      age: child1Age,
      birthDate: child1DOB,
      gender: child1Gender,
      bloodGroup: child1Blood,
      dietaryNotes: profile?.child1?.dietaryNotes || 'Vegetarian, low salt, zero refined sugar',
    },
    {
      id: 2,
      name: child2Name,
      age: child2Age,
      birthDate: child2DOB,
      gender: child2Gender,
      bloodGroup: child2Blood,
      dietaryNotes: profile?.child2?.dietaryNotes || 'Mild lactose sensitivity, puree weaning stage',
    }
  ];

  const effectiveActiveIndex: 1 | 2 = (profile?.activeChildIndex === 2 || activeChildIndex === 2) ? 2 : 1;
  const activeChild: ChildProfile = effectiveActiveIndex === 2 ? childProfiles[1] : childProfiles[0];

  const switchActiveChild = async (newIndex: 1 | 2) => {
    setActiveChildIndexState(newIndex);
    const target = newIndex === 2 ? childProfiles[1] : childProfiles[0];

    if (typeof window !== 'undefined') {
      localStorage.setItem('active_child_index', String(newIndex));
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
      window.dispatchEvent(new CustomEvent('activeChildChanged', { detail: { index: newIndex, child: target } }));
      window.dispatchEvent(new Event('storage'));
    }

    setProfile(prev => {
      const base = prev || {
        parentName: 'Lashmi',
        username: 'Lashmi',
        firstName: 'Lashmi',
      };
      return {
        ...base,
        activeChildIndex: newIndex,
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
          activeChildIndex: newIndex,
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

  const isDemoSession = user?.uid === 'guest_instant_user' || user?.email === 'lashmi@gmail.com' || user?.email === 'lashm@gmail.com' || profile?.username === 'Lashmi';
  
  const needsProfileSetup = Boolean(
    user &&
    !isDemoSession &&
    (
      profile?.needsProfileSetup === true ||
      (typeof window !== 'undefined' && localStorage.getItem('needs_profile_setup') === 'true') ||
      (profile && profile.profileCompleted === false)
    )
  );

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      needsProfileSetup, 
      refreshProfile, 
      loginAsGuest,
      activeChildIndex: effectiveActiveIndex,
      childProfiles,
      activeChild,
      switchActiveChild
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

