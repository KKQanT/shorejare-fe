/**
 * Utility functions for working with Chrome storage
 */

// Default configuration
const DEFAULT_CONFIG = {
  apiBaseUrl: 'http://localhost:3001',
};

export type StorageConfig = typeof DEFAULT_CONFIG;

/**
 * Save configuration to Chrome storage
 */
export async function saveConfig(config: Partial<StorageConfig>): Promise<void> {
  if (chrome?.storage?.sync) {
    return new Promise((resolve) => {
      chrome.storage.sync.set(config, () => {
        resolve();
      });
    });
  }
  // Fallback for development environment
  localStorage.setItem('sharejore_config', JSON.stringify({
    ...DEFAULT_CONFIG,
    ...config
  }));
  return Promise.resolve();
}

/**
 * Load configuration from Chrome storage
 */
export async function loadConfig(): Promise<StorageConfig> {
  if (chrome?.storage?.sync) {
    return new Promise((resolve) => {
      chrome.storage.sync.get(DEFAULT_CONFIG, (result) => {
        resolve(result as StorageConfig);
      });
    });
  }
  // Fallback for development environment
  const savedConfig = localStorage.getItem('sharejore_config');
  if (savedConfig) {
    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(savedConfig) };
    } catch (e) {
      return DEFAULT_CONFIG;
    }
  }
  return DEFAULT_CONFIG;
} 