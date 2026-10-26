import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, FileText, Cookie, AlertTriangle, X, CheckCircle2, ChevronRight, Lock, HeartHandshake } from 'lucide-react';
import { playSound } from '../lib/sounds';

export type LegalPolicyType = 'disclaimer' | 'privacy' | 'cookie';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalPolicyType;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, initialTab = 'disclaimer' }) => {
  const [activeTab, setActiveTab] = useState<LegalPolicyType>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-gradient-to-b from-[#0e1626] to-[#080d18] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 sm:p-7 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Legal & Transparency</h2>
                <p className="text-xs text-white/50">Tricky Toddlers · NutriBand · FoodLens Safety Center</p>
              </div>
            </div>

            <button
              onClick={() => {
                playSound('pop');
                onClose();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/5 overflow-x-auto">
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('disclaimer');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'disclaimer'
                  ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Medical Disclaimer</span>
            </button>

            <button
              onClick={() => {
                playSound('click');
                setActiveTab('privacy');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'privacy'
                  ? 'bg-cyan-400/15 text-cyan-300 border border-cyan-400/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Privacy Policy</span>
            </button>

            <button
              onClick={() => {
                playSound('click');
                setActiveTab('cookie');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'cookie'
                  ? 'bg-emerald-400/15 text-emerald-300 border border-emerald-400/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Cookie className="w-4 h-4 text-emerald-400" />
              <span>Cookie Policy</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-200 text-sm leading-relaxed">
            {activeTab === 'disclaimer' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 flex items-start gap-3 text-xs sm:text-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-white block mb-0.5">Important Pediatric Notice:</strong>
                    Tricky Toddlers, Food Lens AI, and NutriBand biometric telemetries are designed for developmental education, parental guidance, and wellness tracking only. They do not constitute certified medical diagnosis, treatment, or clinical emergency care.
                  </div>
                </div>

                <section className="space-y-2">
                  <h3 className="text-base font-black text-white">1. Not a Substitute for Medical Advice</h3>
                  <p className="text-white/70">
                    Content generated by the Pediatric AI Assistant, Food Lens Plate Scanner, or NutriBand telemetry reports is for informational purposes only. Never disregard or delay seeking professional advice from your child's pediatrician due to information retrieved on this application.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-base font-black text-white">2. Medical Emergencies</h3>
                  <p className="text-white/70">
                    If your toddler exhibits emergency symptoms, such as respiratory distress, severe allergic reactions (anaphylaxis), persistent high fever unresponsive to medication, lethargy, or traumatic injury, immediately contact your local emergency response service (e.g., 911 / 112 / 108) or proceed to the nearest emergency room.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-base font-black text-white">3. Food Lens & Allergy Verification</h3>
                  <p className="text-white/70">
                    While Food Lens utilizes multi-modal image recognition calibrated against Indian FSSAI and international Codex Alimentarius standards, image analysis can be affected by lighting, visual occlusions, and recipe variations. Always inspect allergen disclosures printed directly on product packaging before feeding children with diagnosed food allergies.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-base font-black text-white">4. NutriBand Telemetry Calibrations</h3>
                  <p className="text-white/70">
                    NutriBand continuously tracks wrist skin temperature, sleep architecture, and movement baselines calibrated for toddler physiology. Wrist skin temperature varies naturally from internal core (tympanic or rectal) temperatures and is intended to highlight trends and deviations, not replace diagnostic clinical thermometer measurements.
                  </p>
                </section>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 flex items-start gap-3 text-xs sm:text-sm">
                  <Lock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-white block mb-0.5">COPPA & Child Privacy First:</strong>
                    We respect your family’s privacy. We do not sell child data, sell advertisements, or monetize personal biometric streams.
                  </div>
                </div>

                <section className="space-y-2">
                  <h3 className="text-base font-black text-white">1. Information We Collect</h3>
                  <p className="text-white/70">
                    When using Tricky Toddlers, we collect parental account details (optional email/guest ID), toddler age/developmental stage, dietary preferences (e.g., vegetarian, dairy-free), routine tracker entries, Food Lens meal scans, and NutriBand biometric streams (skin temperature and sleep trends).
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-base font-black text-white">2. How Your Data Is Secured</h3>
                  <p className="text-white/70">
                    All user records are secured with Firebase Cloud Firestore utilizing granular security rules. Only authenticated family accounts can read or write their personal toddler logs. Biometric trends and doctor consultation exports are stored in encrypted cloud storage with strict zero-knowledge access policies.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-base font-black text-white">3. Third-Party Sharing</h3>
                  <p className="text-white/70">
                    We strictly forbid sharing, leasing, or transferring your child’s health, growth, or meal records to third-party ad networks, data brokers, or external marketers. When you schedule a 1:1 Pediatric Video or Voice Consultation, consultation logs are shared solely with the licensed physician conducting the session.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-base font-black text-white">4. Parental Rights & Data Erasure</h3>
                  <p className="text-white/70">
                    Parents maintain full ownership of their data. You may request a complete export of your child’s milestone and feeding history, or permanently purge all records from our database anytime via account profile settings.
                  </p>
                </section>
              </div>
            )}

            {activeTab === 'cookie' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 flex items-start gap-3 text-xs sm:text-sm">
                  <Cookie className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-white block mb-0.5">Transparent Cookie Usage:</strong>
                    We only use essential local storage and privacy-focused cookies necessary to power responsive app performance and store offline parent settings.
                  </div>
                </div>

                <section className="space-y-2">
                  <h3 className="text-base font-black text-white">1. What Are Cookies & Local Storage?</h3>
                  <p className="text-white/70">
                    Cookies and HTML5 LocalStorage are small files saved on your browser to remember your preferences between sessions so you don’t need to repeatedly configure your account every time you visit.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-base font-black text-white">2. Essential Cookies We Use</h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-white/70">
                    <li><strong>Authentication & Guest Session:</strong> Keeps your session active securely across app views without requiring re-login.</li>
                    <li><strong>Language Selection:</strong> Remembers your chosen vernacular dialect (English, Hindi, Tamil, Telugu, Marathi, Bengali, Kannada, Gujarati, Malayalam, Punjabi).</li>
                    <li><strong>Sound & Accessibility:</strong> Preserves your interactive audio feedback and dark mode preferences.</li>
                    <li><strong>Offline State Cache:</strong> Caches recipe collections, developmental milestones, and habit checkboxes for rapid loading.</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h3 className="text-base font-black text-white">3. Analytics & Performance</h3>
                  <p className="text-white/70">
                    We do not deploy invasive cross-site advertising trackers or tracking pixels. Any performance telemetry collected is strictly anonymous, aggregated, and utilized solely to ensure seamless uptime and low-latency response times during high-traffic hours.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-base font-black text-white">4. Managing Your Cookies</h3>
                  <p className="text-white/70">
                    You can clear or disable cookies directly within your web browser settings. Please note that disabling essential cookies may impact your ability to preserve active guest sessions and language preferences.
                  </p>
                </section>
              </div>
            )}
          </div>

          {/* Footer of modal */}
          <div className="p-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
            <span className="text-xs text-white/40">Last reviewed: September 2026 · Version 2.4</span>
            <button
              onClick={() => {
                playSound('click');
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer transition-all active:scale-95"
            >
              Understood
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const LegalPage: React.FC<{ initialPolicy?: LegalPolicyType }> = ({ initialPolicy = 'disclaimer' }) => {
  const [activeTab, setActiveTab] = useState<LegalPolicyType>(initialPolicy);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:py-16 space-y-8 text-left">
      <div className="p-8 sm:p-12 rounded-[2.5rem] bg-[#0c1322] border border-white/15 shadow-2xl space-y-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Trust, Safety & Legal Center</h1>
            <p className="text-sm text-white/60 mt-1">Tricky Toddlers · NutriBand · FoodLens Official Transparency Guidelines</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 overflow-x-auto">
          <button
            onClick={() => {
              playSound('click');
              setActiveTab('disclaimer');
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'disclaimer'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Medical Disclaimer</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              setActiveTab('privacy');
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/40'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              setActiveTab('cookie');
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'cookie'
                ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Cookie className="w-4 h-4 text-emerald-400" />
            <span>Cookie Policy</span>
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="space-y-6 pt-2 text-slate-200 text-sm sm:text-base leading-relaxed">
          {activeTab === 'disclaimer' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                <strong className="font-bold text-white block text-base mb-1">Pediatric Guidance Disclaimer:</strong>
                Tricky Toddlers and its sub-modules (Food Lens AI & NutriBand) are intended for parental wellness education and milestone tracking. They are not medical devices and do not offer certified clinical diagnosis or replace licensed pediatrician consultations.
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">1. Emergency Situations</h3>
                <p className="text-white/75">
                  Never rely on this application in medical emergencies. If your toddler experiences breathing difficulty, seizures, high unexplained fever, severe choking, or loss of responsiveness, call emergency healthcare services (911 / 112 / 108) immediately.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">2. Food Lens & Allergy Decisions</h3>
                <p className="text-white/75">
                  Food Lens provides instant ingredient analysis using multi-modal AI models. However, product formulations and allergen cross-contaminations can change without notice. Parents must physically inspect food packaging when managing severe food allergies.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">3. NutriBand Biometric Measurements</h3>
                <p className="text-white/75">
                  NutriBand measures skin temperature, active minutes, and circadian sleep phases. Skin temperature fluctuates based on ambient temperature and differs from core oral or tympanic temperatures. Use it to observe trends, and always verify with a clinical thermometer if your child feels warm or unwell.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200">
                <strong className="font-bold text-white block text-base mb-1">Child Privacy & Family Data Protection:</strong>
                We maintain zero-advertiser policies. Your toddler's data is private, encrypted, and never sold.
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">1. Personal Information Collected</h3>
                <p className="text-white/75">
                  We store user account credentials (or anonymous guest identifiers), toddler age and gender, dietary restrictions, routine logs, meal photo uploads, and paired NutriBand biometric readings.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">2. Data Security & Storage</h3>
                <p className="text-white/75">
                  All records are encrypted in transit (TLS 1.3) and stored in Google Cloud Firebase with strict rule enforcement. Only authorized account holders can query or view their family's timeline.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">3. Data Retention & Deletion</h3>
                <p className="text-white/75">
                  You have full rights to request complete deletion of your account and all associated child logs. Contact our support or use the profile settings to erase your profile permanently.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'cookie' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
                <strong className="font-bold text-white block text-base mb-1">Essential Cookies Only:</strong>
                We only use necessary storage keys to keep your login session active and remember your language preference.
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">1. How We Use Cookies</h3>
                <p className="text-white/75">
                  Cookies and local storage are utilized to save your preferred Indian regional language, keep your guest or parent login active, and cache toddler routine data so you can access the app even with spotty internet connectivity.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">2. No Ad-Tracking Cookies</h3>
                <p className="text-white/75">
                  We do not use third-party tracking pixels, marketing cookies, or fingerprinting scripts. Your browsing and child feeding queries are never tracked across other websites.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">3. Controlling Your Settings</h3>
                <p className="text-white/75">
                  You can clear your cookies or local cache anytime in your browser settings. Doing so will reset your language preference to English and require signing back in.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
