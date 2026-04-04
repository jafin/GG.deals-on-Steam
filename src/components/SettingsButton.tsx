import { signal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { STORAGE_KEYS } from '../constants';
import { getFromStorage, setToStorage } from '../storage';
import { toggleSettingsPanel } from './SettingsPanel';

type AlertStatus = 'none' | 'nokey' | 'update';
const alertStatus = signal<AlertStatus>('none');

export function SettingsButton() {
  useEffect(() => {
    if (getFromStorage<string | null>(STORAGE_KEYS.token, null) == null) {
      alertStatus.value = 'nokey';
      return;
    }

    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://raw.githubusercontent.com/jafin/GG.deals-on-Steam/refs/heads/server/versions.json',
      onload(response) {
        if (response.status !== 200) return;
        try {
          const data = JSON.parse(response.responseText);
          const latestVersion = data?.version_userscript ?? data?.version_chromium;
          if (latestVersion) {
            setToStorage(STORAGE_KEYS.latestVersion, latestVersion);
            if (latestVersion !== __APP_VERSION__) {
              alertStatus.value = 'update';
            }
          }
        } catch {}
      },
    });
  }, []);

  let alertColor: string;
  switch (alertStatus.value) {
    case 'nokey': alertColor = 'red'; break;
    case 'update': alertColor = 'orange'; break;
    default: alertColor = 'transparent';
  }

  return (
    <span
      id="ggdeals_settings_btn"
      onClick={toggleSettingsPanel}
      style={`--settingAlertBg: ${alertColor}`}
    />
  );
}
