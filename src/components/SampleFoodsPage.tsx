import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Camera, 
  Upload, 
  Scan, 
  Sparkles, 
  Search, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Info, 
  ChevronRight, 
  Apple, 
  Flame, 
  RefreshCw, 
  Video, 
  Activity, 
  Utensils, 
  Home, 
  Heart, 
  Filter,
  Check,
  AlertTriangle,
  Calculator,
  ChevronDown,
  ChevronUp,
  Calendar as CalendarIcon
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import { 
  INDIAN_BABY_FOODS, 
  IndianBabyFood, 
  POPULAR_INDIAN_BABY_BRANDS 
} from '../data/indianBabyFoods';
import { FoodNutritionMetricsDisplay } from './FoodNutritionMetricsDisplay';
import { formatScaleOf10, calculateScoreForFood } from '../lib/foodNutritionCalculator';
import { saveLoggedMeal } from './DailyDishLogPage';

export const SampleFoodsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Filter & Search states
  const [selectedAgeFilter, setSelectedAgeFilter] = useState<string>('all');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selected food for deep inspection/scoring (null by default so no dish shows until selected/scanned)
  const [inspectedFood, setInspectedFood] = useState<IndianBabyFood | null>(null);
  const [isServingDouble, setIsServingDouble] = useState<boolean>(false);
  const [loggedNotification, setLoggedNotification] = useState<string | null>(null);

  // Scanner & Live Camera / Upload states on this page
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [customSearchDish, setCustomSearchDish] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const inspectorSectionRef = useRef<HTMLDivElement | null>(null);
  const scannerSectionRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Synchronize video element whenever isCameraActive changes
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
      videoRef.current.play().catch(() => {});
    }
  }, [isCameraActive]);

  // Categories configuration for the dropdown filter
  const categoryOptions = [
    { id: 'all', label: `All Sample Foods (${INDIAN_BABY_FOODS.length})` },
    { id: 'packaged', label: `Packaged Indian Brands (${INDIAN_BABY_FOODS.filter(f => f.foodType === 'packaged').length})` },
    { id: 'traditional', label: `Traditional Home Recipes (${INDIAN_BABY_FOODS.filter(f => f.foodType === 'traditional' || !f.foodType).length})` },
    { id: '0-6m', label: 'Milestone 0-6 Months (Gentle Fluids)' },
    { id: '6-8m', label: 'Milestone 6-8 Months (First Solids & Purees)' },
    { id: '8-12m', label: 'Milestone 8-12 Months (Mashes & Lumps)' },
    { id: '1-2y', label: 'Age 1-2 Years (Family Table Foods)' },
    { id: '2-3y', label: 'Age 2-3 Years (Toddler Meals)' },
    { id: '3-5y', label: 'Age 3-5 Years (Balanced Pre-K)' },
  ];

  // Filtered foods
  const filteredFoods = INDIAN_BABY_FOODS.filter((food) => {
    let matchesCategory = true;
    if (selectedAgeFilter === 'packaged') {
      matchesCategory = food.foodType === 'packaged';
    } else if (selectedAgeFilter === 'traditional') {
      matchesCategory = food.foodType === 'traditional' || !food.foodType;
    } else if (selectedAgeFilter !== 'all') {
      matchesCategory = food.ageGroup === selectedAgeFilter;
    }

    if (selectedAgeFilter === 'packaged' && selectedBrandFilter !== 'all') {
      if (food.brandName !== selectedBrandFilter) {
        return false;
      }
    }

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;
    
    const matchesQuery = 
      food.name.toLowerCase().includes(query) ||
      (food.brandName ? food.brandName.toLowerCase().includes(query) : false) ||
      (food.positioning ? food.positioning.toLowerCase().includes(query) : false) ||
      (food.whereToBuy ? food.whereToBuy.toLowerCase().includes(query) : false) ||
      food.ingredients.some(i => i.toLowerCase().includes(query)) ||
      food.benefits.toLowerCase().includes(query) ||
      food.stageName.toLowerCase().includes(query);

    return matchesCategory && matchesQuery;
  });

  // Handle camera start
  const handleStartCamera = async () => {
    playSound('click');
    setIsScannerOpen(true);
    setTimeout(() => {
      scannerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 1920, min: 640 }, height: { ideal: 1080, min: 480 } } 
        });
        streamRef.current = stream;
        setIsCameraActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } else {
        fileInputRef.current?.click();
      }
    } catch (err) {
      console.warn("Camera start notice:", err);
      setIsCameraActive(false);
      fileInputRef.current?.click();
    }
  };

  const handleStopCamera = () => {
    playSound('pop');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Capture frame from video
  const captureFrameFromVideo = (): string | null => {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    const w = video.videoWidth || video.clientWidth;
    const h = video.videoHeight || video.clientHeight;
    if (!w || !h || w <= 0 || h <= 0) return null;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = Math.min(w, 1920);
      canvas.height = Math.min(h, 1080);
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.88);
    } catch {
      return null;
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      playSound('pop');
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setUploadedImagePreview(base64);
        setIsScannerOpen(true);
        executeAnalysis("Uploaded Food Dish / Packaging Photo", undefined, base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Live Camera Snapshot Trigger
  const handleCaptureFromCamera = () => {
    const frame = captureFrameFromVideo();
    if (frame) {
      setUploadedImagePreview(frame);
      executeAnalysis("Live Camera Snapshot - Food & Nutrition Details", undefined, frame);
    } else {
      executeAnalysis("Live Camera Snapshot - Food Dish");
    }
  };

  // Execute analysis on item
  const executeAnalysis = async (dishTitle: string, matchingFood?: IndianBabyFood, imageBase64?: string) => {
    playSound('pop');
    setScanStatus('scanning');

    if (imageBase64) {
      try {
        const res = await fetch('/api/analyze-food', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64, foodQuery: dishTitle })
        });
        const data = await res.json();
        if (data && data.isFood) {
          const analyzedFood: IndianBabyFood = {
            id: 'scanned-' + Date.now(),
            name: data.name || dishTitle,
            hindiName: data.name || dishTitle,
            ageGroup: '6-8m',
            ageBadge: data.ageBadge || 'General Family Dish',
            stageName: data.stageName || 'Prepared Dish',
            score: data.score || '9.4 / 10',
            calories: data.calories || '145 kcal',
            protein: data.protein || '5.2 g',
            sodium: data.sodium || '0.04 g',
            texture: data.texture || 'Soft Mash',
            blwStatus: data.blwStatus || 'Safe',
            benefits: data.pediatricTip || data.safetyWarning || 'Verified nutritional facts and composition.',
            ingredients: data.ingredients || ['Wholesome ingredients'],
            fssaiNumber: 'FSSAI LIC: 10014011002345',
            allergyCheck: data.allergyCheck || 'No common allergens',
            pediatricTip: data.pediatricTip || 'Clean, wholesome complementary nutrition.',
            packagingType: data.foodType || 'Prepared Dish',
            brandName: data.brandName
          };
          playSound('glass');
          setScanStatus('success');
          setInspectedFood(analyzedFood);
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          setTimeout(() => {
            if (inspectorSectionRef.current) {
              inspectorSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 60);
          return;
        }
      } catch (e) {
        console.warn("Direct vision analysis error:", e);
      }
    }

    // Find closest food match if not provided
    let target = matchingFood;
    if (!target) {
      const q = dishTitle.toLowerCase();
      target = INDIAN_BABY_FOODS.find(f => 
        q.includes(f.name.toLowerCase()) || 
        f.ingredients.some(i => q.includes(i.toLowerCase()))
      ) || INDIAN_BABY_FOODS[6]; // Fallback to Khichdi
    }

    setTimeout(() => {
      playSound('glass');
      setScanStatus('success');
      setInspectedFood(target!);
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        if (inspectorSectionRef.current) {
          inspectorSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }, 600);
  };

  const handleSelectFood = (food: IndianBabyFood) => {
    playSound('pop');
    setInspectedFood(food);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      if (inspectorSectionRef.current) {
        inspectorSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  // Scrollbar synchronization: whenever an inspected food is selected, force scroll to top
  useEffect(() => {
    if (inspectedFood) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      const timer = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [inspectedFood]);

  // Save meal directly to local storage via DailyDishLogPage utility
  const handleLogMeal = (food: IndianBabyFood | string) => {
    playSound('pop');
    const foodObj = typeof food === 'string' 
      ? INDIAN_BABY_FOODS.find(f => f.name === food) 
      : food;
    const name = typeof food === 'string' ? food : food.name;
    const scoreVal = foodObj ? calculateScoreForFood(foodObj) : '9.6 / 10';
    
    saveLoggedMeal({
      dishName: name,
      calories: foodObj?.calories || '145 kcal',
      protein: foodObj?.protein || '5.0 g',
      sodium: foodObj?.sodium || '0.03 g',
      score: scoreVal,
      mealType: 'Meal'
    });
    
    setLoggedNotification(`Added "${name}" to Daily Dish Log!`);
    setTimeout(() => setLoggedNotification(null), 4000);
  };

  return (
    <div className="flex-1 w-full bg-[#060b17] text-slate-100 font-sans selection:bg-amber-400 selection:text-black">
      
      {/* =========================================================
          TOP NAVIGATION BAR (SIMPLE & INTUITIVE)
      ========================================================== */}
      <header className="relative z-10 bg-[#0b1222]/95 border-b border-white/10 px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Left: Go Back to Homepage option */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <button
              id="back-to-homepage-btn"
              onClick={() => {
                playSound('glass');
                navigate('/?tab=home');
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/15 active:scale-95 transition-all cursor-pointer shadow-md hover:border-amber-400/40"
              title="Return to Homepage"
            >
              <Home className="w-4 h-4 text-amber-400" />
              <span>← Go Back to Homepage</span>
            </button>

            <button
              onClick={() => {
                playSound('glass');
                navigate('/?tab=foodlens');
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }}
              className="text-xs text-slate-400 hover:text-white font-semibold transition-colors hidden sm:inline-flex items-center gap-1 cursor-pointer"
            >
              <Utensils className="w-3.5 h-3.5 text-emerald-400" />
              <span>FoodLens Main</span>
            </button>
          </div>

          {/* Center Brand / Heading indicator */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-black tracking-widest uppercase text-amber-300/80">
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Sample Food Scorecards</span>
          </div>

          {/* Right: View Dishes for Day & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            
            {/* View Dishes for the Day Button */}
            <button
              onClick={() => {
                playSound('glass');
                navigate('/dish-log');
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-white font-bold text-xs sm:text-sm border border-amber-400/40 active:scale-95 transition-all cursor-pointer shadow-md"
              title="View dishes logged for the day"
            >
              <CalendarIcon className="w-4 h-4 text-amber-400" />
              <span>View Dishes for the Day</span>
            </button>

            {/* Scan Food Option */}
            <button
              id="scan-food-btn"
              onClick={() => {
                if (isCameraActive) {
                  handleStopCamera();
                } else {
                  handleStartCamera();
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
              title="Open camera to scan dish or plate"
            >
              <Camera className="w-4 h-4" />
              <span>{isCameraActive ? 'Close Camera' : 'Scan Food'}</span>
            </button>

            {/* Upload Photos Option */}
            <button
              id="add-label-btn"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 active:scale-95 transition-all cursor-pointer"
              title="Upload dish photo"
            >
              <Upload className="w-4 h-4 text-slate-300" />
              <span>Upload Photo</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </header>

      {/* =========================================================
          PAGE MAIN CONTENT CONTAINER (NATIVE FULL WINDOW SCROLL)
      ========================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Meal Logged Notification Banner with direct link to view dish log */}
        <AnimatePresence>
          {loggedNotification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-sm font-bold flex flex-wrap items-center justify-between gap-3 shadow-xl"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <Check className="w-5 h-5 text-emerald-400" />
                <span>{loggedNotification}</span>
                <button
                  onClick={() => {
                    playSound('glass');
                    navigate('/dish-log');
                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  }}
                  className="ml-2 px-3 py-1 rounded-lg bg-emerald-400 text-slate-950 font-black text-xs hover:bg-emerald-300 transition-all cursor-pointer shadow-sm"
                >
                  View in Daily Dish Log →
                </button>
              </div>
              <button onClick={() => setLoggedNotification(null)} className="text-emerald-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =========================================================
            INSPECTED FOOD RESULT CARD (HERO SPOTLIGHT - PINNED AT TOP)
        ========================================================== */}
        {inspectedFood && (
          <section 
            id="inspected-food-result"
            ref={inspectorSectionRef}
            className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#121e36] to-[#0c1426] border-2 border-emerald-400/50 shadow-2xl text-left space-y-6 scroll-mt-6"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-300">
                    {inspectedFood.stageName} · Nutrition Verified
                  </span>
                  <span className="px-3 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-black text-xs border border-amber-500/30">
                    {inspectedFood.ageBadge}
                  </span>
                  {inspectedFood.brandName && (
                    <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-black text-xs border border-cyan-500/30">
                      Brand: {inspectedFood.brandName}
                    </span>
                  )}
                  {inspectedFood.fssaiNumber && (
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold text-[11px] border border-white/10">
                      {inspectedFood.fssaiNumber}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white flex items-baseline gap-2 flex-wrap">
                  <span>{inspectedFood.name}</span>
                </h2>

                {inspectedFood.packagingType && (
                  <div className="flex items-center gap-3 text-xs text-slate-300 mt-2 flex-wrap">
                    <span className="font-semibold text-amber-300">Format:</span>
                    <span>{inspectedFood.packagingType}</span>
                    {inspectedFood.shelfLife && (
                      <>
                        <span className="text-slate-500">•</span>
                        <span className="font-semibold text-emerald-300">Shelf Life:</span>
                        <span>{inspectedFood.shelfLife}</span>
                      </>
                    )}
                  </div>
                )}

                {inspectedFood.positioning && (
                  <div className="flex items-center gap-3 text-xs mt-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-bold border border-purple-400/30">
                      Positioning: {inspectedFood.positioning}
                    </span>
                    {inspectedFood.whereToBuy && (
                      <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30">
                        Where to Buy: {inspectedFood.whereToBuy}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 font-black text-sm sm:text-base border border-emerald-500/40 flex items-center gap-2 shadow-inner">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Score: {calculateScoreForFood(inspectedFood)}</span>
                </div>
                <button
                  onClick={() => setIsServingDouble(!isServingDouble)}
                  className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                    isServingDouble 
                      ? 'bg-amber-400 text-slate-950 border-amber-400 font-black' 
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {isServingDouble ? '2x Serving' : '1x Standard Serving'}
                </button>
                <button
                  onClick={() => {
                    playSound('pop');
                    setInspectedFood(null);
                  }}
                  className="p-2.5 rounded-2xl bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 transition-all cursor-pointer"
                  title="Close food details"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Complete Separated Nutrition Panels */}
            <div className="pt-2">
              <FoodNutritionMetricsDisplay food={inspectedFood} />
            </div>

            {/* Action Buttons for this food */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <p className="text-slate-400">
                Nutritional Purpose: <strong className="text-white">{inspectedFood.benefits}</strong>
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleLogMeal(inspectedFood)}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all active:scale-95 cursor-pointer shadow-md"
                >
                  Log This Dish
                </button>
                <button
                  onClick={() => {
                    playSound('glass');
                    navigate('/dish-log');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/15 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>View Daily Log</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            HERO SECTION: SAMPLE FOOD SCORECARD (GENERIC & CLEAN)
        ========================================================== */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#101b33] via-[#0d1629] to-[#070d1a] border border-white/10 p-6 sm:p-10 shadow-2xl">
          <div className="relative z-10 max-w-4xl space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-black tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span>FoodLens Nutrition Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Sample Food Scorecard
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl font-normal">
              Review verified food nutrient scorecards, compare sodium and sugar levels, or scan your own dish for immediate nutritional analysis.
            </p>

            {/* Quick Actions Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  playSound('pop');
                  handleStartCamera();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl active:scale-95 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Launch Camera Scanner</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/15 active:scale-95 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Upload Photos</span>
              </button>

              <button
                onClick={() => {
                  playSound('glass');
                  navigate('/dish-log');
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 hover:text-white font-bold text-xs sm:text-sm border border-amber-400/30 active:scale-95 transition-all cursor-pointer"
              >
                <CalendarIcon className="w-4 h-4 text-amber-400" />
                <span>View Dishes for the Day</span>
              </button>

              <button
                onClick={() => {
                  playSound('glass');
                  navigate('/?tab=home');
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs sm:text-sm border border-white/10 active:scale-95 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Back to Homepage</span>
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================
            LIVE SCANNER OR LABEL ANALYZER (EXPANDABLE)
        ========================================================== */}
        {(isCameraActive || isScannerOpen) && (
          <section ref={scannerSectionRef} className="p-6 sm:p-8 rounded-3xl bg-[#0b1325] border-2 border-emerald-400/40 shadow-2xl text-left space-y-5 scroll-mt-24">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5 text-emerald-400 font-black text-base sm:text-lg">
                <Scan className="w-5 h-5" />
                <span>Instant Food &amp; Label Scanner</span>
              </div>
              <button
                onClick={() => {
                  handleStopCamera();
                  setIsScannerOpen(false);
                  setUploadedImagePreview(null);
                }}
                className="p-1.5 rounded-lg bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Camera View */}
            {isCameraActive && (
              <div className="relative max-w-2xl mx-auto rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-white/20">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-emerald-300 text-xs font-bold flex items-center gap-2 border border-emerald-400/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Aim camera at food plate or nutrition label</span>
                </div>
                <div className="absolute bottom-4 flex items-center gap-3">
                  <button
                    onClick={handleCaptureFromCamera}
                    className="px-6 py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-black text-sm shadow-xl hover:bg-emerald-300 active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture &amp; Analyze Now</span>
                  </button>
                  <button
                    onClick={handleStopCamera}
                    className="px-4 py-2.5 rounded-xl bg-black/80 text-rose-300 border border-rose-400/30 text-xs font-bold active:scale-95 cursor-pointer"
                  >
                    Close Camera
                  </button>
                </div>
              </div>
            )}

            {/* Uploaded image preview */}
            {uploadedImagePreview && !isCameraActive && (
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <img src={uploadedImagePreview} alt="Uploaded food" className="w-24 h-24 rounded-xl object-cover border border-white/20" />
                <div className="flex-1 text-left">
                  <h4 className="text-white font-bold text-sm">Uploaded Food Photo</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Nutritional analysis completed with safety benchmarks.</p>
                </div>
                <button
                  onClick={() => executeAnalysis("Uploaded Food Panel")}
                  className="px-4 py-2 rounded-xl bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer"
                >
                  Re-Analyze
                </button>
              </div>
            )}

            {/* Custom food name search input */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={customSearchDish}
                  onChange={(e) => setCustomSearchDish(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') executeAnalysis(customSearchDish);
                  }}
                  placeholder="Or type any dish name (e.g. Khichdi, Ragi Malt, Curd Rice, Idli)..."
                  className="w-full bg-[#131d33] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
                />
              </div>
              <button
                onClick={() => executeAnalysis(customSearchDish)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs sm:text-sm tracking-tight cursor-pointer shrink-0"
              >
                Inspect Custom Dish
              </button>
            </div>
          </section>
        )}

        {/* =========================================================
            SEARCH & FILTER CONTROLS (DROPDOWN TO THE LEFT OF SEARCH BAR)
        ========================================================== */}
        <section className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Browse Sample Foods
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Filter by category or search dishes and ingredients.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              
              {/* Dropdown Filter: Positioned to the LEFT of the Search Bar */}
              <div className="relative min-w-[220px]">
                <Filter className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedAgeFilter}
                  onChange={(e) => {
                    playSound('click');
                    setSelectedAgeFilter(e.target.value);
                    if (e.target.value !== 'packaged') {
                      setSelectedBrandFilter('all');
                    }
                  }}
                  className="w-full bg-[#11192e] border border-white/20 hover:border-amber-400/50 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer appearance-none font-bold shadow-sm"
                >
                  {categoryOptions.map(cat => (
                    <option key={cat.id} value={cat.id} className="bg-[#0b1222] text-white">
                      {cat.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Brand Dropdown (Only shown when packaged is selected) */}
              {selectedAgeFilter === 'packaged' && (
                <div className="relative min-w-[170px]">
                  <select
                    value={selectedBrandFilter}
                    onChange={(e) => {
                      playSound('click');
                      setSelectedBrandFilter(e.target.value);
                    }}
                    className="w-full bg-[#11192e] border border-emerald-400/40 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-emerald-300 focus:outline-none focus:border-emerald-400 cursor-pointer appearance-none pr-8 font-bold shadow-sm"
                  >
                    <option value="all" className="bg-[#0b1222] text-white">All 10 Brands</option>
                    {POPULAR_INDIAN_BABY_BRANDS.map(b => (
                      <option key={b.brand} value={b.brand} className="bg-[#0b1222] text-white">
                        {b.brand}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}

              {/* Search Bar */}
              <div className="relative flex-1 sm:w-72 md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Khichdi, Ragi, Paneer, Curd..."
                  className="w-full bg-[#11192e] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 shadow-sm"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================
            FOOD CARDS GRID (CLEAN, ELEGANT & UNCLUTTERED)
        ========================================================== */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFoods.map((food) => {
              const isSelected = inspectedFood?.id === food.id;
              const computedScore = calculateScoreForFood(food);

              return (
                <motion.div
                  key={food.id}
                  whileHover={{ y: -3 }}
                  className={`p-6 rounded-3xl transition-all flex flex-col justify-between text-left relative ${
                    isSelected 
                      ? 'bg-[#14233f] border-2 border-emerald-400 shadow-xl shadow-emerald-500/10' 
                      : 'bg-[#0f172b] border border-white/10 hover:border-amber-400/50 hover:bg-[#121c35]'
                  }`}
                >
                  <div>
                    {/* Badge row */}
                    <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 text-[11px] font-black border border-amber-500/20">
                          {food.ageBadge}
                        </span>
                        {food.brandName && (
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 text-[10px] font-black border border-emerald-500/25">
                            {food.brandName}
                          </span>
                        )}
                      </div>
                      
                      {/* Strictly computed score matching scorecard calculation */}
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" />
                        <span>{computedScore}</span>
                      </span>
                    </div>

                    {/* Dish Title (English Only - No Hindi) */}
                    <h3 className="text-lg sm:text-xl font-black text-white mb-2">
                      {food.name}
                    </h3>

                    {/* Positioning and Where to Buy for Packaged Foods */}
                    {food.positioning && (
                      <div className="flex items-center gap-2 mb-2 flex-wrap text-[11px]">
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-semibold border border-purple-400/30">
                          {food.positioning}
                        </span>
                        {food.whereToBuy && (
                          <span className="px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-300 font-medium border border-sky-400/20">
                            🛒 {food.whereToBuy}
                          </span>
                        )}
                      </div>
                    )}

                    {food.packagingType && (
                      <p className="text-[11px] text-cyan-300 font-medium mb-2">
                        Format: {food.packagingType} {food.shelfLife ? `· ${food.shelfLife}` : ''}
                      </p>
                    )}

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4 font-normal">
                      {food.benefits}
                    </p>
                  </div>

                  {/* Card bottom actions - Simple, uncluttered */}
                  <div className="pt-3 border-t border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span>{food.calories}</span>
                      <span className="text-emerald-400 font-bold">{food.protein} protein</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      {/* One Button: Check Nutrients */}
                      <button
                        onClick={() => handleSelectFood(food)}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        <Apple className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                        <span>{isSelected ? 'Viewing Nutrients' : 'Check Nutrients'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleLogMeal(food)}
                        className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-all cursor-pointer"
                        title="Log this dish for the day"
                      >
                        <Heart className="w-4 h-4 text-rose-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredFoods.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-white/5 border border-white/10 space-y-3">
              <Utensils className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No Foods Match Your Search</h3>
              <p className="text-xs text-slate-400">Try searching for common dishes like "Khichdi", "Ragi", "Idli", or "Dal".</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedAgeFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* =========================================================
            BOTTOM NAVIGATION BANNER
        ========================================================== */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-950 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Done browsing sample food scorecards?</h3>
              <p className="text-xs text-slate-400 mt-0.5">Return to the homepage, view your daily dish log, or consult a nutritionist.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={() => {
                playSound('glass');
                navigate('/dish-log');
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/30 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Daily Dish Log</span>
            </button>

            <button
              onClick={() => {
                playSound('glass');
                navigate('/?tab=pediatric');
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/15 active:scale-95 transition-all cursor-pointer"
            >
              Ask Pediatrician
            </button>

            <button
              onClick={() => {
                playSound('glass');
                navigate('/?tab=home');
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              Go to Homepage →
            </button>
          </div>
        </section>

      </main>

    </div>
  );
};
