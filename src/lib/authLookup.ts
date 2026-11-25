import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface ResolvedAccountEmail {
  email: string | null;
  isLegacyInternal: boolean;
  resolvedFromUsername: boolean;
  cleanUsername?: string;
}

export async function resolveAccountEmail(rawInput: string): Promise<ResolvedAccountEmail> {
  const clean = rawInput.trim().toLowerCase();
  if (!clean) {
    return { email: null, isLegacyInternal: false, resolvedFromUsername: false };
  }

  if (clean.includes('@')) {
    return {
      email: clean,
      isLegacyInternal: clean.endsWith('@securepass.internal'),
      resolvedFromUsername: false,
    };
  }

  const cleanUsername = clean.replace(/\s+/g, '_');
  if (db && /^[a-z0-9_]{3,32}$/.test(cleanUsername)) {
    try {
      const snap = await getDoc(doc(db, 'usernames', cleanUsername));
      if (snap.exists()) {
        const data = snap.data();
        if (typeof data?.email === 'string' && data.email.includes('@')) {
          const email = data.email.trim().toLowerCase();
          return {
            email,
            isLegacyInternal: email.endsWith('@securepass.internal'),
            resolvedFromUsername: true,
            cleanUsername,
          };
        }
      }
    } catch (err) {
      console.warn('Username lookup note:', err);
    }
  }

  return {
    email: null,
    isLegacyInternal: false,
    resolvedFromUsername: true,
    cleanUsername,
  };
}

export function maskEmailAddress(email: string): string {
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const [local, domain] = parts;
  if (local.length <= 2) return `${local[0] || '*'}***@${domain}`;
  return `${local.slice(0, 2)}***${local.slice(-1)}@${domain}`;
}
