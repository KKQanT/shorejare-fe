import { useState, useEffect } from 'react';
import './Options.css';

interface SettingsType {
  enabled: boolean;
  theme: 'light' | 'dark';
  apiKey?: string;
}

function Options() {
  const [settings, setSettings] = useState<SettingsType>({
    enabled: true,
    theme: 'light',
    apiKey: '',
  });

  useEffect(() => {
    // Load settings when component mounts
    chrome.storage.sync.get(['settings'], (result) => {
      if (result.settings) {
        setSettings(result.settings);
      }
    });
  }, []);

  const handleSave = () => {
    // Save settings
    chrome.storage.sync.set({ settings }, () => {
      console.log('Settings saved');
      
      // Show saved message
      const status = document.getElementById('status');
      if (status) {
        status.textContent = 'Options saved.';
        setTimeout(() => {
          status.textContent = '';
        }, 2000);
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="options-container">
      <h1>ShareJore AI Options</h1>
      
      <div className="option-row">
        <label>
          <input
            type="checkbox"
            name="enabled"
            checked={settings.enabled}
            onChange={handleInputChange}
          />
          Enable extension
        </label>
      </div>
      
      <div className="option-row">
        <label>
          Theme:
          <select
            name="theme"
            value={settings.theme}
            onChange={(e) => setSettings({...settings, theme: e.target.value as 'light' | 'dark'})}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>
      
      <div className="option-row">
        <label>
          API Key (optional):
          <input
            type="text"
            name="apiKey"
            value={settings.apiKey || ''}
            onChange={handleInputChange}
            placeholder="Enter your API key"
          />
        </label>
      </div>
      
      <div className="actions">
        <button onClick={handleSave}>Save</button>
        <span id="status"></span>
      </div>
    </div>
  );
}

export default Options; 