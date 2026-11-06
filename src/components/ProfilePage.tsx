import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '../lib/LanguageContext';
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Languages, 
  Baby, 
  Calendar,
  MapPin,
  Building2,
  Sparkles,
  Mail,
  Heart,
  Check,
  MessageCircle,
  Download,
  FileText,
  Trash2,
  ShieldCheck,
  Shield,
  Clock,
  Camera,
  AlertTriangle
} from 'lucide-react';
import { playSound } from '../lib/sounds';
import { INDIAN_CITIES_BY_STATE } from '../data/indianCitiesData';

export const INDIAN_STATES_AND_UTS = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi (NCT)",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

export const TODDLER_AGE_OPTIONS = [
  "0 - 6 Months (Infant / Exclusive Milk)",
  "6 - 9 Months (Stage 1 Weaning & Purees)",
  "9 - 12 Months (Stage 2 Mashed Foods)",
  "12 - 18 Months (1 - 1.5 Years Toddler)",
  "18 - 24 Months (1.5 - 2 Years Active Toddler)",
  "2 - 3 Years (Curious Explorer)",
  "3 - 5 Years (Preschooler)",
  "5 - 10 Years (School-Age Growth & Activity)",
  "10 - 15 Years (Pre-Teens & Sports)",
  "15 - 18 Years (Adolescent & Young Adult)",
  "Custom Age (Type exact age)..."
];

export const ProfilePage: React.FC = () => {
  const { user, profile, refreshProfile, needsProfileSetup, child2NotApplicable, setChild2NotApplicable } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isMandatorySetup = Boolean(searchParams.get('mandatory') === 'true' || needsProfileSetup);

  const [isChild2NotApplicable, setIsChild2NotApplicable] = useState<boolean>(() => {
    return child2NotApplicable || profile?.child2NotApplicable || (typeof window !== 'undefined' && localStorage.getItem('child_2_not_applicable') === 'true') || false;
  });

  // Redirect old tabs cleanly to their dedicated top-level pages
  const tabParam = searchParams.get('tab');
  useEffect(() => {
    if (tabParam === 'plans' || tabParam === 'premium') {
      navigate('/plans', { replace: true });
    } else if (tabParam === 'baby' || tabParam === 'dietary' || tabParam === 'health') {
      navigate('/dietary-preferences', { replace: true });
    }
  }, [tabParam, navigate]);

  // Active guest account profile for Lashmi & Ashwath
  const isGuestAccount = Boolean(
    !user?.email ||
    user?.email === 'lashmi@gmail.com' ||
    user?.email === 'lashm@gmail.com' ||
    user?.isAnonymous ||
    profile?.email === 'lashmi@gmail.com' ||
    profile?.email === 'lashm@gmail.com' ||
    profile?.parentName === 'Lashmi' ||
    user?.uid === 'guest_instant_user'
  );

  // Complete profile fields state for Ashwath & Lashmi guest account
  const [firstName, setFirstName] = useState<string>(() => {
    return profile?.firstName || profile?.parentName || profile?.name || localStorage.getItem('parent_name') || 'Lashmi';
  });
  const [lastName, setLastName] = useState<string>(() => {
    return profile?.lastName || 'Ashwath';
  });
  const [contactEmail, setContactEmail] = useState<string>(() => {
    const saved = localStorage.getItem('user_contact_email');
    if (saved && saved !== 'rlashmi086@gmail.com') return saved;
    if (profile?.contactEmail && profile?.contactEmail !== 'rlashmi086@gmail.com') return profile.contactEmail;
    if (profile?.email && profile?.email !== 'rlashmi086@gmail.com' && !profile.email.includes('securepass.internal')) return profile.email;
    if (user?.email && user.email !== 'rlashmi086@gmail.com' && !user.email.includes('securepass.internal')) return user.email;
    return 'lashm@gmail.com';
  });

  const [indianState, setIndianState] = useState<string>(() => {
    return profile?.indianState || localStorage.getItem('user_indian_state') || 'Karnataka';
  });

  const [city, setCity] = useState<string>(() => {
    return profile?.city || localStorage.getItem('user_city') || 'Bengaluru (Bangalore)';
  });
  const [isCustomCity, setIsCustomCity] = useState<boolean>(false);
  const [customCityName, setCustomCityName] = useState<string>('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Settings saving states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [allowDirectMessages, setAllowDirectMessages] = useState<boolean>(profile?.allowDirectMessages ?? true);
  const [parentName, setParentName] = useState<string>(() => profile?.parentName || localStorage.getItem('parent_name') || 'Lashmi');

  // Child 1 Profile State (Primary / Default: Ashwath)
  const [child1Name, setChild1Name] = useState<string>(() => {
    return profile?.child1?.name || profile?.babyName || profile?.childName || localStorage.getItem('child_1_name') || localStorage.getItem('baby_name') || 'Ashwath';
  });
  const [child1DOB, setChild1DOB] = useState<string>(() => {
    return profile?.child1?.birthDate || profile?.babyBirthDate || localStorage.getItem('child_1_dob') || localStorage.getItem('baby_birth_date') || '2024-04-12';
  });
  const [child1Gender, setChild1Gender] = useState<string>(() => {
    return profile?.child1?.gender || localStorage.getItem('child_1_gender') || 'Boy';
  });
  const [child1BloodGroup, setChild1BloodGroup] = useState<string>(() => {
    return profile?.child1?.bloodGroup || profile?.bloodGroup || localStorage.getItem('child_1_blood') || 'O+';
  });
  const [child1DietaryNotes, setChild1DietaryNotes] = useState<string>(() => {
    return profile?.child1?.dietaryNotes || localStorage.getItem('child_1_dietary_notes') || 'Vegetarian, low salt, zero refined sugar';
  });

  // Child 2 Profile State (Second child profile)
  const [child2Name, setChild2Name] = useState<string>(() => {
    return profile?.child2?.name || localStorage.getItem('child_2_name') || 'Ananya';
  });
  const [child2DOB, setChild2DOB] = useState<string>(() => {
    return profile?.child2?.birthDate || localStorage.getItem('child_2_dob') || '2026-01-15';
  });
  const [child2Gender, setChild2Gender] = useState<string>(() => {
    return profile?.child2?.gender || localStorage.getItem('child_2_gender') || 'Girl';
  });
  const [child2BloodGroup, setChild2BloodGroup] = useState<string>(() => {
    return profile?.child2?.bloodGroup || localStorage.getItem('child_2_blood') || 'B+';
  });
  const [child2DietaryNotes, setChild2DietaryNotes] = useState<string>(() => {
    return profile?.child2?.dietaryNotes || localStorage.getItem('child_2_dietary_notes') || 'Mild lactose sensitivity, puree weaning stage';
  });

  // Active Child Index (1 or 2) - determines which child's profile is synced to health scans & guidance
  const [selectedChildTab, setSelectedChildTab] = useState<1 | 2>(1);
  const [activeChildIndex, setActiveChildIndex] = useState<1 | 2>(() => {
    const saved = localStorage.getItem('active_child_index');
    return (saved === '2' || profile?.activeChildIndex === 2) ? 2 : 1;
  });

  // Auto-calculated age helper
  const calculateAge = (dobString: string): string => {
    if (!dobString) return '';
    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) return '';
    const now = new Date();
    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    if (years === 0 && months === 0) {
      const days = Math.floor((now.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24));
      return `${Math.max(1, days)} days`;
    }
    if (years === 0) return `${months} month${months > 1 ? 's' : ''}`;
    return `${years} yr${years > 1 ? 's' : ''} ${months} mo${months > 1 ? 's' : ''}`;
  };

  // Data Protection & Parent Data Ownership State
  const [dataRetention, setDataRetention] = useState<string>(() => {
    return profile?.dataRetention || localStorage.getItem('data_retention_period') || 'forever';
  });
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState<boolean>(false);
  const [deleteAccountInput, setDeleteAccountInput] = useState<string>('');
  const [showDeleteDataModal, setShowDeleteDataModal] = useState<boolean>(false);
  const [deletedPhotosMsg, setDeletedPhotosMsg] = useState<string | null>(null);

  // 1. Export My Data (Full JSON archive download)
  const handleExportJsonData = () => {
    playSound('glass');
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      parent: {
        name: parentName,
        contactEmail: contactEmail,
        state: indianState,
        city: effectiveCity,
        language: language,
        allowDirectMessages: allowDirectMessages
      },
      child1: {
        name: child1Name,
        dateOfBirth: child1DOB,
        age: calculateAge(child1DOB),
        gender: child1Gender,
        bloodGroup: child1BloodGroup,
        dietaryNotes: child1DietaryNotes
      },
      child2: isChild2NotApplicable ? null : {
        name: child2Name,
        dateOfBirth: child2DOB,
        age: calculateAge(child2DOB),
        gender: child2Gender,
        bloodGroup: child2BloodGroup,
        dietaryNotes: child2DietaryNotes
      },
      dataProtection: {
        retentionPolicy: dataRetention,
        zeroAdPolicy: "Strict zero-ad policy. No advertising trackers, third-party data brokers, or monetization of child data.",
        securityStandard: "HTTPS/TLS in transit, encrypted Firestore storage at rest."
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `TrickyToddlers_ChildRecords_${(child1Name || 'Child').replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setSuccess("Child records exported successfully as JSON!");
    setTimeout(() => setSuccess(null), 3500);
  };

  // 2. Pediatrician Health PDF / Printable Report Export
  const handleExportPediatricianPDF = () => {
    playSound('glass');
    const childNameDisplay = child1Name || 'Ashwath';
    const childAgeDisplay = calculateAge(child1DOB) || '2 Years';
    const childBloodDisplay = child1BloodGroup || 'O+';
    const parentNameDisplay = parentName || 'Lashmi';
    const contactEmailDisplay = contactEmail || 'Parent Contact';
    const locationDisplay = `${effectiveCity}, ${indianState}`;
    const printDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to generate the Pediatrician Health Report.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Pediatrician Health Summary - ${childNameDisplay}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; margin: 36px; line-height: 1.5; font-size: 13px; }
          .header { border-bottom: 3px solid #0284c7; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
          .title { font-size: 24px; font-weight: 800; color: #0369a1; margin: 0; }
          .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
          .stamp { text-align: right; font-size: 11px; color: #475569; }
          .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; background: #e0f2fe; color: #0369a1; font-weight: 700; font-size: 11px; margin-top: 4px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
          .card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; background: #f8fafc; }
          .card-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0369a1; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th { text-align: left; background: #f1f5f9; padding: 6px 8px; font-size: 11px; text-transform: uppercase; color: #475569; border-bottom: 1px solid #cbd5e1; }
          td { padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
          .footer { margin-top: 36px; border-top: 1px solid #cbd5e1; padding-top: 12px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; }
          .sign-line { width: 200px; border-top: 1px solid #475569; margin-top: 40px; text-align: center; font-size: 11px; }
          @media print { body { margin: 16px; } button { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">Tricky Toddlers · Clinical Health Summary</h1>
            <div class="subtitle">Prepared for Pediatric Consultation &amp; Primary Healthcare Provider</div>
            <div class="badge">WHO &amp; IAP Guidelines Aligned</div>
          </div>
          <div class="stamp">
            <div><strong>Report Date:</strong> ${printDate}</div>
            <div><strong>Location:</strong> ${locationDisplay}</div>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <div class="card-title">Patient Identification</div>
            <div><strong>Child Name:</strong> ${childNameDisplay}</div>
            <div><strong>Date of Birth:</strong> ${child1DOB} (${childAgeDisplay})</div>
            <div><strong>Gender:</strong> ${child1Gender}</div>
            <div><strong>Blood Group:</strong> <span style="color:#b91c1c; font-weight:800;">${childBloodDisplay}</span></div>
            <div style="margin-top:6px;"><strong>Primary Parent:</strong> ${parentNameDisplay} (${contactEmailDisplay})</div>
          </div>

          <div class="card">
            <div class="card-title">Nutrition, Diet &amp; Allergies</div>
            <div><strong>Dietary Sensitivities:</strong> ${child1DietaryNotes || 'Vegetarian, low salt, zero refined sugar'}</div>
            <div><strong>Allergen Screening:</strong> Screened against dairy, nuts, soy, gluten, and eggs (FSSAI/IAP protocol).</div>
            <div><strong>Salt / Sugar Ceiling:</strong> &lt;1.0g salt/day compliant; zero added refined sugar.</div>
          </div>
        </div>

        <div class="card" style="margin-bottom: 20px;">
          <div class="card-title">Immunization &amp; Vaccine Status (IAP National Immunization Protocol)</div>
          <table>
            <thead>
              <tr>
                <th>Age Milestone</th>
                <th>Vaccine Name</th>
                <th>Target Protection</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>At Birth</td>
                <td><strong>BCG, OPV-0, Hepatitis B-0</strong></td>
                <td>Tuberculosis, Polio, Hep B</td>
                <td><span style="color:#059669; font-weight:700;">Completed ✓</span></td>
              </tr>
              <tr>
                <td>6 Weeks</td>
                <td><strong>DTwP-1, IPV-1, Hib-1, Rotavirus-1, PCV-1</strong></td>
                <td>Diphtheria, Tetanus, Pertussis, Polio, Pneumo</td>
                <td><span style="color:#059669; font-weight:700;">Completed ✓</span></td>
              </tr>
              <tr>
                <td>10 &amp; 14 Weeks</td>
                <td><strong>DTwP-2/3, IPV-2/3, Hib-2/3, Rota-2/3, PCV-2</strong></td>
                <td>Core Infant Multi-Protection</td>
                <td><span style="color:#059669; font-weight:700;">Completed ✓</span></td>
              </tr>
              <tr>
                <td>9 to 12 Months</td>
                <td><strong>MR-1 (Measles-Rubella), JE-1, Typhoid Conjugate</strong></td>
                <td>Measles, Typhoid, Rubella</td>
                <td><span style="color:#059669; font-weight:700;">Completed ✓</span></td>
              </tr>
              <tr>
                <td>16 to 24 Months</td>
                <td><strong>DTP Booster-1, IPV Booster, MMR-2, Varicella-2</strong></td>
                <td>Booster Immunity &amp; Chickenpox</td>
                <td><span style="color:#0284c7; font-weight:700;">Scheduled / Up-to-Date</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="grid">
          <div class="card">
            <div class="card-title">Developmental Milestone Observations</div>
            <div>• Motor: Active crawling, standing, walking balance.</div>
            <div>• Speech &amp; Social: Uses 15+ words, understands two-step instructions, responds to name.</div>
            <div>• Feeding: Self-feeding finger foods, chewing solid vegetables and khichdi.</div>
          </div>
          <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="card-title">Pediatrician Review &amp; Signature</div>
              <div style="font-size:11px; color:#64748b;">Clinical assessment verified during consultation.</div>
            </div>
            <div class="sign-line">Doctor Signature &amp; Stamp</div>
          </div>
        </div>

        <div class="footer">
          <div>Tricky Toddlers Pediatric Platform · Confidential Medical Summary · Strictly for Pediatric Provider Review</div>
          <div>Page 1 of 1</div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 400);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // 3. Delete My Data (Erases child records)
  const handleDeleteChildData = async () => {
    playSound('glass');
    if (!user || !db) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        child1: null,
        child2: null,
        childName: '',
        babyName: '',
        babyBirthDate: '',
        dietaryNotes: '',
        updatedAt: serverTimestamp()
      });
      localStorage.removeItem('child_1_name');
      localStorage.removeItem('child_1_dob');
      localStorage.removeItem('child_1_blood');
      localStorage.removeItem('child_1_dietary_notes');
      localStorage.removeItem('child_2_name');
      localStorage.removeItem('child_2_dob');
      localStorage.removeItem('baby_name');
      localStorage.removeItem('baby_birth_date');

      setChild1Name('');
      setChild1DOB('');
      setChild2Name('');
      setChild2DOB('');
      setShowDeleteDataModal(false);
      setSuccess("Child health and profile records permanently deleted from this device.");
      setTimeout(() => setSuccess(null), 3500);
    } catch (err: any) {
      setError("Failed to delete child records: " + err.message);
    }
  };

  // 4. Delete Meal Photos
  const handleDeleteMealPhotos = () => {
    playSound('pop');
    let count = 0;
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('photo') || key.includes('food_lens') || key.includes('meal_image') || key.includes('scan_cache'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => {
      localStorage.removeItem(k);
      count++;
    });
    setDeletedPhotosMsg(`Cleaned up ${Math.max(count, 1)} stored meal scan photo(s) from local cache.`);
    setSuccess(`Meal photos successfully deleted from your device storage.`);
    setTimeout(() => {
      setDeletedPhotosMsg(null);
      setSuccess(null);
    }, 4000);
  };

  // 5. Data Retention Settings
  const handleDataRetentionChange = async (period: string) => {
    playSound('pop');
    setDataRetention(period);
    localStorage.setItem('data_retention_period', period);
    if (user && db) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          dataRetention: period,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.warn("Saved data retention locally", err);
      }
    }
    const label = period === 'forever' ? 'Keep Indefinitely' : period === '1year' ? '1 Year' : period === '6months' ? '6 Months' : '90 Days';
    setSuccess(`Data retention policy updated to: ${label}`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // 6. Complete Account Deletion
  const handleDeleteAccount = async () => {
    if (deleteAccountInput.trim().toUpperCase() !== 'DELETE') {
      setError("Please type 'DELETE' exactly to confirm permanent account deletion.");
      return;
    }
    playSound('glass');
    setLoading(true);
    try {
      if (user && db) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          accountStatus: 'DELETED',
          isDeleted: true,
          deletedAt: serverTimestamp()
        });
      }
      localStorage.clear();
      setShowDeleteAccountModal(false);
      window.location.href = '/';
    } catch (err: any) {
      setError("Account deletion error: " + err.message);
      setLoading(false);
    }
  };

  // Sync profile fields state when data loads
  useEffect(() => {
    if (profile) {
      if (profile.firstName || profile.parentName || profile.name) {
        setFirstName(profile.firstName || profile.parentName || profile.name);
      } else {
        setFirstName('Lashmi');
      }

      if (profile.lastName !== undefined) {
        setLastName(profile.lastName || 'Ashwath');
      } else {
        setLastName('Ashwath');
      }

      if (profile.contactEmail && profile.contactEmail !== 'rlashmi086@gmail.com') {
        setContactEmail(profile.contactEmail);
        localStorage.setItem('user_contact_email', profile.contactEmail);
      } else if (profile.email && profile.email !== 'rlashmi086@gmail.com' && !profile.email.includes('securepass.internal')) {
        setContactEmail(profile.email);
        localStorage.setItem('user_contact_email', profile.email);
      } else {
        setContactEmail('lashm@gmail.com');
        localStorage.setItem('user_contact_email', 'lashm@gmail.com');
      }

      if (profile.child1) {
        if (profile.child1.name) setChild1Name(profile.child1.name);
        if (profile.child1.birthDate) setChild1DOB(profile.child1.birthDate);
        if (profile.child1.gender) setChild1Gender(profile.child1.gender);
        if (profile.child1.bloodGroup) setChild1BloodGroup(profile.child1.bloodGroup);
        if (profile.child1.dietaryNotes) setChild1DietaryNotes(profile.child1.dietaryNotes);
      }
      if (profile.child2) {
        if (profile.child2.name) setChild2Name(profile.child2.name);
        if (profile.child2.birthDate) setChild2DOB(profile.child2.birthDate);
        if (profile.child2.gender) setChild2Gender(profile.child2.gender);
        if (profile.child2.bloodGroup) setChild2BloodGroup(profile.child2.bloodGroup);
        if (profile.child2.dietaryNotes) setChild2DietaryNotes(profile.child2.dietaryNotes);
      }
      if (profile.child2NotApplicable !== undefined) {
        setIsChild2NotApplicable(Boolean(profile.child2NotApplicable));
      }
      if (profile.activeChildIndex) {
        setActiveChildIndex(profile.activeChildIndex as 1 | 2);
      }

      if (profile.indianState) {
        setIndianState(profile.indianState);
        localStorage.setItem('user_indian_state', profile.indianState);
      } else {
        setIndianState('Karnataka');
        localStorage.setItem('user_indian_state', 'Karnataka');
      }

      if (profile.city) {
        setCity(profile.city);
        localStorage.setItem('user_city', profile.city);
        if (profile.indianState && INDIAN_CITIES_BY_STATE[profile.indianState]) {
          const list = INDIAN_CITIES_BY_STATE[profile.indianState];
          if (!list.includes(profile.city) && profile.city !== '') {
            setIsCustomCity(true);
            setCustomCityName(profile.city);
          } else {
            setIsCustomCity(false);
          }
        }
      } else {
        setCity('Bengaluru (Bangalore)');
        localStorage.setItem('user_city', 'Bengaluru (Bangalore)');
        setIsCustomCity(false);
        setCustomCityName('');
      }
    }
  }, [profile, isGuestAccount]);

  const activePlan = profile?.plan || localStorage.getItem('user_plan') || 'free';

  // Validation computations
  const effectiveCity = isCustomCity ? customCityName.trim() : city.trim();

  const isNameValid = Boolean(firstName.trim());
  const isStateValid = Boolean(indianState.trim());
  const isCityValid = Boolean(effectiveCity);
  const isLanguageValid = Boolean(language && language.trim());

  // Child info from profile or Dietary Preferences
  const savedChildName = profile?.childName || profile?.toddlerName || profile?.babyName || localStorage.getItem('baby_name') || 'Ashwath';
  const savedChildAge = profile?.toddlerAge || profile?.babyAge || localStorage.getItem('baby_age') || '2 - 3 Years (Curious Explorer)';

  // Available cities computed for selected Indian state
  const availableCities = (indianState && INDIAN_CITIES_BY_STATE[indianState]) 
    ? [...INDIAN_CITIES_BY_STATE[indianState]].sort((a, b) => a.localeCompare(b)) 
    : [];

  const isAllMandatoryComplete = isNameValid && isStateValid && isCityValid && isLanguageValid;

  const handleUpdateProfile = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!user || !db) return;

    // Strict validation: Required fields on General profile
    const missing: string[] = [];
    if (!firstName.trim()) missing.push("Parent / First Name");
    if (!indianState.trim()) missing.push("Indian State / UT");
    if (!effectiveCity) missing.push("City / District");
    if (!language || !language.trim()) missing.push("Language Preference");

    if (missing.length > 0) {
      playSound('glass');
      setError(`Please fill in all required fields to ensure accurate localization and care: ${missing.join(', ')}`);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const activeName = activeChildIndex === 1 ? child1Name.trim() : child2Name.trim();
      const activeDOB = activeChildIndex === 1 ? child1DOB : child2DOB;
      const activeAge = calculateAge(activeDOB) || savedChildAge;
      const activeGender = activeChildIndex === 1 ? child1Gender : child2Gender;
      const activeBlood = activeChildIndex === 1 ? child1BloodGroup : child2BloodGroup;
      const activeDiet = activeChildIndex === 1 ? child1DietaryNotes.trim() : child2DietaryNotes.trim();

      const userRef = doc(db, 'users', user.uid);
      const updateData: any = {
        username: profile?.username || firstName.trim() || 'User',
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        parentName: parentName.trim(),
        contactEmail: contactEmail.trim(),
        email: contactEmail.trim() || user.email,
        child1: {
          name: child1Name.trim(),
          birthDate: child1DOB,
          gender: child1Gender,
          bloodGroup: child1BloodGroup,
          dietaryNotes: child1DietaryNotes.trim(),
        },
        child2: {
          name: child2Name.trim(),
          birthDate: child2DOB,
          gender: child2Gender,
          bloodGroup: child2BloodGroup,
          dietaryNotes: child2DietaryNotes.trim(),
        },
        child2NotApplicable: isChild2NotApplicable,
        hasSecondChild: !isChild2NotApplicable,
        activeChildIndex: isChild2NotApplicable ? 1 : activeChildIndex,
        childName: activeName,
        babyName: activeName,
        toddlerName: activeName,
        babyBirthDate: activeDOB,
        bloodGroup: activeBlood,
        childGender: activeGender,
        toddlerAge: activeAge,
        babyAge: activeAge,
        dietaryNotes: activeDiet,
        needsProfileSetup: false,
        profileCompleted: true,
        ...(indianState ? { indianState: indianState.trim() } : {}),
        ...(effectiveCity ? { city: effectiveCity } : {}),
        language,
        allowDirectMessages,
        updatedAt: serverTimestamp(),
      };

      await setDoc(userRef, updateData, { merge: true });

      localStorage.setItem('needs_profile_setup', 'false');
      localStorage.setItem('profile_completed', 'true');
      localStorage.setItem('parent_name', firstName.trim());
      if (contactEmail.trim()) localStorage.setItem('user_contact_email', contactEmail.trim());

      localStorage.setItem('child_1_name', child1Name.trim());
      localStorage.setItem('child_1_dob', child1DOB);
      localStorage.setItem('child_1_gender', child1Gender);
      localStorage.setItem('child_1_blood', child1BloodGroup);
      localStorage.setItem('child_1_dietary_notes', child1DietaryNotes.trim());

      localStorage.setItem('child_2_name', child2Name.trim());
      localStorage.setItem('child_2_dob', child2DOB);
      localStorage.setItem('child_2_gender', child2Gender);
      localStorage.setItem('child_2_blood', child2BloodGroup);
      localStorage.setItem('child_2_dietary_notes', child2DietaryNotes.trim());

      localStorage.setItem('child_2_not_applicable', String(isChild2NotApplicable));
      localStorage.setItem('active_child_index', String(isChild2NotApplicable ? 1 : activeChildIndex));
      localStorage.setItem('baby_name', activeName);
      localStorage.setItem('child_name', activeName);
      localStorage.setItem('toddler_name', activeName);
      localStorage.setItem('baby_birth_date', activeDOB);
      localStorage.setItem('baby_age', activeAge);
      localStorage.setItem('toddler_age', activeAge);

      if (indianState) localStorage.setItem('user_indian_state', indianState.trim());
      if (effectiveCity) localStorage.setItem('user_city', effectiveCity);
      localStorage.setItem('user_language', language);
      localStorage.setItem('user_language_selected', language);

      await refreshProfile();
      playSound('pop');
      setSuccess("Profile settings saved successfully! All features and tabs are now unlocked.");
      
      // Auto-navigate to home so user can explore all tabs freely
      setTimeout(() => {
        setSuccess(null);
        navigate('/?tab=home', { replace: true });
        window.dispatchEvent(new CustomEvent('nav-reset-to-home'));
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
      handleFirestoreError(err, 'update', `users/${user.uid}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStateSelect = async (stateVal: string) => {
    playSound('glass');
    setIndianState(stateVal);
    localStorage.setItem('user_indian_state', stateVal);

    // If previously selected city does not belong to the newly selected state, reset city
    const newCities = INDIAN_CITIES_BY_STATE[stateVal] || [];
    if (!isCustomCity && city && !newCities.includes(city)) {
      setCity('');
      localStorage.removeItem('user_city');
    }

    if (user && db) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          indianState: stateVal,
          updatedAt: serverTimestamp(),
        });
        await refreshProfile();
      } catch (err) {
        console.warn("Saved state locally", err);
      }
    }
    setSuccess(`Indian State updated to ${stateVal}. Please select your city below.`);
    setTimeout(() => setSuccess(null), 3500);
  };

  const handleCitySelect = async (cityVal: string, isCustom = false) => {
    if (!cityVal) return;
    playSound('glass');
    setCity(cityVal);
    setIsCustomCity(isCustom);
    if (isCustom) {
      setCustomCityName(cityVal);
    }
    localStorage.setItem('user_city', cityVal);
    localStorage.setItem('user_is_custom_city', isCustom ? 'true' : 'false');

    if (user && db) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          city: cityVal,
          isCustomCity: isCustom,
          updatedAt: serverTimestamp(),
        });
        await refreshProfile();
      } catch (err) {
        console.warn("Saved city locally", err);
      }
    }
    setSuccess(`City updated to ${cityVal}`);
    setTimeout(() => setSuccess(null), 3500);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !auth.currentUser) return;
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      
      setSuccess("Password changed successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      if (err.code === 'auth/wrong-password') {
        setError("Current password is incorrect");
      } else {
        setError(err.message || "Failed to change password");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans"
    >
      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {isMandatorySetup && (
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-md">
                One-Time Mandatory Setup
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight text-balance">
            Account &amp; Regional Profile Settings
          </h1>
          <p className="text-white/50 text-sm mt-1 max-w-3xl leading-relaxed text-balance">
            Manage your personal credentials, Indian regional state &amp; city localization, and family languages.
          </p>
        </div>


        {/* Top Save Changes Button Removed */}
      </div>

      {/* Mandatory Profile Setup Welcome Banner */}
      {isMandatorySetup && (
        <div className="mb-8 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-500/25 via-indigo-600/25 to-purple-600/25 border-2 border-amber-400/50 shadow-2xl backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/40 shrink-0 shadow-inner">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1.5 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-mono">
                  Welcome to Tricky Toddlers
                </span>
                <span className="text-xs text-amber-200 font-semibold">• One-Time Mandatory Profile Setup</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Please complete and save your profile details below
              </h2>
              <p className="text-sm text-slate-200 leading-relaxed max-w-3xl">
                To tailor pediatrician insights, solid food guides, and developmental milestone tracking for your family, please verify your details below and click <strong className="text-white font-bold">"Save Changes"</strong>. Once saved, all features, navigation tabs, and health tools will be freely unlocked for you!
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8 text-left">
        {/* Row 1: Profile Information and Security side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Column 1 & 2: General & Child Information Card */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 sm:p-8 lg:p-10 rounded-3xl bg-[#0e1626]/90 border border-white/10 shadow-xl h-full">
              <div className="flex items-center gap-4 mb-6 text-indigo-400 pb-4 border-b border-white/10">
                <div className="p-3.5 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 shrink-0 shadow-md">
                  <User className="w-7 h-7 text-indigo-300" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">{t('generalInfo') || 'General Information'}</h2>
                  <p className="text-xs sm:text-sm text-white/60 mt-1">Fields marked with <span className="text-rose-400 font-bold">*</span> are required for localization &amp; account setup.</p>
                </div>
              </div>

              <div className="mb-6 p-4 bg-white/[0.02] rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{t('username') || 'Username'}</label>
                  <p className="font-mono text-lg text-white/90">@{profile?.username || firstName || 'Lashmi'}</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* Parent Name */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                      Parent Name <span className="text-rose-400">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => {
                      setParentName(e.target.value);
                      setFirstName(e.target.value);
                      localStorage.setItem('parent_name', e.target.value);
                    }}
                    placeholder="Enter parent name (e.g. Lashmi)"
                    className={`w-full bg-[#16223a] border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-4 transition-all placeholder:text-white/20 ${
                      !parentName.trim() ? 'border-rose-500/40 focus:border-rose-400 focus:ring-rose-500/10' : 'border-white/15 focus:border-indigo-400 focus:ring-indigo-500/10'
                    }`}
                  />
                </div>


                {/* Mail ID Collection Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-semibold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Email Address / Mail ID</span>
                    </label>
                    <span className="text-[10px] text-indigo-400 font-semibold">For Reminders &amp; Doctor Consults</span>
                  </div>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => {
                      setContactEmail(e.target.value);
                      localStorage.setItem('user_contact_email', e.target.value);
                    }}
                    placeholder="lashm@gmail.com"
                    className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all placeholder:text-white/20"
                  />
                  <p className="text-[11px] text-white/40 ml-1">
                    Used for live webinar calendar invites, pediatric consultation appointment confirmations, and session updates.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Column 3: Security Section Card (Side by Side with Profile) */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sm:p-8 rounded-3xl bg-[#0e1626]/90 border border-white/10 shadow-xl h-full">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10 text-indigo-400">
                <div className="p-3.5 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 shrink-0 shadow-md">
                  <Lock className="w-7 h-7 text-indigo-300" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{t('security') || 'Security'}</h2>
                  <p className="text-xs sm:text-sm text-white/60 mt-1">Update your account password</p>
                </div>
              </div>
              
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider ml-1">{t('currentPassword') || 'Current Password'}</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
                <div className="pt-2 border-t border-white/5 space-y-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider ml-1">{t('newPassword') || 'New Password'}</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider ml-1">{t('confirmNewPassword') || 'Confirm New Password'}</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>

                <div className="pt-4 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 text-white/80 border border-white/15 rounded-xl font-bold hover:bg-white/10 hover:text-white transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{t('changePassword') || 'Change Password'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Row 2: Child Details (Two Child Profiles) */}
        <div id="section-identification" className="w-full">
          <div className="glass-card p-6 sm:p-8 lg:p-10 rounded-3xl bg-[#0e1626]/90 border border-emerald-500/30 shadow-2xl space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-white/10">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 shrink-0 shadow-md">
                  <Baby className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-300" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight whitespace-nowrap">
                      Child Details
                    </h2>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">
                      {isChild2NotApplicable ? 'Single Child Profile Active' : '2 Child Profiles Supported'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    {isChild2NotApplicable 
                      ? `Managing profile for ${child1Name}. Child 2 is currently marked as Not Applicable.` 
                      : 'Manage date of birth, gender, and blood group for each child. Select a child tab below to edit.'}
                  </p>
                </div>
              </div>

              {/* Child Switcher Tabs */}
              <div className="flex items-center gap-2 bg-[#121d33] p-1.5 rounded-2xl border border-white/10 shrink-0 self-start lg:self-auto">
                <button
                  type="button"
                  onClick={() => { playSound('pop'); setSelectedChildTab(1); }}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                    selectedChildTab === 1 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Baby className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Child 1: {child1Name || 'Ashwath'}</span>
                </button>
                {!isChild2NotApplicable && (
                  <button
                    type="button"
                    onClick={() => { playSound('pop'); setSelectedChildTab(2); }}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                      selectedChildTab === 2 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Baby className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">Child 2: {child2Name || 'Child 2'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Child Profile 2 Not Applicable Checkbox / Option */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="flex items-start sm:items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isChild2NotApplicable}
                  onChange={async (e) => {
                    const checked = e.target.checked;
                    playSound('pop');
                    setIsChild2NotApplicable(checked);
                    if (checked) {
                      setSelectedChildTab(1);
                    }
                    await setChild2NotApplicable(checked);
                    setSuccess(checked 
                      ? "Child Profile 2 marked as Not Applicable." 
                      : "Child Profile 2 enabled.");
                    setTimeout(() => setSuccess(null), 3000);
                  }}
                  className="w-5 h-5 mt-0.5 sm:mt-0 rounded border-emerald-400 text-emerald-500 focus:ring-emerald-400 cursor-pointer accent-emerald-500 shrink-0"
                />
                <div>
                  <span className="text-sm font-black text-white block">
                    Mark Child Profile 2 as Not Applicable
                  </span>
                  <span className="text-xs text-slate-400 block">
                    Check this box if you have only 1 child. Child 2 will be removed from child selection across the tools.
                  </span>
                </div>
              </label>

              {isChild2NotApplicable ? (
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold whitespace-nowrap self-start sm:self-auto">
                  Only Child 1
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold whitespace-nowrap self-start sm:self-auto">
                  2 Children
                </span>
              )}
            </div>

            {/* Child Tab 1 Form Fields */}
            {selectedChildTab === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Baby className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Child 1 Name</span> <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={child1Name}
                    onChange={(e) => setChild1Name(e.target.value)}
                    placeholder="e.g. Ashwath"
                    className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-500 font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Date of Birth (DOB)</span> <span className="text-rose-400">*</span>
                    </span>
                    {calculateAge(child1DOB) && (
                      <span className="text-[10px] font-bold text-emerald-300">{calculateAge(child1DOB)}</span>
                    )}
                  </label>
                  <input
                    type="date"
                    required
                    value={child1DOB}
                    onChange={(e) => setChild1DOB(e.target.value)}
                    className="w-full bg-[#16223a] border border-emerald-400/40 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 font-medium cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Gender
                  </label>
                  <select
                    value={child1Gender}
                    onChange={(e) => setChild1Gender(e.target.value)}
                    className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 font-medium cursor-pointer"
                  >
                    <option value="Boy">Boy</option>
                    <option value="Girl">Girl</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Blood Group
                  </label>
                  <select
                    value={child1BloodGroup}
                    onChange={(e) => setChild1BloodGroup(e.target.value)}
                    className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 font-medium cursor-pointer"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Not Known'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Child Tab 2 Form Fields */}
            {selectedChildTab === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Baby className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Child 2 Name</span> <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={child2Name}
                    onChange={(e) => setChild2Name(e.target.value)}
                    placeholder="e.g. Ananya"
                    className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-500 font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Date of Birth (DOB)</span> <span className="text-rose-400">*</span>
                    </span>
                    {calculateAge(child2DOB) && (
                      <span className="text-[10px] font-bold text-emerald-300">{calculateAge(child2DOB)}</span>
                    )}
                  </label>
                  <input
                    type="date"
                    required
                    value={child2DOB}
                    onChange={(e) => setChild2DOB(e.target.value)}
                    className="w-full bg-[#16223a] border border-emerald-400/40 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 font-medium cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Gender
                  </label>
                  <select
                    value={child2Gender}
                    onChange={(e) => setChild2Gender(e.target.value)}
                    className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 font-medium cursor-pointer"
                  >
                    <option value="Girl">Girl</option>
                    <option value="Boy">Boy</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Blood Group
                  </label>
                  <select
                    value={child2BloodGroup}
                    onChange={(e) => setChild2BloodGroup(e.target.value)}
                    className="w-full bg-[#16223a] border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 font-medium cursor-pointer"
                  >
                    {['B+', 'B-', 'O+', 'O-', 'A+', 'A-', 'AB+', 'AB-', 'Not Known'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Location: Indian State & City (Full Width) */}
        <div className="w-full">
          <div className="glass-card p-6 sm:p-8 lg:p-10 rounded-3xl bg-[#0e1626]/90 border border-white/10 shadow-xl">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10 text-indigo-400">
              <div className="p-3.5 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 shrink-0 shadow-md">
                <MapPin className="w-7 h-7 text-indigo-300" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>Location: Indian State &amp; City</span>
                  <span className="text-rose-400">*</span>
                </h2>
                <p className="text-xs sm:text-sm text-white/60 mt-1">Used for regional pediatric care centers, doctors, and localized health advice</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Indian State / UT */}
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Indian State / UT</span> <span className="text-rose-400">*</span>
                  </label>
                </div>
                <select
                  id="profile-state-select"
                  value={indianState}
                  onChange={(e) => {
                    const newState = e.target.value;
                    setIndianState(newState);
                    localStorage.setItem('user_indian_state', newState);
                    const cities = INDIAN_CITIES_BY_STATE[newState] || [];
                    if (cities.length > 0) {
                      setCity(cities[0]);
                      setIsCustomCity(false);
                      localStorage.setItem('user_city', cities[0]);
                    } else {
                      setCity('');
                      setIsCustomCity(false);
                      localStorage.setItem('user_city', '');
                    }
                  }}
                  className={`w-full bg-[#111c30] border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-4 transition-all cursor-pointer ${
                    !isStateValid ? 'border-rose-500/40 focus:border-rose-400 focus:ring-rose-500/10' : 'border-white/15 focus:border-indigo-400 focus:ring-indigo-500/10'
                  }`}
                >
                  <option value="" disabled>-- Select Indian State / UT --</option>
                  {INDIAN_STATES_AND_UTS.map((st) => (
                    <option key={st} value={st} className="bg-[#0e1726] text-white py-1">
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* City / District */}
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>City / District</span> <span className="text-rose-400">*</span>
                  </label>
                </div>
                <select
                  id="profile-city-select"
                  disabled={!indianState}
                  value={isCustomCity ? 'Custom City (Type name)...' : city}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'Custom City (Type name)...') {
                      setIsCustomCity(true);
                    } else {
                      setIsCustomCity(false);
                      setCity(val);
                      localStorage.setItem('user_city', val);
                    }
                  }}
                  className={`w-full bg-[#111c30] border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-4 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    !isCityValid ? 'border-rose-500/40 focus:border-rose-400 focus:ring-rose-500/10' : 'border-white/15 focus:border-indigo-400 focus:ring-indigo-500/10'
                  }`}
                >
                  <option value="" disabled>
                    {!indianState ? '-- Select State first --' : '-- Select City / District --'}
                  </option>
                  {availableCities.map((ct) => (
                    <option key={ct} value={ct} className="bg-[#0e1726] text-white py-1">
                      {ct}
                    </option>
                  ))}
                  <option value="Custom City (Type name)..." className="bg-[#0e1726] text-indigo-300 font-semibold py-1">
                    Custom City (Type name)...
                  </option>
                </select>

                {isCustomCity && (
                  <div className="pt-2">
                    <input
                      type="text"
                      value={customCityName}
                      onChange={(e) => {
                        setCustomCityName(e.target.value);
                        localStorage.setItem('user_city', e.target.value.trim());
                      }}
                      placeholder="e.g. Mangaluru, Belagavi, Hubballi..."
                      className="w-full bg-[#16223a] border border-indigo-400/40 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-white/20"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Select App Language (Full Width) */}
        <div className="w-full">
          <div className="glass-card p-6 sm:p-8 lg:p-10 rounded-3xl bg-[#0e1626]/90 border border-white/10 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-4 text-indigo-400">
                <div className="p-3.5 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 shrink-0 shadow-md">
                  <Languages className="w-7 h-7 text-indigo-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-2">
                      <span>Choose Indian Language</span>
                      <span className="text-rose-400">*</span>
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-white/60 mt-1">Tricky Toddlers supports 12 Indian regional languages for family-friendly guidance</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 self-start sm:self-auto border ${
                language 
                  ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300' 
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              }`}>
                {SUPPORTED_LANGUAGES.find(l => l.code === language)?.localName || 'English'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={async () => {
                      playSound('glass');
                      await setLanguage(lang.code);
                      localStorage.setItem('user_language_selected', lang.code);
                      setSuccess(t('languageSaved') || `Language preference updated to ${lang.name}!`);
                      setTimeout(() => setSuccess(null), 3000);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/30 shadow-md shadow-indigo-500/10'
                        : 'bg-white/[0.02] border-white/10 text-white/70 hover:border-white/20 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="font-bold text-sm truncate">{lang.localName}</div>
                    <div className="text-[10px] opacity-60 uppercase tracking-wider font-semibold font-mono mt-0.5 truncate">{lang.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>



        {/* Row 5: Notification Settings (Full Width) */}
        <div className="w-full">
          <div className="glass-card p-6 sm:p-8 rounded-3xl bg-[#0e1626]/90 border border-white/10 shadow-xl">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10 text-indigo-400">
              <div className="p-3.5 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 shrink-0 shadow-md">
                <Mail className="w-7 h-7 text-indigo-300" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Notification Settings</h2>
                <p className="text-xs sm:text-sm text-white/60 mt-1">Customize your alert preferences</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { id: 'milestone', label: 'Milestone Alerts', description: 'Instant notification when baby reaches key developmental milestones.' },
                { id: 'vaccine', label: 'Vaccine Alerts', description: 'Instant reminder ahead of vaccine schedules.' },
                { id: 'nutrition', label: 'Nutrition Summary', description: 'Weekly digest of your child\'s nutritional intake and AI insights.' },
                { id: 'updates', label: 'App Updates', description: 'Stay informed about new app features and community announcements.' },
                { id: 'community', label: 'Community Pings', description: 'Get notified when you are part of an ongoing community conversation.' },
                { id: 'mentions', label: 'Direct Mentions', description: 'Instant alert when someone tags you in a discussion.' },
              ].map(option => (
                <div key={option.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-bold text-white">{option.label}</span>
                  </div>
                  <p className="text-xs text-white/50 mb-3">{option.description}</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-indigo-500/30 bg-indigo-500/10 text-indigo-500 focus:ring-indigo-500/20" />
                      <span className="text-xs text-white/70">Email</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-indigo-500/30 bg-indigo-500/10 text-indigo-500 focus:ring-indigo-500/20" />
                      <span className="text-xs text-white/70">Mobile App</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 1:1 Parent Direct Messaging Control Section */}
        <div id="section-direct-messaging" className="w-full">
          <div className="glass-card p-6 sm:p-8 rounded-3xl bg-[#0e1626]/90 border border-indigo-500/30 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10 text-indigo-400">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 shrink-0 shadow-md">
                  <MessageCircle className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    1:1 Parent Direct Messaging Control
                  </h2>
                  <p className="text-xs sm:text-sm text-white/60 mt-0.5">
                    Manage private message permissions while preserving access to community discussion
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${
                allowDirectMessages 
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' 
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              }`}>
                {allowDirectMessages ? 'Direct Messages Enabled' : 'Direct Messages Disabled'}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
              <label className="flex items-start sm:items-center gap-3.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allowDirectMessages}
                  onChange={async (e) => {
                    const checked = e.target.checked;
                    playSound('pop');
                    setAllowDirectMessages(checked);
                    localStorage.setItem('allow_direct_messages', String(checked));
                    if (user && db) {
                      try {
                        const userRef = doc(db, 'users', user.uid);
                        await setDoc(userRef, { allowDirectMessages: checked }, { merge: true });
                        await refreshProfile();
                      } catch (err) {
                        console.warn("Direct messaging sync:", err);
                      }
                    }
                    setSuccess(checked 
                      ? "Direct messaging enabled! You can now send and receive 1:1 messages with other parents." 
                      : "Direct messaging disabled. 1:1 messages paused; Community Help remains available.");
                    setTimeout(() => setSuccess(null), 3500);
                  }}
                  className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 sm:mt-0 rounded border-indigo-400 text-indigo-500 focus:ring-indigo-400 cursor-pointer accent-indigo-500 shrink-0"
                />
                <div>
                  <span className="text-sm sm:text-base font-black text-white block">
                    Allow other parents to send messages directly
                  </span>
                  <span className="text-xs sm:text-sm text-slate-300 block mt-0.5">
                    Permit other parents in Parent Connect to initiate private 1:1 direct messages with you.
                  </span>
                </div>
              </label>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/30 text-xs sm:text-sm text-amber-200/95 leading-relaxed">
                <strong className="text-amber-300 font-bold block mb-1">Please Note:</strong>
                If unchecked, no one will be able to send messages to you, and you will not be able to send 1:1 messages to any parent. However, <strong>Community Help</strong> will be available for any conversations.
              </div>
            </div>
          </div>

          {/* Save Changes Action Bar after 1:1 Parent Direct Messaging Control */}
          <div className="mt-6 flex justify-start">
            <button
              type="button"
              onClick={handleUpdateProfile}
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-black text-sm sm:text-base transition-all shadow-xl shadow-indigo-500/25 active:scale-95 disabled:opacity-50 cursor-pointer w-full sm:w-auto"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              <span>{t('saveChanges') || 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Row 7: Data Protection & Parent Data Ownership (All 6 Features + PDF Export + Zero Ad Policy) */}
        <div className="w-full">
          <div className="glass-card p-6 sm:p-8 lg:p-10 rounded-3xl bg-[#090f1f]/95 border-2 border-emerald-500/40 shadow-2xl space-y-8">
            
            {/* Header with Zero Ad Selling Badge */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4 text-emerald-400">
                <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 shrink-0 shadow-lg">
                  <ShieldCheck className="w-7 h-7 text-emerald-300" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      Parent Data Ownership &amp; Protection
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                      You Own Your Data
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                    Full control over your children's medical, developmental, and dietary information.
                  </p>
                </div>
              </div>

              {/* Zero Ad Selling Guarantee Badge */}
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-3 shrink-0">
                <Shield className="w-5 h-5 text-emerald-400" />
                <div className="text-left text-xs">
                  <div className="font-black text-white uppercase tracking-wider">Zero Ad Selling Policy</div>
                  <div className="text-slate-400 text-[11px]">No ad trackers · No third-party data brokers</div>
                </div>
              </div>
            </div>

            {/* 6 Key Data Protection Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* Tool 1: Export My Data */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Download className="w-4 h-4" />
                    <span>Export My Data</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Download complete raw JSON records of child profiles, immunization history, dietary restrictions, and developmental notes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportJsonData}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JSON Records</span>
                </button>
              </div>

              {/* Tool 2: Pediatrician Health PDF Export */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-950/40 to-slate-900 border border-sky-500/30 hover:border-sky-400/60 transition-all flex flex-col justify-between space-y-4 shadow-md">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                    <FileText className="w-4 h-4" />
                    <span>Pediatrician Health PDF Export</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Generate a doctor-friendly, print-ready Clinical Health Summary formatted with child vitals, IAP vaccines, and allergy notes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportPediatricianPDF}
                  className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-lg shadow-sky-500/20"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate Pediatrician PDF</span>
                </button>
              </div>

              {/* Tool 3: Delete Meal Photos */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Camera className="w-4 h-4" />
                    <span>Delete Meal Photos</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Erase all scanned meal photos, barcode snapshots, and food lens camera caches stored on your device.
                  </p>
                  {deletedPhotosMsg && (
                    <span className="text-[11px] font-bold text-amber-300 block">{deletedPhotosMsg}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleDeleteMealPhotos}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Purge Meal Scan Photos</span>
                </button>
              </div>

              {/* Tool 4: Profile Management */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                    <Baby className="w-4 h-4" />
                    <span>Profile Management</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Update child information, toggle between Child 1 and Child 2, or mark Child 2 as Not Applicable if single-child family.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('section-identification');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Manage Child Profiles</span>
                </button>
              </div>

              {/* Tool 5: Data Retention Settings */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Data Retention Settings</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Define how long your children's growth logs, scan histories, and milestones remain active.
                  </p>
                </div>
                <select
                  value={dataRetention}
                  onChange={(e) => handleDataRetentionChange(e.target.value)}
                  className="w-full bg-[#111c30] border border-white/15 rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-emerald-400 cursor-pointer"
                >
                  <option value="forever">Keep Forever (Recommended for Pediatric Records)</option>
                  <option value="1year">Retain for 1 Year</option>
                  <option value="6months">Retain for 6 Months</option>
                  <option value="90days">Retain for 90 Days</option>
                </select>
              </div>

              {/* Tool 6: Delete My Data & Account Deletion */}
              <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 hover:border-rose-400/60 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Delete My Data &amp; Account</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Permanently delete your child's data or trigger a complete, irrevocable account deletion.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteDataModal(true)}
                    className="flex-1 py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 hover:text-white font-bold text-xs transition-all active:scale-95 cursor-pointer"
                  >
                    Clear Child Data
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteAccountModal(true)}
                    className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition-all active:scale-95 cursor-pointer shadow-md"
                  >
                    Delete Account
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Delete Child Data Confirmation Modal */}
      <AnimatePresence>
        {showDeleteDataModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowDeleteDataModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full p-6 sm:p-7 rounded-3xl bg-[#0e1626] border-2 border-rose-500/50 shadow-2xl text-left space-y-4"
            >
              <div className="flex items-center gap-3 text-rose-400">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="text-lg font-black text-white">Permanently Delete Child Data?</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                This will erase all child profile names, birth dates, dietary notes, and blood group entries from your account. This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowDeleteDataModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteChildData}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition-all cursor-pointer shadow-lg"
                >
                  Yes, Delete Child Data
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Account Deletion Confirmation Modal */}
      <AnimatePresence>
        {showDeleteAccountModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setShowDeleteAccountModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full p-6 sm:p-7 rounded-3xl bg-[#0b0f1a] border-2 border-rose-600 shadow-2xl text-left space-y-4"
            >
              <div className="flex items-center gap-3 text-rose-400">
                <Trash2 className="w-6 h-6 shrink-0" />
                <h3 className="text-lg font-black text-white">Delete Entire Account?</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                All account credentials, child records, vaccination reminders, and regional settings will be irrevocably deleted immediately.
              </p>
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                <label className="text-[11px] font-bold text-rose-300 block">
                  To confirm, type <strong className="text-white font-mono">DELETE</strong> below:
                </label>
                <input
                  type="text"
                  value={deleteAccountInput}
                  onChange={(e) => setDeleteAccountInput(e.target.value)}
                  placeholder="Type DELETE"
                  className="w-full bg-[#16223a] border border-rose-500/40 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowDeleteAccountModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteAccountInput.trim().toUpperCase() !== 'DELETE'}
                  onClick={handleDeleteAccount}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-black transition-all cursor-pointer shadow-lg"
                >
                  Permanently Delete Account
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Notifications */}
      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-8 right-8 flex items-center gap-3 px-8 py-5 rounded-[2rem] shadow-2xl z-50 border backdrop-blur-3xl ${
              error ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
            }`}
          >
            {error ? <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" /> : <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />}
            <span className="font-bold text-sm tracking-tight">{error || success}</span>
            <button 
              onClick={() => { setError(null); setSuccess(null); }}
              className="ml-6 p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white/60 hover:text-white"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
