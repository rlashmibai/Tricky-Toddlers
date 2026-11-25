import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { resolveAccountEmail, maskEmailAddress } from '../lib/authLookup';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, Send, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export const ForgotPasswordForm: React.FC = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [sentToDisplay, setSentToDisplay] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const resolved = await resolveAccountEmail(emailOrUsername);
      if (!resolved.email) {
        setError(
          resolved.cleanUsername
            ? `No email ID is linked to username "${resolved.cleanUsername}". Please enter your registered Email ID directly.`
            : 'Please enter a valid email ID or username.'
        );
        setLoading(false);
        return;
      }
      if (resolved.isLegacyInternal) {
        setError('This older account has no real email ID linked. Please create a new account with your Email ID.');
        setLoading(false);
        return;
      }

      await sendPasswordResetEmail(auth, resolved.email);
      setSentToDisplay(resolved.resolvedFromUsername ? maskEmailAddress(resolved.email) : resolved.email);
      setSuccess(true);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email ID or username.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Failed to send reset email');
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
        className="w-full max-w-md"
      >
        <div className="glass-card p-5 sm:p-6 rounded-3xl font-sans shadow-2xl">
          <Link to="/login" className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/55 hover:text-white mb-4 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Sign In
          </Link>

          <div className="mb-4 text-white">
            <h1 className="text-2xl font-bold tracking-tight mb-1">Reset Password</h1>
            <p className="text-xs sm:text-sm text-white/55">
              Enter your registered email ID or username and we&apos;ll send a reset link to your email.
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleReset} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/45 uppercase tracking-wider ml-1 block">
                  Email ID or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 w-4 h-4" />
                  <input
                    type="text"
                    required
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    placeholder="parent@example.com or username"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all placeholder:text-white/25"
                  />
                </div>
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
                className="bg-indigo-500 hover:bg-indigo-600 text-white w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send Reset Link
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-4"
            >
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-500/20">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold text-white mb-1">Check your email</h2>
              <p className="text-xs sm:text-sm text-white/60 mb-4 leading-relaxed">
                We&apos;ve sent a password update link to <strong className="text-white">{sentToDisplay}</strong>. Please check your inbox and spam folder.
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
              >
                Didn&apos;t receive it? Try again
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
