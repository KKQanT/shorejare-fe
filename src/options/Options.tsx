import { useState, useEffect } from 'react';
import './Options.css';
import { loadConfig, saveConfig } from '../utils/chromeStorage';

//setting template. Might use it when developing wallet feature

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
  const [apiBaseUrl, setApiBaseUrl] = useState('http://localhost:3001');
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    // Load settings when component mounts
    chrome.storage.sync.get(['settings'], (result) => {
      if (result.settings) {
        setSettings(result.settings);
      }
    });
    
    // Load API config
    const fetchConfig = async () => {
      try {
        const config = await loadConfig();
        setApiBaseUrl(config.apiBaseUrl);
      } catch (error) {
        console.error('Failed to load API config:', error);
      }
    };
    
    fetchConfig();
  }, []);

  const handleSave = async () => {
    chrome.storage.sync.set({ settings }, () => {
      console.log('Settings saved');
    });
    
    try {
      await saveConfig({ apiBaseUrl });
      
      setSaveStatus('Options saved.');
      setTimeout(() => {
        setSaveStatus('');
      }, 2000);
    } catch (error) {
      console.error('Failed to save API config:', error);
      setSaveStatus('Error saving options.');
      setTimeout(() => {
        setSaveStatus('');
      }, 2000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleApiUrlReset = () => {
    setApiBaseUrl('http://localhost:3001');
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
      
      <div className="option-row">
        <label>
          API Base URL:
          <input
            type="url"
            name="apiBaseUrl"
            value={apiBaseUrl}
            onChange={(e) => setApiBaseUrl(e.target.value)}
            placeholder="https://api.example.com"
          />
        </label>
        <button 
          onClick={handleApiUrlReset}
          className="reset-button"
        >
          Reset
        </button>
        <p className="option-description">
          The base URL for the ShareJore AI API server
        </p>
      </div>
      
      <div className="actions">
        <button onClick={handleSave}>Save</button>
        <span id="status">{saveStatus}</span>
      </div>
    </div>
  );
}

export default Options; 