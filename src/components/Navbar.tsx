import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '../lib/LanguageContext';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { 
  LogOut, 
  User, 
  Baby, 
  Languages,
  Heart,
  Compass,
  ChevronDown,
  MessageSquareHeart,
  Crown,
  Home,
  BookOpen,
  Sparkles,
  Camera,
  Utensils,
  Activity,
  Award,
  Clock,
  Syringe,
  Stethoscope,
  Palette,
  ShoppingBag,
  Users,
  MessageCircle,
  Tv,
  AlertCircle,
  Menu,
  UserPlus,
  LogIn
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import { triggerToast } from '../lib/ToastContext';
import { motion, AnimatePresence } from 'motion/react';

interface MenuItem {
  id: string;
  tab?: string;
  path?: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  badge?: string;
  badgeClass?: string;
}

export const Navbar: React.FC = () => {
  const { user, loginAsGuest, needsProfileSetup, isSessionActive, setSessionActive } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [expandedMobileGroup, setExpandedMobileGroup] = useState<string | null>('trackers');
  const [setupNotice, setSetupNotice] = useState(false);

  const aboutDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on route changes
  useEffect(() => {
    setAboutDropdownOpen(false);
    setLangDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  // Close dropdowns when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(target)) {
        setAboutDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(target)) {
        setLangDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, []);

  const currentPath = location.pathname;
  const currentTab = new URLSearchParams(location.search).get('tab') || (currentPath === '/' || currentPath === '/tricky-toddlers' ? 'home' : '');

  const menuItems: MenuItem[] = [
    // Row 1 (Items 1-7)
    {
      id: 'ai',
      tab: 'ai',
      label: t('aiAssistant') || 'AI Assistant',
      icon: Sparkles,
      iconColor: 'text-amber-400'
    },
    {
      id: 'milestones',
      tab: 'milestones',
      label: t('milestoneTracker') || 'Milestone Tracker',
      icon: Award,
      iconColor: 'text-purple-400'
    },
    {
      id: 'routine',
      tab: 'routine',
      label: t('routineTracker') || 'Routine Checker',
      icon: Clock,
      iconColor: 'text-blue-400'
    },
    {
      id: 'vaccine',
      tab: 'vaccine',
      label: t('vaccineTracker') || 'Vaccine Tracker',
      icon: Syringe,
      iconColor: 'text-teal-400'
    },
    {
      id: 'food',
      tab: 'food',
      label: t('aiNutriChef') || 'AI NutriChef',
      icon: Utensils,
      iconColor: 'text-emerald-400'
    },
    {
      id: 'videos',
      tab: 'videos',
      label: t('toddlerTV') || 'Toddler TV',
      icon: Tv,
      iconColor: 'text-purple-400'
    },
    {
      id: 'pediatric',
      tab: 'pediatric',
      label: t('pediatricConsultation') || 'Pediatric Care',
      icon: Stethoscope,
      iconColor: 'text-sky-400'
    },
    // Row 2 (Items 8-14)
    {
      id: 'tales',
      tab: 'tales',
      label: t('toddlerTales') || 'Toddler Tales',
      icon: BookOpen,
      iconColor: 'text-amber-400'
    },
    {
      id: 'learning',
      tab: 'learning',
      label: t('toddlerAcademy') || 'Toddler Academy',
      icon: Palette,
      iconColor: 'text-pink-400'
    },
    {
      id: 'store',
      tab: 'store',
      label: t('babyStore') || 'Baby Store',
      icon: ShoppingBag,
      iconColor: 'text-emerald-400',
      badge: 'NEW',
      badgeClass: 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
    },
    {
      id: 'community',
      tab: 'community',
      label: t('communityHelp') || 'Community Help',
      icon: Users,
      iconColor: 'text-lime-400'
    },
    {
      id: 'chat',
      tab: 'chat',
      label: t('parentConnect') || 'Parent Connect',
      icon: MessageCircle,
      iconColor: 'text-indigo-400'
    },
    {
      id: 'foodlens',
      tab: 'foodlens',
      label: t('foodLensPro') || 'FoodLens AI',
      icon: Camera,
      iconColor: 'text-amber-300',
      badge: 'PREMIUM',
      badgeClass: 'bg-gradient-to-r from-amber-400 to-yellow-400 text-black font-black shadow-sm'
    },
    {
      id: 'nutriband',
      tab: 'nutriband',
      label: t('nutriBand') || 'NutriBand',
      icon: Activity,
      iconColor: 'text-cyan-400',
      badge: 'PREMIUM',
      badgeClass: 'bg-gradient-to-r from-amber-400 to-yellow-400 text-black font-black shadow-sm'
    }
  ];

  // Grouped structure for Mobile (< 768px) to reduce visual clutter
  const mobileMenuGroups = [
    {
      id: 'ai-direct',
      label: 'AI Assistant',
      icon: Sparkles,
      iconColor: 'text-amber-400',
      directItem: menuItems.find(m => m.id === 'ai')!,
    },
    {
      id: 'trackers',
      label: 'Trackers & Health',
      icon: Stethoscope,
      iconColor: 'text-teal-400',
      items: menuItems.filter(m => ['milestones', 'routine', 'vaccine', 'pediatric'].includes(m.id)),
    },
    {
      id: 'nutrition',
      label: 'Nutrition & Food AI',
      icon: Utensils,
      iconColor: 'text-emerald-400',
      items: menuItems.filter(m => ['food', 'foodlens'].includes(m.id)),
    },
    {
      id: 'learn',
      label: 'Learn & Watch',
      icon: Palette,
      iconColor: 'text-pink-400',
      items: menuItems.filter(m => ['learning', 'tales', 'videos'].includes(m.id)),
    },
    {
      id: 'community-shop',
      label: 'Community & Shop',
      icon: Users,
      iconColor: 'text-indigo-400',
      items: menuItems.filter(m => ['community', 'chat', 'store'].includes(m.id)),
    },
    {
      id: 'nutriband-direct',
      label: 'NutriBand',
      icon: Activity,
      iconColor: 'text-cyan-400',
      directItem: menuItems.find(m => m.id === 'nutriband')!,
    },
  ];

  const isItemActive = (item: MenuItem) => {
    if (item.path) {
      return currentPath === item.path || currentPath.startsWith(item.path);
    }
    if (item.tab) {
      if (item.tab === 'home') {
        return (currentPath === '/' || currentPath === '/tricky-toddlers') && (!currentTab || currentTab === 'home');
      }
      return (currentPath === '/' || currentPath === '/tricky-toddlers') && currentTab === item.tab;
    }
    return false;
  };

  const handleMenuClick = (item: MenuItem) => {
    playSound('glass');
    if (needsProfileSetup) {
      setSetupNotice(true);
      setTimeout(() => setSetupNotice(false), 4500);
      navigate('/profile?mandatory=true');
      return;
    }
    if (item.path) {
      navigate(item.path);
    } else if (item.tab) {
      navigate(`/?tab=${item.tab}`);
      if (item.tab === 'home') {
        window.dispatchEvent(new CustomEvent('nav-reset-to-home'));
      } else {
        window.dispatchEvent(new CustomEvent('nav-tab-refresh', { detail: { tab: item.tab } }));
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const handleBrandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    playSound('glass');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (needsProfileSetup && isSessionActive) {
      setSetupNotice(true);
      setTimeout(() => setSetupNotice(false), 4500);
      navigate('/profile?mandatory=true');
      return;
    }

    navigate('/?tab=home');
    window.dispatchEvent(new CustomEvent('nav-reset-to-home'));
  };

  const handleQuickGuestClick = async () => {
    playSound('glass');
    setLanguage('en');
    setSessionActive(true);
    localStorage.removeItem('user_logged_out');
    if (!localStorage.getItem('parent_name')) localStorage.setItem('parent_name', 'Lashmi');
    if (!localStorage.getItem('baby_name')) localStorage.setItem('baby_name', 'Ashwath');
    try {
      await loginAsGuest();
    } catch (err) {
      console.warn("Guest login via top bar:", err);
    }
    triggerToast('Instant Guest Access activated for Lashmi & Ashwath.', 'success', 'Guest Session Active');
    if (location.pathname.includes('login') || location.pathname.includes('register')) {
      navigate('/?tab=home');
      window.dispatchEvent(new CustomEvent('nav-reset-to-home'));
    }
  };

  const handleLogout = async () => {
    playSound('pop');
    setSessionActive(false);
    try {
      localStorage.setItem('user_logged_out', 'true');
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
    triggerToast('You have been signed out safely.', 'info', 'Signed Out');
    navigate('/?tab=home');
    window.dispatchEvent(new CustomEvent('nav-reset-to-home'));
  };

  return (
    <>
      <nav className="glass-nav border-b border-white/10 bg-[#070b14]/95 backdrop-blur-xl sticky top-0 z-[100] shadow-2xl">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2 sm:py-2.5">
          <div className="flex flex-wrap justify-between items-center gap-2">
            
            {/* Left: Brand - Takes to Home Page */}
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 shrink-0">
              <button 
                type="button"
                onClick={handleBrandClick}
                className="flex items-center gap-1.5 sm:gap-2.5 group shrink-0 cursor-pointer text-left focus:outline-none"
                title="Go to Tricky Toddlers Home"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-indigo-500/30 shrink-0">
                  <Baby className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="notranslate font-sans font-black text-sm sm:text-lg lg:text-xl tracking-tight text-white group-hover:text-indigo-200 transition-colors whitespace-nowrap shrink-0" translate="no">
                  Tricky Toddlers
                </span>
              </button>
            </div>

            {/* Right: Top Nav Items (Both Desktop & Mobile) */}
            <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
              {/* 1. Home Button (Always visible on Landing Page & Logged-In/Guest) */}
              <button
                type="button"
                id="nav-topbar-home-btn"
                onClick={handleBrandClick}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all text-xs font-bold cursor-pointer ${
                  (location.pathname === '/' || location.pathname === '/tricky-toddlers') && (!currentTab || currentTab === 'home')
                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-200 border-indigo-400/40 shadow-sm shadow-indigo-500/10'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80 hover:text-white'
                }`}
                title={t('home') || 'Home'}
              >
                <Home className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="notranslate" translate="no">{t('home') || 'Home'}</span>
              </button>

              {/* 2. About Me Dropdown (Always visible on Landing Page & Logged-In/Guest on both Mobile & Desktop) */}
              <div className="relative" ref={aboutDropdownRef}>
                <button
                  type="button"
                  id="nav-about-btn"
                  onClick={() => {
                    playSound('click');
                    setAboutDropdownOpen(!aboutDropdownOpen);
                  }}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all text-xs font-bold cursor-pointer ${
                    location.pathname === '/about' || location.pathname === '/contact'
                      ? 'bg-gradient-to-r from-pink-500/20 to-indigo-500/20 text-pink-200 border-pink-400/40 shadow-sm shadow-pink-500/10'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80 hover:text-white'
                  }`}
                  title={t('aboutMe') || 'About Me'}
                >
                  <span className="notranslate" translate="no">{t('aboutMe') || 'About Me'}</span>
                  <ChevronDown className={`w-3 h-3 text-white/50 transition-transform ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {aboutDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setAboutDropdownOpen(false)} 
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-60 sm:w-64 rounded-2xl bg-[#090d1a]/95 border border-white/15 p-2 shadow-2xl z-50 backdrop-blur-2xl"
                      >
                        {/* My Story */}
                        <Link
                          to="/about?tab=story"
                          onClick={() => {
                            playSound('glass');
                            setAboutDropdownOpen(false);
                            window.scrollTo({ top: 0, behavior: 'instant' });
                          }}
                          className="w-full text-left p-2 rounded-xl text-xs transition-all flex items-start gap-2.5 hover:bg-white/5 text-white/90 hover:text-white group"
                        >
                          <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 mt-0.5 group-hover:bg-pink-500/20 shrink-0">
                            <Heart className="w-3.5 h-3.5 fill-pink-400/30" />
                          </div>
                          <div>
                            <div className="notranslate font-bold text-white group-hover:text-pink-200 transition-colors" translate="no">{t('myStory') || 'My Story'}</div>
                            <div className="notranslate text-[10px] text-slate-400" translate="no">{t('howIStarted') || 'How I started Tricky Toddlers'}</div>
                          </div>
                        </Link>

                        {/* Contact & Feedback */}
                        <Link
                          to="/contact"
                          onClick={() => {
                            playSound('glass');
                            setAboutDropdownOpen(false);
                            window.scrollTo({ top: 0, behavior: 'instant' });
                          }}
                          className="w-full text-left p-2 rounded-xl text-xs transition-all flex items-start gap-2.5 hover:bg-white/5 text-white/90 hover:text-white group border-t border-white/5 mt-1 pt-2"
                        >
                          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5 group-hover:bg-emerald-500/20 shrink-0">
                            <MessageSquareHeart className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="notranslate font-bold text-white group-hover:text-emerald-200 transition-colors" translate="no">{t('contactFeedback') || 'Contact & Feedback'}</div>
                            <div className="notranslate text-[10px] text-slate-400" translate="no">{t('shareStories') || 'Help me help you • Share stories'}</div>
                          </div>
                        </Link>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. Plans (Always visible on Landing Page & Logged-In/Guest on both Mobile & Desktop) */}
              <Link 
                to="/plans" 
                onClick={() => {
                  playSound('glass');
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                }}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all text-xs font-bold ${
                  location.pathname === '/plans'
                    ? 'bg-amber-500/20 text-amber-200 border-amber-400/40 shadow-sm shadow-amber-500/10'
                    : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-400/30'
                }`}
                title="Plans & Premium Membership"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="notranslate" translate="no">{t('plans') || 'Plans'}</span>
              </Link>

              {isSessionActive ? (
                <>
                  {/* 4. Dietary Preferences (Visible once Guest or Create Account is clicked) */}
                  <Link 
                    to="/dietary-preferences" 
                    onClick={() => {
                      playSound('glass');
                      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    }}
                    className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all text-xs font-bold ${
                      location.pathname === '/dietary-preferences' || location.pathname.includes('baby-health')
                        ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40 shadow-sm shadow-emerald-500/10'
                        : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    }`}
                    title="Dietary Preferences & Child Health"
                  >
                    <Utensils className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="notranslate" translate="no">{t('dietaryPreferences') || 'Dietary Preferences'}</span>
                  </Link>

                  {/* 5. Language Selector Dropdown (English by default, visible once Guest or Create Account is clicked) */}
                  <div className="relative" ref={langDropdownRef}>
                    <button
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setLangDropdownOpen(!langDropdownOpen);
                      }}
                      className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-xs font-bold text-white/80 hover:text-white cursor-pointer"
                      title="Select Language"
                    >
                      <Languages className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="notranslate" translate="no">
                        {SUPPORTED_LANGUAGES.find(l => l.code === language)?.localName || 'English'}
                      </span>
                      <ChevronDown className={`w-3 h-3 text-white/50 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {langDropdownOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setLangDropdownOpen(false)} 
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#090d1a] border border-white/10 p-1.5 shadow-2xl z-50 backdrop-blur-2xl max-h-80 overflow-y-auto"
                          >
                            <div className="px-2.5 py-1 text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1 border-b border-white/5">
                              Indian Languages
                            </div>
                            {SUPPORTED_LANGUAGES.map((lang) => (
                              <button
                                type="button"
                                key={lang.code}
                                onClick={() => {
                                  playSound('glass');
                                  setLanguage(lang.code);
                                  setLangDropdownOpen(false);
                                  triggerToast(`Language switched to ${lang.name} (${lang.localName}).`, 'info', 'Language Updated');
                                }}
                                className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold transition-all flex justify-between items-center ${
                                  language === lang.code
                                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                <span>{lang.localName}</span>
                                <span className="text-[9px] opacity-40 font-mono">{lang.name}</span>
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 6. Profile Settings (Visible once Guest or Create Account is clicked) */}
                  <Link 
                    to="/profile" 
                    onClick={() => {
                      playSound('click');
                      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    }}
                    className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition-colors text-xs font-bold relative ${
                      location.pathname === '/profile'
                        ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-400/40'
                        : needsProfileSetup
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-400/50 shadow-sm animate-pulse'
                        : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                    <span className="notranslate" translate="no">{t('profileSettings') || 'Profile Settings'}</span>
                    {needsProfileSetup && (
                      <span className="inline-block px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                        Setup Required
                      </span>
                    )}
                  </Link>

                  {/* 7. Sign Out (Visible once Guest or Create Account is clicked) */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl hover:bg-red-500/15 text-red-400 hover:text-red-300 transition-colors text-xs font-bold border border-red-500/20 bg-red-500/5 cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5 shrink-0" />
                    <span className="notranslate" translate="no">{t('logout') || 'Sign Out'}</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Instant Guest Access */}
                  <button
                    type="button"
                    onClick={handleQuickGuestClick}
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                    title="Instant Guest Access"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                    <span className="notranslate" translate="no">Instant Guest Access</span>
                  </button>

                  {/* Create Account */}
                  <Link
                    to="/register"
                    onClick={() => playSound('glass')}
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-black transition-all shadow-md shadow-indigo-500/20"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-white shrink-0" />
                    <span className="notranslate" translate="no">Create Account</span>
                  </Link>

                  {/* Sign In */}
                  <Link
                    to="/login"
                    onClick={() => playSound('click')}
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold transition-all"
                  >
                    <LogIn className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                    <span className="notranslate" translate="no">Sign In</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mandatory Profile Setup Notice if user attempts to leave profile before saving */}
      {setupNotice && (
        <div className="relative z-40 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-white text-xs sm:text-sm font-bold text-center py-2.5 px-4 shadow-xl border-b border-amber-300/40 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 animate-bounce" />
          <span>One-Time Mandatory Setup: Please complete and save your Profile Settings first! All tabs and features will be unlocked immediately after saving.</span>
        </div>
      )}

    {/* =========================================================
        TOP NAVIGATION MENU: ALL 14 FEATURES VISIBLE ALL THE TIME
        (Desktop >= 768px untouched; Mobile < 768px consolidated into grouped dropdowns)
    ========================================================== */}
      <>
        {/* Desktop Menu (100% Untouched) */}
        <div className="hidden md:block relative z-30 border-b border-white/10 bg-[#060a16]/95 backdrop-blur-2xl px-2 sm:px-4 lg:px-6 py-2.5 sm:py-3 shadow-md">
          <div className="w-full max-w-[1720px] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-1.5 xl:gap-2">
            {menuItems.map((item) => {
              const active = isItemActive(item);
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`top-menu-${item.id}`}
                  onClick={() => handleMenuClick(item)}
                  className={`flex items-center justify-center gap-1.5 xl:gap-2 px-2 xl:px-2.5 py-2.5 sm:py-3 rounded-xl text-xs xl:text-[13px] font-bold transition-all cursor-pointer relative whitespace-nowrap min-w-0 ${
                    active
                      ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-300/50 scale-[1.01]'
                      : 'bg-white/5 hover:bg-white/12 text-white/80 hover:text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 ${active ? 'text-white' : item.iconColor}`} />
                  <span className="notranslate whitespace-nowrap shrink-0" translate="no">{item.label}</span>
                  {item.badge && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[8px] xl:text-[8.5px] font-black uppercase tracking-wider shrink-0 ${item.badgeClass}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation Bar & Grouped Category Dropdowns (< 768px Only) */}
        <div className="md:hidden relative z-30 border-b border-white/10 bg-[#060a16]/95 backdrop-blur-2xl shadow-md">
          <div className="flex justify-between items-center px-3.5 py-2.5 gap-2">
             <button
               type="button"
               onClick={() => {
                 playSound('click');
                 setMobileMenuOpen(!mobileMenuOpen);
               }}
               className="flex items-center gap-2 min-w-0 flex-1 text-left cursor-pointer"
             >
               <span className="notranslate text-white font-black text-xs sm:text-sm tracking-tight shrink-0" translate="no">{t('mainMenu') || 'Main Menu'}</span>
               {(() => {
                 const activeItem = menuItems.find(item => isItemActive(item));
                 if (activeItem) {
                   const ActiveIcon = activeItem.icon;
                   return (
                     <span className="inline-flex items-center gap-1.5 text-[11px] text-indigo-200 bg-indigo-500/25 border border-indigo-400/40 px-2.5 py-1 rounded-xl font-bold truncate max-w-[180px]">
                       <ActiveIcon className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                       <span className="notranslate truncate" translate="no">{activeItem.label}</span>
                     </span>
                   );
                 }
                 return (
                   <span className="notranslate text-[10px] text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full font-bold shrink-0" translate="no">6 Categories</span>
                 );
               })()}
             </button>
             <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className={`px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  mobileMenuOpen 
                    ? 'bg-indigo-600 text-white border-indigo-400/50 shadow-md shadow-indigo-500/20' 
                    : 'bg-white/10 hover:bg-white/15 border-white/20 text-white'
                }`}
                aria-label="Toggle menu"
             >
                <span className="notranslate text-xs font-bold text-white/90" translate="no">{mobileMenuOpen ? (t('close') || 'Close') : (t('menu') || 'Categories')}</span>
                <Menu className="w-4 h-4 text-white" />
             </button>
          </div>
          
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 border-t border-white/10 bg-[#0a0f1d] space-y-2 overflow-hidden"
              >
                {/* 6 Consolidated Mobile Category Groups / Direct Links */}
                <div className="space-y-1.5">
                  {mobileMenuGroups.map((group) => {
                    const GroupIcon = group.icon;
                    if (group.directItem) {
                      const active = isItemActive(group.directItem);
                      return (
                        <button
                          key={group.id}
                          type="button"
                          onClick={() => {
                            handleMenuClick(group.directItem!);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
                            active
                              ? 'bg-gradient-to-r from-indigo-600/35 to-purple-600/35 text-white border-indigo-400/60 shadow-md'
                              : 'bg-white/5 text-white/90 hover:bg-white/10 border-white/10'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <GroupIcon className={`w-4 h-4 shrink-0 ${group.iconColor}`} />
                            <span className="notranslate" translate="no">{group.directItem.label}</span>
                          </span>
                          {group.directItem.badge && (
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${group.directItem.badgeClass}`}>
                              {group.directItem.badge}
                            </span>
                          )}
                        </button>
                      );
                    }

                    const hasActiveChild = group.items?.some(item => isItemActive(item));
                    const isExpanded = expandedMobileGroup === group.id;

                    return (
                      <div key={group.id} className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                        <button
                          type="button"
                          onClick={() => {
                            playSound('click');
                            setExpandedMobileGroup(isExpanded ? null : group.id);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-extrabold transition-all cursor-pointer ${
                            hasActiveChild
                              ? 'bg-indigo-500/20 text-indigo-200'
                              : 'text-white/90 hover:bg-white/5'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <GroupIcon className={`w-4 h-4 shrink-0 ${group.iconColor}`} />
                            <span className="notranslate" translate="no">{group.label}</span>
                            <span className="text-[10px] text-white/40 font-semibold">({group.items?.length})</span>
                          </span>
                          <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-indigo-300' : ''}`} />
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-white/10 bg-[#060a15] p-2 grid grid-cols-2 gap-1.5"
                            >
                              {group.items?.map((item) => {
                                const active = isItemActive(item);
                                const ItemIcon = item.icon;
                                return (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => {
                                      handleMenuClick(item);
                                      setMobileMenuOpen(false);
                                    }}
                                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold transition-all border cursor-pointer text-left ${
                                      active
                                        ? 'bg-indigo-600/30 text-white border-indigo-400/60 shadow-sm'
                                        : 'bg-white/5 text-white/80 hover:text-white border-white/5 hover:bg-white/10'
                                    }`}
                                  >
                                    <ItemIcon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-white' : item.iconColor}`} />
                                    <span className="notranslate truncate flex-1" translate="no">{item.label}</span>
                                  </button>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </>
    </>
  );
};
