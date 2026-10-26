/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { LanguageProvider } from './lib/LanguageContext';
import { Navbar } from './components/Navbar';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';
import { ProfilePage } from './components/ProfilePage';
import { DietaryPreferencesPage } from './components/DietaryPreferencesPage';
import { Dashboard } from './components/Dashboard';
import { LegalModal, LegalPage, LegalPolicyType } from './components/LegalPage';
import { SampleFoodsPage } from './components/SampleFoodsPage';
import { DailyDishLogPage } from './components/DailyDishLogPage';
import { NutriBandCartPage } from './components/NutriBandCartPage';
import { DoctorChatHistoryPage } from './components/DoctorChatHistoryPage';
import { AIChatHistoryPage } from './components/AIChatHistoryPage';
import { AIRecipeHistoryPage } from './components/AIRecipeHistoryPage';
import { ConsultationHistoryPage } from './components/ConsultationHistoryPage';
import { AboutPage } from './components/AboutPage';
import { ContactFeedbackPage } from './components/ContactFeedbackPage';
import { PlansPremiumPage } from './components/PlansPremiumPage';
import { CommunityGuidelines } from './components/CommunityGuidelines';
import { CheckoutPage } from './components/CheckoutPage';
import { Loader2, ArrowUp } from 'lucide-react';
import { playSound } from './lib/sounds';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

import { OnboardingScreen } from './components/OnboardingScreen';

const AppContent: React.FC = () => {
  const { user, profile, loading, needsProfileSetup } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [legalModalOpen, setLegalModalOpen] = React.useState(false);
  const [legalPolicyTab, setLegalPolicyTab] = React.useState<LegalPolicyType>('disclaimer');

  const handleOpenLegal = (tab: LegalPolicyType) => {
    playSound('click');
    setLegalPolicyTab(tab);
    setLegalModalOpen(true);
  };

  // One-time mandatory profile setup enforcement:
  // If account was just created and profile has not been completed/saved yet,
  // redirect them to /profile?mandatory=true before allowing them to use other tabs.
  React.useEffect(() => {
    if (user && !loading && needsProfileSetup) {
      const p = location.pathname;
      const isAllowed = p === '/profile' || p === '/tricky-toddlers/profile' || p === '/login' || p === '/register';
      if (!isAllowed) {
        navigate('/profile?mandatory=true', { replace: true });
      }
    }
  }, [user, loading, needsProfileSetup, location.pathname, navigate]);

  React.useEffect(() => {
    if (user && !loading) {
      const isCompleted = localStorage.getItem('onboarding_completed') === 'true';
      const hasLanguage = profile?.language;
      if (!isCompleted && !hasLanguage && !needsProfileSetup) {
        setShowOnboarding(true);
      }
    }
  }, [user, loading, profile, needsProfileSetup]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030612]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="glass-container flex flex-col min-h-screen">
      {showOnboarding && (
        <OnboardingScreen onComplete={() => setShowOnboarding(false)} />
      )}
      {/* Decorative background contained strictly to prevent overflow and bottom margins */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="mesh-gradient" />
        <div className="glass-blob w-[600px] h-[600px] bg-[#312e81] -top-[200px] -left-[200px]" style={{ animationDuration: '8s' }} />
        <div className="glass-blob w-[700px] h-[700px] bg-[#1e3a8a] -bottom-[250px] -right-[150px] opacity-20" style={{ animationDuration: '12s' }} />
        <div className="glass-blob w-[400px] h-[400px] bg-[#4338ca] top-[300px] right-[200px] opacity-20" style={{ animationDuration: '10s' }} />
      </div>

      <Navbar />
      <main className="relative z-10 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex-1 flex flex-col w-full"
          >
            <Routes location={location}>
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/tricky-toddlers" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><NutriBandCartPage /></ProtectedRoute>} />
              <Route path="/nutriband-cart" element={<ProtectedRoute><NutriBandCartPage /></ProtectedRoute>} />
              <Route path="/tricky-toddlers/cart" element={<ProtectedRoute><NutriBandCartPage /></ProtectedRoute>} />
              <Route path="/nutriband" element={<Navigate to="/?tab=nutriband" replace />} />
              <Route path="/sample-foods" element={<ProtectedRoute><SampleFoodsPage /></ProtectedRoute>} />
              <Route path="/tricky-toddlers/sample-foods" element={<ProtectedRoute><SampleFoodsPage /></ProtectedRoute>} />
              <Route path="/dish-log" element={<ProtectedRoute><DailyDishLogPage /></ProtectedRoute>} />
              <Route path="/daily-dish-log" element={<ProtectedRoute><DailyDishLogPage /></ProtectedRoute>} />
              <Route path="/tricky-toddlers/dish-log" element={<ProtectedRoute><DailyDishLogPage /></ProtectedRoute>} />
              <Route path="/doctor-chat-history" element={<ProtectedRoute><DoctorChatHistoryPage /></ProtectedRoute>} />
              <Route path="/tricky-toddlers/doctor-chat-history" element={<ProtectedRoute><DoctorChatHistoryPage /></ProtectedRoute>} />
              <Route path="/ai-chat-history" element={<ProtectedRoute><AIChatHistoryPage /></ProtectedRoute>} />
              <Route path="/tricky-toddlers/ai-chat-history" element={<ProtectedRoute><AIChatHistoryPage /></ProtectedRoute>} />
              <Route path="/ai-recipe-history" element={<ProtectedRoute><AIRecipeHistoryPage /></ProtectedRoute>} />
              <Route path="/tricky-toddlers/ai-recipe-history" element={<ProtectedRoute><AIRecipeHistoryPage /></ProtectedRoute>} />
              <Route path="/recipe-history" element={<ProtectedRoute><AIRecipeHistoryPage /></ProtectedRoute>} />
              <Route path="/tricky-toddlers/recipe-history" element={<ProtectedRoute><AIRecipeHistoryPage /></ProtectedRoute>} />
              <Route path="/consultation-history" element={<ProtectedRoute><ConsultationHistoryPage /></ProtectedRoute>} />
              <Route path="/tricky-toddlers/consultation-history" element={<ProtectedRoute><ConsultationHistoryPage /></ProtectedRoute>} />
              <Route path="/consultations" element={<ProtectedRoute><ConsultationHistoryPage /></ProtectedRoute>} />
              <Route path="/tricky-toddlers/consultations" element={<ProtectedRoute><ConsultationHistoryPage /></ProtectedRoute>} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/tricky-toddlers/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/tricky-toddlers/register" element={<RegisterForm />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tricky-toddlers/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dietary-preferences" 
                element={
                  <ProtectedRoute>
                    <DietaryPreferencesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tricky-toddlers/dietary-preferences" 
                element={
                  <ProtectedRoute>
                    <DietaryPreferencesPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/baby-health" element={<Navigate to="/dietary-preferences" replace />} />
              <Route path="/baby-profile" element={<Navigate to="/dietary-preferences" replace />} />
              <Route path="/plans" element={<ProtectedRoute><PlansPremiumPage /></ProtectedRoute>} />
              <Route path="/premium" element={<ProtectedRoute><PlansPremiumPage /></ProtectedRoute>} />
              <Route path="/tricky-toddlers/plans" element={<ProtectedRoute><PlansPremiumPage /></ProtectedRoute>} />
              <Route path="/tricky-toddlers/premium" element={<ProtectedRoute><PlansPremiumPage /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/tricky-toddlers/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/tricky-toddlers/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactFeedbackPage />} />
              <Route path="/feedback" element={<ContactFeedbackPage />} />
              <Route path="/tricky-toddlers/contact" element={<ContactFeedbackPage />} />
              <Route path="/tricky-toddlers/feedback" element={<ContactFeedbackPage />} />
              <Route path="/our-story" element={<Navigate to="/about?tab=story" replace />} />
              <Route path="/mission" element={<Navigate to="/#problem-and-mission" replace />} />
              <Route path="/vision" element={<Navigate to="/#vision" replace />} />
              <Route path="/reviews" element={<Navigate to="/about?tab=reviews" replace />} />
              <Route path="/disclaimer" element={<LegalPage initialPolicy="disclaimer" />} />
              <Route path="/privacy-policy" element={<LegalPage initialPolicy="privacy" />} />
              <Route path="/privacy" element={<LegalPage initialPolicy="privacy" />} />
              <Route path="/cookie-policy" element={<LegalPage initialPolicy="cookie" />} />
              <Route path="/cookies" element={<LegalPage initialPolicy="cookie" />} />
              <Route path="/community-guidelines" element={<CommunityGuidelines />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="relative z-20 py-6 sm:py-7 border-t border-white/15 bg-black/80 backdrop-blur-md mt-auto px-4 sm:px-8 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/80 text-sm sm:text-base font-semibold tracking-wide text-center md:text-left">
            © 2026 Ashwath Amudhan Studio, All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-6 text-xs sm:text-sm font-bold text-slate-300">
            <button
              onClick={() => handleOpenLegal('disclaimer')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Disclaimer
            </button>
            <span className="text-white/20">·</span>
            <button
              onClick={() => handleOpenLegal('privacy')}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-white/20">·</span>
            <button
              onClick={() => handleOpenLegal('cookie')}
              className="hover:text-emerald-300 transition-colors cursor-pointer"
            >
              Cookie Policy
            </button>
          </div>
        </div>
      </footer>

      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalPolicyTab}
      />
    </div>
  );
};

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const maxScroll = scrollHeight - clientHeight;
      
      // Calculate scroll progress percentage (0 to 100)
      const scrollPercent = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
      const distanceFromBottom = maxScroll - scrollY;
      
      // Hidden when in the top 10% of the page. Always visible otherwise.
      if (scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Re-check on page/location change
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  return (
    <button
      id="global-scroll-to-top-btn"
      onClick={() => {
        playSound('click');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      aria-label="Scroll to top"
      title="Scroll to top"
      className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg shadow-black/40 border border-slate-200 hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-900 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
};

const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, search]);

  return null;
};

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
          <ScrollToTopButton />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}
