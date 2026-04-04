import { getAppIds } from '../api';
import { STORAGE_KEYS, DEFAULT_SUBPAGES } from '../constants';
import { getFromStorage } from '../storage';
import type { AppMap } from '../types';
import { waitForElm, getLowestPrice, clickCarouselButtons, setSimilarGamePrice } from '../utils';

function setBundleGamePrice(apps: AppMap) {
  for (const e of document.querySelectorAll('.tab_item.tablet_list_item')) {
    const id = e.querySelector<HTMLAnchorElement>('a[href*="store.steampowered.com/app/"]')?.href?.match(
      /\/(app)\/(\d+)/
    )?.[2];
    if (!id) continue;
    const app = apps[id];

    const price = getLowestPrice(
      app?.prices?.currentRetail ?? null,
      app?.prices?.currentKeyshops ?? null,
      app?.prices?.currency ?? ''
    );
    if (price === 'N/A') continue;

    const priceBlock = document.createElement('a');
    priceBlock.href = app?.url || '#';
    priceBlock.classList.add('ggdeals_bundle_price');
    priceBlock.innerText = price;
    priceBlock.style.opacity = (e as HTMLElement).classList.contains('ds_flagged') ? '0.5' : '1';

    e.append(priceBlock);
  }
}

export async function initBundle() {
  if (!await waitForElm('.ImpressionTrackedElement')) return;

  const activeSubpages = getFromStorage(STORAGE_KEYS.activeSubpages, DEFAULT_SUBPAGES);
  if (!activeSubpages.includes('bundle')) return;

  if (document.querySelector('.ggdeals_similar_game_price')) return;
  await clickCarouselButtons([0]);
  const apps = await getAppIds();
  if (!apps) return;
  setBundleGamePrice(apps);
  setSimilarGamePrice(apps);
}
