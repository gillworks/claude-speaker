const fs = require('fs');
const path = require('path');
const os = require('os');

const CONFIG_DIR = path.join(os.homedir(), '.claude-speaker');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

const DEFAULT_CONFIG = {
  enabled: true,
  elevenLabsApiKey: '',
  claudeApiKey: '',
  voiceId: '',
  voiceName: '',
  modelId: 'eleven_multilingual_v2',
  voiceSettings: {
    stability: 0.75,
    similarityBoost: 0.75,
    style: 0.5,
    useSpeakerBoost: true
  }
};

function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

function validateConfig(config) {
  const errors = [];
  
  if (config.elevenLabsApiKey && typeof config.elevenLabsApiKey !== 'string') {
    errors.push('elevenLabsApiKey must be a string');
  }
  
  if (config.voiceId && typeof config.voiceId !== 'string') {
    errors.push('voiceId must be a string');
  }
  
  if (config.enabled !== undefined && typeof config.enabled !== 'boolean') {
    errors.push('enabled must be a boolean');
  }
  
  if (config.voiceSettings) {
    const { stability, similarityBoost, style } = config.voiceSettings;
    if (stability !== undefined && (typeof stability !== 'number' || stability < 0 || stability > 1)) {
      errors.push('stability must be a number between 0 and 1');
    }
    if (similarityBoost !== undefined && (typeof similarityBoost !== 'number' || similarityBoost < 0 || similarityBoost > 1)) {
      errors.push('similarityBoost must be a number between 0 and 1');
    }
    if (style !== undefined && (typeof style !== 'number' || style < 0 || style > 1)) {
      errors.push('style must be a number between 0 and 1');
    }
  }
  
  return errors;
}

function getConfig() {
  ensureConfigDir();
  
  if (!fs.existsSync(CONFIG_FILE)) {
    saveConfig(DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  }
  
  try {
    const configData = fs.readFileSync(CONFIG_FILE, 'utf8');
    const parsedConfig = JSON.parse(configData);
    const validationErrors = validateConfig(parsedConfig);
    
    if (validationErrors.length > 0) {
      console.error('Config validation errors:', validationErrors.join(', '));
      return DEFAULT_CONFIG;
    }
    
    return { ...DEFAULT_CONFIG, ...parsedConfig };
  } catch (error) {
    console.error('Error reading config:', error.message);
    return DEFAULT_CONFIG;
  }
}

function saveConfig(config) {
  ensureConfigDir();
  
  const validationErrors = validateConfig(config);
  if (validationErrors.length > 0) {
    throw new Error(`Invalid config: ${validationErrors.join(', ')}`);
  }
  
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch (error) {
    throw new Error(`Failed to save config: ${error.message}`);
  }
}

function updateConfig(updates) {
  const currentConfig = getConfig();
  const newConfig = { ...currentConfig, ...updates };
  saveConfig(newConfig);
  return newConfig;
}

function setEnabled(enabled) {
  const config = getConfig();
  config.enabled = enabled;
  saveConfig(config);
  return config.enabled;
}

module.exports = {
  getConfig,
  loadConfig: getConfig, // Alias for compatibility
  saveConfig,
  updateConfig,
  setEnabled,
  validateConfig,
  CONFIG_DIR,
  CONFIG_FILE
};
