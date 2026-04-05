import { signal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { fetchURL } from '../api';
import { STORAGE_KEYS } from '../constants';
import { getFromStorage, setToStorage } from '../storage';
import { toggleSettingsPanel } from './SettingsPanel';

type AlertStatus = 'none' | 'nokey' | 'update';
const alertStatus = signal<AlertStatus>('none');

const ALERT_COLORS: Record<AlertStatus, string> = {
  nokey: 'red',
  update: 'orange',
  none: 'transparent',
};

export function SettingsButton() {
  useEffect(() => {
    if (getFromStorage<string | null>(STORAGE_KEYS.token, null) == null) {
      alertStatus.value = 'nokey';
      return;
    }

    fetchURL('https://api.github.com/repos/jafin/GG.deals-on-Steam/releases/latest').then((result) => {
      if (!result.ok) return;
      try {
        const data: { tag_name?: string } = JSON.parse(result.body);
        const latest = data.tag_name?.replace(/^v/, '');
        if (latest && latest !== __APP_VERSION__) {
          setToStorage(STORAGE_KEYS.latestVersion, latest);
          alertStatus.value = 'update';
        }
      } catch {
        console.warn('[GG.deals on Steam] Failed to parse update check response');
      }
    });
  }, []);

  const alertColor = ALERT_COLORS[alertStatus.value];

  return (
    <span
      id="ggdeals_settings_btn"
      onClick={toggleSettingsPanel}
      style={`--settingAlertBg: ${alertColor}`}
    />
  );
}
