import { STORAGE_KEYS, DEFAULT_REGION } from './constants';
import { getFromStorage, setToStorage, removeFromStorage } from './storage';
import type { AppMap } from './types';

function fetchURL(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      onload(response) {
        const limitHeader = /x-ratelimit-limit:\s*(\S+)/i.exec(response.responseHeaders);
        const remainingHeader = /x-ratelimit-remaining:\s*(\S+)/i.exec(response.responseHeaders);
        const resetHeader = /x-ratelimit-reset:\s*(\S+)/i.exec(response.responseHeaders);

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

const STALE_MS = 60 * 60 * 1000; // 1 hour

export async function getAppIds(): Promise<AppMap | null> {
  const cachedAt = Number(getFromStorage(STORAGE_KEYS.lastAppIdsTimestamp, 0));
  const isStale = Date.now() - cachedAt > STALE_MS;

  if (isStale) {
    removeFromStorage(STORAGE_KEYS.lastAppIds);
  }

  const lastAppIds: AppMap = getFromStorage(STORAGE_KEYS.lastAppIds, {});
  const appIds = new Set<string>();

  const APP_ID_RE = /\/app\/(\d+)/;
  document.querySelectorAll<HTMLAnchorElement>('[href*="store.steampowered.com/app/"]').forEach((e) => {
    const id = APP_ID_RE.exec(e.href)?.[1];
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

  const appIdsArray = Array.from(appIds);
  const region = getFromStorage(STORAGE_KEYS.region, DEFAULT_REGION);
  const chunks = Array.from(
    { length: Math.ceil(appIdsArray.length / 100) },
    (_, i) => appIdsArray.slice(i * 100, (i + 1) * 100),
  );

  const results = await Promise.all(
    chunks.map((chunk) =>
      fetchURL(`https://api.gg.deals/v1/prices/by-steam-app-id/?ids=${chunk}&key=${token}&region=${region}`)
    ),
  );

  let data: AppMap = {};
  for (const raw of results) {
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
  setToStorage(STORAGE_KEYS.lastAppIdsTimestamp, Date.now());
  console.log(`[GG.deals on Steam] From Fetch: ${appIds.size}`);
  return merged;
}
