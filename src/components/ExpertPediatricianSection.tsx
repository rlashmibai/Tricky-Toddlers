import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';
import { useAuth } from '../lib/AuthContext';
import { db, handleFirestoreError } from '../lib/firebase';
import { playSound } from '../lib/sounds';
import { INDIAN_CITIES_BY_STATE } from '../data/indianCitiesData';
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
  const { user, profile } = useAuth();
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
  const initialUserState = profile?.indianState || localStorage.getItem('user_indian_state') || 'Karnataka';
  const profileCity = profile?.city || localStorage.getItem('user_city') || '';
  const [selectedState, setSelectedState] = useState<string>(initialUserState);

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

  const availableClinics = React.useMemo(() => {
    return getClinicsForCity(selectedCity, selectedState);
  }, [selectedCity, selectedState]);

  const [selectedClinic, setSelectedClinic] = useState<string>(() => {
    const list = getClinicsForCity(
      (profileCity && (INDIAN_CITIES_BY_STATE[initialUserState] || []).includes(profileCity))
        ? profileCity
        : ((INDIAN_CITIES_BY_STATE[initialUserState] || [])[0] || 'Bengaluru (Bangalore)'),
      initialUserState
    );
    return list[0] || '';
  });

  const clinicDoctors = React.useMemo(() => {
    return getDoctorsForClinic(selectedClinic, selectedCity, selectedState);
  }, [selectedClinic, selectedCity, selectedState]);

  const [selectedDoc, setSelectedDoc] = useState<Doctor>(() => {
    const defaultCity = (profileCity && (INDIAN_CITIES_BY_STATE[initialUserState] || []).includes(profileCity))
      ? profileCity
      : ((INDIAN_CITIES_BY_STATE[initialUserState] || [])[0] || 'Bengaluru (Bangalore)');
    const defaultClinics = getClinicsForCity(defaultCity, initialUserState);
    const docs = getDoctorsForClinic(defaultClinics[0] || '', defaultCity, initialUserState);
    return docs[0] || getDoctorsForCity('Bengaluru')[0] || verifiedDoctors[0];
  });

  // Ensure selectedClinic stays valid when availableClinics update
  useEffect(() => {
    if (availableClinics.length > 0 && !availableClinics.includes(selectedClinic)) {
      setSelectedClinic(availableClinics[0]);
    }
  }, [availableClinics, selectedClinic]);

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

  // Memoized hospitals for the current city & state
  const cityHospitals = React.useMemo(() => {
    return getHospitalsForCity(selectedCity, selectedState);
  }, [selectedCity, selectedState]);

  // Filtered hospitals by search query
  const filteredHospitals = React.useMemo(() => {
    if (!hospitalSearch.trim()) return cityHospitals;
    const q = hospitalSearch.toLowerCase();
    return cityHospitals.filter(h => 
      h.name.toLowerCase().includes(q) ||
      h.area.toLowerCase().includes(q) ||
      h.brand.toLowerCase().includes(q) ||
      h.specialty.toLowerCase().includes(q) ||
      h.address.toLowerCase().includes(q)
    );
  }, [cityHospitals, hospitalSearch]);

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
  const parentName = profile?.parentName || profile?.firstName || profile?.name || localStorage.getItem('parent_name') || 'Lashmi';
  const [childName, setChildName] = useState(() => {
    return profile?.babyName || profile?.childName || localStorage.getItem('baby_name') || 'Ashwath';
  });

  useEffect(() => {
    if (profile?.babyName || profile?.childName) {
      setChildName(profile.babyName || profile.childName);
    }
  }, [profile?.babyName, profile?.childName]);

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

  // Synchronize clinics and doctors when city or state changes
  useEffect(() => {
    const cl = getClinicsForCity(selectedCity, selectedState);
    if (cl && cl.length > 0) {
      setSelectedClinic(cl[0]);
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

  // Send message to AI doctor chat
  const handleSendChat = async (e?: React.FormEvent) => {
    if (e?.preventDefault) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText, timestamp: new Date() }]);
    setChatInput("");
    setIsChatLoading(true);
    playSound('click');

    try {
      const response = await fetch('/api/pediatrician-chat', {
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

      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          setChatMessages(prev => [...prev, { sender: 'doctor', text: data.reply, timestamp: new Date() }]);
          playSound('glass');
        } else {
          setChatMessages(prev => [...prev, { sender: 'doctor', text: `I am ${activeChatDoc.name}. I'm sorry, I couldn't process your question at the moment. Please feel free to ask again or reach out to ${activeChatDoc.hospital}.`, timestamp: new Date() }]);
        }
      } else {
        setChatMessages(prev => [...prev, { sender: 'doctor', text: `I am ${activeChatDoc.name}. I'm sorry, I couldn't process your question at the moment. Please feel free to ask again or reach out to ${activeChatDoc.hospital}.`, timestamp: new Date() }]);
      }
    } catch (err) {
      console.error("AI Doctor chat error:", err);
      setChatMessages(prev => [...prev, { sender: 'doctor', text: `Apologies, my system connection is momentarily unstable. Please consult our clinic at ${activeChatDoc.hospital}, ${activeChatDoc.location} directly for urgent advice.`, timestamp: new Date() }]);
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
      setReportStep("Comparing weight and height curves to standard WHO child percentiles...");
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
    <div className="max-w-5xl mx-auto glass-card border border-white/10 rounded-[2.5rem] p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent relative overflow-hidden mb-12 text-left shadow-3xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />
      
      {/* Header with Premium Tag */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-black uppercase tracking-wider mb-2">
            <Stethoscope className="w-3.5 h-3.5 text-indigo-300" />
            Verified Pediatric Clinical Suite
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Stethoscope className="w-7 h-7 text-indigo-400" />
            {gt('sectionTitle')}
          </h2>
          <p className="text-white/50 text-xs sm:text-sm mt-1 leading-relaxed max-w-3xl">
            {gt('sectionSubtitle')}
          </p>
        </div>
      </div>

      {/* Grid of 4 Separate High-Fidelity Interactive Tabs (Compact Row) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-3 relative z-10">
        {/* Tab 1: Pediatric Consults */}
        <button
          onClick={() => { setActiveTab('consults'); playSound('click'); }}
          className={`p-3 rounded-2xl text-left border-2 transition-all duration-300 transform active:scale-95 flex items-center justify-between gap-3 h-18 sm:h-20 ${
            activeTab === 'consults'
              ? 'bg-gradient-to-r from-indigo-500/20 to-indigo-500/5 border-indigo-500 shadow-lg shadow-indigo-500/10'
              : 'bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`p-2 rounded-xl shrink-0 ${activeTab === 'consults' ? 'bg-indigo-500 text-white' : 'bg-white/5 text-white/60'}`}>
              <Stethoscope className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-black text-white tracking-tight truncate">{gt('tabConsults')}</div>
              <div className="text-[11px] text-white/40 truncate hidden sm:block">{gt('tabConsultsSub')}</div>
            </div>
          </div>
          {activeTab === 'consults' && <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shrink-0" />}
        </button>

        {/* Tab 2: Live Sessions */}
        <button
          onClick={() => { setActiveTab('live'); playSound('click'); }}
          className={`p-3 rounded-2xl text-left border-2 transition-all duration-300 transform active:scale-95 flex items-center justify-between gap-3 h-18 sm:h-20 ${
            activeTab === 'live'
              ? 'bg-gradient-to-r from-red-500/20 to-red-500/5 border-red-500 shadow-lg shadow-red-500/10'
              : 'bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`p-2 rounded-xl shrink-0 ${activeTab === 'live' ? 'bg-red-500 text-white' : 'bg-white/5 text-white/60'}`}>
              <Tv className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-black text-white tracking-tight truncate">{gt('tabLive')}</div>
              <div className="text-[11px] text-white/40 truncate hidden sm:block">{gt('tabLiveSub')}</div>
            </div>
          </div>
          {activeTab === 'live' && <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse shrink-0" />}
        </button>

        {/* Tab 3: Doctor Chat */}
        <button
          onClick={() => { setActiveTab('chat'); playSound('click'); }}
          className={`p-3 rounded-2xl text-left border-2 transition-all duration-300 transform active:scale-95 flex items-center justify-between gap-3 h-18 sm:h-20 ${
            activeTab === 'chat'
              ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 border-emerald-500 shadow-lg shadow-emerald-500/10'
              : 'bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`p-2 rounded-xl shrink-0 ${activeTab === 'chat' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/60'}`}>
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-black text-white tracking-tight truncate">{gt('tabChat')}</div>
              <div className="text-[11px] text-white/40 truncate hidden sm:block">{gt('tabChatSub')}</div>
            </div>
          </div>
          {activeTab === 'chat' && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />}
        </button>

        {/* Tab 4: Growth Reports */}
        <button
          onClick={() => { setActiveTab('reports'); playSound('click'); }}
          className={`p-3 rounded-2xl text-left border-2 transition-all duration-300 transform active:scale-95 flex items-center justify-between gap-3 h-18 sm:h-20 ${
            activeTab === 'reports'
              ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/5 border-amber-500 shadow-lg shadow-amber-500/10'
              : 'bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`p-2 rounded-xl shrink-0 ${activeTab === 'reports' ? 'bg-amber-500 text-white' : 'bg-white/5 text-white/60'}`}>
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-black text-white tracking-tight truncate">{gt('tabReports')}</div>
              <div className="text-[11px] text-white/40 truncate hidden sm:block">{gt('tabReportsSub')}</div>
            </div>
          </div>
          {activeTab === 'reports' && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />}
        </button>
      </div>

      {/* Live Sessions Filters Bar (Strictly In ONE Line Below Four Buttons) */}
      {activeTab === 'live' && !isLiveActive && (
        <div className="mb-3 px-3 sm:px-4 py-2 rounded-2xl bg-slate-900/90 border border-white/10 shadow-lg relative z-10 backdrop-blur-xl flex flex-wrap md:flex-nowrap items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          {/* Left: Webinars badge */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1.5 text-xs font-black text-white shrink-0">
              <Tv className="w-4 h-4 text-red-400 animate-pulse shrink-0" />
              <span className="hidden sm:inline">Live Webinars</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-bold">
                {filteredLiveSessions.length}
              </span>
            </span>
          </div>

          {/* Center: In One Line Date & Slot Filters */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Date Filter Dropdown */}
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10 text-xs">
              <Calendar className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span className="text-white/50 text-[11px] font-bold hidden sm:inline">Date:</span>
              <select
                value={liveDateFilter}
                onChange={(e) => { playSound('click'); setLiveDateFilter(e.target.value); }}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-1"
              >
                <option value="all" className="bg-neutral-900 text-white">All Dates</option>
                <option value="today" className="bg-neutral-900 text-white">Today (Oct 5)</option>
                <option value="tomorrow" className="bg-neutral-900 text-white">Tomorrow (Oct 6)</option>
                <option value="this_week" className="bg-neutral-900 text-white">This Week</option>
                <option value="next_week" className="bg-neutral-900 text-white">Next Week</option>
              </select>
            </div>

            {/* Session Slot Filter Dropdown */}
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10 text-xs">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-white/50 text-[11px] font-bold hidden sm:inline">Slot:</span>
              <select
                value={livePeriodFilter}
                onChange={(e) => { playSound('click'); setLivePeriodFilter(e.target.value as any); }}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-1"
              >
                <option value="all" className="bg-neutral-900 text-white">All Slots (Morning, Afternoon, Evening)</option>
                <option value="morning" className="bg-neutral-900 text-white">🌅 Morning (8 AM - 12 PM)</option>
                <option value="afternoon" className="bg-neutral-900 text-white">☀️ Afternoon (12 PM - 5 PM)</option>
                <option value="evening" className="bg-neutral-900 text-white">🌙 Evening (5 PM - 9 PM)</option>
              </select>
            </div>

            {/* Quick Segmented Slot Buttons if screen permits */}
            <div className="hidden xl:flex items-center gap-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'morning', label: '🌅 Morning' },
                { id: 'afternoon', label: '☀️ Afternoon' },
                { id: 'evening', label: '🌙 Evening' }
              ].map(pf => (
                <button
                  key={pf.id}
                  onClick={() => { playSound('click'); setLivePeriodFilter(pf.id as any); }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    livePeriodFilter === pf.id
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  {pf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Quick Search in the same line */}
          <div className="relative w-full sm:w-52 shrink-0">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={liveSearchQuery}
              onChange={(e) => setLiveSearchQuery(e.target.value)}
              placeholder="Search webinars..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-6 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-red-400"
            />
            {liveSearchQuery && (
              <button
                onClick={() => setLiveSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main tab panel contents */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'consults' && (
            <motion.div
              key="consults-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Quick Navigation Buttons to Full Consultations Page */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/5 border border-indigo-500/20 shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">Your Consultations Records</h4>
                    <p className="text-xs text-white/50">View all clinical slips, doctor prescriptions, and booked appointments</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => { playSound('click'); navigate('/consultations?tab=upcoming'); }}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Clock className="w-4 h-4 text-indigo-200" />
                    <span>Upcoming Consultations ({bookings.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { playSound('click'); navigate('/consultations?tab=past'); }}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all border border-white/10 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <FileText className="w-4 h-4 text-amber-300" />
                    <span>Past Consultations ({pastBookings.length})</span>
                  </button>
                </div>
              </div>

              {successMessage && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center gap-3">
                  <Check className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-bold">{successMessage}</span>
                </div>
              )}

              {/* Consultation Booking Form - Full Width Clean Layout */}
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* State Selector */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-black text-white/60 uppercase tracking-widest">Select State</label>
                        <span className="text-[11px] font-bold text-indigo-300">36 States & UTs (A-Z)</span>
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
                                const docs = getDoctorsForClinic(newClinics[0], newCity, newState);
                                if (docs.length > 0) setSelectedDoc(docs[0]);
                              }
                            }
                            playSound('click'); 
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer font-bold"
                        >
                          {allStatesList.map(st => (
                            <option key={st} value={st} className="bg-neutral-900 text-white font-bold text-base">{st}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-5 h-5 text-white/40 absolute right-4 top-4.5 pointer-events-none" />
                      </div>
                    </div>

                    {/* City Selector */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-black text-white/60 uppercase tracking-widest">{gt('cityLabel')}</label>
                        <span className="text-[11px] font-bold text-indigo-300">{stateCities.length} Cities (A-Z)</span>
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
                              const docs = getDoctorsForClinic(newClinics[0], newCity, selectedState);
                              if (docs.length > 0) setSelectedDoc(docs[0]);
                            }
                            playSound('click'); 
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer font-bold"
                        >
                          {stateCities.map(city => (
                            <option key={city} value={city} className="bg-neutral-900 text-white font-bold text-base">{city}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-5 h-5 text-white/40 absolute right-4 top-4.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Clinic / Hospital Selector */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-black text-white/60 uppercase tracking-widest">{gt('clinicLabel')}</label>
                      <span className="text-xs text-indigo-300 font-bold">{availableClinics.length} Verified in {cleanCityName(selectedCity)}</span>
                    </div>
                    <div className="relative">
                      <select
                        value={selectedClinic}
                        onChange={(e) => { 
                          const newClinic = e.target.value;
                          setSelectedClinic(newClinic); 
                          const docs = getDoctorsForClinic(newClinic, selectedCity, selectedState);
                          if (docs.length > 0) setSelectedDoc(docs[0]);
                          playSound('click'); 
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer font-bold"
                      >
                        {availableClinics.map(clinic => (
                          <option key={clinic} value={clinic} className="bg-neutral-900 text-white font-bold text-base">{clinic}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-5 h-5 text-white/40 absolute right-4 top-4.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Doctor Selector */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-black text-white/60 uppercase tracking-widest">{gt('doctorLabel')}</label>
                      <span className="text-xs text-indigo-300 font-bold">{clinicDoctors.length} Verified at {selectedClinic || cleanCityName(selectedCity)}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {clinicDoctors.map(doc => {
                        const isSelected = selectedDoc.name === doc.name && selectedDoc.hospital === doc.hospital;
                        return (
                          <button
                            key={doc.id || `${doc.name}-${doc.hospital}`}
                            type="button"
                            onClick={() => { setSelectedDoc(doc); playSound('click'); }}
                            className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all duration-300 ${isSelected ? 'bg-indigo-500/15 border-indigo-500 shadow-lg shadow-indigo-500/10 scale-[1.01]' : 'bg-white/[0.02] border-white/5 hover:border-white/12 hover:bg-white/[0.04]'}`}
                          >
                            <span className="text-2xl p-2 bg-white/5 rounded-2xl shrink-0">{doc.image}</span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-sm font-black text-white">{doc.name}</span>
                                <span className="text-[9px] font-mono text-amber-300 bg-amber-400/10 border border-amber-400/20 px-1 rounded font-bold">{doc.degrees}</span>
                              </div>
                              <div className="text-xs text-indigo-300 font-semibold mt-0.5 truncate flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-indigo-400 shrink-0" />
                                <span>{doc.hospital}</span>
                              </div>
                              <div className="text-[11px] text-white/45 truncate">{doc.location} • {doc.specialty}</div>
                              <div className="flex items-center justify-between mt-1 flex-wrap gap-1">
                                <span className="text-xs text-indigo-400 font-bold">{doc.experience} {gt('yearsExp')} exp • {doc.rating} ★</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Consultation Fee Summary */}
                  <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white/90 font-bold">Doctor Pediatric Consultation Fee</span>
                      <span className="text-[11px] font-bold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2.5 py-0.5 rounded-lg">
                        To be paid at the hospital
                      </span>
                    </div>
                    <span className="text-sm font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl shrink-0">
                      ₹399 / Consult
                    </span>
                  </div>

                  {/* Date and Time selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-black text-white/60 uppercase tracking-widest mb-2">{gt('dateLabel')}</label>
                      <input
                        type="date"
                        value={bookingDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-bold"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-black text-white/60 uppercase tracking-widest">{gt('timeLabel')}</label>
                        <span className="text-[11px] font-bold text-emerald-400">
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
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer font-bold"
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
                        <ChevronDown className="w-5 h-5 text-white/40 absolute right-4 top-4.5 pointer-events-none" />
                      </div>
                      <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 scrollbar-none">
                        <button
                          type="button"
                          onClick={() => handleSlotFilterChange('All')}
                          className={`text-[11px] px-3 py-1.5 rounded-xl border font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                            slotFilter === 'All'
                              ? 'bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/20 font-black'
                              : 'bg-white/5 hover:bg-white/10 text-white/60 border-white/10'
                          }`}
                        >
                          <span>All Slots</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${slotFilter === 'All' ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40'}`}>
                            28
                          </span>
                        </button>
                        {TIME_SLOT_GROUPS.map(grp => (
                          <button
                            key={grp.period}
                            type="button"
                            onClick={() => handleSlotFilterChange(grp.period as any)}
                            className={`text-[11px] px-3 py-1.5 rounded-xl border font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                              slotFilter === grp.period
                                ? 'bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/20 font-black'
                                : 'bg-white/5 hover:bg-white/10 text-white/60 border-white/10'
                            }`}
                          >
                            <span>{grp.period}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${slotFilter === grp.period ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40'}`}>
                              {grp.slots.length}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center pt-3">
                    <button
                      onClick={handleBookConsultation}
                      disabled={isSubmitting}
                      className="w-auto px-8 py-3.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-black text-sm sm:text-base rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarDays className="w-5 h-5" />}
                      <span>{gt('bookBtn')}</span>
                    </button>
                  </div>
              </div>

              {/* TOP 20 VERIFIED PEDIATRIC HOSPITALS & CLINICS DIRECTORY */}
              <div className="mt-8 bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                            Verified Pediatric Hospitals in {selectedCity}
                          </h3>
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                            {cityHospitals.length} Centers • {selectedState}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-white/50 mt-1">
                          Right street addresses verifiable on Google Maps with 24/7 NICU units, contact phone numbers, and accredited pediatric emergency care.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Search within hospitals */}
                  <div className="relative w-full lg:w-80">
                    <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder={`Filter ${cityHospitals.length} centers by name, area, or specialty...`}
                      value={hospitalSearch}
                      onChange={(e) => setHospitalSearch(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-8 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                    />
                    {hospitalSearch && (
                      <button 
                        onClick={() => setHospitalSearch('')}
                        className="absolute right-3 top-3 text-white/40 hover:text-white text-xs cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Hospital Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredHospitals.map((hosp, idx) => (
                    <div 
                      key={hosp.id}
                      className="bg-neutral-900/80 border border-white/10 hover:border-indigo-500/40 rounded-2xl p-5 space-y-3.5 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 group flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono text-xs font-black border border-indigo-500/30 shrink-0">
                              #{idx + 1}
                            </span>
                            <div>
                              <h4 className="text-sm font-black text-white group-hover:text-indigo-300 transition-colors leading-snug">
                                {hosp.name}
                              </h4>
                              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-white/70 font-semibold border border-white/5">
                                  {hosp.brand}
                                </span>
                                <span className="text-[10px] text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                                  ★ {hosp.rating} ({hosp.reviewsCount} reviews)
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-start gap-1.5 text-white/70">
                            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{hosp.address}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-indigo-300 font-medium">
                            <Stethoscope className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span>{hosp.specialty}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap text-[10px] font-bold">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            24/7 Emergency & Level III NICU
                          </span>
                          <a 
                            href={`tel:${hosp.phone.replace(/[^0-9+]/g, '')}`}
                            className="px-2.5 py-0.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 flex items-center gap-1 transition-colors"
                          >
                            <Phone className="w-3 h-3 text-emerald-400" />
                            <span>{hosp.phone}</span>
                          </a>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                        <a
                          href={hosp.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition-colors group/link"
                        >
                          <span>View on Google Maps</span>
                          <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedClinic(`${hosp.name} - ${hosp.area}`);
                            playSound('click');
                            window.scrollTo({ top: 380, behavior: 'smooth' });
                          }}
                          className="text-xs px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/30 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>Book Consult</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'live' && (
            <motion.div
              key="live-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {!isLiveActive ? (
                /* Landing webinars list */
                <div className="space-y-6">
                  {/* Toast alert when registered */}
                  {registerToast && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold shadow-lg"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span>{registerToast}</span>
                      </div>
                      <button onClick={() => setRegisterToast(null)} className="text-white/60 hover:text-white text-xs px-2 py-1">✕</button>
                    </motion.div>
                  )}

                  {/* Detailed Section Subheader */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-6">
                    <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2.5">
                      <Tv className="w-5 h-5 text-red-500 animate-pulse" />
                      <span>{gt('upcomingLiveSessions')}</span>
                    </h3>
                    <span className="text-xs text-white/50 font-medium">
                      Showing {filteredLiveSessions.length} upcoming interactive sessions
                    </span>
                  </div>

                  {filteredLiveSessions.length === 0 ? (
                    <div className="p-12 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-3">
                      <Tv className="w-12 h-12 text-white/30 mx-auto" />
                      <h4 className="text-base font-bold text-white">No Upcoming Live Sessions Found</h4>
                      <p className="text-xs text-white/50 max-w-md mx-auto">
                        No scheduled webinars match your active date or slot filter. Try selecting "All Dates" or "All Slots".
                      </p>
                      <button
                        onClick={() => {
                          playSound('pop');
                          setLiveDateFilter('all');
                          setLivePeriodFilter('all');
                          setLiveSearchQuery('');
                        }}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredLiveSessions.map((session) => {
                        const isRegistered = registeredSessionIds.includes(session.id);

                        return (
                          <div
                            key={session.id}
                            className={`p-6 sm:p-7 bg-white/[0.025] hover:bg-white/[0.04] rounded-3xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden shadow-xl ${
                              session.isLiveNow
                                ? 'border-red-500/40 shadow-red-500/10 bg-red-950/5'
                                : isRegistered
                                  ? 'border-emerald-500/30 bg-emerald-950/10'
                                  : 'border-white/10 hover:border-white/25'
                            }`}
                          >
                            {/* Card Top Pill Header */}
                            <div className="flex items-center justify-between gap-2 mb-4">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border ${session.topicColor.bg} ${session.topicColor.text} ${session.topicColor.border}`}>
                                  {session.topicTag}
                                </span>
                                <span className="text-xs font-bold text-white/70 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                                  {session.period === 'morning' && <Sunrise className="w-3.5 h-3.5 text-amber-400" />}
                                  {session.period === 'afternoon' && <Sun className="w-3.5 h-3.5 text-amber-300" />}
                                  {session.period === 'evening' && <Moon className="w-3.5 h-3.5 text-indigo-300" />}
                                  <span className="capitalize">{session.period}</span>
                                </span>
                              </div>

                              <div>
                                {session.isLiveNow ? (
                                  <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-black tracking-widest uppercase animate-pulse flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                                    {gt('liveNow')}
                                  </span>
                                ) : isRegistered ? (
                                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    Registered
                                  </span>
                                ) : (
                                  <span className="text-xs text-white/40 font-semibold flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                                    <span>{session.registeredCount} registered</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Session Content */}
                            <div className="space-y-4 mb-5">
                              {/* Session Title */}
                              <h4 className="text-xl sm:text-2xl font-black text-white leading-snug tracking-tight">
                                {session.title}
                              </h4>

                              {/* Doctor Details & Hospital Affiliation */}
                              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2.5 text-xs sm:text-sm">
                                <div className="flex items-start sm:items-center justify-between gap-2 flex-wrap">
                                  <div className="font-bold text-white flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                                      <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <span className="text-sm font-bold text-white">{session.doctorName}</span>
                                      <span className="text-xs text-white/50 ml-1.5 font-normal">({session.degrees})</span>
                                    </div>
                                  </div>
                                  <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                                    {session.doctorSpecialty}
                                  </span>
                                </div>

                                <div className="flex items-start gap-2 text-xs text-emerald-300 font-medium pt-2 border-t border-white/5">
                                  <Building2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                  <span className="leading-relaxed">
                                    <strong className="text-emerald-200">Hospital:</strong> {session.hospital}, {session.city}
                                  </span>
                                </div>
                              </div>

                              {/* Date and Time Details */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                                  <div className="p-2 rounded-xl bg-red-500/10 text-red-400 shrink-0">
                                    <Calendar className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Date</div>
                                    <div className="font-bold text-white">{session.dateStr}</div>
                                  </div>
                                </div>

                                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                                    <Clock className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Time Slot</div>
                                    <div className="font-bold text-white">{session.timeStr}</div>
                                  </div>
                                </div>
                              </div>

                              {/* Detailed Session Description */}
                              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                                {session.description}
                              </p>
                            </div>

                            {/* Session Actions: Register or Join */}
                            <div className="pt-3 border-t border-white/5">
                              {session.isLiveNow ? (
                                <button
                                  onClick={() => { setIsLiveActive(true); playSound('glass'); }}
                                  className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white font-black text-sm rounded-2xl transition-all shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                                >
                                  <Video className="w-4 h-4" />
                                  <span>{gt('joinLiveSession')}</span>
                                </button>
                              ) : isRegistered ? (
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 py-3 px-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 text-center">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Registered</span>
                                  </div>
                                  <button
                                    onClick={() => handleUnregister(session.id)}
                                    title="Cancel registration"
                                    className="p-3 rounded-2xl bg-white/5 hover:bg-rose-500/20 text-white/40 hover:text-rose-300 border border-white/10 transition-all text-xs cursor-pointer"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleOpenRegisterModal(session)}
                                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-2xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                                >
                                  <UserPlus className="w-4 h-4 text-indigo-200" />
                                  <span>Register</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* Active Immersive Live Session view */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[460px]">
                  {/* Simulated Video Player */}
                  <div className="lg:col-span-7 bg-black rounded-3xl border border-white/10 relative overflow-hidden flex flex-col">
                    <div className="p-4 bg-gradient-to-b from-black/85 to-transparent absolute top-0 left-0 w-full z-10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                        <span className="text-[10px] font-black text-white tracking-widest uppercase">LIVE WEBCAST</span>
                      </div>
                      <button
                        onClick={() => { setIsLiveActive(false); playSound('click'); }}
                        className="px-3 py-1.5 bg-white/15 hover:bg-rose-600 hover:text-white rounded-xl text-[10px] font-black text-white transition-all flex items-center gap-1.5"
                      >
                        <VideoOff className="w-3.5 h-3.5" />
                        {gt('endSession')}
                      </button>
                    </div>

                    {/* High-tech Speaker Simulation */}
                    <div className="flex-1 bg-gradient-to-b from-neutral-900 to-neutral-950 flex flex-col items-center justify-center p-6 text-center">
                      <div className="relative mb-3">
                        <div className="w-24 h-24 bg-indigo-500/20 border-2 border-indigo-500 rounded-full flex items-center justify-center text-5xl shadow-inner relative animate-pulse">
                          👨‍⚕️
                        </div>
                        <div className="absolute bottom-0 right-0 p-1.5 bg-emerald-500 rounded-full border-2 border-neutral-900">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="text-white font-black text-lg">Dr. Rajesh Iyer</div>
                      <div className="text-xs md:text-sm text-indigo-400 font-bold mb-4">Speaking: Nutritional benefits of Sprouted Ragi Gruel</div>

                      {/* Presentation slide representation */}
                      <div className="w-full max-w-sm bg-white/5 border border-white/5 p-4 rounded-2xl text-left space-y-1.5 bg-gradient-to-r from-indigo-500/[0.04] to-transparent">
                        <div className="text-[10px] text-amber-300 font-black tracking-widest uppercase flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" />
                          Key Slide Takeaways
                        </div>
                        <div className="text-xs font-black text-white/95 leading-relaxed">Calcium & Iron bioavailability is increased by 40% when sprouting grains. Great for motor coordination milestones!</div>
                      </div>
                    </div>

                    <div className="p-4 bg-neutral-900/90 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <Users className="w-4 h-4 text-indigo-400" />
                        <span>142 Parents participating live</span>
                      </div>
                      <div className="font-bold text-emerald-400">Audio/HD Video Connected</div>
                    </div>
                  </div>

                  {/* Live Chat Panel */}
                  <div className="lg:col-span-5 flex flex-col bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden h-full">
                    <div className="px-4 py-3 bg-white/5 border-b border-white/5 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-indigo-400" />
                      <h4 className="text-sm font-black text-white uppercase tracking-wider">{gt('liveChatFeed')}</h4>
                    </div>

                    <div ref={liveChatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-none">
                      {liveChatMessages.map((msg, i) => (
                        <div key={i} className={`text-sm space-y-1 max-w-[90%] ${msg.isUser ? 'ml-auto text-right' : ''}`}>
                          <div className={`font-black uppercase tracking-wider text-[10px] ${msg.isUser ? 'text-indigo-400' : 'text-amber-400'}`}>{msg.sender}</div>
                          <div className={`p-3 rounded-2xl leading-relaxed text-white/80 inline-block text-sm ${msg.isUser ? 'bg-indigo-500/20 text-indigo-100 rounded-tr-none' : 'bg-white/5 rounded-tl-none'}`}>{msg.text}</div>
                        </div>
                      ))}
                      <div ref={liveChatEndRef} />
                    </div>

                    {/* Submit Question form */}
                    <div className="p-3 bg-white/5 border-t border-white/5 flex items-end gap-2">
                      <textarea
                        rows={1}
                        value={liveUserQuestion}
                        onChange={(e) => setLiveUserQuestion(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            // Enter / Shift+Enter for line break, never submit or select button
                            e.stopPropagation();
                          }
                        }}
                        placeholder={`${gt('questionPlaceholder')} (Press Enter for line break)`}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 resize-y min-h-[42px] leading-relaxed"
                      />
                      <button
                        type="button"
                        onClick={() => handleLiveQuestionSubmit()}
                        disabled={!liveUserQuestion.trim()}
                        className="p-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white rounded-xl transition-colors shrink-0 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Filter by State Cities Header */}
              <div className="bg-white/[0.02] border border-white/5 p-5 rounded-3xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-indigo-400" />
                      Verified Pediatric Specialists Directory
                    </h3>
                    <p className="text-xs text-white/50 mt-0.5">Filter by city in <span className="text-indigo-300 font-bold">{selectedState}</span> to consult top verified pediatricians from accredited hospitals.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {/* State Selector */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-white/50 font-bold uppercase tracking-wider">State:</span>
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
                          className="bg-neutral-900 border border-white/10 text-white font-bold text-xs rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                          {allStatesList.map(st => (
                            <option key={st} value={st} className="bg-neutral-900 text-white font-bold">{st}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-white/50 absolute right-2.5 top-3 pointer-events-none" />
                      </div>
                    </div>

                    {/* City Selector */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-white/50 font-bold uppercase tracking-wider">City:</span>
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
                          className="bg-neutral-900 border border-white/10 text-white font-bold text-xs rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                          {stateCities.map(c => (
                            <option key={c} value={c} className="bg-neutral-900 text-white font-bold">{c}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-white/50 absolute right-2.5 top-3 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Doctor Chat Fee & Session Banner */}
                <div className="p-4 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900/60 border border-indigo-500/20 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-indigo-200">
                    <span className="text-base">🩺</span>
                    <span className="font-bold">Doctor Chat Consultation: <span className="text-emerald-300 font-extrabold text-sm">₹199 for all doctors</span></span>
                    <span className="text-white/40">•</span>
                    <span className="text-amber-300 font-bold bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-lg">1 Session is 20 min</span>
                  </div>
                  <div className="text-[11px] text-white/50">
                    Instant 1:1 Pediatric Clinical Q&A with Qualified Pediatricians in Our Partner Network
                  </div>
                </div>


                {/* Doctors List for this City */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  {getDoctorsForCity(chatCity, selectedState).map(doc => {
                    const isSelected = activeChatDoc.name === doc.name;
                    return (
                      <div
                        key={doc.id || doc.name}
                        onClick={() => handleSelectChatDoctor(doc)}
                        className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative ${isSelected ? 'bg-indigo-500/15 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30' : 'bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]'}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-3xl p-2 bg-white/5 rounded-2xl shrink-0">{doc.image}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="text-sm font-black text-white">{doc.name}</span>
                              {isSelected && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">Active</span>
                              )}
                            </div>
                            <div className="text-[10px] font-mono text-amber-300 bg-amber-400/10 border border-amber-400/20 px-1 py-0.5 rounded font-bold mt-1 inline-block">
                              {doc.degrees}
                            </div>
                            <div className="text-xs text-indigo-300 font-semibold mt-1 truncate flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-indigo-400 shrink-0" />
                              <span>{doc.hospital}</span>
                            </div>
                            <div className="text-[11px] text-white/50 truncate">
                              📍 {doc.location}, {doc.city}
                            </div>
                            <div className="text-[11px] text-white/40 mt-0.5 truncate">
                              {doc.specialty}
                            </div>
                            <div className="flex items-center justify-between mt-1.5 flex-wrap gap-1">
                              <span className="text-[11px] text-indigo-400 font-bold">
                                {doc.experience} yrs exp • {doc.rating} ★
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Main Doctor Chat Window */}
              <div className="w-full">
                {/* Active Doctor Chat Window */}
                <div className="w-full bg-white/[0.01] border border-white/5 rounded-3xl flex flex-col h-[540px] shadow-xl overflow-hidden">
                  {/* Chat Header with Hospital, Degrees & Location */}
                  <div className="px-5 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-2xl shadow-inner">
                          {activeChatDoc.image}
                        </div>
                        <span className="w-3 h-3 bg-emerald-500 border-2 border-neutral-900 rounded-full absolute -bottom-0.5 -right-0.5 animate-pulse" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm md:text-base font-black text-white uppercase tracking-wider truncate">
                            {activeChatDoc.name}
                          </h4>
                          <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded font-bold">
                            {activeChatDoc.degrees}
                          </span>
                        </div>
                        <div className="text-xs text-indigo-300 font-semibold flex items-center gap-1 mt-0.5 truncate">
                          <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>{activeChatDoc.hospital} • {activeChatDoc.location} ({activeChatDoc.city})</span>
                        </div>
                        <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                          <span>Online • {activeChatDoc.specialty}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="hidden sm:flex text-[10px] font-black text-amber-300 items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-xl">
                        <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                        CLINIC VERIFIED
                      </div>
                      <div className="text-xs font-mono font-black text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                        ₹199 / 20 min
                      </div>
                    </div>
                  </div>

                  {/* Messages Body */}
                  <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
                    <div className="p-3 bg-amber-500/5 border border-amber-500/10 text-amber-300 text-xs rounded-2xl leading-relaxed flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{gt('chatDisclaimer')}</span>
                    </div>

                    {chatMessages.map((msg, i) => {
                      const isDoc = msg.sender === 'doctor';
                      return (
                        <div key={i} className={`flex ${isDoc ? 'justify-start' : 'justify-end'}`}>
                          <div className={`flex items-start gap-2.5 max-w-[88%] ${isDoc ? '' : 'flex-row-reverse'}`}>
                            {isDoc && (
                              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 shrink-0 flex items-center justify-center text-base">
                                {activeChatDoc.image}
                              </div>
                            )}
                            <div className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed whitespace-pre-wrap text-left ${isDoc ? 'bg-white/5 text-white/90 rounded-tl-none border border-white/5' : 'bg-indigo-500 text-white rounded-tr-none shadow-md'}`}>
                              {msg.text}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-sm">
                            {activeChatDoc.image}
                          </div>
                          <div className="p-3.5 bg-white/5 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-white/40" />
                            <span className="text-xs text-white/50 font-bold">{activeChatDoc.name} is typing clinical guidance...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input panel */}
                  <div className="p-3 bg-white/5 border-t border-white/5 flex items-end gap-2">
                    <textarea
                      rows={1}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          // Enter / Shift+Enter for line break, never submit or select button
                          e.stopPropagation();
                        }
                      }}
                      disabled={isChatLoading}
                      placeholder={`Ask ${activeChatDoc.name} about nutrition, feeding, fever, or sleep... (Press Enter for line break)`}
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50 resize-y min-h-[46px] leading-relaxed"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendChat()}
                      disabled={!chatInput.trim() || isChatLoading}
                      className="py-3 px-5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white rounded-2xl transition-all font-black text-xs md:text-sm flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      Send
                    </button>
                  </div>
                </div>
              </div>

              {/* Button at the end of the page to view history of doctor chat conversation which opens in new page */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/50 border border-indigo-500/20 rounded-3xl shadow-xl mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm md:text-base font-black text-white">Past Doctor Chat Conversations</h4>
                    <p className="text-xs text-white/50">View complete transcripts, clinical summaries, and pediatric consultation archives</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playSound('click');
                    window.open('/doctor-chat-history', '_blank');
                  }}
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs md:text-sm rounded-2xl border border-indigo-400/30 shadow-lg flex items-center gap-2 hover:scale-[1.02] transition-all cursor-pointer shrink-0"
                >
                  <Clock className="w-4 h-4 text-amber-300" />
                  <span>View History of Doctor Chat Conversation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div
              key="reports-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Growth Report Form and Visualization Section */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Inputs card */}
                <div className="xl:col-span-5 bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-black text-white uppercase tracking-wider">Toddler Growth Inputs</h3>
                  </div>

                  {/* Toddler Name */}
                  <div>
                    <label className="block text-sm font-black text-white/50 uppercase tracking-widest mb-1.5">Child's Name</label>
                    <input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="Ashwath"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Age in Months */}
                    <div>
                      <label className="block text-sm font-black text-white/50 uppercase tracking-widest mb-1.5">Age (Months)</label>
                      <div className="relative">
                        <select
                          value={childAge}
                          onChange={(e) => { setChildAge(Number(e.target.value)); playSound('click'); }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none font-bold cursor-pointer"
                        >
                          {[0, 3, 6, 9, 12, 15, 18, 24, 30, 36].map(m => (
                            <option key={m} value={m} className="bg-neutral-900 text-white font-bold text-base">{m} Months</option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-white/40 absolute right-3 top-3.5 pointer-events-none" />
                      </div>
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-black text-white/50 uppercase tracking-widest mb-1.5">Gender</label>
                      <div className="grid grid-cols-2 bg-white/5 border border-white/10 rounded-xl p-0.5">
                        <button
                          type="button"
                          onClick={() => { setChildGender('Boy'); playSound('click'); }}
                          className={`py-1.5 rounded-lg text-sm font-black ${childGender === 'Boy' ? 'bg-amber-500 text-black' : 'text-white/60'}`}
                        >
                          Boy
                        </button>
                        <button
                          type="button"
                          onClick={() => { setChildGender('Girl'); playSound('click'); }}
                          className={`py-1.5 rounded-lg text-sm font-black ${childGender === 'Girl' ? 'bg-pink-500 text-white' : 'text-white/60'}`}
                        >
                          Girl
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {/* Weight */}
                    <div>
                      <label className="block text-sm font-black text-white/50 uppercase tracking-widest mb-1.5">Weight (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={childWeight}
                        onChange={(e) => setChildWeight(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                      />
                    </div>

                    {/* Height */}
                    <div>
                      <label className="block text-sm font-black text-white/50 uppercase tracking-widest mb-1.5">Height (cm)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={childHeight}
                        onChange={(e) => setChildHeight(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                      />
                    </div>

                    {/* Head Circumference */}
                    <div>
                      <label className="block text-sm font-black text-white/50 uppercase tracking-widest mb-1.5">Head (cm)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={childHead}
                        onChange={(e) => setChildHead(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                      />
                    </div>
                  </div>

                  {/* Interactive Milestones checklist */}
                  <div className="space-y-2 pt-3 border-t border-white/5">
                    <label className="block text-sm font-black text-white/50 uppercase tracking-widest mb-1.5">Milestones Checked</label>
                    <div className="space-y-2 bg-black/10 p-3 rounded-2xl border border-white/5">
                      <label className="flex items-start gap-2.5 cursor-pointer text-sm text-white/90 select-none">
                        <input
                          type="checkbox"
                          checked={milestonesChecklist.standsHolding}
                          onChange={(e) => setMilestonesChecklist({...milestonesChecklist, standsHolding: e.target.checked})}
                          className="mt-0.5 rounded border-white/10 bg-white/5 text-amber-500 focus:ring-0"
                        />
                        <span>Stands with support (holding furniture)</span>
                      </label>
                      <label className="flex items-start gap-2.5 cursor-pointer text-sm text-white/90 select-none">
                        <input
                          type="checkbox"
                          checked={milestonesChecklist.saysMamaDada}
                          onChange={(e) => setMilestonesChecklist({...milestonesChecklist, saysMamaDada: e.target.checked})}
                          className="mt-0.5 rounded border-white/10 bg-white/5 text-amber-500 focus:ring-0"
                        />
                        <span>Says 1-2 words (Mama, Dada)</span>
                      </label>
                      <label className="flex items-start gap-2.5 cursor-pointer text-sm text-white/90 select-none">
                        <input
                          type="checkbox"
                          checked={milestonesChecklist.wavesBye}
                          onChange={(e) => setMilestonesChecklist({...milestonesChecklist, wavesBye: e.target.checked})}
                          className="mt-0.5 rounded border-white/10 bg-white/5 text-amber-500 focus:ring-0"
                        />
                        <span>Waves goodbye confidently</span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={triggerGenerateReport}
                    className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-black font-black text-base rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    <FileDown className="w-4 h-4" />
                    Generate & Download PDF Report
                  </button>
                </div>

                {/* Analytics and Interactive Recharts Curve */}
                <div className="xl:col-span-7 bg-white/[0.01] border border-white/5 p-6 rounded-3xl space-y-6 flex flex-col justify-between">
                  {/* WHO Percentile cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Weight percentile */}
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center relative overflow-hidden">
                      <div className="absolute top-1 right-1 w-6 h-6 bg-amber-500/10 rounded-full blur-md" />
                      <div className="text-[10px] text-white/40 uppercase font-black tracking-wider">Weight Percentile</div>
                      <div className="text-2xl font-black text-amber-400 mt-1">{weightPercentile}th</div>
                      <div className="text-[10px] text-white/40 mt-1">WHO Healthy Range</div>
                    </div>

                    {/* Height percentile */}
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center relative overflow-hidden">
                      <div className="absolute top-1 right-1 w-6 h-6 bg-indigo-500/10 rounded-full blur-md" />
                      <div className="text-[10px] text-white/40 uppercase font-black tracking-wider">Height Percentile</div>
                      <div className="text-2xl font-black text-indigo-400 mt-1">{heightPercentile}th</div>
                      <div className="text-[10px] text-white/40 mt-1">Excellent Stature</div>
                    </div>

                    {/* Head Circumference percentile */}
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center relative overflow-hidden">
                      <div className="absolute top-1 right-1 w-6 h-6 bg-emerald-500/10 rounded-full blur-md" />
                      <div className="text-[10px] text-white/40 uppercase font-black tracking-wider">Brain Growth</div>
                      <div className="text-2xl font-black text-emerald-400 mt-1">{headPercentile}th</div>
                      <div className="text-[10px] text-white/40 mt-1">Optimal Development</div>
                    </div>
                  </div>

                  {/* Dynamic Recharts Chart */}
                  <div className="bg-black/20 border border-white/5 p-4 rounded-2xl flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-black text-white/70 uppercase tracking-widest flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-indigo-400" />
                        WHO Pediatric Percentile Standard
                      </h4>

                      <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/5 text-[10px] font-black">
                        <button
                          onClick={() => { setChartMetric('height'); playSound('click'); }}
                          className={`px-2.5 py-1 rounded-md ${chartMetric === 'height' ? 'bg-indigo-500 text-white' : 'text-white/60'}`}
                        >
                          Height (cm)
                        </button>
                        <button
                          onClick={() => { setChartMetric('weight'); playSound('click'); }}
                          className={`px-2.5 py-1 rounded-md ${chartMetric === 'weight' ? 'bg-indigo-500 text-white' : 'text-white/60'}`}
                        >
                          Weight (kg)
                        </button>
                      </div>
                    </div>

                    {/* Recharts responsive container */}
                    <div className="w-full h-56 font-mono text-[10px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={growthChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis 
                            dataKey="age" 
                            stroke="rgba(255,255,255,0.3)" 
                            tickLine={false} 
                            label={{ value: 'Age (Months)', position: 'insideBottom', offset: -5, fill: 'rgba(255,255,255,0.3)', style: { textAnchor: 'middle' } }} 
                          />
                          <YAxis stroke="rgba(255,255,255,0.3)" tickLine={false} domain={chartMetric === 'height' ? [40, 110] : [2, 20]} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(15,15,15,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} 
                            labelFormatter={(label) => `${label} Months`} 
                          />
                          <Legend verticalAlign="top" height={36} />
                          
                          <Line 
                            name="95th Percentile" 
                            type="monotone" 
                            dataKey={chartMetric === 'height' ? 'p95' : 'wP95'} 
                            stroke="rgba(255,255,255,0.15)" 
                            strokeDasharray="4 4" 
                            dot={false} 
                          />
                          <Line 
                            name="Median (50th)" 
                            type="monotone" 
                            dataKey={chartMetric === 'height' ? 'p50' : 'wP50'} 
                            stroke="#10b981" 
                            strokeWidth={2} 
                            dot={false} 
                          />
                          <Line 
                            name="5th Percentile" 
                            type="monotone" 
                            dataKey={chartMetric === 'height' ? 'p5' : 'wP5'} 
                            stroke="rgba(255,255,255,0.15)" 
                            strokeDasharray="4 4" 
                            dot={false} 
                          />

                          {/* ReferenceDot mapping the parent's actual input! */}
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
                </div>
              </div>
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
            className="fixed inset-0 bg-neutral-950/90 backdrop-blur-lg z-50 overflow-y-auto p-4 md:p-8 flex items-center justify-center font-sans"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="max-w-3xl w-full bg-neutral-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
            >
              <button
                onClick={() => { setShowReportModal(false); playSound('click'); }}
                className="absolute top-5 right-5 p-2 bg-white/5 border border-white/5 hover:bg-white/10 text-white rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Print action and Header */}
              <div className="p-6 md:p-8 border-b border-white/10 bg-gradient-to-br from-amber-500/15 via-transparent to-transparent flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-md text-[10px] tracking-widest uppercase">CERTIFIED SECURE</span>
                    <span className="text-white/40 text-xs font-bold">Ref No: TR-WHO-{childAge}M</span>
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
                    <div className="text-sm font-black text-amber-400 mt-0.5">WHO Percentile</div>
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
            className="fixed inset-0 bg-neutral-950/90 backdrop-blur-md z-50 overflow-y-auto p-4 md:p-8 flex items-center justify-center font-sans"
          >
            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 20 }}
              className="max-w-2xl w-full bg-neutral-900 border border-white/15 rounded-3xl overflow-hidden shadow-2xl relative text-left"
            >
              <button
                onClick={() => { setSelectedPastBookingModal(null); playSound('click'); }}
                className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all cursor-pointer"
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
