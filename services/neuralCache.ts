import { get as idbGet, set as idbSet, del as idbDel, clear as idbClear } from 'idb-keyval';

/**
 * Neural Cache System
 * A robust wrapper around idb-keyval with graceful fallback for environments
 * where IndexedDB is restricted (Private Browsing, restricted Iframes, etc.)
 */

// Memory fallback for environments where IndexedDB fails
const memoryCache = new Map<string, any>();

// Helper to check if we should use memory fallback
let useMemoryFallback = false;

export async function get<T = any>(key: string): Promise<T | undefined> {
  if (useMemoryFallback) {
    return memoryCache.get(key);
  }

  try {
    return await idbGet(key);
  } catch (error) {
    console.error("Neural Cache (GET) Failure:", error);
    // Switch to memory fallback if we detect persistent IndexedDB issues
    if (String(error).includes('IndexedDB') || String(error).includes('backing store')) {
      useMemoryFallback = true;
      return memoryCache.get(key);
    }
    return undefined;
  }
}

export async function set(key: string, value: any): Promise<void> {
  if (useMemoryFallback) {
    memoryCache.set(key, value);
    return;
  }

  try {
    await idbSet(key, value);
  } catch (error) {
    console.error("Neural Cache (SET) Failure:", error);
    if (String(error).includes('IndexedDB') || String(error).includes('backing store')) {
      useMemoryFallback = true;
      memoryCache.set(key, value);
    }
  }
}

export async function del(key: string): Promise<void> {
  if (useMemoryFallback) {
    memoryCache.delete(key);
    return;
  }

  try {
    await idbDel(key);
  } catch (error) {
    console.error("Neural Cache (DEL) Failure:", error);
    if (String(error).includes('IndexedDB') || String(error).includes('backing store')) {
      useMemoryFallback = true;
      memoryCache.delete(key);
    }
  }
}

export async function clear(): Promise<void> {
  if (useMemoryFallback) {
    memoryCache.clear();
    return;
  }

  try {
    await idbClear();
  } catch (error) {
    console.error("Neural Cache (CLEAR) Failure:", error);
    if (String(error).includes('IndexedDB') || String(error).includes('backing store')) {
      useMemoryFallback = true;
      memoryCache.clear();
    }
  }
}
