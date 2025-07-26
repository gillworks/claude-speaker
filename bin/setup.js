#!/usr/bin/env node

const inquirer = require('inquirer');
const { ElevenLabsClient } = require('../src/lib/elevenlabs');
const { updateConfig, getConfig, CONFIG_DIR } = require('../src/lib/config');
const path = require('path');

async function setup() {
  console.log('🎙️  Claude Speaker Setup\n');
  
  const currentConfig = getConfig();
  
  const { elevenLabsKey, claudeKey } = await inquirer.prompt([
    {
      type: 'password',
      name: 'elevenLabsKey',
      message: 'Enter your ElevenLabs API key:',
      default: currentConfig.elevenLabsApiKey,
      validate: (input) => input.length > 0 || 'API key is required'
    },
    {
      type: 'password',
      name: 'claudeKey',
      message: 'Enter your Claude API key (optional, for natural speech formatting):',
      default: currentConfig.claudeApiKey || process.env.ANTHROPIC_API_KEY || ''
    }
  ]);

  console.log('\nFetching available voices...');
  
  try {
    const client = new ElevenLabsClient(elevenLabsKey);
    const voices = await client.getVoices();
    
    const voiceChoices = voices.map(voice => ({
      name: `${voice.name} (${voice.labels?.accent || 'No accent info'}, ${voice.labels?.gender || 'No gender info'})`,
      value: voice.voice_id,
      short: voice.name
    }));

    const { voiceId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'voiceId',
        message: 'Select a voice:',
        choices: voiceChoices,
        default: currentConfig.voiceId
      }
    ]);

    const selectedVoice = voices.find(v => v.voice_id === voiceId);

    const { advancedSettings } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'advancedSettings',
        message: 'Configure advanced voice settings?',
        default: false
      }
    ]);

    let voiceSettings = currentConfig.voiceSettings;

    if (advancedSettings) {
      voiceSettings = await inquirer.prompt([
        {
          type: 'number',
          name: 'stability',
          message: 'Stability (0-1, higher = more consistent):',
          default: voiceSettings.stability,
          validate: (input) => input >= 0 && input <= 1 || 'Must be between 0 and 1'
        },
        {
          type: 'number',
          name: 'similarityBoost',
          message: 'Similarity Boost (0-1, higher = more like original voice):',
          default: voiceSettings.similarityBoost,
          validate: (input) => input >= 0 && input <= 1 || 'Must be between 0 and 1'
        },
        {
          type: 'number',
          name: 'style',
          message: 'Style (0-1, higher = more expressive):',
          default: voiceSettings.style,
          validate: (input) => input >= 0 && input <= 1 || 'Must be between 0 and 1'
        }
      ]);
      voiceSettings.useSpeakerBoost = true;
    }

    updateConfig({
      elevenLabsApiKey: elevenLabsKey,
      claudeApiKey: claudeKey,
      voiceId: voiceId,
      voiceName: selectedVoice.name,
      voiceSettings
    });

    console.log('\n✅ Configuration saved!');
    console.log(`\n📁 Config location: ${CONFIG_DIR}`);
    
    console.log('\n📝 To use Claude Speaker, add this to your Claude Code hooks configuration:');
    console.log('\nIn your Claude Code settings JSON file, add:');
    console.log(`
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${path.resolve(__dirname, '..', 'src', 'hooks', 'plan-detector.js')}"
          }
        ]
      }
    ]
  }
}
`);

    console.log('\n🎯 Quick Commands:');
    console.log('  • Enable speaker: Create ~/.claude/commands/speaker-enable.md with:');
    console.log('    !npx claude-speaker enable');
    console.log('  • Disable speaker: Create ~/.claude/commands/speaker-disable.md with:');
    console.log('    !npx claude-speaker disable');
    console.log('  • Then use: /speaker-enable or /speaker-disable in Claude Code');
    
    console.log('\n🚀 You\'re all set! Claude will now read plans aloud when in plan mode.');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setup();
