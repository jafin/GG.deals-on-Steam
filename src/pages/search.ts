import { getAppIds } from '../api';
import { STORAGE_KEYS, DEFAULT_SUBPAGES, DEFAULT_PRICE_TYPE } from '../constants';
import { getFromStorage } from '../storage';
import type { AppMap, PriceType } from '../types';

const APP_ID_RE = /\/app\/(\d+)/;

function setSearchGamePrice(apps: AppMap) {
  const priceType = getFromStorage<PriceType[]>(STORAGE_KEYS.priceType, DEFAULT_PRICE_TYPE);
  const showOfficial = priceType.includes('official');
  const showKeyshop = priceType.includes('keyshop');

  for (const e of document.querySelectorAll<HTMLAnchorElement>('a[data-ds-appid]')) {
    if (e.querySelector('.ggdeals_search_prices')) continue;

    e.classList.add('ggdeals_used_price');
    const nameBlock = e.querySelector('.responsive_search_name_combined');
    if (!nameBlock) continue;

    const id = e.href?.match(APP_ID_RE)?.[1];
    if (!id) continue;
    const app = apps[id];
    if (!app?.prices) continue;

    const { currentRetail, currentKeyshops, currency } = app.prices;
    const url = app.url || '#';

    // Skip free-to-play games
    if (currentRetail === '0.00' && !currentKeyshops) continue;

    const container = document.createElement('div');
    container.classList.add('ggdeals_search_prices');

    if (showOfficial && currentRetail && currentRetail !== '0.00') {
      const link = document.createElement('a');
      link.href = url;
      link.classList.add('ggdeals_search_price_official');
      link.textContent = `${currentRetail} ${currency}`;
      link.title = 'Official shops \u2014 GG.deals';
      container.appendChild(link);
    }

    if (showKeyshop && currentKeyshops) {
      const link = document.createElement('a');
      link.href = url;
      link.classList.add('ggdeals_search_price_keyshop');
      link.textContent = `${currentKeyshops} ${currency}`;
      link.title = 'Keyshops \u2014 GG.deals';
      container.appendChild(link);
    }

    if (container.children.length === 0) continue;

    if (container.children.length === 1) {
      container.classList.add('ggdeals_search_prices--single');
    }

    nameBlock.appendChild(container);
  }
}

let refreshTimer: ReturnType<typeof setTimeout>;
let observer: MutationObserver;

async function refreshPrices() {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(async () => {
    const apps = await getAppIds();
    if (!apps) return;
    setSearchGamePrice(apps);

    const parent2 = document.querySelector('#search_results_loading');
    if (!parent2) return;
    observer.observe(parent2, {
      attributes: true,
      childList: true,
      subtree: false,
    });
  }, 500);
}

export async function initSearch() {
  console.debug('[GG.deals on Steam] Initializing search page');
  const activeSubpages = getFromStorage(STORAGE_KEYS.activeSubpages, DEFAULT_SUBPAGES);
  if (!activeSubpages.includes('search')) return;

  const parent = document.querySelector('#search_results');
  if (!parent) return;

  observer = new MutationObserver(() => refreshPrices());
  observer.observe(parent, {
    attributes: true,
    childList: true,
    subtree: false,
  });

  refreshPrices();
}
