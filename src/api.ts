import { STORAGE_KEYS, DEFAULT_REGION } from './constants';
import { getFromStorage, setToStorage, removeFromStorage } from './storage';
import type { AppMap } from './types';

function fetchURL(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      onload(response) {
        const limitHeader = response.responseHeaders.match(/x-ratelimit-limit:\s*(\S+)/i);
        const remainingHeader = response.responseHeaders.match(/x-ratelimit-remaining:\s*(\S+)/i);
        const resetHeader = response.responseHeaders.match(/x-ratelimit-reset:\s*(\S+)/i);

        setToStorage(STORAGE_KEYS.rateLimitLimit, limitHeader?.[1] ?? null);
        setToStorage(STORAGE_KEYS.rateLimitRemaining, remainingHeader?.[1] ?? null);
        setToStorage(STORAGE_KEYS.rateLimitReset, resetHeader?.[1] ?? null);

        if (response.status === 429) {
          console.warn('[GG.deals on Steam] Rate limited: 1000 games/hour exceeded.');
          resolve(null);
        } else if (response.status === 400) {
          console.warn('[GG.deals on Steam] Invalid API key.');
          resolve(null);
        } else if (response.status >= 200 && response.status < 300) {
          resolve(response.responseText);
        } else {
          resolve(null);
        }
      },
      onerror() {
        resolve(null);
      },
    });
  });
}

function checkDate(timestamp: number, extra: number): boolean {
  const now = Math.floor(Date.now() / 1000);
  return timestamp + extra < now;
}

export async function getAppIds(): Promise<AppMap | null> {
  const reset = Number(getFromStorage(STORAGE_KEYS.rateLimitReset, 0));
  const remaining = Number(getFromStorage(STORAGE_KEYS.rateLimitRemaining, 0));
  const firstUpdate = Number(getFromStorage(STORAGE_KEYS.firstUpdate, 0));

  if (checkDate(reset, 3600) || (remaining > 40 && checkDate(firstUpdate, 3600))) {
    removeFromStorage(STORAGE_KEYS.lastAppIds);
    setToStorage(STORAGE_KEYS.firstUpdate, Math.floor(Date.now() / 1000));
  }

  const lastAppIds: AppMap = getFromStorage(STORAGE_KEYS.lastAppIds, {});
  const appIds = new Set<string>();

  document.querySelectorAll<HTMLAnchorElement>('[href*="store.steampowered.com/app/"]').forEach((e) => {
    const id = new RegExp(/\/(app)\/(\d+)/).exec(e.href)?.[2];
    if (id && !(id in lastAppIds) && !e.classList.contains('ggdeals_used_price')) {
      appIds.add(id);
    }
  });

  if (appIds.size === 0) {
    console.log('[GG.deals on Steam] From Storage');
    return lastAppIds;
  }

  const token = getFromStorage<string | null>(STORAGE_KEYS.token, null);
  if (!token) return null;

  let data: AppMap = {};
  const appIdsArray = Array.from(appIds);
  const region = getFromStorage(STORAGE_KEYS.region, DEFAULT_REGION);

  for (let i = 0; i < Math.ceil(appIdsArray.length / 100); i++) {
    const chunk = appIdsArray.slice(i * 100, (i + 1) * 100);
    const raw = await fetchURL(
      `https://api.gg.deals/v1/prices/by-steam-app-id/?ids=${chunk.toString()}&key=${token}&region=${region}`
    );
    if (raw) {
      try {
        data = { ...data, ...JSON.parse(raw)?.data };
      } catch {
        console.warn('[GG.deals on Steam] Failed to parse API response');
      }
    }
  }

  const merged = { ...lastAppIds, ...data };
  setToStorage(STORAGE_KEYS.lastAppIds, merged);
  console.log(`[GG.deals on Steam] From Fetch: ${appIds.size}`);
  return merged;
}
