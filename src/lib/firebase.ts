import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBY5cVieJcfky9krO-wEg6qeaGOIujWBL8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "classmap-website-data.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "classmap-website-data",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "classmap-website-data.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "492070077067",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:492070077067:web:c53a96cffec2836cd3fa49",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-LM35M5W8JC"
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize default Firebase Storage
export const storage = getStorage(app, firebaseConfig.storageBucket);

/**
 * Get a Firebase Storage instance for the default bucket or a specific custom bucket name/URL
 * @param bucketNameOrUrl Optional storage bucket URL (e.g. 'gs://my-custom-bucket.appspot.com' or 'classmap-website.firebasestorage.app')
 */
export function getStorageInstance(bucketNameOrUrl?: string): FirebaseStorage {
  if (!bucketNameOrUrl || bucketNameOrUrl === firebaseConfig.storageBucket) {
    return storage;
  }
  return getStorage(app, bucketNameOrUrl);
}

// Initialize Analytics safely (only in browser environment)
export const initAnalytics = async () => {
  if (typeof window !== "undefined" && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

/**
 * Upload a file or Blob directly to Firebase Storage and return its public Download URL.
 * @param file File or Blob object
 * @param path Storage path (e.g. 'logos/app-logo.png')
 * @param bucketNameOrUrl Optional custom bucket (e.g. 'classmap-website.firebasestorage.app')
 */
export async function uploadToStorage(file: File | Blob, path: string, bucketNameOrUrl?: string): Promise<string> {
  const targetStorage = getStorageInstance(bucketNameOrUrl);
  const storageRef = ref(targetStorage, path);
  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
}

/**
 * Get public Download URL for a file in Firebase Storage.
 * @param path Storage path (e.g. 'logos/app-logo.png')
 * @param bucketNameOrUrl Optional custom bucket (e.g. 'classmap-website.firebasestorage.app')
 */
export async function getStorageUrl(path: string, bucketNameOrUrl?: string): Promise<string> {
  const targetStorage = getStorageInstance(bucketNameOrUrl);
  const storageRef = ref(targetStorage, path);
  return await getDownloadURL(storageRef);
}

