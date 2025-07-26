const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const os = require('os');

class ElevenLabsClient {
  constructor(apiKey) {
    if (!apiKey || typeof apiKey !== 'string') {
      throw new Error('ElevenLabs API key is required and must be a string');
    }
    
    this.apiKey = apiKey.trim();
    this.baseUrl = 'https://api.elevenlabs.io/v1';
  }

  async getVoices() {
    const response = await fetch(`${this.baseUrl}/voices`, {
      headers: {
        'xi-api-key': this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch voices: ${response.statusText}`);
    }

    const data = await response.json();
    return data.voices;
  }

  async textToSpeech(text, voiceId, options = {}) {
    if (!text || typeof text !== 'string') {
      throw new Error('Text is required and must be a string');
    }
    
    if (!voiceId || typeof voiceId !== 'string') {
      throw new Error('Voice ID is required and must be a string');
    }
    
    // Validate text length (ElevenLabs has a limit)
    if (text.length > 5000) {
      throw new Error('Text exceeds maximum length of 5000 characters');
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          model_id: options.modelId || 'eleven_multilingual_v2',
          voice_settings: {
            stability: options.stability || 0.75,
            similarity_boost: options.similarityBoost || 0.75,
            style: options.style || 0.5,
            use_speaker_boost: options.useSpeakerBoost !== false
          }
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Text-to-speech failed (${response.status}): ${error}`);
      }

      const audioBuffer = await response.arrayBuffer();
      return Buffer.from(audioBuffer);
    } catch (error) {
      if (error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to ElevenLabs API');
      }
      throw error;
    }
  }

  async saveAudio(audioBuffer, filename = null) {
    const tmpDir = path.join(os.tmpdir(), 'claude-speaker');
    await fs.promises.mkdir(tmpDir, { recursive: true });
    
    const audioPath = path.join(tmpDir, filename || `audio_${Date.now()}.mp3`);
    await fs.promises.writeFile(audioPath, audioBuffer);
    
    return audioPath;
  }
}

module.exports = { ElevenLabsClient };
