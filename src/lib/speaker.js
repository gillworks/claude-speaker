const player = require('play-sound')();
const { ElevenLabsClient } = require('./elevenlabs');
const { formatPlanForSpeech } = require('./plan-formatter');
const fs = require('fs');

async function speakPlan(planText, config) {
  try {
    // Validate input
    if (!planText || typeof planText !== 'string') {
      console.error('Claude Speaker: Invalid plan text provided');
      return;
    }
    
    if (!config || typeof config !== 'object') {
      console.error('Claude Speaker: Invalid configuration provided');
      return;
    }
    
    if (!config.elevenLabsApiKey || !config.voiceId) {
      console.error('Claude Speaker: ElevenLabs API key or voice ID not configured. Run claude-speaker setup to configure.');
      return;
    }

    let formattedText = formatPlanForSpeech(planText);
    
    // Check if formatted text is too long
    if (formattedText.length > 5000) {
      console.warn('Claude Speaker: Plan text is too long for TTS, truncating...');
      formattedText = formattedText.substring(0, 4900) + '... (truncated)';
    }
    
    const client = new ElevenLabsClient(config.elevenLabsApiKey);
    
    const audioBuffer = await client.textToSpeech(formattedText, config.voiceId, {
      modelId: config.modelId,
      ...config.voiceSettings
    });
    
    const audioPath = await client.saveAudio(audioBuffer);
    
    await playAudio(audioPath);
    
    // Clean up audio file after playback
    setTimeout(() => {
      fs.unlink(audioPath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error('Error cleaning up audio file:', err.message);
        }
      });
    }, 5000);
    
  } catch (error) {
    console.error('Claude Speaker error:', error.message);
    
    // Provide more specific error messages
    if (error.message.includes('API key')) {
      console.error('Please check your ElevenLabs API key configuration');
    } else if (error.message.includes('Network')) {
      console.error('Please check your internet connection');
    } else if (error.message.includes('Voice ID')) {
      console.error('Please run claude-speaker setup to select a valid voice');
    }
  }
}

function playAudio(audioPath) {
  return new Promise((resolve, reject) => {
    player.play(audioPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = { speakPlan };
