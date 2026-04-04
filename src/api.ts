import { getFromStorage, setToStorage, removeFromStorage } from './storage';
import type { AppMap, RateLimitHeaders } from './types';

function fetchURL(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      onload(response) {
        const limitHeader = response.responseHeaders.match(/x-ratelimit-limit:\s*(\S+)/i);
        const remainingHeader = response.responseHeaders.match(/x-ratelimit-remaining:\s*(\S+)/i);
        const resetHeader = response.responseHeaders.match(/x-ratelimit-reset:\s*(\S+)/i);

        setToStorage('x-ratelimit-limit', limitHeader?.[1] ?? null);
        setToStorage('x-ratelimit-remaining', remainingHeader?.[1] ?? null);
        setToStorage('x-ratelimit-reset', resetHeader?.[1] ?? null);

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
  const reset = Number(getFromStorage('x-ratelimit-reset', 0));
  const remaining = Number(getFromStorage('x-ratelimit-remaining', 0));
  const firstUpdate = Number(getFromStorage('firstUpdate', 0));

  if (checkDate(reset, 3600) || (remaining > 40 && checkDate(firstUpdate, 3600))) {
    removeFromStorage('lastAppIds');
    setToStorage('firstUpdate', Math.floor(Date.now() / 1000));
  }

  const lastAppIds: AppMap = getFromStorage('lastAppIds', {});
  const appIds = new Set<string>();

  document.querySelectorAll<HTMLAnchorElement>('[href*="store.steampowered.com/app/"]').forEach((e) => {
    const id = e.href.match(/\/(app)\/(\d+)/)?.[2];
    if (id && !(id in lastAppIds) && !e.classList.contains('ggdeals_used_price')) {
      appIds.add(id);
    }
  });

  if (appIds.size === 0) {
    console.log('[GG.deals on Steam] From Storage');
    return lastAppIds;
  }

  const token = getFromStorage<string | null>('token', null);
  if (!token) return null;

  let data: AppMap = {};
  const appIdsArray = Array.from(appIds);
  const region = getFromStorage('region', 'us');

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
  setToStorage('lastAppIds', merged);
  console.log(`[GG.deals on Steam] From Fetch: ${appIds.size}`);
  return merged;
}
