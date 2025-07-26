const fs = require('fs');
const path = require('path');
const os = require('os');

jest.mock('fs');
jest.mock('os');
jest.mock('path');

// Mock path.join to return predictable values
path.join = jest.fn((...args) => args.join('/'));

const { loadConfig, saveConfig } = require('../src/lib/config');

describe('Config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    os.homedir.mockReturnValue('/home/user');
  });

  describe('loadConfig', () => {
    test('should load existing config', () => {
      const mockConfig = {
        enabled: true,
        elevenLabsApiKey: 'test-key',
        voiceId: 'test-voice'
      };
      
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockConfig));
      
      const config = loadConfig();
      expect(config.enabled).toBe(true);
      expect(config.elevenLabsApiKey).toBe('test-key');
      expect(config.voiceId).toBe('test-voice');
    });

    test('should return default config if file does not exist', () => {
      fs.existsSync.mockReturnValue(false);
      fs.writeFileSync.mockImplementation(() => {});
      
      const config = loadConfig();
      expect(config).toHaveProperty('enabled', true); // Default is true
      expect(config).toHaveProperty('elevenLabsApiKey', '');
    });
  });

  describe('saveConfig', () => {
    test('should save config to file', () => {
      const config = {
        enabled: true,
        elevenLabsApiKey: 'new-key'
      };
      
      fs.existsSync.mockReturnValue(true);
      fs.writeFileSync.mockImplementation(() => {});
      
      saveConfig(config);
      
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('config.json'),
        JSON.stringify(config, null, 2)
      );
    });
  });
});