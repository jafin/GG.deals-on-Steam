import { getAppIds } from '../api';
import { STORAGE_KEYS, DEFAULT_SUBPAGES } from '../constants';
import { getFromStorage } from '../storage';
import type { AppMap, Subpage } from '../types';
import { waitForElm, checkPrice } from '../utils';

function setMainCartGamePrice(apps: AppMap) {
  for (const e of document.querySelectorAll<HTMLAnchorElement>(`div.Panel.Focusable div.Panel.Focusable a[href*='/app/']:not(.Focusable)`)) {
    const priceText = e.parentNode?.parentElement?.querySelector('span div');
    if (!priceText) continue;

    const id = e.href?.match(/\/(app)\/(\d+)/)?.[2];
    if (!id) continue;
    const app = apps[id];

    const price = checkPrice(app);
    if (!price) continue;

    const priceBlock = document.createElement('a');
    priceBlock.href = app?.url || '#';
    priceBlock.classList.add('ggdeals_main_cart_price');
    priceBlock.innerText = price;

    e.parentElement?.after(priceBlock);
  }
}

function setRecommendationCartGamePrice(apps: AppMap) {
  for (const e of document.querySelectorAll<HTMLAnchorElement>(`div.Panel.Focusable div.Panel.Focusable a[href*='/app/'].Focusable`)) {
    const priceText = e.parentNode?.parentElement?.parentElement?.querySelector('.StoreSalePriceWidgetContainer');
    if (!priceText) continue;

    const id = e.href?.match(/\/(app)\/(\d+)/)?.[2];
    if (!id) continue;
    const app = apps[id];

    const price = checkPrice(app);
    if (!price) continue;

    const priceBlock = document.createElement('a');
    priceBlock.href = app?.url || '#';
    priceBlock.classList.add('ggdeals_other_cart_price');
    priceBlock.innerText = price;

    (priceText as HTMLElement).parentElement?.parentElement?.parentElement?.parentElement?.append(priceBlock);
  }
}

export async function initCart() {
  if (!await waitForElm('.ImpressionTrackedElement')) return;

  const activeSubpages = getFromStorage<Subpage[]>(STORAGE_KEYS.activeSubpages, DEFAULT_SUBPAGES);
  if (!activeSubpages.includes('cart')) return;

  if (document.querySelector('.ggdeals_main_cart_price')) return;
  const apps = await getAppIds();
  if (!apps) return;
  setMainCartGamePrice(apps);
  setRecommendationCartGamePrice(apps);
}
