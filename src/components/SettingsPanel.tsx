import { signal, computed, effect } from '@preact/signals';
import { applyColors } from '../colors';
import { STORAGE_KEYS, DEFAULT_SUBPAGES, DEFAULT_PRICE_TYPE, DEFAULT_COLORS, DEFAULT_REGION } from '../constants';
import { getFromStorage, setToStorage, removeFromStorage } from '../storage';
import type { PriceType, Subpage } from '../types';

const REGIONS = [
  { value: 'au', label: 'Australia (AU)' },
  { value: 'be', label: 'Belgium (BE)' },
  { value: 'br', label: 'Brazil (BR)' },
  { value: 'ca', label: 'Canada (CA)' },
  { value: 'ch', label: 'Switzerland (CH)' },
  { value: 'de', label: 'Germany (DE)' },
  { value: 'dk', label: 'Denmark (DK)' },
  { value: 'es', label: 'Spain (ES)' },
  { value: 'eu', label: 'Europe (EU)' },
  { value: 'fi', label: 'Finland (FI)' },
  { value: 'fr', label: 'France (FR)' },
  { value: 'gb', label: 'United Kingdom (GB)' },
  { value: 'ie', label: 'Ireland (IE)' },
  { value: 'it', label: 'Italy (IT)' },
  { value: 'nl', label: 'Netherlands (NL)' },
  { value: 'no', label: 'Norway (NO)' },
  { value: 'pl', label: 'Poland (PL)' },
  { value: 'se', label: 'Sweden (SE)' },
  { value: 'us', label: 'United States (US)' },
] as const;

type Region = typeof REGIONS[number]['value'];

const SUBPAGES: { value: Subpage; label: string; desc: string }[] = [
  { value: 'app', label: 'App', desc: 'store.steampowered.com/app/*' },
  { value: 'wishlist', label: 'Wishlist', desc: 'store.steampowered.com/wishlist/*' },
  { value: 'bundle', label: 'Bundle', desc: 'store.steampowered.com/bundle/*' },
  { value: 'cart', label: 'Cart', desc: 'store.steampowered.com/cart' },
  { value: 'search', label: 'Search', desc: 'store.steampowered.com/search/*' },
  { value: 'recommended', label: 'Recommended', desc: 'store.steampowered.com/recommended/morelike/app/*' },
];

const PRICE_TYPES: { value: PriceType; label: string; desc: string }[] = [
  {
    value: 'official',
    label: 'Official shops',
    desc: 'Steam, Epic, Gog, Battle.net, Ubisoft, Microsoft, EA, Humble Store, Fanatical...',
  },
  {
    value: 'keyshop',
    label: 'Keyshops',
    desc: 'G2A, Instant Gaming, Kinguin, CDKeys, GAMIVO, Eneba, HRK, K4G.com, Difmark...',
  },
];

const visible = signal(false);
const apiKey = signal('');
const showApiKey = signal(false);
const region = signal<Region>(DEFAULT_REGION);
const activeSubpages = signal<Subpage[]>(DEFAULT_SUBPAGES);
const priceType = signal<PriceType[]>(DEFAULT_PRICE_TYPE);
const colors = signal<readonly string[]>(DEFAULT_COLORS);
const priceInStorage = signal(0);
const rateLimitLimit = signal('100');
const rateLimitRemaining = signal('0');
const rateLimitReset = signal('0');
let initialized = false;

function initSignals() {
  if (initialized) return;
  initialized = true;
  apiKey.value = getFromStorage(STORAGE_KEYS.token, '');
  region.value = getFromStorage<Region>(STORAGE_KEYS.region, DEFAULT_REGION);
  activeSubpages.value = getFromStorage<Subpage[]>(STORAGE_KEYS.activeSubpages, DEFAULT_SUBPAGES);
  priceType.value = getFromStorage<PriceType[]>(STORAGE_KEYS.priceType, DEFAULT_PRICE_TYPE);
  colors.value = getFromStorage<readonly string[]>(STORAGE_KEYS.colors, DEFAULT_COLORS);
  priceInStorage.value = Object.keys(getFromStorage(STORAGE_KEYS.lastAppIds, {})).length;
  rateLimitLimit.value = getFromStorage(STORAGE_KEYS.rateLimitLimit, '100');
  rateLimitRemaining.value = getFromStorage(STORAGE_KEYS.rateLimitRemaining, '0');
  rateLimitReset.value = getFromStorage(STORAGE_KEYS.rateLimitReset, '0');
}

const resetTimeDisplay = computed(() => new Date(Number(rateLimitReset.value) * 1000).toLocaleString());

effect(() => {
  if (!visible.value) return;
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') visible.value = false;
  };
  document.addEventListener('keydown', onKeyDown);
  return () => document.removeEventListener('keydown', onKeyDown);
});

export function toggleSettingsPanel() {
  initSignals();
  visible.value = !visible.value;
  if (visible.value) {
    // Refresh values when opening
    priceInStorage.value = Object.keys(getFromStorage(STORAGE_KEYS.lastAppIds, {})).length;
    rateLimitLimit.value = getFromStorage(STORAGE_KEYS.rateLimitLimit, '100');
    rateLimitRemaining.value = getFromStorage(STORAGE_KEYS.rateLimitRemaining, '0');
    rateLimitReset.value = getFromStorage(STORAGE_KEYS.rateLimitReset, '0');
  }
}

function onApiKeyChange(val: string) {
  apiKey.value = val;
  setToStorage(STORAGE_KEYS.token, val);
}

function onRegionChange(val: Region) {
  region.value = val;
  setToStorage(STORAGE_KEYS.region, val);
}

function onSubpageToggle(sub: Subpage) {
  const curr = [...activeSubpages.value];
  const idx = curr.indexOf(sub);
  if (idx >= 0 && curr.length > 1) curr.splice(idx, 1);
  else if (idx < 0) curr.push(sub);
  activeSubpages.value = curr;
  setToStorage(STORAGE_KEYS.activeSubpages, curr);
}

function onPriceTypeToggle(pt: PriceType) {
  const curr = [...priceType.value];
  const idx = curr.indexOf(pt);
  if (idx >= 0 && curr.length > 1) curr.splice(idx, 1);
  else if (idx < 0) curr.push(pt);
  priceType.value = curr;
  setToStorage(STORAGE_KEYS.priceType, curr);
}

function onColorChange(index: number, val: string) {
  const curr = [...colors.value];
  curr[index] = val;
  colors.value = curr;
  setToStorage(STORAGE_KEYS.colors, curr);
  applyColors(curr);
}

function resetColors() {
  colors.value = [...DEFAULT_COLORS];
  setToStorage(STORAGE_KEYS.colors, DEFAULT_COLORS);
  applyColors(DEFAULT_COLORS);
}


function clearStorage() {
  removeFromStorage(STORAGE_KEYS.lastAppIds);
  removeFromStorage(STORAGE_KEYS.lastAppIdsTimestamp);
  priceInStorage.value = 0;
}

export function SettingsPanel() {
  if (!visible.value) return null;

  return (
    <div class="ggdeals-settings-overlay" role="presentation" onClick={() => (visible.value = false)}>
      <dialog class="ggdeals-settings-panel" open onClick={(e) => e.stopPropagation()}>
        <header>
          <h1>GG.deals on Steam - Settings</h1>
          <button class="ggdeals-close-btn" onClick={() => (visible.value = false)}>✕</button>
        </header>
        <main>
          <h3>General</h3>
          <div class="ggdeals-row">
            <div class="optionBlock">
              <p>API key: <button class="ggdeals-show-key" onClick={() => (showApiKey.value = !showApiKey.value)}>👁</button></p>
              <input
                type={showApiKey.value ? 'text' : 'password'}
                value={apiKey.value}
                onInput={(e) => onApiKeyChange(e.currentTarget.value)}
              />
              <small>
                You can get your API key from{' '}
                <a href="https://gg.deals/api/" target="_blank" rel="noopener">this page</a>{'.'}
              </small>
            </div>

            <div class="optionBlock">
              <p>Region:</p>
              <select value={region.value} onChange={(e) => onRegionChange(e.currentTarget.value as Region)}>
                {REGIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <h3>Status</h3>
          <div class="ggdeals-row">
            <div class="optionBlock">
              <p>Prices in storage: <b>{priceInStorage.value}</b></p>
              <button class="ggdeals-btn" onClick={clearStorage}>Clear Storage</button>
            </div>
            <div class="optionBlock">
              <p>
                Remaining API queries: <b>{rateLimitRemaining.value}</b> / <b>{rateLimitLimit.value}</b>
                <br />
                Reset time: <b>{resetTimeDisplay.value}</b>
              </p>
            </div>
          </div>

          <h3>Active subpages</h3>
          <div class="ggdeals-checkbox-group">
            {SUBPAGES.map((s) => (
              <label key={s.value} class={activeSubpages.value.includes(s.value) ? 'checked' : ''}>
                <input
                  type="checkbox"
                  checked={activeSubpages.value.includes(s.value)}
                  onChange={() => onSubpageToggle(s.value)}
                />
                <span>{s.label}</span>
                <span class="desc">{s.desc}</span>
              </label>
            ))}
          </div>

          <h3>Price type</h3>
          <div class="ggdeals-checkbox-group">
            {PRICE_TYPES.map((pt) => (
              <label key={pt.value} class={priceType.value.includes(pt.value) ? 'checked' : ''}>
                <input
                  type="checkbox"
                  checked={priceType.value.includes(pt.value)}
                  onChange={() => onPriceTypeToggle(pt.value)}
                />
                <span>{pt.label}</span>
                <span class="desc">{pt.desc}</span>
              </label>
            ))}
          </div>

          <h3>Style</h3>
          <div class="optionBlock">
            <div class="ggdeals-colors">
              <div>
                <p>Primary color:</p>
                <input type="color" value={colors.value[0]} onInput={(e) => onColorChange(0, e.currentTarget.value)} />
              </div>
              <div>
                <p>Hover color:</p>
                <input type="color" value={colors.value[1]} onInput={(e) => onColorChange(1, e.currentTarget.value)} />
              </div>
              <div>
                <p>Background color:</p>
                <input type="color" value={colors.value[2]} onInput={(e) => onColorChange(2, e.currentTarget.value)} />
              </div>
            </div>
            <button class="ggdeals-btn" onClick={resetColors}>Default Style</button>
          </div>

        </main>
      </dialog>
    </div>
  );
}
