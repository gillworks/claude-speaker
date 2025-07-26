# Claude Speaker

[![npm version](https://badge.fury.io/js/claude-speaker.svg)](https://www.npmjs.com/package/claude-speaker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Claude Code plugin that automatically reads plans aloud using ElevenLabs text-to-speech when Claude enters plan mode.

## Features

- 🎙️ Automatically detects when Claude creates a plan and reads it aloud
- 🗣️ Natural speech formatting - plans sound conversational, not robotic
- 🎚️ Configurable voices and speech settings via ElevenLabs
- 🔇 Easy enable/disable with slash commands
- ⚡ Simple setup process

## Installation

### Global Installation (Recommended)

```bash
npm install -g claude-speaker
```

### Local Installation

```bash
npm install claude-speaker
```

### Quick Setup

```bash
npx claude-speaker setup
```

## Setup

1. **Get an ElevenLabs API Key**

   - Sign up at [ElevenLabs](https://elevenlabs.io)
   - Go to your profile settings
   - Copy your API key

2. **Run Setup**

   ```bash
   claude-speaker setup
   # or if installed locally
   npx claude-speaker setup
   ```

   This will:

   - Ask for your ElevenLabs API key
   - Let you choose from available voices
   - Configure voice settings
   - Show you how to integrate with Claude Code

3. **Configure Claude Code Hooks**

   Claude Speaker uses the "Stop" hook to detect when Claude has finished generating a response. When Claude completes its response, the hook checks if the response contains a plan (text starting with "Here is Claude's plan:") and reads it aloud using your configured voice.

   Add the following to your Claude Code settings JSON file (typically `~/.claude/settings.json`):

   ```json
   {
     "hooks": {
       "Stop": [
         {
           "hooks": [
             {
               "type": "command",
               "command": "/path/to/claude-speaker/src/hooks/plan-detector.js"
             }
           ]
         }
       ]
     }
   }
   ```

   **Important**: Replace `/path/to/claude-speaker` with the actual path where the package is installed:

   - For global install: Use `$(npm root -g)/claude-speaker/src/hooks/plan-detector.js`
   - For local install: Use `$(npm root)/claude-speaker/src/hooks/plan-detector.js`

4. **Create Enable/Disable Commands (Optional)**

   Create `~/.claude/commands/speaker-enable.md`:

   ```
   Enable Claude Speaker

   !npx claude-speaker enable
   ```

   Create `~/.claude/commands/speaker-disable.md`:

   ```
   Disable Claude Speaker

   !npx claude-speaker disable
   ```

## Usage

Once configured, Claude Speaker will automatically:

1. Detect when Claude generates a plan (when you see "Here is Claude's plan:")
2. Reformat the plan for natural speech
3. Send it to ElevenLabs for text-to-speech
4. Play the audio

### Commands

- `/speaker-enable` - Enable Claude Speaker (if you created the command)
- `/speaker-disable` - Disable Claude Speaker (if you created the command)
- `npx claude-speaker enable` - Enable from terminal
- `npx claude-speaker disable` - Disable from terminal
- `npx claude-speaker setup` - Reconfigure settings

## Configuration

Configuration is stored in `~/.claude-speaker/config.json`:

```json
{
  "enabled": true,
  "elevenLabsApiKey": "your-api-key",
  "voiceId": "selected-voice-id",
  "voiceName": "Selected Voice",
  "modelId": "eleven_multilingual_v2",
  "voiceSettings": {
    "stability": 0.75,
    "similarityBoost": 0.75,
    "style": 0.5,
    "useSpeakerBoost": true
  }
}
```

## How It Works

1. **Plan Detection**: A hook monitors Claude's output for plan generation
2. **Natural Formatting**: Plans are reformatted to sound conversational:
   - Technical terms → Natural speech
   - Bullet points → Flowing sentences
   - Code references → Readable descriptions
3. **Text-to-Speech**: ElevenLabs converts the formatted text to audio
4. **Playback**: Audio is played automatically and cleaned up

## Troubleshooting

- **No audio?** Check if Claude Speaker is enabled: `npx claude-speaker enable`
- **API errors?** Verify your ElevenLabs API key: `npx claude-speaker setup`
- **Hook not working?** Ensure the hook path in Claude Code settings is absolute
- **Installation issues?** Try installing globally with `npm install -g claude-speaker`

## Uninstallation

### Remove the npm package

For global installation:

```bash
npm uninstall -g claude-speaker
```

For local installation:

```bash
npm uninstall claude-speaker
```

### Clean up configuration

1. Remove the configuration directory:

   ```bash
   rm -rf ~/.claude-speaker
   ```

2. Remove the hook from your Claude Code settings JSON file (typically `~/.claude/settings.json`)

3. Remove the command files (if you created them):
   ```bash
   rm ~/.claude/commands/speaker-enable.md
   rm ~/.claude/commands/speaker-disable.md
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for [Claude Code](https://www.anthropic.com/claude-code) by Anthropic
- Powered by [ElevenLabs](https://elevenlabs.io) text-to-speech API
