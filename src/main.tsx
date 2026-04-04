import { render } from 'preact';
import { STORAGE_KEYS, DEFAULT_COLORS } from './constants';
import { injectStyles } from './styles';
import { getFromStorage, setToStorage } from './storage';
import { waitForElm } from './utils';
import { SettingsPanel, toggleSettingsPanel, applyColors } from './components/SettingsPanel';
import { initApp } from './pages/app';
import { initBundle } from './pages/bundle';
import { initCart } from './pages/cart';
import { initRecommended } from './pages/recommended';
import { initSearch } from './pages/search';
import { initWishlist } from './pages/wishlist';

function updateColors() {
  applyColors(getFromStorage(STORAGE_KEYS.colors, DEFAULT_COLORS));
}

function createSettingsButton() {
  if (document.querySelector('#ggdeals_settings_btn')) return;

  const button = document.createElement('span');
  button.id = 'ggdeals_settings_btn';
  button.addEventListener('click', toggleSettingsPanel);

  const loginLink = document.querySelector<HTMLAnchorElement>(
    'a.global_action_link[href*="https://store.steampowered.com/login/"]'
  );
  const notifArea = document.getElementById('header_notification_area');
  if (loginLink) {
    loginLink.before(button);
  } else if (notifArea) {
    notifArea.before(button);
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

  if (href.includes('/app/')) {
    initApp();
  } else if (href.includes('/bundle/')) {
    initBundle();
  } else if (href.includes('/cart')) {
    initCart();
  } else if (href.includes('/recommended/morelike/')) {
    initRecommended();
  } else if (href.includes('/search/')) {
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
