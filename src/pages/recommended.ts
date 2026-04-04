import { getAppIds } from '../api';
import { getFromStorage } from '../storage';
import type { AppMap, Subpage } from '../types';
import { waitForElm, checkPrice } from '../utils';

async function setMainRecommendedGamePrice(apps: AppMap) {
  const id = window.location.href.match(/\/(app)\/(\d+)/)?.[2];
  if (!id) return;
  const app = apps[id];

  const price = checkPrice(app);
  if (!price) return;

  const priceBlock = document.createElement('a');
  priceBlock.href = app?.url || '#';
  priceBlock.classList.add('ggdeals_main_recommended_price');
  priceBlock.innerText = price;

  document.querySelector('.highlight_description div')?.append(priceBlock);
}

function setRecommendedGamePrice(apps: AppMap) {
  document.querySelectorAll('.recommendation_area_ctn .similar_grid_item').forEach(async (e) => {
    if (['freegames3', 'demogames3'].includes((e.parentNode as HTMLElement)?.id)) return;
    const id = e.querySelector<HTMLAnchorElement>('a[href*="store.steampowered.com/app/"]')?.href?.match(
      /\/(app)\/(\d+)/
    )?.[2];
    if (!id) return;
    const app = apps[id];

    const price = checkPrice(app);
    if (!price) return;

    const priceBlock = document.createElement('a');
    priceBlock.href = app?.url || '#';
    priceBlock.classList.add('ggdeals_recommended_price');
    priceBlock.innerText = price;

    e.append(priceBlock);
  });
}

export async function initRecommended() {
  await waitForElm('#topselling');

  const activeSubpages = getFromStorage<Subpage[]>('activeSubpages', [
    'app', 'wishlist', 'bundle', 'cart', 'search', 'recommended',
  ]);
  if (!activeSubpages.includes('recommended')) return;

  if (document.querySelector('.ggdeals_recommended_price')) return;
  const apps = await getAppIds();
  if (!apps) return;
  setMainRecommendedGamePrice(apps);
  setRecommendedGamePrice(apps);
}
