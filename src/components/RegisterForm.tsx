import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuth, clearDemoLocalStorageForAccount } from '../lib/AuthContext';
import { trackSiteAnalyticsEvent } from '../lib/analyticsTracker';
import { motion } from 'motion/react';
import { Mail, Lock, User, UserPlus, AlertCircle, Loader2 } from 'lucide-react';

export const RegisterForm: React.FC = () => {
  const { setSessionActive } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail) || cleanEmail.endsWith('@securepass.internal')) {
      setError('Please enter a valid email address so you can receive notifications and password reset links.');
      setLoading(false);
      return;
    }

    let cleanUsername = username.toLowerCase().trim();
    if (cleanUsername.includes('@')) {
      cleanUsername = cleanUsername.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
    } else {
      cleanUsername = cleanUsername.replace(/\s+/g, '_');
    }

    const usernameRegex = /^[a-z0-9_]{3,25}$/;
    if (!usernameRegex.test(cleanUsername)) {
      setError('Username must be 3 to 25 characters (letters, numbers, or underscores).');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      // Verify username availability before creating Firebase Auth account
      if (db) {
        try {
          const existingUsername = await getDoc(doc(db, 'usernames', cleanUsername));
          if (existingUsername.exists()) {
            setError(`The username "${cleanUsername}" is already taken. Please choose another username.`);
            setLoading(false);
            return;
          }
        } catch (lookupErr) {
          console.warn('Username availability check note:', lookupErr);
        }
      }

      localStorage.removeItem('user_logged_out');
      localStorage.setItem('tt_auth_mode', 'account');
      clearDemoLocalStorageForAccount();

      // 1. Create Auth User with real email ID so password resets & email notifications reach their inbox
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;

      try {
        await updateProfile(user, { displayName: cleanUsername });
      } catch {
        // Non-fatal display name update
      }

      // 2. Save username lookup & Firestore user profile
      if (db) {
        try {
          await setDoc(doc(db, 'usernames', cleanUsername), {
            userId: user.uid,
            username: cleanUsername,
            email: cleanEmail,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (unameErr) {
          console.warn('Username index save notice:', unameErr);
        }

        try {
          await setDoc(doc(db, 'users', user.uid), {
            username: cleanUsername,
            email: cleanEmail,
            contactEmail: cleanEmail,
            plan: 'free',
            needsProfileSetup: true,
            profileCompleted: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (fsErr) {
          console.warn('Firestore profile initialization notice:', fsErr);
        }
      }

      localStorage.removeItem('tricky_toddlers_premium_unlocked');
      localStorage.removeItem(`tricky_toddlers_premium_unlocked_${user.uid}`);
      localStorage.setItem('user_plan', 'free');
      localStorage.setItem('cached_user_uid', user.uid);
      localStorage.setItem('cached_user_email', cleanEmail);
      localStorage.setItem('user_contact_email', cleanEmail);
      localStorage.setItem('needs_profile_setup', 'true');
      localStorage.setItem('profile_completed', 'false');
      localStorage.removeItem('parent_name');
      localStorage.removeItem('baby_name');
      localStorage.removeItem('user_indian_state');
      localStorage.removeItem('user_city');
      setSessionActive(true);
      void trackSiteAnalyticsEvent({
        accountType: 'Personal Account',
        eventType: 'login',
        entryPoint: 'Create Account Page (Personal Account)',
        personaName: cleanUsername,
        childProfile: 'Child 1',
        activeTab: 'profile',
      });

      navigate('/profile?mandatory=true', { replace: true });
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email ID already exists. Please sign in or reset your password.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network connection error. Please verify your connection and try again.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl"
      >
        <div className="glass-card p-5 sm:p-6 rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="text-center mb-3.5">
            <h1 className="text-2xl sm:text-[26px] font-bold text-white leading-tight mb-0.5">Create Account</h1>
            <p className="text-white/55 text-xs sm:text-sm">Join our community of supportive parents</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-white/45 uppercase tracking-wider ml-1 block">Email ID</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-indigo-400 w-4 h-4 transition-colors" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full pl-10 pr-3.5 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all placeholder:text-white/20"
                />
              </div>
              <p className="text-[10px] text-white/40 ml-1">Used for notifications and password recovery links</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/45 uppercase tracking-wider ml-1 block">Username</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-indigo-400 w-4 h-4 transition-colors" />
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full pl-10 pr-3.5 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all placeholder:text-white/20"
                  />
                </div>
                <p className="text-[10px] text-white/35 ml-1">Alphanumeric, 3–25 characters</p>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/45 uppercase tracking-wider ml-1 block">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-indigo-400 w-4 h-4 transition-colors" />
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all placeholder:text-white/20"
                  />
                </div>
                <p className="text-[10px] text-white/40 ml-1">Minimum 6 characters</p>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 px-3 py-2 bg-red-500/10 text-red-400 rounded-xl text-xs border border-red-500/20"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-600 text-white w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              Create Account
            </button>
          </form>

          <footer className="mt-3.5 text-center text-xs sm:text-sm text-white/45">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign in instead
            </Link>
          </footer>
        </div>
      </motion.div>
    </div>
  );
};
