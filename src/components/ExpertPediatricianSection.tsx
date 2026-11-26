import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';
import { useAuth } from '../lib/AuthContext';
import { db, handleFirestoreError } from '../lib/firebase';
import { playSound } from '../lib/sounds';
import { INDIAN_CITIES_BY_STATE } from '../data/indianCitiesData';
import { detectEmergencyCondition } from './SearchSection';
import { VoiceDictationButton } from './VoiceDictationButton';
import { trackFeatureAction } from '../lib/analyticsTracker';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { 
  Sparkles, 
  Stethoscope, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Video, 
  Plus, 
  Check, 
  CheckCircle2,
  X, 
  MessageSquare, 
  Loader2, 
  ChevronRight, 
  Trash2, 
  AlertCircle, 
  ThumbsUp, 
  ChevronDown, 
  Tv, 
  Users, 
  Send,
  CalendarDays,
  Award,
  VideoOff,
  UserCheck,
  FileDown,
  TrendingUp,
  Activity,
  FileText,
  LockKeyhole,
  ArrowRight,
  Building2,
  Download,
  Phone,
  ExternalLink,
  ShieldCheck,
  Search,
  Navigation,
  Mail,
  Bell,
  Sun,
  Sunrise,
  Moon,
  UserPlus
} from 'lucide-react';
import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceDot
} from 'recharts';

const localT: Record<string, Record<string, string>> = {
  en: {
    sectionTitle: "Expert Pediatric Support & Diagnostics",
    sectionSubtitle: "Nationwide verified clinics, live interactive webinars, on-demand medical chats, and growth analytics.",
    premiumBadge: "PEDIATRIC CARE",
    tabConsults: "Pediatric 1:1 Consult",
    tabConsultsSub: "Qualified pediatrician network",
    tabLive: "Live Sessions",
    tabLiveSub: "Weekly interactive Q&A",
    tabChat: "Doctor Chat",
    tabChatSub: "₹199 / 20 min session • Instant chat",
    tabReports: "Growth Reports",
    tabReportsSub: "Monthly development PDF",
    cityLabel: "Select Your City",
    clinicLabel: "Select Nearest Clinic",
    doctorLabel: "Select Verified Pediatrician",
    dateLabel: "Preferred Date",
    timeLabel: "Preferred Time Slot",
    bookBtn: "Confirm & Book Consultation",
    activeBookings: "Your Booked Consultations",
    noBookings: "No active consultation bookings.",
    bookingConfirmed: "Consultation Booked Successfully!",
    statusConfirmed: "Confirmed",
    statusPending: "Pending Verification",
    deleteBtn: "Cancel Appointment",
    upcomingLiveSessions: "Upcoming Live Q&A Webinars",
    joinLiveSession: "Join Live Session",
    chatWithDr: "On-Demand Pediatrician Support Chat",
    chatDisclaimer: "This Doctor chat is just for first hand information. In case of an emergency, please visit your nearest hospital immediately.",
    chatPlaceholder: "Ask about your toddler's health, sleep, picky eating, or milestones...",
    doctorSpecialty: "Specialty",
    doctorExperience: "Experience",
    yearsExp: "years",
    joinedSession: "You joined the Live Session!",
    liveChatFeed: "Live Audience Chat",
    askDoctorQueue: "Submit Question to Dr.",
    queueBtn: "Submit",
    questionPlaceholder: "Ask a question in this live session...",
    submittedToQueue: "Your question added to the host's queue!",
    doctorDetails: "Doctor Details",
    aboutDoc: "Verified pediatric physician registered with medical council.",
    liveNow: "LIVE NOW",
    endSession: "Leave Session"
  },
  hi: {
    sectionTitle: "बाल चिकित्सा सहायता और निदान",
    sectionSubtitle: "राष्ट्रव्यापी सत्यापित डॉक्टर, लाइव वेबिनार, तत्काल चैट और विकास विश्लेषिकी।",
    premiumBadge: "बाल चिकित्सा देखभाल",
    tabConsults: "बाल रोग परामर्श",
    tabConsultsSub: "सत्यापित डॉक्टर",
    tabLive: "लाइव सत्र",
    tabLiveSub: "साप्ताहिक वेबिनार और प्रश्नोत्तर",
    tabChat: "डॉक्टर चैट",
    tabChatSub: "ऑन-डिमांड तत्काल चैट",
    tabReports: "विकास रिपोर्ट",
    tabReportsSub: "मासिक विकास विश्लेषिकी",
    cityLabel: "अपना शहर चुनें",
    clinicLabel: "नजदीकी क्लीनिक चुनें",
    doctorLabel: "सत्यापित बाल रोग विशेषज्ञ चुनें",
    dateLabel: "पसंदीदा तारीख",
    timeLabel: "पसंदीदा समय",
    bookBtn: "परामर्श की पुष्टि करें और बुक करें",
    activeBookings: "आपके बुक किए गए परामर्श",
    noBookings: "कोई सक्रिय परामर्श बुकिंग नहीं है।",
    bookingConfirmed: "परामर्श सफलतापूर्वक बुक किया गया!",
    statusConfirmed: "सत्यापित (Confirmed)",
    statusPending: "सत्यापन लंबित",
    deleteBtn: "अपॉइंटमेंट रद्द करें",
    upcomingLiveSessions: "आगामी लाइव प्रश्नोत्तर वेबिनार",
    joinLiveSession: "लाइव सत्र में शामिल हों",
    chatWithDr: "बाल रोग विशेषज्ञ तत्काल चैट",
    chatDisclaimer: "अस्वीकरण: यह चैट केवल सूचनात्मक उद्देश्यों के लिए है। आपातकालीन स्थिति में तुरंत नजदीकी अस्पताल जाएं।",
    chatPlaceholder: "बच्चे के स्वास्थ्य, नींद, खान-पान के बारे में पूछें...",
    doctorSpecialty: "विशेषज्ञता",
    doctorExperience: "अनुभव",
    yearsExp: "वर्ष",
    joinedSession: "आप लाइव सत्र में शामिल हो गए हैं!",
    liveChatFeed: "लाइव दर्शक चैट",
    askDoctorQueue: "डॉक्टर से सवाल पूछें",
    queueBtn: "भेजें",
    questionPlaceholder: "इस लाइव सत्र में कोई प्रश्न पूछें...",
    submittedToQueue: "आपका प्रश्न कतार में जोड़ दिया गया है!",
    doctorDetails: "डॉक्टर का विवरण",
    aboutDoc: "मेडिकल काउंसिल के साथ पंजीकृत सत्यापित बाल चिकित्सा चिकित्सक।",
    liveNow: "लाइव चल रहा है",
    endSession: "सत्र छोड़ें"
  },
  ta: {
    sectionTitle: "குழந்தை மருத்துவ உதவி மற்றும் நோய் கண்டறிதல்",
    sectionSubtitle: "நாடு தழுவிய சரிபார்க்கப்பட்ட மருத்துவர்கள், நேரடி வெபினாரிகள், உடனடி அரட்டைகள் மற்றும் வளர்ச்சி பகுப்பாய்வு.",
    premiumBadge: "குழந்தை நல பராமரிப்பு",
    tabConsults: "குழந்தை மருத்துவர் ஆலோசனை",
    tabConsultsSub: "சரிபார்க்கப்பட்ட மருத்துவர்கள்",
    tabLive: "நேரடி அமர்வுகள்",
    tabLiveSub: "வாராந்திர கேள்வி பதில்",
    tabChat: "டாக்டர் சாட்",
    tabChatSub: "உடனடி சாட் ஆதரவு",
    tabReports: "வளர்ச்சி அறிக்கைகள்",
    tabReportsSub: "மாதாந்திர பகுப்பாய்வு PDF",
    cityLabel: "உங்கள் நகரத்தைத் தேர்ந்தெடுக்கவும்",
    clinicLabel: "அருகிலுள்ள கிளினிக்கைத் தேர்ந்தெடுக்கவும்",
    doctorLabel: "சரிபார்க்கப்பட்ட குழந்தை மருத்துவரைத் தேர்ந்தெடுக்கவும்",
    dateLabel: "விருப்பமான தேதி",
    timeLabel: "விருப்பமான நேரம்",
    bookBtn: "பதிவை உறுதிப்படுத்துக",
    activeBookings: "உங்கள் முன்பதிவுகள்",
    noBookings: "செயலில் முன்பதிவுகள் இல்லை.",
    bookingConfirmed: "ஆலோசனை வெற்றிகரமாக பதிவு செய்யப்பட்டது!",
    statusConfirmed: "உறுதிப்படுத்தப்பட்டது",
    statusPending: "சரிபார்ப்பு நிலுவையில் உள்ளது",
    deleteBtn: "பதிவை ரத்து செய்",
    upcomingLiveSessions: "நேரடி கேள்வி பதில் வெபினாரிகள்",
    joinLiveSession: "நேரடி அமர்வில் இணையுங்கள்",
    chatWithDr: "குழந்தை மருத்துவ சாட்",
    chatDisclaimer: "பொறுப்புத் துறப்பு: இந்த அரட்டை தகவல் நோக்கங்களுக்காக மட்டுமே. அவசர காலங்களில் உடனடியாக மருத்துவமனைக்குச் செல்லவும்.",
    chatPlaceholder: "குழந்தையின் ஆரோக்கியம், தூக்கம் அல்லது ஊட்டச்சத்து பற்றி கேளுங்கள்...",
    doctorSpecialty: "சிறப்புத் துறை",
    doctorExperience: "அனுபவம்",
    yearsExp: "ஆண்டுகள்",
    joinedSession: "நீங்கள் நேரடி அமர்வில் இணைந்துள்ளீர்கள்!",
    liveChatFeed: "நேரடி பார்வையாளர் அரட்டை",
    askDoctorQueue: "கேள்வி சமர்ப்பிக்கவும்",
    queueBtn: "சமர்ப்பி",
    questionPlaceholder: "நேரடி அமர்வில் கேள்வி கேட்கவும்...",
    submittedToQueue: "உங்கள் கேள்வி வரிசையில் சேர்க்கப்பட்டுள்ளது!",
    doctorDetails: "மருத்துவர் விவரங்கள்",
    aboutDoc: "மருத்துவ கவுன்சிலில் பதிவு செய்யப்பட்ட குழந்தை மருத்துவர்.",
    liveNow: "நேரடியில்",
    endSession: "அமர்விலிருந்து விலகு"
  }
};

import {
  Hospital,
  Doctor,
  getHospitalsForCity,
  getClinicsForCity,
  getDoctorsForCity,
  getDoctorsForClinic,
  verifiedDoctors,
  cleanCityName
} from '../data/hospitalsData';
export type { Hospital, Doctor };
export { getClinicsForCity, getDoctorsForCity, getDoctorsForClinic, verifiedDoctors };

// 30-Minute Consultation Time Slots from 8:00 AM to 10:00 PM (28 Slots)
export const CONSULTATION_TIME_SLOTS = [
  "08:00 AM - 08:30 AM",
  "08:30 AM - 09:00 AM",
  "09:00 AM - 09:30 AM",
  "09:30 AM - 10:00 AM",
  "10:00 AM - 10:30 AM",
  "10:30 AM - 11:00 AM",
  "11:00 AM - 11:30 AM",
  "11:30 AM - 12:00 PM",
  "12:00 PM - 12:30 PM",
  "12:30 PM - 01:00 PM",
  "01:00 PM - 01:30 PM",
  "01:30 PM - 02:00 PM",
  "02:00 PM - 02:30 PM",
  "02:30 PM - 03:00 PM",
  "03:00 PM - 03:30 PM",
  "03:30 PM - 04:00 PM",
  "04:00 PM - 04:30 PM",
  "04:30 PM - 05:00 PM",
  "05:00 PM - 05:30 PM",
  "05:30 PM - 06:00 PM",
  "06:00 PM - 06:30 PM",
  "06:30 PM - 07:00 PM",
  "07:00 PM - 07:30 PM",
  "07:30 PM - 08:00 PM",
  "08:00 PM - 08:30 PM",
  "08:30 PM - 09:00 PM",
  "09:00 PM - 09:30 PM",
  "09:30 PM - 10:00 PM"
];

export const TIME_SLOT_GROUPS = [
  {
    period: "Morning",
    label: "🌅 Morning Slots (8:00 AM - 12:00 PM)",
    slots: [
      "08:00 AM - 08:30 AM",
      "08:30 AM - 09:00 AM",
      "09:00 AM - 09:30 AM",
      "09:30 AM - 10:00 AM",
      "10:00 AM - 10:30 AM",
      "10:30 AM - 11:00 AM",
      "11:00 AM - 11:30 AM",
      "11:30 AM - 12:00 PM"
    ]
  },
  {
    period: "Afternoon",
    label: "☀️ Afternoon Slots (12:00 PM - 5:00 PM)",
    slots: [
      "12:00 PM - 12:30 PM",
      "12:30 PM - 01:00 PM",
      "01:00 PM - 01:30 PM",
      "01:30 PM - 02:00 PM",
      "02:00 PM - 02:30 PM",
      "02:30 PM - 03:00 PM",
      "03:00 PM - 03:30 PM",
      "03:30 PM - 04:00 PM",
      "04:00 PM - 04:30 PM",
      "04:30 PM - 05:00 PM"
    ]
  },
  {
    period: "Evening & Night",
    label: "🌙 Evening & Night Slots (5:00 PM - 10:00 PM)",
    slots: [
      "05:00 PM - 05:30 PM",
      "05:30 PM - 06:00 PM",
      "06:00 PM - 06:30 PM",
      "06:30 PM - 07:00 PM",
      "07:00 PM - 07:30 PM",
      "07:30 PM - 08:00 PM",
      "08:00 PM - 08:30 PM",
      "08:30 PM - 09:00 PM",
      "09:00 PM - 09:30 PM",
      "09:30 PM - 10:00 PM"
    ]
  }
];

export interface PastConsultation {
  id: string;
  doctorName: string;
  degrees: string;
  hospital: string;
  location: string;
  city: string;
  specialty: string;
  date: string;
  time: string;
  status: string;
  topic: string;
  summary: string;
  vitals: string;
  prescriptionRx?: string[];
}

const initialPastBookings: PastConsultation[] = [
  {
    id: 'past-1',
    doctorName: "Dr. Anjali Sharma",
    degrees: "MBBS, MD (Pediatrics), DNB, FIAP",
    hospital: "Cloudnine Pediatrics",
    location: "Jayanagar",
    city: "Bangalore",
    specialty: "Neonatologist & Infant Care Specialist",
    date: "12 Aug 2026",
    time: "10:00 AM - 10:30 AM",
    status: "Completed",
    topic: "6-Month Solid Weaning & Iron Fortification",
    summary: "Infant tolerating stewed apple and ragi porridge well. Prescribed 1 tsp cold-pressed ghee addition and continuation of Vit D drops (400 IU/day). Growth percentile tracked at 58th percentile.",
    vitals: "Weight: 7.8 kg • Height: 68 cm • Temp: 36.9°C (98.4°F)",
    prescriptionRx: [
      "Vitamin D3 Oral Drops (400 IU daily morning)",
      "Iron-fortified ragi malt puree with cooked apple",
      "Next review: 9 Months MMR-1 booster"
    ]
  },
  {
    id: 'past-2',
    doctorName: "Dr. Rajesh Iyer",
    degrees: "MBBS, DCH, DNB (Pediatrics)",
    hospital: "Rainbow Children's Hospital",
    location: "Koramangala",
    city: "Bangalore",
    specialty: "Pediatric Nutrition & Growth Expert",
    date: "24 Jul 2026",
    time: "02:30 PM - 03:00 PM",
    status: "Completed",
    topic: "Toddler Sleep Regression & Teething Protocol",
    summary: "Evaluated 18-month sleep regression. Prescribed consistent 7:30 PM sleep hygiene routine and chilled silicon teether for lower canine eruption. Night waking reduced.",
    vitals: "Weight: 11.2 kg • Height: 82 cm • Temp: 37.0°C (98.6°F)",
    prescriptionRx: [
      "Calibrated gum massage with chilled silicone teether",
      "Magnesium-rich evening snack (banana & oatmeal)",
      "Darkened nursery environment with white noise"
    ]
  },
  {
    id: 'past-3',
    doctorName: "Dr. Priya Varma",
    degrees: "MBBS, MD (Pediatrics), Fellowship in Pulmonology",
    hospital: "Fortis La Femme",
    location: "GK II",
    city: "Delhi",
    specialty: "Pediatric Allergist & Pulmonologist",
    date: "18 Jun 2026",
    time: "11:30 AM - 12:00 PM",
    status: "Completed",
    topic: "Suspected Cow Milk Protein Allergy (CMPA)",
    summary: "Evaluated mild eczema flare after dairy introduction. Initiated 2-week dairy elimination trial with notable skin clearance. Prescribed ceramide barrier cream twice daily.",
    vitals: "Weight: 6.9 kg • Height: 64 cm • Temp: 36.8°C (98.2°F)",
    prescriptionRx: [
      "Ceramide lipid barrier moisturizing cream twice daily",
      "Strict dairy elimination trial for next 14 days",
      "Pediatric follow-up skin evaluation scheduled"
    ]
  }
];

interface Booking {
  id: string;
  userId: string;
  doctorName: string;
  specialty: string;
  city: string;
  clinic: string;
  date: string;
  time: string;
  status: string;
  createdAt: any;
}

// WHO Percentile Standards for boys (median and bounds)
const growthChartData = [
  { age: 0, p5: 46.1, p50: 49.9, p95: 53.7, wP5: 2.5, wP50: 3.3, wP95: 4.3 },
  { age: 3, p5: 57.3, p50: 61.4, p95: 65.5, wP5: 5.0, wP50: 6.4, wP95: 8.0 },
  { age: 6, p5: 63.3, p50: 67.6, p95: 71.9, wP5: 6.4, wP50: 7.9, wP95: 9.8 },
  { age: 9, p5: 67.5, p50: 72.0, p95: 76.5, wP5: 7.2, wP50: 8.9, wP95: 11.0 },
  { age: 12, p5: 71.0, p50: 75.7, p95: 80.4, wP5: 7.8, wP50: 9.6, wP95: 12.0 },
  { age: 15, p5: 74.1, p50: 79.1, p95: 84.1, wP5: 8.4, wP50: 10.3, wP95: 12.8 },
  { age: 18, p5: 76.9, p50: 82.3, p95: 87.7, wP5: 8.9, wP50: 11.0, wP95: 13.7 },
  { age: 24, p5: 81.7, p50: 87.8, p95: 93.9, wP5: 9.8, wP50: 12.2, wP95: 15.3 },
  { age: 30, p5: 85.1, p50: 91.9, p95: 98.7, wP5: 10.7, wP50: 13.3, wP95: 16.8 },
  { age: 36, p5: 88.7, p50: 96.1, p95: 103.5, wP5: 11.5, wP50: 14.3, wP95: 18.1 }
];

interface MapCameraControllerProps {
  selectedHospital: { placeId: string; location: { lat: number; lng: number } } | null;
  gpsLocation: { lat: number; lng: number } | null;
  hospitals: Array<{ placeId: string; location: { lat: number; lng: number } }>;
  cityKey: string;
}

const MapCameraController: React.FC<MapCameraControllerProps> = ({
  selectedHospital,
  gpsLocation,
  hospitals,
  cityKey,
}) => {
  const map = useMap();
  const prevTargetKeyRef = useRef<string>('');
  const prevCityKeyRef = useRef<string>('');

  // Smoothly pan to selected hospital only when selection changes, leaving user free to drag & zoom
  useEffect(() => {
    if (!map) return;
    if (selectedHospital?.location?.lat && selectedHospital?.location?.lng) {
      const targetKey = `${selectedHospital.placeId}_${selectedHospital.location.lat}_${selectedHospital.location.lng}`;
      if (prevTargetKeyRef.current !== targetKey) {
        prevTargetKeyRef.current = targetKey;
        map.panTo(selectedHospital.location);
      }
    }
  }, [map, selectedHospital]);

  // Recenter when city or GPS mode changes
  useEffect(() => {
    if (!map) return;
    const currentCityKey = `${cityKey}_${gpsLocation ? `${gpsLocation.lat},${gpsLocation.lng}` : 'city'}`;
    if (prevCityKeyRef.current !== currentCityKey && hospitals.length > 0) {
      prevCityKeyRef.current = currentCityKey;
      if (gpsLocation?.lat && gpsLocation?.lng) {
        map.panTo(gpsLocation);
        map.setZoom(13);
      } else if (hospitals[0]?.location?.lat) {
        map.panTo(hospitals[0].location);
        map.setZoom(12);
      }
    }
  }, [map, cityKey, gpsLocation, hospitals]);

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!map) return;
    map.setZoom((map.getZoom() || 12) + 1);
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!map) return;
    map.setZoom(Math.max(3, (map.getZoom() || 12) - 1));
  };

  const handleFitAllPins = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!map || hospitals.length === 0) return;
    const g = (window as any).google;
    if (!g?.maps?.LatLngBounds) return;
    const bounds = new g.maps.LatLngBounds();
    let count = 0;
    hospitals.forEach((h) => {
      if (h.location?.lat && h.location?.lng) {
        bounds.extend(h.location);
        count++;
      }
    });
    if (gpsLocation?.lat && gpsLocation?.lng) {
      bounds.extend(gpsLocation);
      count++;
    }
    if (count > 0) {
      map.fitBounds(bounds, 48);
    }
  };

  const handleRecenterSelected = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!map) return;
    const target = selectedHospital?.location || gpsLocation || hospitals[0]?.location;
    if (target?.lat && target?.lng) {
      map.panTo(target);
      map.setZoom(14);
    }
  };

  return (
    <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5 bg-[#0b1222]/90 backdrop-blur-md border border-white/20 p-1.5 rounded-2xl shadow-xl">
      <button
        type="button"
        onClick={handleZoomIn}
        title="Zoom In"
        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-indigo-600 text-white font-black text-sm transition-colors cursor-pointer"
      >
        + Zoom In
      </button>
      <button
        type="button"
        onClick={handleZoomOut}
        title="Zoom Out"
        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-indigo-600 text-white font-black text-sm transition-colors cursor-pointer"
      >
        − Zoom Out
      </button>
      <button
        type="button"
        onClick={handleFitAllPins}
        title="Fit All Hospitals on Map"
        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-indigo-600 text-white font-bold text-xs transition-colors cursor-pointer"
      >
        Fit All Pins
      </button>
      <button
        type="button"
        onClick={handleRecenterSelected}
        title="Center on Selected Hospital"
        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer"
      >
        Center Selected
      </button>
    </div>
  );
};

const LockGate: React.FC<{ requiredPlan: 'essential' | 'comprehensive'; activePlan: string }> = ({ requiredPlan, activePlan }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-10 text-center max-w-xl mx-auto border-2 border-amber-500/20 bg-gradient-to-b from-amber-500/[0.04] to-transparent rounded-[2rem] space-y-6 my-10 relative z-10"
    >
      <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-yellow-400 text-black rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-amber-500/10">
        <LockKeyhole className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-black text-white">Clinical Feature Locked</h3>
        <p className="text-white/50 text-sm leading-relaxed">
          {activePlan === 'free' 
            ? `Consult qualified pediatricians through our partner network and join live expert sessions.`
            : `Consult qualified pediatricians through our partner network and join live expert sessions.`
          }
        </p>
      </div>
      <div className="pt-2">
        <button
          onClick={() => {
            playSound('pop');
            navigate('/profile?tab=plans');
          }}
          className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black px-6 py-3 rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 active:scale-95 transition-all inline-flex items-center gap-2 mx-auto"
        >
          <span>View Upgrade Plans</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export interface DemoLiveSession {
  id: string;
  title: string;
  topicTag: string;
  topicColor: {
    bg: string;
    text: string;
    border: string;
  };
  doctorName: string;
  doctorSpecialty: string;
  degrees: string;
  hospital: string;
  city: string;
  dateStr: string;
  dateKey: 'today' | 'tomorrow' | 'this_week' | 'next_week';
  timeStr: string;
  period: 'morning' | 'afternoon' | 'evening';
  isLiveNow?: boolean;
  registeredCount: number;
  description: string;
}

export const DEMO_LIVE_SESSIONS: DemoLiveSession[] = [
  {
    id: 'live-1',
    title: 'Solid Foods, Picky Eaters, and Allergy Safety Hacks',
    topicTag: 'Nutrition Special',
    topicColor: { bg: 'bg-indigo-500/15', text: 'text-indigo-300', border: 'border-indigo-500/30' },
    doctorName: 'Dr. Rajesh Iyer',
    degrees: 'MBBS, MD (Pediatrics)',
    doctorSpecialty: 'Senior Pediatric Nutritionist & Weaning Specialist',
    hospital: "Rainbow Children's Hospital, Bannerghatta Road",
    city: 'Bengaluru',
    dateStr: 'Today, Oct 5, 2026',
    dateKey: 'today',
    timeStr: '10:30 AM - 11:30 AM IST',
    period: 'morning',
    isLiveNow: true,
    registeredCount: 148,
    description: 'Interactive live Q&A webinar covering solid food milestones, iron-rich Indian baby meals, choking prevention, and tackling mealtime picky tantrums.'
  },
  {
    id: 'live-2',
    title: 'Toddler Sleep Regression, Night Terrors & Bedtime Routines',
    topicTag: 'Sleep Science',
    topicColor: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
    doctorName: 'Dr. Priya Varma',
    degrees: 'MD (Pediatrics), Fellowship in Pediatric Sleep',
    doctorSpecialty: 'Chief Pediatric Sleep Consultant',
    hospital: "Apollo Cradle Maternity & Children's Hospital, Koramangala",
    city: 'Bengaluru',
    dateStr: 'Tomorrow, Oct 6, 2026',
    dateKey: 'tomorrow',
    timeStr: '02:30 PM - 03:30 PM IST',
    period: 'afternoon',
    isLiveNow: false,
    registeredCount: 89,
    description: 'Master nighttime wakings, transitioning from crib to big bed, managing bedtime meltdowns, and building calming 30-minute sleep rituals.'
  },
  {
    id: 'live-3',
    title: 'Newborn & Toddler Fever, Cough & Seasonal Flu Protocol',
    topicTag: 'Acute Care & Immunity',
    topicColor: { bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/30' },
    doctorName: 'Dr. Anand K. Kulkarni',
    degrees: 'MBBS, DCH, DNB (Pediatrics)',
    doctorSpecialty: 'Pediatric Emergency & Critical Care Specialist',
    hospital: 'Manipal Hospital Pediatrics, HAL Airport Road',
    city: 'Bengaluru',
    dateStr: 'Wednesday, Oct 7, 2026',
    dateKey: 'this_week',
    timeStr: '06:30 PM - 07:30 PM IST',
    period: 'evening',
    isLiveNow: false,
    registeredCount: 124,
    description: 'When to visit the ER vs when to manage at home. Practical guide on sponge baths, safe paracetamol dosing, wheezing red flags, and nasal decongestion.'
  },
  {
    id: 'live-4',
    title: 'Speech Delay, First Words & Screen-Time Recovery',
    topicTag: 'Speech & Language',
    topicColor: { bg: 'bg-teal-500/15', text: 'text-teal-300', border: 'border-teal-500/30' },
    doctorName: 'Dr. Sunita Rao',
    degrees: 'PhD, MASLP (Speech & Hearing)',
    doctorSpecialty: 'Early Language & Speech Development Consultant',
    hospital: 'Cloudnine Hospital, Jayanagar',
    city: 'Bengaluru',
    dateStr: 'Friday, Oct 9, 2026',
    dateKey: 'this_week',
    timeStr: '11:00 AM - 12:00 PM IST',
    period: 'morning',
    isLiveNow: false,
    registeredCount: 210,
    description: 'Identifying true speech delay vs late blooming, fun vocal games, speech-building interactive songs, and reducing screen-time dependency.'
  },
  {
    id: 'live-5',
    title: 'Gentle Potty Training Action Plan & Elimination Communication',
    topicTag: 'Potty & Habits',
    topicColor: { bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30' },
    doctorName: 'Dr. Meera Nambiar',
    degrees: 'MD (Pediatrics), DCH',
    doctorSpecialty: 'Child Development & Behavioral Pediatrician',
    hospital: 'Aster CMI Hospital, Sahakar Nagar',
    city: 'Bengaluru',
    dateStr: 'Saturday, Oct 10, 2026',
    dateKey: 'this_week',
    timeStr: '03:30 PM - 04:30 PM IST',
    period: 'afternoon',
    isLiveNow: false,
    registeredCount: 175,
    description: 'Gentle 3-day potty training action plan, handling stool withholding fear, regression during travel, and positive reinforcement without shame.'
  },
  {
    id: 'live-6',
    title: 'Motor Milestones, Flat Feet & Active Toddler Posture',
    topicTag: 'Physical & Motor Skills',
    topicColor: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
    doctorName: 'Dr. Amit Shah',
    degrees: 'MPT (Pediatric Neurosciences)',
    doctorSpecialty: 'Pediatric Physical Therapist & Movement Coach',
    hospital: 'Fortis La Femme Center for Mother & Child, Richmond Town',
    city: 'Bengaluru',
    dateStr: 'Sunday, Oct 11, 2026',
    dateKey: 'this_week',
    timeStr: '07:00 PM - 08:00 PM IST',
    period: 'evening',
    isLiveNow: false,
    registeredCount: 98,
    description: 'Baby walking readiness, bow legs vs normal alignment, barefoot sensory play, jumping milestones, and core muscle-building games.'
  },
  {
    id: 'live-7',
    title: 'Gut Health, Infant Colic & Probiotics for Babies',
    topicTag: 'Gut Health & Digestion',
    topicColor: { bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/30' },
    doctorName: 'Dr. Arvind Shenoy',
    degrees: 'MD (Pediatrics), DM (Pediatric Gastroenterology)',
    doctorSpecialty: 'Senior Pediatric Gastroenterologist',
    hospital: 'Motherhood Hospital, Indiranagar',
    city: 'Bengaluru',
    dateStr: 'Tuesday, Oct 13, 2026',
    dateKey: 'next_week',
    timeStr: '09:30 AM - 10:30 AM IST',
    period: 'morning',
    isLiveNow: false,
    registeredCount: 140,
    description: 'Managing painful gas and infant colic, deciphering baby poop colors, safe introduction of curd & fiber, and managing toddler constipation naturally.'
  },
  {
    id: 'live-8',
    title: 'Tantrum De-escalation & Gentle Discipline for 1-5 Year Olds',
    topicTag: 'Behavior & Tantrums',
    topicColor: { bg: 'bg-pink-500/15', text: 'text-pink-300', border: 'border-pink-500/30' },
    doctorName: 'Dr. Kavitha Balaji',
    degrees: 'MD (Pediatrics), Child Behavioral Fellow',
    doctorSpecialty: 'Consultant Developmental Pediatrician',
    hospital: 'Manipal Hospital, Whitefield',
    city: 'Bengaluru',
    dateStr: 'Thursday, Oct 15, 2026',
    dateKey: 'next_week',
    timeStr: '05:30 PM - 06:30 PM IST',
    period: 'evening',
    isLiveNow: false,
    registeredCount: 260,
    description: 'Evidence-based calming scripts for public meltdowns, handling biting/hitting calmly, co-regulation techniques, and setting loving boundaries.'
  },
  {
    id: 'live-9',
    title: 'Teething Pain, Oral Hygiene & Early Pediatric Dental Care',
    topicTag: 'Teething & Dental',
    topicColor: { bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/30' },
    doctorName: 'Dr. Shalini Hegde',
    degrees: 'MDS (Pediatric Dentistry)',
    doctorSpecialty: 'Pediatric Dental Surgeon',
    hospital: 'Ovum Woman & Child Speciality Hospital, Kalyan Nagar',
    city: 'Bengaluru',
    dateStr: 'Saturday, Oct 17, 2026',
    dateKey: 'next_week',
    timeStr: '02:00 PM - 03:00 PM IST',
    period: 'afternoon',
    isLiveNow: false,
    registeredCount: 112,
    description: 'Soothing painful teething swollen gums, safe cold tethers vs gels, night nursing dental risks, and fun ways to brush toddler teeth twice daily.'
  }
];

export const ExpertPediatricianSection: React.FC = () => {
  const { language } = useLanguage();
  const { user, profile, activeChild, isAccountUser } = useAuth();
  const navigate = useNavigate();
  const activePlan = profile?.plan || localStorage.getItem('user_plan') || 'free';
  
  const currentT = localT[language] || localT['en'];
  const gt = (key: string) => currentT[key] || localT['en'][key] || key;

  const [searchParams] = useSearchParams();
  const subParam = searchParams.get('sub');

  const [activeTab, setActiveTab] = useState<'consults' | 'live' | 'chat' | 'reports'>(() => {
    if (subParam && ['consults', 'live', 'chat', 'reports'].includes(subParam)) {
      return subParam as 'consults' | 'live' | 'chat' | 'reports';
    }
    return 'consults';
  });

  useEffect(() => {
    if (subParam && ['consults', 'live', 'chat', 'reports'].includes(subParam)) {
      setActiveTab(subParam as 'consults' | 'live' | 'chat' | 'reports');
    }
  }, [subParam]);

  // Read state and city from user profile or saved preferences
  const initialUserState = profile?.indianState || (!isAccountUser ? localStorage.getItem('user_indian_state') : null) || 'Karnataka';
  const profileCity = profile?.city || (!isAccountUser ? localStorage.getItem('user_city') : null) || '';
  const [selectedState, setSelectedState] = useState<string>(initialUserState);

  useEffect(() => {
    if (profile?.indianState) {
      setSelectedState(profile.indianState);
    }
  }, [profile?.indianState]);

  // All 36 Indian States and UTs list in strict alphabetical order (A-Z)
  const allStatesList = React.useMemo(() => Object.keys(INDIAN_CITIES_BY_STATE).sort((a, b) => a.localeCompare(b)), []);

  // All cities for the state selected in strict alphabetical order (A-Z)
  const stateCities = React.useMemo(() => {
    const list = [...(INDIAN_CITIES_BY_STATE[selectedState] || INDIAN_CITIES_BY_STATE['Karnataka'] || [])];
    if (profileCity && !list.includes(profileCity)) {
      list.push(profileCity);
    }
    return list.sort((a, b) => a.localeCompare(b));
  }, [selectedState, profileCity]);

  // Tab 1 Booking states
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    if (profileCity && (INDIAN_CITIES_BY_STATE[initialUserState] || []).includes(profileCity)) return profileCity;
    const defaultList = INDIAN_CITIES_BY_STATE[initialUserState] || INDIAN_CITIES_BY_STATE['Karnataka'] || [];
    return defaultList[0] || 'Bengaluru (Bangalore)';
  });

  const [selectedClinic, setSelectedClinic] = useState<string>(() => {
    const list = getClinicsForCity(
      (profileCity && (INDIAN_CITIES_BY_STATE[initialUserState] || []).includes(profileCity))
        ? profileCity
        : ((INDIAN_CITIES_BY_STATE[initialUserState] || [])[0] || 'Bengaluru (Bangalore)'),
      initialUserState
    );
    return list[0] || '';
  });
  const [selectedHospitalAddress, setSelectedHospitalAddress] = useState<string>('');
  const [showAllHospitals, setShowAllHospitals] = useState<boolean>(false);

  const clinicDoctors = React.useMemo(() => {
    return getDoctorsForClinic(selectedClinic, selectedCity, selectedState, selectedHospitalAddress);
  }, [selectedClinic, selectedCity, selectedState, selectedHospitalAddress]);

  const [selectedDoc, setSelectedDoc] = useState<Doctor>(() => {
    const defaultCity = (profileCity && (INDIAN_CITIES_BY_STATE[initialUserState] || []).includes(profileCity))
      ? profileCity
      : ((INDIAN_CITIES_BY_STATE[initialUserState] || [])[0] || 'Bengaluru (Bangalore)');
    const defaultClinics = getClinicsForCity(defaultCity, initialUserState);
    const docs = getDoctorsForClinic(defaultClinics[0] || '', defaultCity, initialUserState);
    return docs[0] || getDoctorsForCity('Bengaluru')[0] || verifiedDoctors[0];
  });

  // Ensure selectedDoc stays valid for the chosen clinic
  useEffect(() => {
    if (clinicDoctors.length > 0) {
      const match = clinicDoctors.find(d => d.name === selectedDoc?.name && d.hospital === selectedDoc?.hospital);
      if (!match) {
        setSelectedDoc(clinicDoctors[0]);
      }
    }
  }, [clinicDoctors, selectedDoc]);

  const [hospitalSearch, setHospitalSearch] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("08:00 AM - 08:30 AM");
  const [slotFilter, setSlotFilter] = useState<'All' | 'Morning' | 'Afternoon' | 'Evening & Night'>('All');

  // Filtered slot groups based on user filter: All, Morning, Afternoon, or Evening & Night
  const displayedSlotGroups = React.useMemo(() => {
    if (slotFilter === 'All') return TIME_SLOT_GROUPS;
    return TIME_SLOT_GROUPS.filter(grp => grp.period === slotFilter);
  }, [slotFilter]);

  const handleSlotFilterChange = (filter: 'All' | 'Morning' | 'Afternoon' | 'Evening & Night') => {
    setSlotFilter(filter);
    playSound('click');
    if (filter === 'All') {
      if (!CONSULTATION_TIME_SLOTS.includes(bookingTime)) {
        setBookingTime(CONSULTATION_TIME_SLOTS[0]);
      }
    } else {
      const targetGroup = TIME_SLOT_GROUPS.find(g => g.period === filter);
      if (targetGroup && !targetGroup.slots.includes(bookingTime)) {
        setBookingTime(targetGroup.slots[0]);
      }
    }
  };

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Tab 2 Live Webinar Simulator states
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveChatMessages, setLiveChatMessages] = useState<{ sender: string; text: string; isUser?: boolean }[]>([]);
  const [liveUserQuestion, setLiveUserQuestion] = useState("");
  const [liveDoctorQueue, setLiveDoctorQueue] = useState<string[]>([]);
  const liveChatEndRef = useRef<HTMLDivElement>(null);
  const liveChatContainerRef = useRef<HTMLDivElement>(null);

  // Tab 2 Live Sessions Filter & Registration states
  const [liveDateFilter, setLiveDateFilter] = useState<string>('all');
  const [livePeriodFilter, setLivePeriodFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [liveSearchQuery, setLiveSearchQuery] = useState<string>('');
  const [registeredSessionIds, setRegisteredSessionIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tt_registered_live_sessions');
      return saved ? JSON.parse(saved) : ['live-1'];
    } catch {
      return ['live-1'];
    }
  });

  const getProfileEmail = () => {
    return (
      profile?.contactEmail?.trim() ||
      profile?.email?.trim() ||
      user?.email?.trim() ||
      localStorage.getItem('user_contact_email')?.trim() ||
      'lashm@gmail.com'
    );
  };

  const [registeringSession, setRegisteringSession] = useState<DemoLiveSession | null>(null);
  const [registerEmail, setRegisterEmail] = useState<string>(() => getProfileEmail());
  const [registerToast, setRegisterToast] = useState<string | null>(null);

  // Keep registerEmail in sync whenever user profile or general info email updates
  useEffect(() => {
    const latestMail = getProfileEmail();
    if (latestMail) {
      setRegisterEmail(latestMail);
    }
  }, [profile?.contactEmail, profile?.email, user?.email]);

  const handleOpenRegisterModal = (session: DemoLiveSession) => {
    playSound('pop');
    setRegisteringSession(session);
    setRegisterEmail(getProfileEmail());
  };

  const handleConfirmRegister = (session: DemoLiveSession) => {
    playSound('glass');
    const updated = Array.from(new Set([...registeredSessionIds, session.id]));
    setRegisteredSessionIds(updated);
    try {
      localStorage.setItem('tt_registered_live_sessions', JSON.stringify(updated));
      if (registerEmail.trim()) {
        localStorage.setItem('user_contact_email', registerEmail.trim());
      }
    } catch (e) {
      console.error(e);
    }
    setRegisteringSession(null);
    setRegisterToast(`Registration confirmed! We have registered ${registerEmail.trim() || 'your email'} for "${session.title}".`);
    setTimeout(() => {
      setRegisterToast(null);
    }, 6000);
  };

  const handleUnregister = (sessionId: string) => {
    playSound('pop');
    const updated = registeredSessionIds.filter(id => id !== sessionId);
    setRegisteredSessionIds(updated);
    try {
      localStorage.setItem('tt_registered_live_sessions', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredLiveSessions = React.useMemo(() => {
    return DEMO_LIVE_SESSIONS.filter(session => {
      // Date filter
      if (liveDateFilter !== 'all') {
        if (liveDateFilter === 'today' && session.dateKey !== 'today') return false;
        if (liveDateFilter === 'tomorrow' && session.dateKey !== 'tomorrow') return false;
        if (liveDateFilter === 'this_week' && session.dateKey !== 'today' && session.dateKey !== 'tomorrow' && session.dateKey !== 'this_week') return false;
        if (liveDateFilter === 'next_week' && session.dateKey !== 'next_week') return false;
      }

      // Period filter: morning, afternoon, evening
      if (livePeriodFilter !== 'all' && session.period !== livePeriodFilter) {
        return false;
      }

      // Search query
      if (liveSearchQuery.trim()) {
        const q = liveSearchQuery.toLowerCase();
        const matchTitle = session.title.toLowerCase().includes(q);
        const matchDoc = session.doctorName.toLowerCase().includes(q);
        const matchHosp = session.hospital.toLowerCase().includes(q);
        const matchTopic = session.topicTag.toLowerCase().includes(q);
        if (!matchTitle && !matchDoc && !matchHosp && !matchTopic) return false;
      }

      return true;
    });
  }, [liveDateFilter, livePeriodFilter, liveSearchQuery]);

  // Tab 3 AI Doctor Chat states
  const [chatCity, setChatCity] = useState<string>(() => {
    if (profileCity && (INDIAN_CITIES_BY_STATE[initialUserState] || []).includes(profileCity)) return profileCity;
    const defaultList = INDIAN_CITIES_BY_STATE[initialUserState] || INDIAN_CITIES_BY_STATE['Karnataka'] || [];
    return defaultList[0] || 'Bengaluru (Bangalore)';
  });
  const [activeChatDoc, setActiveChatDoc] = useState<Doctor>(() => getDoctorsForCity(profileCity || 'Bengaluru', initialUserState)[0] || verifiedDoctors[0]);
  const [consultationsView, setConsultationsView] = useState<'upcoming' | 'past'>('past');
  const [pastBookings, setPastBookings] = useState<PastConsultation[]>(initialPastBookings);
  const [selectedPastBookingModal, setSelectedPastBookingModal] = useState<PastConsultation | null>(null);

  // Sync active chat doctor when chatCity or selectedState changes
  useEffect(() => {
    const docs = getDoctorsForCity(chatCity, selectedState);
    if (docs && docs.length > 0) {
      setActiveChatDoc(docs[0]);
    }
  }, [chatCity, selectedState]);

  // Live Google Maps Places API & GPS Geolocation states (Zero Cooked-Up Data)
  interface GoogleListedHospital {
    placeId: string;
    name: string;
    address: string;
    location: { lat: number; lng: number };
    rating: number | null;
    userRatingCount: number;
    phone: string;
    googleMapsUri: string;
    reviewsUri: string;
    directionsUri: string;
    reviews: {
      authorName: string;
      authorUri: string;
      rating: number;
      relativeTime: string;
      text: string;
      googleMapsUri: string;
    }[];
    reviewSummary?: string;
    openNow?: boolean | null;
  }

  const [mapsApiKey, setMapsApiKey] = useState<string>(() => {
    return (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  });
  const [googleHospitals, setGoogleHospitals] = useState<GoogleListedHospital[]>([]);
  const [loadingGoogleHospitals, setLoadingGoogleHospitals] = useState<boolean>(false);
  const [hospitalsError, setHospitalsError] = useState<string | null>(null);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);
  const [gpsRadiusKm, setGpsRadiusKm] = useState<number>(10);
  const [lookupMode, setLookupMode] = useState<'city' | 'gps'>('city');
  const [selectedMapHospital, setSelectedMapHospital] = useState<GoogleListedHospital | null>(null);
  const [mapAnchorHospital, setMapAnchorHospital] = useState<GoogleListedHospital | null>(null);
  const [expandedReviewsPlaceId, setExpandedReviewsPlaceId] = useState<string | null>(null);

  // Build unique clinic label for any Google-listed hospital (appends locality when multiple branches share a name)
  const getHospitalClinicLabel = React.useCallback((hosp: GoogleListedHospital, allList: GoogleListedHospital[]) => {
    const sameNameCount = allList.filter(
      (h) => h.name.trim().toLowerCase() === hosp.name.trim().toLowerCase()
    ).length;
    if (sameNameCount > 1 && hosp.address) {
      const parts = hosp.address.split(',').map((s) => s.trim()).filter(Boolean);
      const locality = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
      if (locality && !hosp.name.toLowerCase().includes(locality.toLowerCase())) {
        return `${hosp.name} - ${locality}`;
      }
    }
    return hosp.name;
  }, []);

  // Select a Google-listed hospital from Step 1 card or Map pin and synchronize Step 2 clinic & doctors
  const handleSelectGoogleHospital = React.useCallback(
    (hosp: GoogleListedHospital, scrollToStep2: boolean = false, allList?: GoogleListedHospital[]) => {
      const listToUse = allList || googleHospitals;
      const clinicLabel = getHospitalClinicLabel(hosp, listToUse);
      setSelectedMapHospital(hosp);
      setSelectedClinic(clinicLabel);
      setSelectedHospitalAddress(hosp.address || '');
      const docs = getDoctorsForClinic(clinicLabel, selectedCity, selectedState, hosp.address || '');
      if (docs.length > 0) {
        setSelectedDoc(docs[0]);
      }
      playSound('click');
      if (scrollToStep2) {
        document.getElementById('pediatric-doctor-selection-section')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    },
    [googleHospitals, getHospitalClinicLabel, selectedCity, selectedState]
  );

  // Clicking a pin on the Google Map reorders the 6-hospital list around that hospital and updates Step 2
  const handleMapMarkerClick = React.useCallback(
    (hosp: GoogleListedHospital) => {
      setMapAnchorHospital(hosp);
      handleSelectGoogleHospital(hosp, false);
    },
    [handleSelectGoogleHospital]
  );

  // Load Google Maps API Key from server if not injected in Vite client env
  useEffect(() => {
    if (!mapsApiKey) {
      fetch('/api/maps-config')
        .then((r) => r.json())
        .then((d) => {
          if (d?.apiKey) setMapsApiKey(d.apiKey);
        })
        .catch(() => {});
    }
  }, [mapsApiKey]);

  // Fetch real Google-listed pediatric hospitals for the selected Indian city & state
  const fetchCityGoogleHospitals = async (city: string, state: string, customQuery?: string) => {
    setLoadingGoogleHospitals(true);
    setHospitalsError(null);
    setMapAnchorHospital(null);
    setShowAllHospitals(false);
    try {
      const res = await fetch('/api/hospitals/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: cleanCityName(city),
          state,
          query: customQuery || '',
        }),
      });

      if (res.status === 429) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        setHospitalsError('Google Maps Platform demo quota reached. Please connect your API key using the key icon at the top.');
        setGoogleHospitals([]);
        return;
      }

      const data = await res.json();
      if (data?.status === 'RESOURCE_EXHAUSTED') {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        setHospitalsError('Google Maps Platform demo quota reached.');
        setGoogleHospitals([]);
        return;
      }

      if (Array.isArray(data?.hospitals)) {
        setGoogleHospitals(data.hospitals);
        if (data.hospitals.length > 0) {
          const first = data.hospitals[0];
          const firstLabel = getHospitalClinicLabel(first, data.hospitals);
          setSelectedMapHospital(first);
          setSelectedClinic(firstLabel);
          setSelectedHospitalAddress(first.address || '');
          const docs = getDoctorsForClinic(firstLabel, city, state, first.address || '');
          if (docs.length > 0) setSelectedDoc(docs[0]);
        }
      } else {
        setGoogleHospitals([]);
      }
    } catch (err) {
      console.error('Error fetching Google Places hospitals:', err);
      setHospitalsError('Unable to reach Google Places service right now.');
    } finally {
      setLoadingGoogleHospitals(false);
    }
  };

  // Fetch real Google-listed pediatric hospitals near live GPS coordinates
  const fetchNearbyGpsHospitals = async (lat: number, lng: number, radiusKm: number) => {
    setLoadingGoogleHospitals(true);
    setHospitalsError(null);
    setMapAnchorHospital(null);
    setShowAllHospitals(false);
    try {
      const res = await fetch('/api/hospitals/nearby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat,
          lng,
          radiusMeters: radiusKm * 1000,
        }),
      });

      if (res.status === 429) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        setHospitalsError('Google Maps Platform demo quota reached. Please connect your API key using the key icon at the top.');
        setGoogleHospitals([]);
        return;
      }

      const data = await res.json();
      if (data?.status === 'RESOURCE_EXHAUSTED') {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        setHospitalsError('Google Maps Platform demo quota reached.');
        setGoogleHospitals([]);
        return;
      }

      if (Array.isArray(data?.hospitals)) {
        setGoogleHospitals(data.hospitals);
        if (data.hospitals.length > 0) {
          const first = data.hospitals[0];
          const firstLabel = getHospitalClinicLabel(first, data.hospitals);
          setSelectedMapHospital(first);
          setSelectedClinic(firstLabel);
          setSelectedHospitalAddress(first.address || '');
          const docs = getDoctorsForClinic(firstLabel, selectedCity, selectedState, first.address || '');
          if (docs.length > 0) setSelectedDoc(docs[0]);
        }
      } else {
        setGoogleHospitals([]);
      }
    } catch (err) {
      console.error('Error fetching GPS nearby hospitals:', err);
      setHospitalsError('Unable to fetch nearby hospitals from Google Places.');
    } finally {
      setLoadingGoogleHospitals(false);
    }
  };

  // Trigger live city lookup whenever selectedCity or selectedState changes (when in city mode)
  useEffect(() => {
    if (lookupMode === 'city') {
      fetchCityGoogleHospitals(selectedCity, selectedState);
    }
  }, [selectedCity, selectedState, lookupMode]);

  const handleUseLiveGps = () => {
    playSound('pop');
    if (!navigator.geolocation) {
      setHospitalsError('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    setHospitalsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setGpsLocation(coords);
        setLookupMode('gps');
        setGpsLoading(false);
        fetchNearbyGpsHospitals(coords.lat, coords.lng, gpsRadiusKm);
      },
      (err) => {
        setGpsLoading(false);
        setHospitalsError(
          err.code === 1
            ? 'Location permission denied. Please allow GPS location access in your browser settings or search by City above.'
            : 'Could not detect live GPS signal. Showing Google-listed hospitals for your selected city.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Filter real Google-listed hospitals by search box
  const filteredGoogleHospitals = React.useMemo(() => {
    if (!hospitalSearch.trim()) return googleHospitals;
    const q = hospitalSearch.toLowerCase();
    return googleHospitals.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q) ||
        (h.reviewSummary && h.reviewSummary.toLowerCase().includes(q))
    );
  }, [googleHospitals, hospitalSearch]);

  // Reorder hospitals when user clicks any hospital pin on the Google Map (putting clicked hospital #1 + nearest neighbors)
  const orderedGoogleHospitals = React.useMemo(() => {
    if (!mapAnchorHospital) return filteredGoogleHospitals;
    const anchorLat = mapAnchorHospital.location?.lat;
    const anchorLng = mapAnchorHospital.location?.lng;
    const getDistSq = (h: GoogleListedHospital) => {
      if (!anchorLat || !anchorLng || !h.location?.lat || !h.location?.lng) return 999999;
      const dLat = h.location.lat - anchorLat;
      const dLng = h.location.lng - anchorLng;
      return dLat * dLat + dLng * dLng;
    };
    return [...filteredGoogleHospitals].sort((a, b) => {
      if (a.placeId === mapAnchorHospital.placeId) return -1;
      if (b.placeId === mapAnchorHospital.placeId) return 1;
      return getDistSq(a) - getDistSq(b);
    });
  }, [filteredGoogleHospitals, mapAnchorHospital]);

  // Display only 6 nearest hospitals by default for demo purpose, or full list when expanded
  const DEMO_HOSPITAL_LIMIT = 6;
  const displayedGoogleHospitals = React.useMemo(() => {
    if (showAllHospitals) return orderedGoogleHospitals;
    return orderedGoogleHospitals.slice(0, DEMO_HOSPITAL_LIMIT);
  }, [orderedGoogleHospitals, showAllHospitals]);

  // Synchronize Step 2 clinic dropdown options with the displayed (6 demo or all) hospitals + currently selected clinic
  const allCityClinics = React.useMemo(() => {
    if (orderedGoogleHospitals.length > 0) {
      const labels = orderedGoogleHospitals.map((h) => getHospitalClinicLabel(h, googleHospitals));
      return Array.from(new Set(labels));
    }
    return getClinicsForCity(selectedCity, selectedState);
  }, [orderedGoogleHospitals, googleHospitals, getHospitalClinicLabel, selectedCity, selectedState]);

  const availableClinics = React.useMemo(() => {
    const baseList = showAllHospitals ? allCityClinics : allCityClinics.slice(0, DEMO_HOSPITAL_LIMIT);
    if (selectedClinic && !baseList.includes(selectedClinic)) {
      return [selectedClinic, ...baseList.slice(0, Math.max(0, baseList.length - 1))];
    }
    return baseList;
  }, [allCityClinics, showAllHospitals, selectedClinic]);

  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'doctor'; text: string; timestamp: Date }[]>(() => {
    const doc = getDoctorsForCity(profileCity || 'Bengaluru', initialUserState)[0] || verifiedDoctors[0];
    return [
      {
        sender: 'doctor',
        text: `Hello! I am ${doc.name} (${doc.degrees}) practicing at ${doc.hospital}, ${doc.location}. I am your verified developmental pediatrician. Feel free to ask me anything about infant weaning, fever protocols, growth curves, or sleep routines.`,
        timestamp: new Date()
      }
    ];
  });
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSelectChatDoctor = (doc: Doctor) => {
    playSound('click');
    setActiveChatDoc(doc);
    setChatMessages(prev => [
      ...prev,
      {
        sender: 'doctor',
        text: `Hello! I am ${doc.name} (${doc.degrees}) practicing at ${doc.hospital}, ${doc.location} (${doc.city}). I specialize in ${doc.specialty} with ${doc.experience}+ years experience. How may I guide you on your child's health or developmental milestones today?`,
        timestamp: new Date()
      }
    ]);
  };

  // Tab 4 Growth Reports states
  const parentName = isAccountUser
    ? (profile?.parentName || profile?.firstName || profile?.name || profile?.username || 'Parent')
    : (profile?.parentName || profile?.firstName || profile?.name || localStorage.getItem('parent_name') || 'Parent');
  const [childName, setChildName] = useState(() => {
    const raw = activeChild?.name || profile?.babyName || profile?.childName || (!isAccountUser ? localStorage.getItem('baby_name') : null);
    if (!isAccountUser && (!raw || raw.toLowerCase() === 'ashwath')) return 'Child 1';
    if (!isAccountUser && raw.toLowerCase() === 'ananya') return 'Child 2';
    return raw || (isAccountUser ? 'Child' : 'Child 1');
  });

  useEffect(() => {
    const nextName = activeChild?.name || profile?.babyName || profile?.childName;
    if (nextName) {
      if (!isAccountUser && nextName.toLowerCase() === 'ashwath') setChildName('Child 1');
      else if (!isAccountUser && nextName.toLowerCase() === 'ananya') setChildName('Child 2');
      else setChildName(nextName);
    }
  }, [activeChild?.name, profile?.babyName, profile?.childName, isAccountUser]);

  const [childAge, setChildAge] = useState(12);
  const [childGender, setChildGender] = useState<"Boy" | "Girl">("Boy");
  const [childWeight, setChildWeight] = useState(9.6);
  const [childHeight, setChildHeight] = useState(75.5);
  const [childHead, setChildHead] = useState(45.2);
  const [chartMetric, setChartMetric] = useState<'height' | 'weight'>('height');
  const [reportStep, setReportStep] = useState<string | null>(null);
  const [reportProgress, setReportProgress] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);

  // Growth checklist state based on selected age bracket
  const [milestonesChecklist, setMilestonesChecklist] = useState({
    standsHolding: true,
    saysMamaDada: true,
    wavesBye: true,
    pointsToNeeds: false,
    crawlsWell: true
  });

  // Calculate dynamic WHO Percentiles
  const expectedWeight = 3.3 + (childAge * 0.52);
  const expectedHeight = 50.0 + (childAge * 2.15);
  const expectedHead = 34.5 + (childAge * 0.45);

  const weightPercentile = Math.max(3, Math.min(97, Math.round(50 + (childWeight - expectedWeight) * 18)));
  const heightPercentile = Math.max(3, Math.min(97, Math.round(50 + (childHeight - expectedHeight) * 10)));
  const headPercentile = Math.max(3, Math.min(97, Math.round(50 + (childHead - expectedHead) * 22)));

  // Synchronize city if state changes
  useEffect(() => {
    if (stateCities.length > 0 && !stateCities.includes(selectedCity)) {
      const initialCity = (profileCity && stateCities.includes(profileCity)) ? profileCity : stateCities[0];
      setSelectedCity(initialCity);
      setChatCity(initialCity);
    }
  }, [stateCities, profileCity, selectedCity]);

  // Synchronize fallback clinics and doctors when city or state changes before Google Places finishes
  useEffect(() => {
    const cl = getClinicsForCity(selectedCity, selectedState);
    if (cl && cl.length > 0) {
      setSelectedClinic(cl[0]);
      setSelectedHospitalAddress('');
    }
    const docs = getDoctorsForCity(selectedCity, selectedState);
    if (docs && docs.length > 0) {
      setSelectedDoc(docs[0]);
    }
  }, [selectedCity, selectedState]);

  // Load Bookings from Firestore
  useEffect(() => {
    if (!user) return;
    
    setLoadingBookings(true);
    const q = query(
      collection(db, 'consultations'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Booking[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          ...data,
        } as Booking);
      });
      setBookings(items);
      setLoadingBookings(false);
    }, (error) => {
      console.error("Error loading consultations:", error);
      setLoadingBookings(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Auto-scroll chat boxes internally only (do NOT scroll the entire window)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (liveChatContainerRef.current) {
      liveChatContainerRef.current.scrollTop = liveChatContainerRef.current.scrollHeight;
    }
  }, [liveChatMessages]);

  // Ensure window stays at top when switching between pediatric tabs or subtabs
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeTab, subParam]);

  // Live Webinar Chat simulation
  useEffect(() => {
    if (!isLiveActive) return;

    const dummyParentNames = [
      "Neha S.", "Raman Preet", "Kartik S.", "Dr. Shalini (Mod)", "Priya (Mother of 2)", "Arun K."
    ];
    const dummyMessages = [
      "Is ragi powder safe to give to an 8 month old toddler?",
      "How can I manage the extreme night waking patterns?",
      "Thanks for explaining about the palmar grasp, Dr.!",
      "Should we completely avoid cow's milk before 12 months?",
      "My 2-year old only wants to eat biscuits. Any picky eater tips?",
      "Excellent presentation so far!",
      "We started potty training last week, but having regular accidents.",
      "Is a 12 hour sleep cycle normal for a 15 month old baby?"
    ];

    // Seed initial audience messages
    setLiveChatMessages([
      { sender: "Dr. Shalini (Mod)", text: "Welcome everyone to our weekly pediatric seminar! Dr. Rajesh Iyer will start the live session shortly." },
      { sender: "Neha S.", text: "Excited for this! My baby has been a very picky eater lately." }
    ]);

    const interval = setInterval(() => {
      const randomName = dummyParentNames[Math.floor(Math.random() * dummyParentNames.length)];
      const randomText = dummyMessages[Math.floor(Math.random() * dummyMessages.length)];
      setLiveChatMessages(prev => [...prev, { sender: randomName, text: randomText }]);
      playSound('pop');
    }, 6000);

    return () => clearInterval(interval);
  }, [isLiveActive]);

  // Handle Book consultation action
  const handleBookConsultation = async () => {
    if (!user) return;
    if (!bookingDate) {
      alert("Please select a date first!");
      return;
    }
    
    setIsSubmitting(true);
    playSound('click');

    try {
      const payload = {
        userId: user.uid,
        doctorName: selectedDoc.name,
        specialty: selectedDoc.specialty,
        city: selectedCity,
        clinic: selectedClinic,
        date: bookingDate,
        time: bookingTime,
        status: 'confirmed', // confirm instantly for smooth simulation
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'consultations'), payload);
      void trackFeatureAction('Pediatric Care', 'Consultation Booked', 'pediatric');
      
      playSound('glass');
      setSuccessMessage(gt('bookingConfirmed'));
      setTimeout(() => setSuccessMessage(""), 5000);
      
      // Reset date
      setBookingDate("");
    } catch (err) {
      console.error("Booking error:", err);
      handleFirestoreError(err, 'create', 'consultations');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel Appointment
  const handleCancelBooking = async (id: string) => {
    playSound('click');
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await deleteDoc(doc(db, 'consultations', id));
      playSound('click');
    } catch (err) {
      console.error("Cancellation error:", err);
      handleFirestoreError(err, 'delete', 'consultations');
    }
  };

  // Submit live question to doctor
  const handleLiveQuestionSubmit = (e?: React.FormEvent) => {
    if (e?.preventDefault) e.preventDefault();
    if (!liveUserQuestion.trim()) return;

    playSound('click');
    setLiveChatMessages(prev => [...prev, { sender: "You (Parent)", text: liveUserQuestion, isUser: true }]);
    setLiveDoctorQueue(prev => [...prev, liveUserQuestion]);
    
    const userQ = liveUserQuestion;
    setLiveUserQuestion("");

    // Simulate doctor answering the question after 12 seconds
    setTimeout(() => {
      setLiveChatMessages(prev => [
        ...prev, 
        { 
          sender: "Dr. Rajesh Iyer (LIVE Host)", 
          text: `Great question about: "${userQ}". As we discussed, consistency in the schedule is key. We shouldn't rush the process!` 
        }
      ]);
      playSound('glass');
    }, 12000);
  };

  // Send message to AI doctor chat with Real-Time Streaming (/api/pediatrician-chat-stream)
  const handleSendChat = async (e?: React.FormEvent) => {
    if (e?.preventDefault) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput;
    const doctorReplyTimestamp = new Date();
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: userText, timestamp: new Date() },
      { sender: 'doctor', text: '', timestamp: doctorReplyTimestamp },
    ]);
    setChatInput("");
    setIsChatLoading(true);
    playSound('click');
    void trackFeatureAction('Pediatric Care', 'Doctor Chat Asked', 'pediatric');

    try {
      const response = await fetch('/api/pediatrician-chat-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctor: {
            name: activeChatDoc.name,
            degrees: activeChatDoc.degrees,
            hospital: activeChatDoc.hospital,
            location: activeChatDoc.location,
            city: activeChatDoc.city,
            specialty: activeChatDoc.specialty,
            experience: activeChatDoc.experience,
          },
          parentName,
          childName,
          userText,
        }),
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (chunk) {
            accumulated += chunk;
            setChatMessages(prev => {
              const updated = [...prev];
              const lastIdx = updated.length - 1;
              if (lastIdx >= 0 && updated[lastIdx].sender === 'doctor') {
                updated[lastIdx] = { ...updated[lastIdx], text: accumulated };
              }
              return updated;
            });
          }
        }
        playSound('glass');
      } else {
        setChatMessages(prev => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (lastIdx >= 0 && updated[lastIdx].sender === 'doctor') {
            updated[lastIdx] = {
              ...updated[lastIdx],
              text: `I am ${activeChatDoc.name}. I'm sorry, I couldn't process your question at the moment. Please feel free to ask again or reach out to ${activeChatDoc.hospital}.`,
            };
          }
          return updated;
        });
      }
    } catch (err) {
      console.error("AI Doctor chat streaming error:", err);
      setChatMessages(prev => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (lastIdx >= 0 && updated[lastIdx].sender === 'doctor') {
          updated[lastIdx] = {
            ...updated[lastIdx],
            text: `Apologies, my system connection is momentarily unstable. Please consult our clinic at ${activeChatDoc.hospital}, ${activeChatDoc.location} directly for urgent advice.`,
          };
        }
        return updated;
      });
    } finally {
      setIsChatLoading(false);
    }
  };

  // Generate Growth PDF Report Simulator
  const triggerGenerateReport = () => {
    playSound('click');
    setReportStep("Compiling raw child development metrics...");
    setReportProgress(10);
    
    setTimeout(() => {
      setReportStep("Comparing weight and height curves to standard Indian IAP child percentiles...");
      setReportProgress(40);
      playSound('pop');
    }, 800);

    setTimeout(() => {
      setReportStep("Validating pediatric motor/sensory milestone checks...");
      setReportProgress(70);
      playSound('pop');
    }, 1600);

    setTimeout(() => {
      setReportStep("Finalizing certified developmental health analytics report...");
      setReportProgress(95);
      playSound('glass');
    }, 2400);

    setTimeout(() => {
      setReportStep(null);
      setReportProgress(100);
      setShowReportModal(true);
    }, 3200);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-10 sm:space-y-14 text-left text-slate-100 font-sans mb-16">
      
      {/* =========================================================
          HERO LANDING SECTION (COMPACT WIDTH, SINGLE-LINE TEXT)
      ========================================================== */}
      <section className="relative overflow-hidden max-w-4xl mx-auto rounded-[2rem] border border-indigo-400/25 bg-gradient-to-br from-[#12192d] via-[#0c1324] to-[#070b16] px-6 py-6 sm:px-10 sm:py-8 shadow-2xl">
        <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-indigo-500/10 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-emerald-500/10 blur-[90px]" />

        <div className="relative z-10 text-center space-y-2.5 overflow-x-auto no-scrollbar">
          <div className="inline-flex items-center justify-center gap-2 text-indigo-300 text-[11px] sm:text-xs font-bold tracking-wider uppercase whitespace-nowrap">
            <Stethoscope className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Verified Pediatric Clinical Suite</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug whitespace-nowrap">
            {gt('sectionTitle')}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-normal whitespace-nowrap">
            {gt('sectionSubtitle')}
          </p>
        </div>
      </section>

      {/* =========================================================
          SEGREGATED PEDIATRIC MENU NAVIGATION BAR (4 MENU BUTTONS)
      ========================================================== */}
      <nav
        aria-label="Pediatric Care Sections"
        className="rounded-[2rem] bg-[#0b1222]/95 border border-white/15 p-3 sm:p-4 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-2 pb-3 mb-3 border-b border-white/10">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Pediatric Care Navigation Menu
          </span>
          <span className="text-xs text-indigo-300 font-medium">
            Select a clinical service below to explore
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Menu Nav Button 1: Pediatric 1:1 Consult */}
          <button
            type="button"
            onClick={() => { setActiveTab('consults'); playSound('click'); }}
            className={`p-4 sm:p-5 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
              activeTab === 'consults'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-xl shadow-indigo-600/25'
                : 'bg-[#121c33] text-slate-200 border-white/10 hover:border-indigo-400/40 hover:bg-[#16223d]'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
              activeTab === 'consults' ? 'bg-white/20 text-white' : 'bg-indigo-500/15 text-indigo-300'
            }`}>
              <Stethoscope className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="text-sm sm:text-base font-black leading-snug">
                {gt('tabConsults')}
              </div>
              <div className={`text-xs leading-relaxed ${
                activeTab === 'consults' ? 'text-indigo-100' : 'text-slate-400'
              }`}>
                {gt('tabConsultsSub')}
              </div>
            </div>
          </button>

          {/* Menu Nav Button 2: Live Sessions */}
          <button
            type="button"
            onClick={() => { setActiveTab('live'); playSound('click'); }}
            className={`p-4 sm:p-5 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
              activeTab === 'live'
                ? 'bg-rose-600 text-white border-rose-400 shadow-xl shadow-rose-600/25'
                : 'bg-[#121c33] text-slate-200 border-white/10 hover:border-rose-400/40 hover:bg-[#16223d]'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
              activeTab === 'live' ? 'bg-white/20 text-white' : 'bg-rose-500/15 text-rose-300'
            }`}>
              <Tv className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="text-sm sm:text-base font-black leading-snug">
                {gt('tabLive')}
              </div>
              <div className={`text-xs leading-relaxed ${
                activeTab === 'live' ? 'text-rose-100' : 'text-slate-400'
              }`}>
                {gt('tabLiveSub')}
              </div>
            </div>
          </button>

          {/* Menu Nav Button 3: Doctor Chat */}
          <button
            type="button"
            onClick={() => { setActiveTab('chat'); playSound('click'); }}
            className={`p-4 sm:p-5 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
              activeTab === 'chat'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-xl shadow-emerald-600/25'
                : 'bg-[#121c33] text-slate-200 border-white/10 hover:border-emerald-400/40 hover:bg-[#16223d]'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
              activeTab === 'chat' ? 'bg-white/20 text-white' : 'bg-emerald-500/15 text-emerald-300'
            }`}>
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="text-sm sm:text-base font-black leading-snug">
                {gt('tabChat')}
              </div>
              <div className={`text-xs leading-relaxed ${
                activeTab === 'chat' ? 'text-emerald-100' : 'text-slate-400'
              }`}>
                {gt('tabChatSub')}
              </div>
            </div>
          </button>

          {/* Menu Nav Button 4: Growth Reports */}
          <button
            type="button"
            onClick={() => { setActiveTab('reports'); playSound('click'); }}
            className={`p-4 sm:p-5 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
              activeTab === 'reports'
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-xl shadow-amber-500/25'
                : 'bg-[#121c33] text-slate-200 border-white/10 hover:border-amber-400/40 hover:bg-[#16223d]'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
              activeTab === 'reports' ? 'bg-slate-950/15 text-slate-950' : 'bg-amber-500/15 text-amber-300'
            }`}>
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="text-sm sm:text-base font-black leading-snug">
                {gt('tabReports')}
              </div>
              <div className={`text-xs leading-relaxed ${
                activeTab === 'reports' ? 'text-slate-900 font-semibold' : 'text-slate-400'
              }`}>
                {gt('tabReportsSub')}
              </div>
            </div>
          </button>
        </div>
      </nav>

      {/* =========================================================
          MAIN CONTENT SECTIONS (SPACIOUS SECTION-BY-SECTION FLOW)
      ========================================================== */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'consults' && (
            <motion.div
              key="consults-panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-10 sm:space-y-12"
            >
              {/* =========================================================
                  SECTION A: YOUR CONSULTATIONS RECORDS BAR
              ========================================================== */}
              <section className="rounded-[2rem] bg-[#0d1424]/95 border border-white/10 p-6 sm:p-8 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-lg sm:text-xl font-black text-white">Your Consultations Records</h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      View all clinical slips, doctor prescriptions, and booked appointments
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => { playSound('click'); navigate('/consultations?tab=upcoming'); }}
                    className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Clock className="w-4 h-4 text-indigo-200" />
                    <span>Upcoming Consultations ({bookings.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { playSound('click'); navigate('/consultations?tab=past'); }}
                    className="px-5 py-3 rounded-xl bg-[#16223a] hover:bg-[#1c2b49] text-white font-bold text-xs sm:text-sm transition-all border border-white/15 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-amber-300" />
                    <span>Past Consultations ({pastBookings.length})</span>
                  </button>
                </div>
              </section>

              {/* =========================================================
                  SECTION B (STEP 01): LOCATION & GOOGLE-LISTED PEDIATRIC HOSPITALS
                  (First step in booking order: Choose State/City or GPS & explore hospitals on Google Maps)
              ========================================================== */}
              <section className="rounded-[2.5rem] bg-[#0d1424]/95 border border-white/10 p-6 sm:p-10 lg:p-12 shadow-2xl space-y-8">
                {/* Step 01 Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
                  <div className="space-y-2 max-w-3xl">
                    <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      Step 01 · Location &amp; Hospital Discovery
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {lookupMode === 'gps' && gpsLocation
                        ? `Google-Listed Pediatric Hospitals Near Your GPS (${gpsRadiusKm} km)`
                        : `Google-Listed Pediatric Hospitals in ${cleanCityName(selectedCity)}`}
                    </h2>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      100% real hospitals verified directly from Google Maps Places API (New) with live ratings, street addresses, and authentic Google Reviews.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <div className="text-xs sm:text-sm font-bold text-emerald-300">
                      Showing {displayedGoogleHospitals.length} of {orderedGoogleHospitals.length} Live Google Places
                    </div>
                    {orderedGoogleHospitals.length > DEMO_HOSPITAL_LIMIT && (
                      <button
                        type="button"
                        onClick={() => {
                          playSound('click');
                          setShowAllHospitals((prev) => !prev);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-xs font-bold text-indigo-200 hover:text-white transition-all cursor-pointer"
                      >
                        {showAllHospitals
                          ? `Show Top ${DEMO_HOSPITAL_LIMIT} (Demo View)`
                          : `Show All (${orderedGoogleHospitals.length})`}
                      </button>
                    )}
                  </div>
                </div>

                {/* Location Selectors: State & City + GPS Lookup Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* State Selector */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold text-slate-200">Select State</label>
                      <span className="text-xs text-indigo-300 font-medium">36 States &amp; UTs (A-Z)</span>
                    </div>
                    <div className="relative">
                      <select
                        value={selectedState}
                        onChange={(e) => { 
                          const newState = e.target.value;
                          setSelectedState(newState); 
                          localStorage.setItem('user_indian_state', newState);
                          const citiesForNewState = [...(INDIAN_CITIES_BY_STATE[newState] || [])].sort((a, b) => a.localeCompare(b));
                          if (citiesForNewState.length > 0) {
                            const newCity = citiesForNewState[0];
                            setSelectedCity(newCity);
                            setChatCity(newCity);
                            localStorage.setItem('user_city', newCity);
                            const newClinics = getClinicsForCity(newCity, newState);
                            if (newClinics.length > 0) {
                              setSelectedClinic(newClinics[0]);
                              setSelectedHospitalAddress('');
                              const docs = getDoctorsForClinic(newClinics[0], newCity, newState);
                              if (docs.length > 0) setSelectedDoc(docs[0]);
                            }
                          }
                          playSound('click'); 
                        }}
                        className="w-full bg-[#141f38] border border-white/15 rounded-2xl px-4 py-3.5 text-base text-white focus:outline-none focus:border-indigo-400 appearance-none cursor-pointer font-bold"
                      >
                        {allStatesList.map(st => (
                          <option key={st} value={st} className="bg-neutral-900 text-white font-bold text-base">{st}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* City Selector */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold text-slate-200">{gt('cityLabel')}</label>
                      <span className="text-xs text-indigo-300 font-medium">{stateCities.length} Cities (A-Z)</span>
                    </div>
                    <div className="relative">
                      <select
                        value={selectedCity}
                        onChange={(e) => { 
                          const newCity = e.target.value;
                          setSelectedCity(newCity); 
                          setChatCity(newCity);
                          localStorage.setItem('user_city', newCity);
                          const newClinics = getClinicsForCity(newCity, selectedState);
                          if (newClinics.length > 0) {
                            setSelectedClinic(newClinics[0]);
                            setSelectedHospitalAddress('');
                            const docs = getDoctorsForClinic(newClinics[0], newCity, selectedState);
                            if (docs.length > 0) setSelectedDoc(docs[0]);
                          }
                          playSound('click'); 
                        }}
                        className="w-full bg-[#141f38] border border-white/15 rounded-2xl px-4 py-3.5 text-base text-white focus:outline-none focus:border-indigo-400 appearance-none cursor-pointer font-bold"
                      >
                        {stateCities.map(city => (
                          <option key={city} value={city} className="bg-neutral-900 text-white font-bold text-base">{city}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Search & Live GPS Controls Row */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-2">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Filter or search Google Places for a specific hospital or locality..."
                        value={hospitalSearch}
                        onChange={(e) => setHospitalSearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && hospitalSearch.trim()) {
                            e.preventDefault();
                            fetchCityGoogleHospitals(selectedCity, selectedState, hospitalSearch.trim());
                          }
                        }}
                        className="w-full bg-[#141f38] border border-white/15 rounded-xl pl-11 pr-10 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 font-medium"
                      />
                      {hospitalSearch && (
                        <button
                          onClick={() => {
                            setHospitalSearch('');
                            if (lookupMode === 'city') {
                              fetchCityGoogleHospitals(selectedCity, selectedState);
                            }
                          }}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fetchCityGoogleHospitals(selectedCity, selectedState, hospitalSearch.trim())}
                      disabled={loadingGoogleHospitals}
                      className="px-5 py-3 rounded-xl bg-[#16223a] hover:bg-[#1c2b49] border border-white/15 text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    >
                      {loadingGoogleHospitals ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4 text-indigo-400" />}
                      <span>Search Google Maps</span>
                    </button>
                  </div>

                  {/* GPS Lookup Controls */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleUseLiveGps}
                      disabled={gpsLoading || loadingGoogleHospitals}
                      className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                        lookupMode === 'gps'
                          ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                      }`}
                    >
                      {gpsLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Navigation className="w-4 h-4" />
                      )}
                      <span>{lookupMode === 'gps' ? 'Refresh My GPS Location' : 'Use My Live GPS Location'}</span>
                    </button>

                    {lookupMode === 'gps' && gpsLocation && (
                      <>
                        <select
                          aria-label="GPS Search Radius"
                          value={gpsRadiusKm}
                          onChange={(e) => {
                            const r = Number(e.target.value) || 10;
                            setGpsRadiusKm(r);
                            fetchNearbyGpsHospitals(gpsLocation.lat, gpsLocation.lng, r);
                          }}
                          className="bg-[#141f38] border border-white/15 rounded-xl px-3.5 py-3 text-xs sm:text-sm font-bold text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                        >
                          <option value={5}>Within 5 km</option>
                          <option value={10}>Within 10 km</option>
                          <option value={25}>Within 25 km</option>
                          <option value={50}>Within 50 km</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => {
                            playSound('click');
                            setLookupMode('city');
                          }}
                          className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs sm:text-sm font-bold text-white cursor-pointer"
                        >
                          Switch to {cleanCityName(selectedCity)} City View
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {hospitalsError && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm font-semibold flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>{hospitalsError}</span>
                  </div>
                )}

                {/* Interactive Google Map View (@vis.gl/react-google-maps) */}
                {mapsApiKey && filteredGoogleHospitals.length > 0 && (
                  <div className="rounded-3xl overflow-hidden border border-white/15 shadow-2xl h-[420px] sm:h-[480px] w-full relative bg-slate-900">
                    <APIProvider apiKey={mapsApiKey}>
                      <GoogleMap
                        mapId="DEMO_MAP_ID"
                        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                        defaultZoom={12}
                        defaultCenter={
                          selectedMapHospital?.location?.lat
                            ? selectedMapHospital.location
                            : gpsLocation || filteredGoogleHospitals[0]?.location || { lat: 12.9716, lng: 77.5946 }
                        }
                        gestureHandling="greedy"
                        zoomControl={true}
                        scrollwheel={true}
                        draggable={true}
                        disableDoubleClickZoom={false}
                        keyboardShortcuts={true}
                        fullscreenControl={true}
                        disableDefaultUI={false}
                        className="w-full h-full"
                      >
                        <MapCameraController
                          selectedHospital={selectedMapHospital}
                          gpsLocation={gpsLocation}
                          hospitals={filteredGoogleHospitals}
                          cityKey={`${selectedState}_${selectedCity}_${lookupMode}`}
                        />
                        {gpsLocation && (
                          <AdvancedMarker position={gpsLocation} title="Your Live GPS Location">
                            <Pin background="#10b981" borderColor="#064e3b" glyphColor="#ffffff" />
                          </AdvancedMarker>
                        )}

                        {filteredGoogleHospitals.map((hosp) =>
                          hosp.location?.lat && hosp.location?.lng ? (
                            <AdvancedMarker
                              key={hosp.placeId}
                              position={hosp.location}
                              title={hosp.name}
                              onClick={() => handleMapMarkerClick(hosp)}
                            >
                              <Pin
                                background={selectedMapHospital?.placeId === hosp.placeId ? '#6366f1' : '#ef4444'}
                                borderColor="#ffffff"
                                glyphColor="#ffffff"
                              />
                            </AdvancedMarker>
                          ) : null
                        )}

                        {selectedMapHospital && selectedMapHospital.location?.lat && (
                          <InfoWindow
                            position={selectedMapHospital.location}
                            onCloseClick={() => setSelectedMapHospital(null)}
                          >
                            <div className="text-slate-900 p-1.5 max-w-[260px] space-y-2">
                              <div className="font-bold text-xs sm:text-sm leading-snug">{selectedMapHospital.name}</div>
                              <div className="text-xs text-slate-600 leading-relaxed">{selectedMapHospital.address}</div>
                              {selectedMapHospital.rating && (
                                <div className="text-xs font-bold text-amber-600">
                                  ★ {selectedMapHospital.rating} ({selectedMapHospital.userRatingCount} Google reviews)
                                </div>
                              )}
                              <div className="pt-1 flex flex-wrap items-center gap-3">
                                <a
                                  href={selectedMapHospital.googleMapsUri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-bold text-indigo-600 underline"
                                >
                                  Open Maps
                                </a>
                                <a
                                  href={selectedMapHospital.reviewsUri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-bold text-amber-700 underline"
                                >
                                  Google Reviews
                                </a>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleSelectGoogleHospital(selectedMapHospital, true)}
                                className="w-full mt-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
                              >
                                Select &amp; Book Consult →
                              </button>
                            </div>
                          </InfoWindow>
                        )}
                      </GoogleMap>
                    </APIProvider>
                  </div>
                )}

                {/* Active Map Selection Status Bar */}
                {mapAnchorHospital && (
                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs sm:text-sm text-indigo-200 font-medium">
                      <span className="font-black text-white">Map Hospital Selected:</span> Showing nearest hospitals around{' '}
                      <span className="font-bold text-emerald-300">{mapAnchorHospital.name}</span> &amp; updated Step 02 specialists.
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setMapAnchorHospital(null);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white shrink-0 cursor-pointer"
                    >
                      Reset Default List Order
                    </button>
                  </div>
                )}

                {/* Hospital Cards Grid (6 Cards by default for demo purpose, expandable to full list) */}
                {loadingGoogleHospitals ? (
                  <div className="p-14 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col items-center justify-center gap-3 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                    <div className="text-base font-bold text-white">
                      Fetching live Google-listed hospitals from Google Maps Places API...
                    </div>
                  </div>
                ) : displayedGoogleHospitals.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-2">
                    <Building2 className="w-10 h-10 text-slate-500 mx-auto" />
                    <div className="text-base font-bold text-white">No Google-listed hospitals matched your filter</div>
                    <p className="text-sm text-slate-400">
                      Try clearing the search box or clicking "Use My Live GPS Location" above.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {displayedGoogleHospitals.map((hosp, idx) => {
                        const isReviewsOpen = expandedReviewsPlaceId === hosp.placeId;
                        const hospClinicLabel = getHospitalClinicLabel(hosp, googleHospitals);
                        const isSelectedHospital =
                          selectedMapHospital?.placeId === hosp.placeId ||
                          selectedClinic === hospClinicLabel;
                        return (
                          <div
                            key={hosp.placeId || idx}
                            onClick={() => handleSelectGoogleHospital(hosp, false)}
                            className={`bg-[#121c33] border rounded-3xl p-6 sm:p-7 space-y-5 transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                              isSelectedHospital
                                ? 'border-indigo-400 bg-[#162342] shadow-xl shadow-indigo-500/15'
                                : 'border-white/10 hover:border-indigo-400/40'
                            }`}
                          >
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold flex-wrap">
                                    <span className="text-indigo-300 font-mono font-bold">
                                      {idx + 1 < 10 ? `0${idx + 1}.` : `${idx + 1}.`}
                                    </span>
                                    <span className="text-emerald-300">Google Verified Place</span>
                                    {hosp.rating && (
                                      <>
                                        <span aria-hidden="true">·</span>
                                        <span className="text-amber-300 font-bold">
                                          ★ {hosp.rating} ({hosp.userRatingCount.toLocaleString()} Google reviews)
                                        </span>
                                      </>
                                    )}
                                    {hosp.openNow !== null && hosp.openNow !== undefined && (
                                      <>
                                        <span aria-hidden="true">·</span>
                                        <span className={hosp.openNow ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
                                          {hosp.openNow ? 'Open Now' : 'Closed'}
                                        </span>
                                      </>
                                    )}
                                  </div>

                                  {isSelectedHospital && (
                                    <span className="text-xs font-bold text-emerald-300">
                                      Selected in Step 02 ✓
                                    </span>
                                  )}
                                </div>

                                <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                                  {hosp.name}
                                </h3>
                              </div>

                              <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-2.5 text-slate-300">
                                  <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-1" />
                                  <span className="leading-relaxed">{hosp.address}</span>
                                </div>
                                {hosp.reviewSummary && (
                                  <p className="text-xs sm:text-sm text-indigo-200 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-3.5 leading-relaxed">
                                    {hosp.reviewSummary}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-3 flex-wrap text-xs font-bold pt-1">
                                {hosp.phone && (
                                  <a
                                    href={`tel:${hosp.phone.replace(/[^0-9+]/g, '')}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center gap-2 transition-colors"
                                  >
                                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>{hosp.phone}</span>
                                  </a>
                                )}
                                {hosp.reviews && hosp.reviews.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      playSound('pop');
                                      setExpandedReviewsPlaceId(isReviewsOpen ? null : hosp.placeId);
                                    }}
                                    className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                                  >
                                    <span>{isReviewsOpen ? 'Hide Snippets' : `Preview ${hosp.reviews.length} Top Reviews`}</span>
                                  </button>
                                )}
                              </div>

                              {/* Expandable Real Google User Reviews Drawer */}
                              {isReviewsOpen && hosp.reviews && hosp.reviews.length > 0 && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="mt-3 pt-4 border-t border-white/10 space-y-3 max-h-60 overflow-y-auto pr-1"
                                >
                                  <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                                    Authentic Google Maps User Reviews
                                  </div>
                                  {hosp.reviews.map((rev, rIdx) => (
                                    <div key={rIdx} className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5 text-xs">
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="font-bold text-white">{rev.authorName}</span>
                                        <span className="text-amber-300 font-bold">
                                          {'★'.repeat(Math.max(1, Math.min(5, Math.round(rev.rating))))} {rev.relativeTime && `· ${rev.relativeTime}`}
                                        </span>
                                      </div>
                                      {rev.text && <p className="text-slate-300 leading-relaxed">{rev.text}</p>}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Mandatory Action Buttons: View Google Maps & Google Reviews + Book Consult */}
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3"
                            >
                              <div className="flex flex-wrap items-center gap-2.5">
                                <a
                                  href={hosp.googleMapsUri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3.5 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-xs text-indigo-200 hover:text-white font-bold flex items-center gap-1.5 transition-all"
                                >
                                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>View Google Maps</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>

                                <a
                                  href={hosp.reviewsUri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-xs text-amber-200 hover:text-white font-bold flex items-center gap-1.5 transition-all"
                                >
                                  <span>★ Google Reviews</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleSelectGoogleHospital(hosp, true)}
                                className="text-xs px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                              >
                                <span>Book Consult</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Show More / Show Top 6 Demo Toggle Footer */}
                    {orderedGoogleHospitals.length > DEMO_HOSPITAL_LIMIT && (
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#121c33]/80 border border-white/10">
                        <div className="text-xs sm:text-sm text-slate-300">
                          {showAllHospitals ? (
                            <span>
                              Showing all <strong className="text-white">{orderedGoogleHospitals.length}</strong> Google-listed pediatric hospitals in {cleanCityName(selectedCity)}.
                            </span>
                          ) : (
                            <span>
                              Showing top <strong className="text-white">{DEMO_HOSPITAL_LIMIT}</strong> nearest hospitals for demo view (click any pin on the map above to update this list, or expand to view all <strong className="text-white">{orderedGoogleHospitals.length}</strong> hospitals).
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            playSound('click');
                            setShowAllHospitals((prev) => !prev);
                          }}
                          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 shadow-lg shadow-indigo-600/20"
                        >
                          {showAllHospitals
                            ? `Show Only ${DEMO_HOSPITAL_LIMIT} Hospitals (Demo View)`
                            : `View All ${orderedGoogleHospitals.length} Nearest Hospitals`}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* =========================================================
                  SECTION C (STEP 02): SELECT CLINIC & VERIFIED PEDIATRICIAN
                  (Second step in booking order: Choose clinic & doctor with full readable cards)
              ========================================================== */}
              <section
                id="pediatric-doctor-selection-section"
                className="rounded-[2.5rem] bg-[#0d1424]/95 border border-white/10 p-6 sm:p-10 lg:p-12 shadow-2xl space-y-8 scroll-mt-24"
              >
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-white/10">
                  <div className="space-y-2 max-w-3xl">
                    <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      Step 02 · Clinic &amp; Specialist Selection
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {gt('clinicLabel')} &amp; {gt('doctorLabel')}
                    </h2>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Selected hospital from Step 01 is automatically synced below. You can also switch between the nearest hospitals or expand the full list.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-indigo-300">
                      Showing {availableClinics.length} of {allCityClinics.length} Verified Clinics
                    </span>
                    {allCityClinics.length > DEMO_HOSPITAL_LIMIT && (
                      <button
                        type="button"
                        onClick={() => {
                          playSound('click');
                          setShowAllHospitals((prev) => !prev);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white cursor-pointer"
                      >
                        {showAllHospitals ? `Top ${DEMO_HOSPITAL_LIMIT} Demo List` : `Show All (${allCityClinics.length})`}
                      </button>
                    )}
                  </div>
                </div>

                {/* Clinic / Hospital Selector */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="block text-sm font-bold text-slate-200">{gt('clinicLabel')}</label>
                    <span className="text-xs text-emerald-300 font-semibold">
                      Active Clinic: {selectedClinic}
                    </span>
                  </div>
                  <div className="relative">
                    <select
                      value={selectedClinic}
                      onChange={(e) => { 
                        const newClinic = e.target.value;
                        setSelectedClinic(newClinic);
                        const matchedGoogleHosp = googleHospitals.find(
                          (h) => getHospitalClinicLabel(h, googleHospitals) === newClinic || h.name === newClinic
                        );
                        const addr = matchedGoogleHosp?.address || '';
                        if (matchedGoogleHosp) {
                          setSelectedMapHospital(matchedGoogleHosp);
                        }
                        setSelectedHospitalAddress(addr);
                        const docs = getDoctorsForClinic(newClinic, selectedCity, selectedState, addr);
                        if (docs.length > 0) setSelectedDoc(docs[0]);
                        playSound('click'); 
                      }}
                      className="w-full bg-[#141f38] border border-white/15 rounded-2xl px-4 py-4 text-base text-white focus:outline-none focus:border-indigo-400 appearance-none cursor-pointer font-bold"
                    >
                      {availableClinics.map(clinic => (
                        <option key={clinic} value={clinic} className="bg-neutral-900 text-white font-bold text-base">{clinic}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Doctor Selector Cards (Spacious, Full Text, Zero Overlapping or Truncation) */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="block text-base font-black text-white">{gt('doctorLabel')}</label>
                    <span className="text-xs sm:text-sm text-indigo-300 font-semibold">
                      {clinicDoctors.length} Verified at {selectedClinic || cleanCityName(selectedCity)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {clinicDoctors.map(doc => {
                      const isSelected = selectedDoc.name === doc.name && selectedDoc.hospital === doc.hospital;
                      return (
                        <button
                          key={doc.id || `${doc.name}-${doc.hospital}`}
                          type="button"
                          onClick={() => { setSelectedDoc(doc); playSound('click'); }}
                          className={`p-6 rounded-3xl border text-left flex items-start gap-4 transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'bg-[#162447] border-indigo-400 shadow-xl shadow-indigo-500/15'
                              : 'bg-[#121c33] border-white/10 hover:border-indigo-400/40 hover:bg-[#15203b]'
                          }`}
                        >
                          <div className="text-3xl p-3.5 bg-white/5 border border-white/10 rounded-2xl shrink-0">
                            {doc.image}
                          </div>
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                                  {doc.name}
                                </h3>
                                <p className="text-xs font-mono text-amber-300 font-semibold mt-0.5 leading-relaxed">
                                  {doc.degrees}
                                </p>
                              </div>
                              {isSelected && (
                                <span className="text-xs font-bold text-emerald-300 shrink-0">
                                  Selected ✓
                                </span>
                              )}
                            </div>

                            <div className="text-sm text-indigo-200 font-semibold flex items-start gap-2 leading-snug">
                              <Building2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                              <span>{doc.hospital}</span>
                            </div>

                            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                              {doc.location} · {doc.specialty}
                            </div>

                            <div className="pt-1 text-xs sm:text-sm text-indigo-300 font-bold">
                              {doc.experience} {gt('yearsExp')} exp · {doc.rating} ★
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* =========================================================
                  SECTION D (STEP 03): DATE, TIME SLOT & CONFIRM CONSULTATION
                  (Third step in booking order: Pick Date & Time and Confirm Booking)
              ========================================================== */}
              <section
                id="pediatric-schedule-booking-section"
                className="rounded-[2.5rem] bg-[#0d1424]/95 border border-indigo-400/30 p-6 sm:p-10 lg:p-12 shadow-2xl space-y-8 scroll-mt-24"
              >
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-white/10">
                  <div className="space-y-2 max-w-3xl">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Step 03 · Schedule &amp; Confirm Appointment
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {gt('dateLabel')} &amp; {gt('timeLabel')}
                    </h2>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Select your preferred appointment date and 30-minute consultation slot with <strong className="text-white">{selectedDoc.name}</strong> at <strong className="text-indigo-200">{selectedClinic}</strong>.
                    </p>
                  </div>
                </div>

                {successMessage && (
                  <div className="p-5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-2xl flex items-center gap-3">
                    <Check className="w-6 h-6 shrink-0 text-emerald-400" />
                    <span className="text-sm sm:text-base font-bold">{successMessage}</span>
                  </div>
                )}

                {/* Date & Time Slot Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Date Picker */}
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-200">{gt('dateLabel')}</label>
                    <input
                      type="date"
                      value={bookingDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-[#141f38] border border-white/15 rounded-2xl px-4 py-4 text-base text-white focus:outline-none focus:border-indigo-400 cursor-pointer font-bold"
                    />
                    <p className="text-xs text-slate-400">
                      Appointments are available 7 days a week across verified partner clinics.
                    </p>
                  </div>

                  {/* Time Slot Picker */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="block text-sm font-bold text-slate-200">{gt('timeLabel')}</label>
                      <span className="text-xs font-bold text-emerald-400">
                        {slotFilter === 'All'
                          ? '8:00 AM - 10:00 PM (All 28 Slots)'
                          : slotFilter === 'Morning'
                          ? '8:00 AM - 12:00 PM (8 Slots)'
                          : slotFilter === 'Afternoon'
                          ? '12:00 PM - 5:00 PM (10 Slots)'
                          : '5:00 PM - 10:00 PM (10 Slots)'}
                      </span>
                    </div>

                    <div className="relative">
                      <select
                        value={bookingTime}
                        onChange={(e) => { setBookingTime(e.target.value); playSound('click'); }}
                        className="w-full bg-[#141f38] border border-white/15 rounded-2xl px-4 py-4 text-base text-white focus:outline-none focus:border-indigo-400 appearance-none cursor-pointer font-bold"
                      >
                        {displayedSlotGroups.map(grp => (
                          <optgroup key={grp.period} label={grp.label} className="bg-neutral-900 text-indigo-300 font-black">
                            {grp.slots.map(slot => (
                              <option key={slot} value={slot} className="bg-neutral-900 text-white font-bold text-base">
                                {slot}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Time Period Filter Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleSlotFilterChange('All')}
                        className={`text-xs px-3.5 py-2 rounded-xl border font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          slotFilter === 'All'
                            ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                            : 'bg-[#141f38] hover:bg-white/10 text-slate-300 border-white/10'
                        }`}
                      >
                        <span>All Slots (28)</span>
                      </button>
                      {TIME_SLOT_GROUPS.map(grp => (
                        <button
                          key={grp.period}
                          type="button"
                          onClick={() => handleSlotFilterChange(grp.period as any)}
                          className={`text-xs px-3.5 py-2 rounded-xl border font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            slotFilter === grp.period
                              ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                              : 'bg-[#141f38] hover:bg-white/10 text-slate-300 border-white/10'
                          }`}
                        >
                          <span>{grp.period} ({grp.slots.length})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Consultation Fee & Selected Appointment Summary */}
                <div className="p-6 bg-[#121c33] border border-indigo-400/25 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-base font-black text-white">Doctor Pediatric Consultation Fee</span>
                      <span className="text-xs font-bold text-amber-300">
                        · To be paid at the hospital
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300">
                      {selectedDoc.name} ({selectedDoc.degrees}) · {selectedClinic}, {cleanCityName(selectedCity)}
                    </p>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-emerald-400 shrink-0">
                    ₹399 / Consult
                  </div>
                </div>

                {/* Confirm & Book Consultation Action */}
                <div className="flex justify-center pt-2">
                  <button
                    onClick={handleBookConsultation}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black text-base rounded-2xl transition-all duration-200 shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-3 cursor-pointer"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CalendarDays className="w-5 h-5" />}
                    <span>{gt('bookBtn')}</span>
                  </button>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'live' && (
            <motion.div
              key="live-panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-10 sm:space-y-12"
            >
              {!isLiveActive ? (
                <>
                  {/* =========================================================
                      SECTION 1: LIVE WEBINARS FILTER & SEARCH CONTROLS
                  ========================================================== */}
                  <section className="rounded-[2.5rem] bg-[#0d1424]/95 border border-white/10 p-6 sm:p-8 lg:p-10 shadow-2xl space-y-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
                      <div className="space-y-1">
                        <div className="text-xs font-bold uppercase tracking-wider text-rose-400">
                          Interactive Clinical Webcasts
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                          <Tv className="w-6 h-6 text-rose-400" />
                          <span>{gt('upcomingLiveSessions')}</span>
                        </h2>
                      </div>
                      <span className="text-xs sm:text-sm text-slate-300 font-semibold">
                        Showing {filteredLiveSessions.length} upcoming interactive sessions
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Date Filter Dropdown */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Filter by Date</label>
                        <div className="flex items-center gap-2 bg-[#141f38] px-4 py-3 rounded-2xl border border-white/15">
                          <Calendar className="w-4 h-4 text-rose-400 shrink-0" />
                          <select
                            value={liveDateFilter}
                            onChange={(e) => { playSound('click'); setLiveDateFilter(e.target.value); }}
                            className="w-full bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer"
                          >
                            <option value="all" className="bg-neutral-900 text-white">All Dates</option>
                            <option value="today" className="bg-neutral-900 text-white">Today (Oct 5)</option>
                            <option value="tomorrow" className="bg-neutral-900 text-white">Tomorrow (Oct 6)</option>
                            <option value="this_week" className="bg-neutral-900 text-white">This Week</option>
                            <option value="next_week" className="bg-neutral-900 text-white">Next Week</option>
                          </select>
                        </div>
                      </div>

                      {/* Session Slot Filter Dropdown */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Filter by Time Slot</label>
                        <div className="flex items-center gap-2 bg-[#141f38] px-4 py-3 rounded-2xl border border-white/15">
                          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                          <select
                            value={livePeriodFilter}
                            onChange={(e) => { playSound('click'); setLivePeriodFilter(e.target.value as any); }}
                            className="w-full bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer"
                          >
                            <option value="all" className="bg-neutral-900 text-white">All Slots (Morning, Afternoon, Evening)</option>
                            <option value="morning" className="bg-neutral-900 text-white">🌅 Morning (8 AM - 12 PM)</option>
                            <option value="afternoon" className="bg-neutral-900 text-white">☀️ Afternoon (12 PM - 5 PM)</option>
                            <option value="evening" className="bg-neutral-900 text-white">🌙 Evening (5 PM - 9 PM)</option>
                          </select>
                        </div>
                      </div>

                      {/* Search Box */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Search Topic or Doctor</label>
                        <div className="relative">
                          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={liveSearchQuery}
                            onChange={(e) => setLiveSearchQuery(e.target.value)}
                            placeholder="Search webinars, doctors, topics..."
                            className="w-full bg-[#141f38] border border-white/15 rounded-2xl pl-11 pr-9 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-rose-400 font-medium"
                          />
                          {liveSearchQuery && (
                            <button
                              onClick={() => setLiveSearchQuery('')}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick Segmented Slot Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {[
                        { id: 'all', label: 'All Time Slots' },
                        { id: 'morning', label: '🌅 Morning' },
                        { id: 'afternoon', label: '☀️ Afternoon' },
                        { id: 'evening', label: '🌙 Evening' }
                      ].map(pf => (
                        <button
                          key={pf.id}
                          onClick={() => { playSound('click'); setLivePeriodFilter(pf.id as any); }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            livePeriodFilter === pf.id
                              ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                              : 'bg-[#141f38] hover:bg-white/10 text-slate-300 border border-white/10'
                          }`}
                        >
                          {pf.label}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Toast alert when registered */}
                  {registerToast && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-between gap-3 text-sm font-bold shadow-lg"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span>{registerToast}</span>
                      </div>
                      <button onClick={() => setRegisterToast(null)} className="text-white/60 hover:text-white text-xs px-2 py-1">✕</button>
                    </motion.div>
                  )}

                  {/* =========================================================
                      SECTION 2: UPCOMING LIVE WEBINARS GRID
                  ========================================================== */}
                  {filteredLiveSessions.length === 0 ? (
                    <section className="p-14 rounded-[2.5rem] bg-[#0d1424]/95 border border-white/10 text-center space-y-4 shadow-2xl">
                      <Tv className="w-12 h-12 text-slate-500 mx-auto" />
                      <h3 className="text-lg font-bold text-white">No Upcoming Live Sessions Found</h3>
                      <p className="text-sm text-slate-400 max-w-md mx-auto">
                        No scheduled webinars match your active date or slot filter. Try selecting "All Dates" or "All Slots".
                      </p>
                      <button
                        onClick={() => {
                          playSound('pop');
                          setLiveDateFilter('all');
                          setLivePeriodFilter('all');
                          setLiveSearchQuery('');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    </section>
                  ) : (
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {filteredLiveSessions.map((session) => {
                        const isRegistered = registeredSessionIds.includes(session.id);

                        return (
                          <div
                            key={session.id}
                            className={`p-7 sm:p-8 bg-[#0d1424]/95 rounded-[2.5rem] border transition-all duration-200 flex flex-col justify-between shadow-2xl space-y-6 ${
                              session.isLiveNow
                                ? 'border-rose-500/50'
                                : isRegistered
                                  ? 'border-emerald-500/40'
                                  : 'border-white/10 hover:border-white/25'
                            }`}
                          >
                            <div className="space-y-5">
                              {/* Top Metadata Line */}
                              <div className="flex items-center justify-between gap-3 flex-wrap text-xs font-bold">
                                <div className="flex items-center gap-2 text-slate-300">
                                  <span className={session.topicColor.text}>{session.topicTag}</span>
                                  <span aria-hidden="true">·</span>
                                  <span className="capitalize flex items-center gap-1">
                                    {session.period === 'morning' && <Sunrise className="w-3.5 h-3.5 text-amber-400" />}
                                    {session.period === 'afternoon' && <Sun className="w-3.5 h-3.5 text-amber-300" />}
                                    {session.period === 'evening' && <Moon className="w-3.5 h-3.5 text-indigo-300" />}
                                    <span>{session.period} Session</span>
                                  </span>
                                </div>

                                <div>
                                  {session.isLiveNow ? (
                                    <span className="text-rose-400 font-black uppercase tracking-wider">
                                      ● {gt('liveNow')}
                                    </span>
                                  ) : isRegistered ? (
                                    <span className="text-emerald-300 font-black uppercase tracking-wider flex items-center gap-1">
                                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                      <span>Registered</span>
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                                      <Users className="w-4 h-4 text-indigo-400" />
                                      <span>{session.registeredCount} registered</span>
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Session Title */}
                              <h3 className="text-xl sm:text-2xl font-black text-white leading-snug tracking-tight">
                                {session.title}
                              </h3>

                              {/* Doctor Details & Hospital Affiliation */}
                              <div className="p-5 rounded-2xl bg-[#131d33] border border-white/10 space-y-3 text-sm">
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                                      <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <div className="font-black text-white text-base">{session.doctorName}</div>
                                      <div className="text-xs text-amber-300 font-mono">{session.degrees}</div>
                                    </div>
                                  </div>
                                  <span className="text-xs font-bold text-indigo-300">
                                    {session.doctorSpecialty}
                                  </span>
                                </div>

                                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-emerald-300 font-medium pt-3 border-t border-white/10">
                                  <Building2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                  <span className="leading-relaxed">
                                    <strong className="text-emerald-200">Hospital:</strong> {session.hospital}, {session.city}
                                  </span>
                                </div>
                              </div>

                              {/* Date and Time Details */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="p-4 rounded-2xl bg-[#131d33] border border-white/10 flex items-center gap-3.5">
                                  <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 shrink-0">
                                    <Calendar className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-400 font-bold">Date</div>
                                    <div className="font-bold text-white">{session.dateStr}</div>
                                  </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-[#131d33] border border-white/10 flex items-center gap-3.5">
                                  <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 shrink-0">
                                    <Clock className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-400 font-bold">Time Slot</div>
                                    <div className="font-bold text-white">{session.timeStr}</div>
                                  </div>
                                </div>
                              </div>

                              {/* Detailed Session Description */}
                              <p className="text-sm text-slate-300 leading-relaxed">
                                {session.description}
                              </p>
                            </div>

                            {/* Session Actions: Register or Join */}
                            <div className="pt-4 border-t border-white/10">
                              {session.isLiveNow ? (
                                <button
                                  onClick={() => { setIsLiveActive(true); playSound('glass'); }}
                                  className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-black text-sm sm:text-base rounded-2xl transition-all shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                  <Video className="w-5 h-5" />
                                  <span>{gt('joinLiveSession')}</span>
                                </button>
                              ) : isRegistered ? (
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 py-3.5 px-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 text-center">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Registered</span>
                                  </div>
                                  <button
                                    onClick={() => handleUnregister(session.id)}
                                    title="Cancel registration"
                                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 transition-all text-xs cursor-pointer"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleOpenRegisterModal(session)}
                                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm sm:text-base rounded-2xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                  <UserPlus className="w-5 h-5 text-indigo-200" />
                                  <span>Register</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </section>
                  )}
                </>
              ) : (
                /* Active Immersive Live Session view */
                <section className="rounded-[2.5rem] bg-[#0d1424]/95 border border-white/10 p-6 sm:p-8 shadow-2xl">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[540px]">
                    {/* Simulated Video Player */}
                    <div className="lg:col-span-7 bg-black rounded-3xl border border-white/10 relative overflow-hidden flex flex-col">
                      <div className="p-4 bg-gradient-to-b from-black/85 to-transparent absolute top-0 left-0 w-full z-10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                          <span className="text-xs font-black text-white tracking-widest uppercase">LIVE WEBCAST</span>
                        </div>
                        <button
                          onClick={() => { setIsLiveActive(false); playSound('click'); }}
                          className="px-4 py-2 bg-white/15 hover:bg-rose-600 hover:text-white rounded-xl text-xs font-black text-white transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <VideoOff className="w-4 h-4" />
                          {gt('endSession')}
                        </button>
                      </div>

                      {/* High-tech Speaker Simulation */}
                      <div className="flex-1 bg-gradient-to-b from-neutral-900 to-neutral-950 flex flex-col items-center justify-center p-8 text-center">
                        <div className="relative mb-4">
                          <div className="w-24 h-24 bg-indigo-500/20 border-2 border-indigo-500 rounded-full flex items-center justify-center text-5xl shadow-inner relative">
                            👨‍⚕️
                          </div>
                          <div className="absolute bottom-0 right-0 p-1.5 bg-emerald-500 rounded-full border-2 border-neutral-900">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <div className="text-white font-black text-xl">Dr. Rajesh Iyer</div>
                        <div className="text-sm text-indigo-400 font-bold mb-6">Speaking: Nutritional benefits of Sprouted Ragi Gruel</div>

                        {/* Presentation slide representation */}
                        <div className="w-full max-w-md bg-white/5 border border-white/10 p-5 rounded-2xl text-left space-y-2">
                          <div className="text-xs text-amber-300 font-black tracking-wider uppercase flex items-center gap-1.5">
                            <Award className="w-4 h-4" />
                            <span>Key Slide Takeaways</span>
                          </div>
                          <div className="text-sm font-semibold text-white/95 leading-relaxed">
                            Calcium &amp; Iron bioavailability is increased by 40% when sprouting grains. Great for motor coordination milestones!
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-neutral-900/90 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                        <div className="flex items-center gap-2 font-semibold">
                          <Users className="w-4 h-4 text-indigo-400" />
                          <span>142 Parents participating live</span>
                        </div>
                        <div className="font-bold text-emerald-400">Audio/HD Video Connected</div>
                      </div>
                    </div>

                    {/* Live Chat Panel */}
                    <div className="lg:col-span-5 flex flex-col bg-[#121c33] border border-white/10 rounded-3xl overflow-hidden h-[540px]">
                      <div className="px-5 py-4 bg-white/5 border-b border-white/10 flex items-center gap-2.5">
                        <MessageSquare className="w-4 h-4 text-indigo-400" />
                        <h4 className="text-sm font-black text-white uppercase tracking-wider">{gt('liveChatFeed')}</h4>
                      </div>

                      <div ref={liveChatContainerRef} className="flex-1 overflow-y-auto p-5 space-y-4">
                        {liveChatMessages.map((msg, i) => (
                          <div key={i} className={`text-sm space-y-1 max-w-[90%] ${msg.isUser ? 'ml-auto text-right' : ''}`}>
                            <div className={`font-black text-xs ${msg.isUser ? 'text-indigo-300' : 'text-amber-300'}`}>{msg.sender}</div>
                            <div className={`p-3.5 rounded-2xl leading-relaxed text-white/90 inline-block text-sm ${msg.isUser ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/5 rounded-tl-none'}`}>{msg.text}</div>
                          </div>
                        ))}
                        <div ref={liveChatEndRef} />
                      </div>

                      {/* Submit Question form */}
                      <div className="p-4 bg-white/5 border-t border-white/10 flex items-end gap-2.5">
                        <textarea
                          rows={1}
                          value={liveUserQuestion}
                          onChange={(e) => setLiveUserQuestion(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.stopPropagation();
                            }
                          }}
                          placeholder={`${gt('questionPlaceholder')} (Press Enter for line break)`}
                          className="flex-1 bg-[#0d1424] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-400 resize-y min-h-[44px] leading-relaxed"
                        />
                        <button
                          type="button"
                          onClick={() => handleLiveQuestionSubmit()}
                          disabled={!liveUserQuestion.trim()}
                          className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition-colors shrink-0 cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat-panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-10 sm:space-y-12"
            >
              {/* =========================================================
                  SECTION 1: VERIFIED PEDIATRIC SPECIALISTS DIRECTORY
              ========================================================== */}
              <section className="rounded-[2.5rem] bg-[#0d1424]/95 border border-white/10 p-6 sm:p-10 lg:p-12 shadow-2xl space-y-8">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
                  <div className="space-y-2 max-w-2xl">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Step 01 · Choose On-Demand Specialist
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                      <Stethoscope className="w-7 h-7 text-emerald-400" />
                      <span>Verified Pediatric Specialists Directory</span>
                    </h2>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Filter by city in <span className="text-indigo-300 font-bold">{selectedState}</span> to consult top verified pediatricians from accredited hospitals.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    {/* State Selector */}
                    <div className="space-y-1.5">
                      <span className="block text-xs text-slate-400 font-bold">State</span>
                      <div className="relative">
                        <select
                          value={selectedState}
                          onChange={(e) => {
                            const newState = e.target.value;
                            setSelectedState(newState);
                            localStorage.setItem('user_indian_state', newState);
                            const cities = [...(INDIAN_CITIES_BY_STATE[newState] || [])].sort((a, b) => a.localeCompare(b));
                            if (cities.length > 0) {
                              const newCity = cities[0];
                              setSelectedCity(newCity);
                              setChatCity(newCity);
                              localStorage.setItem('user_city', newCity);
                              const cityDocs = getDoctorsForCity(newCity, newState);
                              if (cityDocs.length > 0) {
                                handleSelectChatDoctor(cityDocs[0]);
                              }
                            }
                            playSound('click');
                          }}
                          className="bg-[#141f38] border border-white/15 text-white font-bold text-sm rounded-xl px-4 py-2.5 pr-9 focus:outline-none focus:border-indigo-400 cursor-pointer appearance-none"
                        >
                          {allStatesList.map(st => (
                            <option key={st} value={st} className="bg-neutral-900 text-white font-bold">{st}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* City Selector */}
                    <div className="space-y-1.5">
                      <span className="block text-xs text-slate-400 font-bold">City</span>
                      <div className="relative">
                        <select
                          value={chatCity}
                          onChange={(e) => {
                            const newCity = e.target.value;
                            setChatCity(newCity);
                            setSelectedCity(newCity);
                            localStorage.setItem('user_city', newCity);
                            playSound('click');
                            const cityDocs = getDoctorsForCity(newCity, selectedState);
                            if (cityDocs.length > 0) {
                              handleSelectChatDoctor(cityDocs[0]);
                            }
                          }}
                          className="bg-[#141f38] border border-white/15 text-white font-bold text-sm rounded-xl px-4 py-2.5 pr-9 focus:outline-none focus:border-indigo-400 cursor-pointer appearance-none"
                        >
                          {stateCities.map(c => (
                            <option key={c} value={c} className="bg-neutral-900 text-white font-bold">{c}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Doctor Chat Fee & Session Banner */}
                <div className="p-5 bg-[#121c33] border border-indigo-400/25 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-sm">
                  <div className="flex items-center gap-2.5 text-slate-200 flex-wrap">
                    <span className="font-bold">Doctor Chat Consultation: <span className="text-emerald-300 font-black">₹199 for all doctors</span></span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-300 font-bold">1 Session is 20 min</span>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400">
                    Instant 1:1 Pediatric Clinical Q&amp;A with Qualified Pediatricians in Our Partner Network
                  </div>
                </div>

                {/* Doctors List for this City (Spacious, Full Text, Zero Truncation) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {getDoctorsForCity(chatCity, selectedState).map(doc => {
                    const isSelected = activeChatDoc.name === doc.name;
                    return (
                      <div
                        key={doc.id || doc.name}
                        onClick={() => handleSelectChatDoctor(doc)}
                        className={`p-6 rounded-3xl border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 ${
                          isSelected
                            ? 'bg-[#162447] border-emerald-400 shadow-xl shadow-emerald-500/10'
                            : 'bg-[#121c33] border-white/10 hover:border-emerald-400/40 hover:bg-[#15203b]'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <span className="text-3xl p-3 bg-white/5 border border-white/10 rounded-2xl shrink-0">{doc.image}</span>
                          <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-base font-black text-white leading-snug">{doc.name}</h3>
                              {isSelected && (
                                <span className="text-xs font-bold text-emerald-300 shrink-0">Active ✓</span>
                              )}
                            </div>
                            <div className="text-xs font-mono text-amber-300 font-semibold leading-relaxed">
                              {doc.degrees}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-white/10 text-xs sm:text-sm">
                          <div className="text-indigo-200 font-semibold flex items-start gap-2 leading-snug">
                            <Building2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                            <span>{doc.hospital}</span>
                          </div>
                          <div className="text-slate-300">
                            {doc.location}, {doc.city}
                          </div>
                          <div className="text-slate-400 leading-relaxed">
                            {doc.specialty}
                          </div>
                          <div className="pt-1 text-emerald-300 font-bold">
                            {doc.experience} yrs exp · {doc.rating} ★
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* =========================================================
                  SECTION 2: ACTIVE DOCTOR CHAT WINDOW
              ========================================================== */}
              <section className="rounded-[2.5rem] bg-[#0d1424]/95 border border-emerald-400/30 p-5 sm:p-8 shadow-2xl space-y-5">
                <div className="w-full bg-[#111a2e] border border-white/10 rounded-3xl flex flex-col h-[580px] shadow-xl overflow-hidden">
                  {/* Chat Header with Hospital, Degrees & Location */}
                  <div className="px-6 py-5 bg-white/5 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-13 h-13 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-2xl shadow-inner shrink-0">
                        {activeChatDoc.image}
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                            {activeChatDoc.name}
                          </h3>
                          <span className="text-xs font-mono text-amber-300 font-bold">
                            · {activeChatDoc.degrees}
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm text-indigo-200 font-semibold flex items-center gap-1.5 flex-wrap">
                          <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                          <span>{activeChatDoc.hospital} · {activeChatDoc.location} ({activeChatDoc.city})</span>
                        </div>
                        <div className="text-xs text-emerald-400 font-bold">
                          Online · {activeChatDoc.specialty}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="hidden sm:flex text-xs font-bold text-amber-300 items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-amber-400" />
                        <span>Clinic Verified</span>
                      </div>
                      <div className="text-sm font-mono font-black text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-2 rounded-xl">
                        ₹199 / 20 min
                      </div>
                    </div>
                  </div>

                  {/* Messages Body */}
                  <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs sm:text-sm rounded-2xl leading-relaxed flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                      <span>{gt('chatDisclaimer')}</span>
                    </div>

                    {chatMessages.map((msg, i) => {
                      const isDoc = msg.sender === 'doctor';
                      const prevUserMsg = i > 0 && chatMessages[i - 1]?.sender === 'user' ? chatMessages[i - 1].text : '';
                      const emergencyInfo = isDoc && i > 0 ? detectEmergencyCondition(prevUserMsg, msg.text) : { isEmergency: false, type: 'severe_illness' as const };
                      const isChoking = emergencyInfo.type === 'choking';

                      return (
                        <div key={i} className={`flex ${isDoc ? 'justify-start' : 'justify-end'}`}>
                          <div className={`flex items-start gap-3 max-w-[88%] ${isDoc ? '' : 'flex-row-reverse'}`}>
                            {isDoc && (
                              <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 shrink-0 flex items-center justify-center text-base">
                                {activeChatDoc.image}
                              </div>
                            )}
                            <div className="space-y-3">
                              <div className={`p-4 sm:p-5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap text-left ${isDoc ? 'bg-white/5 text-white/95 rounded-tl-none border border-white/10' : 'bg-indigo-600 text-white rounded-tr-none shadow-md'}`}>
                                {msg.text}
                              </div>

                              {isDoc && emergencyInfo.isEmergency && (
                                <div className="rounded-2xl border-2 border-rose-500/70 bg-gradient-to-br from-rose-950/90 via-[#1f0913]/95 to-slate-950 p-5 shadow-xl space-y-3 text-left">
                                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-500/30 pb-3">
                                    <div>
                                      <span className="text-rose-300 text-xs font-black uppercase tracking-wider">
                                        Urgent Action Required
                                      </span>
                                      <h4 className="text-base font-black text-white mt-0.5">
                                        Emergency First Aid
                                      </h4>
                                    </div>
                                    <a
                                      href="tel:108"
                                      onClick={() => playSound('pop')}
                                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all no-underline"
                                    >
                                      <Phone className="w-3.5 h-3.5" />
                                      <span>Call Pediatrician</span>
                                    </a>
                                  </div>
                                  <div className="text-xs sm:text-sm text-rose-100/95 space-y-2 leading-relaxed">
                                    {isChoking ? (
                                      <ol className="list-decimal pl-4 space-y-1.5 text-slate-100">
                                        <li><strong>5 Firm Back Blows:</strong> Hold infant face-down along forearm (or lean older child forward) and give 5 firm blows between shoulder blades.</li>
                                        <li><strong>5 Chest / Abdominal Thrusts:</strong> Give 5 two-finger chest thrusts (under 1 yr) or 5 abdominal thrusts (over 1 yr). Repeat cycles of 5 &amp; 5.</li>
                                        <li><strong>No Blind Finger Sweep:</strong> Never reach inside the mouth unless you clearly see a loose object.</li>
                                      </ol>
                                    ) : (
                                      <ol className="list-decimal pl-4 space-y-1.5 text-slate-100">
                                        <li><strong>Airway &amp; Positioning:</strong> Keep child upright for breathing distress, or on their side (recovery position) during a seizure.</li>
                                        <li><strong>Temperature &amp; Hydration:</strong> Sponge with lukewarm water for high fever and offer small sips of Indian IAP-approved ORS if awake.</li>
                                        <li><strong>Immediate Hospital Triage:</strong> Call <strong>112 / 108</strong> immediately for blue lips, chest retractions, or lethargy.</li>
                                      </ol>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm">
                            {activeChatDoc.image}
                          </div>
                          <div className="p-4 bg-white/5 rounded-2xl rounded-tl-none border border-white/10 flex items-center gap-2.5">
                            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                            <span className="text-xs sm:text-sm text-slate-300 font-bold">{activeChatDoc.name} is typing clinical guidance...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input panel */}
                  <div className="p-4 bg-white/5 border-t border-white/10 flex items-end gap-3">
                    <textarea
                      rows={1}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.stopPropagation();
                        }
                      }}
                      disabled={isChatLoading}
                      placeholder={`Ask ${activeChatDoc.name} about nutrition, feeding, fever, or sleep... (Press Enter for line break)`}
                      className="flex-1 bg-[#0d1424] border border-white/15 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-400 disabled:opacity-50 resize-y min-h-[48px] leading-relaxed"
                    />
                    <VoiceDictationButton
                      language={language}
                      label="Voice"
                      compact={false}
                      onTranscript={(spoken) => setChatInput((prev) => (prev ? `${prev} ${spoken}` : spoken))}
                    />
                    <button
                      type="button"
                      onClick={() => handleSendChat()}
                      disabled={!chatInput.trim() || isChatLoading}
                      className="py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-2xl transition-all font-black text-sm flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* =========================================================
                  SECTION 3: PAST DOCTOR CHAT CONVERSATIONS ARCHIVE
              ========================================================== */}
              <section className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 bg-[#0d1424]/95 border border-white/10 rounded-[2rem] shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-black text-white">Past Doctor Chat Conversations</h3>
                    <p className="text-xs sm:text-sm text-slate-300">View complete transcripts, clinical summaries, and pediatric consultation archives</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playSound('click');
                    navigate('/doctor-chat-history');
                  }}
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg flex items-center gap-2.5 transition-all cursor-pointer shrink-0"
                >
                  <Clock className="w-4 h-4 text-amber-300" />
                  <span>View History of Doctor Chat Conversation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </section>
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div
              key="reports-panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-10 sm:space-y-12"
            >
              {/* =========================================================
                  SECTION 1: TODDLER GROWTH INPUTS & MILESTONES CHECKLIST
              ========================================================== */}
              <section className="rounded-[2.5rem] bg-[#0d1424]/95 border border-white/10 p-6 sm:p-10 lg:p-12 shadow-2xl space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10">
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Step 01 · Anthropometric Parameters
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                      <TrendingUp className="w-7 h-7 text-amber-400" />
                      <span>Toddler Growth Inputs</span>
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Toddler Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-200">Child's Name</label>
                    <input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="Child 1"
                      className="w-full bg-[#141f38] border border-white/15 rounded-2xl px-4 py-3.5 text-base text-white focus:outline-none focus:border-amber-400 font-bold"
                    />
                  </div>

                  {/* Age in Months */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-200">Age (Months)</label>
                    <div className="relative">
                      <select
                        value={childAge}
                        onChange={(e) => { setChildAge(Number(e.target.value)); playSound('click'); }}
                        className="w-full bg-[#141f38] border border-white/15 rounded-2xl px-4 py-3.5 text-base text-white focus:outline-none focus:border-amber-400 appearance-none font-bold cursor-pointer"
                      >
                        {[0, 3, 6, 9, 12, 15, 18, 24, 30, 36].map(m => (
                          <option key={m} value={m} className="bg-neutral-900 text-white font-bold text-base">{m} Months</option>
                        ))}
                      </select>
                      <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-200">Gender</label>
                    <div className="grid grid-cols-2 bg-[#141f38] border border-white/15 rounded-2xl p-1">
                      <button
                        type="button"
                        onClick={() => { setChildGender('Boy'); playSound('click'); }}
                        className={`py-2.5 rounded-xl text-sm font-black cursor-pointer transition-colors ${childGender === 'Boy' ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white'}`}
                      >
                        Boy
                      </button>
                      <button
                        type="button"
                        onClick={() => { setChildGender('Girl'); playSound('click'); }}
                        className={`py-2.5 rounded-xl text-sm font-black cursor-pointer transition-colors ${childGender === 'Girl' ? 'bg-pink-500 text-white' : 'text-slate-300 hover:text-white'}`}
                      >
                        Girl
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Weight */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-200">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={childWeight}
                      onChange={(e) => setChildWeight(Number(e.target.value))}
                      className="w-full bg-[#141f38] border border-white/15 rounded-2xl px-4 py-3.5 text-base text-white focus:outline-none focus:border-amber-400 font-bold"
                    />
                  </div>

                  {/* Height */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-200">Height (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={childHeight}
                      onChange={(e) => setChildHeight(Number(e.target.value))}
                      className="w-full bg-[#141f38] border border-white/15 rounded-2xl px-4 py-3.5 text-base text-white focus:outline-none focus:border-amber-400 font-bold"
                    />
                  </div>

                  {/* Head Circumference */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-200">Head Circumference (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={childHead}
                      onChange={(e) => setChildHead(Number(e.target.value))}
                      className="w-full bg-[#141f38] border border-white/15 rounded-2xl px-4 py-3.5 text-base text-white focus:outline-none focus:border-amber-400 font-bold"
                    />
                  </div>
                </div>

                {/* Interactive Milestones checklist */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <label className="block text-sm font-bold text-slate-200">Milestones Checked</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#121c33] p-5 rounded-2xl border border-white/10">
                    <label className="flex items-start gap-3 cursor-pointer text-sm text-white/90 select-none">
                      <input
                        type="checkbox"
                        checked={milestonesChecklist.standsHolding}
                        onChange={(e) => setMilestonesChecklist({...milestonesChecklist, standsHolding: e.target.checked})}
                        className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-0"
                      />
                      <span>Stands with support (holding furniture)</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer text-sm text-white/90 select-none">
                      <input
                        type="checkbox"
                        checked={milestonesChecklist.saysMamaDada}
                        onChange={(e) => setMilestonesChecklist({...milestonesChecklist, saysMamaDada: e.target.checked})}
                        className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-0"
                      />
                      <span>Says 1-2 words (Mama, Dada)</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer text-sm text-white/90 select-none">
                      <input
                        type="checkbox"
                        checked={milestonesChecklist.wavesBye}
                        onChange={(e) => setMilestonesChecklist({...milestonesChecklist, wavesBye: e.target.checked})}
                        className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-0"
                      />
                      <span>Waves goodbye confidently</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={triggerGenerateReport}
                    className="w-full sm:w-auto py-4 px-8 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base rounded-2xl transition-colors shadow-xl flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <FileDown className="w-5 h-5" />
                    <span>Generate &amp; Download PDF Report</span>
                  </button>
                </div>
              </section>

              {/* =========================================================
                  SECTION 2: WHO / INDIAN IAP PERCENTILE ANALYTICS & CURVE
              ========================================================== */}
              <section className="rounded-[2.5rem] bg-[#0d1424]/95 border border-white/10 p-6 sm:p-10 lg:p-12 shadow-2xl space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      Step 02 · Clinical Growth Curve Visualization
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
                      <Activity className="w-7 h-7 text-indigo-400" />
                      <span>Indian IAP Pediatric Percentile Standard</span>
                    </h3>
                  </div>

                  <div className="flex bg-[#141f38] p-1 rounded-xl border border-white/15 text-xs font-bold self-start sm:self-center">
                    <button
                      onClick={() => { setChartMetric('height'); playSound('click'); }}
                      className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${chartMetric === 'height' ? 'bg-indigo-600 text-white font-black' : 'text-slate-300 hover:text-white'}`}
                    >
                      Height (cm)
                    </button>
                    <button
                      onClick={() => { setChartMetric('weight'); playSound('click'); }}
                      className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${chartMetric === 'weight' ? 'bg-indigo-600 text-white font-black' : 'text-slate-300 hover:text-white'}`}
                    >
                      Weight (kg)
                    </button>
                  </div>
                </div>

                {/* WHO Percentile Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-6 bg-[#121c33] border border-white/10 rounded-3xl text-center space-y-2">
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Weight Percentile</div>
                    <div className="text-3xl sm:text-4xl font-black text-amber-400 tabular-nums">{weightPercentile}th</div>
                    <div className="text-xs text-slate-300 font-medium">IAP Healthy Range</div>
                  </div>

                  <div className="p-6 bg-[#121c33] border border-white/10 rounded-3xl text-center space-y-2">
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Height Percentile</div>
                    <div className="text-3xl sm:text-4xl font-black text-indigo-400 tabular-nums">{heightPercentile}th</div>
                    <div className="text-xs text-slate-300 font-medium">Excellent Stature</div>
                  </div>

                  <div className="p-6 bg-[#121c33] border border-white/10 rounded-3xl text-center space-y-2">
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Brain Growth</div>
                    <div className="text-3xl sm:text-4xl font-black text-emerald-400 tabular-nums">{headPercentile}th</div>
                    <div className="text-xs text-slate-300 font-medium">Optimal Development</div>
                  </div>
                </div>

                {/* Dynamic Recharts Chart */}
                <div className="bg-[#11192e] border border-white/10 p-6 rounded-3xl">
                  <div className="w-full h-72 sm:h-80 font-mono text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={growthChartData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis 
                          dataKey="age" 
                          stroke="rgba(255,255,255,0.4)" 
                          tickLine={false} 
                          label={{ value: 'Age (Months)', position: 'insideBottom', offset: -5, fill: 'rgba(255,255,255,0.5)', style: { textAnchor: 'middle' } }} 
                        />
                        <YAxis stroke="rgba(255,255,255,0.4)" tickLine={false} domain={chartMetric === 'height' ? [40, 110] : [2, 20]} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'rgba(13,20,36,0.96)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px' }} 
                          labelFormatter={(label) => `${label} Months`} 
                        />
                        <Legend verticalAlign="top" height={36} />
                        
                        <Line 
                          name="95th Percentile" 
                          type="monotone" 
                          dataKey={chartMetric === 'height' ? 'p95' : 'wP95'} 
                          stroke="rgba(255,255,255,0.2)" 
                          strokeDasharray="4 4" 
                          dot={false} 
                        />
                        <Line 
                          name="Median (50th)" 
                          type="monotone" 
                          dataKey={chartMetric === 'height' ? 'p50' : 'wP50'} 
                          stroke="#10b981" 
                          strokeWidth={2.5} 
                          dot={false} 
                        />
                        <Line 
                          name="5th Percentile" 
                          type="monotone" 
                          dataKey={chartMetric === 'height' ? 'p5' : 'wP5'} 
                          stroke="rgba(255,255,255,0.2)" 
                          strokeDasharray="4 4" 
                          dot={false} 
                        />

                        {/* ReferenceDot mapping the parent's actual input */}
                        <ReferenceDot 
                          x={childAge} 
                          y={chartMetric === 'height' ? childHeight : childWeight} 
                          r={7} 
                          fill={chartMetric === 'height' ? '#6366f1' : '#f59e0b'} 
                          stroke="#ffffff" 
                          strokeWidth={2} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading overlay for PDF Report compilation */}
      <AnimatePresence>
        {reportStep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="max-w-md w-full bg-neutral-900 border border-white/10 p-8 rounded-3xl space-y-6 shadow-2xl">
              <div className="relative w-16 h-16 mx-auto">
                <Loader2 className="w-16 h-16 text-amber-500 animate-spin" />
                <FileText className="w-6 h-6 text-white absolute top-5 left-5" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-black text-white">Compiling Growth Report PDF</h4>
                <p className="text-xs text-white/50 leading-relaxed font-bold animate-pulse">{reportStep}</p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${reportProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Growth PDF Report Dashboard modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowReportModal(false);
                playSound('click');
              }
            }}
            className="fixed inset-0 bg-neutral-950/90 backdrop-blur-lg z-50 overflow-y-auto p-4 md:p-8 flex items-center justify-center font-sans"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-3xl w-full bg-neutral-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
            >
              <button
                type="button"
                aria-label="Close modal"
                onClick={() => { setShowReportModal(false); playSound('click'); }}
                className="absolute top-5 right-5 z-20 p-2 bg-white/10 border border-white/10 hover:bg-white/20 text-white rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Print action and Header */}
              <div className="p-6 md:p-8 border-b border-white/10 bg-gradient-to-br from-amber-500/15 via-transparent to-transparent flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-md text-[10px] tracking-widest uppercase">CERTIFIED SECURE</span>
                    <span className="text-white/40 text-xs font-bold">Ref No: TR-IAP-{childAge}M</span>
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    <FileText className="w-6 h-6 text-amber-400" />
                    Monthly Analytics & Growth Report
                  </h3>
                  <p className="text-xs text-white/40">Registered clinical growth parameters & motor milestone mapping.</p>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-black text-xs md:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 self-start md:self-center"
                >
                  <FileDown className="w-4 h-4" />
                  Print / Save as PDF
                </button>
              </div>

              {/* Interactive report body */}
              <div className="p-6 md:p-8 space-y-6 text-left max-h-[60vh] overflow-y-auto scrollbar-none">
                {/* Child Health Summary Card */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <div>
                    <div className="text-[10px] text-white/40 uppercase font-black tracking-wider">Parent / Guardian</div>
                    <div className="text-sm font-black text-white mt-0.5">{parentName}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40 uppercase font-black tracking-wider">Patient Name</div>
                    <div className="text-sm font-black text-white mt-0.5">{childName}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40 uppercase font-black tracking-wider">Exact Age</div>
                    <div className="text-sm font-black text-white mt-0.5">{childAge} Months</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40 uppercase font-black tracking-wider">Gender Category</div>
                    <div className="text-sm font-black text-white mt-0.5">{childGender}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40 uppercase font-black tracking-wider">Diagnostic Curve</div>
                    <div className="text-sm font-black text-amber-400 mt-0.5">IAP Percentile</div>
                  </div>
                </div>

                {/* Health Metrics & Percentile mapping */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest border-b border-white/5 pb-1">Developmental Coordinates</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="text-[10px] text-white/40 font-bold">Weight Value</div>
                      <div className="text-base font-black text-white mt-0.5">{childWeight} kg <span className="text-xs text-amber-400">({weightPercentile}th)</span></div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="text-[10px] text-white/40 font-bold">Height Value</div>
                      <div className="text-base font-black text-white mt-0.5">{childHeight} cm <span className="text-xs text-indigo-400">({heightPercentile}th)</span></div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="text-[10px] text-white/40 font-bold">Head Circumference</div>
                      <div className="text-base font-black text-white mt-0.5">{childHead} cm <span className="text-xs text-emerald-400">({headPercentile}th)</span></div>
                    </div>
                  </div>
                </div>

                {/* Pediatric assessment summary paragraph */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest border-b border-white/5 pb-1">Clinical Assessment Summary</h4>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Based on pediatric growth analytics, <strong>{childName}</strong>'s current height is registered at the <strong>{heightPercentile}th percentile</strong> and weight is at the <strong>{weightPercentile}th percentile</strong>. This indicates an excellent growth trajectory with well-balanced nutrient absorption and physical development coordinates. 
                  </p>
                  <p className="text-xs text-white/70 leading-relaxed">
                    The cognitive, motor, and sensory milestone mapping registers a <strong>100% developmental milestone completion</strong> for the {childAge}-month category, showing optimal neuromuscular coordination and visual tracking abilities.
                  </p>
                </div>

                {/* Advisory steps */}
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl space-y-2">
                  <h5 className="text-xs font-black text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Check className="w-4 h-4" />
                    Recommended Pediatric Guidance
                  </h5>
                  <ul className="list-disc pl-4 space-y-1.5 text-xs text-white/70">
                    <li>Continue offering calcium and iron-rich solid supplements (like sprouted grain gruels).</li>
                    <li>Ensure at least 11-13 hours of combined night and daytime nap cycles.</li>
                    <li>Present this growth coordinates chart to your verified pediatrician during the next routine vaccination check.</li>
                  </ul>
                </div>
              </div>

              <div className="p-5 bg-white/5 border-t border-white/10 flex justify-end gap-3">
                <button
                  onClick={() => { setShowReportModal(false); playSound('click'); }}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 text-white/80 font-bold text-xs rounded-xl transition-all"
                >
                  Dismiss Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Past Consultation Clinical Summary Slip Modal */}
      <AnimatePresence>
        {selectedPastBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedPastBookingModal(null);
                playSound('click');
              }
            }}
            className="fixed inset-0 bg-neutral-950/90 backdrop-blur-md z-50 overflow-y-auto p-4 md:p-8 flex items-center justify-center font-sans"
          >
            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full bg-neutral-900 border border-white/15 rounded-3xl overflow-hidden shadow-2xl relative text-left"
            >
              <button
                type="button"
                aria-label="Close modal"
                onClick={() => { setSelectedPastBookingModal(null); playSound('click'); }}
                className="absolute top-5 right-5 z-20 p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                    Official Clinical Record
                  </span>
                  <span className="text-white/40 text-xs font-mono">ID: {selectedPastBookingModal.id}</span>
                </div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Pediatric Outpatient Consultation Slip
                </h3>
                <p className="text-xs text-indigo-200/70 mt-0.5">
                  Verified electronic health consultation record & developmental notes.
                </p>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto scrollbar-none">
                {/* Doctor details banner */}
                <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/10 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl shrink-0">
                    👨‍⚕️
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-black text-white">{selectedPastBookingModal.doctorName}</span>
                      <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded font-bold">
                        {selectedPastBookingModal.degrees}
                      </span>
                    </div>
                    <div className="text-xs text-indigo-300 font-semibold flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{selectedPastBookingModal.hospital}, {selectedPastBookingModal.location} ({selectedPastBookingModal.city})</span>
                    </div>
                    <div className="text-xs text-white/50 mt-0.5">
                      Specialty: {selectedPastBookingModal.specialty}
                    </div>
                  </div>
                </div>

                {/* Date & Vitals info */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-white/40 block font-bold uppercase text-[10px]">Consultation Date & Time</span>
                    <span className="text-white font-black mt-0.5 block">{selectedPastBookingModal.date} • {selectedPastBookingModal.time}</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-white/40 block font-bold uppercase text-[10px]">Recorded Vitals</span>
                    <span className="text-amber-300 font-bold mt-0.5 block">{selectedPastBookingModal.vitals}</span>
                  </div>
                </div>

                {/* Clinical Notes */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Clinical Diagnosis & Pediatric Evaluation: {selectedPastBookingModal.topic}
                  </h4>
                  <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl text-xs text-white/80 leading-relaxed">
                    {selectedPastBookingModal.summary}
                  </div>
                </div>

                {/* Prescription & Protocol */}
                {selectedPastBookingModal.prescriptionRx && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      Prescribed Care & Dietary Protocol (Rx)
                    </h4>
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl space-y-1.5">
                      {selectedPastBookingModal.prescriptionRx.map((rx, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-emerald-200/90 font-medium">
                          <span className="font-mono text-emerald-400 font-bold">{idx + 1}.</span>
                          <span>{rx}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-5 bg-white/5 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                    playSound('click');
                  }}
                  className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Print / Save Slip
                </button>
                <button
                  onClick={() => { setSelectedPastBookingModal(null); playSound('click'); }}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white/80 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Session Reminder Registration Modal */}
      <AnimatePresence>
        {registeringSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                playSound('pop');
                setRegisteringSession(null);
              }
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-lg w-full p-6 sm:p-7 rounded-3xl bg-slate-900 border border-white/15 shadow-2xl text-left relative m-auto"
            >
              {/* Close (X) button at top right */}
              <button
                type="button"
                onClick={() => {
                  playSound('pop');
                  setRegisteringSession(null);
                }}
                className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-xl transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5 pr-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <UserPlus className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Register for Live Webinar</h3>
                  <p className="text-xs text-white/50">Confirm your spot for live interactive pediatric Q&amp;A</p>
                </div>
              </div>

              {/* Session Summary Card */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 mb-5 space-y-2 text-xs sm:text-sm">
                <div className="font-bold text-white text-base">
                  {registeringSession.title}
                </div>
                <div className="text-white/70">
                  <strong>Doctor:</strong> {registeringSession.doctorName} ({registeringSession.degrees}) • {registeringSession.doctorSpecialty}
                </div>
                <div className="text-emerald-300 font-medium flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Hospital:</strong> {registeringSession.hospital}, {registeringSession.city}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-white/60 pt-2 border-t border-white/5 font-mono text-xs">
                  <span>📅 {registeringSession.dateStr}</span>
                  <span>⏰ {registeringSession.timeStr}</span>
                </div>
              </div>

              {/* Email Address Input */}
              <div className="space-y-2 mb-6">
                <label className="text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span>Your Email Address:</span>
                </label>
                <input
                  type="email"
                  required
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-white/30 font-medium"
                />
                <p className="text-xs text-white/40">
                  We will send your webinar access link and session confirmation to this email address.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    playSound('pop');
                    setRegisteringSession(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmRegister(registeringSession)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
