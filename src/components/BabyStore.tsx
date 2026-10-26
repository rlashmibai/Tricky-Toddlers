import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Star, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  Check, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Heart, 
  Clock, 
  CheckCircle,
  Eye,
  Tag,
  Gift,
  HelpCircle,
  MapPin,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Share2,
  Bookmark,
  Package,
  Shield,
  Percent,
  Info,
  ArrowUpDown
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import { useLanguage } from '../lib/LanguageContext';

import { Product, PRODUCTS } from "../data/storeProducts";
export type { Product };
export { PRODUCTS };

export interface CartItem {
  product: Product;
  quantity: number;
  isGift?: boolean;
}

export interface BabyStoreProps {
  onGoHome?: () => void;
  initialView?: "catalog" | "cart";
}

const AGE_FILTERS = [
  { id: "all", label: "All Ages" },
  { id: "0-6m", label: "0 - 6 Months" },
  { id: "6-12m", label: "6 - 12 Months" },
  { id: "12-24m", label: "12 - 24 Months" },
  { id: "2-3y", label: "2 - 3 Years" },
  { id: "3y+", label: "3+ Years" },
];

const CATEGORIES = [
  "All",
  "Clothing & Bedding",
  "Diapering & Bathing",
  "Feeding & Gear",
  "Toys & Play"
];

export const BabyStore: React.FC<BabyStoreProps> = ({ onGoHome, initialView = 'catalog' }) => {
  const { t } = useLanguage();
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'bestseller'>('price-asc');
  
  // View mode: 'catalog' | 'cart'
  const [viewMode, setViewMode] = useState<'catalog' | 'cart'>(initialView);

  useEffect(() => {
    if (initialView) {
      setViewMode(initialView);
    }
  }, [initialView]);

  // Cart state stored in local storage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('tricky_toddler_cart_v3');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Saved for later items
  const [savedForLater, setSavedForLater] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('tricky_toddler_saved_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [pincode, setPincode] = useState<string>('400001');
  const [isGiftOrder, setIsGiftOrder] = useState<boolean>(false);
  const [isEmiExpanded, setIsEmiExpanded] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');

  // Checkout address form
  const [addressName, setAddressName] = useState('Lashmi');
  const [addressStreet, setAddressStreet] = useState('Flat 402, Lotus Heights, Bandra West');
  const [addressCity, setAddressCity] = useState('Mumbai, Maharashtra');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');

  useEffect(() => {
    localStorage.setItem('tricky_toddler_cart_v3', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('tricky_toddler_saved_cart', JSON.stringify(savedForLater));
  }, [savedForLater]);

  const addToCart = (product: Product, quantityToAdd = 1) => {
    playSound('pop');
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantityToAdd;
        return updated;
      }
      return [...prev, { product, quantity: quantityToAdd, isGift: false }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    playSound('click');
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string) => {
    playSound('glass');
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const toggleGiftItem = (productId: string) => {
    setCart((prev) => 
      prev.map(item => item.product.id === productId ? { ...item, isGift: !item.isGift } : item)
    );
  };

  const handleSaveForLater = (product: Product) => {
    playSound('pop');
    // Remove from cart
    setCart((prev) => prev.filter((item) => item.product.id !== product.id));
    // Add to saved for later
    setSavedForLater((prev) => {
      if (prev.some(item => item.product.id === product.id)) return prev;
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleMoveToCart = (product: Product) => {
    playSound('pop');
    setSavedForLater((prev) => prev.filter((item) => item.product.id !== product.id));
    addToCart(product, 1);
  };

  const handleRemoveFromSaved = (productId: string) => {
    playSound('glass');
    setSavedForLater((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  // All listed prices are inclusive of GST!
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 499;
  const isFreeDelivery = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0;
  const amountNeededForFreeDelivery = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const shippingFee = (cartSubtotal > 0 && cartSubtotal < freeShippingThreshold) ? 79 : 0;
  const grandTotal = cartSubtotal + shippingFee;

  const handleCompleteOrder = () => {
    playSound('glass');
    const newOrderId = 'TT-ORD-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(newOrderId);
    setIsCheckoutSuccess(true);
    setIsCheckoutModalOpen(false);
    setCart([]);
  };

  // Remove all NutriBand-related products from Baby Store page only
  const BABY_STORE_PRODUCTS = PRODUCTS.filter(
    (p) => !p.id.startsWith('nb-') && !p.name.toLowerCase().includes('nutriband')
  );

  const filteredProducts = BABY_STORE_PRODUCTS.filter((p) => {
    const matchesAge = selectedAge === 'all' || p.ageRange === selectedAge || (p.supportedAges && p.supportedAges.includes(selectedAge));
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAge && matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'bestseller') return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
    return a.price - b.price;
  });

  // Recommended products (items not currently in cart and excluding NutriBand)
  const cartProductIds = new Set(cart.map(c => c.product.id));
  const recommendedProducts = BABY_STORE_PRODUCTS.filter(p => !cartProductIds.has(p.id)).slice(0, 4);

  // Helper date for delivery string
  const getDeliveryDateString = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  // =========================================================================
  // VIEW 1: FULL PAGE SHOPPING CART
  // =========================================================================
  if (viewMode === 'cart') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-white font-sans">
        {/* Top Header & Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <button
            onClick={() => {
              playSound('click');
              setViewMode('catalog');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/15 shadow-md transition-all active:scale-95 group"
          >
            <ArrowLeft className="w-4 h-4 text-cheerful-yellow group-hover:-translate-x-1 transition-transform" />
            <span>← Continue Shopping & Explore Catalog</span>
          </button>

          <div className="flex items-center gap-3 text-xs text-white/60">
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-emerald-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Safe Checkout</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-white/70">
              <MapPin className="w-3.5 h-3.5 text-cheerful-yellow" />
              <span>Deliver to: <strong>Mumbai {pincode}</strong></span>
            </div>
          </div>
        </div>

        {/* Order Confirmed Banner (if placed) */}
        {isCheckoutSuccess ? (
          <div className="bg-gradient-to-br from-emerald-950/80 to-slate-900/90 border border-emerald-400/40 rounded-3xl p-8 text-center max-w-2xl mx-auto shadow-2xl space-y-5 my-8">
            <div className="w-20 h-20 rounded-full bg-emerald-400 text-black flex items-center justify-center mx-auto shadow-xl shadow-emerald-400/30">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>
            <span className="px-4 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-black tracking-widest uppercase border border-emerald-400/30 inline-block">
              Order Placed Successfully!
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Thank You For Your Order!</h2>
            <div className="bg-black/30 border border-white/10 rounded-2xl p-4 max-w-md mx-auto text-left space-y-1.5 text-xs text-white/80">
              <div className="flex justify-between">
                <span className="text-white/50">Order Reference:</span>
                <span className="font-mono font-black text-cheerful-yellow">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Delivery Address:</span>
                <span className="font-bold">{addressName}, {addressCity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Estimated Arrival:</span>
                <span className="font-bold text-emerald-300">{getDeliveryDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Total Paid (GST Included):</span>
                <span className="font-bold text-white">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <p className="text-xs text-white/60 max-w-md mx-auto">
              We have dispatched your pediatric order details. You will receive an SMS and WhatsApp tracking update shortly.
            </p>
            <div className="pt-3">
              <button
                onClick={() => {
                  playSound('pop');
                  setIsCheckoutSuccess(false);
                  setViewMode('catalog');
                }}
                className="px-8 py-3.5 bg-gradient-to-r from-cheerful-yellow to-amber-400 text-black font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-transform"
              >
                Return to Store Catalog
              </button>
            </div>
          </div>
        ) : (
          /* Main 2-Column Cart Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8-column wide Cart Section */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
                {/* Cart Heading */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                      <span>Shopping Cart</span>
                      <span className="text-sm font-bold text-white/50 bg-white/10 px-3 py-1 rounded-full">
                        {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'}
                      </span>
                    </h1>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-white/40 hidden sm:block">
                    Price (Incl. of GST)
                  </div>
                </div>

                {/* Empty Cart State */}
                {cart.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/30">
                      <ShoppingBag className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Your Shopping Cart is empty</h3>
                    <p className="text-xs text-white/50 max-w-sm mx-auto">
                      Explore our 40+ pediatrician-approved essentials customized by age group in our store.
                    </p>
                    <button
                      onClick={() => {
                        playSound('click');
                        setViewMode('catalog');
                      }}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cheerful-yellow to-amber-400 text-black font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all inline-flex items-center gap-2"
                    >
                      <span>Shop Baby Products Now</span>
                    </button>
                  </div>
                ) : (
                  /* Cart Items List */
                  <div className="divide-y divide-white/10">
                    {cart.map(({ product, quantity, isGift }) => (
                      <div key={product.id} className="py-6 flex flex-col sm:flex-row gap-5 items-start">
                        {/* Product Image Thumbnail */}
                        <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-black/40 border border-white/10 shrink-0 group">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[9px] font-black text-emerald-300 uppercase tracking-wider">
                            {product.ageLabel}
                          </div>
                        </div>

                        {/* Middle Details Info */}
                        <div className="flex-1 min-w-0 space-y-2 text-left">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="text-sm sm:text-base font-black text-white leading-snug hover:text-cheerful-yellow transition-colors cursor-pointer">
                              {product.name}
                            </h3>
                            
                            {/* Mobile Price display */}
                            <div className="text-right sm:hidden shrink-0">
                              <div className="text-base font-black text-white">
                                ₹{(product.price * quantity).toLocaleString('en-IN')}
                              </div>
                              <span className="text-[10px] text-emerald-400 font-bold block">
                                (Incl. GST)
                              </span>
                            </div>
                          </div>

                          {/* In Stock Badge & Delivery */}
                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> In stock
                            </span>
                            <span className="text-white/40">•</span>
                            <span className="text-white/70">
                              FREE delivery <strong className="text-white">{getDeliveryDateString()}</strong>
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 font-bold text-[10px] border border-emerald-500/20">
                              ✓ Certified Safe
                            </span>
                          </div>

                          {/* Variant / Size */}
                          {product.colorOrSize && (
                            <div className="text-xs text-white/60">
                              <span className="text-white/40">Edition / Size: </span>
                              <span className="font-bold text-white/90">{product.colorOrSize}</span>
                            </div>
                          )}

                          {/* Gift Checkbox */}
                          <div className="flex items-center gap-2 text-xs text-white/70 pt-1">
                            <input
                              type="checkbox"
                              id={`gift-${product.id}`}
                              checked={!!isGift}
                              onChange={() => toggleGiftItem(product.id)}
                              className="rounded border-white/30 text-cheerful-yellow focus:ring-cheerful-yellow cursor-pointer"
                            />
                            <label htmlFor={`gift-${product.id}`} className="cursor-pointer">
                              This will be a gift <span className="text-cheerful-yellow underline text-[11px]">Learn more</span>
                            </label>
                          </div>

                          {/* Action Row: Quantity + Delete + Save for later + Share */}
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-3 text-xs">
                            {/* Quantity pill */}
                            <div className="flex items-center bg-black/40 border border-white/15 rounded-xl p-1 shadow-inner">
                              <button
                                onClick={() => updateQuantity(product.id, -1)}
                                className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="Decrease"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-3 font-black text-white text-xs">
                                {quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(product.id, 1)}
                                className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="Increase"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <span className="text-white/20">|</span>

                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="text-rose-400 hover:text-rose-300 font-bold transition-colors flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>

                            <span className="text-white/20">|</span>

                            <button
                              onClick={() => handleSaveForLater(product)}
                              className="text-white/60 hover:text-cheerful-yellow font-bold transition-colors flex items-center gap-1"
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                              <span>Save for later</span>
                            </button>

                            <span className="text-white/20">|</span>

                            <button
                              onClick={() => {
                                playSound('pop');
                                navigator.clipboard?.writeText(window.location.href);
                              }}
                              className="text-white/60 hover:text-white font-bold transition-colors flex items-center gap-1"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              <span>Share</span>
                            </button>
                          </div>
                        </div>

                        {/* Desktop Right Price Column */}
                        <div className="text-right hidden sm:block shrink-0 pl-4">
                          <div className="text-xl font-black text-white">
                            ₹{(product.price * quantity).toLocaleString('en-IN')}.00
                          </div>
                          {product.originalPrice && (
                            <div className="text-xs text-white/40 line-through">
                              ₹{(product.originalPrice * quantity).toLocaleString('en-IN')}.00
                            </div>
                          )}
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 mt-1 inline-block">
                            Incl. of 18% GST
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Saved for Later Section */}
              {savedForLater.length > 0 && (
                <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl text-left">
                  <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-cheerful-yellow" />
                    <span>Saved for Later ({savedForLater.length} {savedForLater.length === 1 ? 'item' : 'items'})</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedForLater.map(({ product }) => (
                      <div key={product.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex gap-3.5 items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-xl shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{product.name}</h4>
                          <div className="text-xs font-black text-cheerful-yellow mt-0.5">
                            ₹{product.price.toLocaleString('en-IN')}.00 <span className="text-[9px] text-emerald-400 font-bold">(Incl. GST)</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => handleMoveToCart(product)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-black text-[10px] uppercase tracking-wider transition-all"
                            >
                              Move to Cart
                            </button>
                            <button
                              onClick={() => handleRemoveFromSaved(product.id)}
                              className="text-rose-400 hover:text-rose-300 text-[11px] font-bold"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right 4-column Order Summary Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Order Summary & Proceed Card */}
              <div className="bg-slate-900/90 border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5 text-left relative lg:sticky lg:top-24">
                
                {/* Free Delivery Status Bar */}
                <div className="space-y-2 bg-black/40 p-3.5 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-emerald-300">
                      <Truck className="w-4 h-4 text-emerald-400" />
                      {isFreeDelivery ? 'FREE Delivery Qualified!' : 'Free Delivery Progress'}
                    </span>
                    <span className="text-white/70">
                      ₹{cartSubtotal} / ₹{freeShippingThreshold}
                    </span>
                  </div>
                  
                  {/* Progress bar line */}
                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${freeDeliveryProgress}%` }}
                    />
                  </div>

                  <div className="text-[11px] text-white/70 flex items-center gap-1.5">
                    {isFreeDelivery ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Your order qualifies for FREE Fast Delivery
                      </span>
                    ) : (
                      <span>
                        Add <strong>₹{amountNeededForFreeDelivery.toLocaleString('en-IN')}</strong> more for FREE delivery
                      </span>
                    )}
                  </div>
                </div>

                {/* Subtotal Calculation Box */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-base font-bold text-white/80">
                      Subtotal ({totalCartCount} items):
                    </span>
                    <span className="text-2xl font-black text-white tracking-tight">
                      ₹{cartSubtotal.toLocaleString('en-IN')}.00
                    </span>
                  </div>
                  
                  <div className="text-xs text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>All listed prices are inclusive of GST (No hidden taxes)</span>
                  </div>

                  {/* Delivery charge if below threshold */}
                  {!isFreeDelivery && cartSubtotal > 0 && (
                    <div className="flex justify-between text-xs text-white/70">
                      <span>Standard Delivery:</span>
                      <span className="font-bold text-white">₹{shippingFee}</span>
                    </div>
                  )}

                  {/* Gift option in sidebar */}
                  <div className="flex items-center gap-2 text-xs text-white/80 pt-1">
                    <input
                      type="checkbox"
                      id="sidebar-gift"
                      checked={isGiftOrder}
                      onChange={(e) => setIsGiftOrder(e.target.checked)}
                      className="rounded border-white/30 text-cheerful-yellow focus:ring-cheerful-yellow cursor-pointer"
                    />
                    <label htmlFor="sidebar-gift" className="cursor-pointer">
                      This order contains a personalized gift
                    </label>
                  </div>

                  {/* Big Proceed to Buy Button (Amazon gold style) */}
                  <button
                    disabled={cart.length === 0}
                    onClick={() => {
                      playSound('click');
                      setIsCheckoutModalOpen(true);
                    }}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Proceed to Buy ({totalCartCount} Items)</span>
                  </button>
                </div>

                {/* EMI Dropdown Accordion */}
                <div className="border-t border-white/10 pt-4">
                  <button
                    onClick={() => setIsEmiExpanded(!isEmiExpanded)}
                    className="w-full flex items-center justify-between text-xs font-bold text-white/80 hover:text-white transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-cheerful-yellow" />
                      <span>EMI & Zero-Interest Options Available</span>
                    </span>
                    {isEmiExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isEmiExpanded && (
                    <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-[11px] text-white/70">
                      <div className="flex justify-between">
                        <span>3-Month No Cost EMI:</span>
                        <strong className="text-white">₹{Math.round(grandTotal / 3).toLocaleString('en-IN')}/mo</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>6-Month Low Cost EMI:</span>
                        <strong className="text-white">₹{Math.round((grandTotal * 1.05) / 6).toLocaleString('en-IN')}/mo</strong>
                      </div>
                      <span className="text-[10px] text-white/40 block pt-1">
                        Supported across major Indian banks, credit cards & UPI autopay.
                      </span>
                    </div>
                  )}
                </div>

                {/* Secure Trust Badges */}
                <div className="pt-2 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-[10px] text-white/50">
                  <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
                    <Shield className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                    <span>Safe Payments</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
                    <Truck className="w-4 h-4 text-cheerful-yellow mx-auto mb-1" />
                    <span>Express 48h Dispatch</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
                    <Package className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                    <span>7-Day Return</span>
                  </div>
                </div>
              </div>

              {/* "Customers Who Bought Items in Your Cart Also Bought" */}
              <div className="bg-slate-900/70 border border-white/10 rounded-3xl p-5 shadow-xl text-left">
                <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cheerful-yellow" />
                  <span>Customers Also Bought</span>
                </h4>

                <div className="space-y-3">
                  {recommendedProducts.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 hover:border-white/20 transition-all"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">{item.name}</div>
                        <div className="flex items-center gap-1 text-[10px] text-cheerful-yellow">
                          <Star className="w-3 h-3 fill-cheerful-yellow" />
                          <span>{item.rating} ({item.reviewsCount})</span>
                        </div>
                        <div className="text-xs font-black text-white mt-0.5">
                          ₹{item.price.toLocaleString('en-IN')}{' '}
                          <span className="text-[9px] text-emerald-400 font-bold">(Incl. GST)</span>
                        </div>
                      </div>
                      <button
                        onClick={() => addToCart(item, 1)}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-black text-[10px] uppercase tracking-wider shrink-0 transition-transform active:scale-95"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Checkout Modal */}
        <AnimatePresence>
          {isCheckoutModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setIsCheckoutModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-slate-900 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-left space-y-5 relative max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-400 text-black">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">Express Checkout</h3>
                      <p className="text-xs text-white/50">Confirm shipping address & payment method</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsCheckoutModalOpen(false)}
                    className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Address Form */}
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-wider text-white/60 block">
                    1. Shipping Details
                  </label>
                  <input
                    type="text"
                    value={addressName}
                    onChange={(e) => setAddressName(e.target.value)}
                    placeholder="Recipient Full Name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white font-bold focus:border-cheerful-yellow outline-none"
                  />
                  <input
                    type="text"
                    value={addressStreet}
                    onChange={(e) => setAddressStreet(e.target.value)}
                    placeholder="Street Address, Apartment / Flat"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white font-bold focus:border-cheerful-yellow outline-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={addressCity}
                      onChange={(e) => setAddressCity(e.target.value)}
                      placeholder="City, State"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white font-bold focus:border-cheerful-yellow outline-none"
                    />
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Pincode"
                      maxLength={6}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white font-bold focus:border-cheerful-yellow outline-none"
                    />
                  </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-black uppercase tracking-wider text-white/60 block">
                    2. Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === 'upi'
                          ? 'bg-emerald-400/20 border-emerald-400 text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-white/60'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-emerald-300" />
                      <span>Instant UPI / QR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === 'card'
                          ? 'bg-emerald-400/20 border-emerald-400 text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-white/60'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-sky-300" />
                      <span>Credit / Debit Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === 'cod'
                          ? 'bg-emerald-400/20 border-emerald-400 text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-white/60'
                      }`}
                    >
                      <Truck className="w-4 h-4 text-amber-300" />
                      <span>Cash on Delivery</span>
                    </button>
                  </div>
                </div>

                {/* Total Summary Breakdown */}
                <div className="bg-black/40 p-4 rounded-2xl border border-white/10 space-y-1.5 text-xs">
                  <div className="flex justify-between text-white/70">
                    <span>Items Total ({totalCartCount} items):</span>
                    <span className="font-bold text-white">₹{cartSubtotal.toLocaleString('en-IN')}.00</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Shipping Charges:</span>
                    <span className="font-bold text-emerald-400">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Applicable GST:</span>
                    <span className="font-bold text-emerald-400">Included in Price</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-white/10">
                    <span>Final Payable Amount:</span>
                    <span className="text-emerald-300">₹{grandTotal.toLocaleString('en-IN')}.00</span>
                  </div>
                </div>

                {/* Submit Order */}
                <button
                  onClick={handleCompleteOrder}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-cheerful-yellow text-black font-black text-sm uppercase tracking-wider shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Confirm & Place Order (₹{grandTotal.toLocaleString('en-IN')})
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: PRODUCT STORE CATALOG (Default)
  // =========================================================================
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-4 font-sans">
      {/* Header Banner with Integrated Sleek Cart */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-teal-900/90 via-emerald-950/90 to-slate-900/90 border border-emerald-500/25 p-4 sm:p-6 mb-4 sm:mb-5 shadow-xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="max-w-2xl text-left">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-[11px] font-black tracking-wider uppercase">
                <Gift className="w-3.5 h-3.5 text-cheerful-yellow" />
                Baby Store • Essentials from ₹99
              </span>
              <span className="text-[11px] text-emerald-300/80 font-medium hidden sm:inline">
                • Pediatrician-approved • Free Delivery &gt; ₹499
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-1.5">
              Curated Essentials <span className="bg-gradient-to-r from-cheerful-yellow via-amber-300 to-emerald-300 bg-clip-text text-transparent">For Every Stage</span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium leading-relaxed">
              Pocket-friendly organic clothing, feeding gear, and development toys starting at just ₹99.
            </p>
          </div>

          {/* Elegant Compact Cart & Trust Pill */}
          <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => {
                playSound('click');
                setViewMode('cart');
              }}
              className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cheerful-yellow via-amber-300 to-amber-400 hover:from-amber-300 hover:to-yellow-200 text-black font-black text-xs shadow-lg shadow-amber-500/15 hover:scale-102 active:scale-95 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 fill-black" />
              <span>Cart</span>
              <span className="px-1.5 py-0.5 rounded-full bg-black text-cheerful-yellow text-[10px] font-black">
                {totalCartCount}
              </span>
              {cartSubtotal > 0 && (
                <span className="text-xs font-black border-l border-black/20 pl-1.5">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Age Group Selector Tabs */}
      <div className="mb-4 sm:mb-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-cheerful-yellow" />
            Select Baby Age Group
          </h3>
          <span className="text-[11px] text-white/60 font-medium">Showing {filteredProducts.length} items</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5 sm:gap-2">
          {AGE_FILTERS.map((age) => {
            const isSelected = selectedAge === age.id;
            return (
              <button
                key={age.id}
                onClick={() => {
                  playSound('click');
                  setSelectedAge(age.id);
                }}
                className={`py-2 px-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-black border-emerald-300 shadow-md shadow-emerald-500/20 scale-[1.02]'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-white/70 hover:text-white border-white/10'
                }`}
              >
                {age.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search, Category & Sort Filter Bar */}
      <div className="mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-slate-900/70 p-4 rounded-2xl border border-white/10 shadow-lg">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => {
                  playSound('click');
                  setSelectedCategory(category);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-cheerful-yellow text-black shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Sort selector */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] text-white/50 font-medium whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                playSound('click');
                setSortBy(e.target.value as any);
              }}
              className="bg-transparent text-xs text-white font-bold focus:outline-none cursor-pointer pr-1"
            >
              <option value="price-asc" className="bg-slate-900 text-white">Price: Low to High (From ₹99)</option>
              <option value="price-desc" className="bg-slate-900 text-white">Price: High to Low</option>
              <option value="rating" className="bg-slate-900 text-white">Customer Rating</option>
              <option value="bestseller" className="bg-slate-900 text-white">Bestsellers First</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search onesies, diapers, toys..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/40 font-medium focus:outline-none focus:border-emerald-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-white/10 space-y-3">
          <ShoppingBag className="w-12 h-12 text-white/30 mx-auto" />
          <h3 className="text-lg font-bold text-white">No products found</h3>
          <p className="text-xs text-white/50 max-w-sm mx-auto">
            Try adjusting your age filter or search term to discover more infant & toddler items.
          </p>
          <button
            onClick={() => {
              setSelectedAge('all');
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const inCartItem = cart.find((item) => item.product.id === product.id);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative bg-slate-900/80 hover:bg-slate-900/95 border border-white/10 hover:border-emerald-400/40 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between text-left"
              >
                {/* Top Image Section */}
                <div className="relative aspect-square w-full overflow-hidden bg-black/40">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />

                  {/* Age Tag Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-emerald-300 border border-emerald-400/30">
                      {product.ageLabel}
                    </span>
                    {product.isBestseller && (
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-400 text-black shadow-md">
                        ★ Bestseller
                      </span>
                    )}
                  </div>

                  {/* Quick View Button */}
                  <button
                    onClick={() => {
                      playSound('pop');
                      setQuickViewProduct(product);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-transform hover:scale-110 opacity-0 group-hover:opacity-100"
                    title="Quick Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Card Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/50 text-[11px] font-semibold">{product.category}</span>
                      <div className="flex items-center gap-1 text-cheerful-yellow font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-cheerful-yellow" />
                        <span>{product.rating}</span>
                        <span className="text-white/40 text-[10px]">({product.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Product Title */}
                    <h3 className="text-sm font-black text-white line-clamp-2 leading-snug group-hover:text-emerald-300 transition-colors">
                      {product.name}
                    </h3>

                    {/* Description preview */}
                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed font-medium">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing & GST Badge */}
                  <div className="pt-4 mt-3 border-t border-white/5 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-white">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-white/40 line-through">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 block mt-0.5">
                          (Incl. of all taxes / GST)
                        </span>
                      </div>
                      
                      <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        In Stock
                      </span>
                    </div>

                    {/* Action Add Button */}
                    {inCartItem ? (
                      <div className="flex items-center justify-between bg-emerald-500/20 border border-emerald-400/40 rounded-2xl p-1.5">
                        <button
                          onClick={() => updateQuantity(product.id, -1)}
                          className="p-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-black text-white px-2">
                          {inCartItem.quantity} in Cart
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, 1)}
                          className="p-1.5 rounded-xl bg-emerald-400 text-black hover:bg-emerald-300 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-slate-900 border border-white/20 rounded-3xl overflow-hidden shadow-2xl relative grid grid-cols-1 md:grid-cols-2 text-left"
            >
              {/* Product Image */}
              <div className="relative aspect-square md:aspect-auto bg-black/40">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-400 text-black shadow-md">
                    {quickViewProduct.ageLabel}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                    <span>{quickViewProduct.category}</span>
                    <button
                      onClick={() => setQuickViewProduct(null)}
                      className="p-1 rounded-full bg-white/10 text-white/70 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-lg font-black text-white leading-snug mb-2">
                    {quickViewProduct.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center text-cheerful-yellow">
                      <Star className="w-4 h-4 fill-cheerful-yellow" />
                      <span className="text-xs font-bold ml-1 text-white">{quickViewProduct.rating}</span>
                    </div>
                    <span className="text-white/40 text-xs">({quickViewProduct.reviewsCount} verified reviews)</span>
                  </div>

                  <p className="text-xs text-white/70 leading-relaxed mb-4">
                    {quickViewProduct.description}
                  </p>

                  {/* Highlights list */}
                  <div className="space-y-1.5 mb-4">
                    <div className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                      Product Highlights
                    </div>
                    {quickViewProduct.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-white/80">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & Add to Cart button */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-2xl font-black text-white">
                        ₹{quickViewProduct.price.toLocaleString('en-IN')}.00
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 block">
                        (Incl. of 18% GST)
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">
                      In Stock & Ready to Ship
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(quickViewProduct, 1);
                      setQuickViewProduct(null);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cheerful-yellow to-amber-400 text-black font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart & View Basket</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
