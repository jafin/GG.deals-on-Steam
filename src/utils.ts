import { STORAGE_KEYS, DEFAULT_PRICE_TYPE } from './constants';
import { getFromStorage } from './storage';
import type { AppData, AppMap, PriceType } from './types';

export function waitForElm(selector: string, timeout = 30000): Promise<Element | null> {
  return new Promise((resolve) => {
    const existing = document.querySelector(selector);
    if (existing) return resolve(existing);

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearTimeout(timer);
        observer.disconnect();
        resolve(el);
      }
    });

    const timer = setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);

    observer.observe(document.body, { childList: true, subtree: true });
  });
}

export function getLowestPrice(
  officialStorePrice: string | null,
  keyshopPrice: string | null,
  currency: string
): string {
  const priceType = getFromStorage<PriceType[]>(STORAGE_KEYS.priceType, DEFAULT_PRICE_TYPE);

  let price: string | null;
  if (priceType.length === 2) {
    if (officialStorePrice == null && keyshopPrice == null) price = null;
    else if (officialStorePrice == null) price = keyshopPrice;
    else if (keyshopPrice == null) price = officialStorePrice;
    else price = parseFloat(officialStorePrice) > parseFloat(keyshopPrice) ? keyshopPrice : officialStorePrice;
  } else if (priceType.includes('official')) {
    price = officialStorePrice;
  } else {
    price = keyshopPrice;
  }

  return price == null ? 'N/A' : `${price} ${currency}`;
}

export function checkPrice(app: AppData | undefined): string | null {
  if (
    !app?.prices?.currentRetail ||
    (app.prices.currentRetail === '0.00' &&
      app.prices.historicalRetail === '0.00' &&
      !app.prices.currentKeyshops &&
      !app.prices.historicalKeyshops)
  ) {
    return null;
  }

  const price = getLowestPrice(app.prices.currentRetail, app.prices.currentKeyshops, app.prices.currency);
  return price === 'N/A' ? null : price;
}

export async function clickCarouselButtons(buttonIndices: number[]): Promise<void> {
  const morelike = document.querySelectorAll('[class*="buttonNext"]');
  for (let i = 0; i < 8; i++) {
    await new Promise((resolve) => setTimeout(resolve, i * 10));
    for (const idx of buttonIndices) {
      if (morelike.length > idx) (morelike[idx] as HTMLElement).click();
    }
  }
}

export function setSimilarGamePrice(apps: AppMap, { removeExtra = false } = {}): void {
  for (const e of document.querySelectorAll('.ImpressionTrackedElement')) {
    const id = e.querySelector<HTMLAnchorElement>('a[href*="store.steampowered.com/app/"]')?.href?.match(
      /\/(app)\/(\d+)/
    )?.[2];
    if (!id) return;
    const freeLabel = e.querySelector<HTMLElement>('.StoreSalePriceWidgetContainer div');
    if (freeLabel?.innerText === 'Free to Play') continue;
    const app = apps[id];

    const price = getLowestPrice(
      app?.prices?.currentRetail ?? null,
      app?.prices?.currentKeyshops ?? null,
      app?.prices?.currency ?? ''
    );
    if (price === 'N/A') continue;

    const priceBlock = document.createElement('a');
    priceBlock.href = app?.url || '#';
    priceBlock.classList.add('ggdeals_similar_game_price');
    priceBlock.innerText = price;
    const bar = e.querySelector<HTMLElement>('.CapsuleBottomBar');
    if (bar) priceBlock.style.opacity = window.getComputedStyle(bar).opacity;

    e.prepend(priceBlock);
    if (removeExtra) e.querySelector('._2_KY_e11FV0ftXR2_7TMmP')?.remove();
  }
}
