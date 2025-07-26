#!/usr/bin/env node

const { speakPlan } = require('../src/lib/speaker');
const { getConfig } = require('../src/lib/config');

const testPlan = `
Here is Claude's plan:

1. First, I'll set up the basic project structure
2. Then, I'll implement the main functionality
3. Next, I'll add error handling
4. Finally, I'll write tests and documentation

This plan includes:
- Creating necessary files
- Implementing core features
- Adding proper validation
`;

async function test() {
  console.log('🧪 Testing Claude Speaker...\n');

  const config = getConfig();
  console.log('Config loaded:', {
    enabled: config.enabled,
    hasApiKey: !!config.elevenLabsApiKey,
    hasVoiceId: !!config.voiceId,
    voiceName: config.voiceName
  });

  if (!config.enabled) {
    console.log(
      '\n❌ Claude Speaker is disabled. Run "claude-speaker toggle" to enable.'
    );
    return;
  }

  if (!config.elevenLabsApiKey || !config.voiceId) {
    console.log('\n❌ Not configured. Run \'claude-speaker setup\' first.');
    return;
  }

  console.log('\n🎙️  Speaking test plan...');

  try {
    await speakPlan(testPlan, config);
    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\nFull error:', error);
  }
}

test();
