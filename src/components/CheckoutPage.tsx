import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Check, 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  Crown, 
  Sparkles, 
  Camera, 
  Activity, 
  CheckCircle2, 
  Receipt,
  QrCode,
  AlertCircle
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, profile, refreshProfile } = useAuth();

  const billingPeriod = searchParams.get('period') === 'yearly' ? 'yearly' : 'monthly';
  const planName = 'Comprehensive Premium';
  const priceDisplay = billingPeriod === 'yearly' ? '₹4,999' : '₹499';
  const priceSubtext = billingPeriod === 'yearly' ? '/ year (save 15%)' : '/ month';

  const [paymentMode, setPaymentMode] = useState<'upi' | 'networking' | 'card'>('upi');
  const [upiMode, setUpiMode] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [upiIdInput, setUpiIdInput] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState(profile?.parentName || profile?.name || user?.displayName || 'Lashmi');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txnId, setTxnId] = useState('');

  const handleCompletePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    playSound('pop');
    setIsProcessing(true);

    const generatedTxn = `TT-PAY-${Date.now().toString().slice(-6)}`;
    setTxnId(generatedTxn);

    // Update localStorage
    localStorage.setItem('user_plan', 'comprehensive');
    localStorage.setItem('tricky_toddlers_premium_unlocked', 'true');
    localStorage.setItem('tricky_toddlers_last_tx', JSON.stringify({
      id: generatedTxn,
      plan: 'comprehensive',
      amount: priceDisplay,
      date: new Date().toISOString()
    }));

    // Update Firestore if logged in
    if (user && db) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          plan: 'comprehensive',
          planActivatedAt: serverTimestamp(),
          billingPeriod,
          paymentMethod: paymentMode
        });
        await refreshProfile();
      } catch (err) {
        console.warn('Firestore plan sync error (proceeding with local storage state):', err);
      }
    }

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      playSound('glass');
    }, 1200);
  };

  return (
    <div className="flex-1 w-full text-slate-100 pb-10 pt-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          onClick={() => {
            playSound('click');
            navigate('/plans');
          }}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Plans & Pricing</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-Bit Secure Checkout</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="checkout-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left 5 cols: Order Summary & Plan Highlights */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-[#1c1404] via-[#120e06] to-[#0a0703] p-6 sm:p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative z-10 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
                    <Crown className="w-3.5 h-3.5" />
                    <span>Order Summary</span>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {planName}
                    </h2>
                    <p className="text-slate-300 text-xs mt-1">
                      Full access to FoodLens Pro AI scanner & NutriBand biometric sync.
                    </p>
                  </div>

                  {/* Pricing Box */}
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Total Billed</span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-3xl font-black text-amber-300">{priceDisplay}</span>
                        <span className="text-xs text-slate-400 font-medium">{priceSubtext}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full inline-block">
                        Instant Activation
                      </span>
                    </div>
                  </div>

                  {/* Hardware Cost Note */}
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed space-y-1.5">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Hardware Note: NutriBand Smart Band Kit</span>
                    </div>
                    <p>
                      NutriBand Smart Band hardware cost is not included in subscription billing. It is a separate one-time purchase. The complete kit includes: 1x Modular Sensor Pod, 1x Diaper Clip (0-12 Mo), 3x Cotton Cloth Smart Bands (Small, Medium, Large for 1-10 Years), and 1x Silicone Smart Band (10–18y).
                    </p>
                  </div>

                  {/* Comprehensive Suite Checklist */}
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-300/80 block">
                      Everything Included in Your Plan:
                    </span>
                    <ul className="space-y-2.5 text-xs text-slate-200">
                      {[
                        { text: 'FoodLens Pro: Unlimited plate scans & 2-sec hazard AI', icon: Camera },
                        { text: 'FoodLens Pro: Allergen risk & choking prevention', icon: Sparkles },
                        { text: 'FoodLens Pro: Additives & E-numbers identification', icon: Camera },
                        { text: 'NutriBand: Bluetooth sync & live vitals telemetry', icon: Activity },
                        { text: 'NutriBand: Smart fever detection & rollover alarm', icon: Activity },
                        { text: 'NutriBand: Clinical PDF export for pediatric visits', icon: ShieldCheck },
                        { text: 'Multi-caregiver cloud telemetry sync', icon: Check },
                        { text: '100% Ad-Free calm experience + Verified badge', icon: Crown }
                      ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <li key={idx} className="flex items-center gap-2.5">
                            <div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span>{item.text}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                    <span></span>
                    <span className="text-emerald-400 font-bold">Compliant with WHO & IAP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 7 cols: Payment Methods Form */}
            <div className="lg:col-span-7 space-y-6">
              <div className="glass-card p-6 sm:p-8 rounded-3xl border-white/10 bg-[#090e1c]/90 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <div>
                    <h3 className="text-xl font-black text-white">Payment Method</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Select your preferred payment mode</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 font-bold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Secure Gateway</span>
                  </div>
                </div>

                {/* Payment Tabs: UPI / Net Banking / Card */}
                <div className="grid grid-cols-3 gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 mb-6">
                  <button
                    type="button"
                    onClick={() => { playSound('click'); setPaymentMode('upi'); }}
                    className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer text-center flex items-center justify-center gap-2 ${
                      paymentMode === 'upi'
                        ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>UPI (Instant)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { playSound('click'); setPaymentMode('networking'); }}
                    className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer text-center flex items-center justify-center gap-2 ${
                      paymentMode === 'networking'
                        ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Net Banking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { playSound('click'); setPaymentMode('card'); }}
                    className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer text-center flex items-center justify-center gap-2 ${
                      paymentMode === 'card'
                        ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Debit / Credit</span>
                  </button>
                </div>

                <form onSubmit={handleCompletePayment} className="space-y-6">
                  {/* UPI MODE */}
                  {paymentMode === 'upi' && (
                    <div className="space-y-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Choose UPI App or Scan QR
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { id: 'gpay', label: 'Google Pay', icon: '🟢' },
                          { id: 'phonepe', label: 'PhonePe', icon: '🟣' },
                          { id: 'paytm', label: 'Paytm', icon: '🔵' },
                          { id: 'qr', label: 'Scan QR', icon: '📷' }
                        ].map((app) => (
                          <button
                            key={app.id}
                            type="button"
                            onClick={() => { playSound('click'); setUpiMode(app.id as any); }}
                            className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all cursor-pointer flex flex-col items-center gap-1 ${
                              upiMode === app.id
                                ? 'bg-amber-400/20 border-amber-400 text-amber-200 shadow-md'
                                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <span className="text-base">{app.icon}</span>
                            <span>{app.label}</span>
                          </button>
                        ))}
                      </div>

                      {upiMode === 'qr' ? (
                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-3">
                          <div className="w-36 h-36 mx-auto bg-white p-2.5 rounded-2xl flex items-center justify-center shadow-lg">
                            <QrCode className="w-32 h-32 text-black" />
                          </div>
                          <p className="text-xs text-slate-300">
                            Scan with any UPI App (GPay, PhonePe, Paytm, BHIM) to pay <strong>{priceDisplay}</strong>
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-300">
                            Or Enter UPI ID / VPA
                          </label>
                          <input
                            type="text"
                            value={upiIdInput}
                            onChange={(e) => setUpiIdInput(e.target.value)}
                            placeholder="parent@okhdfcbank or 9876543210@paytm"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm transition-all"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* NET BANKING MODE */}
                  {paymentMode === 'networking' && (
                    <div className="space-y-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Popular Indian Banks
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {[
                          'HDFC Bank',
                          'State Bank of India',
                          'ICICI Bank',
                          'Axis Bank',
                          'Kotak Mahindra Bank',
                          'Punjab National Bank'
                        ].map((bank) => (
                          <button
                            key={bank}
                            type="button"
                            onClick={() => { playSound('click'); setSelectedBank(bank); }}
                            className={`p-3 rounded-xl border text-left font-bold text-xs transition-all cursor-pointer ${
                              selectedBank === bank
                                ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                            }`}
                          >
                            {bank}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CARD MODE */}
                  {paymentMode === 'card' && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="e.g. Lashmi"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4532 •••• •••• 8892"
                          maxLength={19}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-300">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="08/29"
                            maxLength={5}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-300">CVV</label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            maxLength={4}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-base tracking-wide shadow-xl shadow-amber-500/25 transition-all transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          <span>Processing Secure Payment...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-5 h-5" />
                          <span>Pay {priceDisplay} & Activate Comprehensive Premium</span>
                        </>
                      )}
                    </button>

                    <p className="text-center text-[11px] text-slate-400">
                      By proceeding, you agree to our Terms of Service & Privacy Policy.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        ) : (
          /* SUCCESS SCREEN */
          <motion.div
            key="success-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto glass-card p-8 sm:p-12 rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-[#0a1610] to-[#060c08] text-center space-y-6 shadow-2xl"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Payment Confirmed • All Features Unlocked</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Welcome to Comprehensive Premium!
              </h2>
              <p className="text-slate-300 text-sm max-w-md mx-auto">
                Your account now has full, unrestricted access to the entire Tricky Toddlers doctor-verified suite.
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left space-y-2 text-xs max-w-md mx-auto">
              <div className="flex justify-between text-slate-400">
                <span>Transaction ID:</span>
                <span className="font-mono text-white font-bold">{txnId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Plan:</span>
                <span className="text-amber-300 font-bold">Comprehensive Premium</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Amount Paid:</span>
                <span className="text-emerald-400 font-bold">{priceDisplay}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Status:</span>
                <span className="text-emerald-400 font-bold">Active ✨</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => {
                  playSound('pop');
                  navigate('/?tab=foodlens');
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-transform cursor-pointer flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Try FoodLens Pro Scanner</span>
              </button>

              <button
                onClick={() => {
                  playSound('glass');
                  navigate('/?tab=nutriband');
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Activity className="w-4 h-4" />
                <span>Open NutriBand Telemetry</span>
              </button>

              <button
                onClick={() => {
                  playSound('click');
                  navigate('/');
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
