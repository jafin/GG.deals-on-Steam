import { getAppIds } from '../api';
import { STORAGE_KEYS, DEFAULT_SUBPAGES } from '../constants';
import { getFromStorage } from '../storage';
import type { AppMap, Subpage } from '../types';
import { waitForElm, checkPrice } from '../utils';

function setMainRecommendedGamePrice(apps: AppMap) {
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
  for (const e of document.querySelectorAll('.recommendation_area_ctn .similar_grid_item')) {
    if (['freegames3', 'demogames3'].includes((e.parentNode as HTMLElement)?.id)) continue;
    const id = e.querySelector<HTMLAnchorElement>('a[href*="store.steampowered.com/app/"]')?.href?.match(
      /\/(app)\/(\d+)/
    )?.[2];
    if (!id) continue;
    const app = apps[id];

    const price = checkPrice(app);
    if (!price) continue;

    const priceBlock = document.createElement('a');
    priceBlock.href = app?.url || '#';
    priceBlock.classList.add('ggdeals_recommended_price');
    priceBlock.innerText = price;

    e.append(priceBlock);
  }
}

export async function initRecommended() {
  if (!await waitForElm('#topselling')) return;

  const activeSubpages = getFromStorage<Subpage[]>(STORAGE_KEYS.activeSubpages, DEFAULT_SUBPAGES);
  if (!activeSubpages.includes('recommended')) return;

  if (document.querySelector('.ggdeals_recommended_price')) return;
  const apps = await getAppIds();
  if (!apps) return;
  setMainRecommendedGamePrice(apps);
  setRecommendedGamePrice(apps);
}
