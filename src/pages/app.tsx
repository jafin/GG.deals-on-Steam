import { render } from 'preact';
import { getAppIds } from '../api';
import { PriceHistory } from '../components/PriceHistory';
import { STORAGE_KEYS, DEFAULT_SUBPAGES } from '../constants';
import { getFromStorage } from '../storage';
import type { AppMap } from '../types';
import { waitForElm, getLowestPrice, clickCarouselButtons, setSimilarGamePrice } from '../utils';

function setDLCPrice(apps: AppMap) {
  for (const e of document.querySelectorAll<HTMLAnchorElement>('.game_area_dlc_row')) {
    const id = e.href?.match(/\/(app)\/(\d+)/)?.[2];
    if (!id) continue;
    const app = apps[id];
    const dlcPrice = e.querySelector<HTMLElement>('.game_area_dlc_price');
    if (dlcPrice) dlcPrice.style.marginRight = '80px';

    const priceBlock = document.createElement('a');
    priceBlock.href = app?.url || '#';
    priceBlock.classList.add('ggdeals_dlc_price');
    priceBlock.innerText = getLowestPrice(
      app?.prices?.currentRetail ?? null,
      app?.prices?.currentKeyshops ?? null,
      app?.prices?.currency ?? ''
    );
    e.prepend(priceBlock);
  }
}

function setPriceHistory(apps: AppMap) {
  const id = window.location.href.match(/\/(app)\/(\d+)/)?.[2];
  if (!id) return;
  const app = apps[id];
  if (!app) return;

  const { prices } = app;
  if (
    !prices?.currentRetail ||
    !prices.historicalRetail ||
    (prices.currentRetail === '0.00' &&
      prices.historicalRetail === '0.00' &&
      !prices.currentKeyshops &&
      !prices.historicalKeyshops)
  )
    return;

  const container = document.createElement('div');
  document.querySelector('#game_area_purchase')?.prepend(container);
  render(
    <PriceHistory url={app.url || '#'} prices={{ ...prices, currentRetail: prices.currentRetail, historicalRetail: prices.historicalRetail }} />,
    container,
  );
}

export async function initApp() {
  if (!await waitForElm('.CapsuleDecorators')) return;

  const activeSubpages = getFromStorage(STORAGE_KEYS.activeSubpages, DEFAULT_SUBPAGES);
  if (!activeSubpages.includes('app')) return;

  if (document.querySelector('.ggdeals_similar_game_price')) return;
  await clickCarouselButtons([0, 2]);
  const apps = await getAppIds();
  if (!apps) return;
  setDLCPrice(apps);
  setSimilarGamePrice(apps, { removeExtra: true });
  setPriceHistory(apps);
}
