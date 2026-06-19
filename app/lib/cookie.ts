/**
 * Cookie Service
 * Works on both client-side and server-side
 * On server: Uses in-memory storage (Map)
 * On client: Uses document.cookie
 */

interface CookieOptions {
  path?: string;
  domain?: string;
  maxAge?: number; // in seconds
  expires?: Date;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  httpOnly?: boolean; // Note: Cannot be set from client-side JavaScript
}

// Server-side calls get a throwaway Map per call (writes vanish, reads return null),
// so no cookie state is shared across requests under SSR (prevents cross-user bleed).
// Real auth state on the server must be read from the request cookie header.
const serverStore = (): Map<string, string> => new Map<string, string>();

/**
 * Check if we're in a browser environment
 */
const isBrowser = (): boolean => {
  return typeof window !== "undefined" && typeof document !== "undefined";
};

/**
 * Parse cookie string to object
 */
const parseCookies = (cookieString: string): Record<string, string> => {
  const cookies: Record<string, string> = {};
  if (!cookieString) return cookies;

  cookieString.split(";").forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    if (name) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value || "");
    }
  });

  return cookies;
};

/**
 * Build cookie string from options
 */
const buildCookieString = (
  name: string,
  value: string,
  options?: CookieOptions
): string => {
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options) {
    if (options.path) cookieString += `; path=${options.path}`;
    if (options.domain) cookieString += `; domain=${options.domain}`;
    if (options.maxAge) cookieString += `; max-age=${options.maxAge}`;
    if (options.expires)
      cookieString += `; expires=${options.expires.toUTCString()}`;
    if (options.secure) cookieString += "; secure";
    if (options.sameSite) cookieString += `; samesite=${options.sameSite}`;
    // Note: httpOnly cannot be set from client-side
  }

  return cookieString;
};

/**
 * Cookie Service API
 */
export const cookieService = {
  /**
   * Set a cookie
   */
  setItem: (name: string, value: string, options?: CookieOptions): void => {
    if (!isBrowser()) {
      serverStore().set(name, value);
      return;
    }

    try {
      const cookieString = buildCookieString(name, value, options);
      document.cookie = cookieString;
    } catch (error) {
      console.error(`Failed to set cookie "${name}":`, error);
    }
  },

  /**
   * Get a cookie value
   */
  getItem: (name: string): string | null => {
    if (!isBrowser()) {
      return serverStore().get(name) ?? null;
    }

    try {
      const cookies = parseCookies(document.cookie);
      return cookies[name] ?? null;
    } catch (error) {
      console.error(`Failed to get cookie "${name}":`, error);
      return null;
    }
  },

  /**
   * Remove a cookie
   */
  removeItem: (
    name: string,
    options?: Omit<CookieOptions, "maxAge" | "expires">
  ): void => {
    if (!isBrowser()) {
      serverStore().delete(name);
      return;
    }

    try {
      // Set expiry to past date to delete the cookie
      const deleteOptions: CookieOptions = {
        ...options,
        maxAge: -1,
      };
      const cookieString = buildCookieString(name, "", deleteOptions);
      document.cookie = cookieString;
    } catch (error) {
      console.error(`Failed to remove cookie "${name}":`, error);
    }
  },

  /**
   * Clear all cookies
   */
  clear: (): void => {
    if (!isBrowser()) {
      serverStore().clear();
      return;
    }

    try {
      const cookies = parseCookies(document.cookie);
      Object.keys(cookies).forEach((name) => {
        cookieService.removeItem(name);
      });
    } catch (error) {
      console.error("Failed to clear cookies:", error);
    }
  },

  /**
   * Check if cookie exists
   */
  hasItem: (name: string): boolean => {
    if (!isBrowser()) {
      return serverStore().has(name);
    }

    try {
      const cookies = parseCookies(document.cookie);
      return name in cookies;
    } catch (error) {
      console.error(`Failed to check cookie "${name}":`, error);
      return false;
    }
  },

  /**
   * Get all cookie names
   */
  keys: (): string[] => {
    if (!isBrowser()) {
      return Array.from(serverStore().keys());
    }

    try {
      const cookies = parseCookies(document.cookie);
      return Object.keys(cookies);
    } catch (error) {
      console.error("Failed to get cookie keys:", error);
      return [];
    }
  },

  /**
   * Get all cookies as object
   */
  all: (): Record<string, string> => {
    if (!isBrowser()) {
      return Object.fromEntries(serverStore());
    }

    try {
      return parseCookies(document.cookie);
    } catch (error) {
      console.error("Failed to get all cookies:", error);
      return {};
    }
  },

  /**
   * Get number of cookies
   */
  size: (): number => {
    if (!isBrowser()) {
      return serverStore().size;
    }

    try {
      return Object.keys(parseCookies(document.cookie)).length;
    } catch (error) {
      console.error("Failed to get cookie size:", error);
      return 0;
    }
  },
};

/**
 * Cookie JSON Service
 * Handles serialization/deserialization of objects
 */
export const jsonCookieService = {
  /**
   * Set JSON object as cookie
   */
  setItem: <T>(name: string, value: T, options?: CookieOptions): void => {
    try {
      const serialized = JSON.stringify(value);
      cookieService.setItem(name, serialized, options);
    } catch (error) {
      console.error(`Failed to serialize cookie "${name}":`, error);
    }
  },

  /**
   * Get JSON object from cookie
   */
  getItem: <T = unknown>(name: string): T | null => {
    try {
      const value = cookieService.getItem(name);
      return value ? (JSON.parse(value) as T) : null;
    } catch (error) {
      console.error(`Failed to deserialize cookie "${name}":`, error);
      return null;
    }
  },

  /**
   * Remove JSON object cookie
   */
  removeItem: (
    name: string,
    options?: Omit<CookieOptions, "maxAge" | "expires">
  ): void => {
    cookieService.removeItem(name, options);
  },

  /**
   * Clear all cookies
   */
  clear: (): void => {
    cookieService.clear();
  },

  /**
   * Check if cookie exists
   */
  hasItem: (name: string): boolean => {
    return cookieService.hasItem(name);
  },
};

export default cookieService;
