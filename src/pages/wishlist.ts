import { getAppIds } from '../api';
import { getFromStorage } from '../storage';
import type { AppMap, Subpage } from '../types';
import { waitForElm, checkPrice } from '../utils';

function setWishlistGamePrice(apps: AppMap) {
  document.querySelectorAll<HTMLElement>('div[data-index]').forEach(async (e) => {
    const button = e.querySelector('[class*="Focusable"] span');
    if (!button || e.querySelector('.ggdeals_wishlist_price')) return;

    const id = e.querySelector<HTMLAnchorElement>('a[href*="store.steampowered.com/app/"]')?.href?.match(
      /\/(app)\/(\d+)/
    )?.[2];
    const app = apps[id!];

    const price = checkPrice(app);
    if (!price) return;

    const priceBlock = document.createElement('a');
    priceBlock.href = app?.url || '#';
    priceBlock.classList.add('ggdeals_wishlist_price');
    priceBlock.innerText = price;

    button.parentElement?.after(priceBlock);
    button.parentElement?.parentElement?.parentElement?.classList.add('ggdeals_wishlist_priceBox');
  });
}

let refreshTimer: ReturnType<typeof setTimeout>;

async function refreshPrices() {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(async () => {
    document.querySelectorAll('.ggdeals_wishlist_price').forEach((e) => e.remove());
    const apps = await getAppIds();
    if (!apps) return;
    setWishlistGamePrice(apps);
  }, 800);
}

export async function initWishlist() {
  await waitForElm('section > div:last-of-type > div:last-of-type div div');

  const activeSubpages = getFromStorage<Subpage[]>('activeSubpages', [
    'app', 'wishlist', 'bundle', 'cart', 'search', 'recommended',
  ]);
  if (!activeSubpages.includes('wishlist')) return;

  refreshPrices();

  const observer = new MutationObserver(() => refreshPrices());
  const observer2 = new MutationObserver(() => {
    refreshPrices();
    const itemsPanel = document.querySelector('section > div:last-of-type > div:last-of-type div');
    const itemsPanel2 = document.querySelector('section > div:last-of-type > div:last-of-type div div');
    if (itemsPanel)
      observer.observe(itemsPanel, { attributes: true, childList: true, subtree: false });
    if (itemsPanel2)
      observer.observe(itemsPanel2, { attributes: true, childList: true, subtree: false });
  });

  setTimeout(() => {
    const section = document.querySelector('section > div:last-of-type');
    if (section) observer2.observe(section, { attributes: true, childList: true, subtree: false });

    const panel = document.querySelector('section > div:last-of-type > div:last-of-type div');
    if (panel) observer.observe(panel, { attributes: true, childList: true, subtree: false });

    const panel2 = document.querySelector('section > div:last-of-type > div:last-of-type div div');
    if (panel2) observer.observe(panel2, { attributes: true, childList: true, subtree: false });
  }, 300);
}
