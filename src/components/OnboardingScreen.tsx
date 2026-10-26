import React from 'react';
import { motion } from 'motion/react';
import { useLanguage, SUPPORTED_LANGUAGES } from '../lib/LanguageContext';
import { useAuth } from '../lib/AuthContext';
import { playSound } from '../lib/sounds';
import { useNavigate } from 'react-router-dom';
import { Baby, Sparkles, ArrowRight, Languages } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { setLanguage } = useLanguage();
  const { refreshProfile } = useAuth();
  const navigate = useNavigate();

  const handleSelectLanguage = async (code: string) => {
    playSound('glass');
    
    // Save to local storage and update app language state
    await setLanguage(code);
    localStorage.setItem('onboarding_completed', 'true');
    
    onComplete();

    // Navigate directly to Baby Profile & Health Settings (not plans)
    navigate('/profile?tab=baby');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030612]/90 backdrop-blur-xl p-4 overflow-y-auto">
      {/* Background glowing blobs */}
      <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-indigo-500/10 blur-[80px] rounded-full animate-pulse" />
      <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-cheerful-pink/5 blur-[100px] rounded-full animate-pulse" style={{ animationDuration: '6s' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="relative w-full max-w-2xl bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-2xl"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100 }}
            className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20 border border-white/15"
          >
            <Baby className="text-white w-8 h-8" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-sans font-black tracking-tight text-white mb-3">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cheerful-pink">Tricky Toddlers</span>
          </h1>
          <p className="text-white/50 text-base md:text-lg max-w-md mx-auto leading-relaxed">
            Your personalized guide to navigating the toddler years. Select your preferred language to begin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {SUPPORTED_LANGUAGES.map((lang, index) => (
            <motion.button
              key={lang.code}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectLanguage(lang.code)}
              className="group p-5 bg-white/[0.01] border border-white/5 rounded-2xl text-left hover:border-indigo-500/30 transition-all flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">
                  {lang.localName}
                </div>
                <div className="text-xs text-white/30 uppercase tracking-widest font-mono font-semibold mt-0.5">
                  {lang.name}
                </div>
              </div>
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                <ArrowRight className="w-5 h-5" />
              </div>
            </motion.button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-white/20 uppercase tracking-widest font-mono font-black border-t border-white/5 pt-6">
          <Languages className="w-4 h-4 text-white/30" />
          <span>Multilingual Indian Languages Support Included</span>
          <Sparkles className="w-3.5 h-3.5 text-cheerful-yellow animate-spin" style={{ animationDuration: '4s' }} />
        </div>
      </motion.div>
    </div>
  );
};
