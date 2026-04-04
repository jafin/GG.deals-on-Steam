import { render } from 'preact';
import { STORAGE_KEYS, DEFAULT_COLORS } from './constants';
import { injectStyles } from './styles';
import { getFromStorage, setToStorage } from './storage';
import { waitForElm } from './utils';
import { SettingsPanel, toggleSettingsPanel } from './components/SettingsPanel';
import { initApp } from './pages/app';
import { initBundle } from './pages/bundle';
import { initCart } from './pages/cart';
import { initRecommended } from './pages/recommended';
import { initSearch } from './pages/search';
import { initWishlist } from './pages/wishlist';

function updateColors() {
  const colors = getFromStorage(STORAGE_KEYS.colors, DEFAULT_COLORS);
  document.documentElement.style.setProperty('--priceColor', colors[0] || DEFAULT_COLORS[0]);
  document.documentElement.style.setProperty('--hoverPriceColor', colors[1] || DEFAULT_COLORS[1]);
  document.documentElement.style.setProperty('--priceBgColor', colors[2] || DEFAULT_COLORS[2]);
}

function createSettingsButton() {
  if (document.querySelector('#ggdeals_settings_btn')) return;

  const button = document.createElement('span');
  button.id = 'ggdeals_settings_btn';
  button.addEventListener('click', toggleSettingsPanel);

  const loginLink = document.querySelector<HTMLAnchorElement>(
    'a.global_action_link[href*="https://store.steampowered.com/login/"]'
  );
  if (loginLink) {
    loginLink.before(button);
  } else if (document.getElementById('header_notification_area')) {
    document.getElementById('header_notification_area')!.before(button);
  } else {
    const envelope = document.getElementById('green_envelope_menu_root');
    if (envelope?.parentNode?.parentNode) {
      (envelope.parentNode.parentNode as HTMLElement).before(button);
    }
  }

  if (getFromStorage<string | null>(STORAGE_KEYS.token, null) == null) {
    document.documentElement.style.setProperty('--settingAlertBg', 'red');
    return;
  }

  // Check for updates
  GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://raw.githubusercontent.com/Juzlus/GG.deals-on-Steam/refs/heads/server/versions.json',
    onload(response) {
      if (response.status !== 200) return;
      try {
        const data = JSON.parse(response.responseText);
        const latestVersion = data?.version_userscript ?? data?.version_chromium;
        if (latestVersion) {
          setToStorage(STORAGE_KEYS.latestVersion, latestVersion);
          if (latestVersion !== __APP_VERSION__) {
            document.documentElement.style.setProperty('--settingAlertBg', 'orange');
          }
        }
      } catch {}
    },
  });
}

function mountSettingsPanel() {
  const container = document.createElement('div');
  container.id = 'ggdeals-settings-root';
  document.body.appendChild(container);
  render(<SettingsPanel />, container);
}

function detectPageAndInit() {
  const href = location.href;

  if (href.match(/store\.steampowered\.com\/app\//)) {
    initApp();
  } else if (href.match(/store\.steampowered\.com\/bundle\//)) {
    initBundle();
  } else if (href.match(/store\.steampowered\.com\/cart/)) {
    initCart();
  } else if (href.match(/store\.steampowered\.com\/recommended\/morelike\//)) {
    initRecommended();
  } else if (href.match(/store\.steampowered\.com\/search\//)) {
    initSearch();
  } else if (href.match(/store\.steampowered\.com\/wishlist\//)) {
    initWishlist();
  }
}

function main() {
  injectStyles();
  mountSettingsPanel();

  waitForElm('#global_header').then((el) => {
    if (!el) return;
    createSettingsButton();
    updateColors();
  });

  detectPageAndInit();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
