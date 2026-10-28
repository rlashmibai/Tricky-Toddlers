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

export interface UpcomingConsultation {
  id: string;
  userId?: string;
  doctorName: string;
  degrees?: string;
  clinic: string;
  hospital?: string;
  location?: string;
  city: string;
  state?: string;
  date: string;
  time: string;
  specialty: string;
  status: string;
  feePaid?: string;
  mode?: 'In-Person Clinic Visit' | 'Video Consultation';
  createdAt?: any;
}

export const INITIAL_PAST_CONSULTATIONS: PastConsultation[] = [
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
      "Iron-fortified ragi malt porridge with cooked apple & ghee",
      "Next review: 9 Months MMR-1 booster & iron panel"
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
      "Follow-up: Food allergen challenge reintroduction"
    ]
  },
  {
    id: 'past-4',
    doctorName: "Dr. Rohan Mehta",
    degrees: "MBBS, MD (Pediatrics), DNB",
    hospital: "Kokilaben Dhirubhai Ambani Hospital",
    location: "Andheri West",
    city: "Mumbai",
    specialty: "Pediatric Development & Milestone Tracker",
    date: "05 May 2026",
    time: "04:00 PM - 04:30 PM",
    status: "Completed",
    topic: "Early Motor Milestones & Barefoot Walking Evaluation",
    summary: "Evaluated pull-to-stand posture and cruising balance. Feet show normal physiological infant fat pad with no rigid flatfoot pathology. Recommended barefoot sensory surface exploration.",
    vitals: "Weight: 9.4 kg • Height: 75 cm • Temp: 36.9°C (98.4°F)",
    prescriptionRx: [
      "Barefoot outdoor grass and textured floor sensory walking",
      "Daily 30-minute interactive floor cruising obstacle play",
      "Standard vaccination booster review at 15 months"
    ]
  }
];

export const INITIAL_DEMO_UPCOMING_BOOKINGS: UpcomingConsultation[] = [
  {
    id: 'up-1',
    doctorName: "Dr. Sunita Rao",
    degrees: "MBBS, DCH, DNB (Pediatrics)",
    clinic: "Cloudnine Hospital",
    hospital: "Cloudnine Hospital",
    location: "Jayanagar",
    city: "Bengaluru",
    state: "Karnataka",
    date: "Oct 8, 2026",
    time: "10:30 AM - 11:00 AM",
    specialty: "Senior Developmental Pediatrician & Neonatologist",
    status: "Confirmed",
    feePaid: "₹399 (Paid at Clinic)",
    mode: "In-Person Clinic Visit"
  }
];

export const getSavedPastConsultations = (): PastConsultation[] => {
  if (typeof window === 'undefined') return INITIAL_PAST_CONSULTATIONS;
  try {
    const raw = localStorage.getItem('tt_past_consultations');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  return INITIAL_PAST_CONSULTATIONS;
};

export const savePastConsultations = (items: PastConsultation[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('tt_past_consultations', JSON.stringify(items));
  } catch (e) {
    console.error(e);
  }
};

export const getSavedUpcomingConsultations = (): UpcomingConsultation[] => {
  if (typeof window === 'undefined') return INITIAL_DEMO_UPCOMING_BOOKINGS;
  try {
    const raw = localStorage.getItem('tt_upcoming_consultations');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  return INITIAL_DEMO_UPCOMING_BOOKINGS;
};

export const saveUpcomingConsultations = (items: UpcomingConsultation[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('tt_upcoming_consultations', JSON.stringify(items));
  } catch (e) {
    console.error(e);
  }
};
