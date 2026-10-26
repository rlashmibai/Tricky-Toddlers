import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { motion } from 'motion/react';
import { Mail, Lock, User, UserPlus, AlertCircle, Loader2 } from 'lucide-react';

export const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Sanitize input: if user typed an email address, extract clean username prefix
    let cleanUsername = username.toLowerCase().trim();
    if (cleanUsername.includes('@')) {
      cleanUsername = cleanUsername.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
    } else {
      cleanUsername = cleanUsername.replace(/\s+/g, '_');
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,25}$/;
    if (!usernameRegex.test(cleanUsername)) {
      setError("Username must be between 3 and 25 characters (letters, numbers, or underscores).");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      localStorage.removeItem('user_logged_out');
      // Use internal dummy email for Firebase Auth
      const internalEmail = `${cleanUsername}@securepass.internal`;
      
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, internalEmail, password);
      const user = userCredential.user;

      // 2. Create Firestore Profile with mandatory setup requirement
      if (db) {
        try {
          await setDoc(doc(db, 'users', user.uid), {
            username: cleanUsername,
            email: internalEmail,
            needsProfileSetup: true,
            profileCompleted: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (fsErr) {
          console.warn("Firestore profile initialization notice:", fsErr);
        }
      }

      localStorage.setItem('cached_user_uid', user.uid);
      localStorage.setItem('cached_user_email', internalEmail);
      localStorage.setItem('needs_profile_setup', 'true');
      localStorage.setItem('profile_completed', 'false');
      localStorage.removeItem('parent_name');
      localStorage.removeItem('baby_name');
      localStorage.removeItem('user_indian_state');
      localStorage.removeItem('user_city');

      navigate('/profile?mandatory=true', { replace: true });
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError(`The username "${cleanUsername}" is already taken. Please pick another username or sign in.`);
      } else if (err.code === 'auth/weak-password') {
        setError("Password is too weak. Please use at least 6 characters.");
      } else if (err.code === 'auth/network-request-failed') {
        setError("Network connection error. Please verify your connection and try again.");
      } else {
        setError(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 lg:p-12 relative overflow-hidden">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-white/40">Join our community of supportive parents</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 w-5 h-5 transition-colors" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all placeholder:text-white/10"
                />
              </div>
              <p className="text-[10px] text-white/20 ml-2 italic">*Alphanumeric, 3-20 characters</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 w-5 h-5 transition-colors" />
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all placeholder:text-white/10"
                />
              </div>
              <p className="text-[10px] text-white/40 ml-2 italic">
                *Minimum 6 characters. For safety, avoid common words like '123456' or 'password'.
              </p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-3 bg-red-500/10 text-red-400 rounded-xl text-xs border border-red-500/20"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-600 text-white w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
              Create Account
            </button>
          </form>

          <footer className="mt-8 text-center text-sm text-white/40">
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
