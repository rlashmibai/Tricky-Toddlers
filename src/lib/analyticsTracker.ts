import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError } from './firebase';

export interface SiteAnalyticsEventInput {
  accountType: 'Guest Account' | 'Personal Account';
  entryPoint: string;
  personaName?: string;
  childProfile?: string;
  activeTab?: string;
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
  createdAtIso: string;
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getTimeOfDaySlot(hour: number): string {
  if (hour >= 6 && hour < 12) return 'Morning (6 AM - 12 PM)';
  if (hour >= 12 && hour < 17) return 'Afternoon (12 PM - 5 PM)';
  if (hour >= 17 && hour < 21) return 'Evening (5 PM - 9 PM)';
  return 'Night (9 PM - 6 AM)';
}

function getOrGenerateVisitorIdentity(): { visitorId: string; isReturningVisitor: boolean } {
  if (typeof window === 'undefined') {
    return { visitorId: 'v_server_session', isReturningVisitor: false };
  }
  const existingId = localStorage.getItem('tt_visitor_id');
  const seenCount = parseInt(localStorage.getItem('tt_visitor_sessions') || '0', 10);
  if (existingId && /^[a-zA-Z0-9_-]+$/.test(existingId)) {
    localStorage.setItem('tt_visitor_sessions', String(seenCount + 1));
    return {
      visitorId: existingId.slice(0, 64),
      isReturningVisitor: seenCount >= 1,
    };
  }
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  const newId = `vis_${Date.now()}_${randomSuffix}`;
  localStorage.setItem('tt_visitor_id', newId);
  localStorage.setItem('tt_visitor_sessions', '1');
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

let lastTrackedSignature = '';
let lastTrackedTimestamp = 0;

export async function trackSiteAnalyticsEvent(input: SiteAnalyticsEventInput): Promise<void> {
  if (typeof window === 'undefined' || !db) return;

  try {
    // Deduplicate identical consecutive rapid triggers within 3 seconds
    const sig = `${input.accountType}:${input.entryPoint}:${input.childProfile || ''}:${input.activeTab || ''}`;
    const nowMs = Date.now();
    if (sig === lastTrackedSignature && nowMs - lastTrackedTimestamp < 3000) {
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

    let city = tzFallback.city;
    let region = tzFallback.region;
    let country = tzFallback.country;
    let deviceType = clientDevice.deviceType;
    let browser = clientDevice.browser;
    let os = clientDevice.os;

    try {
      const resp = await fetch('/api/analytics/context');
      if (resp.ok) {
        const ctx = await resp.json();
        if (ctx.city && ctx.city !== 'Unknown') city = String(ctx.city).slice(0, 100);
        if (ctx.region && ctx.region !== 'Unknown') region = String(ctx.region).slice(0, 100);
        if (ctx.country && ctx.country !== 'Unknown') country = String(ctx.country).slice(0, 100);
        if (ctx.deviceType) deviceType = String(ctx.deviceType).slice(0, 40);
        if (ctx.browser) browser = String(ctx.browser).slice(0, 60);
        if (ctx.os) os = String(ctx.os).slice(0, 60);
      }
    } catch {
      // Fallback to client timezone & UA info seamlessly
    }

    const activeIdx = localStorage.getItem('active_child_index') === '2' ? 2 : 1;
    const defaultChild = input.accountType === 'Guest Account'
      ? (activeIdx === 2 ? 'Child 2 (3 Months)' : 'Child 1 (2 Years 6 Months)')
      : (localStorage.getItem('baby_name') || 'Child 1');

    const personaName = (input.personaName || localStorage.getItem('parent_name') || 'Parent').trim().slice(0, 80) || 'Parent';
    const childProfile = (input.childProfile || defaultChild).trim().slice(0, 80) || 'Child 1';
    const activeTab = (input.activeTab || 'ai').trim().slice(0, 60) || 'ai';

    // Wait briefly if Firebase Auth is still initializing background guest user
    let currentUser = auth?.currentUser;
    if (!currentUser) {
      await new Promise((r) => setTimeout(r, 800));
      currentUser = auth?.currentUser;
    }
    if (!currentUser) return;

    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const docRef = doc(collection(db, 'site_analytics'), eventId);

    const payload = {
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
      createdAtIso: now.toISOString(),
      createdAt: serverTimestamp(),
    };

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
