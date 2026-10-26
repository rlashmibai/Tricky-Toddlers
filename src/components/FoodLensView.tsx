import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Sparkles, 
  ShieldCheck, 
  Apple, 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  Scan, 
  Upload, 
  Search, 
  Check, 
  HelpCircle, 
  RefreshCw, 
  Info,
  ArrowDown,
  ArrowRight,
  User,
  Heart,
  Video,
  PhoneCall,
  Activity,
  X,
  SlidersHorizontal,
  ChevronRight,
  BookOpen,
  ExternalLink,
  RotateCcw,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playSound } from '../lib/sounds';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/LanguageContext';
import { INDIAN_BABY_FOODS, IndianBabyFood } from '../data/indianBabyFoods';
import { FoodNutritionMetricsDisplay } from './FoodNutritionMetricsDisplay';
import { formatScaleOf10, calculateScoreForFood } from '../lib/foodNutritionCalculator';
import { saveLoggedMeal } from './DailyDishLogPage';

interface StatTile {
  label: string;
  value: string;
  microTag: string;
  tone?: 'neutral' | 'positive' | 'warning' | 'caution';
}

interface ComparisonRow {
  capability: string;
  generalAI: string;
  foodlens: string;
}

interface FoodLensViewProps {
  onNavigateToPediatric?: () => void;
  onNavigateToNutriBand?: () => void;
  onNavigateToSampleFoods?: () => void;
}

export const FoodLensView: React.FC<FoodLensViewProps> = ({ 
  onNavigateToPediatric, 
  onNavigateToNutriBand,
  onNavigateToSampleFoods 
}) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  // Scanner state
  const [searchQuery, setSearchQuery] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [showScanPreview, setShowScanPreview] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'analyzed' | 'error'>('idle');
  const [capturedImagePreview, setCapturedImagePreview] = useState<string | null>(null);
  
  // Real Food Lens AI Analysis Result
  const [scanResult, setScanResult] = useState<{
    isFood: boolean;
    isBlurry?: boolean;
    errorMessage?: string;
    name: string;
    hindiName?: string;
    ageBadge: string;
    stageName: string;
    score: string;
    scoreNumber?: number;
    novaLevel: string;
    calories: string;
    protein: string;
    sodium: string;
    blwStatus: string;
    gumPinchTest: string;
    ingredients: string[];
    allergyCheck: string;
    pediatricTip: string;
    texture: string;
    safetyWarning?: string;
    isSafeForBaby: boolean;
    foodType?: string;
    brandName?: string;
  } | null>(null);
  
  const [loggedMealToast, setLoggedMealToast] = useState<string | null>(null);
  
  const fileInputBottomRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scanSectionRef = useRef<HTMLDivElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const handleLogScannedDish = () => {
    if (!scanResult) return;
    playSound('pop');
    saveLoggedMeal({
      dishName: scanResult.name,
      calories: scanResult.calories,
      protein: scanResult.protein,
      sodium: scanResult.sodium,
      score: scanResult.score,
      mealType: 'Meal'
    });
    setLoggedMealToast(`Added "${scanResult.name}" to Daily Dish Log!`);
    setTimeout(() => setLoggedMealToast(null), 3500);
  };

  // 12 Standardized Food Signals for Telemetry & Nutrition Section
  const statTiles: StatTile[] = [
    { label: "Overall Scope", value: "9.4 / 10", microTag: "Scale of 10", tone: "positive" },
    { label: "Calories", value: "310 kcal", microTag: "Energy density", tone: "neutral" },
    { label: "Protein", value: "5.5 g", microTag: "Growth amino acids", tone: "positive" },
    { label: "Carbohydrates", value: "43 g", microTag: "Complex carbs", tone: "neutral" },
    { label: "Added Sugar", value: "0.0 g", microTag: "Zero added sugar", tone: "positive" },
    { label: "Dietary Fiber", value: "3.4 g", microTag: "Prebiotic fiber", tone: "positive" },
    { label: "Bad Fat Content", value: "0.2 g", microTag: "Low trans & sat fats", tone: "positive" },
    { label: "Salt Content", value: "0.11 g", microTag: "Safe daily cap", tone: "positive" },
    { label: "Sodium", value: "45 mg", microTag: "Protected renal cap", tone: "positive" },
    { label: "Iron", value: "2.4 mg", microTag: "Cognitive support", tone: "positive" },
    { label: "Calcium", value: "110 mg", microTag: "Skeletal density", tone: "positive" },
    { label: "Zinc & Minerals", value: "1.1 mg", microTag: "Immune co-factor", tone: "positive" },
  ];

  // Comparison Table Data
  const comparisonData: ComparisonRow[] = [
    { capability: "Food image recognition", generalAI: "✓", foodlens: "✓" },
    { capability: "Nutrition analysis", generalAI: "✓", foodlens: "✓" },
    { capability: "Ingredient analysis", generalAI: "✓", foodlens: "✓" },
    { capability: "Allergen & safety analysis", generalAI: "Prompt-dependent", foodlens: "✓ Purpose-built" },
    { capability: "Remember your food profile", generalAI: "Conversation-based", foodlens: "✓ Persistent profile" },
    { capability: "Regional standards framework", generalAI: "Prompt-dependent", foodlens: "✓ India, U.S. & EU frameworks" },
    { capability: "Consistent health scoring", generalAI: "May vary by conversation", foodlens: "✓ Dedicated FOODLENS scoring" },
    { capability: `"Why this score?" factor breakdown`, generalAI: "Requires follow-up", foodlens: "✓ Built into the result" },
    { capability: "Highlight what matters most", generalAI: "Requires follow-up", foodlens: "✓ Highlighted automatically" },
    { capability: "Dietary compatibility", generalAI: "Prompt-dependent", foodlens: "✓ Profile-based" },
    { capability: "Smart food alternatives", generalAI: "Requires prompting", foodlens: "✓ Built into food journey" },
    { capability: "Smart food comparisons", generalAI: "Requires follow-up", foodlens: "✓" },
    { capability: "Scan → Analyze → Decide flow", generalAI: "Not purpose-built", foodlens: "✓ Designed specifically for food" },
    { capability: "Food-focused interface", generalAI: "General-purpose chat", foodlens: "✓ Purpose-built" },
    { capability: "Personalized food experience", generalAI: "Conversation-dependent", foodlens: "✓ Profile-driven" },
    { capability: "Nutrition → Ingredients → Score details", generalAI: "Separate prompts needed", foodlens: "✓ Connected experience" },
  ];

  const scrollToScanner = () => {
    playSound('click');
    scanSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (!isCameraActive) {
      handleStartCamera();
    }
  };

  const scrollToSection = (id: string) => {
    playSound('click');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Camera Handlers
  const handleStartCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: cameraFacing, width: { ideal: 1920, min: 640 }, height: { ideal: 1080, min: 480 } }
        });
        mediaStreamRef.current = stream;
        setIsCameraActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }
    } catch (e) {
      console.log("Camera access notice:", e);
      setIsCameraActive(false);
    }
  };

  const handleStopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Synchronize video element whenever isCameraActive changes or mounts
  useEffect(() => {
    if (isCameraActive && videoRef.current && mediaStreamRef.current) {
      if (videoRef.current.srcObject !== mediaStreamRef.current) {
        videoRef.current.srcObject = mediaStreamRef.current;
      }
      videoRef.current.play().catch(() => {});
    }
  }, [isCameraActive]);

  // Capture snapshot frame from live camera video
  const captureFrameFromVideo = (): string | null => {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    let w = video.videoWidth || video.clientWidth;
    let h = video.videoHeight || video.clientHeight;
    if (!w || !h || w <= 0 || h <= 0) {
      return null;
    }
    try {
      const canvas = document.createElement('canvas');
      canvas.width = Math.min(w, 1920);
      canvas.height = Math.min(h, 1080);
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.88);
    } catch (e) {
      console.warn("Failed to capture frame from video:", e);
      return null;
    }
  };

  // Live Camera Capture & Analyze
  const handleCaptureAndAnalyze = async () => {
    playSound('pop');

    // 1. If camera is off or video element is unattached, start camera first
    if (!isCameraActive || !videoRef.current || !videoRef.current.srcObject) {
      await handleStartCamera();
      // Wait for stream to establish dimensions
      for (let i = 0; i < 15; i++) {
        if (videoRef.current && (videoRef.current.videoWidth > 0 || videoRef.current.readyState >= 2)) {
          break;
        }
        await new Promise(r => setTimeout(r, 120));
      }
    }

    let frame = captureFrameFromVideo();
    if (!frame) {
      // Try a secondary quick attempt
      await new Promise(r => setTimeout(r, 350));
      frame = captureFrameFromVideo();
    }

    // If still null (e.g. mobile Safari / iframe restriction), invoke native mobile camera input
    if (!frame) {
      if (nativeCameraInputRef.current) {
        nativeCameraInputRef.current.click();
        return;
      }
      setShowScanPreview(true);
      setScanStatus('error');
      setScanResult({
        isFood: false,
        isBlurry: true,
        errorMessage: "Camera feed is not ready or permissions are pending. Please allow camera access, hold the nutrition facts label or barcode steady, or use the 'Upload Image' button.",
        name: "Camera Check",
        ageBadge: "All Ages",
        stageName: "Camera Check",
        score: "0 / 10",
        novaLevel: "N/A",
        calories: "-",
        protein: "-",
        sodium: "-",
        blwStatus: "Unready",
        gumPinchTest: "N/A",
        ingredients: [],
        allergyCheck: "Please allow camera access.",
        pediatricTip: "Ensure good lighting and hold the food or package label close to the camera.",
        texture: "N/A",
        isSafeForBaby: false
      });
      setTimeout(() => {
        document.getElementById('scan-result-card')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }

    setCapturedImagePreview(frame);
    setShowScanPreview(true);
    setScanStatus('scanning');
    setTimeout(() => {
      document.getElementById('scan-result-card')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    try {
      const res = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: frame,
          foodQuery: searchQuery.trim() || undefined,
          language: language || 'en'
        })
      });
      const data = await res.json();
      setScanResult(data);
      setScanStatus(data.isFood ? 'analyzed' : 'error');
      setTimeout(() => {
        document.getElementById('scan-result-card')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } catch (err) {
      console.error("Analysis request error:", err);
      setScanStatus('error');
      setScanResult({
        isFood: false,
        isBlurry: true,
        errorMessage: "Could not complete scanner analysis. Please hold the nutrition facts label or barcode steady to the camera and try again.",
        name: "Scanner Notice",
        ageBadge: "All Ages",
        stageName: "Diagnostic",
        score: "0 / 10",
        novaLevel: "N/A",
        calories: "-",
        protein: "-",
        sodium: "-",
        blwStatus: "Unknown",
        gumPinchTest: "N/A",
        ingredients: [],
        allergyCheck: "Please try scanning again.",
        pediatricTip: "Hold camera steady with good lighting.",
        texture: "N/A",
        isSafeForBaby: false
      });
    }
  };

  // Upload image handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      playSound('pop');
      setShowScanPreview(true);
      setScanStatus('scanning');
      scanSectionRef.current?.scrollIntoView({ behavior: 'smooth' });

      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        setCapturedImagePreview(dataUrl);
        try {
          const res = await fetch('/api/analyze-food', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: dataUrl,
              foodQuery: file.name.replace(/\.[^/.]+$/, ""),
              language: language || 'en'
            })
          });
          const data = await res.json();
          setScanResult(data);
          setScanStatus(data.isFood ? 'analyzed' : 'error');
        } catch (err) {
          console.error("Upload analysis error:", err);
          setScanStatus('error');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Instant Sample Food Inspection Handler
  const handleSelectSampleFood = (food: IndianBabyFood) => {
    playSound('pop');
    setCapturedImagePreview(null);
    setShowScanPreview(true);
    setScanStatus('analyzed');
    setScanResult({
      isFood: true,
      name: food.name,
      hindiName: food.hindiName,
      ageBadge: food.ageBadge,
      stageName: food.stageName,
      score: food.score,
      scoreNumber: parseFloat(food.score),
      novaLevel: (food as any).novaLevel || 'Level 1 (Fresh Homemade)',
      calories: food.calories,
      protein: food.protein,
      sodium: food.sodium,
      blwStatus: food.blwStatus,
      gumPinchTest: food.texture,
      ingredients: food.ingredients,
      allergyCheck: food.allergyCheck,
      pediatricTip: food.pediatricTip,
      texture: food.texture,
      safetyWarning: food.benefits,
      isSafeForBaby: (food as any).isSafeForBaby !== false,
      foodType: food.foodType,
      brandName: food.brandName
    });
    setTimeout(() => {
      const el = document.getElementById('scan-result-card');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  // Scan Now button handler (when query is typed, analyzes it; if query empty, scrolls to live camera scanner)
  const handleScanNowClick = async (queryOverride?: string) => {
    playSound('pop');
    const queryToUse = (typeof queryOverride === 'string' ? queryOverride : searchQuery).trim();

    if (!queryToUse) {
      // Empty input: take user directly to camera scanner section and activate camera
      scanSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      if (!isCameraActive) {
        handleStartCamera();
      }
      return;
    }

    // Item query entered: execute food evaluation
    setShowScanPreview(true);
    setScanStatus('scanning');
    scanSectionRef.current?.scrollIntoView({ behavior: 'smooth' });

    try {
      const res = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodQuery: queryToUse, language: language || 'en' })
      });
      const data = await res.json();
      setScanResult(data);
      setScanStatus(data.isFood ? 'analyzed' : 'error');
    } catch (err) {
      console.error("Query analysis error:", err);
      setScanStatus('error');
    }
  };

  // Flip camera handler
  const handleFlipCamera = async () => {
    playSound('click');
    const newFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(newFacing);
    
    // Stop current camera, then start new one
    handleStopCamera();
    
    // Allow a small delay before restarting with new constraint
    setTimeout(async () => {
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: newFacing, width: { ideal: 1920, min: 640 }, height: { ideal: 1080, min: 480 } }
                });
                mediaStreamRef.current = stream;
                setIsCameraActive(true);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play().catch(() => {});
                }
            }
        } catch (e) {
            console.log("Camera access notice:", e);
            setIsCameraActive(false);
        }
    }, 300);
  };

  // Auto-start camera on mount and clean up on unmount
  useEffect(() => {
    handleStartCamera();
    return () => {
      handleStopCamera();
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto font-sans text-left px-3 sm:px-6 py-6 space-y-12 text-slate-100">

      {/* =========================================================
          SECTION 1: HERO SECTION (Optimized Spacing & 4 Quick Actions)
      ========================================================== */}
      <section 
        id="hero-section"
        className="relative overflow-hidden rounded-[2rem] border border-amber-400/30 bg-gradient-to-br from-[#121929] via-[#0d1424] to-[#070c18] p-5 sm:p-7 lg:p-8 shadow-2xl backdrop-blur-2xl"
      >
        {/* Glow Spheres */}
        <div className="pointer-events-none absolute -top-32 -left-20 h-80 w-80 rounded-full bg-amber-500/15 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-emerald-500/15 blur-[100px]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          
          {/* Eyebrow label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-black tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            AI-POWERED FOOD INTELLIGENCE
          </div>

          {/* Headline & Subheadline */}
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Know What You Eat. Look Beyond the Label.
            </h1>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-amber-200/90 tracking-tight">
              Scan your food. Understand it. Choose better.
            </p>
          </div>

          {/* Navigation Buttons Row - Wrap on small screens */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3 w-full py-1">
            {/* Why Food Lens */}
            <button
              type="button"
              onClick={() => scrollToSection('comparison-section')}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-amber-400/40 text-white font-bold text-xs sm:text-sm tracking-tight transition-all active:scale-95 cursor-pointer shadow-md shrink-0 whitespace-nowrap"
            >
              <HelpCircle className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Why Food Lens</span>
            </button>

            {/* Foodlens in Action */}
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works-section')}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-blue-400/40 text-white font-bold text-xs sm:text-sm tracking-tight transition-all active:scale-95 cursor-pointer shadow-md shrink-0 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-blue-300 shrink-0" />
              <span>Foodlens in Action</span>
            </button>

            {/* Nutrition Scorecard */}
            <button
              type="button"
              onClick={() => scrollToSection('interface-section')}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-emerald-400/40 text-white font-bold text-xs sm:text-sm tracking-tight transition-all active:scale-95 cursor-pointer shadow-md shrink-0 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Nutrition Scorecard</span>
            </button>

            {/* Scan Food */}
            <button
              type="button"
              onClick={scrollToScanner}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm tracking-tight shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Camera className="w-4 h-4 text-slate-950 stroke-[2.5] shrink-0" />
              <span>Scan Food</span>
              <ArrowDown className="w-3.5 h-3.5 text-slate-950 shrink-0" />
            </button>

            {/* View Dishes for the Day */}
            <Link
              to="/dish-log"
              onClick={() => playSound('glass')}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 hover:border-amber-400 text-amber-300 hover:text-white font-bold text-xs sm:text-sm tracking-tight transition-all active:scale-95 cursor-pointer shadow-md shrink-0 whitespace-nowrap"
            >
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Meal Diary</span>
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================
          SECTION 2: PHILOSOPHY QUOTE SECTION
      ========================================================== */}
      <section 
        id="philosophy-section"
        className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#12192b] to-[#0a101d] p-8 sm:p-14 text-center shadow-xl backdrop-blur-xl"
      >
        <div className="max-w-4xl mx-auto space-y-4">
          <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif italic text-amber-200/95 leading-snug sm:leading-relaxed max-w-4xl mx-auto">
            "You don't need to know everything about nutrition. You just need to know what matters."
          </blockquote>
          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-3xl mx-auto">
            FoodLens turns confusing food labels and nutrition information into clear insights, helping you understand what you're eating and make more informed food choices.
          </p>
        </div>
      </section>

      {/* =========================================================
          SECTION 3: INTELLIGENCE COMPARISON SECTION
      ========================================================== */}
      <section 
        id="comparison-section"
        className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0f172a]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-xl scroll-mt-24"
      >
        <div className="max-w-4xl mx-auto">
          {/* Eyebrow & Heading */}
          <div className="text-center mb-8 space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">
              Intelligence Comparison
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Why Use FOODLENS Instead of Just Asking AI?
            </h2>
          </div>

          {/* Comparison Explanation */}
          <div className="text-white/80 text-sm leading-relaxed mb-8">
            <div className="bg-white/10 border border-white/30 p-6 sm:p-8 rounded-3xl shadow-xl">
              <p className="text-lg sm:text-xl text-white font-serif italic text-center">
                "Common Gen AI models answer general questions; FoodLens AI delivers instant, personalised decisions that use official health standards"
              </p>
            </div>
          </div>

          {/* Comparison Infographic - Immediate full view without expand button or bottom breakdown text */}
          <div className="flex flex-col items-center">
            <div className="rounded-3xl overflow-hidden border border-amber-400/30 bg-slate-950/90 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-3 sm:p-6 w-full max-w-3xl">
              <img 
                src="/foodlens-vs-general-ai.png" 
                alt="General-Purpose AI vs FoodLens AI Comparison" 
                className="w-full h-auto object-contain rounded-2xl mx-auto"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 4: INTUITIVE INTERFACE & UNDERSTAND THE ANSWER SECTION
          (3 Feature Boxes on Top: Nutrition, Ingredients & Allergens,
           Why This Score? - Followed by All KPI Stat Tiles Below)
      ========================================================== */}
      <section 
        id="interface-section"
        className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0d1424]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-xl scroll-mt-24"
      >
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* How it Works */}
          <div className="text-center max-w-5xl mx-auto space-y-4 mb-12" id="how-it-works-section">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">How it Works</h2>
            <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/95 shadow-xl mb-4">
              <img src="/assets/aistudio/image_6668e8cc.png" alt="FoodLens AI Banner" className="w-full h-auto object-contain" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/95 shadow-xl">
                <img src="/assets/aistudio/Gemini_Generated_Image_2vihgd2vihgd2vih__1__7cdf258c.png" alt="Scan Label" className="w-full h-auto object-contain" />
              </div>
              <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/95 shadow-xl">
                <img src="/assets/aistudio/Gemini_Generated_Image_2c1rd52c1rd52c1r_872957ea.png" alt="Scan Barcode" className="w-full h-auto object-contain" />
              </div>
              <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/95 shadow-xl">
                <img src="/assets/aistudio/Gemini_Generated_Image_2vihgd2vihgd2vih_5acaf8ea.png" alt="Scan Meal" className="w-full h-auto object-contain" />
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
              Intuitive Interface
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Understand the answer, not just the score.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              FOODLENS is designed to make its analysis easier to understand. Explore the nutrition data, ingredients, allergens, and factors that contributed to your result.
            </p>
          </div>

          {/* Three-column feature block (Nutrition, Ingredients & Allergens, Why This Score?) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Nutrition */}
            <div className="p-6 rounded-3xl bg-[#142038] border border-white/10 hover:border-amber-400/30 transition-all shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-300 mb-4">
                  <Apple className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">Nutrition</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  See calories, macros, nutrients, and reference Daily Values with instant per-serving and entire-package scaling.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-white/10 text-xs text-amber-300 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Instant Daily Value Calculations</span>
              </div>
            </div>

            {/* Card 2: Ingredients & Allergens */}
            <div className="p-6 rounded-3xl bg-[#142038] border border-white/10 hover:border-emerald-400/30 transition-all shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-300 mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">Ingredients & Allergens</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  Review available ingredients, common allergens, and functional roles of preservatives and artificial additives.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-white/10 text-xs text-emerald-300 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Additive & Preservative Decoded</span>
              </div>
            </div>

            {/* Card 3: Why This Score? */}
            <div className="p-6 rounded-3xl bg-[#142038] border border-white/10 hover:border-blue-400/30 transition-all shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-300 mb-4">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">Why This Score?</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  See exactly how your score was calculated with transparent arithmetic from a 10.0 base score.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-white/10 text-xs text-blue-300 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Black-Box Scoring</span>
              </div>
            </div>

          </div>

          {/* Grid of KPI Stat Tiles Below */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                12 Nutritional Signals &amp; Telemetry
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold">
                Less noise. More useful information.
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 pt-1">
              {statTiles.map((tile, i) => {
                let toneBadge = "bg-white/5 text-slate-400 border-white/10";
                if (tile.tone === 'positive') toneBadge = "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
                if (tile.tone === 'warning') toneBadge = "bg-rose-500/15 text-rose-300 border-rose-500/30";
                if (tile.tone === 'caution') toneBadge = "bg-amber-500/15 text-amber-300 border-amber-500/30";

                return (
                  <div
                    key={i}
                    className="rounded-2xl bg-[#141e33] border border-white/10 p-4 flex flex-col justify-between hover:border-amber-400/40 hover:scale-[1.02] transition-all shadow-md"
                  >
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {tile.label}
                    </span>
                    
                    <div className="my-2">
                      <span className="text-lg sm:text-xl font-black text-white tracking-tight">
                        {tile.value}
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border w-fit ${toneBadge}`}>
                      {tile.microTag}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          SECTION 6: CLOSING QUOTES
      ========================================================== */}
      <section 
        id="closing-quotes-section"
        className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-r from-amber-500/10 via-[#131b2e] to-emerald-500/10 p-8 sm:p-12 text-center shadow-xl backdrop-blur-xl space-y-6"
      >
        <div className="max-w-4xl mx-auto space-y-4">
          <blockquote className="text-xl sm:text-2xl md:text-3xl font-serif italic text-white tracking-tight leading-snug">
            "Better food choices start with better information."
          </blockquote>
          
          <div className="w-12 h-0.5 bg-amber-400/40 mx-auto" />

          <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif italic text-amber-300 tracking-tight leading-relaxed text-balance px-2">
            "You don't need more information. You need the right information."
          </blockquote>
        </div>
      </section>

      {/* =========================================================
          SECTION 6: THE SCAN SECTION AT THE BOTTOM OF THE PAGE
          (CLEAN SCAN BAR & FOOD LENS FOR ALL AGES)
      ========================================================== */}
      <section 
        ref={scanSectionRef}
        id="scan-section"
        className="relative overflow-hidden rounded-[2.5rem] border-2 border-emerald-400/40 bg-gradient-to-b from-[#0e172a] via-[#091120] to-[#050a14] p-5 sm:p-8 lg:p-12 shadow-2xl backdrop-blur-2xl scroll-mt-6"
      >
        {/* Glow ambient background */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-[700px] rounded-full bg-emerald-500/15 blur-[140px]" />
        
        <div className="relative z-10 max-w-5xl mx-auto space-y-8">
          
          {/* Section Heading */}
          <div className="text-center w-full max-w-3xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-black tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              FOOD LENS · FOR ALL AGES
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Scan Nutrition Facts Label or Barcode
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Check nutrition values, texture safety, sodium limits, and allergen markers for all ages.
            </p>
          </div>

          {/* Top Scan Bar (Matching the top bar in image.png) */}
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-[#111c30]/95 border border-white/20 rounded-full p-2.5 sm:p-3 shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 transition-all focus-within:border-amber-400/80 focus-within:ring-4 focus-within:ring-amber-500/10">
              
              {/* Left icon + input */}
              <div className="flex items-center gap-3 px-3 flex-1">
                <Scan className="w-5 h-5 text-amber-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleScanNowClick();
                  }}
                  placeholder="Scan a food product or search by name..."
                  className="w-full bg-transparent text-white placeholder-slate-400 text-xs sm:text-sm md:text-base font-medium focus:outline-none"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Right buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 justify-end">
                {/* Working Sample Foods Button: Navigates to dedicated page */}
                <button
                  id="sample-foods-btn"
                  onClick={() => {
                    playSound('pop');
                    if (onNavigateToSampleFoods) {
                      onNavigateToSampleFoods();
                    } else {
                      navigate('/sample-foods');
                    }
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm tracking-tight shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                  title="Browse Indian Baby Foods in Dedicated Food Page"
                >
                  <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                  <span>Sample Foods Page</span>
                </button>

                <button
                  onClick={() => fileInputBottomRef.current?.click()}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white/90 font-bold text-xs border border-white/15 active:scale-95 transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-300" />
                  <span>Upload Photo</span>
                </button>

                <input
                  type="file"
                  ref={fileInputBottomRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* =========================================================
              ALWAYS-VISIBLE SCANNER WINDOW AT BOTTOM (EXPANDED TO MAXIMUM VIEWPORT PRESENCE)
          ========================================================== */}
          <div className="relative max-w-6xl mx-auto rounded-3xl overflow-hidden bg-slate-950 border-2 border-emerald-400/60 shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full ${isCameraActive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-300">
                  {isCameraActive ? 'Live Camera Vision Scanner Active' : 'AI Food & Nutrition Label Scanner Window'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isCameraActive ? (
                  <>
                    <button
                      onClick={handleFlipCamera}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      title="Flip Camera (Front / Back)"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Flip Camera</span>
                    </button>
                    <button
                      onClick={handleStopCamera}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all cursor-pointer"
                    >
                      Turn Off Camera
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleStartCamera}
                    className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>Turn On Camera</span>
                  </button>
                )}
              </div>
            </div>

            {/* Viewfinder Display Box - EXPANDED LARGE SCAN WINDOW (h-540px to 780px) */}
            <div className="relative w-full h-[520px] sm:h-[620px] md:h-[700px] lg:h-[780px] rounded-2xl overflow-hidden bg-black border-2 border-white/15 flex flex-col items-center justify-center text-center p-4 shadow-inner">
              {isCameraActive ? (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover" 
                  />
                  {/* Scanner view */}
                  <div className="w-14 h-14 border-4 border-emerald-400/60 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-emerald-400 animate-ping" />
                  </div>

                  {/* Top-left guidance pill */}
                  <div className="absolute top-5 left-5 px-4 py-2 rounded-full bg-black/85 backdrop-blur-md border border-emerald-400/50 text-emerald-300 text-xs sm:text-sm font-black flex items-center gap-2.5 shadow-2xl">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    <span>Point at nutrition facts label or barcode</span>
                  </div>
                </>
              ) : (
                <div 
                  onClick={() => handleStartCamera()}
                  className="w-full h-full border-2 border-dashed border-white/20 hover:border-emerald-400/60 rounded-xl p-8 flex flex-col items-center justify-center gap-5 cursor-pointer transition-all bg-gradient-to-b from-white/[0.03] to-transparent group"
                >
                  {/* Laser scanning simulation graphic */}
                  <div className="relative w-28 h-28 rounded-3xl bg-emerald-500/10 border-2 border-emerald-400/40 flex items-center justify-center group-hover:scale-105 transition-transform shadow-[0_0_30px_rgba(52,211,153,0.15)]">
                    <Scan className="w-14 h-14 text-emerald-400" />
                    <div className="absolute inset-x-3 top-1/2 h-0.5 bg-emerald-400 shadow-[0_0_16px_#34d399] animate-pulse" />
                  </div>
                  
                  <div className="space-y-2 max-w-lg">
                    <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-300 transition-colors">
                      Position Nutrition Facts Label or Barcode Here
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Hold the nutrition facts label or barcode steady for the best accuracy.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartCamera();
                      }}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black text-xs sm:text-sm shadow-xl active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                      <span>Turn On Live Camera</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputBottomRef.current?.click();
                      }}
                      className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4 text-slate-300" />
                      <span>Upload Photo</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Scanner Control Bar - Single Capture & Analyze and Upload Image */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 pt-2 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleCaptureAndAnalyze}
                  className="flex-1 sm:flex-initial px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black text-xs sm:text-sm shadow-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  <span>{isCameraActive ? 'Capture & Analyze' : 'Turn On & Analyze'}</span>
                </button>

                <button
                  onClick={() => fileInputBottomRef.current?.click()}
                  className="flex-1 sm:flex-initial px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/15 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-4 h-4 text-slate-300" />
                  <span>Upload Image</span>
                </button>

                {/* Hidden native camera capture input for phones/tablets */}
                <input
                  type="file"
                  ref={nativeCameraInputRef}
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Hidden photo file input */}
                <input
                  type="file"
                  ref={fileInputBottomRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="text-xs text-slate-400 font-medium">
                Tip: Hold the nutrition facts label or barcode steady for the best accuracy.
              </div>
            </div>
          </div>

          {/* Detailed Result Card */}
          {showScanPreview && (
            <motion.div
              id="scan-result-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-6 sm:p-8 rounded-3xl border-2 text-left shadow-2xl transition-all ${
                scanStatus === 'scanning'
                  ? 'bg-[#142338] border-emerald-400/40'
                  : scanResult && !scanResult.isFood
                    ? 'bg-rose-950/40 border-rose-500/60'
                    : scanResult && !scanResult.isSafeForBaby
                      ? 'bg-rose-950/40 border-rose-500/70 shadow-rose-950/50'
                      : 'bg-[#142338] border-emerald-400/40'
              }`}
            >
              {/* Scan Status: In Progress */}
              {scanStatus === 'scanning' && (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full border-4 border-emerald-400/30 border-t-emerald-400 animate-spin" />
                  <p className="text-base font-black text-white">Analyzing Nutrition Facts Label...</p>
                  <p className="text-xs text-slate-300">Checking ingredients, additive codes, sodium caps, sugar limits, and dietary safety...</p>
                </div>
              )}

              {/* Case 1: NON-FOOD OR BLURRY / UNCLEAR ERROR */}
              {scanStatus !== 'scanning' && scanResult && !scanResult.isFood && (
                <div className="space-y-4">
                  {scanResult.isBlurry ? (
                    <>
                      <div className="flex items-center gap-2.5 text-amber-400 font-black text-xs uppercase tracking-widest">
                        <Camera className="w-5 h-5 text-amber-400 shrink-0" />
                        <span>Hold Closer To Camera</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-white">
                        Image Not Clear or Too Far Away
                      </h3>
                      <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-100 text-sm leading-relaxed space-y-2">
                        <p className="font-bold text-amber-300">
                          {scanResult.errorMessage || "The image is blurry or too far away to recognize the nutrition label or barcode."}
                        </p>
                        <ul className="text-xs text-amber-200/90 list-disc list-inside space-y-1">
                          <li>Hold the nutrition facts label or barcode <strong>closer to the camera lens</strong>.</li>
                          <li>If scanning a <strong>nutrition facts table or ingredients list</strong>, ensure the text is well-lit and in sharp focus.</li>
                          <li>Keep the phone steady for 1-2 seconds during capture to avoid motion blur.</li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2.5 text-rose-400 font-black text-xs uppercase tracking-widest">
                        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                        <span>Non-Food Object Detected</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-white">
                        Item Is Not Recognized As Food
                      </h3>
                      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-sm leading-relaxed">
                        {scanResult.errorMessage || "The scanner detected a non-food item. FoodLens evaluates pediatric nutrition, meals, fruits, snacks, and food package nutrition labels. Please point the camera at an edible food item or food packaging."}
                      </div>
                    </>
                  )}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        setShowScanPreview(false);
                        setScanResult(null);
                        if (!isCameraActive) handleStartCamera();
                      }}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold text-xs cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Point Camera &amp; Scan Again</span>
                    </button>
                    <button
                      onClick={() => fileInputBottomRef.current?.click()}
                      className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/15 cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-300" />
                      <span>Upload Clear Photo</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Case 2: EDIBLE FOOD OR FOOD PACKAGE (Safe or Unsafe like Red Chili) */}
              {scanStatus !== 'scanning' && scanResult && scanResult.isFood && (
                <div className="space-y-6">
                  {/* Top Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`w-2.5 h-2.5 rounded-full ${scanResult.isSafeForBaby ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500 animate-ping'}`} />
                        <span className={`text-xs font-bold uppercase tracking-widest ${scanResult.isSafeForBaby ? 'text-emerald-300' : 'text-rose-400'}`}>
                          {scanResult.isSafeForBaby 
                            ? `${scanResult.stageName} · Verified IAP & FSSAI Guidelines` 
                            : 'HIGH ALERT · Unsafe for Babies & Toddlers'}
                        </span>
                        {scanResult.brandName && (
                          <span className="px-2.5 py-0.5 rounded-md font-black text-[11px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            Brand: {scanResult.brandName}
                          </span>
                        )}
                        {scanResult.foodType && (
                          <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {scanResult.foodType}
                          </span>
                        )}
                        <span className={`px-2.5 py-0.5 rounded-md font-black text-[11px] border ${
                          scanResult.isSafeForBaby 
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        }`}>
                          {scanResult.ageBadge}
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-black text-white flex items-baseline gap-2 flex-wrap">
                        <span>{scanResult.name}</span>
                        {scanResult.hindiName && language === 'hi' && (
                          <span className="text-base sm:text-lg font-bold text-amber-300/80">
                            ({scanResult.hindiName})
                          </span>
                        )}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className={`px-4 py-2 rounded-2xl font-black text-sm sm:text-base border flex items-center gap-2 shadow-inner ${
                        scanResult.isSafeForBaby 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                      }`}>
                        {scanResult.isSafeForBaby ? (
                          <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-rose-400" />
                        )}
                        <span>Score: {calculateScoreForFood(scanResult)}</span>
                      </div>
                      <div className="px-3.5 py-2 rounded-2xl bg-amber-500/20 text-amber-300 font-bold text-xs sm:text-sm border border-amber-500/40">
                        {scanResult.novaLevel}
                      </div>
                    </div>
                  </div>

                  {/* Safety Warning Callout if Unsafe / Red Chili */}
                  {!scanResult.isSafeForBaby && (
                    <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-100 space-y-1">
                      <div className="flex items-center gap-2 font-black text-rose-300 text-sm">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span>CRITICAL PEDIATRIC WARNING</span>
                      </div>
                      <p className="text-xs sm:text-sm font-medium leading-relaxed">
                        {scanResult.safetyWarning || "This food item is NOT safe for young children. Raw chilis and hot spices cause severe mucosal burning, coughing, choking, and acute gastric pain."}
                      </p>
                    </div>
                  )}

                  {/* The 3 Required Clinical Sections: 1. NUTRIENTS ALL LISTED, 2. INGREDIENTS & ALLERGENS AS LISTED, 3. WHY THIS SCORE & SCORE CALCULATION */}
                  <div className="pt-2">
                    <FoodNutritionMetricsDisplay food={scanResult} />
                  </div>

                  {/* Authoritative Indian Compliance & WHO References */}
                  <div className="p-4.5 rounded-2xl bg-[#0d1829] border border-emerald-400/25 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                      <div className="flex items-center gap-2 text-emerald-300 text-xs font-black tracking-wide uppercase">
                        <BookOpen className="w-4 h-4 text-emerald-400" />
                        <span>Official Pediatric & Indian Compliance Portals</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Verified against Indian & WHO complementary feeding statutes
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                      <a
                        href="https://iapindia.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-emerald-300 font-bold mb-1">
                            <span>🇮🇳 IAP Infant Feeding</span>
                            <ExternalLink className="w-3.5 h-3.5 text-emerald-400 opacity-60 group-hover:opacity-100" />
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                            Indian Academy of Pediatrics guidelines on complementary feeding textures, weaning, and iron enrichment.
                          </p>
                        </div>
                        <span className="mt-2 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          Read IAP Guidelines →
                        </span>
                      </a>

                      <a
                        href="https://www.nin.res.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-white/[0.03] hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/30 transition-all group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-amber-300 font-bold mb-1">
                            <span>🇮🇳 ICMR - NIN Guidelines</span>
                            <ExternalLink className="w-3.5 h-3.5 text-amber-400 opacity-60 group-hover:opacity-100" />
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                            National Institute of Nutrition Recommended Dietary Allowances (RDA) &lt;1g/day salt limit for infants.
                          </p>
                        </div>
                        <span className="mt-2 text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                          Read ICMR-NIN RDA →
                        </span>
                      </a>

                      <a
                        href="https://www.who.int/news-room/fact-sheets/detail/infant-and-young-child-feeding"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-white/[0.03] hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/30 transition-all group flex flex-col justify-between sm:col-span-2 lg:col-span-1"
                      >
                        <div>
                          <div className="flex items-center justify-between text-blue-300 font-bold mb-1">
                            <span>🌐 WHO Child Growth & IYCF</span>
                            <ExternalLink className="w-3.5 h-3.5 text-blue-400 opacity-60 group-hover:opacity-100" />
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                            World Health Organization Global Strategy for Infant and Young Child Feeding & complementary standards.
                          </p>
                        </div>
                        <span className="mt-2 text-[10px] text-blue-400 font-semibold flex items-center gap-1">
                          Read WHO Article →
                        </span>
                      </a>
                    </div>
                  </div>

                  {/* Logged Meal Notification Toast */}
                  {loggedMealToast && (
                    <div className="mt-4 p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-xl">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>{loggedMealToast}</span>
                      </div>
                      <button
                        onClick={() => {
                          playSound('glass');
                          navigate('/dish-log');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-400 text-slate-950 font-black text-xs hover:bg-emerald-300 cursor-pointer"
                      >
                        View Log →
                      </button>
                    </div>
                  )}

                  {/* Actions footer */}
                  <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-slate-400">
                      Texture: <strong className="text-white">{scanResult.texture}</strong>
                    </span>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={handleLogScannedDish}
                        className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black transition-all cursor-pointer shadow-md"
                      >
                        Log This Dish
                      </button>

                      <button
                        onClick={() => {
                          playSound('glass');
                          navigate('/dish-log');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold border border-white/15 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>View Daily Log</span>
                      </button>

                      <button
                        onClick={() => {
                          playSound('pop');
                          if (onNavigateToSampleFoods) {
                            onNavigateToSampleFoods();
                          } else {
                            navigate('/sample-foods');
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/30 transition-all cursor-pointer"
                      >
                        Browse Sample Foods
                      </button>
                      <button
                        onClick={() => {
                          setShowScanPreview(false);
                          setScanResult(null);
                          if (!isCameraActive) handleStartCamera();
                        }}
                        className="text-emerald-400 font-bold hover:underline cursor-pointer"
                      >
                        Scan Another Label
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </motion.div>
          )}

        </div>
      </section>

    </div>
  );
};
