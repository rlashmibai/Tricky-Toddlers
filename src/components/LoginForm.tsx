import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { resolveAccountEmail, maskEmailAddress } from '../lib/authLookup';
import { useAuth, clearDemoLocalStorageForAccount } from '../lib/AuthContext';
import { trackSiteAnalyticsEvent } from '../lib/analyticsTracker';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, LogIn, AlertCircle, Loader2, User, Sparkles, Mail, X, CheckCircle2, KeyRound, ShieldCheck } from 'lucide-react';
import { triggerToast } from '../lib/ToastContext';

export const LoginForm: React.FC = () => {
  const { loginAsGuest, setSessionActive } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSentTarget, setResetSentTarget] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    setError(null);
    try {
      localStorage.setItem('tt_auth_mode', 'guest');
      localStorage.removeItem('user_logged_out');
      localStorage.setItem('parent_name', 'Parent');
      localStorage.setItem('baby_name', 'Child 1');
      await loginAsGuest();
      setSessionActive(true);
      trackSiteAnalyticsEvent({
        accountType: 'Guest Account',
        entryPoint: 'Sign-In Page (Free Guest Access)',
        personaName: 'Parent',
        childProfile: 'Child 1 (2 Years 6 Months)',
        activeTab: 'ai',
      });
      window.dispatchEvent(new CustomEvent('nav-tab-refresh', { detail: { tab: 'ai' } }));
      navigate('/?tab=ai', { replace: true });
      triggerToast('You have now signed into Guest account.', 'success', 'Guest Session Active', 5000);
    } catch (err: any) {
      setError("Could not launch guest mode. Please try signing in below.");
    } finally {
      setGuestLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const cleanInput = username.toLowerCase().trim();
    try {
      // Check if signing into the private Admin Analytics account via standard Sign-In form
      if (cleanInput === 'admin' || cleanInput === 'rlashmi086@gmail.com' || cleanInput === 'rlashmi086') {
        const adminResp = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'admin', password }),
        });
        const adminData = await adminResp.json();
        if (!adminResp.ok) {
          setError(adminData.error || 'Invalid username or password.');
          setLoading(false);
          return;
        }
        const adminEmail = 'admin@securepass.internal';
        try {
          await signInWithEmailAndPassword(auth, adminEmail, password);
        } catch (fbErr: any) {
          if (fbErr.code === 'auth/user-not-found' || fbErr.code === 'auth/invalid-credential') {
            await createUserWithEmailAndPassword(auth, adminEmail, password);
          } else {
            throw fbErr;
          }
        }
        localStorage.removeItem('user_logged_out');
        localStorage.setItem('tt_auth_mode', 'account');
        setSessionActive(true);
        window.dispatchEvent(new CustomEvent('tt-admin-token', { detail: { token: adminData.token, username: adminData.username } }));
        triggerToast('Signed into Admin Analytics Portal.', 'success', 'Admin Verified');
        navigate('/admin', { state: { adminToken: adminData.token, adminUsername: adminData.username }, replace: true });
        return;
      }

      localStorage.removeItem('user_logged_out');
      localStorage.setItem('tt_auth_mode', 'account');
      clearDemoLocalStorageForAccount();

      // Resolve either direct Email ID or registered Username -> real Email ID (fallback to legacy internal email)
      const resolved = await resolveAccountEmail(cleanInput);
      const authEmail = resolved.email || `${cleanInput.replace(/\s+/g, '_')}@securepass.internal`;

      const cred = await signInWithEmailAndPassword(auth, authEmail, password);
      if (!authEmail.endsWith('@securepass.internal')) {
        localStorage.setItem('user_contact_email', authEmail);
      }

      // Clear any generic guest premium unlock unless this specific UID unlocked premium
      if (localStorage.getItem(`tricky_toddlers_premium_unlocked_${cred.user.uid}`) !== 'true') {
        localStorage.removeItem('tricky_toddlers_premium_unlocked');
        localStorage.removeItem('user_plan');
      }
      setSessionActive(true);
      trackSiteAnalyticsEvent({
        accountType: 'Personal Account',
        entryPoint: 'Sign-In Page (Personal Account)',
        personaName: username.trim() || 'Account User',
        childProfile: localStorage.getItem('baby_name') || 'Child 1',
        activeTab: 'ai',
      });
      if (cred.user.email === 'rlashmi086@gmail.com' || cred.user.email === 'admin@securepass.internal') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/?tab=ai');
        window.dispatchEvent(new CustomEvent('nav-tab-refresh', { detail: { tab: 'ai' } }));
      }
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Invalid email/username or password");
      } else {
        setError(err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setResetError("Please enter your registered email ID or username.");
      return;
    }
    setResetLoading(true);
    setResetError(null);
    try {
      const resolved = await resolveAccountEmail(resetEmail);
      if (!resolved.email) {
        setResetError(
          resolved.cleanUsername
            ? `No email ID is linked to username "${resolved.cleanUsername}". Please enter your registered Email ID directly.`
            : "Please enter a valid email ID or username."
        );
        setResetLoading(false);
        return;
      }
      if (resolved.isLegacyInternal) {
        setResetError("This older account has no real email ID linked. Please create a new account with your Email ID.");
        setResetLoading(false);
        return;
      }
      await sendPasswordResetEmail(auth, resolved.email);
      setResetSentTarget(resolved.resolvedFromUsername ? maskEmailAddress(resolved.email) : resolved.email);
      setResetSuccess(true);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setResetError("No account found with this email ID or username.");
      } else if (err.code === 'auth/invalid-email') {
        setResetError("Please enter a valid email address.");
      } else {
        setResetError(err.message || "Unable to send reset link. Please verify your email or use Free Guest Access.");
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl"
      >
        <div className="glass-card p-5 sm:p-6 rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="text-center mb-3.5">
            <h1 className="text-2xl sm:text-[26px] font-black text-white leading-tight mb-0.5">Welcome</h1>
            <p className="text-white/55 text-xs sm:text-sm whitespace-normal sm:whitespace-nowrap">
              Sign in to your parent dashboard or explore instantly
            </p>
          </div>

          {/* Quick One-Click Guest Entry */}
          <div className="mb-3.5">
            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={guestLoading || loading}
              className="w-full py-2 px-4 bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-purple-500/20 hover:from-amber-500/30 hover:via-indigo-500/30 hover:to-purple-500/30 border border-indigo-500/30 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg group active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {guestLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform shrink-0" />
              )}
              <div className="flex flex-col items-center leading-tight">
                <span className="text-sm sm:text-base font-bold text-white">Free Guest Access</span>
                <span className="text-[11px] font-semibold text-amber-300/90 tracking-wide">Free access to explore all features · No login required</span>
              </div>
            </button>
            <p className="text-[11px] text-white/45 text-center mt-1 font-medium">
              Explore all features immediately without signing in
            </p>
          </div>

          <div className="relative flex items-center justify-center mb-3.5">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#0b0f19] px-3 text-[10px] font-bold uppercase text-white/35 tracking-widest shrink-0">or sign in with account</span>
            <div className="border-t border-white/10 w-full" />
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/45 uppercase tracking-wider ml-1 block">Email ID or Username</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-indigo-400 w-4 h-4 transition-colors" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="parent@example.com or username"
                    className="w-full pl-10 pr-3.5 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all placeholder:text-white/20"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[11px] font-semibold text-white/45 uppercase tracking-wider">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(true);
                      setResetEmail(username.trim());
                      setResetSentTarget('');
                      setResetSuccess(false);
                      setResetError(null);
                    }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors hover:underline cursor-pointer whitespace-nowrap"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-indigo-400 w-4 h-4 transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all placeholder:text-white/20"
                  />
                </div>
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
              className="bg-indigo-500 hover:bg-indigo-600 text-white w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              Sign In
            </button>
          </form>

          <footer className="mt-3.5 text-center text-xs text-white/45">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Join the community
            </Link>
          </footer>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowForgotModal(false);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0f172a] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="absolute top-4 right-4 z-20 p-2 text-white/40 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Reset Password</h3>
                  <p className="text-xs text-white/50">Enter your email ID or username to receive a reset link</p>
                </div>
              </div>

              {resetSuccess ? (
                <div className="space-y-4 py-2">
                  <div className="flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-300 text-xs leading-relaxed">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm text-white mb-1">Reset Link Sent!</p>
                      <p>A password reset link has been sent to <strong className="text-emerald-200">{resetSentTarget || resetEmail}</strong>. Please check your inbox and spam folder to update your password.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="w-full py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-wider ml-1">
                      Registered Email ID or Username
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 w-4 h-4 transition-colors" />
                      <input
                        type="text"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="parent@example.com or username"
                        className="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all placeholder:text-white/20"
                      />
                    </div>
                  </div>

                  {resetError && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 text-red-400 rounded-xl text-xs border border-red-500/20">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{resetError}</span>
                    </div>
                  )}

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50"
                    >
                      {resetLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                      Send Reset Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="w-full py-2.5 text-white/50 hover:text-white text-xs font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
