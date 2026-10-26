import { handleFirestoreError, FirestoreErrorInfo } from './firebase';

export async function withRetry<T>(
  operation: () => Promise<T>,
  operationType: FirestoreErrorInfo['operationType'],
  path: string | null,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (retries > 0 && error.code !== 'permission-denied') {
      console.warn(`Firestore operation ${operationType} failed, retrying in ${delay}ms...`, error);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(operation, operationType, path, retries - 1, delay * 2);
    }
    handleFirestoreError(error, operationType, path);
    throw error;
  }
}
