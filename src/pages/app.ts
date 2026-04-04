import { getAppIds } from '../api';
import { STORAGE_KEYS, DEFAULT_SUBPAGES } from '../constants';
import { getFromStorage } from '../storage';
import type { AppMap, Subpage } from '../types';
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

  if (
    !app.prices?.currentRetail ||
    (app.prices.currentRetail === '0.00' &&
      app.prices.historicalRetail === '0.00' &&
      !app.prices.currentKeyshops &&
      !app.prices.historicalKeyshops)
  )
    return;

  const historyBlock = document.createElement('a');
  historyBlock.href = app.url || '#';
  historyBlock.classList.add('ggdeals_price_history');

  const img = document.createElement('img');
  img.src = 'https://github.com/Juzlus/GG.deals-on-Steam/blob/server/icons/ggdeals_logo_white.png?raw=true';

  const infoDiv = document.createElement('div');

  const currentP = document.createElement('p');
  currentP.classList.add('ggdeals_current');
  currentP.append('Current price is ');
  const retailPrice = document.createElement('b');
  retailPrice.classList.add('ggdeals_price');
  retailPrice.textContent = `${app.prices.currentRetail} ${app.prices.currency}`;
  currentP.append(retailPrice, ' at Official shops');
  if (app.prices.currentKeyshops) {
    const keyshopPrice = document.createElement('b');
    keyshopPrice.classList.add('ggdeals_price');
    keyshopPrice.textContent = `${app.prices.currentKeyshops} ${app.prices.currency}`;
    currentP.append(' and ', keyshopPrice, ' at Keyshops');
  }

  const lowestP = document.createElement('p');
  lowestP.classList.add('ggdeals_lowest');
  lowestP.append('The lowest price recorded is ');
  const histRetail = document.createElement('a');
  histRetail.classList.add('ggdeals_price');
  histRetail.textContent = `${app.prices.historicalRetail} ${app.prices.currency}`;
  lowestP.append(histRetail, ' at Official shops');
  if (app.prices.historicalKeyshops) {
    const histKeyshop = document.createElement('a');
    histKeyshop.classList.add('ggdeals_price');
    histKeyshop.textContent = `${app.prices.historicalKeyshops} ${app.prices.currency}`;
    lowestP.append(' and ', histKeyshop, ' at Keyshops');
  }

  infoDiv.append(currentP, lowestP);
  historyBlock.append(img, infoDiv);

  document.querySelector('#game_area_purchase')?.prepend(historyBlock);
}

export async function initApp() {
  if (!await waitForElm('.CapsuleDecorators')) return;

  const activeSubpages = getFromStorage<Subpage[]>(STORAGE_KEYS.activeSubpages, DEFAULT_SUBPAGES);
  if (!activeSubpages.includes('app')) return;

  if (document.querySelector('.ggdeals_similar_game_price')) return;
  await clickCarouselButtons([0, 2]);
  const apps = await getAppIds();
  if (!apps) return;
  setDLCPrice(apps);
  setSimilarGamePrice(apps, { removeExtra: true });
  setPriceHistory(apps);
}
