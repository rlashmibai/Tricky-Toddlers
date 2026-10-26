import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SearchSection } from './SearchSection';
import { CommunityBoard } from './CommunityBoard';
import { GlobalChat } from './GlobalChat';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../lib/AuthContext';
import { useLanguage } from '../lib/LanguageContext';
import { Sparkles, Users, MessageCircle, Palette, BookOpen, Baby, Utensils, Stethoscope, Clock, Tv, ShoppingBag, Camera, Activity, Home, Syringe } from 'lucide-react';
import { LearningCenter } from './LearningCenter';
import { BlogView } from './BlogView';
import { MilestoneTracker } from './MilestoneTracker';
import { FoodGuide } from './FoodGuide';
import { ExpertPediatricianSection } from './ExpertPediatricianSection';
import { RoutineTracker } from './RoutineTracker';
import { VaccineTracker } from './VaccineTracker';
import { ToddlerVideoLibrary } from './ToddlerVideoLibrary';
import { BabyStore } from './BabyStore';
import { FoodLensView } from './FoodLensView';
import { NutriBandView } from './NutriBandView';
import { NutriBandCartPage } from './NutriBandCartPage';
import { SampleFoodsPage } from './SampleFoodsPage';
import { HomePage } from './HomePage';
import { AboutPage } from './AboutPage';
import { isPremiumUser } from '../lib/premiumUtils';
import { seedSampleData } from '../lib/seedData';
import { playSound } from '../lib/sounds';

export const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const hasPremium = isPremiumUser(profile);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'home' | 'ai' | 'community' | 'chat' | 'milestones' | 'routine' | 'vaccine' | 'food' | 'foodlens' | 'sample-foods' | 'nutriband' | 'nutriband-cart' | 'pediatric' | 'learning' | 'videos' | 'store' | 'about'>('home');
  const [storeInitialView, setStoreInitialView] = useState<'catalog' | 'cart'>('catalog');
  const [showBlog, setShowBlog] = useState(false);
  const [selectedBlogCategory, setSelectedBlogCategory] = useState<string>('All');

  // Sync tab with URL search parameter ?tab=...
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['home', 'ai', 'community', 'chat', 'milestones', 'routine', 'vaccine', 'food', 'foodlens', 'sample-foods', 'nutriband', 'nutriband-cart', 'pediatric', 'learning', 'videos', 'store', 'about'].includes(tabParam)) {
      setActiveTab(tabParam as any);
      setShowBlog(false);
    } else {
      setActiveTab('home');
      setShowBlog(false);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [searchParams]);

  // Listen for reset-to-home events when brand logo or Home is clicked
  useEffect(() => {
    const handleResetToHome = () => {
      setActiveTab('home');
      setShowBlog(false);
      setSearchParams({ tab: 'home' });
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    window.addEventListener('nav-reset-to-home', handleResetToHome);
    return () => window.removeEventListener('nav-reset-to-home', handleResetToHome);
  }, [setSearchParams]);

  const handleTabChange = (tab: typeof activeTab, subTab?: string) => {
    setActiveTab(tab);
    if (subTab) {
      setSearchParams({ tab, sub: subTab });
    } else {
      setSearchParams({ tab });
    }
    setShowBlog(false);
    playSound('glass');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  };

  // Extra guard: always scroll to top whenever activeTab changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 50);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleNavigateToStore = (initialView: 'catalog' | 'cart' = 'catalog') => {
    setStoreInitialView(initialView);
    handleTabChange('store');
  };

  useEffect(() => {
    // Attempt to seed data if empty and user is fully ready
    if (user) {
      seedSampleData();
    }
  }, [user]);

  const AICategories = [
    { title: t('sleepTipsTitle'), icon: '🌙', desc: t('sleepTipsDesc'), color: 'border-cheerful-yellow/30 bg-cheerful-yellow/5', categoryKey: 'Sleep Tips' },
    { title: t('mealtimeTitle'), icon: '🥦', desc: t('mealtimeDesc'), color: 'border-cheerful-green/30 bg-cheerful-green/5', categoryKey: 'Mealtime' },
    { title: t('tantrumsTitle'), icon: '⚡', desc: t('tantrumsDesc'), color: 'border-cheerful-pink/30 bg-cheerful-pink/5', categoryKey: 'Tantrums' },
    { title: t('pottyTrainingTitle'), icon: '🚽', desc: t('pottyTrainingDesc'), color: 'border-cheerful-blue/30 bg-cheerful-blue/5', categoryKey: 'Potty Training' },
    { title: t('developmentTitle'), icon: '🌱', desc: t('developmentDesc'), color: 'border-emerald-400/30 bg-emerald-400/5', categoryKey: 'Development' },
    { title: t('learningTitle'), icon: '🎨', desc: t('learningDesc'), color: 'border-orange-400/30 bg-orange-400/5', categoryKey: 'Learning' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex-1 flex flex-col pb-8 sm:pb-12 transition-all duration-700 ${
        activeTab === 'ai' ? 'theme-ai' : activeTab === 'community' ? 'theme-community' : activeTab === 'chat' ? 'theme-connect' : activeTab === 'milestones' ? 'theme-ai' : activeTab === 'routine' ? 'theme-ai' : activeTab === 'pediatric' ? 'theme-connect' : activeTab === 'foodlens' ? 'theme-ai' : 'theme-learning'
      }`}
    >
      {/* Tab Switcher (Replaced by permanently fixed top menu in Navbar) */}
      {false && activeTab !== 'sample-foods' && (
        <div className="max-w-7xl mx-auto px-4 mt-6 flex justify-center relative z-20 w-full">
          <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/15 p-2.5 rounded-[2.25rem] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 shadow-2xl w-full">
          {/* Tab 0: Home */}
          <button
            onClick={() => handleTabChange('home')}
            className={`flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-[1.25rem] text-sm lg:text-base font-black tracking-tight transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${
              activeTab === 'home' 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/30' 
                : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Home className="w-5 h-5 shrink-0" />
            <span>{t('home') || 'Home'}</span>
          </button>


          {/* Tab 2: Community Help */}
          <button
            onClick={() => handleTabChange('community')}
            className={`flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-[1.25rem] text-sm lg:text-base font-black tracking-tight transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${
              activeTab === 'community' 
                ? 'bg-cheerful-green text-black shadow-xl shadow-cheerful-green/30' 
                : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Users className="w-5 h-5 shrink-0" />
            <span>{t('communityHelp')}</span>
          </button>

          {/* Tab 3: Parent Connect */}
          <button
            onClick={() => handleTabChange('chat')}
            className={`flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-[1.25rem] text-sm lg:text-base font-black tracking-tight transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${
              activeTab === 'chat' 
                ? 'bg-cheerful-blue text-black shadow-xl shadow-cheerful-blue/30' 
                : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <MessageCircle className="w-5 h-5 shrink-0" />
            <span>{t('parentConnect')}</span>
          </button>

          {/* Tab 4: Milestone Tracker */}
          <button
            onClick={() => handleTabChange('milestones')}
            className={`flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-[1.25rem] text-sm lg:text-base font-black tracking-tight transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${
              activeTab === 'milestones' 
                ? 'bg-cheerful-blue text-black shadow-xl shadow-cheerful-blue/30' 
                : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Baby className="w-5 h-5 shrink-0" />
            <span>{t('milestoneTracker')}</span>
          </button>

          {/* Tab 5: Routine Checker */}
          <button
            onClick={() => handleTabChange('routine')}
            className={`flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-[1.25rem] text-sm lg:text-base font-black tracking-tight transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${
              activeTab === 'routine' 
                ? 'bg-cheerful-yellow text-black shadow-xl shadow-cheerful-yellow/30' 
                : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Clock className="w-5 h-5 shrink-0" />
            <span>{t('routineTracker')}</span>
          </button>

          {/* Tab 5.5: Vaccine Tracker */}
          <button
            onClick={() => handleTabChange('vaccine')}
            className={`flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-[1.25rem] text-sm lg:text-base font-black tracking-tight transition-all duration-300 transform hover:scale-[1.02] active:scale-95 relative ${
              activeTab === 'vaccine' 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-xl shadow-blue-500/30' 
                : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Syringe className="w-5 h-5 shrink-0" />
            <span>{t('vaccineTracker') || 'Vaccine Tracker'}</span>
          </button>

          {/* Tab 6: Solid Food Guide */}
          <button
            onClick={() => handleTabChange('food')}
            className={`flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-[1.25rem] text-sm lg:text-base font-black tracking-tight transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${
              activeTab === 'food' 
                ? 'bg-cheerful-green text-black shadow-xl shadow-cheerful-green/30' 
                : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Utensils className="w-5 h-5 shrink-0" />
            <span>{t('solidFoodGuide')}</span>
          </button>

          {/* Tab 7: Toddler TV */}
          <button
            onClick={() => handleTabChange('videos')}
            className={`flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-[1.25rem] text-sm lg:text-base font-black tracking-tight transition-all duration-300 transform hover:scale-[1.02] active:scale-95 ${
              activeTab === 'videos' 
                ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/30' 
                : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Tv className="w-5 h-5 text-cheerful-yellow shrink-0" />
            <span>{t('toddlerTV')}</span>
          </button>

          {/* Tab 8: Baby Store */}
          <button
            onClick={() => {
              setStoreInitialView('catalog');
              handleTabChange('store');
            }}
            className={`flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-[1.25rem] text-sm lg:text-base font-black tracking-tight transition-all duration-300 transform hover:scale-[1.02] active:scale-95 relative overflow-visible ${
              activeTab === 'store' 
                ? 'bg-emerald-500 text-black shadow-xl shadow-emerald-500/30' 
                : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <ShoppingBag className="w-5 h-5 shrink-0" />
            <span>{t('babyStore')}</span>
            <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 text-black text-[8px] font-black tracking-wider uppercase shadow-lg flex items-center gap-0.5 border border-emerald-300/30">
              NEW
            </span>
          </button>

          {/* Tab 9: Toddler Academy */}
          <button
            onClick={() => handleTabChange('learning')}
            className={`flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-[1.25rem] text-sm lg:text-base font-black tracking-tight transition-all duration-300 transform hover:scale-[1.02] active:scale-95 relative overflow-visible ${
              activeTab === 'learning' 
                ? 'bg-cheerful-pink text-black shadow-xl shadow-cheerful-pink/30' 
                : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Palette className="w-5 h-5 shrink-0" />
            <span>{t('toddlerAcademy')}</span>
          </button>

          {/* Tab 10: Pediatric Consultation */}
          <button
            onClick={() => handleTabChange('pediatric')}
            className={`flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-[1.25rem] text-sm lg:text-base font-black tracking-tight transition-all duration-300 transform hover:scale-[1.02] active:scale-95 relative overflow-visible ${
              activeTab === 'pediatric' 
                ? 'bg-cheerful-blue text-black shadow-xl shadow-cheerful-blue/30' 
                : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Stethoscope className="w-5 h-5 shrink-0" />
            <span>{t('pediatricConsultation')}</span>
          </button>

          {/* Tab 11: Food Lens */}
          <button
            onClick={() => handleTabChange('foodlens')}
            className={`flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-[1.25rem] text-sm lg:text-base font-black tracking-tight transition-all duration-300 transform hover:scale-[1.02] active:scale-95 relative overflow-visible ${
              activeTab === 'foodlens' 
                ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 text-black shadow-xl shadow-amber-400/30' 
                : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Camera className="w-5 h-5 shrink-0" />
            <span>{t('foodLens') || 'Food Lens AI'}</span>
            <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[8px] font-black tracking-wider uppercase shadow-lg flex items-center gap-0.5 border border-amber-300/30">
              <Sparkles className="w-2.5 h-2.5 text-black shrink-0 fill-black" />
              PREMIUM
            </span>
          </button>

          {/* Tab 12: NutriBand */}
          <button
            onClick={() => handleTabChange('nutriband')}
            className={`flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-[1.25rem] text-sm lg:text-base font-black tracking-tight transition-all duration-300 transform hover:scale-[1.02] active:scale-95 relative overflow-visible ${
              activeTab === 'nutriband' 
                ? 'bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300 text-slate-950 shadow-xl shadow-cyan-400/30' 
                : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Activity className="w-5 h-5 shrink-0" />
            <span>{t('nutriBand') || 'NutriBand'}</span>
            <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[8px] font-black tracking-wider uppercase shadow-lg flex items-center gap-0.5 border border-amber-300/30">
              <Sparkles className="w-2.5 h-2.5 text-black shrink-0 fill-black" />
              PREMIUM
            </span>
          </button>
        </div>
      </div>
      )}

      <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6 mt-4">
        <AnimatePresence mode="wait">
          {showBlog ? (
            <motion.div
              key="blog-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <BlogView
                initialCategory={selectedBlogCategory}
                onBack={() => setShowBlog(false)}
              />
            </motion.div>
          ) : activeTab === 'home' ? (
            <motion.div
              key="home-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <HomePage
                onNavigate={handleTabChange}
                onOpenStore={handleNavigateToStore}
                onOpenUpgrade={() => navigate('/profile?tab=plans')}
              />
            </motion.div>
          ) : activeTab === 'ai' ? (
            <motion.div
              key="ai-tab"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-[1680px] mx-auto px-1 sm:px-3 my-2"
            >
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-cheerful-yellow/10 blur-[80px] rounded-full animate-pulse" />
                <SearchSection />
              </div>

              {/* History of Chats Button Card - Directly Before Toddler Tales */}
              <div className="mt-8 mb-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900/90 to-blue-950/70 border border-indigo-500/25 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-base font-bold text-white tracking-tight">
                        History of Chats & Pediatric Searches
                      </h3>
                      <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Saved Logs
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-normal">
                      Access all past AI inquiries asked by parents with timestamps and quick filters by month and category.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    playSound('glass');
                    navigate('/ai-chat-history');
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold tracking-wide transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Clock className="w-4 h-4" />
                  <span>View History of Chats</span>
                </button>
              </div>

              {/* Blog Section (Teaser) */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  playSound('glass');
                  setSelectedBlogCategory('All');
                  setShowBlog(true);
                }}
                className="mt-12 mb-8 glass-card border border-white/10 p-10 relative overflow-hidden group cursor-pointer hover:border-white/20 transition-all font-sans bg-gradient-to-br from-white/[0.02] to-transparent"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 text-left">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 text-indigo-400 mb-4">
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('toddlerTales')}</span>
                    </div>
                    <h2 className="text-4xl font-black text-white mb-3 tracking-tight">{t('toddlerTales')}</h2>
                    <p className="text-white/60 text-xs sm:text-sm md:text-base whitespace-nowrap overflow-hidden text-ellipsis block max-w-full leading-normal">{t('toddlerTalesDesc')}</p>
                  </div>
                  <div className="flex items-center gap-2 text-white font-bold group-hover:translate-x-2 transition-transform">
                    {t('viewAllStories')} <Sparkles className="w-4 h-4 text-cheerful-yellow" />
                  </div>
                </div>
              </motion.div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {AICategories.map((cat, idx) => (
                  <motion.div
                    key={cat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    onClick={() => {
                      playSound('glass');
                      setSelectedBlogCategory(cat.categoryKey);
                      setShowBlog(true);
                    }}
                    className={`glass-card p-8 flex flex-col items-center text-center group cursor-pointer border-2 transition-all duration-300 ${cat.color} hover:scale-[1.02] hover:shadow-xl hover:shadow-theme-glow`}
                  >
                    <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-inner">
                      {cat.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cheerful-yellow transition-colors">{cat.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{cat.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : activeTab === 'community' ? (
            <motion.div
              key="community-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="py-10"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-cheerful-green/10 blur-[80px] rounded-full animate-pulse" />
              <CommunityBoard />
            </motion.div>
          ) : activeTab === 'chat' ? (
            <motion.div
              key="chat-tab"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="py-10"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cheerful-blue/5 blur-[120px] rounded-full pointer-events-none" />
              <GlobalChat />
            </motion.div>
          ) : activeTab === 'milestones' ? (
            <motion.div
              key="milestones-tab"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="py-10"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cheerful-blue/5 blur-[120px] rounded-full pointer-events-none" />
              <MilestoneTracker />
            </motion.div>
          ) : activeTab === 'routine' ? (
            <motion.div
              key="routine-tab"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="py-10"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cheerful-yellow/5 blur-[120px] rounded-full pointer-events-none" />
              <RoutineTracker />
            </motion.div>
          ) : activeTab === 'vaccine' ? (
            <motion.div
              key="vaccine-tab"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="py-6"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
              <VaccineTracker />
            </motion.div>
          ) : activeTab === 'food' ? (
            <motion.div
              key="food-tab"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="py-10"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cheerful-green/5 blur-[120px] rounded-full pointer-events-none" />
              <FoodGuide onNavigateToFoodLens={() => handleTabChange('foodlens')} />
            </motion.div>
          ) : activeTab === 'videos' ? (
            <motion.div
              key="videos-tab"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="py-6"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
              <ToddlerVideoLibrary onGoHome={() => handleTabChange('home')} />
            </motion.div>
          ) : activeTab === 'pediatric' ? (
            <motion.div
              key="pediatric-tab"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="py-10"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cheerful-blue/5 blur-[120px] rounded-full pointer-events-none" />
              <ExpertPediatricianSection />
            </motion.div>
          ) : activeTab === 'store' ? (
            <motion.div
              key="store-tab"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="py-6"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
              <BabyStore onGoHome={() => handleTabChange('home')} initialView={storeInitialView} />
            </motion.div>
          ) : activeTab === 'foodlens' ? (
            <motion.div
              key="foodlens-tab"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="py-6"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
              <FoodLensView 
                onNavigateToPediatric={() => handleTabChange('pediatric')} 
                onNavigateToNutriBand={() => handleTabChange('nutriband')} 
                onNavigateToSampleFoods={() => handleTabChange('sample-foods')}
              />
            </motion.div>
          ) : activeTab === 'sample-foods' ? (
            <motion.div
              key="sample-foods-tab"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="py-4"
            >
              <SampleFoodsPage />
            </motion.div>
          ) : activeTab === 'nutriband' ? (
            <motion.div
              key="nutriband-tab"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="py-6"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
              <NutriBandView 
                onNavigateToFoodLens={() => handleTabChange('foodlens')} 
                onNavigateToPediatric={() => handleTabChange('pediatric')} 
                onNavigateToStore={handleNavigateToStore}
                onNavigateToReserveCart={() => {
                  playSound('pop');
                  navigate('/cart');
                }}
              />
            </motion.div>
          ) : activeTab === 'about' ? (
            <motion.div
              key="about-tab"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="py-4"
            >
              <AboutPage embedded={true} />
            </motion.div>
          ) : (
            <motion.div
              key="learning-tab"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="py-10"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cheerful-pink/5 blur-[120px] rounded-full pointer-events-none" />
              <LearningCenter />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
