/**
 * Premium Access Utility
 * - Home Landing Page (!isSessionActive) and Instant Guest Access (Lashmi & Ashwath demo/guest session):
 *   FoodLens AI and NutriBand remain fully visible & unlocked for instant exploration.
 * - Signed-In Accounts (created via Create Account or signed in via Sign In):
 *   FoodLens AI and NutriBand are locked behind the Premium Plan unless the user has upgraded
 *   to Comprehensive Premium (₹499/mo or ₹4,999/yr).
 */

export const isSignedInAccount = (
  user?: any,
  profile?: any,
  isSessionActive?: boolean
): boolean => {
  if (typeof window === 'undefined') return false;

  // If the user is on the Home Landing Page (not in an active session), it's not a signed-in account
  const sessionActive =
    isSessionActive !== undefined
      ? isSessionActive
      : sessionStorage.getItem('tt_session_active') === 'true';

  if (!sessionActive) return false;

  // Check explicit auth mode set by LoginForm / RegisterForm vs Instant Guest Access
  const authMode = localStorage.getItem('tt_auth_mode');
  if (authMode === 'guest') return false;
  if (authMode === 'account') return true;

  // Fallback inspection of user/profile identity
  const email = (user?.email || profile?.email || '').toLowerCase();
  const uid = user?.uid || '';
  const username = (profile?.username || '').toLowerCase();

  const isGuestIdentity =
    !uid ||
    uid === 'guest_instant_user' ||
    user?.isAnonymous === true ||
    email === 'ash****@gmail.com' ||
    email === 'guest_demo_session@securepass.internal' ||
    email === 'lashmi@gmail.com' ||
    email === 'lashm@gmail.com' ||
    email.startsWith('guest_') ||
    username === 'lashmi' ||
    username === 'parent';

  return !isGuestIdentity;
};

export const isPremiumUser = (profile?: any, user?: any): boolean => {
  if (typeof window === 'undefined') return false;

  const uid = user?.uid || profile?.uid || localStorage.getItem('cached_user_uid') || '';
  const userSpecificUnlocked = uid
    ? localStorage.getItem(`tricky_toddlers_premium_unlocked_${uid}`) === 'true'
    : false;
  const globalUnlocked = localStorage.getItem('tricky_toddlers_premium_unlocked') === 'true';
  const localPlan = localStorage.getItem('user_plan');
  const profilePlan = profile?.plan;

  if (profilePlan === 'comprehensive' || userSpecificUnlocked) {
    return true;
  }

  // Only honor global localStorage flags if the profile doesn't explicitly belong to a new free signed-in user
  if (profile && profile.plan && profile.plan !== 'comprehensive') {
    return false;
  }

  if (globalUnlocked || localPlan === 'comprehensive') {
    return true;
  }

  return false;
};

/**
 * Determines whether FoodLens AI and NutriBand should be locked behind the Premium Upgrade Gate.
 * Returns TRUE only for signed-in accounts (via Create Account / Sign In) that have not upgraded to Premium.
 * Returns FALSE on the Home Landing Page and in Instant Guest Access.
 */
export const shouldLockPremiumFeature = (
  user?: any,
  profile?: any,
  isSessionActive?: boolean
): boolean => {
  const signedIn = isSignedInAccount(user, profile, isSessionActive);
  if (!signedIn) {
    // Visible & unlocked in Guest account and Home landing page
    return false;
  }
  return !isPremiumUser(profile, user);
};
