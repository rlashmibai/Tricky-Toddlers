import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';

// @ts-ignore
import firebaseConfig from '../../firebase-applet-config.json';

let app: any;
let auth: any;
let db: any;

if (firebaseConfig) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
    }, firebaseConfig.firestoreDatabaseId);

    // CRITICAL CONSTRAINT: Validate Connection to Firestore
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error: any) {
        if (error.message?.includes('the client is offline')) {
          console.warn("Please check your Firebase configuration or internet connection.");
        }
      }
    };
    testConnection();
  } catch (e) {
    console.error("Firebase init error:", e);
  }
}

export { app, auth, db };

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: { providerId: string; displayName: string; email: string; }[];
  }
}

export function handleFirestoreError(error: any, operation: FirestoreErrorInfo['operationType'], path: string | null = null): never {
  if (error.code === 'permission-denied') {
    const errorInfo: FirestoreErrorInfo = {
      error: error.message,
      operationType: operation,
      path: path,
      authInfo: {
        userId: auth?.currentUser?.uid || 'anonymous',
        email: auth?.currentUser?.email || '',
        emailVerified: auth?.currentUser?.emailVerified || false,
        isAnonymous: auth?.currentUser?.isAnonymous || true,
        providerInfo: auth?.currentUser?.providerData.map((p: any) => ({
          providerId: p.providerId,
          displayName: p.displayName || '',
          email: p.email || '',
        })) || [],
      }
    };
    throw new Error(JSON.stringify(errorInfo));
  }
  throw error;
}
