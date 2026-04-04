export function getFromStorage<T>(key: string, defaultValue: T): T {
  const val = GM_getValue<T | undefined>(key);
  if (val === undefined) {
    GM_setValue(key, defaultValue);
    return defaultValue;
  }
  return val;
}

export function setToStorage<T>(key: string, value: T): void {
  GM_setValue(key, value);
}

export function removeFromStorage(key: string): void {
  GM_deleteValue(key);
}
