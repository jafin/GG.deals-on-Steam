import { render } from 'preact';
import { STORAGE_KEYS, DEFAULT_COLORS } from './constants';
import { injectStyles } from './styles';
import { getFromStorage } from './storage';
import { waitForElm } from './utils';
import { applyColors } from './colors';
import { SettingsButton } from './components/SettingsButton';
import { SettingsPanel } from './components/SettingsPanel';
import { initApp } from './pages/app';
import { initBundle } from './pages/bundle';
import { initCart } from './pages/cart';
import { initRecommended } from './pages/recommended';
import { initSearch } from './pages/search';
import { initWishlist } from './pages/wishlist';

function updateColors() {
  applyColors(getFromStorage(STORAGE_KEYS.colors, DEFAULT_COLORS));
}

function mountSettingsButton() {
  if (document.querySelector('#ggdeals_settings_btn')) return;

  const loginLink = document.querySelector<HTMLAnchorElement>(
    'a.global_action_link[href*="https://store.steampowered.com/login/"]'
  );
  const notifArea = document.getElementById('header_notification_area');
  const envelope = document.getElementById('green_envelope_menu_root');

  let anchor: Element | null = null;
  let position: InsertPosition = 'beforebegin';

  if (loginLink) {
    anchor = loginLink;
  } else if (notifArea) {
    anchor = notifArea;
  } else if (envelope?.parentNode?.parentNode) {
    anchor = envelope.parentNode.parentNode as Element;
  }

  if (!anchor) return;

  const container = document.createElement('span');
  anchor.insertAdjacentElement(position, container);
  render(<SettingsButton />, container);
}

function mountSettingsPanel() {
  const container = document.createElement('div');
  container.id = 'ggdeals-settings-root';
  document.body.appendChild(container);
  render(<SettingsPanel />, container);
}

function detectPageAndInit() {
  const href = location.href;

  if (href.includes('/app/')) {
    initApp();
  } else if (href.includes('/bundle/')) {
    initBundle();
  } else if (href.includes('/cart')) {
    initCart();
  } else if (href.includes('/recommended/morelike/')) {
    initRecommended();
  } else if (href.includes('/search')) {
    initSearch();
  } else if (href.includes('/wishlist/')) {
    initWishlist();
  }
}

function main() {
  injectStyles();
  mountSettingsPanel();

  waitForElm('#global_header').then((el) => {
    if (!el) return;
    mountSettingsButton();
    updateColors();
  });

  detectPageAndInit();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
