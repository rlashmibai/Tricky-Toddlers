import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  needsProfileSetup: boolean;
  refreshProfile: () => Promise<void>;
  loginAsGuest: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    let babyName = (typeof window !== 'undefined' && localStorage.getItem('baby_name')) || 'Ashwath';
    if (babyName.toLowerCase() === 'aanya') {
      babyName = 'Ashwath';
      localStorage.setItem('baby_name', 'Ashwath');
    }
    return {
      username: parentName,
      name: parentName,
      firstName: parentName,
      parentName,
      babyName,
      childName: babyName,
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
    <AuthContext.Provider value={{ user, profile, loading, needsProfileSetup, refreshProfile, loginAsGuest }}>
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

