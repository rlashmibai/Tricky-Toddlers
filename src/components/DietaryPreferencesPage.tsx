import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { BabyHealthSettings } from './BabyHealthSettings';
import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';

export const DietaryPreferencesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-4 font-sans text-white">
        <h2 className="text-2xl font-bold">Please sign in to view dietary preferences</h2>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-bold"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 font-sans"
    >
      <BabyHealthSettings />
    </motion.div>
  );
};
