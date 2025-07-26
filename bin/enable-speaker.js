#!/usr/bin/env node

const { setEnabled, getConfig } = require('../src/lib/config');

setEnabled(true);
const config = getConfig();

console.log('Claude Speaker is now ENABLED');

if (!config.elevenLabsApiKey || !config.voiceId) {
  console.log('\nWarning: ElevenLabs API key or voice not configured.');
  console.log('Run \'npx claude-speaker setup\' to configure.');
}
