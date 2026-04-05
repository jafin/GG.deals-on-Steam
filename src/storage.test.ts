import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getFromStorage, setToStorage, removeFromStorage } from './storage';

const store = new Map<string, unknown>();

// Mock Tampermonkey globals
vi.stubGlobal('GM_getValue', (key: string) => store.get(key));
vi.stubGlobal('GM_setValue', (key: string, value: unknown) => store.set(key, value));
vi.stubGlobal('GM_deleteValue', (key: string) => store.delete(key));

describe('storage', () => {
  beforeEach(() => {
    store.clear();
  });

  describe('getFromStorage', () => {
    it('returns the stored value when it exists', () => {
      store.set('token', 'abc123');
      expect(getFromStorage('token', 'default')).toBe('abc123');
    });

    it('returns the default and persists it when key is missing', () => {
      const result = getFromStorage('token', 'fallback');
      expect(result).toBe('fallback');
      expect(store.get('token')).toBe('fallback');
    });
  });

  describe('setToStorage', () => {
    it('stores a value', () => {
      setToStorage('region', 'eu');
      expect(store.get('region')).toBe('eu');
    });

    it('overwrites existing value', () => {
      store.set('region', 'us');
      setToStorage('region', 'eu');
      expect(store.get('region')).toBe('eu');
    });
  });

  describe('removeFromStorage', () => {
    it('deletes a key', () => {
      store.set('token', 'abc');
      removeFromStorage('token');
      expect(store.has('token')).toBe(false);
    });
  });
});
