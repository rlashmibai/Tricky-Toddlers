/**
 * Premium Access Utility
 * Ensures that free users and newly created profiles cannot access premium features.
 * Only users who have upgraded to Comprehensive Premium (₹499/mo or ₹4,999/yr) unlock them.
 */

export const isPremiumUser = (profile?: any): boolean => {
  if (typeof window === 'undefined') return false;

  const unlocked = localStorage.getItem('tricky_toddlers_premium_unlocked') === 'true';
  const localPlan = localStorage.getItem('user_plan');
  const profilePlan = profile?.plan;

  // Only comprehensive premium or explicit unlock flag grants access
  if (unlocked || localPlan === 'comprehensive' || profilePlan === 'comprehensive') {
    return true;
  }

  return false;
};
