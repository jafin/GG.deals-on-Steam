import { getAppIds } from '../api';
import { STORAGE_KEYS, DEFAULT_SUBPAGES } from '../constants';
import { getFromStorage } from '../storage';
import type { AppMap, Subpage } from '../types';
import { checkPrice } from '../utils';

function setSearchGamePrice(apps: AppMap) {
  document.querySelectorAll<HTMLAnchorElement>('a[data-ds-appid]').forEach(async (e) => {
    if (e.querySelector('.ggdeals_search_price')) return;

    e.classList.add('ggdeals_used_price');
    const priceText = e.querySelector('.discount_final_price');
    if (!priceText) return;

    const id = e.href?.match(/\/(app)\/(\d+)/)?.[2];
    if (!id) return;
    const app = apps[id];

    const price = checkPrice(app);
    if (!price) return;

    const priceBlock = document.createElement('a');
    priceBlock.href = app?.url || '#';
    priceBlock.classList.add('ggdeals_search_price');
    priceBlock.innerText = price;

    e.querySelector('.discount_final_price')?.before(priceBlock);
  });
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
  const activeSubpages = getFromStorage<Subpage[]>(STORAGE_KEYS.activeSubpages, DEFAULT_SUBPAGES);
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
