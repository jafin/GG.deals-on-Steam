import { getAppIds } from '../api';
import { getFromStorage } from '../storage';
import type { AppMap, Subpage } from '../types';
import { waitForElm, getLowestPrice } from '../utils';

async function checkSimilarGame() {
  const morelike = document.querySelectorAll('[class*="buttonNext"]');
  for (let i = 0; i < 8; i++) {
    await new Promise((resolve) => setTimeout(resolve, i * 10));
    if (morelike.length > 0) (morelike[0] as HTMLElement).click();
  }
}

function setBundleGamePrice(apps: AppMap) {
  document.querySelectorAll('.tab_item.tablet_list_item').forEach(async (e) => {
    const id = e.querySelector<HTMLAnchorElement>('a[href*="store.steampowered.com/app/"]')?.href?.match(
      /\/(app)\/(\d+)/
    )?.[2];
    const app = apps[id!];

    const price = getLowestPrice(
      app?.prices?.currentRetail ?? null,
      app?.prices?.currentKeyshops ?? null,
      app?.prices?.currency ?? ''
    );
    if (price === 'N/A') return;

    const priceBlock = document.createElement('a');
    priceBlock.href = app?.url || '#';
    priceBlock.classList.add('ggdeals_bundle_price');
    priceBlock.innerText = price;
    priceBlock.style.opacity = (e as HTMLElement).classList.contains('ds_flagged') ? '0.5' : '1';

    e.append(priceBlock);
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
  });
}

export async function initBundle() {
  await waitForElm('.ImpressionTrackedElement');

  const activeSubpages = getFromStorage<Subpage[]>('activeSubpages', [
    'app', 'wishlist', 'bundle', 'cart', 'search', 'recommended',
  ]);
  if (!activeSubpages.includes('bundle')) return;

  if (document.querySelector('.ggdeals_similar_game_price')) return;
  await checkSimilarGame();
  const apps = await getAppIds();
  if (!apps) return;
  setBundleGamePrice(apps);
  setSimilarGamePrice(apps);
}
