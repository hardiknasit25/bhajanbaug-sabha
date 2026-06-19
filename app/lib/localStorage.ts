/**
 * Local Storage Service
 * Works on both client-side and server-side
 * On server: Uses in-memory storage (Map)
 * On client: Uses localStorage
 */

/**
 * Check if we're in a browser environment
 */
const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
};

/**
 * Get the appropriate storage object.
 * On the server there is no per-request storage context here, so we return a
 * throwaway Map per call. This makes server-side reads return null and writes
 * go nowhere — preventing cross-user data bleed that a shared module-level Map
 * would cause under SSR. Real auth state must come from the request cookie.
 */
const getStorage = (): Storage | Map<string, string> => {
  if (!isBrowser()) {
    return new Map<string, string>();
  }
  return localStorage;
};

/**
 * Local Storage Service API
 */
export const localStorageService = {
  /**
   * Set item in local storage
   */
  setItem: (key: string, value: string): void => {
    const storage = getStorage();
    if (storage instanceof Map) {
      storage.set(key, value);
    } else {
      storage.setItem(key, value);
    }
  },

  /**
   * Get item from local storage
   */
  getItem: (key: string): string | null => {
    const storage = getStorage();
    if (storage instanceof Map) {
      return storage.get(key) ?? null;
    } else {
      return storage.getItem(key);
    }
  },

  /**
   * Remove item from local storage
   */
  removeItem: (key: string): void => {
    const storage = getStorage();
    if (storage instanceof Map) {
      storage.delete(key);
    } else {
      storage.removeItem(key);
    }
  },

  /**
   * Clear all items from local storage
   */
  clear: (): void => {
    const storage = getStorage();
    if (storage instanceof Map) {
      storage.clear();
    } else {
      storage.clear();
    }
  },

  /**
   * Check if key exists in local storage
   */
  hasItem: (key: string): boolean => {
    const storage = getStorage();
    if (storage instanceof Map) {
      return storage.has(key);
    } else {
      return storage.getItem(key) !== null;
    }
  },

  /**
   * Get all keys from local storage
   */
  keys: (): string[] => {
    const storage = getStorage();
    if (storage instanceof Map) {
      return Array.from(storage.keys());
    } else {
      return Object.keys(storage);
    }
  },

  /**
   * Get local storage size (number of items)
   */
  size: (): number => {
    const storage = getStorage();
    if (storage instanceof Map) {
      return storage.size;
    } else {
      return storage.length;
    }
  },
};

/**
 * Local JSON Storage Service
 * Handles serialization/deserialization of objects
 */
export const localJsonStorageService = {
  /**
   * Set JSON object in local storage
   */
  setItem: <T>(key: string, value: T): void => {
    try {
      const serialized = JSON.stringify(value);
      localStorageService.setItem(key, serialized);
    } catch (error) {
      console.error(`Failed to serialize value for key "${key}":`, error);
    }
  },

  /**
   * Get JSON object from local storage
   */
  getItem: <T = unknown>(key: string): T | null => {
    try {
      const value = localStorageService.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch (error) {
      console.error(`Failed to deserialize value for key "${key}":`, error);
      return null;
    }
  },

  /**
   * Remove JSON object from local storage
   */
  removeItem: (key: string): void => {
    localStorageService.removeItem(key);
  },

  /**
   * Clear all JSON objects from local storage
   */
  clear: (): void => {
    localStorageService.clear();
  },

  /**
   * Check if key exists in local storage
   */
  hasItem: (key: string): boolean => {
    return localStorageService.hasItem(key);
  },
};

export default localStorageService;
