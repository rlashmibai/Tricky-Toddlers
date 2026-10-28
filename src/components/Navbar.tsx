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
  Menu
} from 'lucide-react';
import { playSound } from '../lib/sounds';
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
  const { user, loginAsGuest, needsProfileSetup } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
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

  const isAuthPage = location.pathname.includes('login') || location.pathname.includes('register');

  const currentPath = location.pathname;
  const currentTab = new URLSearchParams(location.search).get('tab') || (currentPath === '/' || currentPath === '/tricky-toddlers' ? 'home' : '');

  const menuItems: MenuItem[] = [
    // Row 1 (Items 1-7)
    {
      id: 'home',
      tab: 'home',
      label: t('home') || 'Home',
      icon: Home,
      iconColor: 'text-indigo-400'
    },
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
      label: 'AI NutriChef',
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
    // Row 2 (Items 8-14)
    {
      id: 'pediatric',
      tab: 'pediatric',
      label: t('pediatricConsultation') || 'Pediatric Care',
      icon: Stethoscope,
      iconColor: 'text-sky-400'
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

  const handleBrandClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    playSound('glass');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (needsProfileSetup) {
      setSetupNotice(true);
      setTimeout(() => setSetupNotice(false), 4500);
      navigate('/profile?mandatory=true');
      return;
    }

    localStorage.removeItem('user_logged_out');

    if (!user) {
      localStorage.setItem('parent_name', 'Lashmi');
      localStorage.setItem('baby_name', 'Ashwath');
      try {
        await loginAsGuest();
      } catch (err) {
        console.warn("Guest login via brand click:", err);
      }
    }

    navigate('/?tab=home');
    window.dispatchEvent(new CustomEvent('nav-reset-to-home'));
  };

  const handleLogout = async () => {
    playSound('pop');
    try {
      localStorage.setItem('user_logged_out', 'true');
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <nav className="glass-nav border-b border-white/10 bg-[#070b14]/95 backdrop-blur-xl sticky top-0 z-[100] shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center gap-2">
            
            {/* Left: Brand - Takes to Home Page */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button 
                type="button"
                onClick={handleBrandClick}
                className="flex items-center gap-2 sm:gap-2.5 group shrink-0 cursor-pointer text-left focus:outline-none"
                title="Go to Tricky Toddlers Home"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-indigo-500/30 shrink-0">
                  <Baby className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="font-sans font-black text-base sm:text-lg lg:text-xl tracking-tight text-white group-hover:text-indigo-200 transition-colors whitespace-nowrap shrink-0">
                  Tricky Toddlers
                </span>
              </button>
            </div>

            {/* Right: About Menu, Language Selector & User Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* About Me Dropdown (Visible on tablet & desktop; on mobile available in Main Menu) */}
              <div className="relative hidden sm:block" ref={aboutDropdownRef}>
                <button
                  type="button"
                  id="nav-about-btn"
                  onClick={() => {
                    playSound('click');
                    setAboutDropdownOpen(!aboutDropdownOpen);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all text-xs font-bold ${
                    location.pathname === '/about'
                      ? 'bg-gradient-to-r from-pink-500/20 to-indigo-500/20 text-pink-200 border-pink-400/40 shadow-sm shadow-pink-500/10'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80 hover:text-white'
                  }`}
                  title={t('aboutMe') || 'About Me'}
                >
                  <span>{t('aboutMe') || 'About Me'}</span>
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
                        className="absolute right-0 sm:left-auto sm:right-0 mt-2 w-64 rounded-2xl bg-[#090d1a]/95 border border-white/15 p-2 shadow-2xl z-50 backdrop-blur-2xl"
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
                            <div className="font-bold text-white group-hover:text-pink-200 transition-colors">{t('myStory') || 'My Story'}</div>
                            <div className="text-[10px] text-slate-400">How I started Tricky Toddlers</div>
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
                            <div className="font-bold text-white group-hover:text-emerald-200 transition-colors">Contact & Feedback</div>
                            <div className="text-[10px] text-slate-400">Help me help you • Share stories</div>
                          </div>
                        </Link>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Language Selector Dropdown */}
              <div className="relative" ref={langDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setLangDropdownOpen(!langDropdownOpen);
                  }}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-xs font-bold text-white/80 hover:text-white"
                  title="Select Language"
                >
                  <Languages className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">
                    {SUPPORTED_LANGUAGES.find(l => l.code === language)?.localName || 'English'}
                  </span>
                  <span className="sm:hidden uppercase font-mono text-[10px]">
                    {language}
                  </span>
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

              {user && !isAuthPage ? (
                <>
                  <Link 
                    to="/plans" 
                    onClick={() => {
                      playSound('glass');
                      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    }}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all text-xs font-bold ${
                      location.pathname === '/plans'
                        ? 'bg-amber-500/20 text-amber-200 border-amber-400/40 shadow-sm shadow-amber-500/10'
                        : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-400/30'
                    }`}
                    title="Plans & Premium Membership"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Plans</span>
                  </Link>
                  <Link 
                    to="/dietary-preferences" 
                    onClick={() => {
                      playSound('glass');
                      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    }}
                    className={`hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all text-xs font-bold ${
                      location.pathname === '/dietary-preferences' || location.pathname.includes('baby-health')
                        ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40 shadow-sm shadow-emerald-500/10'
                        : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    }`}
                    title="Dietary Preferences & Child Health"
                  >
                    <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden md:inline">Dietary Preferences</span>
                    <span className="md:hidden">Diet</span>
                  </Link>
                  <Link 
                    to="/profile" 
                    onClick={() => {
                      playSound('click');
                      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    }}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition-colors text-xs font-bold ${
                      location.pathname === '/profile'
                        ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-400/40'
                        : needsProfileSetup
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-400/50 shadow-sm animate-pulse'
                        : 'hover:bg-white/5 text-white/70 hover:text-white border border-transparent hover:border-white/10'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-indigo-300" />
                    <span className="hidden md:inline">{t('profileSettings')}</span>
                    {needsProfileSetup && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                        Setup Required
                      </span>
                    )}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors text-xs font-bold border border-transparent hover:border-red-500/20"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t('logout')}</span>
                  </button>
                </>
              ) : (
                <>
                  {location.pathname.includes('login') ? (
                    <Link 
                      to="/register" 
                      onClick={() => playSound('glass')}
                      className="bg-indigo-500 text-white rounded-xl px-3.5 py-1.5 font-bold transition-all shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 text-xs"
                    >
                      Get Started
                    </Link>
                  ) : (
                    <Link 
                      to="/login" 
                      onClick={() => playSound('click')}
                      className="text-xs font-bold text-white/80 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-xl border border-white/10"
                    >
                      Sign In
                    </Link>
                  )}
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
        TOP NAVIGATION MENU: RESPONSIVE
        (Available at the top across all pages, scrolls naturally with the page)
    ========================================================== */}
    {!isAuthPage && (
      <>
        {/* Desktop Menu */}
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
                  <span className="whitespace-nowrap shrink-0">{item.label}</span>
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

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden relative z-30 border-b border-white/10 bg-[#060a16]/95 backdrop-blur-2xl shadow-md">
          <div className="flex justify-between items-center px-4 py-3">
             <div className="flex items-center gap-2">
               <span className="text-white font-black text-sm tracking-tight">Main Menu</span>
               <span className="text-[10px] text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full font-bold">14 Features</span>
             </div>
             <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                  mobileMenuOpen 
                    ? 'bg-indigo-600 text-white border-indigo-400/50 shadow-md shadow-indigo-500/20' 
                    : 'bg-white/10 hover:bg-white/15 border-white/20 text-white'
                }`}
                aria-label="Toggle menu"
             >
                <span className="text-xs font-bold text-white/90">{mobileMenuOpen ? 'Close' : 'Menu'}</span>
                <Menu className="w-5 h-5 text-white" />
             </button>
          </div>
          
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 border-t border-white/10 bg-[#0a0f1d] space-y-3.5 overflow-hidden"
              >
                {/* Mobile Quick Links: About Me, Contact, and Dietary Preferences */}
                <div className="grid grid-cols-3 gap-2 pb-3 border-b border-white/10">
                  <Link
                    to="/about?tab=story"
                    onClick={() => {
                      playSound('glass');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'instant' });
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-300 text-[10px] font-bold hover:bg-pink-500/20 transition-all text-center gap-1 active:scale-95"
                  >
                    <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/20" />
                    <span>About Me</span>
                  </Link>

                  <Link
                    to="/contact"
                    onClick={() => {
                      playSound('glass');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'instant' });
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-bold hover:bg-emerald-500/20 transition-all text-center gap-1 active:scale-95"
                  >
                    <MessageSquareHeart className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Contact</span>
                  </Link>

                  <Link
                    to="/dietary-preferences"
                    onClick={() => {
                      playSound('glass');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'instant' });
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold hover:bg-indigo-500/20 transition-all text-center gap-1 active:scale-95"
                  >
                    <Utensils className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Diet</span>
                  </Link>
                </div>

                {/* 14 Features Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {menuItems.map((item) => {
                    const active = isItemActive(item);
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => { 
                          handleMenuClick(item); 
                          setMobileMenuOpen(false); 
                        }}
                        className={`flex items-center gap-2.5 p-3 rounded-2xl text-xs font-bold transition-all border cursor-pointer active:scale-95 text-left ${
                          active
                            ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-white border-indigo-500/60 shadow-md shadow-indigo-500/20'
                            : 'bg-white/5 text-white/80 hover:text-white border-white/5 hover:border-white/15 hover:bg-white/10'
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 ${active ? 'bg-indigo-500 text-white' : 'bg-white/5 ' + item.iconColor}`}>
                          <Icon className="w-4 h-4 shrink-0" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="leading-tight truncate">{item.label}</div>
                          {item.badge && (
                            <span className={`inline-block mt-0.5 px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase tracking-wider ${item.badgeClass}`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </>
    )}
    </>
  );
};
