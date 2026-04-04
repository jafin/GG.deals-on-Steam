import { render } from 'preact';
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
  const colors = getFromStorage('colors', ['#BEEE11', '#a6cc1b', '#344654']);
  document.documentElement.style.setProperty('--priceColor', colors[0] || '#BEEE11');
  document.documentElement.style.setProperty('--hoverPriceColor', colors[1] || '#a6cc1b');
  document.documentElement.style.setProperty('--priceBgColor', colors[2] || '#344654');
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

  if (getFromStorage<string | null>('token', null) == null) {
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
          setToStorage('latestVersion', latestVersion);
          const currentVersion = '1.0.0';
          if (latestVersion !== currentVersion) {
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

  waitForElm('#global_header').then(() => {
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
