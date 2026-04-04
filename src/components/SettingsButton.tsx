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
      url: 'https://api.github.com/repos/jafin/GG.deals-on-Steam/releases/latest',
      onload(response) {
        if (response.status !== 200) return;
        try {
          const data = JSON.parse(response.responseText);
          const latest = data.tag_name?.replace(/^v/, '');
          if (latest && latest !== __APP_VERSION__) {
            setToStorage(STORAGE_KEYS.latestVersion, latest);
            alertStatus.value = 'update';
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
