import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Syringe, 
  Check, 
  Clock, 
  Calendar, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Download, 
  Printer, 
  ShieldCheck, 
  AlertCircle, 
  Info, 
  Baby, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Stethoscope, 
  FileText,
  Save,
  CheckCircle2,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { db, handleFirestoreError } from '../lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { playSound } from '../lib/sounds';

export interface ComprehensiveVaccine {
  id: string;
  ageMilestone: string;
  ageGroup: 'birth' | 'infant' | 'toddler' | 'preschool' | 'school';
  vaccineName: string;
  diseaseProtected: string;
  status: 'Completed' | 'Upcoming' | 'Scheduled';
  doseNumber: string;
  recommendedWindow: string;
  category: 'Mandatory / Universal' | 'Recommended' | 'Optional';
  sideEffects: string;
  description: string;
  dateAdministered?: string;
  clinicOrDoctor?: string;
  batchNumber?: string;
  notes?: string;
  isCustom?: boolean;
}

export const ALL_VACCINES: ComprehensiveVaccine[] = [
  // ================= BIRTH =================
  {
    id: 'v-birth-bcg',
    ageMilestone: 'At Birth',
    ageGroup: 'birth',
    vaccineName: 'BCG (Bacillus Calmette-Guerin)',
    diseaseProtected: 'Tuberculosis (TB) and TB Meningitis',
    status: 'Upcoming',
    doseNumber: 'Single Dose',
    recommendedWindow: 'Within 24 to 48 hours of birth',
    category: 'Mandatory / Universal',
    sideEffects: 'Small red bump at injection site which forms a tiny harmless scar after several weeks.',
    description: 'Vital infant protection against severe disseminated tuberculosis and tubercular meningitis.'
  },
  {
    id: 'v-birth-opv',
    ageMilestone: 'At Birth',
    ageGroup: 'birth',
    vaccineName: 'OPV-0 (Oral Polio Vaccine)',
    diseaseProtected: 'Poliomyelitis (Infantile Paralysis)',
    status: 'Upcoming',
    doseNumber: 'Zero Dose (Birth)',
    recommendedWindow: 'Within 24 hours of birth',
    category: 'Mandatory / Universal',
    sideEffects: 'Extremely well tolerated, occasional mild spit-up.',
    description: 'Provides local gut immunity to prevent wild poliovirus transmission from early days of life.'
  },
  {
    id: 'v-birth-hepb',
    ageMilestone: 'At Birth',
    ageGroup: 'birth',
    vaccineName: 'Hepatitis B (Hep B-0)',
    diseaseProtected: 'Hepatitis B Viral Liver Infection',
    status: 'Upcoming',
    doseNumber: 'Birth Dose',
    recommendedWindow: 'Within 24 hours of birth (crucial within 12 hrs)',
    category: 'Mandatory / Universal',
    sideEffects: 'Mild soreness or low-grade irritability for 24 hours.',
    description: 'Prevents mother-to-child vertical transmission and protects newborn liver health.'
  },

  // ================= 6 WEEKS =================
  {
    id: 'v-6w-penta1',
    ageMilestone: '6 Weeks',
    ageGroup: 'infant',
    vaccineName: 'DTwP / DTaP-1 (Diphtheria, Tetanus, Pertussis)',
    diseaseProtected: 'Diphtheria, Tetanus (Lockjaw), Pertussis (Whooping Cough)',
    status: 'Upcoming',
    doseNumber: 'Primary Dose 1',
    recommendedWindow: '6 Weeks (1.5 Months)',
    category: 'Mandatory / Universal',
    sideEffects: 'Low-grade fever, soreness at thigh injection site, fussy sleep for 1-2 days.',
    description: 'Core triple immunization protecting against respiratory obstruction, muscle spasms, and severe infant whooping cough.'
  },
  {
    id: 'v-6w-ipv1',
    ageMilestone: '6 Weeks',
    ageGroup: 'infant',
    vaccineName: 'IPV-1 (Inactivated Poliovirus)',
    diseaseProtected: 'Poliovirus Types 1, 2, and 3',
    status: 'Upcoming',
    doseNumber: 'Dose 1',
    recommendedWindow: '6 Weeks (1.5 Months)',
    category: 'Mandatory / Universal',
    sideEffects: 'Mild localized tenderness or redness.',
    description: 'Injectable non-live polio vaccine conferring robust systemic bloodstream antibodies.'
  },
  {
    id: 'v-6w-hepb1',
    ageMilestone: '6 Weeks',
    ageGroup: 'infant',
    vaccineName: 'Hepatitis B-1 (Hep B Dose 1)',
    diseaseProtected: 'Hepatitis B Chronic Liver Disease',
    status: 'Upcoming',
    doseNumber: 'Dose 1 (Combined or Monovalent)',
    recommendedWindow: '6 Weeks (1.5 Months)',
    category: 'Mandatory / Universal',
    sideEffects: 'Mild redness or fussiness.',
    description: 'Continues the primary series for lifelong liver defense against viral hepatitis.'
  },
  {
    id: 'v-6w-hib1',
    ageMilestone: '6 Weeks',
    ageGroup: 'infant',
    vaccineName: 'Hib-1 (Haemophilus Influenzae Type b)',
    diseaseProtected: 'Bacterial Meningitis, Epiglottitis, Severe Pneumonia',
    status: 'Upcoming',
    doseNumber: 'Primary Dose 1',
    recommendedWindow: '6 Weeks (1.5 Months)',
    category: 'Mandatory / Universal',
    sideEffects: 'Mild injection site soreness.',
    description: 'Shields babies from invasive bacterial infections that cause brain swelling and severe ear/lung infections.'
  },
  {
    id: 'v-6w-rota1',
    ageMilestone: '6 Weeks',
    ageGroup: 'infant',
    vaccineName: 'Rotavirus-1 (RV-1 Oral Drops)',
    diseaseProtected: 'Severe Rotaviral Gastroenteritis & Acute Dehydration',
    status: 'Upcoming',
    doseNumber: 'Dose 1 (Oral drops)',
    recommendedWindow: '6 Weeks (1.5 Months)',
    category: 'Mandatory / Universal',
    sideEffects: 'Mild loose stools or gas for 24-48 hours.',
    description: 'Administered orally. Protects infants from the leading cause of severe dehydrating diarrhea.'
  },
  {
    id: 'v-6w-pcv1',
    ageMilestone: '6 Weeks',
    ageGroup: 'infant',
    vaccineName: 'PCV-1 (Pneumococcal Conjugate Vaccine)',
    diseaseProtected: 'Streptococcus Pneumoniae, Bacteremia, Sepsis',
    status: 'Upcoming',
    doseNumber: 'Dose 1',
    recommendedWindow: '6 Weeks (1.5 Months)',
    category: 'Recommended',
    sideEffects: 'Mild fever, slight decreased appetite for a few hours.',
    description: 'Protects against multiple strains of pneumococcal bacteria responsible for infant hospitalizations.'
  },

  // ================= 10 WEEKS =================
  {
    id: 'v-10w-penta2',
    ageMilestone: '10 Weeks',
    ageGroup: 'infant',
    vaccineName: 'DTwP / DTaP-2 (Second Triple Primary)',
    diseaseProtected: 'Diphtheria, Tetanus, Whooping Cough',
    status: 'Upcoming',
    doseNumber: 'Primary Dose 2',
    recommendedWindow: '10 Weeks (2.5 Months)',
    category: 'Mandatory / Universal',
    sideEffects: 'Mild fever, temporary swelling or tenderness at thigh site.',
    description: 'Second booster in the primary infant series to build antibody persistence.'
  },
  {
    id: 'v-10w-ipv2',
    ageMilestone: '10 Weeks',
    ageGroup: 'infant',
    vaccineName: 'IPV-2 (Inactivated Polio Vaccine)',
    diseaseProtected: 'Poliovirus',
    status: 'Upcoming',
    doseNumber: 'Dose 2',
    recommendedWindow: '10 Weeks (2.5 Months)',
    category: 'Mandatory / Universal',
    sideEffects: 'Minimal tenderness.',
    description: 'Reinforces circulating blood immunity against polio paralytic strains.'
  },
  {
    id: 'v-10w-hib2',
    ageMilestone: '10 Weeks',
    ageGroup: 'infant',
    vaccineName: 'Hib-2 & Hep B-2',
    diseaseProtected: 'Haemophilus Type b & Hepatitis B',
    status: 'Upcoming',
    doseNumber: 'Dose 2',
    recommendedWindow: '10 Weeks (2.5 Months)',
    category: 'Mandatory / Universal',
    sideEffects: 'Mild fussiness.',
    description: 'Combined pentavalent / hexavalent formulation providing dual organ and mucosal protection.'
  },
  {
    id: 'v-10w-rota2',
    ageMilestone: '10 Weeks',
    ageGroup: 'infant',
    vaccineName: 'Rotavirus-2 (RV-2 Oral Drops)',
    diseaseProtected: 'Rotaviral Diarrhea',
    status: 'Upcoming',
    doseNumber: 'Dose 2 (Oral drops)',
    recommendedWindow: '10 Weeks (2.5 Months)',
    category: 'Mandatory / Universal',
    sideEffects: 'Temporary tummy rumbling or loose stools.',
    description: 'Second dose of oral drops strengthening infant gut immunity.'
  },
  {
    id: 'v-10w-pcv2',
    ageMilestone: '10 Weeks',
    ageGroup: 'infant',
    vaccineName: 'PCV-2 (Pneumococcal Conjugate Vaccine)',
    diseaseProtected: 'Pneumococcal Meningitis & Pneumonia',
    status: 'Upcoming',
    doseNumber: 'Dose 2',
    recommendedWindow: '10 Weeks (2.5 Months)',
    category: 'Recommended',
    sideEffects: 'Mild localized tenderness.',
    description: 'Follow-up dose for invasive pneumococcal protection.'
  },

  // ================= 14 WEEKS =================
  {
    id: 'v-14w-penta3',
    ageMilestone: '14 Weeks',
    ageGroup: 'infant',
    vaccineName: 'DTwP / DTaP-3 (Third Triple Primary)',
    diseaseProtected: 'Diphtheria, Tetanus, Whooping Cough',
    status: 'Upcoming',
    doseNumber: 'Primary Dose 3',
    recommendedWindow: '14 Weeks (3.5 Months)',
    category: 'Mandatory / Universal',
    sideEffects: 'Mild fever, manageable with infant paracetamol if doctor advises.',
    description: 'Completes the essential 3-dose infant primary series for full initial antibody titers.'
  },
  {
    id: 'v-14w-ipv3',
    ageMilestone: '14 Weeks',
    ageGroup: 'infant',
    vaccineName: 'IPV-3 (Inactivated Polio Vaccine)',
    diseaseProtected: 'Polio Infantile Paralysis',
    status: 'Upcoming',
    doseNumber: 'Dose 3',
    recommendedWindow: '14 Weeks (3.5 Months)',
    category: 'Mandatory / Universal',
    sideEffects: 'Mild soreness.',
    description: 'Final infant primary dose for complete polio defense.'
  },
  {
    id: 'v-14w-hib3',
    ageMilestone: '14 Weeks',
    ageGroup: 'infant',
    vaccineName: 'Hib-3 & Hep B-3',
    diseaseProtected: 'Hib Meningitis & Hepatitis B',
    status: 'Upcoming',
    doseNumber: 'Dose 3',
    recommendedWindow: '14 Weeks (3.5 Months)',
    category: 'Mandatory / Universal',
    sideEffects: 'Mild irritability.',
    description: 'Completes the infant primary hexavalent / pentavalent sequence.'
  },
  {
    id: 'v-14w-rota3',
    ageMilestone: '14 Weeks',
    ageGroup: 'infant',
    vaccineName: 'Rotavirus-3 (RV-3 Oral Drops)',
    diseaseProtected: 'Severe Rotavirus',
    status: 'Upcoming',
    doseNumber: 'Dose 3 (if using 3-dose schedule)',
    recommendedWindow: '14 Weeks (3.5 Months)',
    category: 'Mandatory / Universal',
    sideEffects: 'Mild loose stool.',
    description: 'Final oral rotavirus dose ensuring comprehensive protection before solids introduction.'
  },
  {
    id: 'v-14w-pcv3',
    ageMilestone: '14 Weeks',
    ageGroup: 'infant',
    vaccineName: 'PCV-3 (Pneumococcal Conjugate Vaccine)',
    diseaseProtected: 'Invasive Pneumonia & Sepsis',
    status: 'Upcoming',
    doseNumber: 'Dose 3',
    recommendedWindow: '14 Weeks (3.5 Months)',
    category: 'Recommended',
    sideEffects: 'Mild fever or sleepiness.',
    description: 'Concludes the 3-dose primary pneumococcal series.'
  },

  // ================= 6 MONTHS =================
  {
    id: 'v-6m-flu1',
    ageMilestone: '6 Months',
    ageGroup: 'infant',
    vaccineName: 'Influenza-1 (Flu Shot Dose 1)',
    diseaseProtected: 'Seasonal Influenza A & B Viral Respiratory Illness',
    status: 'Upcoming',
    doseNumber: 'Annual Flu Dose 1',
    recommendedWindow: '6 Months',
    category: 'Recommended',
    sideEffects: 'Mild soreness in thigh, low fever.',
    description: 'First annual flu shot. Protects against seasonal winter respiratory hospitalizations.'
  },
  {
    id: 'v-6m-opv1',
    ageMilestone: '6 Months',
    ageGroup: 'infant',
    vaccineName: 'OPV-1 & Vitamin A Dose 1',
    diseaseProtected: 'Polio & Nutritional Eye / Immune Health',
    status: 'Upcoming',
    doseNumber: 'Booster 1',
    recommendedWindow: '6 Months',
    category: 'Mandatory / Universal',
    sideEffects: 'Well tolerated.',
    description: 'Oral polio booster paired with high-potency Vitamin A drops to support retinal and epithelial defense.'
  },
  {
    id: 'v-6m-covid19',
    ageMilestone: '6 Months',
    ageGroup: 'infant',
    vaccineName: 'COVID-19 Pediatric Vaccine',
    diseaseProtected: 'SARS-CoV-2 (COVID-19 Severe Respiratory & MIS-C Complications)',
    status: 'Upcoming',
    doseNumber: 'Pediatric Dose',
    recommendedWindow: '6 Months onwards (Pediatrician Consultation)',
    category: 'Recommended',
    sideEffects: 'Mild localized tenderness, low fever, temporary fussiness for 24-48 hours.',
    description: 'Pediatric formulation providing antibody and T-cell defense against severe COVID-19 respiratory infection and multisystem inflammatory complications.'
  },

  // ================= 7 MONTHS =================
  {
    id: 'v-7m-flu2',
    ageMilestone: '7 Months',
    ageGroup: 'infant',
    vaccineName: 'Influenza-2 (Flu Shot Dose 2)',
    diseaseProtected: 'Seasonal Influenza',
    status: 'Upcoming',
    doseNumber: 'Annual Flu Dose 2 (Primer)',
    recommendedWindow: '7 Months (4 weeks after dose 1)',
    category: 'Recommended',
    sideEffects: 'Mild redness at site.',
    description: 'Crucial second flu shot required for first-time vaccinated babies under age 9.'
  },

  // ================= 9 MONTHS =================
  {
    id: 'v-9m-mmr1',
    ageMilestone: '9 Months',
    ageGroup: 'toddler',
    vaccineName: 'MMR-1 / MR-1 (Measles, Mumps, Rubella)',
    diseaseProtected: 'Measles Rash & Encephalitis, Mumps, Rubella (German Measles)',
    status: 'Upcoming',
    doseNumber: 'Dose 1',
    recommendedWindow: '9 Months (or 9-12 Months)',
    category: 'Mandatory / Universal',
    sideEffects: 'Mild rash or fever may appear 7 to 10 days post-vaccine as immune system develops memory.',
    description: 'Essential shield against highly contagious measles outbreaks and associated pulmonary complications.'
  },
  {
    id: 'v-9m-opv2',
    ageMilestone: '9 Months',
    ageGroup: 'toddler',
    vaccineName: 'OPV-2 (Oral Polio Vaccine)',
    diseaseProtected: 'Polio',
    status: 'Upcoming',
    doseNumber: 'Booster 2',
    recommendedWindow: '9 Months',
    category: 'Mandatory / Universal',
    sideEffects: 'Well tolerated.',
    description: 'Follow-up oral dose maintaining strong community herd immunity.'
  },
  {
    id: 'v-9m-tcv',
    ageMilestone: '9 Months',
    ageGroup: 'toddler',
    vaccineName: 'Typhoid Conjugate Vaccine (TCV-1)',
    diseaseProtected: 'Typhoid Bacterial Fever (Salmonella Typhi)',
    status: 'Upcoming',
    doseNumber: 'Single Conjugate Dose',
    recommendedWindow: '9 to 12 Months',
    category: 'Mandatory / Universal',
    sideEffects: 'Mild tenderness at injection site.',
    description: 'Modern conjugate vaccine giving long-lasting defense against contaminated water and food-borne typhoid.'
  },

  // ================= 12 MONTHS (1 YEAR) =================
  {
    id: 'v-12m-hepa1',
    ageMilestone: '12 Months',
    ageGroup: 'toddler',
    vaccineName: 'Hepatitis A (Hep A Dose 1)',
    diseaseProtected: 'Hepatitis A Viral Jaundice & Liver Infection',
    status: 'Upcoming',
    doseNumber: 'Dose 1 (Live or Inactivated)',
    recommendedWindow: '12 Months (1 Year)',
    category: 'Mandatory / Universal',
    sideEffects: 'Mild localized tenderness.',
    description: 'Shields toddlers starting solid foods from viral hepatitis contracted through food and play surfaces.'
  },
  {
    id: 'v-12m-je1',
    ageMilestone: '12 Months',
    ageGroup: 'toddler',
    vaccineName: 'Japanese Encephalitis (JE-1)',
    diseaseProtected: 'Japanese Encephalitis Viral Brain Infection',
    status: 'Upcoming',
    doseNumber: 'Dose 1 (In endemic districts)',
    recommendedWindow: '12 Months',
    category: 'Optional',
    sideEffects: 'Mild redness or low fever.',
    description: 'Recommended for children living in or traveling to mosquito-endemic agricultural and riverine zones.'
  },

  // ================= 15 MONTHS =================
  {
    id: 'v-15m-mmr2',
    ageMilestone: '15 Months',
    ageGroup: 'toddler',
    vaccineName: 'MMR-2 (Second MMR Dose)',
    diseaseProtected: 'Measles, Mumps, Rubella',
    status: 'Upcoming',
    doseNumber: 'Dose 2 Booster',
    recommendedWindow: '15 Months (1.25 Years)',
    category: 'Mandatory / Universal',
    sideEffects: 'Mild transient rash or low fever 1 week later.',
    description: 'Ensures nearly 99% lifelong protective antibody levels against measles and mumps.'
  },
  {
    id: 'v-15m-var1',
    ageMilestone: '15 Months',
    ageGroup: 'toddler',
    vaccineName: 'Varicella-1 (Chickenpox Vaccine)',
    diseaseProtected: 'Varicella-Zoster Virus (Chickenpox)',
    status: 'Upcoming',
    doseNumber: 'Dose 1',
    recommendedWindow: '15 Months',
    category: 'Recommended',
    sideEffects: 'Mild soreness, occasionally 1-2 small chickenpox-like spots a week later.',
    description: 'Prevents uncomfortable itchy pox blisters, bacterial skin superinfections, and shingles recurrence.'
  },
  {
    id: 'v-15m-pcvb',
    ageMilestone: '15 Months',
    ageGroup: 'toddler',
    vaccineName: 'PCV Booster (Pneumococcal Booster)',
    diseaseProtected: 'Streptococcus Pneumoniae',
    status: 'Upcoming',
    doseNumber: 'Toddler Booster',
    recommendedWindow: '15 Months',
    category: 'Recommended',
    sideEffects: 'Mild tenderness at injection site.',
    description: 'Locks in long-term immunity against pneumococcal ear infections, sinus infections, and pneumonia.'
  },

  // ================= 16 TO 18 MONTHS =================
  {
    id: 'v-18m-dtapb1',
    ageMilestone: '18 Months',
    ageGroup: 'toddler',
    vaccineName: 'DTwP / DTaP Booster-1',
    diseaseProtected: 'Diphtheria, Tetanus, Whooping Cough',
    status: 'Upcoming',
    doseNumber: 'First Toddler Booster',
    recommendedWindow: '16 to 18 Months (1.5 Years)',
    category: 'Mandatory / Universal',
    sideEffects: 'Fever or localized swelling, manageable with pediatrician advice.',
    description: 'Crucial toddler booster maintaining strong antibody defense before kindergarten social contact.'
  },
  {
    id: 'v-18m-ipvb',
    ageMilestone: '18 Months',
    ageGroup: 'toddler',
    vaccineName: 'IPV Booster-1 (Injectable Polio)',
    diseaseProtected: 'Poliovirus',
    status: 'Upcoming',
    doseNumber: 'Booster 1',
    recommendedWindow: '16 to 18 Months',
    category: 'Mandatory / Universal',
    sideEffects: 'Mild tenderness.',
    description: 'Reinforces circulating antibodies against poliovirus paralysis.'
  },
  {
    id: 'v-18m-hibb',
    ageMilestone: '18 Months',
    ageGroup: 'toddler',
    vaccineName: 'Hib Booster (Haemophilus Influenzae)',
    diseaseProtected: 'Haemophilus Type b Bacterial Meningitis',
    status: 'Upcoming',
    doseNumber: 'Booster',
    recommendedWindow: '16 to 18 Months',
    category: 'Mandatory / Universal',
    sideEffects: 'Mild soreness.',
    description: 'Final booster safeguarding young toddlers against severe respiratory and brain infections.'
  },
  {
    id: 'v-18m-hepa2',
    ageMilestone: '18 Months',
    ageGroup: 'toddler',
    vaccineName: 'Hepatitis A-2 (Hep A Dose 2)',
    diseaseProtected: 'Hepatitis A Viral Liver Infection',
    status: 'Upcoming',
    doseNumber: 'Dose 2 (if using inactivated vaccine)',
    recommendedWindow: '18 Months (6 months after Dose 1)',
    category: 'Mandatory / Universal',
    sideEffects: 'Mild arm soreness.',
    description: 'Final dose of the inactivated Hepatitis A schedule conferring decades of liver defense.'
  },

  // ================= 2 YEARS (24 MONTHS) =================
  {
    id: 'v-2y-typhoid',
    ageMilestone: '2 Years',
    ageGroup: 'toddler',
    vaccineName: 'Typhoid Booster & Annual Flu',
    diseaseProtected: 'Typhoid Fever & Seasonal Influenza',
    status: 'Upcoming',
    doseNumber: 'Toddler Checkup Dose',
    recommendedWindow: '24 Months (2 Years)',
    category: 'Recommended',
    sideEffects: 'Mild site soreness.',
    description: 'Yearly influenza booster update and clinical review for typhoid immunization status.'
  },
  {
    id: 'v-2y-mening',
    ageMilestone: '2 Years',
    ageGroup: 'toddler',
    vaccineName: 'Meningococcal Conjugate (ACWY)',
    diseaseProtected: 'Neisseria Meningitidis Types A, C, W, Y',
    status: 'Upcoming',
    doseNumber: 'Optional',
    recommendedWindow: '2 Years or older',
    category: 'Optional',
    sideEffects: 'Mild swelling at arm/thigh site.',
    description: 'Protects against sudden bacterial meningitis outbreaks, especially prior to international travel or day-care.'
  },

  // ================= 4 TO 6 YEARS (SCHOOL ENTRY) =================
  {
    id: 'v-5y-dtapb2',
    ageMilestone: '4 to 6 Years',
    ageGroup: 'preschool',
    vaccineName: 'DTwP / DTaP Booster-2 (School Booster)',
    diseaseProtected: 'Diphtheria, Tetanus, Whooping Cough',
    status: 'Upcoming',
    doseNumber: 'Second Preschool Booster',
    recommendedWindow: '4 to 6 Years (School Entry)',
    category: 'Mandatory / Universal',
    sideEffects: 'Soreness at upper arm site, mild fatigue.',
    description: 'Essential school-entry booster that protects growing kids as school classroom exposure begins.'
  },
  {
    id: 'v-5y-opvb',
    ageMilestone: '4 to 6 Years',
    ageGroup: 'preschool',
    vaccineName: 'OPV / IPV School Booster',
    diseaseProtected: 'Poliovirus',
    status: 'Upcoming',
    doseNumber: 'Pre-School Booster',
    recommendedWindow: '4 to 6 Years',
    category: 'Mandatory / Universal',
    sideEffects: 'Minimal.',
    description: 'Provides mucosal and bloodstream antibodies before primary school attendance.'
  },
  {
    id: 'v-5y-mmr3',
    ageMilestone: '4 to 6 Years',
    ageGroup: 'preschool',
    vaccineName: 'MMR-3 (Third MMR Booster)',
    diseaseProtected: 'Measles, Mumps, Rubella',
    status: 'Upcoming',
    doseNumber: 'School-Age Booster',
    recommendedWindow: '4 to 6 Years',
    category: 'Mandatory / Universal',
    sideEffects: 'Mild arm soreness.',
    description: 'Ensures durable immunity against classroom measles and mumps transmission.'
  },
  {
    id: 'v-5y-var2',
    ageMilestone: '4 to 6 Years',
    ageGroup: 'preschool',
    vaccineName: 'Varicella-2 (Chickenpox Dose 2)',
    diseaseProtected: 'Varicella (Chickenpox)',
    status: 'Upcoming',
    doseNumber: 'Dose 2 Booster',
    recommendedWindow: '4 to 6 Years',
    category: 'Recommended',
    sideEffects: 'Mild tenderness.',
    description: 'Second chickenpox dose to eliminate breakthrough chickenpox cases in elementary school.'
  },

  // ================= 9 TO 14 YEARS (ADOLESCENCE) =================
  {
    id: 'v-10y-hpv',
    ageMilestone: '9 to 14 Years',
    ageGroup: 'school',
    vaccineName: 'HPV (Human Papillomavirus - 2 Doses)',
    diseaseProtected: 'Cervical Cancer, Anogenital Cancers, Genital Warts',
    status: 'Upcoming',
    doseNumber: '2 Doses (6 Months apart)',
    recommendedWindow: '9 to 14 Years',
    category: 'Recommended',
    sideEffects: 'Mild shoulder soreness, brief lightheadedness.',
    description: 'Groundbreaking cancer-prevention vaccine recommended for both girls and boys before viral exposure.'
  },
  {
    id: 'v-10y-tdap',
    ageMilestone: '10 to 12 Years',
    ageGroup: 'school',
    vaccineName: 'Tdap / Td Booster',
    diseaseProtected: 'Tetanus, Diphtheria, Pertussis',
    status: 'Upcoming',
    doseNumber: 'Adolescent Booster',
    recommendedWindow: '10 to 12 Years',
    category: 'Mandatory / Universal',
    sideEffects: 'Mild muscle soreness in shoulder.',
    description: 'Boosts tetanus and whooping cough protection for teenagers and young adults.'
  }
];

export const VaccineTracker: React.FC = () => {
  const { user, profile } = useAuth();

  // Load vaccines from localStorage or profile or defaults - strictly 0% by default (all upcoming)
  const [vaccines, setVaccines] = useState<ComprehensiveVaccine[]>(() => {
    try {
      const saved = localStorage.getItem('comprehensive_baby_vaccines_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Guarantee COVID-19 vaccine is included even for older cached data
          const hasCovid = parsed.some((v: any) => v.id === 'v-6m-covid19');
          if (!hasCovid) {
            const covidDef = ALL_VACCINES.find(v => v.id === 'v-6m-covid19');
            if (covidDef) {
              const insertIdx = parsed.findIndex((v: any) => v.ageMilestone === '7 Months' || v.id === 'v-7m-flu2');
              if (insertIdx !== -1) {
                parsed.splice(insertIdx, 0, { ...covidDef, status: 'Upcoming' as const, dateAdministered: '' });
              } else {
                parsed.push({ ...covidDef, status: 'Upcoming' as const, dateAdministered: '' });
              }
            }
          }
          return parsed;
        }
      }
    } catch (e) {}

    // Check if user has explicitly saved v2 profile vaccinations
    if ((profile as any)?.vaccinationsVersion === 'v2' && profile?.vaccinations && Array.isArray(profile.vaccinations) && profile.vaccinations.length > 0) {
      const merged = ALL_VACCINES.map(def => {
        const existing = profile.vaccinations.find((v: any) => v.id === def.id);
        if (existing) {
          return {
            ...def,
            status: existing.status || 'Upcoming',
            dateAdministered: existing.dateAdministered || '',
            clinicOrDoctor: existing.clinicOrDoctor || '',
            batchNumber: existing.batchNumber || '',
            notes: existing.notes || ''
          };
        }
        return def;
      });
      return merged;
    }

    // Default: Strictly 0 completed vaccines, 0% immunization progress, all Upcoming
    return ALL_VACCINES.map(v => ({ ...v, status: 'Upcoming' as const, dateAdministered: '' }));
  });

  // Filter states
  const [activeStatusFilter, setActiveStatusFilter] = useState<'All' | 'Completed' | 'Upcoming'>('All');
  const [activeAgeFilter, setActiveAgeFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedVaccineId, setExpandedVaccineId] = useState<string | null>(null);

  // Custom vaccine modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customMilestone, setCustomMilestone] = useState('Toddler (12-24 Months)');
  const [customDisease, setCustomDisease] = useState('');
  const [customDose, setCustomDose] = useState('Single Dose');
  const [customCategory, setCustomCategory] = useState<'Recommended' | 'Mandatory / Universal' | 'Optional'>('Recommended');

  // Saving state indicator
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Sync to localStorage and Firestore whenever vaccines change
  const persistVaccines = async (updated: ComprehensiveVaccine[]) => {
    setVaccines(updated);
    try {
      localStorage.setItem('comprehensive_baby_vaccines_v2', JSON.stringify(updated));
      localStorage.setItem('baby_vaccinations_v2', JSON.stringify(updated));

      if (user && db) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          vaccinations: updated,
          vaccinationsVersion: 'v2',
          updatedAt: serverTimestamp()
        });
      }
      setSaveStatus('Saved');
      setTimeout(() => setSaveStatus(null), 2500);
    } catch (err) {
      console.warn("Could not sync vaccines to cloud:", err);
    }
  };

  // Toggle completion
  const handleToggleStatus = (id: string) => {
    playSound('glass');
    const updated = vaccines.map(v => {
      if (v.id === id) {
        const isNowCompleted = v.status !== 'Completed';
        return {
          ...v,
          status: (isNowCompleted ? 'Completed' : 'Upcoming') as 'Completed' | 'Upcoming',
          dateAdministered: isNowCompleted ? (v.dateAdministered || new Date().toISOString().split('T')[0]) : ''
        };
      }
      return v;
    });
    persistVaccines(updated);
  };

  // Update vaccine details (date, clinic, notes)
  const handleUpdateDetails = (id: string, field: 'dateAdministered' | 'clinicOrDoctor' | 'batchNumber' | 'notes', val: string) => {
    const updated = vaccines.map(v => {
      if (v.id === id) {
        return {
          ...v,
          [field]: val,
          // if date entered, mark completed if not already
          status: field === 'dateAdministered' && val ? 'Completed' : v.status
        };
      }
      return v;
    });
    persistVaccines(updated);
  };

  // Reset all to upcoming (0% progress)
  const handleResetAll = () => {
    if (window.confirm("Are you sure you want to reset all vaccines to upcoming (0% progress)?")) {
      playSound('pop');
      const updated = vaccines.map(v => ({ ...v, status: 'Upcoming' as const, dateAdministered: '' }));
      persistVaccines(updated);
    }
  };

  // Add custom vaccine
  const handleAddCustomVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    playSound('glass');

    const newVac: ComprehensiveVaccine = {
      id: `custom-v-${Date.now()}`,
      ageMilestone: customMilestone,
      ageGroup: customMilestone.includes('Birth') ? 'birth' : customMilestone.includes('Weeks') || customMilestone.includes('Months') ? 'infant' : 'toddler',
      vaccineName: customName.trim(),
      diseaseProtected: customDisease.trim() || 'Custom Pediatric Protection',
      status: 'Upcoming',
      doseNumber: customDose,
      recommendedWindow: customMilestone,
      category: customCategory,
      sideEffects: 'Consult your pediatrician for advice on this specific vaccine.',
      description: 'Custom caregiver entered vaccine record.',
      isCustom: true
    };

    const updated = [newVac, ...vaccines];
    persistVaccines(updated);
    setCustomName('');
    setCustomDisease('');
    setShowAddModal(false);
  };

  // Delete custom vaccine
  const handleDeleteVaccine = (id: string) => {
    playSound('pop');
    const updated = vaccines.filter(v => v.id !== id);
    persistVaccines(updated);
  };

  // Open printable vaccine card modal
  const handlePrint = () => {
    playSound('pop');
    setShowPrintModal(true);
  };

  // Execute clean browser print dialog
  const handleExecutePrint = () => {
    playSound('click');
    try {
      window.print();
    } catch (e) {
      console.warn("Direct window.print was blocked in iframe, launching printable popup window:", e);
      handleOpenPrintWindow();
    }
  };

  // Fallback for sandboxed iframes - opens clean printable HTML document in new window
  const handleOpenPrintWindow = () => {
    const printWindow = window.open('', '_blank', 'width=950,height=850');
    if (!printWindow) {
      window.print();
      return;
    }
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Child Immunization Record Card - ${profile?.babyName || localStorage.getItem('baby_name') || 'Ashwath'}</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 32px; color: #0f172a; margin: 0; }
            .header { border-bottom: 2px solid #0284c7; padding-bottom: 14px; margin-bottom: 20px; }
            h1 { margin: 0 0 6px 0; font-size: 24px; color: #0369a1; text-transform: uppercase; letter-spacing: 0.5px; }
            .subtitle { color: #64748b; font-size: 13px; font-weight: 500; }
            .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; padding: 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 24px; font-size: 13px; }
            .meta-item strong { display: block; color: #64748b; font-size: 11px; text-transform: uppercase; margin-bottom: 3px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
            th { background: #f1f5f9; color: #334155; text-align: left; padding: 10px 8px; border: 1px solid #cbd5e1; font-weight: bold; }
            td { padding: 9px 8px; border: 1px solid #e2e8f0; vertical-align: top; }
            tr:nth-child(even) { background-color: #fafafa; }
            .badge-done { color: #065f46; background: #d1fae5; padding: 3px 8px; border-radius: 9999px; font-weight: 700; font-size: 11px; display: inline-block; }
            .badge-up { color: #92400e; background: #fef3c7; padding: 3px 8px; border-radius: 9999px; font-weight: 700; font-size: 11px; display: inline-block; }
            .footer { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            .stamp-box { border: 2px dashed #94a3b8; width: 220px; height: 90px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #64748b; border-radius: 8px; font-size: 11px; text-align: center; }
            @media print {
              body { padding: 16px; }
              @page { margin: 1.5cm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Official Child Immunization Record Card</h1>
            <div class="subtitle">WHO, Indian IAP and FSSAI Universal National Schedule</div>
          </div>
          <div class="meta-grid">
            <div class="meta-item"><strong>Child Name</strong>${profile?.babyName || localStorage.getItem('baby_name') || 'Ashwath'}</div>
            <div class="meta-item"><strong>Date of Birth</strong>${profile?.babyBirthDate || 'Not specified'}</div>
            <div class="meta-item"><strong>Blood Group</strong>${profile?.bloodGroup || 'Not specified'}</div>
            <div class="meta-item"><strong>Pediatrician / Clinic</strong>${profile?.pediatricianName || 'Family Pediatrician'}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 15%;">Age Milestone</th>
                <th style="width: 25%;">Vaccine & Dose</th>
                <th style="width: 25%;">Target Disease Protection</th>
                <th style="width: 12%;">Status</th>
                <th style="width: 11%;">Date Given</th>
                <th style="width: 12%;">Doctor / Clinic</th>
              </tr>
            </thead>
            <tbody>
              ${vaccines.map(v => `
                <tr>
                  <td><strong>${v.ageMilestone}</strong></td>
                  <td>${v.vaccineName}<br><span style="color:#64748b;font-size:11px;">(${v.doseNumber})</span></td>
                  <td>${v.diseaseProtected}</td>
                  <td><span class="${v.status === 'Completed' ? 'badge-done' : 'badge-up'}">${v.status}</span></td>
                  <td>${v.dateAdministered || '-'}</td>
                  <td>${v.clinicOrDoctor || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <div>
              <p style="margin: 0 0 4px 0;"><strong>Card Issued:</strong> ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>
              <p style="margin: 0; color: #64748b;">Progress: ${percentage}% completed (${completedCount} of ${totalCount} doses registered)</p>
            </div>
            <div>
              <div class="stamp-box">
                <span>Official Medical Stamp</span>
                <span style="margin-top: 4px; font-weight: 500;">Pediatrician Signature & Date</span>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Stats
  const totalCount = vaccines.length;
  const completedCount = vaccines.filter(v => v.status === 'Completed').length;
  const upcomingCount = totalCount - completedCount;
  const percentage = Math.round((completedCount / (totalCount || 1)) * 100);

  // Filtered vaccines
  const filteredVaccines = useMemo(() => {
    return vaccines.filter(v => {
      // Status filter
      if (activeStatusFilter === 'Completed' && v.status !== 'Completed') return false;
      if (activeStatusFilter === 'Upcoming' && v.status === 'Completed') return false;

      // Age filter
      if (activeAgeFilter !== 'All') {
        if (activeAgeFilter === 'birth' && v.ageGroup !== 'birth') return false;
        if (activeAgeFilter === 'infant' && v.ageGroup !== 'infant') return false;
        if (activeAgeFilter === 'toddler' && v.ageGroup !== 'toddler') return false;
        if (activeAgeFilter === 'preschool' && v.ageGroup !== 'preschool') return false;
        if (activeAgeFilter === 'school' && v.ageGroup !== 'school') return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = v.vaccineName.toLowerCase().includes(query);
        const matchDisease = v.diseaseProtected.toLowerCase().includes(query);
        const matchAge = v.ageMilestone.toLowerCase().includes(query);
        const matchCat = v.category.toLowerCase().includes(query);
        if (!matchName && !matchDisease && !matchAge && !matchCat) return false;
      }

      return true;
    });
  }, [vaccines, activeStatusFilter, activeAgeFilter, searchQuery]);

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto">
      
      {/* =========================================================
          HERO BANNER: COMPREHENSIVE PEDIATRIC VACCINE TRACKER
      ========================================================== */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-gradient-to-b from-[#0c1a30] via-[#091322] to-[#050b14] p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Free for All Families</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>WHO, Indian IAP and FSSAI Immunization Standards</span>
              </span>
              {saveStatus && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-xs font-bold animate-pulse">
                  <Check className="w-3 h-3" /> {saveStatus}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.1]">
              Pediatric <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent">Vaccine Tracker</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Track your child's complete immunization journey from birth to 12+ years. Mark administered doses, record clinic dates, view pediatric rationale, and keep your toddler fully protected.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  playSound('pop');
                  setShowAddModal(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Vaccine</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-cyan-500/10"
              >
                <Printer className="w-4 h-4 text-cyan-400" />
                <span>Print Vaccine Card</span>
              </button>
            </div>
          </div>

          {/* Progress Card */}
          <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/15 backdrop-blur-xl w-full lg:w-80 shrink-0 space-y-4 text-left shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-300 tracking-wider">Immunization Progress</span>
              <span className="text-2xl font-black text-cyan-300">{percentage}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden p-0.5 border border-white/10">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-center">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-400/20">
                <div className="text-2xl font-black text-emerald-300">{completedCount}</div>
                <div className="text-[11px] font-bold text-emerald-400/80 uppercase">Completed</div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/20">
                <div className="text-2xl font-black text-amber-300">{upcomingCount}</div>
                <div className="text-[11px] font-bold text-amber-400/80 uppercase">Upcoming</div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
              <span>Total Tracked Vaccines:</span>
              <strong className="text-white font-bold">{totalCount} Vaccines</strong>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTROLS: SEARCH & FILTER BAR
      ========================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white/[0.03] p-3 rounded-2xl border border-white/10">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by vaccine (e.g., MMR, Polio, Flu, BCG, Typhoid)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#09111e] border border-white/10 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0a1220] border border-white/10 shrink-0">
            {(['All', 'Completed', 'Upcoming'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => {
                  playSound('click');
                  setActiveStatusFilter(tab);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeStatusFilter === tab
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Age Group Quick Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] shrink-0 pl-1">
            Age Stage:
          </span>
          {[
            { id: 'All', label: 'All Ages (Birth - 12y)' },
            { id: 'birth', label: 'At Birth' },
            { id: 'infant', label: 'Infancy (6w - 7m)' },
            { id: 'toddler', label: 'Toddler (9m - 24m)' },
            { id: 'preschool', label: 'Preschool (4 - 6y)' },
            { id: 'school', label: 'School Age (9 - 14y)' },
          ].map(stage => (
            <button
              key={stage.id}
              onClick={() => {
                playSound('click');
                setActiveAgeFilter(stage.id);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer border ${
                activeAgeFilter === stage.id
                  ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-sm'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>
      </section>

      {/* =========================================================
          VACCINE CARDS LIST
      ========================================================== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Showing {filteredVaccines.length} of {vaccines.length} vaccines</span>
          <span>Click any checkbox to toggle completion status</span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {filteredVaccines.map((v) => {
            const isCompleted = v.status === 'Completed';
            const isExpanded = expandedVaccineId === v.id;

            return (
              <div
                key={v.id}
                className={`rounded-2xl border transition-all text-left overflow-hidden ${
                  isCompleted 
                    ? 'bg-[#0b1728]/80 border-emerald-500/30' 
                    : 'bg-[#0d1629]/90 border-white/10 hover:border-white/25'
                }`}
              >
                {/* Primary Row */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(v.id)}
                      className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all shrink-0 mt-0.5 cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30'
                          : 'bg-white/5 border-white/20 text-transparent hover:border-cyan-400'
                      }`}
                    >
                      <Check className={`w-4 h-4 stroke-[3] ${isCompleted ? 'opacity-100' : 'opacity-0'}`} />
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-mono font-bold text-[10px] uppercase border border-blue-400/25">
                          {v.ageMilestone}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase border ${
                          v.category === 'Mandatory / Universal' 
                            ? 'bg-purple-500/15 text-purple-300 border-purple-400/25' 
                            : v.category === 'Recommended' 
                              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-400/25' 
                              : 'bg-amber-500/15 text-amber-300 border-amber-400/25'
                        }`}>
                          {v.category}
                        </span>
                        {isCompleted && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase border border-emerald-400/30 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Done
                          </span>
                        )}
                      </div>

                      <h3 className={`text-base sm:text-lg font-black tracking-tight ${isCompleted ? 'text-emerald-200' : 'text-white'}`}>
                        {v.vaccineName}
                      </h3>

                      <p className="text-xs text-slate-300 font-medium">
                        Protects against: <span className="text-cyan-300 font-semibold">{v.diseaseProtected}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions & Meta */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pl-10 sm:pl-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    {/* Administered date input if completed */}
                    {isCompleted ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-400/20">
                        <Calendar className="w-3.5 h-3.5" />
                        <input
                          type="date"
                          value={v.dateAdministered || ''}
                          onChange={(e) => handleUpdateDetails(v.id, 'dateAdministered', e.target.value)}
                          className="bg-transparent text-emerald-300 text-xs font-semibold focus:outline-none cursor-pointer"
                        />
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{v.recommendedWindow}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setExpandedVaccineId(isExpanded ? null : v.id)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide Info' : 'Details'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {v.isCustom && (
                        <button
                          type="button"
                          onClick={() => handleDeleteVaccine(v.id)}
                          className="p-1.5 rounded-xl hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Delete custom vaccine"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Pane */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-white/10 bg-black/30 p-5 space-y-4 text-xs"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div>
                            <span className="text-slate-400 uppercase font-black text-[10px] block">Pediatric Clinical Rationale:</span>
                            <p className="text-slate-200 mt-0.5 leading-relaxed">{v.description}</p>
                          </div>

                          <div>
                            <span className="text-slate-400 uppercase font-black text-[10px] block">Possible Mild Side Effects & Home Care:</span>
                            <p className="text-amber-200/90 mt-0.5 leading-relaxed">{v.sideEffects}</p>
                          </div>
                        </div>

                        {/* Caregiver Input Fields */}
                        <div className="space-y-3 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                          <span className="text-cyan-400 font-bold uppercase tracking-wider text-[10px] block">
                            Administration Records (Optional)
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Clinic / Pediatrician</label>
                              <input
                                type="text"
                                placeholder="e.g., City Children Hospital"
                                value={v.clinicOrDoctor || ''}
                                onChange={(e) => handleUpdateDetails(v.id, 'clinicOrDoctor', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-[#09111c] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Batch / Lot Number</label>
                              <input
                                type="text"
                                placeholder="e.g., BTH-8902"
                                value={v.batchNumber || ''}
                                onChange={(e) => handleUpdateDetails(v.id, 'batchNumber', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-[#09111c] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Caregiver Notes / Observations</label>
                            <input
                              type="text"
                              placeholder="e.g., Had mild fever for 12 hours, responded well to hydration."
                              value={v.notes || ''}
                              onChange={(e) => handleUpdateDetails(v.id, 'notes', e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-[#09111c] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          MODAL: ADD CUSTOM VACCINE
      ========================================================== */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl bg-[#0d1627] border border-white/20 p-6 sm:p-8 space-y-5 text-left shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5 text-cyan-400">
                  <Syringe className="w-5 h-5" />
                  <h3 className="text-lg font-black text-white">Add Custom Vaccine Record</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <Trash2 className="w-4 h-4 hidden" />
                  <span>✕</span>
                </button>
              </div>

              <form onSubmit={handleAddCustomVaccine} className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Vaccine Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Japanese Encephalitis Booster or Travel Rabies"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080e1a] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Age Milestone / Timing
                    </label>
                    <select
                      value={customMilestone}
                      onChange={(e) => setCustomMilestone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#080e1a] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="At Birth">At Birth</option>
                      <option value="6 Weeks">6 Weeks</option>
                      <option value="10 Weeks">10 Weeks</option>
                      <option value="14 Weeks">14 Weeks</option>
                      <option value="6 Months">6 Months</option>
                      <option value="9 Months">9 Months</option>
                      <option value="12 Months">12 Months (1 Year)</option>
                      <option value="15 Months">15 Months</option>
                      <option value="18 Months">18 Months</option>
                      <option value="2 Years">2 Years</option>
                      <option value="4 to 6 Years">4 to 6 Years</option>
                      <option value="9 to 14 Years">9 to 14 Years</option>
                      <option value="Custom Window">Custom Window</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Category
                    </label>
                    <select
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#080e1a] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Recommended">Recommended</option>
                      <option value="Mandatory / Universal">Mandatory / Universal</option>
                      <option value="Optional">Optional</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Disease Protected Against
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Seasonal endemic infection or travel requirement"
                    value={customDisease}
                    onChange={(e) => setCustomDisease(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080e1a] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-bold shadow-lg"
                  >
                    Save Vaccine Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* =========================================================
            OFFICIAL PRINTABLE VACCINE CARD MODAL
        ========================================================== */}
        {showPrintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b1322] border border-white/20 rounded-3xl p-4 sm:p-8 max-w-4xl w-full shadow-2xl space-y-6 my-auto max-h-[92vh] flex flex-col text-left"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Official Vaccine Card</h3>
                    <p className="text-xs text-slate-400">Ready for school admissions, daycare verification, and travel.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenPrintWindow}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / Save PDF</span>
                  </button>

                  <button
                    onClick={() => {
                      const text = `CHILD IMMUNIZATION & VACCINE RECORD CARD\n` +
                        `Child: ${profile?.babyName || localStorage.getItem('baby_name') || 'Ashwath'}\nDOB: ${profile?.babyBirthDate || 'Not specified'}\nBlood Group: ${profile?.bloodGroup || 'Not specified'}\n` +
                        `Coverage: ${percentage}% (${completedCount}/${totalCount} completed)\n\n` +
                        vaccines.map(v => `[${v.status.toUpperCase()}] ${v.ageMilestone} - ${v.vaccineName} (${v.doseNumber}) | Prevents: ${v.diseaseProtected} | Date: ${v.dateAdministered || 'Not given'} | Clinic: ${v.clinicOrDoctor || '-'}`).join('\n');
                      const blob = new Blob([text], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `Vaccine_Card_${profile?.babyName || localStorage.getItem('baby_name') || 'Ashwath'}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold hidden sm:flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download TXT</span>
                  </button>

                  <button
                    onClick={() => setShowPrintModal(false)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Printable Card Preview (Card Paper Format) */}
              <div 
                id="printable-vaccine-card"
                className="bg-slate-50 text-slate-900 rounded-2xl p-5 sm:p-8 overflow-y-auto border border-slate-300 shadow-inner space-y-6 text-left"
              >
                {/* Certificate Header */}
                <div className="border-b-2 border-sky-600 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-sky-800 tracking-tight uppercase">
                      Child Immunization & Vaccine Card
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium">
                      WHO, Indian IAP and FSSAI Universal Child Health Standards
                    </p>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-sky-100 border border-sky-300 text-sky-800 text-xs font-bold shrink-0 self-start sm:self-auto">
                    Coverage: {percentage}% ({completedCount}/{totalCount} Doses)
                  </div>
                </div>

                {/* Child Meta Info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">Child Name</span>
                    <strong className="text-sm text-slate-900">{profile?.babyName || localStorage.getItem('baby_name') || 'Ashwath'}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">Date of Birth</span>
                    <strong className="text-sm text-slate-900">{profile?.babyBirthDate || 'Not recorded'}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">Blood Group</span>
                    <strong className="text-sm text-slate-900">{profile?.bloodGroup || 'Not specified'}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">Pediatrician / Clinic</span>
                    <strong className="text-sm text-slate-900">{profile?.pediatricianName || 'Family Pediatrician'}</strong>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse border border-slate-200">
                    <thead>
                      <tr className="bg-slate-200/80 text-slate-700 font-bold border-b border-slate-300">
                        <th className="p-2.5 border border-slate-300">Milestone</th>
                        <th className="p-2.5 border border-slate-300">Vaccine Name & Dose</th>
                        <th className="p-2.5 border border-slate-300">Target Protection</th>
                        <th className="p-2.5 border border-slate-300">Status</th>
                        <th className="p-2.5 border border-slate-300">Date Given</th>
                        <th className="p-2.5 border border-slate-300">Clinic / Doctor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vaccines.map((v, i) => (
                        <tr key={v.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-2.5 border border-slate-200 font-bold text-slate-800 whitespace-nowrap">{v.ageMilestone}</td>
                          <td className="p-2.5 border border-slate-200">
                            <span className="font-semibold text-slate-900">{v.vaccineName}</span>
                            <span className="text-[11px] text-slate-500 block">({v.doseNumber})</span>
                          </td>
                          <td className="p-2.5 border border-slate-200 text-slate-600">{v.diseaseProtected}</td>
                          <td className="p-2.5 border border-slate-200 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              v.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              {v.status === 'Completed' ? '✓ Completed' : '○ Upcoming'}
                            </span>
                          </td>
                          <td className="p-2.5 border border-slate-200 text-slate-800 whitespace-nowrap font-medium">
                            {v.dateAdministered || '-'}
                          </td>
                          <td className="p-2.5 border border-slate-200 text-slate-600">
                            {v.clinicOrDoctor || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer and Official Signature */}
                <div className="pt-4 border-t border-slate-300 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-xs">
                  <div>
                    <p className="text-slate-600 font-medium">
                      Record Generated on: {new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      This immunization record serves as official clinical documentation under pediatric care supervision.
                    </p>
                  </div>
                  <div className="border-2 border-dashed border-slate-400 rounded-xl p-3 w-56 h-20 flex flex-col items-center justify-center text-center text-slate-500 text-[11px] shrink-0">
                    <span>Official Medical Stamp</span>
                    <span className="font-bold text-slate-700 mt-1">Pediatrician Signature</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================
          PRINT STYLES FOR VACCINE CARD
      ========================================================== */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-vaccine-card, #printable-vaccine-card * {
            visibility: visible !important;
          }
          #printable-vaccine-card {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 20px !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
          }
          nav, footer, button, .no-print {
            display: none !important;
          }
        }
      `}</style>

    </div>
  );
};
