import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  CheckCircle2, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Truck, 
  Tag, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Lock, 
  CreditCard, 
  Smartphone, 
  Receipt,
  Package,
  Check,
  RotateCcw,
  Layers,
  Baby,
  Zap,
  Box,
  Building2,
  ChevronRight,
  ArrowLeft,
  FileDown,
  Printer,
  QrCode,
  MapPin,
  Edit3
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import nutribandSensorImg from '../assets/images/nutriband_sensor_pod_standalone.svg';
import nutribandDiaperClipImg from '../assets/images/baby_diaper_clip_1789457013108.jpg';
import nutribandCottonStrapImg from '../assets/images/three_cotton_straps_real.jpg';
import nutribandSiliconeStrapImg from '../assets/images/nutriband_silicone_smartwatch.svg';
import nutribandBatteryCoinImg from '../assets/images/small_phone_usb_cable.svg';
import nutribandCaseImg from '../assets/images/storage_box_half_open.svg';

export interface CottonStrapOption {
  id: string;
  name: string;
  pattern: string;
  gradient: string;
  ringColor: string;
  dotColor: string;
  description: string;
}

export const COTTON_STRAP_OPTIONS: CottonStrapOption[] = [
  {
    id: 'blush-stars',
    name: 'Blush Star Pink',
    pattern: 'Pastel Pink & Cream Star Pattern',
    gradient: 'from-pink-400 via-rose-300 to-pink-500',
    ringColor: 'ring-pink-400',
    dotColor: '#f472b6',
    description: 'Blush pink woven with delicate cream geometric stars and soft micro-velcro.'
  },
  {
    id: 'sky-cloud',
    name: 'Sky Cloud Blue',
    pattern: 'Airy Pastel Blue Cloud Weave',
    gradient: 'from-sky-400 via-cyan-300 to-blue-500',
    ringColor: 'ring-sky-400',
    dotColor: '#38bdf8',
    description: 'Soft sky ocean blue woven with playful white cloud and gentle wave motifs.'
  },
  {
    id: 'sage-mint',
    name: 'Sage Mint Green',
    pattern: 'Calming Botanical Leaf Pattern',
    gradient: 'from-emerald-300 via-teal-200 to-emerald-500',
    ringColor: 'ring-emerald-400',
    dotColor: '#34d399',
    description: 'Gentle soothing earth-tone pastel sage green with botanical leaf accents.'
  },
  {
    id: 'soft-lavender',
    name: 'Soft Lilac Lavender',
    pattern: 'Gentle Pastel Lavender Weave',
    gradient: 'from-purple-400 via-purple-300 to-indigo-400',
    ringColor: 'ring-purple-400',
    dotColor: '#c084fc',
    description: 'Delicate pastel lilac lavender woven with soft calming night sky motifs.'
  },
  {
    id: 'honey-meadow',
    name: 'Sunny Buttercup Yellow',
    pattern: 'Warm Meadow Sunbeam Jacquard',
    gradient: 'from-amber-300 via-yellow-200 to-orange-400',
    ringColor: 'ring-amber-400',
    dotColor: '#facc15',
    description: 'Warm gentle buttercup yellow with subtle sunbeam geometric micro-texture.'
  },
  {
    id: 'stardust-gray',
    name: 'Stardust Heather Grey',
    pattern: 'Modern Neutral Starlight Jacquard',
    gradient: 'from-slate-400 via-slate-300 to-slate-600',
    ringColor: 'ring-slate-400',
    dotColor: '#94a3b8',
    description: 'Minimalist heather silver-grey with delicate night-sky micro stardust weave.'
  }
];

interface NutriBandCartPageProps {
  onBack?: () => void;
}

export const NutriBandCartPage: React.FC<NutriBandCartPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedCottonStrap, setSelectedCottonStrap] = useState<string>('blush-stars');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'networking' | 'card' | 'cod'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr' | 'id'>('gpay');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('Lashmi, Flat 402, Lotus Heights, Bandra West, Mumbai 400050');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const currentStrap = COTTON_STRAP_OPTIONS.find(s => s.id === selectedCottonStrap) || COTTON_STRAP_OPTIONS[0];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setOrderId(`TRICKY-NB-${Math.floor(100000 + Math.random() * 900000)}`);
  }, []);

  const unitPrice = 1499;
  const originalUnitPrice = 2999;
  const subtotal = unitPrice * quantity;
  const savings = (originalUnitPrice - unitPrice) * quantity;

  // Sync to local store cart
  const syncToStoreCart = () => {
    try {
      const existingRaw = localStorage.getItem('tricky_toddler_cart_v3');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const item = {
        product: {
          id: 'nutriband-starter-kit',
          name: `NutriBand™ 3-in-1 Pediatric Smart Monitor (${currentStrap.name})`,
          price: unitPrice,
          originalPrice: originalUnitPrice,
          image: nutribandDiaperClipImg,
          inStock: true,
          colorOrSize: `Breathable Cotton Cloth Strap · ${currentStrap.name} (${currentStrap.pattern})`
        },
        quantity,
        isGift: false,
        selectedCottonStrap: currentStrap.name
      };
      const idx = existing.findIndex((e: any) => e.product?.id === 'nutriband-starter-kit');
      if (idx > -1) {
        existing[idx].quantity = quantity;
        existing[idx].product = item.product;
        existing[idx].selectedCottonStrap = currentStrap.name;
      } else {
        existing.push(item);
      }
      localStorage.setItem('tricky_toddler_cart_v3', JSON.stringify(existing));
    } catch (e) {
      console.warn('Failed to sync to cart storage', e);
    }
  };

  const handlePlaceOrder = () => {
    playSound('pop');
    setIsProcessing(true);
    setTimeout(() => {
      syncToStoreCart();
      setIsProcessing(false);
      setIsOrderPlaced(true);
      playSound('glass');
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 1500);
  };

  // The 5 items included in the package - listed cleanly without selection buttons
  const packageItems = [
    {
      id: 'sensor',
      name: 'NutriBand™ Precision Telemetry Sensor Pod',
      badge: 'Core Precision Sensor',
      badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      image: nutribandSensorImg,
      icon: Sparkles,
      tagline: 'Featherlight 12g medical-grade telemetry engine',
      details: [
        'Dual high-precision thermistors tracking skin & ambient temperature with ±0.1°C clinical sensitivity',
        '3-axis inertial accelerometer monitoring breathing rise-and-fall rhythm and tummy rollover risk',
        'Bluetooth Low Energy (BLE 5.3) ultra-low-radiation continuous connectivity with 15m parent nursery range',
        'IP67 splash & drool resistant enclosure with smooth rounded hypoallergenic medical polymer backplate'
      ]
    },
    {
      id: 'clipit',
      name: 'Clip-It Box (On Baby Diaper)',
      badge: '0-12 mo. Diaper Dock',
      badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      image: nutribandDiaperClipImg,
      icon: Baby,
      tagline: 'Patented snap-on baby diaper docking clip',
      details: [
        'Snaps securely onto standard disposable and cloth diapers',
        'Firm ergonomic lock holds the sensor pod flat against baby’s belly without pinching delicate skin',
        'Specially balanced for newborns and infants under 12 months who should not wear wrist accessories'
      ]
    },
    {
      id: 'strap',
      name: `Breathable Cotton Cloth Straps (3 Sizes: Small, Medium, Large)`,
      badge: '3 Sizes: Small, Med, Large · 1-10y',
      badgeColor: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
      image: nutribandCottonStrapImg,
      icon: Sparkles,
      tagline: '3 Cotton Straps (Small 1-3y, Medium 4-7y, Large 8-10y) included in the kit for 1 to 10 years',
      details: [
        `3 Cotton Straps Included: Small (1-3y), Medium (4-7y), and Large (8-10y) sizes all provided in the kit to grow with your child from 1 to 10 years`,
        '100% Breathable & Washable: Pure organic cotton fabric that prevents sweat rash and chafing in warm Indian climates',
        '3-in-1 Versatility: The one modular sensor transitions easily between diaper clip (0-12m), cotton straps (1-10y), and silicone smart band (10+y)'
      ]
    },
    {
      id: 'silicone',
      name: 'Soft Silicone Smart Band',
      badge: '10+ Years Active Fit',
      badgeColor: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
      image: nutribandSiliconeStrapImg,
      icon: Sparkles,
      tagline: 'Durable, waterproof, food-grade silicone smart band for kids 10+ years',
      details: [
        'Safe For Kids: 100% medical-grade non-toxic silicone, BPA, phthalate & latex free',
        'Waterproof & Splash Resistant: Built for playground play, swimming, and active sports',
        'Active Smart Band Style: Health sensor display with modular docked telemetry pod'
      ]
    },
    {
      id: 'battery',
      name: 'Fast USB Quick Charger',
      badge: 'Active 48h · 30m Charge',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      image: nutribandBatteryCoinImg,
      icon: Zap,
      tagline: 'Active for 48 hours · Rapid full charge in 30 minutes',
      details: [
        'High-speed magnetic USB quick charger powers continuous 48-hour tracking on a single charge',
        'Fully charges in just 30 minutes with safe child-proof low-voltage magnetic dock',
        'Eliminates dangerous cords in the crib during naptime and overnight sleep'
      ]
    },
    {
      id: 'case',
      name: 'Organizer Storage Box',
      badge: 'Storage Box',
      badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      image: nutribandCaseImg,
      icon: Box,
      tagline: 'Custom molded storage box holding sensor, cable, clip, cotton straps & silicone smart band',
      details: [
        'Durable molded organizer storage case protects all components during storage and travel',
        'Dedicated form-fit slots keep the sensor pod, diaper clip, 3 cotton straps (Small, Medium, Large), silicone smart band, and fast USB charger neatly organized',
        'All components provided together in the starter kit'
      ]
    }
  ];

  const indianBanks = [
    'HDFC Bank',
    'ICICI Bank',
    'State Bank of India (SBI)',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'Punjab National Bank (PNB)',
    'Bank of Baroda',
    'Canara Bank'
  ];

  return (
    <div className="w-full flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans text-white text-left">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-white/10">
        <button
          type="button"
          onClick={() => {
            playSound('click');
            if (onBack) {
              onBack();
            } else {
              navigate('/?tab=nutriband');
            }
          }}
          className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to NutriBand™ Monitor</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-white/50">
          <span className="hidden sm:inline">NutriBand Official Hardware Store</span>
          <span>•</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Authentic Product
          </span>
        </div>
      </div>

      {/* Hero Title Section */}
      <div className="py-6 sm:py-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/25 text-cyan-300 text-xs font-black uppercase tracking-wider">
          <Package className="w-3.5 h-3.5 text-cyan-400" />
          <span>Official Shopping Cart & Direct Checkout</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight text-balance">
          NutriBand™ 3-in-1 Pediatric Smart Monitor Starter Package
        </h1>
        <p className="text-sm sm:text-base text-white/60 max-w-3xl leading-relaxed text-balance">
          The all-stage sleep, rollover, and temperature tracking suite for ages 0-8. Complete all-in-one kit delivered directly to your doorstep with free express courier.
        </p>
      </div>

      {/* Main Order Placed Success View */}
      {isOrderPlaced ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-emerald-950/40 via-neutral-900 to-neutral-950 border border-emerald-500/30 rounded-3xl p-6 sm:p-12 text-center max-w-3xl mx-auto space-y-6 shadow-2xl"
        >
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-mono font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Order Confirmed & Payment Received
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white text-balance">
              Thank You! Your NutriBand™ Package is Booked
            </h2>
            <p className="text-sm text-white/70 max-w-xl mx-auto leading-relaxed text-balance">
              We have processed your order <strong>#{orderId}</strong> for <strong>{quantity}x Complete Kit</strong>. A tracking dispatch link and invoice have been sent to your registered account.
            </p>
          </div>

          {/* Receipt details */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-left space-y-3 max-w-lg mx-auto text-xs sm:text-sm">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/50">Order Reference:</span>
              <span className="font-mono font-bold text-white">{orderId}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/50">Payment Method:</span>
              <span className="font-bold text-amber-300 uppercase">
                {paymentMethod === 'upi' ? `UPI (${upiApp.toUpperCase()})` : paymentMethod === 'networking' ? `Net Banking (${selectedBank})` : paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}
              </span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/50">Shipping Destination:</span>
              <span className="font-bold text-white max-w-[240px] truncate text-right">{deliveryAddress}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/50">Dispatched Via:</span>
              <span className="font-bold text-cyan-300">BlueDart / Delhivery Air Express (24-48 Hrs)</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/50">Included Strap:</span>
              <span className="font-bold text-pink-300 text-right">
                {currentStrap.name} (Breathable Cotton)
              </span>
            </div>
            <div className="flex justify-between pt-1 text-base font-black">
              <span className="text-white">Amount Paid:</span>
              <span className="text-emerald-400">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                playSound('click');
                window.print();
              }}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Order Slip / Invoice
            </button>
            <button
              type="button"
              onClick={() => {
                playSound('glass');
                navigate('/?tab=nutriband');
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <span>Back to Monitor Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ) : (
        /* The Two-Column Big Expansive Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* =========================================================
              LEFT COLUMN (7 cols): COMPLETE PACKAGE ITEMS LIST
              (No selection buttons, just the clean itemized list with sensor included)
          ========================================================== */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2 text-balance">
                    <Box className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span>Package Contents: Complete Kit (6 Items Included)</span>
                  </h2>
                  <p className="text-xs text-white/50 mt-0.5 text-balance">
                    Everything you need from day 1 newborn diaper clip to active school-age silicone smart band.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold self-start sm:self-auto">
                  ✓ Full Kit Included
                </span>
              </div>

              {/* Clean Itemized List of the 5 Items (Including Sensor) */}
              <div className="space-y-4">
                {packageItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-cyan-500/30 transition-all duration-300 flex flex-col sm:flex-row items-start gap-4"
                    >
                      {/* Item Image with Number Badge */}
                      <div className="relative w-full sm:w-28 h-28 sm:h-28 rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden shrink-0 shadow-inner flex items-center justify-center p-1">
                        <img
                          src={item.image}
                          alt={item.name}
                          className={`w-full h-full ${item.id === 'strap' || item.id === 'straps' || item.id === 'case' || item.id === 'sensor' || item.id === 'battery' ? 'object-contain p-1' : 'object-cover'} rounded-xl`}
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-[11px] font-black text-cyan-300 flex items-center justify-center shadow-md">
                          {index + 1}
                        </span>
                      </div>

                      {/* Content & Details */}
                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <h3 className="text-sm sm:text-base font-black text-white">
                            {item.name}
                          </h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        </div>

                        <p className="text-xs text-cyan-300/80 font-medium">
                          {item.tagline}
                        </p>

                        <ul className="space-y-1 pt-1">
                          {item.details.map((detail, dIdx) => (
                            <li key={dIdx} className="text-xs text-white/70 flex items-start gap-2 leading-relaxed">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hardware Specifications Summary Bar */}
              <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl space-y-2 text-xs">
                <div className="font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Medical & Safety Certification Standards
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-white/70 pt-1">
                  <div>• BPA & Phthalate Free</div>
                  <div>• RoHS Electronics Compliant</div>
                  <div>• IP67 Waterproof Rating</div>
                  <div>• WHO Percentile Compatible</div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              RIGHT COLUMN (5 cols): ORDER CHECKOUT & PAYMENT ENGINE
          ========================================================== */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/[0.03] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />

              {/* Price & Quantity Summary */}
              <div className="space-y-3 pb-4 border-b border-white/10">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Package Price</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-black text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                      <span className="text-sm text-white/40 line-through">₹{(originalUnitPrice * quantity).toLocaleString('en-IN')}</span>
                    </div>
                    <span className="text-xs text-emerald-400 font-bold">You save ₹{savings.toLocaleString('en-IN')} (50% Off)</span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="space-y-1 text-right">
                    <span className="text-[10px] font-bold text-white/50 uppercase">Quantity</span>
                    <div className="flex items-center border border-white/20 rounded-xl bg-white/5 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => { playSound('click'); setQuantity(q => Math.max(1, q - 1)); }}
                        disabled={quantity <= 1}
                        className="p-2 hover:bg-white/10 text-white disabled:opacity-30 cursor-pointer transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-sm font-black text-white">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => { playSound('click'); setQuantity(q => Math.min(5, q + 1)); }}
                        disabled={quantity >= 5}
                        className="p-2 hover:bg-white/10 text-white disabled:opacity-30 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cotton Strap Color & Design Pattern Customizer */}
              <div className="space-y-3 bg-gradient-to-br from-pink-950/20 via-white/[0.02] to-cyan-950/20 p-4 sm:p-5 rounded-2xl border border-pink-500/25 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    <span className="text-xs font-black text-white uppercase tracking-wider">
                      Choose Designed Cotton Strap Color:
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-pink-300 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/25">
                    Free with Starter Kit
                  </span>
                </div>

                <p className="text-[11px] text-white/70 leading-relaxed">
                  Every kit includes <strong>3x Breathable Cotton Cloth Straps (XS, Small, Medium for 1 to 5 Years)</strong> in your preferred pattern below:
                </p>

                {/* Grid of pattern options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {COTTON_STRAP_OPTIONS.map((strap) => {
                    const isSelected = selectedCottonStrap === strap.id;
                    return (
                      <button
                        key={strap.id}
                        type="button"
                        onClick={() => {
                          playSound('pop');
                          setSelectedCottonStrap(strap.id);
                        }}
                        className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-pink-500/20 border-pink-400 ring-2 ring-pink-400/60 shadow-lg shadow-pink-500/10'
                            : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                        }`}
                      >
                        {/* Color gradient swatch */}
                        <div
                          className={`w-7 h-7 rounded-full bg-gradient-to-tr ${strap.gradient} shrink-0 border border-white/30 shadow-inner flex items-center justify-center`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-white truncate flex items-center justify-between">
                            <span>{strap.name}</span>
                            {isSelected && (
                              <span className="text-[9px] font-black uppercase text-pink-300">Selected</span>
                            )}
                          </div>
                          <div className="text-[10px] text-white/60 truncate">
                            {strap.pattern}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active strap detail summary banner */}
                <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-2.5 flex items-start gap-2.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: currentStrap.dotColor }} />
                  <div>
                    <span className="text-white font-bold block">{currentStrap.name} ({currentStrap.pattern})</span>
                    <span className="text-[11px] text-pink-200/80 leading-tight">{currentStrap.description}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-2 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white/70 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    Delivery Address
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                    className="text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer text-[11px]"
                  >
                    {isEditingAddress ? 'Save' : 'Change Address'}
                  </button>
                </div>
                {isEditingAddress ? (
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.stopPropagation();
                      }
                    }}
                    rows={2}
                    className="w-full bg-neutral-900 border border-white/15 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 mt-1 resize-y"
                  />
                ) : (
                  <p className="text-xs text-white/90 leading-relaxed font-medium">
                    {deliveryAddress}
                  </p>
                )}
                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 pt-1">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Free Express Air Delivery • Dispatches within 24 hours</span>
                </div>
              </div>

              {/* Payment Methods (UPI, Net Banking / Networking, Card, COD) */}
              <div className="space-y-3">
                <label className="text-xs font-black text-white uppercase tracking-wider block">
                  Select Payment Method:
                </label>

                {/* Method Tabs */}
                <div className="grid grid-cols-4 gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => { playSound('click'); setPaymentMethod('upi'); }}
                    className={`py-2 px-1 rounded-xl text-[11px] font-black transition-all cursor-pointer text-center ${paymentMethod === 'upi' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-white/60 hover:text-white'}`}
                  >
                    UPI
                  </button>
                  <button
                    type="button"
                    onClick={() => { playSound('click'); setPaymentMethod('networking'); }}
                    className={`py-2 px-1 rounded-xl text-[11px] font-black transition-all cursor-pointer text-center ${paymentMethod === 'networking' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-white/60 hover:text-white'}`}
                  >
                    Net Banking
                  </button>
                  <button
                    type="button"
                    onClick={() => { playSound('click'); setPaymentMethod('card'); }}
                    className={`py-2 px-1 rounded-xl text-[11px] font-black transition-all cursor-pointer text-center ${paymentMethod === 'card' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-white/60 hover:text-white'}`}
                  >
                    Card
                  </button>
                  <button
                    type="button"
                    onClick={() => { playSound('click'); setPaymentMethod('cod'); }}
                    className={`py-2 px-1 rounded-xl text-[11px] font-black transition-all cursor-pointer text-center ${paymentMethod === 'cod' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-white/60 hover:text-white'}`}
                  >
                    COD
                  </button>
                </div>

                {/* Sub-form based on chosen payment method */}
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3 text-xs">
                  {/* UPI Option */}
                  {paymentMethod === 'upi' && (
                    <div className="space-y-3">
                      <span className="text-[11px] font-bold text-white/70 block">Choose your UPI mode:</span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'gpay', label: 'Google Pay', icon: '🟢' },
                          { id: 'phonepe', label: 'PhonePe', icon: '🟣' },
                          { id: 'paytm', label: 'Paytm', icon: '🔵' }
                        ].map((app) => (
                          <button
                            key={app.id}
                            type="button"
                            onClick={() => { playSound('click'); setUpiApp(app.id as any); }}
                            className={`p-2 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${upiApp === app.id ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200' : 'bg-white/5 border-white/10 text-white/60 hover:text-white'}`}
                          >
                            <span className="mr-1">{app.icon}</span>
                            {app.label}
                          </button>
                        ))}
                      </div>

                      <div className="pt-1">
                        <span className="text-[10px] text-white/40 block mb-1 uppercase font-bold">Or enter Virtual UPI ID</span>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@oksbi or mobile@upi"
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        />
                      </div>
                    </div>
                  )}

                  {/* Net Banking (Networking) Option */}
                  {paymentMethod === 'networking' && (
                    <div className="space-y-3">
                      <span className="text-[11px] font-bold text-white/70 block">Select your Bank for Net Banking:</span>
                      <div className="grid grid-cols-2 gap-2">
                        {indianBanks.slice(0, 4).map(bank => (
                          <button
                            key={bank}
                            type="button"
                            onClick={() => { playSound('click'); setSelectedBank(bank); }}
                            className={`p-2.5 rounded-xl border text-left font-bold text-xs transition-all cursor-pointer truncate ${selectedBank === bank ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200' : 'bg-white/5 border-white/10 text-white/60 hover:text-white'}`}
                          >
                            🏛️ {bank}
                          </button>
                        ))}
                      </div>

                      <div className="pt-1">
                        <span className="text-[10px] text-white/40 block mb-1 uppercase font-bold">All Other Banks</span>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                        >
                          {indianBanks.map(b => (
                            <option key={b} value={b} className="bg-neutral-900 text-white">{b}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Card Option */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Card Number (4111 2222 3333 4444)"
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="CVV"
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Cash on Delivery Option */}
                  {paymentMethod === 'cod' && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs leading-relaxed">
                      💵 Cash on Delivery available at your location. Please keep exact cash of <strong>₹{subtotal.toLocaleString('en-IN')}</strong> ready at the time of delivery.
                    </div>
                  )}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs border-t border-white/10 pt-3">
                <div className="flex justify-between text-white/60">
                  <span>Kit Subtotal ({quantity}x):</span>
                  <span>₹{(originalUnitPrice * quantity).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Launch Special Discount:</span>
                  <span>-₹{savings.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Express Air Shipping:</span>
                  <span className="text-emerald-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/5">
                  <span>Total Payable:</span>
                  <span className="text-cyan-300">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-sm tracking-wider uppercase shadow-xl shadow-cyan-500/25 transition-all transform hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Authorizing Payment & Booking...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{subtotal.toLocaleString('en-IN')} & Book Package</span>
                  </>
                )}
              </button>

              {/* Trust & Guarantee Badges */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-white/50 pt-1">
                <div className="p-2 bg-white/[0.02] rounded-xl border border-white/5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                  <span>30-Day Money Back</span>
                </div>
                <div className="p-2 bg-white/[0.02] rounded-xl border border-white/5">
                  <Truck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <span>Free Courier</span>
                </div>
                <div className="p-2 bg-white/[0.02] rounded-xl border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                  <span>1-Year Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
