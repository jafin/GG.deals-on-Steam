import { getAppIds } from '../api';
import { getFromStorage } from '../storage';
import type { AppMap, Subpage } from '../types';
import { waitForElm, checkPrice } from '../utils';

function setMainCartGamePrice(apps: AppMap) {
  document
    .querySelectorAll<HTMLAnchorElement>(`div.Panel.Focusable div.Panel.Focusable a[href*='/app/']:not(.Focusable)`)
    .forEach(async (e) => {
      const priceText = e.parentNode?.parentElement?.querySelector('span div');
      if (!priceText) return;

      const id = e.href?.match(/\/(app)\/(\d+)/)?.[2];
      const app = apps[id!];

      const price = checkPrice(app);
      if (!price) return;

      const priceBlock = document.createElement('a');
      priceBlock.href = app?.url || '#';
      priceBlock.classList.add('ggdeals_main_cart_price');
      priceBlock.innerText = price;

      e.parentElement?.after(priceBlock);
    });
}

function setRecommendationCartGamePrice(apps: AppMap) {
  document
    .querySelectorAll<HTMLAnchorElement>(`div.Panel.Focusable div.Panel.Focusable a[href*='/app/'].Focusable`)
    .forEach(async (e) => {
      const priceText = e.parentNode?.parentElement?.parentElement?.querySelector('.StoreSalePriceWidgetContainer');
      if (!priceText) return;

      const id = e.href?.match(/\/(app)\/(\d+)/)?.[2];
      const app = apps[id!];

      const price = checkPrice(app);
      if (!price) return;

      const priceBlock = document.createElement('a');
      priceBlock.href = app?.url || '#';
      priceBlock.classList.add('ggdeals_other_cart_price');
      priceBlock.innerText = price;

      (priceText as HTMLElement).parentElement?.parentElement?.parentElement?.parentElement?.append(priceBlock);
    });
}

export async function initCart() {
  await waitForElm('.ImpressionTrackedElement');

  const activeSubpages = getFromStorage<Subpage[]>('activeSubpages', [
    'app', 'wishlist', 'bundle', 'cart', 'search', 'recommended',
  ]);
  if (!activeSubpages.includes('cart')) return;

  if (document.querySelector('.ggdeals_main_cart_price')) return;
  const apps = await getAppIds();
  if (!apps) return;
  setMainCartGamePrice(apps);
  setRecommendationCartGamePrice(apps);
}
