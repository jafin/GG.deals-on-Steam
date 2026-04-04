import { STORAGE_KEYS } from './constants';

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

export function getFromStorage<T>(key: StorageKey, defaultValue: T): T {
  const val = GM_getValue<T | undefined>(key);
  if (val === undefined) {
    GM_setValue(key, defaultValue);
    return defaultValue;
  }
  return val;
}

export function setToStorage<T>(key: StorageKey, value: T): void {
  GM_setValue(key, value);
}

export function removeFromStorage(key: StorageKey): void {
  GM_deleteValue(key);
}
