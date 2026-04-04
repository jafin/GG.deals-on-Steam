import { signal, computed } from '@preact/signals';
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
];

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
    desc: 'Steam, Epic Games, Gog, Battle.net, Ubisoft Store, Microsoft Store, EA, Humble Store, Fanatical...',
  },
  {
    value: 'keyshop',
    label: 'Keyshops',
    desc: 'G2A, Instant Gaming, Kinguin, CDKeys.com, GAMIVO, Eneba, HRK Game, K4G.com, Difmark...',
  },
];

const visible = signal(false);
const apiKey = signal(getFromStorage(STORAGE_KEYS.token, ''));
const showApiKey = signal(false);
const region = signal(getFromStorage(STORAGE_KEYS.region, DEFAULT_REGION));
const activeSubpages = signal(getFromStorage<Subpage[]>(STORAGE_KEYS.activeSubpages, DEFAULT_SUBPAGES));
const priceType = signal(getFromStorage<PriceType[]>(STORAGE_KEYS.priceType, DEFAULT_PRICE_TYPE));
const colors = signal(getFromStorage<string[]>(STORAGE_KEYS.colors, DEFAULT_COLORS));
const priceInStorage = signal(Object.keys(getFromStorage(STORAGE_KEYS.lastAppIds, {})).length);
const rateLimitLimit = signal(getFromStorage(STORAGE_KEYS.rateLimitLimit, '100'));
const rateLimitRemaining = signal(getFromStorage(STORAGE_KEYS.rateLimitRemaining, '0'));
const rateLimitReset = signal(getFromStorage(STORAGE_KEYS.rateLimitReset, '0'));

const resetTimeDisplay = computed(() => new Date(Number(rateLimitReset.value) * 1000).toLocaleString());

export function toggleSettingsPanel() {
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

function onRegionChange(val: string) {
  region.value = val;
  setToStorage(STORAGE_KEYS.region, val);
}

function onSubpageToggle(sub: Subpage) {
  const curr = [...activeSubpages.value];
  const idx = curr.indexOf(sub);
  if (idx >= 0) curr.splice(idx, 1);
  else curr.push(sub);
  activeSubpages.value = curr;
  setToStorage(STORAGE_KEYS.activeSubpages, curr);
}

function onPriceTypeToggle(pt: PriceType) {
  const curr = [...priceType.value];
  const idx = curr.indexOf(pt);
  if (idx >= 0) curr.splice(idx, 1);
  else curr.push(pt);
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
  applyColors(defaults);
}

function applyColors(c: string[]) {
  document.documentElement.style.setProperty('--priceColor', c[0] || DEFAULT_COLORS[0]);
  document.documentElement.style.setProperty('--hoverPriceColor', c[1] || DEFAULT_COLORS[1]);
  document.documentElement.style.setProperty('--priceBgColor', c[2] || DEFAULT_COLORS[2]);
}

function clearStorage() {
  removeFromStorage(STORAGE_KEYS.lastAppIds);
  priceInStorage.value = 0;
}

export function SettingsPanel() {
  if (!visible.value) return null;

  return (
    <div class="ggdeals-settings-overlay" onClick={() => (visible.value = false)}>
      <div class="ggdeals-settings-panel" onClick={(e) => e.stopPropagation()}>
        <header>
          <h1>GG.deals on Steam - Settings</h1>
          <button class="ggdeals-close-btn" onClick={() => (visible.value = false)}>✕</button>
        </header>
        <main>
          <h3>General</h3>
          <div class="optionBlock">
            <p>API key:</p>
            <button class="ggdeals-show-key" onClick={() => (showApiKey.value = !showApiKey.value)}>👁</button>
            <input
              type={showApiKey.value ? 'text' : 'password'}
              value={apiKey.value}
              onInput={(e) => onApiKeyChange((e.target as HTMLInputElement).value)}
            />
            <small>
              You can get your API key from{' '}
              <a href="https://gg.deals/api/" target="_blank">
                this page
              </a>
              .
            </small>
          </div>

          <div class="optionBlock">
            <p>Region:</p>
            <select value={region.value} onChange={(e) => onRegionChange((e.target as HTMLSelectElement).value)}>
              {REGIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div class="optionBlock">
            <p>
              Prices in storage: <b>{priceInStorage.value}</b>
            </p>
            <button class="ggdeals-btn" onClick={clearStorage}>Clear Storage</button>
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
                <a>{s.label}</a>
                <a class="desc">{s.desc}</a>
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
                <a>{pt.label}</a>
                <a class="desc">{pt.desc}</a>
              </label>
            ))}
          </div>

          <h3>Style</h3>
          <div class="optionBlock">
            <div class="ggdeals-colors">
              <div>
                <p>Primary color:</p>
                <input type="color" value={colors.value[0]} onInput={(e) => onColorChange(0, (e.target as HTMLInputElement).value)} />
              </div>
              <div>
                <p>Hover color:</p>
                <input type="color" value={colors.value[1]} onInput={(e) => onColorChange(1, (e.target as HTMLInputElement).value)} />
              </div>
              <div>
                <p>Background color:</p>
                <input type="color" value={colors.value[2]} onInput={(e) => onColorChange(2, (e.target as HTMLInputElement).value)} />
              </div>
            </div>
            <button class="ggdeals-btn" onClick={resetColors}>Default Style</button>
          </div>

          <h3>Ratelimit</h3>
          <p>
            Remaining API queries: <b>{rateLimitRemaining.value}</b> / <b>{rateLimitLimit.value}</b>
            <br />
            Reset time: <b>{resetTimeDisplay.value}</b>
          </p>
        </main>
      </div>
    </div>
  );
}
