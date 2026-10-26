import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  X, 
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
  Box
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import nutribandDiaperClipImg from '../assets/images/baby_diaper_clip_1789457013108.jpg';
import nutribandThreeStrapsImg from '../assets/images/three_cotton_straps_real.jpg';
import nutribandSiliconePhoto from '../assets/images/nutriband_silicone_smartwatch.svg';
import nutribandPlasticBoxImg from '../assets/images/storage_box_half_open.svg';
import nutribandUsbChargerImg from '../assets/images/small_phone_usb_cable.svg';
import { COTTON_STRAP_OPTIONS } from './NutriBandCartPage';

interface NutriBandCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenStoreCart?: () => void;
  initialQuantity?: number;
}

export const NutriBandCartModal: React.FC<NutriBandCartModalProps> = ({
  isOpen,
  onClose,
  onOpenStoreCart,
  initialQuantity = 1
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [selectedCottonStrap, setSelectedCottonStrap] = useState<string>('blush-stars');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 402, Lotus Heights, Bandra West, Mumbai 400050');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [activeKitItem, setActiveKitItem] = useState<'clipit' | 'straps' | 'silicone' | 'charger' | 'case'>('clipit');

  const currentStrap = COTTON_STRAP_OPTIONS.find(s => s.id === selectedCottonStrap) || COTTON_STRAP_OPTIONS[0];

  const kitComponents = [
    {
      id: 'clipit' as const,
      name: 'Clip-It Box (On Baby Diaper)',
      shortName: 'Clip-It Box',
      badge: '0-12 mo. Diaper Clip',
      image: nutribandDiaperClipImg,
      icon: Baby,
      color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
      description: 'Featherlight 12g dock clips securely onto infant diaper to track breathing movement & rollover.'
    },
    {
      id: 'straps' as const,
      name: `Breathable Cotton Cloth Straps (3 Sizes: Small, Medium, Large)`,
      shortName: '3 Cotton Straps',
      badge: '3 Sizes: Small, Med, Large · 1-10y',
      image: nutribandThreeStrapsImg,
      icon: Sparkles,
      color: 'text-pink-400 border-pink-500/40 bg-pink-500/10',
      description: `Small (1-3y), Medium (4-7y), and Large (8-10y) cotton cloth straps are included in the kit for ages 1 to 10 years. Complete full-circle seamless loop in "${currentStrap.name}".`
    },
    {
      id: 'silicone' as const,
      name: 'Soft Silicone Smart Band',
      shortName: 'Smart Band',
      badge: '10+ Years Active Fit',
      image: nutribandSiliconePhoto,
      icon: Sparkles,
      color: 'text-teal-400 border-teal-500/40 bg-teal-500/10',
      description: 'Durable, waterproof, food-grade silicone smart band for kids (10+ years). Quick-snap sensor enclosure with health sensor display.'
    },
    {
      id: 'charger' as const,
      name: 'Fast USB Quick Charger',
      shortName: 'USB Charger',
      badge: 'Active 48h · 30m Charge',
      image: nutribandUsbChargerImg,
      icon: Zap,
      color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
      description: 'Rapid magnetic USB quick charger with charging cable and dock. Active for 48 hours of continuous tracking; fully charges in 30 minutes. Zero cords in the crib.'
    },
    {
      id: 'case' as const,
      name: 'Organizer Storage Box',
      shortName: 'Storage Box',
      badge: 'Organizer Kit Box',
      image: nutribandPlasticBoxImg,
      icon: Box,
      color: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10',
      description: 'Durable molded organizer storage box stores sensor pod, USB charging cable, diaper clip-it box, and 3 cotton straps (Small, Medium, Large) securely. All provided in the kit.'
    }
  ];

  const currentItem = kitComponents.find(c => c.id === activeKitItem) || kitComponents[0];

  useEffect(() => {
    if (isOpen) {
      setQuantity(initialQuantity);
      setIsOrderPlaced(false);
      setOrderId(`TRICKY-NB-${Math.floor(100000 + Math.random() * 900000)}`);
      setActiveKitItem('clipit');
    }
  }, [isOpen, initialQuantity]);

  if (!isOpen) return null;

  const unitPrice = 1499;
  const originalUnitPrice = 2999;
  const subtotal = unitPrice * quantity;
  const finalTotal = subtotal;

  // Sync to localStorage store cart
  const syncToBabyStoreCart = () => {
    try {
      const existingRaw = localStorage.getItem('tricky_toddler_cart_v3');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      
      const nutribandItem = {
        product: {
          id: 'nutriband-starter-kit',
          name: `NutriBand™ 3-in-1 Pediatric Smart Monitor (${currentStrap.name})`,
          category: 'Feeding & Gear',
          ageRange: '0-6m',
          ageLabel: '0m - 10+ Years',
          price: unitPrice,
          originalPrice: originalUnitPrice,
          rating: 4.9,
          reviewsCount: 524,
          image: nutribandDiaperClipImg,
          description: 'Lightweight cordless monitor tracking movement activity, sleep position, and skin temperature. The 3-in-1 modular sensor can be kept inside the diaper clip box (0-12 mo.), inserted into the breathable Cotton cloth strap (1-10y), or snapped into the soft Silicone smart band (10+y). Includes plastic organizer storage box and fast USB quick charger.',
          features: [
            'Clip-It Box for Infant Diapers (0-12 mo.)',
            `3x Breathable Cotton Cloth Straps (Small, Medium, Large for 1-10y)`,
            'Soft Silicone Smart Band for Kids (10+y Active Fit)',
            'Fast USB Quick Charger (Active 48 hrs, charges in 30 mins)',
            'Plastic Organizer Storage Box (Holds Sensor, Cable, Clip & Straps)',
            'Instant Parent Mobile & Audible Alerts'
          ],
          inStock: true,
          isBestseller: true,
          colorOrSize: `Breathable Cotton Strap · ${currentStrap.name} (${currentStrap.pattern})`
        },
        quantity: quantity,
        isGift: false
      };

      const foundIdx = existing.findIndex((item: any) => item.product?.id === 'nutriband-starter-kit');
      if (foundIdx > -1) {
        existing[foundIdx].quantity = quantity;
      } else {
        existing.push(nutribandItem);
      }
      localStorage.setItem('tricky_toddler_cart_v3', JSON.stringify(existing));
    } catch (e) {
      console.warn('Could not sync to local store cart:', e);
    }
  };

  const handlePlaceOrder = () => {
    playSound('pop');
    syncToBabyStoreCart();
    setIsOrderPlaced(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-gradient-to-b from-[#0e1b2f] via-[#0b1424] to-[#070d18] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header (Clean, without Demo Mode) */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-cyan-950/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {isOrderPlaced ? 'Reservation Confirmed!' : 'NutriBand 3-in-1 Kit · Shopping Cart'}
                </h2>
                <p className="text-xs text-white/60">
                  {isOrderPlaced ? `Order ${orderId}` : 'Case + Cotton Straps + Silicone Band + USB Charger + Diaper Clip Included'}
                </p>
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

          {/* Body Content */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
            {!isOrderPlaced ? (
              <>
                {/* Product Detail Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                  
                  {/* Dynamic Product Visual Preview */}
                  <div className="w-full sm:w-44 shrink-0 space-y-2">
                    <div className="h-44 rounded-2xl overflow-hidden bg-slate-900 border border-cyan-400/30 relative group shadow-lg">
                      <img
                        src={currentItem.image}
                        alt={currentItem.name}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full ${currentItem.id === 'straps' ? 'object-contain p-2' : 'object-cover'} transition-all duration-300`}
                      />
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-950/90 border border-cyan-400/40 text-cyan-300 font-black text-[9px] uppercase tracking-wider backdrop-blur-md">
                        {currentItem.badge}
                      </span>
                    </div>

                    {/* Quick Mini-Switchers under main photo */}
                    <div className="grid grid-cols-4 gap-1.5">
                      {kitComponents.map(comp => (
                        <button
                          key={comp.id}
                          type="button"
                          onClick={() => {
                            playSound('click');
                            setActiveKitItem(comp.id);
                          }}
                          className={`p-1 rounded-lg border text-center transition-all cursor-pointer ${
                            activeKitItem === comp.id
                              ? 'border-cyan-400 bg-cyan-400/20 text-cyan-200 shadow-sm scale-105'
                              : 'border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-white/20'
                          }`}
                          title={comp.name}
                        >
                          <div className="text-[8px] font-black uppercase truncate">
                            {comp.shortName}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 space-y-2.5 text-left">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                          NutriBand™ 3-in-1 Smart Monitor Starter Package
                        </h3>
                        <div className="text-xs text-cyan-300 font-semibold mt-0.5 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Includes Case, Cotton Straps, Silicone Band, Fast USB Charger &amp; Diaper Clip</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg sm:text-xl font-black text-cyan-300">
                          ₹{unitPrice.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[11px] text-emerald-400 font-semibold">
                          Incl. of all taxes
                        </div>
                        <div className="text-xs text-white/40 line-through">
                          ₹{originalUnitPrice.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                      <strong className="text-white block mb-0.5">{currentItem.name}:</strong>
                      {currentItem.description}
                    </p>

                    {/* In Stock & Fast Shipping Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px]">
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> In Stock (Dispatches within 24h)
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold flex items-center gap-1">
                        <Truck className="w-3 h-3" /> Free Express Delivery
                      </span>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-4 pt-2">
                      <span className="text-xs font-bold text-white/70">Quantity:</span>
                      <div className="flex items-center border border-white/20 rounded-xl bg-white/5 overflow-hidden">
                        <button
                          onClick={() => {
                            playSound('click');
                            setQuantity(q => Math.max(1, q - 1));
                          }}
                          disabled={quantity <= 1}
                          className="p-2 hover:bg-white/10 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-4 text-xs font-black text-white">{quantity}</span>
                        <button
                          onClick={() => {
                            playSound('click');
                            setQuantity(q => Math.min(5, q + 1));
                          }}
                          disabled={quantity >= 5}
                          className="p-2 hover:bg-white/10 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-xs text-white/40">
                        Item Subtotal: <strong className="text-white">₹{subtotal.toLocaleString('en-IN')}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cotton Strap Color & Pattern Selector in Modal */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-950/20 via-white/[0.02] to-cyan-950/20 border border-pink-500/25 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-black text-white uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                      <span>Choose Designed Cotton Strap Color:</span>
                    </div>
                    <span className="text-[10px] font-bold text-pink-300 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/25">
                      Included with Kit
                    </span>
                  </div>

                  <p className="text-[11px] text-white/70">
                    Includes 3x Breathable Cotton Cloth Straps (XS, Small, Medium for 1 to 5 Years) in your chosen pattern:
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                          className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                            isSelected
                              ? 'bg-pink-500/20 border-pink-400 ring-2 ring-pink-400/50 shadow-md'
                              : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-tr ${strap.gradient} shrink-0 border border-white/30 flex items-center justify-center`}>
                            {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-bold text-white truncate">{strap.name}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-[11px] text-pink-200/80 bg-pink-500/10 p-2 rounded-lg border border-pink-500/20 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: currentStrap.dotColor }} />
                    <span><strong>{currentStrap.name}:</strong> {currentStrap.pattern}</span>
                  </div>
                </div>

                {/* What's In The Box: 4 Core Components (Case, Cotton Strap, Battery, Clip-It Box on Diaper) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/25 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-black text-cyan-300 uppercase tracking-wider">
                      <Package className="w-4 h-4 text-cyan-400" />
                      <span>In The Package: Case, Cotton Strap, Fast USB Charger & Diaper Clip</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Click any item to view</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {kitComponents.map(item => {
                      const isSelected = activeKitItem === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            playSound('click');
                            setActiveKitItem(item.id);
                          }}
                          className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500/15 border-cyan-400/60 shadow-lg shadow-cyan-500/10 scale-[1.01]'
                              : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                          }`}
                        >
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-900 border border-white/15 shrink-0 relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className={`w-full h-full ${item.id === 'straps' ? 'object-contain p-1' : 'object-cover'}`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-0.5">
                              <span className="text-[8px] text-cyan-200 font-bold leading-none px-1 py-0.5 bg-black/60 rounded">
                                {item.shortName}
                              </span>
                            </div>
                          </div>

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="text-xs font-black text-white truncate">
                                {item.name}
                              </h4>
                              {isSelected && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Free VIP Software perk */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Free 1-Yr Tricky Toddlers VIP Plan Included
                    </span>
                    <span className="text-white/40 font-mono text-[11px]">₹1,999 Value Included Free</span>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white/60 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-cyan-400" />
                      Shipping Address
                    </span>
                    <button
                      onClick={() => setIsEditingAddress(!isEditingAddress)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer underline"
                    >
                      {isEditingAddress ? 'Done' : 'Change Address'}
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
                      className="w-full text-xs p-2 rounded-xl bg-slate-900 border border-cyan-400/40 text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 resize-y"
                    />
                  ) : (
                    <p className="text-xs text-white font-medium">
                      {deliveryAddress}
                    </p>
                  )}
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Standard Pan-India Courier (Bluedart / Delhivery)
                  </span>
                </div>

                {/* Payment Options */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-white/70 block text-left">
                    Select Payment Method
                  </span>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <button
                      onClick={() => {
                        playSound('click');
                        setPaymentMethod('upi');
                      }}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        paymentMethod === 'upi'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                          : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span className="text-xs font-bold">UPI / GPay</span>
                    </button>

                    <button
                      onClick={() => {
                        playSound('click');
                        setPaymentMethod('card');
                      }}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        paymentMethod === 'card'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                          : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span className="text-xs font-bold">Credit / Debit</span>
                    </button>

                    <button
                      onClick={() => {
                        playSound('click');
                        setPaymentMethod('cod');
                      }}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        paymentMethod === 'cod'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                          : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Receipt className="w-4 h-4" />
                      <span className="text-xs font-bold">Pay on Delivery</span>
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between text-white/70">
                    <span>Package Price ({quantity}x):</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Shipping & Handling:</span>
                    <span className="text-emerald-400 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>All-Stage Warranty (5 Years):</span>
                    <span className="text-emerald-400 font-bold">FREE</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-black text-white">
                    <span>Total Amount:</span>
                    <span className="text-cyan-300 text-base">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </>
            ) : (
              /* Order Confirmation Screen */
              <div className="py-8 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                    Reservation Confirmed
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Your NutriBand Is Reserved!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Thank you for joining the NutriBand Early Access family. We have reserved your kit (Case + Cotton Strap + Fast USB Charger + Diaper Clip) under Order <strong>{orderId}</strong>.
                  </p>
                </div>

                {/* Receipt Card */}
                <div className="max-w-md mx-auto p-4 rounded-2xl bg-white/[0.03] border border-cyan-500/20 text-left space-y-3 text-xs">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/60">Order ID:</span>
                    <strong className="text-cyan-300 font-mono">{orderId}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/60">Reserved Package:</span>
                    <strong className="text-white">NutriBand Kit ({quantity}x) · Case, Cotton Strap, Fast USB Charger & Diaper Clip</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/60">Included Strap:</span>
                    <strong className="text-pink-300">{currentStrap.name} (Breathable Cotton)</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/60">Amount Paid:</span>
                    <strong className="text-emerald-300 font-bold">₹{finalTotal.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Dispatch Window:</span>
                    <strong className="text-white">Ships in 24 Hours (Express)</strong>
                  </div>
                </div>

                {/* VIP Perks activated */}
                <div className="max-w-md mx-auto p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-200 text-xs flex items-center gap-2.5 text-left">
                  <Sparkles className="w-5 h-5 text-cyan-300 shrink-0" />
                  <span>
                    <strong>Bonus Activated:</strong> 1-Year Tricky Toddlers Family License is now attached to your parent dashboard.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-3">
            {!isOrderPlaced ? (
              <>
                <button
                  onClick={() => {
                    playSound('click');
                    syncToBabyStoreCart();
                    onClose();
                    if (onOpenStoreCart) {
                      onOpenStoreCart();
                    }
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>View in Baby Store Basket</span>
                </button>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300 hover:from-cyan-300 hover:to-teal-200 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-xl shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-slate-950" />
                  <span>Confirm & Place Order (₹{finalTotal.toLocaleString('en-IN')})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="w-full flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  onClick={() => {
                    playSound('pop');
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-bold text-xs cursor-pointer transition-all active:scale-95"
                >
                  Continue Exploring NutriBand
                </button>

                {onOpenStoreCart && (
                  <button
                    onClick={() => {
                      playSound('click');
                      onClose();
                      onOpenStoreCart();
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Open Baby Store Cart</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
