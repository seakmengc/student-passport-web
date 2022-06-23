// ** React Imports
import { createContext, useState, useEffect } from 'react';

// ** ThemeConfig Import
import themeConfig from 'src/configs/themeConfig';

const initialSettings = {
  themeColor: 'primary',
  mode: themeConfig.mode,
  contentWidth: themeConfig.contentWidth,
};

// ** Create Context
export const SettingsContext = createContext({
  saveSettings: () => null,
  settings: initialSettings,
});

export const SettingsProvider = ({ children }) => {
  // ** State
  const [settings, setSettings] = useState({ ...initialSettings });

  useEffect(() => {
    const curr = localStorage.getItem('settings');
    if (!curr) {
      return;
    }

    saveSettings(JSON.parse(curr));
  }, []);

  const saveSettings = (updatedSettings) => {
    setSettings(updatedSettings);

    localStorage.setItem('settings', JSON.stringify(updatedSettings));
  };

  return (
    <SettingsContext.Provider value={{ settings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const SettingsConsumer = SettingsContext.Consumer;
