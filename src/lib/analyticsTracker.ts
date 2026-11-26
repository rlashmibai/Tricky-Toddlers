import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError } from './firebase';

export const TRACKED_FEATURES = [
  'AI Assistant',
  'Milestone Tracker',
  'Routine Checker',
  'Vaccine Tracker',
  'AI NutriChef',
  'AI Recipe Maker',
  'Toddler TV',
  'Pediatric Care',
  'Toddler Tales',
  'Toddler Academy',
  'Baby Store',
  'Community Help',
  'Parent Connect',
  'FoodLens AI',
  'NutriBand',
] as const;

export type TrackedFeatureName = (typeof TRACKED_FEATURES)[number];

export type AnalyticsEventType =
  | 'login'
  | 'url_visit'
  | 'feature_use'
  | 'feature_action'
  | 'session_ping'
  | 'persona_switch';

export interface SiteAnalyticsEventInput {
  accountType: 'Guest Account' | 'Personal Account' | 'URL Visit' | 'Feature Usage' | 'Session Engagement';
  entryPoint: string;
  personaName?: string;
  childProfile?: string;
  activeTab?: string;
  eventType?: AnalyticsEventType;
  trafficSource?: string;
  featureName?: TrackedFeatureName | string;
  durationSeconds?: number;
  completedAction?: string;
}

export interface SiteAnalyticsRecord {
  id: string;
  userId: string;
  visitorId: string;
  isReturningVisitor: boolean;
  accountType: string;
  entryPoint: string;
  personaName: string;
  childProfile: string;
  activeTab: string;
  loginDate: string;
  dayOfWeek: string;
  loginTime: string;
  timeOfDaySlot: string;
  city: string;
  region: string;
  country: string;
  timezone: string;
  deviceType: string;
  browser: string;
  os: string;
  eventType?: AnalyticsEventType | string;
  trafficSource?: string;
  featureName?: string;
  durationSeconds?: number;
  completedAction?: string;
  createdAtIso: string;
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getTimeOfDaySlot(hour: number): string {
  if (hour >= 6 && hour < 12) return 'Morning (6 AM - 12 PM)';
  if (hour >= 12 && hour < 17) return 'Afternoon (12 PM - 5 PM)';
  if (hour >= 17 && hour < 21) return 'Evening (5 PM - 9 PM)';
  return 'Night (9 PM - 6 AM)';
}

export function getAnalyticsSessionId(): string {
  if (typeof window === 'undefined') return 'sess_server';
  const existing = sessionStorage.getItem('tt_analytics_session_id');
  if (existing && /^[a-zA-Z0-9_-]+$/.test(existing)) {
    return existing.slice(0, 64);
  }
  const newSess = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  sessionStorage.setItem('tt_analytics_session_id', newSess);
  return newSess;
}

export function detectTrafficSource(): string {
  if (typeof window === 'undefined') return 'Direct Link';

  const cached = sessionStorage.getItem('tt_traffic_source');
  const params = new URLSearchParams(window.location.search || '');
  const utmSource = (
    params.get('utm_source') ||
    params.get('source') ||
    params.get('src') ||
    params.get('ref') ||
    params.get('via') ||
    ''
  )
    .trim()
    .toLowerCase();
  const medium = (params.get('utm_medium') || '').trim().toLowerCase();
  const hasQrFlag = params.has('qr') || params.has('qrcode') || medium === 'qr' || utmSource === 'qr' || utmSource === 'qrcode';
  const ref = (document.referrer || '').toLowerCase();
  const host = (window.location.hostname || '').toLowerCase();

  let detected = '';

  if (hasQrFlag) {
    detected = 'QR Code';
  } else if (utmSource.includes('whatsapp') || utmSource === 'wa' || ref.includes('whatsapp.com') || ref.includes('wa.me')) {
    detected = 'WhatsApp';
  } else if (utmSource.includes('linkedin') || ref.includes('linkedin.com') || ref.includes('lnkd.in')) {
    detected = 'LinkedIn';
  } else if (utmSource.includes('google') || params.has('gclid') || ref.includes('google.')) {
    detected = 'Google';
  } else if (utmSource.includes('instagram') || utmSource === 'ig' || ref.includes('instagram.com')) {
    detected = 'Instagram';
  } else if (utmSource.includes('facebook') || utmSource === 'fb' || ref.includes('facebook.com')) {
    detected = 'Facebook';
  } else if (utmSource.includes('youtube') || ref.includes('youtube.com') || ref.includes('youtu.be')) {
    detected = 'YouTube';
  } else if (utmSource.includes('twitter') || utmSource === 'x' || ref.includes('t.co') || ref.includes('x.com') || ref.includes('twitter.com')) {
    detected = 'X / Twitter';
  } else if (utmSource.includes('tinyurl') || ref.includes('tinyurl.com')) {
    detected = 'TinyURL';
  } else if (utmSource) {
    detected = utmSource.replace(/\b\w/g, (c) => c.toUpperCase()).slice(0, 60);
  } else if (ref) {
    try {
      const refHost = new URL(ref).hostname.replace(/^www\./, '').toLowerCase();
      if (refHost && refHost !== host && !refHost.includes('firebaseapp.com') && !refHost.includes('accounts.google.com')) {
        detected = `Referral (${refHost.slice(0, 45)})`;
      }
    } catch {
      // Ignore malformed referrer
    }
  }

  if (detected) {
    sessionStorage.setItem('tt_traffic_source', detected);
    return detected;
  }

  if (cached) return cached;

  sessionStorage.setItem('tt_traffic_source', 'Direct Link');
  return 'Direct Link';
}

export function mapTabToFeatureName(tab: string | null | undefined, sub?: string | null): TrackedFeatureName | null {
  const cleanTab = (tab || '').toLowerCase().trim();
  const cleanSub = (sub || '').toLowerCase().trim();

  if (cleanTab === 'ai') return 'AI Assistant';
  if (cleanTab === 'milestones') return 'Milestone Tracker';
  if (cleanTab === 'routine') return 'Routine Checker';
  if (cleanTab === 'vaccine') return 'Vaccine Tracker';
  if (cleanTab === 'food') {
    if (cleanSub.includes('recipe') || cleanSub.includes('maker')) {
      return 'AI Recipe Maker';
    }
    return 'AI NutriChef';
  }
  if (cleanTab === 'videos') return 'Toddler TV';
  if (cleanTab === 'pediatric') return 'Pediatric Care';
  if (cleanTab === 'tales') return 'Toddler Tales';
  if (cleanTab === 'learning') return 'Toddler Academy';
  if (cleanTab === 'store') return 'Baby Store';
  if (cleanTab === 'community') return 'Community Help';
  if (cleanTab === 'chat') return 'Parent Connect';
  if (cleanTab === 'foodlens' || cleanTab === 'sample-foods') return 'FoodLens AI';
  if (cleanTab === 'nutriband' || cleanTab === 'nutriband-cart') return 'NutriBand';
  return null;
}

function getOrGenerateVisitorIdentity(): { visitorId: string; isReturningVisitor: boolean } {
  if (typeof window === 'undefined') {
    return { visitorId: 'v_server_session', isReturningVisitor: false };
  }
  const existingId = localStorage.getItem('tt_visitor_id');
  const seenCount = parseInt(localStorage.getItem('tt_visitor_sessions') || '0', 10);
  const alreadyCountedThisTab = sessionStorage.getItem('tt_visitor_session_counted') === '1';

  if (existingId && /^[a-zA-Z0-9_-]+$/.test(existingId)) {
    if (!alreadyCountedThisTab) {
      localStorage.setItem('tt_visitor_sessions', String(seenCount + 1));
      sessionStorage.setItem('tt_visitor_session_counted', '1');
      return {
        visitorId: existingId.slice(0, 64),
        isReturningVisitor: seenCount >= 1,
      };
    }
    return {
      visitorId: existingId.slice(0, 64),
      isReturningVisitor: seenCount > 1,
    };
  }
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  const newId = `vis_${Date.now()}_${randomSuffix}`;
  localStorage.setItem('tt_visitor_id', newId);
  localStorage.setItem('tt_visitor_sessions', '1');
  sessionStorage.setItem('tt_visitor_session_counted', '1');
  return {
    visitorId: newId,
    isReturningVisitor: false,
  };
}

function detectClientDeviceAndBrowser(): { deviceType: string; browser: string; os: string } {
  if (typeof navigator === 'undefined') {
    return { deviceType: 'Desktop', browser: 'Browser', os: 'OS' };
  }
  const ua = navigator.userAgent || '';
  let deviceType = 'Desktop';
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /Macintosh/i.test(ua))) {
    deviceType = 'Tablet';
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Opera Mini/i.test(ua)) {
    deviceType = 'Mobile';
  }

  let browser = 'Chrome';
  if (/Edg\//i.test(ua)) browser = 'Microsoft Edge';
  else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) browser = 'Opera';
  else if (/Firefox\//i.test(ua)) browser = 'Mozilla Firefox';
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = 'Apple Safari';
  else if (/Chrome\//i.test(ua)) browser = 'Google Chrome';

  let os = 'Desktop OS';
  if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Mac OS X|Macintosh/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  return { deviceType, browser, os };
}

function inferLocationFromTimezone(tz: string): { city: string; region: string; country: string } {
  const lower = (tz || '').toLowerCase();
  const savedCity = typeof window !== 'undefined' ? (localStorage.getItem('user_city') || '').trim() : '';
  const savedState = typeof window !== 'undefined' ? (localStorage.getItem('user_indian_state') || '').trim() : '';

  if (lower.includes('calcutta') || lower.includes('kolkata') || lower.includes('india')) {
    return {
      city: savedCity || 'Bengaluru (Bangalore)',
      region: savedState || 'Karnataka',
      country: 'India',
    };
  }
  if (lower.includes('new_york') || lower.includes('chicago') || lower.includes('los_angeles') || lower.includes('denver') || lower.includes('america/')) {
    const parts = tz.split('/');
    const cityPart = (parts[parts.length - 1] || 'New York').replace(/_/g, ' ');
    return {
      city: cityPart,
      region: parts[1]?.replace(/_/g, ' ') || 'United States',
      country: 'United States',
    };
  }
  if (lower.includes('london') || lower.includes('europe/')) {
    const parts = tz.split('/');
    const cityPart = (parts[parts.length - 1] || 'London').replace(/_/g, ' ');
    return {
      city: cityPart,
      region: 'Europe',
      country: cityPart === 'London' ? 'United Kingdom' : 'Europe',
    };
  }
  if (lower.includes('dubai') || lower.includes('asia/dubai')) {
    return { city: 'Dubai', region: 'Dubai', country: 'United Arab Emirates' };
  }
  if (lower.includes('singapore')) {
    return { city: 'Singapore', region: 'Singapore', country: 'Singapore' };
  }
  return {
    city: savedCity || 'Bengaluru (Bangalore)',
    region: savedState || 'Karnataka',
    country: 'India',
  };
}

let cachedServerContext: {
  city?: string;
  region?: string;
  country?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
} | null = null;

let lastTrackedSignature = '';
let lastTrackedTimestamp = 0;

function isAdminUserOrRoute(): boolean {
  if (typeof window === 'undefined') return false;
  const p = (window.location.pathname || '').toLowerCase();
  if (p.startsWith('/admin')) return true;
  const email = (auth?.currentUser?.email || '').toLowerCase();
  return email === 'rlashmi086@gmail.com' || email === 'admin@securepass.internal';
}

export async function trackSiteAnalyticsEvent(input: SiteAnalyticsEventInput): Promise<void> {
  if (typeof window === 'undefined' || !db) return;

  try {
    // Do not pollute public analytics with admin console activity (except explicit tests)
    if (isAdminUserOrRoute() && input.eventType !== 'login') {
      return;
    }

    // Deduplicate identical consecutive rapid triggers within 2 seconds
    const sig = `${input.eventType || 'login'}:${input.accountType}:${input.featureName || ''}:${input.completedAction || ''}:${input.entryPoint}:${input.activeTab || ''}`;
    const nowMs = Date.now();
    if (sig === lastTrackedSignature && nowMs - lastTrackedTimestamp < 2000 && !input.durationSeconds) {
      return;
    }
    lastTrackedSignature = sig;
    lastTrackedTimestamp = nowMs;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const loginDate = `${year}-${month}-${day}`;
    const dayOfWeek = DAYS_OF_WEEK[now.getDay()] || 'Monday';
    const loginTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
    const timeOfDaySlot = getTimeOfDaySlot(now.getHours());
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';

    const { visitorId, isReturningVisitor } = getOrGenerateVisitorIdentity();
    const clientDevice = detectClientDeviceAndBrowser();
    const tzFallback = inferLocationFromTimezone(timezone);
    const trafficSource = (input.trafficSource || detectTrafficSource()).trim().slice(0, 80) || 'Direct Link';

    let city = tzFallback.city;
    let region = tzFallback.region;
    let country = tzFallback.country;
    let deviceType = clientDevice.deviceType;
    let browser = clientDevice.browser;
    let os = clientDevice.os;

    if (!cachedServerContext) {
      try {
        const resp = await fetch('/api/analytics/context');
        if (resp.ok) {
          cachedServerContext = await resp.json();
        }
      } catch {
        // Fallback cleanly
      }
    }
    if (cachedServerContext) {
      if (cachedServerContext.city && cachedServerContext.city !== 'Unknown') city = String(cachedServerContext.city).slice(0, 100);
      if (cachedServerContext.region && cachedServerContext.region !== 'Unknown') region = String(cachedServerContext.region).slice(0, 100);
      if (cachedServerContext.country && cachedServerContext.country !== 'Unknown') country = String(cachedServerContext.country).slice(0, 100);
      if (cachedServerContext.deviceType) deviceType = String(cachedServerContext.deviceType).slice(0, 40);
      if (cachedServerContext.browser) browser = String(cachedServerContext.browser).slice(0, 60);
      if (cachedServerContext.os) os = String(cachedServerContext.os).slice(0, 60);
    }

    const activeIdx = localStorage.getItem('active_child_index') === '2' ? 2 : 1;
    const defaultChild =
      input.accountType === 'URL Visit'
        ? 'URL Visit'
        : input.accountType === 'Guest Account'
        ? (activeIdx === 2 ? 'Child 2 (3 Months)' : 'Child 1 (2 Years 6 Months)')
        : (localStorage.getItem('baby_name') || 'Child 1');

    const defaultPersona = input.accountType === 'URL Visit' ? 'Visitor' : (localStorage.getItem('parent_name') || 'Parent');
    const personaName = (input.personaName || defaultPersona).trim().slice(0, 80) || 'Visitor';
    const childProfile = (input.childProfile || defaultChild).trim().slice(0, 80) || 'URL Visit';
    const activeTab = (input.activeTab || (input.accountType === 'URL Visit' ? 'landing' : 'ai')).trim().slice(0, 60) || 'ai';

    // Wait briefly if Firebase Auth is still initializing background guest user
    let currentUser = auth?.currentUser;
    let attempts = 0;
    while (!currentUser && attempts < 10) {
      await new Promise((r) => setTimeout(r, 400));
      currentUser = auth?.currentUser;
      attempts += 1;
    }
    if (!currentUser) return;

    const inferredEventType: AnalyticsEventType =
      input.eventType || (input.accountType === 'URL Visit' ? 'url_visit' : 'login');

    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const docRef = doc(collection(db, 'site_analytics'), eventId);

    const payload: Record<string, any> = {
      userId: String(currentUser.uid).slice(0, 120),
      visitorId: String(visitorId).slice(0, 120),
      isReturningVisitor: Boolean(isReturningVisitor),
      accountType: String(input.accountType).slice(0, 50),
      entryPoint: String(input.entryPoint || 'Direct Access').slice(0, 100),
      personaName,
      childProfile,
      activeTab,
      loginDate,
      dayOfWeek,
      loginTime,
      timeOfDaySlot,
      city: city.slice(0, 100),
      region: region.slice(0, 100),
      country: country.slice(0, 100),
      timezone: timezone.slice(0, 80),
      deviceType: deviceType.slice(0, 40),
      browser: browser.slice(0, 60),
      os: os.slice(0, 60),
      eventType: String(inferredEventType).slice(0, 40),
      trafficSource,
      createdAtIso: now.toISOString(),
      createdAt: serverTimestamp(),
    };

    if (input.featureName) {
      payload.featureName = String(input.featureName).trim().slice(0, 80);
    }
    if (typeof input.durationSeconds === 'number' && Number.isFinite(input.durationSeconds)) {
      payload.durationSeconds = Math.max(0, Math.min(86400, Math.round(input.durationSeconds)));
    }
    if (input.completedAction) {
      payload.completedAction = String(input.completedAction).trim().slice(0, 80);
    }

    try {
      await setDoc(docRef, payload);
    } catch (err: any) {
      if (err?.code === 'permission-denied') {
        handleFirestoreError(err, 'create', `site_analytics/${eventId}`);
      }
    }
  } catch (e) {
    console.warn('Analytics event note:', e);
  }
}

export async function trackUrlVisit(pathname: string = '/'): Promise<void> {
  if (typeof window === 'undefined' || !db) return;

  if ((pathname || '/').toLowerCase().startsWith('/admin') || isAdminUserOrRoute()) return;

  // One URL-click event per browser tab session to prevent SPA route churn / refresh inflation
  if (sessionStorage.getItem('tt_url_visit_logged') === '1') return;
  sessionStorage.setItem('tt_url_visit_logged', '1');

  const host = (window.location.hostname || '').toLowerCase();
  const referrer = (document.referrer || '').toLowerCase();
  const search = (window.location.search || '').toLowerCase();

  const isVercelDeployment =
    host === 'trickytoddlers.vercel.app' ||
    host.endsWith('.vercel.app') ||
    referrer.includes('tinyurl.com') ||
    referrer.includes('trickytoddlers.vercel.app') ||
    search.includes('tinyurl') ||
    search.includes('trickytods');

  const entryPoint = isVercelDeployment
    ? 'Vercel URL (https://tinyurl.com/trickytods)'
    : `App URL (${(host || 'localhost').slice(0, 60)})`;

  await trackSiteAnalyticsEvent({
    accountType: 'URL Visit',
    eventType: 'url_visit',
    entryPoint,
    personaName: 'Visitor',
    childProfile: 'URL Visit',
    activeTab: 'landing',
    trafficSource: detectTrafficSource(),
  });
}

export async function trackFeatureVisit(featureName: TrackedFeatureName, activeTab: string): Promise<void> {
  if (typeof window === 'undefined' || !db || isAdminUserOrRoute()) return;
  const accountMode = localStorage.getItem('tt_auth_mode') === 'account' ? 'Personal Account' : 'Guest Account';
  const sessionId = getAnalyticsSessionId();
  await trackSiteAnalyticsEvent({
    accountType: accountMode,
    eventType: 'feature_use',
    featureName,
    entryPoint: `Feature Open (${sessionId})`,
    activeTab,
  });
}

export async function trackFeatureDuration(
  featureName: TrackedFeatureName,
  durationSeconds: number,
  activeTab: string
): Promise<void> {
  if (typeof window === 'undefined' || !db || isAdminUserOrRoute()) return;
  const cleanSeconds = Math.round(durationSeconds);
  if (!Number.isFinite(cleanSeconds) || cleanSeconds < 2) return;
  const accountMode = localStorage.getItem('tt_auth_mode') === 'account' ? 'Personal Account' : 'Guest Account';
  const sessionId = getAnalyticsSessionId();
  await trackSiteAnalyticsEvent({
    accountType: accountMode,
    eventType: 'feature_use',
    featureName,
    durationSeconds: Math.min(cleanSeconds, 86400),
    entryPoint: `Feature Duration (${sessionId})`,
    activeTab,
  });
}

export async function trackFeatureAction(
  featureName: TrackedFeatureName,
  completedAction: string,
  activeTab: string
): Promise<void> {
  if (typeof window === 'undefined' || !db || isAdminUserOrRoute()) return;
  const accountMode = localStorage.getItem('tt_auth_mode') === 'account' ? 'Personal Account' : 'Guest Account';
  const sessionId = getAnalyticsSessionId();
  await trackSiteAnalyticsEvent({
    accountType: accountMode,
    eventType: 'feature_action',
    featureName,
    completedAction,
    entryPoint: `${completedAction} (${sessionId})`,
    activeTab,
  });
}

export async function trackSessionDurationPing(durationSeconds: number, activeTab: string = 'app'): Promise<void> {
  if (typeof window === 'undefined' || !db || isAdminUserOrRoute()) return;
  const cleanSeconds = Math.round(durationSeconds);
  if (!Number.isFinite(cleanSeconds) || cleanSeconds < 3) return;
  const accountMode = localStorage.getItem('tt_auth_mode') === 'account' ? 'Personal Account' : 'Guest Account';
  const sessionId = getAnalyticsSessionId();
  await trackSiteAnalyticsEvent({
    accountType: accountMode,
    eventType: 'session_ping',
    durationSeconds: Math.min(cleanSeconds, 86400),
    entryPoint: `Session: ${sessionId}`,
    activeTab,
  });
}
