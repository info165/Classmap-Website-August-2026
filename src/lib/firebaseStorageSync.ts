import { getStorageUrl, uploadToStorage, firebaseConfig } from './firebase';

interface StorageSeedItem {
  storagePath: string;
  localAssetUrl: string;
}

// In-memory cache of resolved Firebase Storage URLs
const urlCache = new Map<string, string>();

/**
 * Ensures an asset is stored in Firebase Storage and returns its public Download URL.
 * If the asset is missing in Firebase Storage, it uploads the local asset to Firebase Storage automatically.
 */
export async function getOrSeedStorageUrl(storagePath: string, localAssetUrl: string): Promise<string> {
  if (urlCache.has(storagePath)) {
    return urlCache.get(storagePath)!;
  }

  try {
    // 1. Check if file exists in Firebase Storage
    const existingUrl = await getStorageUrl(storagePath, firebaseConfig.storageBucket);
    if (existingUrl) {
      urlCache.set(storagePath, existingUrl);
      return existingUrl;
    }
  } catch {
    // Object not in Firebase Storage yet — proceed to seed/upload
  }

  // 2. Fetch local asset as Blob and upload to Firebase Storage
  try {
    const response = await fetch(localAssetUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch local asset ${localAssetUrl}`);
    }
    const blob = await response.blob();
    const uploadedUrl = await uploadToStorage(blob, storagePath, firebaseConfig.storageBucket);
    urlCache.set(storagePath, uploadedUrl);
    return uploadedUrl;
  } catch (err) {
    console.warn(`[Firebase Storage] Sync/Upload error for ${storagePath}:`, err);
    // Fallback to local asset URL if upload fails or is offline
    return localAssetUrl;
  }
}
