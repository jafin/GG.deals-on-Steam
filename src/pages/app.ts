import { getAppIds } from '../api';
import { getFromStorage } from '../storage';
import type { AppMap, Subpage } from '../types';
import { waitForElm, getLowestPrice } from '../utils';

async function checkSimilarGame() {
  const morelike = document.querySelectorAll('[class*="buttonNext"]');
  for (let i = 0; i < 8; i++) {
    await new Promise((resolve) => setTimeout(resolve, i * 10));
    if (morelike.length > 0) (morelike[0] as HTMLElement).click();
    if (morelike.length > 2) (morelike[2] as HTMLElement).click();
  }
}

function setDLCPrice(apps: AppMap) {
  document.querySelectorAll<HTMLAnchorElement>('.game_area_dlc_row').forEach(async (e) => {
    const id = e.href?.match(/\/(app)\/(\d+)/)?.[2];
    const app = apps[id!];
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
  });
}

function setSimilarGamePrice(apps: AppMap) {
  document.querySelectorAll('.ImpressionTrackedElement').forEach(async (e) => {
    const id = e.querySelector<HTMLAnchorElement>('a[href*="store.steampowered.com/app/"]')?.href?.match(
      /\/(app)\/(\d+)/
    )?.[2];
    const freeLabel = e.querySelector<HTMLElement>('.StoreSalePriceWidgetContainer div');
    if (freeLabel?.innerText === 'Free to Play') return;
    const app = apps[id!];

    const price = getLowestPrice(
      app?.prices?.currentRetail ?? null,
      app?.prices?.currentKeyshops ?? null,
      app?.prices?.currency ?? ''
    );
    if (price === 'N/A') return;

    const priceBlock = document.createElement('a');
    priceBlock.href = app?.url || '#';
    priceBlock.classList.add('ggdeals_similar_game_price');
    priceBlock.innerText = price;
    const bar = e.querySelector<HTMLElement>('.CapsuleBottomBar');
    if (bar) priceBlock.style.opacity = window.getComputedStyle(bar).opacity;

    e.prepend(priceBlock);
    e.querySelector('._2_KY_e11FV0ftXR2_7TMmP')?.remove();
  });
}

function setPriceHistory(apps: AppMap) {
  const id = window.location.href.match(/\/(app)\/(\d+)/)?.[2];
  const app = apps[id!];
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
  historyBlock.innerHTML =
    `<img src="https://github.com/Juzlus/GG.deals-on-Steam/blob/server/icons/ggdeals_logo_white.png?raw=true"></img><div>` +
    `<p class="ggdeals_current">Current price is <b class="ggdeals_price">${app.prices.currentRetail} ${app.prices.currency}</b> at Official shops` +
    (app.prices.currentKeyshops
      ? ` and <b class="ggdeals_price">${app.prices.currentKeyshops} ${app.prices.currency}</b> at Keyshops`
      : '') +
    `</p>` +
    `<p class="ggdeals_lowest">The lowest price recorded is <a class="ggdeals_price">${app.prices.historicalRetail} ${app.prices.currency}</a> at Official shops` +
    (app.prices.historicalKeyshops
      ? ` and <a class="ggdeals_price">${app.prices.historicalKeyshops} ${app.prices.currency}</a> at Keyshops`
      : '') +
    `</p></div>`;

  document.querySelector('#game_area_purchase')?.prepend(historyBlock);
}

export async function initApp() {
  await waitForElm('.CapsuleDecorators');

  const activeSubpages = getFromStorage<Subpage[]>('activeSubpages', [
    'app', 'wishlist', 'bundle', 'cart', 'search', 'recommended',
  ]);
  if (!activeSubpages.includes('app')) return;

  if (document.querySelector('.ggdeals_similar_game_price')) return;
  await checkSimilarGame();
  const apps = await getAppIds();
  if (!apps) return;
  setDLCPrice(apps);
  setSimilarGamePrice(apps);
  setPriceHistory(apps);
}
