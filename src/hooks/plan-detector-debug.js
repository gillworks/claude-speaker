#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { speakPlan } = require('../lib/speaker');
const { getConfig } = require('../lib/config');

// Debug log file
const debugLog = path.join(require('os').homedir(), '.claude-speaker', 'debug.log');

function log(message, data = null) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}${data ? '\n' + JSON.stringify(data, null, 2) : ''}\n\n`;
  
  fs.mkdirSync(path.dirname(debugLog), { recursive: true });
  fs.appendFileSync(debugLog, logEntry);
}

async function main() {
  try {
    log('Hook triggered');
    
    const config = getConfig();
    log('Config loaded', { enabled: config.enabled, hasApiKey: !!config.elevenLabsApiKey });
    
    if (!config.enabled) {
      log('Speaker disabled, exiting');
      process.exit(0);
    }

    // Read stdin
    let input = '';
    try {
      input = fs.readFileSync(0, 'utf8');
      log('Raw input received', { length: input.length, preview: input.slice(0, 500) });
    } catch (err) {
      log('Error reading stdin', err.message);
      process.exit(0);
    }

    // Parse JSON
    let data;
    try {
      data = JSON.parse(input);
      log('JSON parsed successfully', { 
        hasOutput: !!data.output,
        outputType: typeof data.output,
        outputLength: data.output ? data.output.length : 0
      });
    } catch (err) {
      log('JSON parse error', { error: err.message, input: input.slice(0, 200) });
      process.exit(0);
    }

    // Check for plan in output
    if (data.output && typeof data.output === 'string') {
      log('Checking for plan pattern in output');
      
      // Try multiple patterns
      const patterns = [
        /Here is Claude's plan:([\s\S]*?)(?=\n\n(?:Let me|I'll|Now|Starting)|$)/,
        /Here is my plan:([\s\S]*?)(?=\n\n(?:Let me|I'll|Now|Starting)|$)/,
        /Here's the plan:([\s\S]*?)(?=\n\n(?:Let me|I'll|Now|Starting)|$)/,
        /Plan:([\s\S]*?)(?=\n\n(?:Let me|I'll|Now|Starting)|$)/
      ];
      
      let planText = null;
      for (const pattern of patterns) {
        const match = data.output.match(pattern);
        if (match && match[1]) {
          planText = match[1].trim();
          log('Plan found with pattern', { pattern: pattern.toString(), planLength: planText.length });
          break;
        }
      }
      
      if (!planText) {
        log('No plan pattern matched', { outputPreview: data.output.slice(0, 1000) });
      } else if (planText) {
        log('Speaking plan', { planPreview: planText.slice(0, 200) });
        await speakPlan(planText, config);
        log('Plan spoken successfully');
      }
    } else {
      log('No output field or not a string', { dataKeys: Object.keys(data) });
    }

    process.exit(0);
  } catch (error) {
    log('Unhandled error', { message: error.message, stack: error.stack });
    process.exit(0);
  }
}

main();
