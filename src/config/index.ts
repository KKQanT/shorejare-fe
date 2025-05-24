import { loadConfig, type StorageConfig } from '../utils/chromeStorage';

// Default configuration - used until we load from storage
const defaultConfig = {
  apiBaseUrl: 'http://localhost:3001',
};

export interface Config extends StorageConfig {}

//dynamic loading from storage
class ConfigManager {
  private _config: Config = defaultConfig;
  private _initialized = false;
  private _initPromise: Promise<void> | null = null;

  constructor() {
    this._initPromise = this._init();
  }

  private async _init(): Promise<void> {
    try {
      this._config = await loadConfig();
      this._initialized = true;
    } catch (error) {
      console.error('Failed to load config from storage:', error);
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this._initialized && this._initPromise) {
      await this._initPromise;
    }
  }

  async getConfig(): Promise<Config> {
    await this.ensureInitialized();
    return { ...this._config };
  }

  get apiBaseUrl(): string {
    return this._config.apiBaseUrl;
  }
}

const configManager = new ConfigManager();

export default configManager; 