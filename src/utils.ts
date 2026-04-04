import { getFromStorage } from './storage';
import type { AppData, PriceType } from './types';

export function waitForElm(selector: string): Promise<Element> {
  return new Promise((resolve) => {
    const existing = document.querySelector(selector);
    if (existing) return resolve(existing);

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        resolve(el);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

export function getLowestPrice(
  officialStorePrice: string | null,
  keyshopPrice: string | null,
  currency: string
): string {
  const priceType = getFromStorage<PriceType[]>('priceType', ['official', 'keyshop']);

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
