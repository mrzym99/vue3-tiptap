/**
 * Safe localStorage helpers — JSON-aware and never throw.
 * Storage can be unavailable (private mode, quota exceeded, disabled cookies);
 * every call degrades silently instead of crashing the host app.
 */

/** Read `key` and JSON-parse it; returns `fallback` when missing or malformed. */
export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** JSON-stringify and persist `value`; silently ignored when storage fails. */
export function writeStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode / quota) — treat as best-effort cache
  }
}
