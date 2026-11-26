import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updatePassword,
  linkWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { auth, db, handleFirestoreError } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { SiteAnalyticsRecord, TRACKED_FEATURES } from '../lib/analyticsTracker';
import { triggerToast } from '../lib/ToastContext';
import { playSound } from '../lib/sounds';
import {
  ShieldCheck,
  Lock,
  User,
  LogIn,
  LogOut,
  Users,
  Sparkles,
  Globe,
  Clock,
  Calendar,
  MapPin,
  Monitor,
  Smartphone,
  BarChart3,
  Download,
  Search,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Baby,
  Activity,
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  Send,
  X,
  Link2,
  ExternalLink,
  Timer,
  TrendingUp,
  AlertTriangle,
  Layers,
  Compass,
  CheckSquare,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, loginAsGuest, setSessionActive } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Hold server-issued admin token strictly in React memory (never in localStorage/sessionStorage)
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    const state = location.state as { adminToken?: string } | null;
    return state?.adminToken || null;
  });
  const [adminUsername, setAdminUsername] = useState<string>('admin');
  const [serverStatus, setServerStatus] = useState<{
    isConfigured: boolean;
    hasEnvPassword: boolean;
    adminUsername: string;
  } | null>(null);

  // Admin Login Form State
  const [usernameInput, setUsernameInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Forgot Admin Password Recovery Panel State
  const [showForgotAdminPanel, setShowForgotAdminPanel] = useState(false);
  const [adminResetEmail, setAdminResetEmail] = useState('');
  const [adminResetLoading, setAdminResetLoading] = useState(false);
  const [adminResetSuccess, setAdminResetSuccess] = useState<string | null>(null);
  const [adminResetError, setAdminResetError] = useState<string | null>(null);

  // Update Admin Password Modal State (when signed in)
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');
  const [showNewAdminPass, setShowNewAdminPass] = useState(false);
  const [updatePassLoading, setUpdatePassLoading] = useState(false);
  const [updatePassError, setUpdatePassError] = useState<string | null>(null);
  const [updatePassSuccess, setUpdatePassSuccess] = useState<string | null>(null);

  // Analytics Records State
  const [records, setRecords] = useState<SiteAnalyticsRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [firestoreError, setFirestoreError] = useState<string | null>(null);

  // Filters
  const [accountFilter, setAccountFilter] = useState<
    'ALL' | 'Guest Account' | 'Personal Account' | 'URL Visit' | 'Feature Activity'
  >('ALL');
  const [personaFilter, setPersonaFilter] = useState<'ALL' | 'Child 1' | 'Child 2' | 'General'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Global Date Filter Selection (applies to every metric & table on the page)
  const [datePreset, setDatePreset] = useState<'ALL' | 'TODAY' | 'LAST_7' | 'LAST_30' | 'CUSTOM'>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Determine whether the current Firebase user is an authorized admin
  const isFirebaseAdmin =
    user?.email === 'rlashmi086@gmail.com' ||
    user?.email === 'admin@securepass.internal';

  const isAuthenticatedAdmin =
    user?.email === 'rlashmi086@gmail.com' ||
    user?.email === 'admin@securepass.internal';

  // Fetch admin configuration status from backend
  useEffect(() => {
    let mounted = true;
    fetch('/api/admin/status')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (mounted && data) {
          setServerStatus(data);
          if (data.adminUsername) {
            setUsernameInput(data.adminUsername);
            setAdminUsername(data.adminUsername);
          }
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Listen for custom admin token event from LoginForm
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.token) {
        setAdminToken(detail.token);
      }
      if (detail?.username) {
        setAdminUsername(detail.username);
      }
    };
    window.addEventListener('tt-admin-token', handler);
    return () => window.removeEventListener('tt-admin-token', handler);
  }, []);

  // Subscribe to Firestore /site_analytics only when authenticated as admin
  useEffect(() => {
    if (!isAuthenticatedAdmin || !isFirebaseAdmin || !db) {
      setRecords([]);
      return;
    }

    setLoadingRecords(true);
    setFirestoreError(null);

    const q = query(
      collection(db, 'site_analytics'),
      orderBy('createdAtIso', 'desc'),
      limit(2500)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: SiteAnalyticsRecord[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            userId: data.userId || '',
            visitorId: data.visitorId || 'vis_unknown',
            isReturningVisitor: Boolean(data.isReturningVisitor),
            accountType: data.accountType || 'Guest Account',
            entryPoint: data.entryPoint || 'Instant Guest Access',
            personaName: data.personaName || 'Parent',
            childProfile: data.childProfile || 'Child 1 (2 Years 6 Months)',
            activeTab: data.activeTab || 'ai',
            loginDate: data.loginDate || '',
            dayOfWeek: data.dayOfWeek || '',
            loginTime: data.loginTime || '',
            timeOfDaySlot: data.timeOfDaySlot || '',
            city: data.city || 'Bengaluru (Bangalore)',
            region: data.region || 'Karnataka',
            country: data.country || 'India',
            timezone: data.timezone || 'Asia/Kolkata',
            deviceType: data.deviceType || 'Desktop',
            browser: data.browser || 'Google Chrome',
            os: data.os || 'Desktop OS',
            eventType: data.eventType || (data.accountType === 'URL Visit' ? 'url_visit' : 'login'),
            trafficSource: data.trafficSource || '',
            featureName: data.featureName || '',
            durationSeconds: typeof data.durationSeconds === 'number' ? data.durationSeconds : 0,
            completedAction: data.completedAction || '',
            createdAtIso: data.createdAtIso || '',
          };
        });
        setRecords(list);
        setLoadingRecords(false);
      },
      (err) => {
        setLoadingRecords(false);
        setFirestoreError(err?.message || 'Unable to load analytics records.');
        try {
          handleFirestoreError(err, 'list', 'site_analytics');
        } catch (structuredErr) {
          console.warn('Admin analytics read error:', structuredErr);
        }
      }
    );

    return () => unsubscribe();
  }, [isAuthenticatedAdmin, isFirebaseAdmin]);

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const cleanUser = usernameInput.trim().toLowerCase();
    const cleanPass = passwordInput;

    if (!cleanUser || !cleanPass) {
      setAuthError('Please enter your admin username or email, and password.');
      return;
    }
    if (cleanPass.length < 6) {
      setAuthError('Admin password must be at least 6 characters.');
      return;
    }

    setAuthLoading(true);
    try {
      // Direct Firebase Email Auth sign-in when signing in with the authorized Admin Email ID
      if (cleanUser.includes('@')) {
        if (cleanUser !== 'rlashmi086@gmail.com') {
          setAuthError('Access denied: this email address is not authorized for Admin Analytics.');
          setAuthLoading(false);
          return;
        }
        try {
          await signInWithEmailAndPassword(auth, cleanUser, cleanPass);
          setAdminUsername('Admin');
          setPasswordInput('');
          setSessionActive(true);
          playSound('glass');
          triggerToast('Welcome to the Private Admin Analytics Dashboard.', 'success', 'Admin Authenticated');
        } catch (emailErr: any) {
          if (emailErr.code === 'auth/invalid-credential' || emailErr.code === 'auth/wrong-password' || emailErr.code === 'auth/user-not-found') {
            setAuthError('Incorrect email password or no password set yet. Use "Forgot Admin Password" or "Continue with Google" below.');
          } else {
            setAuthError(emailErr?.message || 'Admin email sign-in failed.');
          }
        } finally {
          setAuthLoading(false);
        }
        return;
      }

      // 1. Verify or claim admin credentials on the server
      const endpoint = serverStatus && !serverStatus.isConfigured ? '/api/admin/claim' : '/api/admin/login';
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password: cleanPass }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setAuthError(data.error || 'Invalid admin username or password.');
        setAuthLoading(false);
        return;
      }

      // 2. Authenticate with Firebase Auth as admin@securepass.internal so Firestore rules grant read access
      const adminEmail = 'admin@securepass.internal';
      try {
        await signInWithEmailAndPassword(auth, adminEmail, cleanPass);
      } catch (fbErr: any) {
        if (
          fbErr.code === 'auth/user-not-found' ||
          fbErr.code === 'auth/invalid-credential'
        ) {
          try {
            await createUserWithEmailAndPassword(auth, adminEmail, cleanPass);
          } catch (createErr: any) {
            if (createErr.code === 'auth/email-already-in-use') {
              setAuthError(
                'Incorrect admin password, or server password was updated separately. Use "Continue with Google (Admin)" or "Forgot Admin Password" below to recover access and set a new password.'
              );
              setAuthLoading(false);
              return;
            }
            throw createErr;
          }
        } else if (fbErr.code === 'auth/wrong-password') {
          setAuthError('Incorrect admin password.');
          setAuthLoading(false);
          return;
        } else {
          throw fbErr;
        }
      }

      setAdminToken(data.token);
      setAdminUsername(data.username || 'admin');
      setPasswordInput('');
      setServerStatus((prev) =>
        prev
          ? { ...prev, isConfigured: true, adminUsername: data.username || 'admin' }
          : { isConfigured: true, hasEnvPassword: false, adminUsername: 'admin' }
      );
      setSessionActive(true);
      playSound('glass');
      triggerToast('Welcome to the Private Admin Analytics Dashboard.', 'success', 'Admin Authenticated');
    } catch (err: any) {
      setAuthError(err?.message || 'Admin sign-in failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleAdminSignIn = async () => {
    setAuthError(null);
    setGoogleLoading(true);
    playSound('click');
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const cred = await signInWithPopup(auth, provider);
      const email = (cred.user.email || '').toLowerCase();
      if (email !== 'rlashmi086@gmail.com') {
        await signOut(auth);
        setAuthError('Access denied: this Google account is not authorized for Admin Analytics.');
        setGoogleLoading(false);
        return;
      }
      setAdminUsername(cred.user.displayName || 'Admin');
      setSessionActive(true);
      playSound('glass');
      triggerToast('Signed in via Google Admin Account. You can now update your password in the header.', 'success', 'Admin Verified');
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        setAuthError(null);
      } else {
        setAuthError(err?.message || 'Google sign-in failed. Please try resetting via your admin email below.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSendAdminResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminResetError(null);
    setAdminResetSuccess(null);
    const cleanEmail = adminResetEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setAdminResetError('Please enter your authorized Admin Email ID.');
      return;
    }
    if (cleanEmail !== 'rlashmi086@gmail.com') {
      setAdminResetError('This email is not registered as an Admin account. Please enter the owner Admin Email ID.');
      return;
    }
    setAdminResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      setAdminResetSuccess(
        `Password reset email requested for ${cleanEmail}. Check your inbox & spam folder. Note: if you previously signed in only with Google or an admin username, click "Continue with Google (Admin)" above and then use "Update Password" inside the dashboard to set a fresh password.`
      );
      playSound('glass');
    } catch (err: any) {
      if (err?.code === 'auth/user-not-found') {
        setAdminResetError(
          'No email/password account exists for that email yet. Click "Continue with Google (Admin)" above to sign in immediately and set your new password.'
        );
      } else {
        setAdminResetError(err?.message || 'Could not send reset email.');
      }
    } finally {
      setAdminResetLoading(false);
    }
  };

  const handleUpdateAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatePassError(null);
    setUpdatePassSuccess(null);

    if (newAdminPass.length < 6) {
      setUpdatePassError('New password must be at least 6 characters.');
      return;
    }
    if (newAdminPass !== confirmAdminPass) {
      setUpdatePassError('Passwords do not match.');
      return;
    }
    if (!auth?.currentUser || !auth.currentUser.email) {
      setUpdatePassError('Active admin session not found. Please sign in again.');
      return;
    }

    setUpdatePassLoading(true);
    try {
      const hasPasswordProvider = auth.currentUser.providerData.some(
        (p: any) => p.providerId === 'password'
      );

      if (hasPasswordProvider) {
        await updatePassword(auth.currentUser, newAdminPass);
      } else {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, newAdminPass);
        await linkWithCredential(auth.currentUser, credential);
      }

      setNewAdminPass('');
      setConfirmAdminPass('');
      setUpdatePassSuccess(
        auth.currentUser.email === 'rlashmi086@gmail.com'
          ? `Password updated! You can now sign in with ${auth.currentUser.email} and your new password anytime. (If you also log in with username "${serverStatus?.adminUsername || 'admin'}", update ADMIN_PASSWORD in Settings -> Secrets / Vercel Env Vars to match.)`
          : 'Password updated in Firebase Auth! Remember to also update ADMIN_PASSWORD in Settings -> Secrets / Vercel Env Vars so both match.'
      );
      playSound('glass');
      triggerToast('Admin password updated successfully.', 'success', 'Password Saved');
    } catch (err: any) {
      if (err?.code === 'auth/requires-recent-login') {
        setUpdatePassError(
          'For security, Firebase requires a fresh sign-in before changing passwords. Please click "Admin Sign Out", sign back in (e.g. via Google), and try updating again—or send yourself a reset email.'
        );
      } else {
        setUpdatePassError(err?.message || 'Could not update password. Try signing in again.');
      }
    } finally {
      setUpdatePassLoading(false);
    }
  };

  const handleAdminSignOut = async () => {
    playSound('pop');
    if (adminToken) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      }).catch(() => {});
    }
    setAdminToken(null);
    try {
      if (auth) {
        await signOut(auth);
      }
      await loginAsGuest(false);
    } catch {}
    setSessionActive(false);
    triggerToast('Signed out of Admin Analytics Portal.', 'info', 'Admin Signed Out');
    navigate('/?tab=home', { replace: true });
  };

  const handleDeleteRecord = async (id: string) => {
    if (!db) return;
    playSound('pop');
    try {
      await deleteDoc(doc(db, 'site_analytics', id));
    } catch (err: any) {
      if (err?.code === 'permission-denied') {
        handleFirestoreError(err, 'delete', `site_analytics/${id}`);
      }
    }
  };

  const handleExportCSV = () => {
    playSound('glass');
    if (filteredRecords.length === 0) {
      triggerToast('No records available to export.', 'info', 'Export CSV');
      return;
    }
    const headers = [
      'Date',
      'Day of Week',
      'Login Time',
      'Time Slot',
      'Event Type',
      'Account Type',
      'Traffic Source',
      'Feature Name',
      'Completed Action',
      'Duration (s)',
      'Visitor Type',
      'Visitor ID',
      'Parent Persona',
      'Child Profile',
      'Entry Point',
      'Feature Tab',
      'City',
      'State / Region',
      'Country',
      'Timezone',
      'Device',
      'Browser',
      'OS',
    ];
    const escapeCsv = (val: string | number | undefined) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const rows = filteredRecords.map((r) =>
      [
        r.loginDate,
        r.dayOfWeek,
        r.loginTime,
        r.timeOfDaySlot,
        r.eventType || 'login',
        r.accountType,
        r.trafficSource || 'Direct Link',
        r.featureName || '',
        r.completedAction || '',
        r.durationSeconds || 0,
        r.isReturningVisitor ? 'Returning Visitor' : 'New Visitor',
        r.visitorId,
        r.personaName,
        r.childProfile,
        r.entryPoint,
        r.activeTab,
        r.city,
        r.region,
        r.country,
        r.timezone,
        r.deviceType,
        r.browser,
        r.os,
      ]
        .map(escapeCsv)
        .join(',')
    );
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tricky-toddlers-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast('Analytics report downloaded as CSV.', 'success', 'Export Complete');
  };

  const formatDateLocal = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const getRecordDateStr = (r: SiteAnalyticsRecord): string => {
    if (r.loginDate && /^\d{4}-\d{2}-\d{2}$/.test(r.loginDate.trim())) {
      return r.loginDate.trim();
    }
    if (r.createdAtIso) {
      const parsed = new Date(r.createdAtIso);
      if (!Number.isNaN(parsed.getTime())) {
        return formatDateLocal(parsed);
      }
      if (/^\d{4}-\d{2}-\d{2}/.test(r.createdAtIso)) {
        return r.createdAtIso.slice(0, 10);
      }
    }
    return '';
  };

  const applyDatePreset = (preset: 'ALL' | 'TODAY' | 'LAST_7' | 'LAST_30') => {
    const now = new Date();
    const todayStr = formatDateLocal(now);
    setDatePreset(preset);

    if (preset === 'ALL') {
      setStartDate('');
      setEndDate('');
    } else if (preset === 'TODAY') {
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === 'LAST_7') {
      const start = new Date(now);
      start.setDate(start.getDate() - 6);
      setStartDate(formatDateLocal(start));
      setEndDate(todayStr);
    } else if (preset === 'LAST_30') {
      const start = new Date(now);
      start.setDate(start.getDate() - 29);
      setStartDate(formatDateLocal(start));
      setEndDate(todayStr);
    }
  };

  // Global Date-Filtered Records (drives ALL KPIs, Charts, Locations, Personas, Devices & Log Table)
  const { dateFilteredRecords, dateRangeLabel } = useMemo(() => {
    const now = new Date();
    const todayStr = formatDateLocal(now);

    if (datePreset === 'ALL' && !startDate && !endDate) {
      return { dateFilteredRecords: records, dateRangeLabel: 'All Dates' };
    }

    let minD = startDate;
    let maxD = endDate;

    if (datePreset === 'TODAY' && (!minD || !maxD)) {
      minD = todayStr;
      maxD = todayStr;
    } else if (datePreset === 'LAST_7' && (!minD || !maxD)) {
      const s = new Date(now);
      s.setDate(s.getDate() - 6);
      minD = formatDateLocal(s);
      maxD = todayStr;
    } else if (datePreset === 'LAST_30' && (!minD || !maxD)) {
      const s = new Date(now);
      s.setDate(s.getDate() - 29);
      minD = formatDateLocal(s);
      maxD = todayStr;
    }

    let filtered = records;
    let label = 'All Dates';

    if (minD && maxD) {
      const [lo, hi] = minD <= maxD ? [minD, maxD] : [maxD, minD];
      filtered = records.filter((r) => {
        const d = getRecordDateStr(r);
        return d !== '' && d >= lo && d <= hi;
      });
      label = lo === hi ? `${lo}` : `${lo} to ${hi}`;
    } else if (minD) {
      filtered = records.filter((r) => getRecordDateStr(r) === minD);
      label = `${minD}`;
    } else if (maxD) {
      filtered = records.filter((r) => getRecordDateStr(r) === maxD);
      label = `${maxD}`;
    }

    return { dateFilteredRecords: filtered, dateRangeLabel: label };
  }, [records, datePreset, startDate, endDate]);

  const formatDurationLabel = (seconds: number): string => {
    const clean = Math.round(seconds);
    if (!Number.isFinite(clean) || clean <= 0) return '—';
    if (clean < 60) return `${clean}s`;
    const mins = Math.floor(clean / 60);
    const secs = clean % 60;
    if (mins < 60) return `${mins}m ${secs}s`;
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs}h ${remMins}m`;
  };

  const resolveTrafficSource = (r: SiteAnalyticsRecord): string => {
    if (r.trafficSource && r.trafficSource.trim()) {
      return r.trafficSource.trim();
    }
    const ep = (r.entryPoint || '').toLowerCase();
    if (ep.includes('tinyurl.com/trickytods')) return 'TinyURL';
    if (ep.includes('qr')) return 'QR Code';
    if (ep.includes('whatsapp')) return 'WhatsApp';
    if (ep.includes('linkedin')) return 'LinkedIn';
    if (ep.includes('google')) return 'Google';
    return 'Direct Link';
  };

  // Filtered records for table (respects global date filter + table search/dropdown filters)
  const filteredRecords = useMemo(() => {
    return dateFilteredRecords.filter((r) => {
      const isBackgroundPing =
        r.eventType === 'session_ping' ||
        r.accountType === 'Session Engagement' ||
        r.entryPoint.startsWith('Feature Duration');
      if (isBackgroundPing) return false;

      const isPersonaEvt =
        r.eventType === 'persona_switch' ||
        r.entryPoint.startsWith('Persona Switch');
      const isFeatureEvt = r.eventType === 'feature_use' || r.eventType === 'feature_action';

      if (accountFilter === 'Feature Activity') {
        if (!isFeatureEvt) return false;
      } else if (accountFilter !== 'ALL') {
        if (isFeatureEvt || isPersonaEvt || r.accountType !== accountFilter) return false;
      }

      if (personaFilter !== 'ALL' && !r.childProfile.toLowerCase().includes(personaFilter.toLowerCase())) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const hay = `${r.loginDate} ${r.dayOfWeek} ${r.loginTime} ${r.timeOfDaySlot} ${r.city} ${r.region} ${r.country} ${r.personaName} ${r.childProfile} ${r.entryPoint} ${r.trafficSource || ''} ${r.featureName || ''} ${r.completedAction || ''} ${r.deviceType} ${r.browser}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [dateFilteredRecords, accountFilter, personaFilter, searchQuery]);

  // Computed Analytics Metrics (all derived from dateFilteredRecords)
  const stats = useMemo(() => {
    const activeSet = dateFilteredRecords;

    const isSessionPingEvt = (r: SiteAnalyticsRecord) =>
      r.eventType === 'session_ping' || r.accountType === 'Session Engagement';
    const isFeatureDurationEvt = (r: SiteAnalyticsRecord) =>
      r.entryPoint.startsWith('Feature Duration');
    const isFeatureEvt = (r: SiteAnalyticsRecord) =>
      r.eventType === 'feature_use' || r.eventType === 'feature_action';
    const isPersonaSwitchEvt = (r: SiteAnalyticsRecord) =>
      r.eventType === 'persona_switch' || r.entryPoint.startsWith('Persona Switch');
    const isUrlVisitEvt = (r: SiteAnalyticsRecord) =>
      r.eventType === 'url_visit' || r.accountType === 'URL Visit';
    const isLoginEvt = (r: SiteAnalyticsRecord) =>
      !isSessionPingEvt(r) && !isFeatureEvt(r) && !isPersonaSwitchEvt(r) && !isUrlVisitEvt(r);

    // Primary visit events (real Guest Access clicks, Personal sign-ins, Vercel/App URL visits)
    const primaryVisits = activeSet.filter((r) => isLoginEvt(r) || isUrlVisitEvt(r));
    const totalEvents = primaryVisits.length;

    const guestRecords = primaryVisits.filter((r) => r.accountType === 'Guest Account');
    const guestClicks = guestRecords.length;
    const uniqueGuestClicks = new Set(guestRecords.map((r) => r.visitorId)).size;

    const vercelUrlRecords = primaryVisits.filter(
      (r) =>
        isUrlVisitEvt(r) &&
        (r.entryPoint.toLowerCase().includes('vercel') ||
          r.entryPoint.toLowerCase().includes('tinyurl.com/trickytods') ||
          r.entryPoint.toLowerCase().includes('trickytoddlers'))
    );
    const vercelTotalClicks = vercelUrlRecords.length;
    const vercelUniqueClicks = new Set(vercelUrlRecords.map((r) => r.visitorId)).size;

    const personalLogins = primaryVisits.filter((r) => r.accountType === 'Personal Account').length;

    const uniqueVisitorsSet = new Set(activeSet.map((r) => r.visitorId));
    const uniqueVisitors = uniqueVisitorsSet.size;
    const returningVisitors = new Set(
      activeSet.filter((r) => r.isReturningVisitor).map((r) => r.visitorId)
    ).size;

    const todayStr = formatDateLocal(new Date());
    const todayLogins = primaryVisits.filter((r) => getRecordDateStr(r) === todayStr).length;

    // 1. Acquisition: Traffic Source Breakdown
    const trafficMap = new Map<string, { source: string; visits: number; visitors: Set<string> }>();
    const sourceRecords = primaryVisits.length > 0 ? primaryVisits : activeSet.filter((r) => !isSessionPingEvt(r) && !isFeatureDurationEvt(r));
    sourceRecords.forEach((r) => {
      const source = resolveTrafficSource(r);
      const entry = trafficMap.get(source);
      if (entry) {
        entry.visits += 1;
        entry.visitors.add(r.visitorId);
      } else {
        trafficMap.set(source, { source, visits: 1, visitors: new Set([r.visitorId]) });
      }
    });
    const trafficDenominator = sourceRecords.length;
    const trafficSources = Array.from(trafficMap.values())
      .map((item) => ({
        source: item.source,
        visits: item.visits,
        uniqueUsers: item.visitors.size,
        pct: trafficDenominator > 0 ? Math.round((item.visits / trafficDenominator) * 100) : 0,
      }))
      .sort((a, b) => b.visits - a.visits);

    // 2. Engagement: Average Session Duration (uses Math.max of session pings vs feature dwell time per session)
    const extractSessionKey = (r: SiteAnalyticsRecord): string => {
      const sessMatch = r.entryPoint.match(/(sess_[a-zA-Z0-9_-]+)/);
      if (sessMatch) return sessMatch[1];
      return `${r.visitorId}_${getRecordDateStr(r) || r.loginDate || 'unknown'}`;
    };

    const pingDurationBySession = new Map<string, number>();
    const featureDurationBySession = new Map<string, number>();
    activeSet.forEach((r) => {
      const dur = typeof r.durationSeconds === 'number' && r.durationSeconds > 0 ? r.durationSeconds : 0;
      if (dur <= 0) return;
      const key = extractSessionKey(r);
      if (isSessionPingEvt(r)) {
        pingDurationBySession.set(key, (pingDurationBySession.get(key) || 0) + dur);
      } else if (isFeatureEvt(r)) {
        featureDurationBySession.set(key, (featureDurationBySession.get(key) || 0) + dur);
      }
    });

    const allDurationSessionKeys = new Set<string>([
      ...Array.from(pingDurationBySession.keys()),
      ...Array.from(featureDurationBySession.keys()),
    ]);

    let totalSessionSeconds = 0;
    allDurationSessionKeys.forEach((key) => {
      const pingSecs = pingDurationBySession.get(key) || 0;
      const featSecs = featureDurationBySession.get(key) || 0;
      totalSessionSeconds += Math.max(pingSecs, featSecs);
    });
    const measuredSessionsCount = allDurationSessionKeys.size;
    const avgSessionDurationSeconds =
      measuredSessionsCount > 0 ? Math.round(totalSessionSeconds / measuredSessionsCount) : 0;

    // 3. Feature Adoption Breakdown across all tracked features / top tabs
    const featureUsersOverall = new Set<string>();
    const featureStats = TRACKED_FEATURES.map((featureName) => {
      const matching = activeSet.filter((r) => {
        if (r.featureName === featureName) return true;
        if (featureName === 'Routine Checker' && r.featureName === 'Routine Coach') return true;
        return false;
      });
      const userUsageMap = new Map<
        string,
        Map<string, { opens: number; actions: number }>
      >();

      let totalDurationSeconds = 0;
      let completedActionsCount = 0;
      const actionCounts = new Map<string, number>();
      const durationSessions = new Set<string>();

      matching.forEach((r) => {
        featureUsersOverall.add(r.visitorId);
        const sessKey = extractSessionKey(r);

        let userSessions = userUsageMap.get(r.visitorId);
        if (!userSessions) {
          userSessions = new Map();
          userUsageMap.set(r.visitorId, userSessions);
        }
        let sessData = userSessions.get(sessKey);
        if (!sessData) {
          sessData = { opens: 0, actions: 0 };
          userSessions.set(sessKey, sessData);
        }

        if (isFeatureDurationEvt(r)) {
          if (typeof r.durationSeconds === 'number' && r.durationSeconds > 0) {
            totalDurationSeconds += r.durationSeconds;
            durationSessions.add(sessKey);
          }
        } else if (r.eventType === 'feature_action') {
          completedActionsCount += 1;
          sessData.actions += 1;
          const actName = (r.completedAction || 'Completed').trim();
          actionCounts.set(actName, (actionCounts.get(actName) || 0) + 1);
        } else {
          // feature_use open event
          sessData.opens += 1;
          if (typeof r.durationSeconds === 'number' && r.durationSeconds > 0) {
            totalDurationSeconds += r.durationSeconds;
            durationSessions.add(sessKey);
          }
        }
      });

      const uniqueUsers = userUsageMap.size;
      let totalUsage = 0;
      let repeatUsers = 0;

      userUsageMap.forEach((sessionsMap) => {
        let userTotalUses = 0;
        let activeSessionsForUser = 0;
        sessionsMap.forEach((s) => {
          // 1 session with N completed actions still counts as 1 feature visit unless reopened multiple times
          const usesInSession = s.opens > 0 ? s.opens : s.actions > 0 ? 1 : 0;
          if (usesInSession > 0) {
            userTotalUses += usesInSession;
            activeSessionsForUser += 1;
          }
        });
        totalUsage += userTotalUses;
        if (userTotalUses >= 2 || activeSessionsForUser >= 2) {
          repeatUsers += 1;
        }
      });

      const repeatRatePct = uniqueUsers > 0 ? Math.round((repeatUsers / uniqueUsers) * 100) : 0;
      const avgTimeSeconds =
        totalDurationSeconds > 0
          ? Math.round(totalDurationSeconds / Math.max(1, durationSessions.size || uniqueUsers))
          : 0;
      const adoptionRatePct =
        uniqueVisitors > 0 ? Math.round((uniqueUsers / uniqueVisitors) * 100) : 0;

      const topAction = Array.from(actionCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

      return {
        feature: featureName,
        uniqueUsers,
        totalUsage,
        avgTimeSeconds,
        repeatUsers,
        repeatRatePct,
        completedActions: completedActionsCount,
        topAction,
        adoptionRatePct,
      };
    });

    const hasAnyFeatureUsage = featureStats.some((f) => f.totalUsage > 0 || f.uniqueUsers > 0);
    const sortedByUsage = [...featureStats].sort(
      (a, b) =>
        b.totalUsage - a.totalUsage ||
        b.uniqueUsers - a.uniqueUsers ||
        b.completedActions - a.completedActions
    );
    const mostUsedFeature = hasAnyFeatureUsage ? sortedByUsage[0] : null;
    const leastUsedFeature = hasAnyFeatureUsage
      ? sortedByUsage[sortedByUsage.length - 1]
      : null;
    const overallFeatureAdoptionPct =
      uniqueVisitors > 0 ? Math.round((featureUsersOverall.size / uniqueVisitors) * 100) : 0;

    // Location aggregation
    const locationMap = new Map<string, { city: string; region: string; country: string; count: number }>();
    primaryVisits.forEach((r) => {
      const key = `${r.city}, ${r.region}, ${r.country}`;
      const existing = locationMap.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        locationMap.set(key, { city: r.city, region: r.region, country: r.country, count: 1 });
      }
    });
    const topLocations = Array.from(locationMap.values()).sort((a, b) => b.count - a.count);

    // Time of Day Slots
    const slotOrder = [
      'Morning (6 AM - 12 PM)',
      'Afternoon (12 PM - 5 PM)',
      'Evening (5 PM - 9 PM)',
      'Night (9 PM - 6 AM)',
    ];
    const slotCounts = slotOrder.map((slot) => {
      const count = primaryVisits.filter((r) => r.timeOfDaySlot === slot).length;
      const pct = totalEvents > 0 ? Math.round((count / totalEvents) * 100) : 0;
      return { slot, count, pct };
    });

    // Day of Week distribution
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayCounts = dayOrder.map((day) => {
      const count = primaryVisits.filter((r) => r.dayOfWeek === day).length;
      const pct = totalEvents > 0 ? Math.round((count / totalEvents) * 100) : 0;
      return { day, count, pct };
    });

    // Child Persona breakdown (includes real logins + explicit persona switches, excludes URL Visit landing loads)
    const personaRecords = activeSet.filter((r) => isLoginEvt(r) || isPersonaSwitchEvt(r));
    const child1Count = personaRecords.filter((r) => r.childProfile.toLowerCase().includes('child 1')).length;
    const child2Count = personaRecords.filter((r) => r.childProfile.toLowerCase().includes('child 2')).length;
    const generalCount = personaRecords.filter((r) => r.childProfile.toLowerCase().includes('general')).length;
    const customChildCount = Math.max(0, personaRecords.length - child1Count - child2Count - generalCount);

    // Entry point breakdown
    const entryMap = new Map<string, number>();
    primaryVisits.forEach((r) => {
      entryMap.set(r.entryPoint, (entryMap.get(r.entryPoint) || 0) + 1);
    });
    const topEntryPoints = Array.from(entryMap.entries())
      .map(([entry, count]) => ({
        entry,
        count,
        pct: totalEvents > 0 ? Math.round((count / totalEvents) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Device breakdown
    const mobileCount = primaryVisits.filter((r) => r.deviceType === 'Mobile').length;
    const desktopCount = primaryVisits.filter((r) => r.deviceType === 'Desktop').length;
    const tabletCount = primaryVisits.filter((r) => r.deviceType === 'Tablet').length;

    return {
      totalEvents,
      guestClicks,
      uniqueGuestClicks,
      vercelTotalClicks,
      vercelUniqueClicks,
      personalLogins,
      uniqueVisitors,
      returningVisitors,
      todayLogins,
      trafficSources,
      avgSessionDurationSeconds,
      measuredSessionsCount,
      featureStats,
      mostUsedFeature,
      leastUsedFeature,
      overallFeatureAdoptionPct,
      featureActiveUsersCount: featureUsersOverall.size,
      topLocations,
      slotCounts,
      dayCounts,
      child1Count,
      child2Count,
      generalCount,
      customChildCount,
      topEntryPoints,
      mobileCount,
      desktopCount,
      tabletCount,
    };
  }, [dateFilteredRecords]);

  // ============================================================================
  // GATE: RENDER DEDICATED ADMIN SIGN-IN / FIRST-RUN SETUP FOR NON-ADMIN USERS
  // ============================================================================
  if (!isAuthenticatedAdmin) {
    const isFirstTimeSetup = serverStatus ? !serverStatus.isConfigured : false;

    return (
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 min-h-[calc(100vh-5rem)]">
        <div className="w-full max-w-lg rounded-3xl border border-cyan-400/30 bg-gradient-to-b from-[#0b1326] to-[#070c18] p-6 sm:p-9 shadow-[0_25px_70px_rgba(0,0,0,0.75)] space-y-6">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-200 text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Private Admin Analytics Portal</span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/?tab=home')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isFirstTimeSetup ? 'Create Admin Account & Sign In' : 'Admin Analytics Sign In'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isFirstTimeSetup
                ? 'Set your private Admin Username and Password below to lock and access your Google Analytics–style visitor dashboard (Guest Account clicks, login dates, times, and geographical locations).'
                : 'Sign in with your private Admin Username and Password to view Guest Account click statistics, visitor login times, days of the week, and geographical locations.'}
            </p>
          </div>

          <form onSubmit={handleAdminSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Admin Username or Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Admin username or email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm font-semibold focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Admin Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setShowForgotAdminPanel(!showForgotAdminPanel);
                    setAdminResetError(null);
                    setAdminResetSuccess(null);
                  }}
                  className="text-xs font-bold text-cyan-300 hover:text-cyan-200 underline underline-offset-2 cursor-pointer"
                >
                  {showForgotAdminPanel ? 'Hide recovery' : 'Forgot password?'}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password (min 6 characters)"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm font-semibold focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                {isFirstTimeSetup
                  ? 'Choose a memorable password (6+ characters). This creates your private admin account in Firebase Auth & server memory.'
                  : 'Protected by server-side cryptographic verification and Firestore admin security rules.'}
              </p>
            </div>

            {authError && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {authLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <span>
                {isFirstTimeSetup ? 'Set Up Admin Account & Open Analytics' : 'Sign In to Admin Analytics'}
              </span>
            </button>
          </form>

          {/* Direct Google Recovery / Owner Sign-In */}
          <div className="space-y-2.5 pt-1">
            <div className="relative flex items-center justify-center">
              <span className="border-t border-white/10 w-full" />
              <span className="bg-[#080e1d] px-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">
                Or Owner Verification
              </span>
              <span className="border-t border-white/10 w-full" />
            </div>

            <button
              type="button"
              onClick={handleGoogleAdminSignIn}
              disabled={googleLoading}
              className="w-full py-3 px-4 rounded-xl bg-white/8 hover:bg-white/15 border border-white/20 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              )}
              <span>Continue with Google (Admin Email)</span>
            </button>
          </div>

          {/* Inline Forgot Password Panel */}
          {showForgotAdminPanel && (
            <div className="rounded-2xl border border-cyan-400/25 bg-cyan-950/20 p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-sm font-black text-cyan-200">Forgot Admin Password?</h2>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                    Enter your authorized Admin Email ID to receive a Firebase password reset link, or click <strong className="text-white">Continue with Google</strong> above to sign in immediately and set a new password.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSendAdminResetEmail} className="space-y-2.5">
                <div className="relative">
                  <Mail className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={adminResetEmail}
                    onChange={(e) => setAdminResetEmail(e.target.value)}
                    placeholder="Enter authorized Admin Email ID"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/30 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {adminResetError && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{adminResetError}</span>
                  </div>
                )}

                {adminResetSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{adminResetSuccess}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={adminResetLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/25 hover:bg-cyan-500/35 border border-cyan-400/40 text-cyan-100 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {adminResetLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Send Reset Link to Admin Email</span>
                </button>
              </form>
            </div>
          )}

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Visibility: Strictly Private (Admin Only)</span>
            <span>Collection: /site_analytics</span>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // AUTHENTICATED ADMIN ANALYTICS DASHBOARD (GOOGLE ANALYTICS STYLE)
  // ============================================================================
  const topLocationLabel =
    stats.topLocations.length > 0
      ? `${stats.topLocations[0].city}, ${stats.topLocations[0].region}`
      : 'Bengaluru, Karnataka';

  const topPersonaLabel =
    stats.child1Count >= stats.child2Count && stats.child1Count >= stats.generalCount
      ? 'Parent · Child 1 (2Y 6M)'
      : stats.child2Count >= stats.generalCount
      ? 'Parent · Child 2 (3M)'
      : 'General (All Ages)';

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Header Banner */}
      <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-r from-[#0b152b] via-[#0f1d3a] to-[#0b1326] p-5 sm:p-7 shadow-2xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
              <span>Private Admin Analytics</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Firestore Stream Active</span>
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              Signed in as: <strong className="text-white">{adminUsername}</strong> ({user?.email})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Tricky Toddlers · Visitor &amp; Guest Account Analytics
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-300" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSound('click');
              setUpdatePassError(null);
              setUpdatePassSuccess(null);
              setShowPasswordModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/35 text-amber-200 text-xs font-bold transition-all cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-300" />
            <span>Update Password</span>
          </button>

          <button
            type="button"
            onClick={handleAdminSignOut}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400/30 text-rose-300 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Admin Sign Out</span>
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-cyan-400/35 bg-[#0b1326] p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center">
                  <KeyRound className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white">Update Admin Password</h2>
                  <p className="text-[11px] text-slate-400">{user?.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                aria-label="Close update password dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateAdminPassword} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewAdminPass ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newAdminPass}
                    onChange={(e) => setNewAdminPass(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewAdminPass(!showNewAdminPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    aria-label="Toggle new password visibility"
                  >
                    {showNewAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewAdminPass ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmAdminPass}
                    onChange={(e) => setConfirmAdminPass(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {updatePassError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{updatePassError}</span>
                </div>
              )}

              {updatePassSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{updatePassSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={updatePassLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {updatePassLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                <span>Save New Password</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {firestoreError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{firestoreError}</span>
        </div>
      )}

      {/* Global Date Filter Bar (updates all KPI cards, charts, locations, personas, and log table) */}
      <div className="rounded-2xl border border-indigo-400/30 bg-[#0b1324]/95 p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-200">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>Analytics Date Filter</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-400/30 text-indigo-200 font-bold">
              {stats.totalEvents} events · {dateRangeLabel}
            </span>
            {datePreset !== 'ALL' && (
              <button
                type="button"
                onClick={() => applyDatePreset('ALL')}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 font-bold cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'ALL', label: 'All Dates' },
                { id: 'TODAY', label: 'Today' },
                { id: 'LAST_7', label: 'Last 7 Days' },
                { id: 'LAST_30', label: 'Last 30 Days' },
              ] as const
            ).map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyDatePreset(preset.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  datePreset === preset.id
                    ? 'bg-indigo-500/30 border-indigo-400 text-white shadow-sm'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* From & To Date Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 lg:w-[460px]">
            <label className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-slate-300">
              <span className="font-bold whitespace-nowrap">From Date:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  const val = e.target.value;
                  setStartDate(val);
                  if (val || endDate) {
                    setDatePreset('CUSTOM');
                  } else {
                    setDatePreset('ALL');
                  }
                }}
                className="bg-transparent text-white font-semibold focus:outline-none [color-scheme:dark] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-slate-300">
              <span className="font-bold whitespace-nowrap">To Date:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  const val = e.target.value;
                  setEndDate(val);
                  if (val || startDate) {
                    setDatePreset('CUSTOM');
                  } else {
                    setDatePreset('ALL');
                  }
                }}
                className="bg-transparent text-white font-semibold focus:outline-none [color-scheme:dark] cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Google Analytics Style KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Guest Account Clicks (Total & Unique) */}
        <div className="rounded-2xl border border-emerald-400/35 bg-[#0b1426]/90 p-4 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
            <span>Guest Account Clicks</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/20 px-2.5 py-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Total</div>
              <div className="text-xl sm:text-2xl font-black text-white">{stats.guestClicks}</div>
            </div>
            <div className="rounded-xl bg-cyan-500/10 border border-cyan-400/20 px-2.5 py-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">Unique</div>
              <div className="text-xl sm:text-2xl font-black text-white">{stats.uniqueGuestClicks}</div>
            </div>
          </div>
          <div className="text-[11px] text-slate-400">
            Out of <strong className="text-slate-200">{stats.totalEvents}</strong> total visits
          </div>
        </div>

        {/* 2. Vercel URL Clicks (https://tinyurl.com/trickytods) Total & Unique */}
        <div className="rounded-2xl border border-sky-400/35 bg-[#0b1426]/90 p-4 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-sky-300">
            <span>Vercel URL Clicks</span>
            <Link2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <div className="rounded-xl bg-sky-500/10 border border-sky-400/20 px-2.5 py-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-sky-300">Total</div>
              <div className="text-xl sm:text-2xl font-black text-white">{stats.vercelTotalClicks}</div>
            </div>
            <div className="rounded-xl bg-indigo-500/10 border border-indigo-400/20 px-2.5 py-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Unique</div>
              <div className="text-xl sm:text-2xl font-black text-white">{stats.vercelUniqueClicks}</div>
            </div>
          </div>
          <a
            href="https://tinyurl.com/trickytods"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-sky-300 hover:text-sky-200 underline underline-offset-2 truncate max-w-full"
          >
            <span className="truncate">https://tinyurl.com/trickytods</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        </div>

        {/* 3. Engagement · Average Session Duration */}
        <div className="rounded-2xl border border-teal-400/35 bg-[#0b1426]/90 p-4 shadow-lg space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-teal-300">
            <span>Avg. Session Duration</span>
            <Timer className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {formatDurationLabel(stats.avgSessionDurationSeconds)}
          </div>
          <div className="text-[11px] text-slate-400">
            Engagement across <strong className="text-teal-200">{stats.measuredSessionsCount}</strong> tracked sessions
          </div>
        </div>

        {/* 4. Unique Visitors / Personas */}
        <div className="rounded-2xl border border-cyan-400/30 bg-[#0b1426]/90 p-4 shadow-lg space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
            <span>Unique Visitors</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats.uniqueVisitors}</div>
          <div className="text-[11px] text-slate-400">
            <strong className="text-cyan-200">{stats.returningVisitors}</strong> returning · <strong className="text-indigo-200">{stats.personalLogins}</strong> personal
          </div>
        </div>

        {/* 5. Feature Adoption · Most-Used Feature */}
        <div className="rounded-2xl border border-emerald-400/30 bg-[#0b1426]/90 p-4 shadow-lg space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
            <span>Most-Used Feature</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base sm:text-lg font-black text-white truncate" title={stats.mostUsedFeature?.feature || 'No usage yet'}>
            {stats.mostUsedFeature ? stats.mostUsedFeature.feature : '—'}
          </div>
          <div className="text-[11px] text-slate-400">
            {stats.mostUsedFeature ? (
              <>
                <strong className="text-emerald-200">{stats.mostUsedFeature.totalUsage}</strong> uses · <strong className="text-white">{stats.mostUsedFeature.uniqueUsers}</strong> users
              </>
            ) : (
              'Most apparent value once features are used'
            )}
          </div>
        </div>

        {/* 6. Feature Adoption · Least-Used Feature */}
        <div className="rounded-2xl border border-amber-400/30 bg-[#0b1426]/90 p-4 shadow-lg space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-amber-300">
            <span>Least-Used Feature</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-base sm:text-lg font-black text-white truncate" title={stats.leastUsedFeature?.feature || '—'}>
            {stats.leastUsedFeature ? stats.leastUsedFeature.feature : '—'}
          </div>
          <div className="text-[11px] text-slate-400">
            {stats.leastUsedFeature ? (
              <>
                <strong className="text-amber-200">{stats.leastUsedFeature.totalUsage}</strong> uses · Needs promotion
              </>
            ) : (
              'Features requiring improvement or promotion'
            )}
          </div>
        </div>

        {/* 7. Feature Adoption Rate */}
        <div className="rounded-2xl border border-violet-400/35 bg-[#0b1426]/90 p-4 shadow-lg space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-violet-300">
            <span>Feature Adoption Rate</span>
            <Layers className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats.overallFeatureAdoptionPct}%
          </div>
          <div className="text-[11px] text-slate-400">
            <strong className="text-violet-200">{stats.featureActiveUsersCount}</strong> of {stats.uniqueVisitors} active users used tools
          </div>
        </div>

        {/* 8. Top Location & Active Child Persona */}
        <div className="rounded-2xl border border-pink-400/30 bg-[#0b1426]/90 p-4 shadow-lg space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-pink-300">
            <span>Top Location &amp; Persona</span>
            <MapPin className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-sm sm:text-base font-black text-white truncate" title={topLocationLabel}>
            {topLocationLabel}
          </div>
          <div className="text-[11px] text-slate-400 truncate" title={topPersonaLabel}>
            Top: <strong className="text-purple-200">{topPersonaLabel}</strong>
          </div>
        </div>
      </div>

      {/* Feature Adoption & Engagement Table (All 8 Core Features) */}
      <div className="rounded-3xl border border-violet-400/25 bg-[#0b1324]/95 p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-400/30 flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-violet-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Feature Adoption &amp; Usage Breakdown
              </h2>
            </div>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 rounded-xl bg-violet-500/15 border border-violet-400/30 text-xs font-bold text-violet-200 whitespace-nowrap">
            {dateRangeLabel}
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.06] border-b border-white/10 text-[11px] font-black uppercase tracking-wider text-slate-300">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4">Unique users</th>
                <th className="py-3 px-4">Total usage</th>
                <th className="py-3 px-4">Avg. time spent</th>
                <th className="py-3 px-4">Repeat usage</th>
                <th className="py-3 px-4">Completed actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
              {stats.featureStats.map((row) => (
                <tr key={row.feature} className="hover:bg-white/[0.04] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{row.feature}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-400"
                          style={{ width: `${Math.max(row.adoptionRatePct > 0 ? 8 : 0, row.adoptionRatePct)}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-400 font-semibold">
                        {row.adoptionRatePct}% adoption
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-cyan-200">
                    {row.uniqueUsers > 0 ? row.uniqueUsers : '—'}
                  </td>
                  <td className="py-3 px-4 font-bold text-white">
                    {row.totalUsage > 0 ? row.totalUsage : '—'}
                  </td>
                  <td className="py-3 px-4 font-semibold text-teal-200">
                    {formatDurationLabel(row.avgTimeSeconds)}
                  </td>
                  <td className="py-3 px-4 font-semibold text-indigo-200">
                    {row.uniqueUsers > 0 ? `${row.repeatRatePct}% (${row.repeatUsers})` : '—'}
                  </td>
                  <td className="py-3 px-4">
                    {row.completedActions > 0 ? (
                      <div>
                        <span className="font-black text-emerald-300">{row.completedActions}</span>
                        {row.topAction && (
                          <span className="ml-1.5 text-[11px] text-slate-400">
                            ({row.topAction})
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Acquisition · Traffic Sources */}
      <div className="rounded-3xl border border-sky-400/25 bg-[#0b1324]/90 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center">
              <Compass className="w-4 h-4 text-sky-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Acquisition · Traffic Sources
              </h2>
              <p className="text-xs text-slate-400">
                Google, WhatsApp, LinkedIn, QR code, TinyURL, Direct link &amp; referral sources
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-sky-300">
            {stats.trafficSources.length} sources · {dateRangeLabel}
          </span>
        </div>

        {stats.trafficSources.length === 0 ? (
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-400 text-center">
            No acquisition visits tracked for this date range yet. Share links with UTM tags (e.g. ?utm_source=whatsapp, ?utm_source=linkedin, ?qr=1) or direct links to see source breakdowns.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.trafficSources.map((src) => (
              <div
                key={src.source}
                className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-black text-white truncate">{src.source}</span>
                  <span className="px-2 py-0.5 rounded-lg bg-sky-500/20 border border-sky-400/30 text-sky-200 font-black whitespace-nowrap">
                    {src.visits} visits ({src.pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-400"
                    style={{ width: `${Math.max(src.visits > 0 ? 6 : 0, src.pct)}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400">
                  <strong className="text-slate-200">{src.uniqueUsers}</strong> unique visitors
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Visual Breakdown Grid: Time of Day, Day of Week, Geographical Locations, Persona & Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Panel 1: Login Time of Day & Day of Week Breakdown */}
        <div className="rounded-3xl border border-white/15 bg-[#0b1324]/90 p-5 sm:p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white">
                  Logins by Time of Day &amp; Day of Week
                </h2>
                <p className="text-xs text-slate-400">
                  When parents &amp; guest visitors explore Tricky Toddlers
                </p>
              </div>
            </div>
          </div>

          {/* Time of Day Bars */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Time-of-Day Slots
            </div>
            {stats.slotCounts.map((item) => (
              <div key={item.slot} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{item.slot}</span>
                  <span className="font-black text-amber-300">
                    {item.count} visits ({item.pct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                    style={{ width: `${Math.max(item.count > 0 ? 6 : 0, item.pct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Day of Week Pills */}
          <div className="pt-3 border-t border-white/10 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Day-of-Week Activity</span>
              </div>
              <span className="text-[11px] font-bold text-indigo-300">
                {stats.totalEvents} visits · {dateRangeLabel}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {stats.dayCounts.map((d) => (
                <div
                  key={d.day}
                  className={`p-2 rounded-xl border text-center ${
                    d.count > 0
                      ? 'bg-indigo-500/20 border-indigo-400/40 text-white'
                      : 'bg-white/[0.03] border-white/10 text-slate-500'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase">{d.day.slice(0, 3)}</div>
                  <div className="text-sm sm:text-base font-black mt-0.5">{d.count}</div>
                  <div className="text-[9px] opacity-75">{d.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 2: Geographical Locations & Persona Breakdown */}
        <div className="rounded-3xl border border-white/15 bg-[#0b1324]/90 p-5 sm:p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center">
                <Globe className="w-4 h-4 text-cyan-300" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white">
                  Geographical Locations &amp; Guest Personas
                </h2>
                <p className="text-xs text-slate-400">
                  Cities, States/Regions, Countries &amp; Child Profiles explored
                </p>
              </div>
            </div>
          </div>

          {/* Top Cities & States List */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Top Visitor Locations (City · State · Country)
            </div>
            {stats.topLocations.length === 0 ? (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-400 text-center">
                No location logs recorded yet. Real-time visitor locations will appear here automatically.
              </div>
            ) : (
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {stats.topLocations.slice(0, 6).map((loc, idx) => {
                  const pct =
                    stats.totalEvents > 0 ? Math.round((loc.count / stats.totalEvents) * 100) : 0;
                  return (
                    <div
                      key={`${loc.city}-${loc.region}-${idx}`}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="font-bold text-white truncate">
                          {loc.city}
                        </span>
                        <span className="text-slate-400 truncate">
                          · {loc.region}, {loc.country}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2 py-0.5 rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 font-black">
                          {loc.count} ({pct}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Guest Account Persona & Device Split */}
          <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-400/25 space-y-2">
              <div className="text-[11px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <Baby className="w-3.5 h-3.5" />
                <span>Guest Persona Usage (Parent)</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-300">Child 1 (2Y 6M · Toddler):</span>
                  <strong className="text-white">{stats.child1Count} sessions</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Child 2 (3M · Infant):</span>
                  <strong className="text-white">{stats.child2Count} sessions</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">General (All Ages):</span>
                  <strong className="text-white">{stats.generalCount} sessions</strong>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-400/25 space-y-2">
              <div className="text-[11px] font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5" />
                <span>Device &amp; Entry Breakdown</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-300">Desktop / Laptop:</span>
                  <strong className="text-white">{stats.desktopCount} visits</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Mobile Phone:</span>
                  <strong className="text-white">{stats.mobileCount} visits</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Tablet / iPad:</span>
                  <strong className="text-white">{stats.tabletCount} visits</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Real-Time Visitor Log Table */}
      <div className="rounded-3xl border border-white/15 bg-[#0b1324]/95 p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span>Detailed Login &amp; Guest Click Activity Log ({filteredRecords.length})</span>
            </h2>
            <p className="text-xs text-slate-400">
              Every Guest Account click and Personal Account sign-in with exact date, day, login time, location, and active child persona
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, day, persona..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-[#0f172a] border border-white/15 text-xs font-bold text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">All Activity Types</option>
              <option value="Guest Account">Guest Account Only</option>
              <option value="Personal Account">Personal Account Only</option>
              <option value="URL Visit">Vercel / App URL Visits Only</option>
              <option value="Feature Activity">Feature Usage &amp; Actions Only</option>
            </select>

            <select
              value={personaFilter}
              onChange={(e) => setPersonaFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-[#0f172a] border border-white/15 text-xs font-bold text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">All Child Personas</option>
              <option value="Child 1">Child 1 (2Y 6M)</option>
              <option value="Child 2">Child 2 (3M)</option>
              <option value="General">General (All Ages)</option>
            </select>
          </div>
        </div>

        {loadingRecords ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-7 h-7 animate-spin text-cyan-400" />
            <span className="text-xs font-bold">Loading real-time visitor analytics from Firestore...</span>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="py-12 px-4 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] text-center space-y-3">
            <BarChart3 className="w-8 h-8 text-cyan-400 mx-auto" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-white">No analytics events match your current filter</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No visitor events match your selected filters yet. Real-time visits from Guest Access, Personal Accounts, and the Vercel URL will appear here automatically.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.06] border-b border-white/10 text-[11px] font-black uppercase tracking-wider text-slate-300">
                  <th className="py-3 px-3.5">Date &amp; Day</th>
                  <th className="py-3 px-3.5">Login Time &amp; Slot</th>
                  <th className="py-3 px-3.5">Location (City, State, Country)</th>
                  <th className="py-3 px-3.5">Account &amp; Visitor</th>
                  <th className="py-3 px-3.5">Traffic Source</th>
                  <th className="py-3 px-3.5">Persona &amp; Feature</th>
                  <th className="py-3 px-3.5">Device &amp; Browser</th>
                  <th className="py-3 px-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs">
                {filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.04] transition-colors">
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="font-bold text-white">{r.loginDate}</div>
                      <div className="text-[11px] text-indigo-300 font-semibold">{r.dayOfWeek}</div>
                    </td>

                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="font-bold text-amber-300">{r.loginTime}</div>
                      <div className="text-[11px] text-slate-400">{r.timeOfDaySlot}</div>
                    </td>

                    <td className="py-3 px-3.5">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{r.city}, {r.region}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {r.country} · <span className="font-mono text-[10px]">{r.timezone}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          r.eventType === 'feature_action'
                            ? 'bg-violet-500/20 text-violet-300 border border-violet-400/40'
                            : r.eventType === 'feature_use'
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-400/40'
                            : r.accountType === 'Guest Account'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                            : r.accountType === 'URL Visit'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/40'
                        }`}
                      >
                        {r.eventType === 'feature_action'
                          ? 'Completed Action'
                          : r.eventType === 'feature_use'
                          ? 'Feature Visit'
                          : r.accountType}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {r.isReturningVisitor ? (
                          <span className="text-cyan-300 font-bold">↻ Returning Visitor</span>
                        ) : (
                          <span className="text-amber-300 font-bold">★ New Visitor</span>
                        )}{' '}
                        <span className="font-mono opacity-60">({r.visitorId.slice(0, 10)})</span>
                      </div>
                    </td>

                    <td className="py-3 px-3.5">
                      <div className="font-bold text-sky-300">{resolveTrafficSource(r)}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[180px]" title={r.entryPoint}>
                        {r.entryPoint}
                      </div>
                    </td>

                    <td className="py-3 px-3.5">
                      <div className="font-bold text-white">
                        {r.featureName ? (
                          <span className="text-violet-300">{r.featureName}</span>
                        ) : (
                          r.personaName
                        )}
                      </div>
                      <div className="text-[11px] text-emerald-300 font-semibold">
                        {r.completedAction ? r.completedAction : r.childProfile}
                      </div>
                    </td>

                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                        {r.deviceType === 'Mobile' ? (
                          <Smartphone className="w-3.5 h-3.5 text-pink-400" />
                        ) : (
                          <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                        )}
                        <span>{r.deviceType} · {r.browser}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{r.os}</div>
                    </td>

                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleDeleteRecord(r.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                        title="Delete log entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
